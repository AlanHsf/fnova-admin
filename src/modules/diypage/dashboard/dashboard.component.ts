import { Component, Input, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd/message";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import "hammerjs";
import * as Parse from "parse";
import { ChangeDetectorRef } from "@angular/core";
import { DiyStyleService } from "../diystyles.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  isShowCategory = false;
  loading = false;
  currentIndex = 0; //当前选中的下标志
  type: any = ""; //当前选中的类型
  //是否选中状态
  isSelected = false;
  // 当前选中的图片
  currentImg: "";
  // 商品分类
  radioValue: null;
  /* 活动分类 */
  activityValue: null;
  //标题栏
  titleBar: any = {
    name: "未命名页面", //页面名称
    title: "请输入标题", //页面标题
    backgroundColor: "#f1f1f1", //页面背景颜色
    type: "title", // 是否可返回
  };
  //页面区域列表
  editType: any = "style";
  blocks: any = [];
  effect = "scrollx";
  diypage: any;
  pageType: any;
  currentTabIndex: number = 0;
  panels = [
    {
      active: true,
      name: "基础组件",
      disabled: false,
      cardList: [
        {
          status: true,
          clickName: "searchbar",
          name: "搜索框",
          image: "../../../assets/img/diy/sousuo.png",
        },
        // {
        //     clickName: "fixedsearch",
        //     name: "固定搜索框",
        //     image: "../../../assets/img/diy/guding.png",
        // },
        {
          status: true,
          clickName: "hotdotbar",
          name: "公告",
          image: "../../../assets/img/diy/gonggao.png",
        },
        {
          status: true,
          clickName: "guidelist",
          name: "导航列表",
          image: "../../../assets/img/diy/daohanglist.png",
        },
        {
          status: true,
          clickName: "guideline",
          name: "辅助线",
          image: "../../../assets/img/diy/fuzuxian.png",
        },
        {
          status: true,
          clickName: "imgswiper",
          name: "轮播图",
          image: "../../../assets/img/diy/lunbo.png",
        },
        {
          status: true,
          clickName: "icongroup",
          name: "图标组",
          image: "../../../assets/img/diy/icon.png",
        },
        {
          status: true,
          clickName: "singleimg",
          name: "单图组",
          image: "../../../assets/img/diy/dantu.png",
        },
        {
          status: true,
          clickName: "multipleimg",
          name: "多图组",
          image: "../../../assets/img/diy/dantu.png",
        },
        {
          status: true,
          clickName: "video",
          name: "视频组",
          image: "../../../assets/img/diy/dantu.png",
        },
        {
          status: false,
          clickName: "textgroup",
          name: "文字组",
          image: "../../../assets/img/diy/wenzi.png",
        },
        {
          status: true,
          clickName: "intro",
          name: "人物介绍",
          image: "../../../assets/img/diy/mingpian.png",
        },
        {
          status: true,
          clickName: "richtext",
          name: "富文本",
          image: "../../../assets/img/diy/mingpian.png",
        },
      ],
    },
    {
      active: true,
      disabled: false,
      name: "商城模块",
      cardList: [
        {
          status: true,
          clickName: "goodsgroup",
          name: "商品组",
          image: "../../../assets/img/diy/shangpin.png",
        },
        {
          status: true,
          clickName: "lessongroup",
          name: "课程组",
          image: "../../../assets/img/diy/kecheng.png",
        },
        {
          status: true,
          clickName: "article",
          name: "文章列表",
          image: "../../../assets/img/diy/wenzhang.png",
        },
        {
          status: true,
          clickName: "coupons",
          name: "优惠券组",
          image: "../../../assets/img/diy/youhui.png",
        },
        {
          status: true,
          clickName: "spellgroup",
          name: "拼团组",
          image: "../../../assets/img/diy/pintuan.png",
        },
        {
          status: true,
          clickName: "seckill",
          name: "秒杀组",
          image: "../../../assets/img/diy/miaosha.png",
        },
        {
          status: false,
          clickName: "bargain",
          name: "砍价组",
          image: "../../../assets/img/diy/miaosha.png",
        },
        {
          status: false,
          clickName: "vip",
          name: "会员卡组",
          image: "../../../assets/img/diy/vip.png",
        },
        {
          status: true,
          clickName: "store",
          name: "门店组",
          image: "../../../assets/img/diy/mendian.png",
        },
      ],
    },
    {
      active: true,
      disabled: false,
      name: "个人页面模块",
      cardList: [
        {
          status: true,
          clickName: "myTemplate",
          name: "模板一",
          image: "../../../assets/img/diy/mingpian.png",
          active: 1
        },
        {
          status: true,
          clickName: "myTemplate",
          name: "模板二",
          image: "../../../assets/img/diy/mingpian.png",
          active: 2
        },
        {
          status: true,
          clickName: "myTemplate",
          name: "模板三",
          image: "../../../assets/img/diy/mingpian.png",
          active: 3
        },
        {
          status: true,
          clickName: "myTemplate",
          name: "模板四",
          image: "../../../assets/img/diy/mingpian.png",
          active: 4
        },
        {
          status: true,
          clickName: "myTemplate",
          name: "模板五",
          image: "../../../assets/img/diy/mingpian.png",
          active: 5
        }, {
          status: true,
          clickName: "personal",
          name: "个人信息",
          image: "../../../assets/img/diy/mingpian.png"
        },
        {
          status: true,
          clickName: "myfunction",
          name: "我的功能",
          image: "../../../assets/img/diy/mingpian.png"
        },
        {
          status: true,
          clickName: "account",
          name: "个人账户",
          image: "../../../assets/img/diy/mingpian.png"
        },
      ],
    },
    {
      active: true,
      disabled: false,
      name: "名片模块",
      cardList: [
        {
          status: false,
          clickName: "companyinfo",
          name: "公司信息",
          image: "../../../assets/img/diy/gongsiinfo.png",
        },
        {
          status: false,
          clickName: "profile",
          name: "员工名片组",
          image: "../../../assets/img/diy/mingpian.png",
        },
        {
          status: false,
          clickName: "feedback",
          name: "咨询反馈组",
          image: "../../../assets/img/diy/zixun.png",
        },
      ],
    },
  ];
  showTab: any;
  listOfData: any;
  Articles: any;
  constructor(
    public activRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public router: Router,
    private message: NzMessageService,
    private styleServ: DiyStyleService
  ) { }

  async ngOnInit() {
    await this.getpanels()
    await this.queryRouter();

    // console
    // dragula([$('left-defaults'), $('right-defaults')]);
  }
  async getpanels() {
    let cid = localStorage.getItem('company')
    let Company = new Parse.Query('Company')
    Company.select('panels')
    let company = await Company.get(cid)
    if (company && company.get('panels') && company.get('panels').length > 0) {
      this.panels = company.get('panels')
    }
  }

  async queryRouter() {
    await this.activRoute.paramMap.subscribe(async (paramMap) => {
      this.pageType = paramMap.get("PclassName");
      if (paramMap.get("PclassName") == "CompanyCard") {
        let query = new Parse.Query("CompanyCard");
        this.diypage = await query.get(paramMap.get("PobjectId"));

        if (this.diypage) {
          this.blocks = this.diypage.get("blocks") || [];
          this.titleBar = this.diypage.get("titleBar") || {};
          this.showTab = this.diypage.get("isHome");
          console.log(this.blocks);
        } else {
          this.message.info("未找到该页面");
          history.back();
        }
      }
      if (paramMap.get("PclassName") == "DiyPage") {
        let query = new Parse.Query("DiyPage");
        this.diypage = await query.get(paramMap.get("PobjectId"));
        if (this.diypage) {
          this.blocks = this.diypage.get("blocks") || [];
          this.titleBar = this.diypage.get("titleBar") || {};
          this.showTab = this.diypage.get("isHome");
          console.log(this.diypage, this.showTab);
          await this.getTabs();
        }
      }
    });
  }
  tabs: any;
  async getTabs() {
    if (this.showTab) {
      let company = localStorage.getItem("company");
      let DiyTabs = new Parse.Query("DiyTabs");
      DiyTabs.equalTo("isOpen", true);
      DiyTabs.equalTo("company", company);
      DiyTabs.descending("updatedAt");
      let tabs = await DiyTabs.first();
      if (tabs && tabs.id) {
        console.log(tabs)
        this.tabs = tabs;
      }
    }
  }
  async changTab(index, item) {
    this.currentTabIndex = index;
    console.log(item);
    let pagePath = item.pagePath;
    if (pagePath.indexOf("/nova-diypage?id") != -1) {
      let index = pagePath.indexOf("?id=");
      let id = pagePath.slice(index + 4, pagePath.length);
      console.log(id);
      await this.router.navigate([
        "diypage/dashboard",
        {
          PclassName: "DiyPage",
          PobjectId: id,
        },
      ]);
      await this.queryRouter();
    }
  }

  save() {
    console.log(this.blocks);
    this.diypage.set("blocks", this.blocks);
    this.diypage.set("titleBar", this.titleBar);
    this.diypage.save().then((res) => {
      this.diypage = res;
      this.message.info("保存成功...");

      if (this.pageType == "DiyPage") {
        setTimeout(() => {
          // this.router.navigate([`/common/manage/DiyPage`]);
        }, 1000);
      }
      if (this.pageType == "CompanyCard") {
        setTimeout(() => {
          // this.router.navigate([`/common/manage/CompanyCard`]);
        }, 1000);
      }
    });
  }
  formatLabel(value: number) {
    let that = this;
    // this.blocks[this.currentIndex].style.opcity=value
    return value;
  }
  // 删除选中模块【block】
  deleteBlock() {
    if (this.blocks.length > 0) {
      this.blocks.splice(this.currentIndex, 1);
      this.currentIndex = 0;
      this.type = this.blocks[0].type;
      this.blocks.map((item, index) => {
        item.isSelected = false;
      });
    } else {
      this.type = "titlebar";
    }
    this.refreshPage(this.blocks);
    this.cdRef.detectChanges();
  }

  delete(e) {
    if (this.blocks.length > 0) {
      this.blocks.splice(e, 1);
      this.currentIndex = 0;
      this.type = this.blocks.length > 0 ? this.blocks[0].type : ''
      this.blocks.map((item, index) => {
        item.isSelected = false;
      });
    } else {
      this.type = "titlebar";
    }
    this.refreshPage(this.blocks);
    this.cdRef.detectChanges();
  }
  // 选中模块 【block】
  selected(ev) {
    this.type = ev.name;
    this.currentIndex = ev.i;
    this.blocks[ev.i].isSelected = true;
    this.blocks.map((item, index) => {
      if (ev.i != index) {
        item.isSelected = false;
      }
    });
  }
  refreshPage(blocks) { }
  //预览图片
  fileChange(files, index) {
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      console.log(this.blocks[this.currentIndex].data.info[index].image);
      this.blocks[this.currentIndex].data.info[index].image = reader.result;
    };
  }
  fileChange_1(files, index) {
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      console.log(this.blocks[this.currentIndex].data[index].image);
      this.blocks[this.currentIndex].data[index].image = reader.result;
    };
  }
  imgChange(files, index) {
    console.log(files);
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.blocks[this.currentIndex].data.info[index].image = reader.result;
    };
  }
  imgChange_1(files, index) {
    console.log(files);
    if (files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.blocks[this.currentIndex].data[index].image = reader.result;
    };
  }
  //重置颜色
  resetColor() {
    this.titleBar.backgroundColor = "#f1f1f1";
  }

  resetMargin(e) {
    e = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
  resetPadding(e) {
    e = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  }
  // 重置圆角
  resetRadius(radius) {
    console.log(radius)
    this.blocks[this.currentIndex].style[radius] = 0
    // radius = 0
  }
  clickTitle() {
    this.type = "titlebar";
    this.blocks.map((item, index) => {
      item.isSelected = false;
    });
  }
  //删除商品
  deleteGood(index, type = "goods") {
    if (type == "goods") {
      this.blocks[this.currentIndex].data.info.splice(index, 1);
    } else {
      this.blocks[this.currentIndex].data.splice(index, 1);
    }
  }

  /* 删除按钮 */
  deleteButton(index, type) {
    this.blocks[this.currentIndex].data.info.splice(index, 1);
  }
  // 添加商品
  addGood() {
    this.blocks[this.currentIndex].data.info.push({
      image: "",
      name: "",
      price: "",
    });
  }

  //添加导航列表
  addGuide() {
    this.blocks[this.currentIndex].data.push({
      image: "",
      name: "",
      more: "",
    });
  }

  //添加图标组

  //添加轮播图
  addImg() {
    this.blocks[this.currentIndex].data.info.push({
      image: "",
      name: "这里是标题",
      price: 20.0,
    });
  }
  addText() {
    this.blocks[this.currentIndex].data.push({
      image: "",
      name: "标题",
      price: "20",
      number: "1200",
    });
  }

  addArea(item) {
    if (!item.status) {
      this.message.info("功能开发中, 敬请期待");
      return;
    }
    let type = item.clickName;
    switch (type) {
      // 基础组件
      case "searchbar":
        this.blocks.push({
          type: "searchbar",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.searchbar)),
          data: [
            {
              className: ["ShopGoods", "Lesson"],
              equalTo: ["name"],
            },
          ],
        });
        break;
      case "hotdotbar":
        this.blocks.push({
          type: "hotdotbar",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.hotdotbar)),
          data: {
            notice: "请输入公告内容",
            url: "",
          },
        });
        break;
      case "guidelist":
        this.blocks.push({
          type: "guidelist",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.guidelist)),
          data: {
            src: "list",
            list: [
              {
                icon: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
                name: "导航标题",
                more: "查看更多",
                isArrow: false,
                url: "",
              },
            ],
          },
        });
        break;
      case "guideline":
        this.blocks.push({
          type: "guideline",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.guideline)),
        });
        break;
      case "imgswiper":
        this.blocks.push({
          type: "imgswiper",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.imgswiper)),
          data: {
            src: "list",
            list: [
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
                type: "image",
                url: "",
              },
            ],
            className: "Banner",
            filter: {
              equalTo: [
                {
                  key: "isEnabled",
                  name: "是否开启",
                  value: true,
                  isOpen: true,
                },
              ],
            },
          },
        });
        break;
      case "icongroup":
        this.blocks.push({
          type: "icongroup",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.icongroup)),
          data: {
            showTitle: false,
            title: "默认标题",
            src: "list",
            list: [
              {
                icon: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg", // 门店图片
                name: "菜单一",
                url: "",
              },
              {
                icon: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg", // 门店图片
                name: "菜单二",
                url: "",
              },
              {
                icon: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg", // 门店图片
                name: "菜单三",
                url: "",
              },
              {
                icon: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg", // 门店图片
                name: "菜单四",
                url: "",
              },
            ],
          },
        });
        break;
      case "singleimg":
        this.blocks.push({
          type: "singleimg",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.singleimg)),
          data: {
            src: "list",
            list: [
              {
                showTitle: false,
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
                title: '图片标题',
                url: "",
                className: "",
                objectId: "",
              },
            ],
          },
        });
        break;
      case "multipleimg":
        this.blocks.push({
          type: "multipleimg",
          isSelected: false,
          data: {
            src: "list",
            list: [
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
                url: "",
                className: "",
                objectId: "",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
                url: "",
                className: "",
                objectId: "",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
                url: "",
                className: "",
                objectId: "",
              },
            ],
          },
          style: JSON.parse(JSON.stringify(this.styleServ.multipleimg)),
        });
        break;
      case "video":
        this.blocks.push({
          type: "video",
          isSelected: false,
          cloumn: "two",
          style: JSON.parse(JSON.stringify(this.styleServ.video)),
          data: {
            src: "list",
            controls: true, // 是否显示播放控件
            showCenterBtn: true,
            showPlayBtn: true,
            autoplay: false,
            showTitle: false,
            showDesc: false,
            list: [
              {
                video:
                  "https://baikevideo.cdn.bcebos.com/media/mda-OfXttXY16SVdPBHF/11793c9f31e98f7b737e7e7030adca62.mp4",
                image:
                  "https://file-cloud.fmode.cn/O64wHWNFcf/20220115/1li0pv110456.png",
                title: "视频标题",
                desc: "这里是视频简介",
              },
            ],
          },
        });
        break;
      case "textgroup":
        this.blocks.push({
          type: "textgroup",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.textgroup)),
          data: [
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
              name: "标题",
              price: "20",
              number: "1200",
            },
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/c71eoc.jpg",
              name: "标题",
              price: "20",
              number: "320",
            },
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
              name: "标题",
              price: "20",
              number: "0",
            },
          ],
        });
        break;
      case "intro":
        this.blocks.push({
          type: "intro",
          isSelected: false,
          column: "row",
          style: JSON.parse(JSON.stringify(this.styleServ.intro)),
          data: {
            limit: 5,
            className: "",
            src: 'list',
            list: [
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
                name: "人物名称",
                desc: "这里是人物简介",
                url: "",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/c71eoc.jpg",
                name: "人物名称",
                desc: "这里是人物简介",
                url: "",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
                name: "人物名称",
                desc: "这里是人物简介",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
                name: "人物名称",
                desc: "这里是人物简介",
                url: "",
              },
            ],
          },
        });
        break;
      case "account":
        this.blocks.push({
          type: "account",
          isSelected: false,
          line: 'dotted',
          style: JSON.parse(JSON.stringify(this.styleServ.account)),
          data: {
            className: "",
            src: 'list',
            list: [
              {
                num: '0',
                name: '零钱'
              },
              {
                num: '0',
                name: '积分',
              },
            ],
          },
        });
        break;
      case "richtext":
        this.blocks.push({
          type: "richtext",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.richtext)),
          data: {
            richtext: "<p>点此编辑『富文本』内容 ——></p>"
          },
        });
        break;

      // 商城模块
      case "goodsgroup":
        this.blocks.push({
          type: "goodsgroup",
          isSelected: false,
          column: "one",
          showOriginalPrice: "false",
          style: JSON.parse(JSON.stringify(this.styleServ.goodsgroup)),
          data: {
            src: "filter",
            className: "ShopGoods",
            list: [

              {
                "tag": [
                  "推荐",
                  "热销"
                ],
                "url": "",
                "desc": "快速补水，舒缓干燥，轻轻一拍，肌肤细腻透亮；深入锁水，亮润柔滑，舒缓修护，焕活滋养；轻轻一喷，拯救你的敏感肌，深层解救肌肤饥渴。",
                "name": "测试商品一",
                "image": "https://file-cloud.fmode.cn/nCCirOU5zn/20211225/5c1m1b023748.jpg",
                "price": 439,
                "sales": 0,
                "originalPrice": 586
              },
              {
                "tag": [],
                "url": "",
                "desc": "补水滋润，密集修护，嫩滑肌肤",
                "name": "测试商品二",
                "image": "https://file-cloud.fmode.cn/nCCirOU5zn/20211218/h1jd85094350.jpg",
                "price": 128,
                "sales": 0,
                "originalPrice": 128
              },
              {
                "tag": [],
                "url": "",
                "desc": "快速补水，舒缓干燥，轻轻一拍，肌肤细腻透亮。",
                "name": "测试商品三",
                "image": "https://file-cloud.fmode.cn/nCCirOU5zn/20211218/71atb1101751.jpg",
                "price": 198,
                "sales": 0,
                "originalPrice": 198
              },
              {
                "tag": [
                  "热销"
                ],
                "url": "",
                "desc": "天然植萃，养唇更润唇，一抹丝滑浓郁，饱满显色；植萃营养，养唇更润唇，一抹显色，奢宠焕色；随机变色润唇膏，根据唇部ph和温度变幻唇色",
                "name": "测试商品四",
                "image": "https://file-cloud.fmode.cn/nCCirOU5zn/20211220/k11j7u024541.jpg",
                "price": 238,
                "sales": 0,
                "originalPrice": 324
              },
              {
                "tag": [],
                "url": "/nova-shop/pages/shop-goods/goods-detail/index?id=j45Ks5zlJu",
                "desc": "深入锁水，亮润柔滑，舒缓修护，焕活滋养",
                "name": "测试商品五",
                "image": "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/q1vi41025543.jpg",
                "price": 229,
                "sales": 0,
                "originalPrice": 229
              },
              {
                "tag": [],
                "url": "",
                "desc": "洁净肌肤，温和呵护，平衡水油，深层清洁。",
                "name": "测试商品六",
                "image": "https://file-cloud.fmode.cn/nCCirOU5zn/20211218/41pgd8102735.jpg",
                "price": 159,
                "sales": 0,
                "originalPrice": 159
              }
            ],
            filter: {
              equalTo: [
                {
                  key: "status",
                  name: "是否上架",
                  value: true,
                  isOpen: true,
                  type: "Boolean",
                },
                {
                  key: "isRecom",
                  name: "是否推荐",
                  value: true,
                  isOpen: false,
                  type: "Boolean",
                },
                {
                  key: "types",
                  name: "商品类型",
                  value: "",
                  type: "select",
                },
                // {
                //   "key": "short",
                //   "name": "推荐字词",
                //   "value": "",
                //   "type": "String"
                // },
                {
                  key: "category",
                  name: "所属分类",
                  className: "Category",
                  value: "",
                  type: "Pointer",
                  filter: [
                    {
                      fun: "equalTo",
                      key: "type",
                      value: "shop",
                    },
                  ],
                },
              ],
              containedIn: [
                {
                  key: "tag",
                  name: "包含标签",
                  value: [],
                  type: "Array",
                },
              ],
            },
          },
        });
        break;
      case "lessongroup":
        this.blocks.push({
          type: "lessongroup",
          isSelected: false,
          column: "one",
          showName: "true",
          showPrice: "true",
          showOriginalPrice: "false",
          showDesc: "true",
          showTag: "true",
          showTeacher: "false",
          showButton: "true",
          style: JSON.parse(JSON.stringify(this.styleServ.lessongroup)),
          data: {
            src: "filter", // * 筛选方式
            className: "Lesson", // * 数据源表名
            limit: 4,
            list: [
              // * 预览占位数据
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
                name: "课程名称",
                desc: "课程简介",
                teacherName: "讲师名称",
                tag: ["标签一", "标签二"],
                price: 399,
                originalPrice: 4999,
                link: "/nova-shop/pages/shop-goods/goods-detail/index?",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
                name: "课程名称",
                teacherName: "讲师名称",
                price: 0,
                originalPrice: 4999,
                link: "/nova-shop/pages/shop-goods/goods-detail/index?",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
                name: "课程名称",
                teacherName: "讲师名称",
                price: 0,
                originalPrice: 4999,
                link: "/nova-shop/pages/shop-goods/goods-detail/index?",
              },
              {
                image:
                  "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
                name: "课程名称",
                teacherName: "讲师名称",
                price: 0,
                originalPrice: 4999,
                link: "/nova-shop/pages/shop-goods/goods-detail/index?",
              },
            ],
            filter: {
              equalTo: [
                {
                  key: "status",
                  name: "是否上架",
                  value: true,
                  isOpen: true,
                  type: "Boolean",
                },
                {
                  key: "isHot",
                  name: "是否推荐",
                  value: true,
                  isOpen: false,
                  type: "Boolean",
                },
                // {
                //     key: "types",
                //     name: "课程分类",
                //     value: "",
                //     type: "select",
                // },
                {
                  key: "lessonType",
                  name: "课程类型",
                  value: "",
                  type: "select",
                },
                {
                  key: "category",
                  name: "所属分类",
                  className: "Category",
                  value: "",
                  type: "Pointer",
                  filter: [
                    {
                      fun: "equalTo",
                      key: "type",
                      value: "lesson",
                    },
                  ],
                },

              ],
              containedIn: [
                {
                  key: "tag",
                  name: "包含标签",
                  value: [],
                  type: "Array",
                },
              ],
            },
          },
        });
        break;
      case "article":
        this.blocks.push({
          type: "article",
          isSelected: false,
          column: "template1",
          style: JSON.parse(JSON.stringify(this.styleServ.article)),
          data: {
            src: "filter", // * 筛选方式
            limit: 3, // 加载条数
            className: "Article", // * 数据源表名
            showAuth: false,
            showLike: true,
            showRead: true,
            showTag: true,
            list: [
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211218/71atb1101751.jpg",
                title: "快速补水，舒缓干燥，轻轻一拍，肌肤细腻透亮。",
                tag: ["掌柜说"],
                pageView: 0,
                likeCount: 0,
                author_name: "键盘侠",
                url: "",
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211218/41pgd8102735.jpg",
                title: "洁净肌肤，温和呵护，平衡水油，深层清洁。",
                tag: ["掌柜说"],
                pageView: 6,
                likeCount: 1,
                author_name: "键盘侠",
                url: "",
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211220/k11j7u024541.jpg",
                title: "快速补水，舒缓干燥，轻轻一拍，肌肤细腻透亮。",
                tag: ["掌柜说"],
                pageView: 2,
                likeCount: 0,
                author_name: "键盘侠",
                url: "",
              },
            ],
            filter: {
              equalTo: [
                {
                  key: "category",
                  name: "文章分类",
                  className: "Category",
                  value: "",
                  type: "Pointer",
                  filter: [
                    {
                      fun: "equalTo",
                      key: "type",
                      value: "article",
                    },
                  ],
                },
              ],
              containedIn: [
                {
                  key: "tag",
                  name: "包含标签",
                  value: [],
                  type: "Array",
                },
              ],
            },
          },
        });
        break;
      case "coupons":
        this.blocks.push({
          type: "coupons",
          isSelected: false,
          column: "style1",
          style: JSON.parse(JSON.stringify(this.styleServ.coupons)),
          data: {
            showTitle: false,
            title: "默认标题",
            src: "list",
            list: [
              {
                price: 100,
                name: "满减优惠券",
                title: "满100.1可用，全部商品",
              },
              {
                price: 300,
                name: "满减优惠券",
                title: "满150可用，全部商品",
              },
              {
                price: 600,
                name: "满减优惠券",
                title: "满299可用，全部商品",
              },
            ],
          },
        });
        break;
      case "spellgroup":
        this.blocks.push({
          type: "spellgroup",
          isSelected: false,
          column: "template1",
          style: JSON.parse(JSON.stringify(this.styleServ.spellgroup)),
          data: {
            limit: 3,
            src: "list",
            showPrice: true, // 显示价格
            showGroupPrice: true,
            showCountdown: true,
            groupPeople: true,
            showTotal: true,
            className: "GroupBuyGoods",
            list: [
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处商品名称，最多显示两行",
                desc: "此处商品描述最多显示以后",
                price: 59.99,
                original: 79.99,
                people: 2,
                total: 50,
                time: 43200000,
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处商品名称，最多显示两行",
                desc: "此处商品描述最多显示以后",
                price: 59.99,
                original: 79.99,
                people: 2,
                total: 50,
                time: 43200000,
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处商品名称，最多显示两行",
                desc: "此处商品描述最多显示以后",
                price: 59.99,
                original: 79.99,
                people: 2,
                total: 50,
                time: 43200000,
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处商品名称，最多显示两行",
                desc: "此处商品描述最多显示以后",
                price: 59.99,
                original: 79.99,
                people: 2,
                total: 50,
                time: 43200000,
              },
            ],
            filter: {
              include: [
                {
                  key: "goods",
                  name: "拼团商品",
                },
              ],
            },
          },
        });
        break;
      case "seckill":
        this.blocks.push({
          type: "seckill",
          isSelected: false,
          column: "template1",
          style: JSON.parse(JSON.stringify(this.styleServ.seckill)),
          data: {
            limit: 3,
            src: "list",
            showPrice: true, // 显示原价
            showSeckillPrice: true, // 显示秒杀价
            showCountdown: true, // 显示倒计时
            showTotal: true, //显示库存
            className: "RushGoods",
            list: [
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处显示商品名称",
                desc: "此处显示商品描述",
                price: 79.99, //折扣价
                original: 159.99, //原价
                total: 20, //库存
                time: 43200000,
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处显示商品名称",
                desc: "此处显示商品描述",
                price: 79.99, //折扣价
                original: 159.99, //原价
                total: 20, //库存
                time: 43200000,
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处显示商品名称",
                desc: "此处显示商品描述",
                price: 79.99, //折扣价
                original: 159.99, //原价
                total: 20, //库存
                time: 43200000,
              },
              {
                image:
                  "https://file-cloud.fmode.cn/nCCirOU5zn/20211217/3nh9jt022514.jpg",
                name: "此处显示商品名称",
                desc: "此处显示商品描述",
                price: 79.99, //折扣价
                original: 159.99, //原价
                total: 20, //库存
                time: 43200000,
              },
            ],
            filter: {
              include: [
                {
                  key: "goods",
                  name: "秒杀商品",
                },
              ],
            },
          },
        });
        break;
      case "fixedsearch":
        this.blocks.unshift({
          type: "fixedsearch",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.fixedsearch)),
          data: {},
        });
        break;
      case "companyinfo":
        this.blocks.push({
          type: "companyinfo",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.companyinfo)),
          data: [
            {
              name: "客服电话",
              desc: "18870781105",
            },
            {
              name: "工作时间",
              desc: "全年无休(007)",
            },
            {
              name: "客服邮箱",
              desc: "920887943@qq.com",
            },
            {
              name: "微信服务号",
              desc: "未来飞马",
            },
          ],
        });
        break;
      case "store":
        this.blocks.push({
          type: "store",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.store)),
          data: {
            src: "filter", // 'filter'
            className: "ShopStore",
            limit: 3,
            list: [
              {
                storeName: "Apple官方旗舰店", // 门店名称
                address: "", // 门店地址
                allGoods: 99,
                salesGoods: 88,
                cover: 'https://file-cloud.fmode.cn/nCCirOU5zn/20211218/g13aa5104648.jpg',
                logo: "https://img0.baidu.com/it/u=3291418770,872733635&fm=253&fmt=auto&app=138&f=JPEG", // 门店图片
              },
              {
                storeName: "店铺名称", // 门店名称
                address: "", // 门店地址
                allGoods: 99,
                salesGoods: 88,
                cover: 'https://file-cloud.fmode.cn/nCCirOU5zn/20211218/g13aa5104648.jpg',
                logo: "https://img0.baidu.com/it/u=3291418770,872733635&fm=253&fmt=auto&app=138&f=JPEG", // 门店图片
              },
              {
                storeName: "店铺名称", // 门店名称
                address: "", // 门店地址
                allGoods: 99,
                salesGoods: 88,
                cover: 'https://file-cloud.fmode.cn/nCCirOU5zn/20211218/g13aa5104648.jpg',
                logo: "https://img0.baidu.com/it/u=3291418770,872733635&fm=253&fmt=auto&app=138&f=JPEG", // 门店图片
              }
            ],
            filter: {
              equalTo: [
                {
                  "key": "isShow",
                  "name": "是否开启",
                  "type": "Boolean",
                  "value": true,
                  "isOpen": true
                },
                {
                  "key": "isVerified",
                  "name": "是否审核",
                  "type": "Boolean",
                  "value": true,
                  "isOpen": true
                }
              ]
            }
          }
        });
        break;
      case "profile":
        this.blocks.push({
          type: "profile",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.profile)),
          data: [
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
              name: "标题",
              desc: "描述",
              url: "",
            },
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/c71eoc.jpg",
              name: "标题",
              desc: "描述",
              url: "",
            },
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
              name: "标题",
              desc: "描述",
              url: "",
            },
          ],
        });
        break;
      case "tabs":
        this.blocks.push({
          type: "tabs",
          isSelected: false,
          style: JSON.parse(JSON.stringify(this.styleServ.tabs)),
          data: [
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
              name: "标题",
              url: "",
            },
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/c71eoc.jpg",
              name: "标题",
              url: "",
            },
            {
              image:
                "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/hh1pot.jpg",
              name: "标题",
              url: "",
            },
          ],
        });
        break;
      case "myTemplate":
        let index = this.blocks.findIndex((block) => {
          return block.type == "myTemplate";
        });
        if (index != -1) {
          this.blocks[index] = {
            type: "myTemplate",
            isSelected: false,
            active: item.active,
          };
        } else {
          this.blocks.push({
            type: "myTemplate",
            isSelected: false,
            active: item.active,
          });
        }
        let type = item.clickName;

        break;
      case "personal":
        this.blocks.push({
          type: "personal",
          style: JSON.parse(JSON.stringify(this.styleServ.personal)),
          data: {
          }
        });
        break;
      case "myfunction":
        this.blocks.push({
          type: "myfunction",
          style: JSON.parse(JSON.stringify(this.styleServ.myfunction)),
          data: {
            className: "myfunction",
            src: 'list',
            list: [// * 预览占位数据
              {
                backgroundimg: "https://b.yzcdn.cn/public_files/ebe28b631e66245181d555f3cb069691.png",
                name: "学生证",
                switch: true,
                showIcon: true,
                url: ""
              },
              {
                backgroundimg: "https://b.yzcdn.cn/public_files/63e0df4068691e8426857e81fa6c3f5d.png",
                name: "家校圈",
                switch: true,
                showIcon: true,
                url: ""
              }]
          },
        });
        break;
      default:
        break;
    }
    console.log(this.blocks);
  }
  movePhone: boolean = true;
  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
    this.currentIndex = event.currentIndex;
  }
  finish() {
    console.log(this.blocks);
  }
  // 显示商品列表
  goods: any;
  goodIndex: number;
  isShowShopGoods: boolean = false;
  async showModel(i) {
    this.isShowShopGoods = true;
    let queryShopGoods;
    if (this.type == "goodsgroup") {
      queryShopGoods = new Parse.Query("ShopGoods");
    } else if (this.type == "lessongroup") {
      queryShopGoods = new Parse.Query("Lesson");
    } else if (this.type == "imgswiper") {
      queryShopGoods = new Parse.Query("ShopGoods");
    } else if (this.type == "icongroup") {
      queryShopGoods = new Parse.Query("Category");
    }
    queryShopGoods.equalTo("company", localStorage.getItem("company"));
    let goods = await queryShopGoods.find();
    this.goods = goods;
    this.goodIndex = i;
  }
  // 显示分类列表
  category: any;
  async showCategory() {
    this.isShowCategory = true;
    let queryShopGoods = new Parse.Query("Category");
    console.log(queryShopGoods);
    queryShopGoods.equalTo("company", localStorage.getItem("company"));
    let category = await queryShopGoods.find();
    this.category = category;
  }
  async selectRadio(e) {
    this.blocks[this.currentIndex].filter = [];
    this.blocks[this.currentIndex].data.info = [];

    if (e == "new") {
      this.blocks[this.currentIndex].filter.push({
        type: "ascending",
        key: "createdAt",
      });
      let query = new Parse.Query("ShopGoods");
      query.equalTo("company", localStorage.getItem("company"));
      query.ascending("createdAt");
      let result: any = [];
      result = await query.find();
      if (result.length > 0) {
        result.map((item, index) => {
          this.blocks[this.currentIndex].data.info[index] = {
            image: item.get("image"),
            name: item.get("name"),
            price: item.get("price"),
            link: "detail?objectId=" + item.id,
            total: item.get("total"),
            objectId: item.id,
          };
        });
      }
    }
    if (e == "home") {
      this.blocks[this.currentIndex].filter.push({
        type: "equalTo",
        key: "isHome",
        value: true,
      });

      let query = new Parse.Query("ShopGoods");
      query.equalTo("isHome", true);
      query.equalTo("company", localStorage.getItem("company"));

      let result: any = [];
      result = await query.find();
      if (result.length > 0) {
        result.map((item, index) => {
          this.blocks[this.currentIndex].data.info[index] = {
            image: item.get("image"),
            name: item.get("name"),
            price: item.get("price"),
            link: "detail?objectId=" + item.id,
            total: item.get("total"),
            objectId: item.id,
          };
        });
      }

      console.log(result);
    }
    if (e == "category") {
      this.showCategory();
    }
  }
  handleCancel() {
    this.isShowShopGoods = false;
    this.isShowArticle = false;
    this.isShowCategory = false;
  }

  /* 获取活动 */
  async getActivity(e) {
    console.log(e);
    this.blocks[this.currentIndex].data.info = [];
    if (e == "new") {
      let query = new Parse.Query("Activity");
      query.limit(5);
      query.equalTo("company", localStorage.getItem("company"));
      query.ascending("createdAt");
      let result: any = [];
      result = await query.find();
      console.log(result);
      if (result.length > 0) {
        result.map((item, index) => {
          let iter = item.toJSON();
          iter.checkDate = iter.checkDate.iso;
          this.blocks[this.currentIndex].data.info.push(iter);
        });
      }
    }
  }
  handleOk() {
    this.isShowShopGoods = false;
  }
  chooseGoods(data) {
    console.log(data);
    if (this.type == "goodsgroup") {
      this.blocks[this.currentIndex].data.info[this.goodIndex] = {
        image: data.get("image"),
        name: data.get("name"),
        price: data.get("price"),
        total: data.get("total"),
        link: "detail?objectId=" + data.id,
        objectId: data.id,
      };
    } else if (this.type == "lessongroup") {
      this.blocks[this.currentIndex].data.info[this.goodIndex] = {
        image: data.get("image"),
        teacherName: data.get("teacher"),
        name: data.get("title"),
        price: data.get("price"),
        link: "detail?objectId=" + data.id,
        objectId: data.id,
      };
    } else if (this.type == "imgswiper") {
      this.blocks[this.currentIndex].data.info[this.goodIndex] = {
        image: data.get("image"),
        name: data.get("name"),
        price: data.get("price"),
        link: "detail?objectId=" + data.id,
        objectId: data.id,
      };
    } else if (this.type == "icongroup") {
      this.blocks[this.currentIndex].data[this.goodIndex] = {
        image: data.get("image"),
        name: data.get("name"),
        price: data.get("price"),
        link: "detail?objectId=" + data.id,
        objectId: data.id,
      };
    }

    console.log(this.blocks[this.currentIndex].data);
    this.isShowShopGoods = false;
    this.cdRef.detectChanges();
  }
  async chooseCategory(data) {
    this.blocks[this.currentIndex].filter.push({
      type: "equalTo",
      key: "category",
      value: data.id,
    });

    if (this.type == "goodsgroup") {
      this.blocks[this.currentIndex].data.info = [];
      let query = new Parse.Query("ShopGoods");
      query.equalTo("category", data.id);
      let result: any = [];
      result = await query.find();
      if (result.length > 0) {
        result.map((item, index) => {
          this.blocks[this.currentIndex].data.info[index] = {
            image: item.get("image"),
            name: item.get("name"),
            price: item.get("price"),
            link: "detail?objectId=" + item.id,
            objectId: item.id,
          };
        });
      }
    }

    console.log(this.blocks[this.currentIndex].data);
    this.isShowCategory = false;
    this.cdRef.detectChanges();
  }

  // 文章显示
  isShowArticle: boolean = false;

  chooseArticle(data) {
    this.blocks[this.currentIndex].data[0] = {
      image: data.get("cover")[0],
      title: data.get("title"),
      author: data.get("author_name"),
      h5Link:
        this.blocks[this.currentIndex].data[0].h5Link.split("objectId")[0] +
        "objectId=" +
        data.id,
      wxLink:
        this.blocks[this.currentIndex].data[0].wxLink.split("objectId")[0] +
        data.id,
    };
    this.isShowArticle = false;
  }
  chooseImg() { }
  // 商品的显示方式
  showColumn(type) {
    this.blocks[this.currentIndex].column = type;
    console.log(this.blocks[this.currentIndex].column);
  }
  Change(blocks) {
    console.log(blocks);
  }


}
