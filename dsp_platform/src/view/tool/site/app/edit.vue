<template>
	<div class="page-main">
		<div class="edit-content-card">
			<div class="page-detail-title clearfix">
				<h2>{{sid ? '编辑转化' : '新建转化'}}</h2>
				<div class="is-handler">
					<Button @click="goBack" class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
				</div>
			</div>
			<div class="alert-text">
				<div class="alert-left">
					<p>1、准确完整地填写以下信息，其中“监测链接”需要技术人员提供，用于接收用户的广告点击行为事件。</p>
					<p>2、成功保存后进行检测转化上报，过程中需技术人员接收广告点击数据并将相关转化事件回传至回调地址。</p>
				</div>
				<!-- <div class="alert-right" @click="toDocment">点击查看详细说明<i class="iconfont icon-rightarrow"></i></div> -->
			</div>

			<div class="clearfix">
				<Form style="width: 900px" :model="formBase" :label-colon="true" label-position="right" :label-width="labelWidth" :rules="ruleBase" ref="formBase">

					<FormItem label="转化名称" prop="site_name">
						<Input maxlength="30" show-word-limit placeholder="请输入转化名称" v-model.trim="formBase.site_name"></Input>
					</FormItem>

					<FormItem label="转化目标" prop="site_target">
						<RadioGroup v-model="formBase.site_target" class="target-radio">
							<Radio :disabled="isDisabled" v-for="item in targetSelect" :label="item.label" :key="item.id">
								{{item.label}}
								<Tooltip v-if="item.tips" placement="top">
									<i class="iconfont icon-why"></i>
									<div slot="content">{{item.tips}}</div>
								</Tooltip>
							</Radio>
						</RadioGroup>
					</FormItem>

					<FormItem label="点击监测链接" prop="click_url">
						<Input maxlength="10000" placeholder="必须以http://, https://开头" v-model.trim="formBase.click_url"></Input>
					</FormItem>

					<!-- <FormItem label="展现监测链接" prop="view_url">
						<Input maxlength="10000" placeholder="必须以http://, https://开头" v-model.trim="formBase.view_url"></Input>
					</FormItem> -->

					<FormItem label="备注">
						<Input type="textarea" maxlength="200" :rows="4" show-word-limit v-model.trim="formBase.note_textarea"></Input>
					</FormItem>
				</Form>
			</div>
		</div>

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
import { showTitle, regWebUrl, regNumCnEnLine } from '@/libs/util'
import { addToolSite, editToolSite, getToolSiteList } from '@/api/tool'

export default {
	name: 'site-clues-edit',
	data() {
		return {
			sid: this.$route.query.sid ? Number(this.$route.query.sid) : '', // 转化sid
			isDisabled: false, // 是否可编辑
			labelWidth: 120, // 左侧宽度
			targetSelect: [ // 转化目标选择框
				{
					id: 1,
					label: '下载'
				},
				{
					id: 2,
					label: '调起',
					tips: '指的是通过deeplink打开设备里的其他应用'
				},
				{
					id: 3,
					label: '激活'
				},
				{
					id: 4,
					label: '注册'
				},
				{
					id: 5,
					label: '下单（电商）'
				},
				{
					id: 6,
					label: '加购（电商）'
				},
				{
					id: 7,
					label: '付费'
				},
				{
					id: 8,
					label: '其他'
				},
			],

			formBase: {
				site_name: '', // 转化名称
				site_target: '', // 转化目标
				click_url: '', // 点击监测链接
				view_url: '', // 展现监测链接
				note_textarea: '' // 备注
			},
			ruleBase: { // 正则
				site_name: [
					{required: true, message: '请输入转化名称'},
					{pattern: regNumCnEnLine, message: '转化名称只支持汉字、数字、英文、下划线', trigger: 'blur'}
				],
				site_target: [{required: true, message: '请选择转化目标'}],
				click_url: [
					{ required: true, message: '请输入下载链接', trigger: 'blur' },
					{ pattern: regWebUrl, message: '请输入合法的url地址', trigger: 'blur'}
				],
				view_url: [
					{ required: false, message: '请输入点击监测链接', trigger: 'blur' },
					{ pattern: regWebUrl, message: '请输入合法的url地址', trigger: 'blur'}
				]
			},

			submitClock: false // 保存锁
		}
	},
	created() {
		if(!!this.sid) {
			this.getToolSiteDetail()
			this.isDisabled = true
		}
	},
	methods: {
		/**
		 * [initData 初始化加载数据]
		 * @return {[type]} [description]
		 */
		getToolSiteDetail() {
			this.$Spin.show()

			getToolSiteList({sid: this.sid}).then(res => {
				this.$Spin.hide()

				if(res.code === 200) {
					let _result = res.data.list[0]

					// 拆分转化目标和备注
					let _split = _result.note ? _result.note.split('|') : []
						
					this.formBase = {
						site_name: _result.site_name, // 转化名称
						site_target: _split[0], // 转化目标
						click_url: _result.click_url, // 点击监测链接
						view_url: _result.view_url, // 展现监测链接
						note_textarea: _split[1] // 备注
					}
				}
			}, err => {
				this.$Spin.hide()
			})
		},
 
		/**
		 * [submitSet 提交表单]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		submitFormData(name) {
			try {
				this.$refs[name].validate((valid) => {
					if (valid) {

						let _form = this.formBase
						let params = {
							site_name: _form.site_name,
							click_url: _form.click_url,
							view_url: _form.view_url,
							note: `${_form.site_target}|${_form.note_textarea}`
						}

						this.submitClock = true

						let proUrl = '' // 请求接口
						// 编辑
						if(!!this.sid) {
							params.sid = this.sid
							proUrl = editToolSite(params)
						} else {
							proUrl = addToolSite(params)
						}

						proUrl.then(res=> {
							this.submitClock = false
							if(res.code === 200) {

								this.$Bus.$emit('editEmitEvent') // 列表数据刷新

								this.$Message.success({content: '保存成功', duration: 3})
								this.$router.push({name: 'site-app-detail', query: {sid: !!this.sid ? this.sid : res.data.sid}})
							}
						}, err=> {
							this.submitClock = false
						})
					}
				})

			} catch (e) {
				console.log(e)
			}
			
		},
		/**
		 * [toDocment 跳转到文档中心]
		 * @return {[type]} [description]
		 */
		toDocment() {
			this.$router.push({name: 'document'})
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
	font-size: 0px
	margin-bottom: 20px
	.alert-left
		width: 80%
		display: inline-block
		vertical-align: middle
		p
			line-height: 2
			font-size: 13px
	.alert-right
		color: #465CFE
		cursor: pointer
		display: inline-block
		vertical-align: middle
		width: 20%
		text-align: right
		line-height: 30px
		font-size: 13px
		.iconfont
			font-size: 12px
.target-radio
	label
		margin-right: 20px
	.icon-why
		color: #999999
		cursor: pointer
</style>
