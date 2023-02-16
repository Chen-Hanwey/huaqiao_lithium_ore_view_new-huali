<template>
  <div class="group-box_right" style="margin-top: 18px">
    <div class="group-box-title">
      <!-- 实时视频监控 -->
      环境监测
    </div>
    <div class="group-box-content_bg"></div>
    <div class="group-box-content">
      <!-- <div class="play-video-box">
        <div class="play-item-video">
          <div style="height: 85%;width: 100%" id="div33" ref="div33">
            <haikan type="live" index="realTime" :code="code" :zoom="zoom" />
          </div>
          <div class="play-itme-box">
            <div class="title-info">{{creameName}}
            </div>
          </div>
        </div>
      </div> -->

      <div class="right-3-data">

        <div class="right-3-data-item">
          <div class="right-3-data-item-info">
            <div>粉尘/可吸入颗粒</div>
            <div>(mg/m3)</div>
            <div class="data-item-info">19</div>
          </div>
          <div class="right-3-data-item-info">
            <div>噪音</div>
            <div>dB(A)</div>
            <div class="data-item-info">59</div>
          </div>
          <div class="right-3-data-item-info">
            <div>碳氧化物</div>
            <div>(%)</div>
            <div class="data-item-info">12</div>
          </div>

        </div>
        <div class="right-3-data-item-2">
          <div class="title-box-info"></div>
          <span class="title-box-span-info">未来一周天气情况</span></div>

        <div class="right-3-data-item-3">
          <div class="right-3-data-item-3-info" v-for="(item, index) in listWeatherList"
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


</div>

    </div>
  </div>
</template>

<script>

// import { getPlayStream } from "@/api/project/ga/camera";
// import videoss from "./video";
import {listWeather} from "@/api/project/weather/weather";
// import haikan from "./haikan"

export default {
  // name: "rightGroupThree",
  // props: ["playUrl", "zoom"],
  // components: { videoss, haikan },
  name: "leftGroupThree",
  data () {
    return {
      // creameName: '矿区入口',
      // souceUrl: "",
      // code: '',
      qingImgUrl: require("../../dataV/assets/images/tianqi/qing.png"),
      duoyunImgUrl: require("../../dataV/assets/images/tianqi/duoyun.png"),
      yuImgUrl: require("../../dataV/assets/images/tianqi/yu.png"),
      listWeatherList: []
    }
  },
  mounted () {
    // this.playVedio();
    this.getWeather();
  },
  // watch: {
  //   playUrl: {
  //     deep: true,
  //     handler (val) {
  //       // 开源浏览器
  //       this.souceUrl = val.url

  //       this.code = val.code
  //       this.creameName = val.name
  //     }
  //   }
  // },
  methods: {
    // playVedio () {
    //   getPlayStream("a1f6e533498c47ba8d79a3c6c608f157").then(res => {
    //     console.log(res)
    //     this.souceUrl = res.msg
    //   });
    // }
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

.right-3-data {
    display: flex;
    flex-direction: column;
    padding: 16px;
    width: 100%;
    height: 100%;

    .right-3-data-item {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 45%;
      font-size: 14px;
      color: #FFFFFF;
      text-align: center;

      .right-3-data-item-info {
        display: flex;
        flex-direction: column;
        width: 30%;
        height: 100%;
        margin-right: 10px;

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

    .right-3-data-item-2 {
      display: flex;
      flex-direction: row;
      margin-top: 10px;

      .title-box-info {
        width: 6px;
        height: 6px;
        right: 3%;
        top: 31%;
        position: relative;
        background-color: rgb(99, 172, 248);
      }

      .title-box-span-info {
        margin-right: 20px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: rgb(99, 172, 248);
        letter-spacing: 0px;
        font-weight: 500;
      }

    }

    .right-3-data-item-3 {
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

      .right-3-data-item-3-info {
        display: flex;
        flex-direction: column;
        width: 13%;
        height: 100%;
        margin-right: 5px;

        .img {
          margin-right: 18px;
          width: 20px;
          height: 15px;
          background-size: 100% auto;
          background-repeat: no-repeat;
        }
        div {
          margin-top: 10px;
        }
      }
    }
  }
</style>
