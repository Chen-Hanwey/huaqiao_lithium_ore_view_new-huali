import { listRole, getRole, delRole, addRole, updateRole, exportRole, dataScope, partyScope, changeRoleStatus,changeRoleEditFlag } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect,roleMenuTreeselectView } from "@/api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";
import $ from "jquery";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      openView: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      openPartyScope: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      //表格高度
      tableHeight: 400,
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
/*        {
          value: "2",
          label: "自定数据权限"
        },*/
        {
          value: "3",
          label: "本企业数据权限"
        },
       /* {
          value: "4",
          label: "本部门及以下数据权限"
        },
        {
          value: "6",
          label: "本街道及以下数据权限"
        },
        {
          value: "7",
          label: "本社区及以下数据权限"
        },
        {
          value: "5",
          label: "仅本人数据权限"
        }*/
      ],
      partyScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
        {
          value: "2",
          label: "自定数据权限"
        },
        {
          value: "3",
          label: "本组织数据权限"
        },
        {
          value: "4",
          label: "本组织及以下数据权限"
        },
        {
          value: "5",
          label: "仅本人数据权限"
        }
      ],
      // 菜单列表
      menuOptions: [],
      menuViewOptions: [],
      // 部门列表
      deptOptions: [],
      typeOptions: [],
      // 党组织列表
      partyOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
        roleType:undefined
      },
      // 表单参数
      form: {},
      partyForm: {
        taskDutyName: ""
      },
      defaultExpandedDepts: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
/*        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],*/
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ],
        roleType: [
          { required: true, message: "角色类别不能为空", trigger: "change" }
        ]
      },
      columnLabel: '',
      userType:this.$store.getters.userType,
      roleTypeDisable:false
    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
      if(this.$refs.table.$el.offsetTop){
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      }else{
        this.tableHeight = window.innerHeight - 62 - 145;
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("role_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.roleType);
    },
    statusFormat(row){
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    showRoleDesc(val) {
      let roleType = val.split(",")
      let typeOptions = this.typeOptions
      let roleDesc = [];
      roleType.forEach(function(item, index) {
        typeOptions.forEach(function(itemy, indexy) {
          if(itemy.dictValue === item ){
            roleDesc.push(itemy.dictLabel);
          }
        })
      })
      if(roleDesc.length === 0){
        return val
      }
      return roleDesc.join(",")
    },
    conditionToggle() {
      if ($('.toggle-container').css('display') == 'none') {
        $('.toggle-container').css('display', 'inline-block');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        $('.toggle-container').css('display', 'none');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      }

    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getHalfCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getPartyAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.party.getHalfCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.party.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      // return checkedKeys;
      return halfCheckedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      let that =this;
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 角色状态修改
    handleEditFlagChange(row) {
      let text = row.editFlag === "0" ? "非超管可修改删除" : "非超管不可修改删除";
      this.$confirm('确认要将' +row.roleName + '角色设置为'+text+'吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeRoleEditFlag(row.roleId, row.editFlag);
      }).then(() => {
        this.msgSuccess(text + "设置成功");
      }).catch(function() {
        row.editFlag = row.editFlag === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 取消按钮（党组织数据权限）
    cancelPartyScope() {
      this.openPartyScope = false;
      this.resetPartyForm();
    },
    // 表单重置
    reset() {
      // if (this.$refs.tree != undefined) {
      //   this.$refs.tree.setCheckedKeys([]);
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        dataScope: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        remark: undefined
      };
      this.resetForm("form");
    },
    // 表单重置
    resetPartyForm() {
      // if (this.$refs.tree != undefined) {
      //   this.$refs.tree.setCheckedKeys([]);
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.partyForm = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        partyScope: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        partyIds: [],
        remark: undefined
      };
      this.resetForm("partyForm");
    },
    /** 打开模态框时确定模态框的高度*/
    openAcion(){
/*
      setTimeout(function () {
        $('.el-dialog__body').css('height', 600).css('overflow', 'auto');
      },500);
*/

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      if(this.userType && this.userType!='00'){
        this.form.roleType=this.userType;
        this.roleTypeDisable=true;
      }
      // this.form.roleType = this.typeOptions[0].dictValue;
      this.open = true;
      this.title = "新增角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      /*this.$nextTick(() => {
        this.getRoleMenuTreeselect(roleId);
      });*/
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then(response => {
        this.form = response.data;
        // this.form.roleType = response.data.roleType.split(",")
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            this.$refs.menu.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = "修改角色";
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      getRole(roleId).then(response => {
        this.form = response.data;
        this.title = "查看角色";
        roleMenuTreeselectView(roleId).then(res=>{
          this.menuViewOptions=res.menus;
          this.openView = true;
        })
      });
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.$nextTick(() => {
          roleDeptTreeselect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.openDataScope = true;
        this.title = "分配数据权限";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      if(this.form.roleType) {
        // this.form.roleType = this.form.roleType.join(",")
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.admin = undefined;
            if (this.form.roleId != undefined) {
              this.form.menuIds = this.getMenuAllCheckedKeys();
              updateRole(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              this.form.menuIds = this.getMenuAllCheckedKeys();
              addRole(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            }
          }
        });
      }

    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.openDataScope = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
        type: "warning"
      }).then(function() {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有角色数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportRole(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function() {});
    },
    renderHeader(h, { column, $index }, width){
      let color = '#515a6e';
      let that = this;
      if(that.columnLabel != '' && that.columnLabel == column.label){
        color = "#ff6600";
      }
      let style = {};
      if(width){
        // width: 'calc(' + width + '% - 48px)'
        style = {textAlign:'left',wordBreak: 'break-all',whiteSpace: 'pre-line',display:'inline-block',lineHeight: 'normal',color: color, width: width+"px"}
      }else{
        style = {textAlign:'left',wordBreak: 'break-all',whiteSpace: 'pre-line',display:'inline-block',lineHeight: 'normal',color: color}
      }

      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
    //表格排序
    changeTableSort(column){
      let order = '';
      if(column.order === 'ascending'){
        order = 'asc';
      }else if(column.order === 'descending'){
        order = 'desc';
      }
      if(order !== ''){
        this.queryParams.sort = column.prop.replace(/([A-Z])/g,"_$1").toLowerCase();
        this.queryParams.order = order;
        this.queryParams.pageNum = 1;
        this.columnLabel = column.column.label;
      }else{
        this.queryParams.sort = '';
        this.queryParams.order = '';
        this.queryParams.pageNum = 1;
        this.columnLabel = '';
      }
      this.getList();
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    });
  }
}
