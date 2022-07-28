import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse"

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {

  constructor(private http: HttpClient,  private message: NzMessageService) { }
  company: string = ''
  searchField:string = "name"
  searchOptions:any = [{label: "姓名", value: "name"}, {label: "手机号", value: "mobile"}]
  searchInputText:string = ""
  isVisible:boolean = false
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
      title: '职工生日',
      compare: null,
      priority: false
    },

    {
      title: '职工职务',
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
      title: '手机号码',
      compare: null,
      priority: false
    },
    {
      title: '职工编号',
      compare: null,
      priority: false
    },
    {
      title: '用户状态',
      compare: null,
      priority: false
    }
    ,
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  current:any = {}
  listOfDisplayData:any = []
  loading:boolean = true
  total:number = 0
  pageSize:number = 20
  pageIndex:number = 1

  profileInfo:any = null
  async ngOnInit() {
    this.searchField = "name"
    this.company = localStorage.getItem('company')
    let profileInfo =  await this.getProfileInfo()
    let listOfDisplayData = await this.getProfileList()
    this.profileInfo = profileInfo
    this.listOfDisplayData = listOfDisplayData
    console.log(this.listOfDisplayData)
  }

  async getProfileInfo() {
    let sql =`select count("objectId") as "total",
    sum(case when "user" is not null then 1 else 0 end ) as "bindTotal",
    sum(case when "user" is not null and "sex" = '男' then 1 else 0 end ) as "bindM",
    sum(case when "user" is not null and "sex" = '女' then 1 else 0 end ) as "bindW",
    sum(case when "user" is null then 1 else 0 end ) as "notBind",
    sum(case when "user" is null and "sex" = '男' then 1 else 0 end ) as "nM",
    sum(case when "user" is null and "sex" = '女' then 1 else 0 end ) as "nW"
    from "Profile"
    where "company" = 'llO9TCR1Kn'
    group by "company"`
    return new Promise((resolve, reject) => {
      let baseurl = "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, {sql:sql  })
        .subscribe(async (res: any) => {
          if (res.code == 200) {
            resolve(res.data[0])
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })
  }
  async getProfileList() {
    this.loading = true
    let where1 = `AND "p"."name" like '%${this.searchInputText}%'`
    let where2 = `AND "p"."mobile" like '%${this.searchInputText}%'`
    let sql = `select "p"."objectId", "p"."name", "p"."sex","p"."birthdate",
    "p"."title","p"."workUnit", "d"."name" as "dname", "d"."objectId" as "did", "p"."mobile",
    "p"."workid", "p"."user" from "Profile" as "p"
    left join "Department" as "d" on "d"."objectId" = "p"."department"
    where "p"."company" = '${this.company}'
    ${(this.searchInputText && this.searchField == 'name') ? where1 : ''}
    ${(this.searchInputText && this.searchField == 'mobile') ? where2 : ''}
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
  departments:any = []
  async searchPointer(e) {
    let Dpartment = new Parse.Query('Department')
    Dpartment.equalTo('company',this.company)
    if(e) {
      Dpartment.contains('name',e)
    }
    Dpartment.select('objectId', 'name')
    Dpartment.limit(20)
    let department =  await Dpartment.find()
    this.departments = department
  }


  seacherChange(e) {
    console.log(e)
    this.current.did = e.id
    this.current.dname = e.get('name')


  }

  async reset() {
    this.searchInputText = null
    this.searchField = 'name'
    this.listOfDisplayData = await this.getProfileList()
  }

  addProfile() {
    this.current = {
      name: '',
      sex: '',
      birthdate: '',
      workid: '',
      did: '',
      mobile: '',
      workUnit: '',
      title: ''
    }
    this.isVisible = true
  }

  edit(item) {
    this.current = item
    console.log(item)
    this.isVisible = true
  }

  handleCancel() {
    this.isVisible = false
    this.current = null
  }

  async handleOk(){
    for (let key in this.current) {
      if(!this.current[key]) {
        this.message.info("请将信息填写完整")
        return
      }
    }
    let profile
    let Profile
    if(this.current.objectId) { // 编辑
      Profile = new Parse.Query('Profile')
      profile = await Profile.get(this.current.objectId)

    }else{ // 新创建
      Profile = Parse.Object.extend('Profile')
      profile = new Profile()
    }
    if(profile) {
      profile.set('name', this.current.name )
      profile.set('sex', this.current.sex )
      profile.set('birthdate', this.current.birthdate )
      profile.set('workid', this.current.workid )
      profile.set('mobile', this.current.mobile )
      profile.set('title', this.current.title )
      profile.set('workUnit', this.current.workUnit )
      profile.set('department', {
        __type:"Pointer",
        className:"Department",
        objectId:this.current.did
      })
    }
    let newProfile = await profile.save()
    if(newProfile) {
      this.isVisible = false
      this.current = null
      this.message.success("保存成功")
    }
  }
}
