import { Component, OnInit, ChangeDetectorRef, DoCheck } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EChartOption } from "echarts";
// import { echarts } from "echarts";
import { query } from "@angular/animations";
import * as Parse from "parse";
import { HttpClient, HttpHeaders } from "@angular/common/http";

// import "../../../assets/js/bi-bg.js";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http:HttpClient
  ) { }
  dateArr: any;
  options: any;
  option: any;
  chart_1: any;
  signOption: EChartOption = {};
  dataAxis: any = [
    // "工商管理",
    // "工商企业管理",
    // "法学",
    // "教育学",
    // "护理",
    // "行政管理",
    // "行政管理",
    // "计算机科学与技术",
    // "会计学",
    // "中药学",
    // "艺术驾驭",
    // "工程造价",
    // "市场营销",
    // "软件工程"
  ];
  data: any = [
    489,
    478,
    467,
    459,
    420,
    412,
    389,
    375,
    349,
    321,
    310,
    299,
    278,
    269,
    256
  ];
  yMax: number = 500;
  dataShadow: any = [];
  // specialistOption: EChartOption = {};
  onLineOption: EChartOption = {};
  studyOption: EChartOption = {};
  percentOption: any = {};
  specialistOption: any = {};
  schoolMajorOption: any = {}; // 专业报考人数
  majorStudyOption: any = {}; // 专业学习人数
  studyTimeOption: any = {}; // 专业学习时间
  majorPercentOption: any = {}; // 专业合格率时间

  isSchool: boolean = false;
  isRoot: boolean = false;
  students: any = [] // 学校人数
  async getNumSchool() {
    this.students = []
    this.options = []
    let company = localStorage.getItem("company")
    let sql = `select
    "school"."name" as "name",
    (case when "pCount"."count" is not null then "pCount"."count" else 0 end  ) as "value"
  from
    (select
      "department"."objectId" as "did",
      "department"."name" as "name"
    from "Department" as "department"
    left join "Category" as "cate" on "cate"."objectId" = "department"."category"
    where "department"."company" = '${company}' and "cate"."name" = '学校') as "school"
  left join (select
    count(1) as "count",
    max("profile"."department") as "schoolId"
    from "Profile" as "profile" where "profile"."company" = '${company}'
  group by "profile"."department") as "pCount" on "pCount"."schoolId" = "school"."did"
  order by "value" desc`
  let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
  this.http.post(baseurl, { sql: sql }).subscribe(res => {
    let data = res['data'];
    this.students = data
    this.signOption = {
      title: {
        text: "院校报名人数（前五）",
        left: "center",
        textStyle: {
          color: "#fff"
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        left: "center",
        top: "bottom",
        data: this.options,
        textStyle: {
          color: "#fff"
        }
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: {
            show: true,
            type: ["pie", "funnel"]
          },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: "面积模式",
          type: "pie",
          radius: [30, 110],
          center: ["50%", "48%"],
          roseType: "area",
          data: this.students
        }
      ]
    };
    console.log(res)
    return data
  })
  }
  async getNumMajor() {
    this.data = [];
    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select sum("count") as "count",max("Count"."major") as "major" from
    (select count(*),max("SchoolMajor"."name") as "major" from "Profile"
    left join "SchoolMajor" on "Profile"."SchoolMajor" = "SchoolMajor"."objectId"
    where "Profile"."company"='pPZbxElQQo' and "Profile"."SchoolMajor"  is  not null group by "Profile"."SchoolMajor" order by count(*) desc)
     as "Count"
     group by "Count"."major" order by sum("count") desc`;
    this.http.post(baseurl, { sql: sql }).subscribe(res => {
      let data = res['data'];
      data.forEach(ree => {
        this.data.push(Number(ree.count))
        this.dataAxis.push(ree.major)
      });
      console.log(data,this.data,this.dataAxis);
      this.specialistOption = {
        title: {
          text: "专业报名人数",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: {
          data: this.dataAxis,
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          }
        },
        dataZoom: [
          {
            startValue: "工商管理",
            endValue: "行政管理",
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              color: "rgba(0,0,0,0.05)"
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: this.dataShadow,
            animation: false
          },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            data: this.data
          }
        ]
      };
    })
  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      this.showDate();
      this.options = [
        "南昌大学",
        "江西师范大学",
        "江西财经大学",
        "江西农业大学",
        "江西中医药大学",
        "江西科技师范大学",
        "南昌航空大学",
        "江西理工大学",
        "江西警察学院",
        "东华理工大学",
        "东华交通大学"
      ];

      let option = this.options.find(
        option => option == localStorage.getItem("title")
      );
      console.log(option);
      if (option) {
        this.option = localStorage.getItem("title");
        this.isSchool = true;
      }
      if (params.get('page')) {
        this.isRoot = true
      }
      console.log(this.students, this.options);
      await this.getNumSchool()
      await this.getNumMajor()

      this.onLineOption = {
        title: {
          text: "学情雷达图",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {},
        legend: {
          left: "center",
          top: "bottom",
          data: ["每天学习时长（近七天）"],
          textStyle: {
            color: "#fff"
          }
        },
        radar: {
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#999",
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: "第一天", max: 6500 },
            { name: "第二天", max: 16000 },
            { name: "第三天", max: 30000 },
            { name: "第四天", max: 38000 },
            { name: "第五天", max: 52000 },
            { name: "第六天", max: 25000 },
            { name: "第七天", max: 25000 }
          ]
        },
        series: [
          {
            name: "学习时长",
            type: "radar",
            // areaStyle: {normal: {}},
            data: [
              {
                value: [4300, 10000, 28000, 35000, 50000, 19000],
                name: "每天学习时长（近七天）"
              }
            ]
          }
        ]
      };
      let colors = ["#5793f3", "#d14a61", "#675bba"];
      this.studyOption = {
        title: {
          text: "近十天学习人数",
          left: 10,
          top: 10,
          textStyle: {
            color: "#fff",
            fontSize: 18
          }
        },
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: {
          right: "20%"
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ["男生人数", "女生人数", "平均人数"],
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true
            },
            data: [
              "第一天",
              "第二天",
              "第三天",
              "第四天",
              "第五天",
              "第六天",
              "第七天",
              "第八天",
              "第九天",
              "第十天"
            ],
            axisLabel: {
              interval: 0,
              // rotate: 30,
              color: "#fff"
            },
            nameTextStyle: {
              color: "#fff",
              fontSize: 18
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "男生人数",
            min: 0,
            max: 2500,
            position: "right",
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: "{value} 人"
            }
          },
          {
            type: "value",
            name: "女生人数",
            min: 0,
            max: 2500,
            position: "right",
            offset: 80,
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: "{value} 人"
            }
          },
          {
            type: "value",
            name: "平均人数",
            min: 0,
            max: 2500,
            position: "left",
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: "{value} 人"
            }
          }
        ],
        series: [
          {
            name: "男生人数",
            type: "bar",
            data: [2000, 1900, 1800, 2342, 2459, 1767, 1856, 1622, 2326, 2090]
          },
          {
            name: "女生人数",
            type: "bar",
            yAxisIndex: 1,
            data: [2100, 2300, 2489, 2442, 1959, 1967, 1956, 2322, 2245, 2090]
          },
          {
            name: "平均人数",
            type: "line",
            yAxisIndex: 2,
            data: [2050, 2100, 1800, 2442, 2259, 1767, 1956, 1622, 2426, 2190]
          }
        ]
      };
      let data = [82, 78, 77, 69, 68, 66, 63, 59, 57, 56, 54, 52, 48, 47, 42];
      this.percentOption = {
        title: {
          text: "专业合格率",
          left: 10,
          top: 10,
          textStyle: {
            color: "#fff",
            fontSize: 18
          }
        },
        xAxis: {
          data: this.dataAxis,
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#999"
          }
        },
        dataZoom: [
          {
            startValue: "工商管理",
            endValue: "行政管理",
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              color: "rgba(0,0,0,0.05)"
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: this.dataShadow,
            animation: false
          },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#33ccff" },
                { offset: 0.5, color: "#3399ff" },
                { offset: 1, color: "#3366ff" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#6699cc" },
                  { offset: 0.7, color: "#6666cc" },
                  { offset: 1, color: "#6633cc" }
                ])
              }
            },
            data: data
          }
        ]
      };

      let labelOption = {
        show: true,
        position: "insideBottom",
        distance: 15,
        align: "left",
        verticalAlign: "middle",
        rotate: 90,
        formatter: "{c}  {name|{a}}",
        fontSize: 16,
        rich: {
          name: {
            textBorderColor: "#fff"
          }
        }
      };
      this.schoolMajorOption = {
        color: ["#003366", "#006699", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        title: {
          text: "热门专业报名人数（近三年比较）",
          left: "center",
          top: 6,
          textStyle: {
            color: "#fff",
            fontSize: 18
          }
        },
        legend: {
          top: "bottom",
          left: "center",
          data: ["土木工程", "工商企业管理", "工商管理", "法律事务"],
          textStyle: {
            color: "#fff"
          }
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
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: ["2018", "2019", "2020"],
            axisLabel: {
              interval: 0,
              // rotate: 30,
              color: "#fff"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "土木工程",
            type: "bar",
            barGap: 0,
            label: labelOption,
            data: [150, 232, 201]
          },
          {
            name: "工商企业管理",
            type: "bar",
            label: labelOption,
            data: [220, 182, 191]
          },
          {
            name: "工商管理",
            type: "bar",
            label: labelOption,
            data: [320, 332, 301]
          },
          {
            name: "法律事务",
            type: "bar",
            label: labelOption,
            data: [311, 232, 201]
          }
        ]
      };
      this.majorStudyOption = {
        title: {
          text: "专业学习人数",
          left: "center",
          top: 6,
          textStyle: {
            color: "#fff",
            fontSize: 18
          }
        },
        xAxis: {
          type: "category",
          data: [
            "工商管理",
            "工商企业管理",
            "法学",
            "法律事务",
            "汉语言文学",
            "土木工程",
            "护理学"
          ],
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          }
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(220, 220, 220, 0.8)"
            }
          }
        ]
      };
      this.studyTimeOption = {
        title: {
          text: "各专业学习时长（分钟）",
          left: "center",
          top: "6",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          // orient: "vertical",
          left: "center",
          top: "bottom",
          data: [
            "工商管理",
            "工商企业管理",
            "法学",
            "法律事务",
            "汉语言文学",
            "土木工程",
            "护理学"
          ],
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            name: "学习时长",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "工商管理" },
              { value: 310, name: "工商企业管理" },
              { value: 234, name: "法学" },
              { value: 135, name: "法律事务" },
              { value: 1548, name: "汉语言文学" },
              { value: 234, name: "土木工程" },
              { value: 135, name: "护理学" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.majorPercentOption = {
        title: {
          text: "专业合格率",
          left: 10,
          top: 10,
          textStyle: {
            color: "#fff",
            fontSize: 18
          }
        },
        xAxis: {
          data: [
            "工商管理",
            "工商企业管理",
            "法学",
            "法律事务",
            "汉语言文学",
            "土木工程",
            "护理学"
          ],
          type: "category",
          axisLabel: {
            interval: 0,
            rotate: 30,
            color: "#fff"
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: "#999"
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            // For shadow
            type: "bar",
            itemStyle: {
              color: "rgba(0,0,0,0.05)"
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            data: this.dataShadow,
            animation: false
          },
          {
            type: "bar",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#33ccff" },
                { offset: 0.5, color: "#3399ff" },
                { offset: 1, color: "#3366ff" }
              ])
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#6699cc" },
                  { offset: 0.7, color: "#6666cc" },
                  { offset: 1, color: "#6633cc" }
                ])
              }
            },
            data: [68, 78, 72, 65, 57, 69, 75, 62]
          }
        ]
      };
    });


  }
  // onChartInit(params) {
  //   // let myChart = document.getElementById("main");
  //   var myChart = echarts.init(document.getElementById("echart_1"));
  //   console.log(
  //     myChart,
  //     params
  //   );

  // myChart.dispatchAction({
  //   type: "dataZoom",
  //   startValue: this.dataAxis[
  //     Math.max(params.dataIndex - this.zoomSize / 2, 0)
  //   ],
  //   endValue: this.dataAxis[
  //     Math.min(params.dataIndex + this.zoomSize / 2, this.data.length - 1)
  //   ]
  // });
  // }
  onChartInit(chart) {
    this.chart_1 = chart;
  }
  clickChart(params) {
    let zoomSize = 4;
    this.chart_1.dispatchAction({
      type: "dataZoom",
      startValue: this.dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
      endValue: this.dataAxis[
        Math.min(params.dataIndex + zoomSize / 2, this.data.length - 1)
      ]
    });
    // this.specialistOption.dataZoom["startValue"] = this.dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],

    // this.specialistOption.dataZoom["startValue"] = this.dataAxis[Math.min(params.dataIndex + zoomSize / 2, this.data.length - 1)]
    this.chart_1.setOption(this.specialistOption, true);
    console.log(this.dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
    console.log(
      this.dataAxis[
      Math.min(params.dataIndex + zoomSize / 2, this.data.length - 1)
      ]
    );
  }
  showDate() {
    setInterval(() => {
      let date = new Date();
      let year: any, month: any, day: any, h: any, m: any, s: any, week: any;
      year = date.getFullYear();
      month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth();
      day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      let w = date.getDay();
      if (w == 0) {
        week = "星期日";
      } else if (w == 1) {
        week = "星期一";
      } else if (w == 2) {
        week = "星期二";
      } else if (w == 3) {
        week = "星期三";
      } else if (w == 4) {
        week = "星期四";
      } else if (w == 5) {
        week = "星期五";
      } else if (w == 6) {
        week = "星期六";
      }
      let YMD = year + "-" + month + "-" + day;
      let hms = h + ":" + m + ":" + s;
      this.dateArr = [YMD, hms, week];
    }, 1000);
  }
  back() {
    if (this.isRoot) {
      this.router.navigate(["/common/manage/Article"]);
    } else {
      window.history.back();
    }
  }
  newschoolMajorOption: any = {}; // 专业报考人数
  newmajorStudyOption: any = {}; // 专业学习人数
  newstudyTimeOption: any = {}; // 专业学习时间
  newmajorPercentOption: any = {}; // 专业合格率时间
  newstudyOption: any = {}; // 专业合格率时间
  changeOptions() {
    // let div1 =(<HTMLDivElement> document.getElementById("top-left"));
    // let div2 =(<HTMLDivElement> document.getElementById("top-center"));
    // let div3 =(<HTMLDivElement> document.getElementById("top-right"));
    // let div4 =(<HTMLDivElement> document.getElementById("bottom-right"));
    // let colors = ["#5793f3", "#d14a61", "#675bba"];
    let topLeft = echarts.init(
      <HTMLDivElement>document.getElementById("top-left")
    );
    let topCenter = echarts.init(
      <HTMLDivElement>document.getElementById("top-center")
    );
    let topRight = echarts.init(
      <HTMLDivElement>document.getElementById("top-right")
    );
    let bottomRight = echarts.init(
      <HTMLDivElement>document.getElementById("bottom-right")
    );
    let bottomLeft = echarts.init(
      <HTMLDivElement>document.getElementById("bottom-left")
    );

    // let bottomLeft = document.getElementById('bottom-left')
    this.newschoolMajorOption = this.schoolMajorOption;
    this.newmajorStudyOption = this.majorStudyOption;
    this.newstudyTimeOption = this.studyTimeOption;
    this.newmajorPercentOption = this.majorPercentOption;
    this.newstudyOption = this.studyOption;
    let labelOption = {
      show: true,
      position: "insideBottom",
      distance: 15,
      align: "left",
      verticalAlign: "middle",
      rotate: 90,
      formatter: "{c}  {name|{a}}",
      fontSize: 16,
      rich: {
        name: {
          textBorderColor: "#fff"
        }
      }
    };
    if (this.option == "南昌大学") {
      this.newschoolMajorOption.legend.data = [
        "土木工程",
        "工商企业管理",
        "工商管理",
        "法律事务"
      ];
      this.newschoolMajorOption.series = [
        {
          name: "土木工程",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [150, 232, 201]
        },
        {
          name: "工商企业管理",
          type: "bar",
          label: labelOption,
          data: [220, 182, 191]
        },
        {
          name: "工商管理",
          type: "bar",
          label: labelOption,
          data: [320, 332, 301]
        },
        {
          name: "法律事务",
          type: "bar",
          label: labelOption,
          data: [311, 232, 201]
        }
      ];
      this.newmajorStudyOption.xAxis.data = [
        "工商管理",
        "工商企业管理",
        "法学",
        "法律事务",
        "汉语言文学",
        "土木工程",
        "护理学"
      ];
      this.newmajorStudyOption.series[0].data = [
        120,
        200,
        150,
        80,
        70,
        110,
        130
      ];
      this.newstudyTimeOption.legend.data = [
        "工商管理",
        "工商企业管理",
        "法学",
        "法律事务",
        "汉语言文学",
        "土木工程",
        "护理学"
      ];
      this.newstudyTimeOption.series[0].data = [
        { value: 335, name: "工商管理" },
        { value: 310, name: "工商企业管理" },
        { value: 234, name: "法学" },
        { value: 135, name: "法律事务" },
        { value: 1548, name: "汉语言文学" },
        { value: 234, name: "土木工程" },
        { value: 135, name: "护理学" }
      ];
      this.newmajorPercentOption.xAxis.data = [
        "工商管理",
        "工商企业管理",
        "法学",
        "法律事务",
        "汉语言文学",
        "土木工程",
        "护理学"
      ];
      this.newmajorPercentOption.series.data = [68, 78, 72, 65, 57, 69, 75, 62];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[2].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[1].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "江西师范大学") {
      this.newschoolMajorOption.legend.data = [
        "教育管理",
        "学前教育",
        "行政管理",
        "计算机科学与技术"
      ];
      this.newschoolMajorOption.series = [
        {
          name: "教育管理",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [150, 232, 201]
        },
        {
          name: "学前教育",
          type: "bar",
          label: labelOption,
          data: [120, 282, 191]
        },
        {
          name: "行政管理",
          type: "bar",
          label: labelOption,
          data: [320, 232, 101]
        },
        {
          name: "计算机科学与技术",
          type: "bar",
          label: labelOption,
          data: [111, 332, 201]
        }
      ];
      this.newmajorStudyOption.xAxis.data = [
        "教育管理",
        "学前教育",
        "行政管理",
        "计算机科学与技术",
        "汉语言文学"
      ];
      this.newmajorStudyOption.series[0].data = [220, 210, 250, 190, 256];
      this.newstudyTimeOption.legend.data = [
        "教育管理",
        "学前教育",
        "行政管理",
        "计算机科学与技术",
        "汉语言文学"
      ];
      this.newstudyTimeOption.series[0].data = [
        { value: 235, name: "教育管理" },
        { value: 410, name: "学前教育" },
        { value: 334, name: "行政管理" },
        { value: 335, name: "计算机科学与技术" },
        { value: 548, name: "汉语言文学" }
      ];
      this.newmajorPercentOption.xAxis.data = [
        "教育管理",
        "学前教育",
        "行政管理",
        "计算机科学与技术",
        "汉语言文学"
      ];
      this.newmajorPercentOption.series.data = [68, 78, 72, 65, 57];
      this.newstudyOption.yAxis[0].max = 400;
      this.newstudyOption.yAxis[1].max = 400;
      this.newstudyOption.yAxis[2].max = 400;
      this.newstudyOption.series[0].data = [
        330,
        390,
        318,
        234,
        259,
        276,
        156,
        362,
        326,
        290
      ];
      this.newstudyOption.series[1].data = [
        330,
        390,
        218,
        234,
        359,
        276,
        356,
        362,
        326,
        290
      ];
      this.newstudyOption.series[2].data = [
        330,
        290,
        318,
        334,
        359,
        376,
        356,
        262,
        326,
        290
      ];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[2].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "江西财经大学") {
      this.newschoolMajorOption.legend.data = [
        "金融学",
        "会计学（本科）",
        "会计（专科）",
        "人力资源管理"
      ];
      this.newschoolMajorOption.series = [
        {
          name: "金融学",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "会计学（本科）",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        },
        {
          name: "会计（专科）",
          type: "bar",
          label: labelOption,
          data: [320, 232, 101]
        },
        {
          name: "人力资源管理",
          type: "bar",
          label: labelOption,
          data: [111, 332, 201]
        }
      ];
      this.newmajorStudyOption.xAxis.data = [
        "金融学",
        "会计学（本科）",
        "会计（专科）",
        "人力资源管理"
      ];
      this.newmajorStudyOption.series[0].data = [320, 310, 350, 290];
      this.newstudyTimeOption.legend.data = [
        "金融学",
        "会计学（本科）",
        "会计（专科）",
        "人力资源管理"
      ];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "金融学" },
        { value: 210, name: "会计学（本科）" },
        { value: 334, name: "会计（专科）" },
        { value: 235, name: "人力资源管理" }
      ];
      this.newmajorPercentOption.xAxis.data = [
        "金融学",
        "会计学（本科）",
        "会计（专科）",
        "人力资源管理"
      ];
      this.newmajorPercentOption.series.data = [58, 68, 52, 75];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[2].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "江西农业大学") {
      this.newschoolMajorOption.legend.data = ["圆林", "动物科学"];
      this.newschoolMajorOption.series = [
        {
          name: "圆林",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "动物科学",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        }
      ];
      this.newmajorStudyOption.xAxis.data = ["圆林", "动物科学"];
      this.newmajorStudyOption.series[0].data = [320, 310];
      this.newstudyTimeOption.legend.data = ["园林", "动物科学"];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "园林" },
        { value: 210, name: "动物科学" }
      ];
      this.newmajorPercentOption.xAxis.data = ["圆林", "动物科学"];
      this.newmajorPercentOption.series.data = [58, 68];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[2].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "江西中医药大学") {
      this.newschoolMajorOption.legend.data = ["中药学", "药学"];
      this.newschoolMajorOption.series = [
        {
          name: "中药学",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "药学",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        }
      ];
      this.newmajorStudyOption.xAxis.data = ["中药学", "药学"];
      this.newmajorStudyOption.series[0].data = [320, 310];
      this.newstudyTimeOption.legend.data = ["中药学", "药学"];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "中药学" },
        { value: 210, name: "药学" }
      ];
      this.newmajorPercentOption.xAxis.data = ["中药学", "药学"];
      this.newmajorPercentOption.series.data = [58, 68];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[2].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "江西科技师范大学") {
      this.newschoolMajorOption.legend.data = [
        "艺术教育",
        "环境设计",
        "环境艺术设计"
      ];
      this.newschoolMajorOption.series = [
        {
          name: "艺术教育",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "环境设计",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        },
        {
          name: "环境艺术设计",
          type: "bar",
          label: labelOption,
          data: [140, 182, 191]
        }
      ];
      this.newmajorStudyOption.xAxis.data = [
        "艺术教育",
        "环境设计",
        "环境艺术设计"
      ];
      this.newmajorStudyOption.series[0].data = [320, 310, 300];
      this.newstudyTimeOption.legend.data = [
        "艺术教育",
        "环境设计",
        "环境艺术设计"
      ];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "艺术教育" },
        { value: 210, name: "环境设计" },
        { value: 210, name: "环境艺术设计" }
      ];
      this.newmajorPercentOption.xAxis.data = [
        "艺术教育",
        "环境设计",
        "环境艺术设计"
      ];
      this.newmajorPercentOption.series.data = [58, 68, 73];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[2].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "南昌航空大学") {
      this.newschoolMajorOption.legend.data = ["机械设计制造及自动化", "动画"];
      this.newschoolMajorOption.series = [
        {
          name: "机械设计制造及自动化",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "动画",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        }
      ];
      this.newmajorStudyOption.xAxis.data = ["机械设计制造及自动化", "动画"];
      this.newmajorStudyOption.series[0].data = [320, 310, 300];
      this.newstudyTimeOption.legend.data = ["机械设计制造及自动化", "动画"];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "机械设计制造及自动化" },
        { value: 210, name: "动画" }
      ];
      this.newmajorPercentOption.xAxis.data = ["机械设计制造及自动化", "动画"];
      this.newmajorPercentOption.series.data = [58, 68];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[2].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[1].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "江西理工大学") {
      this.newschoolMajorOption.legend.data = [
        "采矿工程",
        "工程造价(本科)",
        "工程造价(专科)"
      ];
      this.newschoolMajorOption.series = [
        {
          name: "采矿工程",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "工程造价(本科)",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        },
        {
          name: "工程造价(专科)",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        }
      ];
      this.newmajorStudyOption.xAxis.data = [
        "采矿工程",
        "工程造价(本科)",
        "工程造价(专科)"
      ];
      this.newmajorStudyOption.series[0].data = [320, 310, 345];
      this.newstudyTimeOption.legend.data = [
        "采矿工程",
        "工程造价(本科)",
        "工程造价(专科)"
      ];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "采矿工程" },
        { value: 210, name: "工程造价(本科)" },
        { value: 110, name: "工程造价(专科)" }
      ];
      this.newmajorPercentOption.xAxis.data = [
        "采矿工程",
        "工程造价(本科)",
        "工程造价(专科)"
      ];
      this.newmajorPercentOption.series.data = [58, 68, 67];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[1].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }
    if (this.option == "江西警察学院") {
      this.newschoolMajorOption.legend.data = ["侦查学", "公共安全管理"];
      this.newschoolMajorOption.series = [
        {
          name: "侦查学",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "公共安全管理",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        }
      ];
      this.newmajorStudyOption.xAxis.data = ["侦查学", "公共安全管理"];
      this.newmajorStudyOption.series[0].data = [320, 310];
      this.newstudyTimeOption.legend.data = ["侦查学", "公共安全管理"];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "侦查学" },
        { value: 210, name: "公共安全管理" }
      ];
      this.newmajorPercentOption.xAxis.data = ["侦查学", "公共安全管理"];
      this.newmajorPercentOption.series.data = [58, 68];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[1].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }

    if (this.option == "华东理工大学") {
      this.newschoolMajorOption.legend.data = [
        "市场营销（本科）",
        "市场营销（专科）"
      ];
      this.newschoolMajorOption.series = [
        {
          name: "市场营销（本科）",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "市场营销（专科）",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        }
      ];
      this.newmajorStudyOption.xAxis.data = [
        "市场营销（本科）",
        "市场营销（专科）"
      ];
      this.newmajorStudyOption.series[0].data = [320, 310];
      this.newstudyTimeOption.legend.data = [
        "市场营销（本科）",
        "市场营销（专科）"
      ];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "市场营销（本科）" },
        { value: 210, name: "市场营销（本科）" }
      ];
      this.newmajorPercentOption.xAxis.data = [
        "市场营销（本科）",
        "市场营销（专科）"
      ];
      this.newmajorPercentOption.series.data = [58, 68];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[1].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }

    if (this.option == "华东交通大学") {
      this.newschoolMajorOption.legend.data = [
        "机械电子工程",
        "机电一体化技术"
      ];
      this.newschoolMajorOption.series = [
        {
          name: "机械电子工程",
          type: "bar",
          barGap: 0,
          label: labelOption,
          data: [130, 132, 201]
        },
        {
          name: "机电一体化技术",
          type: "bar",
          label: labelOption,
          data: [240, 282, 391]
        }
      ];
      this.newmajorStudyOption.xAxis.data = ["机械电子工程", "机电一体化技术"];
      this.newmajorStudyOption.series[0].data = [320, 310];
      this.newstudyTimeOption.legend.data = ["机械电子工程", "机电一体化技术"];
      this.newstudyTimeOption.series[0].data = [
        { value: 135, name: "机械电子工程" },
        { value: 210, name: "机电一体化技术" }
      ];
      this.newmajorPercentOption.xAxis.data = [
        "机械电子工程",
        "机电一体化技术"
      ];
      this.newmajorPercentOption.series.data = [58, 68];
      this.newstudyOption.yAxis[0].max = 500;
      this.newstudyOption.yAxis[1].max = 500;
      this.newstudyOption.yAxis[2].max = 500;
      this.newstudyOption.series[0].data = [
        430,
        390,
        318,
        234,
        459,
        176,
        156,
        162,
        326,
        490
      ];
      this.newstudyOption.series[1].data = [
        330,
        490,
        218,
        234,
        459,
        276,
        356,
        462,
        326,
        290
      ];
      this.newstudyOption.series[1].data = [
        330,
        290,
        318,
        434,
        359,
        376,
        456,
        262,
        326,
        290
      ];
    }

    topLeft.setOption(this.newschoolMajorOption);
    topCenter.setOption(this.newmajorStudyOption);
    topRight.setOption(this.newstudyTimeOption);
    bottomRight.setOption(this.newmajorPercentOption);
    bottomLeft.setOption(this.newstudyOption);
    console.log(this.newstudyOption);
    this.cdRef.detectChanges();
  }
}
