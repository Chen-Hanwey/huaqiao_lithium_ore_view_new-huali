import request from '@/utils/request'
import da from "element-ui/src/locale/lang/da";

// 查询已办任务列表
export function finishedList(query) {
  return request({
    url: '/flowable/task/finishedList',
    method: 'get',
    params: query
  })
}

// 任务流转记录
export function flowRecord(query) {
  return request({
    url: '/flowable/task/flowRecord',
    method: 'get',
    params: query
  })
}

// 撤回任务
export function revokeProcess(data) {
  return request({
    url: '/flowable/task/revokeProcess',
    method: 'post',
    data: data
  })
}

// 部署流程实例
export function deployStart(deployId) {
  return request({
    url: '/flowable/process/startFlow/' + deployId,
    method: 'get',
  })
}

// 查询流程定义详细
export function getDeployment(id) {
  return request({
    url: '/deployment/' + id,
    method: 'get'
  })
}

// 新增流程定义
export function addDeployment(data) {
  return request({
    url: '/deployment',
    method: 'post',
    data: data
  })
}

// 修改流程定义
export function updateDeployment(data) {
  return request({
    url: '/deployment',
    method: 'put',
    data: data
  })
}

// 删除流程定义
export function delDeployment(id) {
  return request({
    url: '/flowable/instance/delete/?instanceId=' + id,
    method: 'delete'
  })
}
