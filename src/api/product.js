import request from '@/utils/request'

// 获取产品列表
export function getProductInfo(pageNo, pageSize) {
  return request({
    url: '/biz/v01/listBizProductWithoutToken.do',
    method: 'post',
    data: { pageNo, pageSize }
  })
}

// 更新产品
export function updateProductInfo(product) {
  return request({
    url: '/biz/v01/updateBizProduct.do',
    method: 'post',
    data: product
  })
}

// 新增产品
export function addProductInfo(product) {
  return request({
    url: '/biz/v01/insertBizProduct.do',
    method: 'post',
    data: product
  })
}

// 搜索产品
export function searchProductInfo(name, serNum) {
  return request({
    url: 'biz/v01/listBizDrug.do',
    method: 'post',
    data: { name: name, serNum: serNum }
  })
}

// query by catalogId
export function queryProduct(id, pageNo, pageSize) {
  return request({
    url: 'biz/v01/selectProductWithoutToken.do',
    method: 'post',
    data: { catalogId: id, pageNo, pageSize }
  })
}

// 产品详情
export function getProductDetails(id) {
  return request({
    url: '/biz/v01/getBizProductWithoutToken.do',
    method: 'post',
    data: { id }
  })
}

// 逻辑删除
export function deleteProduct(id) {
  return request({
    url: '/biz/v01/deleteBizProduct.do',
    method: 'post',
    data: { id }
  })
}

// 取消逻辑删除
export function restoreBizProduct(id) {
  return request({
    url: '/biz/v01/restoreBizProduct.do',
    method: 'post',
    data: { id }
  })
}
