<template>
  <a-modal
    title="新建菜单"
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
          label="菜单名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['name', {rules: [{required: true, message: '请输入菜单名称'}]}]" />
        </a-form-item>

        <a-form-item
          label="菜单编号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input :disabled="codeDisabled" v-decorator="['code', {rules: [{required: true, message: '请输入菜单编号'}]}]" />
        </a-form-item>

        <a-form-item
          label="父菜单编号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['parentCode',{initialValue:parentCode}]" />
        </a-form-item>

        <a-form-item
          label="功能类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group v-decorator="['isMenu',{initialValue:'1'}]">
            <a-radio value="1">
              菜单
            </a-radio>
            <a-radio value="0">
              功能按钮
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          label="组件名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['component']" />
        </a-form-item>

        <a-form-item
          label="页面地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['realPath']" />
        </a-form-item>

        <a-form-item
          label="图标"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['icon']" />
        </a-form-item>

        <a-form-item
          label="排序"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input v-decorator="['sortNum', {rules: [{required: true, message: '请输入排序'}],initialValue:'10'}]"/>
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
import { saveMenu, menuInfo } from '@/api/menu'

export default {
  name: 'MenuAdd',
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
      codeDisabled: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add (parentCode) {
      this.form.resetFields()
      this.codeDisabled = false
      this.visible = true
      if (parentCode !== undefined) {
        this.parentCode = parentCode
      }
    },
    edit (code) {
      this.form.resetFields()
      this.confirmLoading = true
      this.codeDisabled = true
      this.visible = true
      menuInfo({ code: code }).then(res => {
        const menu = res.data
        console.log('menu :' + JSON.stringify(menu))
        this.form.setFieldsValue({
          name: menu.name,
          id: menu.id,
          code: menu.code,
          parentCode: menu.parentCode,
          component: menu.component,
          icon: menu.icon,
          sortNum: menu.sortNum,
          realPath: menu.realPath,
          status: menu.status.toString(),
          isMenu: menu.isMenu.toString()
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
          saveMenu(values).then(res => {
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
