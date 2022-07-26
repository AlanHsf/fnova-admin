import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard-trade',
  templateUrl: './dashboard-trade.component.html',
  styleUrls: ['./dashboard-trade.component.scss']
})
export class DashboardTradeComponent implements OnInit {

  constructor() { }

  collection: Array<object> = [
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
    {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    }, {
      name: '螺纹',
      num: 123,
      address: '南昌市东湖区',
      date: '2022-6-10'
    },
  ]
  information: Array<string> = [
    '三大指标超预期5月金融数据提信心',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
    '三大指标超预期5月金融数据提信心',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
    '三大指标超预期5月金融数据提信心',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
    '三大指标超预期5月金融数据提信心',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
    '三大指标超预期5月金融数据提信心',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
    '三大指标超预期5月金融数据提信心',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
    '三大指标超预期5月金融数据提信心',
    '5-6月煤炭进口持续疲软',
    '通胀爆表，美国下一步要对国际航运公司下手了',
  ]
  options = {
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
        data: ['一月', '二月', '三月', '四月', '五月', '六月'],
        textStyle: {
          color: "#fff"
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '重工',
        type: 'bar',
        emphasis: {
          focus: 'series'
        },
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: '盘螺',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        color: "#91cd74",
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '轻工业',
        type: 'bar',
        stack: 'Ad',
        emphasis: {
          focus: 'series'
        },
        data: [220, 182, 191, 234, 290, 330, 310],
        color: "#40a9ff",
      },
    ]
  };

  top: number = 0
  time: any

  ngOnInit() {
    this.lunbo()
  }

  ngOnDestroy(): void {
    this.time && clearTimeout(this.time)
  }

  lunbo() {
    let parent = document.getElementById('parent');
    let parent2 = document.getElementById('parent2');
    let that = this
    this.time = setTimeout(() => {
      parent.scrollTop ++;
      parent2.scrollTop ++;
      if( Number(parent.scrollTop) % 20 == 0){
        that.information.push('5-6月煤炭进口持续疲软','通胀爆表，美国下一步要对国际航运公司下手了',)
        that.collection.push({
          name: '螺纹',
          num: 123,
          address: '南昌市东湖区',
          date: '2022-6-10'
        })
      }
      that.lunbo()
    }, 20)
  }

}
