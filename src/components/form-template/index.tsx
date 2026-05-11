import { ProTable } from '@ant-design/pro-components'
import type { ActionType } from '@ant-design/pro-components'
import { Button, Empty, message } from 'antd'
import { useRef, useState } from 'react'
import {
  deleteFormTemplate,
  downloadFormTemplateImportTemplate,
  exportFormTemplatePage,
  getFormTemplatePage,
  importFormTemplateFile,
} from './api'
import type { GetFormTemplatePageParams } from './api'
import { columns } from './config'
import Detail from './detail'
import type { DetailRef, FormMode } from './detail'
import DownloadFile from './download-file'
import Import from './import-file'
import styles from './index.module.less'

const FormTemplate = () => {
  const detailRef = useRef<DetailRef>(null)
  const actionRef = useRef<ActionType | undefined>(undefined)
  const [exportParams, setExportParams] = useState<GetFormTemplatePageParams>({})

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
    setExportParams(searchParams)
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
        toolbar={{
          actions: [
            <Button key="add" type="primary" onClick={() => openDetail('add')}>
              新增
            </Button>,
            <DownloadFile
              key="export"
              type="primary"
              downloadFileButtonText="导出"
              requestUrl="/api/form-template/export"
              requestMethod="GET"
              requestParams={exportParams}
              fileName="表单模板"
              mockRequest={() => exportFormTemplatePage(exportParams)}
            />,
            <Import
              key="import"
              type="primary"
              style={{ width: 88 }}
              importerText="批量导入"
              downloadFileProps={{
                downloadFileButtonText: '下载模板',
                requestUrl: '/api/form-template/import/template',
                requestMethod: 'POST',
                fileName: '表单模板导入模板',
                mockRequest: downloadFormTemplateImportTemplate,
              }}
              importerProps={{
                action: '/api/form-template/import',
                successInfo: false,
                mockRequest: importFormTemplateFile,
                afterImportSuccess: () => {
                  actionRef.current?.reload()
                  message.success('导入完成')
                },
              }}
            />,
            // 实操中使用
            //   <DownloadFile
            //   key="export"
            //   type="primary"
            //   downloadFileButtonText="导出"
            //   requestHeaders={{
            //     Authorization: `Bearer ${getCookie('token')}`,
            //     projectId: localStorage.getItem('projectId') ?? '',
            //   }}
            //   requestUrl={`${baseUrl}/${moduleUrl.COMMON_V2}/materialWarehouse/export`}
            //   requestMethod="GET"
            //   requestParams={{}}
            // />,
            // 实操中使用
            // <Import
            //   key="import"
            //   type="primary"
            //   style={{ width: 80 }}
            //   importerText="批量导入"
            //   downloadFileProps={{
            //     requestUrl: '/api/form-template/import/template',
            //     requestHeaders: {
            //       Authorization: `Bearer ${token}`,
            //       projectId: localStorage.getItem('projectId') ?? '',
            //     },
            //     requestMethod: 'POST',
            //   }}
            //   importerProps={{
            //     action: '/api/form-template/import',
            //     headers: {
            //       Authorization: `Bearer ${token}`,
            //       projectId: localStorage.getItem('projectId') ?? '',
            //     },
            //     successInfo: false,
            //     afterImportSuccess: () => {
            //       actionRef.current?.reload()
            //       message.success('导入完成')
            //     },
            //   }}
            // />,
          ],
        }}
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
