# 项目笔记目录结构
- /docs/<project_id> 项目技术文档
    - /docs/<project_id>/xxx.puml UML图示文件
        - schema.xxx.puml 类图 存放项目的数据结构
        - seq.xxx.puml 顺序图 复杂函数的调用过程
    - /docs/<project_id>/xxx.md 说明性文档记录
        - meet.20210722.md 会议记录
        - faq.xxx.md 相关问题记录

# 相关参考文档
- 怎么写markdown md说明文档
    - [认识与入门markdown](https://sspai.com/post/25137)
    - [VS Code下的markdown](https://zhuanlan.zhihu.com/p/56943330)
- 怎么写plantUML uml通用描述
    - 面向对象概念：参考TypeScript面向对象相关资料
    - UML概念：
        - [UML快速入门](https://zhuanlan.zhihu.com/p/347398382)
        - [类图与类关系](https://zhuanlan.zhihu.com/p/109655171)
    - PlantUML语法：https://plantuml.com/zh/


# FAQ：项目笔记相关插件
- ALT+D 预览 .puml文件
  - 需要安装插件：PlantUML
- Ctrl+Shift+V 预览 .md中的 ```plantuml片段
  - .vscode/settings.json
  - {
    - "plantuml.server": "https://www.plantuml.com/plantuml",
    - "plantuml.render": "PlantUMLServer"
  - }


# FAQ：PlantUML依赖环境
- Java
  - apt install openjdk-xx-jdk
  - apt install openjdk-xx-jre
- Graphviz
  - apt install graphviz

# FAQ：Markdown Preview不显示图片

![ok](https://tpc.googlesyndication.com/simgad/11020687143759311966?sqp=4sqPyQQrQikqJwhfEAEdAAC0QiABKAEwCTgDQPCTCUgAUAFYAWBfcAJ4AcUBLbKdPg&rs=AOga4qmA8zvRPx1GukepnMW-6qjKWLFWbQ)