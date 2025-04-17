import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-taffle/selectRecordByTaffleDTO',
    method:'get',
    params
  })
}

export const actaffleComplate = (params:object)=>{
  return request({
    url:'/appsystem-taffle/taffleComplate',
    method:'get',
    params
  })
}

export const acbatchTaffleComplate = (params:object)=>{
  return request({
    url:'/appsystem-taffle/batchTaffleComplate',
    method:'get',
    params
  })
}

