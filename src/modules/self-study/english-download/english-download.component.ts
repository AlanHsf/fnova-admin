import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import 'ag-grid-enterprise';
import JSZip from "jszip";
import * as FileSaver from "file-saver";

@Component({
  selector: 'app-english-download',
  templateUrl: './english-download.component.html',
  styleUrls: ['./english-download.component.scss']
})
export class EnglishDownloadComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute, private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient) { }
  department: string;// 院校
  company: any;
  pCompany: any;
  cateId: string;
  cate: any;

  // ag-grid
  rowData: any = [];
  showExport: boolean = false;
  groupHeaderHeight = 40;
  headerHeight = 40;
  floatingFiltersHeight = 40;
  pivotGroupHeaderHeight = 50;
  pivotHeaderHeight = 100;
  gridApi;
  gridColumnApi;

  // 表格
  displayedColumns: Array<any> = [];
  // 表格上标题
  listOfColumn = [
    {
      title: '姓名',
      value: 'name',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '身份证号',
      value: 'idcard',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '所属专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '所属院校',
      value: 'depaName',
      type: 'String',
      compare: null,
      schemaAlia: 'depa1'
    },
    {
      title: '教学点',
      value: 'centerName',
      type: 'String',
      compare: null,
      schemaAlia: 'depa2'
    },
    {
      title: '毕业证编号',
      value: 'gradNumber',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '证件照',
      value: 'image',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '毕业文件',
      value: 'gradeFile',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '是否下载',
      value: 'isDownload',
      type: 'Boolean',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '操作',
      value: '',
      type: '',
      compare: null,
      priority: false
    }
  ];

  listOfData: any = [];
  filterData: any = [];
  filterType: string;
  filterLen: number;
  isLoading: boolean = true;
  count: number;

  // 筛选
  inputValue: string;
  searchType: any = {};
  // edit
  isVisibleEditModal: boolean = false;
  className: 'Profile';
  proField: any;
  object: any;
  route: any;// devroute
  keys: any;
  editFields: any;
  recruitId: string;// 招生计划id
  center;
  async ngOnInit(): Promise<void> {
    this.department = localStorage.getItem("department");
    this.company = localStorage.getItem("company");

    // 教学点
    let depa = new Parse.Query("Department")
    depa.equalTo("objectId", this.department);
    depa.equalTo("type", "training");
    let depaInfo = await depa.first()
    console.log(depaInfo)
    if (depaInfo && depaInfo.id) {
      this.center = depaInfo.id
      // this.company = depaInfo.get("company").id
      this.department = null
    }

    if (this.department && this.company) {
      let Company = new Parse.Query("Company");
      let company = await Company.get(this.company);
      console.log(company)
      this.pCompany = company.get("company").id;
      this.cateId = localStorage.getItem("cateId")
      console.log(this.cateId)

    } else if (!this.department || this.center) {
      // this.listOfColumn.splice(0, 0, {
      //   title: '院校',
      //   value: 'shortname',
      //   type: 'String',
      //   compare: null,
      //   schemaAlia: 'depa1'
      // })
    }
    this.searchType = this.listOfColumn[0]
    // await this.getCate()
    // this.getDevRoute()
    this.getProfiles();
    // this.getCount()
    // this.exportInit();
  }
  async getDepart(recruitId) {
    let Recruit = new Parse.Query("RecruitStudent");
    let recruit = await Recruit.get(recruitId);
    if (recruit && recruit.id) {
      return recruit.get("department") && recruit.get("department").id
    }
  }

  async getProfileSchema() {
    const mySchema = new Parse.Schema('Profile');
    let proSche: any = await mySchema.get();
    console.log(proSche);
    this.proField = proSche.fields;
  }
  // require: any = [];
  // fileds: any;
  // exportInit() {
  //   this.require = [];
  //   this.exportListOfColumn.forEach(col => {
  //     let headerName = col['title'];
  //     let field = col['value'];
  //     this.require.push({
  //       headerName,
  //       field,
  //     })
  //   });
  // }

  pageIndex: number = 1;
  pageSize: number = 10;
  async getProfiles(skip?, inputVal?, filter?) {
    let company = this.pCompany || this.company;

    // let Profile = new Parse.Query('Profile')
    // Profile.containedIn('departments',[{
    //   __type:"Pointer",
    //   className: 'Department',
    //   objectId: department
    // }])
    // Profile.include("department")
    // Profile.include("center")
    // Profile.include("SchoolMajor")
    // Profile.select('name', 'idcard',"department.name", "center.name", "SchooMajor.name")
    // await Profile.find()
    console.log(this.pCompany, this.company, this.department)

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let compleSql = '';

    let selectSql = `select 
    "apply"."objectId",
    "apply"."name",
    "apply"."idcard",
    "depa1"."depaName",
    "depa2"."centerName",
    "major"."majorName",
    "apply"."gradeNumber",
    "apply"."image",
    "apply"."gradeFile",
    substring("apply"."gradeFile", LENGTH("apply"."gradeFile") - 3) as "gradeType",
    "apply"."isDownload" `

    let fromSql = ` from 
      (select "objectId","name","idcard","school","major","center","gradeNumber","image","gradeFile","isDownload","createdAt" 
      from "DegreeApply" where "company" = '1ErpDVc1u6') as "apply"
    left join (select "objectId","name" as "depaName" from "Department") as "depa1" on "depa1"."objectId" = "apply"."school"
    left join (select "objectId","name" as "centerName" from "Department") as "depa2" on "depa2"."objectId" = "apply"."center"
    left join (select "objectId","name" as "majorName" from "SchoolMajor") as "major" on "major"."objectId" = "apply"."major"
    `
    let whereSql = ` where 1 = 1 `
    if (this.searchType.type == 'Boolean') {
      if (this.inputValue == "已下载") {
        whereSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" is true `
      } else if (this.inputValue == "未下载") {
        whereSql += ` and ("${this.searchType.schemaAlia}"."${this.searchType.value}" is null or "${this.searchType.schemaAlia}"."${this.searchType.value}" is false) `
      }
    } else if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" like '%${this.inputValue}%' `
    }

    console.log(whereSql)

    let orderSql = ` order by "apply"."createdAt" desc `
    let breakSql = ` limit ${this.pageSize} offset  (${this.pageIndex - 1} * ${this.pageSize})`

    compleSql = selectSql + fromSql + whereSql + orderSql + breakSql
    console.log(compleSql);
    this.http
      .post(baseurl, { sql: compleSql })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data && res.data.length) {
            this.listOfData = res.data;
            let countSql = `select count(*) ${fromSql} ${whereSql}`
            console.log(countSql)
            this.filterLen = await this.getCount(countSql);
            this.filterData = res.data;
            this.cdRef.detectChanges();
            this.isLoading = false;
          } else {
            this.filterData = [];
            this.cdRef.detectChanges();
            this.filterLen = 0;
            this.isLoading = false;
          }
        } else {
          this.message.info("网络繁忙，数据获取失败")
        }
      })
    return
  }


  pageChange(e) {
    this.isLoading = true
    this.getProfiles()
  }
  pageSizeChange(e) {
    console.log(e)
    this.pageSize = e;
    this.isLoading = true
    this.getProfiles()
  }

  async getCate() {
    let user = Parse.User.current();
    if (user && user.get("cates")) {
      let cates = user.get("cates")
      if (cates && cates.length) {
        cates.forEach(cate => {
          console.log(cate);
          this.cateId = cate.id
          console.log(this.cateId)
          if (cate.get("type") == 'test') {
            this.cateId = cate.id
            console.log(this.cateId)
          }
        });
      }
    }
  }
  async getCount(sql): Promise<number> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http
        .post(baseurl, { sql: sql })
        .subscribe(async (res: any) => {
          console.log(res);
          let count: number = 0;
          if (res.code == 200) {
            count = +res.data[0].count
            resolve(count)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            resolve(count)
          }
        })
    })

  }
  novaSql(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
      this.http
        .post(baseurl, { sql: sql })
        .subscribe(async (res: any) => {
          console.log(res);
          if (res.code == 200) {
            resolve(res.data)
          } else {
            this.message.info("网络繁忙，数据获取失败")
            reject(res)
          }
        })
    })
  }
  dateFormat(time) {
    time = new Date(time);
    let Year = time.getFullYear();
    let Month = time.getMonth() + 1;
    let Day = time.getDate();
    let Hours = time.getHours();
    let Minutes = time.getMinutes();
    Hours = Hours == 0 ? '00' : (Hours < 10 ? '0' + Hours : Hours)
    Minutes = Minutes == 0 ? '00' : (Minutes < 10 ? '0' + Minutes : Minutes)
    time = Year + '/' + Month + '/' + Day + '  ' + Hours + ':' + Minutes;
    return time
  }
  searchTypeChange(e) {
    let index = this.listOfColumn.findIndex(item => item.value == e);
    console.log(e);
    if (index != -1) {
      this.searchType = this.listOfColumn[index];
      console.log(this.searchType)
    }
  }
  async searchStudent() {
    this.isLoading = true
    if (!this.inputValue) {
      // (this.filterLen as any) = await this.getCount();
      this.getProfiles()
      return;
    }
    this.inputValue = this.inputValue.trim();
    await this.getProfiles(null, this.inputValue)
    this.cdRef.detectChanges();
  }

  // 批量选中
  addIdArr: any = [];
  AllExChecked: boolean = false;
  onExAllChecked(value) {
    this.AllExChecked = value;
    if (!this.AllExChecked) {
      this.addIdArr = [];
    }
    this.filterData.forEach(data => {
      if (value) {
        this.addIdArr.push(data);
      }
      data.checked = value;
    });
  }
  onItemChecked(data, e) {
    if (e == true) {
      this.addIdArr.push(data);
    } else {
      this.addIdArr.splice(
        this.addIdArr.findIndex(item => item.id == data.id),
        1
      );
      this.AllExChecked = false;
    }
    // 全部选择后全选自动为true
    let status = true;
    this.filterData.forEach(student => {
      if (!student.checked) {
        status = false;
      } else {
        return;
      }
    });
    setTimeout(() => {
      if (status == true) {
        this.AllExChecked = true;
      }
    }, 500);
  }

  async operate(type, data?) {
    if (type == 'edit') {
      this.object = Object.assign({}, data);
      console.log(this.object);
    }
    if (type == 'save') {
      // let id = this.object.objectId;
      console.log(data);
      let Query = new Parse.Query("Profile");
      Query.notEqualTo("isDeleted", true);
      Query.equalTo("objectId", data);
      let query = await Query.first();
      console.log(data, query);
    }
    if (type == 'fileDownload') {
      const object = Object.assign({}, data);
      console.log(object);
      if (object.image) {
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "证件照" + object.image.substring(object.image.lastIndexOf("."))
        fileInfo.url = object.image
        this.files.push(fileInfo)
      }
      if (object.gradeFile) {
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "毕业证" + object.gradeFile.substring(object.gradeFile.lastIndexOf("."))
        fileInfo.url = object.gradeFile
        this.files.push(fileInfo)
      }

      if (this.files.length) {
        this.downloadFile(object.name + object.idcard);

        let apply = new Parse.Query("DegreeApply");
        let applyInfo = await apply.get(object.objectId)
        console.log(applyInfo)
        if (applyInfo && applyInfo.id) {
          applyInfo.set("isDownload", true)
          let applyData = await applyInfo.save();
          console.log(applyData)

          this.getProfiles()
        }

      } else {
        this.message.error("没有需要下载的文件!")
        return
      }


    }
  }

  files: any = []
  // 打包下载
  downloadFile(filename) {
    console.log(this.files)
    let zip = new JSZip();
    let folder = zip.folder('files');
    Promise.resolve().then(() => {
      return this.files.reduce((accumulator, item) => {
        return accumulator.then(() => fetch(item.url)
          .then(resp => resp.blob())
          .then(blob => folder.file(item.name, blob)))
      }, Promise.resolve())
    }).then(() => {
      folder.generateAsync({ type: "blob", compression: 'DEFLATE', compressionOptions: { level: 9 } }).then(content => FileSaver(content, filename + ".zip"));
    })
  }

  async getBatchId() {
    console.log(this.addIdArr)
    if (!this.addIdArr.length) {
      this.message.error("请先选择数据再进行该操作! ")
      return
    }

    this.batchDownload()

    let idArr = []
    for (let i = 0; i < this.addIdArr.length; i++) {
      idArr.push(this.addIdArr[i].objectId)
    }
    console.log(idArr)

    let apply = new Parse.Query("DegreeApply")
    apply.containedIn("objectId", idArr)
    apply.equalTo("company", "1ErpDVc1u6")
    // apply.notEqualTo("isDeleted", true);
    let applyList = await apply.find();
    console.log(applyList)
    if (applyList.length) {
      for (let i = 0; i < applyList.length; i++) {
        applyList[i].set("isDownload", true)
        let applyInfo = await applyList[i].save();
        console.log(applyInfo)
      }
    }
    await this.getProfiles()
    this.AllExChecked = false
  }
  // 批量下载
  async batchDownload() {
    let zip = new JSZip();
    let folder = zip.folder('学生学位申请管理');
    let promises = []
    for (let i = 0; i < this.addIdArr.length; i++) {
      console.log(i, this.addIdArr.length)
      const meshes = folder.folder(this.addIdArr[i].name + this.addIdArr[i].idcard)
      let imgFile = []
      if (this.addIdArr[i].image) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "毕业证" + this.addIdArr[i].image.substring(this.addIdArr[i].image.lastIndexOf("."))
        imageInfo.url = this.addIdArr[i].image
        imgFile.push(imageInfo)
      }
      if (this.addIdArr[i].gradeFile) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "学籍表" + this.addIdArr[i].gradeFile.substring(this.addIdArr[i].gradeFile.lastIndexOf("."))
        imageInfo.url = this.addIdArr[i].gradeFile
        imgFile.push(imageInfo)
      }

      console.log(imgFile)
      let promiseInfo = Promise.resolve().then(() => {
        return imgFile.reduce((accumulator, item) => {
          console.log(accumulator, item)
          return accumulator.then(() => fetch(item.url)
            .then(resp => resp.blob())
            .then(blob => meshes.file(item.name, blob)))
        }, Promise.resolve())
      })
      promises.push(promiseInfo)
    }

    Promise.all(promises).then(() => {
      zip.generateAsync({ type: "blob", compression: 'DEFLATE', compressionOptions: { level: 9 } }).then(content => {
        // 生成二进制流
        FileSaver.saveAs(content, "学生学位申请管理.zip");
      });
    })
  }

}