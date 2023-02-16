import { listNotice, getNotice, delNotice, batchDelNotice, addNotice, updateNotice, exportNotice,changeNoticeStatus } from "@/api/system/notice";
import { deleteMixedFiles } from "@/api/tool/fastdfs";
// import Editor from '@/components/Editor';
import NEditor from '@/components/UEditor/neditor';
import $ from "jquery";

export default {
  name: "Notice",
  components: {
    // Editor,
    NEditor
  },
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
      // 公告表格数据
      noticeList: [],
      //表格高度
      tableHeight: '100%',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      viewOpen: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        noticeTitle: undefined,
        nickName: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          { required: true, message: "公告标题不能为空", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "公告类型不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "公告状态不能为空", trigger: "blur" }
        ],
        noticeContent: [
          { required: true, message: "公告内容不能为空", trigger: "blur" }
        ]
      },
      columnLabel: ''
    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
      if(this.$refs.table.$el.offsetTop){
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      }else{
        this.tableHeight = window.innerHeight - 62 - 145;
      }
      this.openDialog();
    }
  },
  created() {
    this.getList();
    this.getDicts("sys_notice_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_notice_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    conditionToggle() {
      if ($('.toggle-container').css('display') == 'none') {
        $('.toggle-container').css('display', 'inline-block');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        $('.toggle-container').css('display', 'none');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      }

    },
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType);
    },
    // 取消按钮
/*    cancel() {
      this.open = false;
      this.reset();
    },*/
    // 取消按钮
    cancel() {
      this.removeExtraFiles();
      this.open = false;
      this.reset();
    },
    //点击右上角 x 进行关闭时回调函数
    beforeCloseDialog(done){
      this.removeExtraFiles();
      done();
    },
    removeExtraFiles(){
      if(this.operationType !== 3){
        let picturePath = this.$refs.editor.picturePath;
        if(picturePath && picturePath.length > 0){
          let param = {"fileUrl" : picturePath};
          deleteMixedFiles(param);
        }
      }
    },
    // 表单重置
    reset() {
      this.form = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        filePath: undefined,
        status: "0",
        stickTop: "0"
      };
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.noticeId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "撤销";
      this.$confirm('确认要' + text + '该通知公告吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeNoticeStatus(row);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 任务制定修改
    handleStickChange(row) {
      let text = row.stickTop === "1" ? "置顶" : "取消置顶";
      this.$confirm('确认要' + text + '该通知公告吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeNoticeStatus(row);
      }).then(() => {
        this.msgSuccess(text + "成功");
        this.getList();
      }).catch(function() {
        row.stickTop = row.stickTop === "0" ? "1" : "0";
      });
    },
    openDialog(){
      // $('.notice-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 新增按钮操作 */
    handleView(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids
      getNotice(noticeId).then(response => {
        this.form = response.data;
        this.viewOpen = true;
        this.title = "公告详情";
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const noticeId = row.noticeId || this.ids
      getNotice(noticeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.form.noticeContent = this.$refs.editor.content;
      this.$refs["form"].validate(valid => {
        if (valid) {
          let picturePath = this.$refs.editor.picturePath;
          if(this.form.filePath && this.form.filePath.length > 0){
            this.form.filePath += "," + picturePath;
          }else{
            this.form.filePath = picturePath;
          }

          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addNotice(this.form).then(response => {
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
      const noticeIds = row.noticeId || this.ids
      this.$confirm('是否确认删除公告编号为"' + noticeIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
        type: "warning"
      }).then(function() {
        return batchDelNotice(noticeIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
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
  mounted (){
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    });
  }
}
