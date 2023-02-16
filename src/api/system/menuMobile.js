import request from '@/utils/request'

// 查询移动端菜单列表
export function listMenuMobile(query) {
  return request({
    url: '/system/menuMobile/list',
    method: 'post',
    data: query
  })
}

// 查询移动端菜单详细
export function getMenuMobile(menuId) {
  return request({
    url: '/system/menuMobile/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menuMobile/listMenuTreeSelect',
    method: 'get'
  })
}

// 新增移动端菜单
export function addMenuMobile(data) {
  return request({
    url: '/system/menuMobile',
    method: 'post',
    data: data
  })
}

// 修改移动端菜单
export function updateMenuMobile(data) {
  return request({
    url: '/system/menuMobile',
    method: 'put',
    data: data
  })
}

// 删除移动端菜单
export function delMenuMobile(menuId) {
  return request({
    url: '/system/menuMobile/' + menuId,
    method: 'delete'
  })
}

// 导出移动端菜单
export function exportMenuMobile(query) {
  return request({
    url: '/system/menuMobile/export',
    method: 'post',
    data: query
  })
}
