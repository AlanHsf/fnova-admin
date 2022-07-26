import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-fence',
  templateUrl: './vehicle-fence.component.html',
  styleUrls: ['./vehicle-fence.component.scss']
})
export class VehicleFenceComponent implements OnInit {
  thead=["名称","经度","纬度","半径","状态","创建时间","修改时间","操作"];
  vehiData=[
    {
      id:11513,
      name:"东华理工大学悠乐汇广场	",
      lon:"115.826898057726",
      lat:"28.712434624566",
      radius:"20.0",
      status:"启用",
      createTime:"2019-09-18 16:44:04",
      dataUpTime:"2019-09-18 16:44:04",
      address:"",
      member:"",
    },
  ];
  visibles = false;//编辑表单显示隐藏
  addshow = false; //添加表单显示隐藏
  detailshow = false;//详情显示隐藏
  value:any;
  business:any;
  constructor() { }

  ngOnInit() {
  }
 //编辑方法
 open(e) {
  this.visibles = true;
  console.log(e);
  this.vehiData[0].name = "东华理工大学悠乐汇广场"
  this.vehiData[0].lon = "115.826898057726"
  this.vehiData[0].lat = "28.712434624566"
  this.vehiData[0].radius = "20.0"
  this.vehiData[0].status = "启用"
  this.vehiData[0].address = ""
  this.vehiData[0].createTime = "2019-05-26 13:56:32"
  this.vehiData[0].dataUpTime = "2019-05-26 13:56:32"
}
// 提交方法
submit() {
  console.log(this.vehiData);
}
//关闭编辑方法
close() {
  this.visibles = false;
}
// 添加方法
addNewsShow() {
  this.addshow = true;
  this.vehiData[0].name = ""
  this.vehiData[0].lon = ""
  this.vehiData[0].lat = ""
  this.vehiData[0].radius = ""
  this.vehiData[0].status = ""
  this.vehiData[0].address = ""
  this.vehiData[0].dataUpTime = ""
}
//关闭添加方法
addNewsHide() {
  this.addshow = false;
}
// 提交方法
submits() {
  console.log(this.vehiData);
}
//查看详情
detailShow(){
  this.detailshow = true;
}
//关闭查看详情
detailHide(){
  this.detailshow = false;
}
}
