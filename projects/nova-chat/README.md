

# Depands
``` sh
cnpm i -S @ngrx/store@10
cnpm i -S @ngrx/effects@10
cnpm i -S ngx-perfect-scrollbar
cnpm i -S @angularclass/hmr
cnpm i -S downloadjs
cnpm i -S jpush-ui@0.0.1
cnpm i -S clipboard
cnpm i -S push.js
```

# @ngrx版本问题
- ngrx13 angular13
- ngrx10 angular10

``` sh
The Angular and NgRx versions aren't compatible. NgRx 13 uses TypeScript features that aren't available on TS v4.0.x

You'll have to downgrade NgRx to v11, or Angular to v13 (to keep the versions compatible).
```

## rxjs新版写法
``` js
// 原写法
this.actions$
    .ofType(loginAction.login),
    .map(result => (result as any).payload),
    .switchMap(async (val:any) => {})
// 新写法（管道处理函数包含在pipe内）
this.actions$
    .pipe(
        ofType(loginAction.login),
        map(result => (result as any).payload),
        switchMap(async (val:any) => {})
    )
```

## toPayload函数替换
``` js
// 原管道（toPayload默认移除，需要手写）
map(toPayload),
// 替换结果
map(result => (result as any).payload),
```

## Object is not extenable
```
    let newdata = JSON.parse(JSON.stringify(olddata)); // 去除object属性保护
```