import { DownloadOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'
import type { CSSProperties } from 'react'
import { useState } from 'react'

export interface DownloadFileProps {
  downloadFileButtonText?: string
  downloadFileBlobType?: string
  requestMethod?: 'POST' | 'GET'
  requestParams?: Record<string, any>
  requestData?: Record<string, any>
  requestUrl?: string
  requestHeaders?: Record<string, string>
  fileLink?: string
  fileName?: string
  style?: CSSProperties
  className?: string
  beforeDownloadFile?: (handleDownloadTemplate: () => void) => void | Promise<void>
  mockRequest?: () => Promise<Blob>
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
}

const handleDownloadBlobFile = (blob: Blob, fileName: string, blobType?: string) => {
  const url = window.URL.createObjectURL(blobType ? new Blob([blob], { type: blobType }) : blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  window.URL.revokeObjectURL(url)
  link.remove()
}

const handleDownloadFile = (url: string, fileName?: string) => {
  const link = document.createElement('a')
  link.href = url
  if (fileName) {
    link.download = fileName
  }
  link.click()
  link.remove()
}

const getRequestUrl = (requestUrl: string, requestParams?: Record<string, any>) => {
  const params = new URLSearchParams()

  Object.entries(requestParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  })

  const paramsString = params.toString()
  if (!paramsString) {
    return requestUrl
  }

  return `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${paramsString}`
}

const getFileNameFromHeader = (contentDisposition: string | null, fallbackFileName?: string) => {
  const fallback = `${fallbackFileName || '导出文件'}.xlsx`
  if (!contentDisposition) {
    return fallback
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''(?<filename>[^;]+)/)
  const filenameMatch = contentDisposition.match(/filename=(?<filename>[^;]+)/)
  const filename = utf8Match?.groups?.filename ?? filenameMatch?.groups?.filename

  if (!filename) {
    return fallback
  }

  return decodeURIComponent(filename.replaceAll('"', ''))
}

const DownloadFile = (props: DownloadFileProps) => {
  const {
    downloadFileButtonText = '下载模板',
    requestMethod,
    requestParams,
    requestData,
    requestUrl,
    requestHeaders,
    fileLink,
    fileName,
    style,
    className,
    downloadFileBlobType,
    beforeDownloadFile,
    mockRequest,
    type,
  } = props
  const [loading, setLoading] = useState(false)

  const handleDownloadTemplate = async () => {
    if (fileLink) {
      const suffix = fileLink.split('.').pop()
      handleDownloadFile(fileLink, suffix && fileName ? `${fileName}.${suffix}` : fileName)
      return
    }

    setLoading(true)
    try {
      if (mockRequest) {
        const blob = await mockRequest()
        handleDownloadBlobFile(blob, `${fileName || '导出文件'}.csv`, downloadFileBlobType)
        return
      }

      if (requestMethod && requestUrl) {
        const response = await fetch(getRequestUrl(requestUrl, requestParams), {
          method: requestMethod,
          headers: requestHeaders,
          body: requestMethod === 'POST' ? JSON.stringify(requestData ?? {}) : undefined,
        })

        if (!response.ok) {
          message.error('操作失败')
          return
        }

        const blob = await response.blob()
        const downloadedFileName = getFileNameFromHeader(response.headers.get('content-disposition'), fileName)
        handleDownloadBlobFile(blob, downloadedFileName, downloadFileBlobType)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      style={style}
      className={className}
      type={type ?? 'default'}
      loading={loading}
      onClick={async () => {
        if (beforeDownloadFile) await beforeDownloadFile(handleDownloadTemplate)
        else await handleDownloadTemplate()
      }}
    >
      <DownloadOutlined />
      {downloadFileButtonText}
    </Button>
  )
}

export default DownloadFile
