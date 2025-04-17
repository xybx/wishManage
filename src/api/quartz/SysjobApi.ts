import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/quartz-sysjob/selectBySysjobVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/quartz-sysjob/del',
    method:'get',
    params
  })
}
export const run = (params: object)=>{
  return request({
    url:'/quartz-sysjob/run',
    method:'get',
    params
  })
}




