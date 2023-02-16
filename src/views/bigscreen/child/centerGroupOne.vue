<template>
  <div class="group-box">
    <div class="map-box">
      <div class="top-box-1" style="padding-left: 6px">
        <div class="total-num">
          <div class="total-num-box">
            <img src="../../../assets/images/bigscreen/icon/菜单.png" width="22" height="22"/> <span class="name">总数：</span><span
            class="num">{{sumNum}}</span>
          </div>
        </div>
        <span style="color:#ffffff">{{ day }}&nbsp;&nbsp;&nbsp;&nbsp;{{ week }}&nbsp;&nbsp;&nbsp;&nbsp;管理单位：{{ dept }}</span>
      </div>
      <div class="top-box-2" style="padding-left: 6px">
        <div class="item"><img src="../../../assets/images/bigscreen/icon/学校.png" width="22" height="22"/>学校：<span class="num">{{schoolNum}}</span></div>
        <div class="item"><img src="../../../assets/images/bigscreen/icon/企业门户.png" width="22" height="22"/>机关 / 企业：<span class="num">{{jiguanNum}}</span></div>
        <div class="item"><img src="../../../assets/images/bigscreen/icon/养老.png" width="22" height="22"/>养老机构：<span class="num">{{yanglaoNum}}</span></div>
        <div class="item"><img src="../../../assets/images/bigscreen/icon/睡觉.png" width="22" height="22"/>酒店：<span class="num">{{hotelNum}}</span></div>
        <div class="item"><img src="../../../assets/images/bigscreen/icon/餐馆.png" width="22" height="22"/>餐馆：<span class="num">{{canguanNum}}</span></div>
        <div class="item"><img src="../../../assets/images/bigscreen/icon/厨房.png" width="22" height="22"/>中央厨房：<span class="num">{{cufangNum}}</span></div>

      </div>
      <!--      <w-map></w-map>-->
      <my-amap @showOperationDetail="showOperationDetail" ></my-amap>
      <div class="map-legend" v-show="videoListShow">
        <div class="title">{{ schoolName }}</div>
        <div class="video-list">
          <div @click="playVideo(it.name,it.id)" class="item" v-for="it in videoList"><img
            src="../../../assets/images/bigscreen/play.png">{{ it.name }}
          </div>

        </div>


      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { getSceneNum } from "@/api/bigScreen/bigScreen";
// import wMap from '../child/map'
import myAmap from '../child/amap'

export default {
  name: "centerGroupOne",
  components: {myAmap},
  props: {
    deptz: {}
  },
  data() {
    return {
      sumNum: 0,
      schoolNum: 0,
      jiguanNum: 0,
      yanglaoNum: 0,
      hotelNum: 0,
      canguanNum: 0,
      cufangNum: 0,
      day: '',
      week: '',
      dept: '市场监督管理局',
      videoListShow: false,
      schoolName: 'xx学校',
      videoName: '',
      dialogVisible: false,
      videoList: [],
      player: null,
      videoSuccess: true,
      videoErrorInfo: '',
      video_addr: ''
    }
  },
  watch:{
    deptz: {
      handler: function(newValue, oldValue) {
        console.log('-------newValue---------'+newValue)
        if (newValue) {
          this.dept = newValue
          
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getDay();
    this.getWeek()
    this.getSceneNum();
    // this.getVideoList();
    // 实例化播放器
  },
  methods: {
    //弹窗显示巡查看板
    showOperationDetail(id,enterpriseId){
      this.$emit('showOperationDetail',id,enterpriseId)
    },
    /**
     * 场景数
     * @returns {Promise<void>}
     */
    async getSceneNum() {
      let that = this;
      await getSceneNum().then(res => {
        res.data.forEach(function (item) {
          if(item.name==='学校'){
              that.schoolNum = item.num;
          }else if(item.name==='机关/企业'){
            that.jiguanNum = item.num;
          }else if(item.name==='养老机构'){
            that.yanglaoNum = item.num;
          }else if(item.name==='酒店'){
            that.hotelNum = item.num;
          }else if(item.name==='餐馆'){
            that.canguanNum = item.num;
          }else if(item.name==='中央厨房'){
            that.cufangNum = item.num;
          }
          that.sumNum += item.num;
        })
      })
    },
    getVideoList() {
      this.videoList = [];
      axios.get("http://10.110.63.23:18085/gb28181/device/deviceList").then(res => {
        //获取你需要用到的数据
        if (res && res.data) {
          res.data.forEach(item => {
            if (item.name != '') {
              this.videoList.push({name: item.name, id: item.deviceid})
            }
          })
        }
      }).catch(function (error) {
        console.log(error);
      })
    },

    showVideoList(params) {
      debugger
      this.schoolName = params.name || name;
      this.videoListShow = true;
    },
    playVideo(name, id) {
      console.log(name)
      console.log(id)
      debugger
      if (this.player) {
        this.player.destroy(this.video_addr)
        this.player = null;
      }
      this.videoName = name;
      this.dialogVisible = true;
      let tag = this.getTag();
      let that = this;
      axios.get("http://10.110.63.23:18085/gb28181/startPlay", {
        params: {
          deviceId: id,
          tag: tag
        }
      }).then(res => {
        //获取你需要用到的数据
        console.log(res)
        if (res.data.code == 0) {
          this.videoSuccess = true;
          console.log(res.data.hls)
          that.video_addr = res.data.http_flv
          that.player = new WasmPlayer(that.video_addr, 'Player', this.callbackfun)
          that.player.play(that.video_addr, 1)
          // that.player.play(res.data.hls, 1)

        } else {
          this.videoSuccess = false;
          this.videoErrorInfo = res.data.message;
        }
      })
    },
    callbackfun(e) {

      // console.log('callbackfun', e);
    },
    getTag() {
      let num = '';
      for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10);
      }
      return num;
    },
    handleClose() {
      this.dialogVisible = false;
      if (this.player) {
        this.player.destroy(this.video_addr)
        this.player = null;
      }
    },
    getDay() {
      let date = new Date();
      let seperator1 = "/";
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      this.day = year + seperator1 + month + seperator1 + strDate;

    },
    getWeek() {
      let tempDate = new Date();

      let days = tempDate.getDay();
      let week;

      switch (days) {
        case 1:
          week = '星期一';
          break;
        case 2:
          week = '星期二';
          break;
        case 3:
          week = '星期三';
          break;
        case 4:
          week = '星期四';
          break;
        case 5:
          week = '星期五';
          break;
        case 6:
          week = '星期六';
          break;
        case 0:
          week = '星期日';
          break;
      }
      this.week = week;
    }
  }
}
</script>

<style scoped lang="scss">
.group-box {
  width: 100%;
  height: 660px;

  .top-box-1 {
    position: absolute;
    z-index: 999;
    left: 0;
    top: 10px;
    height: 45px;
    line-height: 45px;
    font-size: 16px;

    .total-num {
      float: left;
      height: 45px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      background:  rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      line-height: 42px;
      margin-right:16px;
      .total-num-box {
        border-radius: 5px;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        img {
          position: relative;
          top: 3px;
        }

        .name {
          color: #fff;
        }


      }


    }

    a {
      margin-left: 10px;
      float: right;
      font-size: 16px;
    }
  }
  .num {
    font-size: 20px;
    color: #04E7FE;
    font-weight: bolder;

  }
  .top-box-2 {
    position: absolute;
    top: 65px;
    left: 0;
    z-index: 999;
    //margin-top: 10px;
    height: 38px;
    line-height: 38px;

    .item {
      margin-right: 5px;
      line-height: 38px;
      float: left;
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.1);
      background:  rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      padding: 0 10px;

      img {
        height: 22px;
        width: 22px;
        position: relative;
        top: 5px;
        margin-right: 5px;
      }

      a {
        color: #04E7FE;
        font-size: 20px;
        font-weight: bolder;
      }
    }
  }

  .map-box {
    width: 100%;
    height: 100%;
    //height: calc(100%);
    position: relative;
    border: 1px solid rgba(255, 255, 255, .1);
    box-shadow: 0px 0px 10px #EFEFEF inset;
    border-radius: 5px;
    overflow: hidden;

    .map-legend {
      position: absolute;
      left: 0;
      top: 180px;
      width: 220px;

      overflow-y: visible;
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 5px;

      .title {
        color: #4ec1e5;
        background-color: #135284;
        height: 35px;
        line-height: 35px;
        text-align: center;
      }

      .video-list {
        max-height: 340px;
        overflow-y: auto;

        .item {
          line-height: 35px;
          color: #ffffff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          padding-left: 20px;
          cursor: pointer;

          img {
            position: relative;
            top: 5px;
            margin-right: 5px;
          }
        }

        .item:hover {
          background-color: rgba(0, 0, 0, .1);
          color: #00b7ee;
        }
      }


    }
  }
}

#Player {
  width: 750px;
  height: 420px
}

.video-error {
  width: 750px;
  height: 420px;
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  line-height: 420px;
}
</style>
<style lang="scss">
.map-legend {
  ::-webkit-scrollbar {
    width: 4px;
    height: 2px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0px;
    -webkit-box-shadow: inset 0 0 6px rgba(177, 21, 21, 0.3);
    background-color: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
    border-radius: 0px;
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
