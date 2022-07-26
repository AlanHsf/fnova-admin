import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-park',
  templateUrl: './dashboard-park.component.html',
  styleUrls: ['./dashboard-park.component.scss']
})
export class DashboardParkComponent implements OnInit {

  video_url:string = 'https://file-cloud.fmode.cn/IOC.mp4'
  constructor(
    private activatRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    document.documentElement.scrollTop = 300
    let that = this
    this.activatRoute.paramMap.subscribe(async (params) => {
      let type = params.get('type')
      console.log(type);
      switch (type) {
        case 'logistics':
        that.video_url = 'https://file-cloud.fmode.cn/bsq.mp4'
        break;
        case 'safe':
          that.video_url = 'https://static.shanhaibi.com/market/theme/video_hd/c923dad2ed16fbb3c3d9bcbc02a4feb7.mp4'
          break;
        default:
          break;
      }
    })
  }

}
