<template>
    <div class="page-main">
        <Card dis-hover :bordered="false">
            <div class="page-detail-title clearfix">
                <h2>{{headTitle}}</h2>
                <div class="is-handler">
                    <Button class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
                </div>
            </div>
            <div class="edit-content-card">
                <div class="detail-list">
                    <div class="title-line-tag">
                        <h4>基本信息</h4>
                    </div>
                    <ul>
                        <li>
                            <div class="label">转化ID:</div>
                            <div class="value">214321421</div>
                        </li>
                        <li>
                            <div class="label">跟踪方式:</div>
                            <div class="value">线索跟踪</div>
                        </li>
                        <li>
                            <div class="label">站点链接:</div>
                            <div class="value">http://3471.3241.4134</div>
                        </li>
                        <li>
                            <div class="label">转化目标:</div>
                            <div class="value">页面访问</div>
                        </li>
                        <li>
                            <div class="label">备注:</div>
                            <div class="value">我是备注文案我是备注文案我是备注文案我是备注文案我是备注文案</div>
                        </li>
                        <li>
                            <div class="label">创建时间:</div>
                            <div class="value">2019-11-10</div>
                        </li>
                        <li>
                            <div class="label">全部关联广告单元:</div>
                            <div class="value">2</div>
                        </li>
                        <li>
                            <div class="label">在投关联广告活动:</div>
                            <div class="value">2</div>
                        </li>
                    </ul>
                </div>

                <div class="detail-code">
                    <div class="title-line-tag">
                        <h4>安装代码</h4>
                        <span class="see-doc">查看说明文档</span>
                    </div>
                    <div class="code-item">
                        <h6>基础代码<span>(基础代码复制并粘贴到网址代码的<em v-text="'<head>'"></em>和<em v-text="'</head>'"></em>之间)</span></h6>
                        <p class="code" v-text="scriptTxt"></p>
                    </div>
                    <div class="code-item">
                        <h6>转化代码<span>(转化代码复制后添加到相应的目标上)</span></h6>
                        <Table stripe border :columns="columns" :data="columnsData"></Table>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
import { showTitle } from '@/libs/util'
import { inPageAccess } from '@/mixin/in-page-access.js'

export default {
    name: 'appEdit',
    mixins: [inPageAccess],
    data() {
        return {
            scriptTxt: '<script type="text/javascript" smum="si=10045&src=13" src="http://www.wjxcdn.com/tools/smum.js',
            columns: [
                {
                    title: '转化目标',
                    key: 'target',
                    width: 120,
                },
                {
                    title: '转化代码',
                    key: 'code'
                }
            ],
            columnsData: [
                {
                    target: '页面访问',
                    code: '_SMUM_.f.r("view")'
                },
                {
                    target: '电话拨打',
                    code: '_SMUM_.f.r("call")'
                }
            ]
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    created() {
        
    },
    methods: {
        
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.title-line-tag
    line-height: 30px
    h4
        display: inline-block
    .see-doc
        cursor: pointer
        margin-left: 10px
        display: inline-block
        color: #465CFE
.detail-list
    ul
        margin-top: 10px
        list-style-type: none
        font-size: 0px
        li
            display: inline-block
            width: 50%
            line-height: 2
            .label
                display: inline-block
                width: 20%
                color: #999
                font-size: 14px
            .value
                display: inline-block
                width: 80%
                font-size: 14px
.detail-code
    margin-top: 20px
    padding-top: 20px
    border-top: 1px solid #F2F2F2
    .code-item
        margin-top: 10px
        h6
            margin-bottom: 8px
            font-weight: normal
            font-size: 14px
            span
                color: #999
                margin-left: 14px
    .code
        margin: 4px 0
        padding: 8px 10px
        background-color: #FAFAFA
        border: 1px solid #EBEBEB
</style>
