import { ChangeDetectorRef, NgZone } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Parse from "parse";
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss']
})
export class RuleComponent implements OnInit {
  article: any;
  deadline: any;
  status: boolean = false;
  constructor(private activRoute: ActivatedRoute, private route: Router, private cdRef: ChangeDetectorRef, private ngZone: NgZone, private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      console.log(params);
      let Article = new Parse.Query("Article");
      Article.equalTo("type", 'test-instruct');
      Article.equalTo("company", localStorage.getItem("company"));
      Article.equalTo("isEnabled", true);
      let article = await Article.first();
      console.log(article);
      if (article && article.id) {
        this.article = article.toJSON();
        this.article.content = this.sanitizer.bypassSecurityTrustHtml(this.article.content);
        this.deadline = Date.now() + 1000 * 15;
        console.log(this.deadline, this.article);
      }
    })
  }
  timeOut() {
    this.status = true;
    console.log(this.status);
    this.cdRef.detectChanges();
  }
  toPage() {
    console.log(1111)
    this.ngZone.run(() => {
      this.route.navigate(["/english/start"]);
    })
  }
}
