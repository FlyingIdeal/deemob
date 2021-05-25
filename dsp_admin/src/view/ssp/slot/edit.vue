<template>
    <div class="page-main">
        <div class="edit-content-card">
            <div class="page-detail-title clearfix">
                <h2>{{slotId ? '编辑广告位':'新建广告位'}}</h2>
                <!-- <div class="is-handler">
                    <Button @click="goBack()" class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
                </div> -->
            </div>
            <div class="clearfix">
                <Form :model="formBase" :label-colon="true" label-position="right" :label-width="156" :rules="ruleBase" ref="formBase">
                    <FormItem label="选择媒体名称" prop="ssp_id">
                        <div class="item-center">
                            <Select
                                v-model="formBase.ssp_id"
                                @on-change="sspIdChange"
                                placeholder="选择媒体名称">
                                <Option v-for="item in sspList" :value="item.id" :key="item.id">{{ item.name }}({{ item.id }})</Option>
                            </Select>
                        </div>
                    </FormItem>

                    <FormItem label="选择应用名称" prop="app_id">
                        <div class="item-center">
                            <Select
                                v-model="formBase.app_id"
                                @on-change="appIdChange"
                                placeholder="选择应用名称">
                                <Option v-for="item in sspAppList" :value="item.id" :key="item.id">{{ item.app_name }}({{ item.id }})</Option>
                            </Select>
                        </div>
                    </FormItem>

                    <FormItem label="选择广告场景" prop="slot_scene">
                        <div class="item-center">
                            <Select
                                v-model="formBase.slot_scene"
                                clearable
                                :transfer="true"
                                @on-change="slotSceneChange"
                                :disabled="hasIdNoEdit"
                                placeholder="选择广告场景">
                                <Option v-for="item in adSceneList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                            </Select>
                        </div>
                    </FormItem>

                    <FormItem label="选择广告样式" prop="slot_type">
                        <div class="item-center">
                            <Select
                                v-model="formBase.slot_type"
                                clearable
                                :transfer="true"
                                @on-change="slotTypeChange"
                                :disabled="hasIdNoEdit"
                                placeholder="选择广告样式">
                                <Option v-for="item in adStyleList" :value="item.id" :key="item.id">{{ item.title }}</Option>
                            </Select>
                        </div>
                    </FormItem>

                    <FormItem label="填写广告位名称" prop="slot_name">
                        <div class="item-center">
                            <Input maxlength="30" show-word-limit placeholder="请填写广告位名称" v-model.trim="formBase.slot_name"></Input>
                        </div>
                    </FormItem>

                    <FormItem label="填写别名" prop="alias">
                        <div class="item-center">
                            <Input maxlength="30" show-word-limit placeholder="请填写别名" v-model.trim="formBase.alias"></Input>
                        </div>
                    </FormItem>

                    <!-- 奖励发放设置 激励视频广告才显示 -->
                    <FormItem label="奖励发放设置" prop="need_callback" v-if="formBase.slot_type === 310">
                        <div class="item-center">
                            <RadioGroup v-model="formBase.need_callback">
                                <Radio class="check-label" v-for="item in needCallbackArr" :label="item.id" :key="item.id">{{item.name}}</Radio>
                            </RadioGroup>
                        </div>
                    </FormItem>

                    <FormItem label="填写回调URL" prop="callback_url" v-if="formBase.slot_type === 310 && formBase.need_callback === 1">
                        <div class="item-center">
                            <Input maxlength="10000" placeholder="请填写回调URL" v-model.trim="formBase.callback_url"></Input>
                        </div>
                    </FormItem>


                    <FormItem label="是否是测试广告位" prop="is_test_slot">
                        <!-- 是否为测试广告位 0否 1是 -->
                        <RadioGroup v-model="formBase.is_test_slot">
                            <Radio class="check-label" v-for="item in isTestSlotArr" :label="item.id" :key="item.id">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>

                    <FormItem label="选择广告位素材尺寸" prop="material_size" v-if="formBase.slot_type">
                        <div class="item-center">
                            <RadioGroup v-model="formBase.material_size" @on-change="materialSizeChange">
                                <Radio class="check-label" v-for="item in materialSizeArr" :label="item" :key="item" :disabled="hasIdNoEdit"></Radio>
                            </RadioGroup>
                            <Spin fix v-if="materialLoad"></Spin>
                        </div>
                    </FormItem>

                    <FormItem label="选择素材类型" prop="material_type" v-if="formBase.slot_type">
                        <div class="item-center">
                            <CheckboxGroup v-model="formBase.material_type">
                                <Checkbox class="check-label" :label="1" :disabled="isDisabledPhoto" v-show="!isDisabledPhoto">图片</Checkbox><Checkbox class="check-label" :label="2" :disabled="isDisabledVideo" v-show="!isDisabledVideo">视频</Checkbox>
                            </CheckboxGroup>
                        </div>
                    </FormItem>

                    <!-- 是否是RTA类型 -->
                    <!-- is_rta: 1是rta类型; 0否 -->
                    <FormItem prop="is_rta">
                        <label slot='label'>
                            是否是RTA类型
                            <Tooltip placement="top" max-width="260">
                                <i class="iconfont icon-why"></i>
                                <div slot="content">RTA类型指该广告位仅可用作RTA投放</div>
                            </Tooltip>
                            :
                        </label>

                        <RadioGroup v-model="formBase.is_rta" @on-change="isRtaChange">
                            <Radio class="check-label" v-for="item in isRta" :label="item.id" :key="item.id" :disabled="hasIdNoEdit">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>

                    <!-- 如果当前代理商是RTA类型，此处显示RTA合作方选项且必填，否则隐藏 -->
                    <!-- is_rta: 1是; 0否 -->
                    <FormItem label="RTA合作方" prop="rta_id" v-if="formBase.is_rta === 1">
                        <RadioGroup v-model="formBase.rta_id">
                            <Radio v-for="item in rtaList" :label="item.id" :key="item.id" :disabled="hasIdNoEdit">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>

                </Form>
            </div>
        </div>
        <div class="detail-save-card">
            <div class="detail-save-center">
                <Button @click="goBack">取消</Button>
                <Button type="primary" :loading="submitClock" @click="submitFormData('formBase')">
                    <span v-if="!submitClock">提交</span>
                    <span v-else>提交中...</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
import { getCreativeTypeRatio } from '@/api/common.js'
import { formatDate } from '@/libs/tools'
import { inputMaxNumber } from '@/libs/util'
import { getSspSlotList, getSspAppList, getSspList, addNewSspSlot, modifySspSlot } from '@/api/ssp.js'
import { formRules } from './slot-edit-rules.js' // 正则校验
import { inPageAccess } from '@/mixin/in-page-access.js'
import { mapGetters, mapActions } from 'vuex'

export default {
    mixins: [formRules, inPageAccess],
    data() {
        return {
            InputNumber: inputMaxNumber, // 上限 亿
            slotId: this.$route.query.slotId || '', // 创意Id
            hasIdNoEdit: false, // 编辑清空下不可再编辑
            sspList: [], // 媒体列表
            sspAppList: [], // 应用列表
            adStyleList: [], // 广告样式
            materialSizeArr: [], // 选择广告位素材尺寸列表
            materialLoad: false, // 素材加载loading
            catchSsp: '', // 缓存选中的媒体，设置广告位名称中使用
            catchSspApp: '', // 缓存选中的应用，设置广告位名称中使用
            catchSlotScene: '', // 缓存选中的广告场景，设置广告位名称中使用
            catchSlotStyle: '', // 缓存选中的广告样式，设置广告位名称中使用
            isDisabledPhoto: false, // 素材类型图片
            isDisabledVideo: false, // 素材类型视频
            slotPriceType: [ // 广告位计费类型
                {
                    id: 0,
                    name: 'CPM'
                },
                {
                    id: 1,
                    name: 'CPC'
                }
            ],

            formBase: {
                ssp_id: '', // 媒体ID
                app_id: '', // 应用ID
                slot_scene: '', // 广告场景
                slot_type: '', // 广告样式
                slot_name: '', // 广告位名称
                alias: '', // 广告位别名
                material_size: '', // 素材尺寸
                width: '', // 宽
                height: '', // 高
                material_type: [], // 素材类型, 1=图片, 2=视频, 3=图片&视频, 使用二进制表示, 第一位是图片, 第二位是视频
                is_test_slot: 0, // 是否为测试广告位 0否 1是
                is_rta: 0, // 是否是RTA类型 1是rta类型; 0否
                rta_id: '', // RTA合作方id
                need_callback: 0, // 是否需要回调 0:否 1:是
                callback_url: '' // 回调链接，激励视频广告等广告类型的回调链接
            },
            rtaList: [], // rta列表
            submitClock: false, // 保存锁
            needCallbackArr: [
                // 是否需要回调 0:否 1:是
                {
                    id: 0,
                    name: '不需要回调'
                },
                {
                    id: 1,
                    name: '需要回调'
                }
            ]
        }
    },

    computed: {
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
        // 判断是否有修改权限
        let resultArr = this._isPageShow()

        if(resultArr.includes('newAndEdit')) {
            this.initData() // 初始化数据
        } else {
            this._gotoNoAccess()
        }
    },
    methods: {
        ...mapActions([
            'getRtaList'
        ]),
        /**
         * [initData 初始化加载]
         * @return {[type]} [description]
         */
        async initData() {
            // 1. 获取媒体列表
            let promiseArr = [
                getSspList({page_num: 1})
            ]

            // 2. 如果有slotId 需要获取详情
            if(!!this.slotId) {
                promiseArr.push(getSspSlotList({slot_id_arr: [this.slotId]}))

                this.hasIdNoEdit = true
            }

            // 3. 判断是否为rta类型
            let storeUser = this.$store.state.user
            this.rtaList = storeUser.rtaList.length ? storeUser.rtaList : await this.getRtaList()

            this.$Spin.show()

            Promise.all(promiseArr).then(res=> {
                if(res[0].code === 200) {
                    this.sspList = res[0].data.list || []
                }

                if(res[1] && res[1].code === 200) {
                    this.setSspSlotData(res[1].data.list[0])
                }
            }).then(()=> {
                // 公共接口请求之后再做的事情
                this.afterToDo()
            })
        },
        /**
         * [afterToDo description]
         * @return {[type]} [description]
         */
        afterToDo() {
            if(!!this.slotId) {
                this.getSspAppList() // 列出当前媒体下的所有应用

                this.getSlotStyle() // 根据广告场景筛选出广告样式列表
                this.getMateriaSize() // 根据广告样式筛选出广告素材列表
            } else {
                this.$Spin.hide()
            }
        },
        /**
         * [setSspSlotData 广告位数据]
         * @param {[type]} data [description]
         */
        setSspSlotData(data) {
            this.formBase = {
                ssp_id: data.ssp_id, // 媒体ID
                app_id: data.app_id, // 应用ID
                slot_id: data.slot_id, // 广告位id
                slot_scene: this.styleToScene(data.slot_type), // 广告场景
                slot_type: data.slot_type, // 广告样式
                slot_name: data.slot_name, // 广告位名称
                alias: data.alias, // 广告位别名
                material_size: `${data.creative_width}:${data.creative_height}`, // 素材尺寸
                width: data.creative_width, // 宽
                height: data.creative_height, // 高
                material_type: data.material_type === 3 ? [1, 2] : [data.material_type], // 素材类型, 1=图片, 2=视频, 3=图片&视频, 使用二进制表示, 第一位是图片, 第二位是视频
                is_test_slot: data.is_test_slot || 0,
                is_rta: data.rta_id > 0 ? 1 : 0,
                rta_id: data.rta_id > 0 ? data.rta.id : '',
                need_callback: data.need_callback || 0,
                callback_url: data.callback_url || '',
                status: data.status
            }

            this.catchSlotStyleFn() // 缓存广告样式。 可判断当前素材类型可选
        },
        /**
         * [styleToScene 根据广告样式反显广告场景]
         * @param  {[type]} styleId [description]
         * @param  {[type]} sceneId [如果存在场景id,则用场景id，如果没有则用样式反推]
         * @return {[type]}         [description]
         */
        styleToScene(styleId) {
            try {
                let styleArr = this.$store.state.app.adStyleData
                let sceneArr = this.$store.state.app.adSceneData

                let result = styleArr.filter(item => item.id === styleId)[0]
                let sceneResult = sceneArr.filter(child => child.id === result.parentId)[0]

                return sceneResult.id
            } catch (e) {
                console.log(e)
            }
        },
        /**
         * [submitSet 提交表单]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        submitFormData(name) {


            this.$refs[name].validate((valid) => {
                if (valid) {

                    let form = {...this.formBase}

                    // 1. 处理尺寸
                    delete form.material_size

                    // 2.素材类型 - > 转2进制
                    form.material_type = form.material_type[0] | form.material_type[1]

                    // 5. 非RTA类型，清除 rta_id, is_rta: 1是rta类型; 0否
                    if(!form.is_rta) {
                        delete form.rta_id
                    }

                    // 6. 非激励视频的情况下，清除回调
                    if(form.slot_type !== 310) {
                        form.need_callback === 0
                    }

                    // 7. 非回调，清空回调url
                    if(form.need_callback === 0) {
                        form.callback_url = ''
                    }

                    // 8. 非编辑的情况下，删除status
                    if(!this.slotId) {
                        delete form.status
                    }

                    this.submitClock = true

                    let proUrl = !!this.slotId ? modifySspSlot(form) : addNewSspSlot(form)

                    proUrl.then(res=> {
                        this.submitClock = false
                        if(res.code === 200) {

                            this.$Bus.$emit('editEmitEvent') // 列表数据刷新

                            this.$Message.success({content: form.slotId ? '修改成功' : '保存成功', duration: 3})
                            this.goBack()
                        }
                    }, err=> {
                        this.submitClock = false
                    })
                }
            })
        },
        /**
         * [getSspAppList 获取当前媒体下的所有应用列表]
         * @return {[type]} [根据formBase.ssp_id，筛选出当前条件下的app]
         */
        getSspAppList() {
            getSspAppList({ssp_id_arr: this.formBase.ssp_id}).then(res=> {
                
                this.$Spin.hide()

                if (res.code === 200) {
                    this.sspAppList = res.data.list
                }
            })
        },
        /**
         * [sspIdChange 当选中的媒体名称发生变化时]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        sspIdChange(id) {
            // 1. 清空应用名称
            this.formBase.app_id = ''

            // 2. 缓存当前选中的媒体
            let result = this.sspList.filter(item=> {
                return item.ssp_id === id
            })[0]
            this.catchSsp = result

            //3. 筛选应用列表
            this.getSspAppList()

        },
        /**
         * [appIdChange 应用名称发生变化]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        appIdChange(id) {
            // 1. 缓存当前选中的应用
            let result = this.sspAppList.filter(item=> {
                return item.id === id
            })[0]
            this.catchSspApp = result

            // 设置广告位名称
            this.setSlotName()
        },
        /**
         * [slotSceneChange 广告场景发生变化]
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        slotSceneChange() {
            // 1. 清空广告样式
            this.formBase.slot_type = ''

            // 2. 缓存当前的广告场景
            let _sceneArr = this.$store.state.app.adSceneData
            let result = _sceneArr.filter(item=> {
                return item.id === this.formBase.slot_scene
            })[0]
            this.catchSlotScene = result

            // 2. 筛选出广告样式
            this.getSlotStyle()

            // 3.设置广告位名称
            this.setSlotName()
        },
        /**
         * [getSlotStyle 根据广告场景筛选出广告样式列表]
         * @return {[scentId]} [传入的广告场景id]
         * @return {[type]} [description]
         */
        getSlotStyle() {
            let _styleArr = this.$store.state.app.adStyleData

            let _arr = _styleArr.filter(item=> {
                return item.parentId === this.formBase.slot_scene
            })

            this.adStyleList = _arr
        },
        /**
         * [slotTypeChange 广告样式发生变化]
         * [style_id 根据广告样式，]
         * @return {[type]} [description]
         */
        slotTypeChange() {
            // 1. 清空广告位素材尺寸
            this.formBase.width = ''
            this.formBase.height = ''
            this.formBase.material_size = ''
            this.formBase.material_type = []
            this.materialSizeArr = []

            // 2. 根据广告样式筛选出尺寸列表
            this.getMateriaSize()

            // 3. 缓存广告样式
            this.catchSlotStyleFn()

            // 4.设置广告位名称
            this.setSlotName()
        },
        /**
         * [catchSlotStyleFn 缓存广告样式]
         * @return {[type]} [description]
         */
        catchSlotStyleFn() {

            // 操作顺序：1.选择场景-》选择样式=》再选择广告场景
            if(!this.formBase.slot_type) {
                return
            }

            let _sceneArr = this.$store.state.app.adStyleData
            let result = _sceneArr.filter(item=> {
                return item.id === this.formBase.slot_type
            })[0]

            if (!!result) {
                this.catchSlotStyle = result

                this.judgeImgAndVideo() // 判断当前素材是否可选
            }
            
        },
        /**
         * [getMateriaSize 获取素材尺寸]
         * @return {[type]} [description]
         */
        getMateriaSize() {
            this.materialLoad = true

            getCreativeTypeRatio({creative_type_id_arr: this.formBase.slot_type}).then(res=> {
                if(res.code === 200) {
                    this.materialLoad = false

                    let _arr = []
                    res.data.ratios.map(item=> {
                        _arr.push(`${item.width}:${item.height}`)
                    })

                    this.materialSizeArr = _arr
                }
            })
        },
        /**
         * [judgeImgAndVideo 判断当前素材是否可选，图片/视频]
         * @return {[type]} [description]
         */
        judgeImgAndVideo() {
            let _style = this.catchSlotStyle

            // 2. 判断是否支持视频或者图片
            this.isDisabledPhoto = !_style.sdkAttr.photo
            this.isDisabledVideo = !_style.sdkAttr.video
        },
        /**
         * [materialSizeChange 广告位素材尺寸变化]
         * @return {[type]} [description]
         */
        materialSizeChange(val) {
            // 1. 
            this.formBase.material_size = val
            let size = val.split(':')

            this.formBase.width = Number(size[0])
            this.formBase.height = Number(size[1])
        },

        /**
         * [setSlotName 在新创建时，自动生成名称]
         * @return {[type]} [description]
         */
        setSlotName() {
            if (!!this.slotId || !this.catchSspApp || !this.catchSlotScene || !this.catchSlotStyle) {
                return
            }

            this.formBase.slot_name = `${this.catchSspApp.app_name}-${this.catchSlotScene.title}-${this.catchSlotStyle.title}-${formatDate(new Date(), 'HH:mm:ss')}`
        },
        /**
         * [isRtaChange 切换 是否是RTA类型]
         * @param  {[type]}  val [是，默认选中大海航]
         * @return {Boolean}     [description]
         */
        isRtaChange(val) {
            if(!!val) {}

            this.formBase.rta_id = !!val ? this.rtaList[0].id : 0
        },
        /**
         * [goBack 返回上一页]
         * @return {[type]} [description]
         */
        goBack() {
            this.$router.back(-1)
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.item-center
    width: 500px
.item-packet
    display: flex
    p.packet-tips
        font-size: 12px
        font-weight: 500
        color: #999999
        margin-left: 10px
.bid-number
    width: 100%
.edit-content-card
    min-height: calc(100vh - 150px)
.item-flex
    display: flex
    justify-content: space-between
    /deep/ > .ivu-form-item
        width: 245px
.check-label
    min-width: 70px
    margin-right: 14px
</style>
