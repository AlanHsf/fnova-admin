import { Component, OnInit } from "@angular/core";
import { EChartOption } from "echarts";
import * as Parse from "parse";
import { HttpClient } from '@angular/common/http';
import { DepartmentSchemas } from "src/providers/schema/structure";

@Component({
  selector: "app-home-dashboard",
  templateUrl: "./home-dashboard.component.html",
  styleUrls: ["./home-dashboard.component.scss"]
})
export class HomeDashboardComponent implements OnInit {
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
  options: any = [2018, 2019, 2020, 2021];
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
  departmentId: any;
  dataShadow: any = [];
  signOption: EChartOption = {};
  echartOption: any = {};
  hotMajorOption: any = {};
  hotSchoolOption: any = {};
  xAxisData: any = [
    "-01",
    "-02",
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
  schoolList: any = [];
  studentCenterList: any = [];
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
              this.schoolList.sort((a,b)=> { // 排序
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
              this.studentCenterList.sort((a,b)=> {
                return b.studentCount - a.studentCount;
              })
            }
          }
        })
      }
  }
  async ngOnInit() {
    this.company = localStorage.getItem("company");
    if (this.company) {
      this.getSchoolRank()
    }
    if (localStorage.getItem("department")) {
      this.departmentId = localStorage.getItem("department");
    }
    let date = new Date()
    this.option = date.getFullYear()
    this.xAxisData.forEach((data,index) => {
      data = this.option + data
      this.xAxisData[index] = data
    });
    this.queryMonthStudy()
    this.getHotSchool()
    this.getHotMajor()
    
    if (this.departmentId) {
      let Department = new Parse.Query("Department");
      Department.include("category");
      let department = await Department.get(this.departmentId);
      this.company = department.get('company')
      if (department.get("category").get("name") == "学校") {
        this.cate = department.get("category").get("name");
        this.getSchoolLessonCount(department.id);
        this.getSchoolTeacherCount(department.id);
        this.getSchooltrainCount(department.id);
        this.getSchoolMajorCount(department.id);
      } else {
        this.getLessonCount();
        this.getOnLineLesson();
        this.getOffLineLesson();
        this.getProfileCount();
        this.getSchoolCount();
        this.getAgentCount();
        this.getUserCount();
        this.getTeacherCount();
      }
    } else {
      this.getLessonCount();
      this.getOnLineLesson();
      this.getOffLineLesson();
      this.getProfileCount();
      this.getSchoolCount();
      this.getAgentCount();
      this.getUserCount();
      this.getTeacherCount();
    }
  }



  async getHotSchool() {
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select 
      max("profile"."department") as "id",
      max("depart"."name") as "name",
      count(1)
    from "Profile" as "profile"
    left join "Department" as "depart" on "depart"."objectId" = "profile"."department"
    where "profile"."company" = 'pPZbxElQQo' and "profile"."department" is not null
    group by "profile"."department"
    order by "count" desc`
    await this.http.post(baseurl, {sql: sql}).subscribe(res => {
      if(res["code"] == 200 && res["data"] ) {
        let data = res["data"]
        let datax = []
        let datay = []
        data.forEach((item,index) => {
          if(index < 5) {
            datax.push(item.name)
            let  yobj = {value: item.count, name:item.name}
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
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select"
    let sql = `select 
    max("profile"."SchoolMajor") as "majorId"	,
    max("major"."name") as "major",
    count(1)
  from "Profile" as "profile"
  left join "SchoolMajor" as "major" on "major"."objectId" = "profile"."SchoolMajor"
  where "profile"."company" = 'pPZbxElQQo' and "profile"."SchoolMajor" is not null
  group by "profile"."SchoolMajor"
  order by "count" desc`

  await this.http.post(baseurl, {sql: sql}).subscribe(res => {
    if(res["code"] == 200 && res["data"] ) {
      let data = res["data"]
      let datax = []
      let datay = []
      data.forEach((item,index) => {
        if(index < 5) {
          datax.push(item.major)
          let  yobj = {value: item.count, name:item.major}
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

  getSchoolLessonCount(id) {
    let queryLesson: any = new Parse.Query("Lesson");
    queryLesson.equalTo("school", id);
    queryLesson.withCount();
    queryLesson.find().then((res: any) => {
      this.offLineLesson = res.count;
    });
  }

  getSchoolTeacherCount(id) {
    let queryTeacher: any = new Parse.Query("LessonTeacher");
    queryTeacher.equalTo("school", id);
    queryTeacher.withCount();
    queryTeacher.find().then((res: any) => {
      this.onLineLessson = res.count;
    });
  }

  getSchooltrainCount(id) {
    let queryLesson: any = new Parse.Query("Profile");
    queryLesson.equalTo("department", id);
    queryLesson.withCount();
    queryLesson.find().then((res: any) => {
      this.trainCount = res.count;
    });
  }

  getSchoolMajorCount(id) {
    let queryMajor: any = new Parse.Query("SchoolMajor");
    queryMajor.equalTo("school", id);
    queryMajor.withCount();
    queryMajor.find().then((res: any) => {
      this.lessonCount = res.count;
    });
  }

  async getLessonCount() {
    let Lesson = new Parse.Query("Lesson");
    Lesson.equalTo("company", this.company);
    this.lessonCount = await Lesson.count();
  }
  async getOnLineLesson() {
    let Lesson = new Parse.Query("Lesson");
    Lesson.equalTo("company", this.company);
    Lesson.notEqualTo("types", "second");
    this.onLineLessson = await Lesson.count();
  }
  async getOffLineLesson() {
    let Lesson = new Parse.Query("Lesson");
    Lesson.equalTo("company", this.company);
    Lesson.equalTo("types", "second");
    this.offLineLesson = await Lesson.count();
  }
  async getProfileCount() {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("company", this.company);
    this.trainCount = await Profile.count();
  }
  async getSchoolCount() {
    let Department = new Parse.Query("Department");
    Department.equalTo("company", this.company);
    Department.equalTo("category", "erVPCmBAgt");
    this.schoolCount = await Department.count();
  }
  async getAgentCount() {
    let Department = new Parse.Query("Department");
    Department.equalTo("company", this.company);
    Department.equalTo("category", "CDjfyCjXKR");
    this.agentsCount = await Department.count();
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
    let topLeft = echarts.init(
      <HTMLDivElement>document.getElementById("echart")
    );
    let date = new Date();
    let option = date.getFullYear()
    if(this.option == option) {
      this.queryMonthStudy()
    }
    let data = [];
    this.xAxisData.forEach((d, i) => {
      d = this.option + d;
      data[i] = Math.floor(Math.random() * 1000 + 1000);
    });
    this.newOption = this.echartOption;

    let echartOptionData = [];
    this.xAxisData.forEach(data => {
      // echartOptionData.push(this.option + data);
      data = this.option + data
    });
    this.newOption.title.text = this.option + "年各月份平台学习人数";
    this.newOption.series[0].data = data;
    this.newOption.xAxis.data = echartOptionData;
    topLeft.setOption(this.newOption);
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
  yData:any = []
  queryMonthStudy(){
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select 
    date_part('year', "groupTime"."month") as "year",
    date_part('month', "groupTime"."month") as "month",
    max("groupTime"."month") as "spTime",
    count(1)
   from 
   (select max("timeTable"."time") as "month",
     max("timeTable"."user") as "user"
   from (select date_trunc('month', "LR"."updatedAt" )  as "time",
       "LR"."user" as "user"
    from "LessonRecord" as "LR"
    where "LR"."company" = 'pPZbxElQQo') as "timeTable"
    group by "timeTable"."user") as "groupTime"
    where date_part('year', "groupTime"."month") = '${this.option}'
    group by "groupTime"."month"
    order by "groupTime"."month"`
    this.http.post(baseurl, {sql: sql}).subscribe(res => {
      if(res["code"] == 200 && res["data"] ) {
        let data = res["data"]
        this.xAxisData.forEach((d, i) => {
          this.yData[i] = data[i] ? data[i].count : 0
        });
        this.echartOption = {
          title: {
            text: this.option + "年各月份平台学习人数",
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
                  color: function (params) {
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
              backgroundStyle: {
                color: "#4EBAFF"
              }
            }
          ]
        };
      }
    })
  }

}
