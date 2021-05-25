<template>
  <div>
    <Card dis-hover class="page-main" :bordered="false">
      <h2 v-show="disable" class="page-title">{{headTitle}}</h2>
      <h2 v-show="!disable" class="page-title">账户审核详情页
        <a href="https://www.tianyancha.com/" target="_blank" style="color: #465CFE;margin-left:10px;font-size: 13px;font-weight: normal">天眼查</a>
        <div class="is-handler">
          <Button @click="getBack" class="back" type="text">返回
            <i style="font-size: 10px" class="iconfont icon-rightarrow"/>
          </Button>
        </div>
      </h2>
      <div :class="!disable ? 'see content account' : 'content account'">
        <Form label-position="left" :label-colon="true"
              :label-width="130">
          <div class="audit_content" style="padding-bottom: 26px">
            <div class="form_content">
              <FormItem class="accountForm" label="账户ID">
                <div v-if="from==='log'">
                  <p class="text">{{account_info.account_id}}</p>
                </div>
                <div v-else>
                <p class="text" v-if="account_type === 1">{{account_info.agentid}}</p>
                <p class="text" v-if="account_type === 2">{{account_info.advertiserid}}</p>
                </div>
              </FormItem>
              <FormItem class="accountForm" label="账户名称">
                <div v-if="from==='log'">
                  <p class="text">{{account_info.name}}</p>
                </div>
                <div v-else>
                  <p class="text" v-if="account_type === 1">{{account_info.agentname}}</p>
                  <p class="text" v-if="account_type === 2">{{account_info.advertisername}}</p>
                </div>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="邮箱">
                <p class="text">{{account_info.email || '-' }} </p>
              </FormItem>
              <FormItem class="accountForm" label="联系电话">
                <div v-if="from==='log'">
                  <p class="text">{{account_info.phone}}</p>
                </div>
                <div v-else>
                  <p class="text" v-if="account_type === 1">{{account_info.phone || '-' }} </p>
                  <p class="text" v-if="account_type === 2">{{account_info.mobile || '-' }} </p>
                </div>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="联系地址">
                <span v-for="(value,index) in provinceList" :key="'provinceList'+index" v-if="value.province_id === account_info.province_id">{{ value.name }}</span>
                <span v-for="(value,index) in cityList" :key="'cityList1'+index"  v-if="value.city_id === account_info.city_id">{{ value.name }}</span>
                <span>{{account_info.address || '-'}}</span>
              </FormItem>
              <FormItem class="accountForm" label="公司名称">
                <p class="text">{{account_info.company_name || '-' }} </p>
              </FormItem>
            </div>
            <div class="form_content" v-show="account_type === 2">
              <FormItem class="accountForm" label="公司网站URL">
                <p class="text" v-if="account_info.official_website">
                  <a :href="account_info.official_website">{{account_info.official_website}}</a>
                </p>
                <p v-else>-</p>
              </FormItem>
              <FormItem class="accountForm" label="行业类型">
                  <p  class="text">{{category_text || '-'}}</p>
              </FormItem>
            </div>
            <div class="form_table" v-show="account_type === 2">
              <FormItem class="accountForm" label="行业资质" style="margin-bottom: 5px">
                <Table :disabled-hover="true" border :columns="colList" :data="advertise_qualification">
                  <!--资质名称-->
                  <template slot-scope="{ row }" slot="qualifiedName">
                    <p>{{row.qualification_type || '-'}}</p>
                  </template>
                  <!--资质文件-->
                  <template slot-scope="{ row }" slot="qualification_url">
                    <div style="padding:10px" v-if="row.qualification_url">
                      <div class="account_img" style="width: 146px;height: 90px;line-height: 90px"
                           @mouseenter="enter(row._index+100)" @mouseleave="leave">
                        <img class="imgs" :src="row.qualification_url" alt="">
                        <div style="width: 146px;height: 90px;line-height: 90px" v-show="seen && row._index+100===current"
                             class="account_shade" @click="showImg(row.qualification_url)">
                          <div class="blow">
                            <i class="icon icon-zoom-up"/>
                            <p>放大查看</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>-</div>
                  </template>
                  <!--资质时间-->
                  <template slot-scope="{ row }" slot="qualifiedTime">
                    <p v-if="row.is_permanent===0">{{row.qua_begin_time}} - {{row.qua_end_time}}</p>
                    <p v-else>永久</p>
                  </template>
                  <!--备注-->
                  <template slot-scope="{ row }" slot="comment">
                    <p>{{row.comment || '-'}}</p>
                  </template>
                </Table>
              </FormItem>
            </div>
          </div>
          <div class="audit_content" style="padding-bottom: 6px">
            <div class="form_content">
              <FormItem class="accountForm" label="法人姓名">
                <p class="text">{{account_info.legal_person || '-'}}</p>
              </FormItem>
              <FormItem class="accountForm" label="法人身份证号">
                <p class="text">{{account_info.id_card || '-'}}</p>
              </FormItem>
            </div>
            <div>
              <FormItem class="accountForm" label="法人身份证">
                <div v-if="account_info.id_card_front" class="account_img"
                     style="width: 200px;height: 126px;line-height: 126px" @mouseenter="enter('id_card_front')" @mouseleave="leave">
                  <img class="imgs" :src="account_info.id_card_front" alt="">
                  <div style="width: 200px;height: 126px;line-height: 126px" v-show="seen && 'id_card_front'===current"
                       class="account_shade" @click="showImg(account_info.id_card_front)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-if="account_info.id_card_back" class="account_img"
                            style="width: 200px;height: 126px;line-height: 126px" @mouseenter="enter('id_card_back')" @mouseleave="leave">
                <img class="imgs" :src="account_info.id_card_back" alt="">
                <div style="width: 200px;height: 126px;line-height: 126px" v-show="seen && 'id_card_back'===current"
                     class="account_shade" @click="showImg(account_info.id_card_back)">
                  <div class="blow">
                    <i class="icon icon-zoom-up"/>
                    <p>放大查看</p>
                  </div>
                </div>
              </div>

              </FormItem>
            </div>
          </div>
          <div class="audit_content" style="padding-bottom: 26px">
            <div class="form_content">
              <FormItem class="accountForm" label="营业执照">
                <div v-if="account_info.business_license" class="account_img"
                     style="width: 327px;height: 220px;line-height: 220px" @mouseenter="enter(1)" @mouseleave="leave">
                  <img class="imgs" :src="account_info.business_license" alt="">
                  <div style="width: 327px;height: 220px;line-height: 220px" v-show="seen && 1===current"
                       class="account_shade" @click="showImg(account_info.business_license)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </FormItem>
              <FormItem class="accountForm" label="ICP备案证明文件" v-show="account_type === 2">
                <div v-if="account_info.icp_file" class="account_img"
                     style="width: 327px;height: 220px;line-height: 220px" @mouseenter="enter(2)" @mouseleave="leave">
                  <img class="imgs" :src="account_info.icp_file" alt="">
                  <div style="width: 327px;height: 220px;line-height: 220px" v-show="seen && 2===current"
                       class="account_shade" @click="showImg(account_info.icp_file)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="营业执照有效期">
                <p class="text">{{account_info.bl_begin_time}}至{{account_info.bl_end_time}}</p>
              </FormItem>
              <FormItem class="accountForm" label="ICP备案号" v-show="account_type === 2">
                <p class="text">{{account_info.icp_num || '-'}}</p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="社会统一信用编码">
                <p class="text">{{account_info.credit_code || '-'}}</p>
              </FormItem>
              <FormItem class="accountForm" label="ICP备案有效期" v-show="account_type === 2">
                <p class="text">{{account_info.icp_begin}}至{{account_info.icp_end}}</p>
              </FormItem>
            </div>
          </div>
        </Form>
        <Form ref="verify" :model="verify" :rules="ruleStatus ? verifyRules :rule" class="audit_content"
              style="border: 0px" label-position="left" :label-colon="true"
              :label-width="130">
          <div v-if="disable">
            <FormItem class="accountForm" label="审核" prop="internal_verify" style="width: 100%">
              <RadioGroup v-model="verify.internal_verify" @on-change="verifyChange">
                <Radio :label="1">
                  <span>通过</span>
                </Radio>
                <Radio :label="5">
                  <span>拒绝</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-show="verify.internal_verify===5" style="width: 100%" class="accountForm" label="拒绝原因"
                      prop="reason">
              <Input v-model="verify.reason" maxlength="50" show-word-limit type="textarea" placeholder="不超过50字"
                     style="height:120px;width: 500px"/>
            </FormItem>
          </div>
          <div v-else>
            <div v-if="from==='log'">
              <div class="form_content">
                <FormItem class="accountForm" label="审核状态">
                  <p v-if="account_info.status===1"  class="text" style="color: #67C23A">审核通过</p>
                  <p v-if="account_info.status===5" class="text" style="color: #F93D3D">已拒绝</p>
                </FormItem>
              </div>
              <div class="form_content">
                <FormItem v-show="account_info.status===5" class="accountForm" style="width: 100%" label="拒绝原因">
                  <p v-if="account_info.note">{{account_info.note}}</p>
                  <p v-else>-</p>
                </FormItem>
              </div>
            </div>
            <div v-else>
              <div class="form_content">
                <FormItem class="accountForm" label="审核状态">
                  <p v-if="account_info.status===4" class="text" style="color: #F1A32E">待审核</p>
                  <p v-if="account_info.status===1 || account_info.status===2" class="text" style="color: #67C23A">审核通过</p>
                  <p v-if="account_info.status===5" class="text" style="color: #F93D3D">已拒绝</p>
                </FormItem>
              </div>
              <div class="form_content" v-show="account_type === 1">
                <FormItem v-show="account_info.status===5" class="accountForm" style="width: 100%" label="拒绝原因">
                  <p v-if="account_info.note">{{account_info.note}}</p>
                  <p v-else>-</p>
                </FormItem>
              </div>
              <div class="form_content" v-show="account_type === 2">
                <FormItem v-show="account_info.status===5" class="accountForm" style="width: 100%" label="拒绝原因">
                  <p v-if="account_info.status_desc">{{account_info.status_desc}}</p>
                  <p v-else>-</p>
                </FormItem>
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Modal v-model="meterialModal"
             class="native-model native-model1"
             width="500">
        <div class="img_content">
          <video v-if="type === 'video'" :src="meterialUrl" controls/>
          <img v-else :src="meterialUrl" alt/>
        </div>
        <div slot="footer"></div>
      </Modal>
    </Card>
    <div v-show="disable" class="create_save">
      <Button class="cancel" @click="getBack">取消</Button>
      <Button class="submit" type="primary" :loading="submitClock"
              @click="submitVerify('verify')">
        <span v-if="!submitClock">提交</span>
        <span v-else>提交中...</span>
      </Button>
    </div>
  </div>
</template>

<script>
  import {getProvinceApi, getCityApi, getCategoryList} from '@/api/common'
  import {showTitle} from '@/libs/util'
  import {getQualifiedCols} from '../common/colList'
  import { getAgentList } from '@/api/agent'
  import {getAdvertiserList, saveAgentVerify, saveAdvertiserVerify, getAccountRecords} from '@/api/audit'

  export default {
    name: 'adManage',
    data() {
      return {
        submitClock: false,
        meterialModal: false,
        meterialUrl: '',
        accountData: {},
        seen: false,
        type: '',
        current: '',
        ruleForm: {},
        account_info: {},
        advertise_qualification: [],
        creative_info: {},
        app: {},
        colList: getQualifiedCols(this),
        colDatList: [],
        verify: {
          internal_verify: 1,
          reason: ''
        },
        verifyRules: {
          reason: [{required: true, message: '拒绝理由不能为空'}]
        },
        rule: {},
        ruleStatus: true,
        account_id: this.$route.query.id ? Number(this.$route.query.id) : '',
        account_type: this.$route.query.account_type ? Number(this.$route.query.account_type) : '',
        disable: this.$route.query.type !== 'see',
        provinceList: [],
        from: '',
        cityList: [],
        city: {
          country_id_arr: ['137100100100100']
        },
        category_text: ''
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    methods: {
      getBack() {
        this.$router.back(-1)
      },
      /**
       * [getTimeData 获取行业列表]
       * @return {[type]} [description]
       */
      getCategoryListApi(id, subID) {
        getCategoryList().then(res => {
          if (res.code === 200) {
            let data = res.data.list
            let name = ''
            let childrenName = ''
            data.map(item => {
              if (Number(id) === item.id) {
                name = item.category_name
                if (subID) {
                  item.children.map(it => {
                    if (Number(subID) === it.id) {
                      childrenName = it.category_name
                    }
                  })
                }
              }
            })
            if (subID) {
              this.category_text = name + '-' + childrenName
            } else {
              this.category_text = name
            }
          }
        })
      },
      verifyChange(val) {
        if (val === 1) {
          this.ruleStatus = false
        } else {
          this.ruleStatus = true
        }
      },
      enter(index) {
        this.seen = true
        this.current = index
        this.type = index
      },
      // 获取省份
      getProvinceData() {
        let obj = this.city
        getProvinceApi(obj).then(data => {
          let date = data
          if (date.code === 200) {
            this.provinceList = date.data.provinces
          }
        })
      },
      // 根据城市名省市名获取城市名
      getCityData(id) {
        let obj = this.city
        let data = obj
        let province_id_arr = []
        province_id_arr.push(id)
        data.province_id_arr = province_id_arr
        getCityApi(data).then(data => {
          let date = data
          if (date.code === 200) {
              this.cityList = date.data.cities
          }
        })
      },
      /**
       * [getTimeData 获取代理商详情页面的数据]
       * @return {[type]} [description]
       */
      getAgentData() {
        let agentid_arr = []
        agentid_arr.push(this.account_id)
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.agentid_arr = agentid_arr
        getAgentList(obj).then(res => {
          if (res.code === 200) {
            let data = res.data.list[0]
            this.getProvinceData()
            let id = res.data.list[0].province_id
            if (id) {
              this.getCityData(id)
            }
            this.verify.internal_verify = data.status === 5 ? 5 : 1
            this.verify.reason = data.status === 5 ? data.note : ''
            data.status === 5 ? this.ruleStatus = true : this.ruleStatus = false
            this.account_info = data
          }
        })
      },
      // 账户的审核
      getAccountList() {
        let id_arr = []
        id_arr.push(this.account_id)
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.id_arr = id_arr
        getAdvertiserList(obj).then(res => {
          if (res.code === 200) {
            let data = res.data.list[0]
            this.getProvinceData()
            let id = res.data.list[0].province_id
            if (id) {
              this.getCityData(id)
            }
            if (data.category) {
              this.getCategoryListApi(data.category, data.category_sub_id)
            }
            this.verify.internal_verify = data.status === 5 ? 5 : 1
            this.verify.reason = data.status === 5 ? data.status_desc : ''
            data.status === 5 ? this.ruleStatus = true : this.ruleStatus = false
            this.advertise_qualification = data.qualifications && data.qualifications.length > 0 ? data.qualifications : []
            this.account_info = res.data.list[0]
          }
        })
      },
      getLogData() {
        let record_id_arr = []
        record_id_arr.push(this.account_id)
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.record_id_arr = record_id_arr
        getAccountRecords(obj).then(res => {
          if (res.code === 200) {
            let data = res.data.list[0]
            this.getProvinceData()
            if (data.category) {
              this.getCategoryListApi(data.category_id, data.category_sub_id)
            }
            let id = res.data.list[0].province_id
            if (id) {
              this.getCityData(id)
            }
            this.verify.internal_verify = data.status === 5 ? 2 : 1
            this.verify.reason = data.status === 5 ? data.status_desc : ''
            data.status === 5 ? this.ruleStatus = true : this.ruleStatus = false
            this.advertise_qualification = data.qualifications && data.qualifications.length > 0 ? data.qualifications : []
            this.account_info = res.data.list[0]
          }
        })
      },
      // 提交审核的理由
      submitVerify(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.account_type === 1) {
              this.toSaveAgent()
            } else {
              this.toSaveAccount()
            }
          }
        })
      },
      // 审核广告主
      toSaveAccount() {
        this.submitClock = true
        let obj = {}
        obj.advertiser_id = Number(this.account_info.advertiserid)
        obj.status = Number(this.verify.internal_verify)
        obj.note = this.verify.reason
        saveAdvertiserVerify(obj).then(res => {
          if (res.code === 200) {
            this.$Message.success({content: '审核成功', duration: 3})
            this.getBack()
          }
          this.submitClock = false
        }, error => {
          this.submitClock = false
        })
      },
      // 审核代理商
      toSaveAgent() {
        this.submitClock = true
        let obj = {}
        obj.agent_id = Number(this.account_info.agentid)
        obj.status = Number(this.verify.internal_verify)
        obj.note = this.verify.reason
        saveAgentVerify(obj).then(res => {
          if (res.code === 200) {
            this.$Message.success({content: '审核成功', duration: 3})
            this.$Bus.$emit('editEmitEvent') // 列表数据刷新

            this.getBack()
          }
          this.submitClock = false
        }, error => {
          this.submitClock = false
        })
      },

      leave() {
        this.seen = false
        this.current = null
      },
      showImg(data) {
        this.meterialModal = true
        this.meterialUrl = data
      }

    },
    created() {
      let type = Number(this.$route.query.account_type)
      let from = this.$route.query.form
      this.from = this.$route.query.form
      if (from === 'log') {
         this.getLogData()
      } else {
        if (type === 1) {
          this.getAgentData()
        } else {
          this.getAccountList()
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/detail.styl';
</style>
