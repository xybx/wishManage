import request from '/@/utils/request'


// 获取部门
export const getbutedTreeApi = (params:object)=>{
  return request({
    url: '/auth-application/getUndistributedTree',
    method:'get',
    params
  })
}
export const getAssignedTreeApi = (params:object)=>{
  return request({
    url: '/auth-application/getAssignedTree',
    method:'get',
    params
  })
}
// 添加
export const getAddDeptsApi = (params:object)=>{
  return request({
    url: '/auth-application/applicationAddDepts',
    method:'get',
    params
  })
}
export const getAddUsersApi = (params:object)=>{
  return request({
    url: '/auth-application/applicationAddUsers',
    method:'get',
    params
  })
}

// 取消
export const getCancelDeptsApi = (params:object)=>{
  return request({
    url: '/auth-application/applicationCancelDepts',
    method:'get',
    params
  })
}
export const getCancelUsersApi = (params:object)=>{
  return request({
    url: 'auth-application/applicationCancelUsers',
    method:'get',
    params
  })
}
// 获取用户
export const getDataListApi = (params:object)=>{
  return request({
    url: '/auth-application/getUndistributedList',
    method:'get',
    params
  })
}
export const getDataLisedDApi = (params:object)=>{
  return request({
    url: '/auth-application/getAssignedList',
    method:'get',
    params
  })
}

export const del = (params:object)=>{
  return request({
    url:'/user/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/user/dels',
    method:'get',
    params
  })
}

