import request from '/@/utils/request'


export const getDeptheadListApi = (params:object)=>{
  return request({
    url: '/auth-depthead/selectListByDeptpid',
    method:'get',
    params
  })
}

export const delDepthead = (params:object)=>{
  return request({
    url:'/auth-depthead/del',
    method:'get',
    params
  })
}

// 编辑获得属性
export const getDeptheadSelectById = (params: any) => {
  return request({
    method: 'GET',
    url: '/auth-depthead/selectVoByPid',
    params,
  });
}
// 增加列表项
export const putDeptheadAdd = (data: any) => {
  return request({
    method: 'POST',
    url: '/auth-depthead/add',
    data,

  });
}
// 编辑列表项
export const putDeptheadUp = (data: any) => {
  return request({
    method: 'POST',
    url: '/auth-depthead/update',
    data,
  });
}

// 下拉框
export const getSelectListApi = (params: any) => {
  return request({
    method: 'get',
    url: '/auth-user-grade/getUserGradeTree',
    params,
  });
}
