import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from "parse";
import { PrintService } from "src/modules/service/print.service";

@Component({
  selector: 'app-print-detail',
  templateUrl: './print-detail.component.html',
  styleUrls: ['./print-detail.component.scss']
})
export class PrintDetailComponent implements OnInit {
  constructor(
    private activRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private mPrint: PrintService
  ) { }
  survey: any;
  profile: any;
  logId: any;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      console.log(this.router, this.activRoute);

      this.logId = params.get("id");
      let queryS = new Parse.Query("SurveyLog");
      queryS.include("survey");
      queryS.include("profile");
      let log = await queryS.get(this.logId);
      if (log && log.id) {
        this.profile = log.get("profile");
        this.survey = log.get("survey")
      }
      /* let that = this;
      document.getElementById("export-btn").onclick = function () {
        that.exportPDF();
      }; */
    });
  }
  pageReload() {
    // this.activRoute.redirectTo: '/heroes-list'
    console.log(this.router);
    this.router.navigate(["/english/print-surveylog", { id: this.logId }]);
    console.log(this.router);
  }
  /* 打印 iframe

  待解决：
    打印样式：
      无法相对路径引入本地文件，样式需外部设置。
      直接获取元素非内联样式是否可行。
      document.styleSheets获取html内<style></style>中样式是否可行。
  tips:
    iframe内元素box-sizing默认为content-box  需统一修改为border-box
    *,*::after,*::before {
        box-sizing:border-box;
    }
  */
  async exportPDF() {
    let documentTitle = `${this.survey.get("title")}-${this.profile.get("name")}`;
    await this.mPrint.Print({
      documentTitle,
      printdom: "print-wrapper",// 打印元素id名
      style: `@page {
        margin: .5cm;
        size: A4 portrait;
      } `,// 传入样式
      global: true
    })
  }


  // 清除iframe内存空间
  clearIframe(el) {
    var _iframe = el.contentWindow;
    if (el) {
      el.src = "about:blank";
      try {
        _iframe.document.write("");
        _iframe.document.clear();
      } catch (e) {
        console.log(e);
      }
      document.body.removeChild(el);
    }
  }

  /* 本页面打印 */
  exportPDF4() {
    /* iframe网页标题 即打印时页眉处标题 */
    let documentTitle = `${this.survey.get("title")}-${this.profile.get("name")}`;
    /* 需打印元素 */
    let printDom = document.getElementById("print-wrapper");
    /* 样式文件 link */
    let style = document.createElement("style");
    style.innerHTML = ` <link rel="stylesheet" href="../surveylog-detail.scss" media="print">`;
    printDom.appendChild(style);
    const oldDom = document.body.innerHTML;
    document.body.innerHTML = printDom.innerHTML;
    window.print();
    document.body.innerHTML = oldDom; // 保存旧dom结构后恢复，点击事件无效
    this.router.navigate(["/english/print-surveylog", { id: this.logId }]);
    this.cdRef.detectChanges();
    window.location.reload();
  }
  /* 新窗口打印 */
  exportPDF2() {
    /* iframe网页标题 即打印时页眉处标题 */
    let documentTitle = `${this.survey.get("title")}-${this.profile.get("name")}`;
    /* 需打印元素 */
    let printDom = document.getElementById("print-wrapper");
    console.log(document.styleSheets);

    /* 样式文件 link */
    let css = document.createElement("link");
    // css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", "../surveylog-detail.scss");
    css.setAttribute("media", "print");
    console.log(printDom);
    var wind = window.open(
      "",
      "newwindow",
      "height=700, width=1000, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no"
    );
    wind.document.title = documentTitle;
    wind.document.head.appendChild(css);
    wind.document.body.innerHTML = printDom.innerHTML;
    console.log(wind.document);
    wind.print();
  }
}
