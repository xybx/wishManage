import request from '/@/utils/request'


// 编辑获得属性
export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: '/appsystem-taffle/selectVoByPid',
        params,

    });
}
// 增加列表项
export const add = (data: any) => {
    return request({
        method: 'POST',
        url: '/appsystem-taffle/add',
        data,

    });
}
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/appsystem-taffle/update',
        data,

    });
}

export const UploadFile= (data: any)=>{
    return request({
        url: '/globalfile/upload',
        method:'POST',
        data,
        headers:{
             "Content-Type": ' multipart/form-data'
        }
    })
}

// 删除
export const deleteFile = (params: any) => {
    return request({
        method: 'get',
        url: '/globalfile/del',
        params,

    });
}

export const baseUrl = `${window.VITE_APP_BASE_URL}/globalfile/download?pid=`;
