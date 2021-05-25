<template>
  <div class="wrapper_box"
       :class="_uid">
    <div class="wrapper" :style="title==='代理商'?'width:200px':''">
      <div class="header">{{ title }}</div>
      <Input :style="title==='代理商'?'width:180px;margin-left: 10px':'width: 136px;margin-left: 10px'" class="search" type="text" v-model="search_text"
             :placeholder="'输入'+title+'查询'">
        <Button slot="append" icon="ios-search" @click="search"/>
      </Input>
      <ul class="content">
        <li v-show="(order==='first' && appCode===0) || (order==='finally'  && code===0)"  class="title">
        <template v-if="!onlyBottom">
            <span class="check_box">
              <Checkbox :value="isCheckAll"
                        @on-change="handleCheckAll">{{' '}}</Checkbox>
            </span>
          <span :class="isCheckAll?'color':''">全选</span>
        </template>
      </li>
        <li v-show="order==='finally' && code===1"  class="title">
          <template v-if="!onlyBottom">
            <span class="check_box">
              <Checkbox :value="isCheckAllSearch"
                        @on-change="handleCheckAllSearch">{{' '}}</Checkbox>
            </span>
            <span :class="isCheckAllSearch?'color':''">全选</span>
          </template>
        </li>
        <li v-show="order==='first' && appCode===1"  class="title">
          <template v-if="!onlyBottom">
            <span class="check_box">
              <Checkbox :value="isCheckAll"
                        @on-change="handleCheckAllSearchApp">{{' '}}</Checkbox>
            </span>
            <span :class="isCheckAll?'color':''">全选</span>
          </template>
        </li>
        <li  v-show="(order==='first' && appCode===0) || (order==='finally' && code===0)" class="item_wrapper"
             v-for="(item,index) in entites"
             :key="'应用1'+index">
          <span class="check_box">
            <template v-if="onlyBottom">
              <Checkbox v-if="!item.children"
                        v-model="item.check"
                        @on-change="handleSelect($event,item,index)"
                        :indeterminate="item.little"/>
            </template>
            <template v-else>
              <Checkbox v-show="item.label" v-model="item.check"
                        @on-change="handleSelect($event,item,index)"
                        :indeterminate="item.little"/>
            </template>
          </span>
          <div v-show="item.label" :class="item.check? 'color cursor_pointer': 'cursor_pointer'" @click="handleChildrenDatas(item,index,item.check)">
            <span :title="item.label" class="check_label" :style="title==='代理商'?'width:140px':''"
            >{{ item.label }}</span>
            <span class="icon">
            <Icon v-show="item.children"
                  type="ios-arrow-forward"/>
          </span>
          </div>
        </li>
        <li  v-show="order==='first' && appCode===1" class="item_wrapper"
             v-for="(item,index) in appList"
             :key="'应用2'+index">
          <span class="check_box">
            <template>
              <Checkbox v-model="item.check"
                        @on-change="handleSelect($event,item,index)"
                        :indeterminate="item.little"/>
            </template>
          </span>
          <div :class="item.check? 'color cursor_pointer': 'cursor_pointer'" @click="handleChildrenDatas(item,index,item.check)">
            <span :title="item.label" class="check_label " :style="title==='代理商'?'width:140px':''"
            >{{ item.label }}</span>
            <span class="icon">
            <Icon v-show="item.children"
                  type="ios-arrow-forward"/>
          </span>
          </div>
        </li>
        <li  v-show="order==='finally' && code===1" class="item_wrapper"
             v-for="(item,index) in search_list"
             :key="'广告位2'+index">
          <span class="check_box">
            <template>
              <Checkbox v-model="item.check"
                        @on-change="handleSelect($event,item,index)"
                        :indeterminate="item.little"/>
            </template>
          </span>
          <div :class="item.check? 'color cursor_pointer': 'cursor_pointer'">
            <span :title="item.label" class="check_label " :style="title==='代理商'?'width:140px':''"
            >{{ item.label }}</span>
            <span class="icon">
            <Icon v-show="item.children"
                  type="ios-arrow-forward"/>
          </span>
          </div>
        </li>
      </ul>
    </div>
    <multiCascader ref="children"
                   v-if="childrenDatas.length"
                   :title="childrenTitle"
                   :data="entites"
                   :order="childrenOrder"
                   :datas="childrenDatas"
                   :parentId="hookParentId"
                   :onlyBottom="onlyBottom"
                   :type="childrenType"
                   @update="childUpdate"
                   @onSearch="onSearch"/>
  </div>
</template>

<script>
  import {Checkbox, Icon} from 'view-design'

  export default {
    name: 'multiCascader',
    components: {
      Checkbox,
      Icon
    },
    props: {
      onlyBottom: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '兴趣定向'
      },
      type: {
        type: Array,
        default: () => []
      },
      order: {
        type: String,
        default: 'first'
      },
      datas: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      parentId: {
        type: String,
        default: '0'
      }
    },
    data() {
      return {
        hookParentId: this.parentId,
        entitesList: [],
        childrenDatas: [],
        selectedDatas: [],
        selectedIndex: -1,
        childrenCheck: false,
        search_text: null,
        childrenTitle: '',
        childrenOrder: '',
        entitesList1: [],
        childrenType: ['账户'],
        code: 0,
        search_list: [],
        appList: [],
        isCheckAllSearch: false,
        codeStatus: 0,
        appCode: 0,
        checkoutStatus: true,
        accountType: []
      }
    },
    computed: {
      isCheckAll() {
        return this.checkArrayAll(this.entites)
      },
      entites: {
        get() {
          return this.entitesList
        },
        set(v) {
          this.entitesList = v
        }
      }
    },
    methods: {
      // 搜索的书写
      search() {
        if (this.search_text) {
          if (this.order === 'finally') {
            let data = []
            this.entitesList1.map(value => {
              value.children.map(item => {
                if (item.label.includes(this.search_text)) {
                  data.push(item)
                }
              })
            })
            let newobj = {}
            data = data.reduce((preVal, curVal) => {
              newobj[curVal.value] ? '' : newobj[curVal.value] = preVal.push(curVal)
              return preVal
            }, [])
            this.code = 1
            this.isCheckAllSearch = false
            this.search_list = data
          } else {
            let entitesList = this.entitesList
            let data = []
            entitesList.map(value => {
              if (value.label.includes(this.search_text)) {
                data.push(value)
              }
            })
            this.appCode = 1
            this.appList = data
          }
        } else {
          if (this.order === 'finally') {
            this.code = 0
          } else {
            this.appCode = 0
          }
        }
      },
      inData() {
        this.search_text = ''
        this.code = 0
        this.order === 'finally'
      },
      checkArrayAll(datas) {
        for (let i = 0; i < datas.length; i++) {
          if (!datas[i].check) {
            return false
          }
        }
        return true
      },
      checkArrayLittle(datas) {
        for (let i = 0; i < datas.length; i++) {
          let {little, check} = datas[i]
          if (little || check) {
            return true
          }
        }
        return false
      },
      handleCheckAll(checked) {
        this.entites = this.entites.map(item => {
          item.check = checked
          item.little = false
          if (item.children && item.children.length) {
            this.childrenCheck = checked
            item.children = this.hookMapSelect(item.children, checked)
          }
          return item
        })
        this.updateToParent()
      },
      handleCheckAllSearch(checked) {
        this.entites = this.search_list.map(item => {
          item.check = checked
          item.little = false
          if (item.children && item.children.length) {
            this.childrenCheck = checked
            item.children = this.hookMapSelect(item.children, checked)
          }
          return item
        })
        this.updateToParent()
      },
      handleCheckAllSearchApp(checked) {
        this.entites = this.appList.map(item => {
          item.check = checked
          item.little = false
          if (item.children && item.children.length) {
            this.childrenCheck = checked
            item.children = this.hookMapSelect(item.children, checked)
          }
          return item
        })
        this.updateToParent()
      },
      handleChildrenDatas(item, index, checked) {
        this.appCode = 0
        this.accountType[0] = '橘色'
        this.selectedIndex = index
        let {value} = item
        this.hookParentId = `${this.parentId}-${value}`
        this.$emit('onSearch', value)
        // 点击父辈同级,如果没有子集则收缩
        if (this.$refs.children) {
          this.$refs.children.childrenDatas = []
          this.childrenDatas = []
        }

        if (item.children && item.children.length) {
          this.childrenDatas = item.children
          this.childrenOrder = 'finally'
          this.childrenTitle = item.childrenName ? item.childrenName : item.label
        }
      },
      handleSelect(checked, item, index) {
        if (checked) item.little = false
        this.entites.map((it, i) => {
          if (item.value === it.value) {
            this.selectedIndex = i
          }
        })
        if (item.children && item.children.length) {
          item.children = this.hookMapSelect(item.children, checked)
          this.childrenDatas = item.children
          this.childrenOrder = 'finally'
          this.childrenTitle = item.childrenName ? item.childrenName : item.label
        }
        this.checkoutStatus = false
        this.updateToParent()
      },
      // 递归遍历 children & 赋值对应 checked
      hookMapSelect(list, checked) {
        return list.map(item => {
          item.check = checked
          if (item.children && item.children.length) {
            item.children = this.hookMapSelect(item.children, checked)
          }
          return item
        })
      },
      childUpdate(childDatas) {
        this.entites[this.selectedIndex].children = Object.assign([], childDatas)
        this.entites[this.selectedIndex].check = this.checkArrayAll(childDatas)
        if (this.entites[this.selectedIndex].check) {
          this.entites[this.selectedIndex].little = false
        } else {
          this.entites[this.selectedIndex].little = this.checkArrayLittle(
            childDatas
          )
        }

        this.updateToParent()
      },
      updateToParent() {
        this.$emit('update', this.entites)
      },
      onSearch(e) {
        this.$emit('onSearch', e)
      }
    },
    watch: {
      search_text: function () {
        this.$emit('update', this.entites)
      },
      type: {
        deep: true,
        immediate: true,
        handler: function (v) {
          this.accountType = Object.assign([], v)
        }
      },
      datas: {
        deep: true,
        immediate: true,
        handler: function (v) {
          if (v && v.length) {
            this.entitesList = Object.assign([], v)
            if (this.title === '角色' && this.accountType[0] === '角色') {
              this.handleChildrenDatas(v[0], 0)
            }
            if (this.title === '账号' && this.accountType[0] === '账户') {
              this.inData()
            }
          }
        }
      },
        data: {
          deep: true,
          immediate: true,
          handler: function (v) {
            if (v && v.length) {
              this.entitesList1 = Object.assign([], v)
            }
        }
      }
    },
    created() {
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>
  li {
    list-style: none;
  }

  .wrapper_box {
    overflow: hidden;

    .wrapper {
      float: left;
      border-right: 1px solid #dadfe3;
      font-size: 14px;
      width: 156px;

      .header {
        margin-bottom: 0.5rem;
        padding: 0px 10px;
        background: #FAFAFA;
        border-bottom: 1px solid #EBEBEB;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .content {
        padding: 8px 0px;
        width: 100%;
        height: 250px;
        overflow-y: auto;
        .title{
          padding-left: 10px;
          &:hover{
            background: #F2F4FF;
            color: #465CFE;
            /deep/ .ivu-checkbox-inner{
              border-color: #465CFE;
            }
          }
          .color{
            color:#465CFE
          }
        }
        .item_wrapper {
          display: flex;
          align-items: center;
          padding-left: 10px;
          &:hover{
            background: #F2F4FF;
            color: #465CFE;
           /deep/ .ivu-checkbox-inner{
              border-color: #465CFE;
            }
          }
          .check_box {
            display: inline-block;
            height: 35px;
            line-height: 35px;
          }
          .check_label {
            display: inline-block;
            width: 85px;
            vertical-align: middle;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .cursor_pointer{
            cursor: pointer;
          }
          .color{
            color:#465CFE
          }

        }
      }
    }
  }
</style>
