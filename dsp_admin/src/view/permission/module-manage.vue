<template>
    <div class="page-main">
        <div class="page-title page-has-line clearfix">
            <h2 class="title-line-tag">{{headTitle}}</h2>
            <div class="is-handler">
                <Button icon="ios-add" type="primary" @click="addNewModule()">新建模块</Button>
            </div>
        </div>
        <div class="data-nav-tab" slot="tab">
            <div class="tab-list" :class="target_platform_id === adminPlatformId ? 'active' : ''" @click="toggleNavTab(adminPlatformId)">管理平台模块管理</div>
            <div class="tab-list" :class="target_platform_id === advPlatformId ? 'active' : ''" @click="toggleNavTab(advPlatformId)">广告投放平台模块管理</div>
            <div class="tab-list" :class="target_platform_id === agentPlatformId ? 'active' : ''" @click="toggleNavTab(agentPlatformId)">代理商平台模块管理</div>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="console-table">
                <u-table
                    border
                    :height="700"
                    :data="moduleDataList"
                    :treeConfig="{
                        children: 'children',
                        iconClose: 'el-icon-folder-add',
                        iconOpen: 'el-icon-folder-remove',
                        expandAll: true
                    }"
                    use-virtual
                    row-id="id"
                    :data-changes-scroll-top="false"
                    stripe
                >

                    <!--模块名称-->
                    <u-table-column :tree-node="true" prop="name" label="模块名称" :width="220"/>

                    <!--排序权重-->
                    <u-table-column prop="weight" label="排序权重" :width="80"/>

                    <!--id-->
                    <u-table-column prop="id" label="id" :width="80"/>

                    <!--上级id-->
                    <u-table-column prop="parent_id" label="上级id" :width="80"/>

                    <!--route-->
                    <u-table-column prop="route" label="route" :width="180" v-slot="scope">
                        {{ scope.row.code }}
                    </u-table-column>

                    <!--API-->
                    <u-table-column prop="api" label="API" :min-width="350" v-slot="scope">
                        <span v-if="!scope.row.api || scope.row.api.length == 0"></span>
                        <Poptip v-else placement="right" trigger="click" popper-class="slot-contact-pop slot-api-pop" padding="8px" :width="340" :transfer="true">
                            <span style="cursor: pointer">{{ scope.row.api[0] }}</span>
                            <div class="slot-contact-card" slot="content">
                                <dl>
                                    <dt>API</dt>
                                    <dd v-for="item in scope.row.api" :key="item">
                                        {{item}}
                                    </dd>
                                </dl>
                            </div>
                        </Poptip>
                    </u-table-column>

                    <!--模块状态-->
                    <u-table-column prop="status" label="模块状态" :width="80" v-slot="scope">
                        {{ scope.row.status === 1 ? '启用' : '停用' }}
                    </u-table-column>

                    <!--模块类型-->
                    <u-table-column prop="type" label="模块类型" :width="80" v-slot="scope">
                        {{ scope.row.type === 1 ? '菜单' : '普通权限' }}
                    </u-table-column>

                    <!--菜单显示-->
                    <u-table-column prop="visible" label="菜单显示" :width="100" v-slot="scope">
                        {{ scope.row.visible === 1 ? '显示' : '隐藏' }}
                    </u-table-column>

                    <!--创建时间-->
                    <u-table-column prop="created_at" label="创建时间" :width="160" v-slot="scope">
                        {{ scope.row.created_at | timeFormat('yyyy-MM-dd HH:mm:ss') }}
                    </u-table-column>

                    <!--更新时间-->
                    <u-table-column prop="updated_at" label="更新时间" :width="160" v-slot="scope">
                        {{ scope.row.updated_at | timeFormat('yyyy-MM-dd HH:mm:ss') }}
                    </u-table-column>

                    <!--操作人-->
                    <u-table-column prop="operator_name" label="操作人" :width="100" v-slot="scope">
                        {{ scope.row.last_operator.account || '-'}}
                    </u-table-column>

                    <!--操作-->
                    <u-table-column prop="action" label="操作" :width="170" v-slot="scope" fixed="right">
                        <!-- 小于3级 -->
                        <Button v-if="scope.row.level < 3 && scope.row.model_type === 1" type="text" @click="addNewChildModule(scope.row)">新建子模块</Button>
                        <Button type="text" @click="updateModule(scope.row)">修改</Button>
                        <Button type="text" @click="deleteModule(scope.row)">删除</Button>
                    </u-table-column>
                </u-table>
                <Spin size="large" v-if="tableLoadFlag" fix></Spin>
            </div>
        </Card>

        <Drawer v-model="setModalFlag" width="600px" :mask-closable="false" :closable="false" :styles="drawStyles" class="custom-drawer">
            <div slot="header" class="draw-header clearfix">
                <div class="draw-header-title fl">
                    <h3>{{drawerTitle}}</h3>
                </div>
                <div class="draw-header-img fr">
                    <img src="~@/assets/image/colsImg.png">
                </div>
            </div>

            <Form ref="modalForm" label-position="right" :model="modalForm" :rules="modalFormRules" :label-width="100">
                <FormItem label="模块状态" prop="status">
                    <RadioGroup v-model="modalForm.status">
                        <Radio :label="1">启用</Radio>
                        <Radio :label="-1">停用</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="模块类型" prop="model_type">
                    <RadioGroup v-model="modalForm.model_type" @on-change="typeChange">
                        <Radio :label="1">菜单</Radio>
                        <Radio :label="2">普通权限</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="是否显示" prop="visible" v-if="modalForm.model_type === 1">
                    <RadioGroup v-model="modalForm.visible">
                        <Radio :label="1">显示</Radio>
                        <Radio :label="2">隐藏</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="排序权重" prop="weight">
                    <InputNumber :max="1000" :step="1" :min="0" v-model="modalForm.weight" placeholder="请输入0~1000的整数" style="width: 100%"></InputNumber>
                </FormItem>

                <!-- 上级code start -->
                <FormItem label="上级ID">
                    <Select v-model="modalForm.parent_id" placeholder="请选择上级ID(如果不选默认为一级模块)" :clearable="true" @on-change="parentIdChange" :disabled="modalForm.disabled">
                        <Option v-for="item in parentIdArr" :label="`${item.name}/${item.id}`" :value="item.id" :key="item.id">
                            <div class="option-box clearfix" :title="item.name">
                                <span class="option-left">{{ item.name }}</span>
                                <span class="option-right">ID: {{item.id}}</span>
                            </div>
                        </Option>
                    </Select>
                </FormItem>

                <!-- route -->
                <FormItem label="route" prop="route">
                    <Select v-model="modalForm.route" :clearable="true" placeholder="请选择路由，模块名称默认为路由名称">
                        <Option v-for="item in routeList" :label="`${item.name}/${item.route}`" :value="`${item.name}&${item.route}`" :key="item.route">
                            <div class="option-box clearfix" :class="!item.isFirstLevel ? 'indent' : ''">
                                <span class="option-left">{{ item.name }}</span>
                                <span class="option-right">route: {{item.route}}</span>
                            </div>
                        </Option>
                    </Select>
                </FormItem>

                <FormItem label="API" prop="apis">
                    <div v-for="(item, index) in modalForm.apis" :key="index" class="api-list">
                        <Row>
                            <Col span="5">
                                <Select placeholder="请求类型" v-model.trim="item.methods">
                                    <Option v-for="item in axiosMethods" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                            </Col>
                            <Col span="14" offset="1">
                                <Input type="text" maxlength="500" :clearable="true" v-model.trim="item.value"></Input>
                            </Col>
                            <Col span="3" offset="1" style="text-align: right">
                                <Button style="width: 40px" v-if="index == modalForm.apis.length - 1" @click="handleApiAdd(item,index)">+</Button>
                                <Button style="width: 40px" v-else @click="handleApiRemove(item,index)">-</Button>
                            </Col>
                        </Row>
                    </div>
                </FormItem>
            </Form>
            <div class="drawer-footer">
                <Button @click="toggleFormDraw()">取消</Button>
                <Button type="primary" :loading="submitClock" @click="submitAddModule('modalForm')">
                    {{!submitClock ? '确定' : '提交中...'}}
                </Button>
            </div>
            <Spin size="large" fix v-if="spinShow"></Spin>
        </Drawer>
    </div>
</template>

<script>
import { showTitle } from '@/libs/util'
import { formatDate } from '@/libs/tools'
import { addSysModule, getSysModule, delelteSysModule } from '@/api/permission'
import { asyncRouterMap } from '@/router/routers' // 管理平台
import { platAsyncRouterMap } from '@/router/module/platform-router' // 管理平台
import { agentAsyncRouterMap } from '@/router/module/agent-router' // 代理商平台
import { inPageAccess } from '@/mixin/in-page-access.js'

export default {
    name: 'moduleManage',
    mixins: [inPageAccess],
    data() {
        return {
            axiosMethods: [
                'GET',
                'PUT',
                'POST',
                'PATCH',
                'DELETE'
            ],
            noDataText: this.$config.noDataText,
            catchParentIdArr: [], // 上级id, 缓存使用
            catchRouteList: [], // 缓存导航code列表，以作备份使用

            target_platform_id: this.$config.platformId, // 当前nabType的平台
            adminPlatformId: this.$config.adminPlatformId, // 慧营管理平台id
            advPlatformId: this.$config.advPlatformId, // 广告投放平台id
            agentPlatformId: this.$config.agentPlatformId, // 代理商平台id

            moduleColumns: [
                {
                    title: '模块名称',
                    key: 'name',
                    minWidth: 200,
                    tree: true
                },
                {
                    title: '排序权重',
                    key: 'weight',
                    minWidth: 80
                },
                {
                    title: '上级id',
                    key: 'parent_id',
                    minWidth: 60
                },
                {
                    title: 'route',
                    key: 'code',
                    minWidth: 150
                },

                {
                    title: 'API',
                    slot: 'api',
                    minWidth: 200
                },
                {
                    title: '模块状态',
                    slot: 'status',
                    width: 80,
                    minWidth: 80
                },
                {
                    title: '模块类型',
                    slot: 'model_type',
                    width: 80,
                    minWidth: 80
                },
                {
                    title: '菜单显示',
                    slot: 'visible',
                    width: 100,
                    minWidth: 100
                },
                {
                    title: '创建时间',
                    slot: 'created_at',
                    width: 160
                },
                {
                    title: '更新时间',
                    slot: 'updated_at',
                    width: 160
                },
                {
                    title: '操作人',
                    slot: 'last_us_account',
                    width: 100
                },
                {
                    title: '操作',
                    slot: 'action',
                    fixed: 'right',
                    width: 160
                }
            ],

            moduleDataList: [], // table数据
            tableLoadFlag: true, // table的loading

            modalForm: { // 表单 抽屉
                weight: 1, // 权重
                route: '',
                status: 1, // 状态, 1=正常, -1=停用
                model_type: 1, // 模块类型, 1=菜单, 2=普通权限
                visible: 1, // 是否可见, 1=可见, -1=不可见
                model_id: '', // 模块id
                parent_id: '', // 上级id
                apis: [{
                    methods: '',
                    value: ''
                }]
            },
            modalFormRules: { // 表單正則
                weight: [{required: true, message: '请输入排序权重'}],
                route: [{required: true, message: '请选择当前route'}],
                apis: [{required: false, message: '请填写正确的api'}],
                status: [{required: true, message: '请选择模块状态'}],
                model_type: [{required: true, message: '请选择模块类型'}],
                visible: [{required: true, message: '请选择模块是否显示'}]
            },
            submitClock: false, // 保存锁
            spinShow: false,
            setModalFlag: false, // 抽屉开关

            drawerTitle: '', // 抽屉标题

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
        },
        /**
         * [routeList 新建 route列表]
         * @return {[type]} [description]
         */
        routeList() {
            if (this.modalForm.model_type === 1) { // 如果选择菜单， 则routeList 为 路由列表
                return this.catchRouteList
            } else if (this.modalForm.model_type === 2) { // 如果选择普通权限
                if (!!this.modalForm.parent_id) {
                    const result = this.catchParentIdArr.filter(item => {
                        return item.id === this.modalForm.parent_id
                    })

                    return result.length ? this.codeGetInpageAccess(result[0].route) : [] // 根据parent_id 反推 获取 [view, update...]

                } else {
                    return []
                }
            }
        },
        /**
         * [parentIdArr 父级id]
         * @return {[type]} [description]
         */
        parentIdArr() {
            return this.catchParentIdArr
        }
    },
    filters: {
        timeFormat(time, format) {
            return formatDate(time * 1000, format)
        }
    },
    created() {
        if (this._hasPageAccess()) {
            this.initData()
        }
    },
    methods: {
        /*
        新建模块逻辑记录
        1. 模块类型分为菜单1,普通权限2。
            1.1 选择菜单(必然为导航)，匹配上级code(非必填)
                1.1.1 选择上级code: 二级导航
                1.1.2 不选择上级code: 一级导航
            1.2 普通权限(页面内权限)，必须选择上级code
                1.2.1 选择上级code-> 选择code[查看，封禁...]
        */

        /**
         * [initData 初始化加载]
         * @return {[type]} [description]
         */
        initData() {
            this.getSysModule()
            this.formatRouteList() // 获取导航list的code
        },
        /**
         * [getSysModule 获取列表的信息]
         * @return {[type]} [description]
         */
        getSysModule() {
            this.tableLoadFlag = true
            getSysModule({platform_id: this.$config.platformId, target_platform_id: this.target_platform_id}).then(res => {
                this.tableLoadFlag = false
                if (res.code === 200) {
                    this.catchParentIdArr = !!res.data.list ? this.getAllModuleId(res.data.list) : []
                    this.moduleDataList = !!res.data.list ? this.setModuleDataFormat(res.data.list, 1) : []
                } else if (res.code === 403) {
                    this.noDataText = this.$config.noDataTextPer
                }
            }, err=> {
                if (err.code === 403) {
                    this.noDataText = this.$config.noDataTextPer
                }
                this.tableLoadFlag = false
            })
        },

        /**
         * [setModuleDataFormat 格式化模块数据，并且做递归遍历，]
         * [如果当前有children加上_showChildren， 可以展开]
         * @param {[type]} arr [description]
         */
        setModuleDataFormat(arr, level) {
            if (arr.length === 0) {
                return []
            }

            let tempArr = []

            arr.map(item=> {
                item._showChildren = true
                item.level = level
                // 处理api
                item.api = (item.api === 'null' || !item.api) ? [] : JSON.parse(item.api)

                if(!!item.sub_models && item.sub_models.length) {
                    let _index = level
                    item.children = this.setModuleDataFormat(item.sub_models, ++_index)
                }

                tempArr.push(item)
            })

            return tempArr
        },

        /**
         * [getAllModuleId 获取所有模块的id， 在创建时做parend_id使用]
         * @return {[type]} [description]
         */
        getAllModuleId(arr) {

            if (arr.length === 0) {
                return
            }

            let tempIdArr = []

            arr.map(item => {
                tempIdArr.push({
                    route: item.code,
                    id: item.id,
                    name: item.name
                })

                if(!!item.sub_models && item.sub_models.length) {
                    tempIdArr = tempIdArr.concat(this.getAllModuleId(item.sub_models))
                }
            })

            return tempIdArr
        },

        /**
         * [formatRouteList 获取路由列表]
         * @return {[type]} [description]
         */
        formatRouteList() {
            let tempArr = []
            let _mapRouterArr = []

            switch (this.target_platform_id) {
                case 3: // 管理平台
                    _mapRouterArr = asyncRouterMap
                    break
                case 2: // 投放平台
                    _mapRouterArr = platAsyncRouterMap
                    break
                case 4: // 代理商平台
                    _mapRouterArr = agentAsyncRouterMap
                    break
            }

            _mapRouterArr.map(item => {

                // 当前路由下只有一个
                if (item.children && item.children.length === 1 && !!item.children[0].meta.isShowAccess) {
                    tempArr.push({
                        isFirstLevel: true, // 是否为第一层级，在创建是区分route
                        meta: item.children[0].meta,
                        route: item.children[0].name,
                        name: item.children[0].meta.title
                    })
                }

                // 2. 例如流量管理，需要写入一级下拉
                if (item.children && item.children.length > 1) {

                    tempArr.push({
                        isFirstLevel: true, // 是否为第一层级，在创建是区分route
                        meta: item.meta,
                        route: item.name,
                        name: item.meta.title
                    })

                    item.children.map(child => {
                        if (child.meta && !!child.meta.isShowAccess) {
                            tempArr.push({
                                isFirstLevel: false, // 是否为第一层级，在创建是区分route
                                meta: child.meta,
                                route: child.name,
                                name: child.meta.title
                            })
                        }
                    })
                }
            })

            this.catchRouteList = tempArr
        },

        /**
         * [typeChange 模块类型 发生改变 清空 route的值]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        typeChange(value) {
            this.modalForm.route = ''
        },

        /**
         * [parentIdChange 上级id发生变化时，清空route]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
        parentIdChange(value) {
            this.modalForm.route = ''
        },

        /**
         * [codeGetInpageAccess 根据name反推获取页面权限]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        codeGetInpageAccess(name) {

            const result = this.catchRouteList.filter(item=> {
                return item.route === name
            })

            let _arr = []

            if (result.length && !!result[0].meta && !!result[0].meta.inPageAccess) {

                let _inObj = result[0].meta.inPageAccess

                for (let i in _inObj) {
                    _arr.push({
                        name: _inObj[i],
                        route: i
                    })
                }
            }

            return _arr
        },
        /**
         * [submitAddModule 新建/编辑第三方平台账号信息]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        submitAddModule(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {

                    let _modalForm = {...this.modalForm}

                    // 拆分路由
                    let routeSplite = _modalForm.route.split('&')

                    let params = {
                        platform_id: this.$config.platformId,
                        target_platform_id: this.target_platform_id,
                        name: routeSplite[0],
                        status: _modalForm.status,
                        model_type: _modalForm.model_type,
                        visible: _modalForm.model_type === 2 ? 2 : _modalForm.visible, // 普通权限必隐藏
                        weight: _modalForm.weight,
                        code: routeSplite[1]
                    }

                    // 父级id
                    params.parent_id = !!_modalForm.parent_id ? _modalForm.parent_id : 0

                    // 如果存在api
                    if(_modalForm.apis.length) {
                        let apis = []
                        _modalForm.apis.map(item=> {
                            if(!!item.value) {
                               apis.push(`${item.methods}:${item.value}`)
                            }
                        })

                        if (apis.length) {
                            params.apis = apis
                        }
                    }

                    // 如果有id，则为修改， 否则为新增
                    if(!!_modalForm.model_id) {
                        params.model_id = _modalForm.model_id
                    }


                    this.submitClock = true

                    addSysModule(params).then(res => {

                        this.submitClock = false

                        if (res.code === 200) {
                            this.setModalFlag = false
                            this.$Message.success({ content: !!params.model_id ? '修改成功' :'创建成功' , duration: 3})
                            this.getSysModule()
                        } else {
                            this.$Message.error({ content: !!params.model_id ? '保存失败，请重试' : '新建失败，请重试', duration: 3})
                        }
                    }, err=> {
                        this.submitClock = false
                    })
                }
            })
        },

        /**
         * [addNewModule 新建模块]
         */
        addNewModule() {
            // this.resetModelForm() // 重置

            this.drawerTitle = '新建模块'
            this.setModalFlag = true
        },

        /**
         * [addNewChildModule 新添加子模块]
         * @param {[type]} row [description]
         */
        addNewChildModule(row) {

            this.resetModelForm() // 重置

            this.modalForm.parent_id = row.id
            this.modalForm.disabled = true

            this.drawerTitle = '新建子模块'
            this.setModalFlag = true
        },

        /**
         * [updateModule 修改模块]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        updateModule(row) {
            let _apiArr = []

            if(row && row.api && row.api.length) {
                row.api.map(item=> {
                    let _split = item.split(':')
                    _apiArr.push({
                        methods: _split[_split.length - 2],
                        value: _split[_split.length - 1]
                    })
                })
            } else {
                _apiArr.push({
                    methods: '',
                    value: ''
                })
            }

            this.modalForm = { // 表单 抽屉
                model_id: row.id,
                status: row.status, // 状态, 1=正常, -1=停用
                model_type: row.model_type, // 类型, 1=菜单, 2=普通权限
                visible: row.visible, // 是否可见, 1=可见, -1=不可见
                weight: row.weight, // 权重
                parent_id: row.parent_id,
                route: `${row.name}&${row.code}`, // route
                apis: _apiArr // api数组
            }

            this.drawerTitle = row.level === 1 ? '修改模块' : '新建子模块'
            this.setModalFlag = true
        },

        /**
         * [deleteModule 删除模块]
         * @param  {[type]} row [description]
         * @return {[type]}     [description]
         */
        deleteModule(row) {
            this.$Modal.confirm({
                title: '如果删除当前模块，其下所有子模块默认删除，并立即生效，确认删除么？',
                content: '',
                onOk: () => {
                    delelteSysModule({
                        model_id: [row.id],
                        platform_id: this.$config.platformId
                    }).then(res => {
                        if (res.code === 200) {
                            this.getSysModule()
                            this.$Message.success({ content: '删除成功', duration: 3})
                        }
                    })
                },
                onCancel: res => {
                    console.log(res)
                }
            })
        },

        /**
         * [cancelSubmit form表单 重置]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        toggleFormDraw(name) {
            this.setModalFlag = !this.setModalFlag
            this.resetModelForm() // 重置
        },
        /**
         * [resetModel 重置抽屉数据]
         * @return {[type]} [description]
         */
        resetModelForm() {
            this.setModalFlag = false
            this.drawerTitle = ''

            this.modalForm = { // 表单 抽屉
                weight: 1, // 权重
                route: '',
                status: 1, // 状态, 1=正常, -1=停用
                model_type: 1, // 模块类型, 1=菜单, 2=普通权限
                visible: 1, // 是否可见, 1=可见, -1=不可见
                model_id: '', // 模块id
                parent_id: '', // 上级id
                apis: [{
                    methods: '',
                    value: ''
                }]
            }
        },
        /**
         * [handleApiRemove API 添加]
         * @param  {[type]} item [description]
         * @param  {[type]} index [索引]
         * @return {[type]}      [description]
         */
        handleApiRemove(item, index) {
            this.modalForm.apis.splice(index, 1)
        },
        /**
         * [handleApiAdd API 删除]
         * @param  {[type]} item [description]
         * @param  {[type]} index [索引]
         * @return {[type]}      [description]
         */
        handleApiAdd(item, index) {
            this.modalForm.apis.push({
                methods: '',
                value: ''
            })
        },
        /**
         * [toggleNavTab 切换平台]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        toggleNavTab(id) {
            this.target_platform_id = id

            this.initData()
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.option-box
    &.indent
        padding-left: 14px
        .option-left
            color: #777
    .option-left
        text-overflow: ellipsis
        white-space: nowrap
        height: 20px
        line-height: 20px
        overflow: hidden
        float: left
        width: 160px
    .option-right
        float: right
        color: #ccc
        height: 20px
        line-height: 20px
.slot-contact-card
    dl
        word-break: word-break
        white-space: normal
        dt
            font-size: 12px
            font-weight: bold
            line-height: 20px
            margin-bottom: 6px
        dd
            margin-top: 4px
            display: flex
            font-size: 12px
            .dd-title
                width: 182px
                flex: 0 0 182px
                line-height: 16px
                font-size: 12px
            .dd-id
                width: 100px
                flex: 0 0 100px
                line-height: 16px
                font-size: 12px
                color: #999
                text-align: right
            .iconfont
                flex: 0 0 20px
                text-align: right
                line-height: 16px
                font-size: 12px
                color: #4083F8
                transform: scale(0.6)
.api-list
    margin-bottom: 20px
</style>
