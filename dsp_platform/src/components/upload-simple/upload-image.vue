<template>
	<div class="upload-card">
		<Upload
			v-show="isAllLoading"
			class="item-upload"
			:multiple="multiple"
			type="drag"
			:action="actionUrl"
			:show-upload-list="false"
			:before-upload="handleBeforeUpload"
		>
			<div class="upload-inner">
				<Icon type="ios-cloud-upload-outline" size="46"></Icon>
				<p class="inner-text">点击或者拖拽上传</p>
			</div>
		</Upload>
		<div class="item-upload item-upload-fix" v-show="!isAllLoading">
			<div class="ivu-upload-drag">
				<div class="upload-inner">
					<Icon type="ios-cloud-upload-outline" size="46"></Icon>
					<p class="inner-text">点击或者拖拽上传</p>
				</div>
				<Spin fix class="spin-fix">
					<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
					<div>上传中...</div>
				</Spin>
			</div>
		</div>
	</div>
</template>

<script>

import { fileReader2Promise, debounce } from '@/libs/tools'
import { ucUploadFile, ucUploadFileUrl } from '@/api/common'
import { imageFormat } from '@/libs/util'

export default {
	props: {
		multiple: { // 是否支持多选文件
			type: Boolean,
			default: false
		},
		bit: { // 素材大小 KB
			type: Number,
			default: 400 // 默认 400kb
		},
		format: { // 上传的format类型， 必须小写
			type: Array,
			default: function() {
				return imageFormat
			}
		},
		isCalcErrorRatio: false, // 是否计算图片尺寸容错率
		errorRate: { // 容错率, 默认为5
			type: Number,
			default: 5
		},
		errorRatio: { // 容错比例, 默认1"1
			type: String,
			default: '1:1'
		},
		ratio: String, // 素材比例  例如 1:1 ,3:2
		minWidth: Number, // 最小宽度
		maxWidth: Number, // 最大高度
	},
	data() {
		return {
			actionUrl: ucUploadFileUrl, // action的url
			isAllLoading: true, // 已全部上传完成, 默认事
			noConformArr: [], // 不符合文件规格的文件,最后提示使用

			dataImgArr: [], // 最后渲染的图片列表
			fileReaderList: [], // 读取文件时，临时存储的file源信息的数组
		}
	},
	methods: {
		// 图片： JPG / PNG / JPEG / GIF  <= 400 KB
		// 视频： MP4 / MOV， 大小 <= 60 M【 以下规格请尽量校验， 最后是否能完成的结果请邮件同步： 时长≤ 60 s， 必须带有声音, 视频帧率 >= 516 kbps； 建议调研并完成】
		
		/**
		 * [emitImgValue 向外发送emit数据]
		 * @return {[type]} [description]
		 */
		emitImgValue() {
			this.$emit('on-change', this.dataImgArr) // 向外发送数据, 字符串类型
			this.$emit('on-upload-end', {isAllLoading: this.isAllLoading, msg: '上传完成'}) // 上传完成
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

			// 1. 遍历，把流文件存放在filesArr内
			let formData = new FormData()

			conformFileList.map((item, index) => {
				formData.append('files', item.file) // 图片2， 视频3
			})

			formData.append('type', 2) // 图片2， 视频3
			formData.append('platform_id', this.$config.platformId) // 图片2， 视频3

			this.dataImgArr = []

			ucUploadFile(formData).then(res => {
				return res.code === 200 ? res.data.list : false
			}, err => {
				return false
			}).then(valueArr => {

				if(!valueArr) {
					this.resetSomeData() // 重置
					return
				}

				if (!valueArr || valueArr.length !== conformFileList.length) { // 上传缺失文件
					this.$Message.error({
						content: '上传图片缺失，请刷新重试',
						duration: 3
					})

					this.resetSomeData() // 重置

				} else {

					valueArr.map((child, index) => {
						child.name = conformFileList[index].name 
					})

					this.dataImgArr = valueArr

					this.uploadIsOver()
				}
			})
		},
		/**
		 * [uploadIsOver 上传动作完成]
		 * @return {[type]} [description]
		 */
		uploadIsOver() {
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
		 * [handleBeforeUpload 图片上传之前]
		 * @param  {[type]} file [description]
		 * @return {[type]}      [description]
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
				return fileReader2Promise(item)
			})

			// 全部源文件，本地读取完成
			Promise.all(proArr).then(res => {
				return res
			}, err => {
				return false
			}).then(res => {
				if (!!res) {
					this.toGetFileFormat(res, this.fileReaderList) // 获取筛选结果
				} else {
					this.$Message.warning('图片格式错误')
					this.resetSomeData() // 重置
				}
			})

		}, 1000),
		/**
		 * [toGetFileFormat 获取筛选结果]
		 * @param  {[type]} resArr [返回的promise的res数据]
		 * @param  {[type]} fileArr [存储的file的源信息，之所以加上，是因为最后上传使用]
		 * @return {[type]}     [description]
		 */
		toGetFileFormat(resArr, fileArr) {
			if(!resArr.length) { // 空
				return
			}

			// 结果不相等返回, 预防fileReader2Promise的读取返回结果异常
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
						duration: null // 素材时长为0
					}

					_arr.push({
						checkArr: [
							this.checkMaxBit(fileObj), // 检查文件大小 ,kb单位
							this.checkMinWidth(fileObj), // 检查最小宽度
							this.checkMaxWidth(fileObj), // 检查最大宽度
							this.checkFormat(fileObj), // 检验文件类型
							this.checkErrorRatio(fileObj), // 容错比
							this.checkW2HRatio(fileObj) // 只检测图片宽高比，不校容错
						],
						file: fileArr[index], // 源文件
						name: fileName
					})
				}
			})

			console.log(_arr)

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
						file: arr[index].file
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
		 * @return {[type]}      [description]
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
		 * [checkMaxBite 校验大小]
		 * return true / false
		 * @return {[type]} [description]
		 */
		checkMaxBit(obj) {
			let flag = (obj.bit / 1000) > this.bit

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? `文件不能超过${this.bit}KB` : ''
			}
		},
		/**
		 * [checkFormat 校验文件类型, 必须满足]
		 * @param  {[type]} type [description]
		 * @return {[type]}      [description]
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
		 * @return {[type]}       [description]
		 */
		checkMinWidth(obj) {
			
			let flag = !!(this.minWidth && obj.width < this.minWidth)

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? '图片小于规定尺寸' : ''
			}
		},

		/**
		 * [checkMaxWidth 校验最大尺寸]
		 * @param  {[type]} width [description]
		 * @return {[type]}       [description]
		 */
		checkMaxWidth(obj) {
			let flag = !!(this.maxWidth && obj.width > this.maxWidth)

			return {
				name: obj.name,
				value: !flag,
				msg: flag ? '图片大于规定尺寸' : ''
			}
		},

		/**
		 * [checkW2HRatio 只校验图片宽高比]
		 * @return {[type]} [description]
		 */
		checkW2HRatio(obj) {

			let flag = true

			if (!this.isCalcErrorRatio && !!this.ratio) {

				let _arr = this.ratio.split(':')

				let _w = Number(_arr[0]) // 容错比例 宽
				let _h = Number(_arr[1]) // 容错比例 高

				if (obj.width / obj.height !== _w / _h) {
					flag = false
				}
			}

			return {
				name: obj.name,
				value: flag,
				msg: !flag ? '图片尺寸不符合规格' : ''
			}
		},

		/**
		 * [checkErrorRatio 校验尺寸容错率]
		 * @param  {[type]} ratio [description]
		 * @return {[type]}       [description]
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
				msg: !flag ? '图片尺寸不符合规格' : ''
			}
		}
	}
}
</script>
<style lang="stylus" scoped>
@import './index.styl'
</style>
