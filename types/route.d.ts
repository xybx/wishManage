declare interface VabRouteMeta {
  // 高亮指定菜单
  activeMenu?: string
  // badge小标签(只支持子级)
  badge?: string
  // 是否隐藏面包屑
  breadcrumbHidden?: boolean
  // 是否显示小圆点
  dot?: boolean
  // 动态传参路由是否新开标签页
  dynamicNewTab?: boolean
  // 权限
  guard?: string[] | GuardType
  // 是否显示在菜单中显示隐藏路由(默认值：false)
  hidden?: boolean
  // 图标
  icon?: string
  // 是否是自定义svg图标(默认值：false)
  // 如果设置true，那么需要把您的svg拷贝到icon下，然后icon字段配置上您的图标名
  isCustomSvg?: boolean
  // 是否显示在菜单中显示隐藏一级路由(默认值：true)
  levelHidden?: boolean
  // 当前路由是否可关闭多标签页，同上
  noClosable?: boolean
  // 是否隐藏侧边栏
  noColumn?: boolean
  // 当前路由是否不缓存(默认值：false)
  noKeepAlive?: boolean
  // 当前路由是否不显示多标签页
  tabHidden?: boolean
  // 在新窗口中打开
  target?: '_blank' | false
  // 菜单、面包屑、多标签页显示的名称
  title?: string
  // 是否全屏
  fullscreen?: boolean
}

// @ts-ignore
declare interface VabRouteRecord extends Omit<RouteRecordRaw, 'meta'> {
  path: string
  // name 首字母必须大写
  name: Capitalize<string>
  meta: VabRouteMeta
  fullPath?: string
  component?: Component | any
  components?: Component | string
  children?: VabRouteRecord[]
  childrenNameList?: (string | undefined)[]
}

declare interface VabRoute extends Omit<VabRouteRecord, 'children' | 'childrenNameList'> {
  query?: any
  params?: any
  matched?: VabRoute[]
}
