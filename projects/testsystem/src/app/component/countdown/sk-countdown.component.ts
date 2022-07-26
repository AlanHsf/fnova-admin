import { formatDate } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "exam-sk-countdown",
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
  @Input("timer") timing: number;
  @Output() update = new EventEmitter<any>();
  @Output() countdownFinish = new EventEmitter<any>();
  @Output() timingTrigger = new EventEmitter<any>();
  get value() {
    return this.deadline
  };
  set value(v: any) {
    console.log('______', v)
    let value = new Date(v).getTime()
    let now = new Date().getTime()
    let remain = value - now;
    console.log(remain);
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
    let oldTime;
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
        s = Math.floor(remain / 1000 % 60);// 毫秒转换为秒
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
        this.update.emit({ format: { h, m, s }, timestamp: remain })
        // 倒计时进行时，定时触发
        if (!oldTime) oldTime = now;
        if (now - oldTime > this.timing * 1000) {
          oldTime = now
          this.timingTrigger.emit({ format: { h, m, s }, timestamp: now })
        }
      } else {
        that.text = "00:00:00"
        console.log('clear');
        clearInterval(that.timer); //为负数时清掉定时器
      }
    }, 1000);
  }
  //处理单位数字
  showNum(remain) {
    if (remain < 10) {
      return "0" + remain
    }
    return remain
  }
  ngOnDestroy() {
    clearInterval(this.timer); //组件销毁时清掉定时器
  }

}
