import request from '@/utils/request'

// 查询
export function AlarmList(query) {
  return request({
    url: '/bigScreen/alarmList',
    method: 'post',
    data: query
  })
}

export function weatherList(query) {
  return request({
    url: '/bigScreen/weatherList',
    method: 'post',
    data: query
  })
}

export function alarmCount(){
  return request({
    url: '/bigScreen/alarmCount',
    method: 'post',
  })
}

export function getProduction(){
  return request({
    url: '/bigScreen/getProduction',
    method: 'get',
  })
}
