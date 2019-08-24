import { axios } from '@/utils/request'

const api = {
  getScheduleJobList: '/api/sys/schedule/list',
  editScheduleJob: '/api/sys/schedule/edit',
  saveScheduleJob: '/api/sys/schedule/save',
  deleteScheduleJob: '/api/sys/schedule/delete',
  runScheduleJob: '/api/sys/schedule/run',
  pauseScheduleJob: '/api/sys/schedule/pause',
  resumeScheduleJob: '/api/sys/schedule/resume',
  runAllScheduleJob: '/api/sys/schedule/runAll',
  scheduleLog: '/api/sys/schedule/log'
}

export default api

export function getScheduleJobList (parameter) {
  return axios({
    url: api.getScheduleJobList,
    method: 'get',
    params: parameter
  })
}

export function editScheduleJob (parameter) {
  return axios({
    url: api.editScheduleJob,
    method: 'get',
    params: parameter
  })
}

export function saveScheduleJob (parameter) {
  return axios({
    url: api.saveScheduleJob,
    method: 'post',
    params: parameter
  })
}

export function deleteScheduleJob (parameter) {
  return axios({
    url: api.deleteScheduleJob,
    method: 'get',
    params: parameter
  })
}

export function runScheduleJob (parameter) {
  return axios({
    url: api.runScheduleJob,
    method: 'get',
    params: parameter
  })
}

export function pauseScheduleJob (parameter) {
  return axios({
    url: api.pauseScheduleJob,
    method: 'get',
    params: parameter
  })
}

export function resumeScheduleJob (parameter) {
  return axios({
    url: api.resumeScheduleJob,
    method: 'get',
    params: parameter
  })
}

export function runAllScheduleJob (parameter) {
  return axios({
    url: api.runAllScheduleJob,
    method: 'get',
    params: parameter
  })
}

export function scheduleLog (parameter) {
  return axios({
    url: api.scheduleLog,
    method: 'get',
    params: parameter
  })
}
