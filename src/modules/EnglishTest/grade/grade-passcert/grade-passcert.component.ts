import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";
import { PrintService } from 'src/modules/service/print.service';
@Component({
  selector: 'app-grade-passcert',
  templateUrl: './grade-passcert.component.html',
  styleUrls: ['./grade-passcert.component.scss']
})
export class GradePasscertComponent implements OnInit {
  exam: any;
  profile: any;
  logId: string;
  logIdArr: any[] = [];
  logArr: any[] = [];
  log: any;
  department: string; // 院校
  company: any;
  pCompany: any;
  config: any;// 合格证配置
  sclass: any;// 考场
  pageType: string;// batch  批量打印
  pageIndex: number = 1;// 打印分页 index
  showAll = false;// 显示所有分页
  printLoading: boolean = true;
  logIndex: number = 1;//加载时显示进度
  constructor(
    private activRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private mPrint: PrintService
  ) { }

  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department");
      this.company = localStorage.getItem("company");
      console.log(params);
      this.logId = params.get("id");
      let idArrStr = params.get("idArr");
      if (idArrStr?.length) {
        this.logIdArr = idArrStr.split(',')
        this.pageType = 'batch'
        this.initData(this.logIdArr)
        return
      }
      await this.initData()

      let gradePassCert = {
        "title": "西北师范大学成人高等教育本科生学位外语考试",
        "subTitle": "成绩通知单",
        "logo": "",
        "fields": [
          {
            "key": "name",
            "className": "Profile",
            "type": "String",
            "label": "考生姓名"
          },
          {
            "key": "examId",
            "className": "SurveyLog",
            "type": "String",
            "label": "准考证号"
          },
          {
            "key": "idcard",
            "className": "Profile",
            "type": "String",
            "label": "身份证号"
          },
          {
            "key": "beginTime",
            "className": "SchoolClass",
            "type": "String",
            "label": "考试时间"
          },
          {
            "key": "grade",
            "className": "SurveyLog",
            "type": "String",
            "label": "笔试成绩"
          }
        ],
        "inscribe": "西北师范大学继续教育学院",
        "stamp": "",
        "background": "#f8f5e6"
      }
    });
  }
  async initData(logIdArr?) {
    if (this.pageType == 'batch') {
      let logArr = []
      for (let index = 0; index < logIdArr.length; index++) {
        let logId = logIdArr[index];
        let log: any = await this.getSlog(logId)
        log.sclass = await this.getSclassByLogPro(log)
        logArr.push(log);
        this.logIndex = index + 1;
        if (index + 1 == logIdArr.length) {
          console.log(logArr)
          this.logArr = logArr;
        }
      }
    } else {
      let log: any = await this.getSlog(this.logId)
      this.sclass = await this.getSclassByLogPro(log)
      this.log = log;
      console.log(log);

    }
    let config = await this.getPassCertConfig()
    if (config) {
      // config.bgImage = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fd6%2F8f%2Ffb%2Fd68ffb2be789409b06ce67007fa6fa71.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644223542&t=d5246329372234f41b0d2b6fe54e5f45'
      this.config = config;
    }
  }
  async getSlog(logId = this.logId) {
    let queryS = new Parse.Query("SurveyLog");
    queryS.include("survey");
    queryS.include("profile");
    queryS.include("exam");
    let log = await queryS.get(logId);
    if (log && log.id) {
      return log;
    }
  }
  async getPassCertConfig() {
    let queryComp = new Parse.Query("Company");
    let comp = await queryComp.get(this.company);
    console.log(comp)
    if (comp && comp.id) {
      return comp.get("config")?.gradePassCert
    }
  }
  async getSclassByLogPro(log) {
    let sclassId = ''
    sclassId = log.get("profile")?.get("schoolClass")?.id
    let queryScl = new Parse.Query("SchoolClass");
    let sclass = await queryScl.get(sclassId);
    if (sclass && sclass.id) {
      return sclass;
    }
  }
  onBack(): void {
    console.log("onBack");
    window.history.back();
  }
  async exportPDF() {
    this.showAll = true;
    console.log(new Date().getSeconds())
    let that = this;
    let status: any = await this.mPrint.Print({
      // documentTitle: `${this.config.stamp}-${this.profile.get("name")}`,// iframe网页标题 即打印时页眉处标题
      printdom: "print-passcert",// 打印元素id名
      style: `
        .passcert {
            background-color:url(${this.config.bgColor});
            background-image:url(${this.config.bgImage});
            background-size:100% 100%;
            background-repeat: no-repeat;
        }
      `// 传入样式
    })
    if (status) {
      that.showAll = false;
    }
  }

  pageNum: number = 1;
  /* 分页跳转 */
  pageChange(way, data) {
    // type e
    // console.log(e);
    // this.pageIndex = e;
    switch (way) {
      case "arrow":
        if (data == "prev") {
          this.pageIndex > 1
            ? (this.pageIndex -= 1)
            : (this.pageIndex = 1);
          this.pageNum = this.pageIndex;
        } else {
          let total = this.logArr.length;
          console.log(total);
          this.pageIndex < total
            ? (this.pageIndex += 1)
            : (this.pageIndex = total);
          this.pageNum = this.pageIndex;
        }
        break;
      case "num":
        console.log(data, this.pageNum);
        this.pageIndex = this.pageNum;
        console.log(this.pageIndex);
        break;
      default:
        break;
    }
  }

}
