
import request from '/@/utils/request'

export const getDeptTreeApi = (params: any) => {
    return request({
        method: 'GET',
        url: '/auth-dept/getDeptTree',
        params
    });
        
}
export const getDeptUserList = (params: any) => {
    return request({
        method: 'GET',
        url: '/auth-dept/getDeptUserList',
        params
    });
        
}
export const delDeptApi = (params: any) => {
    return request({
        method: 'GET',
        url: '/auth-dept/del',
        params
    });
        
}


