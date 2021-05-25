<template>
    <div>
        
    </div>
</template>

<script>
export default {
    name: 'transfer',
    created() {
        // 从登录页面跳转到首页，此时需要加入路由[length = 0] 的判断，默认去第一条
        let _menu = this.$store.getters.menuList

        if (_menu.length && _menu[0].children.length) {
            // 此处相当于做了一个中间件跳转
            this.$router.replace({
                name: _menu[0].children[0].name
            })
        } else {
            // 无跳转的页面，sorry，你只能去404了
            this.$router.replace({name: 'noFound'})
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
