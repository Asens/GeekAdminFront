<template>
  <div>
    <a-card :bordered="false" class="query-box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="规则编号">
                <a-input v-model="queryParam.id" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="调用次数">
                  <a-input-number v-model="queryParam.callNo" style="width: 100%"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="更新日期">
                  <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入更新日期"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="使用状态">
                  <a-select placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">关闭</a-select-option>
                    <a-select-option value="2">运行中</a-select-option>
                  </a-select>
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
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <span slot="createDate" slot-scope="text">
          <span>{{ text | dateFilter }}</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="run(record.id)">立即执行</a>
            <a-divider type="vertical"/>
            <a @click="edit(record.id)">编辑</a>
            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link" href="#">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="pause(record.id)">禁用</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="resume(record.id)">启用</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="delete(record.id)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getScheduleJobList, deleteScheduleJob, runScheduleJob, pauseScheduleJob, resumeScheduleJob } from '@/api/schedule'

const statusMap = {
  0: {
    status: 'error',
    text: '禁用'
  },
  1: {
    status: 'processing',
    text: '启用'
  }
}

export default {
  name: 'Schedule',
  components: {
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
          title: '任务',
          dataIndex: 'remark'
        },
        {
          title: 'bean名称',
          dataIndex: 'beanName'
        },
        {
          title: '方法名称',
          dataIndex: 'methodName'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '220px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getScheduleJobList(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(JSON.stringify(res.data))
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
    edit (id) {
      this.$refs.edit.edit(id)
    },
    run (id) {
      runScheduleJob({ id: id }).then(res => {
        if (res.status === 'success') {
          this.$message.success('任务已提交执行')
        }
      })
    },
    pause (id) {
      pauseScheduleJob({ id: id }).then(res => {
        if (res.status === 'success') {
          this.$message.success('任务已禁用')
        }
      })
    },
    resume (id) {
      resumeScheduleJob({ id: id }).then(res => {
        if (res.status === 'success') {
          this.$message.success('任务已启用')
        }
      })
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
