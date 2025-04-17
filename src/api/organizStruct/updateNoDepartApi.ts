import request from '/@/utils/request'
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-user/updateNoDepart',
        data,

    });
}