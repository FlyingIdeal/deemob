<template>
    <div class="page-main">
        <div class="page-title page-has-line">
            <h2 class="title-line-tag">{{headTitle}}</h2>
            <h6 class="title-small-tips">以落地页或唤醒链接为维度，导入广告主的花费数据</h6>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="search-line">
                <DatePicker
                    type="date"
                    :value="filterSearch.start_date"
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    :transfer="true"
                    placeholder="统计日期"
                    @on-change="datePickerChange"
                    :options="disabledDate"
                ></DatePicker>

                <Button class="search" @click="doFilterList">查询</Button>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText">
                    <!-- 统计日期 -->
                    <template slot-scope="{ row }" slot="date">
                        {{row.date | timeFormat('yyyy-MM-dd')}}
                    </template>
                    <!-- 导入数据条数 -->
                    <template slot-scope="{ row }" slot="count">
                        {{row.count > 0 ? row.count : '-'}}
                    </template>
                    <!-- 导入时间 -->
                    <template slot-scope="{ row }" slot="updated_at">
                        <span v-if="row.updated_at === 0">-</span>
                        <span v-else>{{row.updated_at | timeFormat('yyyy-MM-dd HH:mm:ss')}}</span>
                    </template>
                    <!--操作-->
                    <template slot-scope="{ row, index }" slot="handle">
                        <!-- 1. 如果有url -->
                        <template v-if="row.file_link">
                            <Button type="text" @click="doUpload(row)" v-if="_isShow_('export')">重新导入</Button>
                            <a type="text" v-if="_isShow_('download')" download target="_blank" :href="row.file_link">下载</a>
                         </template>
                        <!-- 2. 无url -->
                        <template v-if="!row.file_link">
                            <Button type="text" @click="doUpload(row)" v-if="_isShow_('export')">导入</Button>
                        </template>
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
                    <h3>导入广告主花费数据</h3>
                </div>
                <div class="draw-header-img fr">
                    <img src="~@/assets/image/colsImg.png">
                </div>
            </div>
            <Form ref="exportForm" :label-width="60" :label-colon="true">
                <div class="down-export">
                    <span>数据导入模板</span>
                    <a download target="_blank" :href="`${this.$xlsAPIUrl}/%E8%8A%B1%E8%B4%B9%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx`">
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
import { showTitle } from '@/libs/util'
import { debounce, createObjectURL, formatDate } from '@/libs/tools'
import { getIncomeList, addIncomeList, addIncomeListUrl } from '@/api/income'
import { inPageAccess } from '@/mixin/in-page-access.js'
import { getDownLoadXls } from '@/api/common'

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

            filterSearch: { // 筛选条件
                start_date: '', // 开始时间
                end_date: '' // 结束时间
            },
            tableColList: [ // 表格header
                {
                    title: '统计日期',
                    slot: 'date',
                    width: 100
                },
                {
                    title: '导入数据条数',
                    slot: 'count'
                },
                {
                    title: '导入时间',
                    slot: 'updated_at'
                },
                {
                    title: '操作人',
                    key: 'username'
                },
                {
                    title: '操作',
                    width: 120,
                    slot: 'handle'
                }
            ],

            disabledDate: { // 不可选择的时间范围
                disabledDate(date) {
                    return date.getTime() > new Date().getTime()
                }
            },
            catchIncomeItem: {}, // 缓存列表单个数据，导入使用
            actionUrl: addIncomeListUrl, // url导入链接地址
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
            this.getIncomeList() // 获取表格数据
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
        getIncomeList() {
            this.tableLoadFlag = true

            let params = {
                ...this.filterSearch,
                ...{
                    page_size: this.pageSize,
                    page_num: this.currentPage
                }
            }

            getIncomeList(params).then(res => {
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
         * [datePickerChange 时间选择器发生变化]
         * @param  {[type]} time [description]
         * @return {[type]}      [description]
         */
        datePickerChange(time) {
            this.filterSearch.start_date = time
            this.filterSearch.end_date = time
        },
        /**
         * [doFilterList 筛选查询]
         * @return {[type]} [description]
         */
        doFilterList(val) {
            this.currentPage = 1
            this.getIncomeList()
        },
        /**
         * [pageNumberChange 修改页码]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        pageNumberChange(val) {
            this.currentPage = val
            this.getIncomeList()
        },
        /**
         * [pageSizeChange 切换每页条数时的回调]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        pageSizeChange(size) {
            this.pageSize = size
            this.getIncomeList()
        },
        /**
         * [doUpload 导入和重新导入]
         * @return {[type]} [description]
         */
        doUpload(row) {
            if (!row.id) {
                return
            }
            this.catchIncomeItem = row
            this.drawModalFlag = !this.drawModalFlag
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

            let formData = new FormData()
            formData.append('file', this.uploadList[0])
            formData.append('id', this.catchIncomeItem.id)

            this.submitClock = true

            addIncomeList(formData).then(res=> {
                if (res.code === 200) {
                    this.$Message.success('上传成功')
                    this.getIncomeList()
                } else if (res.code === 405) {
                    this.$Modal.confirm({
                        width: 600,
                        title: '错误提示',
                        content: res.msg.replace(/;/g, '<br />'),
                        onOk: () => {
                            this.getIncomeList()
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
            this.catchIncomeItem = {}
        }
        /********************************************
        *↑↑↑↑↑↑↑↑↑↑ 以下为批量上传 end *↑↑↑↑↑↑↑
        ********************************************/
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
