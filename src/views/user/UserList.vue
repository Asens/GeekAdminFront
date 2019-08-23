<template>
  <div>
    <a-card :bordered="false" class="query-box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名">
                <a-input v-model="queryParam.username" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="0">异常</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="昵称">
                  <a-input v-model="queryParam.name" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="注册时间起">
                  <a-date-picker v-model="queryParam.registerTimeStart"  style="width: 100%" placeholder="注册时间起"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="注册时间止">
                  <a-date-picker v-model="queryParam.registerTimeEnd"  style="width: 100%" placeholder="注册时间止"/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false">
      <div class="table-operator" style="text-align: right">
        <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新建</a-button>
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-icon type="delete"/>
              删除
            </a-menu-item>
            <!-- lock | unlock -->
            <a-menu-item key="2">
              <a-icon type="lock"/>
              锁定
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            批量操作
            <a-icon type="down"/>
          </a-button>
        </a-dropdown>
      </div>
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        showPagination="auto"
      >
        <span slot="username" slot-scope="text, record">
          <img v-if="record.avatar!==null" :src="record.avatar" class="avatar"/> {{ record.username }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="description" slot-scope="text, record">
          <ellipsis :length="4" tooltip>{{ record.username }}</ellipsis>
        </span>
        <span slot="createDate" slot-scope="text">
          <span>{{ text | dateFilter }}</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="authUser(record.id)">授权</a>
            <a-divider type="vertical"/>
            <a @click="editUser(record.id)">编辑</a>
            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="deleteUser(record.id)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>
      </s-table>
      <user-edit ref="createModal"></user-edit>
      <user-auth ref="userAuth"></user-auth>
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getUserList } from '@/api/user'
import UserEdit from './UserEdit'
import UserAuth from './UserAuth'

const statusMap = {
  0: {
    status: 'error',
    text: '异常'
  },
  1: {
    status: 'processing',
    text: '正常'
  }
}

export default {
  name: 'UserList',
  components: {
    UserAuth,
    UserEdit,
    STable,
    Ellipsis
  },
  data () {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '用户名',
          dataIndex: 'username',
          scopedSlots: { customRender: 'username' }
        },
        {
          title: '昵称',
          dataIndex: 'name'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '注册时间',
          dataIndex: 'createDate',
          sorter: true,
          scopedSlots: { customRender: 'createDate' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '190px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        Object.assign(parameter, this.queryParam)
        if (this.queryParam.registerTimeStart) {
          parameter.registerTimeStart = this.queryParam.registerTimeStart.format('YYYY-MM-DD')
        }
        if (this.queryParam.registerTimeEnd) {
          parameter.registerTimeEnd = this.queryParam.registerTimeEnd.format('YYYY-MM-DD')
        }
        return getUserList(parameter)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: false,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    },
    dateFilter (value) {
      const date = new Date(value)
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m
    }
  },
  methods: {
    editUser (id) {
      this.$refs.createModal.edit(id)
    },
    authUser (id) {
      this.$refs.userAuth.edit(id)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 40px;
    border-radius: 50%;
    margin-right: 3px;
  }
  .query-box{
    margin-bottom: 10px;
  }
</style>

<style>
  .query-box .ant-card-body{
    padding-bottom: 0 !important;
  }
</style>
