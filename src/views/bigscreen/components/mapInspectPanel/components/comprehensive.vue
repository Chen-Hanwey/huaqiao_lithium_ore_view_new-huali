<template>
  <div>
    <div class="inspectPanelContent">
      <div class="box1">
        <div class="a1 content_module">
          <div class="content_module_title">AI告警统计</div>
          <div>
            <left-one class="alert_bar" ref="alarm" :operationId="operationId"></left-one>
          </div>
        </div>
        <div class="a2 content_module">
          <div class="content_module_title">采购食材趋势</div>
          <div>
            <left-two ref="leftTwo" class="alert_bar"></left-two>
          </div>
        </div>
        <div class="a3 content_module">
          <div class="content_module_title">出库趋势</div>
          <div>
            <left-three ref="leftThree"  class="alert_bar"></left-three>
          </div>
        </div>
      </div>
      <div class="box2">
        <div class="box2_1">
          <div class="box2_1_1">
            <div class="a1 content_module">
              <div class="content_module_title">从业人员信息</div>
              <div>
                <right-top-one ref="rightTopOne"></right-top-one>
              </div>
            </div>
          </div>
          <div class="box2_1_2">
            <div class="a1 content_module">
              <div class="content_module_title">食材检测</div>
              <div>
                <right-top-two></right-top-two>
              </div>
            </div>
          </div>
          <div class="box2_1_3">
            <div class="a1 content_module">
              <div class="content_module_title">检测异常食品种类</div>
              <div>
                <right-top-three></right-top-three>
              </div>
            </div>
          </div>
        </div>
        <div style="clear:both"></div>
        <div class="box2_2">
          <div class="box2_2_1">
            <div class="a1 content_module">
              <div class="content_module_title">设备情况</div>
              <div style="height: 138px;width: 100%">
                <right-bottom-one :operation-id="operationId"></right-bottom-one>
              </div>
            </div>
          </div>
          <div class="box2_2_2">
            <div class="a1 content_module">
              <div class="content_module_title">评分趋势</div>
              <div style="height:138px;font-size: 12px">
                <right-bottom-two></right-bottom-two>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import leftOne from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/leftOne'
import LeftTwo from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/leftTwo'
import leftThree from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/leftThree'
import rightTopOne from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/rightTopOne'
import rightTopTwo from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/rightTopTwo'
import rightBottomOne from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/rightBottomOne'
import rightTopThree from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/rightTopThree'
import rightBottomTwo from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/rightBottomTwo'
import {grabAlarm, grabKitchenPerson, outOfStockTrends, purchasingTrends} from "@/api/bigScreen/inspectPanel";

export default {
  name: 'comprehensive',
  components: { leftOne, LeftTwo, leftThree, rightTopOne, rightTopTwo, rightBottomOne, rightBottomTwo, rightTopThree },
  props: {
    operationId: {
      default: '1'
    }
  },
  data() {
    return {}
  },
  watch: {

  },
  mounted() {
    this.$nextTick(function() {
      this.grabAlarmCount()
      this.grabKitchenPerson()
      this.purchasingTrends()
      this.outOfStockTrends()
      $('body').addClass("el-popup-parent--hidden");
    })

  },
  created() {
  },
  methods: {
    //AI告警信息
    grabAlarmCount(){
      grabAlarm(this.operationId).then(res=> {
        this.$refs.alarm.initChart(res.data)
      })
    },
    //从业人员信息
    grabKitchenPerson(){
      grabKitchenPerson(this.operationId).then(res=> {
        this.$refs.rightTopOne.initChart(res.data)
        this.$refs.rightTopOne.initChart2(res.data)
      })
    },
    //采购食材趋势
    purchasingTrends(){
      purchasingTrends(this.operationId).then(res=> {
        this.$refs.leftTwo.initChart(res.data)
      })
    },
    //出库趋势
    outOfStockTrends(){
      outOfStockTrends(this.operationId).then(res=> {
        this.$refs.leftThree.initChart(res.data)
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/main.scss';

.inspectPanelContent {
  overflow: hidden; /*清除浮动*/
  background-size: 100% 100%;
  color: #ffffff;
  width: 1250px;
}

.box1 {
  width: 40%;
  float: left;

  .a1 {
    height: 170px;
    border: 2px solid #005286;
  }

  .a2 {
    height: 171px;
    border: 2px solid #005286;
    margin-top: 8px;
  }

  .a3 {
    height: 171px;
    border: 2px solid #005286;
    margin-top: 8px;
  }
}

.box2 {
  width: calc(60% - 8px);;
  float: right;

  .box2_1 {
    width: 100%;

    .box2_1_1 {
      height: 349px;
      border: 2px solid #005286;
      width: calc(33.3% - 5px);;
      float: left;
      margin-right: 8px;
    }

    .box2_1_2 {
      height: 349px;
      border: 2px solid #005286;
      width: calc(33.3% - 5px);;
      float: left;
      margin-right: 8px;
    }

    .box2_1_3 {
      height: 349px;
      border: 2px solid #005286;
      width: calc(33.3% - 6px);;
      float: left;
    }
  }

  .box2_2 {
    width: 100%;
    margin-top: 8px;

    .box2_2_1 {
      height: 171px;
      border: 2px solid #005286;
      width: calc(50% - 4px);;
      float: left;
    }

    .box2_2_2 {
      height: 171px;
      border: 2px solid #005286;
      width: calc(50% - 4px);;
      float: right;
    }
  }
}

.alert_bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 5px
}
</style>
