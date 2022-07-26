import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: "app-school-class",
  templateUrl: "./school-class.component.html",
  styleUrls: ["./school-class.component.scss"],
})
export class SchoolClassComponent implements OnInit {
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private router: Router
  ) { }
  department: string; // 院校
  departs: any;
  cates: any; // 考点/函授站点
  cateId: string; // 考点id
  recruit: any; // 招生计划
  langs: any[]; // 供选择的语种
  user: any;
  fields: any; // schema fields
  devRoute: any; // DevRouter
  editFields: any; // DevRouter => editFields
  displayedColumns: any; // DevRouter displayedColumns
  listOfColumn = [];
  company: any;
  pCompany: any;
  listOfData: any = [];
  filterData: Array<any> = [];
  filterType: string;
  inputValue: string;
  searchType: any = "name";
  siteUrl: string;
  loading: boolean = false;
  langCodes: any[] = []; // 语种代码数组

  isEmptyClass = false
  isOkLoading = false

  /* 导出 */
  gridApi;
  gridColumnApi;

  groupHeaderHeight = 40;
  headerHeight = 40;
  floatingFiltersHeight = 40;
  pivotGroupHeaderHeight = 50;
  pivotHeaderHeight = 100;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department");
      this.company = localStorage.getItem("company");
      this.user = Parse.User.current();
      console.log(this.user);
      if (this.department && this.company) {
        let Company = new Parse.Query("Company");
        let company = await Company.get(this.company);
        this.pCompany = company.get("company").id;
      }
      if (!this.department) {
        this.listOfColumn.splice(0, 0, {
          title: "院校",
          compare: null,
          priority: false,
        });
        this.departs = await this.getDeparts();
      }
      let user = Parse.User.current();
      if (user && user.get("cates")) {
        this.cates = user.get("cates");
        this.cateId = this.cates[0].id;
        localStorage.setItem("cateId", this.cateId);
      }
      await this.getRecruit();
      this.getDevRoute();
      this.getClassSchema();
      this.getSchoolClass();
      this.getSiteUrl();
      this.getNoClassPro();
      this.getExportData();
    });
  }

  /* ------------ 页面参数 begin ----------------- */
  async getDevRoute() {
    let Route = new Parse.Query("DevRoute");
    let route = await Route.get("E9BfrwGtwQ");
    this.devRoute = route;
    let displayedColumns = route.get("displayedColumns");
    displayedColumns = displayedColumns.filter((item) => item != "cates");
    console.log(displayedColumns);
    let editFields = route.get("editFields");
    this.editFields = editFields;
    console.log(displayedColumns, editFields);
    for (let index = 0; index < editFields.length; index++) {
      const field = editFields[index];
      if (JSON.stringify(displayedColumns).indexOf(field["key"]) != -1) {
        console.log(field);
        this.listOfColumn.push({
          title: field["name"],
          value: field["key"],
          type: field["type"],
          required: field["check"] ? field["check"] : false,
          view: field["view"],
          desc: field["desc"],
          sortOrder: null,
          // sortOrder: field['key'] == 'testNumber'?'ascend',
          sortDirections: ["ascend", "descend"],
          sortFn: (a, b) => a[field["key"]] - b[field["key"]],
        });
      }
    }
    this.listOfColumn.splice(this.listOfColumn.length, 0, {
      title: "操作",
      value: "",
      type: "",
      compare: null,
      priority: false,
    });
  }
  async getClassSchema() {
    const Schema = new Parse.Schema("SchoolClass");
    let schema: any = await Schema.get();
    this.fields = schema.fields;
  }
  /* ------------ 页面参数 end ----------------- */

  /* ------------ 数据源 begin ----------------- */
  pageSize: number = 10;
  pageIndex: number = 1;
  filterLen: number;
  noClassPros: any[]; // 未导入考场考生
  noClassCount: number; // 未导入考场考生数量
  async getSchoolClass(skip?) {
    this.loading = true;
    let SchoolClass = new Parse.Query("SchoolClass");
    SchoolClass.ascending("createdAt");
    SchoolClass.equalTo("company", this.pCompany || this.company);
    console.log(this.cateId);
    if (this.cateId) {
      SchoolClass.containedIn("cates", [
        {
          className: "Category",
          __type: "Pointer",
          objectId: this.cateId,
        },
      ]);
    }
    if (this.department) {
      SchoolClass.equalTo("department", this.department);
    }
    SchoolClass.include("cates");
    SchoolClass.include("department");
    if (this.inputValue && this.inputValue.trim() != "") {
      if (this.searchType == "lang") {
        this.langs.filter((item) => {
          if (item.name == this.inputValue) {
            SchoolClass.contains(this.searchType, item.code);
          }
        });
      } else {
        switch (this.fields[this.searchType].type) {
          case 'Number':
            SchoolClass.equalTo(this.searchType, this.inputValue);
            break;

          default:
            SchoolClass.contains(this.searchType, this.inputValue);

            break;
        }
      }
    }
    let sort = this.sort;
    if (sort && sort["value"] == "ascend") {
      SchoolClass.ascending(sort["key"]);
    }
    if (sort && sort["value"] == "descend") {
      SchoolClass.descending(sort["key"]);
    }
    if (this.pageSize > 0) {
      SchoolClass.skip((this.pageIndex - 1) * this.pageSize);
    }
    SchoolClass.limit(this.pageSize);
    let classArr: any = await SchoolClass.find();
    console.log(classArr);
    if (classArr && classArr.length) {
      this.listOfData = classArr;
      /* 获取各个考场已导入考生数 */
      for (let index = 0; index < classArr.length; index++) {
        let pros = await this.getStudents(classArr[index].id);
        classArr[index].count = (pros && pros.length) || 0;
        // if(classArr[index].count != 30){
        //   console.log(classArr[index]);
        // }
      }
      this.filterData = classArr;
      this.filterLen = await this.getCount();
      this.loading = false;
    } else {
      this.filterData = [];
      this.filterLen = 0;
      this.loading = false;
    }
  }



  async getStudents(id) {
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.equalTo("department", this.department);
    Profile.equalTo("company", this.pCompany || this.company);
    Profile.equalTo("schoolClass", id);
    Profile.ascending("cardnum");
    let pros = await Profile.find();
    if (pros && pros.length) {
      return pros;
    }
  }
  async getCount() {
    let SchoolClass = new Parse.Query("SchoolClass");
    SchoolClass.equalTo("department", this.department);
    SchoolClass.equalTo("company", this.pCompany || this.company);
    if (this.cates) {
      SchoolClass.containedIn("cates", [
        {
          className: "Category",
          __type: "Pointer",
          objectId: this.cates[0].id,
        },
      ]);
    }
    if (this.inputValue && this.inputValue.trim() != "") {
      switch (this.fields[this.searchType].type) {
        case 'Number':
          SchoolClass.equalTo(this.searchType, this.inputValue);
          break;

        default:
          SchoolClass.contains(this.searchType, this.inputValue);

          break;
      }
    }
    let count = await SchoolClass.count();
    return count;
  }
  pageChange(e) {
    this.getSchoolClass();
  }
  async getRecruit() {
    let RecruitStudent = new Parse.Query("RecruitStudent");
    RecruitStudent.equalTo("isOpen", true);
    RecruitStudent.equalTo("department", this.department);
    let recruitStudent: any = await RecruitStudent.first();
    if (recruitStudent && recruitStudent.id) {
      this.recruit = recruitStudent;
      console.log(this.recruit)
      if (recruitStudent.get("config")["fieldConf"]) {
        let field = recruitStudent.get("config")["fieldConf"];
        if (field["lang"] && field["lang"]["isEnabled"]) {
          this.langs = field["lang"]["options"];
        }
      }
    } else {
      this.message.error("未开启招生计划");
    }
  }
  async getDeparts() {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("company", this.company);
    queryD.ascending("createdAt");
    let res = await queryD.find();
    if (res && res.length) {
      this.department = res[0].id;
      return res;
    }
  }
  async getSiteUrl() {
    let querySite = new Parse.Query("Site");
    querySite.equalTo("company", this.company);
    let site = await querySite.first();
    if (site && site.id) {
      this.siteUrl = site.get("domain")[0];
    }
  }
  async getNoClassPro() {
    let sql = '';
    let baseurl = "https://server.fmode.cn/api/novaql/select";
    sql = `select * from (select * from "Profile" where "isDeleted" is not true) as "pro" inner join "AccountLog" as "log" on substring("log"."orderId",2,10)="pro"."objectId"
    where "pro"."department"='${this.department}'  and "pro"."schoolClass" is null and "log"."isVerified" is true and "log"."isback" is not true
     and  "log"."desc" like '%${this.recruit.id}%' `;
    if (this.cates) {
      sql = `select * from (select * from "Profile" where "isDeleted" is not true) as "pro" inner join "AccountLog" as "log" on substring("log"."orderId",2,10)="pro"."objectId"
    where "pro"."department"='${this.department}' and "pro"."cates" @> '[{ "objectId": "${this.cateId}"}]'  and "pro"."schoolClass" is null  and "log"."isVerified" is true and "log"."isback" is not true
     and  "log"."desc" like '%${this.recruit.id}%' `;
    }

    console.log(sql)
    this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
      console.log(res)
      if (res.code == 200) {
        if (res.data && res.data.length) {
          this.noClassPros = res.data;
          this.noClassCount = res.data.length;
        } else {
        }
      } else {
        this.message.info("网络繁忙，数据获取失败");
      }
    });
  }
  /* ------------ 数据源 end ----------------- */

  /* -------- 搜索 begin -------- */
  searchTypeChange(e) {
    this.searchType = e;
  }
  searchStudent() {
    if (!this.inputValue) {
      this.filterData = this.listOfData;
      return;
    }
    let value = this.inputValue.trim();
    this.filterData = this.listOfData.filter((item: any) => {
      let i = item.get(this.searchType);
      if (this.fields[this.searchType].type == "Array") {
        return i[0] && i[0].get("name") && i[0].get("name").indexOf(value) > -1;
      }
      i = JSON.stringify(i);
      return i && i.indexOf(value) != -1;
    });
    this.cdRef.detectChanges();
  }
  /* -------- 搜索 end -------- */

  /* -------- 操作按钮 begin -------- */

  operatModal = false;
  operatData;
  operatStatus;
  tpl;
  templateId;
  saveData: any;
  async operat(status, data?) {
    this.operatStatus = status;
    this.operatData = data ? data.toJSON() : {};
    switch (status) {
      case "edit":
        this.langCodes = [];
        this.saveData = data;
        this.editFields.forEach((field) => {
          if (field.type && field.type == "Date") {
            if (this.operatData[field.key]) {
              let date = this.operatData[field.key].iso;
              this.operatData[field.key] = new Date(date);
            }
          }
          if (field.key && field.key == "lang") {
            this.getLangCodes(data.get("lang"));
          }
        });
        this.operatModal = true;
        console.log(this.operatData);
        break;
      case "add":
        this.langCodes = [];
        this.operatModal = true;
        break;
      case "delete":
        break;
      case "notice":
        break;
      case "student":
        this.router.navigate([
          `/english/student-manage`,
          { PclassName: "SchoolClass", PobjectId: data.id },
        ]);
        break;
      case "printTotal":
        // this.router.navigate(['/english/print-class'])
        window.open("/english/print-class;type=total");
        break;
      case "printList":
        // this.router.navigate(['/english/print-class'])
        // window.open("/english/print-class;type=list", 'newwindow', 'width=1200, height=700, top=180, left=300, titlebar=no, menubar=no, scrollbars=yes, resizable=yes, status=yes, , toolbar=no, location=yes')
        window.open("/english/print-class;type=list");
        break;
      case "printSclass":
        window.open("/english/print-class;type=sclass");
        break;
      case "export":
        let sclass = data.id;
        let sPros = await this.getStudents(sclass);
        this.rowData = [];
        for (let index = 0; index < sPros.length; index++) {
          let pro = sPros[index].toJSON();
          pro["idcard"] = "`" + pro["idcard"];
          pro["workid"] = "`" + pro["workid"];
          this.rowData.push(pro);
        }
        break;
      default:
        break;
    }

    return;
  }

  /* 导出 */
  exportColumn: any = [];
  fileds: any;
  rowData: any = [];
  getExportData() {
    this.exportColumn = [];
    this.exportColumn = [
      { headerName: "姓名", field: "name" },
      { headerName: "身份证号", field: "idcard" },
      { headerName: "手机号", field: "mobile" },
      { headerName: "座位号", field: "cardnum" },
      { headerName: "语种", field: "lang" },
      { headerName: "准考证号", field: "workid" },
    ];
  }
  // ag-grid 生命周期
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  // 导出函数 :
  export() {
    this.gridApi.exportDataAsExcel();
  }
  /* ********* 导出 end ********* */

  getLangCodes(langCodes) {
    if (langCodes) {
      this.langs.forEach((lang) => {
        if (langCodes.indexOf(lang.code) != -1) {
          this.langCodes.push(lang.code);
        }
      });
    }
  }
  /* -------- 操作按钮 end -------- */

  /* -------- 弹窗 begin -------- */

  handleCancel() {
    this.operatModal = false;
  }
  async checked() {
    let save;
    if (this.operatStatus == "add") {
      let SchoolClass = Parse.Object.extend("SchoolClass");
      let sClass = new SchoolClass();
      this.listOfColumn.forEach((column) => {
        if (column.type && column.type != "") {
          if (column.value == "lang" && this.langCodes) {
            sClass.set(column.value, String(this.langCodes));
          } else if (column.value == "testNumber") {
            sClass.set(column.value, +this.operatData[column.value]);
          } else {
            sClass.set(column.value, this.operatData[column.value]);
          }
        }
      });
      sClass.set({
        company: {
          __type: "Pointer",
          className: "Company",
          objectId: this.pCompany || this.company,
        },
      });
      sClass.set({
        department: {
          __type: "Pointer",
          className: "Department",
          objectId: this.department,
        },
      });
      sClass.set({
        departments: [
          {
            __type: "Pointer",
            className: "Department",
            objectId: this.department,
          },
        ],
      });
      if (this.cates && this.cates[0]) {
        sClass.set({
          cates: [
            {
              __type: "Pointer",
              className: "Category",
              objectId: this.cates[0].id,
            },
          ],
        });
      }
      save = await sClass.save().catch((err) => console.log(err));
    } else {
      this.listOfColumn.forEach((column) => {
        if (column.type && column.type != "") {
          if (column.value == "lang" && this.langCodes) {
            this.saveData.set(column.value, String(this.langCodes));
          } else if (column.value == "testNumber") {
            this.saveData.set(column.value, +this.operatData[column.value]);
          } else {
            this.saveData.set(column.value, this.operatData[column.value]);
          }
        }
      });
      save = await this.saveData.save().catch((err) => console.log(err));
    }
    if (save && save.id) {
      console.log(save);
      this.message.success("保存成功");
      this.langCodes = [];
      this.operatModal = false;
      this.getSchoolClass();
      this.cdRef.detectChanges();
    } else {
      this.message.success("保存失败");
    }
  }

  /* -------- 弹窗 end -------- */

  /* -------- 删除 气泡框 begin -------- */
  async confirmDelete(data) {
    let classId = data.id;
    let havStudent = await this.getClassStu(classId);
    if (havStudent) {
      this.message.success("请先清空考场内考生");
      return;
    } else {
      let res = await this.deleteClass(data);
      console.log(res);
      if (res && res.id) {
        this.message.success("删除成功");
        this.listOfData.forEach((el, i, arr) => {
          if (el.id == classId) {
            this.listOfData.splice(i, 1);
          }
        });
        this.getSchoolClass();
        this.cdRef.detectChanges();
      } else {
        this.message.success("网络繁忙，请稍后再试");
      }
    }
  }

  cancelDelete(): void { }
  async getClassStu(classId) {
    let Students = new Parse.Query("Profile");
    Students.notEqualTo("isDeleted", true);
    Students.equalTo("company", this.pCompany || this.company);
    Students.equalTo("department", this.department);
    Students.equalTo("schoolClass", classId);
    let students = await Students.find();
    if (students && students.length) {
      return true;
    } else {
      return false;
    }
  }
  async deleteClass(data): Promise<any> {
    let sclass;
    let del = await data.destroy();
    if (del && del.id) {
      sclass = del;
      console.log(sclass);
      return sclass;
    } else {
      return false;
    }
  }
  async removeClass(classId) {
    return new Promise((resolve, reject) => {
      let sucessCount = 0;
      let failCount = 0;
      let Students = new Parse.Query("Profile");
      Students.notEqualTo("isDeleted", true);
      Students.equalTo("company", this.pCompany || this.company);
      Students.equalTo("department", this.department);
      Students.equalTo("schoolClass", classId);
      Students.find()
        .then((students) => {
          if (students && students.length) {
            resolve(false);
            // students.forEach(student => {
            //   student.set("schoolClass", null);
            //   student.save().then(data => sucessCount += 1).catch(err => failCount += 1)
            // })
            // resolve({ count: 0, sucessCount, failCount })
          } else {
            // resolve({ count: 0 })
            resolve(true);
          }
        })
        .catch((err) => {
          // reject({ err, count: 0 })
          reject(false);
        });
    });
  }
  /* -------- 删除 end -------- */

  /* 排序 */
  sort: object = {
    // "key":'testNumber',
    // "value":"ascend"
  };
  sortData(column, ev) {
    this.sort["key"] = column.value;
    this.sort["value"] = ev;
    this.getSchoolClass();
  }

  /* 语种选择 */
  langChange(e) {
    console.log(e);
  }

  // 删除所有的考场
  removeAllClass() {
    this.isEmptyClass = true
  }

  async emptyHandleOk() {
    this.isOkLoading = true;

    // 所有考场的id
    let classList = []

    // 查询出所有考场
    let SchoolClass = new Parse.Query("SchoolClass");
    SchoolClass.equalTo("company", this.pCompany || this.company);
    SchoolClass.equalTo("department", this.department);
    if (this.cateId) {
      SchoolClass.containedIn("cates", [
        {
          className: "Category",
          __type: "Pointer",
          objectId: this.cateId,
        },
      ]);
    }
    let classCount = await SchoolClass.count();
    SchoolClass.limit(classCount);
    let schoolClassInfo = await SchoolClass.find()
    console.log(schoolClassInfo)
    if (!schoolClassInfo && schoolClassInfo.length < 0) {
      this.isEmptyClass = false;
      this.isOkLoading = false;
      this.message.create("waring", "不存在考场无需删除!");
      return
    }

    for (let i = 0; i < schoolClassInfo.length; i++) {
      classList.push(schoolClassInfo[i].id)
    }
    console.log(classList)

    // 清空所有考生
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.containedIn("schoolClass", classList);
    let count = await Profile.count()
    console.log(count)
    Profile.limit(count)
    let profileInfo = await Profile.find();
    if (profileInfo && profileInfo.length) {
      console.log(profileInfo)

      for (let i = 0; i < profileInfo.length; i++) {
        profileInfo[i].unset("schoolClass");
        profileInfo[i].unset("cardnum");
        profileInfo[i].unset("workid");
        profileInfo[i].unset("location");
        profileInfo[i].unset("serial");
        await profileInfo[i].save();
      }
    }

    // 删除考场
    for (let i = 0; i < schoolClassInfo.length; i++) {
      await schoolClassInfo[i].destroy()
      console.log("删除成功")
    }
    this.filterData = [];
    this.isEmptyClass = false;
    this.isOkLoading = false;
    this.message.create("info", "删除成功");
  }

  emptyCancel() {
    this.isEmptyClass = false;
  }

  async changeSchool(e) {
    this.department = e;
    this.getRecruit();
    this.getSchoolClass();
    this.getSiteUrl();
    this.getNoClassPro();
    this.getExportData();
  }
}
