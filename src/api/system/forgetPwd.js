import request from '@/utils/request'

// 获取验证码
export function getVerifyCode(identity, mailbox) {
  const data = {
    identity,
    mailbox
  }
  return request({
    url: '/forgetPwd/getVerifyCode',
    method: 'post',
    params: data
  })
}

// 用户状态修改
export function verifyCode(identity, code) {
  const data = {
    identity,
    code
  }
  return request({
    url: '/forgetPwd/verifyCode',
    method: 'post',
    params: data
  })
}

// 用户密码重置
export function resetPwd(identity, password, clientKey) {
  const data = {
    identity,
    password,
    clientKey
  }
  return request({
    url: '/forgetPwd/resetPwd',
    method: 'post',
    params: data
  })
}

// 获取短信验证码
export function getVerifyCodeBySms(phoneNumber) {
  const data = {
    phoneNumber: phoneNumber
  }
  return request({
    url: '/forgetPwd/getVerifyCodeBySms',
    method: 'get',
    params: data
  })
}

// 验证短信验证码
export function verifySmsCode(phoneNumber, code) {
  const data = {
    phoneNumber: phoneNumber,
    code: code
  }
  return request({
    url: '/forgetPwd/verifySmsCode',
    method: 'post',
    params: data
  })
}
