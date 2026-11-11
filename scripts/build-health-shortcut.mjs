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
 * 走过的弯路（2026-11-11）：按天分组会把 iPhone 与手表相加（11-08 为 28,200，「健康」App 为 15,327）。
 * 按来源名称筛选不可靠：用户的步数来源里有两块同名的 Apple Watch。逐条读 7 天的那一版在真机上失败。
 * 注意：同名覆盖 iCloud 云盘里的 .shortcut 文件不可靠，旧文件会被回传，用户导入的一直是 12:21 的按天
 * 分组版；所以「来源 不是 iPhone」那一版其实从未在真机运行过，当时「条件生效却没排除」的判断不成立。
 * 现在文件名带版本号，每次都是新文件。每日只读 3 天，网站按时间去重，不依赖来源名称。
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
  if (value instanceof Date) return `${indent}<date>${value.toISOString().replace(/\.\d{3}Z$/, 'Z')}</date>`;
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
  // 静息心率不分组：某天有两条（两块同名手表各记一条）时，按天分组会相加（09-29 得 122），
  // 逐条发、由网站按天取平均。每天只有一两条，数据量很小。
  { type: 'Resting Heart Rate', name: '静息心率', prefix: 'resting_hr', groupBy: 'None' },
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

function dateRow(window) {
  if (window.days) {
    return { Bounded: true, Operator: 1001, Property: 'Start Date', Removable: false, Values: { Number: String(window.days), Unit: 16 } };
  }
  // 分段回填：开始日期介于两个固定时刻之间（运算符 1003，Date 与 AnotherDate）。
  return { Bounded: true, Operator: 1003, Property: 'Start Date', Removable: false, Values: { Date: window.from, AnotherDate: window.to } };
}

/** 一段：一组「查找健康样本」加一次「获取 URL 内容」，返回摘要所在的「获取字典值」动作。 */
function buildSegment(actions, segment) {
  const finds = segment.metrics.map((metric) => {
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
            dateRow(segment),
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

  const fields = segment.days
    ? [textField('days', String(segment.days))]
    : [textField('since', segment.since), textField('until', segment.until)];
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
  return summary;
}

/**
 * segments 依次发送；每段独立成一次请求，前面的段先写进网站，后面的段失败不影响前面。
 * 结果第一行是快捷指令名（含版本号），之后每段一个摘要。
 */
function buildShortcut(label, segments, note) {
  const actions = [];
  actions.push(
    action('is.workflow.actions.comment', {
      WFCommentActionText:
        `${label}：把 Apple Health 数据发到 killua.win 健康页。\n` +
        '由 killua-win 仓库 scripts/build-health-shortcut.mjs 生成；搭建说明与排错见 docs/health-sync.md。\n' +
        note,
    }),
  );

  const summaries = segments.map((segment) => buildSegment(actions, segment));

  let text = `${label}`;
  const attachments = {};
  for (const summary of summaries) {
    text += '\n';
    attachments[`{${text.length}, 1}`] = output(summary, 'Dictionary Value');
    text += OBJECT_REPLACEMENT;
  }
  actions.push(
    action('is.workflow.actions.showresult', {
      Text: { Value: { string: text, attachmentsByRange: attachments }, WFSerializationType: 'WFTextTokenString' },
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
  '步数、活动能量、距离、静息心率逐条带来源发送，网站按时间重叠去重或按天取平均；HRV、血氧按天分组；' +
  '睡眠不分组（网站要每段起止时间来合并重叠、排除卧床与清醒）。';
const BACKFILL_NOTE =
  '一次性回填：第一段是最近 60 天的静息心率、HRV、血氧与睡眠；后两段各补 3 天的步数、活动能量、距离' +
  '（逐条读取一次超过约 3 天就会在手机上失败，所以分段）。后面的段失败不影响前面已写入的。';
const FITNESS_NOTE = '健身圆环的锻炼分钟数（逐条带来源和单位，网站去重）与站立（每小时一条，网站数「已站立」的小时）。';

/** 北京时间某天零点往后若干小时的时刻。 */
function beijing(date, hours = 0) {
  return new Date(Date.parse(`${date}T00:00:00+08:00`) + hours * 3_600_000);
}
function shiftDate(date, days) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}
const TODAY = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());

/**
 * 分段补步数：每段从 since 当天 22:00（北京时间）读到 until 当天 02:00，多读的边角让网站按
 * since / until 截掉，所以手机在日本时间（快一小时）或北京时间都能完整覆盖中间三天。
 * 两段写今天往前第 7～5 天和第 4～2 天；昨天和今天由每日同步写。
 */
const cumulative = METRICS.filter((metric) => metric.raw);
const stepSegment = (fromBack) => {
  const since = shiftDate(TODAY, -fromBack - 1);
  const until = shiftDate(TODAY, -fromBack + 3);
  return { metrics: cumulative, since, until, from: beijing(since, 22), to: beijing(until, 2) };
};

/**
 * 每日同步只读最近 3 天（写入昨天和今天）：逐条读 7 天、9 天在真机上数据量过大而失败。
 * 自动化每天跑，昨天总会在今天被写成完整日；连续漏跑一天以上，那天的累计型指标会缺。
 */
const targets = [
  { name: 'Health 同步', segments: [{ days: 3, metrics: METRICS }], note: CORE_NOTE },
  {
    name: 'Health 回填',
    segments: [{ days: 60, metrics: METRICS.filter((metric) => !metric.raw) }, stepSegment(7), stepSegment(4)],
    note: BACKFILL_NOTE,
  },
  { name: 'Health 锻炼', segments: [{ days: 3, metrics: FITNESS_METRICS }], note: FITNESS_NOTE },
];

for (const target of targets) {
  const label = `${target.name} ${VERSION}`;
  const unsigned = join(OUT_DIR, `${label}.unsigned.shortcut`);
  const signed = join(OUT_DIR, `${label}.shortcut`);
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
    '<plist version="1.0">\n' +
    toPlist(buildShortcut(label, target.segments, target.note)) +
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
