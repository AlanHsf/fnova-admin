import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
@Component({
  selector: 'app-pay-record',
  templateUrl: './pay-record.component.html',
  styleUrls: ['./pay-record.component.scss']
})
export class PayRecordComponent implements OnInit {
  listOfColumn = [
    {
      title: '招生计划',
      compare: null,
      priority: false
    },
    // {
    //   title: '缴费金额',
    //   compare: null,
    //   priority: false

    // },
    {
      title: '操作',
      compare: null,
      priority: false
    },
  ];
  listOfData: Array<any> = []
  constructor(private route: Router, private activRoute: ActivatedRoute) { }
  schools: any;
  company: string;
  school: any;
  recruitName: any = '';
  department: any

  ngOnInit() {
    if (localStorage.getItem('department')) {
      this.department = localStorage.getItem('department')
    }
    this.company = localStorage.getItem('company')
    // 总后台
    console.log(this.department, this.company)
    if (!this.department) {
      this.listOfColumn = [
        {
          title: '所属院校',
          compare: null,
          priority: false
        },
        {
          title: '招生计划',
          compare: null,
          priority: false
        },
        // {
        //   title: '缴费金额',
        //   compare: null,
        //   priority: false

        // },
        {
          title: '操作',
          compare: null,
          priority: false
        }
      ];
    }
    this.initPage();
    this.getSchool()
    console.log(this.company)

  }
  initPage() {
    let Recruit = new Parse.Query('RecruitStudent')
    if (this.department) {
      Recruit.equalTo('department', this.department)
    }
    Recruit.include('department')
    Recruit.include('company')
    Recruit.find().then(res => {
      console.log(res)
      this.listOfData = res;
    })
  }
  search() {
    let departmentId = this.school;
    let recruitName = this.recruitName.trim()
    if (!departmentId && !recruitName) {
      return
    }
    let Recruit = new Parse.Query('RecruitStudent')
    if (departmentId) {
      Recruit.equalTo('department', departmentId)
    }
    if (recruitName) {
      Recruit.contains('title', recruitName)

    }
    Recruit.include('department')
    Recruit.include('company')
    Recruit.find().then(res => {
      console.log(res)
      this.listOfData = res;
    })
  }
  getSchool() {
    let Department = new Parse.Query('Department')
    Department.equalTo('company', this.company)
    Department.find().then(res => {
      console.log(res)
      this.schools = res;
      this.department ? (this.school = this.department) : (this.school = this.schools[0].id);

    })
  }
  async changeSchool(ev) {
    if (!ev) {

      return
    }
    this.search()
  }
  // 查看该招生计划下缴费考生
  toPage(data) {
    console.log(data);
    let paramsArr: any =
    {
      RecruitArray: [
        {
          "__type": "Pointer",
          "className": "RecruitStudent",
          "objectId": data.id
        }
      ]
    };
    paramsArr = JSON.stringify(paramsArr);
    this.route.navigate(['/english/record-list', { recruit: data.id }])
    //, { rid: 'GhhyIdpRL9',containedIn: paramsArr,  }
  }
}

