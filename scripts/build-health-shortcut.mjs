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
 *
 * raw：累计型指标不分组，逐条发开始、结束、数值和来源，由网站按来源优先级去重。
 * 「按天分组」会把 iPhone 和 Apple Watch 同时记的步数直接相加（2026-11-11 实测约为
 * 「健康」App 的两倍），网站已拒收累计型的分组格式。
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

function buildShortcut(days, metrics, note) {
  const actions = [];

  actions.push(
    action('is.workflow.actions.comment', {
      WFCommentActionText:
        `把最近 ${days} 天的 Apple Health 数据发到 killua.win 健康页。\n` +
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

  actions.push(
    action('is.workflow.actions.showresult', {
      Text: tokenString('', output(summary, 'Dictionary Value')),
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
  '步数、活动能量、距离逐条发送并带来源，网站按「健康」App 的来源优先级去重；静息心率、HRV、血氧按天分组；' +
  '睡眠不分组（网站要每段起止时间来合并重叠、排除卧床与清醒）。';
const BACKFILL_NOTE =
  '一次性回填：只含不需要去重的静息心率、HRV、血氧与睡眠；步数等原始样本一年的量太大，不在回填里。';
const FITNESS_NOTE = '健身圆环的锻炼分钟数（逐条带来源，网站去重）与站立（每小时一条，网站数「已站立」的小时）。';

/** 每日同步发最近 7 天：连续漏跑 5 天以内都能补齐，原始样本的量也可控。 */
const targets = [
  { name: 'Health 同步', days: 7, metrics: METRICS, note: CORE_NOTE },
  { name: 'Health 回填', days: 330, metrics: METRICS.filter((metric) => !metric.raw), note: BACKFILL_NOTE },
  { name: 'Health 锻炼', days: 7, metrics: FITNESS_METRICS, note: FITNESS_NOTE },
];

for (const target of targets) {
  const unsigned = join(OUT_DIR, `${target.name}.unsigned.shortcut`);
  const signed = join(OUT_DIR, `${target.name}.shortcut`);
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n' +
    '<plist version="1.0">\n' +
    toPlist(buildShortcut(target.days, target.metrics, target.note)) +
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
