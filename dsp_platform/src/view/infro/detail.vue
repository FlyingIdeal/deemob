<template>
  <div class="page-main">
    <Card dis-hover :bordered="false">
      <h2 class="page-title">{{headTitle}}</h2>
      <div class="content account">
        <Form ref="detailRef" :label-colon="true" :model="ruleForm" :rules="rules" label-position="right" :label-width="labelWidth" >
          <FormItem class="accountForm" label="广告主账户名称">
            <p class="text">{{ruleForm.advertisername || '-'}}</p>
          </FormItem>
          <FormItem class="accountForm" label="公司名称">
            <p class="text">{{ruleForm.company_name || '-'}}</p>
          </FormItem>
          <FormItem class="accountForm" label="公司网址URL">
            <p class="text">{{ruleForm.official_website || '-'}}</p>
          </FormItem>
          <FormItem class="accountForm" label="电子邮箱">
            <p class="text">{{ruleForm.email || '-'}}</p>
          </FormItem>
          <div class="rule_con">
            <FormItem class="accountForm" label="营业执照照片" prop="business_license">
              <upload-image
                @on-change="businessImg"
                :defaultList = "ruleForm.business_license"
                :componentWidth="328"
                :componentHeight="220"
                :idName="1"
              >
                <div class="uploadTip">
                  <i class="icon icon-upload-cloud"/>
                  <p style="color:#333">营业执照或组织机构代码证</p>
                  <p>jpg/jpeg/png,小于5MB</p>
                </div>
              </upload-image>
              <input type="hidden" :value="ruleForm.business_license">
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
              <Input v-model.trim="ruleForm.credit_code" placeholder="请填写社会统一信用编码" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm" label="ICP备案文件" prop="icp_file">
              <upload-image
                @on-change="icpFileImg"
                :defaultList = "ruleForm.icp_file"
                :componentWidth="328"
                :componentHeight="220"
                :idName="10"
              >
                <div class="uploadTip">
                  <i class="icon icon-upload-cloud"/>
                  <p style="color:#333">ICP备案文件</p>
                  <p>jpg/jpeg/png,小于5MB</p>
                </div>
              </upload-image>
              <input type="hidden" :value="ruleForm.icp_file">
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
                <upload-image
                  @on-change="idCardFrontImg"
                  :defaultList = "ruleForm.id_card_front"
                  :componentWidth="245"
                  :componentHeight="150"
                  :idName="2"
                >
                  <div class="upload_text">
                    <div class="imgs">
                      <img src="~@/assets/image/main/card_p.png" alt="">
                    </div>
                    <p>法人身份证正面</p>
                    <p>jpg/jpeg/png,小于5MB </p>
                  </div>
                </upload-image>
                <input type="hidden" :value="ruleForm.id_card_front">
                <upload-image
                  @on-change="idCardBackImg"
                  :defaultList = "ruleForm.id_card_back"
                  :componentWidth="245"
                  :componentHeight="150"
                  :idName="3"
                >
                  <div class="upload_text">
                    <div class="imgs">
                      <img src="~@/assets/image/main/card_b.png" alt="">
                    </div>
                    <p>法人身份证反面</p>
                    <p>jpg/jpeg/png,小于5MB </p>
                  </div>
                </upload-image>
                <input type="hidden" :value="ruleForm.id_card_back">
              </div>
            </FormItem>
            <FormItem class="accountForm" label="法人身份证号" prop="id_card">
              <Input v-model.trim="ruleForm.id_card" placeholder="请输入法人身份证号" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm" label="联系人手机号码" prop="mobile">
              <Input v-model.trim="ruleForm.mobile" placeholder="请输入联系人手机号码" :maxlength="11" autocomplete="off"/>
            </FormItem>
            <FormItem class="accountForm" label="行业类型">
              <p class="text">{{ruleForm.category}}</p>
            </FormItem>
          </div>
          <FormItem label="资质上传" prop="qualification">
            <div class="aptitude_table">
              <Button class="addList" type="text" @click="addColData" icon="md-add">
                <span>添加补充资质</span>
              </Button>
              <Table  border :columns="colList" :data="colDataList" no-data-text="如有特殊资质请手动上传">
                <!--资质-->
                <template slot-scope="{ row }" slot="qualification_type">
                  <Input v-if="row.addStatus" v-model="colDataList[row._index].qualification_type" type="textarea"/>
                  <p v-if="!row.addStatus">{{colDataList[row._index].qualification_type}}</p>
                </template>
                <!--资质-->
                <template slot-scope="{ row }" slot="required">
                  <p v-if="row.required === 1">是</p>
                  <p v-else>否</p>
                </template>
                <!--资质说明-->
                <template slot-scope="{ row }" slot="qualification_desc">
                  <p>{{colDataList[row._index].qualification_desc}}</p>
                </template>
                <!--资质文件-->
                <template slot-scope="{ row }" slot="qualification_url">
                  <div style="margin: 5px">
                    <upload-image
                      @on-change="qualificationImg"
                      :defaultList="colDataList[row._index].qualification_url"
                      :rowIndex="row._index"
                      :componentWidth="160"
                      :componentHeight="100"
                      :idName="row._index+100"
                    >
                      <div class="uploadTip">
                        <i class="icon icon-upload-cloud"/>
                        <p>jpg/jpeg/png,小于5MB </p>
                      </div>
                    </upload-image>
                    <input type="hidden" :value="colDataList[row._index].qualification_url">
                  </div>
                </template>
                <template slot-scope="{ row }" slot="data">
                  <p>
                    <DatePicker :transfer="true" :value="colDataList[row._index].time" type="daterange" placement="bottom-end" placeholder="请选择营业执照的有效期" style="width: 200px" @on-change="changeColTime($event,row._index)" />
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
            <Button style="margin-right: 10px">取消</Button>
            <Button type="primary" :loading="submitClock" @click="submitPasswd('detailRef')">
              <span v-if="!submitClock">提交</span>
              <span v-else>提交中...</span>
            </Button>
        </div>
    </div>

    <Modal
      v-model="meterialModal"
      class="native-model native-model1"
      width="500"
    >
      <div class="img_content">
        <img :src="meterialUrl" alt/>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>

</template>

<script>
  import {getSysUserInfo, updateSysUserInfo} from '@/api/user'
  import {getProvinceApi, getCityApi, geSendPhoneCode} from '@/api/common'
  import {validatePhone, validateIdNo, validateCreditCode} from '@/libs/tools'
  import {showTitle} from '@/libs/util'
  import upload from '_c/upload-image'
  import {getAptitudeCols} from './data'

  export default {
    name: 'infroDetail',
    components: {
      uploadImage: upload.uploadImage
    },
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
        rules: {
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
            {required: true, message: '请输入法人身份证号码', trigger: 'blur'},
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
        num: 0,
        city: {
          country_id_arr: ['137100100100100']
        },
        updateColDataList: 1,
        updateStatus: 1
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
        getSysUserInfo({}).then(data => {
          let date = data
          if (date.code === 200) {
            let obj = date.data
            let listData = data.data
            let dateTime = Date.parse(new Date(listData.bl_begin_time))
            obj.time_data = dateTime === 978307243000 ? [] : [listData.bl_begin_time, listData.bl_end_time]
            obj.time_starts = dateTime === 978307243000 ? '' : listData.bl_begin_time
            obj.time_end = dateTime === 978307243000 ? '' : listData.bl_end_time
            obj.icp_time = dateTime === 978307243000 ? [] : [listData.icp_begin, listData.icp_end]
            obj.icp_starts = dateTime === 978307243000 ? [] : listData.icp_begin
            obj.icp_end = dateTime === 978307243000 ? [] : listData.icp_end
            obj.qualification_url = '列表'

            this.ruleForm = obj

            console.log(this.ruleForm)

            let colList = date.data.advertise_qualification
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
        let obj = {
          business_license: this.ruleForm.business_license,
          credit_code: this.ruleForm.credit_code,
          province_id: this.ruleForm.province_id,
          city_id: this.ruleForm.city_id,
          address: this.ruleForm.address,
          legal_person: this.ruleForm.legal_person,
          id_card_front: this.ruleForm.id_card_front,
          id_card_back: this.ruleForm.id_card_back,
          id_card: this.ruleForm.id_card,
          mobile: this.ruleForm.mobile,
          bl_begin_time: this.ruleForm.time_starts,
          bl_end_time: this.ruleForm.time_end,
          icp_file: this.ruleForm.icp_file,
          icp_num: this.ruleForm.icp_num,
          icp_begin: this.ruleForm.icp_starts,
          icp_end: this.ruleForm.icp_end,
          qualification_changed: this.updateColDataList === 2
        }
        
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
        let arrC = indexAfterArr.filter(a => !indexbeforeArr.some(b => b == a))
        if (arrC.length > 0) {
          formerArr.map(item => {
            if (arrC.includes(item.id)) {
              item.status = 2
              arr.push(item)
            }
          })
        }
        obj.advertise_qualification = arr
        updateSysUserInfo(obj).then(data => {
          let userUpdata = data
          this.submitClock = false
          if (userUpdata.code === 200) {
            this.$Message.success({content: '账号信息修改成功', duration: 3})
            setTimeout(function() {
              location.reload()
            }, 1000)
            // location.reload()
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
      },
      /**
       * [businessImg 获取营业执照照片]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      businessImg(val) {
        this.ruleForm.business_license = val
      },
      /**
       * [icpFileImg ICP备案文件]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      icpFileImg(val) {
        this.ruleForm.icp_file = val
      },
      /**
       * [idCardFrontImg 法人身份证 正面]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      idCardFrontImg(val) {
        this.ruleForm.id_card_front = val
      },
      /**
       * [idCardBackImg 法人身份证 反面]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      idCardBackImg(val) {
        this.ruleForm.id_card_back = val
      },
      /**
       * [qualificationImg 资质上传]
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      qualificationImg(val, index) {
        this.$set(this.colDataList[index], 'qualification_url', val)
      }
    },
    created() {
      this.getUserInfoData()
      this.getProvinceData()
    }
  }
</script>
<style lang="stylus">
  .native-model {
    .ivu-modal-footer {
      border 0px;
      padding 0px
    }
  }
</style>

<style lang="stylus" scoped>
  @import './index.stylus';
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

  .account_infro {
    button {
      width 120px
      height 40px
      line-height 40px
      padding 0px
    }
  }

  .marginTop10
    margin-top: 10px
</style>
