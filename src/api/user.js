import { axios } from '@/utils/request'

const api = {
  userList: '/api/sys/user/list'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.userList,
    method: 'get',
    params: parameter
  })
}
