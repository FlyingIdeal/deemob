<template>
	<div class="page-main">
		<div class="edit-content-card">
			<div class="page-detail-title clearfix">
				<h2>{{id ? '编辑创意包':'新建创意包'}}</h2>
				<div class="is-handler">
					<Button @click="goBack()" class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
				</div>
			</div>
			<div class="clearfix">
				<div class="ad-left-content">
					<Form :model="formBase" :label-colon="true" label-position="right" :label-width="labelWidth" :rules="ruleBase" ref="formBase">
						<FormItem label="创意包名称" prop="creative_name">
							<Input maxlength="30" :disabled="hasIdDisabled" show-word-limit placeholder="请输入创意包名称" v-model.trim="formBase.creative_name"></Input>
						</FormItem>
					</Form>

					<!-- 创意包 -->
					<creative-package ref="creativePackage" :formLabelWidth="labelWidth" :hasIdDisabled="hasIdDisabled" @on-creative-type="showDemoSrc" @on-form-validate="packageValidate"></creative-package>
				</div>
				<div class="ad-right-content" v-if="demoSrc">
					<h3>广告示意图</h3>
					<div class="mobile-card">
						<div class="mobile-center">
							<img :src="demoSrc">
						</div>
					</div>
				</div>
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
		<BackTop></BackTop>
	</div>
</template>

<script>
import { showTitle, imageFormat, videoFormat } from '@/libs/util'
import { getQueryString } from '@/libs/tools'
import { addCreative, editCreative, getCreativeList, addMaterial } from '@/api/tool'
import creativePackage from '@/view/tool/creative/creative-package'

export default {
	components: {
		creativePackage
	},
	data() {
		return {
			id: this.$route.query.id ? Number(this.$route.query.id) : '', // 新建创意包
			hasIdDisabled: false, // 编辑的时候 广告交互 和 创意形式 不可修改

			labelWidth: 130, // 左侧宽度
			formBase: {
				creative_name: '' // 意包名称
			},
			childNeedForm: { // 文件包模块，注入的内容form
				_tag_: 'new'
			},
			returnChildForm: {}, // 子集返回的form表单

			ruleBase: { // 正则
				creative_name: [
					{required: true, message: '请输入创意包名称'}
				]
			},

			demoSrc: '', // 手机demo预览图
			submitClock: false // 保存锁
		}
	},
	mounted() {
		if(this.id) {
			this.hasIdDisabled = true
			this.getCreativeDetail()
		} else {
			this.creativePackInject()
		}
	},
	methods: {
		/**
		 * [getCreativeDetail 创意包详情]
		 * @return {[type]} [description]
		 */
		getCreativeDetail() {
			this.$Spin.show()
			
			getCreativeList({creative_id: this.id}).then(res=> {

				this.$Spin.hide()

				if(res.code === 200) {
					let _data = res.data.list[0]

					// 1. 父级form表单的反显
					this.formBase.creative_name = _data.creative_name

					// 2. 子集需要的form数据
					// 给childNeedForm加入一个tag, 用去在creative-package中功能使用，此处属于编辑回显
					_data._tag_ = 'edit'
					this.childNeedForm = _data

					this.creativePackInject()
				}
			})
		},

		/**
		 * [creativePackInject 创意包模块 内容注入]
		 * @return {[type]} [description]
		 */
		creativePackInject() {
			this.$refs.creativePackage.injectData(this.childNeedForm) // 子集注入数据
		},

		/**
		 * [showDemoSrc 显示手机框图片]
		 * @return {[type]} [description]
		 */
		showDemoSrc(url) {
			this.demoSrc = url
		},

		/**
		 * [packageValidate 子集form表单提交内容, 验证是否通过]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		packageValidate(obj) {
			this.returnChildForm = obj
		},
		/**
		 * [submitSet 提交表单]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		submitFormData(name) {
			let _this = this

			_this.$refs[name].validate((valid) => {
				if (valid) {

					_this.$refs.creativePackage.validatorForm() // 验证子集的form表单

					if(!_this.returnChildForm.valid) {
						return
					}

					let form = {..._this.formBase, ..._this.returnChildForm.form}

					_this.submitClock = true

					// 新建时需要检验文件是否上传到素材库
					if (!!_this.id) { // 编辑时不需要检验，直接保存创意包
						this.toAddOrEditCreative(form)
					} else {
						this.checkHasMaterialId(form) // 校验是否含有素材id
					}

				} else {
					this.$Message.error({content: this.$config.requiredText, duration: 3})
				}
			})
		},
		/**
		 * [checkHasMaterialId 校验图片的url中是否还有素材id，有的直接保存素材id，无的话保存到素材库，拿到素材id]
		 * @param  {[type]} form [description]
		 * @return {[type]}      [description]
		 */
		checkHasMaterialId(form = {}) {

			try {
				let result

				// 1.  根据material_type（1.图片 / 2. 视频）区分
				if (form.material_type === 1) {
					result = this.filterUrl2MaterialId(form.pic_url_arr, new Array(form.pic_url_arr.length).fill(0))
				} else if (form.material_type === 2) { // 素材+视频

					let concatArr = [...[form.cover_url], ...[form.video_url]] // 合并封面图+视频

					result = this.filterUrl2MaterialId(concatArr, new Array(concatArr.length).fill(0))
				}

				let catchIdArr = result.catchIdArr // 最后保存创意包用到的素材id
				let filesObj = result.filesObj // 添加到素材的文件
				let noMaterIdObj = result.noMaterIdObj // 没有素材id, 用于记住索引

				if (!!filesObj.files.length) { // 新上传的图片，先保存到素材获取id

					let proArr = [] // 上传素材，分图片/视频

					let classifyObj = {
						imgFilesArr: [], // 图片文件对象
						imgNamesArr: [], // 图片名称
						videoFilesArr: [], // 视频文件对象
						videoNamesArr: [] // 视频名称
					}

					// 区分素材类型，从而选择 material_type
					filesObj.files.map((fileItem, fileIndex) => {

						if (imageFormat.includes(fileItem.type)) { // 图片
							classifyObj.imgFilesArr.push(fileItem)
							classifyObj.imgNamesArr.push(filesObj.names[fileIndex])
						}

						if (videoFormat.includes(fileItem.type)) { // 视频
							classifyObj.videoFilesArr.push(fileItem)
							classifyObj.videoNamesArr.push(filesObj.names[fileIndex])
						}
					})

					if(classifyObj.imgFilesArr.length) { // 图片
						proArr.push(addMaterial({material_type: 1, files: classifyObj.imgFilesArr, names: classifyObj.imgNamesArr}))
					}

					if(classifyObj.videoFilesArr.length) { // 视频
						proArr.push(addMaterial({material_type: 2, files: classifyObj.videoFilesArr, names: classifyObj.videoNamesArr}))
					}
					
					Promise.all(proArr).then(res => {
						let arr2 = []

						if(res[0].code === 200) {
							arr2 = arr2.concat(res[0].data.list)
						}

						if(res[1] && res[1].code === 200) {
							arr2 = arr2.concat(res[1].data.list)
						}

						arr2.map((item, index) => {
							catchIdArr[noMaterIdObj[index]] = item.material_id
						})

						return arr2.length > 0 ? true : false

					}, err => {
						return false
					}).then(flag => {

						if (!flag) {
							this.submitClock = false
							this.$Message.error({
								content: '保存素材错误',
								duration: 3
							})
							return
						}

						this.toAddOrEditCreative(form, catchIdArr) // 新建创意包
					})
				} else { // 全部都是素材
					this.toAddOrEditCreative(form, catchIdArr) // 新建创意包
				}

			} catch (e) {
				console.log(e)
			}
		},
		/**
		 * [toAddOrEditCreative 新建/保存创意包]
		 * @param  {[type]} form       [表单内容]
		 * @param  {[type]} materialId [素材id]
		 * @return {[type]}            [description]
		 */
		toAddOrEditCreative(form, materialId) {

			try {

				console.log(form)
				let _this = this

				_this.submitClock = true

				let proUrl = '' // 请求接口

				// 此处加个逻辑判断： 用于处理视频封面图 cover_img
				if (!!form.cover_url) {
					form.cover_url = form.cover_url.split('?')[0]
				}

				delete form.material_size // 需要删除不要的字段 - 尺寸

				if (!!_this.id) { // 编辑
					proUrl = editCreative(form)
				} else { //新建

					// 1. 新建时 删除 pic_url_arr 和 video_url
					delete form.pic_url_arr
					delete form.video_url

					// 2. 绑定素材id
					form['material_id_arr'] = materialId

					proUrl = addCreative(form)
				}

				proUrl.then(res => {

					if (res.code === 200) {

						this.$Bus.$emit('editEmitEvent') // 列表数据刷新
						_this.$Message.success({
							content: '保存成功',
							duration: 3
						})

						setTimeout(() => {
							_this.submitClock = false
							_this.goBack()
						}, 1500)
					} else {
						_this.submitClock = false
					}
				}, err => {
					_this.submitClock = false
				})

			} catch (e) {
				console.log(e)
			}
		},
		/**
		 * [filterUrl2MaterialId 根据url 筛选出素材id、或者files文件组]
		 * @param  {[type]} arr [遍历的对象]
		 * @param  {[type]} catchIdArr [塞入的id]
		 * @return {[type]}     [description]
		 */
		filterUrl2MaterialId(arr, catchIdArr) {
			try {
				let filesObj = {
					files: [], // 添加素材的文件对象
					names: [] // 文件名称数组
				}

				let noMaterIdObj = {
					length: 0
				} // 没有素材id, 用于记住索引
				let num = 0

				arr.map((item, index) => {
					let materialId = getQueryString('materialId', item)

					if (materialId === 'undefined' || materialId === 'null' || !materialId) { // 未上传

						filesObj.files.push({
							url: item.split('?')[0],
							type: getQueryString('type', item) || 'jpg',
							size: Number(getQueryString('bit', item)),
							width: Number(getQueryString('width', item)),
							height: Number(getQueryString('height', item)),
							duration: Number(getQueryString('duration', item)),
							video_info: JSON.parse(getQueryString('video_info', item))
						})

						filesObj.names.push(getQueryString('name', item))

						// 存储没有Id的index
						noMaterIdObj[num] = index
							++num

					} else { // 已上传过的素材
						catchIdArr[index] = Number(materialId)
					}

					++noMaterIdObj.length
				})

				return {
					catchIdArr,
					filesObj,
					noMaterIdObj
				}

			} catch (e) {
				console.log(e)
			}
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

.ad-right-content
	width: 244px
	display: inline
	float: left
	margin-left: 40px
	h3
		padding-right: 24px
		font-size: 14px
		line-height: 30px
		font-weight: 600
		text-align: center
		margin-bottom: 10px
.ad-left-content
	float: left
	width: 820px
</style>
