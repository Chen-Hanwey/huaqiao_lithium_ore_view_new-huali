<template>
  <div>
    <div class="head-container">
      <el-input
        v-model="name"
        placeholder="请输入机构或用户姓名"
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
  import { getDeptAndUserByParentDept } from '@/api/system/dept'

  export default {
    name: 'deptByUserSelect',
    props: {
      defaultCheckedKeys: {
        type: Array,
        default: []
      },
      deptId: {
        type: String,
        default: ''
      },
      checkType: {
        type: String,
        default: 'multi'
      },
      checkValue: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 名称，用于搜索
        name: undefined,
        // 部门树选项
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf'
        },
        currentNode: undefined,
        currentNodeResolve: undefined,
        selectedNickName: [], //存储选中的节点名称
        selectedUserId: [], //存储选中的节点id
        selectedUserName: [], //存储选中的节点idcard
        selectedUsers: [], //存储选中的节点
        defaultExpandedKeys: [] //默认展开的节点
      }
    },
    watch: {
      // 根据名称筛选部门树
      name(val) {
        this.$refs.tree.filter(val)
      }
    },
    mounted() {

    },
    methods: {
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          let param = { parentId: 0 }
          getDeptAndUserByParentDept(param).then(response => {
            let result = response.data
            resolve(response.data)
            this.defaultExpandedKeys.push(result[0].id)
          })
        } else {
          let param = { parentId: node.data.id }
          getDeptAndUserByParentDept(param).then(response => {
            /*------------------start--------------------------*/
            /*==================数据回显=======================*/
            let params = []
            this.defaultCheckedKeys.forEach(item =>{
              response.data.forEach(item1 => {
                if(item1.nodeType === 'user'){
                  if(this.checkValue){
                    if(item === item1.idCard){
                      params.push(item1.id)
                    }
                  }else{
                    if(item === item1.userName){
                      params.push(item1.id)
                    }
                  }

                }
              })
            })
            if(params.length > 0){
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(params);
              });
            }
            /*------------------end--------------------------*/
            return resolve(response.data)
          })
        }
      },
      handleCheckChange(node, checkded, children) {
        if (this.checkType === 'single') {
          if (checkded) {
            this.$refs.tree.setCheckedKeys([node.id])
          }
        }
        this.selectedNickName= []
        this.selectedUserId = []
        this.selectedUserName = []
        this.selectedUsers = []
        let result = this.$refs.tree.getCheckedNodes(true, true)
        if (result && result.length > 0) {
          result.forEach(item => {
            if (item.nodeType === 'user') {
              let node = this.$refs.tree.getNode(item.id)
              this.selectedUserId.push(item.id)
              this.selectedNickName.push(item.name)
              this.selectedUserName.push(item.userName)
              this.selectedUsers.push({
                certificateId: item.idCard,
                userId: item.id,
                nickName: item.name,
                userName: item.userName,
                deptId: node.parent.data.id,
                deptName: node.parent.data.name
              })
            }
          });

        }
      },
      setCheckedKeys(auth) {
        this.$refs.tree.setCheckedKeys(auth)
      },
      setCheckedNodes(auth) {
        this.$refs.tree.setCheckedNodes(auth)
      },
    }
  }
</script>
