import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-wish/getOfficialReplyImgMessage',
    method:'get',
    params
  })
}

export const getWishDataListApi = (params:object)=>{
  return request({
    url: '/appsystem-wish/getReplyMessage',
    method:'get',
    params
  })
}
export const getReplyMessage = (params:object)=>{
  return request({
    url: '/appsystem-wish/getReplyMessage',
    method:'get',
    params
  })
}



export const del = (params:object)=>{
  return request({
    url:'/wishreply/del',
    method:'get',
    params
  })
}

export const putMultiDel = (params:object)=>{
  return request({
    url:'/wishreply/dels',
    method:'get',
    params
  })
}

