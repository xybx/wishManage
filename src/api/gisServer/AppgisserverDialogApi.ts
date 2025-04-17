import request from '/@/utils/request'


// 编辑获得属性
export const selectById = (params: any) => {
    return request({
        method: 'GET',
        url: '/management-appgisserver/selectVoByPid',
        params,

    });
}
// 增加列表项
export const add = (data: any) => {
    return request({
        method: 'POST',
        url: '/management-appgisserver/add',
        data,

    });
}
// 编辑列表项
export const update = (data: any) => {
    return request({
        method: 'POST',
        url: '/management-appgisserver/update',
        data,

    });
}

    export const getkindSelectDataApi= ()=>{
        return request({
            url: '/management-sys-dictionary/getSelectedByTableName?tableName=mapservetype',
            method:'get',
        })
    }
    export const getmaptypeSelectDataApi= ()=>{
        return request({
            url: '/management-sys-dictionary/getSelectedByTableName?tableName=maptype',
            method:'get',
        })
    }
    export const getprjtypeSelectDataApi= ()=>{
        return request({
            url: '/management-sys-dictionary/getSelectedByTableName?tableName=gisserverclass',
            method:'get',
        })
    }
