## 创建库（library）:
ng g library library名称
例：ng g library my-lib

## 构建、测试和 lint 该库：


安装 构建工具 ng-packagr
```
npm i ng-packagr -D 
```
package.json 添加运行脚本:
```
"librarybuild": "ng-packagr -p ./projects/common-pipe/ng-package.json",
```

运行构建命令：
```
npm run librarybuild   or   yarn librarybuild
```

ng test my-lib
ng lint my-lib


## 公共api

public-api.ts

当库被导入应用时，从该文件导出的所有内容都会公开。请使用 NgModule 来暴露这些服务和组件。

## 应用中使用库
- 构建该库。在构建之前，无法使用库。
  ng build my-lib

- 在应用中，按名称从库中导入：

  import { myExport } from 'my-lib';


## 发布库
ng build my-lib
cd dist/my-lib
npm publish

应该总是使用 production 配置来构建用于分发的库。这样可以确保所生成的输出对 npm 使用了适当的优化和正确的软件包格式。
