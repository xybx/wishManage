import request from '/@/utils/request'


export const getDataListApi = (params: object) => {
  return request({
    url: '/appsystem-wetemplatemessage/selectByWetemplatemessageDTO',
    method: 'get',
    params
  })
}

export const del = (params: object) => {
  return request({
    url: '/appsystem-wetemplatemessage/del',
    method: 'get',
    params
  })
}

export const putMultiDel = (params: object) => {
  return request({
    url: '/appsystem-wetemplatemessage/dels',
    method: 'get',
    params
  })
}

