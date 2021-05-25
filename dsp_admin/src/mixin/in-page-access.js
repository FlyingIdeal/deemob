// 页面内权限
export const inPageAccess = {
    data() {
        return {
            inPageAccessArr: [] // 页面内权限
        }
    },
    created() {
        this._inPageAccessArr() // 获取页面按钮权限数组
    },
    methods: {
        /**
         * [hasPageAccess 页面访问权限]
         * @return {Boolean} [description]
         */
        _hasPageAccess(obj) {

            let _role = this.$store.getters.userInPageRole

            let routeName = (obj && obj.targetRoute) ? obj.targetRoute : this.$route.name // 两个页面公用一个route

            let _permission = !!_role && !!_role[routeName] ? _role[routeName] : ''


            // 判断route是否有redirect跳转
            if (!!this.$route && !!this.$route.meta && !!this.$route.meta.redirectForm) {
                _permission = this.$route.meta.redirectForm
            }

            // 存在当前模块， 并且有查看页面的权限
            if (!!_permission && _permission.arr.includes('viewIndex')) {
                return true
            } else {
                this._gotoNoAccess()
            }
        },
        /**
         * [_inPageAccessArr 页面按钮权限]
         * obj 解决 账户审核日志和创意审核日志在同一个页面导致查看按钮不显示问题
         * @return {[type]} [description]
         */
        _inPageAccessArr(obj) {
            let _role = this.$store.getters.userInPageRole

            let routeName = (obj && obj.targetRoute) ? obj.targetRoute : this.$route.name // 两个页面公用一个route

            this.inPageAccessArr = (!!_role && !!_role[routeName]) ? _role[routeName].arr : [] // 页面内权限
        },
        /**
         * [_isShow_ 页面内按钮级别权限   判断是否显示]
         * @param  {[type]}  name [description]
         * @return {Boolean}      [description]
         */
        _isShow_(name) {
            return this.inPageAccessArr.includes(name)
        },
        /**
         * [_isPageShow 页面是否显示
         * ]
         * @return {Boolean} [description]
         */
        _isPageShow() {
            let _targetRoute = this.$route.meta.targetHighLight
            let _role = this.$store.getters.userInPageRole

            return _role[_targetRoute] ? _role[_targetRoute].arr : []
        },
        /**
         * [_gotoNoAccess 跳转到无权限页面]
         * @return {[type]} [description]
         */
        _gotoNoAccess() {
            this.$router.replace({name: 'noPermission'})
        }
    }
}
