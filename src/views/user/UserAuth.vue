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
          label="角色"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-checkbox-group :options="roles" :value="hasAuth" @change="onChange"/>
        </a-form-item>
      </a-form>

    </a-spin>
  </a-modal>
</template>

<script>
import { doAuthUser, authUser } from '@/api/user'
export default {
  name: 'UserAuth',
  data () {
    return {
      parentCode: '',
      roles: [],
      userId: -1,
      hasAuth: [],
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
      usernameDisabled: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    onChange (checkedValues) {
      this.hasAuth = checkedValues
    },
    edit (id) {
      this.userId = id
      this.form.resetFields()
      this.confirmLoading = true
      this.usernameDisabled = true
      this.visible = true
      authUser({ id: id }).then(res => {
        const user = res.result
        console.log('user :' + JSON.stringify(user))
        this.roles = res.result.map(t => {
          return { label: t.name, value: t.id }
        })
        this.hasAuth = res.result.filter(t => t.checked).map(t => t.id)
        console.log('roles :' + JSON.stringify(this.roles))
        console.log('hasAuth :' + JSON.stringify(this.hasAuth))
        this.confirmLoading = false
      }).catch(error => {
        this.confirmLoading = false
        console.log('error :' + JSON.stringify(error))
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.id = this.userId
          const auths = JSON.stringify(this.hasAuth)
          values.roles = auths.substring(1, auths.length - 1)
          console.log('values', JSON.stringify(values))
          doAuthUser(values).then(res => {
            this.confirmLoading = false
            if (res.status === 'success') {
              this.visible = false
              this.confirmLoading = false
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
