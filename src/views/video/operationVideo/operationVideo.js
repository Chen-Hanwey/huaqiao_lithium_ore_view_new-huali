import {
  listOperationVideo,
  getOperationVideo,
  delOperationVideo,
  addOperationVideo,
  updateOperationVideo,
  exportOperationVideo,
  insertOrUpdateOperationVideoList, listTreeWithDeviceNum
} from "@/api/video/operationVideo";
import $ from "jquery";
import {getToken} from "@/utils/auth";
import {handlePicturePathSingle} from "@/utils/ruoyi";

export default {
  name: 'OperationVideo',
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
      // 设备关联管理表格数据
      operationVideoList: [],
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
        operationManageId: undefined,
        deviceCode: undefined,
        deviceName: undefined,
        previewPic: undefined,
        params:{
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceName: [{required: true, message: "设备名称不能为空", trigger: "blur"}],
      },
      columnLabel: '',
      operationId:'',
      uploadPic:{
        uploadImgUrl: process.env.VUE_APP_PICTURE_UPLOAD_PATH,
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        dialogImageUrl:''
      },
      previewBigImg: {
        show: false,
        titile: null,
        url: null
      },
      picLoading:false,
      queryEnterpriseName: '',
      treeHeight: 780,
      treeStyle: {
        height: ''
      },
      enterpriseList: []
    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
        if(this.$refs.table.$el.offsetTop){
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 149;
        }else{
            this.tableHeight = window.innerHeight - 62 - 149;
        }
        this.openDialog();
    },
    queryEnterpriseName(val){
      this.$refs.tree.filter(this.queryEnterpriseName)
    }
  },
  created() {
    this.getList();
    this.getAllEnterpriseList();
  },
  methods: {
    /** 查询设备关联管理列表 */
    getList() {
      this.loading = true;
      if(this.$refs.highQuery){
        this.queryParams.params.districtCode=this.$refs.highQuery.districtCode;
        this.queryParams.params.enterpriseId=this.$refs.highQuery.enterpriseId;
        this.queryParams.params.operationId=this.$refs.highQuery.operationId;
      }
      listOperationVideo(this.queryParams).then(response => {
        this.operationVideoList = response.rows;
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
        operationManageId: undefined,
        deviceCode: undefined,
        deviceName: undefined,
        previewPic: undefined
      };
      this.resetForm("form");
    },
    conditionToggle() {


        if(this.$refs['toggle-container'].style.display === 'none'){
            this.$refs['toggle-container'].style.display = 'inline-block';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 149;
        }else{
            this.$refs['toggle-container'].style.display = 'none';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 149;
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
        operationManageId: undefined,
        deviceCode: undefined,
        deviceName: undefined,
        previewPic: undefined,
        params:{
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
      /*this.reset();
      this.open = true;
      this.title = "添加";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;*/
      this.$refs.operationDialog.show();
    },
    operationCallBack(msg) {
      let data = msg[0];
      if (data.length > 0) {
        this.operationId = data[0].id;
        this.operationName = data[0].name;
        this.$refs.videoDeviceSelectDialog.show();
      } else {
        this.$alert("请选择所要关联的经营场所", "提示", {
          confirmButtonText: '确定'
        });
      }
    },
    videoSelectCallBack(msg){
      let data = msg[0];
      let that=this;
      console.log(msg)
      if (data.length > 0) {
        let devObjectList=[];
        data.forEach(item=>{
          let obj={
            operationManageId:this.operationId,
            deviceCode:item.devCode,
            deviceName:item.devName,
            deviceId: item.id
          }
          devObjectList.push(obj);
        })
        let temp={
          operationVideoManageList:devObjectList
        }
        insertOrUpdateOperationVideoList(temp).then(res=>{
          this.$alert(res.msg, "提示", {
            confirmButtonText: '确定',
            callback: action => {
              that.getList();
              that.getAllEnterpriseList();
            }
          });
        });
      } else {
        this.$alert("请选择所要关联的视频设备", "提示", {
          confirmButtonText: '确定'
        });
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOperationVideo(id).then(response => {
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
      getOperationVideo(id).then(response => {
          this.form = response.data;
          this.uploadPic.dialogImageUrl = this.form.previewPic;
          this.open = true;
          this.title = "详情";
          this.dialogIcon = 'el-icon-view';
          this.readOnly = true;
          this.operationType = 3;
      });
    },
    handleDoubleClick(row, column, event){
      this.handleView(row);
    },
    openDialog(){
      // $('.operationVideo-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateOperationVideo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addOperationVideo(this.form).then(response => {
              if (response.code === 200) {
                this.$alert(response.msg, "提示", {
                  confirmButtonText: '确定'
                });
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
      this.$confirm('是否确认删除所选设备关联信息?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delOperationVideo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有设备关联管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOperationVideo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.uploadPic.dialogImageUrl = handlePicturePathSingle(res.url);
        this.form.previewPic = res.url;
      } else {
        this.msgError(res.msg);
      }
      this.picLoading = false;
    },
    beforeAvatarUpload(file) {
      this.picLoading = true;
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isLt2M) {
        this.picLoading = false;
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isLt2M;
    },
    handleImg(path){
      return handlePicturePathSingle(path);
    },
    openBigImgShow(row){
      this.previewBigImg.show = true;
      this.previewBigImg.dialogIcon = 'el-icon-picture';
      this.previewBigImg.title = '图片查看';
      if(row.previewPic){
        this.previewBigImg.url = row.previewPic;
      }else {
        this.previewBigImg.url = null
      }
    },
    // 节点单击事件
    handleNodeClick (data) {
      if (data.nodeType == 'operationManage'){
        this.queryParams.operationManageId = data.id
        this.getList()
      }
    },
    getAllEnterpriseList(){
      listTreeWithDeviceNum().then(res=>{
        this.enterpriseList=res.data;
      })
    },
    enterpriseNameFilter(value,data,node){
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 149;
    });
  }
};
