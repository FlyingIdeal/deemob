<template>
  <div>
    <Card dis-hover class="page-main" :bordered="false">
      <h2  class="page-title">{{headTitle}}
        <span class="title_des" v-show="ruleForm.status===1">(为保证您的账户与财务信息安全，账户资质不允许修改，如需修改请联系客服)</span></h2>
      <div class="content account">

        <Form ref="agentRef" :model="ruleForm" :rules=" rules"  label-position="right" :label-colon="true"
              :label-width="140">
          <div class="audit_content">
            <div class="title-line-tag">
              <span style="font-weight: bold;font-size:16px">账户信息</span>
            </div>
            <div class="form_content">
              <FormItem class="accountForm text_form" label="代理商名称">
                <p class="text">{{ruleForm.agentname}}</p>
              </FormItem>
              <FormItem class="accountForm text_form" label="联系人手机号码">
                <p class="text">{{ruleForm.phone}}</p>
              </FormItem>
              <FormItem class="accountForm text_form" label="电子邮箱">
                <p class="text">{{ruleForm.email}}</p>
              </FormItem>
              <div class="form_content formSee" v-if="ruleForm.status===1">
                <FormItem  class="accountForm" label="联系地址" style="margin-bottom: 20px">
                  <span v-for="(value,index) in provinceList" :key="'provinceList'+index" v-if="value.province_id === ruleForm.province_id">{{ value.name }}</span>
                  <span v-for="(value,index) in cityList" :key="'cityList1'+index"  v-if="value.city_id === ruleForm.city_id">{{ value.name }}</span>
                  <span>{{ruleForm.address}}</span>
                </FormItem>
              </div>
              <div v-else>
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
                      <Input prop="address" v-model="ruleForm.address"/>
                    </Col>
                  </Row>
                </FormItem>
              </div>
            </div>
          </div>
          <div class="audit_content">
            <div class="title-line-tag">
              <span style="font-weight: bold;font-size:16px">公司资质</span>
            </div>
            <div class="form_content formSee" v-if="ruleForm.status===1">
              <FormItem class="accountForm"  label="公司名称">
                <p class="text">{{ruleForm.company_name}}</p>
              </FormItem>
              <FormItem class="accountForm" label="营业执照">
                <div v-if="ruleForm.business_license" class="account_img"
                     style="width: 327px;height: 220px;line-height: 220px" @mouseenter="enter(1)" @mouseleave="leave">
                  <img class="imgs" :src="ruleForm.business_license" alt="">
                  <div style="width: 327px;height: 220px;line-height: 220px" v-show="seen && 1===current"
                       class="account_shade" @click="showImg(ruleForm.business_license)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </FormItem>
              <FormItem class="accountForm" label="营业执照有效期">
                <p class="text">{{ruleForm.bl_begin_time}} 至 {{ruleForm.bl_end_time}}</p>
              </FormItem>
              <FormItem class="accountForm" label="社会统一信用编码">
                 <p class="text">{{ruleForm.credit_code}}</p>
              </FormItem>
              <FormItem class="accountForm" label="法人姓名">
                <p class="text">{{ruleForm.legal_person}}</p>
              </FormItem>
              <FormItem class="accountForm" label="法人身份证">
                <div v-if="ruleForm.id_card_front" class="account_img"
                     style="width: 245px;height: 150px;line-height: 150px" @mouseenter="enter('id_card_front')" @mouseleave="leave">
                  <img class="imgs" :src="ruleForm.id_card_front" alt="">
                  <div style="width: 245px;height: 150px;line-height: 150px" v-show="seen && 'id_card_front'===current"
                       class="account_shade" @click="showImg(ruleForm.id_card_front)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-if="ruleForm.id_card_back" class="account_img"
                     style="width: 245px;height: 150px;line-height: 150px" @mouseenter="enter('id_card_back')" @mouseleave="leave">
                  <img class="imgs" :src="ruleForm.id_card_back" alt="">
                  <div style="width: 245px;height: 150px;line-height: 150px" v-show="seen && 'id_card_back'===current"
                       class="account_shade" @click="showImg(ruleForm.id_card_back)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
              </FormItem>
              <FormItem class="accountForm" label="法人身份证号" style="margin-bottom: 20px">
                <p class="text">{{ruleForm.id_card}}</p>
              </FormItem>
            </div>
            <div v-else class="form_content" >
              <FormItem class="accountForm text_form"  label="公司名称">
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
                <Input v-model.trim="ruleForm.credit_code" placeholder="请填写社会统一信用编码" autocomplete="off"/>
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
            <div class="form_content formSee" v-if="ruleForm.status===1">
              <FormItem class="accountForm" label="对公银行名称" prop="bank_name">
                <p class="text">{{ruleForm.bank_name}}</p>
              </FormItem>
              <FormItem  class="accountForm text_form" label="对公开户支行">
                <span v-for="(value,index) in provinceList" :key="'provinceList'+index" v-if="value.province_id === ruleForm.bank_province_id">{{ value.name }}</span>
                <span v-for="(value,index) in cityListBank" :key="'cityList1'+index"  v-if="value.city_id === ruleForm.bank_city_id">{{ value.name }}</span>
                <span>{{ruleForm.address}}</span>
              </FormItem>
              <FormItem class="accountForm" label="对公银行账号">
                <p class="text">{{ruleForm.bank_num}}</p>
              </FormItem>
              <FormItem class="accountForm" label="纳税人识别号">
                <p class="text">{{ruleForm.taxpayer_id}}</p>
              </FormItem>
            </div>
            <div v-else class="form_content">
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
                <Input maxlength="19" v-model.trim="ruleForm.bank_num" placeholder="请输入对公银行账号" autocomplete="off"/>
              </FormItem>
              <FormItem class="accountForm" label="纳税人识别号" prop="taxpayer_id">
                <Input v-model.trim="ruleForm.taxpayer_id" placeholder="请输入纳税人识别号" autocomplete="off"/>
              </FormItem>
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
    <div class="detail-save-card" v-show="ruleForm.status!==1">
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
  import {showTitle} from '@/libs/util'
  import {getProvinceApi, getCityApi} from '@/api/common'
  import uploadImage from '_c/upload-image'
  import {validatePhone, validateIdNo, validateCreditCode} from '@/libs/tools'
  import { getAgentInfo, modifyAgent } from '@/api/account'

  export default {
    name: 'account-info',
    components: {uploadImage},
    data() {
      return {
        submitClock: false,
        meterialModal: false,
        meterialUrl: '',
        accountData: {},
        seen: false,
        type: '',
        current: '',
        rule: {},
        rules: {
          credit_code: [
            {required: true, message: '请输入社会统一信用编码'},
            {validator: validateCreditCode}
          ],
          business_license: [
            {required: true, message: '请上传营业执照'}
          ],
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
          id_card: [
            {required: true, message: '请输入法人身份证号'},
            {validator: validateIdNo}
          ],
          id_card_front: [
            {required: true, message: '请上传身份证照片'}
          ],
          time_data: [
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
      enter(index) {
        this.seen = true
        this.current = index
        this.type = index
      },
      leave() {
        this.seen = false
        this.current = null
      },
      showImg(data) {
        this.meterialModal = true
        this.meterialUrl = data
      },
      /**
       * [getTimeData 获取详情页面的数据]
       * @return {[type]} [description]
       */
      getAgentList() {
        getAgentInfo().then(res => {
          if (res.code === 200) {
            let data = res.data.agent
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
        modifyAgent(saveObj).then(res => {
          if (res.code === 200) {
            this.$Message.success({content: '提交成功', duration: 3})
            setTimeout(function() {
              location.reload()
            }, 1000)
          }
          this.submitClock = false
        }, error => {
          this.submitClock = false
        })
      }
    },
    created() {
      this.getAgentList()
      this.getProvinceData()
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
      .title_des{
        font-size: 13px;
        margin-left: 5px;
        color: #999;
        font-weight: normal;
      }
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
          &.formSee{
            .accountForm{
              margin-bottom 5px
            }
           /deep/ .ivu-form-item-required .ivu-form-item-label:before{
              font-size 0px
            }
          }
          .text_form{
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

        .account_img {
          width 150px
          height 150px
          line-height 100px
          display inline-block
          margin-right 8px
          text-align center
          background #eff1f5
          position relative

          &.account_video:before {
            content: '';
            width: 12px;
            height: 135px;
            position: absolute;
            top: 0px;
            left 0px
            z-index 100
            background: url("~@/assets/image/you.png");
            background-size cover
          }

          &.account_video:after {
            content: '';
            width: 12px;
            height: 135px;
            position: absolute;
            top: 0px;
            right: 0px
            z-index 100
            background: url("~@/assets/image/you.png");
            background-size cover

          }

          .imgs {
            max-height 100%
            max-width 100%
            vertical-align middle
          }

          video {
            max-height 100%
            max-width 100%
            vertical-align middle
          }

          .account_shade {
            width 150px
            height 150px
            line-height 1.6 !important
            position absolute
            top 0px
            background rgba(0, 0, 0, 0.5)
            text-align center
            z-index 101
            color #ffffff

            .blow {
              position absolute
              top: 50%
              left 50%
              transform translate(-50%, -50%)

              .icon {
                color #ffffff
                font-size 20px
                line-height 20px
              }
            }

          }
        }

      }
    }
  }
  .native-model {
    .img_content {
      width 400px
      height 400px
      margin 0 auto
      line-height 400px
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-direction: column;

      img, video {
        text-align center
        max-width 400px
        max-height 400px
      }
    }

    /deep/ .ivu-modal-footer {
      border 0px;
      padding 0px
    }
  }

</style>
