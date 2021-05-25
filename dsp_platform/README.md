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
1.0.0 广告投放平台
1.0.1 广告投放平台 - 保留之前登录
1.0.2 涉及到伪登录，需要和代理商平台同步（备份时间：2021/1/18, 已合并到1.1.0）
*****1.2.0 （先前错误分支，已合并到1.0.2. 已删除本地和远程分支）ps: 1.0.2上线后删除此条记录（2021.1.21已删除此条记录）
1.1.0 RTA需求（创建时间: 2021/1/18日；2021.1.21已合并到主线）
1.2.0 新建广告单元添加人群定向（创建时间： 2021/2/23, 已合并到主线）
1.2.1 双文双图 添加应用icon和推广产品名称（创建时间： 2021/3/1, 已合并到主线）
1.2.2 曝光和点击链接分别可增加多个，最多10个（创建时间： 2021/3/3, 已合并到主线）
1.2.3 批量创建创意（创建时间： 2021/3/4已于2021/3/5上线，后又修改添加上传图片名称，已并到主线）
1.2.4 数据报表-效果数据-增加自定义列(创建时间: 2021/3/9, 3.10已并到主线)
1.2.5 批量创建创意, 素材尺寸根据广告单元关联的广告位尺寸(创建时间: 2021/3/9, 3月15日已上线)
1.2.6 插屏-横/横竖版增加标题描述字段 (创建时间: 2021/3/17, 上线时间3/17)
1.2.7 广告位数据下载日报表 (创建时间: 2021/4/14, 上线时间4/14)
1.3.0 素材库 (创建时间: 2021/3/19, 已上线)
1.3.1 复制广告 (创建时间: 2021/4/20, 已上线)
1.4.0 一键加群/拨打电话/SDK配置 (创建时间: 2021/5/14， 2021/5/24 合并到主线)



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
