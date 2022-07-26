import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
  providers: [DatePipe]
})
export class MemberComponent implements OnInit {
  memberTypeMap: any = {
    member: '一般会员',
    vendor: '入驻商户',
  }
  statusMap: any = {
    idNumber: '实名认证',
    simple_create: '未认证',
    idMsg: '图片认证',
    enable: '启用',
    disable: '禁用',
  }
  constructor(
    private c: CoreService
  ) { }
  ngOnInit() {
    this.getData()
  }
  list = [] //  列表数据源
  table: any = {
    count: 0,
    pageSize: 10,
    currentPage: 1,
    loading: false
  }
  filterParams: any = {}
  filterConfigJson() {
    return [
      [
        { lable: '会员id : ', type: 'input', field: 'id', value: '', clear: true },
        { lable: '登录名:', type: 'input', field: 'loginName', value: '', clear: true },
        { lable: '手机号码:', type: 'input', field: 'mobileNumber', value: '', clear: true },
        {
          lable: '类型:', option: [
            { lable: '全部', value: '' },
            { lable: '一般会员', value: 'member' },
            { lable: '入驻商户', value: 'vendor' },
          ], type: 'select', field: 'memberType', value: '',
        },
        {
          lable: '来源:', option: [
            { lable: '全部', value: '' },
            { lable: '微信注册', value: 'wechat' },
            { lable: '门户注册', value: 'portal' },
            { lable: '运营平台', value: 'majordomo' },
          ], type: 'select', field: 'memberFrom', value: '',
        },
        {
          lable: '状态:', option: [
            { lable: '全部', value: '' },
            { lable: '实名认证', value: 'idNumber' },
            { lable: '未认证', value: 'simple_create' },
            { lable: '图片认证', value: 'idMsg' },
            { lable: '启用', value: 'enable' },
            { lable: '禁用', value: 'disable' },
          ], type: 'select', field: 'memberStatus', value: ''
        },

      ],
    ]
  }
  filterConfig: Array<Array<any>> = [...this.filterConfigJson()]

  getData() {
    this.getTable()
    this.getTableCount()
  }
  getTable() {
    this.table.loading = true
    const url = this.c.web + 'member-memberTable'
    const params = {
      currentPage: this.table.currentPage,
      pageSize: this.table.pageSize,
      ...this.filterParams
    }
    this.c.get(url, params).then(data => {
      this.table.loading = false
      console.log(data);
      const temp: any = data
      this.list = temp.data
    })
  }
  getTableCount() {
    const url = this.c.web + 'member-memberTableCount'
    const params = {
      ...this.filterParams
    }
    this.c.get(url, params).then(data => {
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
  //打开编辑
  isVisible:any=false
  open(e){
    const url = 'https://server.ncppx.com/api/pipixia/ppxmanage/getMemberInfo'
    const params = {
      uid:e
    }
    this.c.post(url, params).then(data => {
      this.updatePre = data[0]
      this.isVisible=true
    })
  }
  //取消
  handleCancel(){
    this.isVisible=false
  }
  //确认
  updatePre:any
  handleOk(){
    console.log(this.updatePre); 
    const url = 'https://server.ncppx.com/api/pipixia/ppxmanage/updateMemberInfo'
    this.c.post(url, this.updatePre).then(data => {
      if(data['success']){
        alert(data['msg'])
        this.isVisible=false
      }else{
        alert(data['msg'])
        this.isVisible=false
      }
    })
  }
}
