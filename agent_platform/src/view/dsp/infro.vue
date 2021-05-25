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
        <Form  label-position="left" :label-colon="true"
              :label-width="130">
          <div class="audit_content">
            <div class="form_content">
              <FormItem class="accountForm" label="广告主名称">
                <p class="text">{{advertiser_info.advertisername}}</p>
              </FormItem>
              <FormItem class="accountForm" label="公司名称">
                <p class="text">{{advertiser_info.company_name}}</p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="公司网址">
                <p class="text">
                  <a :href="advertiser_info.official_website" target="_blank"> {{advertiser_info.official_website}}</a>
                </p>
              </FormItem>
              <FormItem class="accountForm" label="电子邮箱">
                <p class="text">{{advertiser_info.email}}</p>
              </FormItem>
            </div>
            <div class="form_content" v-if="userInfro.strategy===1 || userInfro.is_rta===1">
              <FormItem class="accountForm" label="结算系数" v-if="userInfro.strategy===1">
                <p class="text">{{advertiser_info.adv_price_X || '0'}}</p>
              </FormItem>
              <FormItem class="accountForm" label="RTA合作方" v-if="userInfro.is_rta===1">
                <p class="text">{{advertiser_info.rta.name}}</p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="营业执照">
                <div v-if="advertiser_info.business_license" class="account_img"
                     style="width: 327px;height: 220px;line-height: 220px" @mouseenter="enter(1)" @mouseleave="leave">
                  <img class="imgs" :src="advertiser_info.business_license" alt="">
                  <div style="width: 327px;height: 220px;line-height: 220px" v-show="seen && 1===current"
                       class="account_shade" @click="showImg(advertiser_info.business_license)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-else>-</div>
              </FormItem>
              <FormItem class="accountForm" label="ICP备案证明文件">
                <div v-if="advertiser_info.icp_file" class="account_img"
                     style="width: 327px;height: 220px;line-height: 220px" @mouseenter="enter(2)" @mouseleave="leave">
                  <img class="imgs" :src="advertiser_info.icp_file" alt="">
                  <div style="width: 327px;height: 220px;line-height: 220px" v-show="seen && 2===current"
                       class="account_shade" @click="showImg(advertiser_info.icp_file)">
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
                <p v-if="!advertiser_info.dateTime" class="text">{{advertiser_info.bl_begin_time}} 至 {{advertiser_info.bl_end_time}}</p>
                <p v-else class="text">-</p>
              </FormItem>
              <FormItem class="accountForm" label="ICP备案号">
                <p class="text">{{advertiser_info.icp_num || '-'}}</p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem class="accountForm" label="社会统一信用编码">
                <p class="text">{{advertiser_info.credit_code}}</p>
              </FormItem>
              <FormItem class="accountForm" label="ICP备案有效期">
                <p v-if="!advertiser_info.dateTime" class="text">{{advertiser_info.icp_begin}} 至 {{advertiser_info.icp_end}}</p>
                <p v-else class="text">-</p>
              </FormItem>
            </div>
            <div class="form_content">
              <FormItem label="联系地址">
              <span v-for="(value,index) in provinceList"
                    :key="'provinceList'+index"
                    v-if="value.province_id === advertiser_info.province_id">{{ value.name }}</span>
                <span v-for="(value,index) in cityList" :key="'cityList1'+index"  v-if="value.city_id === advertiser_info.city_id">{{ value.name }}</span>
                <span>{{advertiser_info.address}}</span>
              </FormItem>
            </div>
          </div>
          <div class="audit_content">
            <div class="form_content">
              <FormItem class="accountForm" label="法人姓名">
                <p class="text">{{advertiser_info.legal_person || '-'}}</p>
              </FormItem>
            </div>
            <div class="form_content">
            <FormItem class="accountForm" label="联系人电话">
              <p class="text">{{advertiser_info.mobile || '-'}}</p>
            </FormItem>
            </div>
            <div class="form_content">
            <FormItem class="accountForm" label="法人身份证号">
              <p class="text">{{advertiser_info.id_card || '-'}}</p>
            </FormItem>
            </div>
            <div>
              <FormItem class="accountForm" label="法人身份证">
                <div v-if="advertiser_info.id_card_front" class="account_img"
                     style="width: 200px;height: 126px;line-height: 126px" @mouseenter="enter('id_card_front')" @mouseleave="leave">
                  <img class="imgs" :src="advertiser_info.id_card_front" alt="">
                  <div style="width: 200px;height: 126px;line-height: 126px" v-show="seen && 'id_card_front'===current"
                       class="account_shade" @click="showImg(advertiser_info.id_card_front)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>
                <div v-if="advertiser_info.id_card_back" class="account_img"
                     style="width: 200px;height: 126px;line-height: 126px" @mouseenter="enter('id_card_back')" @mouseleave="leave">
                  <img class="imgs" :src="advertiser_info.id_card_back" alt="">
                  <div style="width: 200px;height: 126px;line-height: 126px" v-show="seen && 'id_card_back'===current"
                       class="account_shade" @click="showImg(advertiser_info.id_card_back)">
                    <div class="blow">
                      <i class="icon icon-zoom-up"/>
                      <p>放大查看</p>
                    </div>
                  </div>
                </div>

              </FormItem>
            </div>
          </div>
          <div class="audit_content">
            <div class="form_content">
              <FormItem class="accountForm" label="行业类型">
                <p class="text">{{category_text}}</p>
              </FormItem>
            </div>
            <div class="form_table">
              <FormItem class="accountForm" label="行业资质" style="margin-bottom: 30px">
                <Table :disabled-hover="true" border :columns="colList" :data="advertise_qualification" width="1034">
                  <!--资质名称-->
                  <template slot-scope="{ row }" slot="qualification_type">
                    <p>{{row.qualification_type || '-'}}</p>
                  </template>
                  <!--资质-->
                  <template slot-scope="{ row }"  slot="required">
                    <p v-if="row.required === 1">是</p>
                    <p v-else>否</p>
                  </template>
                  <!--资质说明-->
                  <template slot-scope="{ row }"   slot="qualification_desc">
                    <p>{{row.qualification_desc}}</p>
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
                  <template slot-scope="{ row }" slot="data">
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
  import { getAdvertiserList } from '@/api/dsp'
  import {getAptitudeSee} from './colList'
  import { getSysUserInfo } from '@/api/user'
  import {mapActions, mapMutations} from 'vuex'

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
        colList: getAptitudeSee(this),
        colDatList: [],
        ruleStatus: true,
        agent_id: this.$route.query.id ? Number(this.$route.query.id) : '',
        provinceList: [],
        cityList: [],
        advertise_qualification: [],
        advertiser_info: {},
        city: {
          country_id_arr: ['137100100100100']
        },
        cityListBank: [],
        category_text: '',
        userInfro: {}
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    methods: {
      ...mapActions([
        'getSysUserInfo'
      ]),
      /**
       * [initData 初始化数据]
       * @return {[type]} [description]
       */
      async initData() {
        this.$Spin.show()

        let storeUser = this.$store.state.user

        this.userInfro = storeUser.userInfo ? storeUser.userInfo : await this.getSysUserInfo()
        console.log(this.userInfro)

        this.$Spin.hide()
      },
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
              this.cityList = date.data.cities
          }
        })
      },
      /**
       * [getTimeData 获取详情页面的数据]
       * @return {[type]} [description]
       */
      getUserInfoData() {
        let advertiser_id_arr = []
        advertiser_id_arr.push(this.agent_id)
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.advertiser_id_arr = advertiser_id_arr
        getAdvertiserList(obj).then(data => {
          let date = data
          if (date.code === 200) {
            let obj = date.data.list[0]
            this.advertiser_info = obj
            let dateTime = Date.parse(new Date(obj.bl_begin_time))
            obj.dateTime = dateTime === 978307243000
            let colList = date.data.list[0].qualifications
            let _arr = []
            if (obj.sub_category.category_name) {
              this.category_text = obj.category.category_name + '-' + obj.sub_category.category_name
            } else {
              this.category_text = obj.category.category_name
            }
            if (colList && colList.length > 0) {
              colList.map(obj => {
                _arr.push(Object.assign({}, obj, {
                  time: obj.is_permanent !== 0 ? [] : [obj.qua_begin_time, obj.qua_end_time],
                  checkout: obj.is_permanent !== 0
                }))
              })
            }
            this.getProvinceData()
            this.advertise_qualification = _arr
            if (this.advertiser_info.province_id > 0) {
              this.getCityData(this.ruleForm.province_id)
            }
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
      this.getUserInfoData()
      this.initData()
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
        border-bottom: 1px solid #f2f2f2;
        margin: 30px 0;
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
