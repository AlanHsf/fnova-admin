import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PrintService } from 'src/modules/service/print.service';
import * as Parse from "parse"

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  routeId: string = 'Iu21ckCv8C';
  route?: any;
  routeFields?: any;
  searchTypeOpts: any[] = [
    { name: '姓名', value: 'name', classalias: 'pro' },
    { name: '单位', value: 'companyInfo', classalias: 'card', key: 'workUnit' },
    { name: '协会职务', value: 'position', classalias: 'pro' },
  ]
  searchType: string = 'name'
  searchVal: string = ''
  memberlist: any[] = [];
  merber: any;
  companyCard: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  total?: number;
  loading: boolean = true;
  editModal: boolean = false;
  removeModal: boolean = false;
  printLoading: boolean = false;
  printModal: boolean = false;
  printBatchModal: boolean = false;
  printIndex: number = 1;
  batchMerber: any[] = [];
  showAll: boolean = false;
  company?: string;
  selectDeparts: any = [];
  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private printServ: PrintService,
    private cdRef: ChangeDetectorRef
  ) { this.company = localStorage.getItem("company") }

  ngOnInit(): void {
    this.getRelateRoute()
    this.getMemberList()
  }
  getMemberList() {
    let searchType = this.searchTypeOpts.find(opt => opt.value == this.searchType)
    console.log(searchType, this.searchVal);
    this.searchVal = this.searchVal.trim()
    this.getMembersBySql(searchType, this.searchVal, this.pageIndex, this.pageSize).subscribe(res => {
      console.log(res);
      if (res.code != 200) {
        return this.message.error("网络错误，请稍后重试")
      }
      let data = res.data.map(item => {
        if (item.department) {
          item.department = {
            id: item.department,
            name: item.departname
          }
        }
        return item
      })
      this.memberlist = data;
      console.log(this.memberlist);

      this.loading = false;
      this.getMemberCount().subscribe(res => {
        if (res.code != 200) {
          return this.message.error("网络错误，请稍后重试")
        }
        console.log(res.data[0]);

        this.total = res.data[0].count;
        console.log(this.total)
        this.cdRef.detectChanges()

      })
    })
  }
  async getRelateRoute() {
    let route = await this.getRouteById(this.routeId)
    this.route = route ? route : {}
    this.getFields(route)
  }
  getFields(route) {
    if (route && route.id) {
      console.log(route)
      let fields = route.get("editFields")
      this.route = route;
      this.routeFields = fields;
    }
  }
  async edit(data) {
    console.log(data);
    let merber = await this.getObj("Profile", data.objectId);
    let companyCard = await this.getObj("CompanyCard", data.compcardid);
    this.merber = merber.toJSON()
    this.companyCard = companyCard.toJSON()
    this.editModal = true
    console.log(this.merber, this.companyCard)

  }
  async addMember() {
    this.merber = {}
    this.companyCard = { "companyInfo": {} }
    this.editModal = true;
  }
  ngModelChange(e) {
  }
  async getObj(schema, id) {
    let query = new Parse.Query(schema);
    this.routeFields.forEach(field => {
      if (field.type == 'Pointer') {
        query.include(field.key)
      }
    })
    return await query.get(id)
  }
  async setObj(className) {
    let Obj = Parse.Object.extend(className);
    let obj = new Obj();
    obj.set("company", {
      "className": "Company",
      "__type": "Pointer",
      "objectId": this.company
    })
    return await obj.save()
  }
  editChange(event) {
    console.log(event);
  }

  editModalCancel() {
    if (this.merber.objectId) {
      this.fetchMerber()
    }
    this.editModal = false

  }
  async editModalOk() {
    let savePro;
    let saveCard;
    for (let index = 0; index < this.routeFields.length; index++) {
      let field = this.routeFields[index];
      if (field.required && !this.merber[field.key]) {
        this.message.error("请填写必填字段")
        return
      }
    }

    if (!this.merber.objectId) {
      savePro = await this.setObj('Profile')
      this.merber.objectId = savePro.id;
    } else {
      savePro = await this.getTosaveObj('Profile', this.merber.objectId)

    }
    if (!this.companyCard.objectId) {
      saveCard = await this.setObj('CompanyCard')
      this.companyCard.objectId = saveCard.id;

    } else {
      saveCard = await this.getTosaveObj('CompanyCard', this.companyCard.objectId)
    }
    this.routeFields.forEach(field => {
      if (this.merber[field.key]) {
        switch (field.type) {
          case "Pointer":
            savePro.set(field.key, {
              "className": field.targetClass,
              "__type": "Pointer",
              "objectId": this.merber[field.key].objectId
            })
            break;
          default:
            console.log(this.merber[field.key]);

            savePro.set(field.key, this.merber[field.key])
            break;
        }
      }
    });
    saveCard.set("companyInfo", this.companyCard['companyInfo'])
    saveCard.set("profile", {
      "className": "Profile",
      "__type": "Pointer",
      "objectId": savePro.id
    })
    let pro = await savePro.save();
    let card = await saveCard.save();

    console.log(pro, card);

    if (pro?.id && card?.id) {
      this.message.success("操作成功")
      this.fetchMerber()
      this.editModal = false
    } else {
      this.message.success("操作成功")

    }
  }
  async remove(data) {
    try {
      this.merber = await this.getObj("Profile", data.objectId);
      this.companyCard = await this.getObj("CompanyCard", data.compcardid);
    } catch {

    }
    this.removeModal = true;
  }
  removeCancel() {
    this.removeModal = false;
  }
  async removeOk() {
    try {
      if (this.merber) {
        await this.merber.destroy()
      }
      if (this.companyCard) {
        await this.companyCard.destroy()
      }
      this.message.success("删除成功")
    } catch {
      this.message.error("操作失败")
    }

    this.getMemberList()
    this.removeModal = false;
  }

  async getTosaveObj(schema, id) {
    let profile = new Parse.Query(schema)
    return await profile.get(id)
  }
  fetchMerber() {
    this.fetchMember(this.merber.objectId).subscribe(res => {
      if (res.code != 200) {
        return this.message.error("网络错误，请稍后重试")
      }
      let data = res.data[0];
      console.log(data);
      this.memberlist.forEach((item, index) => {
        if (item.objectId == data.objectId) {
          this.memberlist[index] = data;
        }
      })
      this.cdRef.detectChanges()
    })
  }



  async searchDepart(event) {
    let searchString;
    if (event) {
      searchString = String(event);
    }
    let query = new Parse.Query("Department");
    query.equalTo("company", this.company)
    // 当该pointer有值时，搜索过滤该值
    if (this.merber['department']?.objectId) {
      console.log(this.merber['department'].objectId);
      query.notEqualTo(
        "objectId",
        this.merber['department'].objectId
      );
    }
    // 手动输入搜索条件
    if (searchString) {
      query.contains("name", searchString);
    }
    query.limit(20);
    let data = await query.find();
    console.log(data);
    this.selectDeparts = data
    this.cdRef.detectChanges();
  }
  departChange(event) {
    console.log(event);
    this.merber['department'] = event.toJSON();
    console.log(event, this.merber['department']);

  }



  printSinger(merber) {
    this.merber = merber;
    this.printModal = true

  }
  printBatch() {
    let searchType = this.searchTypeOpts.find(opt => opt.value == this.searchType)
    console.log(searchType, this.searchVal);
    this.searchVal = this.searchVal.trim()
    this.getMembersBySql(searchType, this.searchVal).subscribe(res => {
      if (res.code != 200) {
        return this.message.error("网络错误，请稍后重试")
      }
      this.batchMerber = res.data;
      console.log(this.batchMerber);

    })
    this.printBatchModal = true;
  }
  modalCancel() {
    this.printModal = false
  }
  async modalOk() {
    this.printLoading = true;
    let status: any = await this.printServ.Print({
      printdom: 'application',
      style: `@page {
        margin: .5cm;
        size: A4 portrait;
      } `,// 传入样式
      global: true
    })
    this.printLoading = false;
    if (status) {
      this.printModal = false;
      // return this.message.success("打印成功")
    }
    // this.message.error("打印失败")
  }
  batchModalCancel() {
    this.printBatchModal = false

  }
  async batchModalOk() {
    this.showAll = true;
    this.printLoading = true;
    let status: any = await this.printServ.Print({
      printdom: 'applications',
      style: `@page {
        margin: .5cm;
        size: A4 portrait;
      } `,// 传入样式
      global: true
    })
    this.printLoading = false;
    if (status) {
      this.printBatchModal = false;
      // return this.message.success("打印成功")
    }
  }

  pageIndexChange() {
    this.getMemberList()
  }
  pageSizeChange() {
    this.pageIndex = 1;
    this.getMemberList()

  }

  isShow:boolean = false
  type:number = 1
  currentid = ''
  async dAdunt(data, type) {
    this.isShow = true
    console.log(data,type)
    this.type = type
    this.currentid = data.objectId

  }

  handleCancel() {
    this.isShow = false
    this.type = 0
    this.currentid = ''
  }

 async handleOk() {
    let Profile = new Parse.Query('Profile')
    let profile = await Profile.get(this.currentid)
    if(this.type == 1 && profile.id) {
      profile.set('state', '总会审核中')
      await profile.save()
      this.getMemberList()
    }else {
      profile.set('state', '正式会员')
      await profile.save()
      this.getMemberList()
    }
    this.isShow = false
    this.type = 0
    this.currentid = ''
  }




  /* 获取会员列表 */
  getMembersBySql(type, value, pageIndex?, pageSize?): any {
    let compSql = ""
    let limitSql = ""
    if (type && value) {
      compSql = ` and ${type.classalias}."${type.value}" like '%${value}%'`
    }
    if (pageIndex || pageSize) {
      limitSql = ` offset(${(pageIndex - 1) * pageSize} ) limit ${pageSize}`
    }
    console.log(type, value);

    let sql = `select * from (
        select row_number() over(partition by pro."objectId" ) as  idx,pro.*,
            -- pro."name" ,pro."createdAt" ,pro."mobile",pro."title",pro."position",pro."department",
          depart."name" as "departname",
          card."objectId" as compcardid,card."companyInfo",
          recharge."totalFee"
          from "Profile" as pro
          left join "CompanyCard" as card on card."profile" = pro."objectId"
          left join "Department" as depart on pro."department" = depart."objectId"
          left join "ProfileRecharge" as recharge on recharge."profile" = pro."objectId"
          where pro."company"='${this.company}'
        )data where data."idx"=1  ${compSql} order by data."createdAt" desc  ${limitSql}`
    return this.httpSql(sql).pipe(res => res)
  }
  /* 获取会员数量 */
  getMemberCount(): any {
    let sql = `select count(*) from "Profile" as pro
      where pro."company"='${this.company}' `
    return this.httpSql(sql).pipe(res => res)
  }
  /* 更新单条会员数据 */
  fetchMember(id): any {
    let sql = `select * from (
        select row_number() over(partition by pro."objectId" ) as  idx,pro.*,
            -- pro."name" ,pro."createdAt" ,pro."mobile",pro."title",pro."position",pro."department",
          depart."name" as "departname",
          card."objectId" as compcardid,card."companyInfo",
          recharge."totalFee"
          from "Profile" as pro
          left join "CompanyCard" as card on card."profile" = pro."objectId"
          left join "Department" as depart on pro."department" = depart."objectId"
          left join "ProfileRecharge" as recharge on recharge."profile" = pro."objectId"
          where pro."company"='${this.company}'
        )data where data."idx"=1  and data."objectId"='${id}';`
    console.log(sql);
    return this.httpSql(sql).pipe(res => res)
  }

  async getRouteById(id) {
    let queryRoute = new Parse.Query("DevRoute");
    let route = await queryRoute.get(id);
    return route;
  }
  httpSql(sql, params = []) {
    let baseurl = "https://server.fmode.cn/api/novaql/select";
    return this.http.post(baseurl, { sql: sql, ...params })
  }
}
