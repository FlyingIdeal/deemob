<template>
	<div class="page-main">
		<div class="edit-content-card">
			<div class="page-detail-title clearfix">
				<h2>{{headTitle}}</h2>
				<div class="is-handler">
					<Button @click="goBack" class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
				</div>
			</div>
			<div class="clearfix">
				<div class="detail-list">
					<div class="title-line-tag">
						<h4>基本信息</h4>
					</div>
					<ul>
						<li>
							<div class="label">转化ID:</div>
							<div class="value">{{dataBase.sid}}</div>
						</li>
						<li>
							<div class="label">跟踪方式:</div>
							<div class="value">应用跟踪</div>
						</li>
						<li>
							<div class="label">点击监测链接:</div>
							<div class="value" v-if="dataBase.click_url">
								<a :href="dataBase.click_url" target="_blank">{{dataBase.click_url}}</a>
							</div>
							<div class="value" v-else>无</div>
						</li>
						<li>
							<div class="label">转化目标:</div>
							<div class="value">{{dataBase.site_target}}</div>
						</li>
						<li>
							<div class="label">创建时间:</div>
							<div class="value">{{dataBase.ctime}}</div>
						</li>
						
						<li>
							<div class="label">全部关联广告单元:</div>
							<div class="value">{{dataBase.related_order}}</div>
						</li>
						<!-- <li>
							<div class="label">在投关联广告活动:</div>
							<div class="value">{{dataBase.related_campaign}}</div>
						</li> -->
						<li>
							<div class="label">备注:</div>
							<div class="value">{{dataBase.note_textarea || '-'}}</div>
						</li>
					</ul>
				</div>

				<div class="detail-code">

					<!-- <div class="click-url-card">
						<div class="title-line-tag">
							<h4>点击监测链接</h4>
							<span class="site-url">{{dataBase.click_url || '无'}}</span>
						</div>
					</div> -->

					<!-- <div class="click-url-card">
						<div class="title-line-tag">
							<h4>展现监测链接</h4>
							<span class="site-url">{{dataBase.view_url || '无'}}</span>
						</div>
					</div> -->

					<div class="doc-step" v-if="scriptTxt">
						<div class="title-line-tag">
							<h4>跟踪转化操作步骤</h4>
							<!-- <span class="see-doc" @click="toDocment">查看说明文档</span> -->
						</div>
					</div>

					<div class="code-card" v-if="scriptTxt">
						<h6>1.将用户的广告点击信息与转化信息进行匹配</h6>
						<p class="text">广告投放时，平台会把用户的广告点击信息实时发送至下方您提供的有效监测链接，技术人员基于设备信息对收到的广告点击用户信息与应用内的转化信息进行匹配。</p>
						<h6>2.回传转化数据至回调地址</h6>
						<p class="text">成功匹配用户的点击行为与转化行为后，技术人员应将用户的激活等转化信息准确实时地回传至回调地址。si为转化ID，还需要将设备信息回传到广告平台。</p>
						<br>
						<h6>回调地址</h6>
						<p class="code" v-text="scriptTxt"></p>
						<!-- <h6>加密密钥</h6>
						<p class="code">xLFpHKz-BZldE-GoU-JYIjHNAVTiaLByV(假的)</p> -->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { showTitle } from '@/libs/util'
import { getToolSiteList } from '@/api/tool'

export default {
	data() {
		return {
			sid: this.$route.query.sid ? Number(this.$route.query.sid) : '', // 转化sid
			dataBase: {}, // 返回数据
			scriptTxt: ''
		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	created() {
		if(!!this.sid) {
			this.getToolSiteDetail()
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

					this.dataBase = _result
					this.dataBase.site_target = _split[0] // 转化目标
					this.dataBase.note_textarea = _split[1] // 备注

					this.scriptTxt = !!_result.site_url ? `<script type="text/javascript" src="${_result.site_url}"><\/script>` : ''

				}
			}, err => {
				this.$Spin.hide()
			})
		},
		/**
		 * [goBack 返回上一页]
		 * @return {[type]} [description]
		 */
		goBack() {
			this.$router.replace({name: 'site-manage'})
		},
		/**
		 * [toDocment 跳转到文档中心]
		 * @return {[type]} [description]
		 */
		toDocment() {
			this.$router.push({name: 'document'})
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.title-line-tag
	line-height: 30px
	h4
		display: inline-block
	.see-doc
		cursor: pointer
		margin-left: 10px
		display: inline-block
		color: #465CFE
.detail-list
	padding-bottom: 20px
	border-bottom: 1px solid #F2F2F2
	ul
		margin-top: 10px
		list-style-type: none
		font-size: 0px
		li
			display: inline-block
			width: 50%
			line-height: 2
			margin-bottom: 4px
			.label
				display: inline-block
				vertical-align: top
				text-align: right
				margin-right: 4%
				width: 22%
				color: #999
				font-size: 14px
			.value
				display: inline-block
				vertical-align: top
				width: 74%
				font-size: 14px
				word-break: break-all
.detail-code
	.doc-step
		margin-top: 20px
.click-url-card
	padding: 20px 0
	border-bottom: 1px solid #F2F2F2
.detail-code
	.site-url
		margin-left: 14px
	
	.code-card
		h6
			margin-top: 10px
			font-size: 14px
			font-weight: 500
			color: #333333
		p
			font-weight: 500
			line-height: 2
			&.text
				font-size: 13px;
				color: #999999
			&.code
				margin: 4px 0
				padding: 8px 10px
				font-size: 14px
				background-color: #FAFAFA
				border: 1px solid #EBEBEB
</style>
