<template>
  <a-modal
    title="用户"
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
          label="用户名"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-if="!isUpdate" v-decorator="['username',{rules: [{required: true, message: '请输入用户名'},{min: 2,max:20, message: '用户名最小长度2,最大长度20'},{pattern: /^[0-9a-zA-Z\u4E00-\u9FA5]+$/, message: '用户名包含不支持的字符'}] }]" />
          <span v-else>{{username}}</span>
        </a-form-item>

        <a-form-item
          label="密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :style="{display: isUpdate?'none':'block'}">
          <a-input
            :disabled="isUpdate"
            v-decorator="[
              'password',
              { rules: [{ required: !isUpdate, message: '请输入密码' }] }
            ]"
            type="password"
          />
        </a-form-item>

        <a-form-item
          label="确认密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :style="{display: isUpdate?'none':'block'}">
          <a-input
            v-decorator="[
              'confirmPassword',
              { rules: [{ required: !isUpdate, message: '请输入密码' },{validator: handleConfirmPassword }] }
            ]"
            type="password"
          />
        </a-form-item>

        <a-form-item
          label="昵称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['name',{rules: [{min: 2,max:20, message: '昵称最小长度2,最大长度20'},{pattern: /^[0-9a-zA-Z\u4E00-\u9FA5]+$/, message: '昵称包含不支持的字符'}] }]" />
        </a-form-item>

        <a-form-item
          label="手机号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['phone',{rules: [{pattern:/^1[3456789]\d{9}$/, message: '请输入正确的手机号'}] }]" />
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
              停用
            </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

    </a-spin>
  </a-modal>
</template>

<script>
import { saveUser, userEdit } from '@/api/user'
export default {
  name: 'UserEdit',
  data () {
    return {
      form: this.$form.createForm(this),
      username: '',
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
      isUpdate: false
    }
  },
  methods: {
    add (parentCode) {
      this.form.resetFields()
      this.isUpdate = false
      this.visible = true
      if (parentCode !== undefined) {
        this.parentCode = parentCode
      }
    },
    edit (id) {
      this.form.resetFields()
      this.confirmLoading = true
      this.isUpdate = true
      this.visible = true
      userEdit({ id: id }).then(res => {
        const user = res.data
        console.log('user :' + JSON.stringify(user))
        this.username = user.username
        this.form.setFieldsValue({
          name: user.name,
          id: user.id,
          phone: user.phone,
          status: user.status.toString()
        })
        this.confirmLoading = false
      }).catch(error => {
        this.confirmLoading = false
        console.log('error :' + JSON.stringify(error))
      })
    },
    handleConfirmPassword (rule, value, callback) {
      console.log('handleConfirmPassword')
      const { getFieldValue } = this.form
      if (value && value !== getFieldValue('password')) {
        callback('两次输入不一致')
      }
      callback()
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          this.$emit('ok', values)
          saveUser(values).then(res => {
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
