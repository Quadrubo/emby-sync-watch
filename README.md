# HTTPS版本的使用方式
1) 在server文件夹下添加自己的证书与密码your-domin.com.pfx, password.txt
2) 修改index.js中10、11行为自己添加的证书
3) 安装https版本的扩展
4) 和正常版本一样启动服务器

# Emby 同步观看
用于在 Emby 上同步视频观看的 Chrome 扩展/NodeJS 服务器。
这是我的第一个 Chrome 扩展，所以请对我温柔点。代码远不是很好，但它有效:)

# 需要标志设计师
* 如果您想帮助我为扩展设计徽标，请通过 Discord @ Quadrubo#2536 与我联系，或者直接回答我发布的有关此扩展的任何地方。
* 任何帮助，将不胜感激 ：）

# 安装客户端（扩展）
1) Emby Sync Watch 被 Chrome 网上商店接受了！前往 [Emby Sync Watch](https://chrome.google.com/webstore/detail/emby-sync-watch/cabhbnblooihogkhajehgmohhipnbach) 下载。跳到第 8) 步，如果您想手动下载它，请继续第 2 步)。
2) 从 Chrome 扩展 ("emby.sync.watch.EXTENSION. ... .zip") 下载最新的 [Release](https://github.com/Quadrubo/emby-sync-watch/releases)发布选项卡。
3) 将 Zip 文件解压缩到您选择的文件夹中。
4) 打开 Chrome 并前往：“chrome://extensions/”。
5) 勾选屏幕右上角的“开发者模式”框。
6) 点击“加载解压后的扩展”并选择您在步骤 2 中创建的文件夹。
7) 扩展现在显示在屏幕的右上角:)
8) 如果您想了解有关如何连接到服务器的更多信息，请转到 [使用](https://github.com/Quadrubo/emby-sync-watch#usage-extension)。

# 设置服务器
1) 从releases下载最新的[Release](https://github.com/Quadrubo/emby-sync-watch/releases)("emby.sync.watch.SERVER.....zip")标签。
2) 将 Zip 文件解压缩到您选择的文件夹中。
3) 转到 https://nodejs.org/en/download/ 并在您的计算机上安装 nodejs。
4) 转到您在步骤 2 中解压缩的文件夹。现在您可以：
    1) 点击“run-server.bat”启动Server
    2) 通过打开命令提示符并键入“node .\index.js”来启动服务器。
6）如果一切顺利，服务器现在应该说“服务器启动”和它正在监听的端口。
7) 如果您想编辑端口，只需打开服务器创建的 port.json 文件并更改端口。之后重启服务器。
7) 如果您想通过 Internet 使用服务器，请在您的路由器上转发 TCP 端口 8082（或您自己设置的端口）。

# 用法（扩展）

1) 在安装时，扩展应该打开一个网页，您可以在其中创建配置文件。
1) 打开 Emby 网页并启动您要观看的视频。
3) 单击屏幕右上角的 Chrome 扩展程序，如果没有，请单击拼图，然后单击扩展程序。
4) 选择您要连接的配置文件，如果您尚未创建配置文件，请返回步骤 1)。如果您想手动连接，请不要选择配置文件，只需手动输入服务器/端口。
2）连接到服务器，如果一切设置正确，您应该会看到一个弹出窗口，说明您已连接。
3) 从现在开始加入的每个人都可以控制您的视频，反之亦然:)

＃ 帮助
### 我应该在选项页面上输入什么？
* 姓名
    * 你想给个人资料的名字
* 服务器
     * 您要连接的服务器的 IP 地址。
        * 如果您在 PC 上设置服务器，则它是“本地主机”。
        * 如果您在另一台 PC 上设置服务器，则它是该 PC 的 IP
* 港口
    * 要连接的服务器的端口。如果您没有更改我的代码，则它是“8082”。

### 这对我没有帮助。
* 在 Discord @“Quadrubo#2536”上给我留言。我相信我可以帮助你:)
