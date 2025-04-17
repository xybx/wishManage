
import request from '/@/utils/request'

export const getUserGradeTreeApi = (params: any) => {
    return request({
        method: 'GET',
        url: 'auth-user-grade/getUserGradeTree',
        params
    });
        
}

export const getUserGradeTreeManagementApi = (params: any) => {
    return request({
        method: 'GET',
        url: 'auth-user-grade/getUserGradeTreeManagement',
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
        url: '/auth-user-grade/del',
        params
    });
        
}

export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: '/auth-user-grade/selectVoByPid',
        params,

    });
}
// 增加列表项
export const add = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-user-grade/add',
        data,

    });
}
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-user-grade/update',
        data,

    });
}

