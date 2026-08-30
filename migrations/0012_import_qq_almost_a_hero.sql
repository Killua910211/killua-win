-- Re-imported from the owner's QQ Space screenshot, replacing a previously removed unpublished-material copy.
INSERT INTO posts (slug, title, excerpt, content, status, published_at, category, source, source_url, ai_summary)
VALUES (
  'qq-almost-a-hero',
  '几乎成了英雄',
  '一个普通人捡到 U 盘后，开始策划自己的英雄时刻。',
  '一个风雨交加的夜晚，乌云笼罩着整个天空，突然他蹲下身捡起一个U盘，顿时天空电闪雷鸣，他的头顶上空乌云旋转汇聚，他高举着U盘仔细看看，激动的忘记了雨水正他身上拍打，这注定是一个邪恶的开端，非常邪恶。

他全神贯注的看着电脑屏幕，屏幕中那个男人一次又一次，然而依然坚挺。独特的姿势和强大的持久深深刺激着他，这种视觉冲击对他来说是前所未有的，看得他心潮澎湃，气血翻涌。

没错，他看的是宇宙最持久最凶猛的男人，太古奥特曼--诺亚。

自从看完奥特曼过后，他决定不要做一个普通人。

当然，在他眼里：不是普通人基本上也就和人不太沾边了，就像奥特曼一样。

他清楚的是现在他必须做一件事情，做一件能让他不再是个普通人的事情。

于是，他注意到了一个人，这个人名声不大好，至于为什么不好，他也不清楚，反正大家都这么说的。他想，如果能干掉这个人，应该是件很不普通的事情，而且可以说是为民除害，那自己便成了英雄。

为这个想法他着实兴奋起来，双拳紧握，小脸憋得通红。

于是，他尾随着那个人，开始运气，像一个真正的高手。

前面的那人走得很慢，步子却很大。他目光紧盯着那人脚步，似乎想看出破绽。水泥路路面，那人走了一步，却没留下脚印，让他震惊的是往后的每一步都没留下脚印，而且每个脚步间的距离也完全不一样。

那人一边走，一边提起了提裤子，还对着左边的大婶大骂糟糕，对右边的老伯吐痰扬拳，顺便踢了一脚挡道的狗。

他心中暗惊，那人看似在漫不经心地走着，但实在暗中催动着身体里的内力。他的手足四肢已完全协调，嘴也很协调。他明白自己碰到高手了，万中无一的。

突然，他感到阴风阵阵浑身拔凉，那人回头看了一眼，那眼神相当的恶毒，吓得他差点尿了。他微眯着眼，摸了摸脑二头肌。不禁迟疑起来：自己是否可以挑起建设和谐社会的重任。

在前方不远就是路的尽头。

到了那里，他们两人中便有一人的生命也到了尽头！

他很清楚这点，非常清楚。

那人的确是很可怕的对手！他提醒自己必须速战速决，他开始运气，气息直至顶峰。他对着那人的背影使出了必杀技！非常巧妙的偷袭！一招致命！

只见他深深出了一口气，轻轻地说了声：

“擦你妈！”

然后转身潇洒的离开。

从那一刻起，他觉得他不再是个普通人，不，他觉得他不再是个人。',
  'published', '2016-08-29T14:06:00.000Z', '随笔', 'QQ空间「独行虫 / CHENKEXI」', NULL,
  '文章用奥特曼、武侠与英雄叙事抬高主角的想象，最终却把高潮落在一句轻声的咒骂和转身离开上。宏大自我想象与现实胆量之间的落差构成黑色幽默，也写出普通人想证明自己的笨拙冲动。'
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, excerpt=excluded.excerpt, content=excluded.content, status=excluded.status, published_at=excluded.published_at, category=excluded.category, source=excluded.source, source_url=excluded.source_url, ai_summary=excluded.ai_summary, updated_at=CURRENT_TIMESTAMP;

INSERT INTO site_settings (key, value) VALUES ('database_version', '12')
ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP;
