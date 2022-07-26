import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  template: Array<any> = [];
  RID: any; // 用户创建的报表id
  companyId: any;
  isVisible: Boolean = false;
  name: any;
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private modal: NzModalService
  ) { }
  
  async ngOnInit() {
    this.template = [
      {
        name: "销售",
        type: 2, // 已解锁type为1 未解锁 type 为二
        img: "../../../assets/img/BI/sales.jpg",
        cate: "sdCVGZqrCT"
      },
      {
        name: "采购",
        type: 2,
        img: "../../../assets/img/BI/purchase.jpg",
        cate: "stkWrNOJOt"
      },
      {
        name: "资产存货",
        type: 2,
        img: "../../../assets/img/BI/pss.jpg",
        cate: "k7JIe22BOJ"
      },
      {
        name: "资金",
        type: 2,
        img: "../../../assets/img/BI/property.jpg",
        cate: "QyJ7l4UATK"
      },
      {
        name: "运营",
        type: 2,
        img: "../../../assets/img/BI/operate.jpg",
        cate: "rQbIIwLWYO"
      },
      {
        name: "生产",
        type: 2,
        img: "../../../assets/img/BI/capital.jpg",
        cate: "SPnjNEtKFc"
      },
      {
        name: "财务报表指标",
        type: 2,
        img: "../../../assets/img/BI/budget.png",
        cate: "dynMFtj3aH"
      }
    ];
    // 加载表格列表
    this.activatedRoute.paramMap.subscribe(async params => {
      let user = Parse.User.current();
      this.companyId = user.get("company").id;
      this.RID = params.get("PobjectId");
      this.template.reduce(async (pinem, item) => {
        let queryArray = new Parse.Query("BIReportArray");
        queryArray.equalTo("report", this.RID);
        queryArray.equalTo("company", this.companyId);
        queryArray.equalTo("category", item.cate);
        let result = await queryArray.first();
        console.log(result, this.RID, this.companyId, item.cate);
        if (result) {
          item.type = 1;
          console.log(item.type);
        }
      }, 0);
    });
    console.log(this.template);
  }
  goEnterData(name, type) {
    
    this.router.navigate([
      "finance/enterdata",
      {
        cate: name,
        id: this.RID
      }
    ]);
    // }
  }
  goCockpit(cate) {
    this.router.navigate([
      "finance/cockpit",
      {
        company: this.companyId,
        Rid: this.RID,
        cate: cate
      }
    ]);
  }
  goReport(cate) {
    this.router.navigate([
      "finance/report",
      {
        company: this.companyId,
        Rid: this.RID,
        cate: cate
      }
    ]);
  }
  showModel(name) {
    this.isVisible = true;
    this.name = name;
  }
  handleCancel() {
    this.isVisible = false;
  }
  handleOk() {
    this.router.navigate([
      "finance/enterdata",
      {
        cate: name,
        id: this.RID
      }
    ]);
    this.isVisible = false;
  }
}
