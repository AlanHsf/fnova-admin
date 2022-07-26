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
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import JSZip from "jszip";
import * as FileSaver from "file-saver";
declare var qiniu: any;

@Component({
  selector: 'app-paper-download',
  templateUrl: './paper-download.component.html',
  styleUrls: ['./paper-download.component.scss'],
  providers: [DatePipe]
})
export class PaperDownloadComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute, private message: NzMessageService, private cdRef: ChangeDetectorRef, private http: HttpClient, private dateFmt: DatePipe) { }
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
      schemaAlia: 'pro'
    },
    {
      title: '身份证号',
      value: 'idcard',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '论文标题',
      value: 'title',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '层次',
      value: 'education',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
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
      title: '论文(pdf)',
      value: 'paper',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '论文(word)',
      value: 'document',
      type: 'String',
      compare: null,
      schemaAlia: 'apply'
    },
    {
      title: '查重报告',
      value: 'checkReport',
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
  centerId;
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
      this.centerId = depaInfo.id
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

    } else if (!this.department || this.centerId) {
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
    "paper"."objectId",
    "pro"."name",
    "pro"."idcard",
    "pro"."education",
    "paper"."title",
    "major"."majorName",
    "depa1"."depaName",
    "depa2"."centerName",
    "paper"."paper",
    "paper"."document",
    "paper"."checkReport",
    "paper"."isDownload" `

    let fromSql = ` from 
      (select "objectId","title","paper","document","checkReport","profile","department","departments","center","major","isDownload","createdAt" from "SchoolPaper" where "company" = '1ErpDVc1u6' and ("isCross" is null or "isCross" is not true)) as "paper"
    join 
      (select "objectId","name","idcard","education" from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true) as "pro"
        on "paper"."profile" = "pro"."objectId"
    left join (select "objectId","name" as "majorName" from "SchoolMajor") as "major" on "major"."objectId" = "paper"."major"
    left join (select "objectId","name" as "depaName" from "Department") as "depa1" on "depa1"."objectId" = "paper"."department"
    left join (select "objectId","name" as "centerName" from "Department") as "depa2" on "depa2"."objectId" = "paper"."center"
    `
    let whereSql = ``
    if (this.centerId) {
      whereSql += ` where "paper"."departments" @> '[{ "objectId": "${this.centerId}"}]' `
    } else if (this.department && !this.centerId) {
      whereSql += ` where "paper"."departments" @> '[{ "objectId": "${this.department}"}]' `
    } else {
      whereSql += ` where 1 = 1 `
    }

    if (this.searchType.type == 'Boolean') {
      if (this.inputValue == "已下载") {
        whereSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" is true `
      } else if (this.inputValue == "未下载") {
        whereSql += ` and ("${this.searchType.schemaAlia}"."${this.searchType.value}" is null or "${this.searchType.schemaAlia}"."${this.searchType.value}" is false) `
      }
    } else if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" like '%${this.inputValue}%' `
    }
    let orderSql = ` order by "paper"."createdAt" desc `
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
  pageSizeChange(e){
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
  checkReport
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

  // 证件照
  image;
  // 身份证照片
  photo;
  // 毕业证照片
  eduImage;
  async operate(type, data?) {
    if (type == 'edit') {
      this.object = Object.assign({}, data);
      console.log(this.object);
      this.image = this.object.image
      this.photo = this.object.photo
      this.eduImage = this.object.eduImage
      this.isVisibleEditModal = true;
      this.getUptoken()
    }
    if (type == 'save') {
      // let id = this.object.objectId;
      console.log(data);
      let Query = new Parse.Query("Profile");
      Query.notEqualTo("isDeleted", true);
      Query.equalTo("objectId", data);
      let query = await Query.first();
      console.log(data, query);

      if (query && query.id) {
        if (this.image) {
          query.set("image", this.image)
        } else {
          query.unset("image");
        }
        if (this.photo) {
          query.set("photo", this.photo);
        } else {
          query.unset("photo");
        }
        if (this.eduImage) {
          query.set("eduImage", this.eduImage);
        } else {
          query.unset("eduImage");
        }

        let res = await query.save();
        if (res && res.id) {
          // this.cdRef.detectChanges()
          this.getProfiles()
        }
        this.isVisibleEditModal = false;
      }
    }
    if (type == 'fileDownload') {
      const object = Object.assign({}, data);
      console.log(object);
      if (object.paper) {
        // this.fileDownload(object.paper, object.name + object.idcard + "论文PDF")
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "论文PDF.pdf"
        fileInfo.url = object.paper
        this.files.push(fileInfo)
      }
      if (object.document) {
        // this.fileDownload(object.document, object.name + object.idcard + "论文word")
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "论文word.doc"
        fileInfo.url = object.document
        this.files.push(fileInfo)
      }
      if (object.checkReport) {
        // this.fileDownload(object.checkReport, object.name + object.idcard + "查重报告")
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "查重报告.pdf"
        fileInfo.url = object.checkReport
        this.files.push(fileInfo)
      }

      if (this.files.length) {
        this.downloadFile(object.name + object.idcard + "(" + object.education + ")");
        // this.batchDownload(object.name + object.idcard)

        let paper = new Parse.Query("SchoolPaper");
        let paperInfo = await paper.get(object.objectId)
        console.log(paperInfo)
        if (paperInfo && paperInfo.id) {
          paperInfo.set("isDownload", true)
          let applyData = await paperInfo.save();
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

    let apply = new Parse.Query("SchoolPaper")
    apply.containedIn("objectId", idArr)
    apply.equalTo("company", "1ErpDVc1u6")
    // apply.notEqualTo("isDeleted", true);
    let applyList = await apply.find();
    console.log(applyList)
    if (applyList.length) {
      for (let i = 0; i < applyList.length; i++) {
        applyList[i].set("isDownload", true);
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
    let folder = zip.folder('学生论文管理');
    let promises = []
    for (let i = 0; i < this.addIdArr.length; i++) {
      console.log(i, this.addIdArr.length)
      const meshes = folder.folder(this.addIdArr[i].name + this.addIdArr[i].idcard + "(" + this.addIdArr[i].education + ")")
      let imgFile = []
      if (this.addIdArr[i].paper) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "论文PDF.pdf"
        imageInfo.url = this.addIdArr[i].paper
        imgFile.push(imageInfo)
      }
      if (this.addIdArr[i].document) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "论文word.doc"
        imageInfo.url = this.addIdArr[i].document
        imgFile.push(imageInfo)
      }
      if (this.addIdArr[i].checkReport) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "查重报告.pdf"
        imageInfo.url = this.addIdArr[i].checkReport
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
        FileSaver.saveAs(content, "学生论文管理.zip");
      });
    })
  }

  // fileDownload(url: string, fileName: string) {
  //   console.log(url)
  //   this.download(url).subscribe(blob => {
  //     const a = document.createElement("a");
  //     const fileUrl = URL.createObjectURL(blob);
  //     a.href = fileUrl;
  //     a.download = fileName;
  //     a.click()
  //     URL.revokeObjectURL(fileUrl);
  //   })
  // }
  // download(url: string): Observable<Blob> {
  //   return this.http.get(url, { responseType: 'blob' });
  // }


  // 上传前的校验数据是否合法
  beforeUploadImg = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      console.log(file)
      console.log(_fileList)

      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.message.info('You can only upload JPG file!');

        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.message.info('Image must smaller than 2MB!');

        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });


  customRequestEduImage: any = async (item: NzUploadXHRArgs) => {
    console.log(this.image, this.photo, this.eduImage)
    console.log(item)
    let fileName = item.file.name
    console.log(fileName)

    let arr = fileName.split('.')   // jpg png 等后缀名
    console.log(arr)

    let qiniuFileKey = this.pCompany || this.company + '/' + this.getNowDate() + '/' + this.object.objectId + this.getRandomNum() + '.' + arr[arr.length - 1]
    console.log(qiniuFileKey)
    const putExtra = {
      fname: '',
      params: {},
      mimeType: 'image/*'
    }
    const config = {
      useCdnDomain: true //使用cdn加速
    }

    const observable = qiniu.upload(
      item.file,
      qiniuFileKey,
      this.uptoken,
      putExtra,
      config
    )
    console.log(observable)
    observable.subscribe({
      // next: (result: any) => {
      //   // 主要用来展示进度
      //   console.warn(result)
      // },
      error: (err: any) => {
        this.message.error('上传图片失败')
        console.log(err)
        return
      },
      complete: async (res: any) => {
        this.message.success('上传完成')
        console.log(res)

        // this.eduImage = 
      }
    })
  }

  // 删除图片
  async deleteImg(value) {
    console.log(value)

    switch (value) {
      case "image":
        this.image = ''
        break;
      case "photo":
        this.photo = ''
        break;
      case "eduImage":
        this.eduImage = ''
        break;
      default: ;
    }
  }

  uptoken;
  getUptoken() {
    Parse.Cloud.run("qiniu_uptoken", { company: this.pCompany })
      .then((data) => {
        this.uptoken = data.uptoken
        console.log(this.uptoken)
      }).catch(err => {
        console.log(err)
      })
  }
  getNowDate(): string {
    const date = new Date();
    let month: string | number = date.getMonth() + 1;
    let strDate: string | number = date.getDate();
    if (month <= 9) {
      month = "0" + month;
    }
    if (strDate <= 9) {
      strDate = "0" + strDate;
    }
    return date.getFullYear() + "" + month + "" + strDate;
  }
  getRandomNum() {
    var Num = ''
    for (let i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 9) + 1
    }
    console.log(Num)
    return Num
  }

}
