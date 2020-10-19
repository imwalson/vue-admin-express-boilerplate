import request from '@/utils/request'

export function getAdvertiserList(data) {
  return request({
    url: '/api/readservice/fuse/advertisermanagement/advertiser/list',
    method: 'post',
    data
  })
}

