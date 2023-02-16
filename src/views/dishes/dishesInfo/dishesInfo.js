import { listDishesInfo, getDishesInfo, delDishesInfo, addDishesInfo, updateDishesInfo, exportDishesInfo } from "@/api/dishes/dishesInfo";
import $ from "jquery";
import {getToken} from "@/utils/auth";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";


export default {
  name: 'DishesInfo',

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
      // 菜品管理表格数据
      DishesInfoList: [],
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
        name: undefined,
        price: undefined,
        type: undefined,
        makeup: undefined,
        dishesImg: undefined,
        params:{
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "菜品名称不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        makeup: [
          { required: true, message: "主要成分不能为空", trigger: "blur" }
        ],
      },
      columnLabel: '',
      sampleTypeOptions: [],
      uploadPic:{
        uploadImgUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadImageAndCrtThumbImage',
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        picDialogVisible:false,
        picDialogImageUrl:undefined,
        pictureList1:[],
        pictureFileList1:[]
      },
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
    this.getDicts("sample_type").then(response => {
      this.sampleTypeOptions = response.data;
    });
  },
  methods: {
    getUrl(val) {
      if (val) {
        val = handlePicturePath(val)[0]
      }
      return val
    },
    /** 图片大图查看 **/
    handlePictureCardPreview(file) {
      this.uploadPic.picDialogImageUrl = file.url
      this.uploadPic.picDialogVisible = true
    },
    // 预览大图时定位到当前选中的图片
    getCurrentPreviewImg(url){
      // return urls.slice(index).concat(urls.slice(0,index));
      this.uploadPic.picDialogImageUrl = url
      this.uploadPic.picDialogVisible = true
    },

    /** 事件图片删除 **/
    exercisePicRemove(file, fileList) {
      let fileUrl = file.response ? file.response.url : file.url.replace(process.env.VUE_APP_PICTURE_PATH, '')
      this.form.dishesImg = this.form.dishesImg.replace(fileUrl + ",", '')
      this.form.dishesImg = this.form.dishesImg.replace("," + fileUrl, '')
      this.form.dishesImg = this.form.dishesImg.replace(fileUrl, '')
      this.uploadPic.pictureFileList1 = fileList
    },
    /** 记录图片上传成功 **/
    exercisePicUpSuccess(response, file, fileList) {
      if (response.code === 200) {
        if (this.form.dishesImg && this.form.dishesImg !== '') {
          this.form.dishesImg += ',' + response.url
        } else {
          this.form.dishesImg = response.url
        }
        this.uploadPic.pictureFileList1 = fileList
      } else {
        this.msgError(response.msg)
      }
    },
    /** 图片上传失败 **/
    picUploadErr(err) {

    },
    /** 图片上传过程中的钩子 **/
    picUpProcess(event, file, fileList) {

    },
    beforePicUpload(file) {
      let isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isLt2M
    },
    sampleTypeFormat(row,column){
      return this.selectDictLabel(this.sampleTypeOptions, row.type);
    },
    /** 查询菜品管理列表 */
    getList() {
      this.loading = true;

      listDishesInfo(this.queryParams).then(response => {
        this.DishesInfoList = response.rows;
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
        name: undefined,
        price: undefined,
        type: undefined,
        makeup: undefined,
        dishesImg: undefined,
        remark: undefined,
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
            this.queryParams = {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        name: undefined,
        price: undefined,
        type: undefined,
        makeup: undefined,
        dishesImg: undefined,
        params:{
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
      this.title = "添加";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDishesInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.uploadPic.pictureList1 = handlePicturePath(this.form.dishesImg);
        this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
      /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getDishesInfo(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.uploadPic.pictureList1 = handlePicturePath(this.form.dishesImg);
          this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
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
      // $('.DishesInfo-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateDishesInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDishesInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除菜品管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDishesInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有菜品管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDishesInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    });
  }
};
