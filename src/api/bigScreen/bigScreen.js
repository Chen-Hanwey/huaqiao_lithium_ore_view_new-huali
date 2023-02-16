import request from '@/utils/request'

/**
 * 统计从业人员健康证合格率
 * @param query
 */
export function getHealthState (query) {
  return request({
    url: '/bigScreen/getHealthState',
    method: 'post',
    data: query
  })
}

/**
 * 统计每日晨检完成率
 * @param query
 */
export function queryMorningCheck (query) {
  return request({
    url: '/bigScreen/getMorningCheck',
    method: 'post',
    data: query
  })
}

/**
 * 本月评分排名-前十名
 */
export function queryQualityScoreBefore () {
  return request({
    url: '/bigScreen/queryQualityScoreBefore',
    method: 'get'
  })
}
/**
 * 本月评分排名-后十名
 */
export function queryQualityScoreAfter () {
  return request({
    url: '/bigScreen/queryQualityScoreAfter',
    method: 'get'
  })
}

export function trainPersonRank(){
  return request({
    url: '/bigScreen/trainPersonRank',
    method: 'get'
  })
}

/**
 * 人员考试积分
 */
export function exam(){
  return request({
    url: '/bigScreen/exam',
    method: 'get'
  })
}

/**
 * 场景数
 */
export function getSceneNum () {
  return request({
    url: '/bigScreen/getSceneNum',
    method: 'get'
  })
}
/**
 * 全年食材检测情况
 */
export function foodAllYearCheck () {
  return request({
    url: '/bigScreen/foodAllYearCheck',
    method: 'get'
  })
}

/**
 * 全年食材检测情况
 * @param enterpriseId
 * @returns {*}
 */
export function listFoodInspectionByEnterpriseId(enterpriseId) {
  return request({
    url: '/bigScreen/selectFoodInspectionByEnterpriseId/' + enterpriseId,
    method: 'get',
  })
}

/**
 * 食材检测不合格分类
 * @returns {*}
 */
export function foodInspectionQuantity(){
  return request({
    url: '/bigScreen/foodInspectionQuantity',
    method: 'get'
  })
}
/**
 * 云厨总评分
 */
export function getQualityScoreTotal () {
  return request({
    url: '/bigScreen/getQualityScoreTotal',
    method: 'get'
  })
}
/**
 * 云厨
 */
export function getQualityScoreGroup () {
  return request({
    url: '/bigScreen/getQualityScoreGroup',
    method: 'get'
  })
}
/**
 * 评分趋势
 */
export function getQualityScoreTrend () {
  return request({
    url: '/bigScreen/getQualityScoreTrend',
    method: 'get'
  })
}
/**
 * 大屏数据汇总
 */
export function getAggregateData(){
  return request({
    url: '/bigScreen/aggregateData',
    method: 'get'
  })
}

/**
 * 按照区进行经营店统计
 */
export function getOperationNumByDistrict(){
  return request({
    url: '/bigScreen/getOperationNumByDistrict',
    method: 'get'
  })
}

/**
 * 消毒合格率
 *
 */
export function qualifiedByEnterpriseId() {
  return request({
    url: '/bigScreen/qualifiedByEnterpriseId',
    method: 'get'
  })
}


