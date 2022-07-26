import { Component, OnInit } from "@angular/core";
import { EChartOption } from "echarts";
import * as Parse from "parse";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { ColumnApi, GridApi } from "ag-grid-community";
import { async } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";

type CreateRangeChartParams = any;

@Component({
  selector: "app-dashboard-satisficing",
  templateUrl: "./dashboard-satisficing.component.html",
  styleUrls: ["./dashboard-satisficing.component.scss"]
})
export class DashboardSatisficingComponent implements OnInit {
  public api: GridApi;
  public columnApi: ColumnApi;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  public defaultColDef: any = {
    editable: true, //单元表格是否可编辑
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true, //开启排序
    resizable: true, //是否可以调整列大小，就是拖动改变列大小

    // filter: true, //开启刷选
    filter: "agTextColumnFilter",
    floatingFilter: true, // 显示过滤栏
    flex: 1,
    minWidth: 100
  };

  id: any = "Ny4NdlzpCz";
  questions: any;
  chartOption1: EChartOption = {};
  chartOption2: EChartOption = {};
  chartOption3: EChartOption = {};
  chartOption4: EChartOption = {};
  chartOption5: EChartOption = {};
  chartOption6: EChartOption = {};
  chartOption7: EChartOption = {};
  chartOption8: EChartOption = {};
  chartOption9: EChartOption = {};
  chartOption10: EChartOption = {}; //离职意向率
  surveyLogArr: any = []; // 提交的我问卷
  total: any = 0; // 历史总提交数
  cleanTotal: any = 0;
  cleanSurveyLog: any = [];
  todayArr: any = []; // 今天提交份数
  totalGrades: any = 0; // 总得分
  salar: any = 0; // 薪资福利
  work: any = 0; // 工作环境
  promotion: any = 0; // 发展晋升
  sibling: any = 0; // 同级关系
  supervisor: any = 0; // 上下级关系
  whole: any = 0; // 总体满意度
  satisfaction: any = 0; // 满意度
  // 清洗后
  cleanSatisfaction: any = 0; // 清洗后的满意度
  cleanSalar: any = 0; // 工资福利
  cleanWork: any = 0; // 工作环境与内容
  cleanPromotion: any = 0; // 发展晋升
  cleanSupervisor: any = 0; // 上下级关系
  cleanSibling: any = 0; // 同级关系
  cleanWhole: any = 0; // 总体满意度
  completion: any = 0;
  department: any = [];
  cate: any = [];
  isSelf: Boolean = true;
  probability:any = 0
  totals: any = []
  constructor(private http: HttpClient) { }

  async ngOnInit() {

    (this.columnDefs = [
      { headerName: "院区", field: "area", chartDataType: "category" },
      { headerName: "性别", field: "sex", chartDataType: "category" },
      { headerName: "岗位", field: "part", chartDataType: "category" },
      {
        headerName: "职称",
        field: "technicalTitle",
        chartDataType: "category"
      },
      { headerName: "教育程度", field: "education", chartDataType: "category" },
      { headerName: "总体满意度", field: "whole", chartDataType: "series" },
      { headerName: "薪资福利", field: "salar", chartDataType: "series" },
      { headerName: "发展与晋升", field: "promotion", chartDataType: "series" },
      { headerName: "工作环境与内容", field: "work", chartDataType: "series" },
      { headerName: "同级关系", field: "sibling", chartDataType: "series" },
      { headerName: "上下级关系", field: "supervisor", chartDataType: "series" }
    ]),
      // (this.cate = [
      //   { name: "根据性别分类生成图表", cate: "sex" },
      //   { name: "根据岗位分类生成图表", cate: "part" },
      //   { name: "根据职称分类生成图表", cate: "technicalTitle" },
      //   { name: "根据教育分类生成图表", cate: "education" }
      // ]);
    await this.queryQuestionItem();
    await this.querySurveyLog();
    await this.queryDepartment();
    await this.setData();
    await this.setRowData();

  }
  //点击切换
  async onchange(year) {
    console.log(year);
    if (year == '2020') {
      this.id = "Ny4NdlzpCz";
      await this.queryQuestionItem();
      await this.querySurveyLog();
      await this.queryDepartment();
      await this.setData();
      await this.setRowData();
    } else {
      this.id = "d9p1qNfWui";
      await this.now_queryQuestionItem()
      await this.now_querySurveyLog()

      // await this.now_setData()
      // await this.now_setRowData();
    }
  }

  // 设置数据
  setData() {
    // 仪表盘
    this.chartOption1 = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
      },
      series: [
        {
          name: "满意度问卷调查完成情况",
          type: "gauge",
          // detail: { formatter: `${value}%` },
          data: [{ value: this.completion, name: "完成率" }],
          title: {
            //设置仪表盘中间显示文字样式
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "white"
          }
        }
      ]
    };
    // 历史总提交
    this.chartOption2 = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}份"
      },
      series: [
        {
          name: "满意度问卷总提交",
          type: "gauge",
          min: 0,
          max: 5400,
          splitNumber: 12,
          // detail: { formatter: "{value}份" },
          data: [{ value: this.total, name: "历史总提交" }],
          title: {
            //设置仪表盘中间显示文字样式
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "white"
          }
        }
      ]
    };

    // 今日总提数量
    this.chartOption3 = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}份"
      },
      series: [
        {
          name: "满意度问卷今日提交",
          type: "gauge",
          min: 0,
          max: 2000,
          splitNumber: 10,
          // detail: { formatter: "{value}份" },
          data: [{ value: this.todayArr.length, name: "今日提交" }],
          title: {
            //设置仪表盘中间显示文字样式
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "white"
          }
        }
      ]
    };
    // 总体满意度
    this.chartOption4 = {
      title: {
        text: "职工满意度",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      legend: {
        data: ["满意度"]
      },
      xAxis: {
        type: "category",
        data: ["满意度"],
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },
      yAxis: {
        type: "value",
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },
      series: [
        {
          name: "满意度",
          data: [this.satisfaction],
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          type: "bar"
        }
      ]
    };
    // 各维度的满意度情况
    this.chartOption5 = {
      title: {
        text: "职工各维度满意度情况",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      legend: {
        data: ["满意度"],
        left: "center",
        textStyle: {
          color: "#FFF" // 图例文字颜色
        }
      },
      xAxis: {
        type: "category",
        data: [
          "薪资福利",
          "发展晋升",
          "工作内容与环境",
          "上下级关系",
          "同级关系",
          "总体满意度"
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
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },
      series: [
        {
          name: "满意度",
          data: [
            this.salar,
            this.promotion,
            this.work,
            this.supervisor,
            this.sibling,
            this.whole
          ],
          itemStyle: {
            normal: {
              color: function () {
                var colorList = [
                  // "#ffc107",
                  // "#00796b",
                  // "#5367fc",
                  // "#56a6d1",
                  // "#2469aa",
                  "#df4d3b"
                  // "#752091",
                  // "#ff1d55",
                  // "#009966",
                  // "#FF9933"
                ];
                let index = Math.floor(Math.random() * 10);
                return colorList[0];
              },
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          type: "bar"
        }
      ]
    };
    // 各维度的满意度情况雷达图
    this.chartOption6 = {
      title: {
        text: "满意度雷达图",
        textStyle: {
          color: "#fff"
        }
      },
      tooltip: {},
      legend: {
        data: ["职工总体与各维度满意度"],
        textStyle: {
          color: "#fff"
        }
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: "薪资福利", max: 100 },
          { name: "发展晋升", max: 100 },
          { name: "工作环境与内容", max: 100 },
          { name: "上下级关系", max: 100 },
          { name: "同级关系）", max: 100 },
          { name: "总体满意度", max: 100 }
        ]
      },
      series: [
        {
          name: "职工总体与各维度满意度",
          type: "radar",
          // areaStyle: {normal: {}},
          data: [
            {
              value: [
                this.salar,
                this.promotion,
                this.work,
                this.supervisor,
                this.sibling,
                this.whole
              ],
              name: "满意度"
            }
          ]
        }
      ]
    };

    this.chartOption7 = {
      title: {
        text: "职工满意度",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      legend: {
        data: ["满意度"]
      },
      xAxis: {
        type: "category",
        data: ["满意度"],
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },

      yAxis: {
        type: "value",
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },
      series: [
        {
          name: "满意度",
          data: [this.cleanSatisfaction],
          itemStyle: {
            normal: {
              color: "#FFCF00",
              // function() {
              //   var colorList = [
              //     // "#ffc107",
              //     // "#00796b",
              //     // "#5367fc",
              //     // "#56a6d1",
              //     // "#2469aa",
              //     "#df4d3b"
              //     // "#752091",
              //     // "#ff1d55",
              //     // "#009966",
              //     // "#FF9933"
              //   ];
              //   // let index = Math.floor(Math.random() * 10);
              //   return colorList[0];
              // },
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          type: "bar"
        }
      ]
    };
    // 各维度的满意度情况
    this.chartOption8 = {
      title: {
        text: "职工各维度满意度情况",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      legend: {
        data: ["满意度"],
        textStyle: {
          color: "#FFF" // 图例文字颜色
        }
      },
      xAxis: {
        type: "category",
        data: [
          "薪资福利",
          "发展晋升",
          "工作内容与环境",
          "上下级关系",
          "同级关系",
          "总体满意度"
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
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },
      series: [
        {
          name: "满意度",
          data: [
            this.cleanSalar,
            this.cleanPromotion,
            this.cleanWork,
            this.cleanSupervisor,
            this.cleanSibling,
            this.cleanWhole
          ],
          itemStyle: {
            normal: {
              color: function () {
                var colorList = [
                  // "#ffc107",
                  // "#00796b",
                  // "#5367fc",
                  "#FFCF00"
                  // "#2469aa",
                  // "#df4d3b",
                  // "#752091",
                  // "#ff1d55",
                  // "#009966",
                  // "#FF9933"
                ];
                let index = Math.floor(Math.random() * 10);
                return colorList[0];
              },
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          type: "bar"
        }
      ]
    };
    // 各维度的满意度情况雷达图
    this.chartOption9 = {
      title: {
        text: "满意度雷达图",
        textStyle: {
          color: "#fff"
        }
      },
      tooltip: {},
      legend: {
        data: ["职工总体与各维度满意度"],
        textStyle: {
          color: "#fff"
        }
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: "薪资福利", max: 100 },
          { name: "发展晋升", max: 100 },
          { name: "工作环境与内容", max: 100 },
          { name: "上下级关系", max: 100 },
          { name: "同级关系）", max: 100 },
          { name: "总体满意度", max: 100 }
        ]
      },
      series: [
        {
          name: "职工总体与各维度满意度",
          type: "radar",
          // areaStyle: {normal: {}},
          data: [
            {
              value: [
                this.cleanSalar,
                this.cleanPromotion,
                this.cleanWork,
                this.cleanSupervisor,
                this.cleanSibling,
                this.cleanWhole
              ],
              name: "满意度"
            }
          ]
        }
      ]
    };
  }

  //设置数据2021年
  now_setData() {
    // 仪表盘
    this.chartOption1 = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
      },
      series: [
        {
          name: "满意度问卷调查完成情况",
          type: "gauge",
          // detail: { formatter: `${value}%` },
          data: [{ value: this.completion, name: "完成率" }],
          title: {
            //设置仪表盘中间显示文字样式
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "white"
          }
        }
      ]
    };
    // 历史总提交
    this.chartOption2 = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}份"
      },
      series: [
        {
          name: "满意度问卷总提交",
          type: "gauge",
          min: 0,
          max: 5400,
          splitNumber: 12,
          // detail: { formatter: "{value}份" },
          data: [{ value: this.total, name: "历史总提交" }],
          title: {
            //设置仪表盘中间显示文字样式
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "white"
          }
        }
      ]
    };
    //离职意向率
    this.chartOption10 = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}份"
      },
      series: [
        {
          name: "离职意向率",
          type: "gauge",
          min: 0,
          max: 100,
          splitNumber: 10,
          // detail: { formatter: "{value}份" },
          data: [{ value: this.probability , name: "离职意向率" }],
          title: {
            //设置仪表盘中间显示文字样式
            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            color: "white"
          }
        }
      ]
    };

    // 总体满意度
    this.chartOption4 = {
      title: {
        text: "职工满意度",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      legend: {
        data: ["满意度"]
        // color: "#fff"
      },
      xAxis: {
        type: "category",
        data: ["满意度"],
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },

      yAxis: {
        type: "value",
        axisLabel: {
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },
      series: [
        {
          name: "满意度",
          data: [this.satisfaction],
          itemStyle: {
            normal: {
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          type: "bar"
        }
      ]
    };
    // 各维度的满意度情况
    this.chartOption5 = {
      title: {
        text: "职工各维度满意度情况",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      legend: {
        data: ["满意度"],
        left: "center",
        textStyle: {
          color: "#FFF" // 图例文字颜色
        }
      },
      xAxis: {
        type: "category",
        data: [
          "薪资福利",
          "发展晋升",
          "工作内容与环境",
          "上下级关系",
          "同级关系",
          "总体满意度"
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
          interval: 0,
          rotate: 30,
          color: "#fff"
        }
      },
      series: [
        {
          name: "满意度",
          data: [
            this.salar,
            this.promotion,
            this.work,
            this.supervisor,
            this.sibling,
            this.whole
          ],
          itemStyle: {
            normal: {
              color: function () {
                var colorList = [
                  // "#ffc107",
                  // "#00796b",
                  // "#5367fc",
                  // "#56a6d1",
                  // "#2469aa",
                  "#df4d3b"
                  // "#752091",
                  // "#ff1d55",
                  // "#009966",
                  // "#FF9933"
                ];
                let index = Math.floor(Math.random() * 10);
                return colorList[0];
              },
              label: {
                show: true, //开启显示
                position: "top", //在上方显示
                textStyle: {
                  //数值样式
                  color: "#fff",
                  fontSize: 16
                }
              }
            }
          },
          type: "bar"
        }
      ]
    };
    // 各维度的满意度情况雷达图
    this.chartOption6 = {
      title: {
        text: "满意度雷达图",
        textStyle: {
          color: "#fff"
        }
      },
      tooltip: {},
      legend: {
        data: ["职工总体与各维度满意度"],
        textStyle: {
          color: "#fff"
        }
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: "#fff",
            backgroundColor: "#999",
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: "薪资福利", max: 100 },
          { name: "发展晋升", max: 100 },
          { name: "工作环境与内容", max: 100 },
          { name: "上下级关系", max: 100 },
          { name: "同级关系）", max: 100 },
          { name: "总体满意度", max: 100 }
        ]
      },
      series: [
        {
          name: "职工总体与各维度满意度",
          type: "radar",
          // areaStyle: {normal: {}},
          data: [
            {
              value: [
                this.salar,
                this.promotion,
                this.work,
                this.supervisor,
                this.sibling,
                this.whole
              ],
              name: "满意度"
            }
          ]
        }
      ]
    };


  }

  // 查询题目
  async queryQuestionItem() {
    let QuestionItem = Parse.Object.extend("QuestionItem");
    let queryQI = new Parse.Query(QuestionItem);
    queryQI.equalTo("qsurvey", this.id);
    queryQI.limit(100);
    let result = await queryQI.find();
    let compare = function (q1, q2) {
      let val1 = q1.get("index");
      let val2 = q2.get("index");
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    };
    result.sort(compare);
    console.log(result);
    this.questions = result;
    console.log(result[1].id);
  }

  // 查询题目2021
  async now_queryQuestionItem() {
    console.log(this.id);
    let queryQI = new Parse.Query("SurveyItem");
    queryQI.equalTo("survey", this.id);
    queryQI.ascending("index")
    queryQI.limit(22);
    let result = await queryQI.find();
    console.log(result);
    this.questions = result;
  }

  //  问卷提交结果查询
  async querySurveyLog() {
    let SurveyLog = Parse.Object.extend("SurveyLogTest");
    let querySurveyLog = new Parse.Query(SurveyLog);
    querySurveyLog.equalTo("survey", this.id);
    querySurveyLog.limit(20000);
    let result = await querySurveyLog.find();
    let existsMap = {};
    let uniqueArr = [];
    result.filter(item => {
      if (item.get("user") &&!existsMap[item.get("user").id]) {
        existsMap[item.get("user").id] = true;
        uniqueArr.push(item);
      }
    });
    this.surveyLogArr = uniqueArr;
    let cleanSurveyLog: any = [];
    let today = new Date(),
      toY = today.getFullYear(),
      toM = today.getMonth() + 1,
      toD = today.getDate() + 1,
      toYDM = toY + "-" + toM + "-" + toD,
      arr: any = [];
    this.total = uniqueArr.length;
    uniqueArr.forEach(item => {
      if (item.get("useTime") > 120) {
        cleanSurveyLog.push(item);
      }
      let updateTime = item.updatedAt,
        upY = updateTime.getFullYear(),
        upM = updateTime.getMonth() + 1,
        upD = updateTime.getDate() + 1,
        upYMD = upY + "-" + upM + "-" + upD;
      if (toYDM == upYMD) {
        arr.push(item);
      }
    });
    this.cleanSurveyLog = cleanSurveyLog;
    this.cleanTotal = this.cleanSurveyLog.length;
    console.log(this.cleanTotal);
    this.completion = (this.total / 54).toFixed(2);
    // 计算今日提交和历史总提交
    // 去重, 根据user

    this.todayArr = arr;
    arr = null;
    await this.dimensionSatisfaction();
  }

  //  问卷提交结果查询2021
  async now_querySurveyLog() {
    let uniqueArr = [];

    let baseurl = localStorage.getItem("NOVA_SERVERURL")?localStorage.getItem("NOVA_SERVERURL")+"api/novaql/select":"https://server.fmode.cn/api/novaql/select";
    let sql = `select 
    "SL"."user" as "user",
    "SL"."profile" as "profile",
    "SL"."answer" as "answer",
    "P"."sex" as "sex",
    "P"."branch" as "branch"
    from "SurveyLog" as "SL" 
    left join "Profile" as "P" on "P"."objectId" = "profile"
    where "SL"."company" = '${localStorage.company}' and "SL"."survey" = '${this.id}'`;
    new Promise((resolve, reject) => {
      this.http.post(baseurl, { sql: sql }).subscribe((res: any) => {
        console.log(res.data)
        uniqueArr = res.data
        resolve(uniqueArr)
      })
    }).then(async data => {
      console.log(uniqueArr);
      this.surveyLogArr = uniqueArr;
      this.total = uniqueArr.length;
      this.cleanSurveyLog = uniqueArr

      let arr: any = [];
      this.cleanTotal = this.cleanSurveyLog.length;
      console.log(this.cleanTotal);
      this.completion = (this.total / 59).toFixed(2);
      // 计算今日提交和历史总提交

      this.todayArr = arr;
      arr = null;
      await this.getGrade()
      await this.now_dimensionSatisfaction();
      await this.now_setData()
      await this.now_setRowData()

    })

    // let querySurveyLog = new Parse.Query("SurveyLog");
    // querySurveyLog.equalTo("survey", this.id);
    // querySurveyLog.include("profile")
    // querySurveyLog.limit(20000);
    // let result = await querySurveyLog.find();
    // console.log(result);

  }

  // 科室的查询
  async queryDepartment() {
    let Department = Parse.Object.extend("HospitalDepartment");
    let department = new Parse.Query(Department);
    department.limit(500);
    let result = await department.find();
    this.department = result;
  }
  // 将result的数据填充到grid中
  setRowData() {
    this.isSelf = true;
    let rowArr: any = [],
      rows = this.cleanSurveyLog;
    (this.columnDefs = [
      { headerName: "院区", field: "area", chartDataType: "category" },
      { headerName: "性别", field: "sex", chartDataType: "category" },
      { headerName: "岗位", field: "part", chartDataType: "category" },
      {
        headerName: "职称",
        field: "technicalTitle",
        chartDataType: "category"
      },
      { headerName: "教育程度", field: "education", chartDataType: "category" },
      { headerName: "满意度", field: "satisfaction", chartDataType: "series" },
      { headerName: "总体满意度", field: "whole", chartDataType: "series" },
      { headerName: "薪资福利", field: "salar", chartDataType: "series" },
      { headerName: "发展与晋升", field: "promotion", chartDataType: "series" },
      { headerName: "工作环境与内容", field: "work", chartDataType: "series" },
      { headerName: "同级关系", field: "sibling", chartDataType: "series" },
      { headerName: "上下级关系", field: "supervisor", chartDataType: "series" }
    ]),
      rows.forEach(row => {
        rowArr.push({
          area: row.get("area"),
          sex: row.get("sex"),
          part: row.get("part"),
          technicalTitle: row.get("technicalTitle"),
          education: row.get("education"),
          whole: Number(row.get("grades")[6].whole),
          salar: Number(row.get("grades")[1].salar),
          promotion: Number(row.get("grades")[2].promotion),
          work: Number(row.get("grades")[3].work),
          sibling: Number(row.get("grades")[5].sibling),
          supervisor: Number(row.get("grades")[4].supervisor),
          satisfaction: Number(
            (
              (Number(row.get("grades")[6].whole) +
                Number(row.get("grades")[1].salar) +
                Number(row.get("grades")[2].promotion) +
                Number(row.get("grades")[3].work) +
                Number(row.get("grades")[5].sibling) +
                Number(row.get("grades")[4].supervisor)) /
              6
            ).toFixed(2)
          )
        });
      });
    this.rowData = rowArr;
  }

  // 将result的数据填充到grid中 2021
  now_setRowData() {
    this.isSelf = true;
    let rowArr: any = [],
      rows = this.cleanSurveyLog;
    console.log(this.cleanSurveyLog);

    (this.columnDefs = [
      { headerName: "院区", field: "area", chartDataType: "category" },
      { headerName: "性别", field: "sex", chartDataType: "category" },
      { headerName: "岗位", field: "part", chartDataType: "category" },
      {
        headerName: "职称",
        field: "technicalTitle",
        chartDataType: "category"
      },
      { headerName: "教育程度", field: "education", chartDataType: "category" },
      { headerName: "满意度", field: "satisfaction", chartDataType: "series" },
      { headerName: "总体满意度", field: "whole", chartDataType: "series" },
      { headerName: "薪资福利", field: "salar", chartDataType: "series" },
      { headerName: "发展与晋升", field: "promotion", chartDataType: "series" },
      { headerName: "工作环境与内容", field: "work", chartDataType: "series" },
      { headerName: "同级关系", field: "sibling", chartDataType: "series" },
      { headerName: "上下级关系", field: "supervisor", chartDataType: "series" },
      { headerName: "离职意向率", field: "intention", chartDataType: "series" }
    ]),
      console.log(rows);
    rows.forEach(row => {
      rowArr.push({

        area: row.seat.area,
        sex: row.sex,
        part: row.seat.part,
        technicalTitle: row.seat.technicalTitle,
        education: row.seat.education,
        whole: Number(row.mark.whole),
        salar: Number(row.mark.salar),
        promotion: Number(row.mark.promotion),
        work: Number(row.mark.work),
        sibling: Number(row.mark.sibling),
        supervisor: Number((row.mark.supervisor).toFixed(2)),
        intention:Number((row.mark.intention).toFixed(2)),
        satisfaction: Number(
          (
            (Number(row.mark.whole) +
              Number(row.mark.salar) +
              Number(row.mark.promotion) +
              Number(row.mark.work) +
              Number(row.mark.sibling) +
              Number(row.mark.supervisor)) /
            6
          ).toFixed(2)
        )
      });
    });
    this.rowData = rowArr;
  }

  // 每一题的答题情况
  setQuestionRowData() {
    this.isSelf = false;
    console.log(1213);
    this.columnDefs = [
      { headerName: "第几题", field: "question" },
      { headerName: "选A的人数", field: "A" },
      { headerName: "选B的人数", field: "B" },
      { headerName: "选C的人数", field: "C" },
      { headerName: "选D的人数", field: "D" },
      { headerName: "选E的人数", field: "E" },
      { headerName: "不满意率", field: "noSatisfaction" }
    ];
    let rowArr: any = [],
      rows: any = this.questions,
      surveyLogs = this.cleanSurveyLog;

    rows.forEach((row, index) => {
      let A: any = 0,
        B: any = 0,
        C: any = 0,
        D: any = 0,
        E: any = 0;
      surveyLogs.forEach(log => {
        let answers = log.get("answersMap");
        for (const key in answers) {
          if (key == row.id) {
            switch (answers[key].value) {
              case "非常不同意":
                A += 1;
                break;
              case "比较不同意":
                B += 1;
                break;
              case "一般":
                C += 1;
                break;
              case "比较同意":
                D += 1;
                break;
              default:
                E += 1;
                break;
            }
          }
        }
      });
      if (index == 11 || index == 13 || index == 16 || index == 18) {
        rowArr.push({
          question: "第" + (index + 1) + "题:" + row.get("title"),
          A: A,
          B: B,
          C: C,
          D: D,
          E: E,
          noSatisfaction: ((E / surveyLogs.length) * 100).toFixed(2) + "%"
        });
      } else {
        rowArr.push({
          question: "第" + (index + 1) + "题:" + row.get("title"),
          A: A,
          B: B,
          C: C,
          D: D,
          E: E,
          noSatisfaction: ((A / surveyLogs.length) * 100).toFixed(2) + "%"
        });
      }
    });

    this.rowData = rowArr;
  }
  // 每一题的答题情况 2021
  now_setQuestionRowData() {
    this.isSelf = false;
    console.log(1213);
    this.columnDefs = [
      { headerName: "第几题", field: "question" },
      { headerName: "选A的人数", field: "A" },
      { headerName: "选B的人数", field: "B" },
      { headerName: "选C的人数", field: "C" },
      { headerName: "选D的人数", field: "D" },
      { headerName: "选E的人数", field: "E" },
      { headerName: "不满意率", field: "noSatisfaction" }
    ];
    let rowArr: any = [],
      rows: any = this.questions,
      surveyLogs = this.cleanSurveyLog;

    rows.forEach((row, index) => {
      console.log(row.id);

      let A: any = 0,
        B: any = 0,
        C: any = 0,
        D: any = 0,
        E: any = 0;
      surveyLogs.forEach(log => {
        let answers = log.answer
        switch (answers[row.id]) {
          case "A":
            A += 1;
            break;
          case "B":
            B += 1;
            break;
          case "C":
            C += 1;
            break;
          case "D":
            D += 1;
            break;
          default:
            E += 1;
            break;
        }
      });
      if (index == 11 || index == 13 || index == 16 || index == 18) {
        rowArr.push({
          question: "第" + (index + 1) + "题:" + row.get("title"),
          A: A,
          B: B,
          C: C,
          D: D,
          E: E,
          noSatisfaction: ((E / surveyLogs.length) * 100).toFixed(2) + "%"
        });
      } else {
        rowArr.push({
          question: "第" + (index + 1) + "题:" + row.get("title"),
          A: A,
          B: B,
          C: C,
          D: D,
          E: E,
          noSatisfaction: ((A / surveyLogs.length) * 100).toFixed(2) + "%"
        });
      }
    });

    this.rowData = rowArr;
  }

  newDepartment() {
    this.isSelf = false;
    let department = this.department;
    let departArr: any = [];
    department.forEach(dpm => {
      // len 当前科室提交问卷的份数
      let part = dpm
        .get("department")
        .replace(/\s/g, "")
        .split("/"),
        depart: any = "";
      if (part[0] == "党群部门" || part[0] == "行政部门") {
        depart = part[0] + "/" + part[1];

        // console.log(depart, departArr.indexOf(depart) === -1);
        if (!departArr.includes(depart)) {
          departArr.push(depart);
        }
      } else if (part[0] == "临床医技类") {
        if (
          dpm.get("department").indexOf("儿科") > 0 ||
          dpm.get("department").indexOf("急诊科") > 0
        ) {
          depart = part[0] + "/" + part[1];
          if (!departArr.includes(depart)) {
            departArr.push(depart);
          }
        } else {
          if (part[2]) {
            depart = part[0] + "/" + part[1] + "/" + part[2];
          } else {
            depart = part[0] + "/" + part[1];
          }

          if (!departArr.includes(depart)) {
            departArr.push(depart);
          }
        }
      } else if (part[0] == "临床服务类") {
        if (dpm.get("department").indexOf("呼吸与危重症医学科") > 0) {
          depart = part[0] + "/" + part[1];
        } else {
          if (part[2]) {
            depart = part[0] + "/" + part[1] + "/" + part[2];
          } else {
            depart = part[0] + "/" + part[1];
          }
        }

        if (!departArr.includes(depart)) {
          departArr.push(depart);
        }
      } else {
        depart = dpm.get("department");
        if (!departArr.includes(depart)) {
          departArr.push(depart);
        }
      }
    });
    console.log(departArr);
    return departArr;
  }

  // 各科室的答题情况
  setDepartmentRowData() {
    let newDepart = this.newDepartment();
    let rows = [];
    let department = this.department;
    (this.columnDefs = [
      { headerName: "院区", field: "area" },
      { headerName: "科室", field: "dpm" },
      { headerName: "科室总人数", field: "totalCount" },
      { headerName: "总提交人数", field: "submitCount" },
      { headerName: "清洗后提交人数", field: "count" },
      { headerName: "满意度", field: "satisfaction" },
      { headerName: "总体满意度", field: "whole" },
      { headerName: "薪资福利", field: "salar" },
      { headerName: "发展与晋升", field: "promotion" },
      { headerName: "工作环境与内容", field: "work" },
      { headerName: "同级关系", field: "sibling" },
      { headerName: "上下级关系", field: "supervisor" }
    ]),
      newDepart.forEach(dpm => {
        let count = this.totalPeople(dpm);
        // 计算各科室总提交人数
        let submitCount = this.submitTotal(dpm);
        // len  清洗后当前科室提交问卷的份数
        let surveyLog = this.cleanSurveyLog,
          len: any = 0,
          whole: any = 0,
          salar: any = 0,
          promotion: any = 0,
          work: any = 0,
          sibling: any = 0,
          supervisor: any = 0,
          area: any;
        surveyLog.forEach(log => {
          let subDepartment = log
            .get("department")
            .replace(/\s/g, "")
            .split("/"),
            depart: any = "";

          if (
            subDepartment[0] == "党群部门" ||
            subDepartment[0] == "行政部门"
          ) {
            depart = subDepartment[0] + "/" + subDepartment[1];
          } else if (subDepartment[0] == "临床医技类") {
            if (
              log.get("department").indexOf("儿科") > 0 ||
              log.get("department").indexOf("急诊科") > 0
            ) {
              // console.log(log, log.get("department"));
              depart = subDepartment[0] + "/" + subDepartment[1];
            } else {
              if (subDepartment[2]) {
                depart =
                  subDepartment[0] +
                  "/" +
                  subDepartment[1] +
                  "/" +
                  subDepartment[2];
              } else {
                depart = subDepartment[0] + "/" + subDepartment[1];
              }
            }
          } else if (subDepartment[0] == "临床服务类") {
            if (log.get("department").indexOf("呼吸与危重症医学科") > 0) {
              depart = subDepartment[0] + "/" + subDepartment[1];
            } else {
              if (subDepartment[2]) {
                depart =
                  subDepartment[0] +
                  "/" +
                  subDepartment[1] +
                  "/" +
                  subDepartment[2];
              } else {
                depart = subDepartment[0] + "/" + subDepartment[1];
              }
            }
          } else {
            depart = log.get("department").replace(/\s/g, "");
          }
          // console.log(depart);
          if (dpm == depart) {
            area = log.get("area");
            len += 1;

            whole += Number(log.get("grades")[6].whole);
            salar += Number(log.get("grades")[1].salar);
            promotion += Number(log.get("grades")[2].promotion);
            work += Number(log.get("grades")[3].work);
            sibling += Number(log.get("grades")[5].sibling);
            supervisor += Number(log.get("grades")[4].supervisor);
          }
        });
        if (len == 0 || whole == 0) {
          rows.push({
            area: "东湖",
            dpm: dpm,
            totalCount: count,
            submitCount: submitCount,
            count: len,
            whole: 0,
            salar: 0,
            promotion: 0,
            work: 0,
            sibling: 0,
            supervisor: 0
          });
        } else {
          rows.push({
            area: area,
            dpm: dpm,
            totalCount: count,
            submitCount: submitCount,
            count: len,
            whole: (whole / len).toFixed(2),
            salar: (salar / len).toFixed(2),
            promotion: (promotion / len).toFixed(2),
            work: (work / len).toFixed(2),
            sibling: (sibling / len).toFixed(2),
            supervisor: (supervisor / len).toFixed(2),
            satisfaction: (
              (whole + salar + promotion + work + sibling + supervisor) /
              (len * 6)
            ).toFixed(2)
          });
        }
        // console.log(rows, len)
      });
    this.rowData = rows;
  }
  // 各科室的答题情况2021
  now_setDepartmentRowData() {
    let newDepart = this.newDepartment();
    let rows = [];
    let department = this.department;
    (this.columnDefs = [
      { headerName: "院区", field: "area" },
      { headerName: "科室", field: "dpm" },
      { headerName: "科室总人数", field: "totalCount" },
      { headerName: "总提交人数", field: "submitCount" },
      { headerName: "清洗后提交人数", field: "count" },
      { headerName: "满意度", field: "satisfaction" },
      { headerName: "总体满意度", field: "whole" },
      { headerName: "薪资福利", field: "salar" },
      { headerName: "发展与晋升", field: "promotion" },
      { headerName: "工作环境与内容", field: "work" },
      { headerName: "同级关系", field: "sibling" },
      { headerName: "上下级关系", field: "supervisor" }
    ]),
      newDepart.forEach(dpm => {
        let count = this.totalPeople(dpm);
        // 计算各科室总提交人数
        let submitCount = this.now_submitTotal(dpm);
        // len  清洗后当前科室提交问卷的份数
        let surveyLog = this.surveyLogArr,
          len: any = 0,
          whole: any = 0,
          salar: any = 0,
          promotion: any = 0,
          work: any = 0,
          sibling: any = 0,
          supervisor: any = 0,
          area: any;
        surveyLog.forEach(log => {
          let departs = log.branch
          let befroDepart = ''
          let subDepartment = []
          if (departs) {
            befroDepart = departs.join(',')
            subDepartment = departs
          }
          let depart: any = "";
          if (
            subDepartment[0] == "党群部门" ||
            subDepartment[0] == "行政部门"
          ) {
            depart = subDepartment[0] + "/" + subDepartment[1];
          } else if (subDepartment[0] == "临床医技类") {
            if (
              befroDepart.indexOf("儿科") > 0 ||
              befroDepart.indexOf("急诊科") > 0
            ) {
              // console.log(log, log.get("department"));
              depart = subDepartment[0] + "/" + subDepartment[1];
            } else {
              if (subDepartment[2]) {
                depart =
                  subDepartment[0] +
                  "/" +
                  subDepartment[1] +
                  "/" +
                  subDepartment[2];
              } else {
                depart = subDepartment[0] + "/" + subDepartment[1];
              }
            }
          } else if (subDepartment[0] == "临床服务类") {
            if (befroDepart.indexOf("呼吸与危重症医学科") > 0) {
              depart = subDepartment[0] + "/" + subDepartment[1];
            } else {
              if (subDepartment[2]) {
                depart =
                  subDepartment[0] +
                  "/" +
                  subDepartment[1] +
                  "/" +
                  subDepartment[2];
              } else {
                depart = subDepartment[0] + "/" + subDepartment[1];
              }
            }
          }
          if (dpm == depart) {
            area = log.seat.area;
            len += 1;
            whole += Number(log.mark.whole);
            salar += Number(log.mark.salar);
            promotion += Number(log.mark.promotion);
            work += Number(log.mark.work);
            sibling += Number(log.mark.sibling);
            supervisor += Number(log.mark.supervisor);
          }
        });
        if (len == 0 || whole == 0) {
          rows.push({
            area: "东湖",
            dpm: dpm,
            totalCount: count,
            submitCount: submitCount,
            count: len,
            whole: 0,
            salar: 0,
            promotion: 0,
            work: 0,
            sibling: 0,
            supervisor: 0
          });
        } else {
          rows.push({
            area: area,
            dpm: dpm,
            totalCount: count,
            submitCount: submitCount,
            count: len,
            whole: (whole / len).toFixed(2),
            salar: (salar / len).toFixed(2),
            promotion: (promotion / len).toFixed(2),
            work: (work / len).toFixed(2),
            sibling: (sibling / len).toFixed(2),
            supervisor: (supervisor / len).toFixed(2),
            satisfaction: (
              (whole + salar + promotion + work + sibling + supervisor) /
              (len * 6)
            ).toFixed(2)
          });
        }
        // console.log(rows, len)
      });

    this.rowData = rows;
  }

  // 拼接科室
  jointDepartment(d, depart) {
    let dp = "";
    if (d[0] == "党群部门" || d[0] == "行政部门") {
      dp = d[0] + "/" + d[1];
    } else if (d[0] == "临床医技类") {
      if (
        depart.get("department").indexOf("儿科") > 0 ||
        depart.get("department").indexOf("急诊科") > 0
      ) {
        // console.log(log, log.get("department"));
        dp = d[0] + "/" + d[1];
      } else {
        if (d[2]) {
          dp = d[0] + "/" + d[1] + "/" + d[2];
        } else {
          dp = d[0] + "/" + d[1];
        }
      }
    } else if (d[0] == "临床服务类") {
      if (depart.get("department").indexOf("呼吸与危重症医学科") > 0) {
        dp = d[0] + "/" + d[1];
      } else {
        if (d[2]) {
          dp = d[0] + "/" + d[1] + "/" + d[2];
        } else {
          dp = d[0] + "/" + d[1];
        }
      }
    } else {
      dp = depart.get("department").replace(/\s/g, "");
    }
    return dp;
  }
  // 拼接科室2021
  now_jointDepartment(d, depart) {
    let dp = "";
    if (d[0] == "党群部门" || d[0] == "行政部门") {
      dp = d[0] + "/" + d[1];
    } else if (d[0] == "临床医技类") {
      if (
        depart.indexOf("儿科") > 0 ||
        depart.indexOf("急诊科") > 0
      ) {
        // console.log(log, log.get("department"));
        dp = d[0] + "/" + d[1];
      } else {
        if (d[2]) {
          dp = d[0] + "/" + d[1] + "/" + d[2];
        } else {
          dp = d[0] + "/" + d[1];
        }
      }
    } else if (d[0] == "临床服务类") {
      if (depart.indexOf("呼吸与危重症医学科") > 0) {
        dp = d[0] + "/" + d[1];
      } else {
        if (d[2]) {
          dp = d[0] + "/" + d[1] + "/" + d[2];
        } else {
          dp = d[0] + "/" + d[1];
        }
      }
    } else {
      dp = depart.replace(/\s/g, "");
    }
    return dp;
  }

  // 计算各科室总共有多少人
  totalPeople(dpm) {
    let count = 0;
    let department = this.department;
    department.forEach(depart => {
      let d = depart
        .get("department")
        .replace(/\s/g, "")
        .split("/");
      let dp = this.jointDepartment(d, depart);
      if (dp == dpm) {
        count += depart.get("count");
      }
    });
    return count;
  }
  // 计算各科室总提交人数
  submitTotal(dpm) {
    let logs = this.surveyLogArr;
    let count = 0;
    logs.forEach(log => {
      let depart = log
        .get("department")
        .replace(/\s/g, "")
        .split("/");
      let dp = this.jointDepartment(depart, log);
      if (dp == dpm) {
        count += 1;
      }
    });
    return count;
  }

  // 计算各科室总提交人数2021
  now_submitTotal(dpm) {
    let logs = this.surveyLogArr;
    let count = 0;
    logs.forEach(log => {
      // let depart = log
      //   .get("department")
      //   .replace(/\s/g, "")
      //   .split("/");
      let depart = log.branch
      let befroDepart = ''
      if (depart) {
        befroDepart = depart.join(',')
        let dp = this.now_jointDepartment(depart, befroDepart);
        if (dp == dpm) {
          count += 1;
        }
      }
    });
    return count;
  }

  // 计算医院员工各维度满意度计算
  dimensionSatisfaction() {
    let salar: number = 0, // 工资福利
      work: number = 0, // 工作环境与内容
      promotion: number = 0, // 发展晋升
      supervisor: number = 0, // 上下级关系
      sibling: number = 0, // 同级关系
      whole: number = 0; // 总体满意度
    // 清洗后
    let cleanSalar: number = 0, // 工资福利
      cleanWork: number = 0, // 工作环境与内容
      cleanPromotion: number = 0, // 发展晋升
      cleanSupervisor: number = 0, // 上下级关系
      cleanSibling: number = 0, // 同级关系
      cleanWhole: number = 0; // 总体满意度
    for (let i = 0; i < this.surveyLogArr.length; i++) {
      let grades = this.surveyLogArr[i].get("grades");
      salar += Number(grades[1].salar) / this.surveyLogArr.length;
      work += Number(grades[3].work) / this.surveyLogArr.length;
      promotion += Number(grades[2].promotion) / this.surveyLogArr.length;
      supervisor += Number(grades[4].supervisor) / this.surveyLogArr.length;
      sibling += Number(grades[5].sibling) / this.surveyLogArr.length;
      whole += Number(grades[6].whole) / this.surveyLogArr.length;
    }
    this.salar = salar.toFixed(2);
    this.work = work.toFixed(2);
    this.promotion = promotion.toFixed(2);
    this.sibling = sibling.toFixed(2);
    this.supervisor = supervisor.toFixed(2);
    this.whole = whole.toFixed(2);
    this.satisfaction = (
      (salar + work + promotion + supervisor + sibling + whole) /
      6
    ).toFixed(2);
    console.log(this.satisfaction);
    for (let i = 0; i < this.cleanSurveyLog.length; i++) {
      let grades = this.cleanSurveyLog[i].get("grades");
      cleanSalar += Number(grades[1].salar) / this.cleanSurveyLog.length;
      cleanWork += Number(grades[3].work) / this.cleanSurveyLog.length;
      cleanPromotion +=
        Number(grades[2].promotion) / this.cleanSurveyLog.length;
      cleanSupervisor +=
        Number(grades[4].supervisor) / this.cleanSurveyLog.length;
      cleanSibling += Number(grades[5].sibling) / this.cleanSurveyLog.length;
      cleanWhole += Number(grades[6].whole) / this.cleanSurveyLog.length;
    }
    console.log(cleanSalar, typeof cleanSalar);
    this.cleanSalar = cleanSalar.toFixed(2);
    this.cleanWork = cleanWork.toFixed(2);
    this.cleanPromotion = cleanPromotion.toFixed(2);
    this.cleanSibling = cleanSibling.toFixed(2);
    this.cleanSupervisor = cleanSupervisor.toFixed(2);
    this.cleanWhole = cleanWhole.toFixed(2);
    this.cleanSatisfaction = (
      (cleanSalar +
        cleanWork +
        cleanPromotion +
        cleanSibling +
        cleanSupervisor +
        cleanWhole) /
      6
    ).toFixed(2);
  }

  // 计算医院员工各维度满意度计算 2021
  now_dimensionSatisfaction() {
    let salar: number = 0, // 工资福利
      work: number = 0, // 工作环境与内容
      promotion: number = 0, // 发展晋升
      supervisor: number = 0, // 上下级关系
      sibling: number = 0, // 同级关系
      whole: number = 0; // 总体满意度

    for (let i = 0; i < this.totals.length; i++) {
      let grades = this.totals[i]
      salar += Number(grades.salar) / this.totals.length;
      work += Number(grades.work) / this.totals.length;
      promotion += Number(grades.promotion) / this.totals.length;
      supervisor += Number(grades.supervisor) / this.totals.length;
      sibling += Number(grades.sibling) / this.totals.length;
      whole += Number(grades.whole) / this.totals.length;
    }

    this.salar = salar.toFixed(2);
    this.work = (work + 10).toFixed(2);
    this.promotion = promotion.toFixed(2);
    this.sibling = sibling.toFixed(2);
    this.supervisor = supervisor.toFixed(2);
    this.whole = whole.toFixed(2);
    console.log(this.supervisor);

    this.satisfaction = (
      (salar + work + promotion + supervisor + sibling + whole) /
      6
    ).toFixed(2);

    console.log(this.satisfaction);

    this.cleanSatisfaction = (
      (salar + work + promotion + supervisor + sibling + whole) / 6
    ).toFixed(2);
  }

  //计算每个维度分数 个人2021
  async getGrade() {
    let surveyItems = new Parse.Query("SurveyItem")
    surveyItems.equalTo("survey", this.id)
    surveyItems.ascending("index")
    let list = await surveyItems.find()
    let chance = 0
    this.surveyLogArr.forEach((req, index) => {
      let seat = {
        area: '东湖',
        part: '其他',
        technicalTitle: '无',
        education: '专科及以下'
      }
      let log = req
      let salar: number = 0, // 工资福利
        work: number = 0, // 工作环境与内容
        promotion: number = 0, // 发展晋升
        supervisor: number = 0, // 上下级关系
        sibling: number = 0, // 同级关系
        whole: number = 0, // 总体满意度
        intention: number = 0; //离职意向率
      let answers = log.answer
      let gradeMap = {}
      list.forEach(item => {
        let id = item.id
        let label = answers[id]

        let grade = 0
        switch (label) {
          case 'A':
            grade = 1
            break;
          case 'B':
            grade = 2
            break;
          case 'C':
            grade = 3
            break;
          case 'D':
            grade = 4
            break;
          case 'E':
            grade = 5
            break;
        }

        let number = Number(item.get("index"))
        if (number == 12 || index == 14 || index == 17 || index == 19) {
          switch (label) {
            case 'A':
              grade = 5
              break;
            case 'B':
              grade = 4
              break;
            case 'C':
              grade = 3
              break;
            case 'D':
              grade = 2
              break;
            case 'E':
              grade = 1
              break;
          }
        }
        let realGread = (((grade - 1) / 4) * 100)
        // 薪资福利
        if (number <= 5) {
          salar += realGread / 5
        }

        //发展晋升
        else if (number > 5 && number <= 9) {
          promotion += realGread / 4
        }

        // 工作环境与内容
        else if (number > 10 && number <= 14) {
          work += realGread / 5
        }

        // 上下级关系
        else if (number > 14 && number <= 17) {
          supervisor += realGread / 3
        }

        // 同级关系
        else if (number > 17 && number <= 21) {
          sibling += realGread / 4
        }
        // 总体满意度
        else if (number == 22) {
          whole = realGread
        }

        else if (number == 24) {
          if (answers[id] == 'A') {
            seat.part = '医生'
          } else if (answers[id] == 'B') {
            seat.part = '护士'

          } else if (answers[id] == 'C') {
            seat.part = '技师'

          } else if (answers[id] == 'D') {
            seat.part = '行政'
          }
        }
        else if (number == 25) {
          if (answers[id] == 'A') {
            seat.education = '博士'
          } else if (answers[id] == 'B') {
            seat.education = '硕士'
          } else if (answers[id] == 'C') {
            seat.education = '本科'
          }
        }
        else if (number == 26) {
          if (answers[id] == 'A') {
            seat.technicalTitle = '高级职称'
          } else if (answers[id] == 'B') {
            seat.technicalTitle = '中级职称'
          } else if (answers[id] == 'C') {
            seat.technicalTitle = '初级职称'
          }
        }
        else if (number == 27) {
          if (answers[id] == 'B') {
            seat.area = '象湖'
          }
        }
        else if (number == 23) {
          if (answers[id] == 'B') {
            intention = 100
            chance ++
          }
        }
      })
      let object = {
        salar,
        promotion,
        work,
        supervisor,
        sibling,
        whole,
        intention
      }
      this.probability = ((chance / this.surveyLogArr.length)* 100).toFixed(2) 
      console.log(this.probability);
      
      this.surveyLogArr[index].seat = seat
      this.surveyLogArr[index].mark = object
      this.totals.push(object)
    });
  }

  // 表格大小自适应
  onGridReady(params) {
    return;
    console.log(params);
    console.log("onGridReady");

    this.api = params.api;
    this.columnApi = params.columnApi;

    params.api.sizeColumnsToFit();
    // this.calculateRowCount();
  }
  // 生成图表
  chart(item) {
    var params: CreateRangeChartParams = {
      cellRange: {
        columns: [
          item.cate,
          "whole",
          "salar",
          "promotion",
          "work",
          "sibling",
          "supervisor"
        ]
      },
      chartType: "groupedColumn",
      chartPalette: "bright",
      aggFunc: "avg",
      processChartOptions: function (params) {
        var opts = params.options;
        opts.title.enabled = true;
        opts.title.text = item.name;
        if (opts.xAxis) {
          opts.xAxis.label.rotation = 30;
        }
        opts.seriesDefaults.tooltip.renderer = function (params) {
          var titleStyle = params.color
            ? ' style="color: white; background-color:' + params.color + '"'
            : "";
          var title = params.title
            ? '<div class="ag-chart-tooltip-title"' +
            titleStyle +
            ">" +
            params.title +
            "</div>"
            : "";
          var value = params.datum[params.yKey]
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          return (
            title +
            '<div class="ag-chart-tooltip-content" style="text-align: center">' +
            value +
            "</div>"
          );
        };
        return opts;
      }
    };
    this.api.createRangeChart(params);
  }
}
