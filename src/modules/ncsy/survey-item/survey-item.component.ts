import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse"

@Component({
  selector: 'app-survey-item',
  templateUrl: './survey-item.component.html',
  styleUrls: ['./survey-item.component.scss']
})
export class SurveyItemComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute,  private message: NzMessageService,) { }
  surveyId:string = ''
  company:string = ''
  loading:boolean = false
  survey:any = null
  pageSize:number = 20
  pageIndex:number = 1
  total:number = 0
  surveyItem:any = []
  current:any = null
  currentJSON:any = null
  isVisible:boolean = false
  deleteModel:boolean = false
  addItem:any = []
  addModel:boolean = false
  title:string = ''
  listOfColumn = [
    {
      title: '题目',
      compare: null,
      priority: false
    },
    {
      title: '题目排序',
      compare: null,
      priority: false
    },
    //{
    //  title: '题目类型',
    //  compare: null,
    //  priority: false
    //},

    {
      title: '题目难度',
      compare: null,
      priority: false
    },

    {
      title: '题目状态',
      compare: null,
      priority: false
    },
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  ngOnInit() {
    this.company = localStorage.getItem('company')
    this.activRoute.paramMap.subscribe(async (parms) => {
      this.surveyId = parms.get('PobjectId')
      console.log(this.surveyId)
      await this.getSurveyItem()
      await this.getSurveyInfo()
    })
  }
  async getSurveyInfo(){
    let Survey = new Parse.Query('Survey')
    Survey.select('objectId','title')
    this.survey = await Survey.get(this.surveyId)
    this.title = this.survey.get('title')

  }

  showDiff(diff) {
    let diffname = '普通'
    switch (diff) {
      case 'normal':
        diffname = '普通'
        break;
      case 'easy':
        diffname = '简单'
        break;
      case 'diff':
        diffname = '困难'
        break;
      default:

        break;
    }
    return diffname
  }

  deleteOption(options, i) {
    if (options.length > 1) {
      options.splice(i, 1);
    }
  }

  addOption(options, type? , index?) {
    if (!options) {
      options = []
    }

    if (options.length <= 27) {
      options.push({
        check: false,
        value: null,
        label: this.getItemNum(options.length),
      });
    }
    // fieldItem.key
    if(type == 'add'){
      this.addItem[index].options = options
    }else {
      this.currentJSON.options = options
    }



  }

  getItemNum(i) {
    let NumMap = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K"
    ];
    return NumMap[i];
  }

  setCheck(obj, options, i, value?: Boolean) {
    if (obj.type == "select-single") {
      options.forEach((opt) => (opt.check = false));
      options[i].check = value;
    } else if (obj.type == "select-multiple") {
      options[i].check = !options[i].check;
    } else {
      options.forEach((opt) => (opt.check = false));
      options[i].check = value;
    }
  }

  async getSurveyItem(){
    this.loading = true
    let SurveyItem = new Parse.Query('SurveyItem')
    SurveyItem.equalTo('company', this.company)
    SurveyItem.equalTo('survey', this.surveyId)
    this.total = await SurveyItem.count()
    SurveyItem.addAscending('index')
    SurveyItem.limit(this.pageSize)
    SurveyItem.skip(this.pageSize * (this.pageIndex -1))
    this.surveyItem = await SurveyItem.find()
    this.loading = false
  }

  addSurveyItem() {
    if(this.addItem.length == 0) {
      this.addItem = [
        {
          title: '',
          index: this.total + 1,
          isEnabled: true,
          difficulty: 'normal',
          type: 'single',
          options: [
            {
              "check": true,
              "grade": null,
              "label": "A",
              "value": ""
            },
            {
              "check": false,
              "grade": null,
              "label": "B",
              "value": ""
            },{
              "check": false,
              "grade": null,
              "label": "C",
              "value": ""
            },{
              "check": false,
              "grade": null,
              "label": "D",
              "value": ""
            }
          ]

        }
      ]
    }

    this.addModel = true
  }

  addItemLIst(){
    let index = this.addItem.length + (this.total +1)
    this.addItem.push(
      {
        title: '',
        index: index,
        isEnabled: true,
        difficulty: 'normal',
        type: 'single',
        options: [
          {
            "check": true,
            "grade": null,
            "label": "A",
            "value": ""
          },
          {
            "check": false,
            "grade": null,
            "label": "B",
            "value": ""
          },{
            "check": false,
            "grade": null,
            "label": "C",
            "value": ""
          },{
            "check": false,
            "grade": null,
            "label": "D",
            "value": ""
          }
        ]
    })
    console.log(this.addItem)

  }

  async pageIndexChange($event) {
    await this.getSurveyItem()
  }

  async pageSizeChange($event){
    await this.getSurveyItem()
  }

  edit(item) {
    this.isVisible = true
    this.currentJSON = item.toJSON()
  }

  async editOk() {
    console.log(this.current)
    let SurveyItem = new Parse.Query('SurveyItem')
    let serveyItem = await SurveyItem.get(this.currentJSON.objectId)
    serveyItem.set('title', this.currentJSON.title)
    serveyItem.set('index', Number(this.currentJSON.index))
    serveyItem.set('isEnabled', this.currentJSON.isEnabled)
    serveyItem.set('difficulty', this.currentJSON.difficulty)
    serveyItem.set('options', this.currentJSON.options)
    serveyItem.save().then(async (res) => {
      this.currentJSON = null
      this.isVisible = false
      await this.getSurveyItem()
    })
  }

  cancelEdit() {
    this.currentJSON = null
    this.isVisible = false
  }

  deleteP(item) {
    this.current = item
    this.deleteModel = true
  }
  Canceldel() {
    this.current = null
    this.deleteModel = false
  }
  delOk() {
    this.current.destroy().then(async res => {
      this.current = null
      this.deleteModel = false
      this.message.success('删除成功')
      await this.getSurveyItem()
    }).catch(err => {
      this.message.error('删除失败')
    })
  }

  cancelAdd() {
    this.addModel = false
  }

  async addOk() {
    console.log(this.addItem)
    let SurveyItem = Parse.Object.extend('SurveyItem')
    let addCount = 0
    for(let i= 0 ; i < this.addItem.length; i++) {
      let serveyItem = new SurveyItem()
      serveyItem.set('title', this.addItem[i].title)
      serveyItem.set('index', Number(this.addItem[i].index))
      serveyItem.set('isEnabled', this.addItem[i].isEnabled)
      serveyItem.set('difficulty', this.addItem[i].difficulty)
      serveyItem.set('options', this.addItem[i].options)
      serveyItem.set('survey', {
        __type: "Pointer",
        className: "Survey",
        objectId: this.surveyId
      })
      serveyItem.set('company', {
        __type: "Pointer",
        className: "Company",
        objectId: this.company
      })
      serveyItem.save().then(res => {
        if(res && res.id) {
          addCount = addCount +1
          console.log(this.addItem.length, addCount )
          if(addCount == this.addItem.length) {
            //this.addItem = []
            this.addModel = false
            this.getSurveyItem()
          }
        }

      })
    }
  }
}
