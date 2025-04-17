import request from '/@/utils/request'


export const getDataListApi = (params:object)=>{
  return request({
    url: '/quartz-sysjob-log/selectBySysjobLogVo',
    method:'get',
    params
  })
}


