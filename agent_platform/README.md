# vue_media

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

```bash
# 版本号文件说明
1.0.0  代理商平台（2021/1/18再次记录，初始化代理商平台，已合并到1.1.0）
1.1.0  RTA需求（创建时间: 2021/1/18日； 2021.1.21已合并到主线）

```


===========

```bash

// 常用命令

git branch 1.2.0 // 打分支
git checkout 1.2.0 // 切换到分支
git checkout master // 切换到主线
git merge 1.2.0 // 主线合并分支

git push origin :2.1.0// 删除远程分支
git branch -d 2.1.1 // 删除本地分支
git branch -r // 查看远程分支
git branch -f master // 强制切换到主线
git branch // 查看本地分支


// 版本回滚

在当前branch上多次commit代码并且push后，发现不符合要求，需要回滚到特定的版本。步骤如下：
1、 git log           //查找commitId
2、 git reset --hard c503cffa099332911d4fce2fc1399cb4bc3ba9d6
3、 此时本地文件已经回滚，但是服务器仍然没有改变，需要继续远程回滚
    git push -f

此时如果有人获取了更新的版本，可能拉去不下来，执行以下操作：
git fetch --all
git reset --hard origin/branchname

```