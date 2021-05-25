<template>
  <div class="wrapper_box"
       :class="_uid">
    <div class="wrapper">
      <div class="header">{{ title }}</div>
      <Input style="width: 210px;margin-left: 10px" class="search" type="text" v-model="search_text" placeholder="请搜索"/>
      <ul class="content">
        <li class="title">
          <template v-if="!onlyBottom">
            <span class="check_box">
              <Checkbox :value="isCheckAll"
                        @on-change="handleCheckAll">{{' '}}</Checkbox>
            </span>
            <span :class="isCheckAll?'color':''">全选</span>
          </template>
        </li>
        <li class="item_wrapper"
            v-for="(item,index) in entites"
            :key="item.id">
          <span class="check_box">
            <template v-if="onlyBottom">
              <Checkbox v-if="!item.children"
                        v-model="item.check"
                        @on-change="handleSelect($event,item,index)"
                        :indeterminate="item.little"/>
            </template>
            <template v-else>
              <Checkbox v-model="item.check"
                        @on-change="handleSelect($event,item,index)"
                        :indeterminate="item.little"/>
            </template>
          </span>
          <div :class="item.check? 'color cursor_pointer': 'cursor_pointer'" @click="handleChildrenDatas(item,index,item.check)">
            <span :title="item.label" class="check_label "
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
                   :datas="childrenDatas"
                   :parentId="hookParentId"
                   :onlyBottom="onlyBottom"
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
      datas: {
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
        childrenTitle: ''
      }
    },
    computed: {
      isCheckAll() {
        return this.checkArrayAll(this.entites)
      },
      entites() {
        if (this.search_text) {
          let data = this.entitesList.filter((value) => {
            return value.label.includes(this.search_text)
          })
          return data
        } else {
          return this.entitesList
        }
      }
    },
    methods: {
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
      handleChildrenDatas(item, index, checked) {
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
          this.childrenTitle = item.childrenName ? item.childrenName : item.label
        }
      },
      handleSelect(checked, item, index) {
        if (checked) item.little = false
        this.selectedIndex = index
        if (item.children && item.children.length) {
          item.children = this.hookMapSelect(item.children, checked)
          this.childrenDatas = item.children
          this.childrenTitle = item.childrenName ? item.childrenName : item.label
        }
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
      datas: {
        deep: true,
        immediate: true,
        handler: function (v) {
          if (v && v.length) {
            this.entitesList = Object.assign([], v)
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
      width: 240px;

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
        padding: 8px 0px 8px 12px;
        width: 100%;
        height: 240px;
        overflow-y: auto;

        .item_wrapper {
          display: flex;
          align-items: center;

          .check_box {
            display: inline-block;
            height: 35px;
            line-height: 35px;
          }
          .check_label {
            display: inline-block;
            width: 160px;
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
