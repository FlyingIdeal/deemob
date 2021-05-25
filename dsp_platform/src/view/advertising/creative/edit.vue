<template>
	<div class="page-main">
		<div class="edit-content-card">
			<div class="page-detail-title clearfix">

				<!-- <h2>{{adId ? '编辑广告' : (addType === 'bacthAdd' ? '批量新建广告' : '新建广告')}}</h2> -->
				<h2 v-if="addType === 'bacthAdd'">批量新建广告</h2>
				<h2 v-else-if="copyId">复制广告</h2>
				<h2 v-else-if="adId">编辑广告</h2>
				<h2 v-else>新建广告</h2>

				<div class="is-handler">
					<Button @click="goBack()" class="back" type="text">返回<i class="iconfont icon-rightarrow"></i></Button>
				</div>
			</div>
			<div class="clearfix">
				<div class="ad-left-content">
					<Form :model="formBase" :label-colon="true" label-position="right" :label-width="labelWidth" :rules="ruleBase" ref="formBase" style="width: 820px">
						<div class="title-line-tag">
							<h4>广告设置</h4>
						</div>

						<FormItem label="广告活动名称" prop="campaign_id">
							<Select
								v-model="formBase.campaign_id"
								filterable
								placeholder="请输入广告活动名称或ID"
								:disabled="hasIdDisabled"
								@on-change="campaignIdChange">
								<Option v-for="item in adCampaignList" :value="item.campaignid" :key="item.campaignid">{{ item.campaignname }}(ID: {{ item.campaignid }})</Option>
							</Select>
						</FormItem>

						<FormItem label="广告单元名称" prop="order_id" >
							<Select
								v-model="formBase.order_id"
								filterable
								@on-change="orderIdChange"
								:disabled="hasIdDisabled"
								placeholder="请输入广告单元名称或ID">
								<!-- 批量+满足可批量的 -->
								<Option v-for="item in adUnitList" :value="item.orderid" :key="item.orderid" :disabled="addType === 'bacthAdd' && !styleCanMultileUplod.includes(item.creative_form_id)">{{ item.ordername }}(ID: {{ item.orderid }})</Option>
							</Select>
						</FormItem>

						<FormItem label="广告名称" prop="adname">
							<Input maxlength="100" :disabled="hasIdDisabled" show-word-limit placeholder="请输入广告名称" v-model.trim="formBase.adname"></Input>
						</FormItem>

						<div class="title-line-tag">
							<h4>第三方监测链接</h4>
						</div>
						<div class="link-list" v-for="(item, index) in formBase.thirdparty_vm">
							<FormItem :label="index === 0 ? '曝光' : ''" :prop="'thirdparty_vm.' + index + '.value'" :rules = "{required: false, validator: validateLink}">
								<Input maxlength="10000" placeholder="请输入曝光链接" v-model.trim="item.value"></Input>
							</FormItem>
							<div class="link-handler">
								<Button class="handle-btn" title="添加" v-if="(index == formBase.thirdparty_vm.length - 1) && (index < cmVmMax - 1)" @click="handVmAdd(index, 'thirdparty_vm')" type="primary" ghost>
									<Icon type="md-add" :size="16" />
								</Button>

								<Button class="handle-btn" title="删除" v-else @click="handVmRemove(index, 'thirdparty_vm')" type="primary" ghost>
									<Icon type="md-remove" :size="16" />
								</Button>
							</div>
						</div>

						<div class="link-list" v-for="(item, index) in formBase.thirdparty_cm">
							<FormItem :label="index === 0 ? '点击' : ''" :prop="'thirdparty_cm.' + index + '.value'" :rules = "{required: false, validator: validateLink}">
								<Input maxlength="10000" placeholder="请输入点击链接" v-model.trim="item.value"></Input>
							</FormItem>
							<div class="link-handler">
								<Button class="handle-btn" title="添加" v-if="(index == formBase.thirdparty_cm.length - 1) && (index < cmVmMax - 1)" @click="handVmAdd(index, 'thirdparty_cm')" type="primary" ghost>
									<Icon type="md-add" :size="16" />
								</Button>
								<Button class="handle-btn" title="删除" v-else @click="handVmRemove(index, 'thirdparty_cm')" type="primary" ghost>
									<Icon type="md-remove" :size="16" />
								</Button>
							</div>
						</div>

						<div class="title-line-tag">
							<h4>制作创意</h4>
						</div>
						<!-- {{isChoosePackage}}-{{creativePacketId}} -->
						<FormItem label="创意包" prop="choose_type" v-if="!adId || !creativePacketId" v-show="addType !== 'bacthAdd'">
							<RadioGroup v-model="formBase.choose_type" type="button" @on-change="chooseTypeChange">
								<Radio class="i-width-checkbtn" :disabled="hasIdDisabled" :label="1">自定义创意</Radio>
								<Radio class="i-width-checkbtn" :disabled="hasIdDisabled || !formBase.order_id" :label="2">选择创意包</Radio>
							</RadioGroup>
						</FormItem>

						<FormItem label="重选创意包" v-if="formBase.choose_type === 2 && isChoosePackage">
							<Button class="i-width-checkbtn" @click="chooseCreativePacket">选择</Button>
						</FormItem>

						<FormItem label="选择创意包" prop="creativePacketId" v-if="formBase.choose_type === 2 && !isChoosePackage">
							<Button class="i-width-checkbtn" @click="chooseCreativePacket">选择</Button>
							<input type="hidden" v-model.trim="formBase.creativePacketId">
						</FormItem>

					</Form>

					<div class="mobile-include-card clearfix">
						<!-- 创意包 -->
						<div class="creative-card fl">
							<!-- url为bacthAdd，并且广告单元有值的情况下可批量 -->
							<creative-package :multiple="addType === 'bacthAdd' && !!formBase.order_id" v-show="(formBase.choose_type === 1) || ((formBase.choose_type === 2 && isChoosePackage))" ref="creativePackage" :hasIdDisabled="hasIdDisabled" :formLabelWidth="labelWidth" :belong="'adForm'" @on-creative-type="showDemoSrc" @on-form-validate="packageValidate"></creative-package>
						</div>
						<div class="ad-right-content fr" v-if="demoSrc">
							<h3>广告示意图</h3>
							<div class="mobile-card">
								<div class="mobile-center">
									<img :src="demoSrc">
								</div>
							</div>
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

		<Modal
			v-model="modalFlag"
			width="1088"
			:footer-hide="true"
			class-name="vertical-center-modal"
		>
			<div class="search-line" ref="search-line">
				<Input class="i-margin-right-11 i-width-input" clearable v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入创意包名称或ID" :clearable="true" />
				<Button class="search" @click="doFilterList">搜索</Button>
			</div>
			<Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :height="365" :no-data-text="noDataText">
				<template slot-scope="{ row }" slot="handle">
					<span v-if="(row.internal_verify == 0 || row.internal_verify == 1) && row.creative_type === childNeedForm.creative_type" class="table-hander" @click="trueChoosePackage(row)">选择</span>
				</template>
			</Table>
			<div class="page-center">
				<Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
			</div>
		</Modal>
	</div>
</template>

<script>
import { showTitle, regWebUrl, imageFormat, videoFormat } from '@/libs/util'
import { getQueryString, formatDate } from '@/libs/tools'
import { saveCreativeApi, editCreativeApi, getAdCreativeList, getAdUnitList, getAdCampaignList, batchAdCreative, getBatchCreativeTail, getOrderRelatedRatios } from '@/api/advertising'
import { addCreative, editCreative, getCreativeList, batchAddCreative, addMaterial } from '@/api/tool'
import {mapActions} from 'vuex'
import creativePackage from '@/view/tool/creative/creative-package'

export default {
	components: {
		creativePackage
	},
	data() {
		return {
			adId: this.$route.query.adId ? Number(this.$route.query.adId) : '', // 创意Id
			copyId: this.$route.query.copyId ? Number(this.$route.query.copyId) : '', // 复制Id
			campaignId: this.$route.query.campaignId ? Number(this.$route.query.campaignId) : '', // 活动Id
			orderId: this.$route.query.orderId ? Number(this.$route.query.orderId) : '', // 单元Id
			source: this.$route.query.source || '', // 页面来源，如果是来自单元，编辑页面返回到列表页需要刷新列表，因为 $bus不好使
			addType: this.$route.query.addType, // 新建类型

			cmVmMax: 10, // 曝光/点击 最多个数
			pageSize: 10, // 页码长度
			total_count: 0,
			currentPage: 1,
			colDatList: [], // table数据
			tableLoadFlag: true, // table的loading
			noDataText: this.$config.noDataText,
			modalFlag: false, // 选择创意包的显示
			filterSearch: { // 筛选条件
				name_or_id: '' //请输入创意包名称或ID
			},
			tableColList: [
				{title: '创意包ID', key: 'buyer_creativeid', width: 80},
				{title: '创意包名称', key: 'creative_name', minWidth: 200},
				{title: '创建时间', key: 'c_time', width: 180},
				{title: '操作', slot: 'handle', width: 60}
			],
			tableParamsRatio: [], // 创意包列表 - 按比例查询

			creativePacketId: '', // 创意包id
			hasIdDisabled: false, // 编辑的时候 广告交互 和 创意形式 不可修改
			isChoosePackage: false, // 是否选择的创意包，如果是

			labelWidth: 112, // 左侧宽度
			formBase: {
				campaign_id: '', // 广告活动id
				order_id: '', // 广告单元id
				adname: '', // 广告名称
				thirdparty_vm: [], // 第三方曝光监测
				thirdparty_cm: [], // 第三方点击监测
				choose_type: 1, // 创意包 --》 1.自定义创意/ 2.选择创意包
				creativePacketId: '' // 选择创意包id
			},
			childNeedForm: { // 文件包模块，注入的内容form
				_tag_: 'new'
			},
			returnChildForm: {}, // 子集返回的form表单
			ruleBase: { // 正则
				campaign_id: [{required: true, message: '请选择广告活动'}],
				order_id: [{required: true, message: '请选择广告单元'}],
				adname: [
					{required: true, message: '请输入广告名称'},
					{max: 100, message: '广告名称不能超过100字'}
				],
				choose_type: [{required: true, message: '请选择创意类型'}],
				creativePacketId: [{required: true, message: '请选择创意包'}],
			},

			adCampaignList: [], // 广告活动列表
			adUnitList: [], // 广告单元列表
			catchAdUnit: '', // 缓存广告单元，结果

			demoSrc: '', // 手机demo预览图
			submitClock: false // 保存锁
		}
	},
	computed: {
		/**
		 * [adSceneData 仅显示如下创意形式的广告单元]
		 * @return {[type]} [description]
		 */
		styleCanMultileUplod() {
			return this.$store.state.app.styleCanMultileUplod
		}
	},
	mounted() {
		// 备注: 1. 不管是新建，还是编辑，都有获取广告活动列表，与其每次获取，不如首先加载活动列表
		this.getAdCampaignList() // 获取广告活动列表
	},
	methods: {
		/*...mapActions([
			'getAdCampaignList',
			'getAdUnitList'
		]),*/
		/**
		 * [getAdCampaignList 获取广告活动列表]
		 * @return {[type]} [description]
		 */
		getAdCampaignList() {
			this.$Spin.show()
			getAdCampaignList().then(res => {
				this.$Spin.hide()

				if(res.code === 200) {
					this.adCampaignList = res.data.list

					this.init() // 加载流程

				} else {
					this.$Message.error({content: '获取广告活动列表失败，正在返回上一页', duration: 3})
					this.goBack()
				}

			}, err => {
				this.$Spin.hide()
				this.$Message.error({content: '获取广告活动列表失败，正在返回上一页', duration: 3})
				this.goBack()
			})
		},
		/**
		 * [init 初始化加载]
		 * @return {[type]} [description]
		 */
		init() {
			// 1. 编辑
			// 2. 新建
			//     2.1 从广告单元过来直接有campaignId和orderId
			//     2.2 普通新建
			// 3. 复制
			// 		3.1 读取被复制的广告位Id

			if (!!this.adId) {
				// 编辑
				this.hasIdDisabled = true // 编辑的情况下，不可再次编辑的内容
				this.initData({type: 'edit'}) // 编辑
			} else if (!!this.copyId) { // 复制广告
				this.initData({type: 'copy'})
			} else {
				// 新建

				// 第三方监测链接
				this.formBase.thirdparty_vm = [this.addVmCm()]
				this.formBase.thirdparty_cm = [this.addVmCm()]

				// 如果是批量创建， 默认自定义创意
				if (this.addType === 'bacthAdd') {
					this.formBase.choose_type = 1 // 1.自定义创意 / 2.选择创意包
				}

				// 从广告单元创建之后直接跳转到创建广告
				if(!!this.campaignId && !!this.orderId) {

					// 根据活动id得到单元列表
					this.proGetAdUnitList(this.campaignId).then(res => {

						// 筛选广告单元item
						let adArr = this.adUnitList.filter(item => {
							return item.orderid === this.orderId
						})[0]

						// form赋值
						this.formBase.campaign_id = this.campaignId
						this.formBase.order_id = this.orderId
						this.formBase.creativePacketId = adArr.creative_form_id

						// 缓存catchAdUnit
						this.catchAdUnit = adArr

						// 注入赋值
						this.childNeedForm = {
							creative_type: adArr.creative_form_id,
							ad_interaction: adArr.ad_interactive,
							_tag_: 'new'
						}

						this.creativePackInject() // 注入数据
					})

				} else {
					this.creativePackInject() // 注入数据
				}
			}
		},

		/**
		 * [initData 初始化加载数据]
		 * @return {[type]} [description]
		 */
		async initData(obj){

			let adId = obj.type === 'copy' ? this.copyId : this.adId

			const res = await getAdCreativeList({adid_arr: adId})

			if(res.code === 200 && res.data.list.length) {

				let adRes = res.data.list[0]

				this.formBase = {
					campaign_id: adRes.campaign.campaignid, // 广告活动id
					order_id: adRes.order.orderid, // 广告单元id
					adname: !!this.copyId ? `${adRes.adname}副本${formatDate(new Date, 'HHmm')}`: adRes.adname, // 广告名称
					thirdparty_vm: !!adRes.thirdparty_vm && adRes.thirdparty_vm.length ? this.vmCmFormat(adRes.thirdparty_vm) : [this.addVmCm()], // 第三方曝光监测
					thirdparty_cm: !!adRes.thirdparty_cm && adRes.thirdparty_cm.length ? this.vmCmFormat(adRes.thirdparty_cm) : [this.addVmCm()], // 第三方点击监测
					choose_type: 1, // 选择创意形式，因为是编辑，所以默认设置为1 --> 1.自定义创意 / 2.选择创意包
					creativePacketId: adRes.buyer_creativeid // 选择创意包id
				}

				this.creativePacketId = adRes.buyer_creativeid // 赋值创意包ID

				// 反显广告单元列表
				this.campaignIdChange(adRes.campaign.campaignid, {type: 'edit', isCopy: !!this.copyId, orderId: adRes.order.orderid})
			}

			// 根据当前creativePacketId 查询创意包， 如果不存在创意包id
			if (!this.creativePacketId) {
				this.$Spin.hide()
				this.goBack()
				return
			}

			// 根据广告详情，获取创意包id， 请求创意包内容，赋值到childNeedForm里，通过组件注入
			// 反显到创意包组件里
			const cRes = await getCreativeList({creative_id: this.creativePacketId}) // 广告包

			if(cRes.code === 200) {
				let cResult = cRes.data.list[0]

				// 2. 子集需要的form数据
				cResult._tag_ = 'edit'

				// 复制的广告，清除创意包id和buyer_creativeid，可以选择素材库
				if (!!this.copyId) {
					this.creativePacketId = ''
					cResult.buyer_creativeid = null
				}

				this.childNeedForm = cResult

				this.creativePackInject()
			}

			this.$Spin.hide()
		},
		/**
		 * [validateLink 正则链接]
		 * @param  {[type]}   rule     [description]
		 * @param  {[type]}   value    [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		validateLink(rule, value, callback) {
			if(!!value && !regWebUrl.test(value)) {
				callback(new Error('请输入合法的url地址'))
			} else {
				callback()
			}
		},
		/**
		 * [addVmCm 添加曝光和点击]
		 */
		addVmCm() {
			return {
				value: ''
			}
		},
		/**
		 * [vmCmFormat 格式化反显的vm/cm]
		 * @param  {[type]} arr [description]
		 * @return {[type]}     [description]
		 */
		vmCmFormat(arr) {
			let _arr = []
			arr.map(item => {
				_arr.push({
					value: item
				})
			})

			return _arr
		},
		/**
		 * [handVmAdd 添加曝光链接]
		 * @param  {[type]} name [vm/cm]
		 * @return {[type]} [description]
		 */
		handVmAdd(index, name) {
			if(this.formBase[name].length > (this.cmVmMax - 1)) {
				return
			}
			this.formBase[name].push(this.addVmCm())
		},

		/**
		 * [handVmRemove 删除 曝光链接]
		 * @param  {[type]} index [索引]
		 * @param  {[type]} name [vm/cm]
		 * @return {[type]}      [description]
		 */
		handVmRemove(index, name) {
			this.formBase[name].splice(index, 1)
		},

		/**
		 * [creativePackInject 创意包模块 内容注入]
		 * @return {[type]} [description]
		 */
		creativePackInject() {
			this.childNeedForm.order_id = this.formBase.order_id // 带入广告单元id, 在创意包里，用于筛选素材尺寸

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
		 * [submitFormData 校验批量创建时，名称是否重复，从而二次提醒]
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

					getBatchCreativeTail({name: _this.formBase.adname}).then(res => {
						if (res.code === 200 && res.data.tail > 0) {
							_this.showErrorModal(name) // 错误提示
						} else {
							_this.submitFormDataTrue(name)
						}
					})

				} else {
					_this.$Message.error({content: this.$config.requiredText, duration: 3})
				}
			})
		},
		/**
		 * [showErrorModal 错误提醒]
		 * @return {[type]} [description]
		 */
		showErrorModal(name) {
			this.$Modal.confirm({
				title: '提示',
				content: '广告名称重复，是否继续创建?',
				width: 500,
				onOk: () => {
					this.submitFormDataTrue(name) // 重置
				}
			})
		},
		/**
		 * [submitSet 提交表单]
		 * @param  {[type]} name [description]
		 * @return {[type]}      [description]
		 */
		submitFormDataTrue(name) {

			try {
				let _this = this

				_this.$refs[name].validate((valid) => {
					if (valid) {

						_this.$refs.creativePackage.validatorForm() // 验证子集的form表单

						if(!_this.returnChildForm.valid) {
							return
						}

						let curForm = {..._this.formBase} // 当前form表单
						let creativePacketForm = {..._this.returnChildForm.form} // 创意包表单

						let adForm = { // 广告接口需要保存的字段
							campaign_id: curForm.campaign_id,
							order_id: curForm.order_id,
							adname: curForm.adname
						}

						// 1.曝光链接
						let vmArr = []
						curForm.thirdparty_vm.map(item => {
							if(!!item.value) {
								vmArr.push(item.value)
							}
						})
						adForm.thirdparty_vm = vmArr

						// 2.点击链接
						let cmArr = []
						curForm.thirdparty_cm.map(item => {
							if(!!item.value) {
								cmArr.push(item.value)
							}
						})
						adForm.thirdparty_cm = cmArr


						// 曝光链接 数组
						/*if(!!curForm.thirdparty_vm) {
							adForm.thirdparty_vm = [curForm.thirdparty_vm]
						}

						if(!!curForm.thirdparty_cm) {
							adForm.thirdparty_cm = [curForm.thirdparty_cm]
						}*/


						// 1. 新建
						//         + 自定义  ----> 生成创意包+新建保存数据
						//         + 创意包  ----> 保存创意包+新建保存数据

						// 2. 编辑
						//         + 创意包   ----> 保存创意包 + 保存数据

						if (this.submitClock) {
							return
						}

						this.submitClock = true

						// 如果为编辑, 必有创意包
						if (!!_this.adId) {

							adForm.ad_id = _this.adId
							adForm.buyer_creativeid = _this.creativePacketId

							Promise.all([
								editCreativeApi(adForm),
								editCreative(creativePacketForm)
							]).then(res=> {
								if(res[0].code === 200 && res[1].code === 200) {

									this.$Bus.$emit('editEmitEvent') // 列表数据刷新

									_this.$Message.success({content: '保存成功', duration: 3})

									setTimeout(() => {
										_this.submitClock = false
										_this.goBack()
									}, 200)
								} else {
									_this.submitClock = false
								}
							}, err=> {
								_this.submitClock = false
							})
						} else { // 新建

							let creativeUrl = '' // 创意包接口

							if (_this.isChoosePackage && !_this.copyId) { // 选择的创意包  (备忘录： 选择的创意包，文件不进素材库); 2021/04/21备注新需求：复制广告时, 要新创建创意包
								editCreative(creativePacketForm).then(res => {
									_this.hasBuyerId2Ad(res, adForm, creativePacketForm)
								})
							} else {
								// 自定义创意 新建创意时，创意包的名称用的是 广告名称
								creativePacketForm.creative_name = curForm.adname

								console.log(creativePacketForm, adForm)
								// 1. 先上传素材库
								_this.checkHasMaterialId(creativePacketForm, adForm) // 先上传素材
							}

						}
					} else {
						_this.$Message.error({content: this.$config.requiredText, duration: 3})
					}
				})
			} catch (e) {
				console.log(e)
			}
		},

		/**
		 * [hasBuyerId2Ad 有创意包id，去保存广告]
		 * @return {response} [保存创意包返回的结果]
		 * @return {adForm} [广告表单]
		 * @return {creativePacketForm} [创意包表单]
		 * @return {Boolean} [description]
		 */
		hasBuyerId2Ad(response, adForm, creativePacketForm) {
			try {

				let _this = this
				_this.submitClock = true

				new Promise((resolve, reject) => {
					resolve(response)
				}).then(res => {
					if (res.code === 200) {
						return _this.isChoosePackage ? creativePacketForm.buyer_creativeid : (!!res.data.buyer_creativeid ? res.data.buyer_creativeid : null)
					} else {
						return null
					}
				}, err => {
					return null
				}).then(buyer_creativeid => {

					if (buyer_creativeid === null) {
						_this.$Message.error({content: '创意包保存失败', duration: 3})
						_this.submitClock = false
						return
					}

					adForm.buyer_creativeid = buyer_creativeid

					let saveCreativeUrl = _this.addType === 'bacthAdd' ? batchAdCreative(adForm) : saveCreativeApi(adForm) // 分为批量和单个

					saveCreativeUrl.then(res => {
						if (res.code === 200) {

							_this.$Bus.$emit('editEmitEvent') // 列表数据刷新

							_this.$Message.success({ content: '保存成功', duration: 3 })

							setTimeout(() => {
								_this.submitClock = false
								_this.goBack()
							}, 10)
						} else {
							_this.$Message.error({ content: '广告保存失败', duration: 3 })
							_this.submitClock = false
						}
					}, err => {
						_this.$Message.error({ content: '广告保存失败', duration: 3 })
						_this.submitClock = false
					})
				})
			} catch(e) {
				console.log(e)
			}
		},
		/**
		 * [checkHasMaterialId 校验图片的url中是否还有素材id，有的直接保存素材id，无的话保存到素材库，拿到素材id]
		 * @param  {[type]} form [创意包表单]
		 * @param  {[type]} adForm [广告表单]
		 * @return {[type]}      [description]
		 */
		checkHasMaterialId(form = {}, adForm) {
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
							_this.submitClock = false
							this.$Message.error({content: '保存素材错误', duration: 3})
							return
						}

						this.toAddOrEditCreative(form, catchIdArr, adForm) // 新建/保存创意包
					})
				} else { // 全部都是素材
					this.toAddOrEditCreative(form, catchIdArr, adForm) // 新建/保存创意包
				}
			} catch(e) {
				console.log(e)
			}
		},

		/**
		 * [toAddOrEditCreative 新建/保存创意包]
		 * @param  {[type]} form       [创意包表单内容]
		 * @param  {[type]} materialId [素材id数组]
		 * @param  {[type]} adForm [广告表单]
		 * @return {[type]}            [description]
		 */
		toAddOrEditCreative(form, materialId, adForm) {

			try {

				let _this = this
				let creativeUrl

				// 1. 新建时 删除 pic_url_arr 和 video_url
				delete form.pic_url_arr // 图片素材cdn地址
				delete form.video_url // 视频素材cdn地址

				// 分独立创建和批量创建
				if(_this.addType === 'bacthAdd') { // 批量

					// 2. 绑定素材id, 类型为 [[1], [2]]
					let arrForm = []
					materialId.map(item => {
						arrForm.push([item])
					})

					form['material_id_arr'] = arrForm

					creativeUrl = batchAddCreative(form)
				} else { // 单独

					// 此处加个逻辑判断： 用于处理视频封面图 cover_img
					if (!!form.cover_url) {
						form.cover_url = form.cover_url.split('?')[0]
					}

					// 2. 绑定素材id, 类型为 [2]
					form['material_id_arr'] = materialId

					creativeUrl = addCreative(form)
				}

				// 保存创意包
				creativeUrl.then(res=> {
					_this.hasBuyerId2Ad(res, adForm, form)
				})
			} catch(e) {
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
			} catch(e) {
				console.log(e)
			}
		},

		/**
		 * [campaignIdChange 广告活动名称发生改变时, 获取广告单元列表]
		 * @return {[camId]} [广告活动id]
		 * @return {[obj]} [description]
		 */
		campaignIdChange(camId, obj) {

			this.proGetAdUnitList(camId, obj).then(() => {
				// 编辑时分两种情况; 1.重新修改了广告活动; 2. 无操作广告活动和广告单元
				// 但是只有在2的情况下，不能清除order_id
				if (!!obj && obj.type !== 'edit') {
					this.formBase.order_id = ''
				}

				this.isChoosePackage = false // 更换广告活动，清空是否选择创意包
			})
		},
		/**
		 * [proGetAdUnitList 返回获取广告单元的promise]
		 * @return {[type]} [description]
		 */
		proGetAdUnitList(camId, obj) {
			return new Promise((resolve, reject) => {
				getAdUnitList({campaignid_arr: [camId]}).then(res => {
					if (res.code === 200) {
						this.adUnitList = res.data.list

						// 因需求修改，添加复制广告功能，此处缓存广告单元数据，用于选择创意包
						if (!!obj && obj.isCopy) {
							let adArr = res.data.list.filter(item => {
								return item.orderid === obj.orderId
							})[0]
							// 缓存catchAdUnit
							this.catchAdUnit = adArr
						}
					}
					resolve(res)
				}, err => {
					reject(err)
				})
			})
		},
		/**
		 * [orderIdChange 广告单元名称发生变化时
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		orderIdChange(id) {
			const result = this.adUnitList.filter(item=> {
				return item.id === id
			})[0]

			this.catchAdUnit = result // 缓存缓存结果
			this.isChoosePackage = false // 更换广告单元，清空是否选择创意包

			// 取它关联的广告单元选的创意形式
			this.childNeedForm = {
				creative_type: result.creative_form_id,
				ad_interaction: result.ad_interactive,
				_tag_: this.adId ? 'edit' : 'new'
			}

			this.creativePackInject()
		},

		/**
		 * [chooseTypeChange description]
		 * @return {[type]} [description]
		 */
		chooseTypeChange() {
			console.log(this.catchAdUnit)

			this.isChoosePackage = false

			this.childNeedForm = {
				creative_type: this.catchAdUnit.creative_form_id,
				ad_interaction: this.catchAdUnit.ad_interactive,
				_tag_: 'reset'
			}

			this.creativePackInject()
		},
		/**
		 * [chooseCreativePacket 选择创意包]
		 * @return {[type]} [description]
		 */
		chooseCreativePacket() {
			// 1. 先获取该广告下广告位的尺寸
			// 2. 根据返回的尺寸，筛选出对应的创意包

			this.modalFlag = true
			this.tableLoadFlag = true

			getOrderRelatedRatios({order_id: this.catchAdUnit.orderid}).then(res => {
				if(res.code === 200 && res.data && res.data.ratios && res.data.ratios.length) {

					// 获取尺寸列表，并格式化
					let _arr = []
					res.data.ratios.map(item => {
						_arr.push(`${item.width}:${item.height}`)
					})
					this.tableParamsRatio = _arr

					this.getTableList() // 获取创意包列表数据

				} else {
					this.resetTableModal()
					this.$Notice.warning({title: '当前广告下无素材尺寸', duration: 3})
				}
			}, err => {
				this.resetTableModal()
			})
		},
		/**
		 * [resetModalTable 重置表格相关数据字段]
		 * @return {[type]} [description]
		 */
		resetTableModal() {
			this.modalFlag = false
			this.tableLoadFlag = false
		},
		/**
		 * [getTableList 获取创意包列表数据]
		 * @return {[type]} [description]
		 */
		getTableList() {

			this.tableLoadFlag = true

			let params = {
				page_size: this.pageSize,
				page_num: this.currentPage,
				creative_type: this.childNeedForm.creative_type
			}

			if (!!this.filterSearch.name_or_id) {
				params.name_or_id = this.filterSearch.name_or_id
			}

			this.tableParamsRatio.length && (params.ratios = this.tableParamsRatio)

			getCreativeList(params).then(res => {
				this.tableLoadFlag = false
				if (res.code === 200) {
					this.colDatList = res.data.list || []
					this.total_count = res.data.total
				}
			})
		},
		/**
		 * [trueChoosePackage 确认选择]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		trueChoosePackage(row) {
			this.modalFlag = false

			this.isChoosePackage = true // 是否选择了创意包

			this.childNeedForm = row
			this.childNeedForm._tag_ = 'chooseAdPack' // 选择的创意包

			this.creativePackInject()

			this.resetFields()

		},
		/**
		 * [doFilterList 筛选查询]
		 * @return {[type]} [description]
		 */
		doFilterList(val) {
			this.currentPage = 1
			this.getTableList()
		},
		/**
		 * [pageNumberChange 修改页码]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		pageNumberChange(val) {
			this.currentPage = val
			this.getTableList()
		},
		/**
		 * [pageSizeChange 切换每页条数时的回调]
		 * @param  {[type]} size [description]
		 * @return {[type]}      [description]
		 */
		pageSizeChange(size) {
			this.pageSize = size
			this.getTableList()
		},
		/**
		 * [goBack 返回上一页]
		 * @return {[type]} [description]
		 */
		goBack() {
			if(!this.source) {
				this.$router.replace({name: 'advertising-creative'})
			} else {
				this.$router.replace({name: 'advertising-creative', query: {cb: 'fresh'}})
			}
		},
		/**
		 * [resetFields iview中form表单重置问题resetFields]
		 * @return {[type]} [description]
		 */
		resetFields() {
			let resetArrName = ['creativePacketId']
			this.$refs['formBase'].fields.forEach(e=> {
				if(resetArrName.includes(e.prop)) {
					e.isRequired = false
					e.resetField()
				}
			})
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .ivu-select-input[disabled] {
	color #969696 !important
	height 30px
	-webkit-text-fill-color #969696 !important
	background #fafafa !important
}
/deep/ .ivu-select-disabled .ivu-select-selection{
	-webkit-text-fill-color #969696 !important
	background #fafafa !important
	color #969696 !important
	border 1px solid #ebebeb
}

/deep/ .ivu-input[disabled] {
	color #969696 !important
	background #fafafa !important
}
/deep/ .ivu-radio-group-button .ivu-radio-wrapper-disabled {
	color #969696
}
.page-detail-title
	margin-bottom: 20px
.table-hander
	color: #465CFE
	cursor: pointer

.ad-right-content
	width: 244px
	margin-top: -40px
	margin-right: 30px
	h3
		font-size: 14px
		line-height: 30px
		font-weight: 600
		text-align: center
		margin-bottom: 28px

.upload-item
	display: inline-block
	vertical-align: top
	margin-right: 10px
	.icon-upload-cloud
		color: #4665FE
		font-size: 24px
	.upload-tips
		text-align: center
		margin-top: 10px
		font-size: 12px
		color: #999
		line-height: 22px
.upload-video-card
	margin-bottom: 10px
.title-line-tag
	margin-bottom: 24px
/deep/ .ivu-modal-body
	padding: 20px
.search-line
	margin-bottom: 20px
.creative-card
	width: 820px
.link-list
	position: relative
	.link-handler
		position: absolute
		right: -55px
		top: 0px
		display: flex
	.handle-btn
		width: 45px
</style>
