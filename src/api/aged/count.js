import request from '@/utils/request'

// 查询失能老人管理数量
export function countDisabledElderly (query) {
  return request({
    url: '/count/oldCount',
    method: 'post',
    data: query
  })
}


export function countNurser (query) {
  return request({
    url: '/count/nurserCount',
    method: 'post',
    data: query
  })
}



export function countGrid (query) {
  return request({
    url: '/count/gridCount',
    method: 'post',
    data: query
  })
}

export function countNum (query) {
  return request({
    url: '/count/oldPeople',
    method: 'post',
    data: query
  })
}


export function age (query) {
  return request({
    url: '/count/age',
    method: 'post',
    data: query
  })
}

export function nurser (query) {
  return request({
    url: '/count/nurser',
    method: 'post',
    data: query
  })
}

// 监护人评价
export function guardEvaluate (query) {
  return request({
    url: '/count/guardEvaluate',
    method: 'post',
    data: query
  })
}

// 服务评价
export function serviceEvaluate (query) {
  return request({
    url: '/count/serviceEvaluate',
    method: 'post',
    data: query
  })
}


export function order (query) {
  return request({
    url: '/count/order',
    method: 'post',
    data: query
  })
}

export function getServiceDemandList (query) {
  return request({
    url: '/count/getServiceDemandList',
    method: 'post',
    data: query
  })
}


export function getServiceCountList (query) {
  return request({
    url: '/count/getServiceCountList',
    method: 'post',
    data: query
  })
}

export function getServiceDurationList (query) {
  return request({
    url: '/count/getServiceDurationList',
    method: 'post',
    data: query
  })
}

// 获取薛城区下老人数目汇总
export function getCityOldCount() {
  return request({
    url: '/count/getCityOldCount',
    method: 'get'
  })
}


