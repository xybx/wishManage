/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，pro版只支持remixIcon图标，具体配置请查看vip群文档
 */
import type { App } from 'vue'
import type { RouteRecordName, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { authentication, base, isHashRouterMode } from '/@/config'
import { setupPermissions } from '/@/router/permissions'
import Layout from '/@vab/layouts/index.vue'

export const constantRoutes: VabRouteRecord[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/login/Login.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/401',
    name: '401',
    component: () => import('/@/views/error/401.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('/@/views/error/403.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('/@/views/error/404.vue'),
    meta: {
      hidden: true,
    },
  },
]

export const asyncRoutes: VabRouteRecord[] = [
  {
    path: '/',
    name: 'Root',
    redirect:'/systemManger',
    meta: { hidden: true,}
  },
  {
    path: '/systemManger',
    name: 'SystemManger',
    component: Layout,
    meta: { title: '系统管理', icon:'home-2-line', breadcrumbHidden: true },
    children:[
      {
        path: 'sysadminList',
        name: 'SysadminList',
        component: () => import('/src/views/systemManger/SysadminList.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'loginLogs',
        name: 'LoginLogs',
        component: () => import('/src/views/systemManger/SysadloginlogList.vue'),
        meta: { title: '登录日志' },
      },
      {
        path: 'operateLogs',
        name: 'OperateLogs',
        component: () => import('/src/views/systemManger/SysadoperlogList.vue'),
        meta: { title: '操作日志' },
      },
      // {
      //   path: 'GatewayrouteList',
      //   name: 'GatewayrouteList',
      //   component: () => import('/src/views/systemManger/GatewayrouteList.vue'),
      //   meta: { title: '网关路由管理', icon: 'code-box-line' },
      // },
      {
        path: 'SysjobList',
        name: 'SysjobList',
        component: () => import('/src/views/quartz/SysjobList.vue'),
        meta: { title: '定时任务调度' },
      },
      {
        path: 'SysjoblogList',
        name: 'SysjoblogList',
        component: () => import('/src/views/quartz/SysjoblogList.vue'),
        meta: { title: '定时任务日志' },
      },
    ]
  },

  {
    path: '/appInfo',
    name: 'AppInfo',
    component: Layout,
    meta: { title: '应用信息', icon:"building-2-line",breadcrumbHidden: true },
    children: [
      {
        path: 'appManger',
        name: 'AppManger',
        component: () => import('/src/views/appInfo/ApplicationList.vue'),
        meta: { title: '应用管理' },
      },
      {
        path: 'appMonitor',
        name: 'AppMonitor',
        component: () => import('/src/views/appInfo/ApponlineList.vue'),
        meta: { title: '应用监控' },
      },
      {
        path: 'appLoginLogs',
        name: 'AppLoginLogs',
        component: () => import('/src/views/appInfo/ApploginlogList.vue'),
        meta: { title: '登录日志' },
      },
      {
        path: 'appOperateLogs',
        name: 'AppOperateLogs',
        component: () => import('/src/views/appInfo/AppoperlogList.vue'),
        meta: { title: '操作日志' },
      },
      {
        path: 'AppgisserverList',
        name: 'AppgisserverList',
        component: () => import('/src/views/gisServer/AppgisserverList.vue'),
        meta: { title: 'Gis服务管理' },
      },
      {
        path: 'SysdictableList',
        name: 'SysdictableList',
        component: () => import('/src/views/gisServer/SysdictableList.vue'),
        meta: { title: '字典管理' },
      },
      {
        path: 'AppwhiteurlList',
        name: 'AppwhiteurlList',
        component: () => import('/src/views/appInfo/AppwhiteurlList.vue'),
        meta: { title: '应用白名单' },
      },
      {
        path: 'menuActiveList',
        name: 'MenuActiveList',
        component: () => import('/src/views/appInfo/menuActiveList.vue'),
        meta: { title: '动态菜单' },
      },
    ]
  },
  {
    path: '/organizStruct',
    name: 'OrganizStruct',
    component: Layout,
    meta: { title: '组织架构',icon:"building-4-line", breadcrumbHidden: true },
    children: [
      {
        path: 'orgDepts',
        name: 'OrgDepts',
        component: () => import('/src/views/organizStruct/OrgDepts.vue'),
        meta: { title: '部门管理' },
      },
      {
        path: 'orgStructManger',
        name: 'OrgStructManger',
        component: () => import('/src/views/organizStruct/OrgstrManger.vue'),
        meta: { title: '组织架构管理' },
      },
      {
        path: 'OrgUserManger',
        name: 'OrgUserManger',
        component: () => import('/src/views/organizStruct/orgUserManger.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'UserManger',
        name: 'UserManger',
        component: () => import('/src/views/organizStruct/UserList.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'orgLevelList',
        name: 'OrgLevelList',
        component: () => import('/src/views/organizStruct/OrgLevelList.vue'),
        meta: { title: '级别管理' },
      },
      // {
      //   path: 'orgUserLevelManger',
      //   name: 'OrgUserLevelManger',
      //   component: () => import('/src/views/organizStruct/orgUserLevelManger.vue'),
      //   meta: { title: '级别管理' },
      // },
      {
        path: 'deviceList',
        name: 'DeviceList',
        component: () => import('/src/views/organizStruct/DeviceList.vue'),
        meta: { title: '设备号审核' },
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'NotFound',
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

const router = createRouter({
  history: isHashRouterMode ? createWebHashHistory(base) : createWebHistory(base),
  routes: constantRoutes as RouteRecordRaw[],
})

const fatteningRoutes = (routes: VabRouteRecord[]): VabRouteRecord[] => {
  return routes.flatMap((route) => {
    return route.children ? fatteningRoutes(route.children) : route
  })
}

const addRouter = (routes: VabRouteRecord[]) => {
  routes.forEach((route: VabRouteRecord) => {
    if (!router.hasRoute(route.name)) router.addRoute(route as RouteRecordRaw)
    if (route.children) addRouter(route.children)
  })
}

export const resetRouter = (routes: VabRouteRecord[] = constantRoutes) => {
  routes.map((route: VabRouteRecord) => {
    if (route.children) route.children = fatteningRoutes(route.children)
  })
  router.getRoutes().forEach((route) => {
    if (route.name) {
      const routeName: RouteRecordName = route.name
      router.hasRoute(routeName) && router.removeRoute(routeName)
    }
  })
  addRouter(routes)
}

export const setupRouter = (app: App<Element>) => {
  if (authentication === 'intelligence') addRouter(asyncRoutes)
  setupPermissions(router)
  app.use(router)
  return router
}

export default router
