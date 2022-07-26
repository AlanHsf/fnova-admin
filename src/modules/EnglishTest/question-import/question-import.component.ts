import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import * as Parse from 'parse'
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-question-import',
  templateUrl: './question-import.component.html',
  styleUrls: ['./question-import.component.scss']
})
export class QuestionImportComponent implements OnInit {

  constructor(
    private router: Router,private activiteRouter: ActivatedRoute,
    private message: NzMessageService
  ) { }

  radioValue = '';
  score: any  // 题目的分值
  question_type_list:any = [
    // "单选","多选","组合","简答"
    {
      label: "单选/词汇",
      value: "single"
    },
    {
      label: "多选",
      value: "multiple"
    },
    {
      label: "阅读理解",
      value: "reading"
    },
    {
      label: "对话题",
      value: "dialogue"
    },
    {
      label: "完形填空",
      value: "cloze"
    },
    {
      label: "短文完成",
      value: "essay"
    },
    {
      label: "写作/名词解释/简答/论述/翻译/计算题/案例分析",
      value: "text"
    },
    {
      label: "排序",
      value: "sort"
    }
  ]
  radioValue_diff = "easy"
  diff_list:any = [
    {
      label: "简单",
      value: "easy"
    },
    {
      label: "中等",
      value: "normal"
    },
    {
      label: "困难",
      value: "diff"
    }
  ]
  questions:any = []  // 题目列表的数组

  // TinyMCE Uploader Function
	getEditInitOptions() {
		let that = this;
		return {
			plugins:
				"code link lists advlist preview fullscreen table  imagetools  ",
			toolbar:
				"fullscreen preview | undo redo | bold italic | bullist numlist outdent indent | table | code",
			quickbars_image_toolbar:
				"alignleft aligncenter alignright |  imageoptions",
			imagetools_toolbar:
				"rotateleft rotateright | flipv fliph |  imageoptions",
			quickbars_selection_toolbar:
				"bold italic | formatselect | quicklink blockquote",
			language: "zh_CN",
			language_url: "/assets/js/tinymce/langs/zh_CN.js",
			menubar: true,
			statusbar: true,
			base_url: "/assets/js/tinymce/",
			file_picker_types: "file image media",
			file_picker_callback: (cb, value, meta) => {
				// let dialogEl:any = document.getElementsByClassName("tox-tinymce-aux")[0]
				// dialogEl.style.zIndex = 999;
				let options = {
					mime: "image",
					multi: false,
				};
				if (meta.filetype == "media") {
					options.mime = "video";
				}
				if (meta.filetype == "file") {
					options.mime = undefined;
				}
			},
		};
	}

  isVisible = false;
  value?: string;
  know_point:any

  PclassName:any = ""
  PobjectId:any = ""
  company:string = ""
  ngOnInit() {
    this.activiteRouter.paramMap.subscribe(async params => {
      this.PclassName = params.get('PclassName')
      this.PobjectId = params.get('PobjectId')
    })
    this.company = localStorage.getItem('company')
  }


  gotoQlist() {
    this.router.navigate([`common/manage/SurveyItem`,{
      rid: "5Oj0I64OaS",
      PclassName: this.PclassName ,
      PobjectId: this.PobjectId
    }])
  }

  add_question() {
    this.isVisible = true;
  }

  add_subques(e, index) {
    let obj =  {
      type: 'single',   // 题目类型
      knowledge: this.Kid,  // 知识点id
      title: "",  // 子级题目的题干
      index: 0,  // 题目排序
      parent: {},  // 判断有无父子级
      difficulty: "", // 题目难度
      // childItem: [],  // 子级题目，没有跟数据库做判断
      score: 0,  // 题目分值
      options: [
        {
          check: false,
          grade: null,
          label: "A",
          value: "",
        }
      ],  // 选项的数组
      answer: ""  // 题目解析
    }
    this.questions[index].childItem.push(obj)
  }

  delete_sub_ques(e, index) {
    this.questions[index].childItem.pop()
  }

  async ensure_add_question() {
    try {
      for(let i=0; i<this.questions.length; i++) {
        let surveyItem = Parse.Object.extend("SurveyItem")
        let surveyitem = new surveyItem()
        surveyitem.set("company", {
          __type: "Pointer",
          className: "Company",
          objectId: this.company
        })
        surveyitem.set('knowledge', [{
          __type: 'Pointer',
          className: "Knowledge",
          objectId: this.questions[i].knowledge[0].objectId
        }])
        surveyitem.set('survey', {
          __type: 'Pointer',
          className: "Survey",
          objectId: this.PobjectId
        })
        surveyitem.set('type', this.questions[i].type)
        surveyitem.set('title', this.questions[i].title) // 这里的title是父级题目的题干
        surveyitem.set('difficulty', this.questions[i].difficulty)
        surveyitem.set('options', this.questions[i].options)
        surveyitem.set('score', parseInt(this.questions[i].score))
        surveyitem.set('answer', this.questions[i].answer)
        surveyitem.set('index', parseInt(this.questions[i].index))
        let newRes = await surveyitem.save()
        console.log(newRes.id)
        if(newRes && newRes.id) {
          if(this.questions[i].childItem && this.questions[i].childItem.length > 0) {
            for(let t=0; t<this.questions[i].childItem.length; t++) {
              let subsurveyItem = Parse.Object.extend("SurveyItem")
              let subsurveyitem = new subsurveyItem()
              subsurveyitem.set("company", {
                __type: "Pointer",
                className: "Company",
                objectId: this.company
              })
              subsurveyitem.set('knowledge', [{
                __type: 'Pointer',
                className: "Knowledge",
                objectId: this.questions[i].knowledge[0].objectId
              }])
              subsurveyitem.set('survey', {
                __type: 'Pointer',
                className: "Survey",
                objectId: this.PobjectId
              })
              subsurveyitem.set('parent', {
                __type: "Pointer",
                className: "SurveyItem",
                objectId: newRes.id
              })
              subsurveyitem.set('type', "single")
              subsurveyitem.set('difficulty', this.questions[i].difficulty)
              subsurveyitem.set("title", this.questions[i].childItem[t].title)
              subsurveyitem.set('options', this.questions[i].childItem[t].options)
              subsurveyitem.set('answer', this.questions[i].childItem[t].answer)
              subsurveyitem.set('index', t)
              let subnewRes = await subsurveyitem.save()
              console.log(subnewRes.id)
            }
          }
        }
        else {
          this.message.info("题目导入失败")
        }
      }
      this.message.info(this.questions.length + `道题目导入成功`)
      this.questions = []
    } 
    catch(error) {
      console.log(error)
      this.message.info("网络异常，题目导入失败")
    }

  }

  delete_ques(e,index) {
    console.log(e,index)
    this.questions.splice(index,1)
  } 

  labelArray= [
    "A", "B", "C", "D", "E","F","G", "H"
  ]

  add_option(e, index) {
    let length =  this.questions[index].options.length
    let obj = {
      check: false,
      grade: null,
      label: this.labelArray[length],
      value: ""
    }
    this.questions[index].options.push(obj)
  }

  add_option_complex(e, index, cindex) {
    let length =  this.questions[index].childItem[cindex].options.length
    let obj = {
      check: false,
      grade: null,
      label: this.labelArray[length],
      value: ""
    }
    this.questions[index].childItem[cindex].options.push(obj)
  }

  cancel_options(e, index, tindex) {
    this.questions[index].options.splice(tindex, 1)
    let newArr = this.questions[index].options
    newArr.forEach((item, index) => {
      switch (index) {
        case 0:
            item.label = "A";
            break
          case 1:
            item.label = "B"
            break
          case 2:
            item.label = "C"
            break
          case 3:
            item.label = "D"
            break
          case 4:
            item.label = "E"
            break
          case 5:
            item.label = "F"
            break
          case 6:
            item.label = "G"
            break
          case 7:
            item.label = "H"
            break
      }
    })
  }

  cancel_options_complex(e, index, cindex, tindex) {
    this.questions[index].childItem[cindex].options.splice(tindex, 1)
    let newArr = this.questions[index].childItem[cindex].options
    newArr.forEach((item,index) => {
      console.log(index);
        switch (index) {
          case 0:
            item.label = "A";
            break
          case 1:
            item.label = "B"
            break
          case 2:
            item.label = "C"
            break
          case 3:
            item.label = "D"
            break
          case 4:
            item.label = "E"
            break
          case 5:
            item.label = "F"
            break
          case 6:
            item.label = "G"
            break
          case 7:
            item.label = "H"
            break
        }
    })
  }

  change_check(e, index, tindex) {
    if(this.objType !== ('multiple' || 'text')) {
      this.questions[index].options.forEach(item => {
        item.check = false
      })
    }
    console.log(e, tindex)
    this.questions[index].options[tindex].check = true
  }

  change_check_multiple(e, index, tindex) {
      this.questions[index].options[tindex].check = !this.questions[index].options[tindex].check
  }

  change_check_complex(e, index, cindex, tindex) {
    if(this.objType !== ('single' || 'text' || 'multiple')) {
      this.questions[index].childItem[cindex].options.forEach(item => {
        item.check = false
      })
    }
    this.questions[index].childItem[cindex].options[tindex].check = true
  }

  objType: any = ""  // 存在的类型，string类型
  handleOk(e): void {
    // 所有字段对应数据库的字段
    let obj = {
      type: this.radioValue,   // 题目类型
      knowledge: this.Kid,  // 知识点id
      title: "",  // 父级题目的题干
      index: 0,  // 题目排序
      parent: {},  // 判断有无父子级
      difficulty: this.radioValue_diff, // 题目难度
      childItem: [],  // 子级题目，没有跟数据库做判断
      score: 0,  // 题目分值
      options: [
        {
          check: false,
          grade: null,  // 每个小题的分值
          label: "A",
          value: "",
        }
      ],  // 选项的数组
      answer: "",  // 题目解析
    }
    if(!obj.type) {
      this.message.info("请选择题目的类型")
      return
    } 
    if(obj.knowledge.length == 0) {
      this.message.info("请选择题目所属的知识点")
      return
    }
    this.questions.push(obj)
    this.objType = obj.type
    this.radioValue = null
    this.Kid = []
    this.know_point = {}  // 把select里面也给滞空
    this.isVisible = false;
    console.log(this.questions)
  }


  knowledge_list: any
  handleCancel(): void {
    this.isVisible = false;
  }

  Aknowledge: any = []  // 所有知识点的数组
  async searchPointer_point(e) {
    console.log(e)
    let knowledge = new Parse.Query("Knowledge")
    knowledge.equalTo("company", this.company)
    if(e) {
      knowledge.contains('name', e)
    }
    let Aknowledge = await knowledge.find()
    let knowledge_list = []
    Aknowledge.forEach(item => {
      knowledge_list.push(item.toJSON())
    })
    this.Aknowledge = knowledge_list
    console.log(knowledge_list)
  }

  Kid:any = [] // 知识点ID(对象)
  seacherChange_with_point(e) {
    console.log(e)
    if(e.objectId) {
      this.Kid.push({
        __type: "Pointer",
        className: "Knowledge",
        objectId: e.objectId
      })
    }
  }

}
