<template>
  <div>
    <Card dis-hover class="page-main" :bordered="false">
      <h2 class="page-title">{{headTitle}}
        <div class="is-handler">
          <Button @click="getBack" class="back" type="text">返回
            <i style="font-size: 10px" class="iconfont icon-rightarrow"/>
          </Button>
        </div>
      </h2>

      <div class="see content account">
        <Form label-position="left" :label-colon="true"
              :label-width="130">
          <div class="audit_content" style="padding-bottom: 26px">
            <div class="form_content">
              <FormItem class="accountForm" label="代理商名称">
                <p class="text">{{agent_info.agentname || '-' }} </p>
              </FormItem>
              <FormItem class="accountForm" label="公司名称">
                <p class="text">{{agent_info.company_name || '-' }} </p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="暗扣系数">
                <p class="text">{{agent_info.agent_price_X || '-'}} </p>
              </FormItem>
              <FormItem class="accountForm" label="付款制度">
                <p class="text"> {{agent_info.strategy === 1 ? '预付款' : (agent_info.strategy === 2 ? '垫付款' : '-')}} </p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="测试流量">
                <p class="text">
                  {{agent_info.allow_test_slot === 1 ? '显示' : (agent_info.allow_test_slot === 0 ? '隐藏' : '-')}}
                </p>
              </FormItem>
              <FormItem class="accountForm" label="RTA类型">
                <p class="text"> {{agent_info.is_rta === 1 ? '是' : (agent_info.is_rta === 0 ? '否' : '-')}} </p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="营业执照有效期">
                <p class="text">{{agent_info.bl_begin_time}} 至 {{agent_info.bl_end_time}}</p>
              </FormItem>
              <FormItem class="accountForm" label="电子邮箱">
                <p class="text">{{agent_info.email || '-' }} </p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="社会统一信用编码">
                <p class="text">{{agent_info.credit_code || '-' }} </p>
              </FormItem>
              <FormItem class="accountForm" label="联系地址">
                <p class="text">
                <span v-for="(value,index) in provinceList" :key="'provinceList'+index"
                      v-if="value.province_id === agent_info.province_id">{{ value.name }}</span>
                <span v-for="(value,index) in cityList" :key="'cityList1'+index"
                      v-if="value.city_id === agent_info.city_id">{{ value.name }}</span>
                <span>{{agent_info.address}}</span>
                </p>
              </FormItem>
            </div>

            <div class="form_content">
              <FormItem class="accountForm" label="营业执照">
                <div v-if="agent_info.business_license" class="account_img"
                     style="width: 327px;height: 220px;line-height: 220px" @mouseenter="enter(1)" @mouseleave="leave">
                  <img class="imgs" :src="agent_info.business_license" alt="">
                  <div style="width: 327px;height: 220px;line-height: 220px" v-show="seen && 1===current"
                       class="account_shade" @click="showImg(agent_info.business_license)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </FormItem>
            </div>
          </div>
          <div class="audit_content" style="padding-bottom: 6px">
            <div class="form_content">
              <FormItem class="accountForm" label="法人姓名">
                <p class="text">{{agent_info.legal_person || '-'}}</p>
              </FormItem>
              <FormItem class="accountForm" label="对公银行名称">
                <p class="text">{{agent_info.bank_name || '-'}}</p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="联系人手机号">
                <p class="text">{{agent_info.phone || '-'}}</p>
              </FormItem>
              <FormItem class="accountForm" label="对公开户支行">
                <p class="text">
                <span v-for="(value,index) in provinceList" :key="'provinceList'+index"
                      v-if="value.province_id === agent_info.bank_province_id">{{ value.name }}</span>
                  <span v-for="(value,index) in cityListBank" :key="'cityList1'+index"
                        v-if="value.city_id === agent_info.bank_city_id">{{ value.name }}</span>
                  <span>{{agent_info.bank_subbranch}}</span>
                </p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="法人身份证号">
                <p class="text">{{agent_info.id_card || '-'}}</p>
              </FormItem>
              <FormItem class="accountForm" label="对公银行账号">
                <p class="text">{{agent_info.bank_num || '-'}}</p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="法人身份证">
                <div v-if="agent_info.id_card_front" class="account_img"
                     style="width: 200px;height: 126px;line-height: 126px" @mouseenter="enter('id_card_front')"
                     @mouseleave="leave">
                  <img class="imgs" :src="agent_info.id_card_front" alt="">
                  <div style="width: 200px;height: 126px;line-height: 126px" v-show="seen && 'id_card_front'===current"
                       class="account_shade" @click="showImg(agent_info.id_card_front)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-if="agent_info.id_card_back" class="account_img"
                     style="width: 200px;height: 126px;line-height: 126px" @mouseenter="enter('id_card_back')"
                     @mouseleave="leave">
                  <img class="imgs" :src="agent_info.id_card_back" alt="">
                  <div style="width: 200px;height: 126px;line-height: 126px" v-show="seen && 'id_card_back'===current"
                       class="account_shade" @click="showImg(agent_info.id_card_back)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>

              </FormItem>
              <FormItem class="accountForm" label="纳税人识别号">
                <p class="text">{{agent_info.taxpayer_id || '-'}}</p>
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
  </div>
</template>

<script>
  import {getProvinceApi, getCityApi} from '@/api/common'
  import {showTitle} from '@/libs/util'
  import { getAgentList } from '@/api/agent'

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
        agent_info: {},
        app: {},
        colList: [],
        colDatList: [],
        ruleStatus: true,
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
            this.getProvinceData()
            let id = res.data.list[0].province_id
            if (id) {
              this.getCityData(id, 1)
            }
            let bank_address = data.bank_address.split('/')
            if (bank_address && bank_address.length > 1) {
              data.bank_province_id = Number(bank_address[0])
              data.bank_city_id = Number(bank_address[1])
              this.getCityData(bank_address[0], 2)
            }
            this.agent_info = data
          }
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
      this.getAgentList()
    }
  }
</script>

<style lang="stylus" scoped>
  .page-main {
    .page-title {
      font-size 18px
      color #333333
      height 55px
      line-height 45px
      padding-bottom 10px
      border-bottom 1px solid #EBEBEB
    }

    .content {
      margin-top 30px
      color #42444C !important
      font-size 14px
      min-height: calc(100vh - 200px);
      height auto

      .audit_content {
        .form_content {
          display flex
          justify-content space-between
          .accountForm {
            width 50%
            margin-bottom 0px
            color #42444C
            font-size 14px

            .text {
              width 90%
              word-wrap: break-word;
              word-break: break-all;
            }
          }
        }

        /deep/ textarea.ivu-input {
          height 120px
        }

        .account_img {
          width 150px
          height 150px
          line-height 100px
          display inline-block
          margin-right 10px
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

        /deep/ .form_table {
          .ivu-table-header thead tr th {
            padding 0px
            background: #FAFAFA;
          }
        }
      }

    }

    .see {
      /deep/ .ivu-form-item-label {
        color #999999
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
