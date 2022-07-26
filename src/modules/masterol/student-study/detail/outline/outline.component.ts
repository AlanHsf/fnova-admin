import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'detail-outline',
  templateUrl: './outline.component.html',
  styleUrls: ['./outline.component.less']
})
export class OutlineComponent implements OnInit {
  // @Input() LessonOutline:any;
  private attachments: any = [];
  _articles: any;
  @Input("articles")
  set articles(value: any) {
    this._articles = value;
    console.log(this._articles)
    for (let i = 0; i < this._articles.length; i++) {
      this._articles[i].show = false;
    }
  }

  constructor() { }
  ngOnInit(): void {
  }
  showChildren(articleId) {
    this._articles.forEach(article => {
      if (article.objectId == articleId) {
        article.show = !article.show;        
      }
    })
  }
}
