<template>
  <div>
    <div class="head-container">
      <el-input
        v-model="name"
        placeholder="请输入部门或用户名"
        clearable
        size="small"
        prefix-icon="el-icon-search"
        style="margin-bottom: 20px"
      />
    </div>
    <div class="head-container treeShow" style="overflow: auto">
      <el-tree
        ref="tree"
        lazy
        node-key="id"
        :props="defaultProps"
        :check-on-click-node="true"
        :expand-on-click-node="false"
        show-checkbox
        :filter-node-method="filterNode"
        :load="loadNode"
        :default-checked-keys="defaultCheckedKeys"
        @check-change="handleCheckChange"
        :default-expanded-keys="defaultExpandedKeys"
      />
    </div>
  </div>
</template>

<script>
  import { getDeptAndUserByParentDept, getDeptAndUserByDeptId } from "@/api/system/dept";

  export default {
    name: 'UserSelect',
    props:{
      defaultCheckedKeys:{
        type: Array,
        default: []
      }
    },
    data(){
      return {
        // 名称，用于搜索
        name: undefined,
        // 部门树选项
        defaultProps: {
          children: "children",
          label: "name",
          isLeaf: 'leaf'
        },
        currentNode: undefined,
        currentNodeResolve: undefined,
        selectedUserName: [], //存储选中的节点名称
        selectedUserId: [], //存储选中的节点id
        defaultExpandedKeys: [] //默认展开的节点
      }
    },
    watch: {
      // 根据名称筛选部门树
      name(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {

    },
    methods: {
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          let param = {parentId: 0};
          getDeptAndUserByParentDept(param).then(response => {
            let result = response.data;
            resolve(response.data);
            this.defaultExpandedKeys.push(result[0].id);
          });
        }else if(node.level === 1){
          let param = {parentId: this.defaultExpandedKeys[0]};
          getDeptAndUserByParentDept(param).then(response => {
            let result = response.data;
            resolve(response.data);
            result.forEach(item => {
              this.defaultExpandedKeys.push(item.id);
            });
          });
        } else{
          let param = {parentId: node.data.id};
          getDeptAndUserByParentDept(param).then(response => {
            return resolve(response.data);
          });
        }
      },
      handleCheckChange(node, checkded, children){
        this.selectedUserName = [];
        this.selectedUserId = []
        let result = this.$refs.tree.getCheckedNodes(true, true);
        if(result && result.length > 0){
          result.forEach(item => {
            this.selectedUserId.push(item.id);
            this.selectedUserName.push(item.name);
          });
        }
      }
    }
  }
</script>
