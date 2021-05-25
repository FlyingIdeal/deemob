<template>
  <div class="page-main">
    <Card :bordered="false" dis-hover>
      <div class="page-title page-has-line clearfix">
        <h2 class="title-line-tag">{{headTitle}}</h2>
        <div class="is-handler">
          <Button v-if="_isShow_('newAddRole')" icon="ios-add" type="primary" @click="toggleFormDraw()">新建角色</Button>
        </div>
      </div>
      <div class="console-table">
        <Table
          highlight-row
          stripe border
          :columns="spendColumns"
          :data="roleList"
          :loading="tableLoadFlag"
          :no-data-text="noDataText"
          :height="tableHeight">
          <!--关联账户-->
          <template slot-scope="{ row }" slot="user_cnt">
            <p> {{ row.user_cnt }}</p>
          </template>
          <!--创建时间-->
          <template slot-scope="{ row }" slot="created_at">
            <p v-if="row.created_at">  {{ row.created_at  | timeFormat('yyyy-MM-dd HH:mm:ss') }}</p>
            <p v-else> - </p>
          </template>
          <!--更新时间-->
          <template slot-scope="{ row }" slot="updated_at">
            <p v-if="row.updated_at"> {{ row.updated_at   | timeFormat('yyyy-MM-dd HH:mm:ss')  }}</p>
            <p v-else> - </p>
          </template>
          <!--操作人-->
          <template slot-scope="{ row }" slot="last_us_account">
            <p v-if="row.last_us_account"> {{ row.last_us_account }}</p>
            <p v-else> - </p>
          </template>
          <!--操作-->
          <template slot-scope="{ row, index }" slot="action">
            <Button type="text" v-if="_isShow_('modify')" @click="doCreate(row)">修改</Button>
            <Button type="text" v-if="_isShow_('delete')" @click="doDelete(row)">删除</Button>
          </template>
        </Table>

        <div class="page-center">
          <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage'
                :page-size="pageSize" @on-change="changePage" @on-page-size-change="sizeChange"/>
        </div>
      </div>
    </Card>
    <Drawer v-model="setModalFlag" class="roleDrawer custom-drawer"  width="600px" :mask-closable="false" :closable="false"
            :styles="drawStyles">
      <div slot="header" class="draw-header clearfix">
        <div class="draw-header-title fl">
          <h3 v-if="drawerStatus===1">新建角色</h3>
          <h3 v-else>修改角色</h3>
        </div>
        <div class="draw-header-img fr">
          <img src="~@/assets/image/colsImg.png">
        </div>
      </div>
      <Form ref="modalForm" label-position="right" :model="modalForm" :rules="modalFormRules" :label-width="80">
        <FormItem label="角色名称" prop="role_name">
          <Input type="text" :maxlength="30" v-model.trim="modalForm.role_name" placeholder="请输入账号名称"/>
        </FormItem>
        <FormItem label="菜单权限" prop="menuList" class="menuList">
          <div class="menuContent">
            <Tree :data="moduleDataList" ref="tree" show-checkbox multiple @on-check-change="menuChange" expand-node/>
          </div>
        </FormItem>
      </Form>
      <div class="drawer-footer" style="z-index: 10000">
        <Button @click="toggleFormDraw()">取消</Button>
        <Button type="primary" :loading="submitClock" @click="submitAddRole('modalForm')">
          {{!submitClock ? '确定' : '提交中...'}}
        </Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {getSysRole, addSysRole, deleteSysRole, getSysModule, detailSysRole} from '@/api/permission'
  import {formatDate} from '@/libs/tools'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import { inPageAccess } from '@/mixin/in-page-access.js'

  export default {
    name: 'spendAmendment',
    mixins: [tableHeight, inPageAccess],
    data() {
      const menuList = (rule, value, callback) => {
        let _form = this.moduleCheckout
        let showTxt = ''
        if (_form.length === 0) {
          showTxt = '请选择对应的菜单权限'
        }
        if (showTxt) {
          callback(new Error(showTxt))
        } else {
          callback()
        }
      }
      return {
        noDataText: this.$config.noDataText,
        moduleLengthNum: 0,
        flowStatus: 1,
        budgetStatus: 1,
        drawerStatus: 1,
        reportShow: false,
        flowList: [], // 流量数据报表的列表
        targetFlow: [], // 流量数据中的数据选中值
        budgetList: [], // 预算数据中的数据列表
        targetBudget: [], // 预算数据中的数据选中值
        pageSize: 20,
        total_count: 0,
        currentPage: 1,
        listStyle: {
          width: '235px',
          height: '260px'
        },
        spendColumns: [
          {
            title: '角色ID',
            key: 'id',
            minWidth: 60
          },
          {
            title: '角色名称',
            key: 'name',
            minWidth: 200
          },
          {
            title: '关联账号数',
            slot: 'user_cnt',
            minWidth: 80
          },
          {
            title: '创建时间',
            slot: 'created_at',
            minWidth: 150
          },
          {
            title: '更新时间',
            slot: 'updated_at',
            minWidth: 150
          },
          {
            title: '操作人',
            slot: 'last_us_account',
            minWidth: 70
          },
          {
            title: '操作',
            slot: 'action',
            minWidth: 100
          }
        ],
        modalFormRules: {
          role_name: [
            {required: true, message: '角色名称不能为空'}
          ],
          menuList: [
            {required: true, validator: menuList}
          ]
        },
        roleList: [], // table数据
        tableLoadFlag: true, // table的loading
        modalForm: {}, // 修改表单
        dataChange: [],
        submitClock: false, // 保存锁
        spinShow: false,
        setModalFlag: false, // 抽屉开关
        moduleDataList: [],
        moduleCheckout: [],
        drawStyles: { // 抽屉样式
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '54px',
          position: 'static'
        },
        detailRole: [],
        platform_id: this.$config.platformId
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
      if (this._hasPageAccess()) {
        this.getRoleData()
        this.getSysModule()
      }
    },
    mounted() {
      // this.initTableHeight({'search-line': {isAutoCalc: false, isInclude: false}, 'nav-handle-group': false}) // search-line的高度
    },
    methods: {
      /**
       * [getRoleData 获取列表]
       * @return {[type]} [description]
       */
      getRoleData() {
        this.tableLoadFlag = true
        getSysRole({
          platform_id: this.platform_id,
          target_platform_id: this.platform_id,
          page_num: this.currentPage,
          page_size: this.pageSize
        }).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            this.total_count = res.data.total
            this.roleList = res.data.list
          }
        }, err => {
          if (err.code === 403) {
            this.noDataText = this.$config.noDataTextPer
          }
          this.tableLoadFlag = false
        })
      },
      /**
       * [getSysModule 获取菜单的列表]
       * @return {[type]} [description]
       */
      getSysModule() {
        getSysModule({
          platform_id: this.platform_id,
          target_platform_id: this.platform_id
        }).then(res => {
          if (res.code === 200) {
            let module = []
            this.moduleLengthNum = 0
            let obj = {
              title: '全选',
              expand: true,
              checked: this.modalForm.all_models === 1,
              children: this.setModuleDataFormat(res.data.list, 1)
            }
            module.push(obj)
            this.moduleDataList = module
          }
        })
      },
      /**
       * [menuChange 获取菜单的列表]
       * @return {[type]} [description]
       */
      menuChange() {
        let data = this.$refs.tree.getCheckedAndIndeterminateNodes()
        let checkDataID = data.filter(item => {
          return item.id
        }).map((item, index) => {
          return item.id
        })
        this.moduleCheckout = checkDataID
      },
      /**
       * [setModuleDataFormat 格式化模块数据，并且做递归遍历，]
       * [如果当前有children加上_showChildren， 可以展开]
       * @param {[type]} arr [description]
       */
      setModuleDataFormat(arr, level) {
        if (arr.length === 0) {
          return
        }
        let tempArr = []
        arr.map(item => {
          ++this.moduleLengthNum
          item.title = item.name
          item.level = level
          if (!item.sub_models) {
            if ([...this.moduleCheckout].indexOf(item.id) > -1) {
              item.checked = true
            }
          }
          if (!!item.sub_models && item.sub_models.length) {
            let _index = level
            item.title = item.name
            // if ([...this.moduleCheckout].indexOf(item.id) > -1) {
            //   item.checked = true
            // }
            item.children = this.setModuleDataFormat(item.sub_models, ++_index)
          }
          tempArr.push(item)
        })
        return tempArr
      },
      /**
       * [doCreate 修改角色]
       * @return {[type]} [description]
       */
      doCreate(row) {
        detailSysRole({
          role_id: row.id,
          platform_id: this.platform_id,
          target_platform_id: this.platform_id
        }).then(res => {
          if (res.code === 200) {
            let dataDetail = res.data.role
            let models = res.data.model_ids
            this.modalForm = {
              role_name: dataDetail.name,
              id: row.id,
              all_models: dataDetail.all_models
            }
            this.moduleCheckout = models
            this.getSysModule()
            this.drawerStatus = 2
            this.setModalFlag = !this.setModalFlag
          }
        })
      },
      /**
       * [spendGetList 新建角色]
       * @return {[type]} [description]
       */
      submitAddRole(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.drawerStatus === 1) {
              this.addRoleEvent()
            } else {
              this.updateRoleEvent()
            }
          }
        })
      },
      /**
       * [addRoleEvent 新建角色]
       * @return {[type]} [description]
       */
      addRoleEvent() {
        this.submitClock = true
        let obj = {}
        obj.name = this.modalForm.role_name
        if (this.moduleCheckout.length === this.moduleLengthNum) {
          obj.all_models = 1
          obj.model_ids = this.moduleCheckout
        } else {
          obj.all_models = -1
          obj.model_ids = this.moduleCheckout
        }
        obj.platform_id = this.platform_id
        obj.target_platform_id = this.platform_id
        addSysRole(obj).then(res => {
          this.submitClock = false
          if (res.code === 200) {
            this.setModalFlag = false
            this.$Message.success({ content: '新建成功', duration: 3 })
            this.getRoleData()
          } else {
            this.$Message.error({ content: '新建失败，请重试', duration: 3 })
          }
        }, err => {
          this.submitClock = false
        })
      },

      /**
       * [addRoleEvent 修改角色]
       * @return {[type]} [description]
       */
      updateRoleEvent() {
        this.submitClock = true
        let obj = {}
        obj.platform_id = this.platform_id
        obj.role_id = this.modalForm.id
        obj.target_platform_id = this.platform_id
        obj.name = this.modalForm.role_name
        if (this.moduleCheckout.length === this.moduleLengthNum) {
          obj.all_models = 1
          obj.model_ids = this.moduleCheckout
        } else {
          obj.all_models = -1
          obj.model_ids = this.moduleCheckout
        }
        addSysRole(obj).then(res => {
          this.submitClock = false
          if (res.code === 200) {
            this.setModalFlag = false
            this.$Message.success({ content: '修改成功', duration: 3 })
            this.getRoleData()
          } else {
            this.$Message.error({ content: '修改失败，请重试', duration: 3 })
          }
        }, err => {
          this.submitClock = false
        })
      },

      /**
       * [spendGetList 删除角色]
       * @return {[type]} [description]
       */
      doDelete(row) {
        this.$Modal.confirm({
          title: '如果删除当前角色，其下所有账号将不再具有 除登录外的所有权限，并立即生效，确认删除么？',
          className: 'vertical-center-modal',
          onOk: () => {
            deleteSysRole({
              role_id: row.id,
              platform_id: this.platform_id,
              target_platform_id: this.platform_id
            }).then(res => {
              if (res.code === 200) {
                this.getRoleData()
              }
            })
          },
          onCancel() {

          }
        })
      },
      /**
       /**
       * [cancelSubmit form表单 重置]
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      toggleFormDraw() {
        this.modalForm = {
          role_name: '',
          all_models: -1
        }
        this.moduleCheckout = []
        this.drawerStatus = 1
        this.reportShow = false
        this.getSysModule()
        this.setModalFlag = !this.setModalFlag
      },

      /**
       * [changePage 修改页码]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      changePage(val) {
        this.currentPage = val
        this.getRoleData()
      },
      /**
       * [sizeChange 切换每页条数时的回调]
       * @param  {[type]} size [description]
       * @return {[type]}      [description]
       */
      sizeChange(size) {
        this.pageSize = size
        this.getRoleData()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import './transfer.styl';
  .roleDrawer {

    /deep/ .menuList{
      /deep/  .ivu-tree ul li {
        margin 0px
        font-size 12px
      }
      /deep/ .ivu-form-item-label{
        padding : 5px 12px 5px 0
      }
      .menuContent{
        max-height 350px
        overflow auto
        padding 10px
        border 1px solid #dcdee2
      }
      /deep/ .ivu-form-item-content{
        line-height 25px
      }
    }
  }
  .option-box
    .option-left
      text-overflow: ellipsis
      white-space: nowrap
      height: 20px
      line-height: 20px
      overflow: hidden
      float: left
      width: 200px

    .option-right
      float: right
      color: #ccc
      height: 20px
      line-height: 20px
</style>
