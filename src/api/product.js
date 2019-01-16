import request from '@/utils/request'

export function getProductInfo(pageNo, pageSize) {
  return request({
    url: '/biz/v01/listBizProductWithoutToken.do',
    method: 'post',
    data: { pageNo, pageSize }
  })
}

export function updateProductInfo(product) {
  return request({
    url: '/biz/v01/updateBizProduct.do',
    method: 'post',
    data: product
  })
}

export function searchProductInfo(value) {
  return request({
    url: 'biz/v01/listBizDrug.do',
    method: 'post',
    data: { name: value }
  })
}

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
