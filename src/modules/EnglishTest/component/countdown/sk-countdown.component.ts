import { formatDate } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";
// import { deadline, } from "../types/typings"

@Component({
  selector: "sk-countdown",
  template: `
    <div class="sk-countdown">
    <div class="sk-countdown-content">
      <div class="number">
        {{text}}
      </div>
    </div>
    </div>
  `,
  styleUrls: ["./countdown.component.scss"],
})


export class SkCountDownComponent {
  @Input("value") deadline: Date;
  @Output() update = new EventEmitter<any>();
  @Output() countdownFinish = new EventEmitter<any>();
  get value() {
    return this.deadline
  };
  set value(v: any) {
    console.log('______', v)
    let value = new Date(v).getTime()
    let now = new Date().getTime()
    let remain = value - now;
    console.log(remain);

    // let deadline = this.countdown(remain)
    // console.log(deadline);
  }
  constructor() {
    console.log(this.deadline);
  }
  timer;
  text;
  ngOnInit() {
    console.log(this.deadline);
    let deadline = this.deadline.getTime()
    // let deadline = new Date("2022-2-22 17:10").getTime()
    let that = this;
    this.timer = setInterval(() => {
      let now = new Date().getTime()
      let remain = deadline - now;// 剩余时间   毫秒数
      // console.log(deadline, now, remain);
      //定义变量 d,h,m,s保存倒计时的时间
      let d, h, m, s;
      if (remain >= 0) {

        // d = Math.floor(remain / 1000 / 60 / 60 / 24);
        // h = Math.floor(remain / 1000 / 60 / 60 % 24);
        h = Math.floor(remain / 1000 / 60 / 60);
        m = Math.floor(remain / 1000 / 60 % 60);
        s = Math.floor(remain / 1000 % 60);
        that.text = that.showNum(h) + ":" + that.showNum(m) + ":" + that.showNum(s);
        // console.log(that.showNum(h), that.showNum(m), that.showNum(s));
        if (h == 0 && m == 5 && s == 0) {
          console.log(that.showNum(h), that.showNum(m), that.showNum(s));;
        }
        if (h == 0 && m == 0 && s == 0) {
          console.log('000');
          clearInterval(that.timer); //清掉定时器
          this.countdownFinish.emit()
        }
        this.update.emit({ h, m, s })
      } else {
        that.text = "00:00:00"
        console.log('clear');
        clearInterval(that.timer); //为负数时清掉定时器
      }
    }, 1000);
  }

  // countdown(time) {
  //   if (time > 0) {
  //     setTimeout(function () {
  //       // 放在最后--
  //       time -= 10;
  //       this.countdown(time);
  //       console.log(time);

  //     }, 10);
  //     return this.show(time)
  //   } else {
  //     return null;
  //   }

  // }


  countdown() {
    let deadline = new Date("2022-2-23 17:47").getTime()
    let now = new Date().getTime()
    let remain = deadline - now;// 剩余时间   毫秒数
    console.log(deadline, now, remain);
    // let s = parseInt(remain / 1000);// 毫秒转换为秒
    // let m = s / 60
    // let h = m / 60
    // console.log(h, m, s);
    // let S = parseInt(s - (h * 60 * 60 - m * 60))
    // let M = parseInt(s - (h * 60 * 60))
    // console.log(h, M, S);
    // console.log(showNum(h) + showNum(M) + showNum(S));
    // return showNum(h) + showNum(M) + showNum(S)

    //定义变量 d,h,m,s保存倒计时的时间
    let d, h, m, s;
    if (remain >= 0) {
      // d = Math.floor(remain / 1000 / 60 / 60 / 24);
      // h = Math.floor(remain / 1000 / 60 / 60 % 24);
      h = Math.floor(remain / 1000 / 60 / 60);
      m = Math.floor(remain / 1000 / 60 % 60);
      s = Math.floor(remain / 1000 % 60);
      console.log(this.showNum(h), this.showNum(m), this.showNum(s));
    } else {
      clearInterval(this.timer); //为负数时清掉定时器
    }
  }
  //封装一个处理单位数字的函数
  showNum(remain) {
    if (remain < 10) {
      return "0" + remain
    }
    return remain
  }


}
