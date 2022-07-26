import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// 导入 Parse
import * as Parse from "parse"
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;

  // 在浏览器本地存储中获取company
  public company: string = ''
  public show: boolean = true

  // 定义接收留言数据的对象数组
  public message: object[] = []
  public name: string = ''  // 输入姓名搜索留言
  public current: number = 1  // 当前页码
  public size: number = 10  // 每页展示数据
  public total: number = 0  // 总页码

  constructor(private activRoute: ActivatedRoute, private modal: NzModalService, private router: Router) { }

  // 初始化组件的生命周期函数，只调用一次
  async ngOnInit(): Promise<void> {
    this.company = localStorage.getItem('company')
    await this.getMessage(this.current,this.size)
  }

  // 页头返回上一页功能
  onBack(): void {
    history.go(-1)
  }

  // 根据姓名搜索留言
  async onSearch(): Promise<any> {
    this.show = true
    let name = this.name
    if(!name) {
      this.show = false
      return false
    }
    let query = new Parse.Query('Feedback')
    query.startsWith('name', name)
    let result = await query.find()
    let list = []
    if(result) {
      result.forEach(val => {
        let item = val.toJSON()
        list.push(item)
      })
      this.total = Math.ceil(list.length / 10)
      this.message = list
      this.show = false
    }
  }

  // 获取对应 company 的 Feedback 表中的留言数据
  async getMessage(pageNum: number,pageSize: number): Promise<void> {
    this.show = true
    let Comment = new Parse.Query('Feedback')
    Comment.equalTo('company', this.company)
    Comment.include('comment')
    Comment.include('profile')
    this.total = await Comment.count()
    Comment.descending('createdAt')
    Comment.skip((pageNum - 1) * pageSize)
    Comment.limit(pageSize)
    let comment = await Comment.find()
    let list = []
    if(comment) {
      comment.forEach(val => {
        let item = val.toJSON()
        let comment = item.comment
        if(item.comment) {
          let commentCount = 0
          comment.forEach(val => {
            if(val.identyType == '') {
              commentCount++
              item.commentCount = commentCount
            }
          });
        }
        list.push(item)
      })
      
      this.message = list
      this.show = false
    }
  }

  // 删除点击留言数据
  showDeleteConfirm(id: string): void {
    this.modal.confirm({
      nzTitle: '确定要删除该评论吗？',
      nzContent: "<b style='color: red;'>（不可恢复！）</b>",
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOnOk: () => this.delete(id),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  async delete(id: string): Promise<void> {
    let Comment = new Parse.Query('Feedback')
    let comment = await Comment.get(id)
    comment.destroy().then(() => {
      this.getMessage(this.current,this.size)
    })
  }

  // 回复留言
  sendReply(id: string): void {
    this.router.navigate(['ncsy/reply', { id }])
  }

  // 当前页码改变的处理函数
  changeIndex(): void {
    this.getMessage(this.current,this.size)
  }

  // 每页展示数据改变的处理函数
  changeSize(): void {
    this.getMessage(this.current,this.size)
  }
}
