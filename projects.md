默认分支master
添加分支bofang
bofang分支内连接本仓库和博方单独仓库两个远程仓库
origin =>  nova-admin
bofang => subproject-test

## 切换分支到bofang

git checkout bofang


## 代码下拉

git pull <远程主机名> <远程分支名>:<本地分支名>


该分支内容修改后上传到nova-admin

git pull origin bofang

上传到博方单独仓库

git pull  bofang bofang:master


## 代码上传

git push <远程主机名> <本地分支名>:<远程分支名>

该分支内容修改后上传到nova-admin

git push origin bofang

上传到博方单独仓库

git push  bofang bofang:master

