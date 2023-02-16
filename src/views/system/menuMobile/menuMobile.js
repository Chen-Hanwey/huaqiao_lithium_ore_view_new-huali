import {
  listMenuMobile,
  getMenuMobile,
  treeselect,
  delMenuMobile,
  addMenuMobile,
  updateMenuMobile,
  exportMenuMobile
} from "@/api/system/menuMobile";
import { getToken } from '@/utils/auth'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import $ from "jquery";

export default {
  name: 'MenuMobile',
  components: {Treeselect},
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
      // 移动端菜单表格数据
      menuMobileList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon: '',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=新增，2=编辑，3=详情
      tableHeight: 450,
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined,
        usualType: undefined,
      },
      usualTypeChecked: false,
      // 表单参数
      form: {
        menuId: undefined,
        menuName: undefined,
        parentId: undefined,
        orderNumAll: undefined,
        path: undefined,
        menuType: 'M',
        orderNumUsual: undefined,
        visible: '0',
        perms: undefined,
        icon: undefined,
        usualType: '2',
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      },
      // 表单校验
      rules: {
        menuName: [
          {required: true, message: "菜单名称不能为空", trigger: "blur"}
        ], orderNumAll: [
          {required: true, message: "显示排序不能为空", trigger: "blur"}
        ],path: [
          { validator: this.validatePath, trigger: "blur" }
        ],icon: [
          { validator: this.validateIcon, trigger: "blur" }
        ],
      },
      columnLabel: '',
      // 菜单状态数据字典
      visibleOptions: [],
      menuOptions: [],
      iconUploadUrl: process.env.VUE_APP_BASE_API+'/system/menuMobile/uploadIcon' ,
      uploadHeader: {Authorization: 'Bearer ' + getToken()},
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        this.tableHeight = window.innerHeight - 62 - 145;
      }
    },
  },
  created() {
    this.getList();
    this.getDicts("sys_show_hide").then(response => {
      this.visibleOptions = response.data;
    });
  },
  methods: {
    /** 查询移动端菜单列表 */
    getList() {
      this.loading = true;
      listMenuMobile(this.queryParams).then(response => {
        this.menuMobileList = response.data;
        this.loading = false;
      });
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.menuOptions = [];
        const menu = { id: 0, label: '主类目', children: [] };
        menu.children = response.data;
        this.menuOptions.push(menu);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        menuName: undefined,
        parentId: undefined,
        orderNumAll: undefined,
        path: undefined,
        menuType: 'M',
        orderNumUsual: undefined,
        visible: '0',
        perms: undefined,
        icon: undefined,
        usualType: '2',
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    conditionToggle() {


      if (this.$refs['toggle-container'].style.display === 'none') {
        this.$refs['toggle-container'].style.display = 'inline-block';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        this.$refs['toggle-container'].style.display = 'none';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        menuName: undefined,
        parentId: undefined,
        orderNumAll: undefined,
        path: undefined,
        menuType: undefined,
        orderNumUsual: undefined,
        visible: undefined,
        perms: undefined,
        icon: undefined,
        usualType: undefined,
        params: {}
      };
      this.usualTypeChecked = false;
      this.handleQuery();
    },
    renderHeader(h, {column, $index}, width) {
      let color = '#515a6e';
      let that = this;
      if (that.columnLabel != '' && that.columnLabel == column.label) {
        color = "#ff6600";
      }
      let style = {};
      if (width) {
        // width: 'calc(' + width + '% - 48px)'
        style = {
          textAlign: 'center',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color,
          width: width + "%"
        }
      } else {
        style = {
          textAlign: 'left',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color
        }
      }

      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
    //表格排序
    changeTableSort(column) {
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
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.menuId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.menuId;
      }
      this.open = true;
      this.title = "新增";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      const menuId = row.menuId || this.ids
      getMenuMobile(menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    /** 修改按钮操作 */
    handleView(row) {
      this.reset();
      const menuId = row.menuId || this.ids
      getMenuMobile(menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "详情";
        this.dialogIcon = 'el-icon-document';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    handleDoubleClick(row, column, event) {
      this.handleUpdate(row);
    },
    openDialog() {
      $('.modal-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            updateMenuMobile(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMenuMobile(this.form).then(response => {
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
    handleDelete(row) {
      const menuIds = row.menuId || this.ids;
      this.$confirm('是否确认删除移动端菜单编号为"' + menuIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
        type: "warning"
      }).then(function () {
        return delMenuMobile(menuIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有移动端菜单数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportMenuMobile(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    /** 上传图标格式大小校验 **/
    beforeIconUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';
      const isLt10k = file.size / 1024 / 1024 / 1024 < 10;

      const isTypeSuccess = isJPG || isPNG || isGIF;

      if (!isTypeSuccess) {
        this.$message.error('上传图标只能是 JPG/PNG/GIF 格式!');
      }
      if (!isLt10k) {
        this.$message.error('上传头像图片大小不能超过 10kb!');
      }
      return isTypeSuccess && isLt10k;
    },
    /** 图标上传成功的钩子函数 **/
    handleIconSuccess(response) {
      if(response.code == 200){
        this.form.icon = response.data;
      }else{
        this.$message.error(response.msg);
      }
    },
    /** 菜单路径验证 **/
    validatePath:function(rule, value, callback){
      if(this.form.menuType == 'C'){
        if(!value || value == ''){
          callback("路径不能为空");
        }else{
          callback();
        }
      }else{
        callback();
      }
    },
    /** 菜单图标验证 **/
    validateIcon:function(rule, value, callback){
      if(this.form.menuType == 'C'){
        if(!value || value == ''){
          callback("图标不能为空");
        }else{
          callback();
        }
      }else{
        callback();
      }
    },
    visibleFormat(row,column){
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    /** 菜单常用状态修改 **/
    handleUsualChange(row) {
      let menu = {};
      menu.usualType = row.usualType;
      menu.menuId = row.menuId;
      if('1' == menu.usualType){
        if(!menu.orderNumUsual){
          // 切换为常用时顺序暂时使用全局的顺序，如需修改需要前往修改页面修改
          menu.orderNumUsual = row.orderNumAll;
        }
      }
      updateMenuMobile(menu).then(response => {
        if (response.code === 200) {
          this.msgSuccess("状态修改成功");
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 查询条件中常用菜单筛选框状态变更事件 **/
    usualTypeQueryChange(val){
      if(val){
        this.queryParams.usualType = '1';
      }else{
        this.queryParams.usualType = undefined;
      }
      this.handleQuery();
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    });


  }
};
