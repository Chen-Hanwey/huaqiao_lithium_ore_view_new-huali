<template>
  <div class="app-container" >

    <el-tabs v-model="activeName" style="background-color: #fff" ><!--@tab-click="initTab"-->
      <el-tab-pane label="噪声监测设备" name="first">
        <environmental-monitoring-common-equipment ref="first" :type="'1'"></environmental-monitoring-common-equipment>
      </el-tab-pane>
      <el-tab-pane label="粉尘监测设备" name="second">
        <environmental-monitoring-common-equipment ref="second"  :type="'2'"></environmental-monitoring-common-equipment>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import EnvironmentalMonitoringCommonEquipment from './commonEquipment'
export default {
  name: "environmentSelectEquipment",
  components: {
    EnvironmentalMonitoringCommonEquipment
  },
  props: {
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {
  },
  methods: {
    /*initTab(obj){
      if(obj.index=='0'){
        this.$refs.first.init();
      }else if(obj.index=='1'){
        this.$refs.second.init();
      }
    },*/
  }
}
</script>
