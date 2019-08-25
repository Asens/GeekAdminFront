<template>
  <div>
    <a-card :bordered="false" class="query-box">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="任务名称">
                <a-input v-model="queryParam.remark" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">成功</a-select-option>
                  <a-select-option value="0">失败</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="bean名称">
                  <a-input v-model="queryParam.beanName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="方法名称">
                  <a-input v-model="queryParam.methodName" placeholder=""/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker @change="onChangeCreateDate" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="执行时间超过(ms)">
                  <a-input v-model="queryParam.times" placeholder=""/>
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
        <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
          <a-menu slot="overlay">
            <a-menu-item key="1">
              <a-icon type="delete"/>
              删除
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
        <span slot="createDate" slot-scope="text">
          <span>{{ text | dateFilter }}</span>
        </span>
        <span slot="endDate" slot-scope="text">
          <span>{{ text | dateFilter }}</span>
        </span>
        <span slot="times" slot-scope="text">
          {{text}} ms
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter"/>
        </span>
        <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
          <span v-html="record.error"></span>
        </p>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { dateFilter } from '@/utils/util'
import { scheduleLogList } from '@/api/schedule'

export default {
  name: 'Schedule',
  components: {
    STable,
    Ellipsis
  },
  data () {
    return {
      createDateStart: '',
      createDateEnd: '',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.createDateStart = this.createDateStart
        this.queryParam.createDateEnd = this.createDateEnd
        return scheduleLogList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],

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
      return dateFilter(value)
    }
  },
  methods: {
    refreshData () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onChangeCreateDate (date, dateString) {
      this.createDateStart = dateString[0]
      this.createDateEnd = dateString[1]
    }
  }
}

const columns = [
  { title: '任务', dataIndex: 'remark', key: 'remark' },
  { title: '任务ID', dataIndex: 'jobId', key: 'jobId' },
  { title: '开始时间', dataIndex: 'createDate', key: 'createDate', scopedSlots: { customRender: 'createDate' } },
  { title: '结束时间', dataIndex: 'endDate', key: 'endDate', scopedSlots: { customRender: 'endDate' } },
  { title: '执行时长', dataIndex: 'times', key: 'times', scopedSlots: { customRender: 'times' } },
  { title: '状态', dataIndex: 'status', key: 'status', scopedSlots: { customRender: 'status' } }
]

const statusMap = {
  0: {
    status: 'error',
    text: '失败'
  },
  1: {
    status: 'processing',
    text: '成功'
  }
}
</script>

<style scoped>
  .query-box{
    margin-bottom: 10px;
  }
</style>

<style>
  .query-box .ant-card-body{
    padding-bottom: 0 !important;
  }
</style>
