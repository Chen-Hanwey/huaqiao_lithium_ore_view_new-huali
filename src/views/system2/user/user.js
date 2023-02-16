import { listUser, getUser, delUser, addUser, updateUser, exportUser, resetUserPwd, checkUserName, changeUserStatus, importTemplate } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import $ from "jquery";
import regexp from "@/api/regexp/regexp";

export default {
  name: "User",
  components: { Treeselect },
  data () {
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      partyOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      partyName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      //表格高度
      tableHeight: 400,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        partyId: undefined,
        nickName: undefined,
        jobNo: undefined,
        email: undefined,
        sex: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { validator: regexp.validateUserName, trigger: 'blur' },
          { validator: this.checkUserName, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "归属部门不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        /*email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址"
          }
        ],*/
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        sex: [{
          required: true, message: "用户性别不能为空", trigger: "change"
        }]
      },
      columnLabel: '',
      deptOptions: [],
    };
  },
  watch: {
    // 根据名称筛选部门树
    partyName (val) {
      this.$refs.tree.filter(val);
    },
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
      } else {
        this.tableHeight = window.innerHeight - 62 - 147;
      }
    }
  },
  created () {
    this.getList();
    this.getDeptTreeSelect();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      // this.initPassword = response.data;
      this.initPassword = response.msg;
    });
  },
  methods: {
    sexFormatter (row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex)
    },
    getDeptTreeSelect () {
      treeselect({}).then(response => {
        this.deptOptions = response.data;
      });
    },
    conditionToggle () {
      if ($('.toggle-container').css('display') == 'none') {
        $('.toggle-container').css('display', 'inline-block');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
      } else {
        $('.toggle-container').css('display', 'none');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
      }
    },
    /** 查询用户列表 */
    getList () {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    /** 用户名验证 **/
    checkUserName: function (rule, value, callback) {
      // checkUserName(this.form).then(res => {
      //   if(res.code === 200){
      //     if(res.msg === '0'){
      //       callback()
      //     }else{
      //       callback(new Error('用户名已存在'))
      //     }
      //   }
      // })
      callback()
    },
    normalizer (node) {
      if (node.children && node.children.length > 0) {
        return {
          id: node.id,
          label: node.label,
          children: node.children
        };
      } else {
        delete node.children;
        return {
          id: node.id,
          label: node.label
        };
      }

    },

    // 筛选节点
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick (data) {
      this.queryParams.partyId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange (row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        userId: undefined,
        deptId: undefined,
        partyId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "新增用户";
        // this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd (row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        resetUserPwd(row.userId, value).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功，新密码是：" + value);
          } else {
            this.msgError(response.msg);
          }
        });
      }).catch(() => { });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addUser(this.form).then(response => {
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
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
        type: "warning"
      }).then(function () {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportUser(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    },
    /** 导入按钮操作 */
    handleImport () {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate () {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress (event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess (response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm () {
      this.$refs.upload.submit();
    },
    renderHeader (h, { column, $index }, width) {
      let color = '#515a6e';
      let that = this;
      if (that.columnLabel != '' && that.columnLabel == column.label) {
        color = "#ff6600";
      }
      let style = {};
      if (width) {
        // width: 'calc(' + width + '% - 48px)'
        style = { textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-line', display: 'inline-block', lineHeight: 'normal', color: color, width: width + "px" }
      } else {
        style = { textAlign: 'left', wordBreak: 'break-all', whiteSpace: 'pre-line', display: 'inline-block', lineHeight: 'normal', color: color }
      }

      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
    //表格排序
    changeTableSort (column) {
      let order = '';
      if (column.order === 'ascending') {
        order = 'asc';
      } else if (column.order === 'descending') {
        order = 'desc';
      }
      if (order !== '') {
        this.queryParams.sort = column.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
        this.queryParams.order = order;
        this.queryParams.pageNum = 1;
        this.columnLabel = column.column.label;
      } else {
        this.queryParams.sort = '';
        this.queryParams.order = '';
        this.queryParams.pageNum = 1;
        this.columnLabel = '';
      }
      this.getList();
    }

  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
    });
    $('.treeShow').height(window.innerHeight - this.$refs.table.$el.offsetTop - 147);
  }
}
