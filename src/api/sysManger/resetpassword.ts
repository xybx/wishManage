

import request from '/@/utils/request';

export const changePassword = (data:object)=>{
  return request({
    url:'/admin/adminResetPasswrod',
    method:'post',
    data
  })
}
