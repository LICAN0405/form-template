import { UploadOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components'
import { Form, message } from 'antd'
import type { UploadFile } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { addFormTemplate, getFormTemplateDetail, updateFormTemplate } from './api'
import type { FormTemplatePayload } from './api'
import { formItemConfigs } from './config'
import type { FormItemConfig, FormTemplateRecord } from './config'
import styles from './index.module.less'

export type FormMode = 'add' | 'view' | 'edit'

export type DetailRef = {
  open: (mode: FormMode, id?: number) => void
  close: () => void
}

export type DetailProps = {
  onSubmitSuccess?: () => void
}

const titleMap: Record<FormMode, string> = {
  add: '表单模板-新增',
  view: '表单模板-详情',
  edit: '表单模板-编辑',
}

type UploadFormValue = UploadFile & {
  response?: {
    data?: {
      fileUrl?: string
      fileName?: string
    }
  }
}

const getFileUrl = (fileUrl?: string) => {
  if (!fileUrl) return ''
  if (/^(blob:|data:|https?:)/.test(fileUrl)) return fileUrl
  return fileUrl
}

const getFileName = (fileUrl: string, fallback: string) => {
  return fileUrl.split('/').pop() || fallback
}
// 将逗号分隔的文件URL字符串转换为Upload组件的fileList格式（处理获取到文件）
const buildUploadFileList = (fileUrls?: string, fallbackName = '文件'): UploadFormValue[] => {
  if (!fileUrls) return []

  return fileUrls
    .split(',')
    .filter(Boolean)
    .map((fileUrl, index) => ({
      uid: `${fileUrl}-${index}`,
      name: getFileName(fileUrl, fallbackName),
      status: 'done',
      url: getFileUrl(fileUrl),
      response: {
        data: {
          fileUrl,
        },
      },
    }))
}
// 将Upload组件的fileList转换为逗号分隔的文件URL字符串（处理提交数据）
const getUploadFileUrls = (fileList?: UploadFormValue[]) => {
  return (
    fileList
      ?.map((file) => file?.response?.data?.fileUrl)
      .filter(Boolean)
      .join(',') || ''
  )
}
// 模拟上传前处理函数，实际项目中可以根据需要进行调整，例如添加公司ID、项目ID等信息
const beforeUpload = async (file: File) => {
  return {
    fileSize: file.size,
    filename: file.name,
    companyId: localStorage.getItem('companyId'),
    projectId: localStorage.getItem('projectId'),
    indexDbId: 0,
  }
}

const mockUploadFile = async (file: File) => {
  const fileUrl = window.URL.createObjectURL(file)

  return {
    code: 200,
    data: {
      fileUrl,
      fileName: file.name,
    },
    message: '上传成功',
  }
}

const Detail = forwardRef<DetailRef, DetailProps>((props, ref) => {
  const { onSubmitSuccess } = props
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<FormMode>('add')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm<FormTemplateRecord>()

  const readonly = mode === 'view'

  useImperativeHandle(ref, () => ({
    open: (openMode: FormMode, id?: number) => {
      setMode(openMode)
      setVisible(true)

      if ((openMode === 'view' || openMode === 'edit') && id) {
        setLoading(true)
        getFormTemplateDetail({ id })
          .then((res) => {
            form.setFieldsValue({
              ...res,
              handlePhoto: buildUploadFileList(res.handlePhoto, '照片'),
              attachment: buildUploadFileList(res.attachment, '文件'),
            } as any)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        form.resetFields()
        form.setFieldsValue({
          status: 'enabled',
        } as FormTemplateRecord)
      }
    },
    close: () => {
      setVisible(false)
      form.resetFields()
    },
  }))

  const handleSubmit = async (values: FormTemplateRecord) => {
    const submitData: FormTemplatePayload = {
      column1: values.column1,
      column2: values.column2,
      column3: values.column3,
      column4: values.column4,
      column5: values.column5,
      status: values.status,
      handlePhoto: getUploadFileUrls((values as any).handlePhoto),
      attachment: getUploadFileUrls((values as any).attachment),
    }

    setLoading(true)
    try {
      if (mode === 'add') {
        await addFormTemplate(submitData)
      }

      if (mode === 'edit') {
        await updateFormTemplate({
          ...submitData,
          id: values.id,
        })
      }

      setVisible(false)
      form.resetFields()
      onSubmitSuccess?.()
      return true
    } finally {
      setLoading(false)
    }
  }

  const renderFormItem = (item: FormItemConfig) => {
    const commonProps = {
      key: item.name,
      name: item.name,
      label: item.label,
      placeholder: item.placeholder,
      disabled: readonly,
      readonly,
      rules: readonly || !item.required ? [] : [{ required: true, message: item.placeholder ?? `请填写${item.label}` }],
      colProps: { span: 24 },
    }

    if (item.valueType === 'digit') {
      return <ProFormDigit {...commonProps} min={0} fieldProps={{ precision: 2 }} />
    }

    if (item.valueType === 'select') {
      return <ProFormSelect {...commonProps} options={item.options} />
    }

    if (item.valueType === 'textarea') {
      return <ProFormTextArea {...commonProps} fieldProps={{ rows: 4 }} />
    }

    return <ProFormText {...commonProps} />
  }
// 上传组件的公共属性配置，包含上传地址、请求头、预览和变更处理等逻辑，避免重复代码
  const getUploadFieldProps = () => ({
    name: 'file',
    action: '/api/bjfiles/files/uploadFileAppend',
    headers: {
      Authorization: 'Bearer ${token}',
    },
    data: beforeUpload,
    showUploadList: true,
    customRequest: async (options: any) => {
      const { file, onSuccess, onError } = options
      try {
        const response = await mockUploadFile(file as File)
        onSuccess?.(response)
      } catch (error) {
        onError?.(error as Error)
      }
    },
    onPreview: (file: UploadFormValue) => {
      let fileUrl = file.url
      if (!fileUrl && file.response?.data?.fileUrl) {
        fileUrl = getFileUrl(file.response.data.fileUrl)
      }
      if (fileUrl) {
        window.open(fileUrl, '_blank')
      } else {
        message.warning('文件无法预览')
      }
    },
    onChange: (info: { fileList: UploadFormValue[] }) => {
      info.fileList.forEach((file) => {
        if (file.status === 'done') {
          const { data } = file?.response ?? {}
          if (data?.fileUrl) {
            file.url = getFileUrl(data.fileUrl)
            file.name = data.fileName || file.name
          }
        }
      })
    },
  })

  return (
    <ModalForm<FormTemplateRecord>
      title={titleMap[mode]}
      open={visible}
      form={form}
      layout="horizontal"
      wrapperCol={{ span: 14 }}
      className={styles.formContainer}
      modalProps={{
        width: 720,
        destroyOnHidden: true,
      }}
      submitter={
        readonly
          ? false
          : {
              submitButtonProps: {
                loading,
              },
              render: (_, dom) => <div className={styles.submitter}>{dom}</div>,
            }
      }
      onOpenChange={(open) => {
        if (!open) {
          setVisible(false)
          form.resetFields()
        }
      }}
      onFinish={handleSubmit}
      grid
      loading={loading}
    >
      <ProFormText name="id" hidden />
      {formItemConfigs.map(renderFormItem)}
      <ProFormUploadButton
        name="handlePhoto"
        label="处理照片"
        max={9}
        accept=".jpg,.jpeg,.png,.pdf"
        title="上传图片"
        icon={<UploadOutlined />}
        colProps={{ span: 24 }}
        fieldProps={{
          ...getUploadFieldProps(),
          listType: 'picture-card',
        }}
        disabled={readonly}
        readonly={readonly}
      />
      <ProFormUploadButton
        name="attachment"
        label="附件"
        max={9}
        accept=".doc,.docx,.xls,.xlsx,.pdf,.png,.jpg,.jpeg"
        title={<span>上传附件</span>}
        icon={<UploadOutlined />}
        colProps={{ span: 24 }}
        fieldProps={{
          ...getUploadFieldProps(),
          listType: 'text',
        }}
        disabled={readonly}
        readonly={readonly}
      />
    </ModalForm>
  )
})

Detail.displayName = 'Detail'

export default Detail
