import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/ruoyi";

// 查询用户列表
export function listUser (query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}


// 查询用户列表（企业或经营场所）
export function listEnterpriseOrOperationUser (data) {
  return request({
    url: '/system/user/listWithEnterpriseOrOperation',
    method: 'post',
    data: data
  })
}

// 查询用户列表（供应商）
export function listSupplierUser (data) {
  return request({
    url: '/system/user/listWithSupplier',
    method: 'post',
    data: data
  })
}

// 查询用户列表(监管)
// export function listSupervisionUser(data) {
//   return request({
//     url: '/system/user/listWithSupervision',
//     method: 'post',
//     data: data
//   })
// }

// 查询用户详细
export function getUser (userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser (data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 注册用户
export function signUp (data) {
  return request({
    url: '/system/user/signUp',
    method: 'post',
    data: data
  })
}

/**
 * 注册用户获取验证码
 * @param phoneNumber
 */
export function getSignUpVerifyCode (phoneNumber) {
  let data = {
    phoneNumber: phoneNumber
  }
  return request({
    url: '/system/user/getSignUpVerifyCode',
    method: 'get',
    params: data
  })
}

// 修改用户
export function updateUser (data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser (userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser (query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd (userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus (userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile () {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile (data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd (oldPassword, newPassword, clientKey) {
  const data = {
    oldPassword,
    newPassword,
    clientKey
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar (data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate () {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}
