<template>
    <Layout class="app" style="height: 100%">
        <Header>
            <head-bar @on-change="toggleChangePsw"></head-bar>
        </Header>
        <Layout>
            <Sider class="left-bar" collapsible :width="174" :collapsed-width="56" v-model="collapsed" :style="{overflow: 'hidden'}">
                <side-menu accordion ref="sideMenu" :active-name="curRouteName()" :collapsed="collapsed" @on-select="turnToPage" theme="light" :menuList="menuList">
                </side-menu>

                <div class="ivu-layout-sider-trigger" slot="trigger" :style="{'width': `${marginLeft}px`}"  @click="toggleCollapsed">
                    <i class="iconfont" :class="collapsed ? 'icon-unfold' : 'icon-fold'"></i>
                </div>
            </Sider>
            <Layout class="root-body" :style="{'margin-left': `${marginLeft}px`}">
                <Content :class="!isResponsive ? 'root-center' : 'root-content'">
                    <top-content ref="infroTips"></top-content>
                    <keep-alive>
                        <router-view v-if="isKeepAlive()" />
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"/>
                </Content>
            </Layout>
        </Layout>
        <!-- 修改密码 -->
        <!-- <change-psw ref="changePsw"></change-psw> -->
    </Layout>
</template>

<script>
import SideMenu from './compontents/side-menu'
import headBar from './compontents/header'
import topContent from './compontents/top'
// import changePsw from '@/view/account/changePsw.vue'
import { localSave, localRead } from '@/libs/util'

export default {
    name: 'Main',
    components: {
        SideMenu,
        headBar,
        // changePsw,
        topContent
    },
    data() {
        return {
            localName: 'LFET-BAR-COLLAPSE',
            marginLeft: 174, // 左侧距离
            collapsed: false
        }
    },
    computed: {
        menuList() {
            return this.$store.getters.menuList
        },
        /**
         * [isResponsive 是否自适应]
         * @return {Boolean} [description]
         */
        isResponsive() {
            return !!this.$route.meta.isResponsive
        }
    },
    created() {
        let _val = localRead(this.localName)
        this.collapsed = _val === 'true'
        this.marginLeft = _val === 'true' ? 56 : 174
    },
    methods: {
        /**
         * [isKeepAlive 是否缓存]
         * @return {Boolean} [description]
         */
        isKeepAlive() {
            return this.$route.meta.keepAlive
        },
        /**
         * [curRouteName 路由名称]
         * @return {[type]} [description]
         */
        curRouteName() {
            return (this.$route.meta && this.$route.meta.targetHighLight) ? this.$route.meta.targetHighLight : this.$route.name
        },
        /**
         * @param  {[地址跳转]}
         * @return {[type]}
         */
        turnToPage(route) {
            let { name, params, query } = {}

            if (typeof route === 'string') {
                name = route
            } else {
                name = route.name
                params = route.params
                query = route.query
            }

            if (name.indexOf('isTurnByHref_') > -1) {
                window.open(name.split('_')[1])
                return
            }

            this.$router.push({
                name,
                params,
                query
            })
        },
        /**
         * [toggleCollapsed 展开-收起时的回调]
         * @param  {[type]} val [true / false]
         * @return {[type]}     [description]
         */
        toggleCollapsed(val) {
            this.collapsed = !this.collapsed
            this.marginLeft = this.collapsed ? 56 : 174
            localSave(this.localName, this.collapsed)
        },
        /**
         * [toggleChangePsw c从header模块中传出修改密码弹出层]
         * @return {[type]} [description]
         */
        toggleChangePsw() {
            this.$refs.changePsw.showModal()
        }
    },
    watch: {
        '$route' (newRoute) {
            this.$refs.sideMenu.updateOpenName(newRoute.name)
            this.$refs.infroTips._getSysUserInfo() // 获取用户信息
        }
    }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.app
    min-width: 1334px
    .left-bar
        position: fixed
        left: 0px
        top: 56px
        bottom: 0px
        background: #FFF
        z-index: 11
        overflow: hidden
    .root-body
        margin-top: 56px
        min-height 100%
        min-width: 1194px
        padding: 10px
        transition: all .2s
    .root-center
        width: 1170px
        margin  0 auto
</style>
