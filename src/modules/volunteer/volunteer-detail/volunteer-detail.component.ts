import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-volunteer-detail',
  templateUrl: './volunteer-detail.component.html',
  styleUrls: ['./volunteer-detail.component.scss']
})
export class VolunteerDetailComponent implements OnInit {
  @ViewChild("certFront",{static:false}) certFront:ElementRef
  @ViewChild("certBack",{static:false}) certBack:ElementRef

  constructor() { }

  ngOnInit() {
  }

  print(page) {
    let printHTML: string
    if(page=="certFront") {
      printHTML = this.certFront.nativeElement.innerHTML;
    } else {
      printHTML = this.certBack.nativeElement.innerHTML;
    }
    console.log(page);
    console.log(printHTML);
    let printModal: any = window.open("",'newwindow',
    'toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
    printModal.document.body.innerHTML = `<style>${this.printFixStyle}</style>`+`<style>${this.printStyle}</style>`+printHTML;
    printModal.print();
    return false
  }
  printFixStyle = `
  html, body{
    margin:0px !important;
  }
  @page {
    size: 135mm 95mm landscape;
  }
  `
  printStyle = `
  .cert-paper-layout{
    width:135mm;
    height:95mm;
    position: relative;
    float:left;

}

.cert-preview .cert-paper-layout{
    border:1px dashed;
    border-color:#000;
}

.cert-left{
    width:50%;
    height:100%;
    float:left;

    border-right-style: dashed;
    border-width: 1px;
    border-color: #d9d9d9;
}
.cert-right{
    width:50%;
    height:100%;
    float:left;
}

.cert-front{

}

.cert-back{

}

.content{
    position: absolute;
}


.date-created span, .date-from span,.date-to span{
    margin-left:7mm;
}
.date-created{
    margin-left:-10mm;
    left: 25.75mm;
    top: 75mm;
}


.name{
    top:15mm;
    left:95mm;
}
.gender{
    top:30mm;
    left:95mm;
}
.idcard{
    top:40mm;
    left:77.5mm;
    letter-spacing: 0.71mm;
}
.school-name{
    top:55mm;
    left:77.5mm;
}
.date-from{
    margin-left:-10mm;
    left: 70.5mm;
    top: 75mm;
}
.date-to{
    margin-left:-10mm;
    left: 105.25mm;
    top: 75mm;
}


.course-list{
    top:20mm;
    left:7mm;
    padding-left: 0px;
}
.course-list li{
    list-style:none;
    margin-top:2mm;
}

.course-name{
}
.course-hour{
    left:33.75mm;
    position: absolute;
}
.course-grade{
    left:44.75mm;
    position: absolute;
    width:10mm;
}


.cert-num{
    top:12mm;
    left:95mm;
}
.cert-title{
    top:80mm;
    left:80mm;
}
  `
  

}
