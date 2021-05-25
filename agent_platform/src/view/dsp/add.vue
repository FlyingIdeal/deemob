<template>
    <div class="page-main">
        <div class="edit-content-card">
            <div class="page-detail-title clearfix">
                <h2>新建广告主</h2>
            </div>
            <div class="clearfix">
                <Form :model="formBase" :label-colon="true" label-position="right" :label-width="130" :rules="ruleBase" ref="formBase" style="width: 625px">
                    <FormItem prop="advertisername">
                        <label slot='label'>
                            广告主名称
                            <Tooltip placement="top">
                                <i class="iconfont icon-why"></i>
                                <div slot="content">即广告主账户名称，也是登录账户名称</div>
                            </Tooltip>
                            :
                        </label>
                        <Input maxlength="30" show-word-limit placeholder="请填写广告主名称" v-model.trim="formBase.advertisername"></Input>
                    </FormItem>

                    <FormItem label="公司名称" prop="company_name">
                        <Input maxlength="30" show-word-limit placeholder="请填写公司名称" v-model.trim="formBase.company_name"></Input>
                    </FormItem>

                    <FormItem label="公司网站URL" prop="official_website">
                        <Input maxlength="10000" placeholder="请填写公司网站URL" v-model.trim="formBase.official_website"></Input>
                    </FormItem>

                    <FormItem label="电子邮箱" prop="email">
                        <Input maxlength="30" show-word-limit placeholder="请填写电子邮箱" v-model.trim="formBase.email"></Input>
                    </FormItem>

                    <FormItem label="手机号" prop="mobile">
                        <Input maxlength="11" show-word-limit placeholder="请填写手机号" v-model.trim="formBase.mobile"></Input>
                    </FormItem>

                    <FormItem label="密码" prop="password">
                        <Input maxlength="20" show-word-limit placeholder="请填写密码" v-model.trim="formBase.password"></Input>
                    </FormItem>

                    <FormItem label="行业类型" class="ivu-form-item-required">
                        <div class="item-center item-flex">
                            <FormItem prop="category">
                                <Select v-model="formBase.category" placeholder="行业类型" @on-change="industryChange">
                                    <Option v-for="item in industryList" :value="item.id" :key="item.id">{{ item.category_name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="category_sub_id">
                                <Select v-model="formBase.category_sub_id" placeholder="行业类别">
                                    <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.category_name }}</Option>
                                </Select>
                            </FormItem>
                        </div>
                    </FormItem>

                    <!-- 如果当前代理商是垫付款不显示结算系数，结算系数默认为0 -->
                    <!-- 付款策略 1预付款 2垫付款 -->
                    <FormItem prop="price_x" v-if="userInfro.strategy !== 2">
                        <label slot='label'>
                            结算系数
                            <Tooltip placement="top">
                                <i class="iconfont icon-why"></i>
                                <div slot="content">结算系数决定代理商从广告主花费中分得的<br/>利润（=广告主花费*结算系数），如果系数<br/>发生变化，仅影响修改后产生的利润</div>
                            </Tooltip>
                            :
                        </label>

                        <InputNumber style="width: 100%" :max="1" :min="0" placeholder="大于等于0,小于1;保留两位小数" :step="0.01" v-model="formBase.price_x"></InputNumber>
                    </FormItem>

                    <!-- 如果当前代理商是RTA类型，此处显示RTA合作方选项且必填，否则隐藏 -->
                    <!-- is_rta: 1是; 0否 -->
                    <FormItem label="RTA合作方" prop="rta_id" v-if="userInfro.is_rta === 1">
                        <RadioGroup v-model="formBase.rta_id" >
                            <Radio v-for="item in rtaList" :label="item.id" :key="item.id">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
        </div>
        <div class="detail-save-card" v-if="userInfro">
            <div class="detail-save-center">
                <Button @click="goBack">取消</Button>
                <Button type="primary" :loading="submitClock" @click="submitFormData('formBase')">
                    <span v-if="!submitClock">保存</span>
                    <span v-else>保存中...</span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script>
import { regEmail, regPhoneNumber, regWebUrl, regNum2Precision } from '@/libs/util'
import { addNewAdvertiser } from '@/api/dsp'
import { mapActions } from 'vuex'

export default {
    data() {
        const validatePrice = (rule, value, callback) => {
            if (value === null || value === undefined) {
                callback(new Error('请填写暗扣系数'))
            } else if (!regNum2Precision.test(value) || value < 0 || value >= 1) {
                callback(new Error('暗扣系数必须大于等于0, 小于1; 最多两位小数点'))
            } else {
                callback()
            }
        }
        return {
            userInfro: '', // 当前代理商信息
            ruleBase: { // 正则
                advertisername: [{required: true, message: '请填写广告主名称'}],
                company_name: [{required: true, message: '请填写公司名称'}],
                official_website: [
                    {required: true, message: '请填写公司网站URL'},
                    {pattern: regWebUrl, message: '请输入正确的公司网站', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请填写电子邮箱'},
                    {pattern: regEmail, message: '请输入正确的电子邮箱', trigger: 'blur'}
                ],
                mobile: [
                    {required: true, message: '请填写手机号'},
                    {pattern: regPhoneNumber, message: '请输入正确的手机号', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '密码不能为空'},
                    {min: 6, message: '长度至少6位', trigger: 'blur'},
                    {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}
                ],
                category: [{required: true, message: '请填写行业类型'}],
                category_sub_id: [{required: true, message: '请填写行业类别'}],
                price_x: [{required: true, validator: validatePrice, trigger: 'blur'}],
                rta_id: [{required: true, message: '请选择RTA合作方'}]
            },
            formBase: {
                advertisername: '', // 广告主名称
                company_name: '', // 公司名称
                official_website: '', // 公司官网
                email: '', // 电子邮箱
                mobile: '', // 手机号
                password: '', // 密码
                category: '', // 行业类型
                category_sub_id: '', // 行业类别
                price_x: 0, // 结算系数
                rta_id: '' // RTA合作方id
            },
            industryList: [], // 行业类型列表
            categoryList: [], // 行业类别列表
            rtaList: [], // rta列表
            submitClock: false // 保存锁
        }
    },
    created() {
        this.initData()
    },
    methods: {
        ...mapActions([
            'getCategoryList',
            'getSysUserInfo',
            'getRtaList'
        ]),
        /**
         * [initData 初始化数据]
         * @return {[type]} [description]
         */
        async initData() {
            this.$Spin.show()

            let storeUser = this.$store.state.user

            this.industryList = storeUser.categoryArr.length ? storeUser.categoryArr : await this.getCategoryList()
            this.userInfro = storeUser.userInfo ? storeUser.userInfo : await this.getSysUserInfo()
            this.rtaList = storeUser.rtaList.length ? storeUser.rtaList : await this.getRtaList()

            this.formBase.rta_id = this.userInfro.is_rta === 1 ? this.rtaList[0].id : '' // 默认选中大航海

            this.$Spin.hide()
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

                    // 此时需要再次判断 - 结算系数
                    // 如果当前代理商是垫付款不显示结算系数，结算系数默认为0
                    // <!-- 付款策略 1预付款 2垫付款 -->
                    form.price_x = this.userInfro.strategy === 2 ? 0 : form.price_x

                    // 非rta类型的代理商，删除rta_id
                    if (this.userInfro.is_rta !== 1) {
                        delete form.rta_id
                    }

                    addNewAdvertiser(form).then(res => {
                        this.submitClock = false
                        if (res.code === 200) {
                            this.$Message.success({content: '保存成功', duration: 3})
                            this.goBack()
                        }
                    }, err => {
                        this.submitClock = false
                    })
                }
            })
        },
        /**
         * [filterAppCategory 筛选出应用类别]
         * @return {[parentId]} [应用类型的id]
         * @return {[type]} [description]
         */
        industryChange(parentId) {
            let _arr = this.industryList.filter(item => {
                return item.id === parentId
            })

            this.categoryList = _arr[0].children
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
    width: 100%
.icon-why
    color: #999
    cursor: pointer
.edit-content-card
    min-height: calc(100vh - 200px)
.item-flex
    display: flex
    justify-content: space-between
    /deep/ > .ivu-form-item
        width: 240px
</style>
