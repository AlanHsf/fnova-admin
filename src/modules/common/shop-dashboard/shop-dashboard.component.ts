import { Component, OnInit } from '@angular/core';
import { EChartOption } from "echarts"

@Component({
    selector: 'app-shop-dashboard',
    templateUrl: './shop-dashboard.component.html',
    styleUrls: ['./shop-dashboard.component.scss']
})
export class ShopDashboardComponent implements OnInit {

    constructor() { }
    chartOption1:any  = {
        xAxis: {
            type: 'category',
            data: ['一', '二', '三', '四', '五', '六', '七']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };
    chartOption2:EChartOption  = {
        title: {
            text: '品类销量',
            subtext: '前五',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'right'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: '手机' },
                    { value: 735, name: '衣服' },
                    { value: 580, name: '鞋子' },
                    { value: 484, name: '零食' },
                    { value: 300, name: '酒水' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    ngOnInit() {
    }

}
