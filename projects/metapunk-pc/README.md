

# 一、项目介绍

MetaPunk元宇宙游戏内容分发平台


## 测试打包发布
``` sh
# Web测试
ng serve --project=metapunk-pc

# Electron测试
ng build --prod --project=metapunk-pc --base-href /

cp -r electron/apps/metapunk-pc/*.ts electron/
tsc --p electron
mkdir -p electron/dist/node_modules electron/dist/www
cp -r dist/metapunk-pc/* electron/dist/www/
cp -rf electron/plugins electron/dist/plugins
cp -r electron/apps/metapunk-pc/* electron/dist/
cp -r electron/apps/metapunk-pc/splash electron/dist/www/
cp -r electron/apps/metapunk-pc/build electron/dist/

electron electron/dist/main.app.js

# 清空dist
rm -rf electron/dist/*

```

# 二、项目架构
- 游戏库
    - 版本控制
    - 安装调试
- 计时收费
- 设备维护
    - 设备绑定
    - 设备控制

## 视图层（Web端）


## 系统层（API层）

- 参考项目
    - ADB监测第三方应用内存使用情况 https://gitee.com/mirrors/adb-memory-monitor
    - 屏幕捕捉 https://gitcode.net/mirrors/Genymobile/scrcpy/-/blob/master/README.zh-Hans.md
        - https://github.com/Genymobile/scrcpy
    - 声音捕捉 https://github.com/rom1v/sndcpy