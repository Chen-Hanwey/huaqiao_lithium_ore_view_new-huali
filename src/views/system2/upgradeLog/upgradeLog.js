import { listUpgradeLog, getUpgradeLog, delUpgradeLog, addUpgradeLog, updateUpgradeLog, exportUpgradeLog, checkSysVersionAdd, checkSysVersionEdit } from "@/api/system/upgradeLog";
import $ from "jquery";
import moment from 'moment'
import Reg from "@/api/regexp/regexp"

export default {
  name: 'UpgradeLog',
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
      // 系统升级日志表格数据
      upgradeLogList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon:'',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=新增，2=编辑，3=详情
      tableHeight: 450,
      pageList: [100,200,500,1000],
      // 是否显示弹出层
      open: false,
      viewOpen: false,
      // 平台类型字典
      platformTypeOptions: [],

      transitionTimeOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }]
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        platformType: undefined,
        sysName: undefined,
        sysVersion: undefined,
        upgradeContent: undefined,
        upgradeDate: undefined,
        upgradeDateRange: [],
        upgradeUser: undefined,
        nickName: undefined,
        params:{
          beginUpgradeDate: undefined,
          endUpgradeDate: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sysName: [{required: true, message: "系统名称不能为空", trigger: "blur"}],
        sysVersion: [{required: true, message: "系统版本不能为空", trigger: "blur"}, { validator: Reg.validateSysVersion, trigger: "blur" }],
        upgradeContent: [{required: true, message: "更新内容不能为空", trigger: "blur"}],
        upgradeDate: [{required: true, message: "更新日期不能为空", trigger: "blur"}],
        platformType: [{required: true, message: "平台类型不能为空", trigger: "blur"}],
      },
      columnLabel: ''
    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
        if(this.$refs.table.$el.offsetTop){
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
        }else{
            this.tableHeight = window.innerHeight - 62 - 147;
        }
    }
  },
  created() {
    this.getList();
    this.getDicts("platform_type").then(response => {
      this.platformTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询系统升级日志列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginUpgradeDate = this.queryParams.upgradeDateRange && this.queryParams.upgradeDateRange.length > 0 ? this.queryParams.upgradeDateRange[0] : undefined;
      this.queryParams.params.endUpgradeDate = this.queryParams.upgradeDateRange && this.queryParams.upgradeDateRange.length > 0 ? this.queryParams.upgradeDateRange[1] : undefined;

      listUpgradeLog(this.queryParams).then(response => {
        this.upgradeLogList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 平台类型字典翻译
    platformTypeFormat(row, column) {
      return this.selectDictLabel(this.platformTypeOptions, row.platformType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        platformType: undefined,
        sysName: undefined,
        sysVersion: undefined,
        upgradeContent: undefined,
        downloadLink: undefined,
        upgradeDate: undefined,
        upgradeUser: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
    },
    conditionToggle() {
        if(this.$refs['toggle-container'].style.display === 'none'){
            this.$refs['toggle-container'].style.display = 'inline-block';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
        }else{
            this.$refs['toggle-container'].style.display = 'none';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
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
        platformType: undefined,
        sysName: undefined,
        sysVersion: undefined,
        upgradeContent: undefined,
        upgradeDate: undefined,
        upgradeDateRange: [],
        upgradeUser: undefined,
        nickName: undefined,
        params:{
          beginUpgradeDate: undefined,
          endUpgradeDate: undefined,
        }
      };
      this.handleQuery();
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
          style = {textAlign:'center',wordBreak: 'break-all',whiteSpace: 'pre-line',display:'inline-block',lineHeight: 'normal',color: color, width: width+"%"}
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
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增";
      this.form.upgradeDate = moment(new Date()).format("YYYY-MM-DD");
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getUpgradeLog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
      /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getUpgradeLog(id).then(response => {
          this.form = response.data;
          this.viewOpen = true;
          this.title = "详情";
          this.dialogIcon = 'el-icon-document';
          this.readOnly = true;
          this.operationType = 3;
      });
    },
    handleDoubleClick(row, column, event){
      this.handleView(row);
    },
    openDialog(){
      $('.upgradeLog-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            checkSysVersionEdit(this.form).then(response => {
              let resultList = response.data;
              console.log(resultList);
              if (resultList && resultList.length > 0) {
                this.msgError("该版本号已存在或落后于现有版本号");
              } else {
                updateUpgradeLog(this.form).then(response => {
                  if (response.code === 200) {
                    this.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                  } else {
                    this.msgError(response.msg);
                  }
                });
              }
            });

          } else {
            checkSysVersionAdd(this.form).then(response => {
              let resultList = response.data;

              if (resultList && resultList.length > 0) {
                this.msgError("该版本号已存在或落后于现有版本号");
              } else {
                addUpgradeLog(this.form).then(response => {
                  if (response.code === 200) {
                    this.msgSuccess("新增成功");
                    this.open = false;
                    this.getList();
                  } else {
                    this.msgError(response.msg);
                  }
                });
              }
            });

          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除该系统升级日志?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
          type: "warning"
        }).then(function() {
          return delUpgradeLog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有系统升级日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUpgradeLog(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 147;
    });
  }
};
