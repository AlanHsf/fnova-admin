
# 竞品资料
- https://720yun.com/tool

# 破解依赖引入 1.19-pr6

# JS依赖引入 1.20 官方
- 嵌入JS步骤：https://krpano.com/docu/html/#top

```
# 下载官方库
curl https://krpano.com/download/download.php?file=krpano1209linux64&server=krp -o krpanolinux.tar.gz

# 解压官方库
tar krpanolinux.tar.gz
cd krpanolinux
pwd

# 设置环境变量
export KRPATH=/home/ryan/workspace/vrpano/krpano

# 更新静态资源
cd src/assets/js/krpano/
cp $KRPATH/viewer/krpano.* .
cp -r $KRPATH/viewer/plugins .

# 所有krpano名称改成tour

```

# 参考资料