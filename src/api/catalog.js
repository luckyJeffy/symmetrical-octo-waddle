import request from '@/utils/request'

// 查询所有一级分类，及二级分类或商品
export function fetchCatalogList(pageNo, pageSize) {
  return request({
    url: '/biz/v01/selectCatalogParentWithoutToken.do',
    method: 'post',
    data: { pageNo, pageSize }
  })
}
