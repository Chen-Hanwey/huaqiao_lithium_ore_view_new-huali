import request from '@/utils/request'
// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}
// 查询事件告警列表
export function listWeighBridge(query) {
    return request({
        url: '/weighBridge/weighBridge/list',
        // url: `http://192.168.2.13:8089/huaqiao_lithium_ore_service/weighBridge/weighBridge/list`,
        method: 'post',
        data: query
    })
}
// 获取地磅详细信息
export function weighBridgedeltail(id) {
    return request({
        //   url: `/weighBridge/weighBridge/${id}`
        url: `/weighBridge/weighBridge/${id}`
    })
}
// 获取图片接口
export function fileShowImg(query) {
    return request({
        //   url: `/weighBridge/weighBridge/${id}`
        url: `/weighBridge/file/showImg`,
        params:query
    })
}
// 信息导出接口
export function exportMessage(data) {
    return request({
        //   url: `/weighBridge/weighBridge/${id}`
        url: `/weighBridge/weighBridge/export`,
        // url: `http://192.168.2.13:8089/huaqiao_lithium_ore_service/weighBridge/weighBridge/export`,
        method: 'post',
        data:data
    })
}