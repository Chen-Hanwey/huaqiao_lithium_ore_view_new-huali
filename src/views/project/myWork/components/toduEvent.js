import { listEvent, getEvent, delEvent, addEvent, updateEvent, exportEvent, handle } from "@/api/project/event/event";
import { listTypeAll } from "@/api/project/alarm/alarm";
import $ from "jquery";

export default {
  name: 'ToDoEvent',
  data () {
    return {
      remark: '',
      VUE_APP_PICTURE_PATH: process.env.VUE_APP_PICTURE_PATH,
      // 能力类型字典
      typeOptions: [],
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
      // 告警事件表格数据
      eventList: [],
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        type: undefined,
        deviceSn: undefined,
        cameraSn: undefined,
        auditUserId: undefined,
        auditUserPhone: undefined,
        msgContent: undefined,
        receiveTime: undefined,
        receiveTimeRange: [],
        handleStatus: undefined,
        handleTime: undefined,
        handleTimeRange: [],
        hangCount: undefined,
        isLinkage: undefined,
        assignUserId: undefined,
        assignTime: undefined,
        assignTimeRange: [],
        handleBy: undefined,
        incidentId: undefined,
        tenantId: undefined,
        ancestors: undefined,
        params: {
          beginReceiveTime: undefined,
          endReceiveTime: undefined,
          beginHandleTime: undefined,
          endHandleTime: undefined,
          beginAssignTime: undefined,
          endAssignTime: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columnLabel: ''
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
      } else {
        this.tableHeight = window.innerHeight - 62 - 138;
      }
      this.openDialog();
    }
  },
  created () {
    this.getList();
    this.getTypeList()
  },
  methods: {
    /** 查询告警事件列表 */
    getList () {
      this.loading = true;
      this.queryParams.params.beginReceiveTime = this.queryParams.receiveTimeRange && this.queryParams.receiveTimeRange.length > 0 ? this.queryParams.receiveTimeRange[0] : undefined;
      this.queryParams.params.endReceiveTime = this.queryParams.receiveTimeRange && this.queryParams.receiveTimeRange.length > 0 ? this.queryParams.receiveTimeRange[1] : undefined;
      this.queryParams.params.beginHandleTime = this.queryParams.handleTimeRange && this.queryParams.handleTimeRange.length > 0 ? this.queryParams.handleTimeRange[0] : undefined;
      this.queryParams.params.endHandleTime = this.queryParams.handleTimeRange && this.queryParams.handleTimeRange.length > 0 ? this.queryParams.handleTimeRange[1] : undefined;
      this.queryParams.params.beginAssignTime = this.queryParams.assignTimeRange && this.queryParams.assignTimeRange.length > 0 ? this.queryParams.assignTimeRange[0] : undefined;
      this.queryParams.params.endAssignTime = this.queryParams.assignTimeRange && this.queryParams.assignTimeRange.length > 0 ? this.queryParams.assignTimeRange[1] : undefined;
      this.queryParams.show = "todo"
      listEvent(this.queryParams).then(response => {
        this.eventList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        id: undefined,
        type: undefined,
        deviceSn: undefined,
        cameraSn: undefined,
        auditUserId: undefined,
        auditUserPhone: undefined,
        msgContent: undefined,
        receiveTime: undefined,
        handleStatus: "0",
        handleTime: undefined,
        hangCount: undefined,
        isLinkage: undefined,
        assignUserId: undefined,
        assignTime: undefined,
        handleBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        incidentId: undefined,
        tenantId: undefined,
        ancestors: undefined
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
    // 告警类型列表
    getTypeList () {
      let params = {
        status: 0,
        isListShow: 'Y'
      }
      listTypeAll(params).then(response => {
        this.typeOptions = response.data;
      });
    },
    // 能力类型字典翻译
    typeFormat (row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
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
        type: undefined,
        deviceSn: undefined,
        cameraSn: undefined,
        auditUserId: undefined,
        auditUserPhone: undefined,
        msgContent: undefined,
        receiveTime: undefined,
        receiveTimeRange: [],
        handleStatus: undefined,
        handleTime: undefined,
        handleTimeRange: [],
        hangCount: undefined,
        isLinkage: undefined,
        assignUserId: undefined,
        assignTime: undefined,
        assignTimeRange: [],
        handleBy: undefined,
        incidentId: undefined,
        tenantId: undefined,
        ancestors: undefined,
        params: {
          beginReceiveTime: undefined,
          endReceiveTime: undefined,
          beginHandleTime: undefined,
          endHandleTime: undefined,
          beginAssignTime: undefined,
          endAssignTime: undefined,
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
      this.title = "添加";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getEvent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    handleEvent () {
      window.console.log(this.form)
      let param = {
        id: this.form.id, remark: this.remark
      }
      window.console.log(param)
      handle(param).then(res => {
        this.open = false;
        this.reset();
        this.getList()

      }).catch(err => {

      })
    },
    /** 查看按钮操作 */
    handleView (row) {
      this.reset();
      const id = row.id || this.ids
      getEvent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "处理";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    handleDoubleClick (row, column, event) {
      this.handleView(row);
    },
    openDialog () {
      $('.event-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateEvent(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addEvent(this.form).then(response => {
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
    splitImg (strStr) {
      if (!strStr) return []
      return strStr.split(',')
    },
    fromatStatus (val) {
      let map = {
        1: "未处理",
        2: "已处理"
      }
      return map[val]
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除告警事件编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delEvent(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有告警事件数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportEvent(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
    });
  }
};
