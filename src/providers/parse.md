# 如何更新Parse库的描述文档？
- 下载最新parse.min.js
    - https://github.com/parse-community/Parse-SDK-JS/releases
- 下载最新@types/parse
    - https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/parse

# 添加@types/parse遗漏描述
- User/logInWith 用于第三方登陆
``` js
        static logInWith(provider, options): Promise<User>;
```