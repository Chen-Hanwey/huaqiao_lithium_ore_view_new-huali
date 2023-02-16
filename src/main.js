import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './assets/styles/font-awesome-4.7.0/css/font-awesome.min.css';
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/styles/custom.scss'
import '@/assets/styles/customForm.scss'
import '@/assets/styles/screenFull.scss'
import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'
import Print from 'vue-print-nb'
import './assets/icons' // icon
import './permission' // permission control
import { getDicts, getDictsAnon } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabelMultiArray, handlePicturePath, handleFileList, download, handleTree, selectDeptName, selectDeptNameByTree, getLastYearForDay } from "@/utils/ruoyi";
import Pagination from "@/components/Pagination";
import { handlePicturePathSingle } from "@/utils/ruoyi";
import EnterpriseTree from "@/views/components/enterpriseTree/enterpriseTree";
import baseForm from "@/views/components/baseForm/baseForm";
import scroll from 'vue-seamless-scroll'

import './jsmpeg.min.js'//自己下载的jsmpeg.min.js的路径
//点赞等使用的心型图标
import '@/assets/el-icon-third/iconfont.css';
import highQuery from "@/views/components/highQuery/highQuery";

// import JSMpegPlayer from 'vue-jsmpeg-player'

// Vue.use(JSMpegPlayer)

// 全局组件挂载
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
// 将自动注册所有组件为全局组件
import dataV from '@jiaminghi/data-view'

// 高德地图
import AmapVue from '@amap/amap-vue';
import AmapVueConfig from '@amap/amap-vue/lib/config';
AmapVueConfig.key = 'd426507848c8b932c6c6255893afc2ce';
Vue.use(AmapVue);

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts



// 列表滚动组件
Vue.use(scroll)

Vue.use(dataV)
// h5+模块
var onPlusReady = function (callback, context = this) {
  if (window.plus) {
    callback.call(context)
  } else {
    document.addEventListener('plusready', callback.bind(context))
  }
}
Vue.mixin({
  beforeCreate () {
    onPlusReady(() => {
      this.plusReady = true
    }, this)
  },
  methods: {
    onPlusReady: onPlusReady
  }
})


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getDictsAnon = getDictsAnon
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabelMultiArray = selectDictLabelMultiArray
Vue.prototype.handlePicturePath = handlePicturePath
Vue.prototype.handleFileList = handleFileList
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.selectDeptName = selectDeptName
Vue.prototype.selectDeptNameByTree = selectDeptNameByTree
Vue.prototype.handlePicturePathSingle = handlePicturePathSingle
Vue.prototype.getLastYearForDay = getLastYearForDay

Vue.prototype.msgSuccess = function (msg) {
  if (!msg) msg = "操作成功"
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('EnterpriseTree', EnterpriseTree)
Vue.component('baseForm', baseForm)
Vue.component('highQuery', highQuery)

Vue.use(permission)
Vue.use(Print);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  //全局事件总线 $bus
  beforeCreate () {
    Vue.prototype.$bus = this
  }
})
