import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit {
  video_url:string = 'https://static.shanhaibi.com/market/theme/video_hd/2899a49f6c63da260c85c7b437ca8b6e.mp4'

  constructor() { }

  ngOnInit() {
    document.documentElement.scrollTop = 300
  }

}
