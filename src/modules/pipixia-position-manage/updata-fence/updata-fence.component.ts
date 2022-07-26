import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-updata-fence',
  templateUrl: './updata-fence.component.html',
  styleUrls: ['./updata-fence.component.scss']
})
export class UpdataFenceComponent implements OnInit {
  AMap = window["AMap"]
  map: any
  constructor(
    private http: HttpClient,
    private router: Router

  ) { }

  ngOnInit() {

    this.getfence()
    this.getParam()
  }
  fence_id: any;
  getParam() {
    var Param = window.location.search.split("=");
    this.fence_id = Param[1]
    console.log(">>>", this.fence_id);
    this.getFenceDel()
  }
  // 获取围栏详情
  fenceDel: any;
  pointList: any;
  getFenceDel() {
    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/getfencedel", { id: this.fence_id }).subscribe(res => {
      console.log(res);
      this.fenceDel = res[0];
      let arr = []
      JSON.parse(this.fenceDel.polygons).forEach(data => {
        arr.push([data.lng, data.lat])
      })
      this.pointList = arr
      this.drowPolygon()
    })
  }
  // 渲染多边形
  polygon: any;
  drowPolygon() {
    console.log(this.map);

    var path = this.pointList
    this.polygon = new this.AMap.Polygon({
      path: path,
      strokeColor: "#FF0033",
      strokeWeight: 3,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      fillColor: '#1791fc88',
      zIndex: 50,
    })
    this.map.add(this.polygon)
    // 缩放地图到合适的视野级别
    this.map.setFitView([this.polygon])
  }


  //获取电子围栏
  fence: any;
  getfence() {
    this.http.get('https://server.ncppx.com/api/pipixia/ppxmanage/getfence').subscribe(res => {
      const temp: any | any[] = res
      this.fence = temp
      this.setMaps()
    })
  }
  // //初始化地图
  setMaps() {
    this.map = new this.AMap.Map("container", {
      zoom: 13,
      center: [this.fence[0].longitude, this.fence[0].latitude],//中心点坐标
      resizeEnable: true,
    });
    this.map.on('dragend', this.loadCircles.bind(this));
    this.loadCircles()
  }
  // //加载圆形围栏
  showCircles: any;
  circles: any;
  loadCircles() {
    console.log(3);

    var bounds = this.map.getBounds();
    let northeast = bounds.northeast
    let southwest = bounds.southwest
    this.showCircles = this.fence.filter(item =>
      item.longitude > southwest.lng && item.longitude < northeast.lng && item.latitude > southwest
        .lat && item.latitude < northeast.lat && item.id != this.fence_id
    )
    this.showCircles.forEach(item => {
      if (item.shape) {
        let arr = JSON.parse(item['polygons'])
        let arrs = []
        arr.forEach(data => {
          arrs.push([data.lng, data.lat])
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


  //提交添加
  submit() {
    let pre = {}
    if (this.fenceDel.shape == '1') {
      let polygons = JSON.stringify(this.pointList)
      let aclon = this.getDistance(this.pointList[0], this.pointList[2])
      let bdlon = this.getDistance(this.pointList[1], this.pointList[3])
      console.log(">>>>", aclon, bdlon);
      let lat: any
      let lng: any
      let radius: any
      if (aclon > bdlon) {
        lat = this.pointList[2]['lat'] + ((this.pointList[0]['lat'] - this.pointList[2]['lat']) / 2)
        lng = this.pointList[2]['lng'] + ((this.pointList[0]['lng'] - this.pointList[2]['lng']) / 2)
        radius = aclon / 2
      } else {
        lat = this.pointList[3]['lat'] + ((this.pointList[1]['lat'] - this.pointList[3]['lat']) / 2)
        lng = this.pointList[3]['lng'] + ((this.pointList[1]['lng'] - this.pointList[3]['lng']) / 2)
        radius = bdlon / 2
      }
      pre = {
        id: this.fence_id,
        name: this.fenceDel.name,
        address: this.fenceDel.address,
        fence_status: this.fenceDel.fence_status,
        longitude: lng,
        latitude: lat,
        radius: radius,
        shape: '1',
        polygons: polygons,
      }
    }else{
      pre = {
        id: this.fence_id,
        name: this.fenceDel.name,
        address: this.fenceDel.address,
        fence_status: this.fenceDel.fence_status,
        longitude: this.fenceDel.longitude,
        latitude: this.fenceDel.latitude,
        radius: this.fenceDel.radius,
        shape: '0',
        polygons: '',
      }
    }

    console.log(pre);


    this.http.post("https://server.ncppx.com/api/pipixia/ppxmanage/upFence", pre).subscribe(res => {
      console.log(res);
      if (res['success']) {
        alert('更新成功')
        this.router.navigateByUrl("pipixia-position/fence")
      }
    })
  }

  //返回
  back() {
    this.router.navigateByUrl("pipixia-position/fence")
  }
  getDistance(point1, point2) {
    let $this = this;
    /**
     * 地球半径
     */
    var EARTHRADIUS = 6370996.81;
    point1.lng = $this.getLoop(point1.lng, -180, 180);
    point1.lat = $this.getRange(point1.lat, -74, 74);
    point2.lng = $this.getLoop(point2.lng, -180, 180);
    point2.lat = $this.getRange(point2.lat, -74, 74);

    var x1, x2, y1, y2;
    x1 = $this.degreeToRad(point1.lng);
    y1 = $this.degreeToRad(point1.lat);
    x2 = $this.degreeToRad(point2.lng);
    y2 = $this.degreeToRad(point2.lat);
    console.log('getDistance:' + 6370996.81 * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) *
      Math.cos(x2 - x1))));
    return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));
  }
  getLoop(v, a, b) {
    while (v > b) {
      v -= b - a
    }
    while (v < a) {
      v += b - a
    }
    return v;
  }
  getRange(v, a, b) {
    if (a != null) {
      v = Math.max(v, a);
    }
    if (b != null) {
      v = Math.min(v, b);
    }
    return v;
  }
  degreeToRad(degree) {
    return Math.PI * degree / 180;
  }


  //微调
  polyEditor: any;
  setAgain() {
    let that = this
    that.polyEditor = new that.AMap.PolyEditor(that.map, that.polygon)
    that.polyEditor.open()

  }
  endsetAgain() {
    let that = this
    that.polyEditor.on('end', function (event) {
      let newpo = event.target.B.path
      this.pointList = []
      newpo.forEach(item => {
        this.pointList.push([item.lng, item.lat])
      })
      console.log(this.pointList);

    })
    that.polyEditor.close()
  }
}
