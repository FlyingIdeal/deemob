<template>
  <div>
    <Card dis-hover class="page-main" :bordered="false">
      <h2  class="page-title">{{headTitle}}</h2>
      <div class="content account">

         <Form ref="agentRef"  :model="ruleForm" :rules="rules"  label-position="right" :label-colon="true"
              :label-width="140">
           <div class="audit_content">
            <div class="title-line-tag">
              <span style="font-weight: bold;font-size:16px">账户信息</span>
            </div>
            <div class="form_content">
              <FormItem class="accountForm textForm" label="代理商名称">
                <p class="text">{{ruleForm.agentname}}</p>
              </FormItem>
              <FormItem class="accountForm" label="联系人手机号码" prop="phone">
                <Input v-model.trim="ruleForm.phone" placeholder="请输入联系人手机号码" :maxlength="11" autocomplete="off"/>
              </FormItem>
              <FormItem class="accountForm" label="电子邮箱" prop="email">
                <Input v-model.trim="ruleForm.email" placeholder="请填写电子邮箱" autocomplete="off"/>
              </FormItem>
              <FormItem class="accountForm" label="联系地址" prop="address">
                <Row style="display: flex">
                  <Col style="width: 120px;margin-right: 10px">
                    <Select prop="province_id" v-model="ruleForm.province_id" placeholder="请选择"
                            @on-change="provinceChange">
                      <Option v-for="(value,index) in provinceList"
                              :value="value.province_id"
                              :label="value.name"
                              :key="'contactProvince'+index">{{ value.name }}
                      </Option>
                    </Select>
                  </Col>
                  <Col style="width: 120px;margin-right: 10px">
                    <Select prop="city_id" v-model="ruleForm.city_id" placeholder="请选择">
                      <Option v-for="(value,index) in cityList"
                              :value="value.city_id"
                              :key="'contactCity'+index">{{ value.name }}
                      </Option>
                    </Select>
                  </Col>
                  <Col style="width: 250px">
                    <Input v-model="ruleForm.address"/>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="暗扣系数" prop="agent_price_X">
                <InputNumber style="width: 100%" :max="1" :min="0" placeholder="大于等于0, 小于1; 最多两位小数点" :step="0.01" v-model="ruleForm.agent_price_X"></InputNumber>
              </FormItem>
              <FormItem class="accountForm textForm" label="付款制度">
                <p class="text"> {{ruleForm.strategy === 1 ? '预付款' : (ruleForm.strategy === 2 ? '垫付款' : '-')}} </p>
              </FormItem>
              <FormItem class="accountForm textForm" label="是否显示测试流量">
                <p class="text">
                  {{ruleForm.allow_test_slot === 1 ? '是' : (ruleForm.allow_test_slot === 0 ? '否' : '-')}}
                </p>
              </FormItem>
              <FormItem class="accountForm textForm" label="是否是RTA类型">
                <p class="text">
                  {{ruleForm.is_rta === 1 ? '是' : '否'}}
                </p>
              </FormItem>

            </div>
          </div>
           <div class="audit_content">
             <div class="title-line-tag">
               <span style="font-weight: bold;font-size:16px">公司资质</span>
             </div>
             <div class="form_content">
               <FormItem class="accountForm textForm" label="公司名称">
                 <p class="text">{{ruleForm.company_name}}</p>
               </FormItem>
               <FormItem class="accountForm" label="营业执照照片" prop="business_license">
                 <upload-image refName="icp_url" v-model="ruleForm.business_license" :widthVal="328" :heightVal="220"
                               :idVal="1">
                   <div class="uploadTip">
                     <i class="icon icon-upload-cloud"/>
                     <p style="color:#333">营业执照或组织机构代码证</p>
                     <p>jpg/jpeg/png,小于5MB</p>
                   </div>
                 </upload-image>
               </FormItem>
               <FormItem class="accountForm" label="营业执照有效期"  prop="time_data">
                 <DatePicker
                   :transfer="true"
                   v-model="ruleForm.time_data"
                   type="daterange"
                   format="yyyy-MM-dd"
                   :clearable="false"
                   @on-change="filterByDate"
                   placeholder="请选择营业执照的有效期" style="width: 510px"/>
               </FormItem>
               <FormItem class="accountForm" label="社会统一信用编码" prop="credit_code">
                 <Input v-model.trim="ruleForm.credit_code" placeholder="请输入社会统一信用编码" autocomplete="off"/>
               </FormItem>
               <FormItem class="accountForm" label="法人姓名" prop="legal_person">
                 <Input v-model.trim="ruleForm.legal_person" :maxlength="30" placeholder="请输入法人姓名"
                        autocomplete="off"/>
               </FormItem>
               <FormItem class="accountForm" label="法人身份证" prop="id_card_front">
                 <div style="display: flex;justify-content: space-between">
                   <upload-image v-model="ruleForm.id_card_front" :widthVal="245" :heightVal="150" :idVal="2">
                     <div class="upload_text">
                       <div class="imgs">
                         <img src="~@/assets/image/main/card_p.png" alt="">
                       </div>
                       <p>法人身份证正面</p>
                       <p>jpg/jpeg/png,小于5MB </p>
                     </div>
                   </upload-image>
                   <upload-image field="icp_url" v-model="ruleForm.id_card_back" :widthVal="245" :heightVal="150"
                                 :idVal="3">
                     <div class="upload_text">
                       <div class="imgs">
                         <img src="~@/assets/image/main/card_b.png" alt="">
                       </div>
                       <p>法人身份证反面</p>
                       <p>jpg/jpeg/png,小于5MB </p>
                     </div>
                   </upload-image>
                 </div>
               </FormItem>
               <FormItem class="accountForm" label="法人身份证号" prop="id_card">
                 <Input v-model.trim="ruleForm.id_card" placeholder="请输入法人身份证号" autocomplete="off"/>
               </FormItem>
             </div>
           </div>
           <div class="audit_content" style="border: 0px">
             <div class="title-line-tag">
               <span style="font-weight: bold;font-size:16px">财务信息</span>
             </div>
             <div class="form_content">
               <FormItem class="accountForm" label="对公银行名称" prop="bank_name">
                 <Input v-model.trim="ruleForm.bank_name" placeholder="请输入对公银行名称"  autocomplete="off"/>
               </FormItem>
               <FormItem class="accountForm" label="对公开户支行" prop="bank_subbranch">
                 <Row style="display: flex">
                   <Col style="width: 120px;margin-right: 10px">
                     <Select prop="bank_province_id" v-model="ruleForm.bank_province_id" placeholder="请选择"  :label-in-value="true"
                             @on-change="provinceChangeBank">
                       <Option v-for="(value,index) in provinceList"
                               :value="value.province_id"
                               :label="value.name"
                               :key="'contactProvince'+index">{{ value.name }}
                       </Option>
                     </Select>
                   </Col>
                   <Col style="width: 120px;margin-right: 10px">
                     <Select prop="bank_city_id" v-model="ruleForm.bank_city_id" placeholder="请选择" :label-in-value="true">
                       <Option v-for="(value,index) in cityListBank"
                               :value="value.city_id"
                               :label="value.name"
                               :key="'contactCity'+index">{{ value.name }}
                       </Option>
                     </Select>
                   </Col>
                   <Col style="width: 250px;">
                     <Input prop="bank_subbranch" v-model="ruleForm.bank_subbranch"/>
                   </Col>
                 </Row>
               </FormItem>
               <FormItem class="accountForm" label="对公银行账号" prop="bank_num">
                 <Input v-model.trim="ruleForm.bank_num" placeholder="请输入对公银行账号" autocomplete="off"/>
               </FormItem>
               <FormItem class="accountForm" label="纳税人识别号" prop="taxpayer_id">
                 <Input v-model.trim="ruleForm.taxpayer_id" placeholder="请输入纳税人识别号" autocomplete="off"/>
               </FormItem>
             </div>
           </div>
        </Form>
      </div>
    </Card>
    <div class="detail-save-card">
      <div class="detail-save-center">
        <Button class="cancel" @click="getBack">取消</Button>
        <Button class="submit" type="primary" :loading="submitClock"
                @click="submitAgent('agentRef')">
          <span v-if="!submitClock">提交</span>
          <span v-else>提交中...</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import {showTitle, regNum2Precision} from '@/libs/util'
  import {getProvinceApi, getCityApi} from '@/api/common'
  import uploadImage from '_c/upload-image'
  import {validatePhone, validateIdNo, validateCreditCode} from '@/libs/tools'
  import { getAgentList, modifyAgent } from '@/api/agent'
  import { inPageAccess } from '@/mixin/in-page-access.js'

  export default {
    mixins: [inPageAccess],
    name: 'adManage',
    components: {uploadImage},
    data() {
      const validatePrice = (rule, value, callback) => {
        if (value === null || value === undefined) {
          callback(new Error('请填写暗扣系数'))
        } else if (!regNum2Precision.test(value) || value < 0 || value >= 1) {
          callback(new Error('暗扣系数必须大于等于0, 小于1; 最多两位小数点'))
        } else {
          callback()
        }
      }
      return {
        submitClock: false,
        meterialModal: false,
        meterialUrl: '',
        accountData: {},
        seen: false,
        type: '',
        current: '',
        rules: {
          credit_code: [
            {required: true, message: '请输入社会统一信用编码'},
            {validator: validateCreditCode}
          ],
          business_license: [
            {required: true, message: '请上传营业执照'}
          ],
          agent_price_X: [{required: true, validator: validatePrice, trigger: 'blur'}],
          icp_time: [
            {required: true, message: '请选择ICP备案有效期'}
          ],
          icp_num: [
            {required: true, message: '请填写ICP备案号'}
          ],
          icp_file: [
            {required: true, message: '请上传ICP备案文件'}
          ],
          legal_person: [
            {required: true, message: '请输入法人姓名'},
            {max: 30, message: '长度不超过30'}
          ],
          province_id: [
            {required: true, message: '请输入联系地址'}
          ],
          city_id: [
            {required: true, message: '请输入联系地址'}
          ],
          address: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ],
          dev_name: [
            {required: true, message: '请输入联系人姓名'},
            {max: 10, message: '长度不超过10'}
          ],
          phone: [
            {required: true, message: '请输入联系人手机号码'},
            {validator: validatePhone}
          ],
          email: [
            {required: true, type: 'email', message: '请输入正确的邮箱地址'}
          ],
          id_card: [
            {required: true, message: '请输入法人身份证号'},
            {validator: validateIdNo}
          ],
          id_card_front: [
            {required: true, message: '请上传身份证照片'}
          ],
          time_end: [
            {required: true, message: '请选择营业执照的有效期'}
          ],
          bank_name: [
            {required: true, message: '请输入对公银行账号'}
          ],
          bank_province_id: [
            {type: 'number', required: true, message: '请选择开户行所在地'}
          ],
          bank_city_id: [
            {type: 'number', required: true, message: '请选择开户行所在地'}
          ],
          bank_subbranch: [
            {required: true, message: '请输入开户行支行名称'}
          ],
          bank_num: [
            {required: true, message: '请输入银行账号'}
          ],
          taxpayer_id: [
            {required: true, message: '请输入纳税人识别号'}
          ]
        },
        ruleForm: {},
        advertiser_info: {},
        advertise_qualification: [],
        creative_info: {},
        app: {},
        colList: [],
        colDatList: [],
        agent_id: this.$route.query.id ? Number(this.$route.query.id) : '',
        provinceList: [],
        cityList: [],
        city: {
          country_id_arr: ['137100100100100']
        },
        cityListBank: []
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
       * [filterByDate 时间的删选]
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      filterByDate(time) {
        this.ruleForm.time_data = time
        this.ruleForm.bl_begin_time = time[0]
        this.ruleForm.bl_end_time = time[1]
      },
      /**
       * [getTimeData 获取详情页面的数据]
       * @return {[type]} [description]
       */
      getAgentList() {
        let agentid_arr = []
        agentid_arr.push(this.agent_id)
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.agentid_arr = agentid_arr
        getAgentList(obj).then(res => {
          if (res.code === 200) {
            let data = res.data.list[0]
            let obj = data
            obj.time_data = data.bl_begin_time === '1970-12-30' ? [] : [data.bl_begin_time, data.bl_end_time]
            obj.bl_begin_time = data.bl_begin_time === '1970-12-30' ? '' : data.bl_begin_time
            obj.bl_end_time = data.bl_begin_time === '1970-12-30' ? '' : data.bl_end_time
            if (data.province_id) {
              this.getCityData(data.province_id, 1)
            }
            let bank_address = data.bank_address.split('/')
            if (bank_address && bank_address.length > 1) {
              obj.bank_province_id = Number(bank_address[0])
              obj.bank_city_id = Number(bank_address[1])
              this.getCityData(bank_address[0], 2)
            }
            this.ruleForm = obj
          }
        })
      },
      // 当省份变化时的改变
      provinceChange(val) {
        this.getCityData(val, 1)
      },
      provinceChangeBank(data) {
        this.getCityData(data.value, 2)
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
      getCityData(id, type) {
        let obj = this.city
        let data = obj
        let province_id_arr = []
        province_id_arr.push(id)
        data.province_id_arr = province_id_arr
        getCityApi(data).then(data => {
          let date = data
          if (date.code === 200) {
            if (type === 1) {
              this.cityList = date.data.cities
            } else {
              this.cityListBank = date.data.cities
            }
          }
        })
      },
      // 提交审核的理由
      submitAgent(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.toSave()
          }
        })
      },
      toSave() {
        this.submitClock = true
        let obj = this.ruleForm
        let saveObj = obj
        // saveObj.bl_begin_time = obj.time_data[0]
        // saveObj.bl_end_time = obj.time_data[1]
        obj.bank_address = obj.bank_province_id + '/' + obj.bank_city_id
        obj.price_x = parseInt(obj.agent_price_X * 100) / 100
        modifyAgent(saveObj).then(res => {
          if (res.code === 200) {
            this.$Message.success({content: '编辑成功', duration: 3})
            this.getBack()
          }
          this.submitClock = false
        }, error => {
          this.submitClock = false
        })
      }
    },
    created() {
      // 判断是否有修改权限
      let resultArr = this._isPageShow()
      console.log(resultArr)
      if (resultArr.includes('edit')) {
        this.getAgentList()
        this.getProvinceData()
      } else {
        this._gotoNoAccess()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .page-main {
    .page-title {
      font-size 18px
      color #333333
      height 45px
      line-height 45px
      padding-bottom 10px
      border-bottom 1px solid #EBEBEB
    }

    .content {
      margin-top 25px
      color #42444C !important
      font-size 14px
      min-height: calc(100vh - 200px);
      height auto

      .audit_content {
        border-bottom 1px solid #F2F2F2
        margin 30px 0px
        .form_content{
          margin-top 10px
          width 650px
          .textForm{
            margin-bottom 5px
          }
          .uploadTip {
            text-align center

            .icon {
              font-size 38px
              color #465CFE
            }

            p {
              color #999999
              font-size 14px
              line-height 25px
            }
          }

          .upload_text {
            text-align center

            .imgs {
              height 80px
            }

            p {
              color #999999
              font-size 14px
              line-height 25px
            }
          }
        }

      }
    }
  }
</style>
