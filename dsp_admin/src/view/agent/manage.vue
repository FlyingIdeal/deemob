<template>
    <div class="page-main">
        <div class="page-title page-has-line">
            <h2 class="title-line-tag">{{headTitle}}</h2>
            <div class="is-handler">
                <Button type="primary" icon="md-add" @click="toAddNew()" v-if="_isShow_('add')">新建代理商</Button>
            </div>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="search-line" ref="search-line">
                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.status"
                    filterable
                    clearable
                    :transfer="true"
                    placeholder="全部状态">
                    <Option v-for="item in auditArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.allow_test_slot"
                    filterable
                    clearable
                    :transfer="true"
                    placeholder="是否显示测试流量">
                    <Option v-for="item in isTestArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.strategy"
                    filterable
                    clearable
                    :transfer="true"
                    placeholder="付款制度">
                    <Option v-for="item in strategyArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.is_rta"
                    filterable
                    clearable
                    :transfer="true"
                    placeholder="是否为RTA类型">
                    <Option v-for="item in isRta" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>

                <Input class="i-margin-right-11 mar-bot-10 i-width-date" clearable v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入代理商名称/公司名称/ID" :clearable="true" />
                <Button class="search" @click="doFilterList">查询</Button>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText" @on-selection-change="selectChange">
                    <!--代理商名称-->
                    <template slot-scope="{ row }" slot="agentname">
                        <div class="ud-handle clearfix">
                            <div class="exit-box" title="登录" @click="toLoginAgent(row)" v-if="_isShow_('login')">
                                <i class="iconfont icon-exit"></i>
                            </div>
                            <div class="ud-account">
                                <p class="name-row-ellipsis" :title="row.agentname">{{row.agentname}}</p>
                            </div>
                        </div>
                    </template>
                    <!-- 公司名称 -->
                    <template slot-scope="{ row }" slot="company_name">
                        <p class="text-row-ellipsis" :title="row.company_name">{{row.company_name}}</p>
                    </template>
                    <!--状态-->
                    <template slot-scope="{ row }" slot="status">
                        <!-- 1启用，2停用，3待完善 4待审核 5已拒绝, 只有在正常和停用的情况下显示 i-switch -->
                        <Badge color="#67C23A" v-if="row.status === 1" text="正常" />
                        <Badge color="#f93d3d" v-if="row.status === 2" text="停用" />
                        <i-switch v-if="(row.status === 1 || row.status === 2) && _isShow_('status')" size="small" :true-value="1" :false-value="2" v-model="row.status" @on-change="iSwitchChangeState(row)"/>

                        <Badge color="#2db7f5" v-if="row.status === 3" text="资质待完善" />
                        <Badge status="warning" v-if="row.status === 4" text="待审核" />
                        <Badge status="error" v-if="row.status === 5" text="已拒绝" />

                        <Tooltip placement="top" v-if="row.status === 5" :transfer="true" maxWidth="300">
                            <i class="iconfont icon-why"></i>
                            <div slot="content" v-html="row.note"></div>
                        </Tooltip>
                    </template>
                    <!-- 付款制度 -->
                    <template slot-scope="{ row }" slot="strategy">
                        <!-- 1预付款 2垫付款 -->
                        {{row.strategy === 1 ? '预付款' : (row.strategy === 2 ? '垫付款' : '-')}}
                    </template>
                    <!-- 测试流量  0否 1是 -->
                    <template slot-scope="{ row }" slot="allow_test_slot">
                        {{row.allow_test_slot === 1 ? '显示' : (row.allow_test_slot === 0 ? '隐藏' : '-')}}
                    </template>
                    <!-- RTA类型 -->
                    <template slot-scope="{ row }" slot="is_rta">
                        {{row.is_rta === 1 ? '是' : '否'}}
                    </template>
                    <!--账户余额（元）-->
                    <template slot-scope="{ row }" slot="deposit">
                        {{row.deposit | number2Thousand}}
                    </template>
                    <!--暗扣系数-->
                    <template slot-scope="{ row }" slot="agent_price_X">
                        <div class="hidden_ratio">
                            <span>{{row.agent_price_X}}</span>

                            <Poptip
                                confirm
                                :transfer="true"
                                placement="bottom"
                                transfer-class-name="agent-custom-poptip"
                                @on-ok="agentPriceOk(row)"
                                v-if="_isShow_('pricex')"
                            >
                                <i class="iconfont icon-edit"></i>
                                <div slot="title">
                                    <InputNumber v-model="row.agent_price_X_change" placeholder="大于等于0, 小于1; 最多两位小数点" :min="0" :max="1" :step="0.01"></InputNumber>
                                </div>
                            </Poptip>
                        </div>
                    </template>

                    <!--停用原因-->
                    <template slot-scope="{ row }" slot="note">
                        <p class="text-row-ellipsis" v-if="row.status === 2" :title="row.note">{{row.note}}</p>
                        <p v-else>-</p>
                    </template>

                    <!--操作-->
                    <template slot-scope="{ row, index }" slot="handle">
                        <Button type="text" @click="toDetail(row, 'agent-infro')" v-if="_isShow_('view')">查看</Button>
                        <Button type="text" @click="toDetail(row, 'agent-edit')" v-if="_isShow_('edit')">编辑</Button>
                        <Button type="text" @click="doResetPsw(row)" v-if="_isShow_('resetPsw')">重置密码</Button>
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
                    <h3>重置密码</h3>
                </div>
                <div class="draw-header-img fr">
                    <img src="~@/assets/image/colsImg.png">
                </div>
            </div>
            <Form ref="modalForm" label-position="right" :model="modalForm" :rules="modalFormRules" :label-width="90" :label-colon="true">
                <FormItem label="密码" prop="psw">
                    <Input type="password" password :maxlength="20" v-model.trim="modalForm.psw" placeholder="请输入密码"/>
                </FormItem>
                <FormItem label="确认密码" prop="pswCheck">
                    <Input type="password" password :maxlength="20" v-model.trim="modalForm.pswCheck" placeholder="请再次输入密码"/>
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button @click="resetForm">取消</Button>
                <Button type="primary" :loading="submitClock" @click="submitForm('modalForm')">
                    {{!submitClock ? '保存' : '保存中...'}}
                </Button>
            </div>
        </Drawer>

        <!--审核拒绝/封禁弹窗-->
        <Drawer v-model="bannedModalFlag" width="600" :mask-closable="false" :closable="false" :styles="drawStyles" class="custom-drawer">
            <div slot="header" class="draw-header clearfix">
                <div class="draw-header-title fl">
                    <h3>确认停用?</h3>
                </div>
                <div class="draw-header-img fr">
                    <img src="~@/assets/image/colsImg.png">
                </div>
            </div>
            <Form ref="bannedForm" label-position="right" :model="bannedForm" :rules="bannedFormRules" :label-width="90" :label-colon="true">
                <FormItem label="停用原因" prop="reason">
                    <Input v-model.trim="bannedForm.reason" show-word-limit maxlength="30" type="textarea" :rows="6" placeholder="请输入停用原因，保存后即会停用，不要超过30个字" />
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button @click="cancleBanned">取消</Button>
                <Button type="primary" :loading="submitClock" @click="submitBannedForm('bannedForm')">
                    {{!submitClock ? '保存' : '保存中...'}}
                </Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
import { showTitle, dataType, regNum2Precision } from '@/libs/util'
import { formatDate, number2Thousand } from '@/libs/tools'
import { meidaCols } from './colList.js'
import { getShamLoginToken } from '@/api/user'
import { getAgentList, modifyAgent, resetAgentPsw, modifyAgentPricex, batchAgentStatus } from '@/api/agent'
import { inPageAccess } from '@/mixin/in-page-access.js'

export default {
    mixins: [inPageAccess],
    data() {
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.modalForm.psw) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }
        return {
            pageSize: 10, // 页码长度
            total_count: 0,
            currentPage: 1,
            colDatList: [], // table数据
            tableLoadFlag: false, // table的loading
            noDataText: this.$config.noDataText,

            auditArr: [ // 状态列表
                //1启用 2停用 3待完善 4待审核 5已拒绝
                {
                    id: 1,
                    name: '正常'
                },
                {
                    id: 2,
                    name: '停用'
                },
                {
                    id: 3,
                    name: '资质待完善'
                },
                {
                    id: 4,
                    name: '待审核'
                },
                {
                    id: 5,
                    name: '已拒绝'
                }
            ],
            isTestArr: [
                // 是否为测试广告位 0否 1是
                {
                    id: 1,
                    name: '显示'
                },
                {
                    id: 0,
                    name: '隐藏'
                }
            ],

            batchOpenFlag: false, // 批量开启
            batchCloseFlag: false, // 批量关闭
            selectID: [], // 批量id
            agentIdArr: [], // 修改广告主状态时的存储id
            catchAgentItem: '', // 缓存改变状态选中的item
            submitClock: false,

            filterSearch: { // 筛选条件
                status: undefined,
                name_or_id: '',
                strategy: undefined,
                is_rta: undefined, // 是否为ita类型，默认空
                allow_test_slot: undefined // 是否显示测试流量
            },
            tableColList: meidaCols(),

            drawModalFlag: false,
            modalForm: {
                agentid: '', // 代理商id
                psw: '', // 新密码
                pswCheck: '' // 二次确认
            },
            modalFormRules: { // form表单正则
                psw: [
                    {required: true, message: '密码不能为空'},
                    {min: 6, message: '长度至少6位', trigger: 'blur'},
                    {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}
                ],
                pswCheck: [{required: true, validator: validatePassCheck, trigger: 'blur'}]
            },
            drawStyles: { // 抽屉样式
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '54px',
                position: 'static'
            },
            bannedForm: {
                reason: '' // 停用原因
            },
            bannedFormRules: {
                reason: [{required: true, message: '请输入停用原因'}]
            },
            bannedModalFlag: false // 停用窗口
        }
    },
    filters: {
        number2Thousand(val) {
            return number2Thousand(val)
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        },
        /**
         * [getIsTestSlot 是否是测试广告位]
         * @return {[type]} [description]
         */
        strategyArr() {
            return this.$store.getters.getStrategy
        },
        /**
         * [getIsTestSlot 是否是RTA类型]
         * @return {[type]} [description]
         */
        isRta() {
            return this.$store.getters.getIsRta
        }
    },
    created() {
        if (this._hasPageAccess()) {
            this.getAgentList() // 获取表格数据
        }
    },
    methods: {
        /**
         * [getFinanceList 获取列表的信息]
         * @return {[type]} [description]
         */
        getAgentList() {
            this.tableLoadFlag = true

            let _filter = this.filterSearch

            let params = {
                page_size: this.pageSize,
                page_num: this.currentPage
            }

            // name_or_id
            _filter.name_or_id !== '' && (params.name_or_id = _filter.name_or_id)

            // 审核状态, 1启用 2停用 3待完善 4待审核 5已拒绝
            _filter.status !== undefined && (params.status = _filter.status)

            // 付款策略 1预付款 2垫付款
            _filter.strategy !== undefined && (params.strategy = _filter.strategy)

            // 是否可使用测试广告位 0否 1是
            _filter.allow_test_slot !== undefined && (params.allow_test_slot = _filter.allow_test_slot)

            // 是否为ita类型
            _filter.is_rta !== undefined && (params.is_rta = _filter.is_rta)

            getAgentList(params).then(res => {
                this.tableLoadFlag = false

                if (res.code === 200) {
                    let _list = res.data.list || []

                    _list.map(item => {
                        item._disabled = !(item.status === 1 || item.status === 2)
                        item.agent_price_X_change = item.agent_price_X
                    })

                    this.colDatList = _list
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
         * [batchOpen 批量启用]
         * @return {[type]} [description]
         */
        batchOpen(type) {
            if (!this.selectID.length) {
                this.$Message.warning('请先勾选代理商')
                return
            }

            this.agentIdArr = [...this.selectID]

            if (type === 'close') { // 停用-》 弹出原因框
                this.bannedModalFlag = !this.bannedModalFlag
            } else if (type === 'open') { // 启用
                this.agentStatusChange('open')
            }

            // 重置关于批量的变量
            this.selectID = []
            this.batchOpenFlag = false
            this.batchCloseFlag = false
        },
        /**
         * [iSwitchChangeState 广告主状态切换状态 只限于switch的逻辑更换，不调用接口]
         * @param  {[type]} item [description]
         * @return {[type]}     [description]
         */
        iSwitchChangeState(item) {
            if (!item.agentid) {
                return
            }

            // 因为i-switch优先改变状态，初始状态为1，点击时会变成2
            if(item.status === 2) { // 由正常变为停用
                // 此时需要弹窗，输入停用原因
                this.bannedModalFlag = !this.bannedModalFlag
                this.catchAgentItem = item

            } else if (item.status === 1) { // 由停用变为正常

                this.agentIdArr = [item.agentid]
                this.catchAgentItem = ''

                this.agentStatusChange('open')
            }
        },
        /**
         * [agentStatusChange 代理商接口的改变  停用/启用]
         * @param  {[type]} type   [open/banned]
         * @param  {[type]} reason [停用原因]
         * @return {[type]}        [description]
         */
        agentStatusChange(type, reason) {

            if(!this.agentIdArr.length) {
                return
            }

            let params = {
                agent_id_arr: this.agentIdArr, // 此处备忘录：因为没有批量处理，所以此处用单个id
                status: type === 'open' ? 1 : 2
            }

            // 停用原因
            if(!!reason) {
                params.note = reason
            }

            this.submitClock = true

            batchAgentStatus(params).then(res => {

                this.submitClock = false

                if (res.code === 200) {
                    this.$Message.success('操作成功')
                    this.cancleBanned()
                } else {
                    this.$Message.error({content: '操作失败', duration: 3})
                }
            })
        },
        /**
         * [selChange 获取选中的值]
         * @param  {[type]} item [description]
         * @return {[type]}     [description]
         */
        selectChange(select) {
            let _arr = []
            select.map(item => {
                if (item.status === 1 || item.status === 2) {
                    _arr.push(item.id)
                }
            })
            this.selectID = _arr
        },
        /**
         * [doFilterList 筛选查询]
         * @return {[type]} [description]
         */
        doFilterList(val) {
            this.currentPage = 1
            this.getAgentList()
        },
        /**
         * [pageNumberChange 修改页码]
         * @param  {[type]} val [description]
         * @return {[type]}     [description]
         */
        pageNumberChange(val) {
            this.currentPage = val
            this.getAgentList()
        },
        /**
         * [pageSizeChange 切换每页条数时的回调]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        pageSizeChange(size) {
            this.pageSize = size
            this.getAgentList()
        },
        /**
         * [doResetPsw 重置密码]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        doResetPsw(item) {
            if(!item.agentid) {
                return
            }

            this.modalForm = {
                agentid: item.agentid,
                psw: '', // 新密码
                pswCheck: '' // 二次确认
            }

            this.drawModalFlag = !this.drawModalFlag
        },
        /**
         * [submitForm 修改密码]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        submitForm(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {

                    this.submitClock = false

                    resetAgentPsw({agentid: this.modalForm.agentid, password: this.modalForm.psw}).then(res => {
                        if (res.code === 200) {

                            this.submitClock = false

                            this.$Message.success({ content: '修改成功', duration: 3})

                            this.resetForm() // 重置表单
                            this.getAgentList() // 获取列表
                        } else {
                            this.$Message.error({ content: '保存失败，请重试', duration: 3})
                        }
                    }, err=> {
                        this.submitClock = false
                    })
                }
            })
        },
        /**
         * [submitBannedForm 确认停用]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        submitBannedForm(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {

                    // 说明是单个关闭
                    if(!!this.catchAgentItem) {
                        this.agentIdArr = [this.catchAgentItem.agentid]
                    }

                    this.agentStatusChange('close', this.bannedForm.reason) // 改变状态
                }
            })
        },
        /**
         * [resetForm 重置form表单]
         * @return {[type]} [description]
         */
        resetForm() {
            this.modalForm = {
                agentid: '',
                psw: '', // 新密码
                pswCheck: '' // 二次确认
            }

            this.$refs['modalForm'].resetFields()
            this.drawModalFlag = false
        },
        /**
         * [cancleBanned 停用原因form表单]
         * @return {[type]} [description]
         */
        cancleBanned() {
            this.bannedForm = {
                reason: '' // 停用原因
            }

            this.$refs['bannedForm'].resetFields()
            this.bannedModalFlag = false
            this.catchAgentItem = ''

            this.getAgentList() // 获取列表
        },

        /**
         * [toLoginAgent 伪登录代理商平台]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        toLoginAgent(row) {
            getShamLoginToken({
                platform_id: this.$config.platformId,
                target_platform_id: this.$config.agentPlatformId,
                user_id: row.uc_id
            }).then(res => {
                if (res.code === 200) {
                    console.log(`${this.$APIUrl.agentComUrl}/account/agent/login?token=${res.data.token}&pid=${this.$config.agentPlatformId}&userId=${row.uc_id}`)
                    window.open(`${this.$APIUrl.agentComUrl}/account/agent/login?token=${res.data.token}&pid=${this.$config.agentPlatformId}&userId=${row.uc_id}`, '_blank')
                } else {
                    this.$Message.error({ content: res.msg, duration: 3})
                }
            })
        },
        /**
         * [toAddNew 新建代理商]
         * @return {[type]} [description]
         */
        toAddNew() {
            this.$router.push({ name: 'agent-add' })
        },
        /**
         * [toDetail 编辑和详情]
         * @param  {[type]} row  [description]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        toDetail(row, name) {
            this.$router.push({ name, query: {id: row.agentid} })
        },
        /**
         * [agentPriceOk 暗扣系数确定]
         * @return {[type]} [description]
         */
        agentPriceOk(row) {

            if(row.agent_price_X === row.agent_price_X_change) {
                this.$Message.warning({ content: '保存失败,暗扣系数未发生改变', duration: 3})
                return
            }

            if(!regNum2Precision.test(row.agent_price_X_change)) {
                this.$Message.error({ content: '保存失败,暗扣系数必须大于等于0,小于1;最多两位小数点', duration: 4})
                return
            }

            if(row.agent_price_X_change < 0 || row.agent_price_X_change >= 1) {
                this.$Message.error({ content: '保存失败,暗扣系数必须大于等于0,小于1;最多两位小数点', duration: 4})
                return
            }

            // 通过以上三种校验，还需硬性处理
            let price_x = parseInt(row.agent_price_X_change * 100) / 100


            modifyAgentPricex({agentid: row.agentid, price_x: price_x}).then(res=> {
                if (res.code === 200) {
                    this.$Message.success({ content: '保存成功', duration: 3})
                    this.getAgentList() // 获取列表
                } else {
                    this.$Message.error({ content: res.msg, duration: 3})
                }
            })
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.icon-why
    cursor: pointer
    color: #999
.mar-bot-10
    vertical-align: top
    margin-bottom: 10px
.ud-handle
    .ud-account
        overflow: hidden
        .name-row-ellipsis
            height: 32px
            line-height: 32px
    .exit-box
        height: 30px
        width: 30px
        line-height: 30px
        text-align: right
        display: inline
        float: right
    .icon-exit
        font-size: 12px
        width: 30px
        height: 30px
        line-height: 30px
        color: #4083F8
        display: inline-block
        vertical-align: middle
        cursor: pointer
.hidden_ratio
    display: flex
    align-items: center
    .iconfont
        flex: 0 0 30px
        height: 30px
        line-height: 30px
        text-align: center
        color: #465CFE
        cursor: pointer
        font-size: 12px
    span
        flex: 1
</style>

<style lang="stylus" rel="stylesheet/stylus">

.agent-custom-poptip
    .ivu-poptip-inner
        display: flex
        padding: 20px
    .ivu-poptip-body
        padding: 0px !important
    .ivu-poptip-body-message
        flex: 0 0 200px
        padding-left: 0px !important
        .ivu-input-number
            width: 200px
    .ivu-poptip-content
        .ivu-icon-ios-help-circle
            display: none
    .ivu-poptip-footer
        padding: 0px !important
        flex: 1
        font-size: 0px
        .ivu-btn
            margin-left: 10px
        .ivu-btn-small
            height: 32px
            padding: 0 15px
            border-radius: 4px
        .ivu-btn-text
            background: #fafafa
            border: 1px solid #ebebeb
            &:hover
                border: 1px solid #465CFE
</style>
