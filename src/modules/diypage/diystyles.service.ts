import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiyStyleService {

  constructor() { }
  /* 搜索栏 */
  // searchbar(){
  //   width = 'jdfd'
  // }
  searchbar = {
    width: "100",
    height: "50",
    backgroundColor: "#ffff",
    opacity: 1,
    inputBgColor: "#ffffff",
    inputColor: "#ffffff",
    inputFontSize: 18,
    iconColor: "#b4b4b4",
    inputWidth: "240",
    inputHeight: "36",
    btnWidth: "60",
    btnHeight: "36",
    iconSize: 28,
    btnBgColor: "#40a9ff",
    btnColor: "#fffff",
    btnFontSize: 16,
    inputMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    inputPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    iconMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    btnMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    borderRadius: 10,
    inputBorderRadius: 10,
    btnBorderRadius: 10,
    placeholder: "请输入搜索内容",
    placeholderColor: "#b2b2b2",
  }
  /* 公告栏 */
  hotdotbar = {
    backgroundColor: "#ffffff",
    iconColor: "#fd5454",
    textColor: "#666666",
    width: 96,
    height: 40,
    iconSize: 16,
    fontSize: 16,
    borderRadius: 10,
    margin: {
      top: 4,
      right: 2,
      bottom: 4,
      left: 2,
    },
    padding: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 导航栏 */
  guidelist = {
    isUnderline: true,
    underLineColor: "#000",
    underLineHeight: 2,
    width: "92",
    height: 35,
    background: "#FFFFFF",
    borderRadius: 10,
    titleColor: "#000000",
    titleSize: 14, //标题字体大小
    iconWidth: 14,
    iconHeight: 14,
    moreColor: "#dddddd",
    moreSize: 12,
    arrowWidth: 12,
    arrowHeight: 12,
    margin: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    iconMargin: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }
  /* 辅助线 */
  guideline = {
    width: 96,
    backgroundColor: "#ffffff",
    color: "#666666",
    height: 3,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 轮播图 */
  imgswiper = {
    backgroundColor: "#ffffff",
    iconColor: "#fd5454",
    textColor: "#666666",
    dots: true, //是否显示指示点
    height: 180,
    width: 96,
    imageWidth: 354,
    imageHeight: 180,
    borderRadius: 10,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 图标组 */
  icongroup = {
    fontSize: "14",
    backgroundColor: "#ffffff",
    textColor: "#666666",
    iconValue: "24", // 控制每一个图标宽度占比
    width: "92",
    iconWidth: "80",
    iconHeight: "80",
    borderRadius: 10,
    margin: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 单图组 */
  singleimg = {
    width: "92",
    height: 300,
    borderRadius: 10,
    fontSize: '14',
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 多图组 */
  multipleimg = {
    height: 300,
    width: 94,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    padding: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    borderRadius: 0,
    backgroundColor: "",

    leftWidth: 50,
    rightWidth: 50,
    leftHeight: 280,
    rightHeight: 280,
    leftMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    leftPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    rightMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    rightPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    img1Width: 100,
    img2Width: 100,
    img3Width: 100,
    img1Height: 280,
    img2Height: 135,
    img3Height: 135,
    img1BorderRadius: 0,
    img2BorderRadius: 0,
    img3BorderRadius: 0,
    img1Margin: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 0,
    },
    img2Margin: {
      top: 0,
      right: 0,
      bottom: 5,
      left: 0,
    },
    img3Margin: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
    img1Padding: {
      top: 0,
      right: 10,
      bottom: 0,
      left: 0,
    },
    img2Padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    img3Padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 视频组 */
  video = {
    width: "100",
    videoWidth: "100",
    height: 210,
    borderRadius: 10,
    titleSize: "12",
    descSize: "12",
    backgroundColor: "#ffffff",
    areaMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 文字组 */
  textgroup = {
    fontSize: "14",
    iconSize: "12",
    backgroundColor: "#ffffff",
    iconColor: "#fd5454",
    textColor: "#666666",
    iconValue: "48",
    width: "92",
    marginTop: "10",
  }
  /* 人物介绍 */
  intro = {
    fontSize: "12",
    descSize: "12",
    backgroundColor: "#ffffff",
    width: "92",
    imageWidth: "66",
    imageHeight: "66",
    borderRadius: "50",
    areaMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 个人账户 */
  account = {
    backgroundColor: "#ffffff",
    width: "100",
    numSize: '28',
    numColor: '#dd5f72',
    nameSize: '16',
    areaMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 富文本 */
  richtext = {
    backgroundColor: "#ffffff",
    width: "100",
    areaMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 商品组 */
  goodsgroup = {
    background: "#eeeeee",
    width: 96, // 百分比
    height: 160, // px/rpx
    shopBackground: "#ffffff",
    borderRadius: 10,
    imgwidth: 145,
    imgheight: 134,
    imgborderRadius: 10,
    imgmarginRight: 10,
    goodinfowidth: 160,
    nameColor: "#000000",
    namefontSize: 14,
    nameWeight: 700,
    namemarginBottom: 2,
    descColor: "#b4b4b4",
    descfontSize: 12,
    descmarginBottom: 2,
    tagColor: "#ff4d4f",
    tagmarginBottom: 2,
    priceColor: "#ff4d4f",
    pricefontSize: 14,
    pricefontWeight: 700,
    opriceColor: "#b4b4b4",
    opricefontSize: 12,
    saleColor: "#b4b4b4",
    salefontSize: 12,
    shortBackground: "red",
    iconColor: "#fd5454",
    textColor: "#666666",
    buttonColor: "#ffffff",
    buttonBackground: "#ff4d4f",
    areaMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    margin: {
      top: 4,
      right: 0,
      bottom: 4,
      left: 5,
    },
    padding: {
      top: 4,
      right: 10,
      bottom: 4,
      left: 10,
    },
  }
  /* 课程组 */
  lessongroup = {
    areaBackground: "#f6f7f8",
    width: 96, // 百分比
    height: 160, // px/rpx
    background: "#ffffff",
    borderRadius: 10,
    imgWidth: 145,
    imgHeight: 134,
    imgborderRadius: 10,
    imgmarginRight: 10,
    lessoninfoWidth: 160,
    nameColor: "#000000",
    namefontSize: 14,
    namefontWeight: 700,
    namemarginBottom: 0,
    descColor: "#b4b4b4",
    descfontSize: 12,
    descmarginBottom: 0,
    tagColor: "#ff4d4f",
    tagmarginBottom: 2,
    teachernameColor: "#000000",
    teachernamefontSize: 14,
    teachernameWeight: 700,
    priceColor: "red",
    pricefontSize: 14,
    priceWeight: 700,
    opriceColor: "#f8f9f8",
    opricefontSize: 14,
    buttonWidth: 60,
    buttonHeight: 22,
    buttonborderRadius: 10,
    buttonColor: "#ffffff",
    buttonBackground: "#ff4d4f",
    buttonText: "购买",
    areaMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    margin: {
      top: 4,
      right: 0,
      bottom: 4,
      left: 5,
    },
    padding: {
      top: 4,
      right: 10,
      bottom: 4,
      left: 10,
    },
  }
  /* 文章列表 */
  article = {
    width: 96,
    articleWidth: 98,
    background: "#ffffff",
    titleColor: "#666666",
    articleBackground: "#ffffff",
    titleSize: 18,
    autorSize: 14,
    borderRadius: 6,
    articleBorderRadius: 6,
    margin: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
    articleMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    articlePadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 优惠券 */
  coupons = {
    width: 96,
    background: "#fff",
    borderRadius: 6,
    couponBackground: "#c8c9cc",
    couponBack: "#ffffff",

    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 拼团 */
  spellgroup = {
    width: 96,
    groupWidth: 100,
    background: "#fff",
    groupBackground: "#ffffff",
    borderRadius: 6,
    groupBorderRadius: 6,
    titleSize: 16,
    descSize: 14,
    btnSize: 16,
    btnColor: "red",
    btnText: "去开团",
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    groupMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    groupPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 秒杀 */
  seckill = {
    width: 96,
    background: "#ffffff",
    seckillWidth: 100,
    seckillBackground: "#ffffff",
    borderRadius: 6,
    seckillBorderRadius: 6,
    titleSize: 16,
    descSize: 14,
    btnSize: 16,
    btnColor: "red",
    btnText: "秒杀",
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    seckillMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    seckillPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 固定搜索栏 */
  fixedsearch = {
    backgroundColor: "#000",
    inputColor: "#000",
    paddingTop: "10px",
    paddingRight: "10px",
    paddingBottom: "10px",
    paddingLeft: "10px",
  }
  /* 公司信息 */
  companyinfo = {
    width: "92",
  }
  /* 门店组 */
  store = {
    column: "template1",
  }
  /* 名片组 */
  profile = {
    imgHeight: 200,
    fontSize: "14",
    backgroundColor: "#ffffff",
    iconColor: "#fd5454",
    textColor: "#666666",
    iconValue: "32",
    width: "92",
    borderRadius: "0",
    margin: {
      top: 5,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 导航tabs */
  tabs = {
    height: 60,
    width: 100,
    borderRadius: 8,
    iconValue: 4,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    backgroundColor: "#40a9ff",
    textColor: "#ffffff",
    selectbgColor: "#ffffff",
    selecttextColor: "#000000",
    fontSize: "#000000",
    selectborderRadius: 0,
    selectMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    selectPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }
  /* 个人信息 */
  personal = {
    column: "left",
    memberStyle: "one",
    width: "100",
    height: "128",
    switch: "true",
    backgroundimg: "https://img01.yzcdn.cn/upload_files/2019/01/31/Fp3kIohim8ZiB1yLepoMMW8is_qY.png",
    portrai: "//b.yzcdn.cn/showcase/membercenter/2018/08/06/default_avatar@2x.png",
    color: "black",
  }
  /* 我的功能 */
  myfunction = {
    styleType: "one",
    backgroundColor: '#ffffff',
    width: '100',
    fontSize: '16',
    iconWidth: '20',
    iconHeight: '20',
    areaMargin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
  }

  /* 样式重置 */
  reset(block, field) {
    block.style[field] = this[block.type][field];
    console.log(block.style[field]);



  }

}
