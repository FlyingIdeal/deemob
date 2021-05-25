<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2>账号审核日志</h2>
      <h2 style="margin-left: 18px" class="title_hover" @click="toLink">创意审核日志</h2>
    </div>
    <div class="audit_content">
      <Tabs value="-1" @on-click="changeName">
        <TabPane label="全部" name="-1"/>
<!--        <TabPane label="待审核" name="1"/>-->
        <TabPane label="已通过" name="1"/>
        <TabPane label="已拒绝" name="2"/>
      </Tabs>
      <Card :bordered="false" dis-hover class="has-table-card">

        <div class="search-line" ref="search-line">
          <DatePicker class="i-margin-right-11 i-width-normal mar-bot-10" :value="dateCreateTime" :transfer="true"
                      :options="datePickerDisabled" :clearable="true" format="yyyy-MM-dd" type="daterange"
                      placeholder="创建时间" @on-change="dateCreateChange"/>
          <DatePicker class="i-margin-right-11 i-width-normal mar-bot-10" :value="datePickerTime" :transfer="true"
                      :options="datePickerDisabled" :clearable="true" format="yyyy-MM-dd" type="daterange"
                      placeholder="审核时间" @on-change="datePickerChange"/>
          <Select
            class="i-margin-right-11 i-width-normal mar-bot-10"
            filterable
            clearable
            v-model="filterSearch.account_type"
            placeholder="账号类型">
            <Option v-for="item in accountType" :key="'账号类型'+item.id" :value="item.id">{{ item.value }}</Option>
          </Select>
          <Input clearable class="i-margin-right-11 i-width-normal mar-bot-10" placeholder="请输入账号名称或ID"
                 v-model="filterSearch.search_text"/>
          <Button class="search mar-bot-10" @click="doFilterList(1)">查询</Button>
        </div>
        <div class="console-table">
          <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag"
                 :height="tableHeight">
            <template slot-scope="{ row }" slot="accountId">
              <p v-if="row.account_type === 1">{{row.account_id}}</p>
              <p v-if="row.account_type === 2">{{row.account_id}}</p>
            </template>
            <template slot-scope="{ row }" slot="category_text">
              <p v-if="row.category.category_name"> {{row.category.category_name}}
                <span v-if="row.category_sub.category_name"> - {{row.category_sub.category_name}} </span>
              </p>
              <p v-else>-</p>
            </template>
            <template slot-scope="{ row }" slot="type">
              <p v-if="row.account_type === 1"> 代理商 </p>
              <p v-if="row.account_type === 2"> 广告主 </p>
            </template>
            <template slot-scope="{ row }" slot="company_name">
              <p> {{row.company_name}} </p>
            </template>
            <template slot-scope="{ row }" slot="status">
<!--              <Badge v-if="row.status === 1" color="#F1A32E" text="待审核"/>-->
              <Badge v-if="row.status === 1" color="#67C23A" text="已通过"/>
              <Badge v-if="row.status === 2" color="#F93D3D" text="已拒绝"/>
            </template>
            <template slot-scope="{ row }" slot="status_desc">
              <p class="status_des" :title="row.note" v-if="row.status === 2 && row.note"> {{ row.note }}</p>
              <p v-else> - </p>
            </template>
            <template slot-scope="{ row }" slot="created_at">
              <p> {{row.register_at}} </p>
            </template>
            <template slot-scope="{ row }" slot="verified_at">
              <p> {{ row.created_at }} </p>
            </template>
            <template slot-scope="{ row }" slot="verifier_name">
              <p> {{ row.verifier_name }} </p>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button type="text" @click="toDetail(row,'see')">查看</Button>
            </template>
          </Table>
          <div class="page-center">
            <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage'
                  :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
          </div>
        </div>
      </Card>
    </div>

  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {createObjectURL} from '@/libs/tools'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import {getAccountRecords, getAdvertiserList} from '@/api/audit'
  import {getCategoryList} from '@/api/common'
  import {getAccountReCols} from '../common/colList'

  export default {
    name: 'financial-manage',
    mixins: [tableHeight],
    data() {
      return {
        pageSize: 10, // 页码长度
        total_count: 0,
        currentPage: 1,
        colDatList: [], // table数据
        tableLoadFlag: true, // table的loading
        submitClock: false,
        count: 0, // 全部
        audit_count: 0, // 待审核
        passed_count: 0, // 已通过
        refuse_count: 0, // 已拒绝
        dateCreateTime: [], // 创建时间
        datePickerTime: [], // 投放时间
        tableColList: getAccountReCols(this),
        datePickerDisabled: { // 时间容器，禁止选择时间
          disabledDate(date) {
            let disableData = Date.parse(new Date('2020-11-01 00:00:00'))
            return date.valueOf() >= Date.now() || date.valueOf() < disableData
          }
        },
        accountType: [
          {id: '', value: '全部'},
          {id: 1, value: '代理商'},
          {id: 2, value: '广告主'}
        ],
        filterSearch: { // 筛选条件
          status: '', // 状态值，0待审，1通过，2拒绝, 3被删除
          account_type: '', // 账户类型
          search_text: '' // 搜索文本
        },
        advertiserList: [], // 广告主列表
        categoryList: [] // 行业列表
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },

    created() {
      this.initData()
    },
    mounted() {
      // this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': true}) // search-line的高度
    },
    methods: {
      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        // this.getADList()
        // this.getCategoryListApi()
        this.getTableList() // 获取表格数据
      },
      changeName(val) {
        if (val > -1) {
          this.filterSearch.status = val
        } else {
          this.filterSearch.status = ''
        }
        this.currentPage = 1
        this.getTableList()
      },
      /**
       * [getTimeData 获取广告主列表]
       * @return {[type]} [description]
       */
      // getADList() {
      //   getAdvertiserList().then(res => {
      //     if (res.code === 200) {
      //       this.advertiserList = res.data
      //     }
      //   })
      // },
      toDetail(row, type) {
        this.$router.push({name: 'audit-account-detail',
          query: {
            id: row.id,
            type: type,
            account_type: row.account_type,
            form: 'log'
          }})
      },
      toLink() {
        this.$router.push({name: 'audit-log-creative'})
      },
      /**
       * [getTimeData 获取行业列表]
       * @return {[type]} [description]
       */
      // getCategoryListApi() {
      //   getCategoryList().then(res => {
      //     if (res.code === 200) {
      //       this.categoryList = res.data.list
      //     }
      //   })
      // },
      /**
       * [getTimeData 筛选-设置时间的默认值 - 默认当天]
       * @return {[type]} [description]
       */

      /**
       * [datePickerChange 时间选择器发生变化]
       * @param  {[type]} time [description]
       * @return {[type]}      [description]
       */
      datePickerChange(time) {
        this.datePickerTime = time
      },
      dateCreateChange(time) {
        this.dateCreateTime = time
      },

      /**
       * [getFinanceList 获取列表的信息]
       * @return {[type]} [description]
       */
      getTableList() {
        this.tableLoadFlag = true
        // let obj = this.filterSearch
        let obj = {}
        this.filterSearch.status ? obj.status = this.filterSearch.status : ''
        this.filterSearch.account_type ? obj.account_type = this.filterSearch.account_type : ''
        this.filterSearch.search_text ? obj.name_or_id = this.filterSearch.search_text : ''
        obj.page_size = this.pageSize
        obj.page_num = this.currentPage
        if (this.dateCreateTime[0] && this.dateCreateTime.length > 1) {
          obj.registered_since = this.dateCreateTime[0]
          obj.registered_until = this.dateCreateTime[1]
        }
        if (this.datePickerTime[0] && this.datePickerTime.length > 1) {
          obj.verified_since = this.datePickerTime[0]
          obj.verified_until = this.datePickerTime[1]
        }

        getAccountRecords(obj).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            res.data.list && res.data.list.length > 0 ? this.colDatList = res.data.list : this.colDatList = []
            this.total_count = res.data.total
            this.count = (res.data.wait_check_count) + (res.data.pass_count) + (res.data.reject_count)
            this.audit_count = res.data.wait_check_count
            this.passed_count = res.data.pass_count
            this.refuse_count = res.data.reject_count
          }
        }, err => {
          this.tableLoadFlag = false
        })
      },

      /**
       * [doFilterList 筛选查询]
       * @return {[type]} [description]
       */
      doFilterList() {
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import '../common/index.styl';
  /deep/ .audit_content {
    background #ffffff

    .ivu-tabs-bar {
      margin-bottom 0px
    }
  }
  .title_hover{
    margin-right  10px
    color: #787878
    font-size 16px
    cursor pointer
    &:hover{
      color #465CFE
    }
  }
  .status_des{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
