import { Component, OnInit, ChangeDetectorRef, DoCheck } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { EChartOption } from "echarts";
import * as Parse from "parse";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import "echarts/map/js/china.js";
import "../../../assets/js/bi-bg.js"
// import { setInterval } from 'timers';

@Component({
  selector: "app-cockpit-dashboard",
  templateUrl: "./cockpit-dashboard.component.html",
  styleUrls: ["./cockpit-dashboard.component.scss"]
})
export class CockpitDashboardComponent implements OnInit {
  dateArr: any = [];
  option1: EChartOption = {};
  option2: EChartOption = {};
  mapOption: EChartOption = {};
  footerItems: any = [];
  reportArray: any = [];
  isVisible: Boolean = false;
  table: any = [];
  tableMap: any = [];
  mapData: any = [];
  areaArray: any = [];
  randomOption: any;
  cate: any;
  constructor(
    private http: HttpClient,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
      let RID = params.get("Rid");
      let company = params.get("company");
      let cate = params.get("cate");
      let queryReport = new Parse.Query("BIReportArray");
      this.cate = cate
      queryReport.equalTo("company", company);
      queryReport.equalTo("category", cate);
      queryReport.equalTo("report", RID);
      let result = await queryReport.first();

      this.reportArray = result.get("ReportArray");
      console.log(this.reportArray);
      this.reportArray.forEach(item => {
        item.chartOption.title.left = "center";
        item.chartOption.toolbox.show = false;
        if (item.view == "pie") {
          item.chartOption.grid = {
            left: "4%",
            right: "4%",
            top: "8%",
            bottom: "1%",
            containLabel: true
          };
        } else {
          item.chartOption.grid = {
            left: "4%",
            right: "4%",
            bottom: "1%",
            containLabel: true
          };
        }

        item.chartOption.legend = {
          left: "20",
          top: 25,
          textStyle: {
            color: "#FFF"
          }
        };
        if (item.view == "bar" || item.view == "bar-y") {
          item.chartOption.series[0].itemStyle.normal = {
            color: function() {
              var colorList = [
                "#ffc107",
                "#00796b",
                "#5367fc",
                "#56a6d1",
                "#2469aa",
                "#df4d3b",
                "#752091",
                "#ff1d55",
                "#009966",
                "#FF9933"
              ];
              let index = Math.floor(Math.random() * 10);
              return colorList[index];
            }
          };
        }
        if (item.view == "bar-waterfall") {
          item.chartOption.series[1].itemStyle.normal = {
            color: function() {
              var colorList = [
                "#ffc107",
                "#00796b",
                "#5367fc",
                "#56a6d1",
                "#2469aa",
                "#df4d3b",
                "#752091",
                "#ff1d55",
                "#009966",
                "#FF9933"
              ];
              let index = Math.floor(Math.random() * 10);
              return colorList[index];
            }
          };
        }
      });
      let diyReportArray: any = result.get("ReportArrayDiy");
      if (diyReportArray) {
        this.reportArray = this.reportArray.concat(diyReportArray);
      }
      console.log(this.reportArray);
      await this.setData();
      if (cate == "sdCVGZqrCT") {
        await this.queryAreaItem();
      } else {
       this.randomOption = this.reportArray[0];
      }
    });
    this.footerItems = [
      { name: "销售区域图" },
      { name: "销售区域图" },
      { name: "销售区域图" },
      { name: "销售区域图" }
    ];
    this.showDate();
    // await this.setData();
  }
  
  ngAfterViewInit() {
    let i = 0;
    setInterval(() => {
      if (this.reportArray[i].data && !this.reportArray[i].dataArr) {
        console.log(this.reportArray[i].data, this.reportArray[i].tableColumn)
        let dataArr: any = []
        dataArr[0] =[null, ...this.reportArray[i].tableColumn] 
        this.reportArray[i].data.forEach((item, i) => {
          dataArr[i + 1] = []
          for (const key in item) {
            dataArr[i + 1].push(item[key]);
          }
        });
        console.log(dataArr);
        this.reportArray[i].dataArr = dataArr
      }
      
      this.randomOption = this.reportArray[i];
      i += 1
      if (i >= this.reportArray.length) {
        i=0
      }
    }, 5000)
  }
  // 时间显示
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
  randomValue() {
    return Math.round(Math.random() * 1000);
  }
 

  setData() {
    let rlen = this.reportArray.length;
    this.table = [
      {
        name: "左上表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "左下表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "右上表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "右下表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "底部一表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "底部二表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "底部三表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "底部四表",
        option: this.reportArray[Math.floor(Math.random() * rlen)],
        showTable: false
      },
      {
        name: "中间地图",
        option: this.reportArray[Math.floor(Math.random() * rlen)]
      }
    ];
    this.option1 = {
      title: {
        text: "销售毛利图",
        left: "center",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      grid: {
        left: "10%",
        right: "0",
        bottom: "1%",
        containLabel: true
      },
      legend: {
        orient: "vertical",
        left: 12,
        top: 12,
        data: [
          "直达",
          "营销广告",
          "搜索引擎",
          "邮件营销",
          "联盟广告",
          "视频广告",
          "百度"
        ],
        textStyle: {
          color: "#FFF"
        }
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          selectedMode: "single",
          radius: [0, "30%"],
          center: ["60%", "50%"],
          label: {
            position: "inner"
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 335, name: "直达", selected: true },
            { value: 679, name: "营销广告" },
            { value: 1548, name: "搜索引擎" }
          ]
        },
        {
          name: "访问来源",
          type: "pie",
          radius: ["40%", "55%"],
          center: ["60%", "50%"],
          data: [
            { value: 335, name: "直达" },
            { value: 310, name: "邮件营销" },
            { value: 234, name: "联盟广告" },
            { value: 135, name: "视频广告" },
            { value: 1048, name: "百度" }
          ]
        }
      ]
    };
    this.option2 = {
      title: {
        text: "销售区域图",
        left: "center",
        textStyle: {
          color: "#dcdcdc"
        }
      },
      legend: {
        left: "20%",
        top: 25,
        textStyle: {
          color: "#FFF"
        }
      },
      tooltip: {},
      dataset: {
        source: [
          ["product", "2015", "2016", "2017"],
          ["产品一", 43.3, 85.8, 93.7],
          ["产品二", 83.1, 73.4, 55.1],
          ["产品三", 86.4, 65.2, 82.5],
          ["产品四", 72.4, 53.9, 39.1]
        ]
      },
      xAxis: {
        type: "category",
        axisLabel: {
          interval: 0,
          color: "#fff"
        }
      },
      yAxis: {
        type: "value",
        axisLabel: {
          interval: 0,
          color: "#fff"
        }
      },
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }]
    };
  }
  setMapOption(item) {
    let mapData: any = [];
    if (item.view == "bar-waterfall") {
      let data1: any = item.chartOption.series[1].data;
      let data2 = item.chartOption.xAxis.data;
      data1.forEach((d, index) => {
        if (index > 0) {
          mapData.push({ name: data2[index], value: d });
        }
      });
    } else if (item.view == "bar") {
      let data1: any = item.chartOption.series[0].data;
      let data2 = item.chartOption.xAxis.data;
      data1.forEach((d, index) => {
        mapData.push({
          name: data2[index],
          value: d,
          label: {
            show: true
          }
        });
      });
    } else if (item.view == "pie") {
      mapData = item.chartOption.series[0].data;
    }
    console.log(mapData);
    let max: any;
    mapData.reduce((p, item, index) => {
      max = item.value;
      max = max > item.value ? max : item.value;
    }, 0);

    this.mapOption = {
      title: item.chartOption.title,
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} )"
      },
      visualMap: [
        {
          min: 1,
          max: max,
          left: "left",
          top: "bottom",
          text: ["高", "低"], //取值范围的文字
          inRange: {
            color: ["#e0ffff", "#006edd"] //取值范围的颜色
          },
          show: true, //图注
          textStyle: {
            color: "#fff"
          }
        }
      ],
      geo: {
        map: "china",
        roam: true, //不开启缩放和平移
        zoom: 1.23, //视角缩放比例
        label: {
          normal: {
            show: true,
            fontSize: "16",
            color: "rgba(0,0,0,0.7)",
            textStyle: {
              color: "#111111" // 地名 文字颜色
            }
          }
        },
        itemStyle: {
          normal: {
            borderColor: "rgba(0, 0, 0, 0.2)"
          },
          emphasis: {
            areaColor: "#F3B329", //鼠标选择区域颜色
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      },
      series: [
        {
          name: "",
          type: "map",

          map: "chain",
          nameMap: {
            Chain: "中国"
          },
          geoIndex: 0,
          data: mapData,
          label: {
            normal: {
              show: true, // 这个是关键点， 默认显示 false
              formatter: "{b}: {c}",
              position: "top", //  位置
              backgroundColor: "rgba(254,174,33,1)", // 背景色
              padding: [0, 0], // 左右间距
              borderRadius: 3, //  圆角
              lineHeight: 32, //  行高
              color: "#f7fafb", //  颜色
              rich: {
                // 自定义样式
                fline: {
                  padding: [0, 10, 10, 10],
                  color: "#ffffff"
                },
                tline: {
                  padding: [10, 10, 0, 10],
                  color: "#ffffff"
                }
              }
            }
          }
        }
      ]
    };
  }
  // 查找有地的reportArray项
  queryAreaItem() {
    let area: any = [];
    this.reportArray.forEach(item => {
      console.log(item.tags)
      if (item.tags && item.tags.indexOf("区域") >= 0 && item.view != "bar-label") {
        area.push(item);
      }
    });
    console.log(area);
    this.areaArray = area;
    this.setMapOption(area[0]);
  }
  // 切换图表
  changeReport() {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }
  handleOk() {
    this.isVisible = false;
    this.cdRef.detectChanges();
  }
  changeTable(event, i) {
    this.table[i].option = event;
  }
  changeMap(event, i) {
    console.log(event, i);
    this.setMapOption(event);
  }
  back() {
    window.history.back();
  }

  changeShow(table) {
    console.log(table);
    table.showTable = !table.showTable;
  }
}
