import request from '@/utils/request'

// 查询考试历史列表
export function listHistory(query) {
  return request({
    url: '/check/history/list',
    method: 'post',
    data: query
  })
}

// 查询考试历史详细
export function getHistory(id) {
  return request({
    url: '/check/history/' + id,
    method: 'get'
  })
}

// 新增考试历史
export function addHistory(data) {
  return request({
    url: '/check/history',
    method: 'post',
    data: data
  })
}

// 修改考试历史
export function updateHistory(data) {
  return request({
    url: '/check/history',
    method: 'put',
    data: data
  })
}

// 删除考试历史
export function delHistory(id) {
  return request({
    url: '/check/history/' + id,
    method: 'delete'
  })
}

// 导出考试历史
export function exportHistory(query) {
  return request({
    url: '/check/history/export',
    method: 'post',
    data: query
  })
}

// 我的考试列表
export function myExamList(query){
  return request({
    url: '/check/history/myList',
    method: 'post',
    data: query
  })
}

// 开始考试
export function startExam(examId){
  return request({
    url: '/check/history/startCheck/'+examId,
    method: 'get'
  })
}

// 考试交卷
export function finishExam(data){
  return request({
    url: '/check/history/finishCheck',
    method: 'post',
    data: data
  })
}

// 查看考试结果
export function previewResult(examId){
  return request({
    url: '/check/history/previewResult/'+examId,
    method: 'get'
  })
}

export function statisticsList(query) {
  return request({
    url: '/check/history/statisticsList',
    method: 'post',
    data: query
  })
}

export function rectification(data) {
  return request({
    url: '/check/history/rectification',
    method: 'put',
    data: data
  })
}

export function audit(data) {
  return request({
    url: '/check/history/audit',
    method: 'put',
    data: data
  })
}
