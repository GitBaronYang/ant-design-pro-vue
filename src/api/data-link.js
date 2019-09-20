import asyncservice from '@/utils/asyncservice'

export const downlink = {
  tm: param => asyncservice.post('/tm', param),

  image: () => asyncservice.post('/image')

}

export const uplink = {
  tc: param => asyncservice.post('/tc', param)
}

export const useroles = {
  getUserInfo: param => asyncservice.get(`/role/${param}`, param)
}
