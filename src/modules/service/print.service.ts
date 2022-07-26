import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/*
* 接收参数：
* @params documentTitle iframe网页标题
* @params style 传入样式
* @params printdom 待打印元素 打印内容样式应独立于该元素之外设置
* @params develop 调试状态 为true时显示、不销毁iframe
*/
export class PrintService {

  constructor() { }

  Print(config) {
    // Promise 确保打印行为触发或取消后再执行下一步
    return new Promise((resolve, reject) => {
      let printdom = config.printdom;
      /* iframe网页标题 即打印时页眉处标题 */
      let documentTitle = config.documentTitle;
      /* 传入样式 */
      let customStyle = config.style;
      /* 是否处于调试状态 */
      let develop = config.develop;
      /* 待打印元素 */
      let printDom = document.getElementById(printdom);
      /* 创建iframe 组装内容*/
      let printFrame = document.createElement("iframe");

      /* 是否获取全局样式  */
      let global = config.global;
      /* 拼接iframe元素  给iframe设置title、style样式 */
      /* 为iframe设置网页标题 */
      if (documentTitle) {
        printFrame.srcdoc = "<html><head><title>" + documentTitle + "</title>";
      }
      //  printFrame.srcdoc += `<link  href="./grade-passcert.scss" media="all">`; //添加rel="stylesheet" 报错不符合
      /* 在iframe中添加样式
         获取待打印元素所在页面自定义style样式
         1、获取所有style标签元素 获取head标签内子元素长度
         2、获取当前angular页面的唯一性id标识 如：_ngcontent-ulc-c559（
            angular组件每次生成拥有的唯一性标识，挂载到页面的样式类也会携带该标识，限制作用于该组件）
            angular中该唯一标识位于组件元素的第一位，所以通过dom元素的getAttributeNames()方法获取元素属性数组第一位
         3、head标签子元素长度作为遍历次数（不知道怎么获取style标签元素个数，只能先用这个替代），遍历每个style标签，
         当style标签的输出文本中存在该页面的唯一标识时，即该style标签设置的style属性为该页面设置的对应属性。添加到iframe的style样式中
      */
      let collect = document.getElementsByTagName("style");
      let length = document.querySelector("head").children.length;
      let componentId = printDom.getAttributeNames()[0]
      console.log(componentId)
      for (let index = 0; index < length; index++) {
        let style = collect.item(index);
        if (global) {
          if (style && style.innerHTML) {
            /* **** 注意事项 ****
              需打印元素的样式不要依赖元素父元素设置
              即.page-container .passcert{} 这种形式会导致样式失效  因为iframe中没有page-container元素
              style标签中设置属性media="print" 无效  需将样式包裹在@media print {}中
            */
            printFrame.srcdoc += `<style >@media print {${style.innerHTML} ${customStyle}}${style.innerHTML} ${customStyle}</style>`;
          }
        } else {
          if (style && style.innerHTML.indexOf(componentId) != -1) {
            printFrame.srcdoc += `<style >@media print {${style.innerHTML} ${customStyle}}${style.innerHTML} ${customStyle}</style>`;
          }
        }


      }
      printFrame.srcdoc += "</head><body></body></html>";
      /* 设置iframe属性，使iframe内容在页面不可见 */
      if (develop) {
        printFrame.setAttribute("frameborder", "1");
        printFrame.setAttribute("height", "1200");
        printFrame.setAttribute("width", "1200");
      } else {
        printFrame.setAttribute("frameborder", "0");
        printFrame.setAttribute("height", "0");
        printFrame.setAttribute("width", "0");
      }


      /* iframe添加到当前页面 */
      document.body.appendChild(printFrame);
      let _this = this;
      printFrame.onload = () => {
        /* 待打印元素渲染到iframe中 */
        printFrame.contentWindow.document.body.innerHTML = printDom.innerHTML;
        let frame = printFrame.contentWindow;
        frame.focus()
        /* 调起iframe窗口打印 打印后清除iframe元素*/
        setTimeout(function () {
          try {
            printFrame.contentWindow.document.execCommand("print", false, null);
            if (!develop) {
              _this.clearIframe(printFrame);
            }
            resolve(true)
          } catch {
            printFrame.contentWindow.print();
            if (!develop) {
              _this.clearIframe(printFrame);
            }
            resolve(true)
          }
        }, 100)
      };
    })

  }
  // 清除iframe内存空间
  clearIframe(el) {
    var _iframe = el.contentWindow;
    if (el) {
      el.src = "about:blank";
      try {
        _iframe.document.write("");
        _iframe.document.clear();
      } catch (e) {
        console.log(e);
      }
      document.body.removeChild(el);
    }
  }
}
