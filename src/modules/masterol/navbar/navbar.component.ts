import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { AuthService } from "../auth.service";
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
    private message: NzMessageService,
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
      icon: "../../../assets/img/masterol/img/study.png"
    },
    {
      name:
        localStorage.getItem("company") == "sWojJgvO3B"
          ? "专业计划"
          : "培养计划",
      icon: "../../../assets/img/masterol/img/pyfa.png"
    },
    {
      name:
        localStorage.getItem("company") == "sWojJgvO3B"
          ? "在学课程"
          : "我的课表",
      icon: "../../../assets/img/masterol/img/kb.png"
    },
    {
      name: "我的成绩",
      icon: "../../../assets/img/masterol/img/cj.png"
    },
    {
      name: "我的论文",
      icon: "../../../assets/img/masterol/img/lw.png"
    },
    {
      name: "毕业档案",
      icon: "../../../assets/img/masterol/img/by.png"
    }
  ];
  showNav: boolean = true;

  ngOnInit() {
    this.currentUser = Parse.User.current();
    // if (localStorage.getItem('logo')) {
    //   this.logo = localStorage.getItem('logo')
    // } else {
    this.profileId = localStorage.getItem('pid')
    let queryLogo = new Parse.Query("Company");
    let cid = localStorage.getItem("company")
      ? localStorage.getItem("company")
      : "pPZbxElQQo";
    queryLogo.equalTo("objectId", cid);
    // queryProfile.include("SchoolMajor");
    queryLogo.first().then(async res => {
      if (res && res.id) {
        this.logo = res.get("logo");
        localStorage.setItem("logo", this.logo);
      }
    });
    // }
    // if(!this.LessonId){
    //   this.LessonId = localStorage.getItem("LessonId")
    // }
    let url = this.router.url.split(";");
    this.url = url;
    if (url) {
      if (url[0] == "/masterol/student-test") {
        this.type = true;
        this.showNav = false;
      }
      if (url[0] == "/masterol/student-login") {
        this.loginPage = true;
        this.showNav = false;
      }
      if (this.url[0] == "/masterol/student-profile") {
        this.showNav = false;
      }
      if (url[0] == "/masterol/student-study/detail") {
        this.getLessonTitle();
      }
    }
  }
  indexChange(value) {
    if (this.url[0] == "/masterol/student-study/detail") {
      this.router.navigate([
        "/masterol/student-center",
        { activeIndex: this.activeIndex }
      ]);
      return;
    } else {
      this.router.navigate([
        "/masterol/student-center",
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
      this.router.navigate(["/masterol/student-center"]);
    } else {
      this.message.info("请先登录");
    }
  }
  toProfile() {
    if (this.currentUser) {
      this.router.navigate(["/masterol/student-profile"]);
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
