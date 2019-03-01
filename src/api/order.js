import request from '@/utils/request'

// 获取订单列表
export function getOrderList(pageNo, pageSize, serNum) {
  return request({
    url: '/biz/v01/listBizOrderWithoutToken.do',
    method: 'post',
    data: { pageNo, pageSize, serNum }
  })
}
