import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import * as Parse from "parse";
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-grade-analy',
  templateUrl: './grade-analy.component.html',
  styleUrls: ['./grade-analy.component.scss']
})
export class GradeAnalyComponent implements OnInit {

  // optionList = [
  //   { label: '分数', value: 'fraction'},
  //   { label: '人数', value: 'number'}
  // ];
  // selectedValue = { label: '分数', value: 'fraction',};
  // compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
  examId: string;
  value1: any;//input框输入值
  value2: any;//input框输入值
  fractions: any = []//分数查询
  countFilterData: any = [];//人数查询
  select: any = "fraction";//选择
  footer: any = ""
  footer2: string;
  result: any;
  departmentId: string;
  company: any = "5beidD3ifA";
  subcompany: string;
  pageIndex: number = 1;
  constructor(
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(async parms => {
      console.log(parms);
      this.examId = parms.get("PobjectId");
      this.departmentId = localStorage.getItem("department")
      this.subcompany = localStorage.getItem("company")

    })
  }

  // onLog(value: { label: string; value: string;}): void {
  //   console.log(value);
  //   let data = value.value;
  //   console.log(data);
  //   this.select = data

  // }

  // 分数查找
  getFraction() {
    this.fractions = []
    let fractions = []
    let querySurvey = new Parse.Query("SurveyLog");
    querySurvey.equalTo("exam", this.examId);
    querySurvey.equalTo("department", this.departmentId);
    querySurvey.equalTo("company", this.company);
    querySurvey.greaterThan("grade", this.value1);
    querySurvey.include("profile")
    querySurvey.ascending("grade")
    querySurvey.limit(20000)
    querySurvey.find().then(res => {
      console.log(res);
      if (res.length > 0) {
        res.forEach(item => {
          let fraction = item.toJSON()
          fractions.push(fraction)
        })
        let foot = "共有" + fractions.length + "名考生"
        console.log(foot, this.footer);
        this.footer = foot
        this.fractions = fractions
        console.log(this.fractions);
        this.cdRef.detectChanges();

      } else {
        this.message.error("未查找到考生信息");
      }

    })

  }

  // 人数查找
  getPeople() {
    this.countFilterData = []
    console.log(this.company, this.departmentId);
    let peoples = []
    let queryPeople = new Parse.Query("SurveyLog");
    queryPeople.equalTo("exam", this.examId);
    queryPeople.equalTo("department", this.departmentId);
    queryPeople.equalTo("company", this.company);
    queryPeople.include("profile");
    queryPeople.descending("grade")
    queryPeople.limit(20000)
    queryPeople.find().then(res => {
      if (res.length > 0) {
        if (this.value2 > res.length) {
          this.message.error("考生信息共" + res.length + '条');
          return
        }
        res.forEach(item => {
          let people = item.toJSON();
          peoples.push(people)
        })
        peoples.splice(this.value2, peoples.length)
        console.log(peoples);
        let value = this.value2 - 1
        this.result = peoples[value]
        let foot = "共有" + peoples.length + "名考生"
        this.footer2 = foot
        this.countFilterData = peoples
        console.log(this.countFilterData);
        this.cdRef.detectChanges();


      } else {
        this.message.error("未查找到考生信息");
      }
    })
  }

  // 搜索
  getSearch(type) {
    console.log(type);

    // console.log(this.value);
    // if (this.select == "fraction") {
    //   this.getFraction()
    // }
    // if (this.select == "number") {
    //   this.getPeople()
    // }
    if (type == "fraction") {
      this.getFraction()
    }
    if (type == "number") {
      this.getPeople()
    }

  }


}
