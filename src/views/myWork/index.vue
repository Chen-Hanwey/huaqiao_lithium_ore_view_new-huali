<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName" type="border-card" @tab-click="" >
      <el-tab-pane :label="'我的待办'" name="todoWork-list" >
        <todoWork></todoWork>
      </el-tab-pane>
      <el-tab-pane :label="'我的已办'" name="doneWork-list" >
       <doneWork></doneWork>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import todoWork from "@/views/myWork/todoWork";
import doneWork from "@/views/myWork/doneWork";
  export default {
    components: {todoWork,doneWork},
    data(){
      return {
        activeTabName: 'todoWork-list',
      }
    },
    methods: {}
  }
</script>
<style scoped>
  .form-item{
    width: 100%;
  }
  .custom-form-item /deep/ label:before{
    display: none;
  }
  ::v-deep  .el-tabs--border-card > .el-tabs__content {
    padding: 10px 15px 15px 15px;
  }
</style>
