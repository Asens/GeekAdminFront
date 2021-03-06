import { BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { menus } from '@/api/menu'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  // 动态引入的页面组件
  workplace: () => import('@/views/dashboard/Workplace'),
  MenuList: () => import('@/views/menu/MenuList'),
  RoleList: () => import('@/views/role/RoleList'),
  UserList: () => import('@/views/user/UserList'),
  Schedule: () => import('@/views/schedule/Schedule'),
  ScheduleLog: () => import('@/views/schedule/ScheduleLog')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

const centerRouter = {
  path: '/',
  name: 'index',
  component: BasicLayout,
  meta: { title: '首页' },
  redirect: '/dashboard/workplace',
  children: [{
    path: '/account',
    component: RouteView,
    redirect: '/account/center',
    name: 'account',
    meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
    children: [
      {
        path: '/account/settings',
        name: 'settings',
        component: () => import('@/views/user/Settings'),
        meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
        redirect: '/account/settings/base',
        hideChildrenInMenu: true,
        children: [
          {
            path: '/account/settings/base',
            name: 'BaseSettings',
            component: () => import('@/views/user/BaseSetting'),
            meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
          },
          {
            path: '/account/settings/security',
            name: 'SecuritySettings',
            component: () => import('@/views/user/Security'),
            meta: { title: '修改密码', hidden: true, keepAlive: true, permission: [ 'user' ] }
          }
        ]
      }
    ]
  }]
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    menus().then(res => {
      const result = res.data
      console.log('router result :' + JSON.stringify(res.data))
      const routers = generator(result)
      console.log('buttons :' + JSON.stringify(generatorPages(result)))

      const pageRouter = {
        path: '/',
        component: BasicLayout,
        meta: { title: '首页' },
        children: [
          {
            path: '/pageRouterView',
            component: PageView,
            meta: { title: '页面' },
            children: generatorPages(result)
          }
        ]
      }
      routers.push(pageRouter)
      routers.push(notFoundRouter)
      routers.push(centerRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    let path = item.realPath
    if (path === undefined || path === '' || path === null) {
      path = `${parent && parent.path || ''}/${item.key}`
    }
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: path,
      // 路由名称，建议唯一
      name: item.key || '',
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.name, icon: item.icon || undefined, permission: item.key && [ item.key ] || null }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0 && noButtonInChildren(item.children)) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 编辑独立页面的路由
 *
 * @param routerMap
 * @returns {*}
 */
export const generatorPages = (routerMap) => {
  const buttons = []
  routerMap.forEach(t => getButtons(t, buttons))
  return buttons.map(item => {
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.realPath,
      // 路由名称，建议唯一
      name: item.key || '',
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.name, icon: item.icon || undefined, permission: item.key && [ item.key ] || null, hiddenHeaderContent: true }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    return currentRouter
  })
}

const getButtons = (item, buttons) => {
  if (item.isMenu === 0) {
    buttons.push(item)
    return
  }
  if (item.children && item.children.length > 0) {
    for (const i in item.children) {
      getButtons(item.children[i], buttons)
    }
  }
}

const noButtonInChildren = (children) => {
  const buttons = children.find(t => t.isMenu === 0)
  return buttons === undefined || buttons.length === 0
}
