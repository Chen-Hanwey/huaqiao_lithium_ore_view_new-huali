<template>
  <div style="width: 100%;overflow: hidden;height: 100vh;background: #f1f2f6;text-align: center;padding-top: 10%">
    <img :src="warnIcon" style="width: 70%;">
    <div style="font-weight: bold;font-size: 60px;margin-top: 10px;">
      401
    </div>
    <div style="font-size: 20px;color: #9f9fa2;margin-top: 20px">您没有访问权限！请登录后重试。</div>
    <div style="display: flex;flex-direction: column;align-items: center;margin-top: 10px;">
      <div  @click="back" style="background: #1993fc;color: #ffffff;padding: 5px 7px;width: 100px;border-radius: 2px;font-size: 20px">
        返回
      </div>
    </div>
  </div>

</template>

<script>
  import errGif from '@/assets/401_images/401.gif'
  import warnIcon from '@/assets/401_images/401.png'

  export default {
    name: 'Page401',
    data() {
      return {
        errGif: errGif + '?' + +new Date(),
        warnIcon: warnIcon
      }
    },
    methods: {
      back() {
        window.location.href = "http://www.baidu.com/?button=back";
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mask1 {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 375px 375px 0;
    border-color: transparent #007bff transparent transparent;
    transform: rotate(90deg);
    -ms-transform: rotate(90deg); /* IE 9 */
    -moz-transform: rotate(90deg); /* Firefox */
    -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
    -o-transform: rotate(90deg);
  }

  .errPage-container {
    /*width: 800px;*/
    max-width: 100%;
    margin: 100px auto;

    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none !important;
    }

    .pan-gif {
      margin: 0 auto;
      display: block;
    }

    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }

    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }

    .list-unstyled {
      font-size: 14px;

      li {
        padding-bottom: 5px;
      }

      a {
        color: #008489;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
