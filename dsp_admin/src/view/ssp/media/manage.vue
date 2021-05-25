<template>
    <div class="page-main">
        <div class="page-title page-has-line">
            <h2 class="title-line-tag">{{headTitle}}</h2>
            <div class="is-handler">
                <Poptip :transfer="true" placement="bottom" v-model="batchOpenFlag" transfer-class-name="batch-custom-poptip" v-if="_isShow_('status')">
                    <Button class="has-img-icon" type="text" >
                        <i class="batch-open is-handler-icon"></i>
                        <span>批量启用</span>
                    </Button>

                    <div slot="content">
                        <i class="iconfont icon-why"></i>
                        <span class="pop-text">确认批量启用么？</span>
                        <Button @click="batchOpenFlag = false">取消</Button>
                        <Button type="primary" @click="batchOpen('open')">确定</Button>
                    </div>
                </Poptip>

                <Poptip :transfer="true" placement="bottom" v-model="batchCloseFlag" transfer-class-name="batch-custom-poptip" v-if="_isShow_('status')">
                    <Button class="has-img-icon" type="text">
                        <i class="batch-close is-handler-icon"></i>
                        <span>批量停用</span>
                    </Button>

                    <div slot="content">
                        <i class="iconfont icon-why"></i>
                        <span class="pop-text">确认批量停用么？</span>
                        <Button @click="batchCloseFlag = false">取消</Button>
                        <Button type="primary" @click="batchOpen('close')">确定</Button>
                    </div>
                </Poptip>

                <Button type="primary" icon="md-add" @click="doEdit()" v-if="_isShow_('newAndEdit')">新建媒体</Button>
            </div>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="search-line" ref="search-line">
                <Input class="i-margin-right-11 mar-bot-10 i-width-normal" clearable v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入媒体名称或ID查询" :clearable="true" />
                <Button class="search" @click="doFilterList">查询</Button>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText" @on-selection-change="selectChange">
                    <!--媒体名称/ID-->
                    <template slot-scope="{ row }" slot="name">
                        <p class="name-row-ellipsis" :title="row.name">{{ row.name }}</p>
                        <p class="tip-row-line">ID: {{ row.id }}</p>
                    </template>
                    <!--状态-->
                    <template slot-scope="{ row }" slot="status">
                        <!-- 1=正常, 2=停用 -->
                        <span v-if="row.status === 1">正常</span>
                        <span v-if="row.status === 2">停用</span>
                        <i-switch v-if="_isShow_('status')" size="small" :true-value="1" :false-value="2" v-model="row.status" @on-change="changeState(row)"/>
                    </template>
                    <!--操作-->
                    <template slot-scope="{ row, index }" slot="handle">
                        <Button type="text" @click="doEdit(row)" v-if="_isShow_('newAndEdit')">编辑</Button>
                    </template>
                </Table>
                <div class="page-center">
                    <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
                </div>
            </div>
        </Card>

        <Drawer v-model="drawModalFlag" width="600" :mask-closable="false" :closable="false" :styles="drawStyles" class="custom-drawer">
            <div slot="header" class="draw-header clearfix">
                <div class="draw-header-title fl">
                    <h3>{{modalForm.id ? '编辑媒体' : '新建媒体'}}</h3>
                </div>
                <div class="draw-header-img fr">
                    <img src="~@/assets/image/colsImg.png">
                </div>
            </div>
            <Form ref="modalForm" label-position="right" :model="modalForm" :rules="modalFormRules" :label-width="120" :label-colon="true">
                <FormItem label="媒体名称" prop="name">
                    <Input :maxlength="30" show-word-limit v-model.trim="modalForm.name" placeholder="请输入公司名称"/>
                </FormItem>
                <FormItem label=" 媒体简称全拼" prop="alias">
                    <Input :maxlength="30" show-word-limit v-model.trim="modalForm.alias" placeholder="请输入公司简称全拼"/>
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button @click="drawModalFlag = false">取消</Button>
                <Button type="primary" :loading="submitClock" @click="modifySsp('modalForm')">
                    {{!submitClock ? '提交' : '提交中...'}}
                </Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
import { showTitle, dataType } from '@/libs/util'
import { formatDate } from '@/libs/tools'
import { meidaCols } from '../colList.js'
import { inPageAccess } from '@/mixin/in-page-access.js'
import { getSspList, batchSspStatus, modifySsp, addNewSsp } from '@/api/ssp'

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

            batchOpenFlag: false, // 批量开启
            batchCloseFlag: false, // 批量关闭
            selectID: [], // 批量id
            submitClock: false,

            filterSearch: { // 筛选条件
                name_or_id: ''
            },
            tableColList: meidaCols(),

            drawModalFlag: false,
            modalForm: {
                name: '',
                alias: ''
            },
            modalFormRules: { // form表单正则
                name: [{required: true,  message: '请输入媒体名称', trigger: 'blur'}],
                alias: [{required: true, message: '请输入媒体简称全拼', trigger: 'blur'}]
            },
            drawStyles: { // 抽屉样式
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '54px',
                position: 'static'
            },
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    created() {
        if (this._hasPageAccess()) {
            this.getSspList() // 获取表格数据
        }
    },
    methods: {
        /**
         * [getFinanceList 获取列表的信息]
         * @return {[type]} [description]
         */
        getSspList() {
            this.tableLoadFlag = true

            getSspList({
                page_size: this.pageSize,
                page_num: this.currentPage,
                name_or_id: this.filterSearch.name_or_id
            }).then(res => {
                this.tableLoadFlag = false
                if (res.code === 200) {
                    this.colDatList = res.data.list
                    this.total_count = res.data.total
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
         * [changeState 切换业务状态]
         * @param  {[type]} item [description]
         * @return {[type]}     [description]
         */
        changeState(item) {
            // 1=正常, 2=停用
            modifySsp({id: item.id, status: item.status === 1 ? 1 : 2}).then(res => {
                if (res.code === 200) {
                    this.$Message.success('操作成功')
                    item.status = item.status === 1 ? 1 : 2
                } else {
                    this.$Message.error({content: '操作失败', duration: 3})
                    item.status = item.status === 1 ? 2 : 1
                }
            }, err => {
                item.status = item.status === 1 ? 2 : 1
            })
        },
        /**
         * [submitCompany 新建/编辑]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        modifySsp(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {

                    this.submitClock = false

                    let form = this.modalForm

                    let proUrl = !!form.id ? modifySsp(form) : addNewSsp(form)

                    proUrl.then(res=> {
                        if(res.code === 200) {
                            this.$Message.success({ content: form.id ? '修改成功' : '新建成功', duration: 3})

                            this.resetForm() // 重置表单
                            this.getSspList() // 获取列表

                        } else {
                            this.$Message.error({ content: form.id ? '保存失败，请重试' : '新建失败，请重试', duration: 3})
                        }

                        this.submitClock = false
                    }, err => {
                        this.submitClock = false
                    })

                } else {
                    this.$Message.error({content: this.$config.verifyText, duration: 3})
                }
            })
        },

        /**
         * [doFilterList 筛选查询]
         * @return {[type]} [description]
         */
        doFilterList(val) {
            this.currentPage = 1
            this.getSspList()
        },

        /**
       * [selChange 获取选中的值]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
        selectChange(select) {
            let _arr = []
            select.map(item => {
                _arr.push(item.id)
            })
            this.selectID = _arr
        },

        /**
         * [pageNumberChange 修改页码]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        pageNumberChange(val) {
            this.currentPage = val
            this.getSspList()
        },
        /**
         * [pageSizeChange 切换每页条数时的回调]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        pageSizeChange(size) {
            this.pageSize = size
            this.getSspList()
        },
        /**
         * [doEdit 编辑]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        doEdit(item) {
            if(!!item) {
                this.modalForm = {
                    id: item.id,
                    name: item.name,
                    alias: item.alias
                }
            } else {
                this.modalForm = {
                    name: '',
                    alias: ''
                }
            }

            this.drawModalFlag = !this.drawModalFlag
        },
        /**
         * [resetForm 重置form表单]
         * @return {[type]} [description]
         */
        resetForm() {
            this.modalForm = {
                name: '',
                alias: ''
            }

            this.drawModalFlag = false
        },
        /**
         * [batchOpen 批量启用]
         * @return {[type]} [description]
         */
        batchOpen(type) {
            if(!this.selectID.length) {
                this.$Message.warning('请先勾选媒体')
                return
            }

            batchSspStatus({id_arr: this.selectID, status: type === 'open' ? 1 : 2}).then(res=> {
                if(res.code === 200) {
                    this.selectID = []
                    this.$Message.success({ content: '操作成功', duration: 3})
                    this.getSspList() // 获取列表
                } else {
                    this.$Message.error({ content: res.msg, duration: 3})
                }

                this.batchOpenFlag = false
                this.batchCloseFlag = false
            })

        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
