import * as Parse from "parse";
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {
  @ViewChild("certFront",{static:false}) certFront:ElementRef
  @ViewChild("certBack",{static:false}) certBack:ElementRef

  student:any = {}
  class:any = {}
  course:any = {}

  // 打印区域
  printJSON = {
      name:"王大锤",
      gender:"男",
      idcard:"360102199208096666",
      course:[
          {name:"理论课",hour:"100",grade:"合格"},
          {name:"实践课",hour:"140",grade:"合格"}
      ],
      certTitle:"消防设施操作员（初级）",
      certNum:"NC18010602002",
      date_created: new Date(),
      date_from: new Date(),
      date_to: new Date(),

  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.paramMap.subscribe(paramMap=>{
        let data:any = paramMap
        console.log("pdata:",data.params)
        let student = new Parse.Query(data.params.PclassName)
        student.include("class")
        student.include("class.course")
        student.get(data.params.PobjectId).then(stu=>{
            console.log("student",stu)
            this.student = stu
            this.class = stu.get("class")
            this.course = this.class.get("course")

            this.printJSON.name = this.student.get("name")
            this.printJSON.gender = this.student.get("gender")
            this.printJSON.idcard = this.student.get("idcard")
            this.printJSON.certTitle = this.course.get("title")
            // this.printJSON.certNum = this.student.get("certNum")
            let classNum = String(this.class.get("classNum")).replace(/0791/,"NC")
            let stuNum = String(this.student.get("stuNum")).substr(this.student.get("stuNum").length-3,3)
            this.printJSON.certNum = classNum + stuNum

            if(this.course.get("no")=="01"){
                this.printJSON.course = [
                    {name:"理论课",hour:"100",grade:"合格"},
                    {name:"实践课",hour:"140",grade:"合格"}
                ]
            }
            if(this.course.get("no")=="02"){
                this.printJSON.course = [
                    {name:"理论课",hour:"150",grade:"合格"},
                    {name:"实践课",hour:"190",grade:"合格"}
                ]
            }

            this.printJSON.date_from = this.class.get("faceFromTo").from
            this.printJSON.date_to = this.class.get("faceFromTo").to

            if(this.student.get("certDate")){
                this.printJSON.date_created = this.student.get("certDate")
            }else{
                let faceDate = this.class.get("faceFromTo").to
                let certDate = new Date()
                certDate.setDate(faceDate.getDate()+1)
                certDate.setFullYear(faceDate.getFullYear())
                certDate.setMonth(faceDate.getMonth())
                this.printJSON.date_created = certDate
            }


        })
    })
  }

  ngOnInit() {
  }
  goBack(){
    history.go(-1);
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
    padding-top:1.67mm; /* 整体下移5毫米 */
  }
  @page {
    size: 147mm 105mm protrait;
    margin: 0mm;
  }
  `
  printStyle = `
  .cert-paper-layout{
    width:157mm;
    height:115mm;
    position: relative;
    float:left;
    color:#000!important;
    font-family:"黑体",Sans-serif;
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
    margin-left:-5mm;
    left: 35.75mm;
    top: 103mm;
    font-size:4mm;

}


.name{
    top:14mm;
    left:112mm;
    font-size:5mm;
    font-weight:bold;
}
.gender{
    top:29mm;
    left:115mm;
    font-size:5mm;
    font-weight:bold;
}
.idcard{
    top:58mm;
    left:91.5mm;
    letter-spacing: 0.71mm;
    font-weight:bold;
    font-size:5mm;
}
.school-name{
    top:68mm;
    left:90.5mm;
    font-weight:bold;
    font-size:4mm;
}
.date-from{
    margin-left:-8mm;
    left: 85.5mm;
    top: 103mm;
    font-size:4mm;
}
.date-to{
    margin-left:-8mm;
    left: 120.25mm;
    top: 103mm;
    font-size:4mm;
}


.course-list{
    font-size: 5mm;
    font-weight: bold;
    top:21mm;
    left:13mm;
    padding-left: 0px;
}
.course-list li{
    list-style:none;
    margin-top:2mm;
}

.course-name{
}
.course-hour{
    left:35.75mm;
    position: absolute;
}
.course-grade{
    left:46.75mm;
    position: absolute;
    width:20mm;
}


.cert-num{
    top:10mm;
    left:115mm;
    font-size: 5mm;
    font-weight:bold;

}
.cert-title{
    top:99mm;
    left:102mm;
    width:300px;
    font-size: 5mm;
    font-weight: bold;
}
  `


}
