<template>
  <div class="datav_main">
    <FullScreen ref="my-full-screen">
      <scale-box ref="scaleBox" id="main" class="scaleBox">
        <div class="bg_x"></div>
        <div class="main_content">
          <header-box @screen="screen"></header-box>
          <div class="main-content">
            <div class="dp-left">
              <left-group-one></left-group-one>
              <left-group-two></left-group-two>
              <left-group-three></left-group-three>
            </div>
            <div class="dp-center">
              <!-- <div class="app-container" style="overflow:hidden;" :style="{height:contentHeight}">
                <el-row :gutter="20">
                  <div id="play" ref="play">
                    <el-col :span="19" :xs="24">
                      
                    </el-col>
                  </div>
                </el-row>
              </div> -->
              <haikang type="live" index="realTime" :code="code" />
              <!-- <maptd @getPlayUrl="getPlayUrl"></maptd> -->
            </div>
            <div class="dp-right">
              <right-group-one @show-detail="openDetail"></right-group-one>
              <!-- <right-group-two></right-group-two> -->
              <right-group-three :playUrl="playUrl" :zoom="zoom"></right-group-three>
            </div>
          </div>
        </div>
      </scale-box>
      <detail :id="id"></detail>
    </FullScreen>
  </div>
</template>
<script>
import FullScreen from "./FullScreen";
import ScaleBox from './ScaleBox';
import headerBox from './child/headerBox';
import leftGroupOne from './child/leftGroupOne';
import leftGroupTwo from './child/leftGroupTwo';
import leftGroupThree from './child/leftGroupThree';
import rightGroupOne from './child/rightGroupOne';
import EasyPlayer from '@easydarwin/easyplayer';
// import rightGroupTwo from './child/rightGroupTwo';
import rightGroupThree from './child/rightGroupThree';
// import maptd from "./child/maptd";
import detail from './child/components/detail';
import haikang from './child/components/haiKang.vue'
export default {
  components: {
    FullScreen, ScaleBox, headerBox, detail,
    leftGroupOne, leftGroupTwo, leftGroupThree, rightGroupOne, rightGroupThree,
    EasyPlayer,haikang

  },
  data () {
    return {
      zoom: 1,
      fullscreen: false,
      playUrl: {},
      id: '',
      // contentHeight: $(window).height() - 100 + 'px',
    }
  },
  watch: {
    '$store.getters.sidebar.opened': (n, o) => {
      setTimeout(() => {
        that.$refs.scaleBox.setScale()
      }, 300)
    },
  },
  computed: {

  },
  mounted () {
    this.resize();
  },
  methods: {
    openDetail (id) {
      this.id = id

    },
    resize () {
      if (this.fullscreen) {
        let w = window.innerWidth
        this.zoom = (w / 1920)
        window.console.log("fullscreen" + this.zoom)
      } else {
        let w = this.$parent.$el.clientWidth
        let h = this.$parent.$el.clientHeight
        this.zoom = (w / 1920)
        window.console.log("screen" + this.zoom)
      }
    },
    getPlayUrl (val) {
      window.console.log(val)
      this.playUrl = val;
      console.log(this.playUrl)
    },
    screen () {
      let element = document.documentElement;//设置后就是我们平时的整个页面全屏效果
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
      //尝试解决层级问题
      this.$refs['my-full-screen'].request()
      this.$refs.scaleBox.setScale()
      this.fullscreen = !this.fullscreen;
      let that = this;
    }
  }

}
</script>

<style scoped lang="scss">
@import "assets/styles/index";
.datav_main {
  height: 100%;
  width: 100%;
}
.scaleBox {
  background: url("~@/views/dataV/assets/images/bg-1.jpg") no-repeat;
}

.bg_x {
  position: absolute;
  width: 100%;
  height: 1080px;
  background: url("~@/views/dataV/assets/images/head_x.png") repeat-x;
  z-index: 1;
  opacity: 0.4;
}
.main_content {
  position: absolute;
  width: 100%;
  height: 1080px;
  z-index: 2;
}
.dp-left {
  width: 460px;
  left: 20px;
  top: 104px;
  position: absolute;
}
.dp-center {
  // width: calc(100% - 1000px);
  height: 951px;
  top: 106px;
  left: 500px;
  position: absolute;
}
.dp-right {
  width: 460px;
  right: 20px;
  top: 104px;
  position: absolute;
}
</style>
