import request from '@/utils/request'

// 获取用户列表
export function getUserList(pageNo, pageSize, phone, name) {
  return request({
    url: '/portal/v01/listPortalUserAccount.do',
    method: 'post',
    data: { pageNo, pageSize, phone, name }
  })
}
