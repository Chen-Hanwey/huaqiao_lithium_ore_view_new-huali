import { listIntroduction, getIntroduction, delIntroduction, addIntroduction, updateIntroduction, exportIntroduction } from "@/api/project/Introduction/Introduction";
import { handleFileList, handlePicturePath } from "@/utils/ruoyi";
import $ from "jquery";
import { getToken } from "@/utils/auth";
export default {
  name: 'Introduction',
  data () {
    return {
      fileList3: [],
      file: {
        name: '宣传视频.mp4', url: ''
      },
      uploadPic: {
        uploadFile: process.env.VUE_APP_PICTURE_FILE_PATH,
        uploadImgUrl: process.env.VUE_APP_PICTURE_UPLOAD_PATH,
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        picDialogVisible: false,
        picDialogImageUrl: undefined,
        pictureList1: [],
        pictureFileList1: [],
      },
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
      // 企业基本信息表格数据
      IntroductionList: [],
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
        name: undefined,
        introduction: undefined,
        businessLicensePicture: undefined,
        video: undefined,
        params: {
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
  },
  methods: {
    getUrl (val) {
      if (val == null || val == '') {
        return ''
      } else {
        return process.env.VUE_APP_PICTURE_PATH + val
      }
    },
    getPicUrl (val) {
      let array = val.toString().split(",")
      return process.env.VUE_APP_PICTURE_PATH + array[0]
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleSuccess (res, file) {
      this.form.video = res.url
    },
    handleRemove (file) {
      this.form.video = null;
    },
    /** 记录图片上传成功 **/
    businessLicensePictureUpSuccess (response, file, fileList) {
      if (response.code === 200) {
        if (this.form.businessLicensePicture && this.form.businessLicensePicture !== '') {
          this.form.businessLicensePicture += ',' + response.url
        } else {
          this.form.businessLicensePicture = response.url
        }
        this.uploadPic.pictureFileList1 = fileList
      } else {
        this.msgError(response.msg)
      }
    },
    /** 图片上传失败 **/
    picUploadErr (err) {

    },
    /** 图片上传过程中的钩子 **/
    picUpProcess (event, file, fileList) {

    },
    beforePicUpload (file) {
      let isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isLt2M
    },

    /** 图片大图查看 **/
    handlePictureCardPreview (file) {
      this.uploadPic.picDialogImageUrl = file.url
      this.uploadPic.picDialogVisible = true
    },
    // 预览大图时定位到当前选中的图片
    getCurrentPreviewImg (url) {
      // return urls.slice(index).concat(urls.slice(0,index));
      this.uploadPic.picDialogImageUrl = url
      this.uploadPic.picDialogVisible = true
    },

    /** 事件图片删除 **/
    businessLicensePictureRemove (file, fileList) {
      let fileUrl = file.response ? file.response.url : file.url.replace(process.env.VUE_APP_PICTURE_PATH, '')
      this.form.businessLicensePicture = this.form.businessLicensePicture.replace(fileUrl + ",", '')
      this.form.businessLicensePicture = this.form.businessLicensePicture.replace("," + fileUrl, '')
      this.form.businessLicensePicture = this.form.businessLicensePicture.replace(fileUrl, '')
      this.uploadPic.pictureFileList1 = fileList
    },
    /** 查询企业基本信息列表 */
    getList () {
      this.loading = true;

      listIntroduction(this.queryParams).then(response => {
        this.IntroductionList = response.rows;
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
        name: undefined,
        introduction: undefined,
        businessLicensePicture: undefined,
        video: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
      };
      this.uploadPic.pictureList1 = [];
      this.uploadPic.pictureFileList1 = [];
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
        introduction: undefined,
        businessLicensePicture: undefined,
        video: undefined,
        params: {
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
      this.fileList3 = []
      this.open = true;
      this.title = "新增企业";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getIntroduction(id).then(response => {
        this.form = response.data;
        this.uploadPic.pictureList1 = handlePicturePath(this.form.businessLicensePicture);
        this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
        if (this.form.video !== '' && this.form.video !== null) {
          this.fileList3 = []
          this.fileList3.push(this.file)
        }
        this.open = true;
        this.title = "修改企业";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    /** 查看按钮操作 */
    handleView (row) {
      window.console.log("handleView")
      this.reset();
      const id = row.id || this.ids
      getIntroduction(id).then(response => {
        this.form = response.data;
        this.uploadPic.pictureList1 = handlePicturePath(this.form.businessLicensePicture);
        this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
        this.open = true;
        this.title = "企业详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    handleDoubleClick (row, column, event) {
      this.handleView(row);
    },
    openDialog () {
     // $('.Introduction-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateIntroduction(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addIntroduction(this.form).then(response => {
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
      this.$confirm('是否确认删除企业基本信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delIntroduction(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () { });
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有企业基本信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportIntroduction(queryParams);
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
