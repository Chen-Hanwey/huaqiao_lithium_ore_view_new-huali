<template>
  <div class="group-box_left" style="margin-top: 18px">
    <div class="group-box-title">
      三维建模
    </div>
    <div class="group-box-content_bg"></div>
    <div class="group-box-content">
      <!-- <div class="left-3-data">

        <div class="left-3-data-item">
          <div class="left-3-data-item-info">
            <div>粉尘/可吸入颗粒</div>
            <div>(mg/m3)</div>
            <div class="data-item-info">19</div>
          </div>
          <div class="left-3-data-item-info">
            <div>噪音</div>
            <div>dB(A)</div>
            <div class="data-item-info">59</div>
          </div>
          <div class="left-3-data-item-info">
            <div>碳氧化物</div>
            <div>(%)</div>
            <div class="data-item-info">12</div>
          </div>

        </div>
        <div class="left-3-data-item-2">
          <div class="title-box-info"></div>
          <span class="title-box-span-info">未来一周天气情况</span></div>

        <div class="left-3-data-item-3">
          <div class="left-3-data-item-3-info" v-for="(item, index) in listWeatherList"
               :key="index">
            <div>{{item.date.slice(5)}}</div>
            <div class="img" :style="{'background': item.dayweather == '多云'?'url(' + duoyunImgUrl + ')'
      : item.dayweather == '雨'||item.dayweather == '大雨'||item.dayweather == '小雨'?'url(' + yuImgUrl + ')':item.dayweather == '阴'?'url(' + duoyunImgUrl + ')':'url(' + qingImgUrl + ')','background-repeat':'no-repeat',
      'background-size':'100%'
      }"></div>
            <div>{{item.dayweather}}</div>
            <div>{{item.daytemp}}℃</div>
          </div>
        </div>


      </div> -->


    </div>
  </div>
</template>

<script>

  import {listWeather} from "@/api/project/weather/weather";

  export default {
    name: "leftGroupThree",
    data() {
      return {
        qingImgUrl: require("../../dataV/assets/images/tianqi/qing.png"),
        duoyunImgUrl: require("../../dataV/assets/images/tianqi/duoyun.png"),
        yuImgUrl: require("../../dataV/assets/images/tianqi/yu.png"),
        listWeatherList: []
      }
    },
    mounted() {
      this.getWeather();
    },
    methods: {
      getWeather() {
        listWeather({pageNum: 1, pageSize: 7}).then(res => {
          this.listWeatherList = res.rows;
          this.listWeatherList.reverse()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/styles/index";

  .left-3-data {
    display: flex;
    flex-direction: column;
    padding: 16px;
    width: 100%;
    height: 100%;

    .left-3-data-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 45%;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;

      .left-3-data-item-info {
        display: flex;
        flex-direction: column;
        width: 30%;
        height: 100%;
        margin-left: 10px;

        .data-item-info {
          font-family: PingFangSC-Medium;
          font-size: 28px;
          color: #FFBA36;
          line-height: 60px;
          font-weight: 500;
          height: 80px;
          background-size: 100% 100%;
          background-image: url("../../dataV/assets/images/left-3-icon.png");
        }
      }
    }

    .left-3-data-item-2 {
      display: flex;
      flex-direction: row;
      margin-top: 10px;

      .title-box-info {
        width: 6px;
        height: 6px;
        left: 3%;
        top: 31%;
        position: relative;
        background-color: rgb(99, 172, 248);
      }

      .title-box-span-info {
        margin-left: 20px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgb(99, 172, 248);
        letter-spacing: 0px;
        font-weight: 500;
      }

    }

    .left-3-data-item-3 {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 30%;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: 0;
      text-align: center;
      font-weight: 400;

      .left-3-data-item-3-info {
        display: flex;
        flex-direction: column;
        width: 13%;
        height: 100%;
        margin-left: 5px;

        .img {
          margin-left: 18px;
          width: 20px;
          height: 15px;
          background-size: 100% auto;
          background-repeat: no-repeat;
      /*    background-image: url("../../dataV/assets/images/tianqi/duoyun.png");*/
        }


        div {
          margin-top: 10px;
        }
      }
    }
  }
</style>
