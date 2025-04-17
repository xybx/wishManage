declare type LayoutName =
  /**
   * 横向布局
   */
  | 'horizontal'
  /**
   * 纵向布局
   */
  | 'vertical'
  /**
   * 分栏布局
   */
  | 'column'
  /**
   * 综合布局
   */
  | 'comprehensive'
  /**
   * 常规布局
   */
  | 'common'
  /**
   * 瀑布布局
   */
  | 'fall'

declare type ThemeName = 'default' | 'plain' | 'technology'

declare type Background =
  /**
   * 无背景
   */
  | 'none'
  /**
   * 自定义背景
   */
  | 'vab-background'

declare type ColumnStyle =
  /**
   * 横向风格
   */
  | 'horizontal'
  /**
   * 纵向风格
   */
  | 'vertical'
  /**
   * 卡片风格
   */
  | 'card'
  /**
   * 箭头风格
   */
  | 'arrow'
  /**
   * 半圆风格
   */
  | 'semicircle'

declare type TabsBarStyle =
  /**
   * 卡片风格
   */
  | 'card'
  /**
   * 灵动风格
   */
  | 'smart'
  /**
   * 圆滑风格
   */
  | 'smooth'
  /**
   * 矩形风格
   */
  | 'rect'

declare type pageTransitionStyle =
  /**
   * 无动画
   */
  | 'null'
  /**
   * el-fade-in-linear
   */
  | 'el-fade-in-linear'
  /**
   * el-fade-in
   */
  | 'el-fade-in'
  /**
   * el-zoom-in-center
   */
  | 'el-zoom-in-center'
  /**
   * el-zoom-in-top
   */
  | 'el-zoom-in-top'
  /**
   * el-zoom-in-bottom
   */
  | 'el-zoom-in-bottom'

declare interface ThemeType {
  // 布局名称
  layout: LayoutName
  // 主题名称
  themeName: string
  // 菜单宽度，仅支持px，建议大小：266px、277px、288px，其余尺寸会影响美观
  menuWidth: string
  // 分栏风格(仅针对分栏布局column时生效)
  columnStyle: ColumnStyle
  // 颜色
  color: string
  //菜单背景跟随配色
  isFollow: boolean
  // 是否固定头部固定
  fixedHeader: boolean
  // 纵向布局时是否默认收起左侧菜单（不支持分栏布局）
  foldSidebar: boolean
  // 是否开启顶部进度条
  showProgressBar: boolean
  //是否开启页脚
  showFooter: boolean
  // 是否开启标签页
  showTabs: boolean
  // 显示标签页时标签页样式
  tabsBarStyle: TabsBarStyle
  // 是否标签页图标
  showTabsIcon: boolean
  // 是否开启语言选择组件
  showLanguage: boolean
  // 是否开启刷新组件
  showRefresh: boolean
  // 是否开启主题组件
  showTheme: boolean
  // 是否开启全屏组件
  showFullScreen: boolean
  // 是否开启右侧悬浮窗
  showThemeSetting: boolean
  // 是否开启暗黑组件
  showDark: boolean

  showSearch?:boolean

  showNotice?:boolean

  // 是否开启页面动画
  pageTransition: pageTransitionStyle
  // 圆角
  radius: number
  // 是否开启锁屏
  showLock: boolean
  // 是否开启颜色选择器组件
  showColorPicker: boolean
  // 色弱
  colorWeakness: boolean,
  showAvatar: boolean
}
