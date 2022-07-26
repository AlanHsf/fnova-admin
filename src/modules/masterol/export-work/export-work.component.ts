import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { date, event } from "gantt";
import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentService } from "../edit-document/document.service";
import * as Parse from "parse";

@Component({
	selector: "export-work",
	templateUrl: "./export-work.component.html",
	styleUrls: ["./export-work.component.scss"]
})
export class ExportWorkComponent implements OnInit {
	constructor(
		private activRoute: ActivatedRoute,
		private message: NzMessageService,
		private cdRef: ChangeDetectorRef,
		private fileService: DocumentService,
		private httpClient: HttpClient
	) { }
	claStudents: any[]; // 当前班级学生
	homeworks: any[]; // 待分配学生
	studentsIdArr: any[]; // 待分配学生id数组
	department: string; // 院校
	seating: any; // 考场总人数
	studentName: string = "";
	lessons: any = []
	students: any = []
	listOfColumn = [
		{
			title: "学生姓名",
			compare: null,
			priority: false
		},
		{
			title: "作业名称",
			compare: null,
			priority: false
		},
		{
			title: "学生专业",
			compare: null,
			priority: false
		},
		{
			title: "学生班级",
			compare: null,
			priority: false
		},
		{
			title: "所属课程",
			compare: null,
			priority: false
		}
	];
	listOfData: any = [];
	filterData: Array<any> = [];
	filterType: string;
	inputValue: string;
	importType: any = "";
	company: string
	did: any = "";
	rid: string = "";
	pageIndex: number = 1
	pageSize: number = 20
	ngOnInit(): void {
		this.did = localStorage.getItem("department");
		this.company = localStorage.getItem('company')
		this.queryWork()
	}
	// 全部学生
	async queryWork() {
		await this.searchWork()
	}

	async pageChange(e) {
		this.pageIndex = e-1
		await this.queryWork()
		this.cdRef.detectChanges();
	}


	async getClass() {
		let SchoolClass = new Parse.Query('SchoolClass')
		SchoolClass.equalTo('company', 'pPZbxElQQo')
		if (this.did) {
			let departments = [{
				__type: 'Pointer',
				className: 'Department',
				objectId: this.did
			}]
			SchoolClass.containedIn('departments', departments)
		}
		SchoolClass.limit(10)
		let schoolClass = await SchoolClass.find()
		if (schoolClass && schoolClass.length > 0) {
			this.schoolClass = schoolClass
		}
	}


	lessonId: any = ''
	filterLen: number = 0
	async searchWork() {
		let HomeWork = new Parse.Query('Homework')
		HomeWork.equalTo('company', 'pPZbxElQQo')
		if (this.did) {
			HomeWork.equalTo('department', this.did)
		}
		HomeWork.include('user')
		HomeWork.include('profile')
		HomeWork.include('class')
		HomeWork.include('major')
		HomeWork.include('lesson')
		HomeWork.include('attachment')
		if (this.lessonId) {
			HomeWork.equalTo('lesson', this.lessonId)
		}
		if (this.majorid) {
			HomeWork.equalTo('major', this.majorid)
		}
		if (this.classid) {
			HomeWork.equalTo('class', this.classid)
		}
		if (this.studentId) {
			HomeWork.equalTo('profile', this.studentId.trim())
		}
		
		HomeWork.descending('createdAt')
		let count = await HomeWork.count()
		HomeWork.limit(20)
		if(!this.studentId) {
			HomeWork.skip(this.pageSize * this.pageIndex)
		}
		let homework = await HomeWork.find()
		this.homeworks = homework
		this.filterLen = count
		console.log(this.homeworks)

	}

	reset() {
		this.queryWork()
		this.lessonId = null
		this.classid = null
		this.majorid = null
		this.AllExChecked = false
		this.addIdArr = []
	}
	back() {
		window.history.back();
	}
	school: Array<any> = [];
	major: Array<any> = [];
	schoolClass: Array<any> = [];
	async getSchool(e?) {
		let company = localStorage.getItem("company");
		let School = new Parse.Query("Department");
		School.equalTo("company", 'pPZbxElQQo');
		if (e) {
			School.contains("name", e);
		}
		School.limit(10)
		School.equalTo("category", "erVPCmBAgt");
		let school = await School.find();
		if (school && school.length > 0) {
			console.log(school)
			this.school = school;
		}
	}
	schoolid: string = ""  // 院校id
	majorid: string = ""; // 专业id
	classid: string = ""; // 班级id
	studentId: string = ""
	schoolChange(e) {
		this.schoolid = e;
		if (!this.schoolid) {
			this.major = []
			this.schoolClass = []
		}
		this.getMajor()
		this.getClass()
	}

	lessonChange(e) {
		this.lessonId = e
		// this.searchWork()
	}

	majorChange(e) {
		this.majorid = e;
		// this.searchWork()
	}

	classChange(e) {
		this.classid = e;
	}

	
	studentChange(e) {
		this.studentId = e;
		console.log(this.studentId)
	}

	async getStudent(e) {
		let Profile = new Parse.Query("Profile");
		Profile.equalTo("company", 'pPZbxElQQo');
		if (this.did) {
			Profile.equalTo("department", this.did);
		}
		if (this.majorid) {
			Profile.equalTo("SchoolMajor", this.majorid);
		}
		if (this.classid) {
			Profile.equalTo("schoolClass", this.classid);
		}
		if (e) {
			Profile.contains("name", e);
		}
		// Profile.notEqualTo("user", null);
		Profile.include("user");
		Profile.limit(20)
		let profile = await Profile.find();
		if (profile && profile.length > 0) {
			console.log(profile);
			this.students = profile;
		}
	}

	async getMajor(e?) {
		// 获取专业
		if (this.did) {
			this.schoolid = this.did
		}
		if (this.schoolid) {
			let SchoolMajor = new Parse.Query("SchoolMajor");
			SchoolMajor.equalTo("school", this.schoolid);
			if (e) {
				SchoolMajor.contains("name", e);
			}
			SchoolMajor.limit(10);
			let major = await SchoolMajor.find();
			if (major && major.length) {
				this.major = major;
			}
		}
		console.log(this.major)
	}
	async getLesson(e) {
		let department = localStorage.getItem('department')
		let Lesson = new Parse.Query('Lesson')
		if (this.did) {
			let departments = [{
				__type: 'Pointer',
				className: 'Department',
				objectId: department
			}]
			Lesson.containedIn('departments', departments)
		}
		if (e) {
			Lesson.contains('title', e)
		}
		Lesson.equalTo('company', 'pPZbxElQQo')
		Lesson.limit(10)
		let lessons = await Lesson.find()
		if (lessons.length > 0) {
			this.lessons = lessons
		}
	}




	showExportModal: boolean = false;
	addIdArr: any = [];
	showModal() {
		if (this.addIdArr.length == 0) {
			alert('请选择需要导出的作业')
			return

		}
		this.showExportModal = true;
	}
	importLoading: boolean = false;
	imCount: number = 0;


	// 批量选中
	AllExChecked: boolean = false;
	onExAllChecked(value) {
		this.AllExChecked = value;
		if (!this.AllExChecked) {
			this.addIdArr = [];
		}
		this.homeworks.forEach(data => {
			if (value) {
				this.addIdArr.push(data);
			}
			data.checked = value;
		});
	}
	async getCount() {
		let profile: any = new Parse.Query("Profile");
		profile.equalTo("schoolClass", this.classid);
		let count = await profile.count();
		return count;
	}
	AllChecked: boolean = false;
	onItemChecked(data, e) {
		if (e == true) {
			this.addIdArr.push(data);
		} else {
			this.addIdArr.splice(
				this.addIdArr.findIndex(item => item.id == data.id),
				1
			);
			this.AllExChecked = false;
		}
		// 全部选择后全选自动为true
		let status = true;
		this.homeworks.forEach(student => {
			if (!student.checked) {
				status = false;
			} else {
				return;
			}
		});
		setTimeout(() => {
			if (status == true) {
				this.AllExChecked = true;
			}
		}, 500);
	}
	handleCancel() {
		this.showExportModal = false
	}
	errorWork: any = []
	successWork: any = 0
	isErrorModal: boolean = false
	async handleOk() {
		this.errorWork = []
		this.successWork = 0
		this.isErrorModal = true
		this.showExportModal = false
		for (let index = 0; index < this.addIdArr.length; index++) {
			let item = this.addIdArr[index]
			if (item.get('attachment') && item.get('attachment').get('url')) {
				let url = item.get('attachment').get('url')
				let filename = item.get('workname')
				await this.fileService.download(url).subscribe(blob => {
					const a = document.createElement("a");
					const objectUrl = URL.createObjectURL(blob);
					a.href = objectUrl;
					a.download = filename;
					a.click();
					a.remove()
					URL.revokeObjectURL(objectUrl);
					this.successWork += 1
					console.log(url)
					console.log(this.successWork)

				});
			} else {
				this.errorWork.push(item)
			}

		}
	}
	errorCofirm() {
		this.isErrorModal = false
	}
}