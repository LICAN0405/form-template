import { UploadOutlined } from '@ant-design/icons'
import { Button, Modal, Upload, message, notification } from 'antd'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import DownloadFile from './download-file'
import type { DownloadFileProps } from './download-file'
import styles from './index.module.less'

export interface ImporterProps {
  action: string
  headers?: Record<string, any>
  requestData?: Record<string, any>
  accept?: string
  requestMethod?: 'POST' | 'PUT' | 'PATCH' | 'post' | 'put' | 'patch'
  afterImportSuccess?: ({ file, fileList }: { file: any; fileList: any[] }) => void
  successInfo?: boolean
  modalFn?: (visible: boolean) => void
  mockRequest?: (file: File) => Promise<any>
}

interface ImportProps {
  importerText?: string
  downloadFileProps: DownloadFileProps
  importerProps: ImporterProps
  style?: CSSProperties
  className?: string
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
}

const ImporterButton = (props: ImporterProps) => {
  const {
    action,
    headers,
    requestData,
    accept = '.xlsx,.xls',
    requestMethod = 'POST',
    afterImportSuccess,
    successInfo = true,
    modalFn,
    mockRequest,
  } = props
  const [notify, contextHolder] = notification.useNotification()
  const [fileList, setFileList] = useState<any[]>([])

  const handleSuccess = (file: any, nextFileList: any[]) => {
    const response = file?.response
    setFileList([])

    if (successInfo) {
      if (response?.data?.failTotal > 0) {
        notify.open({
          type: 'error',
          message: (
            <div>
              导入失败，失败数量：{response?.data?.failTotal} 成功数量：
              {response?.data?.successTotal}
            </div>
          ),
          description: (
            <div>
              <div>非法数据类型行： {response?.data?.illegalDataNum || '无'}</div>
              <div>重复数据行： {response?.data?.repeatNum || '无'}</div>
            </div>
          ),
          placement: 'topRight',
          duration: 0,
        })
      } else {
        notify.open({
          type: 'success',
          message: <div>导入成功，成功数量：{response?.data?.successTotal}</div>,
          placement: 'topRight',
          duration: 5,
        })
      }
    }

    afterImportSuccess?.({ file, fileList: nextFileList })
    modalFn?.(false)
  }

  const handleChange = ({ file, fileList: nextFileList }: { file: any; fileList: any[] }) => {
    setFileList(nextFileList)
    if (file.status === 'removed') return

    const response = file?.response
    if (response?.code === 200) {
      handleSuccess(file, nextFileList)
      return
    }

    if (response && response?.code !== 200) {
      message.error(response?.message || '导入失败')
    }
  }

  return (
    <>
      {contextHolder}
      <Upload
        action={action}
        headers={headers}
        data={requestData}
        maxCount={1}
        onChange={handleChange}
        accept={accept}
        method={requestMethod}
        fileList={fileList}
        customRequest={
          mockRequest
            ? async (options) => {
                const { file, onSuccess, onError } = options
                try {
                  const response = await mockRequest(file as File)
                  onSuccess?.(response)
                } catch (error) {
                  onError?.(error as Error)
                }
              }
            : undefined
        }
      >
        <Button icon={<UploadOutlined />}>上传模板</Button>
      </Upload>
    </>
  )
}

const Import = (props: ImportProps) => {
  const { importerText = '导入', downloadFileProps, importerProps, style, className, type } = props
  const [open, setOpen] = useState(false)

  const blockData = [
    {
      key: 'download-template',
      title: '下载导入模板',
      tooltip: '下载后请按模板格式填写信息',
      component: <DownloadFile {...downloadFileProps} />,
    },
    {
      key: 'upload-template',
      title: '上传填好的模板',
      tooltip: '仅支持 .xls 和 .xlsx 格式文件',
      component: <ImporterButton {...importerProps} modalFn={setOpen} />,
    },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)} style={style} className={className} type={type ?? 'default'}>
        {importerText}
      </Button>
      <Modal open={open} title="导入数据" footer={null} onCancel={() => setOpen(false)}>
        <div className={styles.importModal}>
          {blockData.map((item, index) => (
            <div className={styles.importModalBlock} key={item.key}>
              <div className={styles.importModalBlockText}>
                {`${index + 1}. ${item.title}`}
                <div className={styles.importModalBlockToolTip}>{item.tooltip}</div>
              </div>
              <div className={styles.importModalBlockComponent}>{item.component}</div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

export default Import
