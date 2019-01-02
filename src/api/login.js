import request from '@/utils/request'

export function getRSAPublicKey() {
  return request({
    url: '/getRSAPublicKey.do',
    method: 'get'
  })
}

export function loginByEncryptedData(str) {
  return request({
    url: '/login.do',
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

export function getUserInfo(id) {
  return request({
    url: '/getConsoleUserAccount.do',
    method: 'post',
    data: { id }
  })
}
