# 未来全栈后端系统总库
- 本项目创建自：[Angular CLI](https://github.com/angular/angular-cli) version 7.0.3.

# 一、项目介绍
## 项目信息
- 项目名称：未来全栈后端系统总库
- 项目代码：nova-admin
- 项目仓库：https://git.dev.tencent.com/ryn/nova-admin.git
- 当前版本：0.5

## 参考文档
- 项目文档汇总：https://pro.leanote.com/space/5c6cc59f57926df60c101c08

## 创建模块/页面
```
ng g component dashboard --module organization
mv src/app/organization src/modules/
ng g component dashboard --module ../modules/organization
mv src/app/dashboard src/modules/
```

# 二、部署运行
## Development server
- 启动服务：ng serve
- 测试地址：http://localhost:4200/
 
## Build
- 普通打包：ng build
- 优化打包：ng build --prod

## Running unit tests
- 单元测试：ng test
- 测试参考：[Karma](https://karma-runner.github.io)

## Running end-to-end tests
- 点点测试：ng e2e
- 测试参考：[Protractor](http://www.protractortest.org/).

## Further help
- 更多帮助：ng help

## parse库
- parse-dashboard --appId dream --masterKey DreamTest666 --serverURL https://server.hopecent.com/dream/parse

# 桌面版打包——Electron脚本
## EXE打包
``` sh
# 配置镜像站加速
export ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/
npm config set registry https://registry.npm.taobao.org/
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/

# 示例：江西理工学位英语考试系统打包
appId=engexam-jxlg projectId=testsystem npm run pack engexam-jxlg

# 示例：九江学院学位外语考试系统打包
appId=engexam-jjxy projectId=testsystem npm run pack engexam-jjxy
```

``` sh
# 依赖环境（Ubuntu） https://wiki.winehq.org/Ubuntu
wget -nc https://dl.winehq.org/wine-builds/winehq.key 
sudo apt-key add winehq.key
sudo add-apt-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ focal main' 
sudo apt install --install-recommends winehq-stable
sudo apt install wine64
sudo apt install winetricks
```

## 发布版本至下载地址
``` sh
# 下载安装 https://developer.qiniu.com/kodo/1302/qshell
qshell account EXsA-z_n4LGmWrwC088bygcGJtAditnWQe2nH-ZE HWTL92OL-Tup0-8ex8A9jnG3OaJzTxlF4OwiiDsX fmode
qshell qupload2 --src-dir=./release --bucket=nova-repos --check-exists --rescan-local

```