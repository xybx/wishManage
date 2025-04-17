import request from '/@/utils/request'


// 编辑获得属性
export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: '/auth-dept/selectVoByPid',
        params,

    });
}
// 增加列表项
export const add = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-dept/add',
        data,

    });
}
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-dept/update',
        data,

    });
}

