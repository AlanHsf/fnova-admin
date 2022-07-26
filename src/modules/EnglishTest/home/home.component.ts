import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd/message";
import { EChartOption } from "echarts";
import * as Parse from "parse";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  company: any;
  pCompany: any;
  examinee: any; //考生人数
  enroll: number; //报名考生
  enrollList: any = []; //今日报名考生
  title: any;
  departmentId: any = localStorage.getItem("department");
  examList: any = []; //今日考试
  passCount: any = []; // 通过考试
  site: any;
  echartSource: any = {
    passGroup: [],
    proGroup: [],
    logGroup: []
  };
  system;
  constructor(
    private activRoute: ActivatedRoute,
    private route: Router,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
  ) { }
  cateId;
  recruitId;
  recruitStudentName;
  echartOption: any; // 指定图表的配置项和数据
  complete: number = 0;
  beginTime;
  endTime;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      localStorage.setItem("hiddenMenu", "false");
      this.company = localStorage.getItem("company");

      if (this.departmentId) {
        let queryComp = new Parse.Query("Company");
        let compInfo = await queryComp.get(this.company);
        this.pCompany = compInfo.get("company").id;
      }

      let user = Parse.User.current();
      if (user && user.get("cates")) {
        // this.cate = user.get("cates")[0]
        this.cateId = user.get("cates")[0].id
      }

      let departmentId = localStorage.getItem("department");
      if (!departmentId) {
        this.system = true
        await this.getExaminee(); //报考人数
        await this.getComplete(); // 考试人数
        await this.getPass(); // 通过人数
        await this.getEchartSource()// 获取echarts数据源
      } else {
        // 院校数据区分专项计划
        let Recruit = new Parse.Query("RecruitStudent");
        Recruit.equalTo("department", departmentId);
        Recruit.equalTo("isOpen", true);
        let recruitInfo = await Recruit.first();
        if (recruitInfo && recruitInfo.id) {
          this.recruitId = recruitInfo.id
          this.recruitStudentName = recruitInfo.get("title")
          let recruitInfoToJson = recruitInfo.toJSON()
          this.beginTime = recruitInfoToJson.beginTime.iso
          this.endTime = recruitInfoToJson.endTime.iso
          console.log(this.beginTime, this.endTime)
        }
        await this.getRecruitUnpaid(); // 未缴费人数
        await this.getRecruitPaid(); // 已缴费人数
        await this.getRecruitExaminee(); // 报考人数
        await this.getEchartSource()// 获取echarts数据源
        // await this.getRecruitEchartSource()// 获取echarts数据源
      }

      this.getTitle();
      this.getEnroll(); // 今日报名
      this.getEaxm(); // 今日考试
      this.getSite();
    });
  }
  initEchart() {
    let posList = [
      "left",
      "right",
      "top",
      "bottom",
      "inside",
      "insideTop",
      "insideLeft",
      "insideRight",
      "insideBottom",
      "insideTopLeft",
      "insideTopRight",
      "insideBottomLeft",
      "insideBottomRight",
    ];
    let configParameters = {
      rotate: {
        min: -90,
        max: 90,
      },
      align: {
        options: {
          left: "left",
          center: "center",
          right: "right",
        },
      },
      verticalAlign: {
        options: {
          top: "top",
          middle: "middle",
          bottom: "bottom",
        },
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {}),
      },
      distance: {
        min: 0,
        max: 100,
      },
    };

    let config = {
      rotate: 0,
      align: "left",
      verticalAlign: "middle",
      position: "insideBottom",
      distance: 15,
      onChange: function () {
        var labelOption = {
          normal: {
            rotate: config.rotate,
            align: config.align,
            verticalAlign: config.verticalAlign,
            position: config.position,
            distance: config.distance,
          },
        };
        // myChart.setOption({
        //     series: [{
        //         label: labelOption
        //     }, {
        //         label: labelOption
        //     }, {
        //         label: labelOption
        //     }, {
        //         label: labelOption
        //     }]
        // });
      },
    };

    let labelOption = {
      show: true,
      position: config.position,
      distance: config.distance,
      align: config.align,
      verticalAlign: config.verticalAlign,
      rotate: config.rotate,
      formatter: "{c}  {name|{a}}",
      fontSize: 16,
      rich: {
        name: {},
      },
    };
    let xArr = this.echartSource.passGroup.map((item, index) => {
      let num = item.quarter > 2 ? "下半年" : "上半年";
      return item.year + num;
    });
    console.log(xArr);
    this.echartOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["报考人数", "考试人数", "通过人数"],
      },
      toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: "category",
          axisTick: { show: false },
          data: xArr,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "报考人数",
          type: "bar",
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [],
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                  "#627ef4",
                ];

                return colorList[params.dataIndex];
              },
            },
          },
        },
        {
          name: "考试人数",
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [],
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  "#9eea6a",
                  "#9eea6",
                  "#9eea64",
                  "#9eea64",
                  "#9eea6",
                  "#9eea6",
                  "#9eea6",
                  "#9eea6",
                  "#9eea64",
                  "#9eea6",
                ];

                return colorList[params.dataIndex];
              },
            },
          },
        },
        {
          name: "通过人数",
          type: "bar",
          label: labelOption,
          emphasis: {
            focus: "series",
          },
          data: [],
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                  "#fb5430",
                ];
                return colorList[params.dataIndex];
              },
            },
          },
        },
      ],
    };
    this.echartSource.proGroup.forEach(item => {
      this.echartOption.series[0].data.push(item.count)
    })
    this.echartSource.logGroup.forEach(item => {
      this.echartOption.series[1].data.push(item.count)
    })
    this.echartSource.passGroup.forEach(item => {
      this.echartOption.series[2].data.push(item.passCount)
    })
  }
  async getPass() {
    let sql = `select
    count(case when "log"."shortAnswer" is not null
    THEN
    case when "log"."textScore" >= "rule"."textScore" then true else false end
    else true
    END) as "passCount"--答卷合格数量
    from "SurveyLog"  as "log"
    left join "Exam" as "exam" on "exam"."objectId"="log"."exam"
    left join "Survey" as "survey" on "survey"."objectId"="log"."survey"
    left join "ExamPassRule" as "rule" on "rule"."exam"="exam"."objectId"
    where "log"."company"='5beidD3ifA'  and "rule"."langCode"="survey"."scate"
    and  "log"."grade" >= "rule"."totalScore"
    and "rule"."objectId" is not null`;
    if (this.departmentId) {
      sql += ` and "log"."department"='${this.departmentId}'`;
    }
    let completSql = sql;
    let data = await this.novaSql(completSql);
    console.log(data);
    this.passCount = data[0]?.passCount;
  }
  async getSite() {
    let querySite = new Parse.Query("Site");
    if (this.departmentId) {
      querySite.equalTo("company", this.company);
    } else {
      querySite.equalTo("company", this.pCompany);
    }
    let site = await querySite.first();
    if (site && site.id) {
      this.site = site;
    }
  }

  async getEchartSource() {
    this.echartSource['logGroup'] = await this.getLogGroup()
    this.echartSource['proGroup'] = await this.getProGroup()
    this.echartSource['passGroup'] = await this.getPassGroup()
    console.log(this.echartSource);
    this.initEchart();
  }
  async getLogGroup() {
    let sql = `select to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt"),count(*)  from
    (select "createdAt" from "SurveyLog"  order by "createdAt" asc) log    group by to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt")   `;
    if (this.departmentId) {
      sql = `select to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt"),count(*)  from
      (select "createdAt" from "SurveyLog" where "department"='${this.departmentId}'  order by "createdAt" asc) log    group by to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt")   `
    }
    let data = await this.novaSql(sql)
    return data;
  }
  async getProGroup() {
    let sql = `select to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt"),count(*) from "Profile" where "isDeleted" is not true  group by to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt")`;
    if (this.departmentId) {
      sql = `select to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt"),count(*) from "Profile" where "department"='${this.departmentId}' and "isDeleted" is not true  group by to_char("createdAt" , 'YYYY'),extract(quarter from "createdAt") `
    }
    let data = await this.novaSql(sql);
    return data;

  }
  async getPassGroup() {
    // over(order by extract(quarter from "log"."createdAt")  asc)    //  over(order by max("log"."createdAt")  asc)
    let sql = `select
    count(case when "log"."shortAnswer" is not null
    THEN
    case when "log"."textScore" >= "rule"."textScore" then true else false end
    else true
    END) as "passCount",--答卷合格数量
     max(to_char("log"."createdAt" , 'YYYY')) as "year" ,max(extract(quarter from "log"."createdAt")) as quarter,row_number() over(order by max("log"."createdAt")  asc) as index
    from "SurveyLog"  as "log"
    left join "Exam" as "exam" on "exam"."objectId"="log"."exam"
    left join "Survey" as "survey" on "survey"."objectId"="log"."survey"
    left join "ExamPassRule" as "rule" on "rule"."exam"="exam"."objectId"
    where "log"."company"='5beidD3ifA'  and "rule"."langCode"="survey"."scate"
    and  "log"."grade" >= "rule"."totalScore"
    and "rule"."objectId" is not null`;
    let groupSql = ` group by(extract(quarter from "log"."createdAt"))`;
    if (this.departmentId) {
      sql += ` and "log"."department"='${this.departmentId}'`;
    }
    let completSql = sql + groupSql;
    let data = await this.novaSql(completSql);
    console.log(data);
    return data;
  }
  novaSql(sql): Promise<any> {
    return new Promise((resolve, reject) => {
      let baseurl = localStorage.getItem("NOVA_SERVERURL")
        ? localStorage.getItem("NOVA_SERVERURL") + "api/novaql/select"
        : "https://server.fmode.cn/api/novaql/select";
      this.http.post(baseurl, { sql: sql }).subscribe(async (res: any) => {
        console.log(res);
        if (res.code == 200) {
          resolve(res.data);
        } else {
          this.message.info("网络繁忙，数据获取失败");
          reject(res);
        }
      });
    });
  }
  //   查找考生人数
  async getExaminee() {
    let departmentId = localStorage.getItem("department");
    let queryE = new Parse.Query("Profile");
    queryE.notEqualTo("isDeleted", true);
    queryE.equalTo("company", this.pCompany || this.company);
    queryE.notEqualTo("identyType", "teacher");
    console.log(departmentId)
    if (departmentId) {
      queryE.equalTo("department", departmentId);
      queryE.include("department");
    }
    let res = await queryE.count();
    this.examinee = res;
  }

  recruitPaid: number;
  // 院校区分专项计划已缴费人数
  async getRecruitPaid() {
    let completSql = '';

    let unionSelectSql = `select count(1) `

    let unionFromSql = ` from  
    (select "objectId", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
    inner join
    (select "objectId", "name" from "Profile" where "isDeleted" is not true and "department" = '${this.departmentId}') as "pro"
      on (substring("log"."orderId",2,10) = "pro"."objectId")
    `

    // "cates" @> '[{ "objectId": "${this.cateId}"}]' and
    console.log(this.cateId)
    if (this.cateId) {
      unionFromSql = ` from  
        (select "objectId", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
        inner join
        (select "objectId", "name" from "Profile" where "cates" @> '[{ "objectId": "${this.cateId}"}]' and "isDeleted" is not true and "department" = '${this.departmentId}') as "pro"
          on (substring("log"."orderId",2,10) = "pro"."objectId")
        `
    }

    completSql = unionSelectSql + unionFromSql 

    console.log(completSql)

    let data = await this.novaSql(completSql);
    console.log(data);
    this.recruitPaid = data[0].count;
  }

  recruitUnpaid: number;
  // 院校区分专项计划未缴费人数
  async getRecruitUnpaid() {
    let selectSql = `select count(1) `

    let fromSql = ` from 
    (select "objectId", "createdAt" from "Profile" where "isDeleted" is not true and "department" = '${this.departmentId}' and "createdAt" >= '${this.beginTime}' and "createdAt" <= '${this.endTime}') as "pro"
    left join
    (select "objectId", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
      on substring("log"."orderId",2,10) = "pro"."objectId"
      where "log"."objectId" is null `

    if (this.cateId) {
      fromSql = ` from 
      (select "objectId", "createdAt" from "Profile" where "cates" @> '[{ "objectId": "${this.cateId}"}]' and "isDeleted" is not true and "department" = '${this.departmentId}' and "createdAt" >= '${this.beginTime}' and "createdAt" <= '${this.endTime}') as "pro"
      left join
      (select "objectId", "orderId" from "AccountLog" where "isVerified"=true and "isback" is not true and SUBSTRING("desc",1,10) ='${this.recruitId}') as "log"
        on substring("log"."orderId",2,10) = "pro"."objectId"
        where "log"."objectId" is null `
    }

    let completSql = selectSql + fromSql

    let data = await this.novaSql(completSql);
    console.log(data);
    this.recruitUnpaid = data[0].count;
  }

  recruitExaminee;
  // 院校区分专项计划考生人数
  async getRecruitExaminee() {

    // 已缴费人数 + 
    console.log(this.recruitPaid)

    // 未缴费人数
    console.log(this.recruitUnpaid)

    this.recruitExaminee = Number(this.recruitPaid) + Number(this.recruitUnpaid);
  }


  // 查找今日考试
  getEaxm() {
    let examList = [];
    let time = new Date().getTime();
    let queryExam = new Parse.Query("Exam");
    queryExam.equalTo("company", this.pCompany || this.company);
    if (this.departmentId) {
      queryExam.equalTo("department", this.departmentId);
    }
    queryExam.include("department");
    queryExam.find().then((res) => {
      if (res.length > 0) {
        res.forEach((item) => {
          let exam = item.toJSON();
          let date = new Date(exam.beginTime.iso).getTime();
          let date2 = new Date(exam.endTime.iso).getTime();
          if (time >= date && time <= date2) {
            examList.push(exam);
          }
        });
        this.examList = examList;
      }
    });
  }

  async getTitle() {
    let did = localStorage.getItem("department");
    if (did) {
      let Department = new Parse.Query("Department");
      let department = await Department.get(did);
      if (department && department.id) {
        this.title = department.get("name");
      }
    }
  }

  // 完成考试
  async getComplete() {
    let queryC = new Parse.Query("SurveyLog");
    queryC.equalTo("company", this.pCompany || this.company);
    if (this.departmentId) {
      queryC.equalTo("department", this.departmentId);
    }
    queryC.include("exam");
    let res = await queryC.count();
    this.enroll = res;
  }

  login() {
    this.route.navigate(["english/login", { did: this.departmentId }]);
  }

  // 今日报名考生
  getEnroll() {
    let list = [];
    let query = new Parse.Query("Profile");
    query.notEqualTo("isDeleted", true);
    query.equalTo("company", this.pCompany || this.company);
    if (this.departmentId) {
      query.equalTo("department", this.departmentId);
    }
    query.include("SchoolMajor");
    query.include("department");
    query.find().then((res) => {
      res.forEach((item) => {
        let tmp = item.toJSON();
        let createdTime = this.formateDate(tmp.createdAt);
        let time = this.formateDate(new Date());
        if (createdTime == time) {
          list.push(tmp);
        }
      });
      this.enrollList = list;
    });
  }

  //时间格式转换
  formateDate(datetime) {
    function addDateZero(num) {
      return num < 10 ? "0" + num : num;
    }
    let d = new Date(datetime);
    let formatdatetime =
      d.getFullYear() +
      "-" +
      addDateZero(d.getMonth() + 1) +
      "-" +
      addDateZero(d.getDate());
    return formatdatetime;
  }
}
