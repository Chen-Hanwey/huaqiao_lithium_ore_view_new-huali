<template>
  <div class="group-box">
    <div class="left">
      <div class="name">
        云厨总评分
      </div>
      <div class="month">
        <div class="thisName">
          <a class="react"></a>本月
        </div>
        <div class="thisValue">{{scoreAfter}}</div>
        <div class="lastName"><a class="react"></a>上月</div>
        <div class="lastValue">{{scoreBefore}}</div>
      </div>
      <div class="chart-radar">
        <radar-chart-one ref="radarChartOne"></radar-chart-one>
      </div>
    </div>
    <div class="right">
      <div class="group-title">评分趋势 /月</div>
      <div class="line-box">
        <line-chart-three ref="barChartThree"></line-chart-three>
      </div>
    </div>
  </div>
</template>

<script>
import radarChartOne from '@/views/bigscreen/components/radarChartOne'
import lineChartThree from '@/views/bigscreen/components/lineChartThree'
import { getQualityScoreTotal, getQualityScoreTrend } from '@/api/bigScreen/bigScreen'

export default {
  name: 'centerGroupTwo',
  components: { radarChartOne, lineChartThree },
  data() {
    return {
      scoreAfter: 0,
      scoreBefore: 0
    }
  },
  mounted() {
    this.getQualityScoreTotal();
    this.$refs.barChartThree.getQualityScoreTrend();
    this.$refs.radarChartOne.getQualityScoreGroup()
  },
  methods: {
    /**
     * 云厨总评分
     */
    getQualityScoreTotal() {
      let that = this;
      getQualityScoreTotal().then(res => {
        that.scoreAfter = res.data.scoreAfter;
        that.scoreBefore = res.data.scoreBefore;
      });
    },
  }
}
</script>

<style scoped lang="scss">
.group-box {
  width: 100%;
  margin-top: 15px;
  height: 260px;

  .left {
    width: 405px;
    height: 100%;
    float: left;
    padding: 20px;
    background-image: url("../../../assets/images/bigscreen/group-3.svg");

    .name {
      width: 40px;
      font-size: 24px;
      color: rgb(78, 193, 229);
      float: left;
      background-color: rgb(19, 82, 132);
      height: 100%;
      padding: 30px 5px;
      text-align: center;
      border-radius: 5px 0 0 5px;

      line-height: 30px;
    }

    .month {
      width: 75px;
      height: 100%;
      margin-left: 10px;
      float: left;

      .thisName {
        height: 40px;
        color: rgb(78, 193, 229);
        line-height: 40px;
        font-size: 12px;
        background-color: rgb(19, 82, 132);
        border-top-right-radius: 5px;

        .react {
          height: 3px;
          width: 20px;
          margin: 0 10px;
          display: inline-block;
          background: linear-gradient(to right, #c25ed9, #4c3dd0);
        }
      }

      .thisValue {
        height: 80px;
        line-height: 80px;
        font-size: 32px;
        color: #5ae294;
        text-align: center;
        background-color: #10468b;

      }

      .lastName {
        margin-top: 5px;
        height: 40px;
        color: rgb(78, 193, 229);
        line-height: 40px;
        font-size: 12px;
        background-color: rgb(19, 82, 132);

        .react {
          height: 3px;
          width: 20px;
          margin: 0 10px;
          display: inline-block;
          background: linear-gradient(to right, #fffb00, #1a9038);
        }
      }

      .lastValue {
        background-color: #10468b;
        height: 55px;
        line-height: 55px;
        font-size: 28px;
        color: #CDAF5E;
        text-align: center;
        border-bottom-right-radius: 5px;
      }
    }

    .chart-radar {
      height: 100%;
      float: left;
      width: calc(100% - 125px);
    }
  }

  .right {
    background-image: url("../../../assets/images/bigscreen/group-4.svg");

    width: calc(100% - 415px);
    height: 100%;
    float: left;
    margin-left: 10px;
    padding: 10px 20px;

    .line-box {
      height: calc(100% - 32px);
      width: 100%;
    }
  }

  .group-title {
    height: 30px;
    border-bottom: 1px dashed #30747b;
    color: #04E7FE;
    line-height: 30px;
    background-color: transparent;
    font-size: 14px;

    .right-txt {
      float: right;
    }
  }

  .group-title::before {
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
