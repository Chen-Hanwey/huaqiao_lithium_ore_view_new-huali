import request from '@/utils/request'
// 查询和家亲-设备列表
export function listDevice(query) {
  return request({
    url: '/hejq/device/list',
    method: 'get',
    params: query
  })
}

// 查询和家亲-设备详细
export function getDevice(id) {
  return request({
    url: '/hejq/device/' + id,
    method: 'get'
  })
}

// 新增和家亲-设备
export function addDevice(data) {
  return request({
    url: '/hejq/device',
    method: 'post',
    data: data
  })
}

// 修改和家亲-设备
export function updateDevice(data) {
  return request({
    url: '/hejq/device',
    method: 'put',
    data: data
  })
}

// 删除和家亲-设备
export function delDevice(id) {
  return request({
    url: '/hejq/device/' + id,
    method: 'delete'
  })
}

// 导出和家亲-设备
export function exportDevice(query) {
  return request({
    url: '/hejq/device/export',
    method: 'get',
    params: query
  })
}
/**
 * 同步设备
 * @returns {AxiosPromise}
 */
export function syncCvrDeviceAndBranch() {
  return request({
    url: '/hejq/device/syncCvrDeviceAndBranch',
    method: 'get'
  })
}

/**
 * 获取播放地址
 * @param query
 * @returns {AxiosPromise}
 */
export function getDeviceStream(query) {
  return request({
    url:'/hejq/device/getDeviceStream',
    method: 'get',
    params: query
  })
}
