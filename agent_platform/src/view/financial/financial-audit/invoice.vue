<template>
    <div>
        {{headTitle}}
    </div>
</template>

<script>

export default {
    data() {
        return {
            
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    methods: {
        
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
