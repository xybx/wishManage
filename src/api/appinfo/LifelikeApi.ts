import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-life/getLifeLikeList',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-life/delLike',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/lifelike/dels',
    method:'get',
    params
  })
}

