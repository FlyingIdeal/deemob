<template>
  <div class="revence-main">
    <div class="main_info">
      <div class="info_left">
        <div class="info_title boxShadow">
          <div class="info_img">
            <img src="~@/assets/image/main/hi.jpg" alt="">
          </div>
          <div class="info_message">
            <p class="company">{{sumAccountData.company_name}}</p>
            <p class="infoID">ID：{{sumAccountData.advertiser_id}}</p>
          </div>
          <img class="embellish info_front" src="~@/assets/image/main/embellish.png" alt="">
          <img class="embellish info_after" src="~@/assets/image/main/embellish.png" alt="">
        </div>
        <div class="info_data boxShadow">
          <div class="account">
            <div class="account_list">
              <p class="account_title">账户余额（元）</p>
              <span class="account_line"></span>
              <p class="account_num">{{number2Thousand(sumAccountData.balance)}}</p>
            </div>
            <span class="line"></span>
            <div class="account_list">
              <p class="account_title">今日花费（元）</p>
              <span class="account_line" style="background:#FF6398"></span>
              <p class="account_num">{{number2Thousand(sumAccountData.today_spend)}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="info_right boxShadow">
        <div class="right_title">
          <span class="title">广告关键指标</span>
          <div>
            <Select v-model="dataTime" @on-change="keyTimeChange" style="width:104px">
              <Option :value="1">今天</Option>
              <Option :value="2">昨天</Option>
              <Option :value="3">前天</Option>
            </Select>
          </div>
        </div>
        <div class="right_list">
          <div class="data_list after_line">
            <div class="data_icon">
              <img src="~@/assets/image/main/ggzx.png" alt="">
            </div>
            <div class="data_text">
              <p class="title">
                广告展现
                <span  :class="[{'down_scale': keyDataList[0].view_seq > 0, 'up_scale' : keyDataList[0].view_seq < 0}]">
                 <icon v-if="keyDataList[0].view_seq && keyDataList[0].view_seq !== 0 "
                       :class=" keyDataList[0].view_seq > 0 ? 'icon icon-up1': 'icon icon-down'"/>
                 {{keyDataList[0].view_seq || '-- '+0 }}%</span>
                （同比）
              </p>
              <p class="num">{{keyDataList[0].view || 0 }}</p>
            </div>
            <span class="line"></span>
          </div>
          <div class="data_list after_line">
            <div class="data_icon">
              <img src="~@/assets/image/main/ggdj.png" alt="">
            </div>
            <div class="data_text">
              <p class="title">
                广告点击
                <span
                  :class="[{'down_scale': keyDataList[0].click_seq > 0, 'up_scale' : keyDataList[0].click_seq < 0}]">
                    <icon v-if="keyDataList[0].click_seq && keyDataList[0].click_seq !== 0 "
                          :class=" keyDataList[0].click_seq > 0 ? 'icon icon-up1': 'icon icon-down'"/>
                  {{keyDataList[0].click_seq || '-- '+0 }}%</span>
                （同比）
              </p>
              <p class="num">{{keyDataList[0].click || 0 }}</p>
            </div>
            <span class="line"></span>
          </div>
          <div class="data_list">
            <div class="data_icon">
              <img src="~@/assets/image/main/djl.png" alt="">
            </div>
            <div class="data_text">
              <p class="title">点击率
                <span
                  :class="[{'down_scale': keyDataList[0].ctr_seq > 0, 'up_scale' : keyDataList[0].ctr_seq < 0}]">
                   <icon v-if="keyDataList[0].ctr_seq && keyDataList[0].ctr_seq !== 0 "
                         :class=" keyDataList[0].ctr_seq > 0 ? 'icon icon-up1': 'icon icon-down'"/>
                  {{keyDataList[0].ctr_seq || '-- '+0 }}%</span>
                （同比）
              </p>
              <p class="num">{{keyDataList[0].ctr || 0 }}%</p>
            </div>
          </div>
          <div class="data_list after_line">
            <div class="data_icon">
              <img src="~@/assets/image/main/hf.png" alt="">
            </div>
            <div class="data_text">
              <p class="title">花费
                <span
                  :class="[{'down_scale': keyDataList[0].report_spend_seq > 0, 'up_scale' : keyDataList[0].report_spend_seq < 0}]">
                    <icon v-if="keyDataList[0].report_spend_seq && keyDataList[0].report_spend_seq !== 0 "
                          :class=" keyDataList[0].report_spend_seq > 0 ? 'icon icon-up1': 'icon icon-down'"/>
                  {{keyDataList[0].report_spend_seq || '-- '+0 }}%</span>
                （同比）
              </p>
              <p class="num">{{keyDataList[0].report_spend || 0 }}</p>
            </div>
            <span class="line"></span>
          </div>
          <div class="data_list after_line">
            <div class="data_icon">
              <img src="~@/assets/image/main/qczsjj.png" alt="">
            </div>
            <div class="data_text">
              <p class="title">千次展现均价
                <span
                  :class="[{'down_scale': keyDataList[0].ecpm_seq >0, 'up_scale' : keyDataList[0].ecpm_seq < 0}]">
                   <icon v-if="keyDataList[0].ecpm_seq && keyDataList[0].ecpm_seq !== 0 "
                         :class=" keyDataList[0].ecpm_seq > 0 ? 'icon icon-up1': 'icon icon-down'"/>
                  {{keyDataList[0].ecpm_seq || '-- '+0 }}%</span>
                （同比）
              </p>
              <p class="num">{{keyDataList[0].ecpm || 0 }}</p>
            </div>
            <span class="line"></span>
          </div>
          <div class="data_list">
            <div class="data_icon">
              <img src="~@/assets/image/main/djjj.png" alt="">
            </div>
            <div class="data_text">
              <p class="title">点击均价
                <span
                  :class="[{'down_scale': keyDataList[0].cpc_seq > 0, 'up_scale' : keyDataList[0].cpc_seq < 0}]">
                   <icon v-if="keyDataList[0].cpc_seq && keyDataList[0].cpc_seq !== 0 "
                         :class=" keyDataList[0].cpc_seq > 0 ? 'icon icon-up1': 'icon icon-down'"/>
                  {{keyDataList[0].cpc_seq || '-- '+0 }}%</span>
                （同比）
              </p>
              <p class="num">{{keyDataList[0].cpc || 0 }}</p>
            </div>
          </div>­
        </div>
      </div>
    </div>
    <Card class="mon-card" dis-hover :bordered="false">
      <div class="echarts_title">
        <div class="title_header">数据趋势（近七日）</div>
      </div>
      <div class="echatrs_select">
        <div class="select_data">
          <div style="display:inline-block">
            <div class="left" style="display:inline-block">
            <Select  v-model="mediaEchartX" class="i-margin-right-11" style="width:140px" @on-change="initMoniter">
              <Option v-for="item in echartsMediaTarget" :value="item.key" :disabled="item.key === mediaEchartY"
                      :key="'echarts1'+item.key">{{ item.title }}
              </Option>
            </Select>
            </div>
            <Checkbox class="select_check" v-model="contrast">对比</Checkbox>
          <div class="right" style="display:inline-block">
            <Select v-show="contrast" v-model="mediaEchartY" class="i-margin-right-11" style="width:140px"
                    @on-change="initMoniter">
              <Option v-for="item in echartsMediaTarget" :value="item.key" :disabled="item.key === mediaEchartX"
                      :key="'echarts2'+item.key">{{ item.title }}
              </Option>
            </Select>
          </div>
          </div>
        </div>
      </div>
      <div v-show="lineStatus === 1" class="no_data">
        <p><img src="~@/assets/image/noDatas.png" alt=""></p>
        <p class="no_text">暂无数据</p>
      </div>
      <div v-show="lineStatus === 2">
        <div id="dataTrend" class="echart-content"></div>
      </div>
    </Card>
    <div class="data_show">
      <div class="data_detail data_media">
        <div class="data_header">
          <div class="data_title">广告活动TOP10花费（昨日）</div>
        </div>
        <div v-show="activityStatus===1" class="table_con">
          <Table highlight-row stripe
                 :columns="activityCol"
                 :data="activityList"
                 :loading="activityListStatus"
          >
            <!--广告活动的名称-->
            <template slot-scope="{ row }" slot="index">
              <span v-if="row._index<3" :class="'table_rank table_color'+row._index">top{{row._index+1}}</span>
            </template>
            <!--广告活动的名称-->
            <template slot-scope="{ row }" slot="activity_name">
              <p :title="row.campaignname" class="table_name">{{ row.campaignname }}</p>
            </template>
            <!--广告活动的广告展现-->
            <template slot-scope="{ row }" slot="show">
              {{ number2Thousand(row.view) }}
            </template>
            <!--广告活动的花费-->
            <template slot-scope="{ row }" slot="cost">
              {{ number2Thousand(row.report_spend) }}</p>
            </template>
          </Table>
        </div>
        <div v-show="activityStatus===2" class="nodata">
          <p><img src="~@/assets/image/noDatas.png" alt=""></p>
          <p class="no_text">暂无数据</p>
        </div>
      </div>
      <div class="data_detail data_company">
        <div class="data_header">
          <div class="data_title">广告单元TOP10花费（昨日）</div>
        </div>
        <div v-show="unitStatus===1" class="table_con">
          <Table highlight-row stripe
                 :columns="unitCol"
                 :data="unitList"
                 :loading="unitListStatus"
          >
            <!--广告单元的排名-->
            <template slot-scope="{ row }" slot="index">
              <span v-if="row._index<3" :class="'table_rank table_color'+row._index">top{{row._index+1}}</span>
            </template>
            <!--广告活动的名称-->
            <template slot-scope="{ row }" slot="activity_name">
              <p :title="row.ordername" class="table_name">{{ row.ordername }}</p>
            </template>
            <!--广告活动的广告展现-->
            <template slot-scope="{ row }" slot="show">
              {{ number2Thousand(row.view) }}
            </template>
            <!--广告活动的花费-->
            <template slot-scope="{ row }" slot="cost">
              {{ number2Thousand(row.report_spend) }}
            </template>
          </Table>
        </div>
        <div v-show="unitStatus===2" class="nodata">
          <p><img src="~@/assets/image/noDatas.png" alt=""></p>
          <p class="no_text">暂无数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import {getDataEffectData} from '@/api/data'
  import {getHomeBaseApi} from '@/api/common'
  import {monetFormat, getDayTime, getYesterdayTime, formatDate, number2Thousand} from '@/libs/tools'
  import {inPageAccess} from '@/mixin/in-page-access.js'
  import {getUnitCols, getActivityCols} from './data'
  import {showTitle, dataType} from '@/libs/util'

  export default {
    mixins: [inPageAccess],
    data() {
      return {
        dataTime: 1,
        activityListStatus: true,
        unitListStatus: true,
        contrast: false,
        lineColor: ['#0AB9DE', '#8743F8'],
        lineStatus: 2,
        mediaEchartX: '',
        mediaEchartY: '',
        echartsMediaTarget: [],
        mediaPieStatus: 2,
        companyPieStatus: 2,
        sumData: {},
        lineData: {},
        myChart: null,
        search_type: 1, // 选择媒体预算位
        activityStatus: 1,
        unitStatus: 1,
        activityCol: getActivityCols(this),
        activityList: [],
        unitCol: getUnitCols(this),
        unitList: [],
        search: {
          startsTime: '',
          YesterdayTime: '',
          lastTime: '',
          data7Time: ''
        },
        key: {
          time: ''
        },
        keyDataList: [{}],
        sumAccountData: {},
        unitSumView: 0,
        unitSumCost: 0,
        activityView: 0,
        activityCost: 0
      }
    },
    created() {
      // 从登录页面跳转到首页，此时需要加入路由[length = 0] 的判断，默认去第一条
      // let _menu = this.$store.getters.menuList

      // if (_menu.length && _menu[0].children.length && _menu[0].name !== 'home') {
      //   // 此处相当于做了一个中间件跳转
      //   this.$router.replace({name: _menu[0].children[0].name})
      // } else {
      //   if (this._hasPageAccess()) {
      //
      //   }
      // }
      this.commonData() // 获取全部的总数
      this.setDataTime() // 所有时间的获取
      this.getKeyList() // 获取广告关键指标
      this.gainLineData() // 获取折线图
      this.getUnitTopList() // 获取广告单元的前10
      this.getActivityTopList() // 获取广告活动的前10
      // this.getYesterdaySum() // 获取昨天总计数
      this.getHomeData() // 获取账户统计信息
    },
    methods: {
      viewData() {
        // eslint-disable-next-line standard/object-curly-even-spacing
        this.$router.push({name: 'traffic-data'})
      },
      setDataTime() {
        let curTime = new Date()
        let dayTime = formatDate(curTime, 'yyyy-MM-dd')
        let YesterdayTime = getYesterdayTime(dayTime)
        let lastTime = getYesterdayTime(YesterdayTime)
        let data7Time = formatDate(curTime.getTime() - 3600 * 1000 * 24 * 7, 'yyyy-MM-dd')
        this.search.startsTime = dayTime
        this.search.YesterdayTime = YesterdayTime
        this.search.lastTime = lastTime
        this.search.data7Time = data7Time
        this.key.time = dayTime
      },
      keyTimeChange(val) {
        if (val === 1) {
          this.key.time = this.search.startsTime
        } else if (val === 2) {
          this.key.time = this.search.YesterdayTime
        } else if (val === 3) {
          this.key.time = this.search.lastTime
        }
        this.getKeyList()
      },
      // 获取首页面汇总的内容
      getHomeData() {
        getHomeBaseApi().then(res => {
          if (res.code === 200) {
            this.sumAccountData = res.data
          }
        })
      },

      // 获取数据的同比值
      getProportion(curVal, preVal) {
        if (!!curVal && !!preVal && !isNaN(curVal)) {
          let result = Math.round(((curVal - preVal) / Math.abs(preVal)) * 100)
          return Math.abs(result) < 1 ? 0 : result
        } else {
          return 0
        }
      },
      number2Thousand(number) {
        return number2Thousand(number)
      },
      /**
       * [getHomeDevInfo 获取的广告关键性指标
       * @return {[type]} [description]
       */
      getKeyList() {
        let data = {}
        data.start_date = this.key.time
        data.end_date = this.key.time
        data.group = 'date'
        getDataEffectData(data).then(curRes => {
          if (curRes.code === 200) {
            let objs = {}
            objs.start_date = getYesterdayTime(this.key.time)
            objs.end_date = getYesterdayTime(this.key.time)
            objs.group = 'date'
            getDataEffectData(objs).then(preRes => {
              if (preRes.code === 200) {
                this.keyDataMatch(curRes.data.list, preRes.data.list)
              }
            })
          }
        })
      },
      /**
       * [tableDataMatch 当前数据和前一小时的数据匹配]
       * @param  {[type]} curArr [description]
       * @param  {[type]} preArr [description]
       * @param  {[type]} group [作为聚合条件]
       * @return {[type]}        [description]
       */
      keyDataMatch(curArr, preArr, group) {
        // 唯一性匹配条件
        // 1. 根据group匹配数据

        let tempArr = []
        curArr.map(item => {
          preArr.map(child => {
            item['pre'] = child
          })
          tempArr.push(item)
        })

        // 耦合前一天的数据
        tempArr.map(item => {
          for (let key in item) {
            if (dataType(item[key]) === 'number') {
              // 初始设置为0
              item[key + '_pre'] = 0
              item[key + '_sequential'] = 0

              let curVal = item[key]

              if (item.pre) {
                let preVal = item['pre'][key]
                item[key] = this.number2Thousand(item[key])
                item[key + '_pre'] = this.number2Thousand(item['pre'][key])
                item[key + '_seq'] = this.getProportion(curVal, preVal)
              }
            }
          }
        })
        tempArr.length > 0 ? this.keyDataList = tempArr : this.keyDataList = [{}]
      },
      /**
       * [getHomeDevInfo 获取首页基本数据]
       * @return {[type]} [description]
       */
      commonData() {
        let _dspTableDataList = this.$store.state.app.dspTableDataList
        let chartArr = _dspTableDataList.filter(item => {
          return item.effectDayChart
        })

        this.echartsMediaTarget = chartArr
        this.contrast = true
        this.mediaEchartX = this.echartsMediaTarget[0].key
        this.mediaEchartY = this.echartsMediaTarget[1].key
      },
      /**
       * [getHomeLine 获取线状图数据]
       * @return {[type]} [description]
       */
      gainLineData() {
        let data = {}
        data.start_date = this.search.data7Time
        data.end_date = this.search.startsTime
        data.group = 'date'
        data.order = 'date asc'
        getDataEffectData(data).then(res => {
          if (res.code === 200) {
            this.getData(res)
          }
        })
      },
      /**
       * [getUnitTopList 获取广告单元的top10]
       * @return {[type]} [description]
       */
      getUnitTopList() {
        let data = {}
        this.unitListStatus = true
        data.start_date = this.search.YesterdayTime
        data.end_date = this.search.YesterdayTime
        data.group = 'orderid'
        data.order = 'report_spend desc'
        getDataEffectData(data).then(res => {
          if (res.code === 200) {
            let list = res.data.list
            if (list.length > 0) {
              let data = []
              let unitSumView = 0
              let unitSumCost = 0
              list.map((item, index) => {
                if (index < 10) {
                  unitSumView += parseInt(item.view)
                  unitSumCost += parseFloat(item.report_spend)
                }
                index < 10 ? data.push(item) : ''
              })
              this.unitSumView = unitSumView
              this.unitSumCost = unitSumCost
              list.length > 10 ? this.getYesterdaySum(1, data) : this.unitList = data
              list.length < 11 ? this.unitListStatus = false : ''
              this.unitStatus = 1
            } else {
              this.unitStatus = 2
              this.unitListStatus = false
            }
          } else {
            this.unitStatus = 2
            this.unitListStatus = false
          }
        })
      },
      /**
       * [getHomeLine 获取广告单元的其他的数据]
       * @return {[type]} [description]
       */
      getYesterdaySum(type, obj) {
        let data = {}
        data.start_date = this.search.YesterdayTime
        data.end_date = this.search.YesterdayTime
        data.group = 'date'
        getDataEffectData(data).then(res => {
          type === 1 ? this.unitListStatus = false : this.activityListStatus = false
          if (res.code === 200) {
            let sumData = res.data.list[0]
            let data = []
            data = obj
            let other = {}
            other.ordername = '其他'
            other.campaignname = '其他'
            other.view = type === 1 ? parseInt(sumData.view) - parseInt(this.unitSumView) : parseInt(sumData.view) - parseInt(this.activityView)
            other.report_spend = type === 1 ? parseFloat(sumData.report_spend) - parseFloat(this.unitSumCost) : parseFloat(sumData.report_spend) - parseFloat(this.activityCost)
            data.push(other)
            type === 1 ? this.unitList = data : this.activityList = data
          }
        })
      },

      /**
       * [getHomeLine 获取广告活动的top10]
       * @return {[type]} [description]
       */
      getActivityTopList() {
        let data = {}
        this.activityListStatus = false
        data.start_date = this.search.YesterdayTime
        data.end_date = this.search.YesterdayTime
        data.group = 'campaignid'
        data.order = 'report_spend desc'
        getDataEffectData(data).then(res => {
          if (res.code === 200) {
            let list = res.data.list
            if (list.length > 0) {
              let data = []
              let activityView = 0
              let activityCost = 0
              list.map((item, index) => {
                if (index < 10) {
                  activityView += parseInt(item.view)
                  activityCost += parseFloat(item.report_spend)
                }
                index < 10 ? data.push(item) : ''
              })
              this.activityView = activityView
              this.activityCost = activityCost
              list.length > 10 ? this.getYesterdaySum(2, data) : this.activityList = data
              list.length < 11 ? this.activityListStatus = false : ''
              this.activityStatus = 1
            } else {
              this.activityStatus = 2
              this.activityListStatus = false
            }
          } else {
            this.activityStatus = 2
            this.activityListStatus = false
          }
        })
      },

      // 折线图的提示
      getData(data) {
        let list = data.data.list
        if (list.length > 0) {
          this.lineStatus = 2
          let obj = {}
          let _list = list
          _list.map(item => {
            for (let key in item) {
              let temp = obj[key] ? obj[key] : []
              obj[key] = temp.concat(item[key])
            }
          })
          this.lineData = obj
          this.initMoniter()
        } else {
          this.lineStatus = 1
        }
      },
      initMoniter() {
        this.myChart = echarts.init(document.getElementById('dataTrend'))
        let preValueItem = {}
        let nextValueItem = {}
        let selectArr = this.echartsMediaTarget
        let preValue = this.mediaEchartX
        let nextValue = this.mediaEchartY
        selectArr.map(item => {
          if (item.key === preValue) {
            preValueItem = item
          }

          if (item.key === nextValue) {
            nextValueItem = item
          }
        })
        // y
        let _yAxis = [
          {
            type: 'value',
            name: `${preValueItem.title}(${preValueItem.unit})`,
            axisLine: {
              show: false,
              lineStyle: {
                color: this.lineColor[0]
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: this.lineColor[0]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F2F4F3'
              }
            }
          }
        ]
        // y -value
        let _series = [{
          data: this.lineData[preValue],
          name: preValueItem.title,
          type: 'line'
        }]

        if (!!nextValue && this.contrast) {
          _yAxis.push({
            type: 'value',
            name: `${nextValueItem.title}(${nextValueItem.unit})`,
            axisLine: {
              show: false,
              lineStyle: {
                color: this.lineColor[1]
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: this.lineColor[1]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F2F4F3'
              }
            }
          })

          _series.push({
            data: this.lineData[nextValue],
            name: nextValueItem.title,
            yAxisIndex: 1,
            type: 'line'
          })
        }
        this.myChart.clear()
        // 基于准备好的dom，初始化echarts实例
        // 绘制图表
        this.option = {
          color: this.lineColor,
          tooltip: {
            trigger: 'axis',
            backgroundColor: '#ffffff', // 设置背景图片 rgba格式
            boxShadow: '0px 0px 9px 0px ;',
            borderRadius: 4,
            padding: 15,
            extraCssText: 'box-shadow: 0 0 9px rgba(0, 0, 0, 0.1);',
            textStyle: {
              color: '#333333',
              fontSize: 12
            },
            formatter: function (params) {
              // 系列
              let html = '<p style="padding-bottom:10px;border-bottom: 1px solid #E5E5E5;margin-bottom: 10px">' + params[0].name + '</p>'

              for (var i = 0; i < params.length; i++) {
                // 获取每个系列对应的颜色值
                html += '<p style="line-height: 25px"><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:' + params[i].color + ';"></span>'
                html += params[i].seriesName + ': ' + number2Thousand(params[i].value) + '(' + (i == 0 ? preValueItem.unit : (nextValueItem.unit || '')) + ')</p>'
              }
              return html
            }
          },
          grid: {
            left: '9%',
            right: '9%',
            bottom: '7%',
            top: '10%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.lineData.date,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#F1F3F3',
                type: 'solid'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#656565'
              }
            }
          },
          yAxis: _yAxis,
          series: _series
        }
        this.myChart.setOption(this.option)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .revence-main {
    .main_info {
      display flex
      justify-content space-between
      margin-bottom 10px

      .boxShadow {
        background: #FFFFFF;
        box-shadow: 0px 3px 5px 0px rgba(24, 45, 66, 0.05);
        border-radius: 4px;
      }

      .info_left {
        .info_title {
          width 376px
          height: 100px;
          margin-bottom 10px
          display flex
          position relative

          .info_img {
            img {
              max-height 100px
            }
          }

          .info_message {
            width 220px

            p {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .company {
              font-size 22px
              color #333333
              font-weight bold
              margin-top 20px
            }

            .infoID {
              font-size 14px
              color #999999
              margin-top 10px
            }
          }

          .embellish {
            position absolute
            width 12px
            bottom -28px

            &.info_front {
              left 13px
            }

            &.info_after {
              right 13px
            }
          }
        }

        .info_data {
          width 376px
          height: 130px;

          .account {
            display flex
            justify-content space-between
            .line{
              display inline-block
              width 1px
              height: 66px;
              margin-top 30px
              background: #EBEBEB;
            }
            .account_list {
              width 50%
              margin-top 30px
              padding-left 25px
              color #333333
              .account_title {
                font-size 14px
              }

              .account_line {
                display inline-block
                width: 16px;
                height: 6px;
                background: #49B7ED;
                border-radius: 3px;
                margin 5px 0
              }

              .account_num {
                font-size 22px
                font-family: 'DIN'
                font-weight bold
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

          }
        }
      }

      .info_right {
        width 786px
        height: 240px;

        .right_title {
          display flex
          padding 20px 25px 0px
          justify-content space-between

          .title {
            font-size 16px
            font-weight bold
            color #333333
          }
        }

        .right_list {
          display flex
          flex-wrap: wrap;

          .data_list {
            width 33%
            display: flex;
            margin-top 32px
            box-sizing content-box
            position relative
            .data_icon {
              margin-left 25px
              margin-right 8px

              img {
                height 40px
              }
            }

            .data_text {
              .title {
                font-size 12px
                color #666666
                line-height 18px

                .up_scale {
                  color #32AC54
                }

                .down_scale {
                  color #D81B1B
                }
              }

              .num {
                font-family: 'DIN'
                font-size 20px
                color #333333
                font-weight bold
                line-height 25px
              }
            }
          }
          .after_line{
            position relative
            .line{
              position absolute
              right:0px
              top:10px
              display inline-block
              width 1px
              height: 25px;
              background: #EBEBEB;
            }
          }
        }
      }
    }

    .mon-card {
      min-height 550px
      .echarts_title {
        height 40px
        line-height 40px
        display flex
        justify-content space-between

        .title_header {
          font-size: 16px;
          font-weight: bold;
          color: #333333;
        }

        .title_active {
          font-size: 12px;
          font-weight: 400;
          color: #3F83F7;
          margin-left 20px
        }
      }

      .echatrs_select {
        text-align center
        margin 15px 0
      }
    }

    .echart-content {
      margin-top: 10px
      height: 400px
      width 1130px
    }

    .no_data {
      width: 100%
      height: 350px
      padding-top 100px
      text-align center

      .no_text {
        color: #999999
        font-size 14px
        margin-top 20px
      }
    }

    /deep/ .echatrs_select {
      .ivu-select-selection {
        border 0px
      }

      .ivu-checkbox-wrapper {
        font-size 12px
        color #999999
      }
      /deep/ .left{
        /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
          position relative

          &:before {
            content ''
            position absolute
            left:6px
            top:15px
            width: 10px;
            height: 3px;
            background: #0AB9DE;
            border-radius: 2px;
          }
        }
      }
     /deep/ .right{
        /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
          position relative

          &:before {
            content ''
            position absolute
            left:6px
            top:15px
            width: 10px;
            height: 3px;
            background: #8743F8;
            border-radius: 2px;
          }
        }
      }

      .select_check {
        .ivu-checkbox-checked .ivu-checkbox-inner {
          border-color #465CFE
          background #FFFFff
        }

        .ivu-checkbox-checked .ivu-checkbox-inner:after {
          border-color #465CFE
        }

        &.ivu-checkbox-wrapper-checked {
          color #465CFE
        }
      }
    }

    .data_show {
      display flex
      justify-content space-between
      margin-top 10px
      margin-bottom 10px
      height 500px

      .data_detail {
        width 50%
        background: #FFFFFF;
        padding 15px 25px

        &.data_media {
          margin-right 5px
        }

        &.data_company {
          margin-left 5px
        }

        .data_header {
          height 40px
          line-height 40px
          display flex
          justify-content space-between
          margin-bottom 6px
          .data_title {
            color #333333
            font-size 16px
            font-weight bold
          }
        }

        .nodata {
          width: 100%
          padding-top 125px
          text-align center
          margin-bottom 100px

          .no_text {
            color: #999999
            font-size 14px
            margin-top 20px
          }
        }

        /deep/ .table_con {
          margin-bottom 10px
          .ivu-table .ivu-table-cell{
            padding 0px
          }
          .table_name{
            width 210px
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .table_rank {
            display inline-block
            width: 37px;
            height: 16px;
            text-align: center;
            line-height: 16px;
            font-size 10px
            font-weight bold
            color #ffffff
            border-radius: 6px 0px 6px 0px;

            &.table_color0 {
              background: linear-gradient(0deg, #FF3583, #FF77A1);
            }

            &.table_color1 {
              background: linear-gradient(0deg, #5C2AFF, #A083FE);
            }

            &.table_color2 {
              background: linear-gradient(0deg, #0DBFE5, #22E3FF);
            }
          }

          div.ivu-card-body {
            padding: 0;
          }

          div.ivu-table-wrapper {
            border: none;
          }

          .ivu-table:before {
            content: '';
            width: 100%;
            height: 0px;
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 1
          }

          .ivu-table:after {
            content: '';
            width: 0px;
            height: 100%;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 3
          }

          .ivu-table th, .ivu-table td {
            height 35px
            line-height 35px
            color #666666
            font-size 12px
            border-bottom 0px
          }

          ivu-table-row-highlight td, .ivu-table-stripe .ivu-table-body tr.ivu-table-row-highlight:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr.ivu-table-row-highlight:nth-child(2n) td, tr.ivu-table-row-highlight.ivu-table-row-hover td {
            background-color #ebf7ff !important
          }

          .ivu-table-stripe .ivu-table-body tr:nth-child(2n) td, .ivu-table-stripe .ivu-table-fixed-body tr:nth-child(2n) td {
            background-color: #FBFBFB
          }

          tr.ivu-table-row-hover td {
            background-color #ebf7ff !important
          }

          .ivu-table-header thead tr th {
            padding 0px
            background: #F2F4FF;
            color #333333
            font-weight bold
          }
        }

      }
    }
  }

</style>
