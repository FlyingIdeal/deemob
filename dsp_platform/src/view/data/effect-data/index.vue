<!-- by 李想 -->
<template>
	<div class="page-main">
		<!-- 日报表 -->
		<effect-day v-show="navType === 'day'" ref="effectDay">
			<div class="data-nav-tab" slot="tab">
				<div class="tab-list" :class="navType === 'day' ? 'active' : ''" @click="toggleNavTab('day')">日报表</div>
				<div class="tab-list" :class="navType === 'hour' ? 'active' : ''" @click="toggleNavTab('hour')">小时报表</div>
			</div>
		</effect-day>
		<!-- 小时报表 -->
		<effect-hour v-show="navType === 'hour'" :campaignId="campaignId" :orderId="orderId" ref="effectHour">
			<div class="data-nav-tab" slot="tab">
				<div class="tab-list" :class="navType === 'day' ? 'active' : ''" @click="toggleNavTab('day')">日报表</div>
				<div class="tab-list" :class="navType === 'hour' ? 'active' : ''" @click="toggleNavTab('hour')">小时报表</div>
			</div>
		</effect-hour>
	</div>
</template>

<script>
import effectDay from './effect-day/index'
import effectHour from './effect-hour/index'
export default {
    components: { effectDay, effectHour },
	data() {
		return {
			campaignId: '', // 广告活动ID
            orderId: '', // 广告单元ID
			navType: 'day' // 报表类型， 默认天
		}
	},
	activated() {
		this.campaignId = this.$route.query.campaignId ? Number(this.$route.query.campaignId) : '' // 广告活动ID
		this.orderId = this.$route.query.orderId ? Number(this.$route.query.orderId) : '' // 广告单元ID

		this.rejectData()
	},
	methods: {
		/**
		 * [rejectData 注入数据]
		 * @return {[type]} [description]
		 */
		rejectData() {

			let obj = {
				_tag: '',
				navType: this.navType,
				campaignId: this.campaignId,
				orderId: this.orderId
			}

			if (!!this.campaignId) {
				obj._tag = 'campaign'
			} else if (!!this.orderId) {
				obj._tag = 'order'
			}

			if(!!obj._tag) {
				this.navType = 'day'
			}

			this.$refs['effectDay'].injectData(obj)
			this.$refs['effectHour'].injectData(obj)
		},
		/**
		 * [toggleNavTab 切换导航类型]
		 * @param  {[type]} type [description]
		 * @return {[type]}      [description]
		 */
		toggleNavTab(type) {
			this.navType = type
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
