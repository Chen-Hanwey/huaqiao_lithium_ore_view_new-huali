<template>
  <div>
    <div class="head-container">
      <el-input v-model="queryEnterpriseName" placeholder="请输入企业名称" clearable size="small" prefix-icon="el-icon-search"
                style="margin-bottom: 5px"/>
    </div>
    <div class="head-container">
      <el-tree :style="treeStyle" :data="enterpriseList"  :expand-on-click-node="true"
               :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick"
               class="flow-tree">

      </el-tree>
    </div>
  </div>
</template>

<script>
import {listEnterpriseTreeWithDept} from "@/api/enterprise/enterprise";
export default {
  name: "enterpriseTree",
  data() {
    return{
      enterpriseList:undefined,
      treeStyle: {
        height: ''
      },
      queryEnterpriseName:'',
    }
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
      this.setTreeHeight();
    },
       // 根据名称筛选辖区树
    queryEnterpriseName (val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.getAllEnterpriseList();
  },
  methods: {
    getAllEnterpriseList(){
      listEnterpriseTreeWithDept({}).then(res=>{
        this.enterpriseList=res.data;
      })
    },
    setTreeHeight () {
      this.treeStyle.height = (window.innerHeight - 138) + 'px'
    },

    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    // 节点单击事件
    handleNodeClick (data) {
      if(data.nodeType=='enterprise'){
        this.$emit("enterpriseClick",data.id);
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.setTreeHeight()
    });
  }
}
</script>

<style scoped>
/deep/.el-tree {
  width: 100%;
  overflow: auto;
}

/deep/.el-tree>.el-tree-node {
  display: inline-block;
  min-width: 100%;
}
</style>
