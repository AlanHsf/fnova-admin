# C++插件之屏蔽系统控制快捷键

# Nodejs的C++插件实现路径
``` sh
# nodejs
npm -v
node -v

# node-gyp
sudo npm install -g node-gyp

# node-addon-api
## https://www.npmjs.com/package/node-addon-api

# gcc compile depends
sudo apt-get install gcc-multilib g++-multilib

```

# Windows下编译lockScreen.node
npm install 
npm install --arch=ia32 

# Linux下编译
- 注意：node-gyp 暂时不支持跨平台编译 https://github.com/nodejs/node-gyp/issues/829
- 参考：https://arrayfire.com/blog/cross-compile-to-windows-from-linux/?msclkid=0831ddcfb29c11ecbcbd288e1105fc3f

``` sh
sudo apt-get install mingw-w64
# C
i686-w64-mingw32-gcc hello.c -o hello32.exe      # 32-bit
x86_64-w64-mingw32-gcc hello.c -o hello64.exe    # 64-bit

# C++ /usr/lib/gcc/x86_64-w64-mingw32/
i686-w64-mingw32-g++ hello.cc -o hello32.exe     # 32-bit
x86_64-w64-mingw32-g++ hello.cc -o hello64.exe   # 64-bit

# 修改build/Makefile的host设置
CC.host ?= i686-w64-mingw32-gcc
CXX.host ?= i686-w64-mingw32-g++
```

# 参考文档
- https://docs.microsoft.com/en-us/windows/win32/learnwin32/keyboard-input?msclkid=8380fd21b71f11ecb722fca705c2e4eb