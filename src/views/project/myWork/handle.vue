<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName" type="border-card" @tab-click="initTab" >
      <el-tab-pane :label="'我的待办'" name="todo-list" >
        <todo-table ref="todoList" :content-height="tableHeight+''"></todo-table>
      </el-tab-pane>
      <el-tab-pane :label="'我的已办'" name="finish-list" >
        <done-table ref="finishList" :content-height="tableHeight+''"></done-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import handleBusiness from "./handleBusiness";
  import TodoTable from "./components/todoTable";
  import DoneTable from "./components/doneTable";
  export default {
    components: {DoneTable, TodoTable},

    ...handleBusiness
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
