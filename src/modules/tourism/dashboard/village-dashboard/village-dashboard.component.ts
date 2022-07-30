import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import * as echarts from 'echarts';
import { ParseService } from '../../service/parse.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
	selector: 'app-village-dashboard',
	templateUrl: './village-dashboard.component.html',
	styleUrls: ['./village-dashboard.component.scss']
})
export class VillageDashboardComponent implements OnInit {

	populatData: any;
	options: any;
	histogrimOptions: any;// 村落人口对比图参数
	histogrimData: any;// 村落人口对比图参数
	merchantOptions: any;// 商户排名图参数
	merchantData: any;
	OrderOptions: any;// 消费类型份额环形图参数
	todayOrders: any;
	passengerCountsData: any;// 旅客接待量数据
	PopulatOptions: any;// 营业对比折线图参数

	year: number;// 当前选择年份
	month: number;// 当前选择年份
	date: any;// 当前选择年份
	mapOptions: any;
	backgroundColor: string = '#0A2E5D'
	fullscreen: boolean = false;
	weather:any
	constructor(
		private http: HttpClient,
		private el: ElementRef,
		private parseServ: ParseService,
		private cdRef: ChangeDetectorRef,
		private message: NzMessageService,

	) { }
	switchFullScreen() {
		// ng.getHostElement(componentOrDirective: {'tourism-dashboard'}): Element
		// document.documentElement 改为 hostElement  直接网页全屏会连带当前组件外部内容一同全屏，
		// this.el.nativeElement 获取当前组件元素，指定当前组件元素全屏
		const hostElement = this.el.nativeElement;
		if (!this.fullscreen) {
			const docElmWithBrowsersFullScreenFunctions = hostElement as HTMLElement & {
				// const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
				mozRequestFullScreen(): Promise<void>;
				webkitRequestFullscreen(): Promise<void>;
				msRequestFullscreen(): Promise<void>;
			};
			console.log(docElmWithBrowsersFullScreenFunctions);

			if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
				docElmWithBrowsersFullScreenFunctions.requestFullscreen();
			} else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) { /* Firefox */
				docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
			} else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
				docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
			} else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) { /* IE/Edge */
				docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
			}
			this.fullscreen = true;
		} else {
			const docWithBrowsersExitFunctions = document as Document & {
				mozCancelFullScreen(): Promise<void>;
				webkitExitFullscreen(): Promise<void>;
				msExitFullscreen(): Promise<void>;
			};
			if (docWithBrowsersExitFunctions.exitFullscreen) {
				docWithBrowsersExitFunctions.exitFullscreen();
			} else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
				docWithBrowsersExitFunctions.mozCancelFullScreen();
			} else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
				docWithBrowsersExitFunctions.webkitExitFullscreen();
			} else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
				docWithBrowsersExitFunctions.msExitFullscreen();
			}
			this.fullscreen = false;
		}

	}
	checkFull() {
		let full_status = document['fullscreen'] || document['webkitIsFullScreen'] || document['mozFullScreen'] || false;
		if (!full_status) {
			this.fullscreen = false;
		} else {
			this.fullscreen = true;
		}
	}
	async ngOnInit() {
		window.addEventListener("resize", () => {
			this.checkFull();
		});
		this.date = new Date()
		let year = this.date.getFullYear()
		let month = this.date.getFullYear()
		this.initHistogrim()
		this.initMerchant()
		this.initEchartsOrder()
		this.initEchartsLine(this.date)
		this.initShopPassengerData()
		this.getWeather(year, month)

	}
	initHistogrim() {
		// histogrimData
		let dataAxis = ['2020', '2021', '2022'];
		let columns = ['褚家村', '山坡村', "山湾村", "石人沟口村", "丁家湾村", "南八运村"];

		let populatData = [// [村[年]]
			[223, 254, 304, 321, 330, 360, 384],
			[223, 254, 274, 321, 338, 340, 364],
			[251, 254, 264, 281, 298, 300, 304],
			[223, 254, 304, 321, 330, 360, 384],
			[223, 254, 274, 321, 338, 340, 364],
			[251, 254, 264, 281, 298, 300, 304],
		];
		let color = [
			"#9489fa",
			"#f06464",
			"#f7af59",
			"#f0da49",
			"#71c16f",
			"#2aaaef",
			"#5690dd",
			"#bd88f5",
			"#009db2",
			"#024b51",
			"#0780cf",
			"#765005",
		]

		let datas = [];
		columns.map((item, index) => {
			datas.push({
				// value: item,
				name: item,// 图例文字
				type: 'bar',// 图表类型
				barWidth: 6, // 柱子宽度
				// barGap: '30%',// 柱子间距 柱子宽度的百分百
				distance: 4, // 距离图形元素的距离
				showBackground: true,
				itemStyle: {
					color: color[index],
					borderColor: color[index],
					shadowColor: color[index],
					barBorderRadius: [20, 20, 0, 0], // 圆角（左上、右上、右下、左下）
					// offset:[] // 文字偏移[x,y]
					// formatter:[] // 文字格式化
					// new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					//   { offset: 0, color: '#83bff6' },
					//   { offset: 0.5, color: '#188df0' },
					//   { offset: 1, color: '#188df0' }
					// ])
				},
				emphasis: {
					itemStyle: {
						color: color[index],
						borderColor: color[index],
						shadowColor: color[index]
					}
				},
				data: populatData[index]
			})
			// datas.push({
			//   symbolSize: 100,
			//   // symbol: img[index],
			//   name: item,
			//   type: "line",
			//   yAxisIndex: 1,
			//   data: data1[index],
			//   itemStyle: {
			//     normal: {
			//       borderWidth: 5,
			//       color: color[index],
			//     },
			//   },
			// });
		});
		this.histogrimOptions = {
			title: {
				text: '各村落人口对比图',
				subtext: '',
				textStyle: {
					color: '#ffffff',
					fontSize: '20',
					fontWeight: 'normal',
				},
				// textAlign: 'center',
				left: 'center',// 水平居中
				top: 0
			},
			legend: {
				// type: "scroll",
				data: columns,
				itemWidth: 16,// 图例标记宽度
				itemHeight: 16,// 图例标记高度
				top: '10%',
				left: '4%',
				textStyle: {
					color: "#ffffff",
					fontSize: 14,
				},
			},
			grid: {
				containLabel: true,
				left: '6%',
				bottom: '6%',
				top: '30%',
				right: '6%',
			},
			xAxis: {
				data: dataAxis,
				axisLabel: {
					inside: false,
					color: '#fff',
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: true// 显示坐标轴轴线
				},
				z: 10,

			},
			yAxis: {
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					color: '#999'
				}
			},
			dataZoom: [
				{
					type: 'inside'
				}
			],
			tooltip: {
				trigger: 'axis',
				position: function (pt) {
					return [pt[0], '10%'];
				}
			},
			series: datas
		};
		// Enable data zoom when user click bar.



	}
	merchantInterval
	async initMerchant() {
		let data = await this.parseServ.getDepartMerchantsData()
		this.merchantData = data;
		var parent = document.getElementById('merchant');//获取Dom
		this.merchantInterval=setInterval(function () {
			if((parent.scrollTop++) == (parent.scrollTop)&&(parent.scrollTop!=0)) {
				parent.scrollTop = 0;
			} else {
				parent.style.transform='translateY(2px)';
				parent.style.transition='all 50ms ease 0s';

			}
		 }, 50);
	}

	async initEchartsOrder() {
		let orders = await this.parseServ.getTodayOrdersData()// 当天订单数据
		console.log(orders);
		this.todayOrders = orders;
		var parent = document.getElementById('mealOrder');//获取Dom
		this.merchantInterval=setInterval(function () {
			if((parent.scrollTop++) == (parent.scrollTop)&&(parent.scrollTop!=0)) {
				parent.scrollTop = 0;
			} else {
				parent.style.transform='translateY(2px)';
				parent.style.transition='all 50ms ease 0s';

			}
		 }, 50);
		let aggreOrderData = await this.parseServ.getOrderAggregateData()// 订单综合数据
		let total = 0;// 订单总数
		aggreOrderData.map(item => {
			console.log(item);
			total += +item.totalPrice
		})

		console.log(aggreOrderData);
		let img =
			"data:image/png;base64,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";

		let data = [];
		let color = [
			"#9489fa",
			"#f06464",
			"#f7af59",
			"#f0da49",
			"#71c16f",
			"#2aaaef",
			"#5690dd",
			"#bd88f5",
			"#009db2",
			"#024b51",
			"#0780cf",
			"#765005",
		]
		let value:any
		if(total > 10000) {
			value = (total /10000).toFixed(3) + 'W'
		} else {
			value = total
		}
		for (let i = 0; i < aggreOrderData.length; i++) {
			data.push(
				{
					value: aggreOrderData[i].totalPrice,
					name: aggreOrderData[i].type,
					itemStyle: {
						normal: {
							borderWidth: 5,
							shadowBlur: 20,
							borderColor: color[i],
							shadowColor: color[i],
						},
					},
				},
				{
					value: 2,
					name: "",
					itemStyle: {
						normal: {
							label: {
								show: false,
							},
							labelLine: {
								show: false,
							},
							color: "rgba(0, 0, 0, 0)",
							borderColor: "rgba(0, 0, 0, 0)",
							borderWidth: 0,
						},
					},
				}
			);
		}
		let seriesOption = [
			{
				name: "",
				type: "pie",
				clockWise: false,
				radius: [75, 78],// 环形图 内外直径
				hoverAnimation: false,
				itemStyle: {
					normal: {
						label: {
							show: true,
							position: "outside",
							color: "#ddd",
							formatter: function (params) {
								var percent: any = 0;
								var total = 0;
								for (var i = 0; i < aggreOrderData.length; i++) {
									total += +aggreOrderData[i].totalPrice;
								}
								percent = ((params.value / total) * 100).toFixed(0);
								if (params.name !== "") {
									return (
										params.name +
										"\n \n" +
										percent +
										"%"
									);
								} else {
									return "";
								}
							},
						},
						labelLine: {
							length: 12,
							length2: 54,
							show: true,
							color: "#00ffff",
						},
					},
				},
				data: data,
			},
		];
		console.log(total);

		this.OrderOptions = {
			color: color,
			title: {
				text: value,
				subtext: '营业总额',
				top: "46%",
				textAlign: "center",
				left: "49%",
				textStyle: {
					color: "#fff",
					fontSize: 26,
					fontWeight: "400",
				},
			},
			graphic: {
				elements: [
					{
						type: "image",
						z: 3,
						style: {
							image: img,
							width: 108,
							height: 108,
						},
						left: "center",
						top: "center",
						position: [100, 100],
					},
				],
			},
			tooltip: {

			},
			legend: {
				icon: "circle",
				data: aggreOrderData.map(item => { return item.type }),
				left: 'left',
				textStyle: {
					color: "#fff",
				},
				itemGap: 20,
			},
			toolbox: {
				show: false,
			},
			series: seriesOption,
		};

	}

	async initEchartsLine(e) {
		console.log(e)
		this.initYears(e)
		let startTime = this.year + "-" + this.month + "-" + "01" + " 00:00:00"
		let endTime = this.year + "-" + this.month + "-" + this.dayArr.length + " 23:59:57"
		let roomList = await this.parseServ.getMonthRoomList(startTime,endTime )
		let mealList = await this.parseServ.getMonthMealList(startTime,endTime)
		let dayMealPrice = []
		let dayRoomPrice = []
		console.log(roomList, mealList, this.dayArr)
		this.dayArr.forEach(day => {
			let date = this.year + '-' + this.month  + '-' + day
			if(mealList && mealList.length > 0) {
				let item = mealList.find(item => {
					if(date == item.d) {
						return true
					}
				})
				if(item) {
					dayMealPrice.push(item.totalPrice ? item.totalPrice : 0)
				}else {
					dayMealPrice.push(0)
				}
			}else {
				dayMealPrice.push(0)
			}

			if(roomList && roomList.length > 0) {
				let room = roomList.find(item => {
					if(date == item.d) {
						return true
					}
				})
				if(room) {
					dayRoomPrice.push(room.totalPrice ? room.totalPrice : 0)
				}else {
					dayRoomPrice.push(0)
				}
			}else {
				dayRoomPrice.push(0)
			}
		})
		console.log(dayRoomPrice, dayMealPrice)
		this.PopulatOptions = {
			title: {
				text: "本月商户营收",
				textStyle: {
					color: "#fff",
					fontSize: 22,
					fontWeight: 'normal'
				},
			},

			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['民宿营收', '餐饮营收'],
				textStyle: {
					color: "#fff",
					fontSize: 16,
					fontWeight: 'normal'
				},
			},
			toolbox: {
				show: true,
				feature: {
					dataView: { show: true, readOnly: false },
					magicType: { show: true, type: ['line', 'bar'] },
					restore: { show: true },
					saveAsImage: { show: true }
				}
			},
			calculable: true,
			xAxis: [
				{
					type: 'category',
					data: this.dayArr,
					axisLabel: {
						inside: false,
						color: '#fff',
					}
				}

			],
			yAxis: [
				{
					type: 'value',
					axisLabel: {
						inside: false,
						color: '#fff',
					}
				}
			],
			series: [
				{
					name: '民宿营收',
					type: 'bar',
					data: dayRoomPrice,
					markPoint: {
						data: [
							{ type: 'max', name: 'Max' },
							{ type: 'min', name: 'Min' }
						]
					},
					markLine: {
						data: [{ type: 'average', name: 'Avg' }]
					},
					itemStyle: {
						normal: {
							color: "#75b52f",

						}
					},
				},
				{
					name: '餐饮营收',
					type: 'bar',
					data: dayMealPrice,
					markPoint: {
						data: [
							{ type: 'max', name: 'Max' },
							{ type: 'min', name: 'Min' }
						]
					},
					markLine: {
						data: [{ type: 'average', name: 'Avg' }]
					},
					itemStyle: {
						normal: {
							color: "#78b6f3",

						}
					},
				}
			]
		};
		this.cdRef.detectChanges()
		//当点击legend选项时折线上的小图片会消失，为避免这种情况，可以采取以下初始化方法 使用svg
		//var myCharts = echarts.init(document.getElementById('AnalysisChartLine'), null, {renderer: 'svg'});
		//myCharts.clear();
		//myCharts.setOption(option)
	}
	// 旅客接待量数据
	async initShopPassengerData() {
		let roomOrder = await this.parseServ.getRoomOrder()
		this.passengerCountsData = roomOrder;
		var parent = document.getElementById('roomOrder');//获取Dom
		this.merchantInterval=setInterval(function () {
			if((parent.scrollTop++) == (parent.scrollTop)&&(parent.scrollTop!=0)) {
				parent.scrollTop = 0;
			} else {
				parent.style.transform='translateY(2px)';
				parent.style.transition='all 50ms ease 0s';

			}
		 }, 50);
	}

	alterSaleMonthsToContinuMonths(monthArr) {
		monthArr = [...new Set(monthArr)]
		monthArr.sort((a, b) => {
			return b - a;
		})
		console.log(monthArr);
		if (monthArr.length) {
			let length = monthArr[0].startsWith('0') ? monthArr[0].slice(1) : monthArr[0];
			console.log(length);
			let arr = [...new Array(Number(length)).keys()]
			console.log(arr);
			return arr.map(item => item < 10 ? '0' + (item + 1) : item + 1)
		} else {
			return []
		}
	}
	getCurrentYear() {
		return new Date().getFullYear();
	}
	dayArr:any
	initYears(e?) {
		let d = e ? e : new Date();
		console.log(d)
		let data = new Date(d.getFullYear(), d.getMonth() + 1, 0);
		let day = data.getDate();
		this.year = d.getFullYear()
		this.month = d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() +1)
		let dayArr = []
		for (let i = 0; i < day; i++) {
			if(i< 9) {
				dayArr.push( "0"+(i + 1))
			}else{
				dayArr.push((i + 1))
			}

		}
		this.dayArr = dayArr

	}

	onChange(e) {
		this.initEchartsLine(e)
	}
	turnoverClick(event) {
		console.log(event);
		let index = event.dataIndex;
		this.PopulatOptions.dataZoom[0].start = 60
		this.PopulatOptions.dataZoom[0].end = 100
		this.cdRef.detectChanges()
	}
	weatherDate
	async getWeather(year , month) {
		return new Promise((resolve, reject) => {
			console.log(11111)
			let baseurl = "http://wthrcdn.etouch.cn/weather_mini?city=阜康";
			let headers: HttpHeaders = new HttpHeaders({});
			headers.append("Content-Type", "text");
			this.http.get(baseurl, { headers: headers }).subscribe((res:any) => {
				if(res && res.status == 1000) {
					this.weather = res.data
					this.weatherDate = year + '年' + month + "月" + res.data.forecast[0].date
					resolve(res.data)
				}else {
					reject('网络繁忙，数据获取失败')
				}

			});
		})
	}
	// timeGetDate
	ngOnDestroy() {
		clearInterval(this.merchantInterval)//关闭循环
	}
}
