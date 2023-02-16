<template>
  <div class="group-box">
    <div class="flood-box">
      <div class="group-title">
        全年食材检测情况
      </div>
      <div class="flood-bar">
        <bar-chart-two ref="barChartTwo"></bar-chart-two>
      </div>
    </div>
    <div class="chart-group">
      <div class="pie-chart-item">
        <div class="group-title">
          检测异常食品种类<a class="right-text">/次数</a>
        </div>
        <div class="pie-chart">
          <pie-chart-one></pie-chart-one>
        </div>
      </div>
      <div class="pie-chart-item">
        <div class="group-title">
          检测异常项目<a class="right-text">/次数</a>
        </div>
        <div class="pie-chart">
          <pie-chart-two></pie-chart-two>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import barChartTwo from "@/views/bigscreen/components/barChartTwo";
import pieChartOne from "@/views/bigscreen/components/pieChartOne";
import pieChartTwo from "@/views/bigscreen/components/pieChartTwo";
import { foodAllYearCheck } from "@/api/bigScreen/bigScreen";
export default {
  name: "rightGroupOne",
  components: {barChartTwo,pieChartOne,pieChartTwo},
  data(){
    return {}
  },
  mounted() {
    this.foodAllYearCheck();
  },
  methods: {
    /**
     * 全年食材检测情况
     * @returns {Promise<void>}
     */
     foodAllYearCheck() {
      let that = this;
       foodAllYearCheck().then(res => {
          that.$refs.barChartTwo.initChart(res.data)
      })
    }

  }
}
</script>

<style scoped lang="scss">
.group-box {
  width: 100%;
  height: 345px;
  padding: 20px;
  background-image: url("../../../assets/images/bigscreen/group-5.svg");

  .flood-box{
    height: 160px;
    position: relative;
    .flood-bar{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .chart-group{
    height: calc(100% - 170px);
    margin-top: 10px;
    display: flex;
    .pie-chart-item{
      flex: 1;
      .pie-chart{
        height: calc(100% - 22px);
      }
    }
    .pie-chart-item:last-child{
      margin-left: 10px;
    }
  }

  .group-title{
    height: 20px;
    border-bottom: 1px dashed #30747b;
    color: #04E7FE;
    line-height: 20px;
    background-color: transparent;
    font-size: 14px;
    .right-text{
      color: #12bacb;
      margin-left: 10px;
    }
  }
  .group-title::before{
    display: inline-block;
    content: "";
    width: 0px;
    height: 0px;
    border: 6px solid transparent;
    border-left-color: #04E7FE;
    position: relative;
    top: 0px;

  }
}

</style>
