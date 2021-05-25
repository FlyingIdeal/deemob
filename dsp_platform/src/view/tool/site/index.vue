<!-- by 李想 -->
<template>
	<div class="page-main">
		<!-- 线索跟踪 -->
		<!-- <clues-track v-show="navType === 'clues'">
			<div class="data-nav-tab" slot="tab">
				<div class="tab-list" :class="navType === 'clues' ? 'active' : ''" @click="toggleNavTab('clues')">线索跟踪<span class="small-tips">(支持JS代码监测)</span></div>
				<div class="tab-list" :class="navType === 'app' ? 'active' : ''" @click="toggleNavTab('app')">应用跟踪<span class="small-tips">(支持API回传)</span></div>
			</div>
		</clues-track> -->
		<!-- 应用跟踪 -->
		<app-track v-show="navType === 'app'">
			<div class="data-nav-tab" slot="tab">
				<div class="tab-list" v-if="navType === 'clues'" :class="navType === 'clues' ? 'active' : ''" @click="toggleNavTab('clues')">线索跟踪<span class="small-tips">(支持JS代码监测)</span></div>
				<div class="tab-list" :class="navType === 'app' ? 'active' : ''" @click="toggleNavTab('app')">应用跟踪<span class="small-tips">(支持API回传)</span></div>
			</div>
		</app-track>
	</div>
</template>

<script>
import {showTitle} from '@/libs/util'
import { tableHeight } from '@/mixin/calc-table-height.js'
// import cluesTrack from './clues/manage'
import appTrack from './app/manage'

export default {
	name: 'site-manage',
	mixins: [tableHeight],
    // components: { cluesTrack, appTrack },
    components: { appTrack },
	data() {
		return {
			navType: 'app', // 跟踪类型， 默认线索
			submitClock: false,
		}
	},
	computed: {
		headTitle() {
			return showTitle(this.$route, this)
		}
	},
	methods: {
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
