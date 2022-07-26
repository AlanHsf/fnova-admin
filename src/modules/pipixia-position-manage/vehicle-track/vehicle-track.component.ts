import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-vehicle-track',
  templateUrl: './vehicle-track.component.html',
  styleUrls: ['./vehicle-track.component.scss']
})
export class VehicleTrackComponent implements OnInit {
  AMap = window["AMap"]
  device_sn: any;
  TrackDels: any;
  dateFormat: any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.setAMaps()
    this.getParam()
    // this.getVehicalTrack()
  }
  onChange(result: Date): void {
    // console.log('Selected Time: ', result);
  }
  startTime:any;
  endTime:any;
  onOk(result: Date): void {
    this.startTime=this.parseTime(result[0])
    this.endTime=this.parseTime(result[1])
    console.log("开始时间",this.startTime,"结束时间",this.endTime);
    
  }
  getParam() {
    var Param = window.location.search.split("=");
    this.device_sn = Param[1]
    if (this.device_sn) {
      console.log(this.device_sn);
      this.http.post("https://server.ncppx.com/api/pipixia/vehicle/getTrack", { device_sn: this.device_sn }).subscribe(res => {
        const temp: any | any[] = res
        console.log("111", res);
        var arr = []
        temp.forEach(item => {
          arr.push([item.lng, item.lat])
        });
        this.TrackDels = arr
        this.getVehicalTrack()
      })
    }
  }
  //设置地图
  setAMaps() {
    //初始化地图
    var that = this
    var map = new this.AMap.Map('container', {
      resizeEnable: true,
      zoom: 15
    });
  }
  //渲染路线
  getVehicalTrack() {
    var that = this
    if (that.TrackDels.length > 0) {
      var map = new this.AMap.Map('container', {
        center: that.TrackDels[0],//中心点坐标
        layers: [],
        zooms: [4, 18],//设置地图级别范围
        zoom: 15,//级别
      });

      var polyline = new this.AMap.Polyline({
        path: this.TrackDels,
        // showDir: true,
        strokeColor: "#28F",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
      });
      map.add(polyline);
    }
  }
  //查询路线
  isLoading=false;
  getVehicalTracks(q) {
    this.isLoading=true
    var p = {}
    if (this.startTime) {
      p = {
        startTime: this.startTime ? this.startTime : '',
        endTime: this.endTime ? this.endTime : '',
        device_sn: q
      }
    } else {
      p = {
        device_sn: q
      }
    }
    console.log(p);

    this.http.post("https://server.ncppx.com/api/pipixia/vehicle/searchTrack", p).subscribe(res => {
      const temp: any | any[] = res
      console.log("111", res);
      var arr = []
      temp.forEach(item => {
        arr.push([item.lng, item.lat])
      });
      this.TrackDels = arr
      this.isLoading=false
      this.getVehicalTrack()
    })

  }

  parseTime(d: any) {
    let ay = d.getFullYear()
    let am = (d.getMonth() + 1)>=10?(d.getMonth() + 1):'0'+(d.getMonth() + 1)
    let ad =  d.getDate()>=10?d.getDate():'0'+d.getDate()
    let ah = d.getHours()>=10?d.getHours():'0'+d.getHours()
    let ami = d.getMinutes()>=10?d.getMinutes():'0'+d.getMinutes()
    let as = d.getSeconds()>=10?d.getSeconds():'0'+d.getSeconds()
    const newDate = ay + '-' + am + '-' + ad + ' '
    + ah + ':' + ami + ':' + as;
    return newDate;
  }

}
