<template>
    <div class="page-main">
        <div class="edit-content-card">
            <div class="page-detail-title clearfix">
                <h2>新建代理商</h2>
                <!-- <div class="is-handler">
                    <Button @click="goBack()" class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
                </div> -->
            </div>
            <div class="clearfix">
                <Form :model="formBase" :label-colon="true" label-position="right" :label-width="140" :rules="ruleBase" ref="formBase" style="width: 630px">
                    <FormItem prop="agentname">
                        <label slot='label'>
                            代理商名称
                            <Tooltip placement="top">
                                <i class="iconfont icon-why"></i>
                                <div slot="content">即代理商账户名称，也是登录账户名称</div>
                            </Tooltip>
                            :
                        </label>
                        <Input maxlength="30" show-word-limit placeholder="请填写代理商名称" v-model.trim="formBase.agentname"></Input>
                    </FormItem>

                    <FormItem label="公司名称" prop="company_name">
                        <Input maxlength="30" show-word-limit placeholder="请填写公司名称" v-model.trim="formBase.company_name"></Input>
                    </FormItem>

                    <FormItem label="电子邮箱" prop="email">
                        <Input maxlength="30" placeholder="请填写电子邮箱" v-model.trim="formBase.email"></Input>
                    </FormItem>

                    <FormItem label="手机号" prop="phone">
                        <Input maxlength="11"  placeholder="请填写手机号" v-model.trim="formBase.phone"></Input>
                    </FormItem>

                    <FormItem label="密码" prop="password">
                        <Input maxlength="20" placeholder="请填写密码" v-model.trim="formBase.password"></Input>
                    </FormItem>

                    <FormItem label="暗扣系数" prop="price_x">
                        <InputNumber style="width: 100%" :max="1" :min="0" placeholder="大于等于0,小于1;最多两位小数点" :step="0.01" v-model="formBase.price_x"></InputNumber>
                    </FormItem>

                    <!-- 1预付款 2垫付款 -->
                    <FormItem label="付款制度" prop="strategy">
                        <RadioGroup v-model="formBase.strategy" >
                            <Radio class="check-label" v-for="item in strategyArr" :label="item.id" :key="item.id">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>

                    <!-- 是否可使用测试广告位 0否 1是 -->
                    <FormItem>
                        <label slot='label'>
                            测试流量
                            <Tooltip placement="top" max-width="250">
                                <i class="iconfont icon-why"></i>
                                <div slot="content">测试流量指代理商下所有广告主的可投放流量里是否显示测试广告位</div>
                            </Tooltip>
                            :
                        </label>
                        <Checkbox v-model="formBase.allow_test_slot" :true-value="1" :false-value="0">显示测试流量</Checkbox>
                    </FormItem>


                    <!-- 是否是RTA类型 -->
                    <!-- is_rta: 1是rta类型; 0否 -->
                    <FormItem>
                        <label slot='label'>
                            是否是RTA类型
                            <Tooltip placement="top" max-width="250">
                                <i class="iconfont icon-why"></i>
                                <div slot="content">RTA类型指该代理商是以RTA的协议与慧营DSP合作投放</div>
                            </Tooltip>
                            :
                        </label>

                        <RadioGroup v-model="formBase.is_rta" >
                            <Radio class="check-label" v-for="item in isRta" :label="item.id" :key="item.id">{{item.name}}</Radio>
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
import { regEmail, regPhoneNumber, regNum2Precision } from '@/libs/util'
import { addNewAgent } from '@/api/agent.js'

export default {
    data() {
        const validatePrice = (rule, value, callback) => {
            if (value === null || value === undefined) {
                callback(new Error('请填写暗扣系数'));
            } else if (!regNum2Precision.test(value) || value < 0 || value >= 1) {
                callback(new Error('暗扣系数必须大于等于0, 小于1; 最多两位小数点'))
            } else {
                callback()
            }
        };
        return {
            ruleBase: { // 正则
                agentname: [{required: true, message:'请填写代理商名称'}],
                company_name: [{required: true, message:'请填写公司名称'}],
                email: [
                    {required: true, message:'请填写电子邮箱'},
                    {pattern: regEmail, message: '请输入正确的电子邮箱', trigger: 'blur'}
                ],
                phone: [
                    {required: true, message:'请填写手机号'},
                    {pattern: regPhoneNumber, message: '请输入正确的手机号', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '密码不能为空'},
                    {min: 6, message: '长度至少6位', trigger: 'blur'},
                    {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}
                ],
                price_x: [{required: true, validator: validatePrice, trigger: 'blur'}],
                strategy: [{required: true, message:'请选择付款制度'}],
                is_rta: [{required: true, message:'请选择是否是RTA类型'}]
            },
            formBase: {
                agentname: '', // 代理商名称
                company_name: '', // 公司名称
                email: '', // 电子邮箱
                phone: '', // 手机号
                password: '', // 密码
                price_x: 0, // 暗扣系数
                strategy: 1, // 1预付款 2垫付款
                allow_test_slot: 0, // 是否可使用测试广告位 0否 1是
                is_rta: 0 // 是否是RTA类型 0否 1是
            },
            submitClock: false // 保存锁
        }
    },
    computed: {
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
    methods: {
        /**
         * [submitSet 提交表单]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        submitFormData(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {

                    let form = {...this.formBase}

                    // 强制处理暗扣系数
                    form.price_x = parseInt(form.price_x * 100) / 100 // 保留两位小数

                    this.submitClock = true

                    addNewAgent(form).then(res=> {
                        this.submitClock = false
                        if(res.code === 200) {
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
.item-center
    width: 500px
.icon-why
    color: #999
    cursor: pointer
.edit-content-card
    min-height: calc(100vh - 150px)
.check-label
    width: 80px
</style>
