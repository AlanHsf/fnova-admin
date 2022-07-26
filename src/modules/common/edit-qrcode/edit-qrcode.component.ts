import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';

// import { TimeHolder } from 'ng-zorro-antd/time-picker/time-holder';
declare var QRCode: any ;
// import {QRCode} from '../../../pipes/qrcode'


@Component({
  selector: 'edit-qrcode',
  templateUrl: './edit-qrcode.component.html',
  styleUrls: ['./edit-qrcode.component.scss']
})


export class EditQRCodeComponent implements OnInit {
  @Input("url") url:any = null;
  @Input("show") show:boolean = false;
  @Input("size") size:Number = 160;
  @Input("data") data:any = {};
  @Input("fields") fields:any = {};
  @Output() urlChange = new EventEmitter<any>(true);  
  id = "qrcode"
  constructor(
  ) {
  }

  ngOnInit() {
    this.link = this.url;
    let params = this.url.match(/[^}${}]+(?=})/img);
    if(this.fields && params){
      params.forEach(key=>{
        let value = this.data.get(key);
        if(key!="objectId"){
          let type = this.fields[key]&&this.fields[key].type
          if(type=="String"){
            value = this.data.get(key);
          }
          if(type=="Pointer"){
            value = this.data.get(key) && this.data.get(key).id;
          }
        }else{
          value = this.data.id;
        }
        this.link = this.link.replace(`\${${key}}`,value);
        if(this.fields[key]){
          this.paramsArray.push({
            key:key,
            name:this.fields[key]&&this.fields[key].name || key,
            value:value
          })
        }
      })
    }
  }

  paramsArray = [];

  link:string = ""
  valueMap:any = {}
  isVisible = false
  async showModal(){
    this.isVisible = true;
  //   let path = this.url.split("/")
  //   this.id = "qrcode"+ path[path.length-1]

  //   let qrcode = new QRCode("qrcode-area", {
  //     text: this.url,
  //     width: 128,
  //     height: 128,
  //     colorDark : "#000000",
  //     colorLight : "#ffffff",
  //     correctLevel : QRCode.CorrectLevel.H
  // });


    // 生成二维码
    // let qrcode = new QRCode(document.getElementById("qrcode-area"), {
    //   width: 70,
    //   height: 70
    // });
    // qrcode.makeCode('jjjjj');

  }

  handleCancel(){
    this.isVisible = false;
  }
}
