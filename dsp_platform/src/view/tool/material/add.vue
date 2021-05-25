<template>
	<div class="page-main">
		<div class="edit-content-card">
			<div class="add-head">
				<div class="head-title">
					<h4>{{type === 'photo' ? '添加图片素材' : (type === 'video' ? '添加视频素材' : '添加素材')}}</h4>
					<p>上传规则：1. 首次上传的素材会按照尺寸自动分类到具体的尺寸下面；2. 不可上传内容重复的相同素材。</p>
				</div>
				<div class="head-filter">
					<div class="filter-item">
						<div class="require">*</div>
						<div class="name" title="点击去创建" @click="toLink('tool-material-group')">素材组:</div>
						<Select
							clearable
							filterable
							class="filter-select"
							placeholder="素材组"
							v-model="filterSearch.groupId"
						>
							<Option v-for="item in materialGroupArr" :key="item.id" :value="item.id" :title="item.material_group_name">{{ item.material_group_name }}</Option>
						</Select>
					</div>
					<div class="filter-item">
						<div class="require">*</div>
						<div class="name" title="点击去创建" @click="toLink('tool-material-tag')">标签:</div>
						<Select
							clearable
							filterable
							class="filter-select"
							placeholder="标签"
							v-model="filterSearch.tagId"
							@on-change="filterSelectTagChange"
						>
							<Option v-for="item in materialTagArr" :key="item.id" :value="item.id" :title="item.material_tag_name">{{ item.material_tag_name }}</Option>
						</Select>
					</div>
				</div>
			</div>
			<Divider />
			<div class="material-middle" v-if="materialGroupArr.length && materialTagArr.length">
				<!-- 上传组件 简单图片上传 -->
				<upload-image @on-change="onUploadChange" :multiple="true" v-if="type === 'photo'"></upload-image>
				<!-- 上传组件 简单视频上传 -->
				<upload-video @on-change="onUploadChange" v-if="type === 'video'"></upload-video>

				<!-- 渲染上传的图片 -->
				<div class="item-list" v-for="(item, index) in materialArr">
					<!-- 图片 + 视频 -->
					<div class="material-photo">

						<img :src="item.url" v-if="type === 'photo'">
						<video :src="item.url" controls="controls" v-if="type === 'video'">
							您的浏览器不支持 video 标签。
						</video>

						<div class="delete" @click="deleteMaterial(item, index)">x</div>
					</div>
					<h4 class="material-name" :title="item.name">{{item.name}}</h4>
					<div class="material-tag">
						<div class="tag-label"><span>*</span>标签：</div>
						<Select
							clearable
							filterable
							class="tag-select"
							placeholder="标签"
							size="small"
							v-model="item.tagId"
						>
							<Option v-for="child in materialTagArr" :key="child.id" :value="child.id" >{{ child.material_tag_name }}</Option>
						</Select>
					</div>
				</div>
			</div>
			<div class="material-middle-noData" v-if="!(materialGroupArr.length && materialTagArr.length)">请先创建素材组和素材标签</div>
		</div>
		<div class="detail-save-card">
			<div class="detail-save-center">
				<Button @click="goBack">取消</Button>

				<Button type="primary" :loading="submitClock" :disabled="!(materialGroupArr.length && materialTagArr.length && materialArr.length)" @click="submitData">
					{{!submitClock ? '提交' : '提交中...'}}
				</Button>
			</div>
		</div>
	</div>
</template>

<script>
import { showTitle } from '@/libs/util'
import { getMaterialGroupList, getMaterialTagList, addMaterial } from '@/api/tool'
import uploadImage from '_c/upload-simple/upload-image' // 简单图片上传
import uploadVideo from '_c/upload-simple/upload-video' // 简单视频上传

export default {
	data() {
		return {
			type: this.$route.query.type || 'photo', // 新建类型
			filterSearch: { // form表单提交
				groupId: null,
				tagId: null
			},
			materialGroupArr: [], // 素材组
			materialTagArr: [], // 标签
			materialArr: [], // 素材数组

			submitClock: false // 保存锁
		}
	},
	components: {
		uploadImage,
		uploadVideo
	},
	created() {
		this.initLinkage()
	},
	methods: {
		/**
		 * [toLink 链接跳转]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		toLink(name) {
			this.$router.push({
				name
			})
		},
		/**
		 * [initLinkage 初始化加载: 素材组+素材标签]
		 * @return {[type]} [description]
		 */
		initLinkage() {

			this.$Spin.show()

			Promise.all([
				getMaterialGroupList(),
				getMaterialTagList()
			]).then(res => {
				if(res[0].code === 200) {
					this.materialGroupArr = res[0].data.list || []
				}

				if(res[1].code === 200) {
					this.materialTagArr = res[1].data.list || []
				}

				this.$Spin.hide()
			}, err=> {
				this.$Spin.hide()
			})
		},
		/**
		 * [onUploadChange 图片上传发生改变]
		 * @param  {[type]} materialArr [description]
		 * @return {[type]}        [description]
		 */
		onUploadChange(materialArr) {

			let resultArr = materialArr.map(item => {
				return this.addMaterialOnce(item)
			})

			this.materialArr = [...resultArr, ...this.materialArr]
		},
		/**
		 * [addDealOnce 添加deal]
		 */
		addMaterialOnce(obj) {

			let videoInfo = obj.video_info || {} // 视频信息

			return {
				url: obj.url,
				size: obj.size,
				width: obj.width,
				height: obj.height,
				name: obj.name || obj.url,
				fps: videoInfo.fps || null,
				duration: videoInfo.duration || 0,
				tagId: this.filterSearch.tagId || null,
				video_info: obj.video_info || {}
			}
		},
		/**
		 * [filterSelectTagChange 筛选栏标签变化，应对列表的id统一变]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		filterSelectTagChange(val) {
			this.materialArr.map((item, index) => {
				item.tagId = val
			})
		},
		/**
		 * [deleteMaterial 删除素材]
		 * @param  {[type]} item  [description]
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		deleteMaterial(item, index) {
			this.materialArr.splice(index, 1)
		},
		/**
		 * [submitData 提交数据]
		 * @return {[type]} [description]
		 */
		submitData() {

			let filter = this.filterSearch

			// 上传素材
			if (!this.materialArr.length) {
				this.$Message.error({
					content: '请先上传素材',
					duration: 3
				})
				return
			}

			// 素材组
			if (!filter.groupId) {
				this.$Message.error({
					content: '请先选择素材组',
					duration: 3
				})
				return
			}

			// 标签
			let resultObj = {
				tag_ids: [], // 标签ID数组
				names: [], //文件名称数组
				errorTagArr: [] // 错误提醒
			}
			
			this.materialArr.map((item, index) => {
				if (!!item.tagId) {
					resultObj.tag_ids.push(item.tagId)
					resultObj.names.push(item.name)
				} else {
					resultObj.errorTagArr.push(`${item.name}`)
				}
			})

			if (resultObj.errorTagArr.length) {
				this.$Message.error({
					content: `${resultObj.errorTagArr.join(',')}，请选择素材标签`,
					duration: 3
				})
				return
			}

			console.log({
				material_type: this.type === 'video' ? 2 : (this.type === 'photo' ? 1 : null),
				files: this.materialArr,
				tag_ids: resultObj.tag_ids,
				names: resultObj.names,
				group_id: filter.groupId
			})

			this.submitClock = true
			// 添加素材
			addMaterial({
				material_type: this.type === 'video' ? 2 : (this.type === 'photo' ? 1 : null),
				files: this.materialArr,
				tag_ids: resultObj.tag_ids,
				names: resultObj.names,
				group_id: filter.groupId
			}).then(res => {
				if (res.code === 200) {
					this.$Message.success({
						content: '保存成功',
						duration: 3
					})
				}

				this.$Bus.$emit('editEmitEvent') // 列表数据刷新
				this.submitClock = false
				this.goBack() // 返回上一页

			}, err => {
				this.submitClock = false
			})
		},
		/**
		 * [goBack 返回上一页]
		 * @return {[type]} [description]
		 */
		goBack() {
			this.$router.replace({name: 'tool-material', query: {type: this.type}})
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.edit-content-card
	min-height: calc(100vh - 200px)
.add-head
	display: flex
	.head-title
		flex: 1
		h4
			font-size: 18px
			font-weight: 800
			line-height: 28px
		p
			font-size: 13px
			font-weight: 500
			color: #999999
			line-height: 20px
			margin-top: 4px
	.head-filter
		flex: 0 0 480px
		display: flex
		align-items: center
		justify-content: flex-end
	.filter-item
		flex: 1
		display: flex
		justify-content: flex-end
	.require
		height: 32px
		line-height: 40px
		color: #FF0000
	.name
		height: 32px
		line-height: 32px
		margin: 0 8px 0 4px
		color: #465cfe
		cursor: pointer
		text-decoration: underline
	.filter-select
		flex: 0 0 150px
		width: 150px
.material-middle
	font-size: 0px
	/deep/ .upload-card
		display: inline-block
		vertical-align: top
		.item-upload
			display: inline-block
			vertical-align: top
			width: 214px
			margin-right: 24px
			margin-bottom: 24px
			.upload-inner
				height: 124px
	.item-list
		display: inline-block
		vertical-align: top
		width: 214px
		margin-right: 24px
		margin-bottom: 24px
	.material-photo
		position: relative
		width: 218px
		height: 124px
		background-color: #FAFAFA
		border: 1px solid #EBEBEB
		border-radius: 4px
		text-align: center
		display: flex
		align-items: center
		justify-content: center
		transition: all 0.5s
		&:hover
			border: 1px solid rgba(230,2,20, 0.8)
			.delete
				opacity: 1
		img, video
			max-width: 100%
			max-height: 100%
		.delete
			opacity: 0
			transition: all 0.5s
			position: absolute
			right: -10px
			top: -10px
			width: 20px
			height: 20px
			border-radius: 50%
			line-height: 17px
			text-align: center
			background-color: #E60012
			color: #fff
			font-size: 13px
			cursor: pointer
	.material-name
		margin-top: 4px
		line-height: 24px
		font-size: 14px
		font-weight: 500
		color: #999999
		overflow: hidden
		text-overflow: ellipsis
		white-space: nowrap
	.material-tag
		margin-top: 6px
		display: flex
		flex-items: center
		justify-content: space-between
		.tag-label
			display: inline-block
			vertical-align: top
			height: 24px
			line-height: 24px
			font-size: 14px
			font-weight: 500
			span
				color: #FF0000
				display: inline-block
				vertical-align: -3px
				margin-right: 4px
		.tag-select
			display: inline-block
			vertical-align: top
			flex: 0 0 160px
			width: 160px
.material-middle-noData
	font-size: 16px
	text-align: center
	line-height: 2
</style>
