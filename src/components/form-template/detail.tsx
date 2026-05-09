import { ModalForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Form } from 'antd'
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
            form.setFieldsValue(res)
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
    </ModalForm>
  )
})

Detail.displayName = 'Detail'

export default Detail
