import { Component, OnInit,ElementRef } from '@angular/core';

interface videos {
  title: string,
  url: string
}
@Component({
  selector: 'app-monitor-paly',
  templateUrl: './monitor-paly.component.html',
  styleUrls: ['./monitor-paly.component.scss']
})
export class MonitorPalyComponent implements OnInit {
  value: string
  list: Array<videos> = [
    {
      title: '港口01',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/9e4fde89780f879a17a3a3b68dd2d4ad.mp4'
    },
    {
      title: '港口04',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/49a768e76f06df7c1d3e619503ab33fa.mp4'
    },
    {
      title: '港口07',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/ba7e9dc07a310e2d4a7730a2a99b4af0.mp4'
    },
    {
      title: '船头10',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/bf7b5cbbcaf51977ba1d6c10785b291c.mp4'
    },
    {
      title: '港口01',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/3a8cc0450063c7876047d9e6bbba3129.mp4'
    },
    {
      title: '港口11',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/f538fac4a4f8d6d0a21550c3e9797203.mp4'
    },
    {
      title: '港口09',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/18474dcae86edc55622f433882c9e7ac.mp4'
    },
    {
      title: '港口01',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/397e1c1ef91de3b8e76bab77bfc13b50.mp4'
    },
    {
      title: '仓库01',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/d801ed7d9f5e4025e2497d8dcc1ba6c3.mp4'
    },
    {
      title: '港口12',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/0f50293f4b4bc3d3e4df9c31afe3f50e.mp4'
    },
    {
      title: '港口15',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/fe057347ad1ef5dd5e79536a8dc50b4a.mp4'
    },
    {
      title: '港口20',
      url: 'https://static.shanhaibi.com/market/theme/video_hd/7f30bed9f255bcafc53aa5c05b6992bc.mp4'
    },
  ]
  show: boolean = false
  current: object

  constructor(private el: ElementRef) { }

  ngOnInit() {

  }
  onShow(item) {
    let video = document.querySelector('video');
    video.pause()
    console.log(item);
    this.show = true
    this.current = item
  }
  onColse(){
    this.show = false
  }
  onPlay(i){
    console.log(i);
    this.el.nativeElement.querySelector('.video' + i).play()
  }
}
