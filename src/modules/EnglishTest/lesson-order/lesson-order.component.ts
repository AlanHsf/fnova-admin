import { Component, OnInit } from '@angular/core';
import * as Parse from 'parse'
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-lesson-order',
  templateUrl: './lesson-order.component.html',
  styleUrls: ['./lesson-order.component.scss']
})
export class LessonOrderComponent implements OnInit {

  schools: any = [
    {
      name: "订单编号",
      key: "orderNumber",
      type: "String"
    },
    {
      name: "用户账号",
      key: "user",
      type: "Pointer",
      className: "_User"
    },
    {
      name: "课程名称",
      key: "targetObject",
      type: "pointer-array",
      className: "Lesson"
    }
  ]
  searchType:string = "String"
  listOfColumn = [
    {
        title: '订单编号',
        compare: null,
        priority: false
    },
    {
      title: '课程名称',
      compare: null,
      priority: false
    },
    {
        title: '商品图片',
        compare: null,
        priority: false
    },
    {
        title: '购买用户',
        compare: null,
        priority: false
    },
    {
      title: '用户昵称',
      compare: null,
      priority: false
  },
  {
      title: '实际金额',
      compare: null,
      priority: false
  },
  {
      title: '购买数量',
      compare: null,
      priority: false
  },
  {
      title: '状态',
      compare: null,
      priority: false
  },
  {
      title: '操作',
      compare: null,
      priority: false
  }
  ]
  listOfData:any = []
  courses: any = []
  value: any  // 查询条件
  value_user: any  // 添加订单用户
  value_course: any   // 添加订单课程部分
  phone_number: any
  tradeNum: any
  nickname:any
  realprice:any
  count:any  // 购买数量
  courseName: any
  total: any  // 总数据的条数

  pageSize = 8 // 每页显示的数量
  pageIndex = 1 // 当前是第几页，当前是第一页

  isVisible = false;
  isVisible_change = false
  isVisible_with_delete = false
  isLoading: boolean = true

  constructor(private message: NzMessageService,private modal: NzModalService) { }
  company:string = ""
  async ngOnInit() {
    this.company = localStorage.getItem('company')
    await this.getAllDetail()
  }

  showModal(): void {
    this.isVisible = true;
  }

  async changeIndex(e) {
    this.pageIndex = e
    await this.getAllDetail()
  }

  async handleOk() {
    console.log('Button ok clicked!');
    // console.log(this.targetObj_user)
    if(!this.targetObj_user) {
      this.message.info("请选择购买课程的用户")
      return
    } 
    else if(!this.targetObj_course) {
      this.message.info("请选择要添加的课程")
      return
    } 
    else if(this.targetObj_user && this.targetObj_course) {
      console.log(this.targetObj_course,this.targetObj_user)
      let order = new Parse.Query("Order")
      order.equalTo('user', this.targetObj_user.id)
      order.containedIn('targetObject',[{
        __type: "Pointer",
        className: "Lesson",
        objectId: this.targetObj_course.id
      }])
      let result = await order.first()
      console.log(result)
      if(result) {
        // 如果已经存在这条数据，就显示不要重复添加
        this.message.info("请不要重复添加课程")
      } else {
        let newCourse = this.targetObj_course.toJSON()
        let Order = Parse.Object.extend("Order")
        let order = new Order()
        let now = new Date()
        let tradeNo =
          "C" + this.targetObj_user.id + String(now.getFullYear()) + (now.getMonth() + 1) +
          now.getDate() +
          now.getHours() +
          now.getMinutes() +
          now.getSeconds() +
          now.getMilliseconds();
          order.set("user", {
            __type:"Pointer",
            className: "_User",
            objectId:this.targetObj_user.id,
          })
          order.set("company", {
            __type: "Pointer",
            className: "Company",
            objectId: this.company,
          });
          order.set('targetObject', [{
            __type: "Pointer",
            className: "Lesson",
            objectId: this.targetObj_course.id
          }]);
          order.set("targetClass", "Lesson");
          order.set("price", newCourse.price);
          order.set("discount",0)
          order.set("count", 1);
          order.set("name", newCourse.title);
          order.set("image", newCourse.image);
          order.set("orderNum", tradeNo);
          order.set("status", "400");
          order.set("type", 'lesson');
          order.set("isPay", true);
          let neworder = await order.save();
          if(neworder && neworder.id) {
            this.message.info("订单创建成功")
            this.isVisible = false;
            await this.getAllDetail()
          } else {
            this.message.info("订单创建失败")
          }
      }
    }

  }

  async showDeleteConfirm(e,data) {
    console.log(e,data)
    let order = new Parse.Query("Order")
    let Result = await order.get(data.objectId)
    let newResult = Result.toJSON()
    // console.log(newResult)
    if(newResult) {
      this.modal.confirm({
        nzTitle: '确认删除这条订单数据吗？',
        nzContent: '',
        nzOkText: '删除',
        nzOkType: 'danger',
        // nzOkDanger: true,
        nzOnOk: () => {
          Result.destroy().then(async (res) => {
            this.message.info("已删除")
            await this.getAllDetail()
            console.log(res)
          }, (error) => {
            this.message.info(error.message)
          })
        },
        nzCancelText: '取消',
        nzOnCancel: () => console.log('Cancel')
      });
    } 
  }

  handleOk_change(): void {
    console.log('Button ok clicked!');
    this.isVisible_change = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.currentData = null
  }

  handleCancel_change():void {
    console.log('Button cancel clicked!');
    this.isVisible_change = false;
    this.currentData = null
  }

  currentData: any
  async ChangeData(e,data) {
    this.currentData = data
    console.log(this.currentData)
    this.isVisible_change = true
  }

  value_user_change:any
  changeUser(e) {
    console.log(e)
    // this.value_user_change = e.id
    // console.log(this.value_user_change)
  }

  async search() {
    console.log("查询")
    if(!this.key) {
      this.message.info("请选择查询条件")
    }
    else if(!this.value) {
      this.message.info("请输入查询的参数")
    } else {
      await this.searchAll()
    }
  }

  async searchAll() {
    let order = new Parse.Query("Order")
    if(this.searchObj.key == 'orderNumber') {
      order.contains('orderNum', this.value)
    }
    if(this.searchObj.key == 'user') {
      order.equalTo('user', this.value)
    }
    if(this.searchObj.key == 'targetObject') {
      order.containedIn('targetObject', [
        {
          __type: "Pointer",
          className: "Lesson",
          objectId: this.value
        }
      ])
    }
    let orderList = await order.find()
    let emptyList = []
    orderList.forEach(item => {
      emptyList.push(item.toJSON()) 
    })
    console.log(orderList)
    if(orderList) {
      this.listOfData = emptyList
    }

    
  }

  searchOption:any = []  // 查询的地方用到的数组
  searchOption_add_user:any = []  // 添加订单用户数组
  searchOption_add_course:any = []  // 添加订单课程数组


  async searchPointer_course(e) {
    console.log(e)
    let Query = new Parse.Query("Lesson")
    Query.equalTo('company', this.company)
    if(e) {
      Query.contains('title', e)
    }
    let searchR = await Query.find()
    this.searchOption_add_course = searchR
  }

  searchOption_user: any
  async searchPointer_user_change(e) {
    console.log(e)
    let Query = new Parse.Query("_User")
    Query.equalTo('company',this.company)
    if(e) {
      Query.contains('username', e)
    }
    let searchR = await Query.find()
    this.searchOption_user = searchR
  }

  async searchPointer_user(e) {
    console.log(e)
    let Query = new Parse.Query("_User")
    Query.equalTo('company',this.company)
    if(e) {
      // Query.contains('username', e)
      if(e.startsWith(1)) {
        Query.contains('mobile', e)
      }
      else {
        Query.contains('nickname', e)
      }
    }
    let searchR = await Query.find()
    this.searchOption_add_user = searchR
  }

  async searchPointer(e) {
    let searchObj = this.searchObj
    console.log(e,searchObj)
    if(searchObj.className) {
      let Query = new Parse.Query(searchObj.className)
      Query.equalTo('company',this.company)
      if(searchObj.className == '_User' && e ) {
        Query.contains('username', e)
      }
      if(searchObj.className == 'Lesson' && e ) {
        Query.contains('title', e)
      }
      let searchR = await Query.find()
      this.searchOption = searchR
    }
    
  }
  
  targetObj:any = {}
  targetObj_user: any = {}  
  targetObj_course: any = {}

  seacherChange(e) {
    console.log(e)
    this.value = e.id
    console.log(this.value)
  }

  seacherChange_with_user(e) {
    console.log(e)
    this.value_user = e.id
    console.log(this.value_user)
  }
  

  seacherChange_with_course(e) {
    console.log(e)
    this.targetObj_course = e.toJSON()
    this.value_course = e.id
    console.log(this.value_course)
    console.log(this.targetObj_course)
  }

  async getAllDetail() {
    let order = new Parse.Query("Order")
    order.equalTo('company', this.company)
    order.include("user")
    let count = await order.count()
  
    order.skip(this.pageSize * (this.pageIndex - 1))
    order.limit(this.pageSize)
    let List = await order.find()
    this.isLoading = false
    let ListJson = []
    List.forEach(item => {
      ListJson.push(item.toJSON())
    });
    this.listOfData = ListJson
    console.log(count)
    this.total = count
    console.log(this.listOfData)
  }

  searchObj:any = {
    name: "订单编号",
    key: "orderNumber",
    type: "String"
  }
  key:string = "orderNumber"
  changeSchool(e) {
    console.log(e)
    this.key = e.key
    this.searchType = e.type
    this.searchObj = e
  }

  changeInput(e:any) {
    this.value = e
  }

  changeCourse(e) {
    console.log(e)
  }

}
