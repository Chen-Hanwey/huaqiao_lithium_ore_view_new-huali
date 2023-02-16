<template>
  <div class="group-box">
    <div class="name">
      <a>
        {{ curPlace }}
      </a>
      <a>
        {{ curName }}
      </a>
    </div>
    <div class="imgs">
      <el-carousel height="140px" indicator-position="none" @change="diningChange">
        <el-carousel-item v-for="(item,index) in imgList" :key="item.img">
          <img :src="item.img">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { handlePicturePathSingle } from '@/utils/ruoyi'

export default {
  name: 'rightGroupThree',
  props: {
    carouselData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      curPlace: '',
      curName: '',
      imgList: [
        { place: '枣庄市第一实验中学', name: '食材参仓库', img: require('@/assets/images/bigscreen/dining1.png') },
        { place: '枣庄市第二实验中学', name: '学校食堂窗口', img: require('@/assets/images/bigscreen/dining2.png') },
        { place: '枣庄市第三实验中学', name: '食材参仓库', img: require('@/assets/images/bigscreen/dining3.png') }
      ]
    }
  },
  mounted() {
    try{
      this.curPlace = this.carouselData[0].place
      this.curName = this.carouselData[0].name
    }catch(e){

    }
  },
  methods: {
    diningChange(index) {
      try {
        this.curPlace = this.carouselData[index].place
        this.curName = this.carouselData[index].name
      }catch(e){

    }
    }
  },
  computed: {
    handPicture() {
      return function(path) {
        return handlePicturePathSingle(path)
      }
    }
  },
  watch: {}
}
</script>

<style scoped lang="scss">
.group-box {
  width: 100%;
  padding: 15px 20px;
  margin-top: 15px;
  height: 170px;
  background-image: url("../../../assets/images/bigscreen/group-7.svg");

  .name {
    float: left;
    height: 100%;
    width: 50px;

    a {
      padding-top: 20px;
      width: 20px;
      color: #04E7FE;
      float: left;
      font-size: 12px;
    }
  }

  .imgs {
    float: left;
    height: 100%;
    width: calc(100% - 50px);

    img {
      max-width: 310px;
      max-height: 140px;
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
  }

  .name::before {
    display: inline-block;
    content: "";
    width: 0px;
    height: 0px;
    border: 6px solid transparent;
    border-left-color: #04E7FE;
    position: relative;
    top: 0px;
    left: -20px;
  }
}
</style>
