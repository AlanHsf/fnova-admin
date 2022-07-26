import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-setting',
  templateUrl: './activity-setting.component.html',
  styleUrls: ['./activity-setting.component.scss']
})
export class ActivitySettingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  listOfData = [
    {
      key: '1',
      name: '涛涛1',
      number: 1,
      numberRatio:"20%",
      addTime:"2020-10-11"
    },
    {
      key: '2',
      name: '涛涛2',
      numberRatio:"20%",
      number: 1,
      addTime:"2020-10-11"

    },
    {
      key: '3',
      name: '涛涛3',
      numberRatio:"20%",
      number: 1,
      addTime:"2020-10-11"

    }
  ];


}
