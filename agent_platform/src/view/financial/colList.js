export const getDetailCols = (self) => {
  return [
    {
      title: '代理商ID',
      key: 'index',
      minWidth: 100,
      sortable: 'custom'
    },
    {
      title: '代理商名称',
      key: 'name',
      minWidth: 150
    },
    {
      title: '公司名称',
      key: 'name',
      minWidth: 150
    },
    {
      title: '总充值额',
      key: 'sum_money',
      minWidth: 100,
      sortable: 'custom'
    },
    {
      title: '总余额',
      key: 'sum_balance',
      minWidth: 100,
      sortable: 'custom'
    },
    {
      title: '总利润',
      key: 'sum_profit',
      minWidth: 100,
      sortable: 'custom'
    },
    {
      title: '现金余额',
      key: 'balance',
      minWidth: 100,
      sortable: 'custom'
    },
    {
      title: '利润余额',
      key: 'profit',
      minWidth: 100,
      sortable: 'custom'
    },
    {
      title: '操作',
      slot: 'action',
      width: 120
    }

  ]
}
export const getInfroCols = (self) => {
  return  [
    {
      title: '明细编号',
      key: 'id',
      width: 80,
      minWidth: 80
    },
    {
      title: '创建时间',
      key: 'create_time'
    },
    {
      title: '金额',
      slot: 'amount'
    },
    {
      title: '明细',
      slot: 'remark'
    },
    {
      title: '代理商名称',
      slot: 'agentName'
    },
    {
      title: '代理商ID',
      slot: 'agentID'
    },
    {
      title: '公司名称',
      slot: 'companyName'
    },
    {
      title: '操作人',
      slot: 'operator'
    },
    {
      title: '备注',
      slot: 'comment'
    }
  ]
}
