import request from '@/utils/request'

export function getProductInfo(id, storeId) {
  return request({
    url: '/biz/v01/listBizProductWithoutToken.do',
    method: 'post',
    data: { id, storeId }
  })
}
