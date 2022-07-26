import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as Parse from "parse";

@Component({
  selector: 'app-game-store',
  templateUrl: './game-store.component.html',
  styleUrls: ['./game-store.component.scss']
})
export class GameStoreComponent implements OnInit {
  @Output() private outer = new EventEmitter()

  left: string = '<'
  right: string = '>'
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
  active: number = 0 //当前游戏分类下标
  heigth: any = document.documentElement.clientHeight - 80
  effect = 'scrollx';
  isPlay: boolean = true
  swperGames: any = []
  allGame: any = []
  games: any = [] //当前分类游戏游戏
  pages: number = 0 //游戏数总页码
  activePageIndex: number = 1 //当前游戏页码
  showGames: any = []
  component_id: any = ''

  constructor() { }

  ngOnInit() {
    this.getGames()
  }

  async getGames() {
    let query = new Parse.Query("MetaGame")
    query.equalTo("isVR", true)
    query.ascending("order")
    let req = await query.find()
    let res = req.reduce((arr, item) => {
      arr.push(item.toJSON())
      return arr
    }, [])
    // let res = [
    //   {
    //     img:'https://cloud.file.futurestack.cn/mtpc1-1.jpg',
    //     imgs:[
    //       'https://cloud.file.futurestack.cn/mtpc1.jpg'
    //     ],
    //     id:'aasiweex31s3s',
    //     name:'荣耀擂台',
    //     tags:['运动'],
    //     type:'recommend',
    //     Issue_date:'2021-10-10',
    //     language:'English',
    //     edition:'0.01',
    //     developer:'metapunk JX'
    //   },
    // ]
    this.allGame = res
    this.swperGames = res.slice(0, 3)
    this.games = res
    this.pages = Math.ceil(this.games.length / 12)
    this.showGames = res.slice((this.activePageIndex - 1) * 12, 12)
  }

  next(f, swpers) {
    if (f == 'next') {
      swpers.next()
    } else {
      swpers.pre()
    }
  }

  async onChangPage(index) {
    console.log(index);
    this.active = index
    this.games = index == 0 ? this.allGame : index == 1 ? await this.getGameRecommend() : this.allGame.reduce((arr, item) => {
      if (item.type == this.options[index].type) {
        arr.push(item)
      }
      return arr
    }, [])
    this.activePageIndex = 1
    this.pages = Math.ceil(this.games.length / 12)
    this.showGames = this.games.slice((this.activePageIndex - 1) * 12, 12)
  }

  //推荐游戏
  async getGameRecommend() {
    let query = new Parse.Query("GameRecommend")
    query.equalTo("isOpen", true)
    query.ascending("index")
    query.include("game")
    let res = await query.find()
    console.log(res);
    let games = res.reduce((arr, item) => {
      let i = item.toJSON()
      arr.push(i.game)
      return arr
    }, [])
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
      (this.activePageIndex - 1) * 12 - (this.activePageIndex == 1 ? 0 : 1), 12
    )
    console.log(this.showGames);
  }

  creatArray(i) {
    let arr = []
    for (let index = 0; index < i; index++) {
      arr.push('i')
    }
    return arr
  }


  //切换详情组件
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
