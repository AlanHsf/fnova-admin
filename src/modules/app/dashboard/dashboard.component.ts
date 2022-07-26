import * as Parse from "parse";
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { ChangeDetectorRef } from "@angular/core"


@Component({
  selector: 'hr360-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(
    private cdRef:ChangeDetectorRef,
  ) { 
  }
  ngOnInit() {
    
  }

}
