import request from '/@/utils/request'


export const getMenuListApi = ()=>{
  return request({
    url: '/appsystem-vuemenu/getTree',
    method:'get',
  })
}

export const delMenuApi = (params:object)=>{
  return request({
    url:'/appsystem-vuemenu/del',
    method:'get',
    params
  })
}


// 编辑获得属性
export const getMenuListId = (params: any) => {
  return request({
    method: 'GET',
    url: '/appsystem-vuemenu/selectVoByPid',
    params,

  });
}
// 增加列表项
export const putMenuAdd = (data: any) => {
  return request({
    method: 'POST',
    url: '/appsystem-vuemenu/add',
    data,

  });
}
// 编辑列表项
export const putMenuUp = (data: any) => {
  return request({
    method: 'POST',
    url: '/appsystem-vuemenu/update',
    data,

  });
}
