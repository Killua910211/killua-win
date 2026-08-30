-- Imported from the official WeChat permanent-material API.
-- Exact-title duplicates already present in the QQ archive were intentionally skipped.
ALTER TABLE posts ADD COLUMN category TEXT NOT NULL DEFAULT '随笔';

INSERT INTO posts (
  slug,
  title,
  excerpt,
  content,
  status,
  published_at,
  category,
  source,
  source_url,
  ai_summary
) VALUES (
  'wechat-jvm-class-loading',
  'JVM基础概念、类加载机制',
  '从 JVM 的基本组成出发，梳理类加载生命周期、双亲委派与代码执行方式。',
  'JVM的基础概念

JVM规范

JAVA虚拟机规范是一种对JAVA虚拟机实现的规范要求，是由oracle制定的，而我们平时常说的JAVA虚拟机一般是指的一种具体的JAVA虚拟机规范的实现。

JVM实现

HotSport---JVM，Jrockit的实现已被HotSport合并 openJDK、oracleJDK

IBM---J9

Microsoft---VM

阿里---TaobaoVM

azul---zing

JVM、JRE、JDK

JDK提供开发环境，包括了JRE和JVM

JRE提供运行环境，包括JVM和类库

JVM提供类加载器、校验器、运行时内存规范、执行引擎（解释器、JIT及时编译器）、垃圾收集器

JVM类加载-生命周期

加载流程

1、加载-loading：

a.把二进制字节（类信息）装载到内存中

b.双亲委派机制：

i.bootstrap、extension、applocation、自定义ClassLoader

ii.lib核心类、lib/ext扩展类、classpath类、自定义path

iii.自低向上检测缓存是否加载、自顶向下进行查找和加载

iv.findInCache -> parent.loadClass -> findClass()

v.自定义类加载器

1.extends ClassLoader

2.overwrite findClass() -> defineClass(byte[] -> Class clazz

c.双亲委派的打破：

i.热启动，热部署，重写loadClass()

1.tomcat 自己的classloader（可以加载同一类库的不同版本）

2.spring

ii.JDK1.2之前，自定义ClassLoader都必须重写loadClass()

iii.ThreadContextClassLoader可以实现基础类调用实现类代码

d.LazyLoading，按需加载，必须初始化 ：

i.–new getstatic putstatic invokestatic指令，访问final变量除外

ii.–java.lang.reflect对类进行反射调用时

iii.–初始化子类的时候，父类首先初始化

iv.–虚拟机启动时，被执行的主类必须初始化

v.–动态语言支持java.lang.invoke.MethodHandle解析的结果为REF_getstatic REF_putstatic REF_invokestatic的方法句柄时，该类必须初始化

e.生产一个class对象指向类信息的内存区域 （方法区（method area））

f.可通过class对象访问类信息

2、验证-verification：

验证class文件是否符合JVM规范，魔数:CAFEBABE

3、准备-preparation：

静态成员变量赋默认值 int 0 objec null

4、解析-resolution：

class文件常量池符号引用转换成内存地址（将类、方法、属性类等符号引用转换成直接引用（内存地址））常量池中的各类符号引用解析为指针、偏移量等内存地址的直接引用。

5、初始化-Initialization:

调用类初始化代码，赋初始值

双亲委派流程图

其他

bootstrap是由C++实现的，getClassLoader返回null值。

为什么需要双亲委派？为了安全，比如自定义java.lang.String覆盖

混合执行 编译执行 解释执行

Java的源代码文件变成计算机可执行的机器指令，需要经过两段编译：

第一段是把.java文件转换成.class文件。

第二段编译是把.class转换成机器指令的过程。

JIT会把部分“热点代码”class翻译成本地机器相关的机器码，并进行优化，然后再把翻译后的机器码缓存起来，以备下次使用。

解释执行->Xint 解释器：bytecode intepreter

启动很快、执行稍慢

编译执行->Xcomp JIT：Just In-Time compiler

启动很慢、执行很快

混合执行->Xmixed 混合模式：解释器+热点代码编译

启动速度较快，对热点代码进行编译后执行很快

1.起始阶段解释执行

2.后续通过热点代码检测后，多次调用的循环、方法进行编译

（检测热点代码配置：-XX:CompileThreshold = 10000）',
  'published',
  '2021-04-07T07:14:33.000Z',
  '技术',
  '微信公众号',
  'https://mp.weixin.qq.com/s?__biz=MjM5MzE2NjkyNg==&mid=100000464&idx=1&sn=844282d7c8c91f53d34f8f55857410d8&chksm=269a61f111ede8e719a39dc827bdec8ecbe7e3a6669668f833eeb6db45b1184060075006bc6a#rd',
  '这篇技术笔记从 JVM 规范、实现以及 JDK、JRE 的关系切入，重点梳理类加载的五个阶段、双亲委派及其打破场景，并对解释执行、即时编译和混合执行作了对照。它保留了学习时搭建知识骨架的过程，适合作为概念索引来阅读。'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  category = excluded.category,
  source = excluded.source,
  source_url = excluded.source_url,
  ai_summary = excluded.ai_summary,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO posts (
  slug,
  title,
  excerpt,
  content,
  status,
  published_at,
  category,
  source,
  source_url,
  ai_summary
) VALUES (
  'wechat-a-cat-that-does-not-cling',
  '总有一只猫不会粘人',
  'Lucky 用第一人称讲述自己的粉红童年、捕鼠功绩和日渐下滑的家庭地位。',
  '01

大家好，我叫陈lucky，据我大哥说，我是被他捡回来的，捡我的日子是他重要的人逝去的日子，他说我是情感的延续，所以我一定是重要的猫，喵~。

大家肯定很好奇我的性别，我是一个男性，但我变态大哥一直认为我是女性。

把我打扮的和妹妹一样，给我买粉红色的铃铛，粉红色的玩具，粉红色的浴巾，我的世界充满了粉红，就连铲屎的铲子都是粉红的...

恐怖至极，就差我吃的猫粮是粉红的了，到时候我可能要拉粉红色的屎...

在粉红色的包围下，久而久之我也信了，我可能真的是妹妹，渐渐的我变成了娘炮，被拍下了一些让我不忍回看的照片。

我就不看了，太丢人了，让我，让我先闭上眼，啊~

这是一个下午，我们在出租屋的时候，我摆好娘娘的poss~，我恨啊...

丧心病狂，还让我学习走位，说我抓老鼠不给力，我很懵逼，这都是些什么玩意儿？看不懂啊，学不会啊，太难了~

看到我懵懂单纯的小眼神了么，所以，朋友们啊，重要的不是你是不是什么，而是你信不信什么，我现在觉得特别有哲理，特别对。

02

我慢慢长大，去看了医生，医生说我是个男孩，那天回家路上我特别开心，原来我是对的。

我觉得医生是这个世界上最伟大的职业，是天使，大哥取掉了我的粉红色铃铛，让我舒服很多。

但其他东西还是粉红色的，他给别人说那些东西比我身价还高，难得换了，这是人说的话吗？？

这些都无所谓了，起码我确定了我是个男子汉，那段时间我特别猛，抓到2...3...呃..几只老鼠。

咦，到底几只呢？现在有些想不起来了，只记得做了个噩梦，那几天的记忆有点模糊，算了不想了，那个噩梦有点恐怖...

03

从那以后，我的伙食好像变好了，相比以往单调的鱼味猫粮，多了些鸡肉味、牛肉味，还吃到了猫妙鲜包，营养膏。

看来他意识到了，我还是有价值的，我又抓了只老鼠，把它叼到大哥面前，准备让他夸我几句，没想到，他跳起来让我滚~，让我叼着老鼠滚~

╮(╯▽╰)╭，老鼠有什么好怕的，真是让本猫难以理解。

不久我们搬了新家，没有了老鼠，让我特别无聊，家庭地位日渐下滑，昵称从lucky变成了傻猫，营养膏也很久没吃上了，猫妙鲜包频率也少 的可怜。

我尝试卖过萌~

打过滚~

装过委屈~

我甚至去抓过几只蚊子，几只蜘蛛，还有一些小虫子，但是好像并没有什么效果，猫妙鲜包已离我远去~。

如果一只可爱的猫拒绝新鲜事物，那就是它要废掉的征兆，我拒绝沦为一只废猫。

我爬到窗台，望着窗外，有点高...

我盯着大门外，看着楼道，有点陌生...

还是当一只废猫比较好伐。',
  'published',
  '2020-08-17T16:02:37.000Z',
  '随笔',
  '微信公众号',
  'https://mp.weixin.qq.com/s?__biz=MjM5MzE2NjkyNg==&mid=100000236&idx=1&sn=7ddb2dd47156065112f20dc1ee6f28f2&chksm=269a62cd11edebdb23c10ac62f7e98e74392b7a676b7f83aa46166bedf001f7ed783371bbe98#rd',
  '文章借 Lucky 的猫眼视角，把被收养、性别误认、捕鼠立功和家庭地位变化串成一篇轻喜剧。夸张的自尊与及时的退缩让这只猫很像人：嘴上拒绝成为“废猫”，面对窗外和楼道时，却仍选择熟悉而安全的生活。'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  category = excluded.category,
  source = excluded.source,
  source_url = excluded.source_url,
  ai_summary = excluded.ai_summary,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO posts (
  slug,
  title,
  excerpt,
  content,
  status,
  published_at,
  category,
  source,
  source_url,
  ai_summary
) VALUES (
  'wechat-start-with-a-small-goal',
  '先定一个小目标，比如挣它一个亿',
  '把宏大愿望拆成可以行动、衡量和按时完成的小目标。',
  '//////////////////////

梦境中的色彩

在心尖上流淌

从这一刻开始

让人心动

/////////////////////

01

设定小目标

王健林在接受一个视频采访栏目中说的：“很多年轻人，有自己目标，比如想做首富是对的，奋斗的方向，但是最好先定一个小目标，比方说我先挣它一个亿。”

这句话当时火遍网络，大部分人觉得嚣张，然而当了解别人身家之后，觉得确实该有这个底气。

一个亿，在一千亿的王健林看来，可能真不是什么钱，相当于我们有10万身家去赚100元，100万赚1000元。

2020年福布斯富豪排行第一的杰夫·贝佐斯1299亿美元和第二的比尔·盖茨1130亿美元，换算成人民币9000多亿，1亿元相比做个首富确实是小的不能再小的目标了。

当我们感叹自己渺小的时候，忽视了这句话的指导意义。

做首富是梦想，是方向，小目标是实现梦想和向着这个方向走的台阶，台阶搭的太大太高了，你是迈不上去的，用力过猛还会摔倒跌伤。

实现目标、完成学习目标的过程是有一定程度的痛苦的，脱离了你的舒适区。

然而有些人他的长期目标非常明确，别人觉得他过程很苦，他自己不觉得苦，他就能坚持下来。

长期目标如果它太长了，太宏大了，会增加这个过程当中的痛苦。

02

SMART原则

目标的范围可大可小，为了实现大目标，在此之中也可以添加一些列的的小目标，设定小的目标，把大的目标细化成一个每天可以坚持完成的事情，渐渐的形成你的习惯。

设定目标时，最好参照SMART原则：

第一个字母S，代表了具体的意思，也就说，好的目标应该是非常清晰具体的，而不是抽象模糊的。具体的目标是“减肥10斤”这样的东西，而不是“我要好的身材”这样比较含糊的话。

第二个字母M，代表可衡量的意思。好的目标，一定要可以衡量的。可以衡量就是在整个事情的进行过程中，来不断对进度加以思考。

第三个字母A，是指目标是可以达成的。如果“减肥10斤”这样的目标对你来说不容易达成，可以拆分为小目标，做20下俯卧撑、跑步2千米、只吃多少热量的食物，这样就容易多了。

第四个字母R，意思是结果导向。好的目标都应该是为了达到最终的结果，如果制定了“减肥10斤”这样的大目标，围绕减肥小目标就不应该包含与减肥无关的，比如“看书多长时间”，这可能是另一个大目标的拆解了。

第五个字母T，指的是“时效性”。时效性，是指完成目标的时间，好的目标一定要有时间限制，必须明确在多久可以达到目标。比如“3个月减肥10斤”、“每天做20下俯卧撑”。

总之，SMART原则就是说：好的目标一定是“具体的、可衡量的、可达成的、结果导向、以及有时效性的”

03

建立信心

在过程中肯定也会有灰心和丧气的时候，这时你可以学一些找到感觉就能掌握的一些技能，比如像游泳，或者骑自行车。

什么叫找着感觉就能掌握呢？比如说你一旦学会了换气，你就会游泳了。很多人他能憋着气在水里边游几下，但是他不会换气，他就游不远。一旦你会换气了，其实他就是一口气的事。一旦你找到这个感觉了，就会游泳了。

一旦你掌握好平衡，掌握好平衡的感觉，你就会骑自行车，而不会摔倒了。学习一些技巧性比较强的东西来增强自己的信心，信心是非常重要的。

不积小流

无以成江海',
  'published',
  '2020-06-22T15:38:21.000Z',
  '随笔',
  '微信公众号',
  'https://mp.weixin.qq.com/s?__biz=MjM5MzE2NjkyNg==&mid=100000130&idx=1&sn=bbdba1aea499e33c156a54cc98933f1a&chksm=269a62a311edebb52271e155464af6fd29f3d31d3475896d9a1407acf7df9830469a169c8bff#rd',
  '文章把流行语重新解释成一套行动方法：方向可以很大，但迈出的台阶必须具体。SMART 原则提供了拆分目标的框架，游泳与骑车的例子则说明，完成一次可感知的进步，也能为漫长过程补充信心。'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  category = excluded.category,
  source = excluded.source,
  source_url = excluded.source_url,
  ai_summary = excluded.ai_summary,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO posts (
  slug,
  title,
  excerpt,
  content,
  status,
  published_at,
  category,
  source,
  source_url,
  ai_summary
) VALUES (
  'wechat-concrete',
  '混泥土',
  '一首借“水、泥与混凝土”玩双关的极短诗。',
  '混泥土

喜欢泥

不是因为泥是水

而是喜欢淤泥混在一起的时刻

那时我是水

- END -',
  'published',
  '2020-04-28T13:46:18.000Z',
  '随笔',
  '微信公众号',
  'https://mp.weixin.qq.com/s?__biz=MjM5MzE2NjkyNg==&mid=100000120&idx=1&sn=41180a3780f6a03608e1191fe3052e38&chksm=269a625911edeb4f3e6ade0af3b57740a51e67ed664198957ef0fb77cb6ee90bc8aff4f2e916#rd',
  '这首极短诗用“混泥土”制造文字错位：水与泥的物理混合，被悄悄转成喜欢一个人的亲密时刻。篇幅虽短，却在“那时我是水”的落点上完成了身份与情感的转换。'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  category = excluded.category,
  source = excluded.source,
  source_url = excluded.source_url,
  ai_summary = excluded.ai_summary,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO posts (
  slug,
  title,
  excerpt,
  content,
  status,
  published_at,
  category,
  source,
  source_url,
  ai_summary
) VALUES (
  'wechat-almost-a-hero',
  '几乎成了英雄',
  '一张奥特曼光盘，让一个普通人开始策划自己的英雄时刻。',
  '现实本就是孤独的，理解它，感受它，发现不一样的自己

01

风雨交加的夜晚，乌云笼罩着整个天空，漆黑的巷子里，他突然蹲下身捡起一张光盘。

顿时...，天空电闪雷鸣，噼里啪啦~~，头顶上空乌云开始旋转汇聚，他高举着光盘，透着月光看清了封面，激动的让忘记了雨水还在身上拍打。

《泰罗奥特曼剧场版》，不知道是哪位武林高手丢失的，不知那位小朋友现在是否哭泣，但注定捡起光盘的小伙子命运就这么被改变了。

看完后，他决定了，不要再做一个普普通通的人。

当然，在他眼里：不是普通人，基本上也就和人不太沾边了，就像奥特曼一样。

他清楚的是必须做一件事情，做一件能让他不再是个普通人的事情。

于是，他注意到了一个人，这个人名声不大好，至于为什么不好，他也不清楚，反正大家都这么说的。

他想，如果能干掉这个人，应该是件很不普通的事情，而且可以说是为民除害，那自己便成了英雄。

为这个想法他兴奋起来了，心跳加速，脸憋得通红。

02

终于，他鼓起勇气尾随着那个人，气息开始放轻，像一个真正的高手。

前面的那人身材高大，大摇大摆的走着，他目光紧盯着那人背影，想找出破绽。

那人一边走，一边提了提裤子，提上去了很多，但还是垮下来了一点，看来并非完全不合身。

走着，突然对左边的大婶破口大骂，像是扫地的灰尘呛到了那人，但那人的气息并未凌乱，他明白自己碰到高手了。

走着，对打太极的老伯啐了口痰，便演练起十二路谭腿，顺势踢了脚旁边发情的泰迪，泰迪看似没事，但他知道其实受了内伤。

正在观察泰迪时，突然，他感到阴风阵阵浑身拔凉，那人回头看了一眼，眼神相当的恶毒，吓得的他屏住呼吸，差点尿了。

那人转身继续走，在前方不远就是路的尽头。

他呼出一口浊气，皱起眉头，迟疑起来：自己可否像奥特曼一样，肩负重任。

03

到路的尽头，他们两人中便有一人的生命也到了尽头！

他很清楚这点，非常清楚。

关键时刻他找到了破绽，那人被卖唱的乞丐吸引了注意力，音箱声巨大：“只要人人都付出一点爱...”.

他提醒自己必须速战速决，他对着那人背影使出了必杀技！

非常巧妙的偷袭！

只见他深深吸了一口气，轻轻地说了声：

“操你妈！”

然后转身潇洒的离去。

从那一刻起，他觉得自己不再是个普通人。',
  'published',
  '2020-08-17T15:55:10.000Z',
  '随笔',
  '微信公众号',
  'https://mp.weixin.qq.com/s?__biz=MjM5MzE2NjkyNg==&mid=100000080&idx=1&sn=cb7739d0b6fd8e4c9978ee4768f8714d&chksm=269a627111edeb67d4db40a5b90e9484882158cd33c91b1be2d4cf20e409773293c9ed4944b3#rd',
  '文章用武侠和奥特曼的语气搭建英雄叙事，却把高潮落在一句轻声的咒骂和迅速离开上。宏大想象与怯懦行动之间的落差构成笑点，也写出了普通人渴望证明自己、又被现实胆量拉回原地的瞬间。'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  status = excluded.status,
  published_at = excluded.published_at,
  category = excluded.category,
  source = excluded.source,
  source_url = excluded.source_url,
  ai_summary = excluded.ai_summary,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO site_settings (key, value)
VALUES ('database_version', '6')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;
