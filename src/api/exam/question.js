import request from '@/utils/request'

// 查询题目详情列表
export function listQuestion(query) {
  return request({
    url: '/exam/question/list',
    method: 'post',
    data: query
  })
}

// 查询题目详情详细
export function getQuestion(id) {
  return request({
    url: '/exam/question/' + id,
    method: 'get'
  })
}

// 新增题目详情
export function addQuestion(data) {
  return request({
    url: '/exam/question',
    method: 'post',
    data: data
  })
}

// 修改题目详情
export function updateQuestion(data) {
  return request({
    url: '/exam/question',
    method: 'put',
    data: data
  })
}

// 删除题目详情
export function delQuestion(id) {
  return request({
    url: '/exam/question/' + id,
    method: 'delete'
  })
}

// 导出题目详情
export function exportQuestion(query) {
  return request({
    url: '/exam/question/export',
    method: 'post',
    data: query
  })
}
