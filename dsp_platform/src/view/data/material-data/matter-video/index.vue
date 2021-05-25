<template>
  <div class="page-main">
    <div class="matter_header">
      <div class="matter_title">
        <div class="matter_left">点击率TOP10 <span>（仅显示广告展现大于1000次的素材）</span></div>
        <div class="matter_right">
          <RadioGroup v-model="click_type" type="button" @on-change="ctrChange">
            <Radio  :label="1">
              <Tooltip placement="top" :transfer="true" max-width="450">
                最高点击率
                <Icon type="md-help-circle" style="color: #333333;font-size: 16px"/>
                <div slot="content" class="tooltip">
                   <p>取每个素材关联的每个广告的最高点击率，然后进行排序</p>
                </div>
              </Tooltip>
            </Radio>
            <Radio :label="2">
              <Tooltip placement="top" :transfer="true" max-width="450">
                平均点击率
                <Icon type="md-help-circle" style="color: #333333;font-size: 16px"/>
                  <div slot="content" class="tooltip">
                    <p>取素材关联所有广告的平均点击率排序 <br>所有广告的广告点击/所有广告的广告展现*100%</p>
                  </div>
              </Tooltip>
            </Radio>
          </RadioGroup>
          <Select v-model="dataTime" :transfer="true" style="width:104px;margin-left: 15px" @on-change="timeChange">
            <Option :value="1">今天</Option>
            <Option :value="2">昨天</Option>
            <Option :value="3">过去7天</Option>
            <Option :value="4">过去30天</Option>
          </Select>
        </div>
      </div>
      <div class="matter_group">
        <Form label-position="left">
          <FormItem label="素材组：" :label-width="70">
            <RadioGroup v-model="matter_group" type="button" @on-change="groupChange">
              <Radio :label="0">全部</Radio>
              <Radio class="group_radio" v-for="(it,index) in groupList" :key="'图片的搜索'+it.id +index" :title="it.material_group_name"  :label="it.id">{{it.material_group_name}}</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="spin-card">
      <div class="matter_content">
        <div class="matter_detail" v-if="matterList && matterList.length">
          <div  v-for="(item,index) in matterList" :key="index" class="matter_list">
            <div class="matter_text" v-if="index<10">
              <div v-if="index<3" class="matter_top"
                   :style="index===1 ? 'background: linear-gradient(0deg, #5C2AFF, #A083FE);': index===2 ? 'background: linear-gradient(0deg, #0DBFE5, #22E3FF);': ''">
                TOP{{index+1}}
              </div>
              <video :src="item.material_link" controls="controls" />
              <div class="matter_ctr">
                <span>素材ID：{{item.material_id}}</span>
                <span>CTR：{{click_type === 1 ? item.max_ctr : item.ctr}}%</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="nodata">
          <img  src="~@/assets/image/icon/no_data.jpg" alt="">
          <p>暂无数据</p>
        </div>
      </div>
      <Spin fix v-if="!isAllLoading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>
    </div>
  </div>
</template>

<script>
  import {getMaterialList, getTopMaterialList} from '@/api/data'
  import { getMaterialGroupList } from '@/api/tool'
  import { formatDate } from '@/libs/tools'

  export default {
    name: 'index',
    data() {
      return {
        isAllLoading: false, // 是否加载完毕
        navType: 'image', // 判断是啥素材
        click_type: 1, // 点击率的判断
        dataTime: 1, // 时间的筛选
        matter_group: 0, // 素材组的筛选
        groupList: [], // 素材组的选择
        start_time: '',
        end_time: '',
        group: ['material_id', 'ad_id'],
        matterList: [] // 素材库的链接
      }
    },
    created() {
      this.initDatePickerTime()
      this.getGroupList()
    },
    methods: {
      /**
       * [timeChange 时间的搜索]
       * @return {[type]} [description]
       */
      timeChange(val) {
        const curTime = new Date()
        if (val === 1) {
          let startDate = formatDate(curTime, 'yyyy-MM-dd') // 当前天
          this.start_time = startDate
          this.end_time = startDate
        } else if (val === 2) {
          let startDate = formatDate(curTime.getTime() - 3600 * 1000 * 24 * 1, 'yyyy-MM-dd') // 昨天
          this.start_time = startDate
          this.end_time = startDate
        } else if (val === 3) {
          const startDate = formatDate(curTime, 'yyyy-MM-dd') // 当前天
          const endDate = formatDate(curTime.getTime() - 3600 * 1000 * 24 * 7, 'yyyy-MM-dd')
          this.start_time = endDate
          this.end_time = startDate
        } else if (val === 4) {
          const startDate = formatDate(curTime, 'yyyy-MM-dd') // 当前天
          const endDate = formatDate(curTime.getTime() - 3600 * 1000 * 24 * 30, 'yyyy-MM-dd')
          this.start_time = endDate
          this.end_time = startDate
        }
        this.getMaterialListApi()
      },
      /**
       * [groupChange 素材组的搜索]
       * @return {[type]} [description]
       */
      groupChange() {
        this.getMaterialListApi()
      },
      /**
       * [initDatePickerTime 默认为当天的时间]
       * @return {[type]} [description]
       */
      initDatePickerTime() {
        const localDate = formatDate(new Date(), 'yyyy-MM-dd') // 当前天
        this.start_time = localDate
        this.end_time = localDate
        this.getMaterialListApi()
      },
      /**
       * [ctrChange 最高点击率 与 平均点击率  1位最高点击率 2 位平均点击率]
       * @return {[type]} [description]
       */
      ctrChange(val) {
        if (val === 1) {
          this.group = ['material_id', 'ad_id']
        } else {
          this.group = ['material_id']
        }
        this.getMaterialListApi()
      },
      /**
       * [getGroupList 获取素材组的信息]
       * @return {[type]} [description]
       */
      getGroupList() {
        getMaterialGroupList().then(res => {
          if (res.code === 200) {
            let _list = res.data.list || []
            this.groupList = _list
          }
        })
      },
      unique(arr) { // 根据唯一标识material_id来对数组进行过滤
        const res = new Map() // 定义常量 res,值为一个Map对象实例
        // 返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
        return arr.filter((arr) => !res.has(arr.material_id) && res.set(arr.material_id, 1))
      },
      /**
       * [getMaterialListApi 获取top10 的值]
       * @return {[type]} [description]
       */
      getMaterialListApi() {
        this.isAllLoading = false
        let obj = {
          data_type: 'day', // day 或者 hour
          material_type: 2, // 素材类型，1=图片，2=视频
          order: 'ctr desc', // 排序
          page_num: 1,
          page_size: 10,
          group: this.group,
          data_rules: ['view>1000'], // 显示广告展现大于1000次
          start_timestamp: Date.parse(new Date(this.start_time)) / 1000,
          end_timestamp: Date.parse(new Date(this.end_time)) / 1000
        }
        let topObj = {
          material_type: 2,
          start_timestamp: Date.parse(new Date(this.start_time)) / 1000,
          end_timestamp: Date.parse(new Date(this.end_time)) / 1000,
          top_count: 10
        }
        let materialIds = []
        this.matter_group ? materialIds.push(this.matter_group) : ''
        materialIds.length > 0 ? obj.material_group_ids = materialIds : ''
        materialIds.length > 0 ? topObj.material_group_ids = materialIds : ''
        if (this.click_type === 1) {
          getTopMaterialList(topObj).then(res => {
            this.isAllLoading = true
            if (res.code === 200) {
              let _list = res.data.list || []
              this.matterList = _list
            }
          })
        } else {
          getMaterialList(obj).then(res => {
            this.isAllLoading = true
            if (res.code === 200) {
              let _list = res.data.list || []
              this.matterList = _list
            }
          })
        }
      }

    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../index.styl"
</style>
