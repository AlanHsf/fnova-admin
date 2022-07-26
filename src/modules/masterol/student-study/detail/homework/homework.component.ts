import {  AfterViewInit, Component, OnInit, ViewChild, ViewChildren  } from '@angular/core';
import * as Parse from 'parse'
import { ActivatedRoute} from "@angular/router"
import { DocumentService } from "../../../edit-document/document.service";
import { NzMessageService } from "ng-zorro-antd/message";
import { from } from 'rxjs';
import { parse } from 'tern';
@Component({
  selector: 'detail-homework',
  templateUrl: './homework.component.html',
  styleUrls: ['./homework.component.scss']
})
export class HomeworkComponent implements OnInit {
    // @ViewChild("child") child: EditDocumentComponent;
    // @ViewChildren("child") children: EditDocumentComponent;

    constructor(
        private fileService: DocumentService,
        private activatedRoute: ActivatedRoute,
        private message: NzMessageService,
    ) { }
    work:any;
    aid:any;
    homework: any = {
        papername: "",
        desc: ""
    };
    company:any ;
    lessonId:any ;
    isSubmit: boolean = false;
    hid:string = ''
    pctl:boolean = true
    viewHomework:any;
    ngOnInit() {
        this.company = localStorage.getItem('company')
        this.activatedRoute.params.subscribe(param => {
            console.log(param)
            this.lessonId = param.lesson
            this.queryLesson()
        })
        this.queryWork()
    }
    startTime:any;
    endTime:any;
    async queryLesson() {
        let Lesson = new Parse.Query('Lesson')
        let lesson = await Lesson.get(this.lessonId)
        if(lesson && lesson) {
            console.log(lesson)
            if(lesson.get('workTime')) {
                this.startTime = lesson.get('workTime').from.getTime()
                this.endTime = lesson.get('workTime').to.getTime()
                let now = new Date().getTime()
                if(this.endTime >= now &&  now >= this.startTime) {
                    console.log('可以提交')
                } else {
                    this.message.error("不在提交范围");
                }
            }
        }
    }

    async queryWork() {
        let user = Parse.User.current()
        let profile = JSON.parse(localStorage.getItem('profile'))
        let Homework = new Parse.Query('Homework')
        Homework.equalTo('user', user.id)
        Homework.equalTo('lesson', this.lessonId)
        Homework.equalTo('profile', profile.objectId)
        Homework.include('attachment')
        console.log(this.lessonId, user.id, profile.objectId)
        let homework = await Homework.first()
        console.log(homework)
        if(homework && homework.id ) {
            console.log(homework)
            this.isSubmit = true
            this.hid = homework.id
            this.viewHomework = homework.toJSON()
            console.log(this.viewHomework)
        }

    }

    isConfirm:boolean = false
    async savePaper() {
        let now = new Date().getTime()
        if(this.endTime && this.startTime ) {
            if( now > this.endTime || now < this.startTime){
                this.message.error("当前时间不在提交时间范围内。");
                return
            }
        }
        this.pctl = false
        console.log(this.aid ,this.work)
        let user = Parse.User.current()
        let profile = JSON.parse(localStorage.getItem('profile'))
        if(this.isSubmit) {
            this.isConfirm = true
        } else {
            let Homework = Parse.Object.extend('Homework')
            let homework = new Homework ()
            homework.set('user', {
                __type: 'Pointer',
                className: '_User',
                objectId: user.id
            })
            homework.set('profile', {
                __type: 'Pointer',
                className: 'Profile',
                objectId: profile.objectId
            })
            homework.set('lesson', {
                __type: 'Pointer',
                className: 'Lesson',
                objectId: this.lessonId
            })
            if(profile.department) {
                homework.set('department', {
                    __type: 'Pointer',
                    className: 'Department',
                    objectId: profile.department.objectId
                })
            }
            if(profile.center) {
                homework.set('center', {
                    __type: 'Pointer',
                    className: 'Department',
                    objectId: profile.center.objectId
                })
            }
            if(profile.SchoolMajor) {
                homework.set('major', {
                    __type: 'Pointer',
                    className: 'SchoolMajor',
                    objectId: profile.SchoolMajor.objectId
                })
            }
            if(profile.SchoolClass) {
                homework.set('class', {
                    __type: 'Pointer',
                    className: 'SchoolClass',
                    objectId: profile.SchoolClass.objectId
                })
            }
            homework.set('attachment', {
                __type: 'Pointer',
                className: 'Attachment',
                objectId: this.aid
            })
            homework.set('company', {
                __type: 'Pointer',
                className: 'Company',
                objectId: localStorage.getItem('company')
            })
            if(!this.homework.papername) {
                this.message.error('请按照要求填写作业名称')
                this.pctl = true
                return
            }
            homework.set('workname', this.homework.papername)
            homework.set('desc', this.homework.desc)
            homework.save().then(res => {
                console.log(res)
                this.pctl = true
                if(res && res.id) {
                    this.isSubmit = true
                    this.message.success("提交成功");
                    this.homework.papername = null
                    this.homework.desc = null
                }
            })
        }
    }
    // loadHomeWork() {}
    async handleOk() {
        let Homework = new Parse.Query('Homework')
        console.log(this.hid)
        let homework = await Homework.get(this.hid)
        homework.set('attachment', {
            __type: 'Pointer',
            className: 'Attachment',
            objectId: this.aid
        })
        if(!this.homework.papername) {
            this.message.error('请按照要求填写作业名称')
            this.pctl = true
            return
        }
        homework.set('workname', this.homework.papername)
        homework.set('desc', this.homework.desc)
        console.log(this.homework.desc)
        
        homework.save().then(res => {
            console.log(res)
            this.pctl = true
            this.isConfirm = false
            if(res && res.id) {
                this.message.success("提交成功");
                this.homework.papername = null
                this.homework.desc = null
                this.viewHomework = res.toJSON()
            }
        })
    }

    handleCancel() {
        this.pctl = true
        this.aid = null
        this.work = null
        this.isConfirm = false
    }
}
