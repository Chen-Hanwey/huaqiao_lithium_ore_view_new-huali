<template>
  <div class="group-box_right1" style="margin-top: 18px">
    <div class="group-box-title1">
      <a href="#" target="_blank"></a>
    </div>
  </div>
</template>

<script>

export default {
  name: "rightGroupTwo",
  data(){
    return {
    }
  },
  mounted() {
  },
  methods:{
  }
}
</script>

<style scoped lang="scss">
@import "../assets/styles/index";
.group-box_right1 {
  position: relative;
  height: 64px;
  line-height: 64px;
  width:460px;
  text-align: center;
  cursor: pointer;
  font-family: "PingFang SC";
  color: #cde4ff;
  font-size: 20px;
  letter-spacing: 6px;
  background: url("~@/views/dataV/assets/images/rukou.png") no-repeat;
}
</style>
