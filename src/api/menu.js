import { axios } from '@/utils/request'

const api = {
  menuTree: '/api/sys/permission/menuTree',
  menuInfo: '/api/sys/permission/info',
  deleteMenu: '/api/sys/permission/delete',
  saveMenu: '/api/sys/permission/save'
}

export default api

export function getMenuTree (parameter) {
  return axios({
    url: api.menuTree,
    method: 'get',
    params: parameter
  })
}

export function saveMenu (parameter) {
  return axios({
    url: api.saveMenu,
    method: 'post',
    params: parameter
  })
}

export function deleteMenu (parameter) {
  return axios({
    url: api.deleteMenu,
    method: 'get',
    params: parameter
  })
}

export function menuInfo (parameter) {
  return axios({
    url: api.menuInfo,
    method: 'get',
    params: parameter
  })
}
