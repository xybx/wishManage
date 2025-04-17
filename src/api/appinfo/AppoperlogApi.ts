import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/log-appoperlog/selectByAppoperlogVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appoperlog/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/appoperlog/dels',
    method:'get',
    params
  })
}



