import { ProTable } from '@ant-design/pro-components'
import type { ActionType } from '@ant-design/pro-components'
import { Button, Empty, message } from 'antd'
import { useRef } from 'react'
import { deleteFormTemplate, getFormTemplatePage } from './api'
import type { GetFormTemplatePageParams } from './api'
import { columns } from './config'
import Detail from './detail'
import type { DetailRef, FormMode } from './detail'
import styles from './index.module.less'

const FormTemplate = () => {
  const detailRef = useRef<DetailRef>(null)
  const actionRef = useRef<ActionType | undefined>(undefined)

  const openDetail = (mode: FormMode, id?: number) => {
    detailRef.current?.open(mode, id)
  }

  const handleDelete = async (record: { id: number }) => {
    await deleteFormTemplate({ id: record.id })
    message.success('操作成功')
    actionRef.current?.reload()
  }

  const handleSubmitSuccess = () => {
    message.success('操作成功')
    actionRef.current?.reload()
  }

  const fetchTableData = async (
    params: GetFormTemplatePageParams & {
      current?: number
      pageSize?: number
    },
  ) => {
    const { current = 1, pageSize = 10, ...searchParams } = params
    const res = await getFormTemplatePage({
      ...searchParams,
      current,
      pageSize,
    })

    return {
      data: res.records,
      success: true,
      total: res.total,
    }
  }

  return (
    <div className={styles.container}>
      <ProTable
        className="page-proTable-container"
        actionRef={actionRef}
        request={fetchTableData}
        search={{
          labelWidth: 100,
        }}
        columns={columns(openDetail, handleDelete)}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          defaultPageSize: 10,
          showTotal: (total) => <div>共 {total} 条</div>,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" onClick={() => openDetail('add')}>
            新增
          </Button>,
        ]}
        scroll={{
          x: 'max-content',
          y: 'auto',
        }}
        locale={{
          emptyText: <Empty description="暂无数据" />,
        }}
      />
      <Detail ref={detailRef} onSubmitSuccess={handleSubmitSuccess} />
    </div>
  )
}

export default FormTemplate
