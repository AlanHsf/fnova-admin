# 票务系统

# 系统拓扑
## 闸机中控
- 设置闸机网络环境和唯一编号
  - gateNum设备编码
    - 0791区号+000001六位客户号+000001设备号
  - 如：汉林苑前门：101
- 向指定地址发送请求
  - gatealive 存活
  - checkticket 验票
    - 携带二维码识别后的参数
    - =>验票接口，返回验证结果

## 验票接口
- /api/iot-gate/?m=gateapi&a=gatealive
  - 直接返回成功
- /api/iot-gate/?m=gateapi&a=checkticket
  - 直接返回成功

## 数据结构
- TicketRule 门票规则
  - 次票
  - 年票
- TicketOrder 门票订单
  - 次票订单
  - 年票订单
- TicketLog 门票核验记录
  - 门票使用情况
- Device 闸机设备
  - type = gate 闸机门禁

# 业务逻辑
## 票的条码/二维码规则
### 票码生成规则
- 生成时间：
  - 次票购买时生成
  - 周期票打开时生成
- 票码示例：20210812155301 0000001
  - 时间到秒
  - 用户objectId转数字
  ``` js
  let date = "20210812155301"
  let num = 0 
  user.objectId.split("").forEach(s=>{num+=s.charCodeAt(0)||0})
  let code = date + String(num)
  ```

## 次票核销后即作废
- 次票核销后，TicketOrder.isDone = true
  - 同时记录：TicketGateLog
- 周期票核销后，产生TicketGateLog

## 周期票限制给朋友用
- 动态码：每次生成10s有效的动态码
- 限次数：每日限进入3次（早票、下午、晚上）

# 主要页面
- 售票页面
  - 最上方：待使用门票、年卡、月卡
  - 购买新门票
    - 次票（成人）
    - 次票（学生）
    - 周票
    - 月票
    - 年票（VIP）
  - 购买
- 核销记录
  - 购票订单（已使用、未使用）
- 门票详情
  - 注意：禁止截屏
  - 展示企业背景（票面海报）
  - 展示门票条码（未使用、已使用）