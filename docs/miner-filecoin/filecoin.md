# Filecoin相关的接口
- FIL币种API（算力、区块等信息）
    - lotus API: https://docs.filecoin.io/reference/lotus-api/
- 市场指数行情
  - https://www.okex.com/api/v5/market/index-tickers?quoteCcy=USD 接口
- 提现
  - https://docs.token.im/
- 挖矿算力
  - https://docs.filecoin.io/
- 交易所API（热钱包、转账交易等）
    - okex.com

- 购买商品的时候FIL转账是APP转账还是他自己的
- 还是自己想办法


概念：Filecoin IPFS
官网 Filecoin.io ipfs.io

IPFS实际上是一个分布式文件版本管理工具
Git init
Git add .
Git commit
Git push

Ipfs init
Ipfs push
Ipfs get <cid>

FileCoin是给建立IPFS存储服务节点商家的奖励模式

挖矿：PoW => PoST
- 搭建节点自己挖矿
- 步骤
    - 买服务器、买显卡、买硬盘
	- 装机运行lotus（Filecoin节点软件）
	- 提交自己机器的存储空间、网速、稳定性证明 => 算力
	1. 硬件装机阶段 2-3 硬件费用
	2. 全网证明阶段 3-7 质押币+燃油费
	3. 形成有效算力
	- 缺点
    	- 一台服务器成本40-50万，个人不好买
      - 技术维护成本高
      - 算力总量少，别人不愿意租用
- 参与矿池挖矿
    - 购买算力 1T 10T 100T
        - 价格相关
            - 定价规则（硬件费用，还是含质押币费用？）
            - 硬件费用
            - 质押币
            - 燃油费
        - 业务逻辑
            - MinerGoods 算力规格商品表（type:fil xch bzz， sealDuration封装时间10天）
            - MinerOrder 算力订单表（硬件+质押+燃油 = 开始封装 => 有效算力）
                - 硬件支付（余额购买）
                - 质押币支付（FIL购买、借贷购买）
- 借贷合同
    - 币商（拥有FIL的人），默认币商就是融链
        - FIL剩余量
        - 不同阶梯费率（具体的借贷规则Excel表）
            - 1月 2%/月
            - 6月 1.8%/月
            - 12月 1.5%/月
    - 借贷合约（待还数额、利息、已还数额、是否结束）
- 算力的释放方式
    - 有效算力封装
        - 用户购买算力，付费
        - 用户提交质押币+燃油费，付费
        - 产生有效算力，10天封装交付
    - 价值释放规则
        - 算力挖矿所得分红
            - 当日分红比例 = 该订单有效算力 / 总矿池当日有效算力
                - 该订单有效算力，已知
                - 总矿池当日有效算力，（当日00:00通过lotus接口获取并存下来）
                    - 有一张表记录该区块链行情数据等《MinerStatus》
                        - 矿池算力记录
                            - type: filecoin-f08229-power
                            - recordAt 该记录标记的时间
                            - value: 10.5
                            - 单位：T
                - 当日总收益 = 当日矿池实际产值 * 当日分红比例
                    - 当日矿池实际产值
                        - 有一张表记录该区块链行情数据等《MinerStatus》
                            - 矿池算力记录
                                - type: filecoin-f08229-产值
                                - recordAt 该记录标记的时间
                                - value: 0.01
                                - 单位：FIL
    - 产值的释放规则
        - 当日总收益 75% 180天释放 25% 直接释放
    - 记录订单每日的分红释放结果
        - 记录在：MinerOrderIncome
            - minerOrder => MinerOrder
            - recordAt 记录日期
            - 用户所得
            - 平台所得
            - 分公司所得
- 质押币，540天返现（有效算力生效开始算起）
- 燃油费，完全消耗

- 收益
  - 80% 用户
    - 25% 可提现
    - 75% 冻结 180天后返还
  - 20% 分红
    - 1-10% 分公司
    - 其余总公司

如果借贷支付，借贷未完成用户只能提现收益种超出借贷的部分
借贷无法提前完成

1. 质押币和燃油费是否包含在购买的商品中

2. 收益精确到小数点后几位

3. 借贷相关的规则和机制是什么
   1. 用户签约借贷，后台审核
   2. 用户根据合约内容进行还款
      1. 利率
      2. 违约等


4. 小游戏，小游戏的相关规则是什么，小游戏奖励生成等
   1. 获得算力

5. SD代币规则（矿石，这个是需要还是不需要的），如何获取途径、用途
   1. 代币可用于购买商品时组合支付

6. 我的收益，是代理赚取的收益吗
   
7. 任务系统
   
**金额相关数据**

|      | channel   | user | account | info         | count    | type | isVerified   | address  | contract | interest |
| ---- | --------- | ---- | ------- | ------------ | -------- | ---- | ------------ | -------- | -------- | -------- |
| 提现 | withdraw  |      |         |              | 提现金额 | FIL  | 是否通过审核 | 提现地址 |          | 提现利息 |
| 还款 | repayment |      |         |              | 还款金额 | FIL  | 是否通过审核 |          | 还款合约 |          |
| 充值 | recharge  |      |         | 充值凭证截图 | 充值金额 | FIL  | 是否通过审核 |          |          |          |

UserAgentWithdraw数据包含trigger，如有疑问看trigger文件


**文章推送相关数据**

|           | title | content | type | category | cover | isEnabled|
|-----------|-------|---------|------|----------|-------|-----|
|  文章 | 标题   |  内容    |news  |          |文章封面| 是否启用|
| 系统消息  |标题   |内容|  |13KDVHZwfp|  |   |
| 订单消息   |标题   |内容|  |TVGT9piHNu|    |   |


**文章评论点赞**

|   |type|user|article|articleComment|
|---|----|----|-------|--------------|
|文章点赞|like|用户|文章|   |
|评论点赞|like|用户|文章|评论|

|   |user|comment|article|isEnabled|
|---|----|-------|-------|---------|
|文章评论|用户|评论|文章|是否显示|


**订单逻辑和还款**

数据参考puml文件

MinerOrder中有写trigger，生成订单和借贷合约
如果需要增加数据类型或者币种需要修改trigger逻辑