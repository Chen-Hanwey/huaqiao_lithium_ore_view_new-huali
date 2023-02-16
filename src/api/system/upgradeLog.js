import request from '@/utils/request'

// 查询系统升级日志列表
export function listUpgradeLog(query) {
  return request({
    url: '/upgradeLog/upgradeLog/list',
    method: 'post',
    data: query
  })
}
export function UpgradeLog(query) {
  return request({
    url: '/upgradeLog/upgradeLog/first',
    method: 'post',
    data: query
  })
}

// 新增系统升级日志版本号校验
export function checkSysVersionAdd(query) {
  return request({
    url: '/upgradeLog/upgradeLog/checkSysVersionAdd',
    method: 'post',
    data: query
  })
}

// 修改系统升级日志版本号校验
export function checkSysVersionEdit(query) {
  return request({
    url: '/upgradeLog/upgradeLog/checkSysVersionEdit',
    method: 'post',
    data: query
  })
}

// 查询系统升级日志详细
export function getUpgradeLog(id) {
  return request({
    url: '/upgradeLog/upgradeLog/' + id,
    method: 'get'
  })
}

// 新增系统升级日志
export function addUpgradeLog(data) {
  return request({
    url: '/upgradeLog/upgradeLog',
    method: 'post',
    data: data
  })
}

// 修改系统升级日志
export function updateUpgradeLog(data) {
  return request({
    url: '/upgradeLog/upgradeLog',
    method: 'put',
    data: data
  })
}

// 删除系统升级日志
export function delUpgradeLog(id) {
  return request({
    url: '/upgradeLog/upgradeLog/' + id,
    method: 'delete'
  })
}

// 导出系统升级日志
export function exportUpgradeLog(query) {
  return request({
    url: '/upgradeLog/upgradeLog/export',
    method: 'post',
    data: query
  })
}
