import { Component, OnInit } from '@angular/core';
import * as Parse from "parse";
import { Url } from 'url';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { query } from '@angular/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-note-center',
  templateUrl: './note-center.component.html',
  styleUrls: ['./note-center.component.scss']
})
export class NoteCenterComponent implements OnInit {

  // 个人笔记空间
  personal:any;
  notespaceid:string;

  // 项目空间
  project:any;
  projectid:string;

  Padvalue?: string;
  Spacevalue?: string;
  department?:string;

  // 团队空间
  team:any;
  // 部门
  departments:any;
  departmentid:string;
 
  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };
  
  //用户个人信息
  UserData:any;
  
  // 分享的笔记id
  share:string;
  isVisible = false;
  sharename:any;
  // 保存的project
  holdProject:any;

  constructor(
    private router: Router,
    private message: NzMessageService,
    private activeRoute :ActivatedRoute,
  ) { }

  ngOnInit() {
    
    // 获取登录用户的所有信息
    this.getProfile();

    // 获取个人空间
    this.FindUser();

    // 获取项目空间
    this.FindProject();

    
    // 获取团队空间
    /* this.Findteam() */

    // 获取分享的空间
    console.log(this.activeRoute.queryParams)
    this.activeRoute.params.subscribe(queryParams => {
      this.share = queryParams.objectId
      this.getShare()
    })
  }

  gonoteEdit(id:any){
    console.log(id)
    this.router.navigate(["/notespace/note-edit", { PclassName:"NoteSpace",PobjectId:id }])
  }

  //判断是否有分享的路由id
  async getShare(){
    console.log(this.share);
    //如果存在这个分享的id，开始判断
    if(this.share){
      let querySpace= new Parse.Query("NoteSpace")
      querySpace.equalTo("objectId",this.share)
      // querySpace.include("project")
      let fisrtSpace = await querySpace.first()
      if(fisrtSpace){
        this.sharename = fisrtSpace.toJSON()
        //查找project是否存在这个用户
        console.log(this.sharename.project)
        if(this.sharename.project != undefined){
          let queryProject = new Parse.Query("Project")
          queryProject.equalTo("objectId",this.sharename.project.objectId)
          let isProject = await queryProject.first()
          if(isProject){
            console.log(this.UserData.objectId)
              let queryUserProject = new Parse.Query("Project")
              queryUserProject.equalTo("users",{
                "__type": "Pointer",
                "className": "_User",
                "objectId": this.UserData.objectId
              })
              let isUserProject = await queryUserProject.first()
              // console.log(isUserProject.id)
              console.log(isProject.id)
              if(isUserProject){
                if(isUserProject.id == isProject.id){
                  console.log(isUserProject.id)
                  this.message.warning("您已是该项目空间成员")
                  this.isVisible = false
                }else{
                  this.isVisible = true;
                  this.holdProject = isProject
                }
              }else{
                this.isVisible = true;
                this.holdProject = isProject
              }
          }else{
            this.message.error("不可分享的笔记",{nzDuration:2000})
            console.log("不可分享的笔记")
          }
        }else{
          this.message.error("不可分享的笔记",{nzDuration:2000})
            console.log("不可分享的笔记")
        }
      }else{
        this.message.error("无效的分享",{nzDuration:2000})
        console.log("无效的分享")
      }
    }
  } 

  //确定加入
  async handleOk() {
    console.log(this.holdProject);
    let queryProject = new Parse.Query("Project")
    queryProject.equalTo("objectId",this.holdProject.id)
    let addUsers = await queryProject.first()
    addUsers.addUnique("users",{
        __type: "Pointer",
        className: "_User",
        objectId:this.UserData.objectId,
    })
    addUsers.save().then(res=>{
    this.FindProject();
    this.isVisible = false;
    })
  }

  // 取消加入
  handleCancel(): void {
    console.log('取消加入');
    this.isVisible = false;
  }
  

  // 用户信息
  async getProfile() {
    let user = Parse.User.current();
    console.log(user.toJSON())
    console.log(111)
    let data = new Parse.Query("_User")
    data.equalTo("objectId",user.id)
    let temp = await data.first()
      this.UserData = temp.toJSON()
      console.log(this.UserData.company)
    this.Findteam(this.UserData.company.objectId)
    console.log(122232323123123)
    // console.log(this.UserData.id)

  }

  //新建个人笔记
    async keyUpNew(){
      console.log(this.Padvalue)
      if(this.Padvalue == undefined || this.Padvalue.trim() == ''){
        this.message.create('error', '笔记文件名不能为空');
        return
      }
      // 新建个人文件夹

      // let findNotespace = new Parse.Query("NoteSpace")
      // findNotespace.equalTo("user",this.UserData.objectId)

      // let nowNoteSpace = await findNotespace.first()
      // if(nowNoteSpace){
      //   console.log(nowNoteSpace)
      //   console.error("notepad")

      //   let findNotePad = new Parse.Query("NotePad")
      //   findNotePad.equalTo("space",nowNoteSpace.id)
      //   // findNotePad.count() //API 存在
      //   let nowNotePad = await findNotePad.find()
      //   console.log(nowNotePad)
      //   let NotePad = Parse.Object.extend("NotePad");
      //   let pad = new NotePad();
      //   pad.set("space",{
      //         __type: "Pointer",
      //         className: "NoteSpace",
      //         objectId:nowNoteSpace.id,
      //   })
      //   pad.set("company",{
      //             __type: "Pointer",
      //             className: "Company",
      //             objectId:this.UserData.company.objectId,
      //   })
      //   pad.set("title",this.Padvalue)
      //   pad.set("order",nowNotePad.length)
      //   pad.save().then(res=>{
      //     // console.log(res)
      //     this.Padvalue  = ''
      //     this.FindUser()
      //   })
      //   return
      // }
      // console.error("新建")

      let NoteSpace = Parse.Object.extend("NoteSpace");
      let space = new NoteSpace();
      space.set("user",{
            __type: "Pointer",
            className: "_User",
            objectId:this.UserData.objectId,
      })

      console.log(this.UserData.company.objectId)
      space.set("company",{
                __type: "Pointer",
                className: "Company",
                objectId:this.UserData.company.objectId,
      })
      space.set("title",this.Padvalue)
      space.set("type","personal")
      // space.save().then(res=>{
      //   let NotePad = Parse.Object.extend("NotePad");
      //   let pad = new NotePad();
      //   pad.set("space",{
      //         __type: "Pointer",
      //         className: "NoteSpace",
      //         objectId:res.id,
      //   })
      //   pad.set("company",{
      //             __type: "Pointer",
      //             className: "Company",
      //             objectId:this.UserData.company.objectId,
      //   })
      //   pad.set("title",this.Padvalue)
      //   pad.set("order","0")
      space.save().then(res=>{
          // console.log(res)
          this.Padvalue  = ''
          this.FindUser()
        })
      // })
    }
  
    //删除个人笔记
    delModal:boolean = false;
    visible: boolean = false;
    MyNoteSpaceId : string;
    MyNoteSpaceName : string;
    delPersonals(id): void {
      this.MyNoteSpaceId = id
      let findMeNotes = new Parse.Query("NoteSpace")
      findMeNotes.equalTo("objectId",this.MyNoteSpaceId)
      findMeNotes.first().then(res=>{
        this.MyNoteSpaceName = res.get("title")
      })
      
      this.delModal = true
      console.log("弹出删除框"+id)
    }
    async delmeNotes(){
      console.log(this.MyNoteSpaceId)
      //删除笔记文件
      let findMyPad = new Parse.Query("NotePad")
      findMyPad.equalTo("space",this.MyNoteSpaceId)
      findMyPad.find().then(res=>{
        res.map(item=>{
          item.destroy()
          console.log("删除----"+item.get("title"))
        })
      })
      //删除空间文件夹
      let findMyNotes = new Parse.Query("NoteSpace")
      findMyNotes.equalTo("objectId",this.MyNoteSpaceId)
      let MyNotes = await findMyNotes.first()
      this.MyNoteSpaceName = MyNotes.get("title")
      MyNotes.destroy().then(rep=>{
        console.log("删除---"+MyNotes.get("title"))
        this.FindUser()
      })
      this.delModal = false
      this.message.success("已删除")
      console.log("删除")
    }
    hidedel(){
      this.delModal = false
      this.renameModal = false
      this.newName = ''
    }
    
  //重命名
  newName:string;
  renameModal:boolean=false;
  renamePersonals(id){
    this.MyNoteSpaceId = id
    let findMeNotes = new Parse.Query("NoteSpace")
    findMeNotes.equalTo("objectId",this.MyNoteSpaceId)
    findMeNotes.first().then(res=>{
      this.MyNoteSpaceName = res.get("title")
    })
    console.log(this.MyNoteSpaceId)
    this.renameModal = true
  }
  renameNotes(){
    if(this.newName == undefined || this.newName.trim() == ''){
      this.message.create('error','笔记名不能为空')
      return
    }
    console.log(this.newName)
    let myNoteSpace = new Parse.Query("NoteSpace")
    myNoteSpace.equalTo("objectId",this.MyNoteSpaceId)
    myNoteSpace.first().then(res=>{
      console.log(res)
      console.log(this.newName)
      res.set("title",this.newName)
      res.save().then(rep=>{
        this.renameModal = false
        this.FindUser()
        console.log("新名字为"+this.newName)
        this.newName = ''
      })
    })
    
  }

  // 创建部门
  async keyUpteam(){
    if(this.department == undefined || this.department.trim() == ''){
      this.message.create('error', '笔记文件名不能为空');
      return
    }
    let NoteSpace = Parse.Object.extend("NoteSpace");
      let space = new NoteSpace();
      space.set("user",{
            __type: "Pointer",
            className: "_User",
            objectId:this.UserData.objectId,
      })

      console.log(this.UserData.company.objectId)
      space.set("company",{
                __type: "Pointer",
                className: "Company",
                objectId:this.UserData.company.objectId,
      })
      space.set("title",this.department)
      space.set("type","department")
      space.set("department",{
                __type: "Pointer",
                className: "Department",
                objectId:this.departmentid,
      })
      space.save().then(res=>{
        // console.log(res)
        this.department  = ''
        this.select(this.departmentid)
      })
  }

  select(c){
    this.departmentid = c
    console.log(c)
    let queryspace = new Parse.Query("NoteSpace")
    queryspace.equalTo("department",c)
    let teamArr = [];
    queryspace.find().then(res=>{
      console.log(res)
      res.map(item =>{
        teamArr.push(item.toJSON())
      })
      this.team = teamArr
      console.log(this.team)
    })
  }


  async Findteam(id) {

      let queryDpt = new Parse.Query("Department")
      let DptArr:Array<any>=[];
      queryDpt.equalTo("company",id)
      let temp = await queryDpt.find()
      temp.map(item =>{
        DptArr.push(item.toJSON())
      })
      this.departments = DptArr;
      this.select(DptArr[0].objectId)
      console.log(this.departments)
  }


    
    // 新建项目
//     async keyUpProject(){
//       let findProject = new Parse.Query("Project")
//       findProject.equalTo("users", {
//          __type: "Pointer",
//         className: "_User",
//         objectId:this.UserData.objectId
//       })
//       let nowProject = await findProject.first()
//       if(nowProject&&nowProject.id){

//           let newspace = Parse.Object.extend("NoteSpace");
//           let space = new newspace();
//           space.set("project",{
//               __type: "Pointer",
//               className: "Project",
//               objectId:nowProject.id
//           })
//           space.set("title",this.Spacevalue)
//           space.set("type","project")
//           space.set("user",{
//                     __type: "Pointer",
//                     className: "_User",
//                     objectId:this.UserData.objectId,
//           })
//           space.save().then(res=>{
//             // console.log(res)
//             this.Spacevalue  = ''
//             this.FindProject()
//           })

//           return
//       }

//       let Project = Parse.Object.extend("Project");
//       let firstProjects = new Project();
//       firstProjects.set("users",[{
//             __type: "Pointer",
//             className: "_User",
//             objectId:this.UserData.objectId,
//       }])
//       firstProjects.set("company",{
//                 __type: "Pointer",
//                 className: "Company",
//                 objectId:this.UserData.company.objectId,
//       })
//       firstProjects.set("title",this.Spacevalue)
//       firstProjects.save().then(res=>{
//         let notespace = Parse.Object.extend("NoteSpace");
//         let space = new notespace();
//         space.set("project",{
//                   __type: "Pointer",
//                   className: "Project",
//                   objectId:res.id,
//         })
//         space.set("company",{
//                   __type: "Pointer",
//                   className: "Company",
//                   objectId:this.UserData.company.objectId,
//         })
//         space.set("title",this.Spacevalue)
//         space.set("type","project")
//         space.save().then(res=>{
//           this.Spacevalue  = ''

//           //项目方法
//           this.FindProject()
//         })
//       })
//     }


    // 获取个人空间
    async FindUser() {
      let user = Parse.User.current();
      let addpersonal = new Parse.Query("NoteSpace")
      let padArr:Array<any>=[];
      addpersonal.equalTo("user",user.id)
      addpersonal.doesNotExist("project")
      addpersonal.doesNotExist("department")

      // addpersonal.equalTo("project","")
      addpersonal.find().then(rep=>{
        rep.map(item =>{
          padArr.push(item.toJSON())

        })
        this.personal = padArr
      })
        // let nowaddpersonal = await addpersonal.first()
        // if(nowaddpersonal&&nowaddpersonal.id){
        //   addpersonal.first().then(res=>{
        //     this.notespaceid = res.id
        //     let pads = new Parse.Query("NotePad")
        //     pads.equalTo("space",res.id)
        //     pads.find().then(rep=>{
        //       rep.map(item =>{
        //         padArr.push(item.toJSON())

        //       })
        //       this.personal = padArr
        //       console.log("test123231")
        //       console.log(padArr)
        //     })
        //   })
        // }
    }


    async FindProject() {
      let user = Parse.User.current();
      let project = new Parse.Query("Project")
      let projectArr:Array<any>=[];

      project.equalTo("company", {
         __type: "Pointer",
        className: "_User",
        objectId:user.get('company')
      })
      let nowproject = await project.find()
      let p : Array<any>=[];
      if(nowproject){
        for(let i=0;i<nowproject.length;i++){
          let space = new Parse.Query("NoteSpace")
          space.equalTo("project",nowproject[i].id)
          space.first().then(res=>{
            if(res){
              p.push(res.toJSON())
            }
          })
        }
        this.project = p
      }
      
    }



}
