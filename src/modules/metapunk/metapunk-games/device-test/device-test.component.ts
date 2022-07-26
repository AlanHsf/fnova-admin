import { Component, OnInit } from '@angular/core';

import { GameService } from '../game.service';


@Component({
  selector: 'app-device-test',
  templateUrl: './device-test.component.html',
  styleUrls: ['./device-test.component.scss']
})
export class DeviceTestComponent implements OnInit {

  constructor(public gameServ:GameService) {
  }

  ngOnInit(): void {
    this.gameServ.initElectronRender();
  }


}
