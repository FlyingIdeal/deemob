<template>
  <div class="page-main">
    <div class="edit-content-card">
      <div class="page-detail-title clearfix">
        <h2 v-show="!disable && !copy_id">{{headTitle}}</h2>
        <h2 v-show="!disable && copy_id">复制广告单元</h2>
        <h2 v-show="disable">编辑广告单元</h2>
      </div>
      <div class="appDetail">
        <Form ref="editUnit" :label-colon="true" :model="editUnit" :rules=" !freqStatus ? rules  : rulesFrep " :label-width="labelWidth">
          <div class="unitContent">
            <div class="title-line-tag">广告单元设置</div>
            <div class="unitForm">
              <FormItem class="formInput" label="广告活动名称" prop="campaign_id">
                <Select
                  filterable
                  :label-in-value="true"
                  :disabled="disable"
                  v-model="editUnit.campaign_id"
                  placeholder="请选择广告活动名称"
                  @on-change="campaignChange"
                >
                  <Option v-for="item in activityList" :tag="item.freq_type" :key="'活动'+item.campaignid"
                          :value="item.campaignid">{{ item.campaignname }}</Option>
                </Select>
              </FormItem>
              <FormItem class="formInput" label="广告单元名称" prop="order_name">
                <Input type="text" :disabled="disable" :maxlength="100" show-word-limit v-model.trim="editUnit.order_name"/>
              </FormItem>
              <FormItem label="结算方式" prop="billing_method">
                <RadioGroup v-model="editUnit.billing_method" type="button" @on-change="billingChnage">
                  <Radio class="i-width-checkbtn" :disabled="disable" :label="0">CPM</Radio>
                  <Radio class="i-width-checkbtn" :disabled="disable" :label="2">CPC</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="广告交互" prop="ad_interactive">
                <RadioGroup v-model="editUnit.ad_interactive" type="button" @on-change="interactiveChange">
                  <Radio class="i-width-checkbtn" :disabled="disable" :label="1">跳转落地页</Radio>
                  <Radio class="i-width-checkbtn" :disabled="disable" :label="2">下载应用</Radio>
                  <Radio class="i-width-checkbtn" :disabled="disable" :label="3">拨打电话</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="转化目标">
                <Button class="xuan" @click="tailModalStatus">选择</Button>
                <a class="xuan_a" target="_blank" href="/tool/site/app/edit">去创建转化目标 ></a>
                <p v-show="editUnit.sid" style="color:#465cfe">转化名称： {{tail.sidName}}</p>
              </FormItem>
            </div>
          </div>
          <div class="unitContent">
            <div class="title-line-tag">广告版位</div>
            <div class="unitForm">
              <FormItem label="选择创意形式" prop="creative_type">
                <div style="display:flex">
                  <div class="scene-card clearfix" :class="{ 'scene-card-disabled': disable }">
                    <template v-for="item in filterSceneData">
                      <div class="scene-child" :key="item.id" :class="editUnit.ad_type_id == item.id ? 'active' : ''"
                           @click="chooseScene(item)">
                        <div class="scene-icon">
                          <img :src="getSceneImgUrl(item.icon)">
                        </div>
                        <div class="scene-intro">
                          <h4>{{item.title}}</h4>
                          <p>{{item.intro}}</p>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="style-card clearfix" style="width:410px" :class="{ 'style-card-disabled': disable }">
                    <template v-for="(item, index) in styleData">
                      <div class="style-child" :key="item.id"
                           :class="[item.hover ? 'hover' : '', editUnit.creative_type == item.id ? 'active' : '']"
                           @mouseenter="styleAdHover(item, index)" @mouseleave="styleAdLeave(item, index)"
                           @click="chooseStyle(item, index)">
                        <div class="style-icon">
                          <img :src="getStyleImgUrl(item)">
                        </div>
                        <div class="style-intro">
                          <h4>{{item.title}}</h4>
                          <!--                          <p>{{item.intro}}</p>-->
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="ad-right-content" v-if="demoSrc">
                    <div class="mobile-card">
                      <div class="mobile-center">
                        <img :src="demoSrc">
                      </div>
                    </div>
                  </div>
                </div>
              </FormItem>
              <FormItem label="广告位的选择" prop="joomob_adslotid_in">
<!--                <RadioGroup v-model="editUnit.advertiseStatus" type="button">-->
<!--                  <Radio class="i-width-checkbtn" :label="1">不限</Radio>-->
<!--                  <Radio class="i-width-checkbtn" :label="2">选择广告位</Radio>-->
<!--                </RadioGroup>-->
                <div style="margin-top:10px">
                  <retarget-muti-cascader-ad-slot ref="proCity"
                                               class="m-l-20"
                                               v-model="editUnit.joomob_adslotid_in"
                                               :datas="slotList"
                                                  :warnWidth="warnWidth"
                                               :data="slotList"
                                                :titleLoading="adTitle"
                                                :order="orderText"
                                               :title="adslotString"
                                               @input="updateMuti"
                                               @name="updateAdvertising"/>
                </div>
                <p v-show="disable" class="toolText">请谨慎修改广告位，修改后可能会导致已关联的创意素材尺寸与广告位不一致，广告无法正常投放！</p>
              </FormItem>

            </div>
          </div>
          <div class="unitContent">
            <div class="title-line-tag">定向设置</div>
            <div class="unitForm">
              <FormItem label="地域" prop="regionStatus">
                <RadioGroup v-model="editUnit.regionStatus" type="button">
                  <Radio class="i-width-checkbtn" :label="1">不限</Radio>
                  <Radio class="i-width-checkbtn" :label="2">按省市</Radio>
                </RadioGroup>
                <div v-show="editUnit.regionStatus === 2" style="margin-top:10px">
                  <retarget-muti-cascader-ad-slot ref="proCity"
                                               class="m-l-20"
                                               v-model="editUnit.region_in"
                                               :datas="provinceCityList"
                                               :title="cityString"
                                                :order="orderText"
                                               :childrenTitle="cityChildren"
                                               @input="updateMuti"
                                               @name="updateMutiCity"/>
                </div>
              </FormItem>
              <!--              <FormItem label="用户系统语言" prop="lang_in">-->
              <!--                <RadioGroup v-model="editUnit.lang_in" type="button">-->
              <!--                  <Radio label="中文,英文">不限</Radio>-->
              <!--                  <Radio label="中文">中文</Radio>-->
              <!--                  <Radio label="英文">英文</Radio>-->
              <!--                </RadioGroup>-->
              <!--              </FormItem>-->
              <FormItem label="操作系统" prop="os_in">
                <RadioGroup v-model="editUnit.os_in" type="button">
                  <Radio class="i-width-checkbtn" :disabled="!disableOs || disable" label="ios,android">不限</Radio>
                  <Radio class="i-width-checkbtn" :disabled="!disableOs || disable" label="ios">IOS</Radio>
                  <Radio class="i-width-checkbtn" :disabled='disable' label="android">安卓</Radio>
                </RadioGroup>
                <div v-show="false" style="margin-top:10px">
                  <div v-show="editUnit.os_in==='ios'">
                    <retarget-muti-cascader-city ref="proCity"
                                                 class="m-l-20"
                                                 v-model="editUnit.regionIosIn"
                                                 :datas="IosVersion"
                                                 :title="'IOS'+regionString"
                                                 @input="updateMuti"
                                                 @name="updateMutiName"/>
                  </div>
                  <div v-show="editUnit.os_in==='android'">
                    <retarget-muti-cascader-city ref="proCity"
                                                 class="m-l-20"
                                                 v-model="editUnit.regionAndroidIn"
                                                 :datas="AndroidVersion"
                                                 :title="'Android'+regionString"
                                                 @input="updateMuti"
                                                 @name="updateMutiName"/>
                  </div>
                </div>
              </FormItem>
              <FormItem label="手机品牌" prop="brandStatus">
                <RadioGroup v-model="editUnit.brandStatus" type="button">
                  <Radio class="i-width-checkbtn" :label="1">不限</Radio>
                  <Radio class="i-width-checkbtn" :label="2">按品牌</Radio>
                </RadioGroup>
                <div style="margin-top:10px" v-show="editUnit.brandStatus === 2">
                  <retarget-muti-cascader-ad-slot ref="proCity"
                                               class="m-l-20"
                                               v-model="editUnit.phoneArr"
                                               :datas="editUnit.os_in==='android'? AndroidBrandList :editUnit.os_in==='ios' ? IosBrandList : brandList"
                                               :title="phoneString"
                                               :order="orderText"
                                               :childrenTitle="phoneChildren"
                                               @input="updateMuti"
                                               @name="updateBrandName"/>
                </div>
              </FormItem>
              <FormItem label="联网方式" prop="network_in">
                <CheckboxGroup class="private-check-card" v-model="editUnit.network_in" @on-change="checkNetWorkChange">
                  <Checkbox class="i-width-checkbtn" label="不限" border>不限</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="1" border>2G</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="2" border>3G</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="3" border>4G</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="4" border>5G</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="5" border>WIFI</Checkbox>
                </CheckboxGroup>
              </FormItem>
              <FormItem label="运营商" prop="carrier_in">
                <CheckboxGroup class="private-check-card" v-model="editUnit.carrier_in" @on-change="checkCarrierChange">
                  <Checkbox class="i-width-checkbtn" label="不限" border>不限</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="移动" border>移动</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="46003" border>电信</Checkbox>
                  <Checkbox class="i-width-checkbtn" label="46001" border>联通</Checkbox>
                </CheckboxGroup>
              </FormItem>
              <FormItem label="自定义人群" prop="tag_orientation">
                <RadioGroup v-model="editUnit.tag_orientation" type="button">
                  <Radio class="i-width-checkbtn" :label="1">不限</Radio>
                  <Radio class="i-width-checkbtn" :label="2">定向人群</Radio>
                </RadioGroup>
                <div v-show="editUnit.tag_orientation === 2" style="margin-top:10px">
                  <div class="tag-select">
                    <Select
                      multiple
                      filterable
                      :max-tag-count="1"
                      :label-in-value="true"
                      :max-tag-placeholder="limitText"
                      @on-change="tagSelectChange"
                      v-model="editUnit.retarget_in"
                      placeholder="请选择人群标签"
                    >
                      <Option v-for="item in tagList" :value="item.code" :key="item.code">{{item.name}}</Option>
                    </Select>
                  </div>
                  <div class="tag-check">
                    <div class="tag-item" v-for="(item, index) in hasCheckTag"><span>{{item.label}}</span><i class="iconfont icon-close" @click="toggleTag(item)"></i></div>
                  </div>
                </div>
              </FormItem>
            </div>
          </div>
          <div class="unitContent" style="border-bottom: 0px">
            <div class="title-line-tag">预算与出价</div>
            <div class="unitForm">
              <FormItem class="formInput" label="预算" prop="budget">
                <Input v-model="editUnit.budget">
                  <Select :disabled="disable" v-model="editUnit.budget_type" slot="prepend" style="width: 80px">
                    <Option :value="0">总预算</Option>
                    <Option :value="1">日预算</Option>
                  </Select>
                </Input>
              </FormItem>
              <FormItem label="投放方式" prop="putin_method">
                <RadioGroup v-model="editUnit.putin_method" type="button">
                  <Radio class="i-width-checkbtn" :disabled="disable" :label="1">均速</Radio>
                  <Radio class="i-width-checkbtn" :disabled="disable" :label="2">加速</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="投放日期" prop="end_date">
                <DatePicker prop="begin_date"
                            @on-change="timeChangeBegin"
                            :options="startOption"
                            type="date" :value="editUnit.begin_date" placeholder="请输入开始时间" style="width: 200px"/>
                <span style="margin: 0 10px">至</span>
                <DatePicker prop="end_date"
                            @on-change="timeChangeEnd"
                            :options="endOption"
                            type="date" :value="editUnit.end_date" placeholder="请输入结束时间" style="width: 200px"/>
              </FormItem>
              <FormItem label="投放时段" prop="any_time">
                <RadioGroup v-model="editUnit.any_time" type="button" @on-change="timeChange">
                  <Radio class="i-width-checkbtn" :label="0">不限</Radio>
                  <Radio class="i-width-checkbtn" :label="1">指定时段</Radio>
                </RadioGroup>
                <div v-show="editUnit.any_time===1" class="assignTime" style="margin-top:10px">
                  <div class="time_xuan">
                    <ry-time-sheet v-model="week" :empty="emptyNum"/>
                  </div>
                  <div class="time_select">
                    <div class="header">
                      <span>已选时间段</span>
                      <span @click="emptyTime" style="color:#465CFE">清空</span>
                    </div>
                    <div class="time_content">
                      <div v-if="weekText.length>0" class="content">
                        <div v-for="(item,index) in weekText" :key="'时间'+ index" class="time_list">
                          <span class="time_title">{{item.name}}:</span>
                          <span class="time_data">
                            <span v-for="(it,i) in item.text" :key="'时间段'+ i">{{it}} <span
                              v-if="i<item.text.length-1">、</span></span>
                          </span>
                        </div>
                      </div>
                      <div class="no_data" v-else>
                        <img style="margin-top:80px" width="60" src="~@/assets/image/icon/no_data.jpg" alt="">
                        <p>暂未选择</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FormItem>
              <div v-show="!freqStatus">
                <FormItem label="频控类别" prop="freq_vc">
                  <RadioGroup v-model="editUnit.freq_vc" type="button">
                    <Radio class="i-width-checkbtn" :disabled="disable" :label="0">展现频控</Radio>
                    <Radio class="i-width-checkbtn" :disabled="disable" :label="1">点击频控</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem class="formInput" label="频次" prop="freq">
                  <Input v-model="editUnit.freq">
                    <Select :disabled="disable" v-model="editUnit.freq_period" slot="prepend" style="width: 80px">
                      <Option :value="0">每小时</Option>
                      <Option :value="1">每天</Option>
                      <Option :value="2">每月</Option>
                    </Select>
                  </Input>
                </FormItem>
              </div>
              <FormItem label="出价" prop="bidprice">
                <Input style="width:480px" v-model="editUnit.bidprice"/>
                <span style="margin-left:10px">元</span>
                <!--                <span style="color:#999999;fontSize:13px">(建议出价 1~5 元/千次曝光)</span>-->
              </FormItem>
            </div>
          </div>
        </Form>
      </div>
    </div>
    <div class="detail-save-card">
      <div class="detail-save-center" :style="`margin-left: ${labelWidth}px`">
        <Button @click="getBack">取消</Button>
        <Button type="primary" :loading="submitClock" @click="submitUnit('editUnit',1)">
          <span v-if="!submitClock">保存</span>
          <span v-else>保存中...</span>
        </Button>
        <Button type="primary" :loading="submitClockTo" @click="submitUnit('editUnit',2)">
          <span v-if="!submitClockTo">保存并新建广告</span>
          <span v-else>保存中...</span>
        </Button>
      </div>
    </div>
    <Modal
      v-model="tailModal"
      title="转化跟踪"
      class="tailModal"
      width="900"
    >
      <div class="content">
        <div class="console-table">
          <Table highlight-row stripe border :columns="colTail" :data="colList" max-height="400">
            <template slot-scope="{ row }" slot="action">
              <Button @click="selectedSid(row)" type="text">选择</Button>
            </template>
          </Table>
          <div class="page-center">
            <Page show-total show-sizer show-elevator placement="top" :total="tail.total_count"
                  :current.sync='tail.currentPage'
                  :page-size="tail.pageSize" @on-change="tailNumChange" @on-page-size-change="tailSizeChange"/>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import RyTimeSheet from '@/components/ry-time-sheet/timeSheet.vue'
  import retargetMutiCascaderCity from '@/components/retarget-cascader-city'
  import retargetMutiCascaderAdSlot from '@/components/cascader-retarget'
  import {getAdCampaignList, getAdUnitList, saveUnitApi, editUnitApi, getCrowdTagList} from '@/api/advertising'
  import {getToolSiteList} from '@/api/tool'
  import {getTailCols, formRules} from '../colList'
  import {getOSinfo, getMobileBrand, getAppList, getDspSlotList, getProvinceCityApi, getCrowdTagListApi} from '@/api/common'

  export default {
    name: 'appEdit',
    components: {retargetMutiCascaderCity, RyTimeSheet, retargetMutiCascaderAdSlot},
    mixins: [formRules],
    data() {
      return {
        warnWidth: '预警中心',
        orderText: 'first',
        labelWidth: 114, // 左侧宽度
        emptyNum: false,
        colTail: getTailCols(this),
        colList: [],
        tail: {
          pageSize: 10,
          total_count: 0,
          currentPage: 1,
          sidName: ''
        },
        adTitle: '加载中',
        startOption: {
          // 指定开始限制时间
          disabledDate: (date) => {
            let data = this.editUnit.end_date === '' ? '' : this.editUnit.end_date
            if (data) {
              return date >= Date.parse(new Date(data))
            } else {
            }
          }
        },
        endOption: {
          // 指定终止日期
          disabledDate: (date) => {
            let data = this.editUnit.begin_date === '' ? '' : this.editUnit.begin_date
            let dataTime = Date.parse(new Date(data)) - 24 * 3600 * 1000
            if (data) {
              return dataTime > date
            } else {

            }
          }
        },
        week: '',
        submitClock: false,
        submitClockTo: false,
        tailModal: false,
        activityList: [],
        filterSceneData: [], // 广告场景
        styleData: [], // 广告 样式
        inputVisible: false, // 人群定向的判断
        inputValue: '', // 人群定向的修改
        editUnit: {
          campaign_id: this.$route.query.campaignId ? Number(this.$route.query.campaignId) : '',
          putin_method: 1,
          billing_method: this.$route.query.billing ? Number(this.$route.query.billing) : 0,
          sidName: '',
          order_name: '',
          ad_interactive: 1, // 广告交互
          sid: '', // 转换目标
          budget_type: 1, // 预算方式
          budget: '', // 预算金额
          freq_vc: 1, // 频控类别
          freq_period: 1, // 频次控制周期
          freq: '', // 频次控制次数
          bidprice: '', // 出价
          any_time: 0, // 限制投放时间
          begin_date: '', // 开始时间
          end_date: '', // 结束时间
          advertiseStatus: 1, // 广告位的判断
          regionStatus: 1, // 地域的状态
          regionIosIn: [], // ios操作系统
          regionAndroidIn: [], // ios操作系统
          lang_in: '中文,英文', // 用户系统语言
          os_in: 'ios,android', // 操作系统
          brandStatus: 1,
          brand_in: [],
          model_in: [],
          phoneArr: [],
          network_in: ['不限'],
          carrier_in: ['不限'],
          region_in: [],
          ad_type_id: 1, // 应用广告场景ID
          creative_type: this.$route.query.createType ? Number(this.$route.query.createType) : 160, // 广告素材类型
          joomob_adslotid_in: [], // 广告位的定向
          adslotid_in: [],
          hours_arr: [],
          week_day: [],
          tag_orientation: 1, // 人群定向的状态
          retarget_in: [] // 人群定向的参数
        },
        catchSelectScene: '', // 缓存选中的广告场景
        catchSelectStyle: '', // 缓存选中广告场景之后默认第一个广告样式
        demoTitle: '', // 手机框title
        demoSrc: '', // 手机demo预览图
        provinceList: [],
        phoneList: [],
        phoneString: '品牌',
        phoneChildren: '型号',
        regionString: '系统版本号',
        cityString: '省份',
        cityChildren: '城市',
        IosVersion: [], // ios操作系统版本号
        AndroidVersion: [], // android操作系统版本好
        IosBrandList: [], // 手机品牌
        AndroidBrandList: [], // 手机品牌
        brandList: [],
        provinceCityList: [],
        slotList: [], // 广告位的名称
        adslotString: '应用',
        adslotChildren: '广告位',
        orderId: this.$route.query.orderId ? Number(this.$route.query.orderId) : '',
        disable: !!this.$route.query.orderId,
        copy_id: this.$route.query.copy_id ? Number(this.$route.query.copy_id) : '',
        weekText: [],
        disableOs: true,
        freqStatus: false, // 判断频控的展示
        citySelect: [],
        advertiseNum: 0,
        tagList: [], // 人群定向的列表
        hasCheckTag: [] // 已选择的标签
      }
    },
    computed: {
      // 选择广告渲染方式
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    watch: {
      week: {
        handler: function (v) {
          if (v) {
            let result = ''
            let hour = []
            for (let i = 1, len = v.length; i <= len; i++) {
              result += v[i - 1]
              if (i != 0 && i % 24 == 0 && i != 168) {
                result += ','
              }
            }
            hour = result.split(',')
            let week = hour.map(item => {
              if (item.includes('1')) {
                return 1
              } else {
                return 0
              }
            })
            let weekText = hour.map((item, index) => {
              if (item.includes('1')) {
                let obj = {}
                obj.name = index === 0 ? '周一' : index === 1 ? '周二' : index === 2 ? '周三' : index === 3 ? '周四' : index === 4 ? '周五' : index === 5 ? '周六' : '周天'
                obj.text = []
                for (let i = 0; i < item.length; i++) {
                  if (item[i] === '1') {
                    let text = i + ':00~' + (i + 1) + ':00'
                    obj.text.push(text)
                  }
                }
                return obj
              } else {
                return ''
              }
            })
            let weekTextArr = weekText.filter(function (s) {
              return s.name
            })
            this.weekText = weekTextArr
            let str = week.toString().replace(/,/g, '')
            this.editUnit.hours_arr = hour
            this.editUnit.week_day = str
          }
        }
      }

    },
    created() {
      this.inData()
      if (this.$route.query.campaignId) {
        this.getActivityIndex(this.$route.query.campaignId)
      }
    },
    methods: {
      inData() {
        this.$Spin.show()
        this.getIOSListApi() // 获取ios的操作系统
        this.getProvinceCity() // 获取城市的定向
        this.getAndroidListApi() // 获取Android操作系统
        this.getBrandListApi() // 获取品牌定向
        this.getAppSlotList() // 获取应用和广告位
        this.getActivityList() // 获取广告活动的列表
        this.getSceneFilterList() // 筛选当前媒体下的广告场景
        this.getStyleFilterList({isClick: false}) // 筛选当前场景下的广告样式
        this.getModalList() // 获取目标文件
        this.getCrowdTagList() // 获取标签列表
      },
      /**
       * [getCrowdTagList 获取标签列表]
       * @param  {[type]} query [description]
       * @return {[type]}       [description]
       */
      getCrowdTagList(query) {
        getCrowdTagListApi().then(res => {
          if (res.code === 200) {
            this.tagList = res.data.list || []
          }
        })
      },
      /**
       * [limitText 剩余项数量]
       * @param  {[type]} count [description]
       * @return {[type]}       [description]
       */
      limitText(count) {
        return `${count}+`
      },
      /**
       * [toggleTag 删除标签]
       * @return {[type]} [description]
       */
      toggleTag(item) {
        if (this.disabled) {
          return
        }

        let concatName = item.value
        let index = this.editUnit.retarget_in.indexOf(concatName)

        if (index > -1) {
          this.editUnit.retarget_in.splice(index, 1)
        }
      },
      /**
       * [tagSelectChange 清空标签列表]
       * @return {[type]} [description]
       */
      tagSelectChange(arr) {
        if (arr.length > 5) {
          this.$Message.error('人群标签不允许超过5条')
          this.editUnit.retarget_in.pop()
        } else {
          this.hasCheckTag = arr
        }
      },

      /**
       * [campaignChange 广告活动修改之后]
       * @return {[type]} [description]
       */
      campaignChange(val) {
        if (val.tag === 1) {
          this.freqStatus = true
        } else {
          this.freqStatus = false
        }
        this.$nextTick(() => {
          this.$refs['editUnit'].fields.forEach((e) => {
            e.validateState = ''
            e.validateMessage = ''
            this.$set(e, 'isRequired', !!e.prop)
          })
        })
      },
      updateMuti(val) {
      },
      updateMutiName(val) {
      },
      /**
       * [timeChange 时间段的修改]
       * @return {[type]} [description]
       */
      timeChange(val) {
        if (val === 1) {
          this.emptyNum = !this.emptyNum
        }
      },
      /**
       * [updateAdvertising 广告位选择的赋值]
       * @return {[type]} [description]
       */
      updateAdvertising(val) {
        let slot_arr = []
        val.map(item => {
          if (item.type === 'app') {
            item.children.map(it => {
              it.value ? slot_arr.push(it.value) : ''
            })
          } else {
            item.value ? slot_arr.push(item.value) : ''
          }
        })
        this.editUnit.adslotid_in = slot_arr
      },
      /**
       * [updateMutiCity 城市选择时的赋值]
       * @return {[type]} [description]
       */
      updateMutiCity(val) {
        let city_arr = []
        val.map(item => {
          if (item.type === 'cityChildren') {
            city_arr.push(item.value)
            if (item.children) {
              item.children.map(it => {
                city_arr.push(it.value)
              })
            }
          } else {
            city_arr.push(item.value)
          }
        })
        this.citySelect = city_arr
      },
      /**
       * [updateMutiCity 设备与设备型号时的赋值]
       * @return {[type]} [description]
       */
      updateBrandName(val) {
        let brand_in = [] // 设备的定向
        let model_in = [] // 设备型号的定向
        val.map(item => {
          if (item.type === 'phone_models') {
            model_in.push(item.value)
            brand_in.push(item.brand)
          }
          if (item.type === 'brand') {
            brand_in.push(item.value)
          }
        })
        let brandArr = Array.from(new Set(brand_in))
        this.editUnit.model_in = model_in
        this.editUnit.brand_in = brandArr
      },
      /**
       * [checkNetWorkChange 联网方式的选择]
       * @return {[type]} [description]
       */
      checkNetWorkChange(val) {
        if (val[0] === '不限' && val.length === 1) {
          this.editUnit.network_in = ['不限']
        } else if (val[val.length - 1] === '不限' && val.length > 1) {
          this.editUnit.network_in = ['不限']
        } else {
          this.editUnit.network_in = val.filter(item => {
            return item !== '不限'
          })
        }
      },
      /**
       * [checkCarrierChange 运营商的选择]
       * @return {[type]} [description]
       */
      checkCarrierChange(val) {
        if (val[0] === '不限' && val.length === 1) {
          this.editUnit.carrier_in = ['不限']
        } else if (val[val.length - 1] === '不限' && val.length > 1) {
          this.editUnit.carrier_in = ['不限']
        } else {
          this.editUnit.carrier_in = val.filter(item => {
            return item !== '不限'
          })
        }
      },
      /**
       * [emptyTime 清空时间的按钮]
       * @return {[type]} [description]
       */
      emptyTime() {
        this.emptyNum = !this.emptyNum
      },
      /**
       * [number2Thousand 保留两位小数]
       * @return {[type]} [description]
       */
      number2Thousand(num) {
        // 非零/ 正负无穷
        if (!num || num === Infinity || num === -Infinity) {
          return 0
        } else {
          if (Number.isInteger(num)) {
            return parseInt(num)
          } else {
            return num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') // 字符串
          }
        }
      },
      /**
       * [getTableList 编辑的时候获取元素]
       * @return {[type]} [description]
       */
      getTableList() {
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        let orderId = []
        this.disable ? orderId.push(this.orderId) : orderId.push(this.copy_id)
        obj.orderid_arr = orderId
        getAdUnitList(obj).then(res => {
          this.tableLoadFlag = false
          let data = res.data
          if (res.code === 200) {
            this.$Spin.hide()
            let select = data.list[0]
            let hour = new Date().getHours()
            let minute = (new Date().getMinutes()).toString()
            let date = hour + minute
            // 广告单元设置
            select.campaign_id = select.campaignid // 广告活动id
            select.order_name = this.disable ? select.ordername : select.ordername + '副本' + date // 广告单元名称
            select.budget = this.number2Thousand((select.budget) / 100)
            select.bidprice = this.number2Thousand((select.bidprice) / 100)
            if (select.sid) {
              this.getEditData(select.sid)
            }
            if (select.freq_type === 1) {
              this.freqStatus = true
            } else {
              this.freqStatus = false
            }
            // select.adslotid_in && select.adslotid_in.length > 0 ? select.advertiseStatus = 2 : select.advertiseStatus = 1 // 广告位状态
            select.joomob_adslotid_in = select.adslotid_in
            select.region_in && select.region_in.length > 0 ? select.regionStatus = 2 : select.regionStatus = 1 // 地域的状态
            // 用户系统语言
            // select.lang_in = (select.lang_in).toString()
            select.retarget_in && select.retarget_in.length > 0 ? select.tag_orientation = 2 : select.tag_orientation = 1 // 人群定向状态
            select.retarget_in && select.retarget_in.length > 0 ? '' : select.retarget_in = [] // 人群定向

            let os_in = select.os_in
            if (os_in) {
              if (os_in.length > 1) {
                select.regionIosIn = []
                select.regionAndroidIn = []
              } else {
                if (os_in.includes('ios')) {
                  select.regionIosIn = select.osversion_in
                  select.regionAndroidIn = []
                } else {
                  select.regionIosIn = []
                  select.regionAndroidIn = select.osversion_in
                }
              }
            }

            select.os_in = select.os_in ? (select.os_in).toString() : 'ios,android'
            select.brand_in && select.brand_in.length > 0 ? select.brandStatus = 2 : select.brandStatus = 1
            select.network_in ? select.network_in.length < 1 ? select.network_in = ['不限'] : '' : select.network_in = ['不限']
            select.carrier_in ? select.carrier_in.length < 1 ? select.carrier_in = ['不限'] : '' : select.carrier_in = ['不限']
            let carrier = select.carrier_in
            if (select.carrier_in.length > 2) {
              let carrierSelect = carrier.filter(function (s) {
                return s && s.trim() && s !== '46000' && s !== '46002' && s !== '46007'
              })
              carrierSelect.push('移动')
              select.carrier_in = carrierSelect
            } else {
              select.carrier_in = select.carrier_in
            }
            // if (select.brand_in || select.model_in) {
            //   let phoneArr = select.brand_in.concat(select.model_in)
            //   let phoneData = []
            //   this.brandList.map(item => {
            //     item.children.map(it => {
            //       if (phoneArr.includes(it.value)) {
            //         phoneData.push(it.brand)
            //       }
            //     })
            //   })
            //   let phoneDataArr = Array.from(new Set(phoneData))
            //   let phoneSelectData = Array.from(new Set([...phoneArr].filter(x => !phoneDataArr.includes(x))))
            //   select.phoneArr = phoneSelectData
            // }
            select.phoneArr = select.brand_in
            // 广告位的返显
            let _styleData = [...this.$store.state.app.adStyleData]
            let _arr = []
            _styleData.map(item => {
              if (item.id === select.creative_form_id) {
                select.ad_type_id = item.parentId
                this.catchSelectStyle = item
              }
            })
            _styleData.map(item => {
              if (item.parentId === select.ad_type_id) {
                _arr.push(item)
              }
            })
            let hour_arr1 = select.hours_arr.map(item => {
              return item.split('').reverse().join('')
            })
            let hours_arr = hour_arr1.toString().replace(/,/g, '')
            if (hours_arr.includes('0')) {
              select.any_time = 1
            }
            this.citySelect = select.region_in
            this.week = hours_arr
            select.creative_type = select.creative_form_id
            let allScene = [...this.$store.state.app.adSceneData]
            allScene.map(child => {
              // 缓存已选中场景
              if (child.id === select.ad_type_id) {
                this.catchSelectScene = child
              }
            })
            this.styleData = _arr // 样式列表
            this.setDemoSrcAndTitle() // 手机预览图的图片url和title
            this.editUnit = select
          }
        })
      },
      // 结算方式的修改
      billingChnage() {
        // this.getAppSlotList()
      },
      // 广告交互的选择
      interactiveChange(val) {
        if (val === 2) {
          this.disableOs = false
          this.editUnit.os_in = 'android'
        } else {
          this.disableOs = true
        }
      },
      /**
       * [getAppSlotList 获取应用以及广告位]
       * @return {[type]} [description]
       */
      getAppSlotList(type) {
        this.adTitle = '加载中'
        this.editUnit.joomob_adslotid_in = []
        let obj = {}
        let num = 0
        // obj.slot_price_type = this.editUnit.billing_method === 0 ? 0 : 1
        obj.slot_type = this.editUnit.creative_type
        getAppList(obj).then(res => {
          if (res.code === 200) {
            let appid = []
            let fatherList = res.data.list
            if (fatherList && fatherList.length > 0) {
              res.data.list.map(item => {
                appid.push(item.id)
              })
              getDspSlotList({
                app_id_arr: appid,
                // slot_price_type: this.editUnit.billing_method === 0 ? 0 : 1,
                slot_type: this.editUnit.creative_type
              }).then(data => {
                if (data.code === 200) {
                  let childrenList = data.data.list
                  data.data.list.map(list => {
                    num = num + 1
                    this.advertiseNum = num
                  })
                  this.setSlotData(fatherList, childrenList,type)
                }
              })
            } else {
              this.slotList = [{}]
              this.adTitle = '加载完成'
              if (type !== 'choose') {
                if (this.$route.query.orderId || this.$route.query.copy_id) {
                  this.getTableList()
                } else {
                  this.$Spin.hide()
                }
              }
            }
          }
        })
      },
      setSlotData(fatherList, childrenList,type) {
        fatherList.map(item => {
          item['label'] = item.app_name + '(' + item.id + ')'
          item['value'] = (item.id).toString()
          item['check'] = false
          item['little'] = false
          item['type'] = 'app'
          item['childrenName'] = '广告位'
          item['children'] = []
          childrenList.map(list => {
            if (list.app_id === item.id) {
              let obj = {}
              obj.value = 'joomob_' + (list.slot_id).toString()
              obj.label = list.slot_name + '(' + list.slot_id + ' ,' + list.creative_width + ':' + list.creative_height + ')'
              obj.type = 'slot'
              obj.check = false
              obj.little = false
              item['children'].push(obj)
            }
          })
          this.adTitle = '加载完成'
          this.slotList = fatherList
        })
        if (type !== 'choose') {
          if (this.$route.query.orderId || this.$route.query.copy_id) {
            this.getTableList()
          } else {
            this.$Spin.hide()
          }
        }
      },
      /**
       * [getProvinceCity 获取城市定向]
       * @return {[type]} [description]
       */
      getProvinceCity() {
        let country_id_arr = ['137100100100100']
        getProvinceCityApi({
          country_id_arr
        }).then(res => {
           if (res.code === 200) {
             let provinceArr = res.data.provinces
             let provinceList = provinceArr.map(i => {
               let obj = {}
               obj.value = (i.province_id).toString()
               obj.label = i.name
               obj.check = false
               obj.childrenName = '城市'
               obj.type = 'app'
               obj.little = false
               obj.children = []
               i.cities.map(item => {
                 let objs = {}
                 objs.value = (item.city_id).toString()
                 objs.label = item.name
                 objs.parent = i.name
                 objs.type = 'cityChildren'
                 objs.check = false
                 objs.little = false
                 obj.children.push(objs)
               })
               return obj
             })
             this.provinceCityList = provinceList
           }
        })
      },
      /**
       * [getBrandListApi 获取手机品牌]
       * @return {[type]} [description]
       */
      getBrandListApi() {
        getMobileBrand().then(res => {
          if (res.code === 200) {
            let resArr = res.data.list
            let AndroidBrandList = []
            let IosBrandList = []
            let brandList = []
            resArr.map(i => {
              let obj = {}
              obj.value = i.brand_en
              obj.label = i.brand_name
              obj.type = 'brand'
              obj.check = false
              obj.little = false
              // obj.children = []
              obj.childrenName = '型号'
              // i.phone_models.map(item => {
              //   let objs = {}
              //   objs.value = item.phone_model_id
              //   objs.label = item.phone_model_name
              //   objs.type = 'phone_models'
              //   objs.parent = i.brand_name
              //   objs.brand = i.brand_en
              //   objs.check = false
              //   objs.little = false
              //   obj.children.push(objs)
              // })
              if (i.brand_en !== 'apple') {
                AndroidBrandList.push(obj)
              } else {
                IosBrandList.push(obj)
              }
              brandList.push(obj)
            })
            this.IosBrandList = IosBrandList
            this.AndroidBrandList = AndroidBrandList
            this.brandList = brandList
          }
        })
      },
      /**
       * [getOSListApi 获取IOS操作系统]
       * @return {[type]} [description]
       */
      getIOSListApi() {
        let obj = {}
        obj.os = 2
        getOSinfo(obj).then(res => {
          if (res.code === 200) {
            let resArr = res.data.list
            let osList = resArr.map((i, index) => {
              let obj = {}
              obj.value = i.os_version
              obj.label = i.os_version
              obj.check = false
              obj.little = false
              return obj
            })
            this.IosVersion = osList
          }
        })
      },
      /**
       * [getAndroidListApi 获取Android操作系统]
       * @return {[type]} [description]
       */
      getAndroidListApi() {
        let obj = {}
        obj.os = 1
        getOSinfo(obj).then(res => {
          if (res.code === 200) {
            let resArr = res.data.list
            let osList = resArr.map((i, index) => {
              let obj = {}
              obj.value = i.os_version
              obj.label = i.os_version
              obj.check = false
              obj.little = false
              return obj
            })
            this.AndroidVersion = osList
          }
        })
      },
      // 获取目标文件
      getModalList() {
        getToolSiteList({
          page_size: this.tail.pageSize,
          page_num: this.tail.currentPage
        }).then(res => {
          if (res.code === 200) {
            // 拆分转化目标和备注
            let listData = res.data.list ? res.data.list : []
            if (listData && listData.length > 0) {
              listData.map(item => {
                let _split = item.note ? item.note.split('|') : []
                item.site_target = _split[0]
                item.note_textarea = _split[1]
              })
            }
            this.colList = listData
            this.tail.total_count = res.data.total
          }
        }, err => {
          this.tableLoadFlag = false
        })
      },
      // 获取编辑返显的名称
      getEditData(id) {
        getToolSiteList({
          page_size: this.tail.pageSize,
          page_num: this.tail.currentPage,
          sid: id
        }).then(res => {
          if (res.code === 200) {
            this.tail.sidName = res.data.list[0].site_name
            this.tail.total_count = res.data.total
          }
        })
      },
      // 点击选择转换目标
      tailModalStatus() {
        this.tail.pageSize = 10
        this.tail.currentPage = 1
        this.tailModal = true
        this.getModalList()
      },
      // 选择
      selectedSid(row) {
        this.editUnit.sid = row.sid
        this.tail.sidName = row.site_name
        this.tailModal = false
      },
      // 弹框中的分页
      tailNumChange(val) {
        this.tail.currentPage = val
        this.getModalList()
      },
      tailSizeChange(num) {
        this.tail.pageSize = num
        this.getModalList()
      },
      timeChangeBegin(e) {
        this.editUnit.begin_date = e
      },
      timeChangeEnd(e) {
        this.editUnit.end_date = e
      },
      /**
       * [getSceneFilterList 筛选当前媒体下的广告场景]
       * @return {[type]} [description]
       */
      getSceneFilterList() {
        let allScene = [...this.$store.state.app.adSceneData]
        let _catch = {} // 缓存广告场景
        allScene.map(child => {
          // 缓存已选中场景
          if (child.id === this.editUnit.ad_type_id) {
            _catch = child
          }
        })

        this.catchSelectScene = _catch // 缓存当前选中的广告场景, 素材中使用
        this.filterSceneData = allScene // 筛选出的广告场景
      },

      /**
       * [getStyleFilterList 获取当前场景下的广告样式]
       * @return {[obj]} [是否点击,  初始化默认渲染保持的数据, 如果是点击则默认缓存第一个数据]
       * @return {[type]} [description]
       */
      getStyleFilterList(obj) {
        let _styleData = [...this.$store.state.app.adStyleData]
        let _arr = []
        let _catch = {} // 缓存广告样式

        _styleData.map(item => {
          // 缓存样式
          if (!obj.isClick) { // 初次加载
            if (item.id === this.editUnit.creative_type) {
              _catch = item
            }
          }

          if (item.parentId === this.editUnit.ad_type_id) {
            _arr.push(item)
          }
        })

        // 点击的情况下,默认选中第一个
        if (obj.isClick) {
          this.catchSelectStyle = _arr[0]
          this.editUnit.creative_type = _arr[0].id
          this.getAppSlotList('choose')
        } else {
          // 初始化加载的话, 默认是保存后的数据
          this.catchSelectStyle = _catch
        }

        this.styleData = _arr // 样式列表

        this.setDemoSrcAndTitle() // 手机预览图的图片url和title
      },
      // 点击返回按钮
      getBack() {
        this.$router.push({name: 'advertising-unit'})
      },
      /**
       * [getActivityList 获取广告活动的列表]
       * @param  {[type]} item [description]
       * @return {[type]}     [description]
       */
      getActivityList() {
        let obj = {}
        obj.page_size = 0
        obj.page_num = 1
        getAdCampaignList(obj).then(res => {
          let data = res.data
          if (res.code === 200) {
            this.activityList = data.list
          }
        })
      },
      // 获取活动中选中的值
      getActivityIndex(id) {
        let obj = {}
        obj.page_size = 0
        obj.page_num = 1
        obj.name_or_id = id
        let campaignid_arr = []
        campaignid_arr.push(id)
        obj.campaignid_arr = campaignid_arr
        getAdCampaignList(obj).then(res => {
          if (res.code === 200) {
            let data = res.data.list[0]
            if (data.freq_type === 1) {
              this.freqStatus = true
            } else {
              this.freqStatus = false
            }
          }
        })
      },
      submitUnit(name, type) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            type === 1 ? this.submitClock = true : this.submitClockTo = true
            this.saveUnit(type)
          } else {
            this.$Message.error('请检查表单的提交')
          }
        })
      },
      saveUnit(type) {
        let form = this.editUnit
        let obj = {}
        obj.campaign_id = form.campaign_id // 广告活动的id
        obj.order_name = form.order_name // 广告单元的名称
        obj.billing_method = form.billing_method // 结算方式
        obj.ad_interactive = form.ad_interactive // 广告交互
        form.sid ? obj.sid = form.sid : '' // 转换目标
        obj.ad_type_id = form.ad_type_id
        obj.creative_type = form.creative_type // 创意形式
        // 广告位选择

        // if (form.advertiseStatus === 2 && form.adslotid_in.length === this.advertiseNum) {
        //   obj.adslotid_in = []
        // } else {
        //   obj.adslotid_in = form.advertiseStatus === 1 ? [] : form.adslotid_in
        // }
        obj.adslotid_in = Array.from(new Set(form.adslotid_in))
        // 地域
        obj.region_in = form.regionStatus === 1 ? [] : this.citySelect
        // 用户系统语言
        // let langInArr = Array.isArray(form.lang_in) ? form.lang_in : form.lang_in.split(',')
        // obj.lang_in = langInArr
        // 用户操作系统
        let osInArr = Array.isArray(form.os_in) ? form.os_in : form.os_in.split(',')
        obj.os_in = osInArr
        osInArr.length === 2 ? obj.osversion_in = [] : osInArr.includes('ios') ? obj.osversion_in = form.regionIosIn : obj.osversion_in = form.regionAndroidIn
        // 手机品牌
        obj.brand_in = form.brandStatus === 1 ? [] : form.brand_in
        if (form.brandStatus === 1) {
          obj.brand_in = []
        } else {
          if (osInArr.length === 2) {
            if (form.brand_in.length === 16) {
              obj.brand_in = []
            } else {
               obj.brand_in = form.brand_in
            }
          } else if (osInArr.includes('ios')) {
            if (form.brand_in.length === 1) {
              obj.brand_in = []
            } else {
              obj.brand_in = form.brand_in
            }
          } else {
            if (form.brand_in.length === 15) {
              obj.brand_in = []
            } else {
              obj.brand_in = form.brand_in
            }
          }
        }

        obj.model_in = form.brandStatus === 1 ? [] : form.model_in
        obj.retarget_in = form.tag_orientation === 1 ? [] : form.retarget_in // 人群定向
        // 联网方式
        let networkInArr = form.network_in.filter(function (s) {
          return s && s.trim() && s !== '不限'
        })
        obj.network_in = networkInArr
        // 运营商
        let carrier_in = form.carrier_in
        let carrierInArr = []
        if (carrier_in.includes('移动')) {
          let yiArr = ['46000', '46002', '46007']
          carrierInArr = carrier_in.concat(yiArr)
        } else {
          carrierInArr = carrier_in
        }
        let carrierInArrIn = carrierInArr.filter(function (s) {
          return s && s.trim() && s !== '不限' && s !== '移动'
        })

        obj.carrier_in = carrierInArrIn
        // 预算
        obj.budget_type = form.budget_type // 预算方式
        obj.budget = parseFloat((form.budget * 100).toFixed(2)) // 预算金额
        obj.putin_method = form.putin_method // 投放方式
        // 投放日期
        obj.begin_date = form.begin_date
        obj.end_date = form.end_date
        let hour_arr = form.hours_arr.map(item => {
           return item.split('').reverse().join('')
        })
        // 投放时段
        form.any_time === 0 ? '' : obj.hours_arr = hour_arr
        form.any_time === 0 ? '' : obj.week_day = form.week_day.split('').reverse().join('')
        obj.any_time = form.any_time
        // 频次
        obj.freq_vc = form.freq_vc
        obj.freq_period = form.freq_period
        obj.freq = parseInt(form.freq)
        // 出价
        obj.bidprice = parseFloat((form.bidprice * 100).toFixed(2))
        if (this.disable) {
          this.editUnitDataApi(obj, type)
        } else {
          this.saveUnitDataApi(obj, type)
        }
      },

      /**
       * [saveUnitDataApi 新建广告单元]
       * @return {[type]} [description]
       */
      saveUnitDataApi(obj, type) {
        saveUnitApi(obj).then(res => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
          if (res.code === 200) {
            this.$Bus.$emit('editEmitEvent') // 列表数据刷新
            this.$Message.success({content: '保存成功', duration: 3})
            type === 1 ? this.getBack() : this.$router.push({name: 'advertising-creative-edit', query: {campaignId: this.editUnit.campaign_id, orderId: res.data.order_id, source: 'unit'}})
          }
        }, err => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
        })
      },
      /**
       * [saveUnitApi 编辑广告单元]
       * @return {[type]} [description]
       */
      editUnitDataApi(obj, type) {
        let objs = obj
        objs.order_id = this.orderId
        editUnitApi(objs).then(res => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
          if (res.code === 200) {
            this.$Bus.$emit('editEmitEvent') // 列表数据刷新
            this.$Message.success({content: '保存成功', duration: 3})
            type === 1 ? this.getBack() : this.$router.push({name: 'advertising-creative-edit', query: {campaignId: this.editUnit.campaign_id, orderId: this.orderId, source: 'unit'}})
          }
        }, err => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
        })
      },

      /**
       * [saveUnitApi 新建广告单元]
       * @return {[type]} [description]
       */
      /**
       * [setDemoSrcAndTitle 手机框图片 依赖于广告场景和广告样式]
       * @return {[type]} [description]
       */
      setDemoSrcAndTitle() {
        let _scene = this.catchSelectScene
        let _style = this.catchSelectStyle
        // demo的图片url
        this.demoSrc = _style.demoIcon ? require('@/assets/image/ad/demo/' + _style.demoIcon) : require(`@/assets/image/ad/demo/${_style.icon}.jpg`)
        // demo图片的title
        this.demoTitle = `${_scene.title} - ${_style.title}`
      },

      /**
       * [getSceneImgUrl 动态拼接广告场景-图片地址]
       * @param  {[type]} img [description]
       * @return {[type]}     [description]
       */
      getSceneImgUrl(name) {
        return require(`@/assets/image/ad/scene/${name}.png`)
      },
      /**
       * [chooseScene 广告场景 - 选择]
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      chooseScene(item) {
        if (this.disable) {
          return
        }
        this.catchSelectScene = item
        this.editUnit.ad_type_id = item.id
        this.getStyleFilterList({isClick: true}) // 根据广告场景->筛选广告样式
      },
      /**
       * [getStyleImgUrl 动态拼接广告样式-图片地址]
       * @param  {[type]} name [description]
       * @return {[type]}      [description]
       */
      getStyleImgUrl(item) {
        let status = item.hover
        let name = item.icon
        return !!status || this.editUnit.creative_type == item.id ? require(`@/assets/image/ad/style/${name}-hover.png`) : require(`@/assets/image/ad/style/${name}.png`)
      },
      /**
       * [styleAdHover 选择广告样式 hover]:
       * @return {[type]} [description]
       */
      styleAdHover(item, index) {
        item['hover'] = true
      },
      /**
       * [styleAdHover 选择广告样式 leave]:
       * @return {[type]} [description]
       */
      styleAdLeave(item, index) {
        item['hover'] = false
      },
      /**
       * [chooseStyle 选择广告样式 选中]
       * @param  {[type]} item [description]
       * @param  {[type]} index [索引]
       * @return {[type]}      [description]
       */
      chooseStyle(item, index) {
        if (this.disable) {
          return
        }
        item['hover'] = true
        this.catchSelectStyle = item // 缓存样式数据
        this.editUnit.creative_type = item.id
        this.getAppSlotList('choose')
        this.setDemoSrcAndTitle() // 手机预览图的图片url和title
      }

    }

  }
</script>
<style lang="stylus">
  .tailModal {
    .ivu-modal-footer {
      border 0px;
      padding 0px
    }
  }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import './edit.styl';
  .toolText{
    color red
    font-weight bold
    font-size 15px
  }
  /deep/ .ivu-select-input[disabled] {
    color #969696 !important
    height 30px
    -webkit-text-fill-color #969696 !important
    background #fafafa !important
  }
  /deep/ .ivu-select-disabled .ivu-select-selection{
    -webkit-text-fill-color #969696 !important
    background #fafafa !important
    color #969696 !important
    border 1px solid #ebebeb
  }

  /deep/ .ivu-input[disabled] {
    color #969696 !important
    background #fafafa !important
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper-disabled {
    color #969696
  }
  .button-new-tag {
    height: 32px;
    line-height: 30px;
    border-radius: 20px;
    padding: 0 15px;
    font-size: 12px;
  }
  .tag-retarget{
      /deep/ .ivu-icon-ios-close{
        top 0px !important
        color #465cfe !important
      }
    /deep/.ivu-tag-size-large{
      height: 32px;
      line-height: 30px;
      padding: 0 12px;
      border-radius: 20px;
      background: #f2f4ff;
      .ivu-tag-text{
        color #465cfe !important
      }
    }
  }
  .input-new-tag {
    width: 200px;
    vertical-align: bottom;
  }
  .control-nav
    /deep/ .ivu-radio-wrapper
      margin-right: 30px
  .control-table
    margin-top: 20px
  .item-list
    margin-top: 20px
    display: flex
    .item-label
      flex: 0 0 140px
      width: 140px
    .icon-why
      margin-left: 4px
      color: #999
      cursor: pointer
    .item-content
      position: relative
      flex: 1
      max-width: 100%
      .percent-input
        width: 300px
      /deep/ .ivu-radio-wrapper
        margin-right: 30px
  .tag-check
    position: relative
    margin-top: 8px
    width: 90%
    flex-direction: row
    white-space: nowrap
    overflow: auto
    overflow-y: hidden
  .tag-select
    /deep/ .ivu-select
      width: 300px
    /deep/ .ivu-select-selection
      background-color: #FFF !important
      .ivu-select-input
        border: none
        background-color: #FFF !important
  .control-card
    /deep/ .ivu-form-item-error
      .ivu-select-selection
        border: 1px solid #ed4014
    /deep/
    .ivu-form-item
      margin-bottom: 0px
  .tag-item
    display: inline-block
    vertical-align: top
    overflow: hidden
    margin-right: 4px
    border: 1px solid #e8eaec
    border-radius: 2px
    font-size: 0px
    span
      display: inline
      float: left
      vertical-align: top
      height: 24px
      line-height: 24px
      font-size: 12px
      padding: 0 8px
      color: #515a6e
    .icon-close
      float: left
      width: 24px
      height: 24px
      display: inline
      line-height: 24px
      font-size: 12px
      text-align: center
      border-left: 1px solid #e8eaec
      color: #999
      cursor: pointer
  /deep/ .ivu-form-item-error-tip
    padding-top: 2px

  /deep/ .ivu-form-item-validating
    .ivu-input-icon-validate
      display: none

</style>
