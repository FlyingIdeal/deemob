<template>
  <div class="page-main">
    <div class="matter-header">
      <slot name="tab"></slot>
      <Button type="text" :loading="submitClock" @click="downStatement">
        <i class="iconfont icon-download"></i>
        <span v-if="!submitClock">下载报表</span>
        <span v-else>下载中...</span>
      </Button>
    </div>
    <div class="search-line" ref="search-line" style="margin-top:10px">
      <DatePicker class="i-margin-right-11 i-width-date" :clearable="false" type="daterange" :transfer="true"
                  :value="datePickerTime" :options="datePickerDisabled" format="yyyy-MM-dd" placeholder="请选择日期"
                  @on-change="datePickerChange"/>

      <Select
        class="i-margin-right-11 i-width-select"
        filterable
        multiple
        :max-tag-count="1"
        v-model="filterSearch.material_group_ids"
        :max-tag-placeholder="limitText"
        :transfer="true"
        placeholder="请输入素材组或ID">
        <Option v-for="item in groupSearchList" :value="item.id" :key="'天搜索组'+item.id">{{ item.material_group_name }}({{ item.id }})</Option>
      </Select>

      <Select
        class="i-margin-right-11 i-width-select"
        filterable
        multiple
        :max-tag-count="1"
        v-model="filterSearch.material_tag_ids"
        :max-tag-placeholder="limitText"
        :transfer="true"
        placeholder="请输入标签或ID">
        <Option v-for="item in tagSearchList" :value="item.id" :key="'天搜索标签'+item.id">{{ item.material_tag_name }}({{ item.id }})</Option>
      </Select>

      <Input
        type="textarea"
        class="i-margin-right-11 i-width-input-long mar-bot-10"
        v-model.trim="filterSearch.material_name_textarea"
        :rows="1"
        :autosize="{maxRows:1, minRows: 1}"
        placeholder="输入素材名称,多个用逗号隔开"
      />

      <Input
        type="textarea"
        class="i-margin-right-11 i-width-input-long mar-bot-10"
        v-model.trim="filterSearch.material_id_textarea"
        :rows="1"
        :autosize="{maxRows:1, minRows: 1}"
        @on-keyup="filterSearch.material_id_textarea = filterSearch.material_id_textarea.replace(/[\u4E00-\u9FA5]|[A-Za-z]/g,'')"
        placeholder="输入素材ID,多个用逗号隔开"
      />
      <div class="searchData mar-bot-10 i-margin-right-11">
        <Select v-model="filterSearch.viewType" :transfer="true" style="width: 120px">
          <Option :value="1">广告展现大于</Option>
          <Option :value="2">广告展现小于</Option>
          <Option :value="3">广告展现介于</Option>
        </Select>
        <div class="middle" v-if="filterSearch.viewType ===3 ">
          <InputNumber v-model="filterSearch.viewMin" size="small" :min="0" style="width: 80px"/>
          <span class="middle_text"> ~ </span>
          <InputNumber v-model="filterSearch.viewMax" size="small" :min="0" style="width: 80px"/>
        </div>
        <div class="number" v-else style="display: inline-block">
          <InputNumber v-model="filterSearch.viewNum" :min="0" style="width: 200px"/>
        </div>
      </div>
      <div class="searchData mar-bot-10 i-margin-right-11">
      <Select v-model="filterSearch.clickType" :transfer="true" style="width: 120px">
        <Option :value="1">广告点击大于</Option>
        <Option :value="2">广告点击小于</Option>
        <Option :value="3">广告点击介于</Option>
      </Select>
        <div class="middle" v-if="filterSearch.clickType ===3 ">
          <InputNumber v-model="filterSearch.clickMin" size="small" :min="0" style="width: 80px"/>
          <span class="middle_text"> ~ </span>
          <InputNumber v-model="filterSearch.clickMax" size="small" :min="0" style="width: 80px"/>
        </div>
        <div class="number" v-else style="display: inline-block">
          <InputNumber v-model="filterSearch.clickNum" :min="0" style="width: 200px"/>
        </div>
    </div>
      <div class="searchData mar-bot-10 i-margin-right-11">
        <Select  v-model="filterSearch.ctrType" :transfer="true" style="width: 120px">
          <Option :value="1">点击率大于</Option>
          <Option :value="2">点击率小于</Option>
          <Option :value="3">点击率介于</Option>
        </Select>
        <div class="middle" v-if="filterSearch.ctrType ===3 ">
          <InputNumber v-model="filterSearch.ctrMin" size="small" :min="0" style="width: 80px"/>
          <span class="middle_text"> ~ </span>
          <InputNumber v-model="filterSearch.ctrMax" size="small" :min="0" style="width: 80px"/>
        </div>
        <div class="number" v-else style="display: inline-block">
          <InputNumber v-model="filterSearch.ctrNum" :min="0" style="width: 200px"/>
        </div>
      </div>
      <Button class="search mar-bot-10" @click="doFilterList">搜索</Button>
    </div>
    <!-- table数据 -->
    <div class="data-table console-table">
      <Table :loading="tableLoadFlag" border stripe :columns="tableColList" :data="matterDayData"
             show-summary sum-text="总计" :summary-method="handleSummary" @on-sort-change="sortChange"
             :no-data-text="noDataText">
        <!-- 日期-->
        <template slot-scope="{ row }" slot="date">
          <p> {{ row.timestamp | timeFormat('yyyy-MM-dd') }}</p>
        </template>
        <!-- 素材图-->
        <template slot-scope="{ row }" slot="material_link">
          <div class="creative-detail">
            <div class="detail-material">
              <!-- 图片 -->
              <div class="material-inner" v-if="row.material_type === 1">
                <div class="material-column">
                  <img :src="row.material_link">
                  <div class="img-handle">
                    <a href="javascript:void(0)" class="iconfont icon-zoomup" @click="showImg(row, 'photo')"></a>
                  </div>
                </div>
              </div>

              <!-- 视频, video_url, cover_url -->
              <div class="material-inner" v-if="row.material_type === 2">
                <div class="material-column">
                  <video :src="row.material_link" controls="controls">
                    您的浏览器不支持 video 标签。
                  </video>
                  <div class="img-handle">
                    <a href="javascript:void(0)" class="iconfont icon-zoomup" @click="showImg(row, 'video')"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- 素材名称-->
        <template slot-scope="{ row }" slot="material_name">
          <p  :title="row.material_name" >{{row.material_name || '-'}}</p>
        </template>
        <!-- 素材ID-->
        <template slot-scope="{ row }" slot="material_id">
          <p>{{row.material_id || '-'}}</p>
        </template>
        <!-- 素材组-->
        <template slot-scope="{ row }" slot="material_group_name">
          <p  :title="row.material_group_name" >{{row.material_group_name || '-'}}</p>
        </template>
        <!--广告展现-->
        <template slot-scope="{ row }" slot="view">
          {{row.view}}
        </template>
        <!--广告点击pv-->
        <template slot-scope="{ row }" slot="click">
          {{row.click}}
        </template>
        <!--点击率-->
        <template slot-scope="{ row }" slot="ctr">
          {{row.ctr}}%
        </template>
        <!--花费-->
        <template slot-scope="{ row }" slot="report_spend">
          {{row.report_spend}}
        </template>
        <!--千次展现均价-->
        <template slot-scope="{ row }" slot="ecpm">
          {{row.ecpm}}
        </template>
        <!--点击均价-->
        <template slot-scope="{ row }" slot="cpc">
          {{row.cpc}}
        </template>
      </Table>
      <div class="page-center">
        <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage'
              :page-size="pageSize" @on-change="changePage" @on-page-size-change="sizeChange"/>
      </div>
    </div>

    <!-- 点击放大图片或者视频 -->
    <Modal
      v-model="modalFlag"
      :mask-closable="false"
      :width="646"
      :footer-hide="true"
      @on-cancel="modalToggle"
      class-name="vertical-center-modal"
    >
      <div class="modal-inner">
        <img v-if="modalObj.type === 'photo'" :src="modalObj.link">
        <video v-if="modalObj.type === 'video'" :src="modalObj.link" controls="controls">
          您的浏览器不支持 video 标签。
        </video>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {showTitle, dataType, filterBatchQuery} from '@/libs/util'
  import {debounce, throttle, formatDate, number2Thousand, createObjectURL} from '@/libs/tools'
  import {getDownLoadXls, getUcDownLoadXlsApi} from '@/api/common'
  import {getMaterialList, getMaterialListUrl} from '@/api/data'
  import { getMaterialGroupList, getMaterialTagList } from '@/api/tool'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import {inPageAccess} from '@/mixin/in-page-access.js'
  import {matterDayColumns} from '../colList'

  export default {
    mixins: [tableHeight, inPageAccess],
    data() {
      return {
        noDataText: this.$config.noDataText,
        pageSize: 10, // 默认10条
        total_count: 0,
        currentPage: 1,
        modalFlag: false, // 放大图片的弹框
        modalObj: {}, // // 放大图片的样式以及判断
        datePickerTime: null, // 时间选择器
        datePickerDisabled: { // 时间容器，禁止选择时间
          disabledDate(date) {
            let disableData = Date.parse(new Date('2020-12-01 00:00:00'))
            return date.valueOf() >= Date.now() || date.valueOf() < disableData
          }
        },

        filterSearch: { // 筛选条件
          group: ['date', 'material_id'],
          order: null, // 排序
          start_date: null, // 开始日期
          end_date: null, // 结束日期
          material_group_ids: [], // 素材组的信息
          material_tag_ids: [], // 素材标签的ID
          material_names: [], // 素材名称的数组
          material_name_textarea: '', // 素材名称的文本
          material_ids: [], // 素材ID的搜索
          material_id_textarea: '', // 素材ID的文本
          viewType: 1, // 展现的搜索
          viewNum: 0, // 展现的值
          viewMin: 0, // 展现的最小值
          viewMax: 0, // 展现的最大值
          clickType: 1, // 点击的搜索
          clickNum: 0, // 点击的搜值
          clickMin: 0, // 点击的最小值
          clickMax: 0, // 点击的最大值
          ctrType: 1, // 点击率的搜索
          ctrNum: 0, // 点击率的值
          ctrMin: 0, // 点击率的最小值
          ctrMax: 0, // 点击率的最大值
          data_rules: [] // 数据规则数组
        },

        catchGroup: ['date'], // 缓存聚合参数, 默认和filterSearch.group初始状态相同

        groupByArr: [], // 聚合条件，最后下载使用

        navType: 'table', // nav切换, table / echart

        tableColList: matterDayColumns(this),

        matterDayData: [], // 表格数据

        matterDaySummary: [], // 表格数据合计

        tableLoadFlag: true,
        submitClock: false,
        groupSearchList: [], // 素材组的列表
        tagSearchList: [] // 素材标签
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    filters: {
      timeFormat(time, format) {
        return formatDate(time * 1000, format)
      }
    },
    created() {
      this.initData()
    },
    methods: {
      /**
       * [showImg 放大图片]
       * @param  {[type]} row   [description]
       * @param  {[type]} type [显示类型  photo/video]
       * @return {[type]}       [description]
       */
      showImg(row, type) {
        this.modalFlag = !this.modalFlag

        this.modalObj = {
          link: row.material_link,
          type: type
        }
      },
      /**
       * [modalToggle 关闭浮层]
       * @return {[type]} [description]
       */
      modalToggle() {
        this.modalFlag = false

        this.modalObj = {}
      },
      /**
       * [limitText 剩余项数量]
       * @param  {[type]} count [description]
       * @return {[type]}       [description]
       */
      limitText(count) {
        return `${count}+`
      },
      /**
       * [getGroupList 获取素材组的信息]
       * @return {[type]} [description]
       */
      getGroupList() {
        getMaterialGroupList().then(res => {
          if (res.code === 200) {
            let _list = res.data.list || []
            this.groupSearchList = _list
          }
        })
      },
      /**
       * [getTagList 获取素材标签的信息]
       * @return {[type]} [description]
       */
      getTagList() {
        getMaterialTagList().then(res => {
          if (res.code === 200) {
            let _list = res.data.list || []
            this.tagSearchList = _list
          }
        })
      },
      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        this.initDatePickerTime() // 初始化筛选时间
        this.getGroupList() // 获取素材组的列表
        this.getTagList() // 获取素材标签的列表
        this.getMatterDayData() // 获取表格数据
      },
      /**
       * [doFilterList 筛选查询]
       * @return {[type]} [description]
       */
      doFilterList() {
        this.currentPage = 1
        let _filter = this.filterSearch

        // 素材名称的搜索
        this.filterSearch.material_names = filterBatchQuery({value: _filter.material_name_textarea})

        // 素材id的搜索
        this.filterSearch.material_ids = filterBatchQuery({value: _filter.material_id_textarea, type: 'number'})

        // 数据的规则
        let data_rules = []
        // 展现的搜索
        if (_filter.viewType === 1 || _filter.viewType === 2) {
          let symbol = _filter.viewType === 1 ? '>' : '<'
          _filter.viewNum ? data_rules.push('view' + symbol + _filter.viewNum) : ''
        } else {
          if (_filter.viewMax && _filter.viewMin) {
            data_rules.push('view>' + _filter.viewMin)
            data_rules.push('view<' + _filter.viewMax)
          }
        }
        // 点击的搜索
        if (_filter.clickType === 1 || _filter.clickType === 2) {
          let symbol = _filter.clickType === 1 ? '>' : '<'
          _filter.clickNum ? data_rules.push('click' + symbol + _filter.clickNum) : ''
        } else {
          if (_filter.clickMax && _filter.clickMin) {
            data_rules.push('click>' + _filter.clickMin)
            data_rules.push('click<' + _filter.clickMax)
          }
        }
        // 点击率的搜索
        if (_filter.ctrType === 1 || _filter.ctrType === 2) {
          let symbol = _filter.ctrType === 1 ? '>' : '<'
          _filter.ctrNum ? data_rules.push('ctr' + symbol + _filter.ctrNum) : ''
        } else {
          if (_filter.ctrMax && _filter.ctrMin) {
            data_rules.push('ctr>' + _filter.ctrMin)
            data_rules.push('ctr<' + _filter.ctrMax)
          }
        }
        this.filterSearch.data_rules = data_rules
        this.getMatterDayData()
      },

      /**
       * [changePage 改变页码]
       * @param  {[type]} val [description]
       * @return {[type]}   [description]
       */
      changePage(val) {
        this.currentPage = val
        this.getMatterDayData()
      },
      /**
       * [sizeChange 切换每页条数时的回调]
       * @param  {[type]} size [description]
       * @return {[type]}    [description]
       */
      sizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.getMatterDayData()
      },
      /**
       * [getAxiosParams 获取参数]
       * @return {[type]} [description]
       */
      getAxiosParams() {
        let _filter = this.filterSearch

        let params = {
          data_type: 'day',
          material_type: 2, // 素材类型，1=图片，2=视频
          start_timestamp: Date.parse(new Date(_filter.start_date)) / 1000,
          end_timestamp: Date.parse(new Date(_filter.end_date)) / 1000
        }

        // 素材组
        !!_filter.material_group_ids && (params.material_group_ids = _filter.material_group_ids)

        // 素材标签
        !!_filter.material_tag_ids && (params.material_tag_ids = _filter.material_tag_ids)

        // 素材名称
        !!_filter.material_names && (params.material_names = _filter.material_names)

        // 素材ID
        !!_filter.material_ids && (params.material_ids = _filter.material_ids)

        // 运算的文本
        !!_filter.data_rules && (params.data_rules = _filter.data_rules)

        return params
      },
      /**
       * [getMatterDayData 获取表格数据]
       * @return {[type]} [description]
       */
      getMatterDayData() {
        let params = {
          ...this.getAxiosParams(),
          ...{
            group: this.filterSearch.group,
            order: this.filterSearch.order,
            page_num: this.currentPage,
            page_size: this.pageSize
          }
        }

        // 统计只与筛选条件有关，与数据维度无关
        let staticParams = {
          ...this.getAxiosParams(),
          ...{
            group: []
          }
        }

        this.tableLoadFlag = true

        Promise.all([
          getMaterialList(params),
          getMaterialList(staticParams)
        ]).then(res => {
          if (res[0].code === 200) {
            this.total_count = res[0].data.total_count // 总数
            let _list = res[0].data.list ? res[0].data.list : []
            this.matterDayData = this.formatThouData(_list) // 处理千分位
          } else if (res[0].code === 403) {
            this.noDataText = this.$config.noDataTextPer
          }

          if (res[1].code === 200) {
            let _list = res[1].data.list ? res[1].data.list : []
            this.matterDaySummary = this.formatThouData(_list) // 合计.千分位格式化
          }

          this.tableLoadFlag = false
        }, err => {
          this.tableLoadFlag = false
        })
      },
      /**
       * [sortChange 表格的排序]
       * @param  {[type]} col   [description]
       * @param  {[type]} key   [description]
       * @param  {[type]} order [description]
       * @return {[type]}     [description]
       */
      sortChange(col, key, order) {
        if (col.order === 'asc') {
          this.filterSearch.order = col.column.slot
          this.currentPage = 1
          this.getMatterDayData()
        } else if (col.order === 'desc') {
          this.filterSearch.order = col.column.slot + ' ' + col.order
          this.currentPage = 1
          this.getMatterDayData()
        }
      },
      /**
       * [formatThouData 格式化千分位]
       * @param  {[type]} curArr [当前数组]
       * @return {[type]}    [description]
       */
      formatThouData(curArr) {
         if (curArr.length === 0) {
           return curArr
         }
        // 需要计算千分位的数据
        let _calcArr = []
        this.tableColList.map(item => {
          if (item.needCalcThou) {
            _calcArr.push(item.slot)
          }
        })

        // 处理千分位
        curArr.map(item => {
          for (let key in item) {
            if (_calcArr.includes(key) && dataType(item[key]) === 'number') {
              item[key] = this.number2Thousand(item[key])
            }
          }
        })
        return curArr
      },

      /**
       * [handleSummary 总计]
       * @param  {[type]} options.columns [description]
       * @param  {[type]} options.data  [description]
       * @return {[type]}         [description]
       */
      handleSummary({columns, data}) {
        let sumData = this.matterDaySummary[0]
        let sums = {}
        columns.forEach((column, index) => {
          let key = column.slot

          if (key === 'date') {
            sums[key] = {
              key,
              value: '合计'
            }
            return
          }
          sums[key] = {
            key,
            value: !sumData ? '-' : column.title.indexOf('率') > -1 ? `${sumData[key]}%` : (column.needCalcThou ? sumData[key] : '-')
          }
        })
        return sums
      },
      /**
       * [downStatement 下载流量表格]
       * @return {[type]} [description]
       */
      downStatement() {
        let form = {
          ...this.getAxiosParams(),
          ...{
            group: ['date', 'material_id'],
            order: this.filterSearch.order
          }
        }

        let params = {
          method: 'GET',
          platform_id: this.$config.platformId,
          url: getMaterialListUrl(form)
        }

        this.submitClock = true

        getUcDownLoadXlsApi(params).then(res => {
          this.submitClock = false

          if (res.code === 200) {
            let url = res.data.url
            let filename = `${this.filterSearch.start_date}~${this.filterSearch.end_date} 素材报表.xlsx`

            createObjectURL(url, filename)
          }
        })
      },
      /**
       * [getTimeData 筛选-设置时间的默认值 - 默认当天]
       * @return {[type]} [description]
       */
      initDatePickerTime() {
        const curTime = new Date()
        const endDate = formatDate(curTime, 'yyyy-MM-dd') // 当前天
        const startDate = formatDate(curTime.getTime() - 3600 * 1000 * 24 * 7, 'yyyy-MM-dd')

        this.datePickerTime = [startDate, endDate]
        this.filterSearch.start_date = startDate
        this.filterSearch.end_date = endDate
      },

      /**
       * [datePickerChange 时间选择器发生变化]
       * @param  {[type]} time [description]
       * @return {[type]}    [description]
       */
      datePickerChange(time) {
        this.datePickerTime = time
        this.filterSearch.start_date = time[0]
        this.filterSearch.end_date = time[1]
      },
      /**
       * [number2Thousand 数字转千分位]
       * @param  {[type]} val [description]
       * @return {[type]}   [description]
       */
      number2Thousand(number) {
        return number2Thousand(number)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../../data-use.styl'
  @import '../../table.styl'
  @import "../index.styl"
</style>
