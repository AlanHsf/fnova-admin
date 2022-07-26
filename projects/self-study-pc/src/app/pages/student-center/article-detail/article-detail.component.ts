import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

   ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => {
      this.articleId = param.newsId
      this.articleType = param.type
    })
     this.getDetailsMessage(this.articleId,this.articleType)
  }
  activeIndex: any = 1
  company: any = localStorage.getItem("company")
  articleId: any = ''
  articleType: any = ""
  mInfo: any = null
  nInfo: any = null

  async getDetailsMessage(articleId,articleType) {
    console.log(articleId);
    let article = new Parse.Query('Article')
    article.equalTo("objectId",articleId)
    let articleDetails = await article.find()
    this.nInfo = articleDetails[0]
    console.log(this.nInfo);    
  }
}
