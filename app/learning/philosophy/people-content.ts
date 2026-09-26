import { peopleHistories } from './people-history';
import { personHistory } from './people-metadata';
import { historicalProfiles } from './people-profiles';
import { getCoreEntryLedger } from './content-ledger';
import { philosophyPeople, type PhilosophyPerson, type PersonStop } from './people';
import { getStudyGuide } from './study-guides';
import { getNodeById } from './tree';

/** 只解析精确编辑映射；找不到时失败，不以姓名模糊匹配生成论证关系。 */
export function resolvePersonStop(stop: PersonStop) {
  const node = getNodeById(stop.nodeId);
  const guide = getStudyGuide(stop.nodeId);
  const views = guide?.philosopherViews?.filter((view) => view.philosopher === stop.view) ?? [];
  const texts = guide?.texts.filter((text) => text.author === stop.textAuthor) ?? [];
  if (!node || views.length !== 1 || texts.length !== 1) {
    throw new Error(`[people] 人物论证或文本映射不唯一：${stop.nodeId}/${stop.view}`);
  }
  const view = views[0];
  const text = texts[0];
  const ledgerSources = getCoreEntryLedger(stop.nodeId)?.sources ?? [];
  const ids = [...new Set([...view.sourceIds, ...(text.sourceIds ?? [])])];
  const sources = ids.map((id) => {
    const source = ledgerSources.find((item) => item.id === id);
    if (!source || !source.locator.trim() || !source.supports.trim() || source.checked === 'broken') {
      throw new Error(`[people] 来源缺失、失效或无定位：${stop.nodeId}/${id}`);
    }
    return source;
  });
  // 门槛按当前引用逐条判断，不能继承整页或同 URL 其他引用的核验状态。
  for (const refs of [view.sourceIds, text.sourceIds ?? []]) {
    if (!sources.some((source) => refs.includes(source.id) && source.checked === 'verified' && source.checkedOn)) {
      throw new Error(`[people] 论证或阅读入口缺少已核验依据：${stop.nodeId}/${stop.view}`);
    }
  }
  if (!view.framing.trim() || !view.caution.trim() || !text.contribution.trim() || !stop.why.trim()) {
    throw new Error(`[people] 缺少理由、边界或阅读指导：${stop.nodeId}/${stop.view}`);
  }
  return { ...stop, node, view, text, sources };
}

export const resolvePerson = (person: PhilosophyPerson) => ({
  ...person,
  history: personHistory[person.id],
  profile: historicalProfiles[person.id],
  questionNode: person.questionNodeId ? getNodeById(person.questionNodeId) : undefined,
  stops: person.stops.map(resolvePersonStop),
  contexts: person.contextIds.map((id) => {
    const node = getNodeById(id);
    if (!node) throw new Error(`[people] 历史语境不存在：${id}`);
    return node;
  }),
});

/**
 * study-guides 里的 framing／caution／text／why 同时渲染在问题页和人物页上，
 * 「本页」这类指代在人物页会指错地方（人物页上没有那场分歧）。
 * 只查这几个双页字段；application、concepts、caseStudy 只在问题页出现，不在此列。
 */
const PAGE_DEIXIS = ['本页', '该页', '这一页', '同一页', '本问题页'];

function assertNoPageDeixis(label: string, value: string | undefined) {
  for (const word of PAGE_DEIXIS) {
    if (value?.includes(word)) throw new Error(`[people] 双页字段含会指错的页面指代「${word}」：${label}`);
  }
}

export function assertPeopleIntegrity() {
  const stageIds = peopleHistories.flatMap((group) => group.stages.map((stage) => stage.id));
  if (new Set(stageIds).size !== stageIds.length) throw new Error('[people] 分期 ID 重复');
  for (const group of peopleHistories) for (const stage of group.stages) {
    if (!getNodeById(stage.nodeId) || !stage.intro || (!stage.gap && !philosophyPeople.some((person) => personHistory[person.id]?.stage === stage.id))) throw new Error(`[people] 空阶段未说明：${stage.id}`);
  }
  if (Object.keys(personHistory).length !== philosophyPeople.length || Object.keys(personHistory).some((id) => !philosophyPeople.some((person) => person.id === id))) throw new Error('[people] 历史元数据与人物不一致');
  const ids = new Set<string>();
  const names = new Set<string>();
  const mappings = new Set<string>();
  for (const person of philosophyPeople) {
    if (!/^[a-z][a-z0-9-]*$/.test(person.id) || ids.has(person.id)) throw new Error('[people] ID 重复或不适合作为锚点');
    ids.add(person.id);
    for (const name of [person.name, ...person.aliases]) {
      if (!name.trim() || names.has(name)) throw new Error(`[people] 姓名需要消歧：${name}`);
      names.add(name);
    }
    if (!person.question.trim() || (!person.stops.length && !historicalProfiles[person.id]) || !person.contextIds.length) throw new Error(`[people] 空入口：${person.id}`);
    const nodeIds = new Set<string>();
    for (const stop of person.stops) {
      if (nodeIds.has(stop.nodeId)) throw new Error(`[people] 人物阅读节点重复：${person.id}`);
      nodeIds.add(stop.nodeId);
      for (const key of [`${stop.nodeId}/voice/${stop.view}`, `${stop.nodeId}/text/${stop.textAuthor}`]) {
        if (mappings.has(key)) throw new Error(`[people] 两个人物占用同一内容映射：${key}`);
        mappings.add(key);
      }
    }
    const history = personHistory[person.id];
    const stages = peopleHistories.flatMap((group) => group.stages);
    if (!history || !stages.some((stage) => stage.id === history.stage) || !history.era || !Number.isFinite(history.order) || !history.schools.length || !history.qualification || !history.key || !history.source.locator || !history.source.checkedOn || !/^https:\/\//.test(history.source.url)) throw new Error(`[people] 缺少历史定位或依据：${person.id}`);
    const profile = historicalProfiles[person.id];
    if (profile && (!person.questionNodeId || !getNodeById(person.questionNodeId) || !profile.reason || !profile.boundary || !profile.work || !profile.reading || profile.compare.some((id) => !philosophyPeople.some((item) => item.id === id)))) throw new Error(`[people] 历史入口未闭合：${person.id}`);
    // 人物页上的来源定位必须是外部材料里的位置；写成站内自指等于没给定位。
    const locator = history.source.locator;
    for (const word of ['站内', '本站', '本卡', '本页']) {
      if (locator.includes(word)) throw new Error(`[people] 来源定位不能自指站内：${person.id}`);
    }
    if (locator.trim().length < 3 || locator.trim() === '导言') throw new Error(`[people] 来源定位过弱，需给出章节位置：${person.id}`);
    const resolved = resolvePerson(person);
    const first = resolved.stops[0];
    if (first) {
      assertNoPageDeixis(`${person.id}/view.framing`, first.view.framing);
      assertNoPageDeixis(`${person.id}/view.caution`, first.view.caution);
      assertNoPageDeixis(`${person.id}/text.contribution`, first.text.contribution);
      assertNoPageDeixis(`${person.id}/text.readingQuestion`, first.text.readingQuestion);
    }
    for (const stop of resolved.stops) {
      assertNoPageDeixis(`${person.id}/${stop.nodeId}/why`, stop.why);
      assertNoPageDeixis(`${person.id}/${stop.nodeId}/view.work`, stop.view.work);
    }
  }
  // 「对照阅读」表示共同问题，两张概览卡之间必须互相列出，否则一边点得过去、一边回不来。
  for (const person of philosophyPeople) {
    const profile = historicalProfiles[person.id];
    if (!profile) continue;
    for (const otherId of profile.compare) {
      const other = historicalProfiles[otherId];
      if (other && !other.compare.includes(person.id)) throw new Error(`[people] 对照阅读只有单向：${person.id} → ${otherId}`);
    }
  }
}
