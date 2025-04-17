import request from '/@/utils/request'


// 编辑获得属性
export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: '/appsystem-wishmessage/selectVoByPid',
        params,

    });
}
