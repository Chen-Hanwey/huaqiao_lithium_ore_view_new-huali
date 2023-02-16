import request from '@/utils/request'

// 查询区域信息列表-匿名
export function listDistrictAnon(query) {
  return request({
    url: '/district/district/listAnon',
    method: 'post',
    data: query
  })
}

// 查询区域信息列表
export function listDistrict(query) {
  return request({
    url: '/district/district/list',
    method: 'post',
    data: query
  })
}

// 查询区域信息列表
export function listDistrictByPCode(query) {
  return request({
    url: '/district/district/list',
    method: 'post',
    data: query
  })
}

// 查询区域树结构列表
export function treeDistrict(query) {
  return request({
    url: '/district/district/treeDistrict',
    method: 'get',
    params: query
  })
}

// 查询区域信息详细
export function getDistrict(code) {
  return request({
    url: '/district/district/code/' + code,
    method: 'get'
  })
}

// 查询区域信息详细
export function getDistrictById(id) {
  return request({
    url: '/district/district/' + id,
    method: 'get'
  })
}

// 查询区域信息详细
export function getDistrictByParentId(pcode) {
  return request({
    url: '/district/district/parentId/' + pcode,
    method: 'get'
  })
}

// 查询区域信息详细
export function getDistrictByPCode(pcode) {
  return request({
    url: '/district/district/pcode/' + pcode,
    method: 'get'
  })
}

// 新增区域信息
export function addDistrict(data) {
  return request({
    url: '/district/district',
    method: 'post',
    data: data
  })
}

// 修改区域信息
export function updateDistrict(data) {
  return request({
    url: '/district/district',
    method: 'put',
    data: data
  })
}

// 删除区域信息
export function delDistrict(code) {
  return request({
    url: '/district/district/' + code,
    method: 'delete'
  })
}

// 导出区域信息
export function exportDistrict(query) {
  return request({
    url: '/district/district/export',
    method: 'post',
    data: query
  })
}
