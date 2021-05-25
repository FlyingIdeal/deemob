<template>
  <div class="page-main">
    <div class="edit-content-card edit_content">
      <div class="page-detail-title clearfix">
        <h2 v-show="!disable && !copy_id">{{headTitle}}</h2>
        <h2 v-show="!disable && copy_id">复制广告活动</h2>
        <h2 v-show="disable">编辑广告活动</h2>
      </div>
      <div class="appDetail">
        <Form ref="editActivity" :label-colon="true" :model="editActivity" :rules="editActivity.freq_type === 1 ? rules : rulesTo" :label-width="labelWidth">
          <FormItem label="广告活动名称" prop="campaign_name">
            <Input :disabled="disable" type="text" :maxlength="100" show-word-limit v-model.trim="editActivity.campaign_name"/>
          </FormItem>
          <FormItem class="unitClass" label="预算" prop="budget">
            <Input  v-model.trim="editActivity.budget" style="width:440px">
              <Select :disabled="disable" v-model="editActivity.budget_type" slot="prepend" style="width: 80px">
                <Option :value="0">总预算</Option>
                <Option :value="1">日预算</Option>
              </Select>
            </Input>
            <span>元</span>
          </FormItem>
          <FormItem label="频控设置" prop="freq_type">
            <RadioGroup  v-model="editActivity.freq_type" type="button">
              <Radio class="i-width-checkbtn" :disabled="disable" :label="1">按广告活动</Radio>
              <Radio class="i-width-checkbtn" :disabled="disable" :label="0">按广告单元</Radio>
            </RadioGroup>
          </FormItem>
          <div v-show="editActivity.freq_type === 1">
          <FormItem label="频控类别" prop="freq_vc">
            <RadioGroup  v-model="editActivity.freq_vc" type="button">
              <Radio class="i-width-checkbtn" :disabled="disable" :label="0">展现频控</Radio>
              <Radio class="i-width-checkbtn" :disabled="disable" :label="1">点击频控</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem class="unitClass" label="频次" prop="freq">
            <Input v-model.trim="editActivity.freq" style="width:440px">
              <Select :disabled="disable" v-model="editActivity.freq_period" slot="prepend" style="width: 80px">
                <Option :value="0">每小时</Option>
                <Option :value="1">每日</Option>
                <Option :value="2">每月</Option>
              </Select>
            </Input>
            <span>次</span>
          </FormItem>
          </div>
        </Form>
      </div>
    </div>
    <div class="detail-save-card">
      <div class="detail-save-center" :style="`margin-left: ${labelWidth}px`">
        <Button @click="getBack">取消</Button>
        <Button type="primary" :loading="submitClock" @click="submitList('editActivity',1)">
          <span v-if="!submitClock">保存</span>
          <span v-else>保存中...</span>
        </Button>
        <Button type="primary" :loading="submitClockTo" @click="submitList('editActivity',2)">
          <span v-if="!submitClockTo">保存并新建广告单元</span>
          <span v-else>保存中...</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {tableHeight} from '@/mixin/calc-table-height.js'
  import {formatDate} from '@/libs/tools'
  import { saveCampaign, getAdCampaignList, editCampaign } from '@/api/advertising'

  export default {
    data() {
      const freq = (rule, value, callback) => {
        let arr = this.editActivity.freq
        let showTxt = ''
          if (!arr || arr < 1 || arr > 10000 || arr % 1 !== 0) {
            showTxt = '频次必须是大于0小于等于10000的整数'
          }
        if (showTxt) {
          callback(new Error(showTxt))
        } else {
          callback()
        }
      }
      const budget = (rule, value, callback) => {
        let arr = this.editActivity.budget
        let showTxt = ''
        if (arr < 0 || arr > 100000000) {
          showTxt = '预算额大于0小于等于1亿'
        }
        if (!/^\d+(\.\d{1,2})?$/.test(arr)) {
          showTxt = '预算额大于0小于等于1亿，最多可填2位小数'
        }
        if (showTxt) {
          callback(new Error(showTxt))
        } else {
          callback()
        }
      }
      return {
        labelWidth: 120, // 左侧宽度
        submitClock: false,
        submitClockTo: false,
        rules: {
          campaign_name: [
            {required: true, message: '请输入广告活动名称'},
            {max: 100, message: '广告活动名称不能超过100字'}
          ],
          budget: [
            {required: true, message: '请输入预算金额'},
            {validator: budget}
          ],
          freq_type: [
            {required: true, message: '请选择频控设置'}
          ],
          freq_vc: [
            {required: true, message: '请选择频控类比'}
          ],
          freq: [
            {required: true, message: '请输入频次'},
            {validator: freq}
          ]
        },
        rulesTo: {
          campaign_name: [
            {required: true, message: '请输入广告活动名称'},
            {max: 100, message: '广告活动名称不能超过100字'}
          ],
          budget: [
            {required: true, message: '请输入预算金额'},
            {validator: budget}
          ],
          freq_type: [
            {required: true, message: '请选择频控设置'}
          ]
        },
        editActivity: {
          campaign_name: '',
          freq_type: 1,
          freq_period: 0,
          freq: '',
          budget: null,
          budget_type: 0,
          platform_type: 3,
          freq_vc: 0
        },
          campaign_id: this.$route.query.campaignid ? Number(this.$route.query.campaignid) : '',
          disable: !!this.$route.query.campaignid,
          copy_id: this.$route.query.copy_id ? Number(this.$route.query.copy_id) : ''
      }
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    },
    methods: {
      // 点击返回按钮
      getBack() {
        this.$router.push({name: 'advertising-activity'})
      },
      timeFormat(time, format) {
        return formatDate(time * 1000, format)
      },
      // 获取修改的值
      getTableList() {
        let obj = {}
        obj.page_size = 10
        obj.page_num = 1
        obj.name_or_id = this.disable ? this.campaign_id : this.copy_id
        getAdCampaignList(obj).then(res => {
          let data = res.data
          if (res.code === 200) {
            this.$Spin.hide()
            let hour = new Date().getHours()
            let minute = (new Date().getMinutes()).toString()
            let date = hour + minute
            this.editActivity = {
                campaign_name: this.disable ? data.list[0].campaignname : data.list[0].campaignname + '副本' + date,
                freq_type: data.list[0].freq_type,
                freq_period: data.list[0].freq_period,
                freq: data.list[0].freq,
                budget: data.list[0].budget / 100,
                budget_type: data.list[0].budget_type,
                platform_type: data.list[0].platform_type,
                freq_vc: data.list[0].freq_vc
            }
          }
        })
      },
      submitList(name, type) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.disable) {
              this.editCompile(type)
            } else {
              this.newCreate(type)
            }
          } else {

          }
        })
      },
      newCreate(type) {
        type === 1 ? this.submitClock = true : this.submitClockTo = true
        let form = this.editActivity
        form.freq = Number(form.freq)
        form.budget = Number(form.budget) * 100
        saveCampaign(form).then(res => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
          if (res.code === 200) {
            this.$Bus.$emit('editEmitEvent') // 列表数据刷新
            this.$Message.success({content: '保存成功', duration: 3})
            type === 1 ? this.getBack() : this.$router.push({name: 'unit-edit', query: {campaignId: res.data.campaign_id}})
          } else {
            this.editActivity.budget = Number(this.editActivity.budget) / 100
          }
        }, err => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
        })
      },
      editCompile(type) {
        type === 1 ? this.submitClock = true : this.submitClockTo = true
        let form = {}
        form.campaign_id = this.campaign_id
        form.freq = Number(this.editActivity.freq)
        form.budget = Number(this.editActivity.budget) * 100
        editCampaign(form).then(res => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
          if (res.code === 200) {
            this.$Bus.$emit('editEmitEvent') // 列表数据刷新
            this.$Message.success({content: '修改成功', duration: 3})
            type === 1 ? this.getBack() : this.$router.push({name: 'unit-edit', query: {campaignId: this.campaign_id}})
          } else {
            this.editActivity.budget = Number(this.editActivity.budget) / 100
          }
        }, err => {
          type === 1 ? this.submitClock = false : this.submitClockTo = false
        })
      }

    },
    created() {
      if (this.$route.query.campaignid || this.$route.query.copy_id) {
        this.$Spin.show()
        this.getTableList()
      }
      // 判断是否有修改权限
      // let resultArr = this._isPageShow()
      // if (this._isSuperAdmin() || !!resultArr.includes('view')) {
      //   this.app_id = this.$route.params && this.$route.params.app_id
      // } else {
      //
      // }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
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
.edit_content{
  background #ffffff
  padding: 15px 25px;
  min-height: calc(100vh - 220px);
  height: auto;
  .appDetail {
    width 600px
    .unitClass{
      position relative
      span{
        position absolute
        right:0px
        top:0px
      }
    }
    /deep/ .ivu-form-item {
      .ivu-input {
        background #ffffff
      }
      .ivu-input-group-prepend {

      }

      .ivu-radio-group-button .ivu-radio-wrapper {
        background: #FAFAFA;
      }

      .ivu-radio-group-button .ivu-radio-wrapper-checked {
        background: #F2F4FF;
        border: 1px solid #465CFE;
        color #465CFE
        box-shadow none
      }

      .ivu-radio-group-button .ivu-radio-wrapper-checked:before {
        background transparent;
        left 0px
      }
    }
  }
}
</style>
