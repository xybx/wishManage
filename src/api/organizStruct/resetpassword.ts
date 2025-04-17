

import request from '/@/utils/request';

export const changePassword = (data:object)=>{
  return request({
    url:'/auth-user/ResetPasswrod',
    method:'post',
    data
  })
}
