import request from '@/utils/request'
// 获取和包token
export function loginHebao(data) {
  return request({
    url: '/system/hebao/loginHeBao',
    method: 'post',
    data: data
  })
}
export function addPartyHebao(data) {
  return request({
    url: '/system/hebao/addPartyHebao',
    method: 'get',
    params: data
  })
}
