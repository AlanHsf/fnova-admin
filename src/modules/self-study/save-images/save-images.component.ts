import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import JSZip from "jszip";
import * as FileSaver from "file-saver";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DatePipe } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import 'ag-grid-enterprise';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
declare var qiniu: any;

@Component({
  selector: 'app-save-images',
  templateUrl: './save-images.component.html',
  styleUrls: ['./save-images.component.scss'],
  providers: [DatePipe]
})
export class SaveImagesComponent implements OnInit {

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
      title: '性别',
      value: 'sex',
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
      title: '准考证号',
      value: 'studentID',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '服务点',
      value: 'centerName',
      type: 'String',
      compare: null,
      schemaAlia: 'depa2'
    },
    {
      title: '报读院校',
      value: 'school',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '报考专业',
      value: 'majorName',
      type: 'String',
      compare: null,
      schemaAlia: 'major'
    },
    {
      title: '学员层次',
      value: 'education',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '学员批次',
      value: 'batch',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '类别',
      value: 'identyType',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '证件照',
      value: 'image',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '身份证件照片',
      value: 'photo',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
    },
    {
      title: '毕业证照片',
      value: 'eduImage',
      type: 'String',
      compare: null,
      schemaAlia: 'pro'
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
      this.company = depaInfo.get("company").id
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
      this.listOfColumn.splice(0, 0, {
        title: '院校',
        value: 'shortname',
        type: 'String',
        compare: null,
        schemaAlia: 'depa1'
      })
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

  // 
  photoChange(e) {
    console.log(e)
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
    "pro"."objectId",
    "pro"."name",
    "pro"."sex",
    "pro"."idcard",
    "pro"."studentID",
    "pro"."education",
    "pro"."batch",
    "pro"."identyType",
    "pro"."image",
    "pro"."photo",
    "pro"."eduImage",
    "pro"."isCross",
    "pro"."school",
    "major"."majorName",
    "depa1"."shortname",
    "depa2"."centerName" `

    let fromSql = ` from (select "objectId","name","sex","idcard","studentID","education","batch","school","image","photo","eduImage","identyType","isCross","SchoolMajor","department","center","departments","createdAt" 
          from "Profile" where "company" = '1ErpDVc1u6' and "isDeleted" is not true and "isCross" is true) as "pro"
      left join (select "objectId","name" as "majorName" from "SchoolMajor") as "major" on "major"."objectId" = "pro"."SchoolMajor"
      left join (select "objectId","name" as "shortname" from "Department") as "depa1" on "depa1"."objectId" = "pro"."department"
      left join (select "objectId","name" as "centerName" from "Department") as "depa2" on "depa2"."objectId" = "pro"."center"
    `
    let whereSql = ``
    if (this.center) {
      whereSql += ` where "pro"."departments" @> '[{ "objectId": "${this.center}"}]' `
    } else if (this.department && !this.center) {
      whereSql += ` where "pro"."departments" @> '[{ "objectId": "${this.department}"}]' `
    } else {
      whereSql += ` where 1 = 1 `
    }

    if (this.inputValue && this.inputValue.trim() != '') {
      whereSql += ` and "${this.searchType.schemaAlia}"."${this.searchType.value}" like '%${this.inputValue}%' `
    }

    console.log(whereSql)

    let orderSql = ` order by "pro"."createdAt" desc `
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
      if (object.image) {
        // this.fileDownload(object.image, object.name + object.idcard + "证件照")
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "证件照." + object.image.substring(object.image.length - 3)
        fileInfo.url = object.image
        this.files.push(fileInfo)
      }
      if (object.photo) {
        // this.fileDownload(object.photo, object.name + object.idcard + "身份证照片")
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "身份证照片." + object.photo.substring(object.photo.length - 3)
        fileInfo.url = object.photo
        this.files.push(fileInfo)
      }
      if (object.eduImage) {
        // this.fileDownload(object.eduImage, object.name + object.idcard + "毕业证照片")
        let fileInfo: any = {};
        fileInfo.name = object.name + object.idcard + "毕业证照片." + object.eduImage.substring(object.eduImage.length - 3)
        fileInfo.url = object.eduImage
        this.files.push(fileInfo)
      }

      if (this.files.length) {
        this.downloadFile(object.name + object.idcard + "(" + object.education + ")");
        // this.batchDownload(object.name + object.idcard)
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

  getBatchId() {
    console.log(this.addIdArr)
    if (!this.addIdArr.length) {
      this.message.error("请先选择数据再进行该操作! ")
      return
    }

    this.batchDownload()
    this.AllExChecked = false
  }
  // 批量下载
  async batchDownload() {
    let zip = new JSZip();
    let folder = zip.folder('学生照片管理');
    let promises = []
    for (let i = 0; i < this.addIdArr.length; i++) {
      console.log(i, this.addIdArr.length)
      const meshes = folder.folder(this.addIdArr[i].name + this.addIdArr[i].idcard + "(" + this.addIdArr[i].education + ")")
      let imgFile = []
      if (this.addIdArr[i].image) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "证件照." + this.addIdArr[i].image.substring(this.addIdArr[i].image.length - 3)
        imageInfo.url = this.addIdArr[i].image
        imgFile.push(imageInfo)
      }
      if (this.addIdArr[i].photo) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "身份证照片." + this.addIdArr[i].photo.substring(this.addIdArr[i].photo.length - 3)
        imageInfo.url = this.addIdArr[i].photo
        imgFile.push(imageInfo)
      }
      if (this.addIdArr[i].eduImage) {
        let imageInfo: any = {};
        imageInfo.name = this.addIdArr[i].name + this.addIdArr[i].idcard + "毕业证照片." + this.addIdArr[i].eduImage.substring(this.addIdArr[i].eduImage.length - 3)
        imageInfo.url = this.addIdArr[i].eduImage
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
        FileSaver.saveAs(content, "学生照片管理.zip");
      });
    })

  }

  getBase64(imgUrl) {
    return new Promise(function (resolve, reject) {
      window.URL = window.URL || window.webkitURL;
      let result;
      var xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          var blob = this.response;
          console.log("blob", blob)
          // 至关重要
          let oFileReader = new FileReader();
          oFileReader.onloadend = function (e) {
            // 此处拿到的已经是base64的图片了,可以赋值做相应的处理
            // console.log(e.target.result)
            result = e.target.result
            resolve(result)
          }
          oFileReader.readAsDataURL(blob);
        }
      }
      xhr.send();
      // return result
    })
  }

  // 单独下载
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


  isVisibleEditImage;
  batchExportImg() {
    this.isVisibleEditImage = true
  }

  batchImageUrl = []
  async imageChange(e) {
    console.log(e)
    if (e && e.length) {
      this.batchImageUrl = e
    }
  }

  // 批量保存图片
  async batchSaveImage() {
    console.log(this.batchImageUrl)
    console.log(this.company)
    if (!this.batchImageUrl || !this.batchImageUrl.length) {
      this.message.error("请先选择图片!")
      return
    }
    let attach = new Parse.Query("Attachment")
    attach.equalTo("company", this.company)
    attach.containedIn("url", this.batchImageUrl);
    attach.select("objectId", "name", "url", "company");
    let attachList = await attach.find()
    console.log(attachList)
    if (attachList && attachList.length) {
      for (let i = 0; i < attachList.length; i++) {
        let fileName = attachList[i].get("name")
        let idcard = fileName.substring(0, 18)
        let education = fileName.substring(18, 20)
        let imgType = fileName.substring(20, fileName.lastIndexOf("."))
        console.log(idcard, education, imgType)

        let query = new Parse.Query("Profile")
        query.equalTo("idcard", idcard)
        query.equalTo("education", education)
        query.equalTo("company", '1ErpDVc1u6')
        query.equalTo("isCross", true)
        query.notEqualTo("isDeleted", true)
        if (this.center) {
          query.containedIn('departments', [{
            __type: "Pointer",
            className: 'Department',
            objectId: this.center
          }])
        } else if (this.department && !this.center) {
          query.containedIn('departments', [{
            __type: "Pointer",
            className: 'Department',
            objectId: this.department
          }])
        }
        let profile = await query.first()
        if (profile && profile.id) {
          switch (imgType) {
            case '证件照':
              profile.set("image", attachList[i].get("url"))
              break;
            case '身份证件照片':
              profile.set("photo", attachList[i].get("url"))
              break;
            case '毕业证照片':
              profile.set("eduImage", attachList[i].get("url"))
              break;
            default: ;
          }
          let res = await profile.save()
          console.log(res)
        }
      }
      this.isVisibleEditImage = false
      this.getProfiles();
      this.message.success("批量导入成功!")
    } else {
      this.message.error("选择图片异常, 请处理后上传!")
      return
    }
  }


}