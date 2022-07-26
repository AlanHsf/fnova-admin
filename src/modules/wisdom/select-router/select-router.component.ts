import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-router',
  templateUrl: './select-router.component.html',
  styleUrls: ['./select-router.component.scss']
})
export class SelectRouterComponent implements OnInit {

  constructor(
    private activatRoute: ActivatedRoute,
    private router: Router,
  ) { }
  options: any = [
    {
      title: '账册管理',
      url: '/common/manage/WisdomZhangce;rid=CNIruWeXbC'
    },
    {
      title: '核放单查询 ',
      url: '/common/manage/WisdomShenbao;rid=Yi6PFAFXgX'
    },
    {
      title: '库存明细查询',
      url: '/common/manage/WisdomStoke;rid=dgR9iHqEgJ'
    },
  ]
  ngOnInit() {
    let that = this
    this.activatRoute.paramMap.subscribe(async (params) => {
      let type = params.get('type')
      console.log(type);
      switch (type) {
        case 'cxtj':
          that.options = [
            {
              title: '核放单管理',
              url: '/common/manage/WisdomShenbao;rid=CqFifhWsXh'
            },
            {
              title: '补税清单管理 ',
              url: '/common/manage/WisdomBushuidan;rid=D7U5n2TbZG'
            },
            {
              title: '备案登记表管理',
              url: '/common/manage/WisdomBeian;rid=qGiml5nmC0'
            },
          ]
          break;
        case 'qglx':
          that.options = [
            {
              title: '放行信息管理',
              url: '/common/manage/WisdomZhangce;equalTo=isGQLD:true;rid=3vcGZ4JVd3'
            },
            {
              title: '卡口核销 ',
              url: '/common/manage/WisdomKakouhexiao;rid=HRJMzMQ6z1'
            },
            {
              title: '直通核放单管理',
              url: '/common/manage/WisdomZhangce;equalTo=isGQLD:true;rid=hjidA1QbiH'
            },
          ]
          break;
        default:
          break;
      }
    })
  }

  toUrl(url) {
    // this.router.navigate([{ url }, {}])
    window.location.href = url
  }
}
