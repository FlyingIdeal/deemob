<template>
	<div class="upload-center">
		<div class="upload-middle">
			<div class="upload-item" v-for="(item, index) in dataImgArr">
				<div class="upload-image">
					<div class="logo-image" :style="fixAreaStyle">
						<video :src="item.url" v-if="item.loading && item.url" controls="controls" class="ry-align-center" :style="maxAreaStyle">
							您的浏览器不支持 video 标签。
						</video>

						<div class="cover" :style="fixAreaStyle" :class="{'is-edit': disEdit, 'cover-isupload': item.loading}">
							<div class="cover_content" :style="areaStyle">
								<div class="left">
									<div class="tipContent" @click="zoomUpModal(item, index)">
										<i class="icon icon-zoom-up" />
										<p>放大查看</p>
									</div>
								</div>
								<div class="right" v-if="!multiple">
									<div class="tipContent" @click="resetUpload(index)">
										<i class="icon icon-upload" />
										<p>重新上传</p>
									</div>
								</div>

								<div class="right" v-if="multiple">
									<div class="tipContent" @click="deleteUploadImg(index)">
										<i class="icon icon-delete" />
										<p>删除</p>
									</div>
								</div>
							</div>
						</div>
						<!-- v-if="loading" -->
						<Spin fix class="spin-fix" v-if="!item.loading">
							<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
							<div>上传中...</div>
						</Spin>
					</div>
				</div>
				<h6 class="file-name" :style="{width: `${componentWidth}px`}" v-if="item.name && showUploadName">{{item.name}}</h6>
			</div>

			<div class="upload-item" v-show="isAllLoading && (multiple || dataImgArr.length === 0 || dataImgArr.length < multipleLen)">
				<!-- 上传插件显示条件 1.多图； 2.dataImgArr.length === 0 -->
				<div class="upload-image">
					<Upload
						:multiple="multiple"
						:action="actionUrl"
						:format="format"
						:max-size="bit"
						:data="{type: 3}"
						:show-upload-list="false"
						:on-exceeded-size="handleMaxSize"
						:before-upload="handleBeforeUpload"
					>
						<div :id="`uploadAgain_${idName}`" class="logo-upload" :style="areaStyle">
							<slot></slot>
						</div>
					</Upload>
				</div>
			</div>
		</div>

		<Modal v-model="zoomUpModalFlag" class="mediaModal" :width="935" class-name="vertical-center-modal">
			<div class="img_content">
				<video :src="zoomUpObj.url" controls>
					您的浏览器不支持 video 标签。
				</video>
			</div>
			<div slot="footer"></div>
		</Modal>
	</div>
</template>

<script>

/*校验规则

1. multiple: 是否开启多张图片上传，如果是同样校验图片规则，过滤满足条件的file， 但是不提示错误信息；  
	用户在多选的情况下，但是只选择了一张图片，如果是同样校验图片规则，提示错误信息*/

import { fileVideoReader2Promise, debounce, getQueryString } from '@/libs/tools'
import { dataType, videoFormat } from '@/libs/util'
import { ucUploadFile, ucUploadFileUrl } from '@/api/common'

export default {
	props: {
		defaultList: { // 已有的图片列表
			type: [Array, String]
		},
		idName: { // id 用于处理页面里多处使用问题
			type: Number,
			required: true
		},
		multiple: { // 是否支持多张上传，如果true, 不提示错误信息，满足条件即可通过
			type: Boolean,
			default: false
		},
		multipleLen: { // 上传素材个数
			type: Number,
			default: 1 // 默认1个
		},
		componentWidth: { // 组件的宽度
			type: Number,
			default: 60 // 默认60宽
		},
		componentHeight: { // 组件的高度
			type: Number,
			default: 60
		},
		disEdit: { // 是否可编辑
			type: Boolean,
			default: false
		},
		bit: { // 素材大小 KB
			type: Number,
			default: 5 * 1024 // 默认5M
		},
		format: { // 上传的format类型， 必须小写
			type: Array,
			default: function() {
				return videoFormat
			}
		},
		minWidth: Number, // 最小宽度
		isCalcErrorRatio: false, // 是否计算图片尺寸容错率
		errorRate: {// 容错率, 默认为5
			type: Number,
			default: 5
		},
		errorRatio: { // 容错比例, 默认1"1
			type: String,
			default: '1:1'
		},
		showUploadName: { // 是否显示上传图片名称，默认不显示
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			actionUrl: ucUploadFileUrl, // action的url
			isAllLoading: true, // 已全部上传完成, 默认事
			noConformArr: [], // 不符合文件规格的文件,最后提示使用

			dataImgArr: [], // 最后渲染的图片列表
			fileReaderList: [], // 读取文件时，临时存储的file源信息的数组

			zoomUpModalFlag: false, // 控制显示隐藏放大弹窗
			zoomUpObj: {} // 弹框展示的元素
		}
	},
	computed: {
		/**
		 * [areaStyle 组件的宽高, 公共样式]
		 * @type {Object}
		 */
		areaStyle() {
			return {width: `${this.componentWidth}px`, height: `${this.componentHeight}px`}
		},
		/**
		 * [fixAreaStyle 组件的宽高, 公共样式, 行高和组件高度相同]
		 * @return {[type]} [description]
		 */
		fixAreaStyle() {
			return {width: `${this.componentWidth}px`, height: `${this.componentHeight}px`, lineHeight: `${this.componentHeight}px`}
		},
		/**
		 * [maxAreaStyle 组件的宽高 - border]
		 * @return {[type]} [description]
		 */
		maxAreaStyle() {
			return {maxWidth: `${this.componentWidth - 2}px`, maxHeight: `${this.componentHeight - 2}px`}
		}
	},
	methods: {
		/**
		 * [resetUpload 重新上传]
		 * @param  {[type]} index [索引]
		 * @return {[type]}	   [description]
		 */
		resetUpload(index) {
			// 在上一次upload未完成之前，不可点击重复上传
			if(!this.isAllLoading) {
				return
			}

			const docHtml = document.getElementById(`uploadAgain_${this.idName}`)
			docHtml.click()
		},
		/**
		 * [deleteUploadImg 删除某个]
		 * @param  {[type]} index [description]
		 * @return {[type]}	   [description]
		 */
		deleteUploadImg(index) {
			// 在上一次upload未完成之前，不可操作
			if(!this.isAllLoading) {
				return
			}

			this.dataImgArr.splice(index, 1)
			this.emitImgValue() // 发送数据
		},
		/**
		 * [emitImgValue 向外发送emit数据]
		 * @return {[type]} [description]
		 */
		emitImgValue() {

			let _arr = []

			console.log(this.dataImgArr)
			this.dataImgArr.map(item => {
				if(!!item.url) {
					if(!!this.showUploadName) {
						
						let info = item.fileInfo || {}

						// 上传到素材，需要宽+高+大小kb+时长
						_arr.push(`${item.url}?materialId=${item.materialId}&name=${escape(item.name)}&type=${info.type}&width=${info.width}&height=${info.height}&bit=${info.bit}&duration=${info.duration}&video_info=${escape(JSON.stringify(item.video_info))}`)
					} else {
						_arr.push(item.url)

					}
				}
			})

			console.log(_arr.join(','))

			this.$emit('on-change', _arr.join(','), this.rowIndex) // 向外发送数据, 字符串类型
			this.$emit('on-upload-end', {isAllLoading: this.isAllLoading, msg: '上传完成'}) // 上传前动作
		},
		/**
		 * [toDoUpload 上传图片 axios]
		 * @return {[type]} [因为handleBeforeUpload为同步接口，上传多张图片时，会重复执行]
		 * @return {[type]} [multiple上传多图时，防抖1500ms，单图时防抖100ms]
		 * @return {[type]} [description]
		 */
		toDoUpload(conformFileList){

			let _this = this

			// 长度为0 return
			if(!conformFileList.length) {
				this.toShowErrorFile() // 错误提醒
				return
			}

			// 1. 单张上传时，清空列表
			if(!this.multiple && this.multipleLen === 1) {
				_this.dataImgArr = []
			}

			_this.isAllLoading = false // 是否已全部上传完成

			let preDataImgArrLen = _this.dataImgArr.length // 当再次上传时，先获取之前数据的长度
			_this.dataImgArr = [..._this.dataImgArr, ...conformFileList] // 复制

			this.$emit('on-upload-begin', {isAllLoading: _this.isAllLoading, msg: '上传开始'}) // 上传前动作

			let number = 0 // 上传个数， 用于判断是否全部上传完成

			// 自执行上传
			for(let i = 0; i < conformFileList.length; i++) {
				(function(index) {

					let _index = preDataImgArrLen + index

					let formData = new FormData()
					formData.append('files', _this.dataImgArr[_index].file) // 文件对象
					formData.append('type', 3) // 图片2， 视频3
					formData.append('platform_id', _this.$config.platformId) // 图片2， 视频3

					ucUploadFile(formData).then(res => {
						return (res.code === 200 && res.data.list.length) ? res.data.list[0] : null
					}, err => {
						return null
					}).then((value) => {

						_this.$set(_this.dataImgArr[_index], 'url', !!value ? value.url : '')
						_this.$set(_this.dataImgArr[_index], 'video_info', !!value ? value.video_info : {})
						_this.$set(_this.dataImgArr[_index], 'loading', true)

						++number

						// 说明已上传完成
						if(number >= conformFileList.length) {
							_this.uploadIsOver() // 上传动作完成
						}
					})
				})(i)
			}
		},
		/**
		 * [uploadIsOver 上传动作完成]
		 * @return {[type]} [description]
		 */
		uploadIsOver() {
			console.log('视频上传完成...')

			let copyArr = [...this.dataImgArr] // copy
			// 过滤上传成功的文件
			let _arr = copyArr.map(item => {
				if(!!item.url) {
					delete item.file
					return item
				}
			})

			this.dataImgArr = [..._arr]

			this.toShowErrorFile() // 错误提醒
			this.emitImgValue() // 向外发送数据
		},
		/**
		 * [resetSomeData 重置数据]
		 * @return {[type]} [description]
		 */
		resetSomeData() {
			this.noConformArr = [] // 重置
			this.fileReaderList = [] // file源文件清空
			this.isAllLoading = true // 是否已全部上传完成
		},
		/**
		 * [handleMaxSize 文件大小校验]
		 * @param  {[type]} file [description]
		 * @return {[type]}	  [description]
		 */
		handleMaxSize(file) {
			// this.$Message.warning('超过文件大小限制')
		},
		/**
		 * [handleBeforeUpload 图片上传之前]
		 * @param  {[type]} file [description]
		 * @return {[type]}	  [description]
		 */
		handleBeforeUpload(file) {

			this.isAllLoading = false // 是否已全部上传完成

			this.fileReaderList.push(file) // 存储源文件

			this.fileReadOver() // 文件读取完毕之后，开启格式校验

			return false
		},
		/**
		 * [fileReadOver 文件读取完毕， 放入promise.all请求中]
		 * @return {[type]} [description]
		 */
		fileReadOver: debounce(function() {

			if(!this.fileReaderList.length) { // 为0， 不处理
				return
			}

			let proArr = this.fileReaderList.map(item => { 
				return fileVideoReader2Promise(item)
			})

			// 全部源文件，本地读取完成
			Promise.all(proArr).then(res => {
				return res
			}, err => {
				return err
			}).then(res => {
				if (!!res) {
					this.toGetFileFormat(res, this.fileReaderList) // 获取筛选结果
				} else {
					this.$Message.warning('视频格式错误')
					this.resetSomeData() // 重置
				}
			})

		}, 1000),
		/**
		 * [toGetFileFormat 获取筛选结果]
		 * @param  {[type]} resArr [返回的promise的res数据]
		 * @param  {[type]} fileArr [存储的file的源信息，之所以加上，是因为最后上传使用]
		 * @return {[type]}	 [description]
		 */
		toGetFileFormat(resArr, fileArr) {
			if(!resArr.length) { // 空
				return
			}

			// 结果不相等返回, 预防fileVideoReader2Promise的读取返回结果异常
			if(resArr.length !== fileArr.length) {
				return
			}

			let _arr = [] // 临时存储

			resArr.map((res, index) => {
				// 完全匹配
				if (res.name === fileArr[index].name) {

					let fileName = res.name.replace(/\s*/g,'').substring(0, 30)

					let fileObj = {
						name: fileName,
						bit: res.bit,
						width: res.width,
						height: res.height,
						type: res.type,
						duration: parseInt(res.duration),
						volume: res.volume
					}

					_arr.push({
						checkArr: [
							this.checkDuration(fileObj), // 检查时长 , 时长≥5s，≤60s
							this.checkMinWidth(fileObj), // 检查最小宽度
							this.checkMaxBit(fileObj), // 检查文件大小 ,kb单位
							this.checkFormat(fileObj), // 检验文件类型
							this.checkVolume(fileObj), // 检验文件音量
							this.checkErrorRatio(fileObj) // 容错比
						],
						file: fileArr[index], // 源文件
						name: fileName,
						fileInfo: fileObj, // 文件信息，在保存到素材库使用
						video_info: {} // 视频基本信息
					})
				}
			})

			this.toFilterFile(_arr)

		},
		/**
		 * [toFilterFile 分类  能上传的/不能上传的]
		 * @return {[type]} [description]
		 */
		toFilterFile(arr) {

			if(!arr.length) {
				return
			}

			// 筛选出不能上传的文件
			let resultArr = arr.map(item => {
				return this.checkInnerMsg(item)
			})

			// 把不符合条件的展示出来
			let noConformArr = [] // 不符合的
			let yesConformArr = [] // 符合的

			resultArr.map((item, index) => {
				if (!item.flag) { // 不符合规格文件的
					noConformArr.push(`${item.name}, ${item.msg.join('/')}`)
				} else {
					yesConformArr.push({ // 符合规格文件的
						name: item.name,
						loading: false, // 上传loading
						file: arr[index].file,
						fileInfo: arr[index].fileInfo
					})
				}
			})

			this.noConformArr = noConformArr // 把不符合文件规格的存储起来,最后提示使用

			this.toDoUpload(yesConformArr) // 把符合规格的图片，上传
		},
		/**
		 * [toShowErrorFile 显示错误文件]
		 * @return {[type]} [description]
		 */
		toShowErrorFile() {
			if (this.noConformArr.length) {
				this.$Modal.warning({
					title: '错误提示',
					content: `${this.noConformArr.join('<br/>')}<br/><br/>请重新上传`,
					width: 500,
					onOk: () => {
						this.resetSomeData() // 重置
					}
				})
			} else {
				this.resetSomeData() // 重置
			}
		},
		/**
		 * [checkInnerMsg 监测错误内容,并返回msg]
		 * @param  {[type]} item [description]
		 * @return {[type]}	  [description]
		 */
		checkInnerMsg(item){
			let result = {
				name: '',
				flag: true,
				msg: []
			}

			// 遍历满足规格file, 并把不满足的文件错误信息放入msg中，并把flag标记为false
			item.checkArr.map(child => {
				result.name = child.name
				if(!child.value) {
					result.msg.push(child.msg)
					result.flag = false
				}
			})

			return result
		},
		/**
		 * [checkDuration 校验时长]
		 * return true / false
		 * Message 不弹出条件 multiple多选&并且选中的图片大于1
		 * @return {[type]} [description]
		 */
		checkDuration(obj) {
			let flag = obj.duration <= 0 || obj.duration > 60

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? '时长必须大于0s,小于60s' : ''
			}
		},
		/**
		 * [checkMaxBit 校验大小]
		 * return true / false
		 * Message 不弹出条件 multiple多选&并且选中的图片大于1
		 * @return {[type]} [description]
		 */
		checkMaxBit(obj) {
			let flag = (obj.bit / 1000) > this.bit

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? '超过文件大小限制' : ''
			}
		},
		/**
		 * [checkErrorRatio 校验尺寸容错率]
		 * Message 不弹出条件 multiple多选&并且选中的图片大于1
		 * @param  {[type]} ratio [description]
		 * @return {[type]}	   [description]
		 */
		checkErrorRatio(obj) {

			let flag = true

			if (this.isCalcErrorRatio) {
				let _arr = this.errorRatio.split(':')

				let _w = Number(_arr[0]) // 容错比例 宽
				let _h = Number(_arr[1]) // 容错比例 高

				let needR = _w / _h
				let curtR = obj.width / obj.height
				let abs = Math.abs(needR - curtR) * 100

				if (parseInt(abs) > this.errorRate) {
					flag = false
				}
			}

			return {
				name: obj.name,
				value: flag,
				msg: !flag ? '视频尺寸不符合规格' : ''
			}
		},
		/**
		 * [checkVolume 检查音量]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		checkVolume(obj) {
			let flag = obj.volume === 0

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? '视频没有音量' : ''
			}
		},
		/**
		 * [checkFormat 校验文件类型, 必须满足]
		 * @param  {[type]} type [description]
		 * Message 不弹出条件 multiple多选&并且选中的图片大于1
		 * @return {[type]}	  [description]
		 */
		checkFormat(obj) {
			let flag = !this.format.includes(obj.type)

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? '格式错误' : ''
			}
		},
		/**
		 * [checkMinWidth 校验最小宽度]
		 * @param  {[type]} width [description]
		 * Message 不弹出条件 multiple多选&并且选中的图片大于1
		 * @return {[type]}	   [description]
		 */
		checkMinWidth(obj) {
			
			let flag = !!(this.minWidth && obj.width < this.minWidth)

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? '视频小于规定尺寸' : ''
			}
		},
		/**
		 * [zoomUpModal 显示放大图片]
		 * @return {[type]} [description]
		 */
		zoomUpModal(item, index) {
			this.zoomUpObj = item
			this.zoomUpModalFlag = true
		}
	},
	watch: {
		defaultList: {
			immediate: true,
			handler: function(newVal) {

				let _type = dataType(newVal)
				let _arr = []
				let _resultArr = (_type === 'string' && !!newVal) ? newVal.split(',') : (_type === 'array' ? newVal : [])

				// 此处用于反显处理，不显示文件名册
				if (!!_resultArr.length) {

					_resultArr.map(item => {

						if (!!item) {
							let fileInfo = {
								name: getQueryString('name', item),
								bit: getQueryString('bit', item),
								width: getQueryString('width', item),
								height: getQueryString('height', item),
								type: getQueryString('type', item),
								duration: getQueryString('duration', item)
							}

							_arr.push({
								loading: true,
								materialId: getQueryString('materialId', item) || null, // 素材id
								name: getQueryString('name', item),
								url: item.indexOf('?') > -1 ? item.split('?')[0] : item,
								fileInfo: fileInfo,
								video_info: JSON.parse(getQueryString('video_info', item))
							})
						}
					})
				}

				this.dataImgArr = _arr
			}
		}
	}
}
</script>
<style lang="stylus">
.mediaModal{
	.img_content {
		width 895px
		height 556px
		margin 0 auto
		text-align center
		line-height 400px
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		flex-direction: column;
		img, video {
			text-align center
			max-width 400px
			max-height 400px
			vertical-align middle
		}
	}
	.ivu-modal-footer {
		border 0px;
		padding 0px
	}
}
</style>

<style lang="stylus" scoped>
@import './index.styl';
.demo-spin-icon-load{
	animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
	from { transform: rotate(0deg);}
	50%  { transform: rotate(180deg);}
	to   { transform: rotate(360deg);}
}
.spin-fix
	line-height: 2
</style>
