<template>
    <div class="page-main">
        <div class="page-title page-has-line">
            <h2 class="title-line-tag">平台{{headTitle}}</h2>
        </div>
        <div class="financial_info">
          <div class="financial_list">
            <div class="financial_icon">
              <div class="icon_bg">
                <img src="~@/assets/image/financial/recharge_left.png" alt="">
              </div>
            </div>
            <div class="financial_test">
              <p class="num">4,752,123,124</p>
              <p class="title">充值额</p>
            </div>
          </div>
          <div class="financial_list profit_list">
            <div class="financial_icon">
              <div class="icon_bg">
                <img src="~@/assets/image/financial/profit_left.png" alt="">
              </div>
            </div>
            <div class="financial_test">
              <p class="num">4,752,123,124</p>
              <p class="title">利润额</p>
            </div>
          </div>
        </div>
        <Card :bordered="false" dis-hover class="has-table-card">
            <div class="search-line" ref="search-line">
              <Input clearable class="i-margin-right-11  mar-bot-10" style="width: 230px" placeholder="请输入代理商名称或ID或公司名称"
                     v-model="filterSearch.search_text"/>
                <Button class="search mar-bot-10" @click="doFilterList()">搜索</Button>
            </div>
            <div class="console-table">
                <Table highlight-row stripe border @on-sort-change="sortChange" :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText">
                    <!--金额-->
                    <template slot-scope="{ row }" slot="action">
                       <Button @click="operate('recharge')" type="text" style="color: #4665FE">充值</Button>
                       <Button @click="operate('refund')" type="text" style="color: #4665FE">退款</Button>
                    </template>

                </Table>
                <div class="page-center">
                    <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
                </div>
            </div>
        </Card>
<!--        充值与退款的弹框-->
      <Drawer class="finalDrawer" v-model="ModalFlag" :scrollable="false"  width="600px" :mask-closable="false" :closable="false" :styles="drawStyles">
        <div class="DrawerTitle" slot="header">
          <div class="title">
             {{finalText}} <span class="balance">当前代理商账户余额:104,123,445元</span>
          </div>
          <div class="title_img">
            <img src="~@/assets/image/colsImg.png" alt="">
          </div>
        </div>
        <div class="finalContent">
          <Form ref="financial" :model="financial" :rules="financialRule" class="audit_content"  label-position="right" :label-colon="true"
                :label-width="90">
            <FormItem  style="width: 100%" class="accountForm" :label="finalText+'金额'" prop="money">
              <span>{{financial.money}}元</span>
              <span class="capital">一百万五千六百一十三</span>
            </FormItem>
            <FormItem  style="width: 100%" class="accountForm" label="备注" prop="remark">
              <Input v-model="financial.remark"  type="textarea"
                     style="height:200px;width: 452px"/>
            </FormItem>

          </Form>
        </div>
        <div class="final-footer">
          <Button @click="ModalFlag = false">取消</Button>
          <Button  class="submit" type="primary" :loading="submitClock" @click="rechargeSubmit('financial')">
            <span v-if="!submitClock">确认{{finalText}}</span>
            <span v-else>{{finalText}}中...</span>
          </Button>
        </div>
      </Drawer>

    </div>
</template>

<script>
import { showTitle } from '@/libs/util'
import { formatDate, createObjectURL, number2Thousand } from '@/libs/tools'
import { tableHeight } from '@/mixin/calc-table-height.js'
import { getFinanceList, getFinanceListUrl } from '@/api/finance'
import { getDetailCols } from '../colList'

export default {
    name: 'financial-manage',
    mixins: [tableHeight],
    data() {
        return {
          finalText: '充值',
          drawStyles: { // 抽屉样式
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: '54px',
            position: 'static'
          },
          financial: {
            remark: '',
            money: 1234
          },
          financialRule: {
            money: [{required: true}]
          },
            ModalFlag: false,
            submitClock: false,
            pageSize: 10, // 页码长度
            total_count: 0,
            currentPage: 1,
            colDatList: [{
              index: 1
            }], // table数据
            tableLoadFlag: false, // table的loading
            noDataText: this.$config.noDataText,

            filterSearch: { // 筛选条件
              search_text: '' // 状态0全部 2充值 3退款 4花费
            },
            tableColList: getDetailCols(this)
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    filters: {
        number2Thousand(val) {
            return number2Thousand(val)
        }
    },
    created() {
        this.initData()
    },
    mounted() {
        // this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': false}) // search-line的高度
    },
    methods: {
        /**
         * [initData 初始化加载数据]
         * @return {[type]} [description]
         */
        initData() {

            // this.getTableList() // 获取表格数据
        },
      /**
       * [operate 操作]
       * @return {[type]} [description]
       */
       operate(type) {
          if (type === 'recharge') {
            this.finalText = '充值'
          } else {
            this.finalText = '退款'
          }
          this.ModalFlag = true
       },
        /**
         * [getFinanceList 获取列表的信息]
         * @return {[type]} [description]
         */
        getTableList() {
            this.tableLoadFlag = true

            getFinanceList({
                page_size: this.pageSize,
                page_num: this.currentPage,
                start_date: this.datePickerTime[0],
                end_date: this.datePickerTime[1],
                detail_type: this.filterSearch.detail_type
            }).then(res => {
                this.tableLoadFlag = false
                if (res.code === 200) {
                    this.colDatList = res.data.list
                    this.total_count = res.data.total_count
                }
            }, err => {
                if (err.code === 403) {
                    this.noDataText = this.$config.noDataTextPer
                }
                this.tableLoadFlag = false
            })
        },
      /**
       * [sortChange 排序]
       * @return {[type]} [description]
       */
      sortChange() {

      },
      /**
       * [recharge 排序]
       * @return {[type]} [description]
       */
      rechargeSubmit() {

      },
        /**
         * [doFilterList 筛选查询]
         * @return {[type]} [description]
         */
        doFilterList(val) {
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
  .financial_info{
    display flex
    justify-content space-between
    margin 20px 0 10px
    .financial_list{
      width 50%
      height: 80px;
      margin-right  5px
      background: linear-gradient(86deg, #1BB8EF, #4993FE);
      box-shadow: 0px 3px 13px 0px rgba(68, 151, 252, 0.39);
      border-radius: 4px;
      display flex
      position relative
      &:before{
        content ''
        width 70px
        height 80px
        background url("~@/assets/image/financial/recharge_after.png") no-repeat center
        position absolute
        background-size cover
        bottom -20px
        right -10px
      }
      &.profit_list{
        background: linear-gradient(86deg, #06CCD9, #02BECB);
        box-shadow: 0px 3px 13px 0px rgba(0, 193, 206, 0.39);
        margin-right 0px
        margin-left 5px
       .financial_icon{
         background rgba(7, 162, 172, 0.2)
         box-shadow: 0px 5px 18px 0px rgba(7, 162, 172, 0.49);
       }
        &:before{
          width 77px
          height 72px
          background url("~@/assets/image/financial/profit_after.png") no-repeat center
          background-size cover
          bottom -15px
          right -8px
        }
      }
      .financial_icon{
        margin 15px 20px
        width 50px
        height 50px
        text-align center
        line-height 50px
        background rgba(47, 125, 213, 0.2)
        box-shadow: 0px 5px 18px 0px rgba(47, 125, 213, 0.49);
        border-radius: 50%;
        .icon_bg{
          width 40px
          height 40px
          background #ffffff
          opacity: 1;
          margin 5px
          border-radius: 50%;
        }
      }
      .financial_test{
        .num{
          margin-top 10px
          font-size: 24px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #FFFFFF;
          text-shadow: 0px 3px 3px rgba(22, 138, 173, 0.21);
        }
        .title{
          font-size 14px
          color #ffffff
        }
      }
    }
  }
  .finalDrawer{
    width 10px
    /deep/ .ivu-drawer-header{
      padding 0px
      .DrawerTitle{
        height 55px
        line-height 55px
        display flex
        justify-content space-between
        background: #FAFAFA;
        box-shadow: 0px 2px 6px 0px rgba(12, 22, 33, 0.05);
        .title{
          padding-left 25px
          font-size  16px
          color #333333
          font-weight bold
          .balance{
             margin-left 20px
             font-size 14px
             color #465CFE
             font-weight normal
          }
        }
        .title_img{
          height 55px
          img{
            max-height 55px
          }
        }
      }

    }
    /deep/ .ivu-drawer-content {
      .ivu-drawer-body {
        padding 25px
        .finalContent{
          .capital{
            margin-left 20px
            color #999999
          }
          textarea.ivu-input{
            width 452px
            height 200px
          }
        }
      }
    }
    .final-footer{
      width: 100%
      position: absolute
      bottom: 0
      left: 0
      padding: 10px 16px
      text-align: center
      background: #fff
      box-shadow: 0px -2px 15px 0px rgba(0, 0, 0, 0.05);
      button{
        margin 0 15px
      }
    }

  }
.mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
