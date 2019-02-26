import request from '@/utils/request'

// 获取订单列表
export function getUserList(pageNo, pageSize) {
  return request({
    url: '/console/v01/listConsoleUserAccount.do',
    method: 'post',
    data: { pageNo, pageSize }
  })
}
