## 测试打包发布
``` sh
# Web测试
ng serve --project=testsystem

# Electron测试
ng build --prod --project=testsystem --base-href /

cp -r electron/apps/engexam-jjxy/*.ts electron/
tsc --p electron
mkdir -p electron/dist/node_modules electron/dist/www
cp -r dist/testsystem/* electron/dist/www/
cp -rf electron/plugins electron/dist/plugins
cp -r electron/apps/engexam-jjxy/* electron/dist/
cp -r electron/apps/engexam-jjxy/splash electron/dist/www/
cp -r electron/apps/engexam-jjxy/build electron/dist/

electron electron/dist/main.js

# 清空dist
rm -rf electron/dist/*

```
