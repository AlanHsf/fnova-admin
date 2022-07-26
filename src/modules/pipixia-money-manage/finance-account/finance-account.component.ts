import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-finance-account',
  templateUrl: './finance-account.component.html',
  styleUrls: ['./finance-account.component.scss'],
  providers: [DatePipe]
})
export class FinanceAccountComponent implements OnInit {
  list = [] //  列表数据源
  editData:any;
  table: any = {
    count: 0,
    pageSize: 10,
    currentPage: 1,
    loading: false
  }
  statusMap: any = {
    idNumber: '实名认证',
    simple_create: '未认证',
    idMsg: '图片认证',
    enable: '启用',
    disable: '禁用',
  }
  domain = 'https://server.fmode.cn'
  filterConfigJson() {
    return [
      [
        { lable: '创建时间 : ', option: [], type: 'date', field: 'dateBegin', value: '', clear: true },
        { lable: '~　', option: [], type: 'date', field: 'dateEnd', value: '', clear: true },
        { lable: '会员手机:', type: 'input', field: 'mobileNumber', value: '', clear: true },
      ],
      [
        { lable: '账户id : ', type: 'input', field: 'id', value: '', clear: true },
      ],
      [
        {
          lable: '账户类型:', option: [
            { lable: '全部', value: '' },
            { lable: '会员账号', value: 'normal' },
            { lable: '结算账号', value: 'platform_settle' },
            { lable: '收付账号', value: 'platform_payment' },
          ], type: 'select', field: 'accountType', value: '',
        },
        {
          lable: '会员类型:', option: [
            { lable: '全部', value: '' },
            { lable: '一般会员', value: 'member' },
            { lable: '入驻商户', value: 'vendor' },
          ], type: 'select', field: 'memberType', value: '',
        },
        {
          lable: '会员来源:', option: [
            { lable: '全部', value: '' },
            { lable: '微信注册', value: 'wechat' },
            { lable: '门户注册', value: 'portal' },
            { lable: '运营平台', value: 'majordomo' },
          ], type: 'select', field: 'memberFrom', value: ''
        },
        {
          lable: '会员状态:', option: [
            { lable: '全部', value: '' },
            { lable: '实名认证', value: 'idNumber' },
            { lable: '未认证', value: 'simple_create' },
            { lable: '图片认证', value: 'idMsg' },
            { lable: '启用', value: 'enable' },
            { lable: '禁用', value: 'disable' },
          ], type: 'select', field: 'memberStatus', value: ''
        },
      ],
      [
        { lable: '保证金最小:', option: [], type: 'input', field: 'minFundAmount', value: '', clear: true },
        { lable: '保证金最大:', option: [], type: 'input', field: 'maxFundAmount', value: '', clear: true },
        { lable: '余额最小:', option: [], type: 'input', field: 'minBlanceAmount', value: '', clear: true },
        { lable: '余额最大:', option: [], type: 'input', field: 'maxBlanceAmount', value: '', clear: true },
      ]
    ]
  }
  filterConfig: Array<Array<any>> = [...this.filterConfigJson()]
    constructor(
        private c: CoreService,
        private CdRef : ChangeDetectorRef,
        private http : HttpClient,
        private message: NzMessageService
    ) {
        this.getData()
    }

    ngOnInit() { }
    filterParams: any = {}
    getData() {
        this.getTable()
        this.getTableCount()
    }
    getTable() {
        this.table.loading = true
        let url = this.c.web + 'financeAccountTable'
        const params = {
        currentPage: this.table.currentPage,
        pageSize: this.table.pageSize,
        ...this.filterParams
        }
        this.c.get(url, params).then(data => {
        this.table.loading = false
        console.log(data)
        const temp: any = data || []
        this.list = temp
        })
    }
    isVisible:boolean = false
    balanceAmount:number = 0
    fundAmount: number = 0
    editAccout(item) {
        this.editData = Object.assign({}, item) 
        this.balanceAmount = this.editData.balanceAmount/100
        this.fundAmount = this.editData.fundAmount/100
        this.isVisible = true
        console.log(this.editData)
    }

    handleCancel() {
        this.isVisible = false
        this.editData = null
        this.balanceAmount = 0
        this.fundAmount = 0
    }
    handleOk() {
        console.log(this.balanceAmount, this.fundAmount)
        let url = this.domain+ '/api/pipixia/member/finance/update/amount'
        this.c.post(url, {aid: this.editData.fid,
             fund_amount: 10,
             balance_amount: 10
            }).then( (res) => {
                console.log(res)
                if(res['code'] == 200) {
                    this.editData = null,
                    this.fundAmount = 0,
                    this.balanceAmount = 0
                    this.isVisible = false
                    this.createMessage('success', '更新成功')
                }
            })
         
    }

    createMessage(type: string, msg:string): void {
        this.message.create(type, msg);
      }

    getTableCount() {
        let url = this.c.web + 'financeAccountTableCount'
        const params = {
            ...this.filterParams
        }
        this.c.get(url, params).then(data => {
            console.log(data)
            const temp: any = data
            this.table.count = temp.data
        })
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
}
