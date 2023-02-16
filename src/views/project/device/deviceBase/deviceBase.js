import {
  listDeviceBase,
  getDeviceBase,
  delDeviceBase,
  addDeviceBase,
  updateDeviceBase,
  exportDeviceBase
} from "@/api/project/device/deviceBase";
import $ from "jquery";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import AMap from '@/views/components/Amap/location';
export default {
  name: 'DeviceBase',
  components: { Treeselect, AMap },
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
      // 设备基础信息表格数据
      deviceBaseList: [],
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
      // 设备类型字典
      typeOptions: [],
      // 设备状态字典
      stateOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        name: undefined,
        type: undefined,
        deptId: undefined,
        manufacturer: undefined,
        buyDate: undefined,
        buyDateRange: [],
        longitude: undefined,
        latitude: undefined,
        state: undefined,
        params: {
          beginBuyDate: undefined,
          endBuyDate: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "设备类型不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所属部门不能为空", trigger: "blur" }
        ],
        state: [
          { required: true, message: "设备状态不能为空", trigger: "blur" }
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
    }
  },
  created () {
    this.getList();
    this.getDicts("device_type").then(response => {
      this.typeOptions = response.data;
    });
    this.getDicts("device_state").then(response => {
      this.stateOptions = response.data;
    });
    this.getDeptTreeSelect();
  },
  methods: {
    getMaker (val1, val2) {
      this.form.longitude = val2
      this.form.latitude = val1
    },
    /** 查询设备基础信息列表 */
    getList () {
      this.loading = true;
      this.queryParams.params.beginBuyDate = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[0] : undefined;
      this.queryParams.params.endBuyDate = this.queryParams.buyDateRange && this.queryParams.buyDateRange.length > 0 ? this.queryParams.buyDateRange[1] : undefined;

      listDeviceBase(this.queryParams).then(response => {
        this.deviceBaseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getDeptTreeSelect () {
      treeselect({}).then(response => {
        this.deptOptions = response.data;
      });
    },
    // 设备类型字典翻译
    typeFormat (row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    // 设备状态字典翻译
    stateFormat (row, column) {
      return this.selectDictLabel(this.stateOptions, row.state);
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: undefined,
        name: undefined,
        type: undefined,
        deptId: undefined,
        manufacturer: undefined,
        model: undefined,
        spec: undefined,
        buyDate: undefined,
        longitude: undefined,
        latitude: undefined,
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
        name: undefined,
        type: undefined,
        deptId: undefined,
        manufacturer: undefined,
        buyDate: undefined,
        buyDateRange: [],
        longitude: undefined,
        latitude: undefined,
        state: undefined,
        params: {
          beginBuyDate: undefined,
          endBuyDate: undefined,
        }
      };
      this.handleQuery();
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
      this.title = "新增设备";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getDeviceBase(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    /** 查看按钮操作 */
    handleView (row) {
      this.reset();
      const id = row.id || this.ids
      getDeviceBase(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "设备详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    handleDoubleClick (row, column, event) {
      this.handleView(row);
    },
    openDialog () {
      // $('.deviceBase-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDeviceBase(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDeviceBase(this.form).then(response => {
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
      this.$confirm('是否确认删除设备基础信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delDeviceBase(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有设备基础信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportDeviceBase(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
    });
  }
};
