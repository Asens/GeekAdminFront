import { axios } from '@/utils/request'

const api = {
  userList: '/api/sys/user/list',
  userEdit: '/api/sys/user/edit',
  saveUser: '/api/sys/user/save',
  authUser: '/api/sys/user/auth',
  doAuthUser: '/api/sys/user/doAuth',
  centerInfo: '/api/sys/center/info',
  changePassword: '/api/sys/user/changePassword',
  checkPassword: '/api/sys/user/checkPassword'
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

export function authUser (parameter) {
  return axios({
    url: api.authUser,
    method: 'get',
    params: parameter
  })
}

export function doAuthUser (parameter) {
  return axios({
    url: api.doAuthUser,
    method: 'post',
    params: parameter
  })
}

export function centerInfo (parameter) {
  return axios({
    url: api.centerInfo,
    method: 'get',
    params: parameter
  })
}

export function changePassword (parameter) {
  return axios({
    url: api.changePassword,
    method: 'post',
    params: parameter
  })
}

export function checkPassword (parameter) {
  return axios({
    url: api.checkPassword,
    method: 'get',
    params: parameter
  })
}
