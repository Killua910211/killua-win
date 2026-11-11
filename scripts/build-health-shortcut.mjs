#!/usr/bin/env node
/**
 * 生成可直接导入的 iPhone 快捷指令「Health 同步」与「Health 回填」。
 *
 * 结构与 docs/health-sync.md 里手动搭建的步骤一一对应：七个「查找健康样本」（开始日期在
 * 最近 N 天内）→ 「获取 URL 内容」把 N 和各属性逐行发给 /api/health/sync → 显示返回的 summary。
 * 令牌从仓库根目录的 .health-sync-token 读入并写进请求头；生成物在 outputs/（已忽略），
 * 含令牌，不要提交或外传。
 *
 * 文件格式的依据：
 *   - WorkflowKit Gallery.bundle 里的 .wflow（macOS 自带）：筛选模板、ActionOutput 引用、
 *     WFTextTokenString、获取字典值、显示结果的写法；
 *   - ActionKit Localizable.loctable（macOS 自带）：WFHKSampleFilteringGroupBy / FillMissing、
 *     「开始日期 / 结束日期 / 值」属性名、ISO 8601 与 WFISO8601IncludeTime；
 *   - 健康类型名：ActionKit 二进制里「查找健康样本」类型选单的标签表（dyld 共享缓存中
 *     Steps|Active Calories|…|Heart Rate Variability|…|Oxygen Saturation 那一段）。
 *     不是 HealthKit 的显示名：活动能量是 Active Calories，血氧是 Oxygen Saturation；
 *     睡眠取真实 iOS 导出里观察到的 Sleep；
 *   - 「类型」行的结构：枚举值必须包成 WFStringSubstitutableState，且带 Bounded。
 *     写成纯字符串时，iOS 编辑器一点类型就闪退、运行时报「未找到样本」（2026-11-11 实测）。
 *     依据 viticci/shortcuts-playground-plugin 的 HEALTHKIT.md（真实 iOS 导出）与
 *     frontboat/shortcutkit 的 shortcut-file-format.md；
 *   - 日期行用运算符 1001（在最近 N 天内）+ Number + Unit 16（天），同见 shortcutkit。
 *     第一版用「调整日期」算起点，Unit 写成 'days' 没有生效、起点停在当天（2026-11-11 实测报
 *     「起点必须早于今天」），所以不再依赖「调整日期」，窗口改由 days 字段告诉网站。
 *
 * 只能在 macOS 上运行：签名用系统的 `shortcuts sign`，导入后经 iCloud 同步到 iPhone。
 *
 *   node scripts/build-health-shortcut.mjs
 *
 * 步数、活动能量、距离、锻炼分钟数逐条读取（开始、结束、值、来源、单位），由网站按时间重叠去重。
 * 走过的弯路（2026-11-11）：按天分组会把 iPhone 与手表相加（11-08 为 28,200，「健康」App 为 15,327）；
 * 加「来源 不是 iPhone」后步数纹丝不动，锻炼时间却从秒变成了分钟，说明条件生效了却没排除掉任何样本，
 * 用户的步数来源里还有两块同名的 Apple Watch，按名称筛选靠不住；逐条读 7 天在真机上数据量过大、运行失败。
 * 所以每日只读 3 天，网站按时间去重，不依赖来源名称。
 */

import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'outputs', 'health-shortcut');
const ENDPOINT = 'https://www.killua.win/api/health/sync';
const OBJECT_REPLACEMENT = '￼';

const token = readFileSync(join(ROOT, '.health-sync-token'), 'utf8').trim();

/**
 * 版本号＝生成时刻（北京时间），写进文件名、导入后的快捷指令名和运行结果第一行，
 * 用户在 iCloud 云盘和快捷指令列表里一眼能分清新旧（2026-11-11 用户导入后误跑了旧版）。
 */
const VERSION = (() => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Shanghai',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );
  return `v${parts.month}${parts.day}-${parts.hour}${parts.minute}`;
})();
if (token.length < 32) {
  console.error('✗ .health-sync-token 不存在或太短；先按 docs/health-sync.md「更换令牌」生成。');
  process.exit(1);
}

// ------------------------------------------------------------------ plist

function escapeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toPlist(value, indent = '') {
  const next = `${indent}\t`;
  if (value === true) return `${indent}<true/>`;
  if (value === false) return `${indent}<false/>`;
  if (typeof value === 'number') {
    return Number.isInteger(value) ? `${indent}<integer>${value}</integer>` : `${indent}<real>${value}</real>`;
  }
  if (typeof value === 'string') return `${indent}<string>${escapeXml(value)}</string>`;
  if (Array.isArray(value)) {
    if (value.length === 0) return `${indent}<array/>`;
    return [`${indent}<array>`, ...value.map((item) => toPlist(item, next)), `${indent}</array>`].join('\n');
  }
  const entries = Object.entries(value);
  if (entries.length === 0) return `${indent}<dict/>`;
  return [
    `${indent}<dict>`,
    ...entries.flatMap(([key, item]) => [`${next}<key>${escapeXml(key)}</key>`, toPlist(item, next)]),
    `${indent}</dict>`,
  ].join('\n');
}

// ------------------------------------------------------------------ 构件

const uuid = () => randomUUID().toUpperCase();

function output(action, name, aggrandizements) {
  return {
    OutputUUID: action.WFWorkflowActionParameters.UUID,
    Type: 'ActionOutput',
    OutputName: name,
    ...(aggrandizements ? { Aggrandizements: aggrandizements } : {}),
  };
}

function tokenString(text, attachment) {
  return {
    Value: attachment
      ? { string: OBJECT_REPLACEMENT, attachmentsByRange: { '{0, 1}': attachment } }
      : { string: text },
    WFSerializationType: 'WFTextTokenString',
  };
}

function tokenAttachment(attachment) {
  return { Value: attachment, WFSerializationType: 'WFTextTokenAttachment' };
}

function textField(key, value) {
  return {
    WFItemType: 0,
    WFKey: tokenString(key),
    WFValue: typeof value === 'string' ? tokenString(value) : tokenString('', value),
  };
}

function dictionaryField(items) {
  return { Value: { WFDictionaryFieldValueItems: items }, WFSerializationType: 'WFDictionaryFieldValue' };
}

const ISO_TIME = { Type: 'WFDateFormatVariableAggrandizement', WFDateFormatStyle: 'ISO 8601', WFISO8601IncludeTime: true };
const property = (name) => ({ Type: 'WFPropertyVariableAggrandizement', PropertyName: name });

function action(identifier, parameters) {
  return { WFWorkflowActionIdentifier: identifier, WFWorkflowActionParameters: { UUID: uuid(), ...parameters } };
}

/**
 * type 是「查找健康样本」类型选单的内部标签；字段前缀与 app/lib/health-sync.ts 的 payload 键一致。
 * raw：累计型指标不分组，逐条发开始、结束、值、来源和单位，由网站按时间重叠去重。
 */
const METRICS = [
  { type: 'Steps', name: '步数', prefix: 'steps', groupBy: 'None', raw: true },
  { type: 'Active Calories', name: '活动能量', prefix: 'energy', groupBy: 'None', raw: true },
  { type: 'Walking + Running Distance', name: '步行+跑步距离', prefix: 'distance', groupBy: 'None', raw: true },
  { type: 'Resting Heart Rate', name: '静息心率', prefix: 'resting_hr', groupBy: 'Day' },
  { type: 'Heart Rate Variability', name: '心率变异性', prefix: 'hrv', groupBy: 'Day' },
  { type: 'Oxygen Saturation', name: '血氧', prefix: 'spo2', groupBy: 'Day' },
  { type: 'Sleep', name: '睡眠', prefix: 'sleep', groupBy: 'None' },
];

/**
 * 健身圆环的锻炼与站立，单独成一个快捷指令，万一类型名不对只影响这一个。
 * 类型名都取 ActionKit 标签表：主同步里取自这张表的名字（Active Calories、
 * Oxygen Saturation 等）2026-11-11 真机全部生效；iOS 26 导出里见过的
 * Exercise Minutes 实测报「未找到样本」，改用表里的 Exercise Time。
 */
const FITNESS_METRICS = [
  { type: 'Exercise Time', name: '锻炼分钟数', prefix: 'exercise', groupBy: 'None', raw: true },
  { type: 'Stand Hour', name: '站立', prefix: 'stand', groupBy: 'None' },
];

function buildShortcut(label, days, metrics, note) {
  const actions = [];

  actions.push(
    action('is.workflow.actions.comment', {
      WFCommentActionText:
        `${label}：把最近 ${days} 天的 Apple Health 数据发到 killua.win 健康页。\n` +
        '由 killua-win 仓库 scripts/build-health-shortcut.mjs 生成；搭建说明与排错见 docs/health-sync.md。\n' +
        note,
    }),
  );

  const finds = metrics.map((metric) => {
    const find = action('is.workflow.actions.filter.health.quantity', {
      WFContentItemFilter: {
        Value: {
          WFActionParameterFilterPrefix: 1,
          WFContentPredicateBoundedDate: false,
          WFActionParameterFilterTemplates: [
            {
              Bounded: true,
              Operator: 4,
              Property: 'Type',
              Removable: false,
              Values: { Enumeration: { Value: metric.type, WFSerializationType: 'WFStringSubstitutableState' } },
            },
            {
              Bounded: true,
              Operator: 1001,
              Property: 'Start Date',
              Removable: false,
              Values: { Number: String(days), Unit: 16 },
            },
          ],
        },
        WFSerializationType: 'WFContentPredicateTableTemplate',
      },
      WFHKSampleFilteringGroupBy: metric.groupBy,
      WFHKSampleFilteringFillMissing: false,
      WFContentItemLimitEnabled: false,
      CustomOutputName: metric.name,
    });
    actions.push(find);
    return { metric, find };
  });

  const fields = [textField('days', String(days))];
  for (const { metric, find } of finds) {
    if (metric.raw) {
      fields.push(textField(`${metric.prefix}_start`, output(find, metric.name, [property('Start Date'), ISO_TIME])));
      fields.push(textField(`${metric.prefix}_end`, output(find, metric.name, [property('End Date'), ISO_TIME])));
      fields.push(textField(`${metric.prefix}_value`, output(find, metric.name, [property('Value')])));
      fields.push(textField(`${metric.prefix}_source`, output(find, metric.name, [property('Source')])));
      fields.push(textField(`${metric.prefix}_unit`, output(find, metric.name, [property('Unit')])));
    } else if (metric.prefix === 'sleep') {
      fields.push(textField('sleep_start', output(find, metric.name, [property('Start Date'), ISO_TIME])));
      fields.push(textField('sleep_end', output(find, metric.name, [property('End Date'), ISO_TIME])));
      fields.push(textField('sleep_value', output(find, metric.name, [property('Value')])));
    } else if (metric.prefix === 'stand') {
      fields.push(textField('stand_date', output(find, metric.name, [property('Start Date'), ISO_TIME])));
      fields.push(textField('stand_value', output(find, metric.name, [property('Value')])));
    } else {
      fields.push(textField(`${metric.prefix}_date`, output(find, metric.name, [property('Start Date'), ISO_TIME])));
      fields.push(textField(`${metric.prefix}_value`, output(find, metric.name, [property('Value')])));
    }
  }

  const request = action('is.workflow.actions.downloadurl', {
    WFURL: tokenString(ENDPOINT),
    WFHTTPMethod: 'POST',
    ShowHeaders: true,
    WFHTTPHeaders: dictionaryField([textField('Authorization', `Bearer ${token}`)]),
    WFHTTPBodyType: 'JSON',
    WFJSONValues: dictionaryField(fields),
  });
  actions.push(request);

  const summary = action('is.workflow.actions.getvalueforkey', {
    WFInput: tokenAttachment(output(request, 'Contents of URL')),
    WFDictionaryKey: 'summary',
  });
  actions.push(summary);

  // 结果第一行是快捷指令名（含版本号），第二行起是网站返回的摘要。
  const heading = `${label}\n`;
  actions.push(
    action('is.workflow.actions.showresult', {
      Text: {
        Value: {
          string: `${heading}${OBJECT_REPLACEMENT}`,
          attachmentsByRange: { [`{${heading.length}, 1}`]: output(summary, 'Dictionary Value') },
        },
        WFSerializationType: 'WFTextTokenString',
      },
    }),
  );

  return {
    WFWorkflowMinimumClientVersionString: '900',
    WFWorkflowMinimumClientVersion: 900,
    WFWorkflowClientVersion: '900',
    WFWorkflowIcon: { WFWorkflowIconStartColor: 4282601983, WFWorkflowIconGlyphNumber: 59845 },
    WFWorkflowTypes: [],
    WFWorkflowInputContentItemClasses: [],
    WFWorkflowOutputContentItemClasses: [],
    WFWorkflowHasOutputFallback: false,
    WFWorkflowHasShortcutInputVariables: false,
    WFWorkflowImportQuestions: [],
    WFQuickActionSurfaces: [],
    WFWorkflowActions: actions,
  };
}

// ------------------------------------------------------------------ 输出

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const CORE_NOTE =
  '步数、活动能量、距离逐条带来源发送，网站按时间重叠去重；静息心率、HRV、血氧按天分组；' +
  '睡眠不分组（网站要每段起止时间来合并重叠、排除卧床与清醒）。';
const BACKFILL_NOTE =
  '一次性回填最近 60 天的静息心率、HRV、血氧与睡眠，用来和 10 月快照核对口径。';
const STEPS_BACKFILL_NOTE =
  '可选、一次性：逐条读最近 9 天的步数、活动能量、距离，把 7 日均值窗口一次补成去重后的数。数据量较大，失败也不影响每日同步。';
const FITNESS_NOTE = '健身圆环的锻炼分钟数（逐条带来源和单位，网站去重）与站立（每小时一条，网站数「已站立」的小时）。';

/**
 * 每日同步只读最近 3 天（写入昨天和今天）：逐条读 7 天在真机上数据量过大而失败。
 * 自动化每天跑，昨天总会在今天被写成完整日；连续漏跑一天以上，那天的累计型指标会缺。
 */
const targets = [
  { name: 'Health 同步', days: 3, metrics: METRICS, note: CORE_NOTE },
  { name: 'Health 回填', days: 60, metrics: METRICS.filter((metric) => !metric.raw), note: BACKFILL_NOTE },
  { name: 'Health 步数回填', days: 9, metrics: METRICS.filter((metric) => metric.raw), note: STEPS_BACKFILL_NOTE },
  { name: 'Health 锻炼', days: 3, metrics: FITNESS_METRICS, note: FITNESS_NOTE },
];

for (const target of targets) {
  const label = `${target.name} ${VERSION}`;
  const unsigned = join(OUT_DIR, `${label}.unsigned.shortcut`);
  const signed = join(OUT_DIR, `${label}.shortcut`);
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
    '<plist version="1.0">\n' +
    toPlist(buildShortcut(label, target.days, target.metrics, target.note)) +
    '\n</plist>\n';
  writeFileSync(unsigned, xml);
  execFileSync('plutil', ['-lint', unsigned], { stdio: 'pipe' });
  execFileSync('plutil', ['-convert', 'binary1', unsigned], { stdio: 'pipe' });
  execFileSync('shortcuts', ['sign', '--mode', 'people-who-know-me', '--input', unsigned, '--output', signed], {
    stdio: 'pipe',
  });
  rmSync(unsigned);
  console.log(`✓ ${signed}`);
}
