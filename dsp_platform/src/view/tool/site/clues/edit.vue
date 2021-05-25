<template>
    <div class="page-main">
        <Card dis-hover :bordered="false">
            <div class="page-detail-title clearfix">
                <h2>{{headTitle}}</h2>
                <div class="is-handler">
                    <Button class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
                </div>
            </div>
            <div class="alert-text">
                <p>1、填写以下信息，完成新建；</p>
                <p>2、完成新建后，可获取到对应的基础代码与转化代码，由技术人员完成添加代码的操作。</p>
            </div>

            <div class="edit-content-card">
                <Form style="width: 600px" :model="formBase" :label-colon="true" label-position="right" :label-width="labelWidth" :rules="ruleBase" ref="formBase">

                    <FormItem label="转化名称" prop="ssp_slot_name">
                        <Input maxlength="30" show-word-limit placeholder="请输入转化名称" v-model.trim="formBase.ssp_slot_name"></Input>
                    </FormItem>

                    <FormItem label="站点链接" prop="ssp_slot_name">
                        <Input maxlength="30" show-word-limit placeholder="请输入站点链接" v-model.trim="formBase.ssp_slot_name"></Input>
                    </FormItem>

                    <FormItem label="转化目标" prop="ssp_slot_name">
                        <CheckboxGroup v-model="formBase.ssp_slot_name">
                            <Checkbox label="页面访问"></Checkbox>
                            <Checkbox label="电话拨打"></Checkbox>
                            <Checkbox label="表单提交"></Checkbox>
                            <Checkbox label="商品购买"></Checkbox>
                            <Checkbox label="其他"></Checkbox>
                        </CheckboxGroup>
                    </FormItem>

                    <FormItem label="备注">
                        <Input type="textarea" maxlength="120" :rows="4" show-word-limit v-model.trim="formBase.ssp_slot_name"></Input>
                    </FormItem>
                </Form>
            </div>
        </Card>

        <div class="detail-save-card">
            <div class="detail-save-center" :style="`margin-left: ${labelWidth}px`">
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
import { showTitle, regWebUrl } from '@/libs/util'
import { updateSspSlot, getPlatformInfoApi } from '@/api/traffic'
import { inPageAccess } from '@/mixin/in-page-access.js'

export default {
    name: 'appEdit',
    mixins: [inPageAccess],
    data() {
        return {
            labelWidth: 86, // 左侧宽度
            appBaseData: {}, // app基本信息

            slot_id: this.$route.query.slot_id ? Number(this.$route.query.slot_id) : '', // 广告位编号
            ud_id: this.$route.query.ud_id ? Number(this.$route.query.ud_id) : '', // 广告位编号

            hasIdNoEdit: false, // 如果有id，不可编辑
            isDisabledChooseVideo: true, // 广告素材类型是否支持视频, 默认不可选
            appList: [], // 应用列表

            render_type_select: [], // 当前媒体可渲染方式
            curAdTypeList: [], // 广告样式
            filterSceneData: [], // 广告场景
            styleData: [], // 广告 样式

            formBase: {
                app_id: this.$route.query.appId ? Number(this.$route.query.appId) : '', // 应用ID
                ad_type_id: '', // 应用广告场景ID
                render_type: '', // 广告渲染方式
                creative_type: '', // 广告素材类型
                ad_material_type: [1], // 广告素材类型，1=图片，2=视频, 默认选择图片
                need_callback: -1, // 是否需要回调，-1=否，1=是
                callback_url: '', // 回调地址
                ad_image_url: '', // 上传广告位截图
                slot_support: [-1, -1, -1, -1, -1, -1, -1], // 广告位支持项，数组下标，0=一键下载，1=下载上报，2=安装上报，3=deeplink，4=deeplink上报，5=点击坐标上报, 6=支持从落地页中获取下载地址与参数, -1=不支持，1=支持
                response_duration: 0, // 响应速度，单位（毫秒）
                ssp_slot_name: '', // 广告位名称
                ex_slot_id: '' // 第三方slot_id
            },
            ruleBase: { // 正则
                app_id: [{
                    required: true,
                    message: '请选择应用'
                }],
                ad_type_id: [{
                    required: true,
                    message: '请选择广告场景'
                }],
                render_type: [{
                    required: true,
                    message: '请选择广告渲染方式'
                }],
                creative_type: [{
                    required: true,
                    message: '请选择广告样式'
                }],
                need_callback: [{
                    required: true,
                    message: '请选择奖励发放设置'
                }],
                callback_url: [{
                    required: true,
                    message: '请输入回调URL',
                    trigger: 'blur'
                }, {
                    pattern: regWebUrl,
                    message: '请输入合法的url地址',
                    trigger: 'blur'
                }],
                ad_image_url: [{
                    required: true,
                    message: '请上传广告位截图'
                }],
                ssp_slot_name: [{
                    required: true,
                    message: '请填写广告位名称',
                    trigger: 'blur'
                }]
            },

            submitClock: false, // 保存锁

            catchSelectScene: '', // 缓存选中的广告场景
            catchSelectStyle: '' // 缓存选中广告场景之后默认第一个广告样式
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        },
        /**
         * [isShowRender 选择广告渲染方式]
         * @return {Boolean} [description]
         */
        isShowRender() {
            // 1. 当前应用sdk模式(2) 并且 2.选择原生信息流(1)
            return this.formBase.ad_type_id == 1 && this.appBaseData.access_type == 2
        }
    },
    created() {
        // 判断是否有修改权限
        let resultArr = this._isPageShow()
        if(this._isSuperAdmin() || !!resultArr.includes('modify') || this._isSuperAdmin()) {
            // this.initData() // 初始化数据
        } else {
            this._gotoNoAccess()
        }
    },
    methods: {
        /**
         * [initData 初始化加载数据]
         * @return {[type]} [description]
         */
        initData() {

            
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

                    // 处理特殊情况
                    // 1(1), 如果应用为API, 则没有渲染方式
                    if(this.appBaseData.access_type == 1) {
                        form.render_type = 0
                    }

                    // 1(2)如果应用为SDK, 并且没有选择原生信息流
                    if(this.appBaseData.access_type == 2 && form.ad_type_id !== 1) {
                        form.render_type = 0
                    }

                    // 2. 广告素材 1. 默认选中图片，2选中视频
                    form.ad_material_type = form.ad_material_type.indexOf(2) > -1 ? 2 : 1;

                    // 3. 没有选择激励视频，清空 奖励发放设置
                    if(form.ad_material_type !== 5) {
                        form.need_callback = 0
                    }

                    // 4. 奖励发放设置不需要回调时， 清空 回调URL
                    if(form.need_callback !== 1) {
                        form.callback_url = ''
                    }

                    // 5. app_id 必须为init 类型
                    form.app_id = Number(form.app_id)

                    // 6 如果接入方式为sdk 删除 广告位属性 信息
                    if(this.appBaseData.access_type == 2) {
                        delete form.slot_support
                        delete form.response_duration
                    }

                    this.submitClock = true

                    updateSspSlot(form).then(res=> {
                        this.submitClock = false
                        if(res.code === 200) {
                            this.$Bus.$emit('editEmitEvent')
                            this.$Message.success({content: '保存成功', duration: 3})
                            this.goBack()
                        }
                    }, err=> {
                        this.submitClock = false
                    })
                }
            })
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
.alert-text
    padding: 10px 20px
    background: #F2F2F2
    border-radius: 2px
    p
        line-height: 2
</style>
