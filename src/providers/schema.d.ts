/*===================CHANGELOG==================
    * 2017-08-18 0.6 刘雨飏
                为Schema新增name字段
                为Field新增required字段
                为Field新增show字段
    * 2017-08-11 初始化版本 0.5 刘雨飏
    * 2017-08-10 创建声明文件 刘雨飏
*/

interface Schemas{
    [schemaName:string]:Schema
}
interface Schema{
    className:string
    name:string
    displayedOperators:Array<string>
    displayedColumns:Array<string>
    managerOperators?:Array<any> //管理员操作权限 add添加 edit编辑 delete删除
    detailPage?:string
    detailTitle?:string
    editPage?:string
    uniqueIndex?:{}
    typeName?:{
        [propName:string]:string
    }
    desc?:string
    apps?:Array<string>
    include?:Array<string> // 需要加载内容的关联对象列表
    order?:Object // 表单默认的数据加载排序方式
    qrUrl?:string // 此类对象二维码生成规则
    fields?:{
        [fieldName: string]: Field
    }
    fieldsArray?:Array<Field>
}

interface Field{
    key?: string // 字段真实名称，小驼峰命名，如isEnabled、createdAt等
    type: string // 字段数据类型，Number、String、Array、Object、Pointer等
    name: string // 字段别称，显示在表头中的名称
    desc?: string // 字段描述，说明字段的用途和注意事项
    editTab?: string // 字段描述，说明字段的用途和注意事项
    default?: any
    icon?: string
    color?: string
    col?: number // 编辑栏目占用列宽
    view?: string // 指定专用的查看与编辑组件
    options?: Array<any>
    schemaName? : string
    className?: string
    targetClass?: string
    targetType?: string
    required?:boolean // 是否必填项
    disabled?:boolean // 是否允许编辑
    show?:boolean // 是否显示
    condition?:Object // 允许编辑的前置条件计算
}

interface ParseObject{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    className: string;
    [fieldName:string]: any;
}

interface SQLVar {
    name: String
    value: String
    aggregate?: String
    condition?:String
}

interface ReportChart {
    name: String
    value: String
    aggregate?: String
    condition?:String
}