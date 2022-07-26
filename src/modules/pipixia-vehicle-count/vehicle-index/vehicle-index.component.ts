import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-vehicle-index',
  templateUrl: './vehicle-index.component.html',
  styleUrls: ['./vehicle-index.component.scss'],
})
export class VehicleIndexComponent implements OnInit {
  thead = ['车辆编号', '车辆类型', '车辆状态', '实时位置', '设备卡号',]
  theads = ['车辆编号', '类型', '电压', '低电量', '实时位置',]
  searchParam = { vo_id: '', start_time: '', end_time: '' }
  AMap = window["AMap"]
  baseCount = {
    sale: 0, // 基础收益增加21495
    order: 0, // 基础订单增加4987
    bike: 0,  // 基础车辆增加2021
    multi:1    // 七日收益放大21倍
  }
  constructor(
    private http: HttpClient,

  ) {
    this.showFuture();
  }
  showToday(){
    this.baseCount = {
      sale: 0, // 基础收益增加21495
      order: 0, // 基础订单增加4987
      bike: 0,  // 基础车辆增加2021
      multi:1    // 七日收益放大21倍
    }
    this.refreshAllData()
  }
  showFuture(){
    this.baseCount = {
      sale: 21495 - 1329, // 基础收益增加21495
      order: 4987 - 478, // 基础订单增加4987
      bike: 2021,  // 基础车辆增加2021
      multi:3*7    // 七日收益放大21倍
    }
    this.refreshAllData()
  }

  refreshAllData(){
    this.getLoginInfo()
    this.getVipList()
  }
  //获取登录者信息
  loginInfo: any
  loginType: any
  getLoginInfo() {
    let loginPhone = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).mobile
    this.loginType = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).type
    console.log("登录者电话", loginPhone);
    console.log("登录者类型", this.loginType);

    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/loginInfo', { mobile: loginPhone }).subscribe(res => {
      this.loginInfo = res[0]
      console.log("登录者信息", this.loginInfo);
      // return;

      this.getChartsInfo()
      this.getChartsCount()
      this.getUnlockVehicle()
      this.getOnlineBehicle()
      this.getActiveVehicle()
      this.getOrderNum()
      this.getOrderIncome()
      this.getfinanceFunds()
      this.getCakeData()

      this.autoRefreshTask();
    })
  }
  autoRefreshTask(){
    setInterval(()=>{
      this.getUnlockVehicle()
    },10000);
    
  }
  //设置地图
  map: any;
  initAMaps() {
    var that = this
    console.log("开始渲染");
    this.map && this.map.destroy();
    this.map = new this.AMap.Map('container-home', {
      layers: [//使用多个图层
        // new this.AMap.TileLayer.Satellite(),// 卫星
        // new this.AMap.TileLayer.RoadNet()  // 路网
      ],
      zooms: [4, 18],//设置地图级别范围
      zoom: 11,//级别
      viewMode: '3D'//使用3D视图
    });
  }
  //绘制图表
  obj: any;
  drawChart() {
    this.obj = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: this.btnlist
      },
      legend: {
        data: ['订单总数', '用户总数', '支付总金额', '订单总金额']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单总数',
          data: this.arr1.map(item=>item+this.baseCount.order),
          type: 'line',
          smooth: true,
          color: '#8fc9fb'
        },
        {
          name: '用户总数',
          data: this.arr2.map(item=>item+this.baseCount.order),
          type: 'line',
          smooth: true,
          color: '#f69899'
        },
        {
          name: '支付总金额',
          data: this.arr3.map(item=>item+this.baseCount.sale),
          type: 'line',
          smooth: true,
          color: '#d897eb'
        },
        {
          name: '订单总金额',
          data: this.arr4.map(item=>item+this.baseCount.sale),
          type: 'line',
          smooth: true,
          color: '#3182bd'
        },
      ]
    }
  }
  //绘制饼图
  option: any;
  drawCakeChart() {
    this.dataList.forEach(item=>{
      item.value = item.value*this.baseCount.multi
    })
    this.option = {
      title: {
        text: '代理商七日收入占比',
        x: 'center',
        textStyle: {
          fontWeight: 500,
          fontSize: 15
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: this.nameList,
      },
      series: [
        {
          name: '收入',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: this.dataList,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }


  //获取图标数据
  btnlist: any = [];
  arr1: any = [];
  arr2: any = [];
  arr3: any = [];
  arr4: any = [];
  getChartsInfo() {
    let timer = new Date()
    let endTime = this.parseTime(timer)
    let timel = Math.floor(timer.getTime() / 1000) - 60 * 60 * 24 * 7
    let startTime = this.timeStampTurnTime(timel)
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/searchChart', { startTime: startTime, endTime: endTime, seller_id: this.loginInfo.id }).subscribe(res => {
      // console.log("数据", res);
      let temp: any | any[] = res
      for (let i = 0; i < temp.length; i++) {
        this.btnlist.push(temp[i]['date'])
        this.arr1.push(temp[i]['orderNum'])
        this.arr2.push(temp[i]['userNum'])
        this.arr3.push(temp[i]['payedNum'] / 100)
        this.arr4.push(temp[i]['orderTotle'] / 100)
      }
      // console.log(this.btnlist);
      this.drawChart()
    })
  }
  //获取数据统计
  countInfo: any;
  getChartsCount() {
    let timer = new Date()
    let endTime = this.parseTime(timer)
    let timel = Math.floor(timer.getTime() / 1000) - 60 * 60 * 24 * 7
    let startTime = this.timeStampTurnTime(timel)
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/searchChartCount', { startTime: startTime, endTime: endTime, seller_id: this.loginInfo.id }).subscribe(res => {
      this.countInfo = res[0]
      // console.log("统计数据", this.countInfo);
    })
  }

  //获取饼图数据
  nameList: any = []
  dataList: any
  getCakeData() {
    this.http.get('https://server.ncppx.com/api/pipixia/ppxmanage/cakeData').subscribe(res => {
      let temp: any | any[] = res
      temp.forEach(data => {
        this.nameList.push(data.name)
      });
      this.dataList = res
      this.drawCakeChart()
    })
  }





  ngOnInit() {
      this.initAMaps()
  }
  onChange(result: Date): void {
    // console.log('Selected Time: ', result);
  }
  onOk(result: Date): void {
    this.searchParam.start_time = this.parseTime(result[0])
    this.searchParam.end_time = this.parseTime(result[1])
    // console.log("时间", this.searchParam);
  }
    //获取会员列表
    vipList:any
    getVipList() {
      this.http.get('https://server.ncppx.com/api/pipixia/vehicle/getVipList').subscribe(res => {
        // console.log("qqq", res);
        this.vipList = res
      })
    }
  //查询订单走势
  search() {
    this.btnlist = []
    // console.log("参数", this.searchParam);
    let startTime = this.searchParam.start_time
    let endTime = this.searchParam.end_time
    let seller_id = this.searchParam.vo_id
    // console.log(">>>>",seller_id?seller_id:this.loginInfo.id);
    
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/searchChart', { startTime: startTime, endTime: endTime, seller_id:seller_id?seller_id:this.loginInfo.id }).subscribe(res => {
      console.log("数据", res);
      let temp: any | any[] = res
      for (let i = 0; i < temp.length; i++) {
        this.btnlist.push(temp[i]['date'])
        this.arr1.push(temp[i]['orderNum'])
        this.arr2.push(temp[i]['userNum'])
        this.arr3.push(temp[i]['payedNum'] / 100)
        this.arr4.push(temp[i]['orderTotle'] / 100)
      }
      // console.log(this.btnlist);
      this.drawChart()
    })

    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/searchChartCount', { startTime: startTime, endTime: endTime, seller_id: seller_id?seller_id:this.loginInfo.id }).subscribe(res => {
      this.countInfo = res[0]
      // console.log("统计数据", this.countInfo);
    })
  }
  // 获取异常未锁车辆
  unlockVehicle: any = [];
  unlockNum:any
  unlockSn:any
  getUnlockVehicle() {
    console.log("getUnlockVehicle")
    this.http.get('https://server.ncppx.com/api/pipixia/service/unlock').subscribe(res => {
      const temp: any | any[] = res
      temp.data.sort((a,b)=>b.minite - a.minite)
      this.unlockSn = Object.values(temp.data).map(item => item['device_sn'])
      this.unlockVehicle = temp.data;
    })
  }
  lockVehicle(data){
    //强制锁车
    this.http.post("https://server.ncppx.com/api/pipixia/vehicle/deviceKEYLOCK", { type: data.type, imei: data.device_imei }).subscribe(res => {
      console.log(res);
      alert(res['msg']);
      this.getUnlockVehicle();
    })
    console.log(data);
  }
  //获取在线车
  onlineNum: any;
  onlineSn: any;
  getOnlineBehicle() {
    this.http.get('https://server.ncppx.com/api/pipixia/vehicle/onlineVehicle').subscribe(res => {
      const temp: any | any[] = res
      // console.log("在线", temp.data);
      this.onlineSn = Object.values(temp.data).map(item => item['DeviceSn'])
      // console.log(this.onlineSn);
      this.getVihecleList()
    })
  }
  //获取车辆列表
  vehiData: any;
  allNum: any;
  onlineVehicle: any = [];
  outlineVehicle: any = [];
  getVihecleList() {
    this.http.post('https://server.ncppx.com/api/pipixia/vehicle/acDevice', { seller_id: this.loginInfo.id }).subscribe(res => {
      // console.log("我的车辆", res);
      this.vehiData = res
      this.allNum = this.vehiData.length
      let arr = []
      let arrs = []
      this.vehiData.forEach(item => {
        if (this.onlineSn.indexOf(item.device_sn) != -1) {
          arr.push(item)
        } else {
          arrs.push(item)
        }
      });
      this.onlineVehicle = arr
      this.outlineVehicle = arrs
      this.onlineNum = this.onlineVehicle.length
      // console.log("在线", this.onlineVehicle);
      // console.log("离线", this.outlineVehicle);
    })
  }

  //获取位置
  isLoading = false;
  boxShow = false;
  position: any;
  markers = []  //  标记点列表
  getLocation(e) {
    this.isLoading = true
    this.boxShow = true
    this.http.post('https://server.ncppx.com/api/pipixia/vehicle/getlocation', { device_sn: e }).subscribe(res => {
      console.log(res);
      this.isLoading = false
      if (!res['error']) {
        this.map.remove(this.markers);  //  移除所有标记点
        this.position = res
        console.log("位置", res);
        this.loadMarkers(res['lng'], res['lat'])
        this.map.setCenter([res['lng'], res['lat']]);
      } else {
        alert("查询超时")
        this.boxShow = false
      }
    })
  }
  close() {
    this.boxShow = false
  }

  //获取今日订单数
  num: any;
  getOrderNum() {
    let ymd = this.formateDate(new Date())
    console.log(ymd);
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/orderNum", { ymd: ymd, seller_id: this.loginInfo.id }).subscribe(res => {
      console.log(res);
      this.num = res
    })
  }

  //获取活跃车辆
  activeVehicle: any = [];
  unActiveVehicle: any;
  getActiveVehicle() {
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/activeVehicle", { seller_id: this.loginInfo.id }).subscribe(res => {
      const temp: any | any[] = res
      temp.forEach(data => {
        this.activeVehicle.push(data.vehicle_number)
      });
      this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/device", { seller_id: this.loginInfo.id }).subscribe(resd => {
        const temps: any | any[] = resd
        let arr = []
        temps.forEach(item => {
          if (this.activeVehicle.indexOf(item.device_sn) == -1) {
            arr.push(item)
          }
        });
        this.unActiveVehicle = arr
        console.log("不活跃车辆", this.unActiveVehicle);
      })
    })
  }
  //获取今日订单收益
  income: any;
  getOrderIncome() {
    let ymd = this.formateDate(new Date())
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/orderIncome", { ymd: ymd, seller_id: this.loginInfo.id }).subscribe(res => {
      console.log(res['income']);
      this.income = res['income']
    })
  }
  //获取用户资金
  funds: any;
  getfinanceFunds() {
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/financeFunds", { seller_id: this.loginInfo.id }).subscribe(res => {
      console.log("LLLL", res);
      this.funds = res[0]
      let maxPrice = this.funds.balance_amount*0.9/100
      this.maxPrice=Math.floor(maxPrice)
    })

  }

  //渲染坐标
  loadMarkers(e, q) {
    let marker = new this.AMap.Marker({
      icon: "../../../assets/img/icon/fill1.png",
      position: [e, q],
      offset: new this.AMap.Pixel(-13, -30),
    });
    this.map.add(marker)
    this.markers.push(marker) //  将标记点添加进数组
  }
  //申请提现
  isVisible = false;
  withdraw() {
    this.isVisible = true;
    this.price= this.maxPrice
  }
  //取消
  Cancel(){
    this.isVisible = false;
  }
  //提交
  price:any
  maxPrice:any
  handleOk(){
    let pre = {
      id:this.funds.id,
      amount:this.price,
    }
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/withdraw", pre).subscribe(res => {
      if(res['success']){
        alert("申请成功")
        this.isVisible = false;
      }
    })
  }



  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  formateDate(datetime) {
    function addDateZero(num) {
      return (num < 10 ? "0" + num : num);
    }
    let d = new Date(datetime);
    let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate());
    return formatdatetime;
  }


  parseTime(d: any) {
    let ay = d.getFullYear()
    let am = (d.getMonth() + 1) >= 10 ? (d.getMonth() + 1) : '0' + (d.getMonth() + 1)
    let ad = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate()
    let ah = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours()
    let ami = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes()
    let as = d.getSeconds() >= 10 ? d.getSeconds() : '0' + d.getSeconds()
    const newDate = ay + '-' + am + '-' + ad + ' '
      + ah + ':' + ami + ':' + as;
    return newDate;
  }


  //时间戳转时间类型
  timeStampTurnTime(timeStamp) {
    if (timeStamp > 0) {
      let date = new Date();
      date.setTime(timeStamp * 1000);
      let y: any = date.getFullYear();
      let m: any = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      let d: any = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h: any = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let minute: any = date.getMinutes();
      let second: any = date.getSeconds();
      minute = minute < 10 ? ('0' + minute) : minute;
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    } else {
      return "";
    }

    //return new Date(parseInt(time_stamp) * 1000).toLocaleString().replace(/年|月/g, "/").replace(/日/g, " ");
  }
}
