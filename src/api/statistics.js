import request from '@/utils/request'
// 获取总用户数、总商品数、总营业额、总订单数
export function totalData(para) {
  return request({
    url: '/console/v01/totalData.do',
    method: 'post',
    data: para
  })
}
