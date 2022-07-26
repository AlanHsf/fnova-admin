import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-hardware',
  templateUrl: './vehicle-hardware.component.html',
  styleUrls: ['./vehicle-hardware.component.scss']
})
export class VehicleHardwareComponent implements OnInit {
  thead=["IMEI","电池类型","carid","车辆编号","硬件提供者","提供者手机","修改时间","操作"];
  vehiData=[
    {
      id:5,
      imei:"358482041297107",
      powerType:"三元",
      carid:"1440371560640",
      VehicalNum:"079190051",
      provider:"移动网",
      providerNum:"13888888888",
      creattime:"2019-09-07 11:43:54",
      dataUpTime:"2019-09-07 11:43:54",
      imsi:'151358463',
      type:'硬件',
      version:'v0.0.2',
      iccid:'513653564',
      cardnum:'8865461516',
    },
  ];
  addshow = false; //添加表单显示隐藏
  detailshow = false;//详情显示隐藏
  visibles = false;//编辑表单显示隐藏
  value:any;
  constructor() { }

  ngOnInit() {
  }
  addNewsShow() {
    this.addshow = true;
    this.vehiData[0].imei = ""
    this.vehiData[0].VehicalNum = ""
    this.vehiData[0].provider = ""
    this.vehiData[0].providerNum = ""
    this.vehiData[0].imsi = ""
    this.vehiData[0].type = ""
    this.vehiData[0].version = ""
    this.vehiData[0].iccid = ""
    this.vehiData[0].cardnum = ""
  }
  //关闭添加方法
  addNewsHide() {
    this.addshow = false;
  }
  // 提交方法
  submits() {
    console.log(this.vehiData[0]);
  }
   //查看详情
   detailShow(){
    this.detailshow = true;
  }
  //关闭查看详情
  detailHide(){
    this.detailshow = false;
  }

   //编辑方法
   open(e) {
    this.visibles = true;
    console.log(e);
    this.vehiData[0].imei="358482041297107"
    this.vehiData[0].powerType="三元"
    this.vehiData[0].carid="1440371560640"
    this.vehiData[0].VehicalNum="079190051"
    this.vehiData[0].provider="移动网"
    this.vehiData[0].providerNum="13888888888"
    this.vehiData[0].creattime="2019-09-07 11:43:54"
    this.vehiData[0].dataUpTime="2019-09-07 11:43:54"
    this.vehiData[0].imsi='151358463'
    this.vehiData[0].type='硬件'
    this.vehiData[0].version='v0.0.2'
    this.vehiData[0].iccid='513653564'
    this.vehiData[0].cardnum='8865461516'
  }
  // 提交方法
  submit() {
    console.log(this.vehiData);
  }
  //关闭编辑方法
  close() {
    this.visibles = false;
  }
}
