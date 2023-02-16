import request from '@/utils/request'
import request_videoplatform from '@/utils/request_videoplatform'
import {setCachedStorage, getCachedStorage, removeCachedStorage} from '@/utils/myCachedStorage'
import store from '@/store'

// 获取视频平台登录的token
export function getVideoTokenByWeb() {
  let vt = store.getters && store.getters.videoTenant
  let code =  'admin'
  let secret ='Inspur123$'
  if (vt && vt.tenantCode && vt.tenantSecret) {
    code = vt.tenantCode
    secret = vt.tenantSecret
  }
  return request_videoplatform({
    url: `/device/openApi/auth/login?userName=${code}&userPwd=${secret}`,
    method: 'post'
  })
}

// 获取视频平台登录的token
export function getVideoTokenByService() {
  // refresh为true则不从缓存中取，直接获取并刷新token
  return request({
    url: '/videoPlatform/getVideoToken?refresh=false',
    method: 'get'
  })
}

// 获取视频平台登录的token,,方法1：从前端获取，token缓存在localstorage中（仅用于内网演示，切换浏览器可能会导致失效），2.从后端获取，token缓存在redis中（推荐）
export async function getVideoTokenSync(refresh) {
  let token = '';
/*  if (process.env.VUE_APP_VIDEO_PLATFORM_WEB_API == 'Y') {// 前端直接调用视频平台的登录接口
    token = getCachedStorage('videoPlatformToken')
    // token && console.log('has token exist', token)
    if (refresh) token = '';   //将token置为空,触发刷新
    if (!token) {
      let res = await getVideoTokenByWeb()
      if (res.data && res.data.token) {
        token = res.data.token
        setCachedStorage('videoPlatformToken', token, 30) //设为30分钟
      }
    }
  } else {*/
    let res2 = await getVideoTokenByService()
    if (res2.data && res2.data.token) {
      token = res2.data.token
      setCachedStorage('videoPlatformToken', token, 30) //设为30分钟
    }
/*  }*/
  return token
}
