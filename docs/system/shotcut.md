

# electron globalShutcut
- 可以禁止 F11
- 可以添加其他快捷键事件
- 不能禁止系统已有快捷键
    - Alt+F4

# on close
alt+f4是无法屏蔽的，可以在主进程中的close事件中如下处理

``` js
let canQuit = false;
mainWindow.on('close', e => {
    if（!canQuit）e.preventDefault()//阻止关闭
})
```

# 注册表层禁用
- https://github.com/Mad-hu/ScreenLock
- https://github.com/MarshallOfSound/node-lowlevel-keyboard-hook-win