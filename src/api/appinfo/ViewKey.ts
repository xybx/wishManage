import request from '/@/utils/request'


export const getAppsecretApi = (params:object)=>{
  return request({
    url: '/auth-application/getAppidAndAppsecret',
    method:'get',
    params
  })
}


