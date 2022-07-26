import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-arena',
  templateUrl: './game-arena.component.html',
  styleUrls: ['./game-arena.component.scss']
})
export class GameArenaComponent implements OnInit {

  constructor() { }
  
  heigth: any = document.documentElement.clientHeight - 80

  ngOnInit() {
  }

}
