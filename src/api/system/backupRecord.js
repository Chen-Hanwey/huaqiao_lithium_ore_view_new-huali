import request from '@/utils/request'

// 查询数据库备份记录列表
export function listBackupRecord(query) {
  return request({
    url: '/system/backupRecord/list',
    method: 'post',
    data: query
  })
}

// 查询数据库备份记录数量
export function countBackupRecord(query) {
  return request({
    url: '/system/backupRecord/count',
    method: 'post',
    data: query
  })
}

// 查询数据库备份记录详细
export function getBackupRecord(id) {
  return request({
    url: '/system/backupRecord/' + id,
    method: 'get'
  })
}

// 新增数据库备份记录
export function addBackupRecord(data) {
  return request({
    url: '/system/backupRecord',
    method: 'post',
    data: data
  })
}

// 新增数据库备份记录
export function backupDB() {
  return request({
    url: '/system/backupRecord/backupDB',
    method: 'post',
    data: {}
  })
}

// 修改数据库备份记录
export function updateBackupRecord(data) {
  return request({
    url: '/system/backupRecord',
    method: 'put',
    data: data
  })
}

// 删除数据库备份记录
export function delBackupRecord(id) {
  return request({
    url: '/system/backupRecord/' + id,
    method: 'delete'
  })
}

// 导出数据库备份记录
export function exportBackupRecord(query) {
  return request({
    url: '/system/backupRecord/export',
    method: 'post',
    data: query
  })
}
