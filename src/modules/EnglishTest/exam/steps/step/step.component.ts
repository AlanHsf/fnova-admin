import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "exam-step",
  templateUrl: "./step.component.html",
  styleUrls: ["./step.component.scss"],
})
export class StepComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() subtitle: string;

  constructor() {}

  ngOnInit(): void {}
}
