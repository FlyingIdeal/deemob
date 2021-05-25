<template>
	<div class="page-main">
		<div class="page-title page-has-line">
			<h2 class="title-line-tag">{{headTitle}}</h2>
			<div class="is-handler">
				<Poptip :transfer="true" placement="bottom" v-model="batchOpenFlag" transfer-class-name="batch-custom-poptip" v-if="_isShow_('status')">
					<Button class="has-img-icon" type="text">
						<i class="batch-open is-handler-icon"></i>
						<span>批量启用</span>
					</Button>

					<div slot="content">
						<i class="iconfont icon-why"></i>
						<span class="pop-text">确认批量启用么？</span>
						<Button @click="batchOpenFlag = false">取消</Button>
						<Button type="primary" @click="batchOpen('open')">确定</Button>
					</div>
				</Poptip>

				<Poptip :transfer="true" placement="bottom" v-model="batchCloseFlag" transfer-class-name="batch-custom-poptip" v-if="_isShow_('status')">
					<Button class="has-img-icon" type="text">
						<i class="batch-close is-handler-icon"></i>
						<span>批量停用</span>
					</Button>

					<div slot="content">
						<i class="iconfont icon-why"></i>
						<span class="pop-text">确认批量停用么？</span>
						<Button @click="batchCloseFlag = false">取消</Button>
						<Button type="primary" @click="batchOpen('close')">确定</Button>
					</div>
				</Poptip>

				<Button class="has-img-icon" type="text" @click="drawModalFlag = true" v-if="_isShow_('newAndEdit')">
					<i class="batch-add is-handler-icon"></i>
					<span>批量新建应用</span>
				</Button>

				<Button type="primary" icon="md-add" @click="toEdit()" v-if="_isShow_('newAndEdit')">新建应用</Button>
			</div>
		</div>
		<Card :bordered="false" dis-hover class="has-table-card">
			<div class="search-line" ref="search-line">
				<Select
					class="i-margin-right-11 i-width-normal mar-bot-10"
					v-model="filterSearch.ssp_id_arr"
					filterable
					clearable
					:remote-method="searchSsp"
					:loading="sspListLoad"
					:transfer="true"
					@on-clear="clearSearchSsp"
					placeholder="请选择媒体">
					<Option v-for="item in sspList" :value="item.id" :key="item.id">{{ item.name }}({{ item.id }})</Option>
				</Select>

				<Select
					class="i-margin-right-11 i-width-normal mar-bot-10"
					v-model="filterSearch.os_type"
					filterable
					clearable
					:transfer="true"
					placeholder="请选择应用平台">
					<Option v-for="item in osType" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>

				<Input class="i-margin-right-11 mar-bot-10 i-width-normal" clearable v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入应用名称或ID查询" :clearable="true" />
				<Button class="search" @click="doFilterList">查询</Button>
			</div>
			<div class="console-table">
				<Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText" @on-selection-change="selectChange">
					<!--应用名称/ID-->
					<template slot-scope="{ row }" slot="id">
						<p class="name-row-ellipsis" :title="row.app_name">{{ row.app_name }}</p>
						<p class="tip-row-line">ID: {{ row.id }}</p>
					</template>
					<!-- 应用平台 -->
					<template slot-scope="{ row }" slot="os_type">
						<span v-if="row.os_type === 1">Andorid</span>
						<span v-if="row.os_type === 2">IOS</span>
					</template>
					<!--媒体名称-->
					<template slot-scope="{ row }" slot="ssp_id">
						{{ row.ssp.name }}
					</template>
					<!-- 应用类型 -->
					<template slot-scope="{ row }" slot="app_type">
						{{row.app_type_one.name}}<template v-if="row.app_type_two.name"> - {{row.app_type_two.name}}</template>
					</template>
					<!--状态-->
					<template slot-scope="{ row }" slot="status">
						<!-- 状态, 1=正常, 2=停用 -->
						<span v-if="row.status === 1">正常</span>
						<span v-if="row.status === 2">停用</span>
						<i-switch size="small" :true-value="1" :false-value="2" v-model="row.status" @on-change="changeState(row)" v-if="_isShow_('status')"/>
					</template>
					<!--操作-->
					<template slot-scope="{ row, index }" slot="handle">
						<Button type="text" :to="toDetail(row)" v-if="_isShow_('newAndEdit')">编辑</Button>
					</template>
				</Table>
				<div class="page-center">
					<Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
				</div>
			</div>
		</Card>

		<!-- 批量新建应用 -->
		<Drawer v-model="drawModalFlag" width="600" :mask-closable="false" :closable="false" :styles="drawStyles" class="custom-drawer">
			<div slot="header" class="draw-header clearfix">
				<div class="draw-header-title fl">
					<h3>批量新建应用</h3>
				</div>
				<div class="draw-header-img fr">
					<img src="~@/assets/image/colsImg.png">
				</div>
			</div>
			<Form ref="exportForm" :label-width="60" :label-colon="true">
				<div class="down-export">
					<span>文件模板下载</span>
					<a download target="_blank" :href="`${this.$xlsAPIUrl}/%E6%89%B9%E9%87%8F%E6%96%B0%E5%BB%BA%E5%BA%94%E7%94%A8.xlsx`">
						<icon class="iconfont icon-download"/>
					</a>
				</div>
				<FormItem label="文件" prop="file" class="ivu-form-item-required">
					<Upload
						:action= "importSspAppUrl"
						type="drag"
						:show-upload-list="false"
						:format="['csv','xlsx','xls']"
						:on-format-error="handleFormatError"
						:before-upload="handleBeforUpload"
						:max-size="10*1024"
					>
						<div class="upload-inner">
							<div class="icon-box">
								<icon class="iconfont icon-upload-cloud"/>
							</div>
							<div class="upload-txt">
								<div class="handle-text">将文件拖到此处，或<span>点击上传</span></div>
								<div class="format-text">请将应用信息填写到文件模板里，切勿修改内部格式，文件大小不超过10M。</div>
							</div>
						</div>
					</Upload>
				</FormItem>
				<FormItem>
					{{filename}}
				</FormItem>
			</Form>
			<div class="drawer-footer">
				<Button @click="cancleExport">取消</Button>
				<Button type="primary" :loading="submitClock" @click="uploadPublic()">
					{{!submitClock ? '确定' : '提交中...'}}
				</Button>
			</div>
		</Drawer>
	</div>
</template>

<script>
import { showTitle, dataType } from '@/libs/util'
import { debounce } from '@/libs/tools'
import { appCols } from '../colList.js'
import { getSspAppList, batchSspAppStatus, modifySspApp, getSspList, importSspApp, importSspAppUrl } from '@/api/ssp'
import { inPageAccess } from '@/mixin/in-page-access.js'
import { mapGetters } from 'vuex'

export default {
	mixins: [inPageAccess],
	data() {
		return {
			pageSize: 10, // 页码长度
			total_count: 0,
			currentPage: 1,
			colDatList: [], // table数据
			tableLoadFlag: false, // table的loading
			noDataText: this.$config.noDataText,

			catchSspList: [], // 缓存媒体列表，在清空媒体下拉时重新赋值
			sspList: [], // 媒体列表
			sspListLoad: false, // 媒体列表加载中
			submitClock: false,

			batchOpenFlag: false, // 批量开启
			batchCloseFlag: false, // 批量关闭
			selectID: [], // 批量id

			filterSearch: { // 筛选条件
				ssp_id_arr: '', // 媒体ID数组
				app_id_arr: '', // 应用ID数组
				os_type: '', // 操作系统, 1=Android, 2=iOS
				name_or_id: ''
			},
			tableColList: appCols(),

			importSspAppUrl: importSspAppUrl,
			drawModalFlag: false,
			uploadList: [], // 上传的文件
			filename: '',
			drawStyles: { // 抽屉样式
				height: 'calc(100% - 55px)',
				overflow: 'auto',
				paddingBottom: '54px',
				position: 'static'
			}
		}
	},
	computed: {
		...mapGetters(['osType']),
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	created() {
		if (this._hasPageAccess()) {
			this.getSspAppList() // 获取表格数据
			this.getSspList()
		}
	},
	activated() {
		this.$Bus.$off('editEmitEvent')
		this.$Bus.$on('editEmitEvent', (msg) => {
			this.getSspAppList() // 列表数据
		})
	},
	methods: {
		/**
		 * [getFinanceList 获取列表的信息]
		 * @return {[type]} [description]
		 */
		getSspAppList() {
			this.tableLoadFlag = true

			let _filter = this.filterSearch

			let params = {
				page_size: this.pageSize,
				page_num: this.currentPage
			}

			_filter.ssp_id_arr !== '' && (params.ssp_id_arr = _filter.ssp_id_arr)
			_filter.app_id_arr !== '' && (params.app_id_arr = _filter.app_id_arr)
			_filter.os_type !== '' && (params.os_type = _filter.os_type)
			_filter.name_or_id !== '' && (params.name_or_id = _filter.name_or_id)

			getSspAppList(params).then(res => {
				this.tableLoadFlag = false
				if (res.code === 200) {
					this.colDatList = res.data.list
					this.total_count = res.data.total
				} else if (res.code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}
			}, err => {
				if (err.code === 403) {
					this.noDataText = this.$config.noDataTextPer
				}
				this.tableLoadFlag = false
			})
		},
		/**
		 * [changeState 切换业务状态]
		 * @param  {[type]} item [description]
		 * @return {[type]}     [description]
		 */
		changeState(item) {
			// 1=正常, 2=停用
			modifySspApp({app_id: item.id, status: item.status === 1 ? 1 : 2}).then(res => {
				if (res.code === 200) {
					this.$Message.success('操作成功')
					item.status = item.status === 1 ? 1 : 2
				} else {
					this.$Message.error({content: '操作失败', duration: 3})
					item.status = item.status === 1 ? 2 : 1
				}
			}, err => {
				item.status = item.status === 1 ? 2 : 1
			})
		},

		/**
		 * [doFilterList 筛选查询]
		 * @return {[type]} [description]
		 */
		doFilterList(val) {
			this.currentPage = 1
			this.getSspAppList()
		},
		/**
		 * [selChange 获取选中的值]
		 * @param  {[type]} item [description]
		 * @return {[type]}     [description]
		 */
		selectChange(select) {
			let _arr = []
			select.map(item => {
				_arr.push(item.id)
			})
			this.selectID = _arr
		},
		/**
		 * [pageNumberChange 修改页码]
		 * @param  {[type]} val [description]
		 * @return {[type]}     [description]
		 */
		pageNumberChange(val) {
			this.currentPage = val
			this.getSspAppList()
		},
		/**
		 * [pageSizeChange 切换每页条数时的回调]
		 * @param  {[type]} size [description]
		 * @return {[type]}      [description]
		 */
		pageSizeChange(size) {
			this.pageSize = size
			this.getSspAppList()
		},
		/**
		 * [toEdit 编辑]
		 * @param  {[type]} id [description]
		 * @return {[type]}    [description]
		 */
		toEdit(row) {
			if(!!row && !!row.id) {
				this.$router.push({ name: 'ssp-app-edit', query: {appId: row.id} })
			} else {
				this.$router.push({ name: 'ssp-app-edit' })
			}
		},
		/**
		 * [toDetail 详情链接]
		 * @param  {[type]} row [description]
		 * @return {[type]}     [description]
		 */
		toDetail(row) {
			return `/ssp/app/edit?appId=${row.id}`
		},
		/**
		 * [resetForm 重置form表单]
		 * @return {[type]} [description]
		 */
		resetForm() {
			this.drawModalFlag = false
		},
		/**
		 * [batchOpen 批量启用]
		 * @return {[type]} [description]
		 */
		batchOpen(type) {
			if(!this.selectID.length) {
				this.$Message.warning('请先勾选媒体')
				return
			}

			batchSspAppStatus({app_id_arr: this.selectID, status: type === 'open' ? 1 : 2}).then(res=> {
				if(res.code === 200) {
					this.$Message.success({ content: '操作成功', duration: 3})
					
					this.selectID = []
					this.getSspAppList() // 获取列表
				} else {
					this.$Message.error({ content: res.msg, duration: 3})
				}

				this.batchOpenFlag = false
				this.batchCloseFlag = false
			})

		},
		/**
		 * [searchSsp 媒体列表]
		 * @param  {[type]} query [description]
		 * @return {[type]}       [description]
		 */
		searchSsp(query) {
			this.sspListLoad = true
			this.getSspList(query)
		},
		/**
		 * [clearSearchSsp 清空媒体列表]
		 * @return {[type]} [description]
		 */
		clearSearchSsp() {
			this.sspList = [...this.catchSspList]
		},
		/**
		 * [searchSsp 媒体列表-防抖]
		 * @param  {[type]} query [description]
		 * @return {[type]}       [description]
		 */
		getSspList: debounce(function(query) {
			let _params = {
				page_size: !!query ? 10000 : 10,
				page_num: 1,
				name_or_id: query || ''
			}

			getSspList(_params).then(res => {
				this.sspListLoad = false
				if (res.code === 200) {
					this.sspList = res.data.list

					if (!query) {
						this.catchSspList = res.data.list
					}
				}
			})
		}, 1000),


		/****************以下为批量上传start**************************/
		
		/**
		 * [cancleExport 取消导入]
		 * @return {[type]} [description]
		 */
		cancleExport() {
			this.drawModalFlag = false
			this.filename = ''
			this.uploadList = []
		},
		/**
		 * [handleFormatError 格式校验]
		 * @param  {[type]} file [description]
		 * @return {[type]}      [description]
		 */
		handleFormatError(file) {
			this.$Message.error({
				content: '不支持此文件类型',
				duration: 3
			})
			this.$Spin.hide()
		},
		/**
		 * [handleBeforUpload 上传前的判断 文件大小校验]
		 * @param  {[type]} file [description]
		 * @return {[type]}      [description]
		 */
		handleBeforUpload(file) {
			this.uploadList = []
			if (file && file.size > (10 * 1024 * 1024)) {
				this.$Message.warning('文件不能大于' + 10 + 'M')
				return false
			} else {
				this.uploadList.push(file)
				this.filename = file.name
				return false
			}
		},
		/**
		 * [uploadPublic 确定上传]
		 * @return {[type]} [description]
		 */
		uploadPublic() {
			if (this.uploadList.length === 0) {
				this.$Message.error('请上传文件')
				return false
			} else {
				this.upload()
			}
		},
		/**
		 * [upload 上传]
		 * @return {[type]} [description]
		 */
		upload() {
			this.submitClock = true

			let formData = new FormData()
			formData.append('file', this.uploadList[0])

			importSspApp(formData).then(res=> {
				if (res.code === 200) {
					this.$Message.success('上传成功')
					this.getSspAppList()

				} else if (res.code === 10006) {
					this.$Modal.confirm({
						title: '错误提示',
						content: res.msg
					})
				} else {
					this.$Message.error({ content: res.msg, duration: 3})
				}

				this.clearUpload()
				
			})
		},
		/**
		 * [clearUpload 清空上传信息]
		 * @return {[type]} [description]
		 */
		clearUpload() {
			this.drawModalFlag = false
			this.uploadList = []
			this.filename = ''
			this.submitClock = false
		}

		/****************以下为批量上传 end**************************/
	},
	/**
	 * [beforeRouteLeave 路由跳转]
	 * @param  {[type]}   to   [如果路由跳转不是到媒体详情页，则销毁 $Bus]
	 * @param  {[type]}   from [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	beforeRouteLeave(to, from, next) {
		if (to.name !== 'ssp-app-edit') {
			this.$Bus.$off('editEmitEvent')
		}
		next()
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.mar-bot-10
	vertical-align: top
	margin-bottom: 10px
</style>
