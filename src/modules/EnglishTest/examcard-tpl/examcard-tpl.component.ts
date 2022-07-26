import { FOCUS_TRAP_INERT_STRATEGY } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import { RichtextPreviewService } from 'src/modules/service/richtext-preview.service';
import { EngcardTplComponent } from './cardtpl/cardtpl.component';

@Component({
  selector: 'app-examcard-tpl',
  templateUrl: './examcard-tpl.component.html',
  styleUrls: ['./examcard-tpl.component.scss'],
  providers: [DatePipe]
})
export class ExamcardTplComponent implements OnInit {
  @ViewChild("tpl1") cardTpl: ElementRef;
  @ViewChild("tplwrapper") tplwrapper: ElementRef;
  isVisible: boolean = false;
  department: string;
  company: string;
  pCompany: string;
  dCompany: any = {};
  radioValue: string = "";
  tplList: Array<any> = []; //样式名称
  cardData: any = {
    profile: {
      workid: "104032110100301",
      name: "张三",
      sex: "男",
      birthdate: "1999-07-01",
      idcard: "360121199907011234",
      degreeNumber: "20220125000003",
      SchoolMajor: {
        name: "软件技术"
      },
      department: {
        name: "清华"
      },
      lang: "英语",
      schoolClass: {
        testTime: "2022-3-11 10:00-12:00",
        location: "考点测试",
        address: "地址测试",
        testNumber: "01",
        seating: "30"
      },
      eduImage: '',
      image: '',
      qrcodeUrl: 'https://file-cloud.fmode.cn/nCCirOU5zn/20220206/i9iebj052821.png'
    },
    article: ``,
    healthArticle: ``,

  }

  //这是个人信息
  title: string = "";
  config = {
    fields: [
      {
        key: "workid",
        type: 'String',
      },
      {
        key: "name",
        type: 'String',
      },
      {
        key: "sex",
        type: 'String',
      }
    ]
  }
  loading: boolean = false;
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private datePipe: DatePipe,
    private preview: RichtextPreviewService,
    private render: Renderer2,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      // 子公司department
      this.department = localStorage.getItem('department') || '';
      // 公司id
      this.company = localStorage.getItem('company') || '';
      console.log(this.department);//vLaliz8rAD
      console.log(this.company);//9aMy8gAuey
      if (this.department) {
        let data = await this.getCompByDepart();
        console.log(data);
      }
      this.examcardTpl();
      this.article();
      this.article2();
      this.personal();
      console.log(this.cardTpl);

    })
  }
  async article() {
    let query = new Parse.Query("Article");
    query.equalTo("company", this.company);
    query.equalTo("isEnabled", true);
    query.equalTo("type", "examcard-instruct");
    let first = await query.first();
    if (first && first.id) {
      this.cardData.article = first.get("content");
      console.log(first);
    }
  }

  async article2() {
    let query = new Parse.Query("Article");
    query.equalTo("company", this.company);
    query.equalTo("isEnabled", true);
    query.equalTo("type", "health-letter");
    let first = await query.first();
    if (first && first.id) {
      this.cardData.healthArticle = first.get("content");
    }
  }


  async getCompByDepart() {
    let query = new Parse.Query("Department");
    query.include("subCompany");
    let depart = await query.get(this.department);
    console.log(depart, "40");   //"vLaliz8rAD"
    this.dCompany = depart.get("subCompany");
    this.pCompany = depart.get("company");
    console.log(this.dCompany, "80");   //"vLaliz8rAD"
    console.log(this.dCompany, this.pCompany);
    let config = this.dCompany.get("config");
    console.log(config, 'config');
    console.log(this.department, '-----------')
    //添加config字段
    // let config = this.dCompany.get("config");
    // config["examCardTpl"]= "23234"
    //   .set("config", config)

    if (config["examCardTpl"] && config["examCardTpl"] != '') {
      this.radioValue = config["examCardTpl"];
    }
    console.log(config, "config");
    console.log(depart, "depart");
    console.log(this.radioValue);
    return depart;
  }


  async examcardTpl() {
    let query = new Parse.Query("ExamCardTpl");
    query.equalTo('company', this.pCompany);
    // query.get(this.company);
    this.tplList = await query.find();
    // console.log(com,"62");
  }

  // examcardtpl 数据和 模板列表绑定
  // 点击确认选择按钮 修改dCompany 子公司 config字段  examCardTpl 属性值为模板id
  // 模板默认值修改：onInit 获取dCompany config  examCardTpl属性存在且有值 默认值为该值   不存在或为空 默认值为模板列表第一项
  // 样式修改 ：
  // 模板1 ： 先确定布局样式 A4纸 竖版
  //          布局样式px按照pt换算
  // 样式数据结构设置  传到报名端口  如何获取
  //   showConfirm(): void {
  //   this.modal.confirm({
  //     nzTitle: '<i>Do you Want to delete these items?</i>',
  //     nzContent: '<b>Some descriptions</b>',
  //     nzOnOk: () => console.log('OK')
  //   });
  // }

  async personal() {
    let query = new Parse.Query("Profile");
    query.notEqualTo("isDeleted", true);
    // query.equalTo("departments",this.department);
    // let first = await query.first();
    // console.log(first)
    query.include("SchoolMajor");
    query.include("schoolClass");
    query.include("department");
    query.equalTo("department", this.department);
    query.exists("schoolClass");
    let pro: any = await query.first();
    if (pro && pro.id) {
      let profile = pro.toJSON();;
      this.loading = true;
      //时间
      let begin = profile['schoolClass']['beginTime']['iso'];
      let date = new Date(begin);
      let getYear = date.getFullYear();
      let getMonth = date.getMonth() + 1;
      let getDate = date.getDate();
      let getHours: any = date.getHours();
      getHours = getHours < 10 ? '0' + getHours : getHours
      let getMinutes: any = date.getMinutes();
      getMinutes = getMinutes < 10 ? '0' + getMinutes : getMinutes

      // beginMinutes = beginMinutes < 10 ? '0' + beginMinutes: beginMinutes
      let endTime = profile['schoolClass']['endTime']['iso'];
      let date2 = new Date(endTime);
      let getHours2: any = date2.getHours();
      getHours2 = getHours2 < 10 ? '0' + getHours2 : getHours2
      let getMinutes2: any = date2.getMinutes();
      getMinutes2 = getMinutes2 < 10 ? '0' + getMinutes2 : getMinutes2
      let testTime = getYear + '-' + getMonth + '-' + getDate + ' ' + getHours + ':' + getMinutes + ' - ' + getHours2 + ':' + getMinutes2
      profile.testTime = testTime;
      console.log(endTime)
      console.log(date)
      profile.qrcodeUrl = 'http://pwa.fmode.cn/studentInfo.html?id=' + profile.workid + '&v=0.0.1'
      this.cardData.profile = profile;
      this.cdref.detectChanges()
      this.loading = false;
      console.log(this.cardData, "3333")
    }
  }

  async handleOk() {
    let dCompany = this.dCompany;
    let config = this.dCompany.get("config");
    config['examCardTpl'] = this.radioValue;
    dCompany.set("config", config);
    let res = await dCompany.save();
    if (res && res.id) {
      console.log(res)
      this.message.success("操作成功");
      this.isVisible = false;
    } else {
      this.message.error("网络繁忙,请稍后重试")
    }
  }

  showModal() {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }
  tpldom: any;
  changeTpl(e) {
    switch (e) {
      case "A1":
        // this.radioValue = "A2"
        break;
      case "A2":
        // this.radioValue = "A1"
        break;
      default:
        break;
    }
    console.log(e);

  }
}
