import request from '@/utils/request'


// 查询检测数据
export function getAttributeData (query) {
  return request({
    url: '/devic/monitor/data/getAttributeData',
    method: 'get',
    params: query
  })
}

//查询平均值
export function historyAvgList (query) {
  return request({
    url: '/devic/monitor/data/avgList',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/devic/monitor/data/list2',
    method: 'get',
    params: query
  })
}