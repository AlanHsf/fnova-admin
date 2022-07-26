

# 系统通知

# Schema关系
- NoticeTpl
  - name 模板代号
  - content 通知模板字符串
  - params 通知变量
  - tplid 模板ID
  - type 模板类型 sms/wechat/app
  - targets Array<Ranger>[{
      {
        type: "_User",
        value:["<uid>","<uid>","<uid>"]
      },
      {
        type: "_Role",
        value:["<rid>","<rid>","<rid>"]
      },
      {
        type: "Company",
        value:["<cid>","<cid>","<cid>"]
      },
      {
        type: "Exam",
        value:["<eid>","<eid>","<eid>"]
      }
  }]
- Notice 系统通知记录
  - tpl
  - content
  - paramMap 模板变量规则
      ```
      {
        undocount:10 // 存在10条未审核记录
      }
      ```
  - targets Array<Ranger>[{
      {
        type: "_User",
        value:["<uid>","<uid>","<uid>"]
      },
      {
        type: "_Role",
        value:["<rid>","<rid>","<rid>"]
      },
      {
        type: "Company",
        value:["<cid>","<cid>","<cid>"]
      },
      {
        type: "Exam",
        value:["<eid>","<eid>","<eid>"]
      }
  }]
- NoticeLog 通知发送/查看记录
  - viewer 通知用户
  - notice 通知内容
  - isSend 是否送达
  - isView 是否查看
  - type sms短信/wechat服务号
  - target 186xxxx/openid

# 示例：通知审核人有多少待审核用户
## 1.确定审核人的通知范围和业务逻辑关系
- 创建新_Role，名称为审核人
- Recruit，设置通知角色为_Role<审核人>

## 2.写好单次通知的逻辑接口
- /notice/recruit/undotask
  - 加载模板代号：recruit-undotask
    - 对应模板数据：NoticeTpl{name:recruit-undotask,content:"",type:sms,tplid:<jpush>}
  - 生成系统通知记录
    - 对应通知数据：Notice{tpl:NoticeTpl.id,content:content,paramMap:{undocount:10,firstdate},target:{type:"_Role",value:[<rid>]}}
  - 批量发送通知，并记录通知送达情况
    - 产生发送记录：NoticeLog

## 3.设置周期任务条件
- 相关库：node-schedule
- ScheduleJob 系统周期任务表
  - name:报名信息审核周期通知
  - recRule:循环周期规则
    - 每日早8点至晚5点，2小时执行一次
  - valueRule:变量阈值规则
  - type: nodejs // 执行nodejs代码
  - code: `
      request.post("/notice/recruit/undotask",{recruit:<Recruit.id>})
  `
