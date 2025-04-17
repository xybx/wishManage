import { ElLoading } from "element-plus";
export const downLoadFile = (baseUrl: string, queryForm: any, startTime: string = 'startTime', endTime: string = 'endTime', appname: any = '') => {
  let loadingInstance1 = ElLoading.service({ fullscreen: true });
  let params = '?';
  let flag = false
  if (appname.length > 0) {
    params += `&appname=${appname}&`
    flag = true
  }
  for (let i in queryForm) {
    if (i === 'lgtime' && queryForm[i]) {
      params += `${startTime}=${queryForm[i][0]}&${endTime}=${queryForm[i][1]}&`
    } else {
      params += `${i}=${queryForm[i]}&`
    }
    flag = true
  }
  if (flag) {
    params = params.slice(0, params.length - 1)
  }
  console.log(params);

  axios({
    headers: { Authorization: sessionStorage.getItem('codetoken'), loginType: 'PC', client: 'admin' },
    // type: 'application/ json; charset = utf-8',
    method: 'GET',
    url: params == '?' ? baseUrl : baseUrl + params,
    responseType: 'arraybuffer',
  }).then(function (res) {

    console.log(res.headers['content-disposition'].split('=')[1].split('.')[0], decodeURIComponent(res.headers['content-disposition'].split('=')[1]));

    const fileName = decodeURIComponent(res.headers['content-disposition'].split('=')[1]);
    const blob = new Blob([res.data]);
    //创建一个a标签并设置href属性，之后模拟人为点击下载文件
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click(); //模拟点击
    //释放资源并删除创建的a标签
    URL.revokeObjectURL(link.href);
    loadingInstance1.close()
  })

};


