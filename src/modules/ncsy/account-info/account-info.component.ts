import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';


@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  constructor(private http: HttpClient,  private message: NzMessageService, private router: Router) { }
  company: string = ''
  searchField:string = "name"
  searchOptions:any = [{label: "姓名", value: "name"}, {label: "手机号", value: "mobile"}]
  searchInputText:string = ""
  listOfColumn = [
    {
      title: '职工姓名',
      compare: null,
      priority: false
    },
    {
      title: '职工性别',
      compare: null,
      priority: false
    },
    {
      title: '职工电话',
      compare: null,
      priority: false
    },

    {
      title: '所属部门',
      compare: null,
      priority: false
    },
    {
      title: '所属单位',
      compare: null,
      priority: false
    },
    {
      title: '职工工号',
      compare: null,
      priority: false
    },
    {
      title: '积分余额',
      compare: null,
      priority: false
    },
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  listOfDisplayData:any = []
  loading:boolean = true
  total:number = 0
  pageSize:number = 20
  pageIndex:number = 1

  async ngOnInit() {
    this.searchField = "name"
    this.company = localStorage.getItem('company')
    let listOfDisplayData = await this.getProfileList()

    this.listOfDisplayData = listOfDisplayData
    console.log(this.listOfDisplayData)
  }


  async getProfileList() {
    this.loading = true
    let where1 = `AND "p"."name" like '%${this.searchInputText}%'`
    let where2 = `AND "p"."mobile" like '%${this.searchInputText}%'`
    let sql = `select "P"."name", "P"."sex", "P"."mobile", "P"."workUnit", "A"."objectId" as "aid",
    "P"."workid", "D"."name" as "dname",case when "A"."credit" is not null then "A"."credit" else 0 end  as "credit" from "Profile" as "P"
    left join "Account" as "A" on "P"."user" = "A"."user"
    left join "Department" as "D" on "D"."objectId" = "P"."department"
    where "P"."company" = '${this.company}'
    ${(this.searchInputText && this.searchField == 'name') ? where1 : ''}
    ${(this.searchInputText && this.searchField == 'mobile') ? where2 : ''}
    order by "credit" desc
    `
    console.log(sql)
    let limitsql = `limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`
    this.total = await this.getCount(sql)
    return new Promise((resolve, reject) => {
      let baseurl = "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, {sql:sql + limitsql  })
        .subscribe(async (res: any) => {
          if (res.code == 200) {
            this.loading = false
            resolve(res.data)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })

  }

  async getCount(sql): Promise<number> {
    return new Promise((resolve, reject) => {
        let baseurl = "https://server.fmode.cn/api/novaql/select";
        let countSql = 'select count(*) from ' + '(' + sql + ')' + 'as totalCount'
        this.http
            .post(baseurl, { sql: countSql })
            .subscribe(async (res: any) => {
                let count: number = 0;
                if (res.code == 200) {
                    count = Number(res.data[0].count)
                    resolve(count)
                } else {
                    resolve(count)
                    this.message.info("网络繁忙，数据获取失败")
                }
            })
    })
  }



  async pageIndexChange(e) {
    this.listOfDisplayData = await this.getProfileList()
  }
  async pageSizeChange(e) {
    this.listOfDisplayData = await this.getProfileList()
  }


  async search() {
    if(!this.searchInputText){
      return
    }
    this.listOfDisplayData = await this.getProfileList()
  }


  async reset() {
    this.searchInputText = null
    this.searchField = 'name'
    this.listOfDisplayData = await this.getProfileList()
  }


  detail(item) {
    this.router.navigate(['ncsy/accountlog-detail', {
      accountid: item.aid,
      name: item.name,
      credit:item.credit
    }])
  }
}
