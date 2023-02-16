import request from '@/utils/request'

// 查询摄像头列列表
export function listCamera (query) {
  return request({
    url: '/camera/camera/list',
    method: 'post',
    data: query
  })
}

// 查询摄像头列数量
export function countCamera (query) {
  return request({
    url: '/camera/camera/count',
    method: 'post',
    data: query
  })
}

// 查询摄像头列详细
export function getCamera (id) {
  return request({
    url: '/camera/camera/' + id,
    method: 'get'
  })
}

// 新增摄像头列
export function addCamera (data) {
  return request({
    url: '/camera/camera',
    method: 'post',
    data: data
  })
}

// 修改摄像头列
export function updateCamera (data) {
  return request({
    url: '/camera/camera',
    method: 'put',
    data: data
  })
}

// 删除摄像头列
export function delCamera (id) {
  return request({
    url: '/camera/camera/' + id,
    method: 'delete'
  })
}

// 导出摄像头列
export function exportCamera (query) {
  return request({
    url: '/camera/camera/export',
    method: 'post',
    data: query
  })
}


// 同步摄像头
export function syncDev () {
  return request({
    url: '/camera/camera/syncDev',
    method: 'get'
  })
}



// 同步摄像头
export function getPlayStream (code) {
  return request({
    url: '/camera/camera/previewURL/' + code,
    method: 'get'
  })
}