# TODOLIST
- 自动队列，同一个帐号在同一批两个VIEW中挂机

- 任务认领，自动领任务、领赛季奖在个别帐号不触发，需要人工操作
    - ptc13119@163.com 

# 0.9.5
## FIX: 公会看板成员显示问题

# 0.9.4
## BUG: VIEW进程占用过多不关闭问题
- 地址释放，自动换帐号时候，老玩家的VIEW没有彻底结束，卡进程
    - closePlayer未生效
    - 直接关闭VIEW的方法，是否清进程（目前不清除）
        - view 1进程
        - devtool 1进程
        - ISSUE
            - https://github.com/electron/electron/issues/27114
            - https://github.com/electron/electron/issues/11643
        - SOLVED
            - https://github.com/electron/electron/issues/10096
            - ps -aux | grep spsmanager | wc
            - (browserView.webContents as any).destroy()
    - JS关闭VIEW的方法，是否清进程
    - BrowserView不用关方法，直接用index位置为标记，换号就是请缓存，并加载不同页面内容

# 0.9.3
## BUG: proxy无法承载10号并发
- 购买云服务器不限带宽按流量计费，绑定ip的*.sps.dapp映射关系

# 0.9.2
## Optimize: 自动队列逻辑优化
- 每次替换完线上队列，为10个窗口重新布局

# 0.9.0
## Feat: 公会数据看板，查看公会内所有玩家

# 0.8.0

## Feat: 无限自动战斗队列
* 1.程序启动时，默认加载10个玩家，点击开始战斗
* 2.每5秒检测一遍，判断当前玩家是否有完成任务的
* 3.若有完成任务的玩家，获取公会undone列表
* 4.逐个替换新玩家至前者战斗序列

# 0.7.0
## Feat: 更新自动脚本机制

一：解决Earth种族胜率低问题
1.使用每天1次任务刷新机会，直接重置Earth为其他任务
2.若还是Earth，则不优先完成任务，确保胜率

二：修复不能自动排位完成的问题
1.解决完成任务数大于1卡任务问题
2.解决玩家数据不自动刷新，浪费能量值问题

三：玩家数据同步接口
1.玩家挂机状态同步数据库，便于公会资产分析
2.玩家挂机状态同步客户端监控器，为公会500账号切换挂机做准备。更新自动脚本机制：
