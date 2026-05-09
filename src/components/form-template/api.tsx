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

export const getFormTemplatePage = async (params: GetFormTemplatePageParams = {}) => {
  await wait()

  const { current = 1, pageSize = 10, column1, column2, status } = params
  const filteredList = mockList.filter((item) => {
    const matchColumn1 = column1 ? item.column1.includes(column1) : true
    const matchColumn2 = column2 ? item.column2.includes(column2) : true
    const matchStatus = status ? item.status === status : true

    return matchColumn1 && matchColumn2 && matchStatus
  })
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
