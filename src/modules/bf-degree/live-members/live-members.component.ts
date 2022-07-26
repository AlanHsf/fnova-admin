import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { date, event } from "gantt";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";

@Component({
  selector: "app-live-members",
  templateUrl: "./live-members.component.html",
  styleUrls: ["./live-members.component.scss"]
})
export class LiveMembersComponent implements OnInit {
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef
  ) {}
  claStudents: any[]; // 当前班级学生
  students: any[]; // 待分配学生
  studentsIdArr: any[]; // 待分配学生id数组
  classId: string; // 班级id
  department: string; // 院校
  seating: any; // 考场总人数
  studentName: string = "";
  listOfColumn = [
    {
      title: "学生姓名",
      compare: null,
      priority: false
    },
    {
      title: "学员账号",
      compare: null,
      priority: false
    },
    {
      title: "操作",
      compare: null,
      priority: false
    }
  ];
  listOfColumn2 = [
    {
      title: "学生姓名",
      compare: null,
      priority: false
    },
    {
      title: "学生账号",
      compare: null,
      priority: false
    },
    {
      title: "学生专业",
      compare: null,
      priority: false
    },
    {
      title: "学员班级",
      compare: null,
      priority: false
    }
  ];
  listOfData: any = [];
  filterData: Array<any> = [];
  filterType: string;
  inputValue: String;
  importType: any = "";
  listOfSelection = [
    {
      text: "Select All Row",
      onSelect: () => {
        console.log("select all");
        this.onAllChecked(true);
      }
    },
    {
      text: "Select Odd Row",
      onSelect: () => {
        console.log("select odd");

        // this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        // this.refreshCheckedStatus();
      }
    },
    {
      text: "Select Even Row",
      onSelect: () => {
        console.log("select even");

        // this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        // this.refreshCheckedStatus();
      }
    }
  ];
  did: any = "";
  rid: string = "";
  ngOnInit(): void {
    this.did = localStorage.getItem("department");
    this.activRoute.paramMap.subscribe(async params => {
      this.rid = params.get("PobjectId");
      // this.department = await this.getDepartment();
      this.addIdArr = [];
      this.getClaStudents();
      if (!this.did) {
        // 总后台
        this.getSchool();
      } else {
        // 存在院校直接获取专业
        this.getMajor();
      }
    });
  }
  // 返回
  back() {
    window.history.back();
  }
  school: Array<any> = [];
  major: Array<any> = [];
  schoolClass: Array<any> = [];
  async getSchool(e?) {
    let company = localStorage.getItem("company");
    
    
    let School = new Parse.Query("Department");
    School.equalTo("company", company);
    if (e) {
      School.equalTo("name", e);
    }
    School.limit(10)
    let school = await School.find();
    if (school && school.length > 0) {
        console.log(school)
        this.school = school;
    }
  }
  schoolid:string = ""  // 院校id
  majorid: string = ""; // 专业id
  classid: string = ""; // 班级id
  schoolChange(e) {
    this.schoolid = e;
    if(!this.schoolid) {
        this.major = []
        this.schoolClass = []
    }
    this.getMajor()
    this.getClass()
  }
  majorChange(e) {
    this.majorid = e;
  }

  classChange(e) {
    this.classid = e;
  }

  async getStudent() {
    let Profile = new Parse.Query("Profile");
    if (this.did) {
      Profile.equalTo("department", this.did);
    }
    if (this.majorid) {
      Profile.equalTo("SchoolMajor", this.majorid);
    }
    if (this.classid) {
      Profile.equalTo("schoolClass", this.classid);
    }
    if (this.studentName) {
      Profile.equalTo("name", this.studentName);
    }
    Profile.notEqualTo("user", null);
    Profile.include("user");
    Profile.include("department");
    Profile.include("SchoolMajor");
    Profile.include("schoolClass");
    Profile.limit(2000)
    let profile = await Profile.find();
    if (profile && profile.length > 0) {
        console.log(profile);
        this.students = profile;
    }
  }

  async getMajor(e?) {
    // 获取专业
    if(this.did) {
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
    }

  async getClass(e?) {
    // 班级是否需要绑定专业
    if (this.schoolid) {
      let SchoolClass = new Parse.Query("SchoolClass");
      SchoolClass.equalTo("department", this.schoolid);
      if (e) {
        SchoolClass.contains("name", e);
      }
      SchoolClass.limit(10);
      let schoolClass = await SchoolClass.find();
      console.log(schoolClass)
      if (schoolClass && schoolClass.length > 0) {
        this.schoolClass = schoolClass;
      }
    }
  }
    async getClaStudents() {
        this.claStudents = [];
        let RoomStudents = new Parse.Query("RoomStudents");
        RoomStudents.equalTo("room", this.rid);
        RoomStudents.include("user");
        RoomStudents.include("profile");
        RoomStudents.limit(3000)
        let profileArr: any = await RoomStudents.find();
        if (profileArr) {
            this.claStudents = profileArr;
            this.listOfData = profileArr;
            this.filterData = profileArr;
        }
    }
    async getStudents() {
        this.students = [];
        this.studentsIdArr = [];
        console.log(this.department);
        let Profile = new Parse.Query("Profile");
        Profile.equalTo("schoolClass", undefined);
        Profile.equalTo("department", this.department);
        Profile.ascending("updatedAt");
        let profileArr: any = await Profile.find();
        if (profileArr && profileArr.length) {
            this.students = profileArr;
            this.students.forEach(student => {
                student.checked = false;
                this.studentsIdArr.push(student.id);
            });
        }
    }
  provinceChange(e) {
    this.importType = e;
  }
  searchStudent() {
    if (!this.inputValue) {
      this.filterData = this.listOfData;
      return;
    }
    this.filterData = this.listOfData.filter((item: any) => {
      return (
        item.get(this.importType) &&
        item.get(this.importType).indexOf(this.inputValue) > -1
      );
    });
    this.cdRef.detectChanges();
  }

  rmVisible: boolean = false;
  rmStudent: ParseObject;
  rmName: string = "";
  async removeSchoolClass(data) {
    this.rmStudent = data;
    console.log(data)
    if(data.get("profile") && data.get("profile").get("name")) {
        this.rmName = data.get("profile").get("name");
    }
    this.rmVisible = true;
    //   let RoomStudents = new Parse.Query("RoomStudents");
    //   RoomStudents.equalTo("objectId", id);
    //   let students: any = await RoomStudents.first();
    //   if (students && students.id) {
    //     students.set('schoolClass', null)
    //     profile.save().then((sclass) => {
    //       console.log(sclass);
    //       this.message.create("info", "操作成功");
    //       this.getClaStudents()
    //     })
    //   }
  }
  removeCancel() {
    this.rmStudent = null;
    this.rmVisible = false;
  }
  async removeOk() {
    let RoomStudents = new Parse.Query("RoomStudents");
    RoomStudents.equalTo("objectId", this.rmStudent.id);
    let students: any = await RoomStudents.first();
    if (students && students.id) {
      students.destroy().then(res => {
        this.message.create("info", "操作成功");
        this.getClaStudents();
        this.rmVisible = false;
      });
    }
  }

  showEditModal: any;
  addIdArr: any[];
  showModal() {
    this.showEditModal = true;
    //   this.getStudents()
  }

  handleCancel() {
    this.showEditModal = false;
    this.students = null
  }
  importLoading: boolean = false;
  imCount: number = 0;
  async handleOk() {
    console.log(this.addIdArr)
    for (let i = 0; i < this.addIdArr.length; i++) {
      await this.getRoomStudent(
        this.addIdArr[i].id,
        this.addIdArr[i].get("user").id,
        this.rid
      );
      this.importLoading = true;
      if (this.imCount == this.addIdArr.length) {
        this.showEditModal = false;
        setTimeout(() => {
          this.message.create("success", "操作成功");
          this.getClaStudents();
          this.importLoading = false;
          this.students = null
          this.AllChecked = false
        }, 1000);
      }
    }
  }
  async getRoomStudent(pid, uid, rid) {
    let RoomStudents = new Parse.Query("RoomStudents");
    RoomStudents.equalTo("room", rid);
    RoomStudents.equalTo("user", uid);
    RoomStudents.equalTo("profile", pid);
    let student = await RoomStudents.first();
    if (student && student.id) {
      this.imCount += 1;
      return student;
    } else {
      let SR = Parse.Object.extend("RoomStudents");
      let sr = new SR();
      sr.set("user", {
        __type: "Pointer",
        className: "_User",
        objectId: uid
      });

      sr.set("profile", {
        __type: "Pointer",
        className: "Profile",
        objectId: pid
      });
      sr.set("company", {
        __type: "Pointer",
        className: "Company",
        objectId: "pPZbxElQQo"
      });
      sr.set("room", {
        __type: "Pointer",
        className: "Room",
        objectId: rid
      });
      await sr.save();
      if (sr && sr.id) {
        this.imCount += 1;
      }
    }
  }

  // 批量删除
  AllRmChecked: boolean = false;
  rmData: Array<any> = [];
  onRmAllChecked(value) {
    this.AllRmChecked = value;
    if (!this.AllChecked) {
      this.rmData = [];
    }
    this.filterData.forEach(data => {
      this.rmData.push(data);
      data.checked = value;
    });
  }
  onRmChecked(data, e) {
    if (e == true) {
      this.rmData.push(data);
    } else {
      this.rmData.splice(
        this.rmData.findIndex(item => item.id == data.id),
        1
      );
      this.AllRmChecked = false;
    }

    // 全部选取后自动全选框自动改变状态
    let status = true;
    this.filterData.forEach(student => {
      if (!student.checked) {
        status = false;
      } else {
        return;
      }
    });
    setTimeout(() => {
      console.log(status);
      if (status == true) {
        this.AllRmChecked = true;
      }
    }, 500);
  }
  rmAllVisible: boolean = false;
  reStudents() {
    this.rmAllVisible = true;
  }
  removeAllCancel() {
    this.rmAllVisible = false;
  }
  rmloading: boolean = false;
  rmcount:number = 0 ;
  async removeAllOk() {
    let rmcount = 0;
    this.rmAllVisible = false;
    this.rmloading = true;
    for (let i = 0; i < this.rmData.length; i++) {
      let RoomStudent = new Parse.Query("RoomStudents");
      let student = await RoomStudent.get(this.rmData[i].id);
      if (student && student.id) {
        await student.destroy().then(res => {
          rmcount += 1;
          this.rmcount = rmcount
          if (rmcount == this.rmData.length) {
            this.rmloading = false;
            this.message.create("success", "移除成功");
            this.getClaStudents();
          }
        });
      }
    }
  }

  // onRmChecked

  async getCount() {
    let profile: any = new Parse.Query("Profile");
    profile.equalTo("schoolClass", this.classId);
    let count = await profile.count();
    return count;
  }
  AllChecked: boolean = false;
  onAllChecked(value: boolean): void {
    console.log("select all 2", value);
    this.AllChecked = value;
    if (!this.AllChecked) {
      this.addIdArr = [];
    }
    this.students.forEach(item => {
      if (this.AllChecked) {
        this.addIdArr.push(item);
      }
      item.checked = value;
    });
    console.log(this.addIdArr);
    console.log(this.AllChecked);

    // this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    // this.refreshCheckedStatus();
  }
  onItemChecked(data, e) {
    console.log(data, e);
    console.log(this.addIdArr);
    if (e == true) {
      this.addIdArr.push(data);
    } else {
      this.addIdArr.splice(
        this.addIdArr.findIndex(item => item.id == data.id),
        1
      );
      this.AllChecked = false;
    }
    console.log(this.addIdArr);

    // 全部选择后全选自动为true
    let status = true;
    this.students.forEach(student => {
      if (!student.checked) {
        status = false;
      } else {
        return;
      }
    });
    setTimeout(() => {
      console.log(status);
      if (status == true) {
        this.AllChecked = true;
      }
    }, 500);
  }
}
