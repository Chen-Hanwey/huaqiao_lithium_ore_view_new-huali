<template>
  <div>
    <component :is="currentView"></component>
  </div>
</template>

<script>
import index from "./index";
import bigscreen from "./bigscreen/index";
import purchaseSupplier from "@/views/purchaseManage/purchaseSupplier/purchaseSupplier/index";
export default {
  name: 'Index_v1',
  components: {index, bigscreen},
  data() {
    return {
      index: 'index',
      index_v1_common: 'index_v1_common',
      currentView: bigscreen, // 默认选中第一项
    }
  },
  created() {
    let userType = this.$store.getters.userType;
    if (userType == '00' || userType == '01'){  //超级管理员 监管用户
      this.currentView = index
    }else if (userType == '02' || userType == '03'){  //企业用户 运营点用户
      this.currentView = index
    }else if(userType == '04') {
      this.currentView = purchaseSupplier
    } else {
      this.currentView=null;
    }
  },
  mounted() {
  },
  methods: {},
  destroyed() {
  },
  beforeDestroy() {
  }
}
</script>

<style lang="scss" scoped>

</style>
