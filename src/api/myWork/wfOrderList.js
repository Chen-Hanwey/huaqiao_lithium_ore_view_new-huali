import request from '@/utils/request'

// 查询工单信息列表
export function getWfOrderList(query) {
  return request({
    url: '/orderList/orderList/list',
    method: 'post',
    data: query
  })
}
