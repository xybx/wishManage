import request from '/@/utils/request'
export const changeUserDeptApi = (params: any) => {
    return request({
        method: 'GET',
        url: '/auth-dept/changeUserDept',
        params
    });
        
}