import { Component, OnInit } from '@angular/core';

import { SpsService } from '../sps.service';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  cards:any = []
  gridStyle = {
    // width: '25%',
    textAlign: 'center'
  };
  constructor(
    public spsServ: SpsService
  ) { }

  ngOnInit():void {
      this.refresh();
  }

  async refresh(){
    this.cards = await this.spsServ.loadAllCards();
    console.log(this.cards)
  }

}
