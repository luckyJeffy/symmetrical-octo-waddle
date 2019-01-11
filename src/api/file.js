import request from '@/utils/request'

export function uploadFile(file) {
  return request({
    url: '/file/v01/fileUpload.do?savePath=imageydtest.vrdete.com',
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: { file }
  })
}
