export type PersonHistory = { stage: string; order: number; era: string; schools: string[]; qualification: string; key: string; source: {url: string; title: string; locator: string; checkedOn: string} };
/** 年代与分类依据见逐人来源；学校标签可能是时代、方法或后世归类。 */
export const personHistory: Record<string, PersonHistory> = {
  "confucius": {
    "stage": "china-early",
    "order": -550,
    "era": "约前6—5世纪",
    "schools": [
      "儒家传统",
      "礼的修养"
    ],
    "qualification": "后世传统归类；《论语》是传世编纂文本。",
    "key": "礼、仁与德性的养成",
    "source": {
      "url": "https://plato.stanford.edu/entries/confucius/",
      "title": "SEP · confucius",
      "locator": "导言；§2 Sources；§3 Ritual Psychology",
      "checkedOn": "2026-09-25"
    }
  },
  "mencius": {
    "stage": "china-early",
    "order": -370,
    "era": "前4世纪",
    "schools": [
      "儒家传统",
      "道德修养"
    ],
    "qualification": "《孟子》的编纂与历史人物须区分。",
    "key": "恻隐、推恩与成德",
    "source": {
      "url": "https://plato.stanford.edu/entries/mencius/",
      "title": "SEP · mencius",
      "locator": "导言；§1 Life and Confucian Background；站内关怀入口来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "zhuangzi": {
    "stage": "china-early",
    "order": -350,
    "era": "约前4世纪；传世文本含后续层次",
    "schools": [
      "道家传统",
      "视角反省"
    ],
    "qualification": "“道家”为传统归类；全书不能都署为庄周亲撰。",
    "key": "是非的视角与生活之道",
    "source": {
      "url": "https://plato.stanford.edu/entries/zhuangzi/",
      "title": "SEP · zhuangzi",
      "locator": "§1；§2 Evolving Text Theory；§4.8 Perspectives on Perspectives",
      "checkedOn": "2026-09-25"
    }
  },
  "zhu-xi": {
    "stage": "china-songming",
    "order": 1130,
    "era": "1130—1200",
    "schools": [
      "宋代理学",
      "道学"
    ],
    "qualification": "学派标签不替代其读书、格物与修养方法。",
    "key": "格物、经典解释与修养",
    "source": {
      "url": "https://plato.stanford.edu/entries/zhu-xi/",
      "title": "SEP · zhu-xi",
      "locator": "导言；站内解释与自由入口来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "wang-yangming": {
    "stage": "china-songming",
    "order": 1472,
    "era": "1472—1529",
    "schools": [
      "宋明儒学",
      "心学"
    ],
    "qualification": "“心学”为传统归类；知行合一不等于排斥学习。",
    "key": "知行合一与道德实践",
    "source": {
      "url": "https://plato.stanford.edu/entries/wang-yangming/",
      "title": "SEP · wang-yangming",
      "locator": "导言；§1；§3 Unity of Knowing and Acting",
      "checkedOn": "2026-09-25"
    }
  },
  "mou-zongsan": {
    "stage": "china-modern",
    "order": 1909,
    "era": "1909—1995",
    "schools": [
      "现代新儒家",
      "康德哲学的重释"
    ],
    "qualification": "借鉴与改造康德不等于属于康德的同一学派。",
    "key": "智的直觉与道德主体",
    "source": {
      "url": "https://iep.utm.edu/zongsan/",
      "title": "IEP · Mou Zongsan",
      "locator": "导言；§3.a Intellectual Intuition and Things-in-Themselves；§4 Criticisms",
      "checkedOn": "2026-09-25"
    }
  },
  "nagarjuna": {
    "stage": "india-classical",
    "order": 200,
    "era": "约2—3世纪",
    "schools": [
      "佛教",
      "中观"
    ],
    "qualification": "“空”不等于否认一切；不同中观解释仍有分歧。",
    "key": "缘起、空与自性批判",
    "source": {
      "url": "https://plato.stanford.edu/entries/nagarjuna/",
      "title": "SEP · nagarjuna",
      "locator": "导言；§2 Emptiness and Svabhāva；§3.1 Causation",
      "checkedOn": "2026-09-25"
    }
  },
  "shankara": {
    "stage": "india-medieval",
    "order": 750,
    "era": "约8世纪；年代有争议",
    "schools": [
      "吠檀多",
      "不二论"
    ],
    "qualification": "体系化者而非凭空创立者；不能代表所有吠檀多。",
    "key": "梵、自我与实在的层次",
    "source": {
      "url": "https://plato.stanford.edu/entries/shankara/",
      "title": "SEP · shankara",
      "locator": "导言；§1 Life and Works；§2.1",
      "checkedOn": "2026-09-25"
    }
  },
  "plato": {
    "stage": "west-ancient",
    "order": -420,
    "era": "前5—4世纪",
    "schools": [
      "古代学院",
      "理型论"
    ],
    "qualification": "传统及理论归类；各对话不是一套无分歧的教条。",
    "key": "知识对象、理型与对话论证",
    "source": {
      "url": "https://plato.stanford.edu/entries/plato/",
      "title": "SEP · plato",
      "locator": "导言；§1；§2；§3；§4 Socrates",
      "checkedOn": "2026-09-25"
    }
  },
  "aristotle": {
    "stage": "west-ancient",
    "order": -384,
    "era": "前384—前322",
    "schools": [
      "古希腊哲学",
      "逻辑与德性研究"
    ],
    "qualification": "研究领域标签，不把整套哲学缩成德性伦理。",
    "key": "推论形式、人的活动与好生活",
    "source": {
      "url": "https://plato.stanford.edu/entries/aristotle/",
      "title": "SEP · aristotle",
      "locator": "导言；站内逻辑与好生活入口来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "epicurus": {
    "stage": "west-hellenistic",
    "order": -341,
    "era": "前341—前270",
    "schools": [
      "伊壁鸠鲁学派",
      "原子论"
    ],
    "qualification": "快乐论不等于纵欲；伦理与自然观相联。",
    "key": "欲望、快乐与死亡的恐惧",
    "source": {
      "url": "https://plato.stanford.edu/entries/epicurus/",
      "title": "SEP · epicurus",
      "locator": "导言；站内死亡与意义来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "aquinas": {
    "stage": "west-medieval",
    "order": 1225,
    "era": "约1225—1274",
    "schools": [
      "经院哲学",
      "自然神学"
    ],
    "qualification": "时代与方法标签；信仰和理性的任务须区分。",
    "key": "自然理性论证的力量与限度",
    "source": {
      "url": "https://plato.stanford.edu/entries/aquinas/",
      "title": "SEP · aquinas",
      "locator": "导言；§2 God；站内信仰与理性来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "descartes": {
    "stage": "west-modern",
    "order": 1596,
    "era": "1596—1650",
    "schools": [
      "近代理性论",
      "怀疑方法"
    ],
    "qualification": "“理性论”为教材常用归类，不表示排除一切经验研究。",
    "key": "确定性、思想与身体",
    "source": {
      "url": "https://plato.stanford.edu/entries/descartes/",
      "title": "SEP · descartes",
      "locator": "导言；站内知识来源与心灵入口来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "hume": {
    "stage": "west-modern",
    "order": 1711,
    "era": "1711—1776",
    "schools": [
      "苏格兰启蒙",
      "经验研究取向"
    ],
    "qualification": "怀疑不是简单否认所有知识；标签描述研究方法。",
    "key": "因果推断、自由与自我经验",
    "source": {
      "url": "https://plato.stanford.edu/entries/hume/",
      "title": "SEP · hume",
      "locator": "导言；站内知识来源、自由与心灵入口来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "kant": {
    "stage": "west-modern",
    "order": 1724,
    "era": "1724—1804",
    "schools": [
      "批判哲学",
      "先验唯心论"
    ],
    "qualification": "先验条件不是个人任意想象；理论与实践论证须区分。",
    "key": "知识的条件、道德自主与审美判断",
    "source": {
      "url": "https://plato.stanford.edu/entries/kant/",
      "title": "SEP · kant",
      "locator": "导言；§3 Transcendental Idealism；站内自由与审美来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "marx": {
    "stage": "west-19",
    "order": 1818,
    "era": "1818—1883",
    "schools": [
      "社会批判",
      "历史唯物主义"
    ],
    "qualification": "与后来的多种马克思主义解释不能直接画等号。",
    "key": "异化、生产关系与历史解释",
    "source": {
      "url": "https://plato.stanford.edu/entries/marx/",
      "title": "SEP · marx",
      "locator": "导言；§1 Alienation；§2 Theory of History",
      "checkedOn": "2026-09-25"
    }
  },
  "nietzsche": {
    "stage": "west-19",
    "order": 1844,
    "era": "1844—1900",
    "schools": [
      "价值批判",
      "谱系研究"
    ],
    "qualification": "方法标签；不能用单一“非理性主义”归类全部作品。",
    "key": "道德价值的形成与重估",
    "source": {
      "url": "https://plato.stanford.edu/entries/nietzsche/",
      "title": "SEP · nietzsche",
      "locator": "导言；§1 Life and Works；§2 Critique of Religion and Morality",
      "checkedOn": "2026-09-25"
    }
  },
  "wittgenstein": {
    "stage": "west-20",
    "order": 1889,
    "era": "20世纪；区分前后期",
    "schools": [
      "分析哲学",
      "语言研究"
    ],
    "qualification": "此入口从后期进入；早期图像论不能与后期用法合并。",
    "key": "语言活动、规则与意义",
    "source": {
      "url": "https://plato.stanford.edu/entries/wittgenstein/",
      "title": "SEP · wittgenstein",
      "locator": "导言；站内语言意义入口来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "beauvoir": {
    "stage": "west-20",
    "order": 1908,
    "era": "1908—1986；《第二性》1949",
    "schools": [
      "存在主义",
      "女性主义哲学"
    ],
    "qualification": "处境与自由须一起读，不归结为某人的思想附属。",
    "key": "他者化、处境与自由",
    "source": {
      "url": "https://plato.stanford.edu/entries/beauvoir/",
      "title": "SEP · beauvoir",
      "locator": "导言；站内身份与压迫来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "gilligan": {
    "stage": "west-20",
    "order": 1982,
    "era": "20世纪后期；代表作1982",
    "schools": [
      "道德心理学",
      "关怀伦理讨论"
    ],
    "qualification": "对规范伦理的启发不等于访谈直接证明规范；关怀不是女性本质。",
    "key": "关系、责任与道德判断框架",
    "source": {
      "url": "https://plato.stanford.edu/entries/feminism-ethics/",
      "title": "SEP · feminism-ethics",
      "locator": "§2.2 Care Ethics；站内关怀来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "fricker": {
    "stage": "west-21",
    "order": 2007,
    "era": "21世纪；代表作2007",
    "schools": [
      "社会认识论",
      "女性主义认识论"
    ],
    "qualification": "研究领域标签；不把所有分歧或不被赞同都称为不正义。",
    "key": "证言可信度与认识不正义",
    "source": {
      "url": "https://plato.stanford.edu/entries/feminist-social-epistemology/",
      "title": "SEP · feminist-social-epistemology",
      "locator": "§4.1；站内身份与压迫来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "avicenna": {
    "stage": "islamic-classical",
    "order": 1000,
    "era": "10—11世纪",
    "schools": [
      "伊斯兰哲学",
      "逻辑与理智研究"
    ],
    "qualification": "接受并改造既有资源，不只是翻译传播。",
    "key": "证明、认识能力与启示的解释",
    "source": {
      "url": "https://plato.stanford.edu/entries/ibn-sina/",
      "title": "SEP · ibn-sina",
      "locator": "导言；§3 Logic and Empiricism；§4 The Metaphysics of the Rational Soul",
      "checkedOn": "2026-09-25"
    }
  },
  "al-ghazali": {
    "stage": "islamic-classical",
    "order": 1080,
    "era": "11—12世纪",
    "schools": [
      "伊斯兰神学",
      "哲学批判"
    ],
    "qualification": "反对某些哲学结论不等于拒绝所有理性方法。",
    "key": "证明标准与因果必然性",
    "source": {
      "url": "https://plato.stanford.edu/entries/al-ghazali/",
      "title": "SEP · al-ghazali",
      "locator": "导言；站内信仰与理性来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "du-bois": {
    "stage": "africana-modern",
    "order": 1868,
    "era": "1868—1963；美国黑人经验",
    "schools": [
      "非裔思想",
      "种族与社会批判"
    ],
    "qualification": "地域与问题标签；不代表所有非洲思想。",
    "key": "双重意识与种族化的目光",
    "source": {
      "url": "https://plato.stanford.edu/entries/dubois/",
      "title": "SEP · dubois",
      "locator": "导言；站内身份与压迫来源账",
      "checkedOn": "2026-09-25"
    }
  },
  "oruka": {
    "stage": "africana-contemporary",
    "order": 1944,
    "era": "1944—1995；肯尼亚",
    "schools": [
      "非洲哲学",
      "贤哲哲学研究"
    ],
    "qualification": "方法与项目名称；受访者的论证不能冒充奥鲁卡自己的观点。",
    "key": "口述中的个人反思与论证",
    "source": {
      "url": "https://plato.stanford.edu/entries/african-sage/",
      "title": "SEP · african-sage",
      "locator": "导言；§1 Oruka’s Project；§5 What counts as Sage Philosophy?",
      "checkedOn": "2026-09-25"
    }
  }
};
