import type { LedgerSource } from './content-ledger';
import { getCoreEntryLedger } from './content-ledger';
import { getArgumentMap } from './argument-maps';
import { getThoughtExperiment } from './thought-experiments';
import { comparisonsForNode } from './comparisons';
import { getConcept } from './concepts';
import { getStudyGuide } from './study-guides';
import { philosophyNodes } from './tree';

/**
 * 一个条目页上的全部来源登记。
 *
 * 为什么需要它：来源以前只有条目来源账（ledger）一处，研究层直接数
 * `ledger.sources.length`。后来论证地图、跨传统比较、思想实验和概念卡都可以
 * 自带来源，于是同一页出现了两套互不相通的来源：自由意志那一页正文点得到
 * 14 个角标，研究层却写「3 条来源，已核验 3」——这句话会被读成「本页引文都
 * 已核验」，而它只统计了其中三条，另外十一条在「来源与核验记录」里根本查不到。
 * 全库有 18 个条目的计数低于页面实际角标数，pt-freedom 只是最极端的一个。
 *
 * 按 URL 归拢同一份材料，但**不合并定位**：同一个 SEP 条目在来源账里指向 §4、
 * 在论证地图里指向 §5，两条定位都要留着——去重是为了不重复报数，不是为了把
 * 「这一条支持哪一句话」抹平。核验状态与核验日期同理逐条保留。
 */

/** 一条来源在本页被谁引用。读者需要知道这条定位是为哪一块内容服务的。 */
export type SourceUse = '条目正文' | '论证地图' | '跨传统比较' | '思想实验' | '概念卡';

/** 同一份材料在本页的一处具体引用。 */
export type SourceUsage = {
  id: string;
  locator: string;
  supports: string;
  checked: LedgerSource['checked'];
  checkedOn?: string;
  usedIn: SourceUse;
};

export type RegisteredSource = {
  /** 同一份材料在本页出现过的全部编号。多于一个说明它被分头登记过。 */
  ids: string[];
  title: string;
  url: string;
  kind: LedgerSource['kind'];
  usages: SourceUsage[];
};

export type PageSourceRegistry = {
  sources: RegisteredSource[];
  /** 去重后的材料份数。 */
  materialCount: number;
  /** 引用条目数，也就是页面上可能出现的角标与依据条数。 */
  usageCount: number;
  verified: number;
  pending: number;
  broken: number;
  /** 本页除条目正文以外，还有哪些区块带了自己的来源。 */
  extraUses: SourceUse[];
};

function add(
  map: Map<string, RegisteredSource>,
  source: LedgerSource,
  usedIn: SourceUse,
): void {
  const usage: SourceUsage = {
    id: source.id,
    locator: source.locator,
    supports: source.supports,
    checked: source.checked,
    checkedOn: source.checkedOn,
    usedIn,
  };
  const existing = map.get(source.url);
  if (!existing) {
    map.set(source.url, {
      ids: [source.id],
      title: source.title,
      url: source.url,
      kind: source.kind,
      usages: [usage],
    });
    return;
  }
  if (!existing.ids.includes(source.id)) existing.ids.push(source.id);
  // 同一块内容里同一编号的同一定位只登记一次；换了区块或换了定位就是新的一条。
  const duplicate = existing.usages.some(
    (item) => item.id === usage.id && item.usedIn === usage.usedIn && item.locator === usage.locator,
  );
  if (!duplicate) existing.usages.push(usage);
}

/**
 * 汇总一个条目页上实际会渲染出来的全部来源。
 *
 * 收录范围严格对应渲染路径，不多收也不少收：
 *   - 条目正文、立场、哲学家视角、原典，用的都是 `ledger.sources`；
 *   - 论证地图额外用 `map.sources`（argument-map.tsx 把两者拼起来查编号）；
 *   - 跨传统比较用 `item.sources`；
 *   - 思想实验的「本案例的依据」用 `experiment.sources`；
 *   - 概念卡的「定义依据」用 `concept.sources`，而页面上出现哪些概念卡，
 *     由 `guide.conceptRefs` 决定——不是 `conceptsForNode`，那会把只在别的
 *     页面上出现的概念也算进来。
 */
export function collectPageSources(nodeId: string): PageSourceRegistry {
  const map = new Map<string, RegisteredSource>();
  const extraUses = new Set<SourceUse>();

  for (const source of getCoreEntryLedger(nodeId)?.sources ?? []) {
    add(map, source, '条目正文');
  }

  const record = (sources: LedgerSource[] | undefined, usedIn: SourceUse) => {
    if (!sources?.length) return;
    extraUses.add(usedIn);
    for (const source of sources) add(map, source, usedIn);
  };

  record(getArgumentMap(nodeId)?.sources, '论证地图');
  for (const comparison of comparisonsForNode(nodeId)) {
    record(comparison.sources, '跨传统比较');
  }
  record(getThoughtExperiment(nodeId)?.sources, '思想实验');
  for (const ref of getStudyGuide(nodeId)?.conceptRefs ?? []) {
    record(getConcept(ref.id)?.sources, '概念卡');
  }

  const sources = [...map.values()];
  const usages = sources.flatMap((source) => source.usages);

  return {
    sources,
    materialCount: sources.length,
    usageCount: usages.length,
    verified: usages.filter((usage) => usage.checked === 'verified').length,
    pending: usages.filter((usage) => usage.checked === 'pending').length,
    broken: usages.filter((usage) => usage.checked === 'broken').length,
    extraUses: [...extraUses],
  };
}

/**
 * 构建期校验：同一页上，同一个编号不能指向两份不同的材料。
 *
 * 角标是用 `find` 在拼接后的数组里取首个命中的（citation.tsx）。如果论证地图
 * 自带的 AG-2 和该页来源账里的 AG-2 指的不是同一份东西，页面会静默显示先命中
 * 的那一条，读者点开的链接和标题都不是这一步真正依据的材料，而且不会报错。
 * 目前全库没有这种撞车，这条校验就是为了让它撞上时构建直接失败。
 */
function assertNoIdConflict(): void {
  for (const node of philosophyNodes) {
    const urlById = new Map<string, string>();
    for (const source of collectPageSources(node.id).sources) {
      for (const id of source.ids) {
        const seen = urlById.get(id);
        if (seen && seen !== source.url) {
          throw new Error(
            `[page-sources] ${node.id}：编号 ${id} 在同一页上指向两份不同材料（${seen} 与 ${source.url}）。` +
              '同页编号必须唯一，否则正文角标会静默指向先命中的那一条。',
          );
        }
        urlById.set(id, source.url);
      }
    }
  }
}

assertNoIdConflict();
