<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">{{headTitle}}</h2>
    </div>
    <div class="page-main">
      <div class="data-nav-tab">
        <div class="tab-list" :class="navType === 'image' ? 'active' : ''" @click="toggleNavTab('image')">图片素材</div>
        <div class="tab-list" :class="navType === 'video' ? 'active' : ''" @click="toggleNavTab('video')">视频素材</div>
      </div>
      <Card :bordered="false" dis-hover class="has-table-card">
        <matter-image v-show="navType==='image'"/>
        <matter-video v-show="navType==='video'"/>
       <div v-show="navType==='image'">
         <matter-image-day  v-show="dataImageNav==='day'" ref="matterImageDay">
           <div class="data_nav"  slot="tab">
             <RadioGroup  v-model="dataImageNav" type="button">
               <Radio class="i-width-checkbtn"  label="day">日数据</Radio>
               <Radio class="i-width-checkbtn"  label="hour">小时数据</Radio>
             </RadioGroup>
           </div>
         </matter-image-day>
         <matter-image-hour v-show="dataImageNav==='hour'" ref="matterImageHour">
           <div class="data_nav" slot="tab">
             <RadioGroup  v-model="dataImageNav" type="button">
               <Radio class="i-width-checkbtn"  label="day">日数据</Radio>
               <Radio class="i-width-checkbtn"  label="hour">小时数据</Radio>
             </RadioGroup>
           </div>
         </matter-image-hour>
       </div>
        <div v-show="navType==='video'">
          <matter-video-day  v-show="dataVideoNav==='day'" ref="matterVideoDay">
            <div class="data_nav"  slot="tab">
              <RadioGroup  v-model="dataVideoNav" type="button">
                <Radio class="i-width-checkbtn"  label="day">日数据</Radio>
                <Radio class="i-width-checkbtn"  label="hour">小时数据</Radio>
              </RadioGroup>
            </div>
          </matter-video-day>
          <matter-video-hour  v-show="dataVideoNav==='hour'" ref="matterVideoHour">
            <div class="data_nav" slot="tab">
              <RadioGroup  v-model="dataVideoNav" type="button">
                <Radio class="i-width-checkbtn"  label="day">日数据</Radio>
                <Radio class="i-width-checkbtn"  label="hour">小时数据</Radio>
              </RadioGroup>
            </div>
          </matter-video-hour>
        </div>
      </Card>

    </div>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {inPageAccess} from '@/mixin/in-page-access.js'
  import matterImageDay from './matter-image-day/index'
  import matterImageHour from './matter-image-hour/index'
  import matterVideoDay from './matter-video-day/index'
  import matterVideoHour from './matter-video-hour/index'
  import matterImage from './matter-image/index'
  import matterVideo from './matter-video/index'

  export default {
    name: 'data-material-manage',
    components: {matterImageDay, matterImageHour, matterImage, matterVideo, matterVideoHour, matterVideoDay},
    mixins: [inPageAccess],
    data() {
      return {
        navType: 'image', // 判断是啥素材
        dataImageNav: 'day', // 小时数据
        dataVideoNav: 'day' // 小时数据
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    created() {
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
  @import '../data-use.styl'
  @import '../table.styl'
  @import "./index.styl"
</style>
