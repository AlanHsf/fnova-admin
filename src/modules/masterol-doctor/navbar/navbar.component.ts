import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import * as Parse from 'parse';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'student-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  // @Output() getStatus=new EventEmitter<number>();
  constructor(public authServ: AuthService, private router: Router, private message: NzMessageService, private activatedRoute: ActivatedRoute) { }
  loginStatus: boolean = false;
  currentUser: any;
  logo: any;
  url:any;
  @Input()activeIndex:any;
  @Output() newItemEvent = new EventEmitter<number>();
  @Input() LessonId: any;
  LessonTitle: any;
  type: any;
  loginPage:any;
  tabs = [
    {
      name: "我的学习",
      icon: "../../../assets/img/masterol/img/study.png"
    },
    {
      name: '培养计划',
      icon: "../../../assets/img/masterol/img/pyfa.png"
    },
    
    {
      name: "学术成果",
      icon: "../../../assets/img/masterol/img/cj.png"
    },
    {
      name: "我的论文",
      icon: "../../../assets/img/masterol/img/lw.png"
    },
    {
      name: "个人档案",
      icon: "../../../assets/img/masterol/img/by.png"
    }
  ];
  showNav:boolean = true;

  ngOnInit() {
    this.currentUser = Parse.User.current();
    // if (localStorage.getItem('logo')) {
    //   this.logo = localStorage.getItem('logo')
    // } else {
    let queryLogo = new Parse.Query("Company");
    let cid = localStorage.getItem('company') ? localStorage.getItem('company') : 'ddPAWeIInO'
    console.log(cid)
    queryLogo.equalTo("objectId", cid);
    // queryProfile.include("SchoolMajor");
    queryLogo.first().then(async res => {
      if (res && res.id) {
        this.logo = res.get('logo')
        console.log(this.logo)
        localStorage.setItem('logo', this.logo)
      }
    })
    // }
    // if(!this.LessonId){
    //   this.LessonId = localStorage.getItem("LessonId")
    // }
    console.log(this.activatedRoute);
    
    let url = this.router.url.split(';');
    this.url = url;
    if(url){
      if(url[0] == '/masterol-doctor/student-test'){
        this.type = true;
        this.showNav = false;
      }
      if(url[0] == '/masterol-doctor/student-login'){
        
        this.loginPage = true;
        this.showNav = false;
      }
      if(this.url[0] == '/masterol-doctor/student-profile'){
        this.showNav = false;
      }
      if(url[0] == '/masterol-doctor/student-study/detail'){
        this.getLessonTitle()
      }

    }
  }
  indexChange(value){
    if(this.url[0] == '/masterol-doctor/student-study/detail'){
      this.router.navigate(['/masterol-doctor/student-center',{activeIndex: this.activeIndex}])
      return
    } else {
       this.router.navigate([
         "/masterol-doctor/student-center",
         { activeIndex: this.activeIndex }
       ]);
       console.log()
       this.newItemEvent.emit(value);
    }
   

   
  }
  isVisible = false;
  loginOut() {
    // this.getStatus.emit()
    this.showModal()

  }
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
    // 调用auth.service中的logout方法
    this.authServ.logout(null);
    console.log('退出登录成功');

  }

  handleCancel(): void {
    console.log('取消退出登录');
    this.isVisible = false;
  }
  toHome() {
    if (this.currentUser) {
      this.router.navigate(['/masterol/student-center'])
    } else {
      this.message.info('请先登录');
    }
  }
  toProfile() {
    if (this.currentUser) {
      this.router.navigate(['/masterol/student-profile'])
    } else {
      this.message.info('请先登录');

    }
  }
  getLessonTitle() {
    console.log(this.LessonId);
    let query = new Parse.Query("Lesson");
    query.equalTo("objectId", this.LessonId);
    query.first().then(res => {
      let lesson = res;
      if (lesson && lesson.id) {
        this.LessonTitle = lesson.get("title")
      }

    })
  }

}
