<template>
  <a-card :bordered="false">
    <div class="table-operator" style="text-align: right">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
    </div>
    <a-table :columns="columns" :dataSource="data">
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="isMenu" slot-scope="text">
        <a-tag v-if="text===1" color="blue">菜单</a-tag>
        <a-tag v-if="text===0" color="orange">功能按钮</a-tag>
      </span>
      <span slot="icon" slot-scope="text">
        <a-icon :type="text" />
      </span>
      <span slot="action" slot-scope="text,record">
        <a @click="$refs.createModal.add(record.code)">添加子级</a>
        <a-divider type="vertical" />
        <a @click="$refs.createModal.edit(record.code)">编辑</a>
        <!--<a @click="open('/system/menu/edit/'+record.id)">编辑</a>-->
        <a-divider type="vertical" />
        <a>
          <a-popconfirm title="删除该菜单将同时删除其子菜单,确认删除?" @confirm="deleteMenu(record.id)" okText="是" cancelText="否" >删除</a-popconfirm>
        </a>
      </span>
    </a-table>

    <menu-add ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { getMenuTree, deleteMenu } from '@/api/menu'
import MenuAdd from './MenuAdd'
const statusMap = {
  0: {
    status: 'default',
    text: '停用'
  },
  1: {
    status: 'success',
    text: '启用'
  }
}

export default {
  name: 'MenuList',
  components: {
    MenuAdd
  },
  data () {
    return {
      data: [],
      columns,
      rowSelection
    }
  },
  created () {
    getMenuTree().then(res => {
      this.data = res.result
    })
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    menuFilter (type) {
      return statusMap[type].text
    },
    menuTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    open (path) {
      window.open(this.$router.resolve({ path: path }).href, '_blank')
    },
    handleOk () {
      getMenuTree().then(res => {
        this.data = res.result
      })
    },
    deleteMenu (id) {
      deleteMenu({ id: id }).then(res => {
        getMenuTree().then(res => {
          this.data = res.result
        })
        this.$message.success('删除成功')
      })
    }
  }
}

const columns = [{
  title: '菜单名称',
  dataIndex: 'name'
}, {
  title: '菜单编号',
  dataIndex: 'code'
}, {
  title: '菜单父编号',
  dataIndex: 'parentCode'
}, {
  title: '图标',
  dataIndex: 'icon',
  scopedSlots: { customRender: 'icon' }
}, {
  title: '排序',
  dataIndex: 'sortNum'
}, {
  title: '是否是菜单',
  dataIndex: 'isMenu',
  scopedSlots: { customRender: 'isMenu' }
}, {
  title: '状态',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' }
}, {
  title: '操作',
  dataIndex: 'action',
  scopedSlots: { customRender: 'action' }
}]

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
</script>

<style lang="less">
</style>
