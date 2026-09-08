/**
 * 学习空间的科目清单。
 *
 * 每门已铺开的科目在学习页上占一个分区，并有自己的路由，科目之间平级。
 * 后续新增科目就往这个数组里加一条，分区编号、分区导航和「规划中」列表都从这里
 * 推出来 —— 学习方法那一节会自动往后顺延。
 *
 * 这里没有任何进度状态：status 说的是「这门科目铺开了没有」，不是「你学到哪了」。
 */

export type SubjectStatus = 'live' | 'planned';

export type Subject = {
  id: string;
  code: string;
  title: string;
  /** 一句话说明这门科目在学什么。 */
  note: string;
  status: SubjectStatus;
  /** 已铺开的科目才有自己的页面。 */
  href?: string;
};

export const subjects: Subject[] = [
  {
    id: 'philosophy',
    code: 'PHILOSOPHY',
    title: '哲学',
    note: '先定位问题，再比较立场',
    status: 'live',
    href: '/learning/philosophy',
  },
  { id: 'psychology', code: 'PSYCHOLOGY', title: '心理学', note: '理解心智、行为与关系', status: 'planned' },
  { id: 'history', code: 'HISTORY', title: '历史', note: '在时间与因果中理解世界', status: 'planned' },
  { id: 'science', code: 'SCIENCE', title: '科学', note: '从证据、模型与实验出发', status: 'planned' },
];

export const liveSubjects = subjects.filter((subject) => subject.status === 'live');
export const plannedSubjects = subjects.filter((subject) => subject.status === 'planned');

/** 分区锚点，例如 philosophy → learning-philosophy。 */
export function subjectSectionId(id: string): string {
  return `learning-${id}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * 学习页的分区编号：01 是首屏，之后每门已铺开的科目各占一节，
 * 学习方法永远排在最后。加一门科目，学习方法自己往后挪。
 */
export function subjectSectionNumber(id: string): string {
  const position = liveSubjects.findIndex((subject) => subject.id === id);
  if (position < 0) throw new Error(`subject is not live: ${id}`);
  return pad(position + 2);
}

export const methodSectionNumber = pad(liveSubjects.length + 2);

/** 科目自己的序号，和分区编号是两套：科目 01 是哲学，无论它排在第几节。 */
export function subjectNumber(id: string): string {
  const position = subjects.findIndex((subject) => subject.id === id);
  if (position < 0) throw new Error(`unknown subject: ${id}`);
  return pad(position + 1);
}

/**
 * 深浅两种面交替，让相邻的两门科目分得开。
 * 第三门科目会自动回到浅面，不用再手写一条规则。
 */
export function subjectSectionTone(id: string): 'a' | 'b' {
  const position = liveSubjects.findIndex((subject) => subject.id === id);
  return position % 2 === 0 ? 'a' : 'b';
}
