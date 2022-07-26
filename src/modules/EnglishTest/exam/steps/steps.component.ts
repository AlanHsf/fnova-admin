import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "exam-steps",
  templateUrl: "./steps.component.html",
  styleUrls: ["./steps.component.scss"],
})
export class StepsComponent implements OnInit {
  @Input() current: number; // 当前激活项
  @Input() size: any[]; // 尺寸
  constructor() {}

  ngOnInit(): void {}
}
