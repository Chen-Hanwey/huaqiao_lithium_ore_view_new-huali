import request from '@/utils/request'

// 查询系统消息列表
export function listSysMessage(query) {
  return request({
    url: '/sysMessage/sysMessage/list',
    method: 'post',
    data: query
  })
}

// 查询系统消息详细
export function getSysMessage(id) {
  return request({
    url: '/sysMessage/sysMessage/' + id,
    method: 'get'
  })
}

// 新增系统消息
export function addSysMessage(data) {
  return request({
    url: '/sysMessage/sysMessage',
    method: 'post',
    data: data
  })
}

// 修改系统消息
export function updateSysMessage(data) {
  return request({
    url: '/sysMessage/sysMessage',
    method: 'put',
    data: data
  })
}

// 删除系统消息
export function delSysMessage(id) {
  return request({
    url: '/sysMessage/sysMessage/' + id,
    method: 'delete'
  })
}

// 导出系统消息
export function exportSysMessage(query) {
  return request({
    url: '/sysMessage/sysMessage/export',
    method: 'post',
    data: query
  })
}
