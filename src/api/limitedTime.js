import request from '@/utils/request'

// 获取特价商品列表
export function getlistBizBargain(para) {
  return request({
    url: '/biz/v01/listBizBargain.do',
    method: 'post',
    data: para
  })
}
// 获取特价商品详情
export function getBizBargain(para) {
  return request({
    url: '/biz/v01/getBizBargain.do',
    method: 'post',
    data: para
  })
}
// 增加特价商品
export function insertBizBargain(para) {
  return request({
    url: '/biz/v01/insertBizBargain.do',
    method: 'post',
    data: para
  })
}
// 删除特价商品
export function forceRemoveBizBargain(para) {
  return request({
    url: '/biz/v01/forceRemoveBizBargain.do',
    method: 'post',
    data: para
  })
}
// 修改特价商品
export function updateBizBargain(para) {
  return request({
    url: '/biz/v01/updateBizBargain.do',
    method: 'post',
    data: para
  })
}
