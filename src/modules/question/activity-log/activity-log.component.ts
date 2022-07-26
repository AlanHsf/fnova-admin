import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as Parse from "parse";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-activity-log",
  templateUrl: "./activity-log.component.html",
  styleUrls: ["./activity-log.component.scss"],
  providers: [DatePipe],
})
export class ActivityLogComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}
  aid: string;
  company: string;
  logs: any;
  todayCount: number;
  ngOnInit() {
    this.company = localStorage.getItem("company");
    this.activatedRoute.paramMap.subscribe((param) => {
      this.aid = param.get("PobjectId");
      if (this.aid) {
        this.queryActivityLog();
        this.queryToDay();
      }
    });
  }

  async queryActivityLog() {
    let CheckInLog = new Parse.Query("CheckInLog");
    CheckInLog.include("user");
    CheckInLog.include("profile");
    CheckInLog.equalTo("activity", this.aid);
    this.logs = await CheckInLog.find();
  }

  async queryToDay() {
    let date = new Date(new Date().toLocaleDateString());
    let CheckInLog = new Parse.Query("CheckInLog");
    CheckInLog.equalTo("activity", this.aid);
    CheckInLog.greaterThan("createdAt", date);
    this.todayCount = await CheckInLog.count();
  }
}
