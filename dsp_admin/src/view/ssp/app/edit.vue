<template>
    <div class="page-main">
        <div class="edit-content-card">
            <div class="page-detail-title clearfix">
                <h2>{{appId ? '编辑应用' : '新建应用'}}</h2>
                <!-- <div class="is-handler">
                    <Button @click="goBack()" class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
                </div> -->
            </div>
            <div class="clearfix">
                <Form :model="formBase" :label-colon="true" label-position="right" :label-width="190" :rules="ruleBase" ref="formBase">
                    <FormItem label="选择媒体名称" prop="ssp_id">
                        <div class="item-center">
                            <Select
                                v-model="formBase.ssp_id"
                                placeholder="选择媒体名称">
                                <Option v-for="item in sspList" :value="item.id" :key="item.id">{{ item.name }}({{ item.id }})</Option>
                            </Select>
                        </div>
                    </FormItem>

                    <!-- 选择应用平台和应用商店 -->
                    <FormItem label="选择应用平台和应用商店" class="ivu-form-item-required">
                        <div class="item-center item-flex">
                            <FormItem prop="os_type">
                                <Select v-model="formBase.os_type" placeholder="应用平台" @on-change="ostypeChange">
                                    <Option v-for="item in osType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="app_store_id">
                                <Select v-model="formBase.app_store_id" placeholder="应用商店">
                                    <Option v-for="item in appStoreList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </FormItem>

                    <FormItem label="填写应用包名" prop="package_name">
                        <div class="item-packet">
                            <div class="item-center">
                                <Input placeholder="填写包名必须与广告请求的包名一致，否则影响收益" maxlength="50" v-model.trim="formBase.package_name"></Input>
                            </div>
                            <p class="packet-tips">我们验证包名的唯一性，请求时只验证主包名</p>
                        </div>
                    </FormItem>

                    <FormItem label="填写应用名称" prop="app_name">
                        <div class="item-center">
                            <Input maxlength="30" show-word-limit placeholder="请填写与应用商店一致的应用名称" v-model.trim="formBase.app_name"></Input>
                        </div>
                    </FormItem>

                    <FormItem label="填写别名" prop="alias">
                        <div class="item-center">
                            <Input maxlength="30" show-word-limit placeholder="请填写填写别名" v-model.trim="formBase.alias"></Input>
                        </div>
                    </FormItem>

                    <FormItem label="选择应用类型" class="ivu-form-item-required">
                        <div class="item-center item-flex">
                            <FormItem prop="app_type_one">
                                <Select v-model="formBase.app_type_one" placeholder="应用类型" @on-change="appTypeOneChange">
                                    <Option v-for="item in industryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="app_type_two">
                                <Select v-model="formBase.app_type_two" placeholder="应用类别">
                                    <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </FormItem>

                    <FormItem label="填写应用关键字">
                        <div class="item-center">
                            <Input maxlength="60" show-word-limit placeholder="多个关键词请用英文逗号隔开" v-model.trim="formBase.keywords"></Input>
                        </div>
                    </FormItem>
                    <FormItem label="填写应用简介">
                        <div class="item-center">
                            <Input maxlength="200" :autosize="{minRows: 5,maxRows: 5}" show-word-limit placeholder="准确的简介能够提升广告的匹配度和收益" type="textarea" v-model.trim="formBase.desc"></Input>
                        </div>
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
import { addNewSspApp, modifySspApp, getSspAppList, getSspList } from '@/api/ssp.js'
import { getAppStoreList, getIndustryList } from '@/api/common.js'
import { formRules } from './app-edit-rules.js' // 正则校验
import { inPageAccess } from '@/mixin/in-page-access.js'
import { mapGetters } from 'vuex'

export default {
    mixins: [formRules, inPageAccess],
    data() {
        return {
            appId: this.$route.query.appId ? Number(this.$route.query.appId) : '', // 创意Id
            sspList: [], // 媒体列表
            catchAppStoreList: [], // 应用商店列表。 缓存备份，切换应用平台时使用
            appStoreList: [], // 应用商店列表数据
            industryList: [], // 选择应用类型
            categoryList: [], // 选择应用类别
            formBase: {
                ssp_id: '', // 媒体ID
                os_type: '', // 应用平台
                app_store_id: '', // 应用商店ID
                app_type_one: '', //应用所属行业一级分类ID
                app_type_two: '', // 应用所属行业二级分类ID
                app_name: '', // 应用名称
                alias: '', // 应用别名
                package_name: '', // 应用包名
                desc: '', // 应用简介
                keywords: '' // 应用关键字，英文逗号分隔
            },
            submitClock: false // 保存锁
        }
    },
    computed: {
        ...mapGetters(['osType']),
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
        /**
         * [initData 初始化加载]
         * @return {[type]} [description]
         */
        initData() {

            this.$Spin.show()

            //getIndustryList

            Promise.all([
                getSspList({page_num: 1}),
                getIndustryList(),
                this.$store.dispatch('getAppStoreList')
            ]).then(res=> {

                // 媒体列表
                if (res[0].code === 200) {
                    this.sspList = res[0].data.list || []
                }

                // 应用类型
                if(res[1].code === 200) {
                    this.industryList = res[1].data.list || []
                }

                // 应用商店
                if(res[2].code === 200) {
                    this.appStoreList = res[2].data.list || []
                    this.catchAppStoreList = res[2].data.list || []
                }
            }).then(()=> {
                this.initBackData() // 回显数据
            })
        },
        /**
         * [initBackData 回显数据]
         * @return {[type]} [description]
         */
        initBackData() {
            if(!!this.appId) {
                this.getSspAppList()
            } else {
                this.$Spin.hide()
            }
        },

        /**
         * [getSspAppList 获取应用详情]
         * @return {[type]} [description]
         */
        getSspAppList() {

            this.$Spin.show()

            getSspAppList({app_id_arr: this.appId}).then(res=> {
                
                this.$Spin.hide()
                
                if (res.code === 200) {

                    let _data = res.data.list[0]

                    this.formBase = {
                        app_id: this.appId, // appId
                        ssp_id: _data.ssp_id, // 媒体ID
                        os_type: _data.os_type, // 应用平台
                        app_store_id: _data.app_store_id, // 应用商店ID
                        app_type_one: _data.app_type_one.id, //应用所属行业一级分类ID
                        app_type_two: _data.app_type_two.id, // 应用所属行业二级分类ID
                        app_name: _data.app_name, // 应用名称
                        alias: _data.alias, // 应用别名
                        package_name: _data.package_name, // 应用包名
                        desc: _data.desc, // 应用简介
                        keywords: !!_data.keywords ? _data.keywords.join(',') : '' // 应用关键字，英文逗号分隔
                    }

                    // 筛选出应用类别
                    this.filterAppCategory(_data.app_type_one.id)

                    // 筛选出应用商店
                    this.filterAppStore(_data.os_type)
                    
                }
            })
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

                    this.submitClock = true

                    form.keywords = !!form.keywords ? form.keywords.split(',') : []

                    let proUrl = !!this.appId ? modifySspApp(form) : addNewSspApp(form)

                    proUrl.then(res=> {
                        this.submitClock = false
                        if(res.code === 200) {

                            this.$Bus.$emit('editEmitEvent') // 列表数据刷新
                            
                            this.$Message.success({content: form.appId ? '修改成功' : '保存成功', duration: 3})
                            this.goBack()
                        }
                    }, err=> {
                        this.submitClock = false
                    })
                }
            })
        },
        /**
         * [appTypeOneChange 类型一发生变化时]
         * @return {[type]} [description]
         */
        appTypeOneChange(id) {
            this.formBase.app_type_two = ''
            this.filterAppCategory(id) // 筛选应用类别
        },
        /**
         * [ostypeChange 应用平台发生变化]
         * @return {[type]} [description]
         */
        ostypeChange(id) {
            this.filterAppStore(id) // 获取应用商店列表
        },
        /**
         * [filterAppCategory 筛选出应用类别]
         * @return {[parentId]} [应用类型的id]
         * @return {[type]} [description]
         */
        filterAppCategory(parentId) {
            let _arr = this.industryList.filter(item=> {
                return item.id === parentId
            })

            console.log(_arr)

            this.categoryList = _arr[0].sub_industry_type
        },

        /**
         * [filterAppStore 获取应用商店列表]
         * @return {[type]} [description]
         */
        filterAppStore(parentId) {
            let _arr = this.catchAppStoreList.filter(item=> {
                return item.os_type === parentId
            })

            this.appStoreList = _arr
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

.edit-content-card
    min-height: calc(100vh - 150px)
.item-flex
    display: flex
    justify-content: space-between
    /deep/ > .ivu-form-item
        width: 245px
</style>
