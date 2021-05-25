export const customColumn = {
  data() {
    return {
      adManageHasCheckData: [ // 抽屉 -  - 已选择列（下拉滚动）
        // 基本数据
        // '时间',
        '内部广告位名称',
        '外部广告位ID',
        '应用名称/ID',
        '应用平台',
        '媒体简称/ID',
        '接入方式',
        '广告场景',
        '广告样式',
        '渲染方式',
        '素材尺寸比例',
        '业务状态',
        '广告位状态',
        '创建时间',
        '更新时间',

        // 数据指标
        '今日请求量',

        // 结算及价格
        '结算方式',
        '结算价格',
        '出价CPM',
        'CPM底价',
        'CPC底价',

        // 基本指标
        '有效广告请求pv',
        '有效广告请求uv',
        '广告返回pv',
        '广告返回uv',
        '广告展现pv',
        '广告展现uv',
        '广告点击pv',
        '广告点击uv',
        '调起数',
        '下载完成量',
        '安装量',
        '激活量',

        // 运营情况
        '运营状态',
        '运营状态原因',
        '关联产品',
        '关联预算位',

        // 扣量策略
        '广告展现保留比',
        '广告点击保留比',
        '第三方SDK接入',
        '穿山甲广告位ID',
        '优量汇广告位ID',
        '交互通广告位ID'

      ],
      basic_information: [ // 基本数据
        '内部广告位名称',
        '外部广告位ID',
        '应用名称/ID',
        '应用平台',
        '媒体简称/ID',
        '接入方式',
        '广告场景',
        '广告样式',
        '渲染方式',
        '素材尺寸比例',
        '业务状态',
        '广告位状态',
        '创建时间',
        '更新时间'
      ],
      data_indicator: [ // 抽屉  - 数据指标
        '今日请求量'
      ],
      settlement_price: [ // 抽屉 结算与价格
        '结算方式',
        '结算价格',
        '出价CPM',
        'CPM底价',
        'CPC底价'
      ],
      operation_situation: [ // 抽屉 - 运营情况
        '运营状态',
        '运营状态原因',
        '关联产品',
        '关联预算位'
      ],
      batch_tactics: [ // 抽屉 - 扣量信息
        '广告展现保留比',
        '广告点击保留比'
      ],
      SDK_platform: [ // 抽屉 - 扣量信息
        '第三方SDK接入',
        '穿山甲广告位ID',
        '优量汇广告位ID',
        '交互通广告位ID'
      ],
      product_information: [
        '今日状态',
        '测试激活率',
        // '标记',
        '备注'
      ]
    }
  }
}
