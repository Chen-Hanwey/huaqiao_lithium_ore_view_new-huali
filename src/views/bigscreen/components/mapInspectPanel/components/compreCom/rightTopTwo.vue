<template>
  <div class="group-box">
    <div class="chart-group">
      <div style="height:250px">
         <right-top-two-chart></right-top-two-chart>
      </div>
    </div>
  </div>
</template>

<script>
import rightTopTwoChart from "./rightTopTwoChart";
export default {
  name: "rightGroupOne",
  components: {rightTopTwoChart},
  data(){
    return {}
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.group-box {
  width: 100%;
  height: 370px;
  padding: 6px;

  .flood-box{
    height: 160px;
    position: relative;
    .flood-bar{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .chart-group{
    height: calc(100% - 170px);
    margin-top: 10px;
  }
}

</style>
