import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/management-appgisserver/selectByAppgisserverVo',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/management-appgisserver/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/management-appgisserver/dels',
    method:'get',
    params
  })
}

export const getkindSelectDataApi= ()=>{
  return request({
    url: '/management-sys-dictionary/getSelectedByTableName?tableName=mapservetype',
    method:'get',
  })
}
export const getmaptypeSelectDataApi= ()=>{
  return request({
    url: '/management-sys-dictionary/getSelectedByTableName?tableName=maptype',
    method:'get',
  })
}
export const getprjtypeSelectDataApi= ()=>{
  return request({
    url: '/management-sys-dictionary/getSelectedByTableName?tableName=gisserverclass',
    method:'get',
  })
}
