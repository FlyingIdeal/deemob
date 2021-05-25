<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">{{headTitle}}</h2>
      <h6 class="title-small-tips">素材组为素材按照推广产品分类，方便数据分析</h6>
      <div class="is-handler">
        <Button type="primary" icon="md-add" @click="toNew()">新建素材组</Button>
        <Button type="text" @click="goBack()">返回 ></Button>
      </div>
    </div>
    <Card :bordered="false" dis-hover class="has-table-card">
      <div class="search-line" ref="search-line">

        <Input class="i-margin-right-11 mar-bot-10 i-width-select" clearable v-model.trim="filterSearch.name_or_id" maxlength="100" placeholder="请输入素材组或ID"/>

        <Button class="search" @click="doFilterList">搜索</Button>
      </div>
      <div class="console-table">
        <Table highlight-row stripe border :columns="tableColList" :data="tableDataList" :loading="tableLoadFlag" :no-data-text="noDataText">

          <!--创意形式-->
          <template slot-scope="{ row }" slot="group_name">
            <div class="hidden_ratio">
              <span>{{row.material_group_name}}</span>
              <Poptip
                confirm
                :transfer="true"
                placement="bottom"
                transfer-class-name="agent-custom-poptip"
                @on-ok="groupOk(row)"
              >
                <i class="iconfont icon-edit"/>
                <div slot="title">
                  <Input  maxlength="30" type="text" v-model.trim="row.material_group_name_change"  />
                </div>
              </Poptip>
            </div>
          </template>
          <!--创建时间-->
          <template slot-scope="{ row }" slot="created_at">
            <p v-if="row.created_at"> {{ row.created_at | timeFormat('yyyy-MM-dd HH:mm:ss') }}</p>
            <p v-else> - </p>
          </template>
          <!--更新时间-->
          <template slot-scope="{ row }" slot="updated_at">
            <p v-if="row.updated_at"> {{ row.updated_at | timeFormat('yyyy-MM-dd HH:mm:ss') }}</p>
            <p v-else> - </p>
          </template>
          <!--操作-->
          <template slot-scope="{ row, index }" slot="handle">
              <Button v-if="row.material_count===0" @click="doDelete(row)" type="text" style="color:#465CFE">删除</Button>
          </template>
        </Table>
        <div class="page-center">
          <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
        </div>
      </div>
    </Card>
    <Drawer v-model="newModalFlag" width="600px" :mask-closable="false" :scrollable="false" :closable="false" :styles="drawStyles" class="custom-drawer">
      <div slot="header" class="draw-header clearfix">
        <div class="draw-header-title fl">
          <h3>新建素材组</h3>
        </div>
        <div class="draw-header-img fr">
          <img src="~@/assets/image/colsImg.png">
        </div>
      </div>
      <Form ref="tagForm" label-position="right" :model="tagForm" :rules="tagFormRules" :label-width="90" :label-colon="true">
        <FormItem label="素材组" prop="group_name">
          <Input v-model.trim="tagForm.group_name" show-word-limit maxlength="30" type="text"  placeholder="请输入素材组，不要超过30个字" />
        </FormItem>
      </Form>
      <div class="drawer-footer">
        <Button @click="newModalFlag=false">取消</Button>
        <Button type="primary" :loading="submitClock" @click="submitForm('tagForm')">
          {{!submitClock ? '保存' : '保存中...'}}
        </Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import { showTitle, regNumCnEnLine } from '@/libs/util'
  import { formatDate } from '@/libs/tools'
  import { getMaterialGroupList, deleteMaterialGroup, addMaterialGroup } from '@/api/tool'
  import { tableHeight } from '@/mixin/calc-table-height.js'
  import { groupColumns } from './colList.js'

  export default {
    name: 'tool-material-group',
    mixins: [tableHeight],
    data() {
      return {
        newModalFlag: false,
        drawStyles: { // 抽屉样式
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          padding: '40px 20px 54px',
          position: 'static'
        },
        pageSize: 10, // 页码长度
        total_count: 0,
        currentPage: 1,
        tableLoadFlag: true, // table的loading
        noDataText: this.$config.noDataText,
        tableDataList: [], // table的数据
        submitClock: false,
        filterSearch: { // 筛选条件
          name_or_id: '' // 请输入素材组或ID
        },
        tagForm: {
          group_name: ''// 新建的素材组
        },
        tagFormRules: {
          group_name: [
            {required: true, message: '请输入素材组'},
            {pattern: regNumCnEnLine, message: '素材组只支持汉字、数字、英文、下划线'}
          ]
        },
        tableColList: groupColumns
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
    activated() {
      this.$Bus.$off('editEmitEvent')
      this.$Bus.$on('editEmitEvent', (msg) => {
        this.getTableList()
      })
    },
    mounted() {
      // this.initTableHeight({'search-line': {isAutoCalc: true, isInclude: true}, 'nav-handle-group': false}) // search-line的高度
    },
    methods: {
      /**
       * [goBack 返回上一页面]
       * @return {[type]} [description]
       */
      goBack() {
        this.$router.back(-1)
      },
      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        this.getTableList() // 获取表格数据
      },
      /**
       * [getCreativeList 获取列表的信息]
       * @return {[type]} [description]
       */
      getTableList() {
        this.tableLoadFlag = true

        let params = {
          page_size: this.pageSize,
          page_num: this.currentPage,
          search_text: this.filterSearch.name_or_id
        }
        getMaterialGroupList(params).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            let _list = res.data.list || []

            _list.map(item => {
              item.material_group_name_change = item.material_group_name
            })
            this.tableDataList = _list
            this.total_count = res.data.total_count
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
       * [doDelete 删除]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
      doDelete(row) {
        this.$Modal.confirm({
          title: '确认删除？',
          onOk: () => {
            deleteMaterialGroup({id: row.id}).then(res => {
              if (res.code === 200) {
                this.$Message.success('删除成功')
                if (this.tableDataList.length === 1) {
                  this.currentPage = 1
                }
                this.getTableList()
              } else {
                this.$Message.error({content: '删除失败', duration: 3})
              }
            })
          }
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
       * [toNew 新建素材组]
       * @param  {[type]} el [description]
       * @return {[type]}    [description]
       */
      toNew() {
        this.newModalFlag = true
        this.$refs['tagForm'].resetFields()
        this.tagForm.group_name = ''
      },
      /**
       * [groupOk 修改素材组]
       * @param  {[type]} el [description]
       * @return {[type]}    [description]
       */
      groupOk(row) {
        let param = {
          name: row.material_group_name_change,
          id: row.id
        }
        addMaterialGroup(param).then(res => {
          if (res.code === 200) {
            this.$Message.success({content: '修改成功', duration: 3})
            this.getTableList()
          }
        })
      },
      /**
       * [submitBannedForm 确认停用]
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      submitForm(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.submitClock = true
            let param = {
              name: this.tagForm.group_name
            }
            addMaterialGroup(param).then(res => {
              this.submitClock = false

              if (res.code === 200) {
                this.newModalFlag = false

                this.$Message.success({ content: '新建成功', duration: 3})
                this.getTableList()
              }
            }, err => {
              this.submitClock = false
            })
          }
        })
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
        this.currentPage = 1
        this.pageSize = size
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
      if (to.name !== 'tool-creative-edit') {
        this.$Bus.$off('editEmitEvent')
      }
      next()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .mar-bot-10
    vertical-align: top
    margin-bottom: 10px

  .hidden_ratio
    display: flex
    align-items: center

    .iconfont
      flex: 0 0 30px
      height: 30px
      line-height: 30px
      text-align: center
      color: #465CFE
      cursor: pointer
      font-size: 12px

    span
      flex: 1
</style>
<style lang="stylus" rel="stylesheet/stylus">

  .agent-custom-poptip
    .ivu-poptip-inner
      display: flex
      padding: 20px
    .ivu-poptip-body
      padding: 0px !important
    .ivu-poptip-body-message
      flex: 0 0 200px
      padding-left: 0px !important
      .ivu-input-number
        width: 200px
    .ivu-poptip-content
      .ivu-icon-ios-help-circle
        display: none
    .ivu-poptip-footer
      padding: 0px !important
      flex: 1
      font-size: 0px
      .ivu-btn
        margin-left: 10px
      .ivu-btn-small
        height: 32px
        padding: 0 15px
        border-radius: 4px
      .ivu-btn-text
        background: #fafafa
        border: 1px solid #ebebeb
        &:hover
          border: 1px solid #465CFE
</style>
