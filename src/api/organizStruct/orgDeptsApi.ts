
import request from '/@/utils/request'

export const getDeptTreeManageApi = (params: any) => {
    return request({
        method: 'GET',
        url: '/auth-dept/getDeptTreeManage',
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


