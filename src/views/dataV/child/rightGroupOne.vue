<template>
  <div class="group-box_right">
    <div class="group-box-title" @click="setCount">
      告警信息监控
    </div>
    <div class="group-box-content_bg"></div>
    <div class="group-box-content">
      <div class="right1_top">
        <div class="right1_top_c1">
          <div class="right1_top_font">{{alarm}}</div>
          <div class="right1_top_title">告警总数(起)</div>
        </div>
        <div class="right1_top_c2">
          <div class="right1_top_font">{{alarmCount}}</div>
          <div class="right1_top_title">待处理(起)</div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="right1_bottom">
        <div class="scrollBoard_bg"></div>
        <dv-scroll-board ref="scrollBoard1" :config="config1" @click="click" style="margin:20px auto 0;width:420px;height:220px;" />
      </div>
    </div>
  </div>
</template>

<script>
import { countAlarm, listAlarm } from "@/api/project/alarm/alarm";
import { alarmCount } from "@/api/bigScreen/dataV";
export default {
  name: "rightGroupOne",
  data () {
    return {
      dialogVisible: false,
      alarm: '21',//告警数量
      alarmCount: '12',//待处理告警数量
      tableData: [],//告警列表
      config1: {
      },
      flag: false
    }
  },
  mounted () {
    if (this.flag) {
      this.getAlarm();
      this.getAlarmCount();
    }
    this.listAlarmDP();
  },
  methods: {
    setCount () {
      if (this.flag) {
        this.alarm = 21,
          this.alarmCount = 12
        this.flag = false
      } else {
        this.getAlarm();
        this.getAlarmCount();
        this.flag = true
      }
    },
    click (data) {
      window.console.log(data.row[4])

      this.$emit("show-detail", data.row[4])
    },
    //获取告警数量
    getAlarm () {
      countAlarm({ pageNum: 1, pageSize: 20 }).then(res => {
        this.alarm = res.data
      })
    },
    getAlarmCount () {
      alarmCount().then(res => {
        this.alarmCount = res.data
      })
    },
    //获取告警列表
    listAlarmDP () {
      let that = this;
      listAlarm({ pageNum: 1, pageSize: 300 }).then(res => {
        let dataList = []
        res.rows.forEach(item => {
          window.console.log(item)
          let data = []
          data.push("<div class='item_im'></div>")
          data.push(item.typeName == null ? '--' : item.typeName)
          if (status == 0) {
            if (item.typeName == '超速告警') {
              if (item.speed < 15) {
                data.push("<font style='color:#fd992d'>待处理</font>")
              } else {
                data.push("<font style='color:#ec4e4e'>待处理</font>")
              }
            } else {
              data.push("<font style='color:#ec4e4e'>待处理</font>")
            }
          }
          if (status == 1 || status == 2) {
            data.push("<font style='color:#39F4A9'>已处理</font>")
          }
          data.push(item.curTime)
          data.push(item.id)
          dataList.push(data)
        })
        that.config1 =
        {
          header: ['', '事件类型', '事件状态', '发生时间'],
          headerBGC: '',
          oddRowBGC: '#0c1e2e',
          evenRowBGC: '',
          data: dataList,
          columnWidth: [40, 120, 90, 160],
          indexHeader: '序号',
          index: false,
          align: ['center', 'center', 'center', 'center'],
          waitTime: 3000
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styles/index";
.clear {
  clear: both;
}
.right1_top {
  margin: 20px auto 0;
  width: 424px;
  .right1_top_c1 {
    width: 203px;
    height: 89px;
    background: url("~@/views/dataV/assets/images/right1_t_bg.png") no-repeat;
    float: left;
  }
  .right1_top_c2 {
    width: 203px;
    height: 89px;
    background: url("~@/views/dataV/assets/images/right1_t_bg.png") no-repeat;
    float: right;
  }
  .right1_top_font {
    margin-top: 10px;
    height: 44px;
    line-height: 46px;
    width: 203px;
    font-size: 27px;
    color: #fd992d;
    text-align: center;
    font-weight: 600;
  }
  .right1_top_title {
    color: #cde4ff;
    font-size: 16px;
    width: 203px;
    text-align: center;
  }
}
/deep/ .dv-scroll-board .header {
  font-size: 14px !important;
  height: 48px;
  line-height: 48px;
  color: #6ab7f5;
}
/deep/ .dv-scroll-board .header .header-item {
  line-height: 48px !important;
}
/deep/ .dv-scroll-board .rows .row-item {
  font-size: 14px;
}
/deep/ .rows {
  color: #b8c9d2;
}
/deep/ .item_im {
  background: url("~@/views/dataV/assets/images/right1_sj.png") right center
    no-repeat;
  width: 100%;
  height: 100%;
}
.scrollBoard_bg {
  background: #000000;
  position: absolute;
  filter: alpha(Opacity=20);
  -moz-opacity: 0.2;
  opacity: 0.2;
  height: 236px;
  width: 424px;
  left: 50%;
  margin-left: -212px;
}
</style>
