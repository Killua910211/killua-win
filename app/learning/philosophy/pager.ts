import { basicPath } from './learning-path';
import { getNodeById, orderedChildren, parentOf, philosophyNodes, type PhilosophyNode } from './tree';

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
  if (!parent) return undefined;
  const siblings = orderedChildren(parent);
  if (siblings.length < 2) return undefined;

  /*
    父页上写了建议阅读顺序时，前后页按那个顺序走。

    这两处必须是同一条顺序：父页的子节点清单现在是按 guidance.order 编号
    显示的，而分页器原来取的是 data.json 里的书写顺序。两者一旦不同，
    「知识、理由与语言」那一页会把逻辑标成 02，而在逻辑页底部点「下一页」
    却跳回 01 的那一篇。数据层的书写顺序保持不动，只在展示层统一。
  */
  const index = siblings.findIndex((sibling) => sibling.id === node.id);
  if (index < 0) return undefined;

  return {
    label: `在「${parent.title}」里按建议顺序`,
    previous: index > 0 ? siblings[index - 1] : undefined,
    next: index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

function pathContext(node: PhilosophyNode): PagerContext | undefined {
  const index = basicPath.steps.findIndex((step) => step.nodeId === node.id);
  if (index < 0) return undefined;

  // 「第 N 步」只说位置，不说读没读过、读懂没有。
  return {
    // 标签要写明这条线会离开当前问题域，否则两行分页器只能靠目标页名区分。
    label: `${basicPath.title}第 ${index + 1} 步（共 ${basicPath.steps.length} 步，会跨问题域）`,
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

  /*
    推荐路线那一组排在前面。

    复审走查抓到的问题：《存在与变化》是路线的第一步，页尾却先出现「在「1. 存在、
    世界与人」里 → 下一页：心灵、身体与「我」」，路线那一行排在它下面。两行外观
    一样，刚从路线页点进来的读者会照着上面那一行走，在第一页就被送去第五步。
    路线是给「不知道从哪开始」的人用的，它该排在前面。
  */
  const contexts = [pathContext(node), siblingContext(node)].filter(
    (context): context is PagerContext => Boolean(context?.previous || context?.next),
  );

  /*
    两个语境给出同一对前后页时，合并成一行。

    本轮把问题域的子条目改成按建议顺序排列之后，「知识、理由与语言」那一域的
    次序和推荐路线在这一段正好重合——这是好事，说明两处建议不打架。但画两行
    完全一样的分页器等于用两行重复同一条顺序，读者会以为它们是两条不同的线。
    合并时两个语境都写出来，因为「同一域里的下一篇」和「路线的下一步」仍然是
    两件事，只是此处恰好同指。
  */
  if (contexts.length === 2) {
    const [first, second] = contexts;
    if (first.previous?.id === second.previous?.id && first.next?.id === second.next?.id) {
      return [{ ...first, label: `${first.label}，同时是${second.label}` }];
    }
  }

  return contexts;
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
    // 合并由 pagerContextsFor 负责；这里确认它真的合并掉了，页面上不会出现
    // 两行写着同一对前后页的分页器。
    if (contexts.length === 2) {
      const [first, second] = contexts;
      if (first.previous?.id === second.previous?.id && first.next?.id === second.next?.id) {
        throw new Error(
          `[pager] ${node.id}：两个语境给出了完全相同的前后页却没有被合并，` +
            '页面上会出现两行重复同一条顺序的分页器。',
        );
      }
    }
  }
}

assertPagers();
