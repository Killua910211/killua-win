-- 0013_fix_imported_metadata.sql
--
-- 修什么
-- ------
-- 修复 QQ 空间 / 微信正文导入管线遗留的元数据与空白残留，共四类：
--   1. 标题：0004 的抓取脚本把页面上一条游离的日期行当成了标题（qq-1318351361 的
--      title 字面量就是 '2016-11-28'，而它自己的 published_at 是 2011-10-11），
--      另有抓取残留的半个双引号（qq-1228847985）和被覆盖掉的全角逗号
--      （talking-with-jitou-town）。
--   2. 摘要：0004 用「正文前 78 字 + 省略号」的机械截断生成 excerpt，于是大量摘要
--      断在半句中间（「那就根本对不」「他的眼神会有些」），少数还把正文首行的日期
--      分节符、一声叹息、QQ 空间行尾填充符当成了摘要正文。更严重的是，0004 的
--      `ON CONFLICT(slug) DO UPDATE SET excerpt = excluded.excerpt` 把 0003 里
--      人工撰写的 4 条摘要（含 1 条标题）一起覆盖回了机器抽取版本。
--   3. 微信三篇（wechat-han-yao-fu / wechat-hunger / wechat-na）的正文首行与 title
--      逐字重复——0010 只清掉了正文里的来源署名行，标题行还留着。
--   4. 空白：QQ 空间导出的 HTML 带 &shy;（U+00AD）软连字符、行尾 U+3000 全角空格
--      填充、以及行尾游离的半角连字符 '-'。整行只由全角空格构成的行会在页面上渲染成
--      多余的空段落。
--
-- 为什么这些数据会坏
-- ------------------
-- 0003 是人工录入的 4 篇（标题、摘要、正文都排过版）；0004 是全量抓取导入，用
-- slug 冲突覆盖写回，把这 4 篇的人工成果一并降级。抽取器本身只会「取第一行当标题、
-- 取前 N 字当摘要」，遇到 QQ 空间那种把日期、分节符、填充符混排进正文的页面就会失手。
--
-- 幂等性
-- ------
-- 所有 UPDATE 都按 slug 精确定位。写死值的 UPDATE 天然幂等；REPLACE / SUBSTR 类
-- 的改写都做成「替换后不再匹配自身模式」，重复执行结果不变。

------------------------------------------------------------------------------
-- 1. 标题
------------------------------------------------------------------------------

-- 抓取时把页面上一条游离日期行当成了标题。原标题在 migrations、git 历史和任何
-- 抓取脚本里都不存在（QQ 抓取脚本从未入库），此处依正文核心意象重拟：全文以
-- 「这片沙漠的风沙……是无法从鞋里倒出去的」开篇，以「即便有鞋，谁又愿意去看他鞋中
-- 的沙」收尾。若日后能取回 QQ 空间原页面，应以原标题为准。
UPDATE posts SET title = '鞋中的沙', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1318351361' AND title <> '鞋中的沙';

-- 标题尾部挂着一个没有配对开引号的半角双引号，属抓取残留。只去掉尾引号，不擅自补首引号。
UPDATE posts SET title = '写给你们看', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1228847985' AND title <> '写给你们看';

-- 0003 人工录入的是全角逗号，被 0004 覆盖成了抓取版的半角逗号。
-- 注意：其他标题里的半角标点（何以解愁? / 难免会脆弱. / 有一只,它叫烟）是作者本人的
-- 书写习惯，不在此规范化。
UPDATE posts SET title = '2010，我想和机投镇谈谈', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'talking-with-jitou-town' AND title <> '2010，我想和机投镇谈谈';

------------------------------------------------------------------------------
-- 2. 摘要
------------------------------------------------------------------------------

-- 2a. 恢复 0003 的人工摘要（被 0004 的 ON CONFLICT DO UPDATE 覆盖成机械截断）

-- 原值只剩 '2010'（正文首行被机械截断到 4 个字符）。
UPDATE posts SET excerpt = '我骑着名叫“2010”的电动车，在机投镇的夜路上和过去、孤独与外婆留下的水饺谈谈。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'talking-with-jitou-town' AND excerpt <> '我骑着名叫“2010”的电动车，在机投镇的夜路上和过去、孤独与外婆留下的水饺谈谈。';

-- 原值断在「过往不与」，原句为「过往不与新人讲」。
UPDATE posts SET excerpt = '成年人多半如此——各自有渡口，方向不同，孤独是常态。察觉本身，就是重新与世界相连的一步。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'loneliness-is-not-a-misunderstanding' AND excerpt <> '成年人多半如此——各自有渡口，方向不同，孤独是常态。察觉本身，就是重新与世界相连的一步。';

-- 原值把 0004 正文里的标点残缺『那个啥 ！。』一并带进了摘要。
UPDATE posts SET excerpt = '从 Java、韩寒、象棋和一辆想取名“2010”的电动车，写到那个只能一路向前的卒。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'pawn-seven-moves-forward' AND excerpt <> '从 Java、韩寒、象棋和一辆想取名“2010”的电动车，写到那个只能一路向前的卒。';

-- 原值虽断在句末，但仍是正文开头的原样搬运，丢掉了 0003 概括的立意。
UPDATE posts SET excerpt = '一只吸不住的火罐，如何变成关于分工、效率与工具性异化的寓言。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'what-i-think-about-when-cupping' AND excerpt <> '一只吸不住的火罐，如何变成关于分工、效率与工具性异化的寓言。';

-- 2b. 补足 / 收拢被截断在半句中间的机械摘要（一律截到最近的句末标点，逐字取自正文）

-- 原值断在『那就根本对不』，补足到句末的『了!』。保留作者的半角标点原貌。
UPDATE posts SET excerpt = '有句话叫笨那什麽鸟飞，笨人先学!你人笨,不是你的错,你还不学就是你的错了,其实不学也不是大错,你不学也可能是懒,但是你连学的那个意识都没有,那就根本对不了!', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1262186130' AND excerpt <> '有句话叫笨那什麽鸟飞，笨人先学!你人笨,不是你的错,你还不学就是你的错了,其实不学也不是大错,你不学也可能是懒,但是你连学的那个意识都没有,那就根本对不了!';

-- 原值断在『左……』（原文为「左嘴角微翘」）。
UPDATE posts SET excerpt = '一个天气晴朗有点微“疯”的晚上，太阳不知道在哪个方向，月亮忘了打卡上班，但天空依旧很黑。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1283972097' AND excerpt <> '一个天气晴朗有点微“疯”的晚上，太阳不知道在哪个方向，月亮忘了打卡上班，但天空依旧很黑。';

-- 该文通篇分号排比，80 字内无句号，故截到分号处；排比体保留省略号是自然的。
UPDATE posts SET excerpt = '我怕明天上课又迟到；我怕又做腑卧撑；我怕我又做100个；我怕我妈又开始担心我的未来；我怕对面楼房一直修不好……', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1288877539' AND excerpt <> '我怕明天上课又迟到；我怕又做腑卧撑；我怕我又做100个；我怕我妈又开始担心我的未来；我怕对面楼房一直修不好……';

-- 原值断在『一个观点一……』。
UPDATE posts SET excerpt = '关于烟的事情太多了，毕竟它陪伴了我五六年了，回忆就唏嘘不已，现在说的话就有点谈笑风生，不能深刻，只能玩个笑。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1291978348' AND excerpt <> '关于烟的事情太多了，毕竟它陪伴了我五六年了，回忆就唏嘘不已，现在说的话就有点谈笑风生，不能深刻，只能玩个笑。';

-- 原值断在『集腋成袭……』。
UPDATE posts SET excerpt = '以前总是觉得自己是心有余而力不足。反观现在心也有了，力也蓄足了，狠下心，用力的拍下去，发现拍到铁板上了，挺痛的，因为力是相互的。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1300636131' AND excerpt <> '以前总是觉得自己是心有余而力不足。反观现在心也有了，力也蓄足了，狠下心，用力的拍下去，发现拍到铁板上了，挺痛的，因为力是相互的。';

-- 原值断在『于是我就尽量……』。
UPDATE posts SET excerpt = '每天晚上我都睡的很晚，不是不困，而是不想睡，强迫自己不要睡，我似乎得了强迫症，我很忧郁，因为我总觉的一天什么都没干就这么过去了，实在不甘心！', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1310027446' AND excerpt <> '每天晚上我都睡的很晚，不是不困，而是不想睡，强迫自己不要睡，我似乎得了强迫症，我很忧郁，因为我总觉的一天什么都没干就这么过去了，实在不甘心！';

-- 原值断在『莫名其妙的忧……』。
UPDATE posts SET excerpt = '曾经做过一个心里测试：如果在沙漠中突然看见半杯水，你会怎么样。我想：这水可能有毒，但是逼不得已我会喝。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1316589857' AND excerpt <> '曾经做过一个心里测试：如果在沙漠中突然看见半杯水，你会怎么样。我想：这水可能有毒，但是逼不得已我会喝。';

-- 原值断在『神奇的魔法……』；此处保留完整首句，第二句截去后半个从句。
UPDATE posts SET excerpt = '荒野沙漠，漫天风沙一望无垠。听说闯荡江湖、盖世功成必须穿过这条沙漠。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1318351361' AND excerpt <> '荒野沙漠，漫天风沙一望无垠。听说闯荡江湖、盖世功成必须穿过这条沙漠。';

-- 原值断在『眼神会有些……』，补足到句末的『闪躲。』。
UPDATE posts SET excerpt = '他是个自卑、自闭的人，他可以听一首歌听一个通宵，背歌词，然后也不唱给谁听，当别人问起那首让他听一整晚的歌名的时候，他总有点不好意思，羞涩，他的眼神会有些闪躲。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1413995653' AND excerpt <> '他是个自卑、自闭的人，他可以听一首歌听一个通宵，背歌词，然后也不唱给谁听，当别人问起那首让他听一整晚的歌名的时候，他总有点不好意思，羞涩，他的眼神会有些闪躲。';

-- 2c. 摘要抽到了正文里的非正文成分（日期分节符、一声叹息、行尾填充符）

-- 原值是 '―05-xxx― -'：正文首行的日期分节符加一个 QQ 空间行尾填充符，无信息量。改为第一节正文，保留作者用全角空格代替换行的原貌。
UPDATE posts SET excerpt = '今天天气很一般　但是心情很不好　上课没听老师说什麽　独自思考关于神经病的想法……', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1308920831' AND excerpt <> '今天天气很一般　但是心情很不好　上课没听老师说什麽　独自思考关于神经病的想法……';

-- 原值是 '哎… ­'（正文首行的一声叹息 + U+00AD 残留），len=4，无信息量。改为正文第二段整句，保留半角标点原貌。
UPDATE posts SET excerpt = '人都不知足,知足就不上进,不知足就贪婪,矛盾啊,难道就没有平衡点!', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1228847985' AND excerpt <> '人都不知足,知足就不上进,不知足就贪婪,矛盾啊,难道就没有平衡点!';

-- 原值把小节标题『小场面』混进了开头，又断在『多大一声，9……』。
-- 这里只做两件事：去掉混进来的小节标题、把截断补到句末。用的是正文原句，
-- 不概括、不改写 —— 这是作者本人的文字，本迁移的职责是清理导入残留，不是重写摘要。
UPDATE posts SET excerpt = '今天早上上班，在下公交车的时候耍帅，低着头小跑，在上天桥的时候，突然脑壳就撞到扶手（铁的）了，“嘭”，退了几步，情不自禁的“哎哟”了多大一声，9点过，人很多，太丢脸了。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1263815149' AND excerpt <> '今天早上上班，在下公交车的时候耍帅，低着头小跑，在上天桥的时候，突然脑壳就撞到扶手（铁的）了，“嘭”，退了几步，情不自禁的“哎哟”了多大一声，9点过，人很多，太丢脸了。';

-- 2d. 摘要尾部的不可见脏字符（QQ 空间 &shy; 与行尾填充符），只删残留、不改字

-- 尾部原有一个 U+00AD 软连字符。
UPDATE posts SET excerpt = '人生如戏，这句词这几天在小脑里闪过，仔细一想，有那么点意思。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1260204741' AND excerpt <> '人生如戏，这句词这几天在小脑里闪过，仔细一想，有那么点意思。';

-- 尾部原有一个游离的半角连字符（该文正文有 8 行以孤立 '-' 结尾，是行尾填充符）。
UPDATE posts SET excerpt = '如果心里没有任何屏障，什么会长趋直入，直达心灵。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1264776092' AND excerpt <> '如果心里没有任何屏障，什么会长趋直入，直达心灵。';

-- 同上，尾部游离半角连字符。
UPDATE posts SET excerpt = '疯子常说，滚。特别有韵味，学也学不来。', updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1313065153' AND excerpt <> '疯子常说，滚。特别有韵味，学也学不来。';

------------------------------------------------------------------------------
-- 3. 正文首行与标题逐字重复（微信三篇）
--
-- 0010 只移除了正文里的来源署名行，重复的标题行还在。用 INSTR 锚定开头 + SUBSTR
-- 切除，比裸 REPLACE 安全：wechat-na 的正文第三行同样以「呐，」开头，必须精确匹配
-- 「呐 + 两个换行」才不会误伤；wechat-han-yao-fu 的第二行「宋代：吕蒙正」是有效的
-- 作者署名，必须保留。切完后开头不再匹配，故幂等。
------------------------------------------------------------------------------

UPDATE posts
SET content = SUBSTR(content, LENGTH('破窑赋 / 寒窑赋 / 劝世章' || char(10) || char(10)) + 1),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'wechat-han-yao-fu'
  AND INSTR(content, '破窑赋 / 寒窑赋 / 劝世章' || char(10) || char(10)) = 1;

UPDATE posts
SET content = SUBSTR(content, LENGTH('饥饿' || char(10) || char(10)) + 1),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'wechat-hunger'
  AND INSTR(content, '饥饿' || char(10) || char(10)) = 1;

UPDATE posts
SET content = SUBSTR(content, LENGTH('呐' || char(10) || char(10)) + 1),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'wechat-na'
  AND INSTR(content, '呐' || char(10) || char(10)) = 1;

------------------------------------------------------------------------------
-- 4. 0004 覆盖 0003 时带进来的正文退化
--
-- 只修 0003 有确凿原文可比对的两处标点残缺和三处丢失的段落空行。
-- talking-with-jitou-town 的正文整体是否回滚到 0003 版本留给作者定夺（见文末说明）。
------------------------------------------------------------------------------

-- 0003 原文为『那个啥！有时候』，0004 抓取版多出一个句号和两个半角空格。
UPDATE posts
SET content = REPLACE(content, '那个啥 ！。 有时候', '那个啥！有时候'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'pawn-seven-moves-forward'
  AND INSTR(content, '那个啥 ！。 有时候') > 0;

-- 0003 原文为『有没有？他没有』。
UPDATE posts
SET content = REPLACE(content, '有没有？。 他没有', '有没有？他没有'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'pawn-seven-moves-forward'
  AND INSTR(content, '有没有？。 他没有') > 0;

-- 恢复 0003 里被 0004 抹掉的 3 处段落空行（否则三组本该分段的句子会被粘成一段）。
-- 替换后模式变成两个换行，不再匹配单换行的搜索串；WHERE 里同样带 INSTR 守卫，
-- 因此重跑既不改正文、也不会刷新 updated_at。
UPDATE posts
SET content = REPLACE(content, '还是回家吧。' || char(10) || '旧人不知我近况，新人不知我过往；', '还是回家吧。' || char(10) || char(10) || '旧人不知我近况，新人不知我过往；'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'loneliness-is-not-a-misunderstanding'
  AND INSTR(content, '还是回家吧。' || char(10) || '旧人不知我近况，新人不知我过往；') > 0;

UPDATE posts
SET content = REPLACE(content, '有些话告诉了风，风会告诉整片森林。' || char(10) || '成年人多半如此——各自有渡口，方向不同，孤独是常态。', '有些话告诉了风，风会告诉整片森林。' || char(10) || char(10) || '成年人多半如此——各自有渡口，方向不同，孤独是常态。'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'loneliness-is-not-a-misunderstanding'
  AND INSTR(content, '有些话告诉了风，风会告诉整片森林。' || char(10) || '成年人多半如此——各自有渡口，方向不同，孤独是常态。') > 0;

UPDATE posts
SET content = REPLACE(content, '短期目标、长期方向、维度层次，都有大致轮廓。' || char(10) || '所以我的问题并不在这两点，而在第三点——我如何存在于他人的眼光之中。', '短期目标、长期方向、维度层次，都有大致轮廓。' || char(10) || char(10) || '所以我的问题并不在这两点，而在第三点——我如何存在于他人的眼光之中。'),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'loneliness-is-not-a-misunderstanding'
  AND INSTR(content, '短期目标、长期方向、维度层次，都有大致轮廓。' || char(10) || '所以我的问题并不在这两点，而在第三点——我如何存在于他人的眼光之中。') > 0;

------------------------------------------------------------------------------
-- 5. 导入残留空白清理
--
-- 每篇按同一条流水线改写，顺序固定：
--   (1) 删 U+00AD 软连字符（QQ 空间 HTML 的 &shy; 填充符，页面上不可见，但会污染
--       搜索、字数统计和摘要）。
--   (2) 删「行尾游离的半角连字符 '-'」。全库 45 处，分布在 7 篇里，全部是 QQ 空间的
--       行尾填充符；已逐条核对，没有一处是作者当破折号用的（也没有任何一行以 '--'
--       结尾）。qq-1313065153 里另有 11 个整段只有一个 '-' 的段落，同样在此清掉。
--   (3) 行尾 rstrip 全角空格 U+3000 与半角空格。用二分长度（32/16/8/4/2/1）一次剥完，
--       最长的一行是 qq-1303301025 的 34 个连续全角空格；半角空格的行尾最长只有 1 个，
--       而且全部是被 U+00AD 挡在后面、删掉 SHY 之后才露出来的。
--       *** 只删「换行之前」的全角空格，所以段首缩进不受影响 ***：作者的行首缩进是
--       有意义的版式（标准 2 个；qq-1311155046 / qq-1311665932 / qq-1312453540 通篇
--       稳定用 4 个；5 个以上是居中的小节名和分隔线；qq-1302080445 与
--       talking-with-jitou-town 的落款是 48 / 8 个全角空格的右对齐），一律保留。
--   (4) 把 3 个以上的连续换行压回 2 个。整行只由全角空格构成的行经 (3) 之后变成空行，
--       夹在原有的 \n\n 之间就会形成 3~6 连换行，也就是页面上多出来的空段落，在这里
--       一并消掉。
--   (5) TRIM 掉首尾换行（步骤里为了让最后一行也能走 rstrip，临时补了一个换行）。
--
-- 每一步的输出都不再匹配自己的搜索模式，整条流水线幂等。
------------------------------------------------------------------------------

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1228847985'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1260204741'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1262186130'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1263815149'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1264776092'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1274897110'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1278013029'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1283972097'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1288877539'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1298661104'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1303301025'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1304680939'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1308920831'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1311155046'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1311665932'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

UPDATE posts
SET content = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10)),
    updated_at = CURRENT_TIMESTAMP
WHERE slug = 'qq-1313065153'
  AND content <> TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(content, char(173), '') || char(10), '-　' || char(10), char(10)), '- ' || char(10), char(10)), '-' || char(10), char(10)), ' ' || char(10), char(10)), '　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　　　　　　　　　' || char(10), char(10)), '　　　　　　　　' || char(10), char(10)), '　　　　' || char(10), char(10)), '　　' || char(10), char(10)), '　' || char(10), char(10)), ' ' || char(10), char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10) || char(10) || char(10), char(10) || char(10)), char(10));

------------------------------------------------------------------------------
-- 6. 版本号
------------------------------------------------------------------------------

INSERT INTO site_settings (key, value)
VALUES ('database_version', '13')
ON CONFLICT(key) DO UPDATE SET
  value = excluded.value,
  updated_at = CURRENT_TIMESTAMP;

------------------------------------------------------------------------------
-- 刻意没有在本迁移里做的事
------------------------------------------------------------------------------
--
-- (a) 【行内全角空格，盘点给的是 medium，实测后判定不能脚本化】
--     盘点建议「qq-1308920831 / qq-1298661104 / qq-1263815149 三篇保持原样，其余 9 篇
--     的行内成串可以压成一个半角空格或直接删」。逐条看过这 9 篇的全部行内 U+3000 之后，
--     结论是那条分界线不成立——这 9 篇里的行内全角空格承担的是同一种「代替换行」的语义，
--     几乎全部紧跟在句末标点之后：
--         qq-1262186130  「…那就根本对不了!　闲人（仙人）？废物（吠物）？」
--         qq-1260204741  「…就晓得死!　及然如此那现在就去死…」
--         qq-1264776092  「…就算不是,也不能。　那就一个人，哭的让人听不见…」
--         qq-1228847985  「…哪个容易退下呢？　　　这貌似又要考虑…」
--     删掉会把句子粘成一坨（「对不了!闲人（仙人）？」），换成半角空格又与作者通篇的
--     中文排版不符。两种做法都不是「修复残留」而是「改写版式」，因此整体保留原样。
--     真要处理，应当逐处人工判断把 U+3000 换成换行，不适合放在迁移里。
--     （行尾和整行的全角空格是纯排版垃圾，已在第 5 节清理。）
--
-- (b) 【qq-1301676848『卡农』与 qq-1373953433『呵呵』的分类，盘点 confidence: low】
--     两篇都是通篇分行的诗，结构与已归入「诗歌」的 qq-jump『跳』、
--     wechat-going-astray『走火入魔』相同，但目前 category = '随笔'。这是编辑判断
--     而不是数据损坏——作者可能有意把它们当随笔发。留给作者决定，本迁移不动。
--
-- (c) 【talking-with-jitou-town 的正文是否整体回滚到 0003 版本，盘点 confidence: low】
--     0004 版本相对 0003 有明确退化（落款『——ckx』退化成『(8 个全角空格) ---ckx』，
--     两处『……』退化成『…』，『2-0-1-0？』退化成半角『?』，一句结尾的句号丢成了逗号），
--     但同时也多了 22 个字和多处对白之间的空行，未必整体是退步。全文回滚属编辑决策，
--     留给作者定夺；本迁移只修了它的 title 和 excerpt。
--
-- (d) 【source_url 的空字符串，盘点说有 6 篇，复核后不存在】
--     盘点称 wechat-na / wechat-hunger / wechat-going-astray / wechat-han-yao-fu /
--     qq-jump / qq-almost-a-hero 的 source_url 是 '' 而非 NULL。在 0001..0012 重放出的
--     库上实测：`SELECT COUNT(*) FROM posts WHERE source_url = ''` 返回 0，这 6 篇的
--     `typeof(source_url)` 全部是 'null'。数据已经是一致的，无需修改。
--
-- (e) 【作者本人的书写习惯，一律不规范化】
--     标题和正文里的半角标点（何以解愁? / 难免会脆弱. / 有一只,它叫烟 /
--     非常牛逼武功秘籍(1)）、『...，』、『。。。』、以及大量连续 2+ 半角空格
--     （qq-1291976850 有 65 处），都是作者 2008–2013 年的原貌，不是导入残留。
