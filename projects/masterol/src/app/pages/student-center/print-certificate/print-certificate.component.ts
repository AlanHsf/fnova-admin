import { profile } from 'console';
import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-print-certificate',
  templateUrl: './print-certificate.component.html',
  styleUrls: ['./print-certificate.component.scss']
})
export class PrintCertificateComponent implements OnInit {
  profile: any;
  startTime: any;
  endTime: any;
  PrintBtn: boolean;
  PrintBtn2: boolean = true;
  constructor() {
    this.PrintBtn = true
  }

  ngOnInit(): void {
    this.profile = JSON.parse(localStorage.getItem('profile'))
    let time = []
    time = this.profile.SchoolMajor.majorPlan.split(',')
    this.startTime = time[0]
    this.endTime = time[1]
    this.PrintBtn = true
  }


   body:any = document.getElementsByTagName('body')[0];
  // 打印合格证
  async toPrint() {
    setTimeout(function () {
      window.print()
    }, 100);
  }
}