<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <a-row :gutter="24">
      <a-col :md="4">
        <a-list itemLayout="vertical" :dataSource="roles">
          <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
            <a-list-item-meta :style="{ marginBottom: '0' }">
              <span slot="description" style="text-align: center; display: block">{{ item.describe }}</span>
              <a slot="title" style="text-align: center; display: block" @click="edit(item)">{{ item.name }}</a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :md="20">
        <div style="max-width: 800px">
          <a-divider v-if="isMobile()" />
          <div v-if="mdl.id">
            <h3>角色：{{ mdl.name }}</h3>
          </div>
          <a-form :form="form" :layout="isMobile() ? 'vertical' : 'horizontal'">
            <a-form-item label="唯一键" style="display: none">
              <a-input v-decorator="[ 'id']" placeholder="请填写唯一键" />
            </a-form-item>

            <a-form-item label="角色名称">
              <a-input v-decorator="[ 'name', {rules: [{ required: true, message: 'Please input role name!' }]} ]" placeholder="请填写角色名称" />
            </a-form-item>

            <a-form-item label="角色编码">
              <a-input v-decorator="[ 'code', {rules: [{ required: true, message: 'Please input role name!' }]} ]" />
            </a-form-item>

            <a-form-item label="状态">
              <a-select v-decorator="[ 'status', {rules: []} ]">
                <a-select-option :value="1">正常</a-select-option>
                <a-select-option :value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="备注说明">
              <a-textarea :row="3" v-decorator="[ 'describe', {rules: [{ required: true, message: 'Please input role name!' }]} ]" placeholder="请填写角色名称" />
            </a-form-item>

            <a-form-item label="拥有权限">
              <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
                <a-col :xl="4" :lg="24">
                  <a-checkbox :checked="permission.menuSelected" @change="onChangeMenuSelected(permission)">
                    {{ permission.name }}
                  </a-checkbox><span v-if="permission.actionsOptions.length > 0">： </span>
                </a-col>
                <a-col :xl="20" :lg="24">
                  <a-checkbox
                    v-if="permission.actionsOptions.length > 0"
                    :indeterminate="permission.indeterminate"
                    :checked="permission.checkedAll"
                    @change="onChangeCheckAll($event, permission)">
                    全选
                  </a-checkbox>
                  <a-checkbox-group :options="permission.actionsOptions" v-model="permission.selected" @change="onChangeCheck(permission)" />
                </a-col>
              </a-row>
            </a-form-item>

            <a-form-item
              :wrapperCol="{ span: 24 }"
              style="text-align: center"
            >
              <a-button htmlType="submit" type="primary" @click="handleSubmit">保存</a-button>
            </a-form-item>

          </a-form>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { getRoleList, getPermissions, saveRole } from '@/api/manage'
import { mixinDevice } from '@/utils/mixin'
import { actionToObject } from '@/utils/permissions'

import pick from 'lodash.pick'

export default {
  name: 'RoleList',
  mixins: [mixinDevice],
  components: {},
  data () {
    return {
      form: this.$form.createForm(this),
      mdl: {},

      roles: [],
      permissions: []
    }
  },
  created () {
    this.refreshRoleList()
    this.loadPermissions()
  },
  methods: {
    callback (val) {
      console.log(val)
    },

    refreshRoleList () {
      getRoleList().then((res) => {
        this.roles = res.data
        this.roles.push({
          id: '-1',
          name: '新增角色',
          describe: '新增一个角色'
        })
        console.log('this.roles :', JSON.stringify(this.roles))
      })
    },

    add () {
      this.edit({ id: 0 })
    },

    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values :', JSON.stringify(this.permissions))
          let selected = ''
          this.permissions.forEach(t => {
            if (t.menuSelected) {
              selected += t.code + ','
            }
            if (t.selected.length > 0) {
              t.selected.forEach(p => {
                selected += p + ','
              })
            }
          })
          if (selected.length > 0) {
            selected = selected.substring(0, selected.length - 1)
          }
          values.permissions = selected
          saveRole(values).then(res => {
            if (res.status === 'success') {
              this.$message.success('修改成功')
              this.refreshRoleList()
            }
          })
        }
      })
    },

    edit (record) {
      this.form.resetFields()
      this.mdl = Object.assign({}, record)
      // 有权限表，处理勾选
      if (this.mdl.permissions && this.permissions) {
        // 先处理要勾选的权限结构
        const permissionsAction = {}
        const permissionMenus = []
        this.mdl.permissions.forEach(permission => {
          console.log('permission', JSON.stringify(permission))
          permissionMenus.push(permission.permissionId)
          permissionsAction[permission.permissionId] = permission.actionEntitySet.map(entity => entity.action)
        })

        console.log('permissionMenus', JSON.stringify(permissionMenus))

        // 把权限表遍历一遍，设定要勾选的权限 action
        this.permissions.forEach(permission => {
          const selected = permissionsAction[permission.code]
          permission.selected = selected || []
          permission.menuSelected = false
          if (permissionMenus.includes(permission.code)) {
            permission.menuSelected = true
          }
          this.onChangeCheck(permission)
        })
      }

      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'status', 'describe', 'code'))
      })
    },

    onChangeCheck (permission) {
      permission.indeterminate = !!permission.selected.length && (permission.selected.length < permission.actionsOptions.length)
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },

    onChangeMenuSelected (permission) {
      console.log('onChangeMenuSelected permission:', permission)
      permission.menuSelected = !permission.menuSelected
    },
    onChangeCheckAll (e, permission) {
      console.log('permission:', permission)

      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    loadPermissions () {
      getPermissions().then(res => {
        const result = res.data
        this.permissions = result.map(permission => {
          const options = actionToObject(JSON.stringify(permission.actionData))
          permission.checkedAll = false
          permission.selected = []
          permission.menuSelected = false
          permission.indeterminate = false
          permission.actionsOptions = options.map(option => {
            return {
              label: option.describe,
              value: option.action
            }
          })
          return permission
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
