# Apple Health 每日同步：iPhone 快捷指令搭建说明

健康页「03 · 7 日均值」和「04 · 长期趋势」当年的柱子，来自 iPhone 每天推送到网站的 Apple Health 数据。Apple Health 没有服务端接口，只能由手机主动推送。这份说明用 iOS 自带的「快捷指令」完成，不需要装别的 App。

- 接收地址：`https://www.killua.win/api/health/sync`（只写，不提供读取）
- 鉴权：请求头 `Authorization: Bearer <同步令牌>`。令牌单独交付，不写进仓库；丢了就重新生成（见文末）。
- 每次发送最近 10 天。某天自动化没跑成功，下一次成功时会自动补齐；同一天重复发送只会覆盖，不会重复计数。
- 步数、活动能量、距离、锻炼分钟数**只取 Apple Watch 来源**：iPhone 和 Apple Watch 会同时记同一段步行，「按天分组」只会把两边相加（实测约为「健康」App 的两倍）。导入后要在这几个「查找健康样本」里手动加一个条件「来源 是 你的 Apple Watch」（来源是你自己的设备，只能在手机上选）。请求里带 `cumulative_source: watch` 声明这一点，没有声明的这几项会被网站拒收。没戴手表的日子这几项会缺。
- 曾试过逐条读原始样本再在网站去重（提交 `8328746`），数据量太大，真机运行失败，已放弃；服务端仍保留这种格式的解析。
- 网站只保存每天的汇总值（步数合计、睡眠时长等），不保存原始样本、设备或来源。解析规则见 `app/lib/health-sync.ts`。

界面文字以中文 iOS 为准，括号里是英文界面的名称；不同 iOS 版本的措辞可能略有出入。

## 最快的方式：导入生成好的快捷指令

在本仓库目录的 Mac 上运行：

```bash
node scripts/build-health-shortcut.mjs
```

它按下面第二节的结构生成并签名四个文件，令牌已写进请求头：

- `outputs/health-shortcut/Health 同步.shortcut`：七项健康指标，最近 10 天，每天自动运行；
- `Health 回填.shortcut`：静息心率、HRV、血氧与睡眠，最近 60 天，只手动运行一次，用来和 10 月快照核对（330 天的原始睡眠片段约一万段，真机运行失败）；
- `Health 锻炼.shortcut`：健身圆环的锻炼分钟数与站立小时，最近 10 天，每天自动运行。

锻炼与站立单独成一个快捷指令，是因为它们的类型名（`Exercise Time`、`Stand Hour`）没有真机导出样例可对照；万一不对，只影响这一个，不拖垮主同步。「健身」App 里每一次体能训练的明细（类型、时长、距离）快捷指令自带动作读不到，没有做。双击导入到 Mac 的「快捷指令」，开着 iCloud 同步时几分钟内会出现在 iPhone 上；也可以用隔空投送直接发到手机。之后从第三节「第一次运行」开始即可。

生成物含令牌，不要提交或外传（`outputs/` 已被忽略）。若导入后某个「查找健康样本」的类型显示为空、运行时提示「请选择此“健康”样本的类型」，在那个动作里手动选上对应类型即可，其余设置不受影响。

2026-11-11 前两版生成文件的问题与修正（依据写在生成脚本顶部）：第一版把「类型」写成了纯字符串，iOS 编辑器一点类型就闪退、运行报「未找到样本」，已改为 `WFStringSubstitutableState` 结构并换成快捷指令内部的类型名；第二版用「调整日期」算起点，没有往前减，网站报「起点必须早于今天」，已改为「开始日期在最近 N 天内」并发送 `days`。

## 一、准备

1. 「设置」→「App」→「快捷指令」→「高级」，打开 **允许共享大量数据**（Allow Sharing Large Amounts of Data）。第一次回填一年的数据需要它。
2. 准备好同步令牌，后面要原样粘贴。

## 二、新建快捷指令「Health 同步」

打开「快捷指令」App，点右上角 `+` 新建，命名为 **Health 同步**，按顺序加入下面的动作。

### 1. 七个「查找健康样本」

每个指标加一个 **查找健康样本**（Find Health Samples），紧接着加一个 **设定变量**（Set Variable）把结果存成好认的名字。七组的设置如下：

| 类型（Type） | 分组方式（Group By） | 设定变量名 |
| --- | --- | --- |
| 步数（Steps，加「来源 是 Apple Watch」） | 天（Day） | `steps` |
| 活动能量（Active Calories，加「来源 是 Apple Watch」） | 天（Day） | `energy` |
| 步行+跑步距离（Walking + Running Distance，加「来源 是 Apple Watch」） | 天（Day） | `distance` |
| 静息心率（Resting Heart Rate） | 天（Day） | `rhr` |
| 心率变异性（Heart Rate Variability） | 天（Day） | `hrv` |
| 血氧（Oxygen Saturation） | 天（Day） | `spo2` |
| 睡眠（Sleep） | **不分组**（None） | `sleep` |

括号里是快捷指令内部的类型名，和「健康」App 里的叫法不完全一样（活动能量是 Active Calories，血氧是 Oxygen Saturation）。

每个「查找健康样本」里：

- 条件一：**类型** 是 上表中的类型。
- 条件二：**开始日期** **在最近**（is in the last）`10` **天**。七个查找都用同一个天数，下面 `days` 字段也填这个数。
- 步数、活动能量、距离再加条件三：**来源** **是** 你的 Apple Watch。
- **分组方式** 按上表设置。出现「填充缺失」（Fill Missing）开关时保持关闭：没有读数的日子不能当成 0。
- **限制**（Limit）关闭，不限条数。

前六项按天分组；步数、活动能量、距离靠「来源 是 Apple Watch」避免和 iPhone 重复相加；静息心率、HRV、血氧只有手表会记；睡眠必须不分组，网站要拿到每一段的起止时间，才能合并重叠时段、排除「卧床」和「清醒」。

### 2. 发送：获取 URL 内容

动作 **获取 URL 内容**（Get Contents of URL），展开「显示更多」：

- URL：`https://www.killua.win/api/health/sync`
- 方法（Method）：**POST**
- 头部（Headers）：添加一项，键 `Authorization`，值 `Bearer ` 加令牌（Bearer 后面有一个空格）。
- 请求体（Request Body）：**JSON**，然后逐个「添加新字段」，类型都选 **文本**（Text）：

| 键 | 值：选变量 → 再点一下变量选属性 |
| --- | --- |
| `days` | 直接输入 `10`（和上面查找的天数一致） |
| `cumulative_source` | 直接输入 `watch`（声明步数等已只取 Apple Watch） |
| `steps_date` | `steps` → 开始日期 |
| `steps_value` | `steps` → 值 |
| `energy_date` | `energy` → 开始日期 |
| `energy_value` | `energy` → 值 |
| `distance_date` | `distance` → 开始日期 |
| `distance_value` | `distance` → 值 |
| `resting_hr_date` | `rhr` → 开始日期 |
| `resting_hr_value` | `rhr` → 值 |
| `hrv_date` | `hrv` → 开始日期 |
| `hrv_value` | `hrv` → 值 |
| `spo2_date` | `spo2` → 开始日期 |
| `spo2_value` | `spo2` → 值 |
| `sleep_start` | `sleep` → 开始日期 |
| `sleep_end` | `sleep` → 结束日期 |
| `sleep_value` | `sleep` → 值 |

所有「日期」类的值（`*_date`、`sleep_start`、`sleep_end`），点一下变量，把 **日期格式** 设成 **ISO 8601**，并打开 **包括 ISO 8601 时间**。没设也能识别「2026年11月10日 13:30」这类默认格式（按北京时间理解），但 ISO 8601 带时区，最稳。

「Health 锻炼」的字段：`days`；`cumulative_source`（`watch`）；`exercise_date`、`exercise_value`（类型 Exercise Time，按天分组，加「来源 是 Apple Watch」）；`stand_date`、`stand_value`（类型 Stand Hour，不分组，取开始日期和值）。网站按小时去重后数「已站立」的小时数，只有「未站立」记录的日子记 0。

键名必须和上表一字不差。一个列表放进文本字段时，快捷指令会把每一项放一行，网站按行把日期和数值一一配对。

### 3. 看结果（建议保留）

- 动作 **获取词典值**（Get Dictionary Value）：获取 `summary` 的 **值**，词典选「URL 的内容」。
- 动作 **显示结果**（Show Result）：显示上一步的「词典值」。

成功时会看到类似：

> 同步 2026-11-02 之后至 2026-11-11：步数 9 天、活动能量 9 天、步行+跑步距离 9 天、静息心率 8 天、HRV 9 天、血氧 9 天、睡眠 9 天。

某一项写着「未发送」，说明请求体里漏了它的字段；写着「出错」或「丢弃 N 行」，下面会跟着原因和例子。睡眠类别如果有网站不认识的写法，会列在「未识别的睡眠类别」里，原文发给维护者补上即可。

## 三、第一次运行与一次性回填

1. 先手动运行一次「Health 同步」。iOS 会依次询问是否允许读取各项健康数据、是否允许连接 `www.killua.win`，都选允许。看到上面的摘要就说明通了。
2. 回填今年的历史数据（长期趋势里 2026 年那根柱子要用）：在快捷指令列表里长按「Health 同步」→ **复制**，把副本改名为 **Health 回填**，删掉步数、活动能量、距离三个查找及其字段，把其余查找里的 `10` 和 `days` 字段都改成 `60`，手动运行一次。用生成的文件就不用改。它会把大约一年的数据一次发过去，耗时可能要几十秒。
3. 回填成功后，「Health 回填」可以删掉；以后只靠每天的「Health 同步」。

## 四、设置每天自动运行

自动化里依次加两个「运行快捷指令」：「Health 同步」和「Health 锻炼」。

「快捷指令」→ 底部「自动化」→ 右上角 `+` → **特定时间**（Time of Day）：

- 时间：选一个你通常正在用手机的时段，例如 12:30。
- 重复：每天。
- 选 **立即运行**（Run Immediately）；「运行时通知」看个人习惯。
- 下一步选择快捷指令「Health 同步」。

iPhone 锁屏时，iOS 不允许任何快捷指令读取健康数据，那一次会失败。不必在意：每次都发最近 10 天，之后任意一次成功都会把漏掉的日子补上。

## 五、排错

| 现象 | 原因与处理 |
| --- | --- |
| 返回「同步令牌无效」（401） | 头部的键要是 `Authorization`，值是 `Bearer`、一个空格、令牌，前后不能有多余字符。 |
| 返回「请求体不是合法的 JSON」（400） | 「请求体」没选 JSON。 |
| 返回「缺少 days」或「没有收到任何指标字段」（422） | 键名拼错，或 `days` 没加。 |
| 返回「起点必须早于今天」（422） | `days` 小于 3，或填成了日期。 |
| 某项「日期 N 行、数值 M 行，对不上」 | 同一个指标的两个字段选了不同的变量。 |
| 步数等提示「需要只取 Apple Watch 来源」 | 请求里没有 `cumulative_source: watch`，多半是旧版快捷指令；换新版并在这几个查找里加「来源 是 Apple Watch」。 |
| 步数明显是「健康」App 的两倍 | 那几个查找漏加了「来源 是 Apple Watch」。 |
| 回填时报错或超时（例如 1102、503） | 一次发送太多。先把天数（七个查找和 `days`）改成 165 跑一次；再加一个「结束日期 不在最近 165 天内」之类的条件跑剩下的部分，`days` 填 330。同一天重复发送只会覆盖，没有重复计数的问题。 |
| 自动化总是失败 | 多半是触发时手机锁着。换一个你更常用手机的时间。 |

## 六、更换令牌

令牌泄露或遗失时，在本仓库目录下：

```bash
openssl rand -base64 36 | tr '+/' '-_' | tr -d '=\n' > .health-sync-token
```

```bash
npx wrangler secret put HEALTH_SYNC_TOKEN < .health-sync-token
```

然后把快捷指令里 `Authorization` 头的令牌换成新的，或重新运行 `node scripts/build-health-shortcut.mjs` 生成并导入。`.health-sync-token` 已被 `.gitignore` 忽略，不会进仓库。
