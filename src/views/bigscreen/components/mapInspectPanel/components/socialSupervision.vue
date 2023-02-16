<template>
  <div>
    <div class="inspectPanelContent">
      <div class="box1">
        <div class="a1 content_module">
          <div class="content_module_title">公众评论</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="gzplConfig" style="height:218px;"/>
        </div>

      </div>
      <div class="box3">
        <div class="a1 content_module">
          <div class="content_module_title">公众投诉</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="gztsConfig" style="height:218px;"/>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import {list} from "@/api/complaint/complaint";
import { listComment} from "@/api/comment/comment";

export default {
  name: 'socialSupervision',
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
      complaintTypes: [],

      //公众评论相关
      gzplQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {}
      },
      gzplData: [],
      gzplTotal: 0,
      //公众评论配置
      gzplConfig: {},




      //公众投诉相关
      gztsQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {}
      },
      gztsData: [],
      gztsTotal: 0,
      //公众投诉配置
      gztsConfig: {},


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
      this.getGzplList();
      this.getGztsList();
      $('body').addClass("el-popup-parent--hidden");
    })
  },
  created() {
    this.getDicts("complaint_type").then(response => {
      this.complaintTypes = response.data;
    });
  },
  methods: {

    //公众评论相关
    getGzplList() {
      let that = this
      if (this.operationId) {
        this.gzplQueryParams.params.operationId = this.operationId
        listComment(this.gzplQueryParams).then(response => {
          this.gzplData = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.score)
            data.push(item.score1)
            data.push(item.score2)
            data.push(item.score3)
            that.gzplData.push(data)
          })
          that.gzplConfig =
            {
              header: ['环境评分', '菜品评分', '服务评分', '平均评分'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: this.gzplData,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 150, 150, 150],
              align: ['center', 'center', 'center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },


    //公众投诉相关
    getGztsList() {
      let that = this
      if (this.operationId) {
        this.gztsQueryParams.params.operationId = this.operationId
        list(this.gztsQueryParams).then(response => {
          this.gztsData = []
          response.rows.forEach(item => {
            let data = []
            data.push(that.complaintTypeFormat(item))
            data.push(item.status = 0 ? '待下发' : item.status = 1 ? '待回复' : item.status = 2 ? '已回复' : '---')
            data.push(item.showStatus = 'Y' ? '公开' : item.showStatus = 'N' ? '不公开' : '---')
            data.push(item.createTime)
            that.gztsData.push(data)
          })
          that.gztsConfig =
            {
              header: ['投诉类型', '状态', '是否公开', '投诉时间'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: this.gztsData,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 100, 150, 150],
              align: ['center', 'center', 'center', 'center','center'],
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
    complaintTypeFormat(row, column) {
      return this.selectDictLabel(this.complaintTypes, row.complaintType);
    },
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

.content {
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
