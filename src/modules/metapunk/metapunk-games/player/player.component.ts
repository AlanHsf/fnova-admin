import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  heigth: any = document.documentElement.clientHeight - 80
  qrCode:string = 'https://file-ciuan.fmode.cn/wxqrcode.jpg'

  constructor() { }

  ngOnInit() {
  }

}
