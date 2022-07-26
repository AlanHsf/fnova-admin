import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { formatSize } from 'plupload';

declare const embedpano:any;

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit,AfterViewInit {

  constructor() { 
    localStorage.setItem("hiddenMenu","true");

    if(localStorage.getItem("isElectron")=="true"){
      // const fs = (<any>window).require("fs");
      
      // console.log(fs.readdirSync("./",'utf8'))
      // console.log(fs.readdirSync("./",'utf8'))
      // console.log(fs.readdirSync("./",'utf8'))
    }
  }

  
  ngOnInit(): void {
  }
  ngAfterViewInit(){
    console.log("view init")
    let that = this;
    embedpano({
      target:"panoview",
      onready:that.vrpanoReady,
      html5:"auto",
      // swf:"http://vr.fmode.cn/tour/tour.swf", 
      // xml:"http://localhost:7337/api/vrpano/oldtour/cc1e5cdb0824ba42", 
      swf:"/assets/vrpano/tour/tour.swf", 
      xml:"/assets/vrpano/tour/case1/tour.xml", 
      // swf:"/assets/js/vrpano/tour/krpano.swf", 
      // xml:"https://krpano.com/releases/1.20.9/viewer/examples/animated-hotspots/anihotspots.xml",
      mobilescale:0.7, 
      passQueryParameters:true
    });
  }

  vrpanoReady(vrpano){
    console.log("vrpano in")
    vrpano.call("trace(vrpano is ready...)");
  }
}
