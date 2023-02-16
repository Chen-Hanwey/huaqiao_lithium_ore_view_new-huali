import request from '@/utils/request'

// 上传文件并生成缩略图
export function uploadImageAndCrtThumbImage(data) {
  return request({
    url: '/fdfs/uploadImageAndCrtThumbImage',
    method: 'post',
    data: data
  })
}

// 上传文件
export function upload(data) {
  return request({
    url: '/fdfs/upload',
    method: 'post',
    data: data
  })
}

// 删除文件
export function deleteFile(data) {
  return request({
    url: '/fdfs/deleteFile',
    method: 'post',
    params: data
  })
}

// 图片及缩略图文件
export function deleteImageWithThumbImage(data) {
  return request({
    url: '/fdfs/deleteImageWithThumbImage',
    method: 'post',
    params: data
  })
}

// 图片及缩略图、视频等文件删除，后台对文件进行分类删除
export function deleteMixedFiles(data) {
  return request({
    url: '/fdfs/deleteMixedFiles',
    method: 'post',
    params: data
  })
}
