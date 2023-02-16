<template>
  <div class="group-box">
    <div class="chart-group">
      <div style="height:250px">
         <right-top-three-chart></right-top-three-chart>
      </div>
    </div>
  </div>
</template>

<script>
import RightTopThreeChart from '@/views/bigscreen/components/mapInspectPanel/components/compreCom/rightTopThreeChart'
export default {
  name: "rightGroupOne",
  components: { RightTopThreeChart},
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
