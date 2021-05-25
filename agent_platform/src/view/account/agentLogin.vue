<template>
    <div class="login"></div>
</template>
<script>
import {mapActions, mapMutations} from 'vuex'

export default {
    name: 'agentLogin',
    data() {
        return {
            token: !!this.$route.query.token ? this.$route.query.token : '', // 生成的token
            pid: !!this.$route.query.pid ? Number(this.$route.query.pid) : '', // 当前id
            userId: !!this.$route.query.userId ? Number(this.$route.query.userId) : '' // 用户id
        }
    },
    created() {
        if (!!this.token && !!this.pid && !!this.userId) {
            this.toLogin()
        } else {
            this.$router.replace({name: 'login'})
        }
    },
    methods: {
        ...mapActions([
            'shamLogin'
        ]),
        ...mapMutations([
            'setLoginOut'
        ]),
        /**
         * [toLogin 登录]
         * @return {[type]} [description]
         */
        async toLogin() {

            this.setLoginOut() // 伪登录时清除一次存储

            const res = await this.shamLogin({platform_id: this.pid, user_id: this.userId, token: this.token})

            let _name = res.code === 200 ? 'dsp-manage' : 'login'

            this.$Message.success('正在跳转...')
            setTimeout(() => {
                // 有效期内，跳转到首页
                this.$router.replace({name: _name})
            }, 1500)
        }
    }
}
</script>
<style lang="stylus" scoped>

</style>
