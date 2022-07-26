import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-flow',
  templateUrl: './transaction-flow.component.html',
  styleUrls: ['./transaction-flow.component.scss'],
  providers: [DatePipe]
})
export class TransactionFlowComponent implements OnInit {
  list = []
  table: any = {
    currentPage: 1,
    pageSize: 10,
    loading: false,
    count: 0
  }
  transactionTypeMap: any = {
    // rent: '租车',
    fund: '保证金充值',
    withdraw_fund: '保证金提现',
    recharge: '余额充值',
    service_fee: '手续费提现',
    buy_vehicle: '购买车辆',
    withdraw: '提现',
    rent_settle: '租车结算',
    refund_settle: '退款单结算',
  }
  constructor(
    private c: CoreService
  ) {
    this.getData()
  }
  filterConfigJson() {
    return [
      [
        { lable: '创建时间 : ', option: [], type: 'date', field: 'dateBegin', value: '', clear: true },
        { lable: '~', option: [], type: 'date', field: 'dateEnd', value: '', clear: true },
      ],
      [
        { lable: '主键 : ', type: 'input', field: 'id', value: '', placeholder: '', clear: true },
        { lable: '收账号 : ', type: 'input', field: 'inAccountId', value: '', placeholder: '', clear: true },
        { lable: '付账号 : ', type: 'input', field: 'outAccountId', value: '', placeholder: '', clear: true },
        { lable: '商户订单号 : ', type: 'input', field: 'bizId', value: '', placeholder: '', clear: true },
        { lable: '流水号 : ', type: 'input', field: 'flowId', value: '', clear: true },
        {
          lable: '交易类型 : ', option: [
            { lable: '全部', value: '' },
            ...Object.entries(this.transactionTypeMap).map(item => {
              return { lable: item[1], value: item[0] }
            })
          ], type: 'select', field: 'transactionType', value: '', optLable: 'lable', optValue: 'value'
        },
        {
          lable: '是否完成 : ', option: [
            { lable: '全部', value: '' },
            { lable: '已完成', value: '1' },
            { lable: '待处理', value: '0' },
          ], type: 'select', field: 'completed', value: '', optLable: 'lable', optValue: 'value'
        },
        { lable: '最小金额 : ', option: [], type: 'input', field: 'minAmount', value: '', clear: true },
        { lable: '最大金额 : ', option: [], type: 'input', field: 'maxAmount', value: '', clear: true },
      ],
    ]
  }
  filterConfig: Array<Array<any>> = [...this.filterConfigJson()]

  ngOnInit() {
  }
  getData() {
    this.getTable()
    this.getTableCount()
  }
  copyList:any;
  getTable() {
    this.table.loading = true
    let url = this.c.web + 'financeFlowTable'
    const params = {
      currentPage: this.table.currentPage,
      pageSize: this.table.pageSize,
      ...this.filterParams
    }
    this.c.get(url, params).then(data => {
      this.table.loading = false
      const temp: any = data;
      this.list = temp.data
      console.log(this.list);
      
      let copylist=[]
      temp.data.forEach(item => {
        copylist.push(item.bizId)
      });
      this.copyList=copylist.toString()
    })
  }
  getTableCount() {
    let url = this.c.web + 'financeFlowTableCount'
    const params = {
      ...this.filterParams
    }
    this.c.get(url, params).then(data => {
      console.log(data)
      const temp: any = data
      this.table.count = temp.data
    })
  }
  filterParams: any = {

  }
  filterChange(e) {
    Object.assign(this.filterParams, e)
  }
  search() {
    this.table.currentPage = 1
    this.getData()
  }
  refresh() {
    this.filterParams = {}
    this.filterConfig = [...this.filterConfigJson()]
    this.search()
  }
  //完成提现
  finashWithdraw(e,q,w){
    let pre = {
      flow_id:e,
      amount:q,
      id:w
    }
    let url = this.c.web + 'finash_withdraw'
    this.c.post(url, pre).then(data => {
      console.log(data)
      if(data['success']){
        alert(data['msg'])
        this.getTable()
      }
    })

  }
  //查看收账人名称
  financeName:any;
  isVisible:any=false;
  money:any;
  withdrawMan(e,q){
    let url = this.c.web + 'financeName'
    let pre = {
      finance_account_id:e
    }
    this.c.post(url,pre).then(data=>{
      this.financeName = data[0]['credential_name']
      this.money = q
      this.isVisible=true
    })
  }
  handleCancel(){
    this.isVisible=false
  }
  handleOk(){
    this.isVisible=false
  }
}
