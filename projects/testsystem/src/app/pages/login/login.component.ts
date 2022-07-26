import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, ActivatedRoute } from '@angular/router';
import * as Parse from 'parse'
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  departId: string;
  department: any;
  bgImg: string = '';
  recruit: any;// 招生计划
  pCompany: any;
  company: any;
  examTitle: string;
  constructor(private message: NzMessageService, private router: Router, private activRoute: ActivatedRoute, private authServ: AuthService) {
    localStorage.setItem("hiddenMenu", 'true');

  }
  ngOnInit() {
    this.activRoute.paramMap.subscribe(async params => {
      this.departId = params.get('did');
      let Department = new Parse.Query("Department");
      Department.include('subCompany');
      Department.include('company');
      let department: any = await Department.get(this.departId);
      console.log(department)
      if (department && department.id) {
        this.department = department;
        this.bgImg = department.get('bgImg')
        this.company = department.get('subCompany') && department.get('subCompany').id;
        this.pCompany = department.get('company');
        localStorage.setItem("company", this.company)
        localStorage.setItem("departInfo", JSON.stringify(department))// 院校company
        localStorage.setItem("department", this.departId)// 院校company
        this.getExam()
      }
      let BACKGROUP_LOGIN = localStorage.getItem('BACKGROUP_LOGIN')
      if (BACKGROUP_LOGIN) {
        this.bgImg = BACKGROUP_LOGIN;
      }
    });
  }
  username: any;
  password: any;
  login() {
    console.log(this.message);
    let username = this.username;
    let password = this.password;
    if (!username || username == '') {
      this.message.error("请输入用户名")
      return
    }
    if (!password || password == '') {
      this.message.error("请输入密码")
      return
    }

    // 问题ID 0BequpL6Zb
    console.log(this.pCompany);
    this.authServ.login(username, password ,this.departId).then(profile => {
      if (profile && profile.id) {
        this.getAccLog(profile.id).then(log => {
          if (!profile.get('schoolClass')) {
            this.message.create("error", "无本场考试权限")
            return
          }
          if (log && log.id) {
            this.username = ''; this.password = '';
            this.router.navigate(['english/rule'])
          } else {
            this.message.create("error", "未报名此次考试")
          }
        })
      }
    }).catch(error => {
      console.log(error);
      this.message.create("error", error.message)
    })
  }
  async getExam() {
    let Exam = new Parse.Query("Exam");
    Exam.equalTo("isEnable", true);
    Exam.equalTo("company", this.pCompany.id);
    Exam.equalTo("department", this.department.id);
    Exam.include("survey");
    Exam.descending("updatedAt");
    let exam: any = await Exam.first();
    console.log(this.company, this.department, exam);

    if (exam && exam.id) {
      this.examTitle = exam.get("title")
    }
  }
  async getAccLog(profileId) {
    let Log = new Parse.Query("AccountLog");
    Log.equalTo("targetName", this.department.id);
    Log.contains("orderId", profileId);
    Log.notEqualTo("isback", true);
    Log.equalTo("isVerified", true);
    let log = await Log.first();
    if (log && log.id) {
      return log
    } else {
      return false
    }
  }
}
