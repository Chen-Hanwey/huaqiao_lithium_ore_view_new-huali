<template>
  <div class="group-box_left" style="margin-top: 18px">
    <div class="group-box-title">
      产量情况分析
    </div>
    <div class="group-box-content_bg"></div>
    <div class="group-box-content">
      <div class="tab-data-css">
        <div class="tab-data-title" :class="{'tab-data-title-selected':showDesc}" @click="changeBack(1)">
          日产量
        </div>
        <div class="tab-data-title2" :class="{'tab-data-title-selected':!showDesc}" @click="changeBack(2)">月产量
        </div>
      </div>
      <BarChart6 :chartData="chartData"></BarChart6>

    </div>
  </div>
</template>

<script>
import BarChart6 from "./components/BarChart6"
import { getSummonth, getSumday } from "@/api/project/production/production";
export default {
  name: "leftGroupTwo",
  components: { BarChart6 },
  data () {
    return {
      lastData: 1,
      showDesc: true,
      sumDay: {},
      summonth: {},
      chartData: {}
    }
  },
  created () {
    this.getSumdayData();
    this.getSummonthData();
  },
  methods: {
    changeBack (val) {
      if (this.lastData !== val) {
        this.lastData = val;
        this.showDesc = !this.showDesc;
        if (val === 1) {
          this.chartData = this.sumDay;
        } else {
          this.chartData = this.summonth;
        }
      }
    },
    getSumdayData () {
      getSumday().then(res => {
        this.sumDay = { xdata: res.data.date, ydata: res.data.sumProduction };
        this.chartData = this.sumDay;
      })
    },
    getSummonthData () {
      getSummonth().then(res => {
        this.summonth = { xdata: res.data.date, ydata: res.data.sumProduction, pdata: res.data.planProduction };
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styles/index";

.tab-data-css {
  display: flex;
  flex-direction: row;
  width: 20%;
  left: 75%;
  top: 5%;
  font-size: 14px;
  color: #00cfff;
  text-align: center;
  position: relative;

  .tab-data-title {
    height: 25px;
    width: 50px;
    line-height: 25px;
    cursor: pointer;
    border: 0.1vh solid #50a6a9;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #789eb7;
    letter-spacing: 0;
    text-align: center;
    font-weight: 400;
  }
  .tab-data-title-selected {
    background-color: #00324f;
    font-family: PingFangSC-Medium;
    font-size: 13px;
    color: #44dbf9 !important;
    letter-spacing: 0;
    text-align: center;
    font-weight: 500 !important;
  }
  .tab-data-title2 {
    height: 25px;
    width: 50px;
    line-height: 25px;
    cursor: pointer;
    border: 0.1vh solid #50a6a9;
    font-family: PingFangSC-Regular;
    font-size: 13px;
    color: #789eb7;
    letter-spacing: 0;
    text-align: center;
    font-weight: 400;
  }
}
</style>
