// 转化rem单位
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 750) {
              docEl.style.fontSize = '100px';
            } else {
              docEl.style.fontSize = 100 * (clientWidth / 75000) + 'px';
            }
            var html = document.getElementsByTagName('html')[0]
            var settingFs = parseInt(100 * (clientWidth / 75000))
            var settedFs = settingFs
            var whileCount = 0
            while (true) {
              var realFs = parseInt(window.getComputedStyle(html).fontSize)
              var delta = realFs - settedFs
              // 不相等
              if (Math.abs(delta) >= 1) {
                if (delta > 0) {
                  settingFs--
                } else {
                  settingFs++
                }
                html.setAttribute('style', 'font-size:' + settingFs + 'px!important')
              } else {
                break
              }
              if (whileCount++ > 100) {
                break
              }
            }
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);