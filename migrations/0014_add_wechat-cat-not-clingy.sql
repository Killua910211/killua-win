-- 由 scripts/mkpost.mjs 从 wechat-cat-not-clingy.md 生成，勿手工编辑正文里的引号。
INSERT INTO posts (slug, title, excerpt, content, status, published_at, category, source, source_url, ai_summary)
VALUES (
  'wechat-cat-not-clingy',
  '总有一只猫不会粘人',
  '一只被当作“妹妹”养大的公猫，在粉红世界、抓鼠战绩和日渐下滑的家庭地位中讲述自己的成长。',
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

从那以后，我的伙食好像变好了，相比以往单调的鱼味猫粮，多了些鸡肉味、牛肉味、还吃到了猫妙鲜包，营养膏。

看来他意识到了，我还是有价值的，我又抓了只老鼠，把它叼到大哥面前，准备让他夸我几句，没想到，他跳起来让我滚~，让我叼着老鼠滚~

ヽ(´▽｀)ノ，老鼠有什么好怕的，真是让本猫难以理解。

不久我们搬了新家，没有了老鼠，让我特别无聊，家庭地位日渐下滑，昵称从lucky变成了傻猫，营养膏也很久没吃上了，猫妙鲜包频率也少的可怜。

我尝试卖过萌~

打过滚~

装过委屈~

我甚至去抓过几只蚊子，几只蜘蛛，还有一些小虫子，但是好像并没有什么效果，猫妙鲜包已离我远去~。

如果一只可爱的猫拒绝新鲜事物，那就是它要废掉的征兆，我拒绝沦为一只废猫。

我爬到窗台，望着窗外，有点高...

我盯着大门外，看着楼道，有点陌生...

还是当一只废猫比较好伐。',
  'published',
  '2026-08-31T03:49:00.000Z',
  '随笔',
  '公众号「一意孤行的猪」',
  NULL,
  '文章借猫的第一人称讲述被捡回、误认性别、抓鼠与家庭地位变化，表面是轻松的养猫趣事，也写到了身份认同、价值感与被需要。'
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, excerpt=excluded.excerpt, content=excluded.content, status=excluded.status, published_at=excluded.published_at, category=excluded.category, source=excluded.source, source_url=excluded.source_url, ai_summary=excluded.ai_summary, updated_at=CURRENT_TIMESTAMP;

INSERT INTO site_settings (key, value) VALUES ('database_version', '14')
ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP;
