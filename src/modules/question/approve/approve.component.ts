import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as Parse from "parse";

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {
  allBPM : Array<any> = []
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit() {
    this.getBPMApprove()
  }
  async getBPMApprove(){
    let isBPMApprove = new Parse.Query("BPMApprove")
    isBPMApprove.equalTo("company",'668rM7MPii')
    isBPMApprove.include("survey")
    let BPMApproves = await isBPMApprove.find()
    console.log(BPMApproves);
    this.allBPM = BPMApproves
  }
  showWDetail(e){
    console.log(e)
    this.router.navigate([
      `/common/manage/BPMApprovalLog`,{
        aid: e
      }

    ]);
  }
}
