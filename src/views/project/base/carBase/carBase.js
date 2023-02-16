import { listCarBase, getCarBase, delCarBase, addCarBase, updateCarBase, exportCarBase, getCarBasePut } from "@/api/project/car/carBase";
import $ from "jquery";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import AMap from '@/views/components/Amap/location';
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: 'CarBase',
  components: { Treeselect, AMap },
  data () {
    return {
      dialogVisible: false,
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
      // 车辆基础信息表格数据
      carBaseList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon: '',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=添加，2=编辑，3=详情
      tableHeight: 450,
      pageList: [100, 200, 500, 1000],
      // 是否显示弹出层
      open: false,
      // 车型字典
      typeOptions: [],
      // 车辆状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        licenseNo: undefined,
        type: undefined,
        deptId: undefined,
        buyDate: undefined,
        state: undefined,
        buyDateRange: [],
        params: {
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        licenseNo: [
          { required: true, message: "车牌号不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "车型不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所属部门不能为空", trigger: "blur" }
        ],
        // carUse: [
        //   { required: true, message: "用途不能为空", trigger: "blur" }
        // ],
        state: [
          { required: true, message: "车辆状态不能为空", trigger: "blur" }
        ],
      },
      columnLabel: '',
      deptOptions: [],
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
      } else {
        this.tableHeight = window.innerHeight - 62 - 138;
      }
      // this.openDialog();
    }
  },
  created () {
    this.getList();
    this.getDicts("car_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("car_state").then(response => {
      this.stateOptions = response.data;
    });
    this.getDeptTreeSelect();
  },
  methods: {

    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },

    /** 查询车辆基础信息列表 */
    getList () {
      this.loading = true;

      this.queryParams.params.beginBuyDate = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[0] : undefined;
      this.queryParams.params.endBuyDate = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[1] : undefined;

      listCarBase(this.queryParams).then(response => {
        this.carBaseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getDeptTreeSelect () {
      treeselect({}).then(response => {
        this.deptOptions = response.data;
      });
    },
    // 车型字典翻译
    typeFormat (row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 车辆状态字典翻译
    stateFormat (row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    formart (val) {
      return val + 'km/h'
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        licenseNo: undefined,
        type: undefined,
        deptId: undefined,
        carUse: undefined,
        buyDate: undefined,
        state: '1',
        remark: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    conditionToggle () {


      if (this.$refs['toggle-container'].style.display === 'none') {
        this.$refs['toggle-container'].style.display = 'inline-block';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
      } else {
        this.$refs['toggle-container'].style.display = 'none';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
      }
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        licenseNo: undefined,
        type: undefined,
        deptId: undefined,
        buyDate: undefined,
        state: undefined,
        buyDateRange: [],
        params: {
        }
      };
      this.handleQuery();
    },
    formats (val) {
      if (val == 1) {
        return '已安装'
      } else {
        return '未安装'
      }
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
        style = { textAlign: 'center', wordBreak: 'break-all', whiteSpace: 'pre-line', display: 'inline-block', lineHeight: 'normal', color: color, width: width + "%" }
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
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "新增车辆";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getCarBasePut(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改车辆";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    /** 查看按钮操作 */
    handleView (row) {
      this.reset();
      const id = row.id || this.ids
      getCarBase(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "车辆详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    handleDoubleClick (row, column, event) {
      this.handleView(row);
    },
    openDialog () {
      // $('.carBase-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateCarBase(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCarBase(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除车辆基础信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delCarBase(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有车辆基础信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportCarBase(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
    });
    $('.treeShow').height(window.innerHeight - this.$refs.table.$el.offsetTop - 135);
  }
};
