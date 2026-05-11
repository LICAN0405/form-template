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

let mockId = 6

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
