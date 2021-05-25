<template>
    <div class="page-main">
        <div class="page-title page-has-line">
            <h2 class="title-line-tag">{{headTitle}}</h2>
            <h6 class="title-small-tips">录入创意中的落地页或唤醒链接，为数据导入做映射关系</h6>
            <div class="is-handler">
                <Button type="text" @click="downStatement" :loading="submitClock" class="has-img-icon" v-if="_isShow_('download')">
                    <i class="iconfont icon-download"></i>
                    <span>{{!submitClock ? '下载' : '下载中...'}}</span>
                </Button>

                <Button class="has-img-icon" type="text" @click="drawModalFlag = true" v-if="_isShow_('export')">
                    <i class="batch-add is-handler-icon"></i>
                    <span>批量导入</span>
                </Button>
            </div>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="search-line">
                
                <Select
                    class="i-margin-right-11 i-width-select mar-bot-10"
                    v-model="filterSearch.is_in_use"
                    clearable
                    :transfer="true"
                    placeholder="使用情况">
                        <Option v-for="item in usedSelect" :key="item.value" :value="item.value" >{{ item.label }}</Option>
                </Select>

                <Input type="text" class="i-margin-right-11 i-width-textarea mar-bot-10" clearable v-model.trim="filterSearch.search_text" placeholder="输入落地页链接/deeplink/universal link查询"/>

                <Input type="textarea" v-model.trim="filterSearch.code_textarea" class="i-margin-right-11 i-width-textarea mar-bot-10" clearable :rows="1" :autosize="{maxRows:1, minRows: 1}" placeholder="输入链接ID, 多个用逗号隔开"/>

                <Button class="search" @click="doFilterList">查询</Button>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText">
                    <!-- 使用 -->
                    <template slot-scope="{ row }" slot="deleted_at">
                        {{!!row.ad_id_arr ? '是' : '否'}}
                    </template>
                    <!-- 广告ID -->
                    <template slot-scope="{ row }" slot="ad_id_arr">
                        <p class="line5-overscroll" v-if="row.ad_id_arr" v-html="row.ad_id_arr"></p>
                        <p v-else>-</p>
                    </template>
                    <!-- 落地页链接 -->
                    <template slot-scope="{ row }" slot="h5link">
                        <div class="flex-row" v-if="row.h5link">
                            <p class="text-row-ellipsis" :title="row.h5link">{{row.h5link}}</p>
                            <i class="iconfont icon-copy copy-content" title="复制链接" :data-clipboard-text="row.h5link" @click="copyContent"></i>
                        </div>
                    </template>
                    <!-- deeplink -->
                    <template slot-scope="{ row }" slot="deeplink">
                        <div class="flex-row" v-if="row.deeplink">
                            <p class="text-row-ellipsis" :title="row.deeplink">{{row.deeplink}}</p>
                            <i class="iconfont icon-copy copy-content" title="复制链接" :data-clipboard-text="row.deeplink" @click="copyContent"></i>
                        </div>
                    </template>
                    <!-- universal link -->
                    <template slot-scope="{ row }" slot="universal_link">
                        <div class="flex-row" v-if="row.universal_link">
                            <p class="text-row-ellipsis" :title="row.universal_link">{{row.universal_link}}</p>
                            <i class="iconfont icon-copy copy-content" title="复制链接" :data-clipboard-text="row.universal_link" @click="copyContent"></i>
                        </div>
                    </template>
                    <!-- 操作时间 -->
                    <template slot-scope="{ row }" slot="created_at">
                        {{row.created_at | timeFormat('yyyy-MM-dd HH:mm:ss')}}
                    </template>
                    <!--操作-->
                    <template slot-scope="{ row, index }" slot="handle">
                        <Button type="text" @click="doDelete(row)" v-if="_isShow_('delete')">删除</Button>
                    </template>
                </Table>
                <div class="page-center">
                    <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
                </div>
            </div>
        </Card>

        <!-- 批量新建广告位 -->
        <Drawer v-model="drawModalFlag" width="600" :mask-closable="false" :closable="false" :styles="drawStyles" class="custom-drawer">
            <div slot="header" class="draw-header clearfix">
                <div class="draw-header-title fl">
                    <h3>导入链接</h3>
                </div>
                <div class="draw-header-img fr">
                    <img src="~@/assets/image/colsImg.png">
                </div>
            </div>
            <Form ref="exportForm" :label-width="60" :label-colon="true">
                <div class="down-export">
                    <span>导入模板</span>
                    <a download target="_blank" :href="`${this.$xlsAPIUrl}/%E9%93%BE%E6%8E%A5%E5%BD%95%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx`">
                        <icon class="iconfont icon-download"/>
                    </a>
                </div>
                <FormItem label="文件" prop="file" class="ivu-form-item-required">
                    <Upload
                        :action="actionUrl"
                        type="drag"
                        :show-upload-list="false"
                        :format="['csv','xlsx','xls']"
                        :on-format-error="handleFormatError"
                        :before-upload="handleBeforUpload"
                        :max-size="10*1024"
                    >
                        <div class="upload-inner">
                            <div class="icon-box">
                                <icon class="iconfont icon-upload-cloud"/>
                            </div>
                            <div class="upload-txt">
                                <div class="handle-text">将文件拖到此处，或<span>点击上传</span></div>
                                <div class="format-text">请将应用信息填写到文件模板里，切勿修改内部格式，文件大小不超过10M。</div>
                            </div>
                        </div>
                    </Upload>
                </FormItem>
                <FormItem>
                    {{filename}}
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button @click="cancleExport">取消</Button>
                <Button type="primary" :loading="submitClock" @click="uploadPublic()">
                    {{!submitClock ? '确定' : '提交中...'}}
                </Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
import { showTitle, filterBatchQuery } from '@/libs/util'
import { createObjectURL, formatDate } from '@/libs/tools'
import { getIncomeKv, getIncomeKvUrl, addIncomeKv, addIncomeKvUrl, delIncomeKv } from '@/api/income'
import { inPageAccess } from '@/mixin/in-page-access.js'
import { getDownLoadXls } from '@/api/common'
import Clipboard from 'clipboard'

export default {
    mixins: [inPageAccess],
    data() {
        return {
            pageSize: 10, // 页码长度
            total_count: 0,
            currentPage: 1,
            colDatList: [], // table数据
            tableLoadFlag: false, // table的loading
            noDataText: this.$config.noDataText,

            usedSelect: [ // 筛选的下拉
                {
                    value: 1,
                    label: '是'
                },
                {
                    value: 0,
                    label: '否'
                }
            ],
            filterSearch: { // 筛选条件
                is_in_use: undefined, // 是否使用广告ID
                search_text: '', // 落地页链接
                code: [], // 落地页链接ID
                code_textarea: null
            },
            tableColList: [ // 表格header
                {
                    title: '编号',
                    key: 'id',
                    width: 50
                },
                {
                    title: '链接ID',
                    key: 'code',
                    width: 100
                },
                {
                    title: '使用',
                    slot: 'deleted_at', // 临时暂用deleted_at字段
                    width: 50
                },
                {
                    title: '广告ID',
                    slot: 'ad_id_arr'
                },
                {
                    title: '落地页链接',
                    slot: 'h5link'
                },
                {
                    title: 'deeplink',
                    slot: 'deeplink'
                },
                {
                    title: 'universal link',
                    slot: 'universal_link'
                },
                {
                    title: '操作时间',
                    slot: 'created_at',
                    width: 170
                },
                {
                    title: '操作人',
                    key: 'username',
                    width: 150
                },
                {
                    title: '操作',
                    width: 60,
                    slot: 'handle'
                }
            ],
            actionUrl: addIncomeKvUrl, // url导入链接地址
            drawModalFlag: false, // 上传
            submitClock: false,
            uploadList: [], // 上传的文件
            filename: '',
            drawStyles: { // 抽屉样式
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '54px',
                position: 'static'
            }
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    created() {
        if (this._hasPageAccess()) {
            this.getIncomeKv() // 获取表格数据
        }
    },
    filters: {
        timeFormat(time, format) {
            return formatDate(time * 1000, format)
        }
    },
    methods: {
        /**
         * [getFinanceList 获取列表的信息]
         * @return {[type]} [description]
         */
        getIncomeKv() {
            this.tableLoadFlag = true

            let params = {
                ...this.getAxiosParams(),
                ...{
                    page_size: this.pageSize,
                    page_num: this.currentPage
                }
            }

            getIncomeKv(params).then(res => {
                this.tableLoadFlag = false
                if (res.code === 200) {
                    this.colDatList = res.data.list
                    this.total_count = res.data.total_count
                } else if (res.code === 403) {
                    this.noDataText = this.$config.noDataTextPer
                }
            }, err => {
                if (err.code === 403) {
                    this.noDataText = this.$config.noDataTextPer
                }
                this.tableLoadFlag = false
            })
        },
        /**
         * [getAxiosParams 获取下载和列表的url参数]
         * @return {[type]} [description]
        */
        getAxiosParams() {
            let _filter = this.filterSearch

            let params = {}

            // 使用情况
            _filter.is_in_use !== undefined && (params.is_in_use = _filter.is_in_use === 1 ? true : false)

            // 链接ID
            !!_filter.code.length && (params.code = _filter.code)

            // 落地页链接
            !!_filter.search_text && (params.search_text = _filter.search_text)

            return params
        },
        /**
         * [downStatement 下载广告位]
         * @return {[type]} [description]
         */
        downStatement() {

            let kvParams = this.getAxiosParams()
            kvParams.page_num = 1

            let params = {
                method: 'GET',
                url: getIncomeKvUrl(kvParams)
            }

            this.submitClock = true

            getDownLoadXls(params).then(res => {
                if (res.code === 200) {
                    let filename = '链接录入数据.xlsx'
                    createObjectURL(res.data.url, filename)
                }

                this.submitClock = false
            }, err => {
                this.submitClock = false
            })
        },
        /**
         * [doFilterList 筛选查询]
         * @return {[type]} [description]
         */
        doFilterList(val) {
            this.currentPage = 1

            let _filter = this.filterSearch

            _filter.code = filterBatchQuery({value: _filter.code_textarea})

            this.getIncomeKv()
        },
        /**
         * [pageNumberChange 修改页码]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        pageNumberChange(val) {
            this.currentPage = val
            this.getIncomeKv()
        },
        /**
         * [pageSizeChange 切换每页条数时的回调]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        pageSizeChange(size) {
            this.pageSize = size
            this.getIncomeKv()
        },
        /**
         * [doDelete 删除]
         * @return {[type]} [description]
         */
        doDelete(row) {
            if (!row.id) {
                return
            }
            
            this.$Modal.confirm({
                title: '确认删除？',
                onOk: () => {
                    delIncomeKv({
                        id: row.id
                    }).then(res => {
                        if (res.code === 200) {
                            this.getIncomeKv()
                        }
                    })
                }
            })
        },
        /**
         * [copyContent 赋值粘贴]
         * @return {[type]} [description]
         */
        copyContent() {
            let clipboard = new Clipboard('.copy-content')
            clipboard.on('success', e => {
                this.$Message.success('复制成功')
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                this.$Message.success('该浏览器不支持自动复制')
                // 释放内存
                clipboard.destroy()
            })
        },

        /********************************************
        *↓↓↓↓↓↓↓↓↓ 以下为批量上传 start *↓↓↓↓↓↓↓
        ********************************************/
        /**
         * [cancleExport 取消导入]
         * @return {[type]} [description]
         */
        cancleExport() {
            this.resetDraw()
        },
        /**
         * [handleFormatError 格式校验]
         * @param  {[type]} file [description]
         * @return {[type]}      [description]
         */
        handleFormatError(file) {
            this.$Message.error({
                content: '不支持此文件类型',
                duration: 3
            })
            this.$Spin.hide()
        },
        /**
         * [handleBeforUpload 上传前的判断 文件大小校验]
         * @param  {[type]} file [description]
         * @return {[type]}      [description]
         */
        handleBeforUpload(file) {
            this.uploadList = []
            if (file && file.size > (10 * 1024 * 1024)) {
                this.$Message.warning('文件不能大于' + 10 + 'M')
                return false
            } else {
                this.uploadList.push(file)
                this.filename = file.name
                return false
            }
        },
        /**
         * [uploadPublic 确定上传]
         * @return {[type]} [description]
         */
        uploadPublic() {
            if (this.uploadList.length === 0) {
                this.$Message.error('请上传文件')
                return false
            } else {
                this.upload()
            }
        },
        /**
         * [upload 上传]
         * @return {[type]} [description]
         */
        upload() {
            this.submitClock = true

            let formData = new FormData()
            formData.append('file', this.uploadList[0])

            addIncomeKv(formData).then(res=> {
                if (res.code === 200) {
                    this.$Message.success('上传成功')
                    this.getIncomeKv()
                } else if (res.code === 405) {
                    this.$Modal.confirm({
                        width: 600,
                        title: '错误提示',
                        content: res.msg.replace(/;/g, '<br />'),
                        onOk: () => {
                            this.getIncomeKv()
                        }
                    })
                } else {
                    this.$Message.error({ content: res.msg, duration: 3})
                }

                this.resetDraw()
            }, err => {
                this.resetDraw()
            })
        },
        /**
         * [resetDraw 重置数据]
         * @return {[type]} [description]
         */
        resetDraw() {
            this.drawModalFlag = false
            this.uploadList = []
            this.filename = ''
            this.submitClock = false
        }
        /********************************************
        *↑↑↑↑↑↑↑↑↑↑ 以下为批量上传 end *↑↑↑↑↑↑↑
        ********************************************/
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.flex-row
    display: flex
    align-items: center
    justify-content: space-between
    .iconfont
        flex: 0 0 20px
        height: 16px
        width: 20px
        text-align: right
        color: #4083F8
        cursor: pointer
</style>
