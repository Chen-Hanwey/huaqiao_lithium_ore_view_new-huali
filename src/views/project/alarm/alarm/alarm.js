import { listAlarm, getAlarm, delAlarm, addAlarm, updateAlarm, exportAlarm, listTypeAll, handleIncidentFalse, handleIncidentConfirm } from "@/api/project/alarm/alarm";
import { getCarBaseNo } from "@/api/project/car/carBase";
import $ from "jquery";
import ProcessSelectUser from "@/views/system/user/processSelectUser";
import AMap from '@/views/components/Amap/location';
export default {
  name: 'Alarm',
  components: { ProcessSelectUser, AMap },
  data () {
    return {
      show: false,
      VUE_APP_PICTURE_PATH: process.env.VUE_APP_PICTURE_PATH,
      openStatusDialog: false,
      statusDialogTitle: "",
      formCar: {},
      // 选择分派人呢
      selectProcessUser: {},
      loadingDig: false,
      statusOpDes: "",
      openSelectUser: false,
      queryPerms: '',
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
      // 事件告警表格数据
      alarmList: [],
      // 能力类型字典
      typeOptions: [],
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
        cameraSn: undefined,
        deviceSn: undefined,
        image: undefined,
        area: undefined,
        result: undefined,
        count: undefined,
        curTime: undefined,
        curTimeRange: [],
        status: undefined,
        processId: undefined,
        dispatchUserName: undefined,
        dispatchTime: undefined,
        dispatchTimeRange: [],
        handleUserId: undefined,
        handleUserName: undefined,
        handleTime: undefined,
        handleTimeRange: [],
        frequency: undefined,
        isHang: undefined,
        hangParentId: undefined,
        isLinkage: undefined,
        videoCloudAccount: undefined,
        eventSn: undefined,
        ancestors: undefined,
        isIssue: undefined,
        isUpgrade: undefined,
        description: undefined,
        processType: undefined,
        params: {
          beginCurTime: undefined,
          endCurTime: undefined,
          beginDispatchTime: undefined,
          endDispatchTime: undefined,
          beginHandleTime: undefined,
          endHandleTime: undefined,
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
    formart (val) {
      return val + 'km/h'
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
    /** 查询事件告警列表 */
    getList () {
      this.loading = true;
      this.queryParams.params.beginCurTime = this.queryParams.curTimeRange && this.queryParams.curTimeRange.length > 0 ? this.queryParams.curTimeRange[0] : undefined;
      this.queryParams.params.endCurTime = this.queryParams.curTimeRange && this.queryParams.curTimeRange.length > 0 ? this.queryParams.curTimeRange[1] : undefined;
      this.queryParams.params.beginDispatchTime = this.queryParams.dispatchTimeRange && this.queryParams.dispatchTimeRange.length > 0 ? this.queryParams.dispatchTimeRange[0] : undefined;
      this.queryParams.params.endDispatchTime = this.queryParams.dispatchTimeRange && this.queryParams.dispatchTimeRange.length > 0 ? this.queryParams.dispatchTimeRange[1] : undefined;
      this.queryParams.params.beginHandleTime = this.queryParams.handleTimeRange && this.queryParams.handleTimeRange.length > 0 ? this.queryParams.handleTimeRange[0] : undefined;
      this.queryParams.params.endHandleTime = this.queryParams.handleTimeRange && this.queryParams.handleTimeRange.length > 0 ? this.queryParams.handleTimeRange[1] : undefined;

      listAlarm(this.queryParams).then(response => {
        this.alarmList = response.rows;
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
        cameraSn: undefined,
        deviceSn: undefined,
        image: undefined,
        area: undefined,
        result: undefined,
        count: undefined,
        curTime: undefined,
        status: "0",
        processId: undefined,
        dispatchUserName: undefined,
        dispatchTime: undefined,
        handleUserId: undefined,
        handleUserName: undefined,
        handleTime: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        frequency: undefined,
        isHang: undefined,
        hangParentId: undefined,
        isLinkage: undefined,
        videoCloudAccount: undefined,
        eventSn: undefined,
        ancestors: undefined,
        isIssue: undefined,
        isUpgrade: undefined,
        description: undefined,
        processType: undefined
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


    handleViewByNo (row) {
      this.formCar = {}
      this.show = false
      getCarBaseNo(row.deviceSn).then(response => {
        this.formCar = response.data;
        this.show = true
      });
    },
    formatSpeed (val) {
      if (val == undefined) {
        return '0km/h'
      } else {
        return val + 'km/h'
      }
    },


    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams = {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        type: undefined,
        cameraSn: undefined,
        deviceSn: undefined,
        image: undefined,
        area: undefined,
        result: undefined,
        count: undefined,
        curTime: undefined,
        curTimeRange: [],
        status: undefined,
        processId: undefined,
        dispatchUserName: undefined,
        dispatchTime: undefined,
        dispatchTimeRange: [],
        handleUserId: undefined,
        handleUserName: undefined,
        handleTime: undefined,
        handleTimeRange: [],
        frequency: undefined,
        isHang: undefined,
        hangParentId: undefined,
        isLinkage: undefined,
        videoCloudAccount: undefined,
        eventSn: undefined,
        ancestors: undefined,
        isIssue: undefined,
        isUpgrade: undefined,
        description: undefined,
        processType: undefined,
        params: {
          beginCurTime: undefined,
          endCurTime: undefined,
          beginDispatchTime: undefined,
          endDispatchTime: undefined,
          beginHandleTime: undefined,
          endHandleTime: undefined,
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
    splitImg (strStr) {
      if (!strStr) return []
      return strStr.split(',')
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getAlarm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    // 能力类型字典翻译
    typeFormat (row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    fomart (val) {
      const map = {
        0: "待处理",
        1: "已确认",
        2: "误报"
      }
      return map[val]
    },
    /** 查看按钮操作 */
    handleView (row) {
      this.reset();
      const id = row.id || this.ids
      getAlarm(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
      this.show = false
      if (row.alarmSource == "car") {
        this.handleViewByNo(row);
      }
    },
    handleDoubleClick (row, column, event) {
      this.handleView(row);
    },
    openDialog () {
      // $('.alarm-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAlarm(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addAlarm(this.form).then(response => {
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


    // 误报
    handleFalse (row) {
      this.$confirm('是否确认当前告警为误报', "告警误报", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        let queryData = {
          id: row.id,
          type: row.type,
          cameraSn: row.cameraSn,
          curTime: row.curTime,

        };
        return handleIncidentFalse(queryData);
      }).then(() => {
        this.getList();
        this.msgSuccess("误报提交成功");
      });
    },

    // 处理
    handleConfirm (row) {
      let that = this;
      that.openStatusDialog = true;
      that.statusDialogTitle = "告警处理-确认";
      that.statusOpDes = "当前告警是否确认";
      this.loadingDig = true;
      // 先根据类型获取出规则
      let query = { incidentType: row.type };
      let rule = {};

      getAlarm(row.id).then(response => {
        that.form = response.data;

        that.operationType = 1;
        that.statusOpType = 1;
        that.form.isLinkage = "2";
        that.form.isIssue = '0';
        that.form.isUpgrade = '0';
        that.loadingDig = false;
        that.form.hangMinutes = rule.confirmHang
      });

    },
    selectUser (perms) {
      this.openSelectUser = true;
      this.queryPerms = perms;
      this.$refs.selectProcessUserDialog.init(this.queryPerms);
    },
    submitConfirm () {
      if (!this.selectProcessUser.userId) {
        this.msgError("请选择处理人");
        return false;
      }
      let queryData = {
        id: this.form.id,
        type: this.form.type,
        deviceSn: this.form.deviceSn,
        cameraSn: this.form.cameraSn,
        curTime: this.form.curTime,
        image: this.form.image,
        hangMinutes: this.form.hangMinutes,
        handleUserId: this.selectProcessUser.userId,
        isLinkage: this.form.isLinkage,
        isIssue: this.form.isIssue,
        isUpgrade: this.form.isUpgrade,
        description: this.form.description,
        processType: this.form.processType,
        alarmSource: this.form.alarmSource,
        speed: this.form.speed,
        plateNo: this.form.plateNo,
        picUrl: this.form.picUrl
      };
      this.loadingDig = true;
      handleIncidentConfirm(queryData).then(response => {
        this.msgSuccess("确认成功");
        this.loadingDig = false;
        this.openStatusDialog = false;
        this.getList();
      }).catch(err => {
        this.loadingDig = false;
        this.openStatusDialog = false;
      })
    },

    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除事件告警编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAlarm(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有事件告警数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportAlarm(queryParams);
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
