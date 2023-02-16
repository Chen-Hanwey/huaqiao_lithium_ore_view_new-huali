import { listFeedback, getFeedback, delFeedback, addFeedback, updateFeedback, exportFeedback } from "@/api/system/feedback";
import $ from "jquery";

export default {
  name: 'Feedback',
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
      // 意见反馈表格数据
      feedbackList: [],
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        userName: undefined,
        nickName: undefined,
        opinion: undefined,
        contactInfo: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        opinion: [
          { required: true, message: "意见不能为空", trigger: "blur" }
        ],      },
      columnLabel: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询意见反馈列表 */
    getList() {
      this.loading = true;
      listFeedback(this.queryParams).then(response => {
        this.feedbackList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        id: undefined,
        userId: undefined,
        userName: undefined,
        nickName: undefined,
        opinion: undefined,
        contactInfo: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    conditionToggle() {


        if(this.$refs['toggle-container'].style.display === 'none'){
            this.$refs['toggle-container'].style.display = 'inline-block';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
        }else{
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
      this.resetForm("queryForm");
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
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFeedback(id).then(response => {
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
      const id = row.id || this.ids
      getFeedback(id).then(response => {
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
      // $('.modal-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateFeedback(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFeedback(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
          type: "warning"
        }).then(function() {
          return delFeedback(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有意见反馈数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportFeedback(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    })
  }
};
