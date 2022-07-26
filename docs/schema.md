# 核心概念：Schema数据映射对象范式

## Schema常用概念
- Schema，是一种描写数据对象的规范
    - 在前端
        - Interface 接口 /src/providers/schema.d.ts
        - Class 类 通过接口生成的类
        - Object 对象 通过类生成的实例化对象
    - 在后端
        - JSON 数据结果（单一/列表）
    - 在数据库
        - Mysql 表Table
        - Postgresql 表Schema/Table
        - Mongodb 集合Collection
- Migration，是数据库常用概念用来迁移数据表数据集合
    - 前端，可以通过Schema规范，生成自动化对象编辑组件、列表组件、校验机制等
    - 后端，可以通过Schema规范，生成数据库表、CRUD接口、权限控制等

## Schema存储的位置
- 前端：/src/providers/schema/**
    - 存放系统框架必备的Schema范式
- 后端：
    - 存放各个应用模块的Schema范式

- **FAQ：用于系统独立部署时数据核心的保密作用**
    - 用户业务逻辑中的数据对象范式，统一存储在SaaS平台中，每次安装都需要从总平台读取。
    - 设置不同独立部署应用Schemas加载权限，需要从总平台同步数据创建数据表才可正常运行。


# 特殊数据类型字段设计
## date-from-to
- 如报名时间：2019年4月开始，2019年5月截止
- 字段名称：signFromTo
- 字段属性：Object
``` js
{
    "from":"2019-05-29T03:44:18.940Z",
    "to":"2019-06-29T03:44:18.940Z"
}
```
- 查询场景（查询2019年5月后开始报名的课程）
``` js
let query = new Parse.Query("Xiaofang_class")
query.greaterThan("signFromTo.from", "2019-05-00T03:44:18.940Z");
query.find().then(data=>{
    console.log("GreaterThan")
    console.log(data)
})
```