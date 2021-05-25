<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">{{headTitle}}</h2>
      <h6 class="title-small-tips">以下表格数据指标显示当日实时数据</h6>
      <div class="is-handler">
        <Button type="text" class="has-img-icon" @click="batchSetButton">
          <i class="batch is-handler-icon"></i>
          <span>批量设置</span>
        </Button>
        <Button type="text" class="has-img-icon" @click="doColumns">
          <i class="column is-handler-icon"></i>
          <span>自定义列</span>
        </Button>
        <Button @click="toNew()" type="primary" icon="md-add">
          <span>新建广告活动</span>
        </Button>
      </div>
    </div>

    <Card :bordered="false" dis-hover class="has-table-card">
      <div class="search-line" ref="search-line">
        <Select
          class="i-margin-right-11 i-width-select mar-bot-10"
          clearable
          v-model="filterSearch.status"
          :transfer="true"
          placeholder="投放状态">
          <Option v-for="item in putSelect" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
        <Select
          class="i-margin-right-11 i-width-select mar-bot-10"
          clearable
          v-model="filterSearch.internal_verify"
          :transfer="true"
          placeholder="审核状态">
          <Option v-for="item in auditSelect" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
        <Select
          class="i-margin-right-11 i-width-select mar-bot-10"
          clearable
          v-model="filterSearch.freq_vc"
          :transfer="true"
          placeholder="频控类别">
          <Option v-for="item in precontrolSelect" :key="item.value" :value="item.value">{{ item.label }}
          </Option>
        </Select>
        <Input
          type="text"
          clearable
          class="i-margin-right-11 i-width-select mar-bot-10"
          maxlength="100"
          v-model="filterSearch.name_or_id"
          placeholder="请输入广告活动名称或ID"/>
        <Button class="search" @click="doFilterList(1)">搜索</Button>
      </div>
     <div class="batch-line clearfix" v-show="batchStatus">
        <div class="batch-handle fl">
          <div @click="batchSet('start',1)" class="batch-item">
            <i class="play batch-icon"></i>
            <span>开启</span>
          </div>
          <div @click="batchSet('close',1)" class="batch-item">
            <i class="stop batch-icon"></i>
            <span>暂停</span>
          </div>
          <Poptip class="batchPoptip" :transfer="true" placement="bottom-start" width="340" style="z-index:1000" v-model="freq_status">
            <div class="batch-item">
              <i class="freq batch-icon"></i>
              <span>修改频次</span>
            </div>
            <div class="api" slot="content">
              <div class="autoPop_con" style="padding: 20px 9px">
                <Input style="width: 120px" v-model="frepSet"/>
                <span style="margin-right: 12px">次</span>
                <Button style="margin-right: 10px" type="primary" @click="batchSet('frep',2)">保存</Button>
                <Button class="search_bg" @click="freq_status=false">取消</Button>
              </div>
            </div>
          </Poptip>
          <Poptip class="batchPoptip" :transfer="true" placement="bottom-start" width="340" style="z-index:1000" v-model="money_status">
            <div class="batch-item">
              <i class="money batch-icon"></i>
              <span>修改预算额</span>
            </div>
            <div class="api" slot="content">
              <div class="autoPop_con" style="padding: 20px 9px">
                <Input style="width: 120px" v-model="moneySet"/>
                <span style="margin-right: 12px">元</span>
                <Button style="margin-right: 10px"  type="primary" @click="batchSet('money',3)">保存</Button>
                <Button class="search_bg" @click="money_status=false">取消</Button>
              </div>
            </div>
          </Poptip>
        </div>
        <div class="batch-close icon-close fr" @click="batchStatus = false"></div>
      </div>
      <div class="console-table">
        <Table highlight-row stripe border :columns="tableColList" :data="tableDataList" @on-selection-change="selChange" :loading="tableLoadFlag" :no-data-text="noDataText">
          <template slot-scope="{ row }" slot="campaignname">
             <p class="text-row-ellipsis" :title="row.campaignname">{{row.campaignname}}</p>
          </template>
          <!--状态-->
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 1">投放中</span>
            <span v-if="row.status === 0">暂停中</span>
            <i-switch  size="small" :true-value="1" :false-value="0" v-model="row.status" @on-change="changeState(row)"/>
          </template>
          <!--审核状态-->
          <template slot-scope="{ row }" slot="internal_verify">
            <Badge status="warning" v-if="row.internal_verify === 4" text="待审核" />
            <Badge color="#2db7f5" v-if="row.internal_verify === 2" text="部分审核通过" />
            <Badge status="success" v-if="row.internal_verify == 1" text="审核通过" />
            <Badge status="error" v-if="row.internal_verify == 3" text="已拒绝" />
          </template>
          <!--预算额-->
          <template slot-scope="{ row }" slot="budget">
            <span v-if="row.budget_type===0">总预算：</span>
            <span v-if="row.budget_type===1">日预算：</span>
            <span v-if="row.budget === -1">不限</span>
            <span v-else>{{row.budget/100}}元</span>
          </template>
          <!--频控设置-->
          <template slot-scope="{ row }" slot="freq_type">
            <span v-if="row.freq_type===1">按活动</span>
            <span v-if="row.freq_type===0">按单元</span>
          </template>
          <!--频控设置-->
          <template slot-scope="{ row }" slot="freq_vc">
            <div v-if="row.freq_type===1">
              <span v-if="row.freq_vc===0">展现频控</span>
              <span v-if="row.freq_vc===1">点击频控</span>
            </div>
            <div v-else> -</div>
          </template>
          <!--频控设置-->
          <template slot-scope="{ row }" slot="freq">
            <div v-if="row.freq_type===1">
              {{row.freq}}次/<span v-if="row.freq_period===0">时</span>
              <span v-if="row.freq_period===1">天</span>
              <span v-if="row.freq_period===2">月</span>
            </div>
            <div v-else> -</div>
          </template>
          <!--今日花费-->
          <template slot-scope="{ row }" slot="spend_today">
            <p > {{ number2Thousand(row.spend_today) }}元</p>
          </template>
          <!--总花费-->
          <template slot-scope="{ row }" slot="spend">
            <span>{{ number2Thousand(row.spend) }}</span>
          </template>
          <!--广告展现-->
          <template slot-scope="{ row }" slot="view">
            <span>{{ number2Thousand(row.view) }}</span>
          </template>
          <!--广告点击-->
          <template slot-scope="{ row }" slot="click">
            <span>{{ number2Thousand(row.click) }}</span>
          </template>
          <!--点击率-->
          <template slot-scope="{ row }" slot="ctr">
            <span>{{ number2Thousand(row.ctr) }}%</span>
          </template>
          <!--到达数-->
          <template slot-scope="{ row }" slot="reach">
            <span>{{ number2Thousand(row.reach) }}</span>
          </template>
          <!--到达率-->
          <template slot-scope="{ row }" slot="reach_rate">
            <span>{{ number2Thousand(row.reach_rate) }}%</span>
          </template>
          <!--转化数-->
          <template slot-scope="{ row }" slot="action">
            <span>{{ number2Thousand(row.action) }}</span>
          </template>
          <!--转化率-->
          <template slot-scope="{ row }" slot="action_rate">
            <span>{{ number2Thousand(row.action_rate) }}%</span>
          </template>
          <!--千次展现均价-->
          <template slot-scope="{ row }" slot="ecpm">
            <span>{{ number2Thousand(row.ecpm) }}</span>
          </template>
          <!--点击均价-->
          <template slot-scope="{ row }" slot="cpc">
            <span>{{ number2Thousand(row.cpc) }}</span>
          </template>
          <!--创建时间-->
          <template slot-scope="{ row }" slot="createTime">
            <p v-if="row.c_time"> {{ row.c_time }}</p>
            <p v-else> - </p>
          </template>
          <!--修改时间-->
          <template slot-scope="{ row }" slot="updateTime">
            <p v-if="row.m_time"> {{ row.m_time  }}</p>
            <p v-else> - </p>
          </template>
          <template slot-scope="{ row }" slot="operate">
            <div class="action-handle">
              <Button :to="toDetail(row)" type="text" title="编辑" custom-icon="icon-edit"></Button>
              <Button :to="toEffectDay(row.campaignid)" type="text" title="数据" custom-icon="icon-data"></Button>
              <Button :to="toCopy(row)"  type="text" title="复制" custom-icon="icon-copy-items"></Button>
            </div>
          </template>
        </Table>
        <div class="page-center">
          <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage'
                :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
        </div>
      </div>
    </Card>

    <!--自定义列-->
    <custom-column ref="customColumn" :datalist="catchTableColList" @on-change="columnChange"></custom-column>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import {getActiveCols} from '../colList'
  import {formatDate, number2Thousand} from '@/libs/tools'
  import {columnFn} from '@/mixin/custom-column.js'
  import customColumn from '@/components/local-custom-column/custom-column' // 自定义列
  import {getAdCampaignList, editCampaign, batchCampaign} from '@/api/advertising'

  export default {
    name: 'financial-manage',
    mixins: [tableHeight, columnFn],
    components: {customColumn},
    data() {
      return {
        noDataText: this.$config.noDataText,
        kaiImgStatus: 1,
        stopImgStatus: 1,
        deleteImgStatus: 1,
        moneyImgStatus: 1,
        frepImgStatus: 1,
        colImgStatus: 1,
        setImgStatus: 1,
        freq_status: false,
        money_status: false,
        frepSet: '',
        moneySet: '',
        batchStatus: false,
        submitClock: false,
        pageSize: 10,
        total_count: 0,
        currentPage: 1,
        putSelect: [ // 投放状态筛选的下拉
          {value: 1, label: '投放中'},
          {value: 0, label: '暂停中'}
          // {value: 3, label: '已删除'},
        ],
        auditSelect: [ // 审核状态筛选的下拉
          {value: 1, label: '审核通过'},
          {value: 2, label: '部分审核通过'},
          {value: 3, label: '已拒绝'},
          {value: 4, label: '待审核'}
        ],
        precontrolSelect: [ // 频控类别筛选的下拉
          {value: 0, label: '展现频控'},
          {value: 1, label: '点击频控'}
        ],
        datePickerTime: [], // 时间选择器
        filterSearch: { // 筛选条件
          name_or_id: '',
          status: '',
          internal_verify: '',
          freq_vc: ''
        },
        tableLoadFlag: true,
        tableDataList: [],
        catchTableColList: getActiveCols(this),
        selectID: [] // 选中的ID
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
    activated() {
      this.$Bus.$off('editEmitEvent')
      this.$Bus.$on('editEmitEvent', (msg) => {
        this.getTableList()
      })
    },
    created() {
      this.getTableColumns()
      this.initData()
    },
    mounted() {
      // this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': false}) // search-line的高度
    },
    methods: {
      number2Thousand(number) {
        return number2Thousand(number)
      },
      /**
       * [mouseOver 鼠标移入移出]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
      mouseOver(type, num) {
        num === 1 && type === 'kaiImgStatus' ? this.kaiImgStatus = 2 : this.kaiImgStatus = 1
        num === 1 && type === 'stopImgStatus' ? this.stopImgStatus = 2 : this.stopImgStatus = 1
        num === 1 && type === 'deleteImgStatus' ? this.deleteImgStatus = 2 : this.deleteImgStatus = 1
        num === 1 && type === 'moneyImgStatus' ? this.moneyImgStatus = 2 : this.moneyImgStatus = 1
        num === 1 && type === 'frepImgStatus' ? this.frepImgStatus = 2 : this.frepImgStatus = 1
        num === 1 && type === 'setImgStatus' ? this.setImgStatus = 2 : this.setImgStatus = 1
        num === 1 && type === 'colImgStatus' ? this.colImgStatus = 2 : this.colImgStatus = 1
      },
      /**
       * [batchSet 批量设置]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
      batchSetButton() {
         this.selectID.length > 0 ? this.batchStatus = true : this.$Message.warning('请选择对应的设置的广告活动')
      },
      batchSet(type, num) {
        let obj = {}
        obj.campaign_id_arr = this.selectID
        let title = ''
        type === 'start' ? obj.status = 1 : type === 'close' ? obj.status = 0 : ''
        type === 'start' ? title = '确定批量开启' : type === 'close' ? title = '确定批量暂停' : ''
        if (type === 'frep') {
          let frepSet = this.frepSet
          if (!frepSet || frepSet < 1 || frepSet > 10000 || frepSet % 1 !== 0) {
            this.$Message.error('频次必须是大于0小于等于10000的整数')
            return
          } else {
            obj.freq = Number(this.frepSet)
            title = '确定批量修改频次'
          }
        }
        if (type === 'money') {
          let budget = this.moneySet
          if (budget < 0 || budget > 100000000 || !/^\d+(\.\d{1,2})?$/.test(budget)) {
            this.$Message.error('预算额大于0小于等于1亿，最多可填2位小数')
            return
          } else {
            obj.budget = Number(this.moneySet) * 100
            title = '确定批量修改预算额'
          }
        }

        num === 2 ? this.freq_status = false : num === 3 ? this.money_status = false : ''
        this.$Modal.confirm({
          title: title,
          onOk: () => {
            batchCampaign(obj).then(res => {
              this.selectID = []
              this.frepSet = ''
              this.moneySet = ''
              if (res.code === 200) {
                this.$Message.success('操作成功')
                this.getTableList()
              } else {
                this.$Message.error({content: '操作失败', duration: 3})
                this.getTableList()
              }
              this.batchStatus = false
              num === 2 ? this.freq_status = false : num === 3 ? this.money_status = false : ''
            })
          }
        })
      },
      /**
       * [selChange 获取选中的值]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
      selChange (selection) {
        let o = []
        selection.filter(item => {
          o.push(item.campaignid)
        })
        this.selectID = o
      },
      /**
       * [changeState 切换业务状态]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
      changeState(item) {
        this.$Modal.confirm({
          title: item.status === 1 ? '确定开启广告活动?' : '确定暂停广告活动?',
          content: '',
          onOk: () => {
            editCampaign({campaign_id: item.campaignid, status: item.status}).then(res => {
              if (res.code === 200) {
                this.$Message.success('操作成功')
                item.status = item.status === 1 ? 1 : 0
              } else {
                this.$Message.error({content: '操作失败', duration: 3})
                item.status = item.status === 1 ? 0 : 1
              }
            }, err => {
              item.status = item.status === 1 ? 0 : 1
            })
          },
          onCancel: res => {
            item.status = item.status === 1 ? 0 : 1
          }
        })
      },

      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        this.getTableList() // 获取表格数据
      },
      /**
       * [toNew 新建广告活动]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      toNew(row) {
        if (row && !!row.campaignid) {
          this.$router.push({name: 'activity-edit', query: {campaignid: row.campaignid}})
        } else {
          this.$router.push({name: 'activity-edit'})
        }
      },
      /**
       * [toDetail 详情链接]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      toDetail(row) {
        return `/advertising/activity/edit?campaignid=${row.campaignid}`
      },
      /**
       * [toCopy 复制页面]
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      toCopy(row) {
        return `/advertising/activity/edit?copy_id=${row.campaignid}`
      },
      /**
       * [toEffectDay 跳转到效果数据]
       * @param  {[type]} campaignid [description]
       * @return {[type]}            [description]
       */
      toEffectDay(campaignid) {
        return `/data/effect/day?campaignId=${campaignid}`
      },
      /**
       * [pageNumberChange 翻页的修改]
       * @return {[type]} [description]
       */
      pageNumberChange(val) {
        this.currentPage = val
        this.getTableList()
      },
      /**
       * [pageNumberChange 翻页页数的修改]
       * @return {[type]} [description]
       */
      pageSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.getTableList()
      },

      /**
       * [getAdMaterialList 获取列表的信息]
       * @return {[type]} [description]
       */
      getTableList() {
        this.tableLoadFlag = true
        let obj = {}
        this.filterSearch.status !== '' ? obj.status = this.filterSearch.status : ''
        this.filterSearch.internal_verify !== '' ? obj.internal_verify = this.filterSearch.internal_verify : ''
        this.filterSearch.freq_vc !== '' ? obj.freq_vc = this.filterSearch.freq_vc : ''
        this.filterSearch.name_or_id !== '' ? obj.name_or_id = this.filterSearch.name_or_id : ''
        obj.page_size = this.pageSize
        obj.page_num = this.currentPage
        getAdCampaignList(obj).then(res => {
          this.tableLoadFlag = false
          let data = res.data
          if (res.code === 200) {
            this.total_count = data.total
            data.list ? this.tableDataList = data.list : this.tableDataList = []
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
       * [doFilterList 筛选查询]
       * @return {[type]} [description]
       */
      doFilterList(val) {
        this.currentPage = 1
        this.getTableList()
      }
    },
    /**
     * [beforeRouteLeave 路由跳转]
     * @param  {[type]}   to   [如果路由跳转不是到媒体详情页，则销毁 $Bus]
     * @param  {[type]}   from [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    beforeRouteLeave(to, from, next) {
      if (to.name !== 'activity-edit') {
        this.$Bus.$off('editEmitEvent')
      }
      next()
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .batch-item{
    position relative
    margin-right 20px
    padding-right 20px
    &:before{
       content:''
       display inline-block
       width: 1px;
       height: 10px;
       background: #EBEBEB;
       position absolute
       left -20px
       top:10px
    }
  }
  .is-handler
    .down
      img
        width 16px
        vertical-align middle

      span
        vertical-align middle

  .mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
