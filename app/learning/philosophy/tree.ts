import rawTree from './data.json';

/**
 * 哲学体系树的唯一结构化内容源。
 *
 * data.json 最初从 public/learning/philosophy-tree.html 里的内联数据提取，
 * 现在是持续扩展的新路由内容源。旧静态页只保留为兼容兜底。
 */

export type PhilosophySource = {
  label: string;
  url: string;
};

export type PhilosophyPosition = {
  name: string;
  text: string;
  objection?: string;
  /**
   * 这个立场的支持者怎么回应上面那条反对。
   *
   * 以前没有这个字段，于是全库每个立场卡都停在「反对意见」那一行：读者看到
   * 反驳，看不到回应，容易以为这个立场已经被驳倒。有反对就应该有回应；
   * 确实没有有力回应时，宁可在 objection 里写清它为什么难答。
   */
  response?: string;
  /**
   * 这条「反对」到底是哪一种。
   *
   * 默认是真正的反驳。但有些条目下面挂的根本不是反驳：逻辑页里
   * 「生活中的多数判断不是纯演绎」说的是演绎管不到哪里，紧接着的回应第一句
   * 就写着「这不是对演绎的反驳」——却仍然顶着一个和佛教无我论、照护伦理
   * 那些真正反驳一模一样的红色「反对意见」标签。标签本身在传达错误信息。
   */
  objectionKind?: '反对意见' | '适用限制' | '未解难题';
};

export type PhilosophyNode = {
  id: string;
  title: string;
  type: string;
  summary: string;
  question?: string;
  notes?: string[];
  positions?: PhilosophyPosition[];
  figures?: string[];
  example?: string;
  related?: string[];
  sources?: PhilosophySource[];
  children?: PhilosophyNode[];
};

/** JSON 的推断类型是一棵字面量树，逐层断言没有意义，这里一次性收窄。 */
export const philosophyTree = rawTree as unknown as PhilosophyNode;

export const OVERVIEW_ID = philosophyTree.id;
export const CORE_QUESTION_TYPE = '核心问题';
export const PHILOSOPHY_BASE_PATH = '/learning/philosophy';

const nodeById = new Map<string, PhilosophyNode>();
const parentIdByNodeId = new Map<string, string>();
const orderedNodes: PhilosophyNode[] = [];

function indexNode(node: PhilosophyNode, parentId: string | null) {
  if (nodeById.has(node.id)) {
    throw new Error(`重复的哲学节点 ID：${node.id}`);
  }
  nodeById.set(node.id, node);
  orderedNodes.push(node);
  if (parentId) {
    parentIdByNodeId.set(node.id, parentId);
  }
  for (const child of node.children ?? []) {
    indexNode(child, node.id);
  }
}

indexNode(philosophyTree, null);

/** 深度优先的阅读顺序，也就是旧页面目录树从上到下的顺序。 */
export const philosophyNodes: readonly PhilosophyNode[] = orderedNodes;

/** URL 里不重复 `pt-` 前缀：pt-being-change → /learning/philosophy/being-change。 */
export function nodeSlug(node: PhilosophyNode): string {
  return node.id.replace(/^pt-/, '');
}

const nodeBySlug = new Map<string, PhilosophyNode>(
  orderedNodes.map((node) => [nodeSlug(node), node] as const),
);

export function getNodeById(id: string): PhilosophyNode | undefined {
  return nodeById.get(id);
}

export function getNodeBySlug(slug: string): PhilosophyNode | undefined {
  return nodeBySlug.get(slug);
}

/** 总览节点住在 /learning/philosophy 本身，其余节点各有一页。 */
export function nodeHref(node: PhilosophyNode): string {
  return node.id === OVERVIEW_ID ? PHILOSOPHY_BASE_PATH : `${PHILOSOPHY_BASE_PATH}/${nodeSlug(node)}`;
}

export function nodeHrefById(id: string): string | undefined {
  const node = nodeById.get(id);
  return node ? nodeHref(node) : undefined;
}

/** 从总览到该节点的完整路径，用于面包屑。 */
export function nodePath(id: string): PhilosophyNode[] {
  const path: PhilosophyNode[] = [];
  let current: string | undefined = id;
  while (current) {
    const node = nodeById.get(current);
    if (!node) break;
    path.unshift(node);
    current = parentIdByNodeId.get(current);
  }
  return path;
}

export function parentOf(id: string): PhilosophyNode | undefined {
  const parentId = parentIdByNodeId.get(id);
  return parentId ? nodeById.get(parentId) : undefined;
}

export function isCoreQuestion(node: PhilosophyNode): boolean {
  return node.type === CORE_QUESTION_TYPE;
}

/** 全部核心问题，顺序即阅读顺序。 */
export const coreQuestions: readonly PhilosophyNode[] = orderedNodes.filter(isCoreQuestion);

const coreGroup = nodeById.get('pt-core');
const traditionsGroup = nodeById.get('pt-traditions');

if (!coreGroup || !traditionsGroup) {
  throw new Error('哲学体系树缺少 pt-core 或 pt-traditions 分组');
}

/** 主学习路径的分组节点（「核心问题｜主学习路径」）。 */
export const coreSection: PhilosophyNode = coreGroup;
/** 平行历史导航的分组节点（「传统地图｜平行历史导航」）。 */
export const traditionsSection: PhilosophyNode = traditionsGroup;

/** 问题域，每个域下挂着它自己的核心问题。 */
export const questionDomains: readonly PhilosophyNode[] = coreSection.children ?? [];
/** 传统线索，每条下挂着历史时段或思想线索。 */
export const traditions: readonly PhilosophyNode[] = traditionsSection.children ?? [];

/** 供 sitemap 使用：所有节点对应的站内路径。 */
export function allNodePaths(): string[] {
  return orderedNodes.map((node) => nodeHref(node));
}

/** metadata 里的 description 不需要整段 summary，截到一句话左右。 */
export function shortDescription(node: PhilosophyNode, limit = 150): string {
  const text = node.question ? `${node.question} ${node.summary}` : node.summary;
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1).trimEnd()}…`;
}
