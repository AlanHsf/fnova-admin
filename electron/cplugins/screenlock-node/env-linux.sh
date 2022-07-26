#!/bin/sh
# 测试没用，还是必须在Windows环境编译
# export CC=arm-linux-gnueabihf-gcc
# export CXX=arm-linux-gnueabihf-g++
export CC_host="i686-w64-mingw32-gcc"
export CXX_host="i686-w64-mingw32-g++"
export CC=/usr/bin/i686-w64-mingw32-gcc
export CXX=/usr/bin/i686-w64-mingw32-g++
export GYP_DEFINES=OS=win
export CFLAGS=-fpermissive
export CXXFLAGS=-fpermissive