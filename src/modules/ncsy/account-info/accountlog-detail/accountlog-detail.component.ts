import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accountlog-detail',
  templateUrl: './accountlog-detail.component.html',
  styleUrls: ['./accountlog-detail.component.scss']
})
export class AccountlogDetailComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute,  private router: Router) {

  }
  name:string = ''
  accountid:string = ''
  ngOnInit() {
    this.activRoute.paramMap.subscribe(parms => {
      this.name = parms.get('name')
      this.accountid = parms.get('accountid')
      console.log(parms)
    })
  }


}
