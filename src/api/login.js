import request from '@/utils/request'

export function getRSAPublicKey() {
  return request({
    url: '/console/v01/getRSAPublicKey.do',
    method: 'get'
  })
}

export function loginByEncryptedData(str) {
  return request({
    url: '/console/v01/login.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: str
  })
}

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/console/v01/checkAccessToken.do',
    method: 'post',
    data: { accessToken }
  })
}
// 角色权限
export function getListMyConsoleMenuVue(para) {
  return request({
    url: '/console/v01/listMyConsoleMenuVue.do',
    method: 'post',
    data: para
  })
}
