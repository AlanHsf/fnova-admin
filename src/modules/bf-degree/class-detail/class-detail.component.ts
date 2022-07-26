import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { date, event } from "gantt";
import { NzMessageService } from "ng-zorro-antd/message";
import * as Parse from "parse";
@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
  styleUrls: ['./class-detail.component.scss']
})
export class ClassDetailComponent implements OnInit {
  listOfColumn = [
    {
      title: "类别",
      compare: null,
      priority: false
    },
    {
      title: "名称",
      compare: null,
      priority: false
    },
    {
      title: "价格",
      compare: null,
      priority: false
    },
    {
      title: "操作",
      compare: null,
      priority: false
    }
  ];
  classId: string; // 班级id
  sClass: any;// 班型
  company: string;
  contentList: any = [];// 待选择课程、试卷集合
  types: any = [
    { value: 'Lesson', label: '课程' },
    { value: 'Survey', label: '试卷' }
  ];// 班型内容类别
  filterData2: any = [];// 待选择课程、试卷  表格数据
  showEditModal: any;// 显示弹窗
  addIdObj: object;// 选择添加id集合
  constructor(
    private activRoute: ActivatedRoute,
    private message: NzMessageService,
    private cdRef: ChangeDetectorRef
  ) { }
  claStudents: any[]; // 当前班级学生
  students: any[]; // 待分配学生
  studentsIdArr: any[]; // 待分配学生id数组

  department: string; // 院校
  seating: any; // 考场总人数
  studentName: string = "";


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
  school: Array<any> = [];
  major: Array<any> = [];
  schoolClass: Array<any> = [];
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async params => {
      let company = localStorage.getItem("company");
      this.company = company;
      this.classId = params.get("PobjectId");
      this.addIdObj = {};
      this.getClassContent();
    });
  }
  // 返回
  back() {
    window.history.back();
  }

  async getClassContent(e?) {
    console.log(e);
    let tempData = []
    let content = [];
    let arr = []
    let Class = new Parse.Query("SchoolClass");
    let res = await Class.get(this.classId);
    if (res && res.id) {
      this.sClass = res;
      content = res.get("content");
      for (const key in content) {
        if (Object.prototype.hasOwnProperty.call(content, key)) {
          let element = content[key];
          if (key == 'Lesson') {
            arr = await this.getLessonsById(element)
            console.log(arr)
          }
          if (key == 'Survey') {
            arr = await this.getSurveysById(element)
            console.log(arr)
          }
          console.log(element, arr);
          if(!arr) {
            arr = []
          }
          tempData.push(...arr)
        }
      }
      this.filterData = tempData;
      // if (e) {
      //   content.forEach((item)=>{

      //   })
      //   this.filterData = content;
      //   Class.equalTo("name", e);
      //   return
      // }
      console.log(content, this.filterData);

    }
  }

  showModal() {
    this.getContents()
    this.showEditModal = true;
    this.addIdObj = {};
    this.control = false;


  }
  // 获取班型外课程、试卷数据
  async getContents() {
    this.contentList = []
    let lessons: any = await this.getLessons()
    let surveys: any = await this.getSurveys();
    console.log(lessons, surveys);
    this.contentList.push(...lessons, ...surveys);
    this.filterData2 = this.contentList;
  }
  async getLessonsById(idArr?) {
    let tempArr = []
    let arrLen = idArr.length;
    for (let index = 0; index < arrLen; index++) {
      const element = idArr[index];
      let Lesson = new Parse.Query("Lesson");
      let lesson = await Lesson.get(element);
      if (lesson && lesson.id) {
        tempArr.push(lesson)
      }
      if (index + 1 == arrLen) {
        return tempArr;
      }
    }
  }
  async getSurveysById(idArr?) {
    let tempArr = []
    let arrLen = idArr.length;
    for (let index = 0; index < arrLen; index++) {
      const element = idArr[index];
      let Survey = new Parse.Query("Survey");
      let survey = await Survey.get(element);
      if (survey && survey.id) {
        tempArr.push(survey)
      }
      if (index + 1 == arrLen) {
        return tempArr;
      }
    }
  }
  async getLessons() {
    let Lesson = new Parse.Query("Lesson");
    Lesson.equalTo("school", this.sClass.get('department').id);
    Lesson.equalTo("company", this.company);
    // Lesson.limit(10);
    let lessons = await Lesson.find();
    if (lessons && lessons.length) {
      console.log(this.filterData);
      var set = this.filterData.map(item => item.id)
      console.log(set)
      var resArr = lessons.filter(item => !set.includes(item.id))
      console.log(resArr)
      console.log(lessons, resArr, this.filterData);
      return resArr;
    } else {
      return []
    }
  }
  async getSurveys() {
    let Survey = new Parse.Query("Survey");
    Survey.equalTo("department", this.sClass.get('department').id);
    Survey.equalTo("company", this.company);
    // Survey.limit(10);
    let surveys = await Survey.find();
    if (surveys && surveys.length) {
      console.log(this.filterData);
      var set = this.filterData.map(item => item.id)
      console.log(set)
      var resArr = surveys.filter(item => !set.includes(item.id))
      console.log(resArr)
      console.log(surveys, resArr, this.filterData);
      return resArr;
    } else {
      return []
    }
  }

  // remove
  rmVisible: boolean = false;
  rmObj: ParseObject;
  rmName: string = "";
  async removeContent(data) {
    this.rmName = data.get("title");
    this.rmObj = data;
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
    this.rmObj = null;
    this.rmVisible = false;
  }
  async removeOk() {
    console.log('ok');
    
    let content = this.sClass.get('content');
    console.log(content)
    console.log(this.rmObj.className)
    let index = content[this.rmObj.className].findIndex(item => item == this.rmObj.id)
    content[this.rmObj.className].splice(index, 1);
    this.sClass.set('content', content);
    this.sClass.save().then(res => {
      console.log(res)
      this.message.create("info", "操作成功");
      this.getClassContent();
      this.rmVisible = false;
    })
  }


  /* 弹窗 */
  // === begin ===
  AllChecked: boolean = false;
  selectChange(e, type) {
    console.log(e, type);

    switch (type) {
      case 'type':
        if (e) {
          this.filterData2 = this.contentList.filter((a) => {
            return a.className == e
          })
          console.log(this.filterData2);

        } else {
          this.filterData2 = this.contentList;
        }
        break;
      case 'price':

        break;
      default:
        break;
    }

  }
  onAllChecked(value: boolean): void {
    console.log("select all 2", value);
    this.AllChecked = value;
    if (!this.AllChecked) {
      this.addIdObj = {};
    }
    this.filterData2.forEach(item => {
      if (this.AllChecked) {
        this.addIdObj[item.className] ? null : this.addIdObj[item.className] = []
        this.addIdObj[item.className].push(item.id);
      }
      item.checked = value;
    });
    console.log(this.addIdObj);
    console.log(this.AllChecked);

    // this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    // this.refreshCheckedStatus();
  }
  onItemChecked(data, e) {
    console.log(data, e);
    console.log(this.addIdObj);
    if (e == true) {
      this.addIdObj[data.className] ? null : this.addIdObj[data.className] = []
      this.addIdObj[data.className].push(data.id);
    } else {
      this.addIdObj[data.className].splice(
        this.addIdObj[data.className].findIndex(item => item.id == data.id),
        1
      );
      this.AllChecked = false;
    }
    console.log(this.addIdObj);

    // 全部选择后全选自动为true
    let status = true;
    this.filterData2.forEach(res => {
      if (!res.checked) {
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
  handleCancel() {
    this.showEditModal = false;
    this.students = null
  }
  control:boolean = false;
  async handleOk() {
    if(this.control){
      return
    }
    let data = {};
    let Class = new Parse.Query("SchoolClass");
    let sClass = await Class.get(this.classId);
    if (sClass && sClass.id) {
      let content = sClass.get('content');
      if (content) {
        data = content;
      }
      if (this.addIdObj['Survey']) {
        if (data['Survey']) {
          data['Survey'].push(...this.addIdObj['Survey'])
        } else {
          data['Survey'] = [];
          data['Survey'].push(...this.addIdObj['Survey']);

        }
      }
      if (this.addIdObj['Lesson']) {
        if (data['Lesson']) {
          data['Lesson'].push(...this.addIdObj['Lesson'])
        } else {
          data['Lesson'] = [];
          data['Lesson'].push(...this.addIdObj['Lesson']);
        }
      }
      console.log(content, data);
      sClass.set("content", data);
      console.log(content, this.sClass.get("content"));
      sClass.save().then(res => {
        this.control = true;
        console.log(res);
        this.message.create("success", "操作成功");
        this.getClassContent();
      }).catch((err) => {
        console.log(err);
        this.message.create("error", "操作失败");
      })

    }

    this.showEditModal = false;
    this.AllChecked = false;

    console.log(this.addIdObj)



  }

  // === end ===



  /* 批量移出 */

  rmAllVisible: boolean = false;
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
    console.log(data,e);
    
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
  rmContents() {
    this.rmAllVisible = true;
  }
  rmAllCancel() {
    this.rmAllVisible = false;
  }
  async rmAllOk() {
    let content = this.sClass.get('content');
    console.log(content,this.rmData)
    // for (const key in content) {
    //     const element = content[key];
        for (let ind = 0; ind < this.rmData.length; ind++) {
          const rmItem = this.rmData[ind];
          console.log(rmItem);
          
          let index = content["Survey"].findIndex(item => item == rmItem.id);
          index != -1 ? content["Survey"].splice(index, 1):null;
          let index2 = content["Lesson"].findIndex(item => item == rmItem.id);
          index2 != -1 ? content["Lesson"].splice(index2, 1):null;
        }
    // }
    this.sClass.set('content', content);
    this.sClass.save().then(res => {
      console.log(res)
      this.message.create("info", "操作成功");
      this.getClassContent();
      this.rmAllVisible = false;
      this.AllRmChecked = false;
      this.rmData = []
    })
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










}
