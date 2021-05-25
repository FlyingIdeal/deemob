import {mapActions} from 'vuex'

export const commonConfig = {
  data() {
    return {
      provinceCityList: [], // 城市的选择
      phoneBrandList: [] // 手机品牌
    }
  },
  created() {
    this._getProvinceCityApi() // 获取城市
    this._getPhoneBrand() // 获取手机品牌
  },
  computed: {
  },
  methods: {
    ...mapActions([
      'getProvinceCityApi',
      'getPhoneBrand'
    ]),
    /**
     * [_getProvinceCityApi 获取城市]
     * @return {[type]} [description]
     */
    async _getProvinceCityApi() {
      let storeUser = this.$store.state.user
      let resArr = storeUser.provinceCityArr.length ? storeUser.provinceCityArr : await this.getProvinceCityApi()
      let provinceArr = resArr
      let provinceList = provinceArr.map(i => {
        let obj = {}
        obj.value = i.value
        obj.label = i.label
        obj.check = false
        obj.childrenName = '城市'
        obj.little = false
        obj.children = []
        i.children.map(item => {
          let objs = {}
          objs.value = item.value
          objs.label = item.label
          objs.parent = i.label
          objs.check = false
          objs.little = false
          obj.children.push(objs)
        })
        return obj
      })
      this.provinceCityList = provinceList
    },
    /**
     * [_getPhoneBrand 获取手机品牌]
     * @return {[type]} [description]
     */
    async _getPhoneBrand() {
      let storeUser = this.$store.state.user
      let resArr = storeUser.phoneBrandArr.length ? storeUser.phoneBrandArr : await this.getPhoneBrand()
      let phoneList = resArr.map((i, index) => {
        let obj = {}
        obj.value = (i.id).toString()
        obj.label = i.name
        obj.check = false
        obj.little = false
        return obj
      })
      this.phoneBrandList = phoneList
    }
  }
}
