<template>
	<div class="login">
		<div class="login_img login_leftTop" style="top:80px; left:-80px">
			<img src="~@/assets/image/login/icon_left.png">
		</div>
		<div class="login_img login_leftBottom" style="bottom:80px;left:30px">
			<img src="~@/assets/image/login/icon_right.png">
		</div>
		<div class="login_img login_rightTop" style="top:80px;right:30px">
			<img src="~@/assets/image/login/icon_left.png">
		</div>
		<div class="login_img login_rightBottom" style="bottom:80px;right:30px">
			<img src="~@/assets/image/login/icon_right.png">
		</div>

		<div class="login_header">
			<p>慧营管理平台</p>
			<img src="~@/assets/image/login/title_bg1.png">
		</div>

		<div class="login_matter">
			<div class="deng_img">
				<img src="~@/assets/image/login/tu_img.png">
			</div>
			<div class="deng_content login-view">
				<div class="login_icon">
					<img width="40" src="~@/assets/image/logo.png">
				</div>
				<div class="login-content">
					<Form ref="loginForm" :model="form" :rules="rules"
					class="login_detail">
						<FormItem prop="account">
							<Input
								class="input-class"
								size="large"
								v-model.trim="form.account"
								placeholder="账户名称"
							>
								<div slot="prepend" class="icon">
									<i class="iconfont icon-account" />
								</div>
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input 
								class="input-class"
								size="large"
								type="password"
								:maxlength="20"
								v-model="form.password"
								placeholder="输入密码"
							>
								<div slot="prepend" class="icon">
									<i class="iconfont icon-psw" />
								</div>
							</Input>
						</FormItem>
						<FormItem prop="captcha" class="captcha-item clearfix">
							<div class="captcha-input">
								<Input
									type="text"
									size="large"
									:maxlength="4"
									v-model.trim="form.captcha" 
									placeholder="请输入验证码"
									@keyup.enter.native="handleSum('loginForm')"
								>
									<div slot="prepend" class="icon">
										<i class="icon iconfont icon-shield" />
									</div>
									<div slot="append" class="captcha-img">
										<img @click="regain" :src="codeImg">
									</div>
								</Input>
							</div>
						</FormItem>
						<FormItem>
							<Button @click="handleSum('loginForm')">登录</Button>
						</FormItem>
					</Form>
				</div>
			</div>
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

		this.resetUserRole() // 重置用户角色 

		// 因为总出现请求接口401过期，到登陆页面，但是检测到session并没过期，
		// 所以此处做强制处理，如果是接口拦截器过来不要校验session
		if(this.tag === 'pass') {
			this.resetInit()
		} else {
			this.initMain()// 首先判断是否登录时效
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
			'storeUserInfo',
            'setLoginOut'
        ]),

		/**
		 * [initMain 页面初始化]
		 * @return {[type]} [description]
		 */
		initMain() {

			// 登录逻辑判断
			// 1 同时满足USERMODELLIST/USERINFO存在，并且session不过期
			
			const USERINFO = localStorage.getItem('USERINFO')
			const USERMODELLIST = localStorage.getItem('USERMODELLIST')

			this.$Spin.show()

			this.verifySession({platform_id: this.$config.platformId}).then(res => {
				this.$Spin.hide()

				if (!!res && !!USERINFO && !!USERMODELLIST) {
					
					// 场景： 在登录页，并且session有效，自动登录，获取local信息，重新存储（vuex和local）用户信息和用户路由
					this.storeUserInfo({user_info: JSON.parse(USERINFO), model_list: JSON.parse(USERMODELLIST)})

					this.$Message.success('已登录，正在跳转...')
					this.toTransfer() // // 有效期内，跳转到首页
				} else {
					this.resetInit()
				}
			}, err=> {
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
		 * [getCaptchaCode 获取验证码]
		 * @return {[type]} [description]
		 */
		_getCaptchaCode() {
			this.getCaptchaCode().then(res=> {
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
		 * [toTransfer 跳转到中间页]
		 * @return {[type]} [description]
		 */
		toTransfer() {
			setTimeout(() => {
				this.$router.replace({name: 'transfer'})
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
				this.toTransfer() // 跳转到首页
			} else {
				this.form.code = ''
				this._getCaptchaCode()
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
  @import './login.styl';
</style>
