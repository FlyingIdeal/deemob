<template>
  <div class="page-main">
    <Card :bordered="false" dis-hover>
      <div class="page-title page-has-line clearfix">
        <h2 class="title-line-tag">{{headTitle}}</h2>
        <div class="is-handler">
          <Button v-if="_isShow_('newAddAccount')" style="float: right" icon="ios-add" type="primary" @click="toggleFormDraw()">新建账号</Button>
        </div>
      </div>
      <div class="search-line">
        <Row>
          <Col span="24">
            <Input :clearable="true"  class="i-margin-right-11 i-width-input mar-bot-10" v-model.trim="search.name" placeholder="输入账户名称或ID"/>
            <Select :clearable="true" class="i-margin-right-11 i-width-select ad_type_select mar-bot-10"  filterable  v-model="search.role_id" placeholder="请选择角色">
              <Option v-for="item in roleList" :value="item.id" :key="'select'+item.id">{{ item.name }}</Option>
            </Select>
            <Button class="search mar-bot-10"  @click="accountSearch">查询</Button>
          </Col>
        </Row>
      </div>

      <div class="console-table">
        <Table
          highlight-row
          stripe border
          :columns="spendColumns"
          :data="userList"
          :loading="tableLoadFlag"
          :no-data-text="noDataText"
          :height="tableHeight">
          <!--账号名称/ID-->
          <template slot-scope="{ row }" slot="account_name">
            <p class="name-row-ellipsis" :title="row.account">{{ row.account }}</p>
            <p class="tip-row-line">ID: {{ row.id }}</p>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status === 1">正常</span>
            <span v-if="row.status === -1">停用</span>
            <i-switch v-if="_isShow_('modify')" size="small" :true-value="1" :false-value="-1" v-model="row.status" @on-change="changeState(row)"/>
          </template>
          <!--关联代理商-->
          <template slot-scope="{ row }" slot="related_ssp">
            <p v-if="row.all_children">全部</p>
            <p v-else>{{row.agentId.length}}</p>
          </template>
          <!--创建时间-->
          <template slot-scope="{ row }" slot="created_at">
            <p v-if="row.created_at">  {{ row.created_at | timeFormat('yyyy-MM-dd HH:mm:ss') }}</p>
            <p v-else> - </p>
          </template>
          <!--更新时间-->
          <template slot-scope="{ row }" slot="updated_at">
            <p v-if="row.updated_at"> {{ row.updated_at | timeFormat('yyyy-MM-dd HH:mm:ss') }}</p>
            <p v-else> - </p>
          </template>
          <template slot-scope="{ row }" slot="role_name">
            <p v-if="row.role_name"> {{ row.role_name  }}</p>
            <p v-else> - </p>
          </template>
          <!--最后的IP-->
          <template slot-scope="{ row }" slot="last_ip">
            <p v-if="row.last_login_ip"> {{ row.last_login_ip }}</p>
            <p v-else> - </p>
          </template>
          <!--操作人-->
          <template slot-scope="{ row }" slot="operator_name">
            <p v-if="row.last_user_account"> {{ row.last_user_account }}</p>
            <p v-else> - </p>
          </template>
          <!--操作-->
          <template slot-scope="{ row, index }" slot="action">
            <Button v-if="_isShow_('modify')" type="text" @click="doCreate(row)">修改</Button>
            <Button v-if="_isShow_('resetPsw')" type="text" @click="doPassword(row)">重置密码</Button>
          </template>
        </Table>
        <div class="page-center">
          <Page show-total show-sizer show-elevator placement="top" :total="total_count" :current.sync='currentPage' :page-size="pageSize" @on-change="changePage" @on-page-size-change="sizeChange"/>
        </div>
      </div>
    </Card>
    <Drawer v-model="passWordModal" class="custom-drawer" :mask-closable="false"  :closable="false"  width="600" :styles="drawStyles">
      <div slot="header" class="draw-header clearfix">
        <div class="draw-header-title fl">
          <h3>修改密码</h3>
        </div>
        <div class="draw-header-img fr">
          <img src="~@/assets/image/colsImg.png">
        </div>
      </div>
      <div class="content" >
        <Form :label-width="80" :model="passwordData" :rules="passwordDataRules" ref="passwordData">
          <FormItem label="输入密码" prop="passwd">
            <Input type="password" :maxlength="20" v-model.trim="passwordData.passwd" password/>
          </FormItem>
          <FormItem label="确认密码" prop="passwdCheck">
            <Input type="password" :maxlength="20" v-model.trim="passwordData.passwdCheck" password/>
          </FormItem>
        </Form>
      </div>
      <div class="drawer-footer" style="z-index: 10000">
        <Button @click="passWordModal=false">取消</Button>
        <Button type="primary" :loading="submitPassWordStatus" @click="submitPassWord('passwordData')">
          <span v-if="!submitPassWordStatus">确定</span>
          <span v-else>提交中...</span>
        </Button>
      </div>
    </Drawer>
    <Drawer v-model="setModalFlag"  class="custom-drawer" width="600px" :mask-closable="false" :closable="false" :styles="drawStyles">
      <div slot="header" class="draw-header clearfix">
        <div class="draw-header-title fl">
          <h3 v-if="drawerStatus===1">新建账号</h3>
          <h3 v-else>修改账号</h3>
        </div>
        <div class="draw-header-img fr">
          <img src="~@/assets/image/colsImg.png">
        </div>
      </div>
      <Form ref="modalForm" label-position="right" :model="modalForm" :rules="modalFormRules" :label-width="100">
        <FormItem label="账号名称" prop="account">
          <Input type="text" :maxlength="30" v-model.trim="modalForm.account" placeholder="请输入账号名称"/>
        </FormItem>
        <FormItem label="密码" prop="password" v-show="drawerStatus===1">
          <Input type="password"  v-model.trim="modalForm.password" password placeholder="请输入您的密码"/>
        </FormItem>
        <FormItem label="姓名" prop="user_name">
          <Input type="text" :maxlength="30" v-model.trim="modalForm.user_name" placeholder="请输入您的姓名"/>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input type="text" v-model.trim="modalForm.phone" placeholder="请输入您的手机号"/>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input type="text" v-model.trim="modalForm.email" placeholder="请输入您的邮箱"/>
        </FormItem>
        <FormItem label="账号状态" prop="status">
          <RadioGroup v-model="modalForm.status">
            <Radio :label="1"><span>正常</span></Radio>
            <Radio :label="-1"><span>停用</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="角色" prop="role_ids">
          <Select filterable v-model="modalForm.role_ids" placeholder="请选择角色">
            <Option v-for="item in roleList" :value="item.id" :key="'modal'+item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem  prop="all_agent">
          <label slot='label'>
            广告主分配
            <Tooltip placement="top" max-width="235">
              <i class="iconfont icon-why"></i>
              <div slot="content">指该账号可操作的广告主账号，同时影响报表对应的资源数据查看</div>
            </Tooltip>
          </label>
          <RadioGroup v-model="resource_allot">
            <Radio :label="1"><span>全部</span></Radio>
            <Radio :label="-1"><span>自定义</span></Radio>
          </RadioGroup>
        </FormItem>
        <div v-show="resource_allot === -1">
          <FormItem label=" " prop="resource_allot">
            <retarget-muti-cascader-ad-slot ref="proCity"
                                            class="m-l-20"
                                            v-model="agentData"
                                            :datas="agentList"
                                            :title="agentString"
                                            :order="orderText"
                                            @input="updateMuti"
                                            @name="updateMutiAccount"/>
          </FormItem>
        </div>
      </Form>
      <div class="drawer-footer" style="z-index: 10000">
        <Button @click="toggleFormDraw()">取消</Button>
        <Button type="primary" :loading="submitClock" @click="submitAddUser('modalForm')">
          {{!submitClock ? '确定' : '提交中...'}}
        </Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import { tableHeight } from '@/mixin/calc-table-height.js'
  import {formatDate, validatePhone} from '@/libs/tools'
  import {getSysRole, getSysUserList, addSysUser, updateSysUserPassWord} from '@/api/permission'
  import {getAdvertiserList} from '@/api/dsp'
  import { inPageAccess } from '@/mixin/in-page-access.js'
  import retargetMutiCascaderAdSlot from '@/components/cascader-retarget'
  export default {
    name: 'spendAmendment',
    mixins: [tableHeight, inPageAccess],
    components: {retargetMutiCascaderAdSlot},
    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passwordData.passwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        noDataText: this.$config.noDataText,
        passwordData: {
          passwd: '',
          passwdCheck: ''
        },
        agentData: [],
        agentString: '广告主',
        accountChildren: '账号',
        orderText: 'first',
        agentList: [],
        passwordDataRules: {
          passwd: [
            {required: true, message: '请输入密码'},
            { min: 6, message: '长度至少6位', trigger: 'blur' },
            {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}
          ],
          passwdCheck: [{required: true, validator: validatePassCheck}]
        },
        passWordModal: false, // 密码的按钮
        resource_allot: 1,
        search: {
          name: '',
          role_id: ''
        },
        pageSize: 10,
        total_count: 0,
        currentPage: 1,
        spendColumns: [
          {
            title: '账号名称/ID',
            slot: 'account_name',
            minWidth: 120,
            fixed: 'left'
          },
          {
            title: '账号状态',
            slot: 'status',
            minWidth: 100
          },
          {
            title: '姓名',
            key: 'user_name',
            minWidth: 100
          },
          {
            title: '手机号码',
            key: 'phone',
            minWidth: 110
          },
          {
            title: '角色',
            slot: 'role_name',
            minWidth: 100
          },
          {
            title: '关联广告主',
            slot: 'related_ssp',
            minWidth: 100
          },
          {
            title: '创建时间',
            slot: 'created_at',
            minWidth: 150
          },
          {
            title: '最后登陆时间',
            slot: 'updated_at',
            minWidth: 150
          },
          {
            title: '最后登陆IP',
            slot: 'last_ip',
            minWidth: 120
          },
          {
            title: '操作人',
            slot: 'operator_name',
            minWidth: 80
          },
          {
            title: '操作',
            slot: 'action',
            minWidth: 150,
            fixed: 'right'
          }
        ],
        tableLoadFlag: false, // table的loading

        modalForm: {}, // 修改表单
        modalFormRules: {
          account: [
            {required: true, message: '账户名称不能为空'}
          ],
          password: [
            {required: true, message: '密码不能为空'},
            { min: 6, message: '长度至少6位', trigger: 'blur' },
            {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}
          ],
          user_name: [
            {required: true, message: '姓名不能为空'}
          ],
          phone: [
            {required: true, message: '手机号不能为空'},
            {validator: validatePhone}
          ],
          email: [
            {required: true, message: '邮箱不能为空'},
            {type: 'email', message: '请输入正确的邮箱地址'}
          ],
          status: [
            {required: true, message: '请选择账号状态'}
          ],
          role_ids: [
            {required: true, message: '请选择角色'}
          ]
          // resource_allot: [
          //   {required: true, message: '请选择对应的资源'}
          // ]
        },
        submitClock: false, // 保存锁
        submitPassWordStatus: false, // 保存锁
        spinShow: false,
        setModalFlag: false, // 抽屉开关
        roleList: [], // 角色的列表
        userList: [], // 账号的列表
        drawerStatus: 1,
        drawStyles: { // 抽屉样式
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '54px',
          position: 'static'
        },
        platform_id: this.$config.platformId,
        all_users: [],
        children_target_platform_ids: [Number(this.$config.platformId)],
        children_user_ids: []
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
        this.getUesrData()
        this.getAgentList()
      }
    },
    mounted() {
      // this.initTableHeight({'search-line': {isAutoCalc: false, isInclude: true}, 'nav-handle-group': false}) // search-line的高度
    },
    methods: {
      updateMuti() {

      },
      updateMutiAccount() {

      },
      /**
       * [getAgentList 获取代理商的列表]
       * @return {[type]} [description]
       */
      getAgentList() {
        let params = {
          page_size: 0,
          page_num: 1
        }
        getAdvertiserList(params).then(res => {
          if (res.code === 200) {
            res.data.list.map(item => {
              item.value = item.uc_id
              item.label = item.advertisername
              item.check = false
              item.little = false
            })
            this.agentList = res.data.list
          }
        })
      },
      /**
       * [doPassword 重置密码显示]
       * @return {[type]} [description]
       */
      doPassword(row) {
        this.passwordData.passwd = ''
        this.passwordData.passwdCheck = ''
        this.passwordData.id = row.id
        this.passWordModal = true
      },
      /**
       * [doPassword 重置密码提交]
       * @return {[type]} [description]
       */
      submitPassWord(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.submitPassWordStatus = true
            let user_id = this.passwordData.id
            let new_password = this.passwordData.passwd
            let platform_id = this.platform_id
            updateSysUserPassWord({
              platform_id,
              user_id,
              new_password
            }).then(res => {
              this.passWordModal = false
              this.submitPassWordStatus = false
              if (res.code === 200) {
                this.$Message.success({ content: '密码修改成功', duration: 3 })
                this.getUesrData()
              } else {
                this.$Message.error({ content: '密码修改失败，请重试', duration: 3 })
              }
            }, err => {
              this.submitPassWordStatus = false
            })
          } else {

          }
        })
      },
      /**
       * [getRoleData 获取角色的列表]
       * @return {[type]} [description]
       */
      getRoleData() {
        getSysRole({
          platform_id: this.platform_id,
          target_platform_id: this.platform_id
        }).then(res => {
          if (res.code === 200) {
            this.roleList = res.data.list
          }
        })
      },
      /**
       * [changeState 切换业务状态]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
      changeState(row) {
        let obj = {
          account: row.account,
          user_name: row.user_name,
          phone: row.phone,
          email: row.email,
          status: row.status,
          role_ids: row.role.id,
          user_id: row.id,
          resource_allot: 1,
          platform_id: this.platform_id,
          target_platform_id: this.platform_id
        }
        let data = obj
        let role_ids = []
        role_ids.push(obj.role_ids)
        data.role_ids = role_ids
        this.$Modal.confirm({
          title: row.status === 1 ? '确定开启该账号?' : '确定停用该账号?',
          content: '',
          onOk: () => {
            addSysUser(data).then(res => {
              if (res.code === 200) {
                this.$Message.success({ content: '状态修改成功', duration: 3 })
                this.getUesrData()
              } else {
                row.status = row.status === 1 ? -1 : 1
              }
            })
          },
          onCancel: res => {
            row.status = row.status === 1 ? -1 : 1
          }
        })
      },
      /**
       * [getuesrData 获取账户的列表]
       * @return {[type]} [description]
       */
      getUesrData() {
        this.tableLoadFlag = true
        let obj = {}
        obj.page_num = this.currentPage
        obj.page_size = this.pageSize
        this.search.name ? obj.search_text = this.search.name : ''
        this.search.role_id ? obj.role_id = this.search.role_id : ''
        getSysUserList(obj).then(res => {
          this.tableLoadFlag = false
          if (res.code === 200) {
            this.total_count = res.data.total_count
            let userList = res.data.list
            userList.map((item, index) => {
              let agentId = []
              if (item.children && item.children.length > 0) {
                item.children.map((it, i) => {
                  it.id ? agentId.push(it.id) : ''
                })
              }
              item.agentId = agentId
              item.children = ''
            })
            this.userList = userList
          }
        }, err => {
          if (err.code === 403) {
            this.noDataText = this.$config.noDataTextPer
          }
          this.tableLoadFlag = false
        })
      },
      /**
       * [getuesrData 修改账号]
       * @return {[type]} [description]
       */
      doCreate(row) {
        if (this.modalFormRules.password.length > 0) {
          this.modalFormRules.password = []
        }
        this.modalForm = {
          account: row.account,
          user_name: row.user_name,
          phone: row.phone,
          email: row.email,
          status: row.status,
          role_ids: row.role_id,
          user_id: row.id
        }
        this.resource_allot = row.agentId.length > 0 ? -1 : 1
        this.agentData = row.agentId
        this.$refs['modalForm'].resetFields()
        this.drawerStatus = 2
        this.setModalFlag = true
      },
      /**
       * [spendGetList 新建角色]
       * @return {[type]} [description]
       */
      submitAddUser(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.drawerStatus === 1) {
              this.addUserEvent('add')
            } else {
              this.addUserEvent('update')
            }
          }
        })
      },
      addUserEvent(type) {
        this.submitClock = true
        let obj = this.modalForm
        let data = obj
        let role_ids = []
        role_ids.push(obj.role_ids)
        data.role_ids = role_ids
        // 资源的分配
        data.all_agent = this.resource_allot
        if (this.resource_allot === -1) {
          data.agent_ids = Array.from(new Set(this.agentData))
        } else {
          data.agent_ids = []
        }
        addSysUser(data).then(res => {
          this.submitClock = false
          this.setModalFlag = false
          if (res.code === 200) {
            this.$Message.success({content: type === 'add' ? '新建成功' : '修改成功', duration: 3})
            this.getUesrData()
          } else {
            this.$Message.error({ content: type === 'add' ? '新建失败，请重试' : '修改失败，请重试', duration: 3 })
          }
        }, err => {
          this.submitClock = false
        })
      },

      /**
       * [accountSearch 查询]
       * @return {[type]} [description]
       */
      accountSearch() {
        this.currentPage = 1
        this.getUesrData()
      },
      /**
       * [spendGetList 获取列表的信息]
       * @return {[type]} [description]
       */

      /**
       /**
       * [cancelSubmit form表单 重置]
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      toggleFormDraw(name) {
        this.getAgentList()
        if (this.modalFormRules.password.length === 0) {
          let data = [
            {required: true, message: '密码不能为空'},
            { min: 6, message: '长度至少6位' },
            {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}]
          this.modalFormRules.password = data
        }
        this.modalForm = {
          account: '',
          password: '',
          user_name: '',
          phone: '',
          email: '',
          status: 1,
          role_ids: '',
          resource_allot: 1
        }
        this.$refs['modalForm'].resetFields()
        this.resource_allot = 1
        this.agentData = []
        this.setModalFlag = !this.setModalFlag
      },

      /**
       * [changePage 修改页码]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      changePage(val) {
        this.currentPage = val
        this.getUesrData()
      },
      /**
       * [sizeChange 切换每页条数时的回调]
       * @param  {[type]} size [description]
       * @return {[type]}      [description]
       */
      sizeChange(size) {
        this.pageSize = size
        this.getUesrData()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import './transfer.styl';
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
