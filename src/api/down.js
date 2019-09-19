import asyncservice from '@/utils/asyncservice'

export const downlink = {
  tm: param => asyncservice.post('/tm', param),

  image: () => asyncservice.post('/image')
}

export const useroles = {
  getUserInfo: param => asyncservice.get(`/role/${param}`, param)
}
