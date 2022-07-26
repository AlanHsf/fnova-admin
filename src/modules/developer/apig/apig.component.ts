import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apig',
  templateUrl: './apig.component.html',
  styleUrls: ['./apig.component.scss']
})
export class ApigComponent implements OnInit {
  tabs: any = [
    '产品功能', 'API文档', '错误码参照', '示例代码', '联系我们'
  ]
  radioType: Array<any> = [
    '4000', '8000', '40000'
  ]
  checkedType: string = this.radioType[0];
  // API文档
  docMenu: number = 1;// 侧边菜单栏激活项
  formats: Array<any> = [
    {
      name: '接口地址',
      desc: 'http://op.juhe.cn/idcard/query'
    },
    {
      name: '返回格式',
      desc: 'json'
    },
    {
      name: '请求方式',
      desc: 'http get/post'
    },
    {
      name: '请求示例',
      desc: 'http://op.juhe.cn/idcard/query?key=您申请的KEY&idcard=&realname='
    },
    {
      name: '接口备注',
      desc: 'error_code为0时计费'
    },

  ]
  docData1: Array<any> = [
    {
      name: 'idcard',
      required: '是',
      type: 'string',
      desc: '身份证号码加密'
    },
    {
      name: 'idcard',
      required: '是',
      type: 'string',
      desc: '身份证号码加密'
    },
    {
      name: 'idcard',
      required: '是',
      type: 'string',
      desc: '身份证号码加密'
    }
  ]
  docData2: Array<any> = [
    {
      name: 'idcard',
      type: 'string',
      desc: '身份证号码加密'
    },
    {
      name: 'idcard',
      type: 'string',
      desc: '身份证号码加密'
    },
    {
      name: 'idcard',
      type: 'string',
      desc: '身份证号码加密'
    }
  ]
  docData3: string = `加密算法：AES/ECB/PKCS5Padding，AES结果无需转小写,经过base64
  加密后的数据需要urlencode传入
  加密的密钥为:客户个人中心的openid经过md5后结果为小写取前16位

  {
      "reason": "成功",
      "result": {
         "orderid":"J103201911121607589548",/*单号*/[/color]
          "res": 1 /*1：匹配 2：不匹配*/
      },
      "error_code": 0
  }`
  // 错误码参照
  errCodeData1: Array<any> = [
    {
      code: '210301',
      desc: '查询无此记录'
    },
    {
      code: '210304',
      desc: '参数异常'
    },
    {
      code: '210305',
      desc: '服务商网络异常，请重试'
    },
    {
      code: '210306',
      desc: '数据源异常'
    },
    {
      code: '210307',
      desc: 'sign检验失败'
    },
    {
      code: '210308',
      desc: '订单号格式错误'
    },
    {
      code: '210309',
      desc: '用户订单号重复'
    },
  ]
  errCodeData2: Array<any> = [
    {
      code: '10001',
      desc: '查询无此记录',
      old: '101'
    },
    {
      code: '10001',
      desc: '参数异常',
      old: '101',
      point: '被标红的信息：(调用充值类业务时，请务必联系客服或通过订单查询接口检测订单，避免造成损失)'

    },
    {
      code: '10001',
      desc: '服务商网络异常，请重试',
      old: '101'

    },
    {
      code: '10001',
      desc: '数据源异常',
      old: '101'

    },
    {
      code: '10001',
      desc: 'sign检验失败',
      old: '101'

    },
    {
      code: '10001',
      desc: '订单号格式错误',
      old: '101'

    },
    {
      code: '10001',
      desc: '用户订单号重复',
      old: '101'

    },
  ]


  // 示例代码
  sampleCodeData: Array<any> = [
    {
      name: 'Java:',
      title: '	基于聚合数据的身份证实名认证API接口调用示例-Java版',
      provide: '	SDK社区',
      time: '2020-10-14 10:53:19'
    },
    {
      name: 'PHP:',
      title: '	基于聚合数据的身份证实名认证API接口调用示例-Java版',
      provide: '	SDK社区',
      time: '2020-10-14 10:53:19'
    }

  ]
  sampleCodeData2: Array<any> = [
    {
      name: '常见问题:',
      desc: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error'
    }

  ]
  // 联系我们
  contactData: Array<any> = [
    {
      name: '售前咨询①:',
      desc: '0512-88869195'
    },
    {
      name: '客服热线:',
      desc: '400-822-7715'
    },
    {
      name: '在线客服QQ:',
      desc: '800076065',
      url: ''
    },
    {
      name: '接口测试:',
      desc: 'API测试工具',
      url: ''
    },
    {
      name: '技术支持:',
      desc: 'info@juhe.cn'
    }
  ]

  data = [
    {
      img: 'assets/img/api/note.png',
      title: '短信API服务',
      desc: '三网合一短信通道，验证证'
    },
    {
      img: 'assets/img/api/bankcard.png',
      title: '银行卡四元素校验',
      desc: '检测输入的姓名、手机号号'
    },
    {
      img: 'assets/img/api/idcard.png',
      title: '身份证查询',
      desc: '身份证归属地信息查询'
    },
    {
      img: 'assets/img/api/OCR.png',
      title: '身份证OCR识别',
      desc: '支持对二代居民身份证正面'
    },
    {
      img: 'assets/img/api/mobile_auth.png',
      title: '三网手机实名制认证',
      desc: '支持移动、联通号码；检测'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log(this.docMenu);

  }
  changeRadio(type) {
    this.checkedType = type;
  }
  menuChange(selected) {
    console.log(this.docMenu);

    this.docMenu = selected;
  }
  loading = false;


}
