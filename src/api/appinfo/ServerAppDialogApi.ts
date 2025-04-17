import request from '/@/utils/request'


export const getAppNoServerUrlApi = (params:object)=>{
  return request({
    url: '/auth-application/selectNoAppgisServerByAppidAndName',
    method:'get',
    params
  })
}

export const putAppServerurl = (params:object)=>{
  return request({
    url:'/auth-application/applicationAddAppgisServices',
    method:'get',
    params
  })
}

export const putAllAppServerurl = (params:object)=>{
  return request({
    url:'/auth-application/applicationAddAllAppgisServices',
    method:'get',
    params
  })
}

export const getAppServerUrlApi = (params:object)=>{
  return request({
    url: '/auth-application/selectAppgisServerByAppidAndName',
    method:'get',
    params
  })
}

export const delAppServerurl = (params:object)=>{
  return request({
    url:'/auth-application/applicationCancelAppgisServices',
    method:'get',
    params
  })
}

export const delAllAppServerurl = (params:object)=>{
  return request({
    url:'/auth-application/applicationCancelAllAppgisServices',
    method:'get',
    params
  })
}

