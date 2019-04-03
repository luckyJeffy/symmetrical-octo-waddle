import request from '@/utils/request'

// 获取后台用户列表
export function getUserListConsole(pageNo, pageSize, account, phone) {
  return request({
    url: '/console/v01/listConsoleUserAccount.do',
    method: 'post',
    data: { pageNo, pageSize, account, phone }
  })
}
// 获取角色列表
export function getlistConsoleRole(pageNo, pageSize, name) {
  return request({
    url: '/console/v01/listConsoleRole.do',
    method: 'post',
    data: { pageNo, pageSize, name }
  })
}
// 新增修改系统用户
export function saveConsoleUserAccount(para) {
  return request({
    url: '/console/v01/saveConsoleUserAccount.do',
    method: 'post',
    data: para
  })
}
// 锁定系统用户
export function frozenConsoleUserAccount(para) {
  return request({
    url: '/console/v01/frozenConsoleUserAccount.do',
    method: 'post',
    data: para
  })
}
// 解锁系统用户
export function removeFrozenConsoleUserAccount(para) {
  return request({
    url: '/console/v01/removeFrozenConsoleUserAccount.do',
    method: 'post',
    data: para
  })
}
// 新增/修改角色
export function saveConsoleRole(para) {
  return request({
    url: '/console/v01/saveConsoleRole.do',
    method: 'post',
    data: para
  })
}
// 删除角色
export function deleteConsoleRole(para) {
  return request({
    url: '/console/v01/deleteConsoleRole.do',
    method: 'post',
    data: para
  })
}
// 授权菜单
export function getListAllMenuFunction(para) {
  return request({
    url: '/console/v01/listAllMenuFunction.do',
    method: 'post',
    data: para
  })
}
