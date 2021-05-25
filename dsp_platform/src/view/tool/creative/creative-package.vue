<template>
	<div>
		<Form :model="formBase" :label-colon="true" label-position="right" :label-width="formLabelWidth" :rules="ruleBase" ref="formBase">
			<FormItem label="广告交互" prop="ad_interaction" v-show="belong !== 'adForm'">
				<!-- {{formBase.ad_interaction}} -->
				<!-- 1:跳转落地页, 2:下载应用 -->
				<RadioGroup v-model="formBase.ad_interaction" type="button" @on-change="resetAdConcat({clickType: 'ad_interaction'})">
					<Radio class="i-width-checkbtn" :disabled="hasIdDisabled || choosePackageDisabled" v-for="item in adInteraction" :label="item.id" :key="item.id">{{item.label}}</Radio>
				</RadioGroup>
			</FormItem>

			<FormItem label="创意形式" prop="creative_type" v-show="belong !== 'adForm'">
				<Select :disabled="hasIdDisabled || belong === 'adForm' || choosePackageDisabled" v-model="formBase.creative_type" placeholder="请选择创意形式" @on-change="resetAdConcat({clickType: 'creative_type'})">
					<OptionGroup v-for="item in adSceneData" :key="item.id" :label="item.title">
						<Option v-for="child in item.children" :key="child.value" :value="child.value" >{{ child.label }}</Option>
					</OptionGroup>
				</Select>
			</FormItem>

			<FormItem label="标题" prop="title" v-if="showField.title">
				<Input maxlength="30" placeholder="请输入标题" show-word-limit v-model.trim="formBase.title"></Input>
			</FormItem>

			<!-- {{showField}} -->
			<FormItem label="描述" prop="des" v-if="showField.describe">
				<Input maxlength="30" placeholder="请输入描述" show-word-limit v-model.trim="formBase.des"></Input>
			</FormItem>

			<FormItem label="电话号码" prop="phone_num" v-if="showField.phone_num">
				<Input maxlength="30" placeholder="请输入电话号码" show-word-limit v-model.trim="formBase.phone_num"></Input>
			</FormItem>

			<FormItem label="产品Logo" prop="logo_url" v-if="showField.logo">
				<upload-image
					@on-change="logoImg"
					:defaultList = "formBase.logo_url"
					:disEdit="hasIdDisabled || choosePackageDisabled"
					:idName="301"
					:bit="140"
					:componentWidth="120"
					:componentHeight="120"
					:minWidth="70"
					:maxWidth="96"
					:format="['jpg', 'png', 'jpeg']"
					ratio="1:1"
				>
					<i class="iconfont icon-upload-cloud"></i>
					<p class="upload-tips">JPG/JPEG/PNG, <br>尺寸比1:1<br>≥70px，≤96px<br>大小≤140KB</p>
				</upload-image>
				<input type="hidden" :value="formBase.logo_url">
			</FormItem>

			<!-- 落地页 start -->
			<FormItem label="落地页链接" prop="landing_page" v-if="showField.dp">
				<Input maxlength="10000" placeholder="落地页链接" v-model.trim="formBase.landing_page"></Input>
			</FormItem>
			
			<FormItem label="应用直达" prop="is_app_deep" v-if="showField.dp">
				<!-- -1：不启用，1：启用 eg: -1 -->
				<!-- {{formBase.is_app_deep}} -->
				<RadioGroup v-model="formBase.is_app_deep" type="button">
					<Radio class="i-width-checkbtn" :label="-1">不启用</Radio>
					<Radio class="i-width-checkbtn" :label="1">启用</Radio>
				</RadioGroup>
			</FormItem>

			<FormItem label="直达链接" prop="app_deep_link" v-if="formBase.is_app_deep == 1">
				<Input maxlength="10000" placeholder="请输入直达链接" v-model.trim="formBase.app_deep_link"></Input>
			</FormItem>
			<!-- 落地页区分 end -->
			
			<!-- {{showField}} -->
			<FormItem prop="is_join_community" v-if="showField.join_community">
				<template slot="label">
					私域引效
					<Tooltip placement="right" max-width="300" content="在投放下载类或者跳转类广告时，增加加QQ群的交互方式，方便将用户引流到广告主的 「私域流量池」里，帮助广告主更好的运营「私域流量」">
						<i class="icon-why"></i>
					</Tooltip>
				</template>
				<!-- 私域引效，0不启用，1一键加QQ群 -->
				<RadioGroup v-model="formBase.is_join_community" type="button">
					<Radio class="i-width-checkbtn" :label="0">不启用</Radio>
					<Radio class="i-width-checkbtn" :label="1">一键加QQ群</Radio>
				</RadioGroup>
			</FormItem>

			<FormItem prop="community_key" v-if="showField.join_community && formBase.is_join_community === 1">
				<template slot="label">
					QQ群KEY
					<Tooltip placement="right" max-width="350">
						<i class="icon-why"></i>
						<div slot="content" class="getQQKey">
							如何获取群key？<br/>(点击跳转到 <a href="https://qun.qq.com/join.html" target="_blank">https://qun.qq.com/join.html</a>)
						</div>
					</Tooltip>
				</template>

				<Input maxlength="200" placeholder="请输入QQ群KEY" show-word-limit v-model.trim="formBase.community_key"></Input>
			</FormItem>

			<FormItem label="加群弹窗文案" prop="community_text" v-if="showField.join_community && formBase.is_join_community === 1">
				<Input maxlength="8" placeholder="最多可填8个字" show-word-limit v-model.trim="formBase.community_text"></Input>
			</FormItem>

			<FormItem label="角标" v-if="showField.join_community && formBase.is_join_community === 1">
				<upload-image
					@on-change="qqImg"
					:defaultList = "formBase.community_logo"
					:idName="601"
					:bit="140"
					:componentWidth="120"
					:componentHeight="120"
					:minWidth="50"
					:maxWidth="50"
					:format="['jpg', 'png', 'jpeg', 'gif']"
					ratio="1:1"
				>
					<i class="iconfont icon-upload-cloud"></i>
					<p class="upload-tips">JPG/PNG/GIF <br>尺寸比1:1<br>50px<br>大小≤140KB</p>
				</upload-image>
				<input type="hidden" :value="formBase.community_logo">
			</FormItem>

			<FormItem v-if="showField.join_community && formBase.is_join_community === 1">
				<template slot="label">中间页加群<br>按钮文案</template>
				<Input maxlength="6" placeholder="最多可填6个字, 默认加群领福利" show-word-limit v-model.trim="formBase.community_button_text"></Input>
			</FormItem>


			<!-- 下载应用 start -->
			<FormItem label="下载链接" prop="landing_page" v-if="showField.downlink">
				<Input maxlength="10000" placeholder="请输入下载链接" v-model.trim="formBase.landing_page"></Input>
			</FormItem>

			<FormItem label="应用包名" prop="mobile_app_package_name" v-if="showField.appPackageName">
				<Input maxlength="100" placeholder="请输入应用包名" show-word-limit v-model.trim="formBase.mobile_app_package_name"></Input>
			</FormItem>

			<!-- 应用名称 = 推广产品名称 -->
			<FormItem label="推广产品名称" prop="promote_product" v-if="showField.appName">
				<Input maxlength="30" placeholder="请输入应用名称" show-word-limit v-model.trim="formBase.promote_product"></Input>
			</FormItem>

			<FormItem label="应用Icon" prop="icon_url" v-if="showField.appIcon">
				<upload-image
					@on-change="iconUrlImg"
					:defaultList = "formBase.icon_url"
					:disEdit="hasIdDisabled || choosePackageDisabled"
					:idName="302"
					:bit="140"
					v-model="formBase.icon_url" 
					:componentWidth="120" 
					:componentHeight="120" 
					:minWidth="70" 
					:maxWidth="96" 
					:format="['jpg', 'png', 'jpeg']" 
					ratio="1:1"
				>
					<i class="iconfont icon-upload-cloud"></i>
					<p class="upload-tips">JPG/JPEG/PNG, <br>尺寸比1:1<br>≥70px，≤96px<br>大小≤140KB</p>
				</upload-image>
				<input type="hidden" :value="formBase.icon_url">
			</FormItem>

			<!-- 下载应用 end -->
			<FormItem label="按钮文案" prop="button_text">
				<Input maxlength="5" placeholder="去看看， 查看详情， 参与活动， 领取优惠， 立即抢购" show-word-limit v-model.trim="formBase.button_text"></Input>
			</FormItem>

			<!-- 素材类型最后不保存，根据返回的url的类型，如果img的url存在则为图片，如果视频的url存在则为视频 -->
			<FormItem label="素材类型" prop="material_type">
				<!-- {{formBase.material_type}} -->
				<RadioGroup v-model="formBase.material_type" type="button" @on-change="resetAdConcat({clickType: 'material_type'})">
					<Radio class="i-width-checkbtn" :label="1" :disabled="isDisabledPhoto || hasIdDisabled || choosePackageDisabled">图片</Radio>
					<Radio class="i-width-checkbtn" :label="2" :disabled="isDisabledVideo || hasIdDisabled || choosePackageDisabled">视频</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="素材尺寸" prop="material_size">
				<RadioGroup v-model="formBase.material_size" @on-change="materialSizeChange">
					<Radio :disabled="hasIdDisabled || choosePackageDisabled" v-for="item in materialSizeArr" :label="item.divisor" :key="item.id">{{item.label}}</Radio>
				</RadioGroup>
				<Spin fix v-if="materialLoad"></Spin>
			</FormItem>

			<FormItem label="素材上传" prop="material_url">
				<!-- 图片：{{formBase.material_url}}<br>
				视频：{{formBase.video_url}} -->
				<!-- 1. 上传图片 -->
				<div v-if="formBase.material_type === 1">
					<upload-image
						@on-change="materialUrlImg"
						@on-upload-begin="materialBegin"
						@on-upload-end="materialEnd"
						:defaultList = "formBase.material_url"
						:showUploadName="true"
						:multiple="multiple"
						:multipleLen="needImgLen"
						:disEdit="hasIdDisabled || choosePackageDisabled"
						:idName="500"
						:bit="400"
						:componentWidth="280"
						:componentHeight="172"
						:isCalcErrorRatio="true"
						:errorRatio="formBase.material_size"
						:minWidth="uploadImgWidth"
					>
						<i class="iconfont icon-upload-cloud"></i>
						<p class="upload-tips">JPG/JPEG/PNG/GIF小于400KB</p>
					</upload-image>

					<div class="choose-material" v-if="!childNeedForm.buyer_creativeid">
						<div class="choose-material-list" @click="toChooseMaterial(1)">从素材库选择</div>
					</div>
				</div>

				<!-- 2. 上传视频，同时需要上传封面图 -->
				<div v-if="formBase.material_type === 2">
					<upload-image
						class="upload-inline"
						@on-change="materialUrlImg"
						@on-upload-begin="materialBegin"
						@on-upload-end="materialEnd"
						:defaultList = "formBase.material_url"
						:showUploadName="true"
						:disEdit="hasIdDisabled || choosePackageDisabled"
						:idName="600"
						:bit="400"
						:componentWidth="280"
						:componentHeight="172"
						:isCalcErrorRatio="true"
						:errorRatio="formBase.material_size"
						:minWidth="uploadImgWidth"
					>
						<i class="iconfont icon-upload-cloud"></i>
						<p class="upload-tips">视频封面图<br/>JPG/JPEG/PNG/GIF小于400KB</p>
					</upload-image>
					<upload-video
						class="upload-inline"
						@on-change="videoUrl"
						@on-upload-begin="materialBegin"
						@on-upload-end="materialEnd"
						:defaultList = "formBase.video_url"
						:showUploadName="true"
						:disEdit="hasIdDisabled || choosePackageDisabled"
						:idName="550" 
						:bit="60*1024" 
						:componentWidth="280"
						:componentHeight="172"
						:isCalcErrorRatio="true"
						:errorRatio="formBase.material_size"
						:minWidth="uploadImgWidth"
					>
						<i class="iconfont icon-upload-cloud"></i>

						<!-- 此处暂时处理：开屏290时，视频长度为大于等于3s，小于等于5s，大小不超过3M -->
						<p class="upload-tips" v-html="formBase.creative_type === 290 ? '视频, MP4/MOV, 时长≥3s≤5s<br/>大小<=3M, 必须带有声音' : '视频, MP4/MOV, 时长≥5s≤60s<br/>大小<=60M, 必须带有声音'"></p>
					</upload-video>

					<div class="choose-material" v-if="!childNeedForm.buyer_creativeid">
						<div class="choose-material-list" @click="toChooseMaterial(1)">从素材库选择</div>
						<div class="choose-material-list" @click="toChooseMaterial(2)">从素材库选择</div>
					</div>
				</div>

			</FormItem>
		</Form>

		<!-- 素材库 -->
		<material-library ref="materialLibrary" @on-change="librayChange"></material-library>
	</div>
</template>

<script>
import { regWebUrl, regDeeplinkUrl, regTellNumber } from '@/libs/util'
import { getIntersection } from '@/libs/tools'
import { getCreativeTypeRatio } from '@/api/common'
import { getOrderRelatedRatios } from '@/api/advertising'
import upload from '_c/upload-image'
import materialLibrary from './module/material-library.vue'

// on-creative-type: 创意形式 向父级发送 图片的url, 用于显示demo图
export default {
	props: {
		multiple: { // 是否可批量
			type:Boolean
		},
		hasIdDisabled: { // 编辑时,不可更改字段
			type: Boolean,
			default: false
		},
		formLabelWidth: { // form表单label的宽度
			type: Number,
			default: 130
		},
		belong: String // 引用子包的来源，在新建广告，涉及到创意形式，不可编辑
	},
	components: {
		uploadImage: upload.uploadImage, // 图片
		uploadVideo: upload.uploadVideo, // 视频
		materialLibrary
	},
	data() {
		// 校验上传素材，是否满足len
		const checkUploadMaterial = (rule, value, callback) => {
			let _type = this.formBase.material_type
			let _imgUrlArr = this.formBase.material_url
			let _videoUrlArr = this.formBase.video_url
			// 1. 如果素材为图片，需要判断上传个数是否满足
			if (_type === 1) {
				if(_imgUrlArr.length < this.needImgLen) {
					callback(new Error(`需要上传${this.needImgLen}张图片素材`))
					return
				}

				callback()

			} else if (_type === 2) {
				if(_imgUrlArr.length < this.needImgLen) {
					callback(new Error(`需要上传${this.needImgLen}张视频封面图`))
					return
				}

				if(_videoUrlArr.length < this.needImgLen) {
					callback(new Error(`需要上传${this.needImgLen}个视频`))
					return
				}

				callback()
			}
		}
		const checkDeepLink = (rule, value, callback) => {

			if(!value || value.indexOf('://') < 0) {
				callback(new Error('请输入正确的直达链接'))
			} else {
				callback()
			}
		}
		return {
			adInteraction: [ // 广告交互
				{
					id: 1,
					label: '跳转落地页'
				}, 
				{
					id: 2,
					label: '下载应用'
				},
				{
					id: 3,
					label: '拨打电话'
				}
			],
			materialLoad: false, // 素材加载loading
			choosePackageDisabled: false, // 选择创意包时，所有的内容都不可编辑
			isDisabledPhoto: false, // 素材类型图片
			isDisabledVideo: false, // 素材类型视频
			materialSizeArr: [], // 素材尺寸
			materialUploadIsOver: true, // 素材尺寸是否上传完成

			needImgLen:1, // 需要上传的图片个数

			catchStyle: {}, // 缓存广告样式
			showField: {}, // 能显示的字段

			formBase: {
				ad_interaction: 1, // 广告交互, 默认1=跳转落地页
				creative_type: 160, // 创意形式 - 默认原生信息流的上图下文
				title: '',
				des: '',
				phone_num: '', // 电话号码
				landing_page: '', // 落地页链接 和 下载链接
				is_app_deep: -1, // 应用直达
				app_deep_link: '', // 直达链接
				is_join_community: 0, // 私域引效
				community_key: '', // 加群，KEY
				community_text: '', // 加群，弹窗文案
				community_logo: '', // 加群，角标，logo
				community_button_text: '', // 加群，按钮文案

				button_text: '', // 按钮文案
				material_type: '', // 素材类型 1.图片， 2.视频
				material_size: '', //素材尺寸
				width: '', // 素材宽度
				heigh: '', // 素材高度
				material_url: [], // 素材上传url
				video_url: [], // 视频的url
				mobile_app_package_name: '', //应用包名
				promote_product: '', // 应用名称
				logo_url: '', // 产品logo
				icon_url: '' // 应用Icon
			},
			ruleBase: { // 正则
				ad_interaction: [{required: true, message: '请选择广告交互'}],
				creative_type: [{required: true, message: '请选择创意形式'}],
				title: [{required: true, message: '请输入标题'}],
				des: [{required: true, message: '请输入描述'}],
				phone_num: [
					{required: true, message: '请输入电话号码', trigger: 'blur'}, 
					{pattern: regTellNumber, message: '请输入正确的电话号码', trigger: 'blur'}
				],
				landing_page: [
					{required: true, message: '请输入链接', trigger: 'blur'}, 
					{pattern: regWebUrl, message: '请输入合法的url地址', trigger: 'blur'}
				],
				is_app_deep: [{required: true, message: '请选择应用直达'}],
				app_deep_link: [{required: true, validator: checkDeepLink, trigger: 'blur'}],
				is_join_community: [{required: true, message: '请选择私域引效'}],
				community_key: [{required: true, message: '请输入QQ群KEY'}],
				community_text: [{required: true, message: '请输入加群弹窗文案'}],
				mobile_app_package_name: [{required: true, message: '请输入应用包名'}],
				promote_product: [{required: true, message: '请输入推广产品名称'}],
				logo_url: [{required: true, message: '请上传产品Logo'}],
				icon_url: [{required: true, message: '请上传应用Icon'}],
				material_type: [{required: true, message: '请选择素材类型'}],
				material_size: [{required: true, message: '请选择素材尺寸'}],
				material_url: [{required: true, validator: checkUploadMaterial}],
			},

			childNeedForm: {}, // 父组件注入的数据

			chooseMaterialType: 1, // 选择素材类型，默认图片； 1.图片；2.视频

			uploadImgWidth: 300 // 图片上传最小宽度
		}
	},
	computed: {
		/**
		 * [adSceneData 创意形式]
		 * @return {[type]} [description]
		 */
		adSceneData() {
			let adStyleData = this.$store.state.app.adStyleData
			let adSceneData = this.$store.state.app.adSceneData
			adSceneData.map(item => {
				let children = []
				adStyleData.map(child => {
					if (child.parentId === item.id) {
						children.push({
							label: child.title,
							value: child.id
						})
					}
				})

				item['label'] = item.title
				item['children'] = children
			})
			return adSceneData
		}
	},
	methods: {
		/**
		 * [inject 来自父级的数据注入]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		injectData(val) {
			this.childNeedForm = val

			this.formBase.ad_interaction = val.ad_interaction || 1
			this.formBase.creative_type = val.creative_type || 160

			this.initData() // 初始化加载
		},
		/**
		 * [initData 初始化加载]
		 * @return {[type]} [description]
		 */
		initData() {
			this.initCatchStyle() // 初始化缓存广告样式

			if(this.childNeedForm._tag_ === 'edit' || this.childNeedForm._tag_ === 'chooseAdPack') {
				this.returnShowData() // 回显数据
			}

			// 当在广告编辑时，选着了创意包，部分内容不可编辑
			this.choosePackageDisabled = this.childNeedForm._tag_ === 'chooseAdPack'

			// 重置表单 ， 挡在广告重新选择  自定义创意or选择创意包
			if(this.childNeedForm._tag_ === 'reset') {
				this.resetForm()
			}
		},
		/**
		 * [initCatchStyle 初始化缓存广告样式]
		 * @return {[type]} [description]
		 */
		initCatchStyle(obj) {
			let adStyleData = this.$store.state.app.adStyleData
			let cTypeId = this.formBase.creative_type // 广告

			this.catchStyle = adStyleData.filter(item => {
				return item.id === cTypeId
			})[0]

			this.showAdConcatFields(obj) // 广告组成的显示字段
			this.setDemoSrcAndTitle() // 显示图片
		},
		/**
		 * [showAdConcatFields 广告组成的显示字段]
		 * @return {[type]} [description]
		 */
		showAdConcatFields(paramObj = {}) {
			// 此处逻辑，根据创意形式和广告交互形式，筛选出广告组成部分
			let _style = this.catchStyle

			// 1. 广告交互1=>dp(跳转到落地页)，2=下载应用
			let adInter = this.formBase.ad_interaction === 3 ? 'call' : (this.formBase.ad_interaction === 2 ? 'download' : 'dp')

			// 2. 判断是否支持视频或者图片
			this.isDisabledPhoto = !_style.sdkAttr.photo
			this.isDisabledVideo = !_style.sdkAttr.video

			// 3. 获取素材类型, 如果为编辑，则用反显值，否则用excel
			// 如果点击的是素材类型 radiogroup，此处不做处理
			if (paramObj.clickType !== 'material_type') {
				if (this.childNeedForm._tag_ !== 'edit' || this.childNeedForm._tag_ !== 'chooseAdPack') {
					// 6 如果素材类型只支持一种，则默认选中。 或者两种都支持时，默认选中图片
					if ((!this.isDisabledPhoto && !this.isDisabledVideo) || (!this.isDisabledPhoto && this.isDisabledVideo)) {
						this.formBase.material_type = 1
					}

					if (this.isDisabledPhoto && !this.isDisabledVideo) {
						this.formBase.material_type = 2
					}
				}
			}

			let mType = this.formBase.material_type // 素材类型

			let _img = _style['adConcat'][adInter]['img']
			let _video = _style['adConcat'][adInter]['video']

			let _fieldArr = []

			// console.log(mType)
			// console.log(adInter)

			// 1. 素材类型存在  1=图片, 2=视频
			if (mType === 1) {
				_fieldArr = _img
			} else if (mType === 2) {
				_fieldArr = _video
			} else {
				if (!_img.length) {
					_fieldArr = _video
				} else if (!_video.length) {
					_fieldArr = _img
				} else {
					_fieldArr = getIntersection(_img, _video) // 先显示交集的字段，如果选了素材类型在显示其他字段
				}
			}

			// console.log(_fieldArr)

			// 2 需要上传图片的个数 和 区域宽度
			let _index = _fieldArr.toString().indexOf('img*')
			this.needImgLen = _index > -1 ? Number(_fieldArr[_index].split('*')[1]) : 1

			// 3 显示的字段
			let obj = {}
			_fieldArr.map(item=> {
				obj[item] = true
			})

			this.showField = obj

			// 4 显示素材尺寸
			this.setCreativeRadio() // 根据ssp，显示素材尺寸
		},

		/**
		 * [getCreativeRadio 素材尺寸]
		 * @return {[type]} [description]
		 */
		setCreativeRadio() {

			let _style = this.catchStyle
			let minArr = []

			// 获取最小宽度
			_style.size.map(r=> {
				minArr.push(r.minSize.w)
			})

			this.materialLoad = true

			// 此处修改 2021/3/10
			// 如果来源是广告，此处来自广告单元关联的广告位的尺寸
			// 如果是创意包，获取导入的创意比例
			let proUrl = !!this.childNeedForm.order_id ? getOrderRelatedRatios({order_id: this.childNeedForm.order_id}) : getCreativeTypeRatio({creative_type_id_arr: [_style.id]})

			proUrl.then(res => {
				if(res.code === 200 && res.data && res.data.ratios && res.data.ratios.length) {

					this.materialLoad = false

					let _arr = []
					res.data.ratios.map(item => {

						// 最小宽度
						let minw = item.width <= item.height ? minArr[0] : (minArr[1] || minArr[0])

						_arr.push({
							divisor: `${item.width}:${item.height}`,
							label: `${item.width}:${item.height} (最小尺寸 ${minw}*${Math.round((minw * item.height)/item.width)})`,
						})
					})

					this.materialSizeArr = _arr

					this.setDefaultMaterialSize() // 设置默认选中的素材尺寸

				} else {
					this.$Notice.warning({title: '当前广告下无素材尺寸', duration: 3})
				}
			})
		},
		/**
		 * [setDefaultMaterialSize 设置默认选中的素材尺寸]
		 */
		setDefaultMaterialSize() {
			if(this.childNeedForm._tag_ === 'edit' || this.childNeedForm._tag_ === 'chooseAdPack') {
				// 反显素材尺寸
				this.formBase.material_size = `${this.childNeedForm.width}:${this.childNeedForm.heigh}`

				// console.log(this.formBase.material_size)
			} else {

				// 7. 默认选中素材尺寸的第一个
				this.formBase.material_size = this.materialSizeArr[0].divisor

				// 8. 素材尺寸选中之后, 设置formBase的width,heigh
				this.materialSizeChange(this.materialSizeArr[0].divisor)
			}
		},

		/**
		 * [resetAdConcat 广告交互, 创意形式, 素材类型 发生变化时]
		 * @return {[type]} [description]
		 */
		resetAdConcat(obj) {
			// 如果非点击素材类型, 需要重置素材类型字段
			if(obj.clickType !== 'material_type') {
				this.formBase.material_type = ''
			}

			this.initCatchStyle(obj)
		},
		/**
		 * [setDemoSrcAndTitle 手机框图片 依赖于广告场景和广告样式]
		 * @return {[type]} [description]
		 */
		setDemoSrcAndTitle() {
			let item = this.catchStyle
			let demoSrc = item.demoIcon ? require('@/assets/image/ad/demo/' + item.demoIcon) : require(`@/assets/image/ad/demo/${item.icon}.jpg`)

			this.$emit('on-creative-type', demoSrc)
		},
		/**
		 * [materialSizeChange 素材尺寸发生变化]
		 * @return {[type]} [val 为宽高  100|100]
		 */
		materialSizeChange(val) {

			this.formBase.material_size = val
			let size = val.split(':')

			this.formBase.width = Number(size[0])
			this.formBase.heigh = Number(size[1])

			let _size = this.catchStyle.size
			this.uploadImgWidth = this.formBase.width <= this.formBase.heigh ? _size[0].minSize.w : (_size[1] ? _size[1].minSize.w : _size[0].minSize.w)

			// 清空素材
			this.formBase.video_url = []
			this.formBase.material_url = []
		},

		/**
		 * [returnShowData 回显数据]
		 * @return {[type]} [description]
		 */
		returnShowData() {
			let childNeedForm = this.childNeedForm

			let _form = {
				ad_interaction: childNeedForm.ad_interaction,
				creative_type: childNeedForm.creative_type,
				title: childNeedForm.title,
				des: childNeedForm.des,
				phone_num: childNeedForm.phone_num,
				is_join_community: childNeedForm.is_join_community,
				community_key: childNeedForm.community_key,
				community_text: childNeedForm.community_text,
				community_logo: childNeedForm.community_logo,
				community_button_text: childNeedForm.community_button_text,

				landing_page: childNeedForm.landing_page,
				is_app_deep: childNeedForm.is_app_deep,
				app_deep_link: childNeedForm.app_deep_link,
				button_text: childNeedForm.button_text,
				width: childNeedForm.width,
				heigh: childNeedForm.heigh,
				material_url: childNeedForm.pic_url_arr || [],
				mobile_app_package_name: childNeedForm.mobile_app_package_name,
				promote_product: childNeedForm.promote_product,
				logo_url: childNeedForm.logo_url,
				icon_url: childNeedForm.icon_url || ''
			}

			// 赋值id
			if (childNeedForm.buyer_creativeid) {
				_form.buyer_creativeid = childNeedForm.buyer_creativeid
			}

			// 当视频video_url存在的时候，素材类型为视频
			if (!!childNeedForm.video_url) {
				_form.material_type = 2 // 素材类型 1.图片， 2.视频
				_form.video_url = childNeedForm.video_url.split(',')
				_form.material_url = childNeedForm.cover_url.split(',')
			} else {
				_form.material_type = 1 // 素材类型 1.图片， 2.视频
				_form.video_url = ''
			}

			this.formBase = _form
		},

		/**
		 * [validatorForm 表单必填项验证]
		 * @return {[type]} [description]
		 */
		validatorForm() {

			// 素材尺寸未上传完不可发送
			if (!this.materialUploadIsOver) {
				this.$Message.error({
					content: '正在上传素材，请稍后...',
					duration: 3
				})
				return
			}

			this.$refs['formBase'].validate((valid) => {
				try {

					if (!valid) {
						this.$emit('on-form-validate', {
							valid,
							form: {}
						})
					} else {

						// 传出的值需要格式化处理
						let form = { ...this.formBase}

						// 1. 上传图片只取url, 因适用素材，此处不做处理
						// let _material_url_arr = form.material_url.map(item => {
						// 	return item.indexOf('?') > -1 ? item.split('?')[0] : item
						// })
						// form.material_url = _material_url_arr

						//2. 应用直达为不启用, 清空应用直达链接
						if (form.is_app_deep === -1) {
							form.app_deep_link = ''
						}

						// 处理图片和视频的存储方式
						if (form.material_type === 2) { // 视频
							form.video_url = form.video_url.join(',') // 处理成字符串
							form.video_duration = 15 // 视频默认时长15s
							form.cover_url = form.material_url.join(',') // 视频封面
						} else if (form.material_type === 1) { // 图片
							form.video_url = ''
							form.pic_url_arr = form.material_url // 素材图片
						}

						// 处理私域引效
						if (form.is_join_community === 0) {
							delete form.community_key
							delete form.community_text
							delete form.community_logo
							delete form.community_button_text
						}

						delete form.material_url // 需要删除不要的字段 - 素材上传
						delete form.material_size // 需要删除不要的字段 - 尺寸

						// last - 发送数据
						this.$emit('on-form-validate', {
							valid,
							form
						})
					}
				} catch (e) {
					console.log(e)
				}
			})
		},
		/**
		 * [resetForm 重置表单]
		 * @return {[type]} [description]
		 */
		resetForm() {
			this.formBase.title = ''
			this.formBase.des = ''
			this.formBase.phone_num = ''
			this.formBase.is_join_community = 0
			this.formBase.community_key = ''
			this.formBase.community_text = ''
			this.formBase.community_logo = ''
			this.formBase.community_button_text = ''
			this.formBase.landing_page = ''
			this.formBase.is_app_deep = -1
			this.formBase.app_deep_link = ''
			this.formBase.button_text = ''
			this.formBase.material_url = [] // 素材上传url
			this.formBase.video_url = [] // 视频的url
			this.formBase.mobile_app_package_name = '' //应用包名
			this.formBase.promote_product = '' // 应用名称
			this.formBase.logo_url = '' // 产品logo
			this.formBase.icon_url = '' // 应用Icon
		},

		/**
		 * [materialUrlImg description]
		 * @param  {[type]} string [图片的字符串数组]
		 * @return {[type]}     [description]
		 */
		materialUrlImg(val) {
			this.formBase.material_url = val.split(',')
		},
		/**
		 * [materialBegin 图片上传开始]
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		materialBegin(obj) {
			this.materialUploadIsOver = obj.isAllLoading
		},
		/**
		 * [materialEnd 上传完成]
		 * @return {[type]} [description]
		 */
		materialEnd(obj){
			this.materialUploadIsOver = obj.isAllLoading
		},
		/**
		 * [logoImg 产品Logo]
		 * @return {[type]} [description]
		 */
		logoImg(val) {
			this.formBase.logo_url = val
		},
		/**
		 * [iconUrlImg 应用Icon]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		iconUrlImg(val) {
			this.formBase.icon_url = val
		},
		/**
		 * [qqImg 角标]
		 * @return {[type]} [description]
		 */
		qqImg(val) {
			this.formBase.community_logo = val
		},
		/**
		 * [videoUrl 视频]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		videoUrl(val) {
			this.formBase.video_url = [val]
		},
		/**
		 * [toChooseMaterial 选择素材]
		 * @return {[type]} [type 1-图片； 2-视频]
		 * @return {[type]} [description]
		 */
		toChooseMaterial(type) {

			this.chooseMaterialType = type

			let formBase = this.formBase

			let params = {
				min_width: this.uploadImgWidth, // 图片上传最小宽度
				ratios: formBase.material_size, // 图片比例
				multiLength: type === 2 ? 1 : (this.multiple ? 10000 : this.needImgLen), // 最多选择的素材个数, 视频只允单个选择
				material_type: type // 1 图片； 2.视频
			}

			this.$refs.materialLibrary.injectData(params)
		},
		/**
		 * [librayChange 素材库选择]
		 * @param  {[type]} str [返回多个图片的字符串]
		 * @return {[type]}     [description]
		 */
		librayChange(str) {

			let str2Arr = str.split(',') // 字符串转数组
			let formBase = this.formBase

			// 解决批量创建广告问题
			if (!this.multiple) { // 非批量

				// 长度兼容处理
				let lastLen = this.needImgLen - formBase.material_url.length // 剩余上传个数 = 总个数 - 已经上传的个数
				let spliceLen = lastLen <= 0 ? 0 : lastLen // 剩余上传个数
				let usedStr2Arr = str2Arr.length > this.needImgLen ? str2Arr.slice(0, this.needImgLen) : str2Arr // 返回的数据大于当前需要的个数

				if (this.chooseMaterialType === 1) { // 图片
					if (this.needImgLen > 1) { // 可选多张
						// 1. 素材库选择的个数大于（比如2）剩余需要上传的个数（比如1），此时选择的个数覆盖在最后两位，否则push在最后
						if (usedStr2Arr.length >= spliceLen) {
							formBase.material_url = [...formBase.material_url, ...usedStr2Arr].slice(-3)
						} else {
							formBase.material_url = [...formBase.material_url, ...usedStr2Arr.splice(0, spliceLen)]
						}
					} else { // 只允许选一张
						formBase.material_url = usedStr2Arr
					}
				} else if (this.chooseMaterialType === 2) { // 视频
					formBase.video_url = usedStr2Arr
				}
			} else {
				// 批量创建
				formBase.material_url = [...formBase.material_url, ...str2Arr]
			}
		},
		/**
		 * [resetValidate 重置校验]
		 * @return {[type]} [description]
		 */
		resetValidate() {
			this.$nextTick(() => {
				this.$refs['formBase'].fields.forEach((e) => {
					e.validateState = ''
					e.validateMessage = ''
					this.$set(e, 'isRequired', !!e.prop)
				})
			})
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.icon-upload-cloud
	color: #4665FE
	font-size: 24px
.upload-tips
	text-align: center
	margin-top: 10px
	font-size: 12px
	color: #999
	line-height: 1.3
.upload-inline
	display: inline-block
	vertical-align: top
.choose-material
	font-size: 0px
	.choose-material-list
		width: 280px
		margin-right: 16px
		display: inline-block
		vertical-align: top
		color: #4665fe
		cursor: pointer
		font-size: 14px
/deep/ .ivu-tooltip-inner-with-width
	text-align: start
	white-space: normal
.icon-why
	cursor: pointer
	color: #999999
</style>
