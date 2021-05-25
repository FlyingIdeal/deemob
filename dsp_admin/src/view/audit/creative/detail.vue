<template>
  <div>
    <Card dis-hover class="page-main" :bordered="false">
      <h2 v-show="disable" class="page-title">{{headTitle}}</h2>
      <h2 v-show="!disable" class="page-title">创意审核详情页
        <div class="is-handler">
          <Button @click="getBack" class="back" type="text">返回
            <i style="font-size: 10px" class="iconfont icon-rightarrow"/>
          </Button>
        </div>
      </h2>
      <div :class="!disable ? 'see content account' : 'content account'">
        <div class="title-line-tag">
          <span style="font-weight: bold;font-size:16px">创意所属广告主信息</span>
          <a v-if="from==='log'" :href="'/audit/account/detail?id='+advertiser_info.advertiser_id+'&type=edit&account_type=2'" style="color: #465CFE;margin-left:10px;font-size: 13px">复审广告主账号</a>
          <a v-else :href="'/audit/account/detail?id='+advertiser_info.advertiserid+'&type=edit&account_type=2'" style="color: #465CFE;margin-left:10px;font-size: 13px">复审广告主账号</a>
        </div>
        <Form class="audit_content" label-position="left" :label-colon="true"
              :label-width="130">
          <div class="form_content">
            <FormItem class="accountForm" label="广告主名称（ID）">
              <p v-if="from==='log'" class="text">{{advertiser_info.advertiser_name}}（{{advertiser_info.advertiser_id}}）</p>
              <p v-else class="text">{{advertiser_info.advertisername}}（{{advertiser_info.advertiserid}}）</p>
            </FormItem>
            <FormItem class="accountForm" label="审核结果">
              <div v-if="from==='log'">
               <p v-if="advertiser_info.advertiser_status===4" class="text" style="color: #F1A32E">待审核</p>
               <p v-if="advertiser_info.advertiser_status===1" class="text" style="color: #67C23A">审核通过</p>
               <p v-if="advertiser_info.advertiser_status===2" class="text" style="color: #F93D3D">已停用</p>
               <p v-if="advertiser_info.advertiser_status===3" class="text" style="color: #F93D3D">资质待完善</p>
               <p v-if="advertiser_info.advertiser_status===5" class="text" style="color: #F93D3D">审核未通过</p>
              </div>
              <div v-else>
                <p v-if="advertiser_info.status===4" class="text" style="color: #F1A32E">待审核</p>
                <p v-if="advertiser_info.status===1" class="text" style="color: #67C23A">审核通过</p>
                <p v-if="advertiser_info.status===2" class="text" style="color: #F93D3D">已停用</p>
                <p v-if="advertiser_info.status===3" class="text" style="color: #F93D3D">资质待完善</p>
                <p v-if="advertiser_info.status===5" class="text" style="color: #F93D3D">审核未通过</p>
              </div>
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
              <p class="text">{{advertiser_info.bl_begin_time}}至{{advertiser_info.bl_end_time}}</p>
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
              <p class="text">{{advertiser_info.icp_begin}}至{{advertiser_info.icp_end}}</p>
            </FormItem>
          </div>
          <div class="form_content">
            <FormItem class="accountForm" label="行业类型">
              <p class="text">{{ruleForm.category_text || '-'}}</p>
            </FormItem>
          </div>
          <div class="form_table">
            <FormItem class="accountForm" label="行业资质" style="margin-bottom: 30px">
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
        </Form>
        <div class="title-line-tag">
          <span style="font-weight: bold;font-size:16px">创意信息</span>
        </div>
        <Form class="audit_content" style="padding-bottom: 30px" label-position="left" :label-colon="true"
              :label-width="130">
          <div class="form_content">
            <FormItem class="accountForm" label="创意包名称">
              <p class="text">{{creative_info.creative_name || '-'}}</p>
            </FormItem>
            <FormItem class="accountForm" label="创意形式">
              <p class="text">{{creativeId2Text(creative_info.creative_type) || '-'}}</p>
            </FormItem>
            <FormItem class="accountForm" label="广告交互">
              <p class="text" v-if="creative_info.ad_interaction ===1">跳转落地页</p>
              <p class="text" v-if="creative_info.ad_interaction ===2">下载应用</p>
            </FormItem>
            <FormItem v-if="creative_info.ad_interaction ===1" class="accountForm" label="落地页链接">
              <p class="text">{{creative_info.landing_page || '-'}}</p>
            </FormItem>
            <FormItem v-if="creative_info.ad_interaction ===2" class="accountForm" label="下载链接">
              <p class="text">{{creative_info.landing_page || '-'}}</p>
            </FormItem>
            <FormItem class="accountForm" label="标题">
              <p class="text">{{creative_info.title || '-'}}</p>
            </FormItem>
            <FormItem class="accountForm" label="描述">
              <p class="text">{{creative_info.des || '-'}}</p>
            </FormItem>
            <FormItem v-show="creative_info.app_deep_link" class="accountForm" label="直达地址">
              <p class="text">{{creative_info.app_deep_link || '-'}}</p>
            </FormItem>
            <FormItem v-show="creative_info.button_text" class="accountForm" label="按钮文字">
              <p class="text">{{creative_info.button_text || '-'}}</p>
            </FormItem>
            <FormItem v-show="creative_info.promote_product" class="accountForm" label="应用名称">
              <p class="text">{{creative_info.promote_product || '-'}}</p>
            </FormItem>
            <FormItem v-show="creative_info.mobile_app_package_name" class="accountForm" label="应用包名">
              <p class="text">{{creative_info.mobile_app_package_name || '-'}}</p>
            </FormItem>
          </div>
          <div class="form_content">
            <FormItem v-if="creative_info.logo_url" class="accountForm" label="产品Logo">
              <div  class="account_img" style="width: 72px;height: 72px;line-height: 72px"
                   @mouseenter="enter('Logo')" @mouseleave="leave">
                <img class="imgs" :src="creative_info.logo_url" alt="">
                <div style="width: 72px;height: 72px;line-height: 72px" v-show="seen && 'Logo'===current"
                     class="account_shade" @click="showImg(creative_info.logo_url)">
                  <div class="blow">
                    <i class="icon icon-zoom-up"/>
<!--                    <p>放大查看</p>-->
                  </div>
                </div>
              </div>
            </FormItem>
            <FormItem class="accountForm" label="应用icon">
              <div v-if="creative_info.icon_url" class="account_img" style="width: 72px;height: 72px;line-height: 72px"
                   @mouseenter="enter('icon')" @mouseleave="leave">
                <img class="imgs" :src="creative_info.icon_url" alt="">
                <div style="width: 72px;height: 72px;line-height: 72px" v-show="seen && 'icon'===current"
                     class="account_shade" @click="showImg(creative_info.icon_url)">
                  <div class="blow">
                    <i class="icon icon-zoom-up"/>
<!--                    <p>放大查看</p>-->
                  </div>
                </div>
              </div>
              <div v-else>-</div>
            </FormItem>
          </div>
          <div class="form_content" v-show="creative_info['video_url']">
            <FormItem class="accountForm" label="视频">
              <div class="account_img account_video" style="width: 240px;height: 135px;line-height: 135px"
                   @mouseenter="enter('video')" @mouseleave="leave">
                <video :src="creative_info['video_url']" controls></video>
                <div style="width: 240px;height: 135px;line-height: 135px" v-show="seen && 'video'===current"
                     class="account_shade" @click="showImg(creative_info.video_url)">
                  <div class="blow">
                    <i class="icon icon-zoom-up"/>
                    <p>放大查看</p>
                  </div>
                </div>
              </div>
            </FormItem>
            <FormItem class="accountForm" label="视频封面图">
              <div class="account_img" style="width: 240px;height: 135px;line-height: 135px"
                   @mouseenter="enter('video_img')" @mouseleave="leave">
                <img class="imgs" :src="creative_info.cover_url" alt="">
                <div style="width: 240px;height: 135px;line-height: 135px" v-show="seen && 'video_img'===current"
                     class="account_shade" @click="showImg(creative_info.cover_url)">
                  <div class="blow">
                    <i class="icon icon-zoom-up"/>
                    <p>放大查看</p>
                  </div>
                </div>
              </div>
            </FormItem>
          </div>
          <div class="form_table" v-show="creative_info['pic_url_arr']">
            <FormItem class="accountForm" label="图片" style="margin-bottom: 0px">
              <div style='display:flex'>
                <div class="img_list" v-for="(item,index) in creative_info.pic_url_arr" :key="'图片'+index">
                  <div class="account_img" style="width: 152px;height: 102px;line-height: 102px"
                       @mouseenter="enter('img_list'+index)" @mouseleave="leave">
                    <img class="imgs" :src="item" alt="">
                    <div style="width: 152px;height: 102px;line-height: 102px"
                         v-show="seen && 'img_list'+index===current"
                         class="account_shade" @click="showImg(item)">
                      <div class="blow">
                        <i class="icon icon-zoom-up"/>
                        <p>放大查看</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormItem>
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
                <Radio :label="2">
                  <span>拒绝</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem v-show="verify.internal_verify===2" style="width: 100%" class="accountForm" label="拒绝原因"
                      prop="reason">
              <Input v-model.trim="verify.reason" @input="verify.reason = verify.reason.replace(/'/g,'')" maxlength="50" show-word-limit type="textarea" placeholder="不超过50字"
                     style="height:120px;width: 500px"/>
            </FormItem>
          </div>
          <div v-else>
            <div v-if="from==='log'">
              <div class="form_content">
                <FormItem class="accountForm" label="审核状态">
                  <p v-if="creative_info.status===1" class="text" style="color: #67C23A">审核通过</p>
                  <p v-if="creative_info.status===2" class="text" style="color: #F93D3D">已拒绝</p>
                </FormItem>
              </div>
              <div class="form_content">
                <FormItem v-show="creative_info.status===2" class="accountForm" style="width: 100%" label="拒绝原因">
                  <p v-if="creative_info.note">{{creative_info.note}}</p>
                  <p v-else>-</p>
                </FormItem>
              </div>
            </div>
            <div v-else>
              <div class="form_content">
                <FormItem class="accountForm" label="审核状态">
                  <p v-if="creative_info.internal_verify===0" class="text" style="color: #F1A32E">待审核</p>
                  <p v-if="creative_info.internal_verify===1" class="text" style="color: #67C23A">审核通过</p>
                  <p v-if="creative_info.internal_verify===2" class="text" style="color: #F93D3D">已拒绝</p>
                </FormItem>
              </div>
              <div class="form_content">
                <FormItem v-show="creative_info.internal_verify===2" class="accountForm" style="width: 100%" label="拒绝原因">
                  <p v-if="creative_info.status_desc">{{creative_info.status_desc}}</p>
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
  import {getCreativeInfo, saveCreativeVerify, getCreativeRecords} from '@/api/audit'
  import {showTitle} from '@/libs/util'
  import {getQualifiedCols} from '../common/colList'

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
        advertiser_info: {},
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
        creative_info_id: this.$route.query.creative_info_id ? Number(this.$route.query.creative_info_id) : '',
        disable: this.$route.query.type !== 'see',
        from: ''
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
       * [creativeId2Text 创意形式]
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      creativeId2Text(id) {
        let _styleArr = this.$store.state.app.adStyleData // 广告样式
        let _sceneArr = this.$store.state.app.adSceneData // 广告场景

        let styleResult = _styleArr.filter(item => item.id === id) // 筛选出样式
        let sceneResult = styleResult.length ? _sceneArr.filter(item => item.id === styleResult[0].parentId) : []

        return (styleResult[0] && sceneResult[0]) ? `${sceneResult[0].title} - ${styleResult[0].title}` : '-'
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
      /**
       * [getTimeData 获取详情页面的数据]
       * @return {[type]} [description]
       */
      getCreativeList() {
        let creative_info_id = this.creative_info_id
        getCreativeInfo({
          creative_info_id
        }).then(res => {
          if (res.code === 200) {
            this.ruleForm = res.data
            this.creative_info = res.data.creative_info
            this.advertise_qualification = res.data.advertise_qualification
            this.advertiser_info = res.data.advertiser_info
            this.verify.internal_verify = res.data.creative_info.internal_verify === 2 ? 2 : 1
            this.verify.reason = res.data.creative_info.internal_verify === 2 ? res.data.creative_info.status_desc : ''
            res.data.creative_info.internal_verify === 2 ? this.ruleStatus = true : this.ruleStatus = false
            this.app = res.data.app
          }
        })
      },
      getLogData() {
        let record_id_arr = []
        record_id_arr.push(this.creative_info_id)
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.record_id_arr = record_id_arr
        getCreativeRecords(obj).then(res => {
          if (res.code === 200) {
            let data = res.data.list[0]
            this.creative_info = data
            this.advertiser_info = data
            this.advertise_qualification = data.advertiser_qualification
            let name = data.category.category_name
            let childrenName = data.category_sub.category_name
            if (childrenName) {
              this.ruleForm.category_text = name + '-' + childrenName
            } else {
              this.ruleForm.category_text = name
            }
          }
        })
      },
      // 提交审核的理由
      submitVerify(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.toSave()
          }
        })
      },
      toSave() {
        this.submitClock = true
        let obj = {}
        obj.buyer_creativeid = Number(this.creative_info_id)
        obj.internal_verify = Number(this.verify.internal_verify)
        obj.reason = this.verify.reason
        saveCreativeVerify(obj).then(res => {
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
      let from = this.$route.query.form
      this.from = this.$route.query.form
      if (from === 'log') {
        this.getLogData()
      } else {
        this.getCreativeList()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../common/detail.styl';
</style>
