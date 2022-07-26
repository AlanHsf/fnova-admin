import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as Parse from "parse";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-check-student-list',
  templateUrl: './check-student-list.component.html',
  styleUrls: ['./check-student-list.component.scss']
})
export class CheckStudentListComponent implements OnInit {
  constructor(private activRoute: ActivatedRoute, private message: NzMessageService,
    private cdRef: ChangeDetectorRef, private http: HttpClient) { }
  department: string;// 院校
  cates: any;// 考点/函授站点
  user: any;
  recruitId;
  listOfColumn = [
    {
      title: '姓名',
      value: 'name',
      compare: null,
      priority: false
    },
    {
      title: '性别',
      value: 'sex',
      compare: null,
      priority: false
    },
    {
      title: '准考证号',
      value: 'studentID',
      compare: null,
      priority: false
    },
    {
      title: '身份证号',
      value: 'idcard',
      compare: null,
      priority: false
    },
    {
      title: '手机号码',
      value: 'mobile',
      compare: null,
      priority: false
    },
    {
      title: '所属专业',
      value: 'SchoolMajor',
      compare: null,
      priority: false

    },
    {
      title: '报名校区',
      value: 'cates',
      compare: null,
      priority: false
    },
    {
      title: '身份证头像照片',
      value: '',
      compare: null,
      priority: false
    },
    {
      title: '生活照头像照片',
      value: '',
      compare: null,
      priority: false
    },
    {
      title: '备注',
      value: '',
      compare: null,
      priority: false
    },
    {
      title: '操作',
      compare: null,
      priority: false
    }
  ];
  company: any;
  pCompany: any;
  listOfData: any = [];
  filterData: Array<any> = [];
  filterType: string;
  inputValue: String;
  searchType: any = "name";
  siteUrl: string;
  filterLen: number;
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.department = localStorage.getItem("department");
      this.company = localStorage.getItem("company");
      this.user = Parse.User.current();
      console.log(this.user);

      let recruitId = params.get("recruit");
      if(recruitId){
        this.recruitId = recruitId
      }

      if (this.department && this.company) {
        let Company = new Parse.Query("Company")
        let company = await Company.get(this.company)
        this.pCompany = company.get("company").id;
      }

      if (!this.department) {
        this.listOfColumn.splice(0, 0, {
          title: '院校',
          compare: null,
          priority: false
        })
      }
      let user = Parse.User.current();
      if (user && user.get("cates")) {
        this.cates = user.get("cates")
      }
      this.getProfiles();
      this.getSiteUrl()
    })
  }
  async getSiteUrl() {
    let querySite = new Parse.Query("Site");
    querySite.equalTo("company", this.company)
    let site = await querySite.first();
    if (site && site.id) {
      this.siteUrl = site.get('domain')[0];
    }

  }
  async getProfiles() {
    let Profile = new Parse.Query("Profile");
    Profile.equalTo("recruit", this.recruitId);
    Profile.notEqualTo("isDeleted", true);
    Profile.ascending("updatedAt");
    Profile.notEqualTo("eduImage", null);
    Profile.notEqualTo("image", null);
    Profile.notEqualTo("state", 'success');
    // Profile.notContainedIn("state", ['success','fail']);
    Profile.equalTo("company", this.pCompany);

    if (this.cates) {
      let cates;
      if (this.cates.length > 1) {
        for (let index = 0; index < this.cates.length; index++) {
          let cate = this.cates[index];
          cates.push({
            "className": "Category",
            "__type": "Pointer",
            "objectId": cate.id
          })
        }
        Profile.containedIn("cates", cates);

      } else {
        Profile.containedIn("cates", [{
          "className": "Category",
          "__type": "Pointer",
          "objectId": this.cates[0].id
        }]);

      }
    }
    if (this.department) {
      Profile.equalTo("department", this.department);
    }
    this.filterLen = await Profile.count();

    Profile.include("cates");
    Profile.include("SchoolMajor");
    Profile.include("department");
    let profileArr: any = await Profile.find();
    console.log(profileArr);
    if (profileArr) {
      this.listOfData = profileArr;
      this.filterData = profileArr;
      console.log(profileArr);

    }
  }

  searchTypeChange(e) {
    this.searchType = e;
  }
  searchStudent() {
    if (!this.inputValue) {
      this.filterData = this.listOfData;
      return;
    }
    let value = this.inputValue.trim();
    console.log(this.searchType, value);
    this.filterData = this.listOfData.filter((item: any) => {
      let i = item.get(this.searchType);
      console.log(i[0]);
      if (i.length) {
        return (i && (i.indexOf(value) > -1));
      }
      return (
        i && (i[0] && i[0].get("name") && i[0].get("name").indexOf(value) > -1)
      );
    });
    this.filterLen = this.filterData.length
    console.log(this.filterData);
    this.cdRef.detectChanges();


  }
  checkModal = false;
  checkData;
  checkStatus;
  tpl;
  templateId;
  checkMod(data, status) {
    this.checkData = data;
    this.checkStatus = status;
    this.checkModal = true;
    return

  }
  async checked() {
    console.log(this.checkData);
    this.templateId = this.checkStatus == 'success' ? '206597' : '201352';
    let { tpl, errmsg } = await this.getTpl(this.templateId);
    if (errmsg) {
      this.gowrong(errmsg)
      return
    }
    this.tpl = tpl;
    let Profile = new Parse.Query("Profile");
    Profile.notEqualTo("isDeleted", true);
    Profile.equalTo("objectId", this.checkData.id)
    let profile = await Profile.first();
    profile.set("state", this.checkStatus);
    profile.save().then(async res => {
      console.log(res);
      this.checkModal = false;
      this.message.success("操作成功")
      await this.sendNotice(this.checkData);
      if (this.checkStatus == 'fail') {
        console.log(res);
        res.set('eduImage', null)
        res.set('image', null);
        res.save().then(res => console.log(res)).catch(err => console.log(err))
      }
      this.filterData = this.filterData.filter((item: any) => { return item.id != this.checkData.id })
      this.cdRef.detectChanges();
    })
  }
  async sendNotice(data) {
    let paramsMap;
    let isCross = this.checkStatus == 'success' ? '已通过' : '未通过';
    if (this.checkStatus == 'success') {
      paramsMap = {
        "isCross": isCross,
        "site_url": `http://${this.siteUrl}`
      }
    } else {
      paramsMap = {
        "audit_mobile": 19168233300,
        "isCross": isCross,
        "site_url": `http://${this.siteUrl}`
      }
    }
    let { notice, errmsg } = await this.setNotice(data.id, paramsMap);
    if (errmsg) {
      this.gowrong(errmsg)
      return false
    }
    console.log(data);
    let baseurl = `https://server.fmode.cn/api/notice/send`
    let nid = notice.id;
    let mobile = parseInt(data.get("mobile"));
    console.log(mobile);
    this.http.post(baseurl, { nid })
      .subscribe(async (res: any) => {
        console.log(res);
        if (res.data.smsdata && res.data.smsdata.indexOf("msg_id") == -1) {
          this.message.error("短信发送失败")
          return true;
        } else {
          this.message.success("短信发送成功")
          return false;
        }
      });
  }

  async setNotice(profileId, paramsMap) {
    let notice;
    try {
      let content = await this.paramToStr(this.tpl.get('content'), paramsMap)
      let Notice = Parse.Object.extend("Notice");
      notice = new Notice();
      notice.set("tpl", {
        "__type": 'Pointer',
        "className": 'NoticeTpl',
        "objectId": this.tpl.id
      })
      console.log(content)
      notice.set("content", content)
      notice.set("paramMap", paramsMap)
      notice.set("type", 'sms')
      notice.set("company", {
        "__type": 'Pointer',
        "className": 'Company',
        "objectId": this.company

      })
      notice.set("targets", [{
        "type": 'Profile',
        "value": [profileId]
      }])
      await notice.save();
      if (notice && notice.id) {
        return { notice }
      } else {
        return {
          notice,
          errmsg: '短信内容生成错误'
        }
      }
    } catch (err) {
      console.log(err);
      return {
        notice,
        errmsg: '短信内容生成错误'
      }
    }
  }
  async getTpl(templateId) {
    let NoticeTpl = new Parse.Query("NoticeTpl");
    NoticeTpl.equalTo("tplid", templateId)
    NoticeTpl.equalTo("company", this.company);
    let tpl = await NoticeTpl.first();
    if (tpl && tpl.id) {
      return { tpl }
    } else {
      return {
        tpl,
        errmsg: '未配置该短信模板'
      }
    }
  }
  paramToStr(str, params) {
    console.log(str, params)

    console.log('parseString', str, params);
    Object.keys(params).forEach(key => {
      str = str.replace(new RegExp(`{{${key}}}`, 'g'), params[key])
    });
    return str;
  }
  gowrong(errmsg) {
    this.message.error(errmsg)
  }
}
