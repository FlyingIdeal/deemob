<template>
  <div class="page-main">
    <div class="page-title page-has-line">
      <h2 class="title-line-tag">
        {{headTitle}}
        <span style="font-size: 14px;color:#999999;margin-left:20px;font-weight: normal">以下邮件通知均为系统内置的自动通知，仅可以修改接受通知的账号（此处账号指慧营管理平台账号）</span>
      </h2>
    </div>
    <Card :bordered="false" dis-hover class="has-table-card">
      <div class="console-table">
        <Table highlight-row stripe border :columns="tableColList" :data="colDatList" :loading="tableLoadFlag" :no-data-text="noDataText">
          <!--邮件通知类型-->
          <template slot-scope="{ row }" slot="event">
            <p class="text">{{row.event}}</p>
          </template>
          <!--描述-->
          <template slot-scope="{ row }" slot="desc">
            <p class="text">{{row.desc}}</p>
          </template>
          <!--通知接收人-->
          <template slot-scope="{ row }" slot="receivers">
            <div class="receivers">
              <p class="text">
                <i class="iconfont icon-edit" @click="editSystem(row)" v-if="_isShow_('edit')"></i>
                <span>{{row.user_name}}</span>
              </p>
            </div>
          </template>
        </Table>
        <div class="page-center">
          <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage'
                :page-size="pageSize" @on-change="pageNumberChange" @on-page-size-change="pageSizeChange"/>
        </div>
      </div>
    </Card>
    <Drawer v-model="drawModalFlag" width="600" :mask-closable="false" :closable="false" :styles="drawStyles"
            class="custom-drawer">
      <div slot="header" class="draw-header clearfix">
        <div class="draw-header-title fl">
          <h3>修改通知接收人</h3>
        </div>
        <div class="draw-header-img fr">
          <img src="~@/assets/image/colsImg.png">
        </div>
      </div>
      <Form ref="modalForm" label-position="right" :label-width="0" :label-colon="true">
        <div class="account_form">
          <p>请选择账号<span>（您可以先选角色再选账号，或直接搜索角色账号；角色账号可多选）</span></p>
          <FormItem prop="account">
            <retarget-muti-cascader-ad-slot ref="proCity"
                                            class="m-l-20"
                                            v-model="account"
                                            :datas="accountList"
                                            :title="accountString"
                                            :order="orderText"
                                            :type="accountType"
                                            :childrenTitle="accountChildren"
                                            @input="updateMuti"
                                            @name="updateMutiAccount"/>
          </FormItem>
        </div>
      </Form>
      <div class="drawer-footer">
        <Button @click="drawModalFlag = false">取消</Button>
        <Button type="primary" :loading="submitClock" @click="saveSystem('modalForm')">
          {{!submitClock ? '提交' : '提交中...'}}
        </Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {number2Thousand} from '@/libs/tools'
  import {receiverNotifications, getNotifications} from '@/api/notice'
  import { inPageAccess } from '@/mixin/in-page-access.js'
  import {getSysRole, getSysUserList} from '@/api/permission'
  import retargetMutiCascaderAdSlot from '@/components/cascader-retarget'

  export default {
    name: 'noice-system',
    mixins: [inPageAccess],
    components: {retargetMutiCascaderAdSlot},
    data() {
      return {
        drawStyles: { // 抽屉样式
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '54px',
          position: 'static'
        },
        platform_id: this.$config.platformId,
        drawModalFlag: false,
        pageSize: 20, // 页码长度
        total_count: 0,
        currentPage: 1,
        accountType: ['角色'],
        colDatList: [], // table数据
        tableLoadFlag: false, // table的loading
        noDataText: this.$config.noDataText,

        submitClock: false,
        tableColList: [
          {
            title: '编号',
            key: 'id',
            width: 80,
            minWidth: 80
          },
          {
            title: '邮件通知类型',
            slot: 'event'
          },
          {
            title: '描述',
            slot: 'desc'
          },
          {
            title: '通知接收人',
            slot: 'receivers'
          }
        ],
        account: [],
        accountString: '角色',
        accountChildren: '账号',
        orderText: 'first',
        accountList: [],
        role_status: 2,
        account_list: []
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
      if (this._hasPageAccess()) {
        this.initData()
      }
    },
    methods: {
      /**
       * [initData 初始化加载数据]
       * @return {[type]} [description]
       */
      initData() {
        // this.getRoleData()
        this.getTableList() // 获取表格数据
        this.getRoleData()
      },
      updateMuti() {

      },
      updateMutiAccount(val) {
        let account = []
        val.map(item => {
          if (item.type === 'app') {
            item.children.map(it => {
              account.push(it.value)
            })
          } else {
            account.push(item.value)
          }
        })
        this.account = account
      },
      /**
       * [initData 获取角色]
       * @return {[type]} [description]
       */
      getRoleData() {
        getSysRole({
          platform_id: this.platform_id,
          target_platform_id: this.platform_id
        }).then(res => {
          if (res.code === 200) {
            let roleData = res.data.list
              getSysUserList({}).then(res => {
                if (res.code === 200) {
                  let sysUser = res.data.list
                  let sysAccount = sysUser.map(item => {
                    return item
                  })
                  this.setUserData(roleData, sysAccount)
                }
              })
          }
        })
      },
      setUserData(fatherList, childrenList) {
        let userData = []
        fatherList.map(item => {
          item['label'] = item.name
          item['value'] = (item.id + 1000).toString()
          item['check'] = false
          item['little'] = false
          item['type'] = 'app'
          item.childrenName = '账号'
          item['children'] = []
          childrenList.map(list => {
            if (list.role_id === item.id) {
              let obj = {}
              obj.value = (list.id).toString()
              obj.label = list.user_name
              obj.little = false
              obj.check = this.account_list.indexOf(list.id) > -1
              item['children'].push(obj)
            }
          })
          if (item['children'].length > 0) {
            userData.push(item)
          }
          if (this.role_status === 1) {
            this.account = this.account_list
          }
          this.accountList = userData
        })
      },
      editSystem(row) {
        this.notification_id = row.id
        this.accountList = []
        if (row.user_id && row.user_id.length > 0) {
          this.role_status = 1
          let user_id = row.user_id.split('、')
          this.account_list = [...user_id]
          this.getRoleData()
        } else {
          this.getRoleData()
          this.role_status = 2
          this.account = []
        }
        this.accountType = ['角色']
        this.drawModalFlag = true
      },
      /**
       * [spendGetList 修改通知人]
       * @return {[type]} [description]
       */
      saveSystem(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.submitClock = true
            let obj = {}
            obj.notification_id = this.notification_id
            let account = this.account.map(item => {
              return Number(item)
            })
            obj.uc_id_arr = account
            receiverNotifications(obj).then(res => {
              this.submitClock = false
              if (res.code === 200) {
                this.drawModalFlag = false
                this.$Message.success({content: '修改成功', duration: 3})
                this.getTableList()
              } else {
                this.$Message.error({content: '修改失败，请重试', duration: 3})
              }
            }, err => {
              this.submitClock = false
            })
          }
        })
      },

      /**
       * [getFinanceList 获取列表的信息]
       * @return {[type]} [description]
       */
      getTableList() {
        this.tableLoadFlag = true
        getNotifications({
          page_size: this.pageSize,
          page_num: this.currentPage
        }).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            let data = res.data.notifications
            let obj = data.filter(item => {
              if (item.receivers && item.receivers.length > 0) {
                let name = []
                let id = []
                item.receivers.map(i => {
                  id.push(i.uc_id)
                  name.push(i.user_name)
                })
                item.user_name = name.join('、')
                item.user_id = id.join('、')
              } else {
                item.user_name = ''
                item.user_id = []
              }
              return item
            })
            this.colDatList = obj
            this.total_count = res.data.total
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
  .custom-drawer {
    .account_form {
      p {
        font-size 14px
        color #333333
        font-weight bold
        margin-bottom 20px

        span {
          font-size 13px
          color #999999
          font-weight normal
          margin-left 5px
        }
      }
    }
  }

  .receivers {
    .text {
      .iconfont {
        color #999999
        margin-right 10px
        cursor: pointer
        &:hover {
          color #4665FE
        }
      }
    }
  }

  .mar-bot-10
    vertical-align: top
    margin-bottom: 10px
</style>
