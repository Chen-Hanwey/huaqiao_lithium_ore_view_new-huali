<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" :style="{'height':treeHeight-30+'px','background':' #ffffff'}">
      <el-tab-pane label="噪声监测配置" name="first">
        <soil-threshhold></soil-threshhold>
      </el-tab-pane>
      <el-tab-pane label="粉尘监测配置" name="second">
        <air-threshhold></air-threshhold>
      </el-tab-pane>
      <!--<el-tab-pane label="水质监测配置" name="four">
        <water-threshhold></water-threshhold>
      </el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import SoilThreshhold from './soilThreshhold'
import AirThreshhold from './airThreshhold'
import waterThreshhold from './waterThreshhold'
export default {
  name: "threshold",
  components: {
    SoilThreshhold,
    AirThreshhold,
    waterThreshhold
  },
  props: {
  },
  data() {
    return {
      treeHeight: 550,
      activeName: 'first'
    }
  },
   watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      this.setTreeHeight();
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.setTreeHeight();
    });
  },
  methods: {
    /** 查询辖区下拉树结构 */
    setTreeHeight () {
      this.treeHeight = window.innerHeight - 80;
    },
  }
}
</script>
