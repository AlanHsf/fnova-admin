import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-dashboard-security',
  templateUrl: './dashboard-security.component.html',
  styleUrls: ['./dashboard-security.component.scss']
})
export class DashboardSecurityComponent implements OnInit {

  video_url: string = 'https://static.shanhaibi.com/market/theme/video_hd/7e334a17c3d7d1533e15b551d223515c.mp4'
  videos: any = [
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',

    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
    'https://file-cloud.fmode.cn/mda-mik3wb9csixjakcw.mp4',
  ]
  peoples: any = [
    'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/v61cno053655.png',
    'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/43pc13053655.png',
    'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/mq0o61053655.png',
    'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/1a41l9053655.png'
  ]
  fsIMg: string = 'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/80lbl5054422.png'
  carImg: string = 'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/gs1ac7060716.png'
  option = {
    textStyle: {
      color: "#fff"
    },
    title: {
      text: ''
    },
    legend: {
      data: ['']
    },
    radar: {
      shape: 'circle',
      indicator: [
        { name: '门闸门禁', max: 6500 },
        { name: '车闸门禁', max: 16000 },
        { name: '车闸门禁', max: 30000 },
        { name: '车闸门禁', max: 38000 },
        { name: '车闸门禁', max: 52000 },
        { name: '车闸门禁', max: 25000 },
      ],
    },
    series: [
      {
        name: '',
        type: 'radar',
        data: [
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: 'Actual Spending'
          }
        ]
      }
    ]
  };
  option2 = {
    color: ['#80FFA5'],
    textStyle: {
      color: "#fff"
    },
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: []
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['00:00', '06:00', '12:00', '20:00', '24:00']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Line 1',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(128, 255, 165)'
            },
            {
              offset: 1,
              color: 'rgb(1, 191, 236)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: [140, 232, 101, 210, 90, 10]
      }
    ]
  };
  option3 = {
    textStyle: {
      color: "#fff"
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['住宅人口', '西侧出入口', '东侧出入口'],
      }
    ],
    yAxis: [
      {
        type: 'value'
      },
    ],
    series: [
      {
        name: '进入人员',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320],
        color: '#fed418',
      },
      {
        name: '外出人员',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        color: "#0fd1ff",
        data: [120, 132, 101, 134, 90, 230, 210]
      },
    ]
  };
  journals: any = [
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '人员经过',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
    {
      name: '车辆驶入',
      type: '检测正常',
      date: '2022-6-10',
      state: '已响应'
    },
  ]
  option4 = {
    textStyle: {
      color: "#fff"
    },
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['A', 'B', 'C', 'D', 'E']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '06:00', '12:00', '18:00', '24:00']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };


  anfang: string = 'https://file-cloud.fmode.cn/anfang.png'
  anfang1: string = 'https://file-cloud.fmode.cn/anfang2.png'
  anfang2: string = 'https://file-cloud.fmode.cn/anfang3.png'


  af_pople1: string = 'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/dmqs1j070008.png'
  af_pople2: string = 'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/eqtlef070008.png'
  af_car1: string = 'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/mih1ib070008.png'
  af_car2: string = 'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/484334070009.png'
  dash_cp: string = 'https://file-cloud.fmode.cn/BhPMF1CRTy/20220612/s7dr1o071941.png'
  
  constructor(private message: NzMessageService) { }

  ngOnInit() {
    this.lunbo()
    // this.openFullscreen()
  }

  ngOnDestroy(): void {
    this.time && clearTimeout(this.time)

  }

  openFullscreen() {
    /* 获取(<html>)元素以全屏显示页面 */
    const full: any = document.getElementById('content')
    if (full.RequestFullScreen) {
      full.RequestFullScreen()
      //兼容Firefox
    } else if (full.mozRequestFullScreen) {
      full.mozRequestFullScreen()
      //兼容Chrome, Safari and Opera等
    } else if (full.webkitRequestFullScreen) {
      full.webkitRequestFullScreen()
      //兼容IE/Edge
    } else if (full.msRequestFullscreen) {
      full.msRequestFullscreen()
    }
  }
  
  time: any
  lunbo() {
    let parent = document.getElementById('parent');
    let that = this
    this.time = setTimeout(() => {
      parent.scrollTop++;
      if (Number(parent.scrollTop) % 20 == 0) {
        that.journals.push(
          {
            name: '车辆驶入',
            type: '检测正常',
            date: '2022-6-10',
            state: '已响应'
          },
          {
            name: '人员经过',
            type: '检测正常',
            date: '2022-6-10',
            state: '已响应'
          },
        )
      }
      that.lunbo()
    }, 20)
  }
  currentVideo:string
  show:boolean

  onShowModel(item){
    this.show = true
    this.currentVideo = item
  }
  onColse(){
    this.show = false
  }

  onScreent(){
    this.message.success('抓拍成功，已存储至云数据');
  }
}
