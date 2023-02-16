import request from '@/utils/request'

export function getInspectData(){
  return request({
    url: '/operationManage/operationManage/inspect/data',
    method: 'get'
  })
}

export function getOperationInfo(operationId){
  return request({
    url: '/bigScreen/inspect/'+operationId,
    method: 'get'
  })
}
/**
 * 评分趋势
 */
export function getQualityScoreTrendComp () {
  return request({
    url: '/bigScreen/inspect/getQualityScoreTrendComp',
    method: 'get'
  })
}

/**
 * 地图攥取 AI告警统计
 */
export function grabAlarm(operationId){
  return request({
    url: '/bigScreen/grab/alarm/' + operationId,
    method: 'get'
  })
}

/**
 * 从业人员信息
 */
export function grabKitchenPerson(operationId){
  return request({
    url: '/bigScreen/grab/kitchenPerson/' + operationId,
    method: 'get'
  })
}

/**
 * 采购食材趋势
 */
export function purchasingTrends(operationId){
  return request({
    url: '/bigScreen/grab/purchasingTrends/' + operationId,
    method: 'get'
  })
}
/**
 * 出库趋势
 */
export function outOfStockTrends(operationId){
  return request({
    url: '/bigScreen/grab/outOfStockTrends/' + operationId,
    method: 'get'
  })
}

/**
 * 根据经营场所id获取视频设备在线状态数量
 */
export function statisticsDeviceStatusByOperationId(operationId){
  return request({
    url: '/bigScreen/inspect/statisticsDeviceStatusByOperationId/' + operationId,
    method: 'get'
  })
}

/**
 * 根据经营场所id获取视频设备类型数量
 */
export function statisticsDeviceTypeByOperationId(operationId){
  return request({
    url: '/bigScreen/inspect/statisticsDeviceTypeByOperationId/' + operationId,
    method: 'get'
  })
}
