import request from '@/utils/request'

// 获取文件列表
export function getfilelist(query) {
  return request({
    url: '/file/getfilelist',
    method: 'get',
    params: query
  })
}

// 获取存储占用
export function getstorage(query) {
  return request({
    url: '/filetransfer/getstorage',
    method: 'get',
    params: query
  })
}

// 解压文件
export function unzipfile(query) {
  return request({
    url: '/file/unzipfile',
    method: 'post',
    data: query
  })
}

// 删除文件
export function deleteFile(query) {
  return request({
    url: '/file/deletefile',
    method: 'post',
    data: query
  })
}

// 重命名文件
export function renameFile(query) {
  return request({
    url: '/file/renamefile',
    method: 'post',
    data: query
  })
}

// 通过文件类型选择文件
export function selectFileByFileType(query) {
  return request({
    url: '/file/selectfilebyfiletype',
    method: 'get',
    params: query
  })
}

// 获取文件的树结构
export function getFileTree(query) {
  return request({
    url: '/file/getfiletree',
    method: 'get',
    params: query
  })
}

// 移动文件
export function moveFile(query) {
  return request({
    url: '/file/movefile',
    method: 'post',
    data: query
  })
}

// 创建文件
export function createFile(query) {
  return request({
    url: '/file/createfile',
    method: 'post',
    data: query
  })
}

// 批量删除文件
export function batchDeleteFile(query) {
  return request({
    url: '/file/batchdeletefile',
    method: 'post',
    data: query
  })
}

// 批量移动文件
export function batchMoveFile(query) {
  return request({
    url: '/file/batchmovefile',
    method: 'post',
    data: query
  })
}
