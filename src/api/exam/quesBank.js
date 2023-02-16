import request from '@/utils/request'

// 查询题库分类管理列表
export function listQuesBank(query) {
  return request({
    url: '/exam/quesBank/list',
    method: 'post',
    data: query
  })
}

// 查询题库分类管理详细
export function getQuesBank(id) {
  return request({
    url: '/exam/quesBank/' + id,
    method: 'get'
  })
}

// 新增题库分类管理
export function addQuesBank(data) {
  return request({
    url: '/exam/quesBank',
    method: 'post',
    data: data
  })
}

// 修改题库分类管理
export function updateQuesBank(data) {
  return request({
    url: '/exam/quesBank',
    method: 'put',
    data: data
  })
}

// 删除题库分类管理
export function delQuesBank(id) {
  return request({
    url: '/exam/quesBank/' + id,
    method: 'delete'
  })
}

// 导出题库分类管理
export function exportQuesBank(query) {
  return request({
    url: '/exam/quesBank/export',
    method: 'post',
    data: query
  })
}

// 获取所有题库列表
export function listAll() {
  return request({
    url: '/exam/quesBank/listAll',
    method: 'get'
  })
}
