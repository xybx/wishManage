import request from '/@/utils/request'
// 上传文件
export const UploadFile = (data: any) => {
    return request({
        method: 'POST',
        url: '/globalfile/upload',
        data,
        headers: {
            "Content-Type": ' multipart/form-data'
        }
    });
}
// 根据uuid获得文件列表
export const selectListByUuid = (params: any) => {
    return request({
        method: 'GET',
        url: 'auth-user/loadSignImg',
        params,

    });
}
// 删除
export const deleteFile = (data: any) => {
    return request({
        method: 'POST',
        url: '/globalfile/del',
        data,

    });
}
// 编辑获得属性
export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: '/datasource22/selectVoByPid',
        params,

    });
}
// 增加列表项
export const add = (data: any) => {
    return request({
        method: 'POST',
        url: '/datasource22/add',
        data,

    });
}
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/datasource22/update',
        data,

    });
}
// 获得下拉框数据
export const getInterSelected = () => {
    return request({
        method: 'GET',
        url: '/datasource22/getStringSelected',

    });
}
// 未保存时删除
export const delByUuids = (data: any) => {
    return request({
        method: 'POST',
        url: '/globalfile/delByUuids',
        data
    });
}
