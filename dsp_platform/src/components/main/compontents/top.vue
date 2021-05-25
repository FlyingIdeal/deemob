<template>
	<div class="infor-affix clearfix" v-if="userInfro && toggleFlag">
		<div class="affix-text">
			<div class="iconfont notice-icon" :class="userInfro.status === 1 ? 'icon-notice-right' : 'icon-notice'"></div>
			<h4>{{tipsText}}</h4>
			<div class="update" v-if="userInfro.status === 3" @click="toLink"><span>去补全账户信息</span>
				<Icon class="icon_back" type="md-arrow-round-forward"/>
			</div>
		</div>
		<div class="icon icon-close" @click="toggle"></div>
	</div>
</template>

<script>

import {mapActions, mapMutations} from 'vuex'
import {localSave, localRead} from '@/libs/util'

export default {
	data() {
		return {
			localField: 'USERSTATUS', // 存储字段
			toggleFlag: true, // 默认显示
			userInfro: '', // 用户信息
			tipsText: '' // 提示文字
		}
	},
	created() {
		this._getSysUserInfo()
	},
	methods: {
		...mapActions([
			'getSysUserInfo'
		]),
		/**
		 * [_getAllAdType 获取个人信息]
		 * @return {[type]} [description]
		 */
		// 广告主状态   1启用，2停用，3待完善  4待审核  5已拒绝
		async _getSysUserInfo() {

			let read = localRead(this.localField)
			let value = !!read ? JSON.parse(read) : {}

			let curTime = new Date().getTime()
			let localTime = value.time || curTime
			let difTimeFlag = (curTime - localTime) < 1 * 60 * 1000 // 接口大于1分钟没有操作

			let storeUser = this.$store.state.user
			this.userInfro = (storeUser.accountUserInfo && difTimeFlag) ? storeUser.accountUserInfo : await this.getSysUserInfo()

			let _flag = this.judgeLocal() // 判读是否显示

			if (_flag && this.userInfro.status === 1) {
				this.toggleFlag = false
			} else {
				this.toggleFlag = true // 默认显示
				this.setTipsText()
			}

			this.localSave()
		},
		/**
		 * [judgeLocal 判读是否显示]
		 * @return {[type]} [description]
		 */
		judgeLocal() {
			let read = localRead(this.localField)
			let value = !!read ? JSON.parse(read) : {}

			// 审核通过的情况下只显示一次
			return value.status === true || value.status === 'true'
		},
		/**
		 * [setTipsText 设置广告提示语]
		 */
		setTipsText() {
			switch (this.userInfro.status) {
				case 1:
					this.tipsText = '账户信息审核通过'
					break
				case 2:
					this.tipsText = '当前账户已停用'
					break
				case 3:
					this.tipsText = '账户信息不完整，请补全账户信息，补全信息并通过账户审核后方可正常投放广告'
					break
				case 4:
					this.tipsText = '账户信息审核中'
					break
				case 5:
					this.tipsText = `账户信息审核未通过，请按照提示原因修改账户信息。原因:${this.userInfro.status_desc}`
					break
			}
		},
		/**
		 * [toggle 显示隐藏]
		 * @return {[type]} [description]
		 */
		toggle() {
			this.toggleFlag = !this.toggleFlag
			this.localSave() // 存入
		},
		/**
		 * [localSave 存入]
		 * @return {[type]} [description]
		 */
		localSave() {
			let flag = this.userInfro.status === 1
			let curTime = new Date().getTime()

			let obj = {
				status: flag,
				time: curTime
			}

			localSave(this.localField, JSON.stringify(obj))
		},
		/**
		 * [toLink 路由跳转]
		 * @param  {[type]} el [description]
		 * @return {[type]}    [description]
		 */
		toLink(name) {
			this.$router.push({name: 'infro-account'})
		}
	}
}
</script>

<style lang="stylus" scoped>
.infor-affix
	margin-bottom: 10px
	line-height: 36px
	background-color: #FFFFFF
	display: flex
	align-items: center
	justify-content space-between
	border-radius 4px

	.affix-text
		font-size: 0px
		flex: 1

	h4
		font-size: 13px
		display: inline-block
		vertical-align: middle

	.notice-icon
		margin: 0 10px
		display: inline-block
		vertical-align: middle
		font-size 14px

		&.icon-notice
			color #F54F4F

		&.icon-notice-right
			color #32AC54

	.update
		cursor: pointer
		margin-left: 30px
		font-size: 0px
		display: inline-block
		vertical-align: middle

		span
			line-height: 36px
			display: inline-block
			vertical-align: middle
			font-size: 13px
			font-weight: bold
			color: #465CFE

		.icon_back
			display: inline-block
			vertical-align: -7px
			font-size 18px
			margin-left 2px
			color: #465CFE

	.icon-close
		height: 36px
		width: 36px
		line-height: 36px
		text-align: center
		font-size: 12px
		color: #999999
		cursor: pointer
</style>
