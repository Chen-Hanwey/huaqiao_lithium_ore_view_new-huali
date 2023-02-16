import request from '@/utils/request'

// 登录方法
export function login (username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

// 登录方法
export function login_aes (username, password, code, uuid, clientPubKey) {
  const data = {
    username,
    password,
    code,
    uuid,
    clientPubKey
  }
  return request({
    url: '/loginAes',
    method: 'post',
    params: data
  })
}

// 获取用户详细信息
export function getInfo () {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout () {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg () {
  return request({
    url: '/captchaImage1',
    method: 'get'
  })
}

// 获取公钥方法--无需登录
export function getPublicKey (username) {
  let param = { username: username }
  return request({
    url: '/keys/getPublicKey',
    method: 'get',
    params: param
  })
}

// 获取公钥方法--需登录
export function getPublicKeyPermi (username) {
  let param = { username: username }
  return request({
    url: '/keys/getPublicKeyPermi',
    method: 'get',
    params: param
  })
}
