<template>
	<div class="login clearfix">
		<div class="login-right fl">
			<div class="login-card">
				<div class="plat-name">
					<img src="~@/assets/image/logo.png">
					<span>慧营</span>
				</div>
				<div class="plat-hi">Hi，欢迎进入代理商平台~</div>
				<Form class="form-card" ref="loginForm" :model="form" :rules="rules">
					<FormItem prop="account">
						<Input type="text" size="large" :maxlength="30" v-model.trim="form.account" placeholder="请输入账户名称">
							<i class="iconfont icon-account" slot="prepend"></i>
						</Input>
					</FormItem>
					<FormItem prop="password">
						<Input type="password" size="large" :maxlength="20" v-model="form.password" placeholder="请输入登录密码">
							<i class="iconfont icon-psw" slot="prepend"></i>
						</Input>
					</FormItem>
					<FormItem prop="captcha" class="captcha-item clearfix">
						<div class="captcha-input">
							<Input type="text" size="large" :maxlength="4" v-model="form.captcha" placeholder="请输入验证码" @keyup.enter.native="handleSum('loginForm')">
								<i class="iconfont icon-shield" slot="prepend"></i>
							</Input>
						</div>
						<div class="captcha-img">
							<img @click="regain" :src="codeImg" alt="">
						</div>
					</FormItem>
					<FormItem class="login-item">
						<Button class="login-btn" @click="handleSum('loginForm')">登录<Icon class="md-arrow-forward" type="md-arrow-forward" /></Button>
					</FormItem>
				</Form>
			</div>
		</div>
		<div class="login-left fr">
		</div>
	</div>
</template>
<script>
import {mapActions, mapMutations} from 'vuex'
import { debounce } from '@/libs/tools'

export default {
	name: 'login',
	data() {
		return {
            tag: this.$route.query.tag || '', // url中的tag
			form: {
				account: '', // 登陆账号
				password: '', // password
				captcha: ''
			},
			codeImg: '',
			image_key: '',
			rules: {
				account: [{
					required: true,
					message: '账户不能为空',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '密码不能为空',
					trigger: 'blur'
				}],
				captcha: [{
					required: true,
					message: '验证码不能为空',
					trigger: 'blur'
				}]
			}
		}
	},
	created() {
		// this.resetUserRole() // 重置用户角色

		// 因为总出现请求接口401过期，到登陆页面，但是检测到session并没过期，
		// 所以此处做强制处理，如果是接口拦截器过来不要校验session
		if (this.tag === 'pass') {
			this.resetInit()
		} else {
			this.initMain() // 首先判断是否登录时效
		}
	},
	methods: {
		...mapActions([
			'getLogin',
			'getCaptchaCode',
			'verifySession'
		]),
		...mapMutations([
            'resetUserRole',
            'setLoginOut'
        ]),

		/**
		 * [initMain 修改登录方法]
		 * @return {[type]} [description]
		 */
		initMain() {

			this.$Spin.show()

			this.verifySession({platform_id: this.$config.platformId}).then(res => {

				this.$Spin.hide()

				if (!!res) {
					this.$Message.success('已登录，正在跳转...')
					this.toHome() // 有效期内，跳转到首页
				} else {
					this.resetInit()
				}
			}, err => {
				this.$Spin.hide()
				this.resetInit()
			})
		},

		/**
		 * [resetInit 重新获取进入]
		 * @return {[type]} [description]
		 */
		resetInit() {
			this.setLoginOut() // 清除登录的存储信息
			this._getCaptchaCode() // 已过期，重新获取验证码
		},

		/**
		 * [description]
		 * @param  {[type]} )[点击图片重新获取验证码]
		 * @return {[type]}   [description]
		 */
		regain: debounce(function() {
			this._getCaptchaCode()
		}),

		/**
		 * [_getCaptchaCode 获取验证码]
		 * @return {[type]} [description]
		 */
		_getCaptchaCode() {
			this.getCaptchaCode().then(res => {
				if (res.code === 200) {
					this.codeImg = res.data.image_base64
					this.image_key = res.data.image_key
				}
			})
		},
		/**
		 * [handleSum 必填信息校验]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		handleSum(name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					this.toLogin()
				}
			})
		},
		/**
		 * [toHome 跳转到首页]
		 * @return {[type]} [description]
		 */
		toHome() {
			setTimeout(() => {
				this.$router.replace({name: 'dsp-manage'})
			}, 1500)
		},
		/**
		 * [toLogin 登录]
		 * @return {[type]} [description]
		 */
		async toLogin() {
			let {account, password, captcha} = this.form
			let image_key = this.image_key
			let platform_id = this.$config.platformId

			let res = await this.getLogin({platform_id, account, password, captcha, image_key}) // 登录
			if (res.code === 200) {
				this.$Message.success('登录成功')
				this.toHome() // 跳转到首页
			} else {
				this.form.code = ''
				this._getCaptchaCode()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
.login
	background-color: #FFF
	width: 100%
	height: 100%
	position: absolute
	min-width: 1200px
	min-height: 700px
	.login-left, .login-right
		position: relative
		height: 100%
		text-align: center
		background-repeat: no-repeat
		background-size: cover
	.login-left
		width: 59.375%
		background-position: center right
		display: flex
		align-items: center
		just-content: center
		background-position: center left
		background-image: url('~@/assets/image/login/login-left.png')
	.login-right
		width: 40.625%
		background-position: center right
		background-image: url('~@/assets/image/login/login-right.png')
		text-align: left
	.login-card
		width: 390px
		position: absolute
		right: 12%
		top: 50%
		margin-top: -275px
	.plat-name
		font-size: 0px
		line-height: 70px
		img
			display: inline-block
			vertical-align: middle
			width: 70px
		span
			margin-left: 14px
			display: inline-block
			vertical-align: top
			font-size: 56px
			font-family: 'PingFang SC'
			font-weight: 600
	.plat-hi
		margin-top: 60px
		height: 40px
		line-height: 40px
		font-size: 24px
		font-weight: 500
		font-family: 'PingFang SC'
		color: #999999
		background: linear-gradient(-51deg, #5848F8 0%, #428DFF 100%)
		-webkit-background-clip: text
		-webkit-text-fill-color: transparent
	.form-card
		margin-top: 40px
		/deep/
			.ivu-form-item
				margin-bottom: 40px
			.ivu-form-item-content
				border-bottom: 1px solid #EEEEEE
		.login-item
			/deep/
				.ivu-form-item-content
					border-bottom: none
		/deep/ .ivu-input-group-prepend
			background-color: transparent !important
			border: none !important
			padding: 6px 0
			.icon-account
				color: #FDAC11
			.icon-psw
				color: #F52B48
			.icon-shield
				color: #4EDA09
		/deep/ .ivu-input
			padding: 0 16px !important
			height: 40px
			line-height: 40px
			font-size: 14px
			color: #333333
			border: none !important
	.captcha-item
		font-size: 0px
		.captcha-input
			width: 260px
			display: inline-block
			vertical-align: top
		.captcha-img
			display: inline-block
			vertical-align: top
			text-align: right
			width: 125px
			height: 40px
			img
				width: 100%
				height: 100%
	.login-btn
		width: 210px
		height: 60px
		background: linear-gradient(-51deg, #5848F8, #428DFF)
		border: 1px solid #D4D4D4
		border-radius: 30px
		font-size: 22px
		font-family: 'PingFang SC'
		font-weight: 500
		color: #FFFFFF
		.md-arrow-forward
			margin-left: 10px
			font-weight: normal
</style>
