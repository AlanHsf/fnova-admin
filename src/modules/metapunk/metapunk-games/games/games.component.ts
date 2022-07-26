import { Component, OnInit , Output , EventEmitter} from '@angular/core';
import * as Parse from "parse";
import { GameService } from '../game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  @Output() private outer = new EventEmitter()

  heigth: any = document.documentElement.clientHeight - 80
  value:any = ''
  //游戏分类
  options: any = [
    {
      title: '全部',
      type: 'all'
    },
    {
      title: '推荐',
      type: 'recommend'
    },
    {
      title: '休闲',
      type: 'arder'
    },
    {
      title: '动作',
      type: 'action'
    },
    {
      title: '体育',
      type: 'sports'
    },
    {
      title: '射击',
      type: 'shoot'
    },
    {
      title: '策略',
      type: 'policy'
    },
    {
      title: '冒险',
      type: 'adventure'
    },
    {
      title: '恐怖',
      type: 'terror'
    },
    {
      title: '儿童',
      type: 'children'
    }
  ]

  //游戏大类分类SteamVR、Oculus游戏
  options2:any = [
    "Oculus",
    "SteamVR"
  ]
  type:any = this.options2[0]

  active: number = 0 //当前游戏分类下标
  allGamesList: any = [] //所有游戏
  games: any = [] //当前分类游戏游戏
  pages: number = 0 //游戏数总页码
  activePageIndex: number = 1 //当前游戏页码
  showGames:any = []
  component_id:any = ''

  constructor(
    public gameServ:GameService,
  ) { }

  ngOnInit() {
    this.getMyGames()
  }

  async getMyGames(value?) {
    let query = new Parse.Query("MetaGame")
    query.equalTo("isVR",true)
    query.ascending("order")
    value && query.contains('name',value)
    this.type == 'SteamVR' && query.equalTo('steamVR',true)
    let req = await query.find()
    let res = req.reduce( (arr,item)=>{
      arr.push(item.toJSON())
      return arr
    },[])
    this.allGamesList = res
    this.games = res
    this.pages = Math.ceil(this.games.length / 12)
    this.showGames = res.slice( ( this.activePageIndex-1 ) * 12 , 12 )
    console.log(this.games , this.showGames);
  }

  creatArray(i) {
    let arr = []
    for (let index = 0; index < i; index++) {
      arr.push('i')
    }
    return arr
  }
  
  //切换Oculus、SteamVR
  changCetagory(value){
    this.type = value
    this.active = 0
    this.getMyGames()
  }

  //切换游戏种类分类
  async onChang(index) {
    console.log(index);
    this.active = index
    this.games = index == 0 ? this.allGamesList : index == 1 ? await this.getGameRecommend() : this.allGamesList.reduce( (arr , item) => {
      if(item.type == this.options[index].type){
        arr.push(item)
      }
      return arr
    } ,[])
    this.activePageIndex = 1
    this.pages = Math.ceil(this.games.length / 12)
    this.showGames = this.games.slice( ( this.activePageIndex-1 ) * 12 , 12 )
  }

  //推荐游戏
  async getGameRecommend(){
    let query  = new Parse.Query("GameRecommend")
    query.equalTo("isOpen",true)
    query.ascending("index")
    query.include("game")
    let res = await query.find()
    console.log(res);
    let games = res.reduce( (arr,item)=>{
      let i = item.toJSON()
      if(this.type == 'SteamVR'){
        i.game.steamVR && arr.push(i.game)
      }else{
        arr.push(i.game)
      }
      return arr
    },[])
    return games
  }

  changPage(i, type?) {
    console.log(i, type);
    if (i) this.activePageIndex = i
    if (type) {
      switch (type) {
        case 'left':
          this.activePageIndex = this.activePageIndex - 1
          break;
        default:
          this.activePageIndex = this.activePageIndex + 1
          break;
      }
    }
    this.showGames = this.games.slice( 
      ( this.activePageIndex-1 ) * 12 - (this.activePageIndex == 1 ? 0 : 1), 12 
    )
    console.log(this.showGames);
  }

  //搜索
  onSearch(e?){
    if(e){
      if(e.keyCode == 13)
      console.log(this.value);
      this.getMyGames(this.value)
    }else{
      console.log(this.value);
      this.getMyGames(this.value)
    }
  }

  onDetail(id){
    console.log(id);
    this.component_id = id
  }
  
  changComopnonets(){
    this.component_id = ''
  }
  //通过子组件获取的连接状态，并返回给父组件
  getData(steta:boolean){
    console.log(steta);
    steta && this.outer.emit(true)
  }
}
