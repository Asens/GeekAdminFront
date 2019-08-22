<template>
  <a-modal
    title="定时任务"
    :width="640"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          label="id"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          style="display: none"
        >
          <a-input type="hidden" v-decorator="['id']" />
        </a-form-item>
        <a-form-item
          label="bean名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['beanName',{rules: [
              {required: true, message: '请输入bean名称'},
              {min: 2,max:20, message: 'bean名称最小长度2,最大长度20'},
              {pattern: /^[0-9a-zA-Z]+$/, message: 'bean名称包含不支持的字符'}
            ]}]" />
        </a-form-item>

        <a-form-item
          label="方法名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['methodName', {rules: [
              {required: true, message: '请输入方法名称'},
              {min: 2,max:20, message: 'bean名称最小长度2,最大长度20'},
              {pattern: /^[0-9a-zA-Z]+$/, message: '方法名称包含不支持的字符'}
            ]}]" />
        </a-form-item>

        <a-form-item
          label="描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['remark', {rules: [
              {required: true, message: '请输入描述'},
              {min: 2,max:20, message: 'bean名称最小长度2,最大长度20'},
              {pattern: /^[0-9a-zA-Z\u4E00-\u9FA5]+$/, message: 'bean名称包含不支持的字符'}
            ]}]" />
        </a-form-item>

        <a-form-item
          label="参数"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['params', {rules: [
              {max:50, message: '参数最大长度50'}
            ]}]" />
        </a-form-item>

        <a-form-item
          label="cron表达式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="['cronExpression', {rules: [
              {required: true, message: '请输入cron表达式'},
              {max:15, message: '请输入正确的cron表达式'}
            ]}]" />
        </a-form-item>

        <a-form-item
          label="状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group v-decorator="['status',{initialValue:'1'}]">
            <a-radio value="1">
              启用
            </a-radio>
            <a-radio value="0">
              禁用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

    </a-spin>
  </a-modal>
</template>

<script>
import { editScheduleJob, saveScheduleJob } from '@/api/schedule'

export default {
  name: 'ScheduleEdit',
  data () {
    return {
      parentCode: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add () {
      this.form.resetFields()
      this.visible = true
    },
    edit (id) {
      this.form.resetFields()
      this.confirmLoading = true
      this.visible = true
      editScheduleJob({ id: id }).then(res => {
        this.form.setFieldsValue({
          beanName: res.data.beanName,
          methodName: res.data.methodName,
          params: res.data.params,
          remark: res.data.remark,
          id: res.data.id,
          cronExpression: res.data.cronExpression
        })
        this.confirmLoading = false
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          saveScheduleJob(values).then(res => {
            this.confirmLoading = false
            if (res.status === 'success') {
              this.visible = false
              this.confirmLoading = false
              this.$emit('ok', values)
              this.$message.success('保存成功')
            } else {
              this.$notification.error({
                message: '保存失败',
                description: res.message
              })
            }
          }).catch(error => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
