import request from '/@/utils/request'

export const login = async (data: any) => {
  return request({
    url: '/adminLogin/login',
    method: 'post',
    data,
  })
}

export const getUserInfo = () => {
  return request({
    url: '/auth-login/getLoginUser',
    method: 'get',
  })
}

export const logout = () => {
  return request({
    url: '/adminLogin/logout',
    method: 'get',
  })
}

export const getUserList = ()=>{
  return request({
    url: '/user/getStringSelected',
    method: 'get',
  })
}

// 获得验证码

export const getImageCode = ()=>{
  return request({
    url: '/auth-captcha/imageCode',
    method: 'get',
  })
}

export const getUserData = ()=> {
  return request({
    url: '/comapi-user/getPersonaDetailsVoByPid',
    method: 'get',
  })
}

export const putEditPass = (params:any)=> {
  return request({
    url: '/comapi-user/changePassword',
    method: 'get',
    params
  })
}
