<template>
  <div class="header-box">
    <a>{{day}}</a>
    <i class="el-icon-rank fullScreen" @click="myScreen()"></i>
  </div>
</template>

<script>
export default {
  name: "headerBox",
  data(){
    return{
      day:'',
      timer:null
    }
  },
  beforeDestroy() {
    if(this.timer){
      clearInterval(this.timer)
      this.timer=null;
    }
  },
  mounted() {
    this.getDay();
    let that=this;
    this.timer=window.setInterval(function (){
      that.getDay()
    },1000);
  },
  methods:{
    myScreen(){
      this.$emit('screen')
    },
    getDay(){
       let myDate = new Date();
      let year = myDate.getFullYear();//获取年
       let month = myDate.getMonth() + 1;//获取月，默认从0开始，所以要加一
      let date = myDate.getDate();//获取日
      let hours = myDate.getHours();//获取小时
      let minutes = myDate.getMinutes();//获取分
      let seconds = myDate.getSeconds();//获取秒
      let weekend = myDate.getDay(); //获取星期几，这里获得到的是数字1-7，所以我下面自己new了一个数组把获取到的数字当下标
     // let weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
     // let day = weeks[weekend]//这样就是显示的星期x了//这些if判断是在小于10的时候前面自动补0
      if (month<10) {
        month = '0'+month
      }
      if (date<10) {
        date = '0'+date
      }
      if (hours<10) {
        hours = '0'+hours
      }
      if (minutes<10) {
        minutes = '0'+minutes
      }
      if (seconds<10) {
        seconds = '0'+seconds
      }
        this.day= year+'-'+month+'-'+date+' '+hours+':'+minutes+':'+seconds
    },


  }
}
</script>

<style scoped lang="scss">
  .header-box{
    width: 100%;
    height: 100px;
    background-image: url("../../../assets/images/bigscreen/hearder-bg.png");
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    a{
      position: absolute;
      right: 90px;
      top: 0px;
      display: block;
      text-align: center;
      line-height: 90px;
      font-size: 20px;
      color:#fff;
    }
    .fullScreen{
      color: #ffffff;
      font-size: 30px;
      position: absolute;
      right: 290px;
      top: 29px;
      cursor: pointer;
    }
  }
</style>
