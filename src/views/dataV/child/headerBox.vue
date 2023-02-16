<template>
  <div class="header-box">
    <div class="logoCss"></div>
    <div class="da_title">
      <div class="da_logo"></div>
      <div>花锂矿业5G+智慧矿山综合管控云平台</div>
    </div>
    <!-- <i class="el-icon-rank fullScreen" @click="myScreen()"></i> -->
    <div class="day1">{{day1}}&nbsp;{{day2}}</div>
    <div class="day3">{{day3}}</div>
  </div>
</template>

<script>
export default {
  name: "headerBox",
  data () {
    return {
      day1: '',//时间1
      day2: '',//时间2
      day3: '',//时间3
      timer: null
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null;
    }
  },
  mounted () {
    this.getDay();
    let that = this;
    this.timer = window.setInterval(function () {
      that.getDay()
    }, 1000);
  },
  methods: {
    myScreen () {
      this.$emit('screen')
    },
    getDay () {
      let myDate = new Date();
      let year = myDate.getFullYear();//获取年
      let month = myDate.getMonth() + 1;//获取月，默认从0开始，所以要加一
      let date = myDate.getDate();//获取日
      let hours = myDate.getHours();//获取小时
      let minutes = myDate.getMinutes();//获取分
      let seconds = myDate.getSeconds();//获取秒
      let weekend = myDate.getDay(); //获取星期几，这里获得到的是数字1-7，所以我下面自己new了一个数组把获取到的数字当下标
      let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
      this.day3 = weeks[weekend]//这样就是显示的星期x了//这些if判断是在小于10的时候前面自动补0
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      this.day1 = year + '.' + month + '.' + date
      this.day2 = hours + ':' + minutes + ':' + seconds
    },


  }
}
</script>

<style scoped lang="scss">
.header-box {
  width: 100%;
  height: 118px;
  background: url("../assets/images/head_bg.png") center center no-repeat;
  position: relative;
  color: #ffffff;
  font-size: 18px;
  .logoCss {
    width: 18%;
    height: 58px;
    position: absolute;
    background: url("../assets/images/bigLog.png") center center no-repeat;
  }
  .fullScreen {
    color: #ffffff;
    font-size: 26px;
    position: absolute;
    right: 26px;
    top: 4px;
    cursor: pointer;
    z-index: 2;
  }
  .day3 {
    position: absolute;
    z-index: 2;
    top: 7px;
    right: 60px;
  }
  .da_title {
    position: absolute;
    z-index: 2;
    width: 774px;
    left: 42%;
    margin-left: -238px;
    font-size: 36px;
    font-weight: bold;
    padding-top: 30px;
    background: linear-gradient(to bottom, #ffffff, #7fc9fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 4px;
  }
  .da_logo {
    width: 67px;
    height: 46px;
    background: url("~@/views/dataV/assets/images/logo_jb.png") no-repeat;
    float: left;
    margin-right: 2px;
  }
  .day1 {
    position: absolute;
    z-index: 2;
    top: 7px;
    left: 85%;
  }
  .day2 {
    position: absolute;
    z-index: 2;
    top: 7px;
    left: 180px;
  }
}
</style>
