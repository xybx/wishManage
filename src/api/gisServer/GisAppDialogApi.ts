import request from '/@/utils/request'


export const getAppNoGisUrlApi = (params:object)=>{
  return request({
    url: '/management-appgisserver/GetAppNoGisUrl',
    method:'get',
    params
  })
}

export const putAppGisurl = (params:object)=>{
  return request({
    url:'/auth-rel-app-gisurl/SaveApplicationGisurl',
    method:'get',
    params
  })
}

export const putAllAppGisurl = (params:object)=>{
  return request({
    url:'/auth-rel-app-gisurl/SaveAllApplicationGisurl',
    method:'get',
    params
  })
}

export const getAppGisUrlApi = (params:object)=>{
  return request({
    url: '/management-appgisserver/GetAppGisUrl',
    method:'get',
    params
  })
}

export const delAppGisurl = (params:object)=>{
  return request({
    url:'/auth-rel-app-gisurl/DelApplicationGisurl',
    method:'get',
    params
  })
}

export const delAllAppGisurl = (params:object)=>{
  return request({
    url:'/auth-rel-app-gisurl/DelAllApplicationGisurl',
    method:'get',
    params
  })
}

