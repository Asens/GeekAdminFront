<template>
  <a-modal
    title="定时任务日志"
    :width="1040"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    :footer="null"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-table :columns="columns" :dataSource="logs" :pagination="false">
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
      </a-table>

      <p style="color: #ccc;margin-top: 20px"> * 只显示最近10条日志,更多日志请去定时任务日志查询</p>
    </a-spin>
  </a-modal>
</template>

<script>
import { scheduleLog } from '@/api/schedule'
import Ellipsis from '@/components/Ellipsis'
import { dateFilter } from '@/utils/util'

export default {
  name: 'ScheduleInnerLog',
  components: {
    Ellipsis
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      columns,
      logs: []
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
    log (id) {
      this.confirmLoading = true
      this.visible = true
      scheduleLog({ jobId: id }).then(res => {
        this.logs = res.data
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.visible = false
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
