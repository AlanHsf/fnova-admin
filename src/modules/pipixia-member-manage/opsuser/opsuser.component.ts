import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core.service';

@Component({
  selector: 'app-opsuser',
  templateUrl: './opsuser.component.html',
  styleUrls: ['./opsuser.component.scss']
})
export class OpsuserComponent implements OnInit {
  userStatus: any = {
    enable: '有效',
    disable: '无效',
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
        { lable: '用户id : ', type: 'input', field: 'id', value: '', clear: true },
        { lable: '登录名:', type: 'input', field: 'loginName', value: '', clear: true },
        { lable: '昵称:', type: 'input', field: 'nickName', value: '', clear: true },
        { lable: '手机号码:', type: 'input', field: 'mobile', value: '', clear: true },
        {
          lable: '状态:', option: [
            { lable: '全部', value: '' },
            { lable: '启用', value: 'enable' },
            { lable: '停用', value: 'disable' },
          ], type: 'select', field: 'userStatus', value: '',
        },
        {
          lable: '性别:', option: [
            { lable: '全部', value: '' },
            { lable: '男性', value: 'true' },
            { lable: '女性', value: 'false' },
          ], type: 'select', field: 'male', value: '',
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
    const url = this.c.web + 'member-opsuserTable'
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
    const url = this.c.web + 'member-opsuserTableCount'
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
}
