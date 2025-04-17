
import request from '/@/utils/request'
export const getDeptUserList = (params: any) => {
    return request({
        method: 'GET',
        url: 'auth-user/GetAllUserList',
        params
    });
        
}
