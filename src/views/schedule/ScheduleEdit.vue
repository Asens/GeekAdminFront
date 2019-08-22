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
          <a-input v-decorator="['beanName', {rules: [{required: true, message: '请输入bean名称'}]}]" />
        </a-form-item>

        <a-form-item
          label="方法名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['methodName', {rules: [{required: true, message: '请输入方法名称'}]}]" />
        </a-form-item>

        <a-form-item
          label="描述"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['remark', {rules: [{required: true, message: '请输入描述'}]}]" />
        </a-form-item>

        <a-form-item
          label="参数"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['params']" />
        </a-form-item>

        <a-form-item
          label="cron表达式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['cronExpression', {rules: [{required: true, message: '请输入cron表达式'}]}]" />
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
    add (parentCode) {
      this.form.resetFields()
      this.visible = true
    },
    edit (code) {
      this.form.resetFields()
      this.confirmLoading = true
      this.visible = true
      editScheduleJob({ code: code }).then(res => {
        const menu = res.data
        console.log('menu :' + JSON.stringify(menu))
        this.form.setFieldsValue({
          beanName: menu.beanName
        })
        this.confirmLoading = false
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
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
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
