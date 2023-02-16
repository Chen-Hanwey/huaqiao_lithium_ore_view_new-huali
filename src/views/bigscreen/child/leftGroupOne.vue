<template>
  <div class="group-box">
    <div class="total-num">
      <div class="total-num-item">
        <div class="title-box first">
          <p class="name">监管总数</p>
          <p class="unit">（次）</p>
        </div>
        <div class="num-box color-green">
          {{ aggregateData.supervisionNum }}
        </div>

      </div>
      <div class="total-num-item">
        <div class="title-box">
          <p class="name">监管频次</p>
          <p class="unit">（次/单位）</p>
        </div>
        <div class="num-box color-white">
          {{ aggregateData.supervisionFrequency }}
        </div>
      </div>
      <div class="total-num-item ">
        <div class="title-box last">
          <p class="name">预警纠偏</p>
          <p class="unit">（次）</p>
        </div>
        <div class="num-box color-white">
          {{ aggregateData.missNum }}
        </div>
      </div>
    </div>
    <div class="rate-group">
      <div class="rate-box">
        <div class="name first">健康证合格率</div>
        <div class="num color-green">
<!--          {{healthRate}}-->
          {{aggregateData.healthPassRate}}
          <a class="unit">%</a></div>
      </div>
      <div class="rate-box">
        <div class="name ">每日晨检完成率</div>
        <div class="num color-green last">
<!--          {{morningCheck}}-->
          {{aggregateData.morningRate}}
          <a class="unit">%</a></div>
      </div>

    </div>
    <div class="group-title">
      预警类型频次排行
      <a class="right-txt color-green">前五</a>
    </div>
    <div class="barChart">
      <bar-chart-one :miss-data-list="[...aggregateData.missDataList].reverse()" :miss-type-list="aggregateData.missTypeList"></bar-chart-one>
    </div>
  </div>
</template>

<script>
import barChartOne from "@/views/bigscreen/components/barChartOne";
import {getHealthState,queryMorningCheck} from "@/api/bigScreen/bigScreen";

export default {
  name: "leftGroupOne",
  components:{barChartOne},
  props: {
    aggregateData: {
      type: Object
    },
  },
  data(){
    return {
        healthRate: '',
        morningCheck: 0
    }
  },
  mounted() {
  },
  methods:{
  }
}
</script>

<style scoped lang="scss">
  .group-box{
    width: 100%;
    height: 390px;
    padding: 20px;

    background-image: url("../../../assets/images/bigscreen/group-1.svg");
    .total-num{
      height: 110px;
      width: 100%;
      display: flex;
      .total-num-item{
        flex: 1;
        .title-box{
          background-color: rgba(16, 103, 159, 0.6);
          height: 45px;
          text-align: center;
          .name{
            color: #04E7FE;
            font-size: 14px;
            line-height: 24px;
          }
          .unit{
            color: rgba(255,255,255,0.5);
            font-size: 12px;
          }
          p{
            margin: 0;
          }
        }
        .num-box{
          font-size: 40px;
          text-align: center;
          line-height: 60px;
          background-color: #0d4f89;
        }
      }
      .total-num-item:nth-child(2){
        margin: 0 10px;
      }
      .first{
        border-top-left-radius: 10px;
      }
      .last{
        border-top-right-radius: 10px;
      }
    }
    .rate-group{
      margin: 10px 0;
      height: 30px;
      line-height: 30px;
      display: flex;
      .rate-box{
        flex: 1;
        .name{
          float: left;
          background-color: rgba(16, 103, 159, 0.6);
          color: #04E7FE;
          font-size: 14px;
          height: 100%;
          width: 105px;
          text-align: center;
        }
        .num{
          float: left;
          height: 100%;
          width: calc(100% - 105px);
          background-color: #0d4f89;
          font-size: 20px;
          text-align: center;
          .unit{
            font-size: 16px;
          }
        }
        .first{
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        .last{
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
      .rate-box:last-child{
        margin-left: 10px;
      }
    }
    .group-title{
      height: 30px;
      border-bottom: 1px dashed #30747b;
      color: #04E7FE;
      line-height: 30px;
      background-color: transparent;
      font-size: 14px;
      .right-txt{
        float: right;
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
    .barChart{
      height: 170px;
      width: 100%;
    }
  }

</style>
