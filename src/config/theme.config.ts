/**
 @description 导出主题配置，注意事项：此配置下的项修改后需清理浏览器缓存！！！
 */
export const themeConfig: ThemeType = {
  //布局支持：分栏布局column、纵向布局vertical、横向布局horizontal、瀑布布局fall
  layout: 'vertical',
  //主题支持：默认default、简洁plain、科技technology
  themeName: 'default',
  //菜单宽度，仅支持px，建议大小：266px、277px、288px，其余尺寸会影响美观
  menuWidth: '260px',
  //分栏风格：横向风格horizontal、纵向风格vertical、卡片风格card、箭头风格arrow、半圆风格semicircle
  columnStyle: 'vertical',
  //颜色
  color: '#344058',//#1e97f8  #3276fa  #35a3fd
  //菜单背景跟随配色
  isFollow: true,
  //是否固定头部固定
  fixedHeader: true,
  //是否开启顶部进度条
  showProgressBar: true,
  //是否开启页脚
  showFooter: false,
  //是否开启标签页
  showTabs: false,
  //显示标签页时标签页样式：卡片风格card、灵动风格smart、圆滑风格smooth、矩形风格rect
  tabsBarStyle: 'card',
  //是否显示标签页图标
  showTabsIcon: true,
  //是否开启语言选择组件
  showLanguage: false,
  //是否开启刷新组件
  showRefresh: false,
  //是否开启主题组件
  showTheme: false,
  //是否开启全屏组件
  showFullScreen: false,
  //是否开启右侧悬浮窗
  showThemeSetting: false,
  //是否开启暗黑组件
  showDark: false,
  //否默认收起左侧菜单
  foldSidebar: false,
  //是否开启页面动画  value为空：无动画、el-fade-in-linear、el-fade-in、el-zoom-in-center、el-zoom-in-top、el-zoom-in-bottom。
  pageTransition: 'null',
  // 圆角（单位px，类型必须为数字）
  radius: 5,
  // 是否开启锁屏
  showLock: false,
  // 是否开启颜色选择器组件
  showColorPicker: false,
  // 色弱
  colorWeakness: false,
  // 是否显示头像
  showAvatar:true
}
