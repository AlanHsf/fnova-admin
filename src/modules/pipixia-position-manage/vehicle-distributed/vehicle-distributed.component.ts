import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
@Component({
  selector: 'app-vehicle-distributed',
  templateUrl: './vehicle-distributed.component.html',
  styleUrls: ['./vehicle-distributed.component.scss']
})
export class VehicleDistributedComponent implements OnInit {
  AMap = window["AMap"]
  map: any
  showinfo: any = false;

  vehiDels: any;
  vehiData: any;
  vehiclenum: any;//车辆编号
  business: any;//已选商户
  power: any;//电量
  merchant: any;//商户
  markers: any = []
  circles: any = []
  loginType = ""
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loginType = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).type

  }

  ngOnInit() {
    this.getLoginInfo()
    this.getMerchant()
    // this.getfence()
    // this.initAMaps()
  }
  //获取登录者信息
  loginInfo: any
  getLoginInfo() {
    let loginPhone = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).mobile
    this.loginType = JSON.parse(localStorage.getItem("Parse/pipixia/currentUser")).type
    console.log("登录者电话", loginPhone);
    console.log("登录者类型", this.loginType);

    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/loginInfo', { mobile: loginPhone }).subscribe(res => {
      this.loginInfo = res[0]
      console.log("登录者信息", this.loginInfo);
      //  >>>>
      this.getOnlineBehicle()

    })
  }

  //设置地图
  initAMaps() {
    var that = this

    if (that.vehiData && that.fence) {
      console.log("开始渲染");
      this.map && this.map.destroy();

      this.map = new this.AMap.Map('container', {
        center: [that.vehiData[0].lng, that.vehiData[0].lat],//中心点坐标
        layers: [//使用多个图层
          // new this.AMap.TileLayer.Satellite(),// 卫星
          // new this.AMap.TileLayer.RoadNet()  // 路网
        ],
        zooms: [4, 18],//设置地图级别范围
        zoom: 11,//级别
        viewMode: '3D'//使用3D视图
      });

      //地图标点
      this.loadMarkers()
      //地图渲染围栏
      this.loadCircles()
    }
  }
  loadCircles() {
    if (this.circles.length > 0) {
      this.map.remove(this.circles);
    }
    this.circles = []

    this.fence.forEach(item => {
      if (item.shape=='1') {
        let arr = JSON.parse(item['polygons'])
        let arrs = []
        arr.forEach(data => {
          if(data.lng && data.lat){ // 经纬度存在时渲染
            arrs.push([data.lng, data.lat])
          }else{
            console.error("ERROR:",data) // 有问题的围栏
          }
        });
        console.log("多边形", arrs);
        let polygones = new this.AMap.Polygon({
          path: arrs,
          strokeColor: "#000000",// 线条颜色
          strokeWeight: 3,// 线条宽度，默认为 1
          lineJoin: 'round', // 折线拐点连接处样式
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50,
        })
        this.map.add(polygones)
      } else {
        let circle = new this.AMap.Circle({
          center: new this.AMap.LngLat(item.longitude, item.latitude), // 圆心位置
          radius: item.radius,  //半径
          strokeColor: "#F33",  //线颜色
          strokeOpacity: 1,  //线透明度
          strokeWeight: 3,  //线粗细度
          fillColor: "rgb(51, 255, 0)",  //填充颜色
          fillOpacity: 0.35 //填充透明度
        });
        this.map.add(circle);
      }
    })
  }
  loadMarkers() {
    if (this.markers.length > 0) {
      this.map.remove(this.markers);
    }
    this.markers = []
    var that = this
    //marker点击方法
    var onMarkerClick = function (e) {
      console.log("onMarkerClick")
      console.log(e)

      var device_sn = ""
      if(e.target.De&&e.target.De.device_sn){
        device_sn = e.target.De.device_sn
      }
      if(e.target.w&&e.target.w.device_sn){
        device_sn = e.target.w.device_sn
      }
      if(e.target.Ce&&e.target.Ce.device_sn){
        device_sn = e.target.Ce.device_sn
      }
      that.getDetails(device_sn)
    }
    this.vehiData.forEach(item => {
      if (!this.isLowPower(item.status_power_lev,item.power_type) && item.lat && this.onlineSn.indexOf(item.device_sn) != -1) {
        let marker = new this.AMap.Marker({
          device_sn: item.device_sn,
          icon: "../../../assets/img/icon/fill1.png",
          position: [item.lng, item.lat],
          offset: new this.AMap.Pixel(-13, -30),
        });
        marker.on('click', onMarkerClick);
        // marker.setMap(this.map);
        this.markers.push(marker)

      } else if (this.isLowPower(item.status_power_lev,item.power_type) && item.lat && this.onlineSn.indexOf(item.device_sn) != -1) {
        let marker = new this.AMap.Marker({
          device_sn: item.device_sn,
          icon: "../../../assets/img/icon/fill0.png",
          position: [item.lng, item.lat],
          offset: new this.AMap.Pixel(-13, -30),
        });
        marker.on('click', onMarkerClick);
        // marker.setMap(this.map);
        this.markers.push(marker)

      } else if (item.device_sn.indexOf(this.onlineSn) == -1 && item.lat) {
        let marker = new this.AMap.Marker({
          device_sn: item.device_sn,
          icon: "../../../assets/img/icon/fill2.png",
          position: [item.lng, item.lat],
          offset: new this.AMap.Pixel(-13, -30),
        });
        marker.on('click', onMarkerClick);
        // marker.setMap(this.map);
        this.markers.push(marker)

      }
    })
    this.map.add(this.markers)

  }

  getDetails(device_sn) {
    this.http.post("https://server.ncppx.com/api/pipixia/vehicle/deviceDetails", { device_sn: device_sn }).subscribe(res => {
      this.showinfo = true
      this.vehiDels = res[0]
      let powerlv = 0
      if (res[0].status_power_lev / 100 < 45) {
        powerlv = ((res[0].status_power_lev / 100 + 1) * 10)
      } else if (+res[0].status_power_lev / 100 >= 45 && +res[0].status_power_lev / 100 < 46) {
        powerlv = ((res[0].status_power_lev / 100 + 2.7) * 10)
      } else if (+res[0].status_power_lev / 100 >= 46 && +res[0].status_power_lev / 100 < 48) {
        powerlv = ((res[0].status_power_lev / 100 + 3.6) * 10)
      } else if (+res[0].status_power_lev / 100 >= 48 && +res[0].status_power_lev / 100 < 52) {
        powerlv = ((res[0].status_power_lev / 100 + 4) * 10)
      } else if (+res[0].status_power_lev / 100 >= 52 && +res[0].status_power_lev / 100 < 54) {
        powerlv = ((res[0].status_power_lev / 100 + 3.6) * 10)
      } else if (+res[0].status_power_lev / 100 >= 54 && +res[0].status_power_lev / 100 < 55) {
        powerlv = ((res[0].status_power_lev / 100 + 4.4) * 10)
      } else if (+res[0].status_power_lev / 100 >= 55) {
        powerlv = ((res[0].status_power_lev / 100 + 4) * 10)
      }
      if (res[0].power_type == 'sanyuan') {
        let power = Math.floor((powerlv - 450) / (590 - 450) * 100)
        if (power > 100) {
          this.power = 100
        } else if (power < 10) {
          this.power = 10
        } else {
          this.power = power
        }
      } else if (res[0].power_type == 'xinming') {
        let power = Math.floor((powerlv - 42) <= 580 && (powerlv - 42) >= 470 ? (-0.0038583333333333334 * (powerlv - 42) * (powerlv - 42) + 4.67325 * (powerlv - 42) - 1342.5416666666667) * 100 / 70 : ((powerlv - 42) > 620 ? 100 : 0))
        if (power > 100) {
          this.power = 100
        } else if (power < 10) {
          this.power = 10
        } else {
          this.power = power
        }
      } else if (res[0].power_type == 'tieli') {
        let power = Math.floor(((powerlv + 47) - 500) / (580 - 500) * 100)
        if (power > 100) {
          this.power = 100
        } else if (power < 10) {
          this.power = 10
        } else {
          this.power = power
        }
      }
    })
  }


  hide() {
    this.showinfo = false;
  }

  //前往车辆控制
  toControl(e) {
    this.router.navigateByUrl("pipixia-vehicle/control?id=" + e)
  }
  //前往历史轨迹
  totrack(e) {
    this.router.navigateByUrl("pipixia-position/track?id=" + e)
  }
  //获取商户信息
  getMerchant() {
    this.http.get('https://server.ncppx.com/api/pipixia/vehicle/getVipList').subscribe(res => {
      const temp: any | any[] = res
      temp.splice(0, 0, { id: '', login_name: '全部' })
      this.merchant = temp
    })
  }
  //搜索定位
  showFresh = false;
  searchPosition() {
    this.showFresh = true
    this.showinfo = false
    let pre = {
      device_sn: this.vehiclenum ? this.vehiclenum : '',
      agent_uid: this.business ? this.business : ''
    }
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/searchPosition', pre).subscribe(res => {
      this.vehiData = res
      this.loadMarkers()
      this.map.setCenter([this.vehiData[0].lng, this.vehiData[0].lat]);
      // this.initAMaps()
      // this.getfence()
    })
  }
  //获取在线车
  onlineSn: any;
  getOnlineBehicle() {
    this.http.get('https://server.ncppx.com/api/pipixia/vehicle/onlineVehicle').subscribe(res => {
      const temp: any | any[] = res
      // console.log("在线", temp.data);
      this.onlineSn = Object.values(temp.data).map(item => item['DeviceSn'])
      this.getVihecleList()
    })
  }

  // //获取车辆信息
  // //获取车辆列表
  // getVihecleList() {
  //   this.http.post('https://server.ncppx.com/api/pipixia/vehicle/acDevice',{seller_id:1}).subscribe(res => {
  //     console.log(res);
  //     this.vehiData = res
  //     this.getfence()
  //   })
  // }

  //获取车辆列表
  getVihecleList() {
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/device', { seller_id: this.loginInfo.id }).subscribe(res => {
      console.log("车辆",res);
      this.vehiData = res
      this.getfence()
    })
  }

  //获取电子围栏
  fence: any;
  getfence() {
    this.http.get('https://server.ncppx.com/api/pipixia/ppxmanage/getfence').subscribe(res => {
      const temp: any | any[] = res
      this.fence = temp
      // console.log("围栏", this.fence);
      this.initAMaps()
    })
  }

  //刷新位置信息
  isLoading = false;
  position: any;
  loadPos(e) {
    this.isLoading = true
    console.log(e);
    this.http.post('https://server.ncppx.com/api/pipixia/vehicle/getlocation', { device_sn: e }).subscribe(res => {
      console.log(res);
      this.isLoading = false
      if (!res['error']) {
        this.getDetails(e)
      } else {
        alert("定位失败")
      }
    })

  }

  //刷新电量信息
  isLoadinges = false;
  loadPow(e) {
    this.isLoadinges = true
    console.log(e);
    this.http.post('https://server.ncppx.com/api/pipixia/ppxmanage/upPower', { device_sn: e }).subscribe(res => {
      console.log(res);
      this.isLoadinges = false
      if (res['success']) {
        this.getDetails(e)
      } else {
        alert("老设备暂不支持实时查询")
      }
    })

  }


  isLoadings = false;
  loadPoss(e) {
    this.isLoadings = true
    console.log(e);
    this.http.post('https://server.ncppx.com/api/pipixia/vehicle/getlocation', { device_sn: e }).subscribe(res => {
      console.log(res);
      this.isLoadings = false
      if (!res['error']) {
        // this.getDetails(e)
        this.searchPosition()
      } else {
        alert("定位失败")
      }
    })

  }


  //电压电量转换 输出是否低电量
  isLowPower(lev,power_type) {
      let powerlv = 0
      if (lev / 100 < 45) {
        powerlv = ((lev / 100 + 1) * 10)
      } else if (+lev / 100 >= 45 && +lev / 100 < 46) {
        powerlv = ((lev / 100 + 2.7) * 10)
      } else if (+lev / 100 >= 46 && +lev / 100 < 48) {
        powerlv = ((lev / 100 + 3.6) * 10)
      } else if (+lev / 100 >= 48 && +lev / 100 < 52) {
        powerlv = ((lev / 100 + 4) * 10)
      } else if (+lev / 100 >= 52 && +lev / 100 < 54) {
        powerlv = ((lev / 100 + 3.6) * 10)
      } else if (+lev / 100 >= 54 && +lev / 100 < 55) {
        powerlv = ((lev / 100 + 4.4) * 10)
      } else if (+lev / 100 >= 55) {
        powerlv = ((lev / 100 + 4) * 10)
      }
      if (power_type == 'sanyuan') {
        let power = Math.floor((powerlv - 450) / (590 - 450) * 100)
        if (power > 100) {
          return false
        } else if (power < 20) {
          return true
        } else {
          return false
        }
      } else if (power_type == 'xinming') {
        let power = Math.floor((powerlv - 42) <= 580 && (powerlv - 42) >= 470 ? (-0.0038583333333333334 * (powerlv - 42) * (powerlv - 42) + 4.67325 * (powerlv - 42) - 1342.5416666666667) * 100 / 70 : ((powerlv - 42) > 620 ? 100 : 0))
        if (power > 100) {
          return false
        } else if (power < 20) {
          return true
        } else {
          return false
        }
      } else if (power_type == 'tieli') {
        let power = Math.floor(((powerlv + 47) - 500) / (580 - 500) * 100)
        if (power > 100) {
          return false
        } else if (power < 20) {
          return true
        } else {
          return false
        }
      }
  }
}
