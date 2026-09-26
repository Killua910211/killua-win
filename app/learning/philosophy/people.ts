/** 人物身份与链接的轻量注册表；历史概览和既有精读分别解析。 */
export type PersonStop = { nodeId: string; view: string; textAuthor: string; why: string };
export type PhilosophyPerson = {
  id: string;
  name: string;
  aliases: string[];
  question: string;
  /** 编辑选定的阅读顺序，不表示作品年代、师承或影响。 */
  stops: PersonStop[];
  /** 可多值：阅读语境，不是互斥的学派归属。 */
  contextIds: string[];
  /** 历史人物概览的问题对读，不声称目标页已有该人物专段。 */
  questionNodeId?: string;
};

export const philosophyPeople: PhilosophyPerson[] = [
  {
    "id": "aristotle",
    "name": "亚里士多德",
    "aliases": [],
    "question": "怎样判断一生过得好？",
    "stops": [
      {
        "nodeId": "pt-good-life",
        "view": "亚里士多德",
        "textAuthor": "亚里士多德",
        "why": "先从人的活动与好生活的关系读起。"
      },
      {
        "nodeId": "pt-logic",
        "view": "亚里士多德",
        "textAuthor": "亚里士多德",
        "why": "再看他如何要求推论的形式成立，区分伦理判断与演绎证明。"
      }
    ],
    "contextIds": [
      "pt-western-ancient"
    ]
  },
  {
    "id": "descartes",
    "name": "笛卡尔",
    "aliases": [],
    "question": "可以怀疑身体，却不能怀疑正在思想的我吗？",
    "stops": [
      {
        "nodeId": "pt-mind-self",
        "view": "笛卡尔",
        "textAuthor": "笛卡尔",
        "why": "先检查关于心灵与身体的论证及其困难。"
      },
      {
        "nodeId": "pt-knowledge-sources",
        "view": "笛卡尔",
        "textAuthor": "笛卡尔",
        "why": "再回到怀疑方法，看确定性要满足什么条件。"
      }
    ],
    "contextIds": [
      "pt-western-modern"
    ]
  },
  {
    "id": "hume",
    "name": "休谟",
    "aliases": [
      "大卫·休谟"
    ],
    "question": "有原因的行动，还能是自由的吗？",
    "stops": [
      {
        "nodeId": "pt-freedom",
        "view": "大卫·休谟",
        "textAuthor": "大卫·休谟",
        "why": "先把自由与行动的原因分开问。"
      },
      {
        "nodeId": "pt-knowledge-sources",
        "view": "大卫·休谟",
        "textAuthor": "大卫·休谟",
        "why": "再追问经验能否保证因果推断。"
      },
      {
        "nodeId": "pt-mind-self",
        "view": "大卫·休谟",
        "textAuthor": "大卫·休谟",
        "why": "最后考察持续的自我是否能从经验中找到。"
      }
    ],
    "contextIds": [
      "pt-western-modern"
    ]
  },
  {
    "id": "kant",
    "name": "康德",
    "aliases": [
      "伊曼努尔·康德"
    ],
    "question": "道德要求为何让我们必须把自己看作自由的？",
    "stops": [
      {
        "nodeId": "pt-freedom",
        "view": "伊曼努尔·康德",
        "textAuthor": "伊曼努尔·康德",
        "why": "先读自由与道德要求的关联，并留意论证边界。"
      },
      {
        "nodeId": "pt-aesthetic-value",
        "view": "伊曼努尔·康德",
        "textAuthor": "伊曼努尔·康德",
        "why": "换到审美判断，检验普遍性是否仍用同一种理由。"
      }
    ],
    "contextIds": [
      "pt-western-modern"
    ]
  },
  {
    "id": "mencius",
    "name": "孟子",
    "aliases": [],
    "question": "对眼前受苦者的关切，怎样扩展到陌生人？",
    "stops": [
      {
        "nodeId": "pt-care",
        "view": "孟子",
        "textAuthor": "孟子",
        "why": "从恻隐与推恩进入，先理解由近及远的困难。"
      },
      {
        "nodeId": "pt-good-life",
        "view": "孟子",
        "textAuthor": "孟子",
        "why": "把关怀放回修养与好生活的问题。"
      },
      {
        "nodeId": "pt-legitimacy",
        "view": "孟子",
        "textAuthor": "孟子",
        "why": "再追问对统治者的要求，区分修养与政治正当性。"
      }
    ],
    "contextIds": [
      "pt-confucian"
    ]
  },
  {
    "id": "zhu-xi",
    "name": "朱熹",
    "aliases": [],
    "question": "读经典怎样成为修养，而不只是解释字句？",
    "stops": [
      {
        "nodeId": "pt-interpretation",
        "view": "朱熹（与王阳明的分歧）",
        "textAuthor": "朱熹（附王阳明分歧）",
        "why": "先读经典解释、格物与修养的联系。"
      },
      {
        "nodeId": "pt-freedom",
        "view": "朱熹",
        "textAuthor": "朱熹",
        "why": "再看气质与习惯的条件怎样进入修养，避免把它直接等同于现代自由意志理论。"
      }
    ],
    "contextIds": [
      "pt-chinese-later"
    ]
  },
  {
    "id": "al-ghazali",
    "name": "安萨里",
    "aliases": [],
    "question": "声称已经证明的命题，真的达到了证明标准吗？",
    "stops": [
      {
        "nodeId": "pt-religion-reason",
        "view": "安萨里",
        "textAuthor": "安萨里",
        "why": "从证明标准与因果必然性的争论读起，再回到启示与理性的历史语境。"
      }
    ],
    "contextIds": [
      "pt-islamic-reason-revelation"
    ]
  },
  {
    "id": "beauvoir",
    "name": "波伏瓦",
    "aliases": [
      "西蒙娜·德·波伏瓦"
    ],
    "question": "一个人怎样被置于“他者”的位置？",
    "stops": [
      {
        "nodeId": "pt-identity-oppression",
        "view": "西蒙娜·德·波伏瓦",
        "textAuthor": "西蒙娜·德·波伏瓦",
        "why": "先辨认社会位置怎样被维持，再看这种分析的适用边界。"
      }
    ],
    "contextIds": [
      "pt-western-contemporary"
    ]
  },
  {
    "id": "du-bois",
    "name": "杜波依斯",
    "aliases": [
      "W. E. B. 杜波依斯"
    ],
    "question": "总从带偏见的他人目光看自己，会发生什么？",
    "stops": [
      {
        "nodeId": "pt-identity-oppression",
        "view": "W. E. B. 杜波依斯",
        "textAuthor": "W. E. B. 杜波依斯",
        "why": "从双重意识的特定处境读起，再回到种族与解放的讨论。"
      }
    ],
    "contextIds": [
      "pt-africana-race"
    ]
  },
  {
    "id": "gilligan",
    "name": "吉利根",
    "aliases": [
      "卡罗尔·吉利根"
    ],
    "question": "为什么关系与照料的推理会被判为“不成熟”？",
    "stops": [
      {
        "nodeId": "pt-care",
        "view": "卡罗尔·吉利根",
        "textAuthor": "卡罗尔·吉利根",
        "why": "先读她对研究框架的质疑，再区分访谈证据与规范主张。"
      }
    ],
    "contextIds": [
      "pt-western-contemporary"
    ]
  },
  {
    "id": "wittgenstein",
    "name": "维特根斯坦",
    "aliases": [
      "路德维希·维特根斯坦"
    ],
    "question": "理解一个词，是否就是知道它指什么？",
    "stops": [
      {
        "nodeId": "pt-language-meaning",
        "view": "路德维希·维特根斯坦",
        "textAuthor": "路德维希·维特根斯坦",
        "why": "从后期的用法与语言活动进入；前后期区别另见历史语境，不把两者合成一句口号。"
      }
    ],
    "contextIds": [
      "pt-western-contemporary"
    ]
  },
  {
    "id": "epicurus",
    "name": "伊壁鸠鲁",
    "aliases": [],
    "question": "死亡没有被体验到，是否就不会伤害我们？",
    "stops": [
      {
        "nodeId": "pt-death-meaning",
        "view": "伊壁鸠鲁",
        "textAuthor": "伊壁鸠鲁",
        "why": "先读死亡与经验的论证，再对照剥夺论的反对。"
      }
    ],
    "contextIds": [
      "pt-western-ancient"
    ]
  },
{
  "id": "plato",
  "name": "柏拉图",
  "aliases": [],
  "question": "稳定的知识是否需要稳定的对象？",
  "stops": [],
  "contextIds": [
    "pt-western-ancient"
  ],
  "questionNodeId": "pt-knowledge-sources"
},
{
  "id": "confucius",
  "name": "孔子",
  "aliases": [],
  "question": "礼怎样影响一个人的欲望与品格？",
  "stops": [],
  "contextIds": [
    "pt-confucian"
  ],
  "questionNodeId": "pt-good-life"
},
{
  "id": "zhuangzi",
  "name": "庄子",
  "aliases": [],
  "question": "凭什么把自己的视角当作最终标准？",
  "stops": [],
  "contextIds": [
    "pt-daoism"
  ],
  "questionNodeId": "pt-knowledge-sources"
},
{
  "id": "wang-yangming",
  "name": "王阳明",
  "aliases": [],
  "question": "知道该做却不行动，算真正知道吗？",
  "stops": [],
  "contextIds": [
    "pt-chinese-later"
  ],
  "questionNodeId": "pt-right-action"
},
{
  "id": "mou-zongsan",
  "name": "牟宗三",
  "aliases": [],
  "question": "道德主体能否具有康德所否认的人类智的直觉？",
  "stops": [],
  "contextIds": [
    "pt-chinese-later"
  ],
  "questionNodeId": "pt-freedom"
},
{
  "id": "nagarjuna",
  "name": "龙树",
  "aliases": [],
  "question": "缘起的事物还能有独立不变的自性吗？",
  "stops": [],
  "contextIds": [
    "pt-buddhist"
  ],
  "questionNodeId": "pt-being-change"
},
{
  "id": "shankara",
  "name": "商羯罗",
  "aliases": [],
  "question": "多样世界怎样依赖不二的实在？",
  "stops": [],
  "contextIds": [
    "pt-indian-vedanta"
  ],
  "questionNodeId": "pt-being-change"
},
{
  "id": "marx",
  "name": "马克思",
  "aliases": [],
  "question": "社会关系怎样使人的活动成为异己力量？",
  "stops": [],
  "contextIds": [
    "pt-western-contemporary"
  ],
  "questionNodeId": "pt-history-tech"
},
{
  "id": "nietzsche",
  "name": "尼采",
  "aliases": [],
  "question": "既有道德价值凭什么值得服从？",
  "stops": [],
  "contextIds": [
    "pt-western-contemporary"
  ],
  "questionNodeId": "pt-right-action"
},
{
  "id": "avicenna",
  "name": "伊本·西那",
  "aliases": [],
  "question": "推理、直觉与启示能否置于同一种知识解释中？",
  "stops": [],
  "contextIds": [
    "pt-islamic-reason-revelation"
  ],
  "questionNodeId": "pt-religion-reason"
},
{
  "id": "oruka",
  "name": "奥鲁卡",
  "aliases": [],
  "question": "口述传统中的个人怎样提出哲学理由？",
  "stops": [],
  "contextIds": [
    "pt-african-method"
  ],
  "questionNodeId": "pt-knowledge-sources"
},
{
  "id": "aquinas",
  "name": "阿奎那",
  "aliases": [
    "托马斯·阿奎那"
  ],
  "question": "自然理性的证明能够走多远？",
  "stops": [
    {
      "nodeId": "pt-religion-reason",
      "view": "托马斯·阿奎那",
      "textAuthor": "托马斯·阿奎那",
      "why": "先读她怎样把「被当作知者」的伤害切成两种，再看两种补救共享什么、又在哪里分开。"
    }
  ],
  "contextIds": [
    "pt-western-medieval"
  ]
},
{
  "id": "fricker",
  "name": "弗里克",
  "aliases": [
    "米兰达·弗里克"
  ],
  "question": "偏见怎样损害一个人作为知者的地位？",
  "stops": [
    {
      "nodeId": "pt-identity-oppression",
      "view": "米兰达·弗里克",
      "textAuthor": "米兰达·弗里克",
      "why": "先读他怎样安排信仰与理性各自的范围，再看这一安排要付什么代价。"
    }
  ],
  "contextIds": [
    "pt-western-contemporary"
  ]
}
];

export const peopleHref = (person: Pick<PhilosophyPerson, 'id'>) => `/learning/philosophy/people#${person.id}`;
export const voiceAnchor = (person: Pick<PhilosophyPerson, 'id'>) => `voice-${person.id}`;
export const textAnchor = (person: Pick<PhilosophyPerson, 'id'>) => `text-${person.id}`;
export const peopleForNode = (nodeId: string) => philosophyPeople.filter((person) =>
  person.stops.some((stop) => stop.nodeId === nodeId) || person.contextIds.includes(nodeId) || person.questionNodeId === nodeId);
export const personForVoice = (nodeId: string, name: string) => philosophyPeople.find((person) =>
  person.stops.some((stop) => stop.nodeId === nodeId && stop.view === name));
export const personForText = (nodeId: string, name: string) => philosophyPeople.find((person) =>
  person.stops.some((stop) => stop.nodeId === nodeId && stop.textAuthor === name));

export function voiceAnchorFor(nodeId: string, name: string) {
  const person = personForVoice(nodeId, name);
  return person ? voiceAnchor(person) : undefined;
}
export function textAnchorFor(nodeId: string, name: string) {
  const person = personForText(nodeId, name);
  return person ? textAnchor(person) : undefined;
}
