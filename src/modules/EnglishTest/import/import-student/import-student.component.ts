import { Component, OnInit, ChangeDetectorRef } from "@angular/core";

import * as XLSX from "xlsx";
import * as Parse from "parse";
import "ag-grid-community";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi, QuerySelector } from "ag-grid-community";
import { NzMessageService } from "ng-zorro-antd/message";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-import-student",
  templateUrl: "./import-student.component.html",
  styleUrls: ["./import-student.component.scss"],
})
export class ImportStudentComponent implements OnInit {
  pageType: string = "guide"; // 页面显示

  // 需传入表格组件参数
  columnDefs: any[];
  rowData: any;
  // 上传中 弹窗
  isVisible: boolean = false;

  // 身份证号或手机号码数据库已存在的数据
  reuseData: any[] = [];
  // 上传失败数据
  errData: any[] = [];
  // 上传后失败或重复数据 弹窗
  isVisible2: boolean = false;

  companyId: string; // 公司id
  pCompany: string; // 总公司

  public api: GridApi;
  public columnApi: ColumnApi;
  data: any;
  isDealData: boolean;
  require: any;
  isImport: boolean;
  objectIdMap: any = [];

  constructor(
    public cdRef: ChangeDetectorRef,
    private message: NzMessageService,
    private activRoute: ActivatedRoute
  ) { }
  department: any;
  departs: any;
  compInfo: any;
  subCompany: any;
  ngOnInit() {
    this.department = localStorage.getItem("department")
      ? localStorage.getItem("department")
      : "";
    this.companyId = localStorage.getItem("company")
      ? localStorage.getItem("company")
      : "";
    this.activRoute.paramMap.subscribe(async (params) => {
      this.compInfo = await this.getCompany();
      if (this.department) {
        this.pCompany = this.compInfo.get("company").id;
      }
      this.require = [
        {
          headerName: "站点代码",
          field: "站点代码",
          other: "cates",
          type: "PointerArray",
          targetClass: "Category",
          key: "name_en", // targetClass中equalTo的字段
        },
        {
          headerName: "语种",
          field: "语种",
          other: "lang",
          type: "String",
        },
        {
          headerName: "语种代码",
          field: "语种代码",
          other: "langCode",
          type: "String",
        },
        {
          headerName: "学号",
          field: "学号",
          other: "studentID",
          type: "String",
        },
        {
          headerName: "姓名",
          field: "姓名",
          other: "name",
          type: "String",
        },
        {
          headerName: "报考院校",
          field: "报考院校",
          other: "department",
          type: "Pointer",
          targetClass: "Department",
        },
        {
          headerName: "性别",
          field: "性别",
          other: "sex",
          type: "String",
        },
        {
          headerName: "专业",
          field: "专业",
          other: "SchoolMajor",
          type: "Pointer",
          targetClass: "SchoolMajor",
        },
        {
          headerName: "政治面貌",
          field: "政治面貌",
          other: "polity",
          type: "String",
        },
        {
          headerName: "民族",
          field: "民族",
          other: "nation",
          type: "String",
        },
        {
          headerName: "手机号码",
          field: "手机号码",
          other: "mobile",
          type: "String",
        },
        {
          headerName: "证件类型",
          field: "证件类型",
          other: "cardtype",
          type: "String",
        },
        {
          headerName: "身份证号",
          field: "身份证号",
          other: "idcard",
          type: "String",
        },
        {
          headerName: "电子邮箱",
          field: "电子邮箱",
          other: "email",
          type: "String",
        },
        {
          headerName: "通讯地址",
          field: "通讯地址",
          other: "address",
          type: "String",
        },
        {
          headerName: "邮政编码",
          field: "邮政编码",
          other: "postcode",
          type: "Number",
        },
        {
          headerName: "毕业院校",
          field: "毕业院校",
          other: "school",
          type: "String",
        },
        {
          headerName: "层次",
          field: "层次",
          other: "eduType",
          type: "String",
        },
        {
          headerName: "学制",
          field: "学制",
          other: "education",
          type: "String",
        },
      ];
      this.columnDefs = [
        {
          headerName: "必填项(学生信息)",
          children: this.require,
        },
      ];
      let tem = {};
      this.require.forEach((data) => {
        tem[data.field] = "暂无";
      });
    });
  }
  async getCompany() {
    let queryC = new Parse.Query("Company");
    queryC.get(this.subCompany || this.companyId);
    let comp = await queryC.first();
    if (comp && comp.id) {
      return comp;
    }
  }
  async getDepartment(name) {
    let queryD = new Parse.Query("Department");
    queryD.equalTo("name", name);
    queryD.equalTo("company", this.pCompany);
    let res = await queryD.first();
    if (res && res.id) {
      console.log(res);
      return res.id;
    }
  }
  // 选择文件
  async onFileChange(evt: any) {
    /* wire up file reader */
    let target: DataTransfer = <DataTransfer>evt.dataTransfer,
      data: any;
    if (!target) {
      target = <DataTransfer>evt.target;
    }
    console.log(target, target.files.length);
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    console.log(reader);
    reader.onload = (e: any) => {
      console.log(e);
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      let keyAry = [];
      // 遍历json对象，获取每一列的键名 表头
      for (let key in this.data[1]) {
        keyAry.push(key);
      }
      console.log(this.data.length);
      let columnDefs: any = [];
      keyAry.forEach((element, index) => {
        columnDefs.push({ headerName: element, field: element });
      });
      this.columnDefs = [
        ...this.columnDefs,
        { headerName: "导入项", children: columnDefs },
      ];
      // 处理导入的数据
      this.getOnjectIdMap(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
    // let drop = document.getElementById("dropBox");
    // if (this.rowData.length >= 1) {
    //   drop.style.display = "none";
    // }
  }

  // 文件拖拽
  handleDropOver(e, over?) {
    e.preventDefault();
    e.stopPropagation();
  }

  // over之后执行
  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e);
    this.onFileChange(e);
  }

  getOnjectIdMap(datas) {
    console.log(datas);

    // 对数据的处理，以及错误查询
    this.isDealData = true;
    // 导入数据循环遍历数据获取Pointer指针类型的objectId

    datas.forEach(async (data, index) => {
      let map: any = {};

      // 表头信息
      this.require.forEach(async (r) => {
        // 字段为pointer 该pointer指向的表无该数据  错误。
        if (r.type == "Pointer" && r.targetClass) {
          console.log(r.type, r.targetClass);
          if (data[r.field]) {
            let TargetClass = new Parse.Query(r.targetClass);
            TargetClass.equalTo("name", data[r.field].trim());
            let target = await TargetClass.first();
            if (target && target.id) {
              map[r.other] = target.id;
            } else {
              this.isImport = false;
              alert(
                data["姓名"] +
                "的" +
                r.headerName +
                "错误, 或者该" +
                r.headerName +
                "未创建,请修改正确后重新上传"
              );
            }
          }
        }
        if (r.type == "PointerArray" && r.targetClass) {
          console.log(r.type, r.targetClass);
          if (data[r.field]) {
            let TargetClass = new Parse.Query(r.targetClass);
            console.log(r.key, data[r.field]);
            if (r.key) {
              TargetClass.equalTo(r.key, data[r.field].trim());
            } else {
              TargetClass.equalTo("name", data[r.field].trim());
            }
            TargetClass.equalTo("department", this.department);
            let target = await TargetClass.first();
            if (target && target.id) {
              map[r.other] = target.id;
            } else {
              this.isImport = false;
              alert(
                data["姓名"] +
                "的" +
                r.headerName +
                "错误, 或者该" +
                r.headerName +
                "未创建,请修改正确后重新上传"
              );
            }
          }
        }
        if (r.other == 'langCode') {
          datas[index][r.field] = '0' + datas[index].langCode
        }
      });
      this.objectIdMap[index] = map;
      console.log(this.objectIdMap[index]);

      if (this.objectIdMap.length == datas.length) {
        setTimeout(() => {
          this.isImport = true;
          this.isDealData = false;
          // this.cdRef.detectChanges();
        }, 3000);
      }
    });
    this.rowData = datas;
    this.pageType = "upload";
    console.log(this.rowData);
  }
  successData: any = [];

  // 保存到数据库
  count: any = 0;
  async saveLine(end) {
    this.successData = [];
    this.reuseData = [];
    this.errData = [];
    this.isVisible = true;
    let count = 0;
    // if (end) {
    //   this.compareData();
    //   return;
    // }
    console.log(this.rowData.length);
    for (let j = 0; j < this.rowData.length; j++) {
      console.log(j);
      let profile: any = await this.getProfile(
        this.rowData[j]["身份证号"],
        this.rowData[j]["手机号码"]
      );
      console.log(profile);

      if (profile) {
        //拼接出生日期
        let idCard = this.rowData[j]["身份证号"];
        let year = idCard.substring(6, 10);
        let month = idCard.substring(10, 12);
        let day = idCard.substring(12, 14);
        let birthdate = year + "-" + month + "-" + day;

        for (let i = 0; i < this.columnDefs[0].children.length; i++) {
          if (this.columnDefs[0].children[i].type == "String") {
            if (this.rowData[j][this.columnDefs[0].children[i].field]) {
              profile.set(
                this.columnDefs[0].children[i].other,
                this.rowData[j][this.columnDefs[0].children[i].field].trim()
              );
            }
          }
          if (this.columnDefs[0].children[i].type == "Number") {
            profile.set(
              this.columnDefs[0].children[i].other,
              Number(this.rowData[j][this.columnDefs[0].children[i].field])
            );
          }
          if (this.columnDefs[0].children[i].type == "Pointer") {
            if (
              this.objectIdMap &&
              this.objectIdMap[j] &&
              this.objectIdMap[j][this.columnDefs[0].children[i].other]
            ) {
              console.log(
                this.columnDefs[0].children[i].other,
                this.columnDefs[0].children[i].targetClass,
                this.objectIdMap[j][this.columnDefs[0].children[i].other]
              );

              profile.set(this.columnDefs[0].children[i].other, {
                __type: "Pointer",
                className: this.columnDefs[0].children[i].targetClass,
                objectId:
                  this.objectIdMap[j][this.columnDefs[0].children[i].other],
              });
            }
          }
          if (this.columnDefs[0].children[i].type == "PointerArray") {
            if (
              this.objectIdMap &&
              this.objectIdMap[j] &&
              this.objectIdMap[j][this.columnDefs[0].children[i].other]
            ) {
              profile.set(this.columnDefs[0].children[i].other, [
                {
                  __type: "Pointer",
                  className: this.columnDefs[0].children[i].targetClass,
                  objectId:
                    this.objectIdMap[j][this.columnDefs[0].children[i].other],
                },
              ]);
            }
          }
        }
        if (!this.department) {
          this.department = await this.getDepartment(
            this.rowData[j]["所属院校"]
          );
        }
        profile.set("department", {
          __type: "Pointer",
          className: "Department",
          objectId: this.department,
        });
        profile.set("departments", [
          {
            __type: "Pointer",
            className: "Department",
            objectId: this.department,
          },
        ]);
        profile.set("birthdate", birthdate);
        await profile.save().then((res) => {
          if (res && res.id) {
            console.log(this.companyId);
            if (this.companyId == "jKj2z6MD07") {
              // this.setUserAndBindPro(res)
            }

            count += 1;
            this.count = count;
            this.successData.push(this.rowData[j]);
          }
          if (j + 1 == this.rowData.length) {
            setTimeout((res) => {
              this.isVisible = false;
              this.isImport = false;
              this.compareData();
            }, 1000);
          }
        });
      } else {
        this.reuseData.push(this.rowData[j]);
        if (j + 1 == this.rowData.length) {
          this.isVisible = false;
          this.isImport = false;
          this.compareData();
        }
      }
    }
  }
  async setUserAndBindPro(profile) {
    let user = await Parse.User.signUp(
      this.pCompany + profile.get("idcard"),
      "123456",
      ""
    )

    user.set("idcard", profile.get("idcard"))
    user.set("mobile", profile.get("mobile"))
    user.set("company", {
      __type: "Pointer",
      className: "Company",
      objectId: this.pCompany,
    })
    let res = await user.save(null, { useMasterKey: true })
    profile.set("user", {
      __type: "Pointer",
      className: "_User",
      objectId: res.id,
    })
    profile.save()
  }
  async compareData() {
    console.log(this.successData, this.rowData);
    let resArr = [];
    let resArr2 = [];
    for (let row of this.rowData) {
      if (
        !this.successData.some((item) => item["身份证号"] == row["身份证号"])
      ) {
        resArr.push(row);
      }
      if (
        !this.successData.some((item) => item["手机号码"] == row["手机号码"])
      ) {
        resArr2.push(row);
      }
    }
    console.log(resArr, resArr2);
    // 全部上传成功
    if (!resArr.length && !resArr2.length) {
      this.message.success(`${this.rowData.length}条数据上传成功`);
      this.rowData = [];
    } else {
      this.isVisible2 = true;
      resArr == [] ? (this.rowData = resArr2) : (this.rowData = resArr);
      console.log("重新上传");
      this.message.error(`${this.rowData.length}条数据上传失败，需重新上传`);
      let reuseMobileArr = this.reuseData.map((item) => item["手机号码"]);
      this.errData = this.rowData.filter(
        (item) => !reuseMobileArr.includes(item["手机号码"])
      );
    }
  }
  async getProfile(idcard, mobile) {
    return new Promise(async (resolve, reject) => {
      let Profile = new Parse.Query("Profile");
      Profile.notEqualTo("isDeleted", true);
      console.log(idcard);
      Profile.equalTo("idcard", idcard);
      Profile.equalTo("department", this.department);
      Profile.equalTo("company", this.pCompany);
      let profile = await Profile.first();
      if (profile && profile.id) {
        resolve(false);
      } else {
        let Profile = new Parse.Query("Profile");
        Profile.notEqualTo("isDeleted", true);
        console.log(mobile);
        Profile.equalTo("mobile", mobile);
        Profile.equalTo("department", this.department);
        Profile.equalTo("company", this.pCompany);
        let profile = await Profile.first();
        if (profile && profile.id) {
          resolve(false);
        } else {
          let P = Parse.Object.extend("Profile");
          let p = new P();
          p.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.pCompany,
          });
          p.set("type", "testsystem");
          resolve(p);
        }
      }
    });
  }
  handleCancel() {
    this.isVisible2 = false;
  }
  clearData() {
    this.rowData = [];
    this.errData = [];
    this.reuseData = [];
    this.pageType = "guide";
  }
  // exportDataAsExcel(params: ExcelExportParams): void;
  // down() {

  //   var params = {
  //     suppressTextAsCDATA: true
  //     // ...
  //   };

  //   var content = this.api.exportDataAsExcel(params);
  //   var workbook = XLSX.read(content, { type: 'binary' });
  //   var xlsxContent = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
  //   console.log(xlsxContent);

  // }
}
