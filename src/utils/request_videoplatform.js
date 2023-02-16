import axios from 'axios'
import {Notification, MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
  baseURL: process.env.VUE_APP_VIDEO_PLATFORM,
  timeout: 600000
})
// request拦截器
service.interceptors.request.use(
  config => {
    // if (getToken()) {
    //   config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    config.headers['appKey'] = "1562356"
    config.headers['appSecret'] = "9cb7773f14dd0cc46754e05a36157f98"
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(res => {
    console.log(res)
    return res.data
    // const code = res.code ? res.code : '200'
    // if (code !== 200) {
    //   Notification.error({
    //     title: '级联视频平台失败'
    //   })
    //   return Promise.reject('error')
    // } else {
    //   return res.data
    // }
  },
  error => {
    console.log('err' + error)
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
