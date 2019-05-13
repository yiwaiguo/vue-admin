import 'whatwg-fetch'
import 'es6-promise'

//let qs = require('qs');//解决formData数据格式

// const BASE_URL = 'http://47.96.22.102:9990';

if(process.env.NODE_ENV === 'production' ){
  var BASE_URL = localStorage.getItem('baseURL');
}else{//开发环境
  var BASE_URL = process.env.BASE_API;
}

let Fetch = (url, options)=> {
  const token = window.localStorage.getItem("token");/** token定义需在fetch方法里，不然登录后会出现请求token失效的问题，因为没拿到最新的token**/
  options.credentials = 'include';//** 携带cookies,后台设置也要放开权限，不然会报预检不通过的错 **//
  // options.headers.Authorization = `Bearer ${window.localStorage.getItem('token')}`;
  options.mode = 'cors';//跨域模式，必填
  options.headers = {
    'Accept': 'application/json, text/plain, */*',
    'token':token
  };

  if (options.method === 'POST' || options.method === 'PUT') {
   //根据后端接受什么形式的数据选择对应的body与headers
  //  url = url+'?token=' + token
    options.body = JSON.stringify(options.body);
    options.headers = {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json; charset=utf-8',
      'token':token
    }
    /* options.body = qs.stringify(options.body);
       options.headers={
       'Accept': 'application/json, text/plain, *!/!*',
       'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
       }
     */
  }

  // if(options.method === 'GET'){
  //   url = url+'&token=' + token
  // }

  url = `${BASE_URL}${url}`;
  // url = `${url}`;

  return new Promise((resolve, reject) => {
    fetch(url, options).then(res => {
      return res.json();
    }).then(data => {
      if(data.code == 401){
        Fetch.overtime(data)//传解决登录超时的方法
      }
      resolve(data)
    }).catch(err => {
      //捕获异常
      reject(err);
    })
  })
}

export default Fetch;

