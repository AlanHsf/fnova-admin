import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import * as Parse from "parse";
import { ActivatedRoute, Router } from "@angular/router";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "student-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  // @Output() getStatus=new EventEmitter<number>();
  constructor(
    public authServ: AuthService,
    private router: Router,
    public message: NzMessageService,
    private activatedRoute: ActivatedRoute
  ) {
        this.profileId = localStorage.getItem('pid')
  }
  profileId:any;
  loginStatus: boolean = false;
  currentUser: any;
  logo: any;
  url: any;
  @Input() activeIndex: any;
  @Output() newItemEvent = new EventEmitter<number>();
  @Input() LessonId: any;
  LessonTitle: any;
  type: any;
  loginPage: any;
  tabs = [
    {
      name: "我的学习",
      icon: "../../../assets/img/self-study/img/study.png"
    },
    {
      name:"我的考试",
      icon: "../../../assets/img/self-study/img/pyfa.png"
    },
    {
      name: "免考办理",
      icon: "../../../assets/img/self-study/img/lw.png"
    },
    {     
      name:
      localStorage.getItem("education") == '"本科"'? "论文申报": "",
    },
    {
      name:
        localStorage.getItem("education") == '"本科"'? "学士学位": "",
      icon: "../../../assets/img/masterol/img/pyfa.png"
    },
  ];
  showNav: boolean = true;

  ngOnInit() {
    this.currentUser = Parse.User.current();
    this.profileId = localStorage.getItem('pid')
    let queryLogo = new Parse.Query("Company");
    let cid = localStorage.getItem("company")
      ? localStorage.getItem("company")
      : "1ErpDVc1u6";
    queryLogo.equalTo("objectId", cid);
    // queryProfile.include("SchoolMajor");
    queryLogo.first().then(async res => {
      if (res && res.id) {
        this.logo = res.get("logo");
        localStorage.setItem("logo", this.logo);
      }
    });
    let url = this.router.url.split(";");
    this.url = url;
    console.log(url)
    if (url) {
      if (url[0] == "/self-study/student-test") {
        this.type = true;
        this.showNav = false;
      }
      if (url[0] == "/self-study/student-login") {
        console.log(url[0])
        this.loginPage = true;
        this.showNav = false;
      }
      if (this.url[0] == "/self-study/student-profile") {
        this.showNav = false;
      }
      if (url[0] == "/self-study/student-study/detail") {
        this.getLessonTitle();
      }
    }
  }
  indexChange(value) {
    if (this.url[0] == "/self-study/student-study/detail") {
      this.router.navigate([
        "/self-study/student-center",
        { activeIndex: this.activeIndex }
      ]);
      return;
    } else {
      this.router.navigate([
        "/self-study/student-center",
        { activeIndex: this.activeIndex }
      ]);
      this.newItemEvent.emit(value);
    }
  }
  isVisible = false;
  loginOut() {
    // this.getStatus.emit()
    this.showModal();
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
    // 调用auth.service中的logout方法
    this.authServ.logout(null);
  }

  handleCancel(): void {;
    this.isVisible = false;
  }
  toHome() {
    if (this.currentUser) {
      this.router.navigate(["/self-study/student-center"]);
    } else {
      this.message.info("请先登录");
    }
  }
  toProfile() {
    if (this.currentUser) {
      this.router.navigate(["/self-study/student-profile"]);
    } else {
      this.message.info("请先登录");
    }
  }
  getLessonTitle() {
    let query = new Parse.Query("Lesson");
    query.equalTo("objectId", this.LessonId);
    query.first().then(res => {
      let lesson = res;
      if (lesson && lesson.id) {
        this.LessonTitle = lesson.get("title");
      }
    });
  }
}
