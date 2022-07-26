import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

interface ColumnItem {
  name: string;
  left?: boolean;
  right?: boolean;
  customFilter?: any;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn | null;
}
interface SearchItem {
  value:string,
  label:string
}

@Component({
  selector: 'app-survey-statistic',
  templateUrl: './survey-statistic.component.html',
  styleUrls: ['./survey-statistic.component.scss']
})
export class SurveyStatisticComponent implements OnInit {
  id: any;
  questionArr: Array<any> = [];
  surveyLogArr: Array<any> = [];
  total: number = 0;
  todayArr: Array<any> = [];
  lenArr: Array<any> = [];
  date:Array<any> = [];
  dateOne:Array<any> = [];
  isLoading:boolean = false
  hostUrl = "https://server.fmode.cn/api/"
  // constructor(public activatedRoute: ActivatedRoute, public router: Router, private http : HttpClient) {}
  tableHead: Array<any> = [
    "姓名",
    "性别",
    "工号",
    "代表团",
    "是否签到"
  ];
  displayedColumns:Array<SearchItem>=[
    {
      value:'name',
      label:'姓名'
    },
    {
      value:'studentID',
      label:'工号'
    },
    {
      value:'department',
      label:'部门'
    }
  ]
  listOfColumns:ColumnItem[] = [
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '姓名',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
      ],
      filterFn: null
    },
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '工号',
      sortOrder: null,
      sortFn:null,
      listOfFilter: [
      ],
      filterFn: null
    },
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '部门',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
        { text: '党群部门/党委办公室', value: '党群部门/ 党委办公室' },
        { text: '党群部门/工会', value: '党群部门/ 工会' },
        { text: '党群部门/纪委监督检查室', value: '党群部门/ 纪委监督检查室' },
        { text: '党群部门/纪委综合办公室', value: '党群部门/ 纪委综合办公室' },
        { text: '党群部门/团委', value: '党群部门/ 团委' },
        { text: '党群部门/宣传部', value: '党群部门/ 宣传部' },
        { text: '党群部门/组织部', value: '党群部门/ 组织部' },
        { text: '行政部门/保健处', value: '行政部门/ 保健处' },
        { text: '行政部门/保卫处', value: '行政部门/ 保卫处' },
        { text: '行政部门/财务处', value: '行政部门/ 财务处' },
        { text: '行政部门/对外合作发展部', value: '行政部门/ 对外合作发展部' },
        { text: '行政部门/感染控制处', value: '行政部门/ 感染控制处' },
        { text: '行政部门/护理部', value: '行政部门/ 护理部' },
        { text: '行政部门/基建处', value: '行政部门/ 基建处' },
        { text: '行政部门/教务处', value: '行政部门/ 教务处' },
        { text: '行政部门/科技处', value: '行政部门/ 科技处' },
        { text: '行政部门/门诊部', value: '行政部门/ 门诊部' },
        { text: '行政部门/人事处', value: '行政部门/ 人事处' },
        { text: '行政部门/审计处', value: '行政部门/ 审计处' },
        { text: '行政部门/信息处', value: '行政部门/ 信息处' },
        { text: '行政部门/医疗保障处', value: '行政部门/ 医疗保障处' },
        { text: '行政部门/医务处', value: '行政部门/ 医务处' },
        { text: '行政部门/医学装备处', value: '行政部门/ 医学装备处' },
        { text: '行政部门/院长办公室', value: '行政部门/ 院长办公室' },
        { text: '行政部门/运营部', value: '行政部门/ 运营部' },
        { text: '行政部门/招标采购中心', value: '行政部门/ 招标采购中心' },
        { text: '行政部门/总务处', value: '行政部门/ 总务处' },
        { text: '临床服务类/儿科', value: '临床服务类/ 儿科' },
        { text: '临床服务类/耳鼻喉头颈外科', value: '临床服务类/ 耳鼻喉头颈外科' },
        { text: '临床服务类/风湿免疫科', value: '临床服务类/ 风湿免疫科' },
        { text: '临床服务类/妇产科', value: '临床服务类/ 妇产科' },
        { text: '临床服务类/骨科', value: '临床服务类/ 骨科' },
        { text: '临床服务类/呼吸与危重症医学科', value: '临床服务类/ 呼吸与危重症医学科' },
        { text: '临床服务类/急诊科', value: '临床服务类/ 急诊科' },
        { text: '临床服务类/康复科', value: '临床服务类/ 康复科' },
        { text: '临床服务类/口腔科', value: '临床服务类/ 口腔科' },
        { text: '临床服务类/门诊部', value: '临床服务类/ 门诊部' },
        { text: '临床服务类/泌尿外科', value: '临床服务类/ 泌尿外科' },
        { text: '临床服务类/内分泌科', value: '临床服务类/ 内分泌科' },
        { text: '临床服务类/皮肤科', value: '临床服务类/ 皮肤科' },
        { text: '临床服务类/普外科', value: '临床服务类/ 普外科' },
        { text: '临床服务类/全科医疗二科', value: '临床服务类/ 全科医疗二科' },
        { text: '临床服务类/全科医疗科', value: '临床服务类/ 全科医疗科' },
        { text: '临床服务类/日间病房', value: '临床服务类/ 日间病房' },
        { text: '临床服务类/烧伤科', value: '临床服务类/ 烧伤科' },
        { text: '临床服务类/神经内科', value: '临床服务类/ 神经内科' },
        { text: '临床服务类/神经外科', value: '临床服务类/ 神经外科' },
        { text: '临床服务类/肾内科', value: '临床服务类/ 肾内科' },
        { text: '临床服务类/疼痛科', value: '临床服务类/ 疼痛科' },
        { text: '临床服务类/消化内科', value: '临床服务类/ 消化内科' },
        { text: '临床服务类/心身医学科', value: '临床服务类/ 心身医学科' },
        { text: '临床服务类/心血管科', value: '临床服务类/ 心血管科' },
        { text: '临床服务类/心脏大血管外科', value: '临床服务类/ 心脏大血管外科' },
        { text: '临床服务类/胸外科', value: '临床服务类/ 胸外科' },
        { text: '临床服务类/血液科', value: '临床服务类/ 血液科' },
        { text: '临床服务类/眼科', value: '临床服务类/ 眼科' },
        { text: '临床服务类/整形科', value: '临床服务类/ 整形科' },
        { text: '临床服务类/中西医结合肛肠科', value: '临床服务类/ 中西医结合肛肠科' },
        { text: '临床服务类/中医科', value: '临床服务类/ 中医科' },
        { text: '临床服务类/肿瘤科', value: '临床服务类/ 肿瘤科' },
        { text: '临床服务类/重症医学科', value: '临床服务类/ 重症医学科' },
        { text: '临床医技类/儿科', value: '临床医技类/ 儿科' },
        { text: '临床医技类/急诊科', value: '临床医技类/ 急诊科' },
        { text: '临床医技类/内科', value: '临床医技类/ 内科' },
        { text: '临床医技类/日间病房', value: '临床医技类/ 日间病房' },
        { text: '临床医技类/外科', value: '临床医技类/ 外科' },
        { text: '临床医技类/医技', value: '临床医技类/ 医技' },
        { text: '临床医技类/院前急救科', value: '临床医技类/ 院前急救科' },
        { text: '临床医技类/中西医结合肛肠科', value: '临床医技类/ 中西医结合肛肠科' },
        { text: '临床医技类/中医科', value: '临床医技类/ 中医科' },
        { text: '医疗辅助类/门诊护理组', value: '医疗辅助类/ 门诊护理组' },
        { text: '医疗辅助类/消毒供应中心', value: '医疗辅助类/ 消毒供应中心' },
        { text: '医疗技术类/病理科', value: '医疗技术类/ 病理科' },
        { text: '临床服务类/呼吸与危重症医学科', value: '临床服务类/ 呼吸与危重症医学科' },
        { text: '医疗技术类/超声医学科', value: '医疗技术类/ 超声医学科' },
        { text: '医疗技术类/核医学科', value: '医疗技术类/ 核医学科' },
        { text: '医疗技术类/检验科', value: '医疗技术类/ 检验科' },
        { text: '医疗技术类/介入治疗室', value: '医疗技术类/ 介入治疗室' },
        { text: '医疗技术类/麻醉手术部', value: '医疗技术类/ 麻醉手术部' },
        { text: '医疗技术类/输血科', value: '医疗技术类/ 输血科' },
        { text: '医疗技术类/推拿科', value: '医疗技术类/ 推拿科' },
        { text: '医疗技术类/药学部', value: '医疗技术类/ 药学部' },
        { text: '医疗技术类/医学影像科', value: '医疗技术类/ 医学影像科' }
      ],
      filterFn: (list: string[], item) => list.some(title => {
        if(item.department){
          return item.department.indexOf(title) !== -1
        }
      })
    },
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '分数',
      sortOrder: null,
      sortFn:null,
      listOfFilter: [
      ],
      filterFn: null
    },
  ]
  visible :boolean = false
  visibleId :boolean = false
  company: string = localStorage.getItem("company");
  allTableData: Array<any> = [];
  filterData: Array<any> = [];
  filterType: string;
  inputValue: String;
  searchType: any = "studentID";
  proofUrl: string;
  showEditFile: Boolean = false;
  pageSize: number = 20;
  pageIndex: number = 0;
  overlyTableData: any;
  aid:any
  count:number = 0
  loading:boolean = true
  searchInputText:string = ''
  inputText:string = ''
  searchIdText:string = ''
  selected = {
    value:'name',
    label:'姓名'
  }
  listOfData:Array<any> = [
   
  ];
  objectId:string = ''
  constructor(
    private activatedRoute:ActivatedRoute,
    public router: Router, 
    private http : HttpClient
  ) { }
  title:string = ''
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params=>{
      // console.log(params)
      let objectId = params.get("objectId")
      this.objectId = objectId
      this.title = params.get("title")
      console.log(objectId)
      this.getData(objectId)
      this.getCount()
      this.getTotalCount()
    })
  }
  getData(id:string) {
    let that = this
    console.log(id,that.company)
    this.isLoading = true
    // let sql = `SELECT "Profile"."name","Profile"."studentID",
    // regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
    // (select "grade" from "SurveyLog" where "SurveyLog"."survey" = '${id}' and "SurveyLog"."profile" = "Profile"."objectId")
    // FROM "Profile"
    // where "Profile"."company" = '${that.company}'
    // order by "grade" desc NULLS LAST
    // `
    let sql = `SELECT "Profile"."name","Profile"."studentID",slog.grade,
    regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department
    FROM "Profile"
    join "SurveyLog" as slog
    on slog."survey" = '${id}'
    where "Profile"."company" = '${that.company}'
    and slog."profile" = "Profile"."objectId"
    order by "grade" desc NULLS LAST`
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = await result.data
      this.isLoading = false
    })
  }
  getCount(){
    const that = this
    let limit = `"Profile"."${this.selected.value}"`
    let sql = `SELECT count(*)
    FROM "SurveyLog"
    left join "Profile" on "Profile"."objectId" = "SurveyLog"."profile"
    where "SurveyLog"."company" = '${that.company}'and "survey" = '${that.objectId}'
    and
    ${limit} LIKE '%${this.searchInputText}%'
    `
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.total = await result.data[0].count
    })
  }
  getTotalCount(){
    const that = this
    let sql = `SELECT count(*)
    FROM "Profile"
    where "Profile"."company" = '${that.company}'`
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.count = await result.data[0].count
    })
  }
  search(){
    console.log(this.inputText)
    this.visible = false;
    this.listOfData = this.listOfData.filter((item) => {
      if(item.name){
       return item.name.indexOf(this.inputText) !== -1}
      })
    if(!this.inputText){
      this.reset()
    }
  }
  reset(){
    this.inputText = '';
    this.searchIdText = '';
    this.getData(this.objectId)
  }
  searchId(){
    this.visible = false;
    this.listOfData = this.listOfData.filter((item) => {
      if(item.studentID){
       return item.studentID.indexOf(this.searchIdText) !== -1}
      })
    if(!this.searchIdText){
      this.resetId()
    }
  }
  resetId(){
    this.searchIdText = '';
    this.inputText = '';
    this.getData(this.objectId)
  }
  searchInputChange(e){
    this.searchInputText = e
    let that = this
    this.loading = true
    let limit = `"Profile"."${this.selected.value}"`
    let sql = `SELECT "Profile"."name","Profile"."studentID",
    regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
    (select "grade" from "SurveyLog" where "SurveyLog"."survey" = '${that.objectId}' and "SurveyLog"."profile" = "Profile"."objectId")
    FROM "Profile"
    where "Profile"."company" = '${that.company}' and ${limit} LIKE '%${e}%'
    order by "grade" desc NULLS LAST`
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = await result.data
      that.loading = false
    })
    this.getCount()
  }
  searchColNameChange(e){
    console.log(e)
    this.selected = e
  }
  injected(){
    let that = this
    this.loading = true
    let sql = `SELECT "Profile"."name","Profile"."studentID",
    regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
    "SurveyLog"."grade" FROM "SurveyLog"
    left join "Profile" on "Profile"."objectId" = "SurveyLog"."profile"
    where "survey" = '${that.objectId}'
    order by
    "SurveyLog"."createdAt" desc NULLS LAST
    `
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = await result.data
      that.loading = false
    })
  }
  uninject(){
    let that = this
    this.loading = true
    let sql = `SELECT "Profile"."name","Profile"."studentID",
    regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
    "SurveyLog"."grade"
    FROM "Profile"
    left join "SurveyLog" on "Profile"."objectId" = "SurveyLog"."profile"
    where "Profile"."company" = '${that.company}' and 
    "SurveyLog"."createdAt" is null
    `
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = await result.data
      that.loading = false
    })
  }
  export(){
    let data = this.listOfData
    let table = '<table border="1px" cellspacing="0" cellpadding="0">';
        table += '<thead>';
        table += '<th>姓名</th>';
        table += '<th>工号</th>';
        table += '<th>部门</th>';
        table += '<th>分数</th>';
        table += '</thead>';
        table += '<tbody>';
        let _body = "";
        for (var row = 0; row < this.listOfData.length; row++) {
        _body += '<tr>';
        _body += '<td>';
        _body += `${data[row].name}`;
        _body += '</td>';
        _body += '<td>';
        _body += ` &nbsp;${data[row].studentID}`;
        _body += '</td>';
        _body += '<td>';
        _body += `${data[row].department}`;
        _body += '</td>';
        _body += '<td>';
        _body += `${data[row].grade?data[row].grade:''}`;
        _body += '</td>';
        _body += '</tr>';
          }
        table += _body;
        table += '</tbody>';
        table += '</table>';
    this.excel(table, `${this.title?this.title:'问卷记录'}.xls`);
  }
  excel(data, filename) {
    let html =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    html += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    html += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    html += '; charset=UTF-8">';
    html += "<head>";
    html += "</head>";
    html += "<body>";
    html += data
    html += "</body>";
    html += "</html>";
    let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html);
    // window.open(uri)
    let link = document.createElement("a");
    link.href = uri;
    link.download = `${filename}`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
