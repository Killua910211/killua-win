import { basicPath } from './learning-path';
import { getNodeById, parentOf, philosophyNodes, type PhilosophyNode } from './tree';

/**
 * 条目底部的「上一页 / 下一页」。
 *
 * 以前这里用的是 `neighborsOf`：把整棵树深度优先压平成一个 55 项的数组，
 * 取前后两项。那个数组只是目录树从上到下的书写顺序，不是任何人的阅读顺序，
 * 于是「哲学传统」的上一页是「人工智能与未来」——两者之间没有任何关系，
 * 只是前者恰好排在核心问题那一支的末尾之后。
 *
 * 现在按语境给顺序，而且允许一个条目同时属于多个语境：
 *   - 同一问题域、同一传统里的浏览，用那一组自己的次序；
 *   - 推荐学习路线的前后步，用路线配置；
 *   - 目录页（问题域、传统导航、两个分组）不排顺序，它们的出口是面包屑
 *     和下一级入口，硬给一个 Prev/Next 只会伪造一条并不存在的阅读线。
 *
 * 每一组都写明它是哪个语境的顺序。不把多个语境合并成唯一一条线。
 */

export type PagerContext = {
  /** 这组前后页是在什么语境里的顺序。必须写出来，否则读者无从判断。 */
  label: string;
  previous?: PhilosophyNode;
  next?: PhilosophyNode;
};

/** 自身承担导航、不参与线性阅读的节点类型。 */
const catalogueTypes = new Set(['总览', '目录分组', '问题领域', '传统导航']);

function siblingContext(node: PhilosophyNode): PagerContext | undefined {
  if (catalogueTypes.has(node.type)) return undefined;

  const parent = parentOf(node.id);
  const siblings = parent?.children ?? [];
  if (siblings.length < 2) return undefined;

  const index = siblings.findIndex((sibling) => sibling.id === node.id);
  if (index < 0) return undefined;

  return {
    label: `在「${parent!.title}」里`,
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

function pathContext(node: PhilosophyNode): PagerContext | undefined {
  const index = basicPath.steps.findIndex((step) => step.nodeId === node.id);
  if (index < 0) return undefined;

  // 「第 N 步」只说位置，不说读没读过、读懂没有。
  return {
    label: `${basicPath.title} · 第 ${index + 1} 步（共 ${basicPath.steps.length} 步）`,
    previous: index > 0 ? getNodeById(basicPath.steps[index - 1].nodeId) : undefined,
    next:
      index < basicPath.steps.length - 1
        ? getNodeById(basicPath.steps[index + 1].nodeId)
        : undefined,
  };
}

/**
 * 一个条目底部该显示哪几组前后页。没有合理顺序时返回空数组，不显示分页器。
 */
export function pagerContextsFor(nodeId: string): PagerContext[] {
  const node = getNodeById(nodeId);
  if (!node) return [];

  return [siblingContext(node), pathContext(node)].filter(
    (context): context is PagerContext => Boolean(context?.previous || context?.next),
  );
}

/**
 * 构建期校验：分页器不得指向自己，两个语境也不得给出互相矛盾的同一条顺序。
 *
 * 前者会产生一个点了等于没点的链接；后者是「伪造唯一阅读顺序」的另一种形式
 * ——同一页上两行分页器写着同样的下一页，读者会以为那就是唯一的下一步。
 */
function assertPagers(): void {
  for (const node of [...basicPath.steps.map((step) => step.nodeId)]) {
    if (!getNodeById(node)) throw new Error(`[pager] 学习路线指向了不存在的节点：${node}`);
  }
  for (const node of philosophyNodes) {
    const contexts = pagerContextsFor(node.id);
    for (const context of contexts) {
      if (context.previous?.id === node.id || context.next?.id === node.id) {
        throw new Error(`[pager] ${node.id}：「${context.label}」的前后页指向了自己。`);
      }
    }
    if (contexts.length === 2) {
      const [first, second] = contexts;
      if (first.previous?.id === second.previous?.id && first.next?.id === second.next?.id) {
        throw new Error(
          `[pager] ${node.id}：两个语境给出了完全相同的前后页，应当只保留一个，` +
            '否则等于用两行重复同一条顺序。',
        );
      }
    }
  }
}

assertPagers();
