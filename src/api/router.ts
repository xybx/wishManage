import request from '/@/utils/request'

export const getList = (params?: any) => {
  return request({
    url: '/appsystem-vuemenu/getVueMenu',
    method: 'get',
    params,
  })
}
