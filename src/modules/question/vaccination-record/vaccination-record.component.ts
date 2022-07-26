import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
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
  selector: 'app-vaccination-record',
  templateUrl: './vaccination-record.component.html',
  styleUrls: ['./vaccination-record.component.scss']
})
export class VaccinationRecordComponent implements OnInit {
  id: any;
  questionArr: Array<any> = [];
  surveyLogArr: Array<any> = [];
  total: number = 0;
  todayArr: Array<any> = [];
  lenArr: Array<any> = [];
  date:Array<any> = [];
  dateOne:Array<any> = [];
  hostUrl = "https://server.fmode.cn/api/"
  constructor(public activatedRoute: ActivatedRoute, public router: Router, private http : HttpClient) {}
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
    },
    {
      value:'nowHospital',
      label:'所在院区'
    },
    // {
    //   value:'ICU',
    //   label:'科室/病区'
    // },
    {
      value:'type',
      label:'医护人员类别'
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
      name: '年龄',
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
      name: '所在院区',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
        { text: '东湖院区', value: '东湖院区' },
        { text: '象湖院区', value: '象湖院区' },
      ],
      filterFn: (list: string[], item) => list.some(title => {
        if(item.nowHospital){
          return item.nowHospital.indexOf(title) !== -1
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
      name: '第一针预约接种时间',
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
      name: '第一针接种时间',
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
      name: '第二针接种时间',
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
      name: '第二针预约接种时间',
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
      name: '医护人员类别',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
        { text: '护士', value: '护士' },
        { text: '医生', value: '医生' },
        { text: '医技人员', value: '医技人员' },
        { text: '机关后勤', value: '机关后勤' },
        { text: '其他', value: '其他' },
      ],
      filterFn: (list: string[], item) => list.some(name => {
        if(item.type){
          return item.type == name
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
      name: '未接种原因',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
        {text:'禁忌症',value:'禁忌症'},
        {text:'疾病原因暂缓接种',value:'疾病原因暂缓接种'},
        {text:'其他原因',value:'others'}
      ],
      filterFn: (list: string[], item) => list.some(title => {
          if(item.notInoculate){
            if(title == 'others'){
              if(item.notInoculate!=='禁忌症'&&item.notInoculate!=='疾病原因暂缓接种'){
                return item
              }
            }else{
              return item.notInoculate.indexOf(title) !== -1
            }
          }
      })
    }
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
  searchIdText:string = ''
  selected = {
    value:'name',
    label:'姓名'
  }
  listOfData:Array<any> = [
   
  ];
  ngOnInit() {
    this.getData()
    this.getCount()
    this.getTotalCount()
  }
  onChange(result: Date[]): void {
    this.dateOne = []
    if(result.length){
      this.date = result.map(v=>{
        return this.formateDate(v)
      })
      
      let that = this
      let sql = `SELECT "Profile"."name","Profile"."studentID",
      regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
      "Antiaircraft"."age","Antiaircraft"."nowHospital",
      "Antiaircraft"."oneInoculate",
      "Antiaircraft"."beforInoculate",
      "Antiaircraft"."towInoculate",
      "Antiaircraft"."towInoculated",
      "Antiaircraft"."towHospital","Antiaircraft"."notInoculate","Antiaircraft"."type"
      FROM "Profile"
      left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
      where "Profile"."company" = '668rM7MPii' and "Antiaircraft"."towInoculate">= '${this.dateOne[0]}'
      and "Antiaircraft"."towInoculate"<= '${this.dateOne[1]}'
      order by  
       "Antiaircraft"."createdAt" desc NULLS LAST
      `
      that.http.post(this.hostUrl+'novaql/select',{sql})
      .subscribe(async(res)=>{
        console.log(res)
        let result:any = res
        that.listOfData = await result.data
      })
      let sql2 = `SELECT count(*)
      FROM "Profile"
      left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
      where "Profile"."company" = '668rM7MPii' and "Antiaircraft"."towInoculate">= '${this.date[0]}'
      and "Antiaircraft"."towInoculate"<= '${this.date[1]}'
      `
      that.http.post(this.hostUrl+'novaql/select',{sql:sql2})
      .subscribe(async(res)=>{
        console.log(res)
        let result:any = res
        that.total = await result.data[0].count
      })
    }else{
      this.getCount()
      this.getTotalCount()
      this.getData()
    }
  }
  onChangeOne(result: Date[]){
    this.date = []
    if(result.length){
      this.dateOne = result.map(v=>{
        return this.formateDate(v)
      })
      let that = this
      let sql = `SELECT "Profile"."name","Profile"."studentID",
      regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
      "Antiaircraft"."age","Antiaircraft"."nowHospital",
      "Antiaircraft"."oneInoculate",
      "Antiaircraft"."beforInoculate",
      "Antiaircraft"."towInoculate",
      "Antiaircraft"."towInoculated",
      "Antiaircraft"."towHospital","Antiaircraft"."notInoculate","Antiaircraft"."type"
      FROM "Profile"
      left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
      where "Profile"."company" = '668rM7MPii' and "Antiaircraft"."oneInoculate">= '${this.dateOne[0]}'
      and "Antiaircraft"."oneInoculate"<= '${this.dateOne[1]}'
      order by  
       "Antiaircraft"."createdAt" desc NULLS LAST
      `
      that.http.post(this.hostUrl+'novaql/select',{sql})
      .subscribe(async(res)=>{
        console.log(res)
        let result:any = res
        that.listOfData = await result.data
      })
      let sql2 = `SELECT count(*)
      FROM "Profile"
      left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
      where "Profile"."company" = '668rM7MPii' and "Antiaircraft"."oneInoculate">= '${this.dateOne[0]}'
      and "Antiaircraft"."oneInoculate"<= '${this.dateOne[1]}'
      `
      that.http.post(this.hostUrl+'novaql/select',{sql:sql2})
      .subscribe(async(res)=>{
        console.log(res)
        let result:any = res
        that.total = await result.data[0].count
      })
    }else{
      this.getCount()
      this.getTotalCount()
      this.getData()
    }
  }
  formateDate(datetime) {
    function addDateZero(num) {
      return (num < 10 ? "0" + num : num);
    }
    let d = new Date(datetime);
    let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate());
    return formatdatetime;
  }
  searchColNameChange(e){
    console.log(e)
    this.selected = e
  }
  searchInputChange(e){
    this.searchInputText = e
    let that = this
    let limit
    if(this.selected.value =="name"||this.selected.value=="studentID"){
      limit = `"Profile"."${this.selected.value}"`
    }else{
      limit = `"Antiaircraft"."${this.selected.value}"`
    }
    let sql = `SELECT "Profile"."name","Profile"."studentID",
    regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
    "Antiaircraft"."age","Antiaircraft"."nowHospital",
    "Antiaircraft"."oneInoculate",
    "Antiaircraft"."beforInoculate",
    "Antiaircraft"."towInoculate",
    "Antiaircraft"."towInoculated",
    "Antiaircraft"."towHospital","Antiaircraft"."notInoculate","Antiaircraft"."type"
    FROM "Profile"
    left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
    where "Profile"."company" = '668rM7MPii' and
    ${limit} LIKE '%${e}%'
    order by
     "Antiaircraft"."createdAt" desc NULLS LAST
    `
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = await result.data
    })
    this.getCount()
  }
  getData() {
    let that = this
    let sql = `SELECT "Profile"."name","Profile"."studentID",
    regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
    "Antiaircraft"."age","Antiaircraft"."nowHospital",
    "Antiaircraft"."oneInoculate",
    "Antiaircraft"."beforInoculate",
    "Antiaircraft"."towInoculate",
    "Antiaircraft"."towInoculated",
    "Antiaircraft"."towHospital","Antiaircraft"."notInoculate","Antiaircraft"."type"
    FROM "Profile"
    left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
    where "Profile"."company" = '668rM7MPii'
    order by
     "Antiaircraft"."createdAt" desc NULLS LAST
    `
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.listOfData = await result.data
    })
  }
  getCount(){
    let that = this
    let limit
    if(this.selected.value =="name"||this.selected.value=="studentID"){
      limit = `"Profile"."${this.selected.value}"`
    }else{
      limit = `"Antiaircraft"."${this.selected.value}"`
    }
    let sql = `SELECT count(*)
    FROM "Profile"
    left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
    where "Profile"."company" = '668rM7MPii' and 
    "Antiaircraft"."createdAt" is not null and
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
    let that = this
    let sql = `SELECT count(*)
    FROM "Profile"
    where "Profile"."company" = '668rM7MPii'`
    that.http.post(this.hostUrl+'novaql/select',{sql})
    .subscribe(async(res)=>{
      console.log(res)
      let result:any = res
      that.count = await result.data[0].count
    })
  }
  export(){
  let data = this.listOfData
  let table = '<table border="1px" cellspacing="0" cellpadding="0">';
      table += '<thead>';
      table += '<th>姓名</th>';
      table += '<th>工号</th>';
      table += '<th>部门</th>';
      table += '<th>年龄</th>';
      table += '<th>所在院区</th>';
      table += '<th>第一针预约接种时间</th>';
      table += '<th>第一针接种时间</th>';
      table += '<th>第二针接种时间</th>';
      table += '<th>第二针预约接种时间</th>';
      table += '<th>医护人员类别</th>';
      table += '<th>未接种原因</th>';
      table += '</thead>';
      table += '<tbody>';
      let _body = "";
      for (var row = 0; row < this.listOfData.length; row++) {
      _body += '<tr>';
      _body += '<td>';
      _body += `${data[row].name}`;
      _body += '</td>';
      _body += '<td>';
      _body += `&nbsp;${data[row].studentID}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].department}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].age?data[row].age:''}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].nowHospital?data[row].nowHospital:''}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].oneInoculate?this.formateDate(data[row].oneInoculate):''}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].beforInoculate?this.formateDate(data[row].beforInoculate):''}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].towInoculated?this.formateDate(data[row].towInoculated):''}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].towInoculate?this.formateDate(data[row].towInoculate):''}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].type?data[row].type:''}`;
      _body += '</td>';
      _body += '<td>';
      _body += `${data[row].notInoculate?data[row].notInoculate:''}`;
      _body += '</td>';
      _body += '</tr>';
        }
      table += _body;
      table += '</tbody>';
      table += '</table>';
  this.excel(table, "疫苗接种登记表.xls");
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
injected(){
  let that = this
  let limit
  let sql = `SELECT "Profile"."name","Profile"."studentID",
  regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
  "Antiaircraft"."age","Antiaircraft"."nowHospital",
  "Antiaircraft"."oneInoculate",
  "Antiaircraft"."beforInoculate",
  "Antiaircraft"."towInoculate",
  "Antiaircraft"."towInoculated",
  "Antiaircraft"."towHospital","Antiaircraft"."notInoculate","Antiaircraft"."type"
  FROM "Profile"
  left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
  where "Profile"."company" = '668rM7MPii' and 
  "Antiaircraft"."createdAt" is not null
  order by
  "Antiaircraft"."createdAt" desc NULLS LAST
  `
  that.http.post(this.hostUrl+'novaql/select',{sql})
  .subscribe(async(res)=>{
    console.log(res)
    let result:any = res
    that.listOfData = await result.data
  })
}
uninject(){
  let that = this
  let limit
  let sql = `SELECT "Profile"."name","Profile"."studentID",
  regexp_replace(regexp_replace(("Profile"."branch")::text,'(["|\[|\]|"])','','g'),'[,]','/','g') as department,
  "Antiaircraft"."age","Antiaircraft"."nowHospital",
  "Antiaircraft"."oneInoculate",
  "Antiaircraft"."beforInoculate",
  "Antiaircraft"."towInoculate",
  "Antiaircraft"."towInoculated",
  "Antiaircraft"."towHospital","Antiaircraft"."notInoculate","Antiaircraft"."type"
  FROM "Profile"
  left join "Antiaircraft" on "Profile"."user" = "Antiaircraft"."user"
  where "Profile"."company" = '668rM7MPii' and 
  "Antiaircraft"."createdAt" is null
  `
  that.http.post(this.hostUrl+'novaql/select',{sql})
  .subscribe(async(res)=>{
    console.log(res)
    let result:any = res
    that.listOfData = await result.data
  })
}
search(){
  console.log(this.searchInputText)
  this.visible = false;
  this.listOfData = this.listOfData.filter((item) => {
    if(item.name){
     return item.name.indexOf(this.searchInputText) !== -1}
    })
  // console.log(this.listOfData.map(item=>item.name))
}
reset(){
  this.searchInputText = '';
  // this.search();
  this.searchIdText = '';
  this.getData()
}
searchId(){
  this.visible = false;
  this.listOfData = this.listOfData.filter((item) => {
    if(item.studentID){
     return item.studentID.indexOf(this.searchIdText) !== -1}
    })
  // console.log(this.listOfData.map(item=>item.name))
}
resetId(){
  this.searchIdText = '';
  this.searchInputText = '';
  // this.searchId();
  this.getData()
}

}

