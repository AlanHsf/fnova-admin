import { Component, OnInit, AfterViewInit } from '@angular/core';


declare const embedpano:any;

@Component({
  selector: 'app-vrpano-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit,AfterViewInit {

  constructor() { 
    localStorage.setItem("hiddenMenu","true")
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
      swf:"/assets/js/vrpano/tour.swf", 
      xml:"/assets/js/vrpano/tour.xml", 
      // swf:"/assets/js/vrpano/krpano.swf", 
      // xml:"/assets/js/vrpano/krpano.xml", 
      // xml:"https://krpano.com/releases/1.20.9/viewer/examples/animated-hotspots/anihotspots.xml",
      mobilescale:1.0, 
      passQueryParameters:true
    });
  }

  vrpanoReady(vrpano){
    console.log("vrpano in")
    vrpano.call("trace(vrpano is ready...)");
  }

}


