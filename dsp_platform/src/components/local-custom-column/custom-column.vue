<template>
	<Drawer v-model="drawModalFlag" width="600px" :mask-closable="false" :scrollable="false" :closable="false" :styles="drawStyles" class="custom-drawer">
		<div slot="header" class="draw-header clearfix">
			<div class="draw-header-title fl">
				<h3>自定义列</h3>
			</div>
			<div class="draw-header-img fr">
				<img src="~@/assets/image/colsImg.png">
			</div>
		</div>

		<div class="drawer-middle">
			<div class="check-center">
				<h4 class="column-title">可选择列</h4>
				<div class="check-middle">
					<div class="check-list">
						<div class="in-title">
							<Checkbox :value="isCheckAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
						</div>
						<CheckboxGroup v-model="hasCheckArr" @on-change="checkChange">
							<Checkbox class="option-item" v-for="item in checkArr" :key="item.__id" :label="item.title">
								{{item.title}}
							</Checkbox>
						</CheckboxGroup>
					</div>
				</div>
			</div>
			<div class="tag-center">
				<h4 class="column-title">已选择列</h4>
				<div class="select-tag">
					<Tag
						v-for="(item, index) in hasCheckArr"
						:key="`${item}_${index}`"
						:name="item"
						closable
						@on-close="tagClose"
					>
						{{item}}
					</Tag>
				</div>
			</div>
		</div>
		<div class="drawer-footer">
			<Button @click="drawModalFlag = false">取消</Button>
			<Button type="primary" @click="submitData">保存</Button>
		</div>
	</Drawer>
</template>

<script>
import {localSave, localRead} from '@/libs/util'

export default {
	props: {
		datalist: Array // 勾选的列表
	},
	data() {
		return {
			drawModalFlag: false, // 抽屉开关
			drawStyles: { // 抽屉样式
				height: 'calc(100% - 55px)',
				overflow: 'auto',
				paddingBottom: '54px',
				position: 'static'
			},
			hasCheckArr: [], // 已选择列
			isCheckAll: false, // 是否全选
      saveType: null
		}
	},
	computed: {
		/**
		 * [checkArr 全部的勾选列表]
		 * @return {[type]} [description]
		 */
		checkArr() {
			return this.datalist.filter(item => {
				return !item.isHideInColumn
			})
		}
	},
	methods: {
		/**
		 * [toggleDrawer 父级调用子集]
		 * @return {[type]} [description]
		 */
		toggleDrawer(type) {
			this.drawModalFlag = !this.drawModalFlag
      this.saveType = type
			// 打开时判断选择情况 回显
			if (this.drawModalFlag) {
				let _local = localRead(this.saveType || this.$route.name.toUpperCase())
				let _arr = []

				if (_local) {
					if (_local !== 'null') {
						_arr = _local.split(',')
					}
				} else {
					this.checkArr.map(item => {
						if(item.isCheckColumn) {
							_arr.push(item.title)
						}
					})
				}

				this.hasCheckArr = _arr
				this.checkChange() // 判断是否全选
			}
		},
		/**
		 * [submitData 数据确定]
		 * @return {[type]} [description]
		 */
		submitData() {
			this.toggleDrawer(this.saveType)
      let _local = this.saveType || this.$route.name.toUpperCase()
			localSave(_local, this.hasCheckArr.length ? this.hasCheckArr.toString() : null)

			this.$emit('on-change')
		},
		/**
		 * [tagClose 已选择列 删除]
		 * @param  {[type]} event [description]
		 * @param  {[type]} name  [description]
		 * @return {[type]}	   [description]
		 */
		tagClose(event, name) {
			let index = this.hasCheckArr.indexOf(name)
			if (index > -1) {
				this.hasCheckArr.splice(index, 1)
			}
		},
		/**
		 * [checkChange 列 单选  从而判断是否全选]
		 * @param  {[type]} arr [description]
		 * @return {[type]}	  [description]
		 */
		checkChange() {
			this.isCheckAll = this.hasCheckArr.length === this.checkArr.length
		},
		/**
		 * [handleCheckAll 全选]
		 * @return {[type]} [description]
		 */
		handleCheckAll() {
			this.isCheckAll = !this.isCheckAll

			let _arr = []
			if (this.isCheckAll) {
				this.checkArr.map(_ => {
					_arr.push(_.title)
				})
			}

			this.hasCheckArr = _arr
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .ivu-drawer-header
	padding 0px

/deep/ .ivu-drawer-body
	padding 0 25px

.custom-drawer
	.check-center
		border-right 1px solid #ebebeb
		width 360px
		height calc(100vh - 110px)
		margin-right 25px
	.tag-center
		width 225px
	.in-title
		margin-bottom: 8px
	.drawer-middle
		display: flex
		/deep/ .ivu-checkbox-inner
			width 12px
			height 12px
		/deep/ .ivu-checkbox-checked .ivu-checkbox-inner:after
			top: 0px
			left: 3px
	.option-item
		margin-bottom: 10px
		color: #333333
		width 33%
		margin-right 0px
		font-size 12px
		&:hover
			color #465CFE
			/deep/ .ivu-checkbox-inner
				border-color #465CFE
		&.ivu-checkbox-wrapper-checked
			color: #465CFE
	.column-title
		color #333333
		font-size 14px
		margin-top: 25px
		margin-bottom: 15px
	.select-tag
		max-height 500px
		overflow: auto
		.ivu-tag
			width: 100%
			display: flex
			justify-content: space-between
			align-items: center
			height: 22px
			line-height: 22px
			background: #f2f2f2
			border: 0px
			color: #333333
			margin: 0 0 6px
			/deep/ .ivu-tag-text
				color: #465CFE
			.ivu-icon-ios-close
				top: 6px
			&:hover
				background: #F2F4FF
				.ivu-tag-text
					color #465CFE
</style>
