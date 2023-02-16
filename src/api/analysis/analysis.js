import request from '@/utils/request'

export function getAnalysisEnterpriseData(){
  return request({
    url: '/analysis/enterpriseNum',
    method: 'post'
  })
}
export function getAnalysisDeptData(){
  return request({
    url: '/analysis/enterpriseClassify',
    method: 'post'
  })
}
export function getMonitorData(body){
  return request({
    url: '/analysis/monitor',
    method: 'post',
    data: body
  })
}
