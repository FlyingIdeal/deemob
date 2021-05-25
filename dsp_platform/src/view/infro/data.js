export const getAptitudeCols = (self) => {
  return [
    {
      title: '资质类型',
      slot: 'qualification_type',
      width: 142
    },
    {
      title: '是否必填',
      slot: 'required',
      width: 65
    },
    {
      title: '资质说明',
      slot: 'qualification_desc',
      width: 140
    },
    {
      title: '资质文件',
      slot: 'qualification_url',
      width: 200
    },
    {
      title: '资质有效期',
      slot: 'data',
      width: 210
    },
    {
      title: '备注',
      slot: 'comment',
      width: 150
    },
    {
      title: '操作',
      slot: 'action',
      width: 70,
      align: 'center'
    }
  ]
}
