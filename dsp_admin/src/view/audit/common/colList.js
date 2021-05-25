// 创意审核列表
export const getAuditCols = (self) => {
  return [
    {
      type: 'selection',
      width: 50,
      align: 'center'
    },
    {
      title: '创意名称',
      key: 'creative_name',
      minWidth: 250
    },
    {
      title: '创意ID',
      key: 'buyer_creativeid',
      minWidth: 80
    },
    {
      title: '行业类型',
      key: 'category_text',
      minWidth: 200
    },
    {
      title: '所属广告主',
      slot: 'advertisername',
      minWidth: 120
    },
    {
      title: '所属广告主ID',
      key: 'advertiserid',
      minWidth: 110
    },
    {
      title: '公司名称',
      slot: 'company_name',
      minWidth: 200
    },
    {
      title: '审核状态',
      slot: 'internal_verify',
      minWidth: 110
    },
    {
      title: '审核拒绝原因',
      slot: 'status_desc',
      width: 130
    },
    {
      title: '创建时间',
      key: 'c_time',
      minWidth: 160
    },
    {
      title: '推送审核时间',
      slot: 'updated_at',
      minWidth: 160
    },
    {
      title: '审核时间',
      slot: 'check_time',
      minWidth: 160
    },
    {
      title: '审核员',
      slot: 'check_name',
      minWidth: 80
    },
    {
      title: '操作',
      slot: 'action',
      fixed: 'right',
      width: 90
    }
  ]
}
// 账户审核的列表
export const getAccountCols = (self) => {
  return [
    {
      title: '账户名称',
      key: 'name',
      minWidth: 200
    },
    {
      title: '账户ID',
      slot: 'id',
      minWidth: 80
    },
    {
      title: '账户类型',
      slot: 'type',
      minWidth: 120
    },
    {
      title: '行业类型',
      slot: 'category_text',
      minWidth: 200
    },
    {
      title: '公司名称',
      slot: 'company_name',
      minWidth: 200
    },
    {
      title: '审核状态',
      slot: 'status',
      minWidth: 110
    },
    {
      title: '审核拒绝原因',
      slot: 'status_desc',
      width: 200
    },
    {
      title: '创建时间',
      slot: 'created_at',
      minWidth: 160
    },
    {
      title: '推送审核时间',
      slot: 'updated_at',
      minWidth: 160
    },
    {
      title: '审核时间',
      slot: 'verified_at',
      minWidth: 160
    },
    {
      title: '审核员',
      slot: 'verifier_name',
      minWidth: 80
    },
    {
      title: '操作',
      slot: 'action',
      fixed: 'right',
      width: 90
    }
  ]
}
// 日志账户审核
export const getAccountReCols = (self) => {
  return [
    {
      title: '日志ID',
      key: 'id',
      minWidth: 70
    },
    {
      title: '账户名称',
      key: 'name',
      minWidth: 200
    },
    {
      title: '账户ID',
      slot: 'accountId',
      minWidth: 80
    },
    {
      title: '账户类型',
      slot: 'type',
      minWidth: 120
    },
    {
      title: '行业类型',
      slot: 'category_text',
      minWidth: 250
    },
    {
      title: '公司名称',
      slot: 'company_name',
      minWidth: 200
    },
    {
      title: '审核状态',
      slot: 'status',
      minWidth: 110
    },
    {
      title: '审核拒绝原因',
      slot: 'status_desc',
      width: 200
    },
    {
      title: '账户创建时间',
      slot: 'created_at',
      minWidth: 160
    },
    {
      title: '审核时间',
      slot: 'verified_at',
      minWidth: 160
    },
    {
      title: '审核员',
      slot: 'verifier_name',
      minWidth: 80
    },
    {
      title: '操作',
      slot: 'action',
      fixed: 'right',
      width: 60
    }
  ]
}
// 日志创意审核
export const getAuditReCols = (self) => {
  return [
    {
      title: '日志ID',
      key: 'id',
      minWidth: 75
    },
    {
      title: '创意名称',
      key: 'creative_name',
      minWidth: 200
    },
    {
      title: '创意ID',
      key: 'creative_id',
      minWidth: 80
    },
    {
      title: '行业类型',
      slot: 'category_text',
      minWidth: 120
    },
    {
      title: '所属广告主',
      key: 'advertiser_name',
      minWidth: 120
    },
    {
      title: '所属广告主ID',
      key: 'advertiser_id',
      minWidth: 110
    },
    {
      title: '公司名称',
      key: 'company_name ',
      minWidth: 200
    },
    {
      title: '审核状态',
      slot: 'status',
      minWidth: 110
    },
    {
      title: '审核拒绝原因',
      slot: 'status_desc',
      width: 130
    },
    {
      title: '创意创建时间',
      key: 'creative_created_at',
      minWidth: 160
    },
    {
      title: '审核时间',
      key: 'created_at',
      minWidth: 160
    },
    {
      title: '审核员',
      key: 'verifier_name',
      minWidth: 80
    },
    {
      title: '操作',
      slot: 'action',
      fixed: 'right',
      width: 60
    }
  ]
}
export const getQualifiedCols = (self) => {
  return [
    {
      title: '资质名称',
      slot: 'qualifiedName'
    },
    {
      title: '资质文件',
      slot: 'qualification_url'
    },
    {
      title: '资质有效期',
      slot: 'qualifiedTime'
    },
    {
      title: '备注',
      slot: 'comment'
    }
  ]
}
