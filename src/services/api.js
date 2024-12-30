import axios from "axios";


// console.log('API URL >>', process.env.VUE_APP_API_URL); // 받아옴.

const api = axios.create({
  //baseURL: process.env.VUE_APP_API_URL
  // 위 처럼하면, VUE_APP_API_URL이것이 env.development건지 env.production건지 어떻게 구분되나?
   // `process.env.VUE_APP_API_URL`이 **`env.development`인지 `env.production`인지**는 **현재 실행되는 빌드 환경**에 따라 결정됩니다.

  // 밑은 삭제하면 주소 못 받음.
    baseURL : process.env.VUE_APP_API_URL,
  //timeout : 5000,
    headers: {
      Authorization: '',
     // 'content-type' : 'applicaton/json'
    }
})

api.interceptors.request.use(config=>{
  // Authorization는 서버에서 만든 토큰 값임. 241115
  const accessToken = localStorage.getItem('Authorization');
  console.log('api accessToken>>', accessToken); // 있음.
  if (accessToken)
    config.headers['Authorization'] = accessToken
  return config
})

export default api
