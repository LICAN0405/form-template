import type { FormTemplateRecord } from './config'

export type GetFormTemplatePageParams = {
  current?: number
  pageSize?: number
  column1?: string
  column2?: string
  status?: FormTemplateRecord['status']
}

export type FormTemplatePayload = Omit<FormTemplateRecord, 'id' | 'createdAt'>

const wait = (ms = 260) => new Promise((resolve) => window.setTimeout(resolve, ms))

let mockId = 21

let mockList: FormTemplateRecord[] = [
  {
    id: 1,
    column1: '列1数据-001',
    column2: '列2数据-001',
    column3: 100,
    column4: '列4数据-001',
    column5: '这是一条模拟详情内容',
    status: 'enabled',
    createdAt: '2026-05-09 09:30:00',
  },
  {
    id: 2,
    column1: '列1数据-002',
    column2: '列2数据-002',
    column3: 240,
    column4: '列4数据-002',
    column5: '用于演示编辑回显',
    status: 'disabled',
    createdAt: '2026-05-09 10:12:00',
  },
  {
    id: 3,
    column1: '列1数据-003',
    column2: '列2数据-003',
    column3: 360,
    column4: '列4数据-003',
    column5: 'ProTable 模板模拟数据',
    status: 'enabled',
    createdAt: '2026-05-09 11:05:00',
  },
  {
    id: 4,
    column1: '列1数据-004',
    column2: '列2数据-004',
    column3: 520,
    column4: '列4数据-004',
    column5: '新增编辑详情共用弹窗',
    status: 'enabled',
    createdAt: '2026-05-09 13:48:00',
  },
  {
    id: 5,
    column1: '列1数据-005',
    column2: '列2数据-005',
    column3: 680,
    column4: '列4数据-005',
    column5: '后续可替换为真实接口',
    status: 'disabled',
    createdAt: '2026-05-09 15:20:00',
  },
  {
    id: 6,
    column1: '列1数据-006',
    column2: '列2数据-006',
    column3: 720,
    column4: '列4数据-006',
    column5: '用于演示分页数据',
    status: 'enabled',
    createdAt: '2026-05-09 16:05:00',
  },
  {
    id: 7,
    column1: '列1数据-007',
    column2: '列2数据-007',
    column3: 860,
    column4: '列4数据-007',
    column5: '列表查询模拟数据',
    status: 'disabled',
    createdAt: '2026-05-09 16:42:00',
  },
  {
    id: 8,
    column1: '列1数据-008',
    column2: '列2数据-008',
    column3: 940,
    column4: '列4数据-008',
    column5: '支持导出测试',
    status: 'enabled',
    createdAt: '2026-05-09 17:10:00',
  },
  {
    id: 9,
    column1: '列1数据-009',
    column2: '列2数据-009',
    column3: 1080,
    column4: '列4数据-009',
    column5: '支持编辑回显测试',
    status: 'enabled',
    createdAt: '2026-05-09 17:36:00',
  },
  {
    id: 10,
    column1: '列1数据-010',
    column2: '列2数据-010',
    column3: 1200,
    column4: '列4数据-010',
    column5: '支持删除刷新测试',
    status: 'disabled',
    createdAt: '2026-05-09 18:00:00',
  },
  {
    id: 11,
    column1: '列1数据-011',
    column2: '列2数据-011',
    column3: 1320,
    column4: '列4数据-011',
    column5: '第二页模拟数据',
    status: 'enabled',
    createdAt: '2026-05-10 09:15:00',
  },
  {
    id: 12,
    column1: '列1数据-012',
    column2: '列2数据-012',
    column3: 1440,
    column4: '列4数据-012',
    column5: '用于测试状态筛选',
    status: 'disabled',
    createdAt: '2026-05-10 09:48:00',
  },
  {
    id: 13,
    column1: '列1数据-013',
    column2: '列2数据-013',
    column3: 1560,
    column4: '列4数据-013',
    column5: '模拟详情内容',
    status: 'enabled',
    createdAt: '2026-05-10 10:22:00',
  },
  {
    id: 14,
    column1: '列1数据-014',
    column2: '列2数据-014',
    column3: 1680,
    column4: '列4数据-014',
    column5: '模板基础数据',
    status: 'enabled',
    createdAt: '2026-05-10 10:56:00',
  },
  {
    id: 15,
    column1: '列1数据-015',
    column2: '列2数据-015',
    column3: 1800,
    column4: '列4数据-015',
    column5: '搜索条件测试数据',
    status: 'disabled',
    createdAt: '2026-05-10 11:30:00',
  },
  {
    id: 16,
    column1: '列1数据-016',
    column2: '列2数据-016',
    column3: 1920,
    column4: '列4数据-016',
    column5: '导入导出联调数据',
    status: 'enabled',
    createdAt: '2026-05-10 13:05:00',
  },
  {
    id: 17,
    column1: '列1数据-017',
    column2: '列2数据-017',
    column3: 2040,
    column4: '列4数据-017',
    column5: '附件上传测试数据',
    status: 'disabled',
    createdAt: '2026-05-10 13:40:00',
  },
  {
    id: 18,
    column1: '列1数据-018',
    column2: '列2数据-018',
    column3: 2160,
    column4: '列4数据-018',
    column5: '图片上传测试数据',
    status: 'enabled',
    createdAt: '2026-05-10 14:18:00',
  },
  {
    id: 19,
    column1: '列1数据-019',
    column2: '列2数据-019',
    column3: 2280,
    column4: '列4数据-019',
    column5: '分页尾页测试数据',
    status: 'enabled',
    createdAt: '2026-05-10 15:02:00',
  },
  {
    id: 20,
    column1: '列1数据-020',
    column2: '列2数据-020',
    column3: 2400,
    column4: '列4数据-020',
    column5: '第20条模拟数据',
    status: 'disabled',
    createdAt: '2026-05-10 15:45:00',
  },
]

const cloneRecord = (record: FormTemplateRecord) => ({ ...record })

const filterFormTemplateList = (params: GetFormTemplatePageParams = {}) => {
  const { column1, column2, status } = params

  return mockList.filter((item) => {
    const matchColumn1 = column1 ? item.column1.includes(column1) : true
    const matchColumn2 = column2 ? item.column2.includes(column2) : true
    const matchStatus = status ? item.status === status : true

    return matchColumn1 && matchColumn2 && matchStatus
  })
}

export const getFormTemplatePage = async (params: GetFormTemplatePageParams = {}) => {
  await wait()

  const { current = 1, pageSize = 10 } = params
  const filteredList = filterFormTemplateList(params)
  const start = (current - 1) * pageSize
  const end = start + pageSize

  return {
    records: filteredList.slice(start, end).map(cloneRecord),
    total: filteredList.length,
  }
}

export const getFormTemplateDetail = async ({ id }: { id: number }) => {
  await wait(180)
  const record = mockList.find((item) => item.id === id)
  if (!record) {
    throw new Error('数据不存在')
  }

  return cloneRecord(record)
}

export const addFormTemplate = async (values: FormTemplatePayload) => {
  await wait()
  const record: FormTemplateRecord = {
    ...values,
    id: mockId,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
  }

  mockId += 1
  mockList = [record, ...mockList]
  return cloneRecord(record)
}

export const updateFormTemplate = async (values: Partial<FormTemplatePayload> & { id: number }) => {
  await wait()

  mockList = mockList.map((item) => (item.id === values.id ? { ...item, ...values } : item))
  const record = mockList.find((item) => item.id === values.id)
  if (!record) {
    throw new Error('数据不存在')
  }
  return cloneRecord(record)
}

export const deleteFormTemplate = async ({ id }: { id: number }) => {
  await wait()
  mockList = mockList.filter((item) => item.id !== id)
  return true
}

const escapeCsvValue = (value?: string | number) => {
  const text = String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

export const exportFormTemplatePage = async (params: GetFormTemplatePageParams = {}) => {
  await wait(180)

  const statusTextMap: Record<FormTemplateRecord['status'], string> = {
    enabled: '启用',
    disabled: '停用',
  }
  const header = ['列1', '列2', '列3', '列4', '列5', '列6', '创建时间']
  const rows = filterFormTemplateList(params).map((item) => [
    item.column1,
    item.column2,
    item.column3,
    item.column4,
    item.column5,
    statusTextMap[item.status],
    item.createdAt,
  ])
  const csv = [header, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\n')

  return new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8',
  })
}

export const downloadFormTemplateImportTemplate = async () => {
  await wait(180)

  const header = ['列1', '列2', '列3', '列4', '列5', '列6']
  const example = ['示例数据', '示例数据', '100', '示例数据', '示例详情', '启用']
  const csv = [header, example].map((row) => row.map(escapeCsvValue).join(',')).join('\n')

  return new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8',
  })
}

export const importFormTemplateFile = async (file: File) => {
  await wait(360)

  const record: FormTemplateRecord = {
    id: mockId,
    column1: `导入数据-${mockId}`,
    column2: file.name,
    column3: 0,
    column4: '批量导入',
    column5: '模拟导入生成的数据',
    status: 'enabled',
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-'),
  }

  mockId += 1
  mockList = [record, ...mockList]

  return {
    code: 200,
    data: {
      successTotal: 1,
      failTotal: 0,
      illegalDataNum: '',
      repeatNum: '',
    },
    message: '导入成功',
  }
}
