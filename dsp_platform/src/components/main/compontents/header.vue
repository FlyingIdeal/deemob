<template>
    <div class="root-header clearfix">
        <div class="header-card fl clearfix">
            <div class="head-logo fl">
                <img src="~@/assets/image/logo.png">
            </div>
            <div class="header-name fl">慧营广告投放平台</div>
        </div>
        <div class="user-avatar-dropdown fr">
            <Dropdown trigger="click" placement="bottom-end" @on-click="handleClick">
                <a href="javascript:void(0)">
                    {{userName}}
                    <Icon type="ios-arrow-down"></Icon>
                </a>
                <DropdownMenu slot="list">
                    <DropdownItem class="d-drop" name="password"><i class="d-icon account-tag"></i><span>修改密码</span></DropdownItem>
                    <DropdownItem class="d-drop" name="logOut"><i class="d-icon quit-tag"></i><span>退出</span></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    </div>
</template>
<script>
import {mapActions, mapMutations} from 'vuex'
export default {
    name: 'Header',
    computed: {
        userName() {
            return this.$store.state.user.userName
        }
    },
    methods: {
        ...mapActions([
            'logOut'
        ]),
        ...mapMutations([
            'setLoginOut'
        ]),
        /**
         * [handleClick 切换点击]
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        handleClick(name) {
            switch (name) {
                case 'logOut':
                    this.toLogOut()
                    break
                case 'password':
                    this.changePassword()
                    break
            }
        },
        /**
         * [toLogOut 退出登录]
         * @return {[type]} [description]
         */
        toLogOut() {
            this.$Modal.confirm({
                title: '确认退出？',
                className: 'vertical-center-modal',
                onOk: () => {

                    /**************上线备份- 替换部分 start*******************/
                    // this.setLoginOut() // 清除
                    // this.$Message.success({content: '退出成功', duration: 3})
                    // this.$router.replace({name: 'login'})
                    /**************上线备份- 替换部分 end*******************/

                    /**************上线备份- 替换部分 start*******************/
                    this.logOut({platform_id: this.$config.platformId}).then(res => {
                        this.setLoginOut() // 清除

                        if (res.code === 200) {
                            this.$Message.success({content: '退出成功', duration: 3})
                            this.$router.replace({name: 'login'})
                        } else {
                            this.$Message.error({content: res.msg, duration: 3})
                        }
                    })
                    /**************上线备份- 替换部分 end*******************/
                },
                onCancel() {
                    console.log('取消')
                }
            })
        },
        /**
         * [password 修改密码]
         * @return {[type]} [description]
         */
        changePassword() {
            this.$router.push({name: 'infro-reset-psw'})
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.header-card
    .head-logo
        height: 56px
        width: 56px
        line-height: 56px
        font-size: 0px
        text-align: center
        img
            vertical-align: middle
            width: 28px
            height: 28px
    .header-name
        font-size: 18px
        font-weight: 800
        color: #FFF
.user-avatar-dropdown
    a
        color: #FFF
    /deep/ .ivu-select-dropdown
        width: 90px
        .ivu-dropdown-menu
            min-width: 90px
        li
            padding-left: 10px
            padding-right: 0px
            &:hover
                background-color: #F2F4FF
                color: #465CFE
.d-drop
    display: flex
    align-items: center
    .d-icon
        margin-right: 8px
        flex: 0 0 12px
        width: 12px
        height: 12px
        background-size: cover
        background-position: 0 0 
        background-repeat: no-repeat
    .account-tag
        background-image: url('~@/assets/image/left-bar/account-tag.png')
    .quit-tag
        background-image: url('~@/assets/image/left-bar/quit-tag.png')
    &:hover
        .account-tag
            background-image: url('~@/assets/image/left-bar/account-tag-hover.png')
        .quit-tag
            background-image: url('~@/assets/image/left-bar/quit-tag-hover.png')
    span
        line-height: 16px
        font-size: 12px
        
</style>
