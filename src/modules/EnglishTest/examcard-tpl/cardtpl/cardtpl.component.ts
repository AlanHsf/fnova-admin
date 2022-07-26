import { FOCUS_TRAP_INERT_STRATEGY } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";

@Component({
  selector: 'eng-card-tpl',
  templateUrl: './cardtpl.component.html',
  styleUrls: ['./cardtpl.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class EngcardTplComponent implements OnInit {
  @Input() cardData;
  @Input() type;
  profile: any;
  article: any;
  ngOnInit() {
    this.profile = this.cardData.profile
    this.article = this.cardData.article
    console.log(this.profile, this.article, this.type);

  }




}
