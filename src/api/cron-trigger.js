import asyncservice from '@/utils/asyncservice'

export const ttsGroup = {
  lists: () => asyncservice.get('tts_group/v1/'),

  add: param => asyncservice.post('tts_group/v1/', param),

  modify: param => asyncservice.put('tts_group/v1/', param),

  delete: groupCode => asyncservice.delete(`tts_group/v1/${groupCode}`, groupCode),

}

export const ttsJob = {
  lists: groupCode => asyncservice.get(`/tts_job/v1/${groupCode}`, groupCode),

  add: param => asyncservice.post('tts_job/v1/', param),

  modify: param => asyncservice.put('tts_job/v1/', param),

  delete: obj => asyncservice.delete(`tts_job/v1/${obj.groupCode}/${obj.jobCode}`, obj),

  operate: obj => asyncservice.get(`tts_job/v1/operate/${obj.groupCode}/${obj.jobCode}/${obj.action}`, obj),
}
