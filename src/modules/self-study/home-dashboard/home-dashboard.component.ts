import { Component, OnInit } from "@angular/core";
import { EChartOption } from "echarts";
import * as Parse from "parse";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-dashboard',
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent {
  constructor(private http: HttpClient) { }

  lessonCount: number = 0;
  onLineLessson: number = 0;
  offLineLesson: number = 0;
  trainCount: number = 0;
  schoolCount: number = 0;
  userCount: number = 0;
  teacherCount: number = 0;
  agentsCount: number = 0;
  schoolTeachers: any = 0;
  schoolStudents: any = 0;
  schoolLessons: any = 0;
  schoolMajors: any = 0;
  company: any;
  options: any = [2022, 2023, 2024];
  option: any;
  dataAxis: any = [
    "-01",
    "-02",
    "-03",
    "-03",
    "-04",
    "-05",
    "-06",
    "-07",
    "-08",
    "-09",
    "-10",
    "-11",
    "-12"
  ];
  data: any = [
    256,
    269,
    278,
    299,
    310,
    321,
    349,
    375,
    389,
    412,
    420,
    459,
    467,
    478
  ];
  cate: string = "";
  centerId;
  departmentId: any;
  dataShadow: any = [];
  signOption: EChartOption = {};
  echartEduOption: any = {};
  echartMajorOption: any = {};
  echartBatchOption: any = {};
  hotMajorOption: any = {};
  hotSchoolOption: any = {};
  xAxisData: any = [];
  schoolList: any = [];
  studentCenterList: any = [];
  async ngOnInit() {
    this.company = localStorage.getItem("company");
    // if (this.company) {
    //   this.getSchoolRank()
    // }
    if (localStorage.getItem("department")) {
      this.departmentId = localStorage.getItem("department");
    }
    let date = new Date()
    this.option = date.getFullYear()
    this.graduOption = date.getFullYear()
    // this.xAxisData.forEach((data, index) => {
    //   data = this.option + data
    //   this.xAxisData[index] = data
    // });
    // 柱状图
    this.queryEduStudy()
    // 热门院校(前五)
    this.getHotSchool()
    // 热门专业(前五)
    this.getHotMajor()

    this.queryGraduDateInfo()

    if (this.departmentId) {
      let center = new Parse.Query("Department");
      center.equalTo("type", "training");
      center.equalTo("company", "1ErpDVc1u6");
      center.equalTo("objectId", this.departmentId);
      let cneterInfo = await center.first();
      console.log(cneterInfo)
      if (cneterInfo && cneterInfo.id) {
        this.centerId = cneterInfo.id
        this.departmentId = null;
        this.company = null;
      }
      this.getProfileCount();
      this.getIsCheckCount();
      this.getCheckCount();
    } else {
      this.getDepartmentCount();
      this.getMajorCount();
      this.getLessonCount();

      this.getProfileCount();
      this.getIsCheckCount();
      this.getCheckCount();
    }
  }
  tabNum = 0;
  async tabChange(ev) {
    console.log(ev);
    this.tabNum = ev
    if (ev == 0) {
      this.queryEduStudy()
    } else if (ev == 1) {
      this.queryBatchInfo();
    } else if (ev == 2) {
      this.queryMajorInfo();
    }
  }





  async getSchoolRank() {
    let querySchool: any = new Parse.Query("Department");
    querySchool.equalTo("company", this.company);
    querySchool.include("category")
    let schools = await querySchool.find()
    console.log(schools)
    if (schools && schools.length) {
      schools.forEach(async school => {
        if (school.get('category') && school.get('category').get('name') == '学校') {
          let schoolId = school.id;
          let queryCount: any = new Parse.Query("Profile");
          queryCount.equalTo("department", schoolId);
          queryCount.withCount();
          let students: any = await queryCount.find();
          if (students) {
            school.studentCount = students.count;
            this.schoolList.push(school)
            this.schoolList.sort((a, b) => { // 排序
              return b.studentCount - a.studentCount;
            })
          }
        } else if (school.get('category') && school.get('category').get('name') == '助学中心') {
          let centerId = school.id;
          let queryCount2: any = new Parse.Query("Profile");
          queryCount2.equalTo("center", centerId);
          queryCount2.withCount();
          let students: any = await queryCount2.find();
          if (students) {
            school.studentCount = students.count;
            this.studentCenterList.push(school)
            this.studentCenterList.sort((a, b) => {
              return b.studentCount - a.studentCount;
            })
          }
        }
      })
    }
  }

  async getHotSchool() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let sql = `select 
      max("profile"."department") as "id",
      max("depart"."name") as "name",
      count(1)
    from "Profile" as "profile"
    left join "Department" as "depart" on "depart"."objectId" = "profile"."department"
    where "profile"."company" = 'pPZbxElQQo' and "profile"."department" is not null
    group by "profile"."department"
    order by "count" desc`
    await this.http.post(baseurl, { sql: sql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        let data = res["data"]
        let datax = []
        let datay = []
        data.forEach((item, index) => {
          if (index < 5) {
            datax.push(item.name)
            let yobj = { value: item.count, name: item.name }
            datay.push(yobj)
          }
        });
        this.hotSchoolOption = {
          title: {
            text: "热门院校（前五）",
            top: 10,
            left: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            orient: "horizontal",
            data: datax
          },
          series: [
            {
              name: "热门院校",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center"
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "30",
                  fontWeight: "bold"
                }
              },
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#B5C334",
                      "#FCCE10",
                      "#E87C25",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  }
                }
              },
              labelLine: {
                show: false
              },
              data: datay
            }
          ]
        };

      }
    })
  }


  async getHotMajor() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select"
    let sql = `select 
    max("profile"."SchoolMajor") as "majorId"	,
    max("major"."name") as "major",
    count(1)
  from "Profile" as "profile"
  left join "SchoolMajor" as "major" on "major"."objectId" = "profile"."SchoolMajor"
  where "profile"."company" = 'pPZbxElQQo' and "profile"."SchoolMajor" is not null
  group by "profile"."SchoolMajor"
  order by "count" desc`

    await this.http.post(baseurl, { sql: sql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        let data = res["data"]
        let datax = []
        let datay = []
        data.forEach((item, index) => {
          if (index < 5) {
            datax.push(item.major)
            let yobj = { value: item.count, name: item.major }
            datay.push(yobj)
          }
        });
        this.hotMajorOption = {
          title: {
            text: "热门专业（前五）",
            top: 10,
            left: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            bottom: 10,
            orient: "horizontal",
            data: datax
          },
          series: [
            {
              name: "热门专业",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center"
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "30",
                  fontWeight: "bold"
                }
              },
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#B5C334",
                      "#FCCE10",
                      "#E87C25",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  }
                }
              },
              labelLine: {
                show: false
              },
              data: datay
            }
          ]
        };

      }
    })
  }

  depaCount;
  async getDepartmentCount() {
    let depa = new Parse.Query("Department");
    depa.equalTo("company", "1ErpDVc1u6");
    depa.notEqualTo("type", "training");
    this.depaCount = await depa.count();
  }
  majorCount;
  async getMajorCount() {
    let major = new Parse.Query("SchoolMajor");
    major.equalTo("company", "1ErpDVc1u6");
    this.majorCount = await major.count();
  }
  async getLessonCount() {
    let Lesson = new Parse.Query("Lesson");
    Lesson.equalTo("company", this.company);
    this.lessonCount = await Lesson.count();
  }
  proCount;
  async getProfileCount() {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("company", "1ErpDVc1u6");
    if (this.departmentId) {
      Profile.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.departmentId
      }])
    } else if (this.centerId) {
      Profile.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.centerId
      }])
    }
    this.proCount = await Profile.count();
  }
  isCheckCount;
  async getIsCheckCount() {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("company", "1ErpDVc1u6");
    Profile.notEqualTo("isCross", true);
    if (this.departmentId) {
      Profile.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.departmentId
      }])
    } else if (this.centerId) {
      Profile.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.centerId
      }])
    }
    this.isCheckCount = await Profile.count();
  }
  checkCount;
  async getCheckCount() {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("company", "1ErpDVc1u6");
    Profile.equalTo("isCross", true);
    if (this.departmentId) {
      Profile.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.departmentId
      }])
    } else if (this.centerId) {
      Profile.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.centerId
      }])
    }
    this.checkCount = await Profile.count();
  }
  async getUserCount() {
    let User = new Parse.Query("_User");
    User.equalTo("company", this.company);
    this.userCount = await User.count();
  }
  async getTeacherCount() {
    let LessonTeacher = new Parse.Query("LessonTeacher");
    LessonTeacher.equalTo("company", this.company);
    this.teacherCount = await LessonTeacher.count();
  }
  async getSchoolMajor() { }
  newOption: any = {};
  changeOptions() {
    // let topLeft = echarts.init(
    //   <HTMLDivElement>document.getElementById("echart")
    // );
    switch (this.tabNum) {
      case 0:
        this.queryEduStudy()
        break;
      case 1:
        this.queryBatchInfo()
        break;
      case 2:
        this.queryMajorInfo()
        break;
      default: ;
    }

    // let data = [];
    // this.xAxisData.forEach((d, i) => {
    //   d = this.option + d;
    //   data[i] = d;
    // });
    // this.newOption = this.echartOption;

    // let echartOptionData = [];
    // this.xAxisData.forEach(data => {
    //   // echartOptionData.push(this.option + data);
    //   data = this.option + data
    // });
    // this.newOption.title.text = this.option + "年平台人数";
    // this.newOption.series[0].data = data;
    // this.newOption.xAxis.data = echartOptionData;
    // topLeft.setOption(this.newOption);
  }
  pro: any;
  // async query() {
  //   let query = new Parse.Query('Profile')
  //   query.equalTo("company", "AjhX2oePqS");
  //   query.limit(420)
  //   let count = await query.find()
  //   this.pro = count;
  //   console.log(count)
  // }
  // set() {
  //   this.pro.forEach(async item => {
  //     item.set("company", {
  //       __type: "Pointer",
  //       className: "Company",
  //       objectId: "pPZbxElQQo"
  //     });
  //     await item.save()
  //   })
  // }
  defaultData
  yData: any = []
  queryEduStudy() {
    this.xAxisData = ["本科", "专科"]
    this.yData = []
    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let commonSql = ``
    //   let sql = `select 
    //   date_part('year', "groupTime"."month") as "year",
    //   date_part('month', "groupTime"."month") as "month",
    //   max("groupTime"."month") as "spTime",
    //   count(1)
    //  from 
    //  (select max("timeTable"."time") as "month",
    //    max("timeTable"."user") as "user"
    //  from (select date_trunc('month', "LR"."updatedAt" )  as "time",
    //      "LR"."user" as "user"
    //   from "LessonRecord" as "LR"
    //   where "LR"."company" = 'pPZbxElQQo') as "timeTable"
    //   group by "timeTable"."user") as "groupTime"
    //   where date_part('year', "groupTime"."month") = '${this.option}'
    //   group by "groupTime"."month"
    //   order by "groupTime"."month"`
    let sql = `select "education",count(*) 
      from "Profile" 
      where "company" = '1ErpDVc1u6' 
        and "isDeleted" is not true 
        and to_char("createdAt", 'yyyy') = '${this.option}' `

    if (this.departmentId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.departmentId}" }]' `
    } else if (this.centerId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.centerId}" }]' `
    }

    let groupSql = ` group by "education" `

    commonSql = sql + groupSql
    this.http.post(baseurl, { sql: commonSql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        console.log(res)
        let data = res["data"]
        this.xAxisData.forEach((d, i) => {
          d = this.option + d;
          this.xAxisData[i] = d
          for (let j = 0; j < data.length; j++) {
            if (d.substring(4) == data[j].education) {
              this.yData[i] = data[j].count ? data[j].count : 0
            }
          }
          if (this.yData[i] == null) {
            this.yData[i] = 0
          }
        });
        this.echartEduOption = {
          title: {
            text: this.option + "年平台学生层次人数",
            textStyle: {
              color: "#333",
              fontSize: 24
            },
            top: 20,
            left: 20
          },
          xAxis: {
            type: "category",
            data: this.xAxisData,
            axisLabel: {
              formatter: "{value}"
            }
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      // "#B5C334",
                      // "#FCCE10",
                      "#E87C25",
                      // "#27727B",
                      // "#FE8463",
                      // "#9BCA63",
                      // "#FAD860",
                      // "#F3A43B",
                      // "#60C0DD",
                      // "#D7504B",
                      // "#C6E579",
                      // "#F4E001",
                      // "#F0805A",
                      // "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}"
                  }
                }
              },
              barWidth: 60,
              data: this.yData,
              type: "bar",
              showBackground: true,
            }
          ]
        };
      }
    })
  }

  async queryMajorInfo() {
    this.xAxisData = []
    this.yData = []
    let major = new Parse.Query("SchoolMajor");
    major.equalTo("company", "1ErpDVc1u6");
    if (this.departmentId) {
      major.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.departmentId
      }])
    } else if (this.centerId) {
      major.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.centerId
      }])
    }
    major.select("objectId", "name", "type");
    let majorList = await major.find();
    console.log(majorList)
    if (majorList && majorList.length) {
      for (let i = 0; i < majorList.length; i++) {
        this.xAxisData.push(majorList[i].get("name") + "(" + majorList[i].get("type") + ")");
      }
    }
    console.log(this.xAxisData)

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let commonSql = ``

    let sql = `select * from 
      (select "objectId","name" from "SchoolMajor" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.option}') as "major"
      left join 
        (select "SchoolMajor",count(*) from "Profile" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.option}' and "isDeleted" is not true group by "SchoolMajor") as "pro"
          on "major"."objectId" = "pro"."SchoolMajor" `

    if (this.departmentId) {
      sql = `select * from 
      (select "objectId","name" from "SchoolMajor" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.option}' and "departments" @> '[{ "objectId": "${this.departmentId}" }]' ) as "major"
      left join 
        (select "SchoolMajor",count(*) from "Profile" where "company" = '1ErpDVc1u6' and "department" = '${this.departmentId}' and to_char("createdAt", 'yyyy') = '${this.option}' and "isDeleted" is not true group by "SchoolMajor") as "pro"
          on "major"."objectId" = "pro"."SchoolMajor" `
    }
    if (this.centerId) {
      sql = `select * from 
      (select "objectId","name" from "SchoolMajor" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.option}' and "departments" @> '[{ "objectId": "${this.centerId}" }]' ) as "major"
      left join 
        (select "SchoolMajor",count(*) from "Profile" where "company" = '1ErpDVc1u6' and "center" = '${this.centerId}' and to_char("createdAt", 'yyyy') = '${this.option}' and "isDeleted" is not true group by "SchoolMajor") as "pro"
          on "major"."objectId" = "pro"."SchoolMajor" `
    }

    commonSql = sql
    this.http.post(baseurl, { sql: commonSql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        console.log(res)
        let data: any = res["data"]
        this.xAxisData.forEach((d, i) => {
          for (let j = 0; j < data.length; j++) {
            if (d.substring(0, d.indexOf("(")) == data[j].name) {
              this.yData[i] = data[j].count ? data[j].count : 0
            }
          }
          if (this.yData[i] == null) {
            this.yData[i] = 0
          }
        });
        console.log(this.yData)
        this.echartMajorOption = {
          title: {
            text: this.option + "年平台学生专业人数",
            textStyle: {
              color: "#333",
              fontSize: 24
            },
            top: 20,
            left: 20
          },
          xAxis: {
            type: "category",
            data: this.xAxisData,
            axisLabel: {
              formatter: "{value}"
            }
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#E87C25",
                      "#B5C334",
                      "#FCCE10",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}"
                  }
                }
              },
              barWidth: 60,
              data: this.yData,
              type: "bar",
              showBackground: true,
            }
          ]
        };
      }
    })
  }

  async queryBatchInfo() {
    this.xAxisData = []
    this.yData = []
    // let pro = new Parse.Query("Profile");
    // pro.equalTo("company", "1ErpDVc1u6");
    // if (this.departmentId) {
    //   pro.containedIn("departments", [{
    //     __type: "Pointer",
    //     className: 'Department',
    //     objectId: this.departmentId
    //   }])
    // }else if(this.centerId){
    //   pro.containedIn("departments", [{
    //     __type: "Pointer",
    //     className: 'Department',
    //     objectId: this.centerId
    //   }])
    // }
    // pro.select("objectId", "name");
    // let majorList = await pro.find();
    // console.log(majorList)
    // if (majorList && majorList.length) {
    //   for (let i = 0; i < majorList.length; i++) {
    //     this.xAxisData.push(majorList[i].get("name"));
    //   }
    // }
    // console.log(this.xAxisData)


    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let commonSql = ``
    let sql = `select "batch",count(*) 
      from "Profile" 
      where "company" = '1ErpDVc1u6' 
        and "isDeleted" is not true 
        and to_char("createdAt", 'yyyy') = '${this.option}' `

    if (this.departmentId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.departmentId}" }]' `
    } else if (this.centerId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.centerId}" }]' `
    }

    let groupSql = ` group by "batch" `

    commonSql = sql + groupSql
    this.http.post(baseurl, { sql: commonSql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        console.log(res)
        let data = res["data"]
        for (let i = 0; i < data.length; i++) {
          this.xAxisData[i] = data[i].batch
          this.yData[i] = data[i].count ? data[i].count : 0
        }
        this.echartBatchOption = {
          title: {
            text: this.option + "年平台学生批次人数",
            textStyle: {
              color: "#333",
              fontSize: 24
            },
            top: 20,
            left: 20
          },
          xAxis: {
            type: "category",
            data: this.xAxisData,
            axisLabel: {
              formatter: "{value}"
            }
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#E87C25",
                      "#B5C334",
                      "#FCCE10",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}"
                  }
                }
              },
              barWidth: 60,
              data: this.yData,
              type: "bar",
              showBackground: true,
            }
          ]
        };
      }
    })
  }


  graduOptions: any = [2022, 2023, 2024];
  graduOption;
  xAxisGraduData = []
  yGraduData = []

  tabGraduationNum = 0;
  async tabGraduationChange(ev) {
    console.log(ev);
    this.tabGraduationNum = ev
    if (ev == 0) {
      this.queryGraduDateInfo()
    } else if (ev == 1) {
      this.queryGraduMajorInfo()
    } else if (ev == 2) {
      this.queryGraduBatchInfo()
    } else if (ev == 3) {
      this.queryGraduServiceInfo()
    }
  }

  changeGraduOptions() {
    switch (this.tabGraduationNum) {
      case 0:
        this.queryGraduDateInfo()
        break;
      case 1:
        this.queryGraduMajorInfo()
        break;
      case 2:
        this.queryGraduBatchInfo()
        break;
      case 3:
        this.queryGraduServiceInfo()
        break;
      default: ;
    }
  }


  echartGraduDateOption;
  // 毕业时间(6月, 12月)
  async queryGraduDateInfo() {
    let date1 = this.graduOption + '05'
    let date2 = this.graduOption + '12'

    this.xAxisGraduData = [date1, date2]
    this.yGraduData = [0, 0]

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let commonSql = ``
    let sql = `select "date",count(date) 
      from (select to_char("createdAt", 'yyyyMM') as "date","user","departments" from "SchoolAppEdu" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyyMM') in ('${date1}','${date2}')) as "appedu"
      join (select "objectId" from "Profile" where "isDeleted" is not true) as "pro" on "pro"."objectId" = "appedu"."user"
      `

    if (this.departmentId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.departmentId}" }]' `
    } else if (this.centerId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.centerId}" }]' `
    }

    let groupSql = ` group by "date" `

    commonSql = sql + groupSql
    this.http.post(baseurl, { sql: commonSql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        console.log(res)
        let data = res["data"]
        for (let i = 0; i < data.length; i++) {
          // this.xAxisGraduData[i] = data[i].date
          this.yGraduData[i] = data[i].count ? data[i].count : 0
        }
        this.echartGraduDateOption = {
          title: {
            text: this.graduOption + "年毕业学生人数",
            textStyle: {
              color: "#333",
              fontSize: 24
            },
            top: 20,
            left: 20
          },
          xAxis: {
            type: "category",
            data: this.xAxisGraduData,
            axisLabel: {
              formatter: "{value}"
            }
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#E87C25",
                      "#B5C334",
                      "#FCCE10",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}"
                  }
                }
              },
              barWidth: 60,
              data: this.yGraduData,
              type: "bar",
              showBackground: true,
            }
          ]
        };
      }
    })
  }


  echartGraduMajorOption;
  // 毕业时间(6月, 12月)
  async queryGraduMajorInfo() {
    this.xAxisGraduData = []
    this.yGraduData = []
    let major = new Parse.Query("SchoolMajor");
    major.equalTo("company", "1ErpDVc1u6");
    if (this.departmentId) {
      major.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.departmentId
      }])
    } else if (this.centerId) {
      major.containedIn("departments", [{
        __type: "Pointer",
        className: 'Department',
        objectId: this.centerId
      }])
    }
    major.select("objectId", "name", "type");
    let majorList = await major.find();
    console.log(majorList)
    if (majorList && majorList.length) {
      for (let i = 0; i < majorList.length; i++) {
        this.xAxisGraduData.push(majorList[i].get("name") + "(" + majorList[i].get("type") + ")");
      }
    }
    console.log(this.xAxisGraduData)

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let commonSql = ``

    let sql = `select * from 
      (select "objectId","name" from "SchoolMajor" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.graduOption}') as "major"
      left join 
        (select "major",count(*) from "SchoolAppEdu" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.graduOption}' group by "major") as "appedu"
          on "major"."objectId" = "appedu"."major" `

    if (this.departmentId) {
      sql = `select * from 
      (select "objectId","name" from "SchoolMajor" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.graduOption}' and "departments" @> '[{ "objectId": "${this.departmentId}" }]') as "major"
      left join 
        (select "major",count(*) from "SchoolAppEdu" where "company" = '1ErpDVc1u6' and "department" = '${this.departmentId}' and to_char("createdAt", 'yyyy') = '${this.graduOption}' group by "major") as "appedu"
          on "major"."objectId" = "appedu"."major" `
    }
    if (this.centerId) {
      sql = `select * from 
      (select "objectId","name" from "SchoolMajor" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.graduOption}' and "departments" @> '[{ "objectId": "${this.centerId}" }]') as "major"
      left join 
        (select "major",count(*) from "SchoolAppEdu" where "company" = '1ErpDVc1u6' and "center" = '${this.centerId}' and to_char("createdAt", 'yyyy') = '${this.graduOption}' group by "major") as "appedu"
          on "major"."objectId" = "appedu"."major" `
    }

    commonSql = sql
    this.http.post(baseurl, { sql: commonSql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        console.log(res)
        let data: any = res["data"]
        this.xAxisGraduData.forEach((d, i) => {
          for (let j = 0; j < data.length; j++) {
            if (d.substring(0, d.indexOf("(")) == data[j].name) {
              this.yGraduData[i] = data[j].count ? data[j].count : 0
            }
          }
          if (this.yGraduData[i] == null) {
            this.yGraduData[i] = 0
          }
        });
        console.log(this.yGraduData)
        this.echartGraduMajorOption = {
          title: {
            text: this.graduOption + "年毕业学生专业人数",
            textStyle: {
              color: "#333",
              fontSize: 24
            },
            top: 20,
            left: 20
          },
          xAxis: {
            type: "category",
            data: this.xAxisGraduData,
            axisLabel: {
              formatter: "{value}"
            }
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#E87C25",
                      "#B5C334",
                      "#FCCE10",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}"
                  }
                }
              },
              barWidth: 60,
              data: this.yGraduData,
              type: "bar",
              showBackground: true,
            }
          ]
        };
      }
    })
  }

  echartGraduBatchOption;
  async queryGraduBatchInfo() {
    this.xAxisGraduData = []
    this.yGraduData = []

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let commonSql = ``
    let sql = `select "batch",count(*) 
      from (select "user","departments" from "SchoolAppEdu" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.graduOption}') as "appedu"
      join (select "objectId","batch" from "Profile" where "isDeleted" is not true) as "pro"
        on "pro"."objectId" = "appedu"."user"
        `

    if (this.departmentId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.departmentId}" }]' `
    } else if (this.centerId) {
      sql += ` and "departments" @> '[{ "objectId": "${this.centerId}" }]' `
    }

    let groupSql = ` group by "batch" `

    commonSql = sql + groupSql
    this.http.post(baseurl, { sql: commonSql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        console.log(res)
        let data = res["data"]
        for (let i = 0; i < data.length; i++) {
          this.xAxisGraduData[i] = data[i].batch
          this.yGraduData[i] = data[i].count ? data[i].count : 0
        }
        this.echartGraduBatchOption = {
          title: {
            text: this.graduOption + "年毕业学生批次人数",
            textStyle: {
              color: "#333",
              fontSize: 24
            },
            top: 20,
            left: 20
          },
          xAxis: {
            type: "category",
            data: this.xAxisGraduData,
            axisLabel: {
              formatter: "{value}"
            }
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#E87C25",
                      "#B5C334",
                      "#FCCE10",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}"
                  }
                }
              },
              barWidth: 60,
              data: this.yGraduData,
              type: "bar",
              showBackground: true,
            }
          ]
        };
      }
    })
  }

  echartGraduServiceOption;
  async queryGraduServiceInfo() {
    this.xAxisGraduData = []
    this.yGraduData = []

    let baseurl = localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : localStorage.getItem("NOVA_SERVERURL") ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select" : "https://server.fmode.cn/api/novaql/select";
    let commonSql = ``
    let sql = `select "name" as "centerName",count(name) from
    (select "objectId","name" from "Department" where "objectId" 
      in (select distinct "center" from "Profile" where "company" = '1ErpDVc1u6' and to_char("createdAt", 'yyyy') = '${this.graduOption}' and "isDeleted" is not true)) as "center"
    left join (select "user","departments","center" from "SchoolAppEdu" where "company" = '1ErpDVc1u6') as "appedu" on "appedu"."center" = "center"."objectId"
    join (select "objectId" from "Profile" where "isDeleted" is not true) as "pro" on "appedu"."user" = "pro"."objectId"
    `
    if (this.departmentId) {
      sql = `select "name" as "centerName",count(name) from
    (select "objectId","name" from "Department" where "objectId" 
      in (select distinct "center" from "Profile" where "company" = '1ErpDVc1u6' and "department" = '${this.departmentId}' and to_char("createdAt", 'yyyy') = '${this.graduOption}' and "isDeleted" is not true)) as "center"
    left join (select "user","departments","center" from "SchoolAppEdu" where "company" = '1ErpDVc1u6') as "appedu" on "appedu"."center" = "center"."objectId"
    join (select "objectId" from "Profile" where "isDeleted" is not true) as "pro" on "appedu"."user" = "pro"."objectId"
    where "departments" @> '[{ "objectId": "${this.departmentId}" }]' `
    }

    let groupSql = ` group by "name" `

    commonSql = sql + groupSql
    this.http.post(baseurl, { sql: commonSql }).subscribe(res => {
      if (res["code"] == 200 && res["data"]) {
        console.log(res)
        let data = res["data"]
        for (let i = 0; i < data.length; i++) {
          this.xAxisGraduData[i] = data[i].centerName
          this.yGraduData[i] = data[i].count ? data[i].count : 0
        }
        this.echartGraduServiceOption = {
          title: {
            text: this.graduOption + "年毕业学生服务点人数",
            textStyle: {
              color: "#333",
              fontSize: 24
            },
            top: 20,
            left: 20
          },
          xAxis: {
            type: "category",
            data: this.xAxisGraduData,
            axisLabel: {
              formatter: "{value}"
            }
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: function (params) {
                    // build a color map as your need.
                    var colorList = [
                      "#C1232B",
                      "#E87C25",
                      "#B5C334",
                      "#FCCE10",
                      "#27727B",
                      "#FE8463",
                      "#9BCA63",
                      "#FAD860",
                      "#F3A43B",
                      "#60C0DD",
                      "#D7504B",
                      "#C6E579",
                      "#F4E001",
                      "#F0805A",
                      "#26C0C0"
                    ];
                    return colorList[params.dataIndex];
                  },
                  label: {
                    show: true,
                    position: "top",
                    formatter: "{c}"
                  }
                }
              },
              barWidth: 60,
              data: this.yGraduData,
              type: "bar",
              showBackground: true,
            }
          ]
        };
      }
    })
  }

}

