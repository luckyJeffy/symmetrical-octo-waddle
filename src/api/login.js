import request from '@/utils/request'

export function getRSAPublicKey() {
  return request({
    url: '/getRSAPublicKey.do',
    method: 'get'
  })
}

export function loginByEncryptedData(str) {
  const data = { str }
  return request({
    url: '/login.do',
    method: 'post',
    data
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

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
