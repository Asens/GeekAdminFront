<template>
  <a-card :bordered="false">
    <div class="table-operator" style="text-align: right">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
    </div>
    <a-table :columns="columns" :dataSource="data">
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="action" slot-scope="text,record">
        <a @click="$refs.createModal.add(record.code)">添加子级</a>
        <a-divider type="vertical" />
        <a href="javascript:;">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>

    <menu-add ref="createModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { getMenuTree } from '@/api/menu'
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
    }
  },
  methods: {
    handleOk () {
      getMenuTree().then(res => {
        this.data = res.result
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
  dataIndex: 'icon'
}, {
  title: '排序',
  dataIndex: 'order'
}, {
  title: '是否是菜单',
  dataIndex: 'menu'
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
