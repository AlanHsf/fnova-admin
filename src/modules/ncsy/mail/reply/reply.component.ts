import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// 导入 Parse
import * as Parse from "parse"

import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class ReplyComponent implements OnInit {

  public id: string = ''  // 上级路由传递的留言id
  public message: any = null // 留言对象
  public reply: string = '' // 回复内容

  constructor(private activRoute: ActivatedRoute, private modal: NzModalService,private Message: NzMessageService) { }

  async ngOnInit(): Promise<void> {
    this.activRoute.paramMap.subscribe((params) => {
      let id = params.get("id")
      this.id = id
    })
    await this.getMsg()
  }

  // 页头返回上一页功能
  onBack(): void {
    history.go(-1)
  }

  // 获取对应的留言相关数据
  async getMsg(): Promise<void> {
    let Comment = new Parse.Query('Feedback')
    Comment.include('comment')
    Comment.include('profile')
    let comment = await Comment.get(this.id)
    let commentJSON = comment.toJSON()
    this.message = commentJSON
  }

  // 删除此条留言
  deleteMsg(): void {
    this.modal.confirm({
      nzTitle: '确定要删除此留言吗？',
      nzContent: "<b style='color: red;'>（不可恢复！）</b>",
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: async () => {
        let Comment = new Parse.Query('Feedback')
        let comment = await Comment.get(this.id)
        comment.destroy().then(() => {
          history.go(-1)
        })
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 删除此条留言回复
  deleteReply(index: number): void {
    this.modal.confirm({
      nzTitle: '确定要删除此回复吗？',
      nzContent: "<b style='color: red;'>（不可恢复！）</b>",
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: async () => {
        let Comment = new Parse.Query('Feedback')
        let comment = await Comment.get(this.id)
        let reply = this.message.comment
        reply.splice(index,1)
        comment.set('comment', reply)
        comment.save()
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 回复留言
  async sendReply(): Promise<void> {
    let replyObj = {
      identyType: '管理员',
      text: this.reply
    }
    let Comment = new Parse.Query('Feedback')
    let comment = await Comment.get(this.id)
    let reply = this.message.comment
    reply.push(replyObj)
    comment.set('comment', reply)
    comment.save().then(() => {
      this.Message.create('success', '回复提交成功');
      this.getMsg()
      this.reply = ''
    })
  }
}
