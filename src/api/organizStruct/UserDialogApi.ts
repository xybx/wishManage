import request from '/@/utils/request'


// 编辑获得属性
export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: 'auth-user/GetUserInfoVoByPid',
        params,

    });
}
// 增加列表项
export const add = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-user/add',
        data,
    });
}
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-user/update',
        data,

    });
}

// 上传图片
export const UploadFileApi = (data: any) => {
    return request({
        method: 'POST',
        url: '/auth-user/uploadSignImg',
        data,
        headers: {
            "Content-Type": ' multipart/form-data'
        }
    });
}

// 下载图片
export const loadSignImgApi = (params: any) => {
    return request({
        method: 'get',
        url: '/auth-user/loadSignImg',
        params,
    });
}
// 删除图片
export const delSignImgApi = (params: any) => {
    return request({
        method: 'get',
        url: '/auth-user/delSignImg',
        params,
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
// 下拉框
export const selectListApi = (params: any) => {
    return request({
        method: 'get',
        url: '/auth-user-grade/getUserGradeTree',
        params,
       
    });
}

