
<template>
  <div v-loading="loading" :style="'height:'+ height" style="overflow: auto;overflow-y: hidden;zoom:0.9;">
    <iframe :src="src" id="dialogFrame" frameborder="no" style="width: 100%;height: 100%;" scrolling="no" />
  </div>
</template>
<script>
  export default {
    name: "Druid",
    data() {
      return {
        // src: "http://localhost:54321",
        // src: "https://jakhuang.github.io/form-generator/#/",
        src: "https://mrhj.gitee.io/form-generator/#/",
        height: document.documentElement.clientHeight - 25 + "px;",
        loading: true
      };
    },
    mounted: function() {
      setTimeout(() => {
        this.loading = false;
      }, 230);
    }
  };
</script>
