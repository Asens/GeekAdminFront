<template>
  <div style="min-height: 400px;padding-top: 50px">
    <a-form
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item
        label="原密码"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-input
          type="password"
          v-decorator="[
            'oldPassword',
            {rules: [{ required: true, message: '请输入原密码' },{validator: checkPassword }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="新密码"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-input
          type="password"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入新密码' },{min: 6,max:20, message: '密码最小长度6,最大长度20'}]}
          ]"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 8 }"
      >
        <a-input
          type="password"
          v-decorator="[
            'confirmPassword',
            {rules: [{ required: true, message: '请确认密码' },{validator: handleConfirmPassword }]}
          ]"
        />
      </a-form-item>
      <a-form-item
        :wrapper-col="{ span: 12, offset: 5 }"
      >
        <a-button
          type="primary"
          html-type="submit"
          @click="handleSubmit"
        >
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { changePassword, checkPassword } from '@/api/user'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    ...mapActions(['Logout']),
    handleSubmit (e) {
      e.preventDefault()
      const vm = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          changePassword(values).then(res => {
            if (res.status === 'success') {
              this.$message.success('修改成功,请重新登录')
              vm.Logout({}).then(() => {
                window.location.reload()
              })
            } else {
              this.$notification.error({
                message: '修改失败',
                description: res.message
              })
            }
          })
        }
      })
    },
    handleConfirmPassword (rule, value, callback) {
      const { getFieldValue } = this.form
      if (value && value !== getFieldValue('password')) {
        callback('两次输入不一致')
      }
      callback()
    },
    checkPassword (rule, value, callback) {
      const { getFieldValue } = this.form
      const password = getFieldValue('oldPassword')
      checkPassword({ password: password }).then(res => {
        if (res.status !== 'success') {
          callback('原密码错误')
        }else{
          callback()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
