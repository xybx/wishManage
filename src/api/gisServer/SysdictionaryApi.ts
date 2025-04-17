import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/management-sys-dictionary/selectBySysDictionaryVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/management-sys-dictionary/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/management-sys-dictionary/dels',
    method:'get',
    params
  })
}

