import asyncservice from '@/utils/asyncservice'

export const ttsScheduleException = {
    lists: obj => asyncservice.get(`/tts_job_exception/v1/${obj.currentPage}/${obj.pageSize}/${obj.groupCode}`, obj),
}

export const ttsScheduleApprove = {
    lists: queryType => asyncservice.get(`/calc/v1/history/confirm/${queryType}`, queryType),
}