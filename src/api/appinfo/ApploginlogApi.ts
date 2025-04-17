import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/log-apploginlog/selectByApploginlogVo',
    method:'get',
    params
  })
}




export const del = (params:object)=>{
  return request({
    url:'/apploginlog/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/apploginlog/dels',
    method:'get',
    params
  })
}

export const getappidSelectDataApi= ()=>{
  return request({
    url: '/auth-application/getApplicationSelected?type=1',
    method:'get',
  })
}
