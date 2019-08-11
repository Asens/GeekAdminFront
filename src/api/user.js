import { axios } from '@/utils/request'

const api = {
  userList: '/api/sys/user/list',
  userEdit: '/api/sys/user/edit',
  saveUser: '/api/sys/user/save'
}

export default api

export function getUserList (parameter) {
  return axios({
    url: api.userList,
    method: 'get',
    params: parameter
  })
}

export function userEdit (parameter) {
  return axios({
    url: api.userEdit,
    method: 'get',
    params: parameter
  })
}

export function saveUser (parameter) {
  return axios({
    url: api.saveUser,
    method: 'post',
    params: parameter
  })
}
