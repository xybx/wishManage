import request from '/@/utils/request'


export const getWhiteUrlListApi = (params:object)=>{
  return request({
    url: '/appsystem-appwhiteurl/selectByAppwhiteurlVo',
    method:'get',
    params
  })
}


export const putWhiteUrl = (data:object)=>{
  return request({
    url:'/appsystem-appwhiteurl/add',
    method:'post',
    data
  })
}

export const putUpWhiteUrl = (data:object)=>{
  return request({
    url:'/appsystem-appwhiteurl/update',
    method:'post',
    data
  })
}

// 编辑获得属性
export const getselectById = (params: any) => {
  return request({
    method: 'GET',
    url: '/appsystem-appwhiteurl/selectVoByPid',
    params,

  });
}


export const delWhiteUrl = (params:object)=>{
  return request({
    url:'/appsystem-appwhiteurl/del',
    method:'get',
    params
  })
}

export const delsWhiteUrl = (params:object)=>{
  return request({
    url:'/appsystem-appwhiteurl/dels',
    method:'get',
    params
  })
}

