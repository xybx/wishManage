import request from '/@/utils/request'

// export const getDataListApi = (params:object)=>{
//     return request({
//       url: '/auth-useronline/selectByUseronlineVo',
//       method:'get',
//       params
//     })
//   }

export const getDataListApi = (params: object, url: any) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: url,
      params: params,
      // responseType: 'arraybuffer',
    }).then(function (res) {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })



}