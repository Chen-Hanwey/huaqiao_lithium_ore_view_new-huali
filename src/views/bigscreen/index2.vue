<template>
  <div class="data-box-mark">
    <FullScreen ref="my-full-screen">
    <scale-box ref="scaleBox" id="main">
      <div class="data-box" id="datavBox">
        <header-box2 @screen="screen"></header-box2>
        <div class="main-content">
          <div class="left">
            <left-group-one :aggregateData="aggregateData"></left-group-one>
            <left-group-two></left-group-two>
            <left-group-three></left-group-three>
          </div>
          <div class="center">
            <center-group-one  @showOperationDetail="showOperationDetail" :deptz="'教育局'"></center-group-one>
            <center-group-two></center-group-two>
          </div>
          <div class="right">
            <right-group-one></right-group-one>
            <right-group-two :disinfectRate="aggregateData.disinfectRate"></right-group-two>
            <right-group-three :carousel-data="aggregateData.carouselData"></right-group-three>
          </div>
        </div>
      </div>
    </scale-box>
    </FullScreen>
    <MapInspectPanel ref="mapInspectPanel"></MapInspectPanel>
  </div>

</template>

<script>
import headerBox2 from '@/views/bigscreen/child/headerBox2'
import leftGroupOne from '@/views/bigscreen/child/leftGroupOne'
import leftGroupTwo from '@/views/bigscreen/child/leftGroupTwo'
import leftGroupThree from '@/views/bigscreen/child/leftGroupThree'
import rightGroupOne from '@/views/bigscreen/child/rightGroupOne'
import rightGroupTwo from '@/views/bigscreen/child/rightGroupTwo'
import rightGroupThree from '@/views/bigscreen/child/rightGroupThree'
import centerGroupOne from '@/views/bigscreen/child/centerGroupOne'
import centerGroupTwo from '@/views/bigscreen/child/centerGroupTwo'
import { mapGetters } from 'vuex'
import { getAggregateData } from '@/api/bigScreen/bigScreen'
import ScaleBox from './ScaleBox'
import FullScreen from "./FullScreen";
import MapInspectPanel from "./components/mapInspectPanel/index";
let that
export default {
  name: 'bigscreen',
  components: {
    headerBox2,
    leftGroupOne,
    leftGroupTwo,
    leftGroupThree,
    rightGroupOne,
    rightGroupTwo,
    rightGroupThree,
    centerGroupOne,
    centerGroupTwo,
    ScaleBox,
    FullScreen,
    MapInspectPanel
  },
  computed: {
    ...mapGetters(['sidebar']),
    msgNum: {
      get() {
        return this.sidebar.opened
      }
    }
  },
  // watch 监听msgNum的变化 实际就是在监听getNoticeNum
  watch: {
    '$store.getters.sidebar.opened': (n, o) => {
      setTimeout(() => {
        that.$refs.scaleBox.setScale()
      }, 300)
    },
  },
  data() {
    return {
      zoom: 1,
      fullscreen: false,
      aggregateData: {
        supervisionNum: undefined,
        supervisionFrequency: undefined,
        missNum: undefined,
        healthPassRate: undefined,
        morningRate: undefined,
        venueNum: undefined,
        disinfectRate: undefined,
        missTypeList: [],
        missDataList: [0, 0, 0, 0, 0],
        normalNums: [],
        abnormalNums: [],
        carouselData: []
      }
    }
  },
  created() {
    that = this
  },
  mounted() {
    this.resize()
    let that = this
    window.addEventListener('resize', function() {
      that.resize()
    })
    getAggregateData().then(res => {
      if (res.code == 200) {
        this.aggregateData = res.data
      }
    })
  },
  methods: {
    resize() {
      if (this.fullscreen) {
        let w = window.innerWidth
        this.zoom = (w / 1920)
      } else {
        let w = this.$parent.$el.clientWidth
        let h = this.$parent.$el.clientHeight
        this.zoom = (w / 1920)
      }
    },
    screen() {
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
      window.setTimeout(function () {
        that.$refs.myMap.mapSize();

      }, 500)
    },
    showOperationDetail(id){
      this.$refs.mapInspectPanel.open(id);
    }

  }
}
</script>

<style scoped lang="scss">
.data-box-mark {
  height: 100%;
  width: 100%;
  background:#031431;
}

.data-box {
  width: 1920px;
  height: 1080px;
  background-image: url("../../assets/images/bigscreen/background.png");
  background-size: 100% 100%;
  overflow-x: hidden;
  .main-content {
    height: calc(100% - 100px);
    width: 100%;
    padding: 0 50px 50px;

    .left, .right {
      width: 400px;
      height: 100%;
      float: left;
    }

    .center {
      width: calc(100% - 870px);
      height: 100%;
      margin: 0 35px;
      float: left;
    }
  }
}


</style>
<style lang="scss">
.data-box {
  .color-green {
    color: rgb(90, 226, 148);
  }

  .color-white {
    color: white;
  }
}
</style>
