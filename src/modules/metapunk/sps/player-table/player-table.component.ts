import { Component, OnInit, Input } from '@angular/core';
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

declare var QRCode: any ;

interface ColumnItem {
  name: string;
  left?: boolean;
  right?: boolean;
  customFilter?: any;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn | null;
}


@Component({
  selector: 'app-player-table',
  templateUrl: './player-table.component.html',
  styleUrls: ['./player-table.component.scss']
})
export class PlayerTableComponent implements OnInit {

  @Input('players') players = [];
  @Input('pagination') pagination = true;

  constructor() { }

  ngOnInit(): void {

  }

  // countMap用法
  // 获得某个对象数组 objectMap[className]
  objectMap = {
    Miner:[],
    ProjectTask:[],
    Profile:[],
    NoteSpace:[],
  }



  /*****************************************************************************************/
  /**** 列表排序详情 */

  reset(i): void {
    this.listOfColumns[i].customFilter.searchValue = null;
    // this.loadClass("ProjectTask")
    // this.search(i);
  }

  search(i): void {
    this.listOfColumns[i].customFilter.visible = false;
    let sval = this.listOfColumns[i].customFilter.searchValue;
    this.players = this.players.filter((item: any) => {
      if(item.username.indexOf(sval) !== -1){
        return true
      }
      if(item.mail.indexOf(sval) !== -1){
        return true
      }
      return false
    });
  }
  
  listOfColumns: ColumnItem[] = [
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '玩家名',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
      ],
      filterFn: (list: string[], item: any) => list.some(title => item.username.indexOf(title) !== -1)
    },
    {
      left:true,
      customFilter:{
        visible:false,
        searchValue:null,
        menu:null,
      },
      name: '公会',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [
      ],
      filterFn: (list: string[], item: any) => list.some(guild => item.guild.indexOf(guild) !== -1)
    },
    {
      left:true,
      name: '状态',
      sortOrder: null,
      sortFn: (a: any, b: any) => Number(b.rating) - Number(a.rating), // Boolean排序
      listOfFilter: [
        { text: '已完成', value: true },
        { text: '战斗中', value: false },
      ],
      filterFn: (list: any[], item: any) => list.some(status => status == true)
    },
    // {
    //   left:true,
    //   name: '爆块/算力',
    //   sortFn: (a: any, b: any) => a.get("stateList")&&a.get("stateList").localeCompare(b.get("stateList")),
    //   sortOrder: null,
    //   listOfFilter: [
    //     { text: '待分配', value: '待分配' },
    //     { text: '开发中', value: '开发中' },
    //     { text: '测试中', value: '测试中' },
    //     { text: '已完成', value: '已完成' },
    //     { text: '已上线', value: '已上线' }
    //   ],
    //   filterFn: (list: any[], item: any) => list.some(stateList => item.get("stateList")&&item.get("stateList").indexOf(stateList) !== -1)
    // },
    // {
    //   name: '生效日期',
    //   sortFn: null,
    //   sortOrder: null,
    //   listOfFilter: [],
    //   filterFn: null
    // },
    {
      name: '赛季积分',
      sortFn: (a: any, b: any) => Number(b.rating) - Number(a.rating), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: '卡牌战力',
      sortFn: (a: any, b: any) => Number(b.power) - Number(a.power), // 数字排序
      sortOrder: null,
      listOfFilter: [],
      filterFn: null
    },
    // {
    //   name: '描述',
    //   sortFn: (a: any, b: any) => a.get('deadline') - b.get('deadline'), // 数字排序
    //   sortOrder: null,
    //   listOfFilter: [],
    //   filterFn: null
    // },
    // {
    //   name: '进度',
    //   sortFn: null,
    //   sortOrder: null,
    //   listOfFilter: [],
    //   filterFn: null
    // },
    // {
    //   right:true,
    //   name: '详情',
    //   sortFn: null,
    //   sortOrder: null,
    //   listOfFilter: [],
    //   filterFn: null
    // },
    // {
    //   right:true,
    //   name: '操作',
    //   sortFn: null,
    //   sortOrder: null,
    //   listOfFilter: [],
    //   filterFn: null
    // }
  ];

}
