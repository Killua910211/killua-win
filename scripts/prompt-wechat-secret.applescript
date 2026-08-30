set promptResult to display dialog "请粘贴刚刚重新生成的 AppSecret。输入内容不会显示，也不会进入聊天记录。" default answer "" with title "公众号文章安全导入" with hidden answer buttons {"取消", "保存并继续"} default button "保存并继续" cancel button "取消"
set secretValue to text returned of promptResult

if secretValue is "" then
  display alert "AppSecret 不能为空"
  error number -128
end if

set configPath to POSIX file "/Users/admin/Documents/WORK/killua-win/.env.wechat.local"
set configContents to "WECHAT_APP_ID=wx3a20f5349ecca9e9" & linefeed & "WECHAT_APP_SECRET=" & secretValue & linefeed
set configFile to missing value

try
  set configFile to open for access configPath with write permission
  set eof configFile to 0
  write configContents to configFile as «class utf8»
  close access configFile
on error errorMessage number errorNumber
  if configFile is not missing value then
    try
      close access configFile
    end try
  end if
  error errorMessage number errorNumber
end try

return "已保存，可以继续导入。"
