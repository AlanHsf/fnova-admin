import { Component, OnInit, Output , EventEmitter} from '@angular/core';
import * as Parse from "parse";
import { GameService } from '../game.service';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss']
})
export class RecommendComponent implements OnInit {
  @Output() private outer = new EventEmitter()

  component_id:string

  isOpen: boolean
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  heigth: any = document.documentElement.clientHeight - 281
  activeGame: any
  isPlay: boolean = false
  isRoll: any = false
  games: any = []
  current:number = 0 //当前选择游戏索引
  marginLeft: any = (document.documentElement.clientWidth * .4)  //所有游戏向右偏移像素
  
  constructor(
    public gameServ:GameService,
  ) { }

  async ngOnInit() {
    await this.getGames()
    await this.lunbo(1)
    window.onresize = ()=> {
      this.marginLeft = (document.documentElement.clientWidth * .4) - this.current
    }
  }

  async getGames(){
    let query  = new Parse.Query("GameRecommend")
    query.equalTo("isOpen",true)
    query.ascending("index")
    query.include("game")
    let res = await query.find()
    console.log(res);
    let games = res.reduce( (arr,item)=>{
      arr.push(item.toJSON())
      return arr
    },[])
    this.games = games
    this.activeGame = games[0]
  }

  lunbo(i) {
    setTimeout(() => {
      this.isRoll = true
    }, i);
  }

  onChang(e) {
    console.log(e);
    if (e != 4) {
      this.isPlay = true
    } else {
      this.isPlay = false
    }
  }

  //切换游戏
  onChangGame(i) {
    console.log(i);
    if(this.activeGame.objectId != this.games[i].objectId){
      this.activeGame = this.games[i]
      this.isRoll = false
      this.lunbo(200)
      this.current = i * 310
      this.marginLeft = (document.documentElement.clientWidth * .4) - this.current
    }
  }

  collect(e,i){
    window.event? window.event.cancelBubble = true : e.stopPropagation();
    console.log(i);
    this.games [i].start = !this.games [i].start
  }

  // isStart:boolean

  //下载、启动游戏
  async onDownload(){
    this.component_id = this.activeGame.game.objectId
    return
  }

  //父组件tab传值改变页面显示
  changComopnonets(){
    this.component_id = ''
  }

  //通过子组件获取的连接状态，并返回给父组件
  getData(steta:boolean){
    console.log(steta);
    steta && this.outer.emit(true)
  }
}
