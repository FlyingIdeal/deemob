<template>
  <div class="page-main">
    <Card dis-hover :bordered="false">
      <h2 class="page-title">{{headTitle}}</h2>
      <div class="content change">
        <Form ref="passwordRef" :model="passwordData" :rules="rules" :label-width="120">
          <FormItem label="新密码" prop="passwd">
            <Input type="password" :maxlength="20" v-model.trim="passwordData.passwd" password/>
          </FormItem>
          <FormItem label="确认密码" prop="passwdCheck">
            <Input type="password" :maxlength="20" v-model.trim="passwordData.passwdCheck" password/>
          </FormItem>
          <FormItem class="accountForm phone_code" label="手机验证码" prop="verification">
            <Input v-model.trim="passwordData.verification" placeholder="请输入验证码" autocomplete="off"/>
            <div class="get-code" @click.stop="getCaptchaCode">
              <span :class="isCodeIng?'codeColor':''">{{codeTxt}}</span>
            </div>
            <p v-if="isCodeText" class="ti">向尾号为<span>{{ phone_behind }}</span>的手机发送了验证码，请注意查收</p>
          </FormItem>

          <FormItem>
            <Button @click="getBack">取消</Button>
            <Button type="primary" :loading="submitClock" @click="submitPasswd('passwordRef')">
              <span v-if="!submitClock">提交</span>
              <span v-else>提交中...</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
  import {showTitle} from '@/libs/util'
  import {getAgentInfo, resetAgentPsw, getMobileCode} from '@/api/account'
  import {mapActions, mapMutations} from 'vuex'
  export default {
    name: 'appManage',
    data() {
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passwordData.passwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        submitClock: false,
        codeTxt: '获取验证码',
        passwordData: {
          passwd: '',
          passwdCheck: '',
          verification: null
        },
        phone_behind: '',
        isCodeIng: false,
        isCodeText: false,
        phone: null,
        u_id: null,
        rules: {
          passwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '长度至少6位', trigger: 'blur' },
            {pattern: /^[a-zA-Z0-9_]{6,20}$/, message: '密码必须是字母或数字的6-20位字符组成', trigger: 'blur'}
          ],
          passwdCheck: [{required: true, validator: validatePassCheck, trigger: 'blur'}],
          verification: [{required: true, message: '请输入验证码', trigger: 'blur'}]
        }
      }
    },
    methods: {
      ...mapActions([
        'logOut'
      ]),
      ...mapMutations([
        'setLoginOut'
      ]),
      getBack() {
        this.$router.back(-1)
      },
      // 获取本地信息
      getUserInfoData() {
        getAgentInfo({}).then(data => {
          let date = data
          if (date.code === 200) {
            this.phone = date.data.agent.phone
            this.phone_behind = this.phone.substr(this.phone.length - 4)
            this.u_id = date.data.id
          }
        })
      },
      // 获取验证码
      getCaptchaCode() {
        if (!this.isCodeIng) {
          // 获取验证码倒计时
          let time = 60
          getMobileCode().then(data => {
            let date = data
            if (date.code === 200) {
              this.isCodeIng = true
              this.isCodeText = true
              let timer = setInterval(() => {
                time--
                this.codeTxt = time + 's'
                if (time <= 0) {
                  this.codeTxt = '获取验证码'
                  this.isCodeIng = false
                  clearInterval(timer)
                }
              }, 1000)
            }
          })
        }
      },
      // 密码保存
      submitPasswd(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.submitClock = true
            let password = this.passwordData.passwdCheck
            let verification_code = this.passwordData.verification
            resetAgentPsw({
              password,
              verification_code
            }).then(data => {
              let date = data
              this.submitClock = false
              if (date.code === 200) {
                this.$Message.success('密码修改成功')
                this.logOut({platform_id: this.$config.platformId}).then(res => {
                  this.setLoginOut() // 清除

                  if (res.code === 200) {
                    this.$Message.success({content: '请重新登录', duration: 3})
                    this.$router.replace({name: 'login'})
                  } else {
                    this.$Message.error({content: res.msg, duration: 3})
                  }
                })
              }
            }, err => {
              this.submitClock = false
            })
          }
        })
      }
    },
    created() {
      this.getUserInfoData()
    },
    computed: {
      headTitle() {
        return showTitle(this.$route, this)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
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
  .alert{
    margin-top: 10px
    display: inline-block
    padding: 0 20px
    background: #F4F5F8
    height 30px
    line-height 30px
    font-size: 13px
    color: #42444C
    padding 0 10px
    span{
      display inline-block
      margin-left 5px
    }
  }
  .change {
    width 390px
    /deep/ .ivu-input{
      height 32px
      line-height 32px
      .ivu-input-suffix i{
        font-size 18px
      }
    }
    /deep/ .phone_code{
      position relative
      .get-code{
        position absolute
        right:12px
        top 0px
        font-size 14px
        color #465CFE
        cursor pointer
        .codeColor{
          color: #999999
        }
      }
      .ti{
        position absolute
        top:0px
        right -320px
        span{
          color: #4083F8
        }
      }
    }
  }

</style>
