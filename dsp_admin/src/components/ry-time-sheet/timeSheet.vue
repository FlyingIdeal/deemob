<template lang="html">
  <div class="ry-time-sheet">
    <table>
      <tbody id="J_timedSheet"></tbody>
    </table>
  </div>
</template>

<script>
  import '@/assets/js/TimeSheet'

  export default {
    name: 'timeSheet',
    props: {
      value: {
        type: String,
        default: ''
      },
      empty: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        sheet: null,
        dimensions: [7, 24],
        dayList: [
          { name: '周一', title: '' },
          { name: '周二', title: '' },
          { name: '周三', title: '' },
          { name: '周四', title: '' },
          { name: '周五', title: '' },
          { name: '周六', title: '' },
          { name: '周日', title: '' }
        ],
        hourList: [
          {name: '00:00', title: '00:00~01:00'},
          {name: '01:00', title: '01:00~02:00'},
          {name: '02:00', title: '02:00~03:00'},
          {name: '03:00', title: '03:00~04:00'},
          {name: '04:00', title: '04:00~05:00'},
          {name: '05:00', title: '05:00~06:00'},
          {name: '06:00', title: '06:00~07:00'},
          {name: '07:00', title: '07:00~08:00'},
          {name: '08:00', title: '08:00~09:00'},
          {name: '09:00', title: '09:00~10:00'},
          {name: '10:00', title: '10:00~11:00'},
          {name: '11:00', title: '11:00~12:00'},
          {name: '12:00', title: '12:00~13:00'},
          {name: '13:00', title: '13:00~14:00'},
          {name: '14:00', title: '14:00~15:00'},
          {name: '15:00', title: '15:00~16:00'},
          {name: '16:00', title: '16:00~17:00'},
          {name: '17:00', title: '17:00~18:00'},
          {name: '18:00', title: '18:00~19:00'},
          {name: '19:00', title: '19:00~20:00'},
          {name: '20:00', title: '20:00~21:00'},
          {name: '21:00', title: '21:00~22:00'},
          {name: '22:00', title: '22:00~23:00'},
          {name: '23:00', title: '23:00~24:00'}
        ]
      }
    },
    created() {
    },
    mounted() {
      let newvaule = this.value.padEnd(168, 0)
      let newarr = this.sliceArray(newvaule, 24)
      this.sheet = $('#J_timedSheet').TimeSheet({
        data: {
          dimensions: this.dimensions,
          colHead: this.hourList,
          rowHead: this.dayList,
          sheetHead: { name: '星期/时间' },
          sheetData: newarr,
          thColspan: 12,
          tdColspan: 1
        },
        remarks: false,
        end: (ev, selectedArea) => {
          this.updateRemark(this.sheet)
        }
      })
      this.updateRemark(this.sheet)
    },
    methods: {
      updateRemark(sheet) {
        let sheetStates = sheet.getSheetStates().flat()
        let newSheetStates = sheetStates.join('')
        this.$emit('input', newSheetStates)
      },
      sliceArray(arr, size) {
        var arr2 = []
        for (var i = 0; i < arr.length; i = i + size) {
          arr2.push(arr.slice(i, i + size).split(''))
          }
        return arr2
      },
      emptyData() {
        let time = ''
        let newvaule = time.padEnd(168, 0)
        let newarr = this.sliceArray(newvaule, 24)
        this.sheet = $('#J_timedSheet').TimeSheet({
          data: {
            dimensions: this.dimensions,
            colHead: this.hourList,
            rowHead: this.dayList,
            sheetHead: { name: '星期/时间' },
            sheetData: newarr,
            thColspan: 12,
            tdColspan: 1
          },
          remarks: false,
          end: (ev, selectedArea) => {
            this.updateRemark(this.sheet)
          }
        })
        this.updateRemark(this.sheet)
      },
      data(val) {
        let newvaule = val.padEnd(168, 0)
        let newarr = this.sliceArray(newvaule, 24)
        this.sheet = $('#J_timedSheet').TimeSheet({
          data: {
            dimensions: this.dimensions,
            colHead: this.hourList,
            rowHead: this.dayList,
            sheetHead: { name: '星期/时间' },
            sheetData: newarr,
            thColspan: 12,
            tdColspan: 1
          },
          remarks: false,
          end: (ev, selectedArea) => {
            this.updateRemark(this.sheet)
          }
        })
        this.updateRemark(this.sheet)
      }
    },
    watch: {
      empty: {
        handler: function (v) {
          this.emptyData()
        }
      },
      value: {
        handler: function (v) {
          this.data(v)
        }
      }

    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "./index.less";
  .TimeSheet .TimeSheet-cell {
    min-width: 22px;
    height: 36px;
  }
  .TimeSheet .TimeSheet-rowHead{
    min-width: 38px;
    padding: 0px;
  }
  .TimeSheet .week-td {
    font-size: 14px;
    font-weight: normal;
    border-right: 1px solid #e3e3e3;
  }
</style>
