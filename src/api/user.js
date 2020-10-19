import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/readservice/fuse/api/login',
    method: 'post',
    data
  })
}
