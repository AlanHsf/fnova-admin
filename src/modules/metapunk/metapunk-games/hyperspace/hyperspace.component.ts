import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as Parse from "parse";

@Component({
  selector: 'app-hyperspace',
  templateUrl: './hyperspace.component.html',
  styleUrls: ['./hyperspace.component.scss']
})
export class HyperspaceComponent implements OnInit {
  @Output() private outer = new EventEmitter()

  heigth: any = document.documentElement.clientHeight - 80
  games: any
  video: any = 'https://nie.v.netease.com/nie/netvios/creed1.mp4'
  image: any = 'https://file-cloud.fmode.cn/m1.jpg'
  active: number = 0
  marginLeft: any = 0
  swperListHeight = document.documentElement.clientWidth * .8 * .9 //轮播图可视区域宽度
  num: any = Math.ceil(this.swperListHeight / 220) //轮播可视宽度数量
  component_id: any

  constructor() { }

  ngOnInit() {
    this.getGames()
  }

  async getGames() {
    let list = []
    let query = new Parse.Query("MetaGame")
    query.equalTo("isVR",true)
    query.equalTo("superRoom",true)
    let res = await query.find()
    res.forEach(item =>{
      list.push(item.toJSON())
    })
    this.games = list
  }

  bank() {
    if (this.active != 0) {
      this.marginLeft = (this.active + 1) * 200
      this.active = this.active + 1
    }
  }

  next() {    
    if (this.active >= (-this.games.length - 1 + this.num)) {
      this.marginLeft = (this.active - 1) * 200
      this.active -- 
    }
    console.log(this.num,this.active);

  }

  onDetail(id) {
    console.log(id);
    this.component_id = id
  }

  changComopnonets() {
    this.component_id = ''
  }
  //通过子组件获取的连接状态，并返回给父组件
  getData(steta: boolean) {
    console.log(steta);
    steta && this.outer.emit(true)
  }
}
