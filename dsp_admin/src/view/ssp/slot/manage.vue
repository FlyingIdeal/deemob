<template>
    <div class="page-main">
        <div class="page-title page-has-line">
            <h2 class="title-line-tag">{{headTitle}}</h2>
            <div class="is-handler">
                <Poptip :transfer="true" placement="bottom" v-model="batchOpenFlag" transfer-class-name="batch-custom-poptip" v-if="_isShow_('status')">
                    <Button class="has-img-icon" type="text">
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

                <Poptip :transfer="true" placement="bottom" v-model="batchCloseFlag" transfer-class-name="batch-custom-poptip">
                    <Button class="has-img-icon" type="text" v-if="_isShow_('status')">
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

                <Button type="text" @click="downStatement" :loading="submitClock" class="has-img-icon">
                    <i class="iconfont icon-download"></i>
                    <span>{{!submitClock ? '下载广告位' : '下载中...'}}</span>
                </Button>

                <Button class="has-img-icon" type="text" @click="drawModalFlag = true" v-if="_isShow_('newAndEdit')">
                    <i class="batch-add is-handler-icon"></i>
                    <span>批量新建广告位</span>
                </Button>

                <Button type="primary" icon="md-add" @click="toEdit()" v-if="_isShow_('newAndEdit')">新建广告位</Button>
            </div>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="search-line" ref="search-line">
                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.ssp_id_arr"
                    filterable
                    clearable
                    multiple
                    :max-tag-count="1"
                    :remote-method="searchSsp"
                    :loading="sspListLoad"
                    :transfer="true"
                    @on-change="clearSearchSsp"
                    @on-query-change="sspQueryChange"
                    placeholder="请选择媒体">
                    <Option v-for="item in sspList" :value="item.id" :key="item.id">{{ item.name }}({{ item.id }})</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.app_id_arr"
                    filterable
                    clearable
                    multiple
                    :max-tag-count="1"
                    :remote-method="searchSspApp"
                    :loading="sspAppLoad"
                    :transfer="true"
                    @on-change="clearSearchApp"
                    @on-query-change="appQueryChange"
                    placeholder="请选择应用">
                    <Option v-for="item in sspAppList" :value="item.id" :key="item.id">{{ item.app_name }}({{ item.id }})</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.os_type"
                    filterable
                    clearable
                    :transfer="true"
                    placeholder="请选择应用平台">
                    <Option v-for="item in osType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.slot_scene"
                    filterable
                    multiple
                    clearable
                    :max-tag-count="1"
                    :transfer="true"
                    placeholder="请选择广告场景">
                    <Option v-for="item in adSceneList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.slot_type"
                    filterable
                    multiple
                    clearable
                    :max-tag-count="1"
                    :transfer="true"
                    placeholder="请选择广告样式">
                    <Option v-for="item in adStyleList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>

                <Select
                    class="i-margin-right-11 i-width-normal mar-bot-10"
                    v-model="filterSearch.is_test_slot"
                    filterable
                    clearable
                    :transfer="true"
                    placeholder="是否为测试广告位">
                    <Option v-for="item in isTestSlotArr" :value="item.id" :key="item.id">{{ item.name }}</Option>
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

                <Input class="i-margin-right-11 mar-bot-10 i-width-normal" clearable v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入广告位名称" :clearable="true" />

                <Input type="textarea" v-model.trim="filterSearch.slot_id_arr_textarea" class="i-margin-right-11 i-width-normal mar-bot-10" clearable :rows="1" :autosize="{maxRows:1, minRows: 1}" placeholder="输入广告位ID,多个用逗号分隔"/>

                <Button class="search" @click="doFilterList">查询</Button>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText" @on-selection-change="selectChange">
                    <!--广告位名称/ID-->
                    <template slot-scope="{ row }" slot="slot_id">
                        <p class="name-row-ellipsis" :title="row.slot_name">{{ row.slot_name }}</p>
                        <p class="tip-row-line">ID: {{ row.slot_id }}</p>
                    </template>
                    <!-- 是否为测试广告位 0否 1是 -->
                    <template slot-scope="{ row }" slot="is_test_slot">
                        {{row.is_test_slot === 1 ? '是' : '否'}}
                    </template>
                    <!-- 应用平台 -->
                    <template slot-scope="{ row }" slot="os_type">
                        <span v-if="row.app.os_type === 1">Andorid</span>
                        <span v-if="row.app.os_type === 2">IOS</span>
                    </template>
                    <!--应用名称/ID-->
                    <template slot-scope="{ row }" slot="app_id">
                        <p class="name-row-ellipsis" :title="row.app.app_name">{{ row.app.app_name }}</p>
                        <p class="tip-row-line">ID: {{ row.app.id }}</p>
                    </template>
                    <!--媒体名称-->
                    <template slot-scope="{ row }" slot="ssp_id">
                        {{ row.ssp.name }}
                    </template>
                    <!--RTA类型-->
                    <template slot-scope="{ row }" slot="is_rta">
                        {{ row.rta_id > 0 ? '是' : '否' }}
                    </template>

                    <!--RTA合作方-->
                    <template slot-scope="{ row }" slot="rta_id">
                        {{ row.rta_id > 0 ? row.rta.name : '-' }}
                    </template>

                    <!--广告场景, 根据广告样式反显广告场景-->
                    <template slot-scope="{ row }" slot="slot_scene">
                        <!-- {{adTypeText(row.slot_type)}} -->
                        {{row.sceneText}}
                    </template>
                    <!--广告样式-->
                    <template slot-scope="{ row }" slot="slot_type">
                        {{creativeIdText(row.slot_type)}}
                    </template>

                    <!--素材尺寸比例-->
                    <template slot-scope="{ row }" slot="creative_width">
                        {{ row.creative_width }} : {{ row.creative_height }}
                    </template>

                    <!--状态-->
                    <template slot-scope="{ row }" slot="status">
                        <!-- 状态 1=正常 2=停用 -->
                        <span v-if="row.status === 1">正常</span>
                        <span v-if="row.status === 2">停用</span>
                        <i-switch size="small" :true-value="1" :false-value="2" v-model="row.status" @on-change="changeState(row)"  v-if="_isShow_('status')"/>
                    </template>
                    <!--操作-->
                    <template slot-scope="{ row, index }" slot="handle">
                        <Button type="text" :to="toDetail(row)" v-if="_isShow_('newAndEdit')">编辑</Button>
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
                    <h3>批量新建广告位</h3>
                </div>
                <div class="draw-header-img fr">
                    <img src="~@/assets/image/colsImg.png">
                </div>
            </div>
            <Form ref="exportForm" :label-width="60" :label-colon="true">
                <div class="down-export">
                    <span>文件模板下载</span>
                    <a download target="_blank" :href="`${this.$xlsAPIUrl}/%E6%89%B9%E9%87%8F%E6%96%B0%E5%BB%BA%E5%B9%BF%E5%91%8A%E4%BD%8D.xlsx`">
                        <icon class="iconfont icon-download"/>
                    </a>
                </div>
                <FormItem label="文件" prop="file" class="ivu-form-item-required">
                    <Upload
                        :action= "importSspSlotUrl"
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
import { showTitle, dataType, filterBatchQuery } from '@/libs/util'
import { debounce, createObjectURL } from '@/libs/tools'
import { slotCols } from '../colList.js'
import { getSspSlotList, getSspSlotListUrl, getSspAppList, batchSspSlotStatus, getSspList, importSspSlot, importSspSlotUrl } from '@/api/ssp'
import { inPageAccess } from '@/mixin/in-page-access.js'
import { getDownLoadXls } from '@/api/common'
import { mapGetters } from 'vuex'

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

            // 搜索使用
            catchSspList: [], // 缓存媒体列表，在清空媒体下拉时重新赋值
            sspList: [], // 媒体列表
            sspListLoad: false, // 媒体列表加载中
            catchSspAppList: [], // 缓存应用列表，在清空媒体下拉时重新赋值
            sspAppList: [], // 媒体列表
            sspAppLoad: false, // 媒体列表加载中

            batchOpenFlag: false, // 批量开启
            batchCloseFlag: false, // 批量关闭
            selectID: [], // 批量id

            adStyleList: [], // 广告样式
            filterSearch: { // 筛选条件
                ssp_id_arr: [], // 媒体ID数组
                app_id_arr: [], // 应用ID数组
                slot_id_arr_textarea: null, // 广告位id,多个用逗号分隔
                slot_id_arr: [], // 广告位ID数组
                os_type: '', // 操作系统, 1=Android, 2=iOS
                slot_scene: [], // 广告场景
                slot_type: [], // 广告样式
                name_or_id: '',
                is_test_slot: undefined, // 是否为测试广告位 0否 1是
                is_rta: undefined // 是否为ita类型，默认空
            },
            tableColList: slotCols(),

            importSspSlotUrl: importSspSlotUrl,
            drawModalFlag: false,
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
        ...mapGetters(['osType']),
        headTitle() {
            return showTitle(this.$route, this)
        },
        /**
         * [adSceneList 广告场景]
         * @return {[type]} [description]
         */
        adSceneList() { // 广告位类型 - 格式化
            return this.$store.state.app.adSceneData
        },
        /**
         * [getIsTestSlot 是否是测试广告位]
         * @return {[type]} [description]
         */
        isTestSlotArr() {
            return this.$store.getters.getIsTestSlot
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
            this.getSspSlotList() // 获取表格数据

            this.getSspList() // 媒体列表
            this.getSspAppList() // 应用列表列表
        }
    },
    activated() {
        this.$Bus.$off('editEmitEvent')
        this.$Bus.$on('editEmitEvent', (msg) => {
            this.getSspSlotList() // 列表数据
        })
    },
    methods: {
        /**
         * [getFinanceList 获取列表的信息]
         * @return {[type]} [description]
         */
        getSspSlotList() {
            this.tableLoadFlag = true

            let params = {
                ...this.getAxiosParams(), // 获取参数
                ...{
                    page_size: this.pageSize,
                    page_num: this.currentPage
                }
            }

            getSspSlotList(params).then(res => {
                this.tableLoadFlag = false
                if (res.code === 200) {

                    let list = res.data.list

                    // 根据样式id反显场景
                    list.map(item=> {
                        item.sceneText = this.styleToScene(item.slot_type, item.slot_scene)
                    })

                    this.colDatList = list
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
         * [getAxiosParams 获取列表和下载的参数]
         * @return {[type]} [description]
         */
        getAxiosParams() {
            let _filter = this.filterSearch

            let params = {}

            _filter.ssp_id_arr.length && (params.ssp_id_arr = _filter.ssp_id_arr)
            _filter.app_id_arr.length && (params.app_id_arr = _filter.app_id_arr)
            _filter.slot_id_arr.length && (params.slot_id_arr = _filter.slot_id_arr)
            _filter.os_type !== '' && (params.os_type = _filter.os_type)
            // _filter.slot_scene.length && (params.slot_scene = _filter.slot_scene)
            // _filter.slot_type.length && (params.slot_type = _filter.slot_type)
            _filter.name_or_id !== '' && (params.name_or_id = _filter.name_or_id)
            _filter.is_test_slot !== undefined && (params.is_test_slot = _filter.is_test_slot)
            _filter.is_rta !== undefined && (params.is_rta = _filter.is_rta)
            

            // 1. 此处涉及到样式和场景，因为导入广告位时，不存在场景
            // 1.1 只要有广告样式，按样式id筛选
            // 1.2 只存在广告场景，按筛选来

            let styleId = []
            if (_filter.slot_type.length) {
                // 1.1 只要有广告样式，按样式id筛选
                styleId = [..._filter.slot_type]
            } else if (_filter.slot_scene.length) {
                // 1.2 只存在广告场景，按筛选来
                let styleArr = [...this.adStyleList]

                styleArr.map(item => {
                    styleId.push(item.id)
                })
            }

            if(styleId.length) {
                params.slot_type = styleId
            }

            return params
        },
        /**
         * [downStatement 下载广告位]
         * @return {[type]} [description]
         */
        downStatement() {

            let slotParams = this.getAxiosParams()
            slotParams.page_num = 1

            let params = {
                method: 'GET',
                url: getSspSlotListUrl(slotParams)
            }

            this.submitClock = true

            getDownLoadXls(params).then(res => {
                if (res.code === 200) {
                    let filename = '广告位列表.xlsx'
                    createObjectURL(res.data.url, filename)
                }

                this.submitClock = false
            }, err => {
                this.submitClock = false
            })
        },
        /**
         * [styleToScene 根据广告样式反显广告场景]
         * @param  {[type]} styleId [description]
         * @return {[type]}         [description]
         */
        styleToScene(styleId) {

            try {
                let styleArr = this.$store.state.app.adStyleData
                let sceneArr = this.$store.state.app.adSceneData

                let result = styleArr.filter(item => item.id === styleId)[0]

                if(!result) {
                    return
                }

                let sceneResult = sceneArr.filter(child => child.id === result.parentId)[0]

                return !!sceneResult ? sceneResult.title : ''

            } catch (e) {
                console.log(e)
            }
        },
        /**
         * [changeState 切换业务状态]
         * @param  {[type]} item [description]
         * @return {[type]}     [description]
         */
        changeState(item) {
            // 1=正常, 2=停用
            batchSspSlotStatus({slot_id_arr: [item.slot_id], status: item.status === 1 ? 1 : 2}).then(res => {
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
         * [doFilterList 筛选查询]
         * @return {[type]} [description]
         */
        doFilterList(val) {
            this.currentPage = 1

            let _filter = this.filterSearch
            _filter.slot_id_arr = filterBatchQuery({value: _filter.slot_id_arr_textarea})

            this.getSspSlotList()
        },

        /**
         * [selChange 获取选中的值]
         * @param  {[type]} item [description]
         * @return {[type]}     [description]
         */
        selectChange(select) {
            let _arr = []
            select.map(item => {
                _arr.push(item.slot_id)
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
            this.getSspSlotList()
        },
        /**
         * [pageSizeChange 切换每页条数时的回调]
         * @param  {[type]} size [description]
         * @return {[type]}      [description]
         */
        pageSizeChange(size) {
            this.pageSize = size
            this.getSspSlotList()
        },
        /**
         * [toEdit 编辑]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        toEdit(row) {
            if(!!row && !!row.id) {
                this.$router.push({ name: 'ssp-slot-edit', query: {slotId: row.slot_id} })
            } else {
                this.$router.push({ name: 'ssp-slot-edit' })
            }
        },
        /**
         * [toDetail 详情链接]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        toDetail(row) {
            return `/ssp/slot/edit?slotId=${row.slot_id}`
        },
        /**
         * [adTypeText 获取广告场景]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        adTypeText(id) {
            let _arr = this.$store.state.app.adSceneData
            let result = _arr.filter(item => item.id == id)
            return result[0] ? result[0].title : ''
        },
        /**
         * [creativeIdText 获取广告样式]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        creativeIdText(id) {
            let _arr = this.$store.state.app.adStyleData
            let result = _arr.filter(item => item.id == id)
            return result[0] ? result[0].title : ''
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

            batchSspSlotStatus({slot_id_arr: this.selectID, status: type === 'open' ? 1 : 2}).then(res=> {
                if(res.code === 200) {
                    this.selectID = []

                    this.$Message.success({ content: '操作成功', duration: 3})
                    this.getSspSlotList() // 获取列表
                } else {
                    this.$Message.error({ content: res.msg, duration: 3})
                }

                this.batchOpenFlag = false
                this.batchCloseFlag = false
            })

        },


        /********************************************
        *↓↓↓↓↓↓↓↓↓↓ 以上部分为媒体和应用联动 start *↓↓↓↓↓↓↓
        ********************************************/
        /**
         * [searchSsp 媒体列表-搜索]
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        searchSsp(query) {
            this.sspListLoad = true
            this.getSspList(query)
        },
        /**
         * [clearSearchSsp 清空媒体列表]
         * @return {[type]} [description]
         */
        clearSearchSsp(arr) {
            if (arr.length === 0) {
                this.sspList = [...this.catchSspList]
            }
        },
        /**
         * [sspQueryChange 媒体-搜索词发生变化时]
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        sspQueryChange(query) {
            if(!query) {
                this.sspList = [...this.catchSspList]
            }
        },
        /**
         * [getSspList 媒体列表-防抖]
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        getSspList: debounce(function(query) {
            let _params = {
                page_size: !!query ? 10000 : 10,
                page_num: 1,
                name_or_id: query || ''
            }

            getSspList(_params).then(res => {
                this.sspListLoad = false
                if (res.code === 200) {
                    this.sspList = res.data.list

                    if (!query) {
                        this.catchSspList = res.data.list
                    }
                }
            })
        }, 1000),
        /**
         * [searchSspApp 应用列表-搜索]
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        searchSspApp(query) {
            this.sspAppLoad = true
            this.getSspAppList(query)
        },
        /**
         * [clearSearchApp 清空应用列表]
         * @return {[type]} [description]
         */
        clearSearchApp(arr) {
            if (arr.length === 0) {
                this.sspAppList = [...this.catchSspAppList]
            }
        },
        /**
         * [sspQueryChange 应用-搜索词发生变化时]
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        appQueryChange(query) {
            if(!query) {
                this.sspAppList = [...this.catchSspAppList]
            }
        },
        /**
         * [getSspAppList 应用列表-防抖]
         * @param  {[type]} query [description]
         * @return {[type]}       [description]
         */
        getSspAppList: debounce(function(query) {
            let _params = {
                ssp_id_arr: this.filterSearch.ssp_id_arr,
                page_size: (!!query || this.filterSearch.ssp_id_arr.length) ? 10000 : 10,
                page_num: 1,
                name_or_id: query || ''
            }

            getSspAppList(_params).then(res => {
                this.sspAppLoad = false
                if (res.code === 200) {
                    this.sspAppList = res.data.list

                    if (!query) {
                        this.catchSspAppList = res.data.list
                    }
                }
            })
        }, 1000),
        /********************************************
        *↑↑↑↑↑↑↑↑↑ 以上部分为媒体和应用联动 end *↑↑↑↑↑↑
        ********************************************/
        

        /********************************************
        *↓↓↓↓↓↓↓↓↓ 以下为批量上传 start *↓↓↓↓↓↓↓
        ********************************************/
        /**
         * [cancleExport 取消导入]
         * @return {[type]} [description]
         */
        cancleExport() {
            this.drawModalFlag = false
            this.filename = ''
            this.uploadList = []
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

            importSspSlot(formData).then(res=> {
                if (res.code === 200) {
                    this.$Message.success('上传成功')
                    this.getSspSlotList()
                } else if (res.code === 10006) {
                    this.$Modal.confirm({
                        title: '错误提示',
                        content: res.msg
                    })
                } else {
                    this.$Message.error({ content: res.msg, duration: 3})
                }

                this.clearUpload()
            })
        },
        /**
         * [clearUpload 清空上传信息]
         * @return {[type]} [description]
         */
        clearUpload() {
            this.drawModalFlag = false
            this.uploadList = []
            this.filename = ''
            this.submitClock = false
        }
        /********************************************
        *↑↑↑↑↑↑↑↑↑↑ 以下为批量上传 end *↑↑↑↑↑↑↑
        ********************************************/
    },
    watch: {
        'filterSearch.slot_scene': {
            handler: function(val) {
                let styleArr = this.$store.state.app.adStyleData
                let filterArr = styleArr.filter(item=> {
                    return val.includes(item.parentId)
                })

                this.filterSearch.slot_type = [] // 清空广告样式
                this.adStyleList = filterArr
            }
        },
        // 选择媒体
        'filterSearch.ssp_id_arr': {
            handler: function(val) {
                this.getSspAppList()
            }
        }
    },
    /**
     * [beforeRouteLeave 路由跳转]
     * @param  {[type]}   to   [如果路由跳转不是到媒体详情页，则销毁 $Bus]
     * @param  {[type]}   from [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    beforeRouteLeave(to, from, next) {
        if (to.name !== 'ssp-slot-edit') {
            this.$Bus.$off('editEmitEvent')
        }
        next()
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
