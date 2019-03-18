import request from '@/utils/request'

// 获取积分商品列表
export function getlistIntegralProduct(para) {
  return request({
    url: '/biz/v01/listBizIntegralProduct.do',
    method: 'post',
    data: para
  })
}
// 添加积分商品
export function insertIntegralProduct(para) {
  return request({
    url: '/biz/v01/insertBizIntegralProduct.do',
    method: 'post',
    data: para
  })
}

// 修改积分商品
export function updateIntegralProduct(para) {
  return request({
    url: '/biz/v01/updateBizIntegralProduct.do',
    method: 'post',
    data: para
  })
}

// 删除积分商品
export function forceRemoveIntegralProduct(para) {
  return request({
    url: '/biz/v01/forceRemoveBizIntegralProduct.do',
    method: 'post',
    data: para
  })
}

