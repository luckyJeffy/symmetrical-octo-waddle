import request from '@/utils/request'

// 获取用户列表
export function getUserList(pageNo, pageSize, phone, name) {
  return request({
    url: '/portal/v01/listPortalUserAccount.do',
    method: 'post',
    data: { pageNo, pageSize, phone, name }
  })
}
// 查询领礼品次数
export function getlistGiftNum(userOpenId) {
  return request({
    url: '/portal/v01/listGiftNum.do',
    method: 'post',
    data: { userOpenId }
  })
}
// 插入领取礼品记录
export function insertGiftLog(userOpenId, detailed, businessType) {
  return request({
    url: '/portal/v01/insertGiftLog.do',
    method: 'post',
    data: { userOpenId, detailed, businessType }
  })
}
// 插入领取礼品记录
export function listGiftLog(pageNo, pageSize, userOpenId) {
  return request({
    url: '/portal/v01/listGiftLog.do',
    method: 'post',
    data: { pageNo, pageSize, userOpenId }
  })
}
