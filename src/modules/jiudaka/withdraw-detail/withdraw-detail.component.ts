import { Component, OnInit } from '@angular/core';


import  {ActivatedRoute} from '@angular/router'
import { uid } from 'gantt';
import * as Parse from 'parse'
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-withdraw-detail',
  templateUrl: './withdraw-detail.component.html',
  styleUrls: ['./withdraw-detail.component.scss']
})
export class WithdrawDetailComponent implements OnInit {
  confirmModal?: NzModalRef;
  constructor(
      private activatedRoute : ActivatedRoute,
      private modal: NzModalService,
      private message : NzMessageService
  ) { }

  withdraw:any
  type:any
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async params => {
        let wid = params.get('PobjectId')
        this.queryWithDraw(wid)
    })  
  }

    async queryWithDraw(wid){
        let UAWithdraw = new Parse.Query('UserAgentWithdraw')
        UAWithdraw.include('user')
        UAWithdraw.include('account')
        let uaWithdraw = await UAWithdraw.get(wid)
        if(uaWithdraw && uaWithdraw.id) {
            this.withdraw = uaWithdraw
            console.log(this.withdraw)
            this.type =  this.withdraw.get('type')
        }
    }
    save() {
      this.confirmModal = this.modal.confirm({
        nzTitle: '确认保存修改信息?',
        nzContent: '确认保存修改之后，体现信息将会改变',
        nzOnOk: () =>
          new Promise(async (resolve, reject) => {
            this.withdraw.set('type', this.type)
            console.log(this.withdraw, this.type)
            this.message.success('修改成功')
            await this.withdraw.save()
            resolve(true)
          }).catch(() => console.log('Oops errors!'))
      });
      
    }


}
