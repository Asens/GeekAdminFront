import { axios } from '@/utils/request'

const api = {
  menuTree: '/api/sys/permission/menuTree',
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
