import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/management-sys-dictable/selectBySysDictableVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/management-sys-dictable/del',
    method:'get',
    params
  })
}


