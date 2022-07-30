import { Input, Output, EventEmitter } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { ParseDataSource } from "../common-list/common-list-page";
import { AppService } from "../../../app/app.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Router } from "@angular/router";

@Component({
  selector: "[common-list-item]",
  templateUrl: "./common-list-item.component.html",
  styleUrls: ["./common-list-item.component.scss"],
})
export class CommonListItemComponent implements OnInit {
  @Input() data: any;
  @Input() qrUrl: any;
  @Input() index: any;
  @Input() dataSource: ParseDataSource;
  @Input() detailTitle: any;
  @Input() fields: any;
  @Input() type: any;
  @Input() Schema: any;
  @Input() displayedColumns: any;
  @Input() displayedOperators: any;
  @Input() managerOperators: any;
  @Output() operate: EventEmitter<any> = new EventEmitter();
  currentRole: string = "";
  isPrint: boolean = false;

  constructor(
    public appServ: AppService,
    private notification: NzNotificationService,
    private router: Router
  ) {
    this.currentRole = this.appServ.currentRole;
  }
  setOfCheckedId = new Set<number>();
  ngOnInit() {}
  checked: boolean = false;
  isFirstColumn(key) {
    if (key == this.displayedColumns[0]) {
      return true;
    } else {
      return false;
    }
  }

  getOptsLabel(key, value) {
    let option = this.fields[key].options.find((item) => item.value == value);
    if (option && option.label) {
      return option.label;
    } else {
      return value;
    }
  }
  getOptsColor(key, value) {
    if(this.fields[key].options) {
      let option = this.fields[key].options.find((item) => item.value == value);
      if (option && option.color) {
        return {color:option.color};
      } else {
        return {color: "#000"};
      }
    }else {
      return {color: "#000"};
    }

  }

  showName(data) {
    let name = (data && data.accountId) || (data && data.name) || data || "无";
    if (data && data.cardId) {
      name = `${data.bankName}:${data.cardId}`;
    }
    return name;
  }
  // Inline Edit Funcion, 列表行内编辑函数
  toggleSwitch(ev, obj, key) {
    let oldvalue = obj.get(key, ev);
    obj.set(key, ev); // ev即switch组件切换后的值
    obj
      .save()
      .then((data) => {
        obj = data;
      })
      .catch((err) => {
        obj.set(key, oldvalue);
        this.notification.create(
          "error",
          "保存出错",
          err.message ? err.message : "保存出错"
        );
      });
  }

  getLevelPadding(key) {
    // 已实现无限级递归
    if (!this.isFirstColumn(key)) return "5px";
    // 计算缩进
    let paddingValue = 0;
    let isShow = this.getShowExpand(key);
    if (!isShow) {
      paddingValue += 6;
    }
    if (this.data.get("parent")) {
      paddingValue = this.retriveParentPadding(this.data, paddingValue);
    }
    return String(paddingValue) + "px";
  }

  retriveParentPadding(obj, paddingValue): number {
    if (obj && obj.get("parent")) {
      paddingValue += 20;
      return this.retriveParentPadding(obj.get("parent"), paddingValue);
    } else {
      return paddingValue;
    }
  }

  getShowExpand(key) {
    return this.isFirstColumn(key)
      ? this.fields[key] && this.dataSource.expand
      : false;
  }

  // 操作菜单功能属性及方法
  operatorChange(data, operator) {
    this.operate.emit(operator);
  }
  isOperatorEnabled(op) {
    let operators = this.displayedOperators;
    // console.log(op)
    if (!operators) return false;
    let isEnabled = operators.find((item) => item == op);
    if (isEnabled) {
      return true;
    } else {
      return false;
    }
  }
  isOrg() {
    let type = this.data.get("type");
    if (type == "organization") {
      return true;
    } else {
      false;
    }
  }
  isGonghui(e) {
    let item = e.toJSON();
    let company = item.company.objectId;
    if (company == "668rM7MPii") {
      return true;
    } else {
      return false;
    }
  }
  toSurveyStatistic(e) {
    this.router.navigate([
      "/question/survey-statistic",
      { objectId: e.id, title: e.attributes.title },
    ]);
  }


  // 点击弹出打印页面

  showPrint() {
    let template = `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>文件打印</title>
  <script language="javascript">
    function print() {
      bdhtml = window.document.body.innerHTML; //获取当前页的html代码
      console.log(bdhtml)
      sprnstr = "<!--startprint -->"; //设置打印开始区域
      eprnstr = "<!--endprint -->"; //设置打印结束区域
      prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 17); //从开始代码向后取html
      prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //从结束代码向前取html
      window.document.body.innerHTML = prnhtml;
      window.print();
      window.document.body.innerHTML = bdhtml;
    }
  </script></head><body>
  <div style=" width: 100%; height:100%; background-color: rgba(ff,ff,ff, .5); z-index: 999;">
    <div style="width:210mm ; height: 270mm; background-color: #FFF; padding-left:
    10px; padding-top: 10px;">
    <!-- startprint -->
    <table border="1" cellspacing="0" style="text-align: center;width: 180mm ; height: 240mm; z-index: 999;">
      <tr style="height: 40px;">
        <td colspan="2">职工姓名</td>
        <td colspan="4">12313</td>
        <td colspan="2">住院科室</td>
        <td colspan="4">21321</td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">住院号</td>
        <td colspan="4">1243141234</td>
        <td colspan="2">住院时间</td>
        <td colspan="4">123412423</td>
      </tr>
      <tr style="height: 60px;">
        <td colspan="2">病情诊断是否动手术</td>
        <td colspan="10"></td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">慰问金额</td>
        <td colspan="10"></td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会小组长审批</td>
        <td colspan="10"></td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会副主席审批</td>
        <td colspan="10"></td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">工会主席审批</td>
        <td colspan="10"></td>
      </tr>
      <tr style="height: 40px;">
        <td colspan="2">领款人签名</td>
        <td colspan="10"></td>
      </tr>
    </table>
    <!--endprint-->
    <button onclick=print() style="display: block; width: 80px; text-align: center ; margin-top: 20px  z-index: 999;>打印</button>
  </div>
</div>
</body></html>`;
    let printModal: any = window.open(
      "",
      "newwindow",
      "width=900, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
    );
    printModal.document.body.innerHTML = template;
    this.isPrint = true;
    console.log(window);
  }
  print(oper) {
    if (oper < 10) {
      let bdhtml = window.document.body.innerHTML; //获取当前页的html代码
      console.log(bdhtml);
      let sprnstr = "<!--startprint" + oper + "-->"; //设置打印开始区域
      let eprnstr = "<!--endprint" + oper + "-->"; //设置打印结束区域
      var prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 18); //从开始代码向后取html
      var prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //从结束代码向前取html
      window.document.body.innerHTML = prnhtml;
      window.print();
      window.document.body.innerHTML = bdhtml;
    } else {
      window.print();
    }
  }

  ObjectToString(object) {
    return JSON.stringify(object);
  }

  imgShowing: boolean = false;
  imgUrl: string;
  showFile(file) {
    this.imgUrl = file;
    this.imgShowing = true;
  }
  showTime(time) {
    let min = time.toFixed(2);
    return min + "分钟";
  }
  closeShowModal() {
    this.imgShowing = false;
  }
}
