import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-report/selectByReportDTO',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/appsystem-report/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/appsystem-report/dels',
    method:'get',
    params
  })
}
export const operdate = (params:object)=>{
  return request({
    url:'/appsystem-report/operdate',
    method:'get',
    params
  })
}



