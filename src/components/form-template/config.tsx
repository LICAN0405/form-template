import type { ProColumns } from '@ant-design/pro-components'
import { Button, Popconfirm, Space, Tag, Tooltip } from 'antd'

export type FormTemplateRecord = {
  id: number
  column1: string
  column2: string
  column3: number
  column4: string
  column5: string
  status: 'enabled' | 'disabled'
  createdAt: string
}

export type FormItemConfig = {
  name: keyof Pick<FormTemplateRecord, 'column1' | 'column2' | 'column3' | 'column4' | 'column5' | 'status'>
  label: string
  valueType: 'text' | 'digit' | 'select' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: {
    label: string
    value: FormTemplateRecord['status']
    color?: string
    backgroundColor?: string
    borderColor?: string
  }[]
}

export const statusOptions: FormItemConfig['options'] = [
  {
    label: '启用',
    value: 'enabled',
    color: '#389E0D',
    backgroundColor: '#F6FFED',
    borderColor: '#b7eb8f',
  },
  {
    label: '停用',
    value: 'disabled',
    color: '#000000e0',
    backgroundColor: '#f5f5f5',
    borderColor: '#d9d9d9',
  },
]

export const formItemConfigs: FormItemConfig[] = [
  {
    name: 'column1',
    label: '列1',
    valueType: 'text',
    required: true,
    placeholder: '请输入列1',
  },
  {
    name: 'column2',
    label: '列2',
    valueType: 'text',
    required: true,
    placeholder: '请输入列2',
  },
  {
    name: 'column3',
    label: '列3',
    valueType: 'digit',
    required: true,
    placeholder: '请输入列3',
  },
  {
    name: 'column4',
    label: '列4',
    valueType: 'text',
    placeholder: '请输入列4',
  },
  {
    name: 'column5',
    label: '列5',
    valueType: 'textarea',
    placeholder: '请输入列5',
  },
  {
    name: 'status',
    label: '列6',
    valueType: 'select',
    required: true,
    placeholder: '请选择列6',
    options: statusOptions,
  },
]

export const columns = (
  openDetail: (mode: 'add' | 'view' | 'edit', id?: number) => void,
  handleDelete: (record: FormTemplateRecord) => Promise<void>,
): ProColumns<FormTemplateRecord>[] => [
  {
    title: '列1',
    dataIndex: 'column1',
    width: 160,
    ellipsis: { showTitle: false },
    render: (_, record) => (
      <Tooltip title={record.column1}>
        <span style={{ display: 'inline-block', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {record.column1}
        </span>
      </Tooltip>
    ),
  },
  {
    title: '列2',
    dataIndex: 'column2',
    width: 160,
    ellipsis: { showTitle: false },
    render: (_, record) => (
      <Tooltip title={record.column2}>
        <span style={{ display: 'inline-block', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {record.column2}
        </span>
      </Tooltip>
    ),
  },
  {
    title: '列3',
    dataIndex: 'column3',
    width: 120,
    search: false,
    ellipsis: { showTitle: false },
    render: (_, record) => (
      <Tooltip title={record.column3}>
        <span style={{ display: 'inline-block', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {record.column3}
        </span>
      </Tooltip>
    ),
  },
  {
    title: '列4',
    dataIndex: 'column4',
    width: 160,
    search: false,
    ellipsis: { showTitle: false },
    render: (_, record) => (
      <Tooltip title={record.column4}>
        <span style={{ display: 'inline-block', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {record.column4}
        </span>
      </Tooltip>
    ),
  },
  {
    title: '列6',
    dataIndex: 'status',
    width: 120,
    valueType: 'select',
    fieldProps: {
      options: statusOptions,
    },
    render: (_, record) => {
      const status = statusOptions.find((item) => item.value === record.status) ?? {
        label: record.status,
        color: undefined,
        backgroundColor: undefined,
        borderColor: undefined,
      }

      return (
        <Tag
          color={status.backgroundColor}
          style={{
            color: status.color,
            borderColor: status.borderColor,
            borderStyle: 'solid',
            borderWidth: 1,
          }}
        >
          {status.label}
        </Tag>
      )
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    search: false,
  },
  {
    title: '操作',
    valueType: 'option',
    width: 180,
    fixed: 'right',
    render: (_, record) => (
      <Space size={8}>
        <Button type="link" size="small" onClick={() => openDetail('view', record.id)}>
          详情
        </Button>
        <Button type="link" size="small" onClick={() => openDetail('edit', record.id)}>
          编辑
        </Button>
        <Popconfirm title="确认删除这条数据吗？" onConfirm={() => handleDelete(record)}>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
]
