import { listWeather, getWeather, delWeather, addWeather, updateWeather, exportWeather, importWeather } from "@/api/project/weather/weather";
import $ from "jquery";

export default {
  name: 'Weather',
  data () {
    return {
      url: "https://ww-adas.oss-cn-hangzhou.aliyuncs.com/adas/863042041255119_1381168215_00_64_6403_0_.jpg",
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
      // 天气预报表格数据
      weatherList: [],
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
        date: undefined,
        dateRange: [],
        week: undefined,
        dayweather: undefined,
        nightweather: undefined,
        daytemp: undefined,
        nighttemp: undefined,
        daywind: undefined,
        nightwind: undefined,
        daypower: undefined,
        nightpower: undefined,
        params: {
          beginDate: undefined,
          endDate: undefined,
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
    window.console.log("222")
    this.getList();
  },

  methods: {
    /** 查询天气预报列表 */
    getList () {
      this.loading = true;
      this.queryParams.params.beginDate = this.queryParams.dateRange && this.queryParams.dateRange.length > 0 ? this.queryParams.dateRange[0] : undefined;
      this.queryParams.params.endDate = this.queryParams.dateRange && this.queryParams.dateRange.length > 0 ? this.queryParams.dateRange[1] : undefined;

      listWeather(this.queryParams).then(response => {
        this.weatherList = response.rows;
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
        date: undefined,
        week: undefined,
        dayweather: undefined,
        nightweather: undefined,
        daytemp: undefined,
        nighttemp: undefined,
        daywind: undefined,
        nightwind: undefined,
        daypower: undefined,
        nightpower: undefined,
        createTime: undefined
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
        date: undefined,
        dateRange: [],
        week: undefined,
        dayweather: undefined,
        nightweather: undefined,
        daytemp: undefined,
        nighttemp: undefined,
        daywind: undefined,
        nightwind: undefined,
        daypower: undefined,
        nightpower: undefined,
        params: {
          beginDate: undefined,
          endDate: undefined,
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
    /** 新增按钮操作 */
    addWeather () {
      importWeather().then(res => {
        this.getList();
      }).catch(e => {

      })
    },

    isTody (val) {
      let todayDate = new Date().setHours(0, 0, 0, 0);//把今天的日期时分秒设置为00：00：00，返回一个时间戳,
      // todayDate就是今天00：00：00时刻的时间戳

      let paramsDate = new Date(val).setHours(0, 0, 0, 0);//给new Date()传入时间，并返回传入时间的时间戳

      let isToday = (todayDate === paramsDate);//时间戳相同时 True 就为今天
      if (isToday) {
        return val + '(今日)'
      } else {
        return val
      }

    },

    fomart (val) {
      const map = {
        1: "星期一",
        2: "星期二",
        3: "星期三",
        4: "星期四",
        5: "星期五",
        6: "星期六",
        7: "星期日",
      }
      return map[val]
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getWeather(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    /** 查看按钮操作 */
    handleView (row) {
      this.reset();
      const id = row.id || this.ids
      getWeather(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    handleDoubleClick (row, column, event) {
      this.handleView(row);
    },
    openDialog () {
      $('.weather-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateWeather(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addWeather(this.form).then(response => {
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
      this.$confirm('是否确认删除天气预报编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delWeather(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有天气预报数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportWeather(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () { });
    }
  },
  mounted () {

    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 138;
      // this.path = 'wss://wss.iopadas.com:21078/tsinglive/863018101700473_1_realtime' //视频流地址
      // var canvas = this.$refs['video-canvas']
      // this.player = new JSMpeg.Player(this.path, { canvas: canvas })
    });
  }
};
