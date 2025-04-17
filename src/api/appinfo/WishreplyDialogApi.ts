import request from '/@/utils/request'


// 编辑获得属性

// 增加列表项
export const replyMessage = (data: any) => {
    return request({
        method: 'POST',
        url: '/appsystem-wish/replyMessage',
        data,

    });
}
export const allReplyActivityMessage = (data: any) => {
    return request({
        method: 'POST',
        url: '/appsystem-wish/allReplyActivityMessage',
        data,

    });
}
// 编辑列表项
export const replyImgMessage = (data: any) => {
    return request({
        method: 'POST',
        url: '/appsystem-wish/replyImgMessage',
        data,
        headers:{
            "Content-Type": ' multipart/form-data'
       }

    });
}

