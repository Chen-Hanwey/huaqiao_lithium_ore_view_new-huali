<template>
  <div>
    <div class="inspectPanelContent">
      <div class="box1">
        <div class="a1 content_module">
          <div class="content_module_title">食安监督</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="sajdConfig" style="height:218px;"/>
        </div>
        <div class="a2 content_module">
          <div class="content_module_title">质量评分</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="zlpfConfig" style="height:218px;"/>
        </div>
      </div>
      <div class="box3">
        <div class="a1 content_module">
          <div class="content_module_title">信用评定</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="xypdConfig" style="height:218px;"/>
        </div>
        <div class="a2 content_module">
          <div class="content_module_title">食安指数</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="sazsConfig" style="height:218px;"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import { listHistory } from '@/api/check/history'
import { listScore } from '@/api/sazs/score'
import { listQualityScore } from '@/api/qualityScore/qualityScore'

export default {
  name: 'regulatoryAssessment',
  props: {
    operationId: {
      default: '1'
    },
    enterpriseId: {
      default: '1'
    }
  },
  data() {
    return {
      tableHeight: 235,
      rectificationStatusDicList: [],
      jdjcTypeDicList: [],

      //食安监督相关
      sajdQueryParams: {
        pageNum: 1,
        pageSize: 10,
        examId: 4,
        params: {}
      },
      sajdData: [],
      sajdTotal: 0,
      //食安监督配置
      sajdConfig: {},

      /*      xypdConfig: {
              header: ['检查时间', '检查得分', '整改情况','信用等级'],
              headerBGC: '#266e93',
              oddRowBGC: '#003b51',
              evenRowBGC: '#0A2732',
              data: [],
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 180, 180, 180,180],
              align: ['center', 'center', 'center', 'center']
            },*/

      //信用评定相关
      xypdQueryParams: {
        pageNum: 1,
        pageSize: 20,
        examId: 2,
        params: {}
      },
      xypdData: [],
      xypdTotal: 0,
      xypdConfig: {},

      //质量评分相关
      zlpfQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {}
      },
      zlpfData: [],
      zlpfTotal: 0,
      //质量评分配置
      zlpfConfig: {},

      //食安指数相关
      sazsQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {}
      },
      sazsData: [],
      sazsTotal: 0,
      //食安指数配置
      sazsConfig: {},
    }
  },
  watch: {
    operationId: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          // this.getSzjdList();
        }
      }
    },
    enterpriseId: {
      handler: function(newValue, oldValue) {
        if (newValue) {

        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getSzjdList();
      this.getXypdList();
      this.getZlpfList();
      this.getSazsList();
      $('body').addClass("el-popup-parent--hidden");
    })
  },
  created() {
    //食安监督相关
    this.getDicts('rectification_status').then(response => {
      this.rectificationStatusDicList = response.data
    })
    this.getDicts('jdjc_type').then(response => {
      this.jdjcTypeDicList = response.data
    })
  },
  methods: {

    //食安监督相关
    getSzjdList() {
      let that = this
      if (this.operationId) {
        this.sajdQueryParams.examId = 4
        this.sajdQueryParams.params.operationId = this.operationId
        listHistory(this.sajdQueryParams).then(response => {
          this.sajdData = []
          response.rows.forEach(item => {
            let data = []
            data.push(that.jdjcTypeFormat(item))
            data.push(that.examTimeFormat(item.submitTime))
            data.push(item.myPoint)
            data.push(that.rectificationStatusFormat(item))
            that.sajdData.push(data)
          })
          that.sajdConfig =
            {
              header: ['检查类型', '检查时间', '检查得分', '整改情况'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: this.sajdData,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 180, 250, 180, 180],
              align: ['center', 'center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },
    //信用评定相关
    getXypdList() {
      let that = this
      if (this.enterpriseId) {
        this.xypdQueryParams.examId = 2
        this.xypdQueryParams.params.enterpriseId = this.enterpriseId
        listHistory(this.xypdQueryParams).then(response => {
          this.xypdData = [];
          response.rows.forEach(item => {
            let data = []
            data.push(that.examTimeFormat(item.submitTime))
            data.push(item.myPoint)
            data.push(that.rectificationStatusFormat(item))
            data.push(item.myPoint < 55 ? '--' : item.myPoint < 61 ? 'C' : item.myPoint < 66 ? 'CC' : item.myPoint < 71 ? 'CCC' :
              item.myPoint < 76 ? 'B' : item.myPoint < 81 ? 'BB' : item.myPoint < 86 ? 'BBB' : item.myPoint < 91 ? 'A' : item.myPoint < 96 ? 'AA' : 'AAA' )
            that.xypdData.push(data)
          })
          that.xypdConfig =
            {
              header: ['检查时间','检查得分', '整改情况', '信用等级'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: this.xypdData,
              indexHeader: '序号',
              index: true,
              columnWidth: [60,250, 180, 250, 180],
              align: ['center','center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },

    //质量评分相关
    getZlpfList() {
      let that = this
      if (this.enterpriseId) {
        this.zlpfQueryParams.params.enterpriseId = this.enterpriseId
        listQualityScore(this.zlpfQueryParams).then(response => {
          this.zlpfData = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.greenDesign)
            data.push(item.securityGovernance)
            data.push(item.energyGovernance)
            data.push(item.envirProtect)
            data.push(item.healthyGovernance)
            data.push(item.greenPublicity)
            data.push(item.foodTaste)
            data.push(item.foodPrice)
            that.zlpfData.push(data)
          })
          that.zlpfConfig =
            {
              header: ['绿色设计', '安全治理', '节能治理', '环境爱护', '健康治理', '绿色宣传', '食品味道', '食品价格'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: this.zlpfData,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 90, 90, 90, 90, 90, 90, 90, 90],
              align: ['center', 'center', 'center', 'center','center'],
              waitTime: 3000
            }
        })
      }
    },

    //食安指数相关
    getSazsList() {
      let that = this
      if (this.operationId) {
        this.sazsQueryParams.params.operationId = this.operationId
        listScore(this.sazsQueryParams).then(response => {
          this.sazsData = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.scoreDate)
            data.push(item.score)
            that.sazsData.push(data)
          })
          that.sazsConfig =
            {
              header: ['归属月', '得分'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: this.sazsData,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 300, 300],
              align: ['center', 'center'],
              waitTime: 3000
            }
        })
      }
    },
    // 考试时间范围格式处理
    examTimeFormat(dateTime) {
      let time = moment(new Date(dateTime)).format('YYYY-MM-DD HH:mm:ss')
      return time
    },
    // 整改状态字典翻译
    rectificationStatusFormat(row, column) {
      return this.selectDictLabel(this.rectificationStatusDicList, row.rectificationStatus)
    },
    // 监督检查类型字典翻译
    jdjcTypeFormat(row, column) {
      return this.selectDictLabel(this.jdjcTypeDicList, row.jdjcType)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/main.scss';

.inspectPanelContent {
  overflow: hidden; /*清除浮动*/
  background-size: 100% 100%;
  color: #67E0F1;
  width: 1250px;
}

.box1 {
  width: calc(50% - 4px);
  float: left;
}

.box1 .a1 {
  height: 260px;
  border: 2px solid #005286;

}

.box1 .a2 {
  height: 260px;
  border: 2px solid #005286;
  margin-top: 8px;
}

.box3 {
  width: calc(50% - 4px);
  float: right;
}

.box3 .a1 {
  height: 260px;
  border: 2px solid #005286;
}

.box3 .a2 {
  height: 260px;
  border: 2px solid #005286;
  margin-top: 8px;
}

.banner-container {
  padding: 0.5rem 0;
  text-align: center;
  margin-top: 165px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;
  overflow-y: hidden;

  .box {
    padding: 0 0.32rem;

    .img {
      width: 10.25rem;
      height: 8.06rem;
    }

    .label {
      font-size: 0.9rem;
      text-align: center;
      margin-top: 5px;
      color: #ffffff;
    }
  }
}


</style>
