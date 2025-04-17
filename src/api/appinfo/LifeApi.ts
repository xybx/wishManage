import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-life/selectByLifeDTO',
    method:'get',
    params
  })
}



