import request from '@/utils/request'

export function getDashboardData(params) {
  return request({
    url: '/api/readservice/fuse/api/dashboard',
    method: 'get',
    params
  })
}
