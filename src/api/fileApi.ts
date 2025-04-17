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
        url: '/globalfile/selectListByUuid',
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

// 未保存时删除
export const delByUuids = (data: any) => {
    return request({
        method: 'POST',
        url: '/globalfile/delByUuids',
        data
    });
}


export const baseUrl = `${window.VITE_APP_BASE_URL}/globalfile/download?pid=`;
