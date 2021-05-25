<template>
  <div class="page-main">
    <Card dis-hover :bordered="false">
      <h2 class="page-title">{{headTitle}}</h2>
      <div class="content account">
        <Form ref="detailRef" :label-colon="true" :model="ruleForm" :rules="rules" label-position="right" :label-width="labelWidth" >
          <FormItem class="accountForm" label="广告主账户名称">
            <p class="text">{{ruleForm.advertisername || '-'}}</p>
          </FormItem>
          <div class="rule_con">
            <FormItem class="accountForm testForm" label="公司名称" prop="company_name">
              <Input disabled v-model.trim="ruleForm.company_name" placeholder="请填写公司名称" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm testForm" label="公司网址URL" prop="official_website">
              <Input  disabled v-model.trim="ruleForm.official_website" placeholder="请填写公司网址URL" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm testForm" label="电子邮箱" prop="email">
              <Input disabled v-model.trim="ruleForm.email" placeholder="请填写电子邮箱" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm testForm"  label='RTA合作方' v-if="userInfro.is_rta===1">
              <p class="text">{{ruleForm.rta.name}}</p>
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
            <FormItem class="accountForm" label="营业执照有效期"  prop="time_end">
              <DatePicker
                :transfer="true"
                v-model="ruleForm.time_data"
                type="daterange"
                format="yyyy-MM-dd"
                :clearable="false"
                @on-change="filterByDate"
                placeholder="请选择营业执照的有效期" style="width: 500px"/>
            </FormItem>
            <FormItem class="accountForm" label="社会统一信用编码" prop="credit_code">
              <Input v-model.trim="ruleForm.credit_code" placeholder="请填写正确的社会信用代码" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm" label="ICP备案文件" prop="icp_file">
              <upload-image field="icp_url" v-model="ruleForm.icp_file" :widthVal="328" :heightVal="220"
                            :idVal="10">
                <div class="uploadTip">
                  <i class="icon icon-upload-cloud"/>
                  <p style="color:#333">ICP备案文件</p>
                  <p>jpg/jpeg/png,小于5MB</p>
                </div>
              </upload-image>
            </FormItem>
            <FormItem class="accountForm" label="ICP备案有效期"  prop="icp_time">
              <DatePicker
                :transfer="true"
                v-model="ruleForm.icp_time"
                type="daterange"
                format="yyyy-MM-dd"
                :clearable="false"
                @on-change="filterByDateIcp"
                placeholder="请选择ICP备案有效期" style="width: 500px"/>
            </FormItem>
            <FormItem class="accountForm" label="ICP备案号" prop="icp_num">
              <Input v-model.trim="ruleForm.icp_num" placeholder="请填写ICP备案号" autocomplete="off"/>
            </FormItem>

            <FormItem class="accountForm" label="联系地址" prop="address">
              <Row style="display: flex">
                <Col style="width:120px;margin-right: 10px">
                  <Select prop="province_id" v-model="ruleForm.province_id" placeholder="请选择"
                          @on-change="provinceChange">
                    <Option v-for="(value,index) in provinceList"
                            :value="value.province_id"
                            :label="value.name"
                            :key="'contactProvince'+index">{{ value.name }}
                    </Option>
                  </Select>
                </Col>
                <Col style="width:120px;margin-right: 10px">
                  <Select prop="city_id" v-model="ruleForm.city_id" placeholder="请选择">
                    <Option v-for="(value,index) in cityList"
                            :value="value.city_id"
                            :key="'contactCity'+index">{{ value.name }}
                    </Option>
                  </Select>
                </Col>
                <Col style="width: 240px">
                  <Input prop="address" v-model="ruleForm.address"/>
                </Col>
              </Row>
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
            <FormItem class="accountForm" label="联系人手机号码" prop="mobile">
              <Input v-model.trim="ruleForm.mobile" placeholder="请输入联系人手机号码" :maxlength="11" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm" label="行业类型">
              <p class="text">{{category_text}}</p>
            </FormItem>
          </div>
          <FormItem label="资质上传" prop="qualification">
            <div class="aptitude_table">
              <Button class="addList" type="text" @click="addColData" icon="md-add">
                <span>添加补充资质</span>
              </Button>
              <Table  border :columns="colList" :data="colDataList" no-data-text="如有特殊资质请手动上传" >
                <!--资质-->
                <template slot-scope="{ row }"   slot="qualification_type">
                  <Input v-if="row.addStatus" v-model="colDataList[row._index].qualification_type" type="textarea"/>
                  <p v-if="!row.addStatus">{{colDataList[row._index].qualification_type}}</p>
                </template>
                <!--资质-->
                <template slot-scope="{ row }"  slot="required">
                  <p v-if="row.required === 1">是</p>
                  <p v-else>否</p>
                </template>
                <!--资质说明-->
                <template slot-scope="{ row }"   slot="qualification_desc">
                  <p>{{colDataList[row._index].qualification_desc}}</p>
                </template>
                <!--资质文件-->
                <template slot-scope="{ row }"   slot="qualification_url">
                  <div style="margin: 5px">
                    <upload-image field="icp_url" v-model="colDataList[row._index].qualification_url" :widthVal="160"
                                  :heightVal="100"
                                  :idVal="row._index+100">
                      <div class="uploadTip">
                        <i class="icon icon-upload-cloud"/>
                        <p>jpg/jpeg/png,小于5MB </p>
                      </div>
                    </upload-image>
                  </div>
                </template>
                <template slot-scope="{ row }"   slot="data">
                  <p>
                    <DatePicker :transfer="true" :value="colDataList[row._index].time" type="daterange" placement="bottom-end" placeholder="请选择营业执照的有效期"
                                style="width: 200px" @on-change="changeColTime($event,row._index)" />
                  </p>
                  <p style="text-align:center">
                    <Checkbox v-model="colDataList[row._index].checkout">永久</Checkbox>
                  </p>
                </template>
                <!--备注-->
                <template slot-scope="{ row }"   slot="comment">
                  <Input v-model="colDataList[row._index].comment" type="textarea"/>
                </template>
                <!--操作-->
                <template slot-scope="{ row }"   slot="action">
                  <Button v-show="row.qualification_id === '0'"  style="color:#E71600" type="text" @click="deleteList(row._index,row.deleteID)">删除</Button>
                </template>
              </Table>
            </div>
          </FormItem>
        </Form>
      </div>
    </Card>

    <div class="detail-save-card">
      <div class="detail-save-center" :style="`margin-left: ${labelWidth}px`">
        <Button @click="getBack" style="margin-right: 10px">取消</Button>
        <Button type="primary" :loading="submitClock" @click="submitPasswd('detailRef')">
          <span v-if="!submitClock">提交</span>
          <span v-else>提交中...</span>
        </Button>
      </div>
    </div>

    <Modal v-model="meterialModal"
           class="native-model native-model1"
           width="500">
      <div class="img_content">
        <img :src="meterialUrl" alt/>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>

</template>

<script>
  import {getAdvertiserList, modifyAdvertiser, modAdvertiserQual} from '@/api/dsp'
  import {getProvinceApi, getCityApi} from '@/api/common'
  import {validatePhone, validateIdNo, validateCreditCode} from '@/libs/tools'
  import {showTitle} from '@/libs/util'
  import uploadImage from '_c/upload-image'
  import {getAptitudeCols} from './colList'
  import {mapActions} from 'vuex'

  export default {
    name: 'adManage',
    components: {uploadImage},
    data() {
      const qualification = (rule, value, callback) => {
        let arr = this.colDataList
        let showTxt = ''
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          if (item.required !== 1) {
             break
          }
          if (!item.qualification_url) {
            showTxt = '请上传资质文件'
            break
          }
          if (!item.checkout && item.qua_begin_time === '' && item.qua_end_time === '') {
            showTxt = '请选择资质有效期'
            break
          }
        }
        if (showTxt) {
          callback(new Error(showTxt))
        } else {
          callback()
        }
      }
      return {
        labelWidth: 140, // 左侧宽度
        submitClock: false,
        meterialModal: false,
        meterialUrl: '',
        accountData: {},
        provinceList: [],
        cityList: [],
        seen: false,
        current: '',
        ruleForm: {},
        advertiser_id: this.$route.query.id ? Number(this.$route.query.id) : '',
        rules: {
          company_name: [
            {required: true, message: '请填写公司名称'}
          ],
          official_website: [
            {required: true, message: '请填写公司网址URL'}
          ],
          email: [
            {required: true, message: '请填写电子邮箱'}
          ],
          credit_code: [
            {required: true, message: '请输入社会统一信用编码', trigger: 'blur'},
            {validator: validateCreditCode, trigger: 'blur'}
          ],
          business_license: [
            {required: true, message: '请上传营业执照', trigger: 'blur'}
          ],
          icp_time: [
            {required: true, message: '请选择ICP备案有效期'}
          ],
          icp_num: [
            {required: true, message: '请填写ICP备案号'}
          ],
          icp_file: [
            {required: true, message: '请上传ICP备案文件', trigger: 'blur'}
          ],
          legal_person: [
            {required: true, message: '请输入法人姓名', trigger: 'blur'},
            {max: 30, message: '长度不超过30', trigger: 'blur'}
          ],
          province_id: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ],
          city_id: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入联系地址', trigger: 'blur'}
          ],
          dev_name: [
            {required: true, message: '请输入联系人姓名', trigger: 'blur'},
            {max: 10, message: '长度不超过10', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入联系人手机号码', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
          ],
          id_card: [
            {required: true, message: '请输入法人身份证号', trigger: 'blur'},
            {validator: validateIdNo, trigger: 'blur'}
          ],
          id_card_front: [
            {required: true, message: '请上传身份证照片', trigger: 'blur'}
          ],
          time_end: [
            {required: true, message: '请选择营业执照的有效期'}
          ],
          qualification: [
            {validator: qualification}
          ]
        },
        colList: getAptitudeCols(this),
        colDataList: [],
        colDataListStatus: [],
        userInfro: {},
        num: 0,
        city: {
          country_id_arr: ['137100100100100']
        },
        category_text: '',
        updateStatus: 1,
        updateColDataList: 1
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    watch: {
      colDataList: {
        deep: true,
        immediate: true,
        handler: function (v) {
          if (v && v.length) {
            if (this.updateStatus !== 1) {
              this.updateColDataList = 2
            }
            this.updateStatus = this.updateStatus + 1
          }
        }
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

        this.$Spin.hide()
      },
      getBack() {
        this.$router.back(-1)
      },
      deleteList(index) {
        this.colDataList.splice(index, 1)
      },
      addColData() {
        this.num = this.num + 1
        let obj = {
          qualification_type: '',
          qualification_desc: '',
          qualification_url: '',
          checkout: true,
          comment: '',
          time: [],
          qua_begin_time: '',
          qua_end_time: '',
          addStatus: true,
          qualification_id: '0',
          deleteID: 'delete' + this.num
        }
        this.colDataList.push(obj)
      },
      changeColTime(val, index) {
        this.colDataList[index].time = val
        this.colDataList[index].qua_begin_time = val[0]
        this.colDataList[index].qua_end_time = val[1]
      },
      // 查询
      filterByDate(e) {
        this.ruleForm.time_starts = e[0]
        this.ruleForm.time_end = e[1]
      },
      filterByDateIcp(e) {
        this.ruleForm.icp_starts = e[0]
        this.ruleForm.icp_end = e[1]
      },
      getUserInfoData() {
        let advertiser_id_arr = []
        advertiser_id_arr.push(this.advertiser_id)
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.advertiser_id_arr = advertiser_id_arr
        getAdvertiserList(obj).then(data => {
          let listData = data.data.list[0]
          if (data.code === 200) {
            let obj = data.data.list[0]
            let dateTime = Date.parse(new Date(listData.bl_begin_time))
            obj.time_data = dateTime === 978307243000 ? [] : [listData.bl_begin_time, listData.bl_end_time]
            obj.time_starts = dateTime === 978307243000 ? '' : listData.bl_begin_time
            obj.time_end = dateTime === 978307243000 ? '' : listData.bl_end_time
            obj.icp_time = dateTime === 978307243000 ? [] : [listData.icp_begin, listData.icp_end]
            obj.icp_starts = dateTime === 978307243000 ? [] : listData.icp_begin
            obj.icp_end = dateTime === 978307243000 ? [] : listData.icp_end
            obj.qualification_url = '列表'
            if (listData.sub_category.category_name) {
              this.category_text = listData.category.category_name + '-' + listData.sub_category.category_name
            } else {
              this.category_text = listData.category.category_name
            }
            this.ruleForm = obj
            let colList = listData.qualifications
            let _arr = []
            let arr1 = []
            if (colList && colList.length > 0) {
              colList.map(obj => {
                _arr.push(Object.assign({}, obj, {
                  time: obj.is_permanent !== 0 ? [] : [obj.qua_begin_time, obj.qua_end_time],
                  checkout: obj.is_permanent !== 0
                }))
                arr1.push(Object.assign({}, obj, {
                  time: obj.is_permanent !== 0 ? [] : [obj.qua_begin_time, obj.qua_end_time],
                  checkout: obj.is_permanent !== 0
                }))
              })
            }
            this.colDataList = _arr
            this.colDataListStatus = arr1
            if (this.ruleForm.province_id > 0) {
              this.getCityData(this.ruleForm.province_id)
            }
          }
        })
      },

      // 当省份变化时的改变
      provinceChange(val) {
        this.getCityData(val)
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
      // 账户信息的提交
      submitPasswd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.getUserDataUpdate()
            this.submitClock = true
          } else {
            this.$Message.error('请检查表单的填写!')
          }
        })
      },
      // 数据的修改
      getUserDataUpdate() {
        let obj = {}
        obj.advertiserid = this.advertiser_id
        obj.company_name = this.ruleForm.company_name
        obj.official_website = this.ruleForm.official_website
        obj.email = this.ruleForm.email
        obj.business_license = this.ruleForm.business_license
        obj.credit_code = this.ruleForm.credit_code
        obj.province_id = this.ruleForm.province_id
        obj.city_id = this.ruleForm.city_id
        obj.address = this.ruleForm.address
        obj.legal_person = this.ruleForm.legal_person
        obj.id_card_front = this.ruleForm.id_card_front
        obj.id_card_back = this.ruleForm.id_card_back
        obj.id_card = this.ruleForm.id_card
        obj.mobile = this.ruleForm.mobile
        obj.bl_begin_time = this.ruleForm.time_starts
        obj.bl_end_time = this.ruleForm.time_end
        obj.icp_file = this.ruleForm.icp_file
        obj.icp_num = this.ruleForm.icp_num
        obj.icp_begin = this.ruleForm.icp_starts
        obj.icp_end = this.ruleForm.icp_end
        obj.qualification_changed = this.updateColDataList === 2
         modifyAdvertiser(obj).then(data => {
          let userUpdata = data
          if (userUpdata.code === 200) {
            this.getUserQualification()
          }
        }, err => {
          this.submitClock = false
        })
      },
     // 资质的提交
      getUserQualification() {
        let obj = {}
        let advertiseList = this.colDataList
        let arr = []
        if (advertiseList.length > 0) {
          advertiseList.map(obj => {
            arr.push(Object.assign({}, obj, {
              is_permanent: obj.checkout ? 1 : 0
            }))
          })
        }
        let formerArr = this.colDataListStatus
        let indexAfterArr = []
        formerArr.map(item => {
          indexAfterArr.push(item.id)
        })
        let indexbeforeArr = []
        arr.map(item => {
          indexbeforeArr.push(item.id)
        })
        let arrC = indexAfterArr.filter(a => !indexbeforeArr.some(b => b === a))
        if (arrC.length > 0) {
          formerArr.map(item => {
            if (arrC.includes(item.id)) {
              item.status = 2
              arr.push(item)
            }
          })
        }
        obj.qualifications = arr
        obj.advertiserid = this.advertiser_id
        modAdvertiserQual(obj).then(data => {
          let userUpdata = data
          this.submitClock = false
          if (userUpdata.code === 200) {
            this.$Message.success('账号信息修改成功')
            // location.reload()
            this.getBack()
          }
        }, err => {
          this.submitClock = false
        })
      },
      enter(index) {
        this.seen = true
        this.current = index
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
      this.getProvinceData()
      this.initData()
    }
  }
</script>

<style lang="stylus" scoped>
  .page-title{
    font-size 18px
    color #333333
    height 45px
    line-height 45px
    padding-bottom 10px
    border-bottom 1px solid #EBEBEB
  }
  .content{
    margin-top 25px
    color #42444C !important
    font-size 14px
    min-height: calc(100vh - 200px);
    height auto
  }
  .text{
    color #42444C
    font-size 14px
  }
  .account {
    .accountForm {
      margin-bottom 10px
      color #42444C
      font-size 14px
      width: 700px;
    }
    .rule_con {
      .accountForm {
        margin-bottom 25px
       &.testForm{
         margin-bottom 10px
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

      /deep/ .ivu-input {
        height 34px
        line-height 34px
      }

      /deep/ .ivu-select-single .ivu-select-selection {
        height 34px
        line-height 34px
      }
    }

    /deep/ .aptitude_table {
      position relative
      width  1000px
      /deep/ .ivu-input{
        font-size 13px
      }
      .addList {
        position absolute
        top: -40px
        right: 0px
        font-size 14px
      }

      .ivu-table .ivu-table-cell {
        padding 2px 4px
      }
      .ivu-table-header thead tr th{
        padding 0px
      }

      .uploadTip {
        text-align center

        .icon {
          font-size 28px
          color #465CFE
        }

        p {
          color #999999
          font-size 14px
          line-height 25px
        }
      }

      .delete {
        color #E71600
        cursor pointer
      }
    }
  }

  .native-model {
    /deep/ .ivu-modal-footer {
      border 0px;
      padding 0px
    }
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

      img {
        text-align center
        max-width 400px
        max-height 400px
      }
    }
  }

  .marginTop10
    margin-top: 10px
</style>
