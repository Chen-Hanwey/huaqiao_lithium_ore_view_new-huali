<template>
  <div class="group-box">
    <div class="group-title">
      <a class="title">仓储合格率</a>
      <div class="right-text">
        <a :class="{active:rankType=='before'}" @click="changeRankType('before')">温度</a> / <a :class="{active:rankType=='after'}"  @click="changeRankType('after')">湿度</a>
      </div>
    </div>
    <div class="line-chart">
      <line-chart-one></line-chart-one>
    </div>
    <div class="group-title mt-10">
      <a class="title">消毒合格率</a>
    </div>
    <div class="line-chart">
      <line-chart-two :disinfectRate="disinfectRate"></line-chart-two>
    </div>
  </div>
</template>

<script>
import lineChartOne from "@/views/bigscreen/components/lineChartOne";
import lineChartTwo from "@/views/bigscreen/components/lineChartTwo";
export default {
  name: "leftGroupTwo",
  components:{lineChartOne,lineChartTwo},
  props: {
    disinfectRate: {
      type: Number,
      default: 80
    }
  },
  data(){
    return{
      rankType:'before',

    }
  },
  methods:{
    changeRankType(type){
      this.rankType=type
    }
  }
}
</script>

<style scoped lang="scss">
  .group-box{
    width: 100%;
    padding: 15px 20px;
    margin-top: 15px;
    height: 385px;
    background-image: url("../../../assets/images/bigscreen/group-6.svg");

    .group-title{
      height: 30px;
      border-bottom: 1px dashed #30747b;
      color: rgba(186, 184, 184, 0.7);
      line-height: 30px;
      background-color: transparent;
      font-size: 14px;
      .title{
        color: #04E7FE;
      }
      .right-text{
        float: right;
      }
      .active{
        color: #04E7FE;
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
    .line-chart{
      height: 140px;
    }
    .mt-10{
      margin-top: 10px;
    }
  }
</style>
