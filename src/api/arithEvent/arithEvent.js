import request from '@/utils/request'

export function listArithEvent(query) {
  return request({
    url: '/video/arithEvent/list',
    method: 'post',
    data: query
  })
}

export function countNumByAlertType(){
  return request({
    url: '/video/arithEvent/countNumByAlertType',
    method: 'get'
  })
}
