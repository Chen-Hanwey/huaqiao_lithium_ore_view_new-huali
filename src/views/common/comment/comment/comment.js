import { listComment, getComment, delComment, addComment, updateComment, exportComment } from "@/api/comment/comment";
import $ from "jquery";

export default {
  name: 'Comment',
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
      // 评论管理表格数据
      commentList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon:'',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=添加，2=编辑，3=详情
      tableHeight: 450,
      pageList: [100,200,500,1000],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        scene: undefined,
        sceneId: undefined,
        parentId: undefined,
        authId: undefined,
        score: undefined,
        score1: undefined,
        score2: undefined,
        score3: undefined,
        isRec: undefined,
        addAt: undefined,
        addAtRange: [],
        params:{
          beginAddAt: undefined,
          endAddAt: undefined,
          districtCode: undefined,
          enterpriseId: undefined,
          operationId: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        scene: [
          { required: true, message: "使用场景不能为空", trigger: "blur" }
        ],
        sceneId: [
          { required: true, message: "场景ID不能为空", trigger: "blur" }
        ],
      },
      columnLabel: '',
    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
        if(this.$refs.table.$el.offsetTop){
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
        }else{
            this.tableHeight = window.innerHeight - 62 - 148;
        }
        this.openDialog();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询评论管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginAddAt = this.queryParams.addAtRange && this.queryParams.addAtRange.length > 0 ? this.queryParams.addAtRange[0] : undefined;
      this.queryParams.params.endAddAt = this.queryParams.addAtRange && this.queryParams.addAtRange.length > 0 ? this.queryParams.addAtRange[1] : undefined;


      if(this.$refs.highQuery){
        this.queryParams.params.districtCode=this.$refs.highQuery.districtCode;
        this.queryParams.params.enterpriseId=this.$refs.highQuery.enterpriseId;
        this.queryParams.params.operationId=this.$refs.highQuery.operationId;
      }

      listComment(this.queryParams).then(response => {
        this.commentList = response.rows;
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
        scene: undefined,
        sceneId: undefined,
        parentId: undefined,
        ancestors: undefined,
        authId: undefined,
        contact: undefined,
        address: undefined,
        content: undefined,
        score: undefined,
        imgs: undefined,
        isRec: undefined,
        addAt: undefined
      };
      this.resetForm("form");
    },
    conditionToggle() {


        if(this.$refs['toggle-container'].style.display === 'none'){
            this.$refs['toggle-container'].style.display = 'inline-block';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
        }else{
            this.$refs['toggle-container'].style.display = 'none';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
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
        scene: undefined,
        sceneId: undefined,
        parentId: undefined,
        authId: undefined,
        score: undefined,
        isRec: undefined,
        addAt: undefined,
        addAtRange: [],
        params:{
          beginAddAt: undefined,
          endAddAt: undefined,
        }
      };
      this.$refs.highQuery.reset();
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

      this.$nextTick(function () {
        this.$refs.baseForm.initBaseForm(this.$store.getters.operationId)
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getComment(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;

        this.$nextTick(function () {
          this.$refs.baseForm.initBaseForm(response.data.enterpriseId)
        })
      });
    },
      /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getComment(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "评论详情";
          this.dialogIcon = 'el-icon-view';
          this.readOnly = true;
          this.operationType = 3;

        this.$nextTick(function () {
          this.$refs.baseForm.initBaseForm(response.data.enterpriseId)
        })
      });
    },
    handleDoubleClick(row, column, event){
      this.handleView(row);
    },
    openDialog(){
      // $('.comment-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateComment(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addComment(this.form).then(response => {
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
      this.$confirm('是否确认删除评论管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delComment(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有评论管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportComment(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
    });
  }
};
