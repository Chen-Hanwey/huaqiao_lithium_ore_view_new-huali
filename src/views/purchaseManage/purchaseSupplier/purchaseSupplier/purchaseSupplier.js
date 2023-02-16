import {
  listPurchaseSupplier,
  getPurchaseSupplier,
  delPurchaseSupplier,
  addPurchaseSupplier,
  updatePurchaseSupplier,
  exportPurchaseSupplier,
  treePurchaseSupplierByEnterpriseId
} from "@/api/purchaseManage/purchaseSupplier";
import $ from "jquery";
import {getToken} from "@/utils/auth";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
import Regx from "@/utils/regexp";

export default {
  name: 'PurchaseSupplier',
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
      // 采购供应商表格数据
      purchaseSupplierList: [],
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
      // 是否显示弹出层
      openGoodsAssociation: false,
      goodAssociationId:undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        enterpriseId: undefined,
        supplierName: undefined,
        contactName: undefined,
        contactPhone: undefined,
        contactIdcard: undefined,
        supplierType: undefined,
        supplyStatus: undefined,
        address: undefined,
        permissionNum: undefined,
        bussinessScope: undefined,
        attachmentFiles: undefined,
        params: {
          districtCode: undefined,
          enterpriseId: undefined,
          operationId: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        contactPhone: [
          {required: true,message: '联系方式不能为空不能为空',trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              Regx.validateTeleAndMobilePhone(rule, value, callback, '请填写正确的联系方式')
            },
            trigger: "blur"
          }
        ],
        systemUserName: [
          {required: true, message: "供应商账号不能为空", trigger: "blur"},
        ],
        contactIdcard: [
          {required: true,message: '身份证号不能为空',trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              Regx.validIdCard(rule, value, callback, '请填写正确的身份证号')
            },
            trigger: "blur"
          }
        ]
      },
      columnLabel: '',
      supplierTypeOptions: [],
      goodsList:[],
      uploadFile:{
        headers: {Authorization: "Bearer " + getToken()},
        //上传附件变量
        uploadFileUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadWithManage',
        fileList: undefined,

        enabledUploadBtn: true,
        btnText: "选择文件",
        uploadBtnIcon: "el-icon-plus",
      },

      enterpriseName:'',
      enterpriseId:this.$store.getters.enterpriseId,
      showTree: this.$store.getters.showTree,
      userType: this.$store.getters.userType,

      openSupplierAssociation:false,
      supplierAssociationData:[]
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
      } else {
        this.tableHeight = window.innerHeight - 62 - 148;
      }
      this.openDialog();
    }
  },
  created() {
    this.getDicts("supplier_type").then(response => {
      this.supplierTypeOptions = response.data;
    });
    this.getList();
  },
  methods: {
    editRelatedGoods(){

    },
    supplierTypeFormat(row,column){
      return this.selectDictLabel(this.supplierTypeOptions, row.supplierType);
    },
    supplyStatusFormat(row,column){
      if (row.supplyStatus && row.supplyStatus== '-1'){
        return '停止'
      } else{
        return '正常'
      }
    },
    /** 查询采购供应商列表 */
    getList() {
      this.loading = true;
      if(this.$refs.highQuery){
        this.queryParams.params.districtCode=this.$refs.highQuery.districtCode;
        this.queryParams.params.enterpriseId=this.$refs.highQuery.enterpriseId;
        this.queryParams.params.operationId=this.$refs.highQuery.operationId;
      }
      listPurchaseSupplier(this.queryParams).then(response => {
        this.purchaseSupplierList = response.rows;
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
        enterpriseId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        delFlag: undefined,
        supplierName: undefined,
        contactName: undefined,
        contactPhone: undefined,
        contactIdcard: undefined,
        supplierType: undefined,
        supplyStatus: "0",
        address: undefined,
        permissionNum: undefined,
        bussinessScope: undefined,
        attachmentFiles: undefined
      };
      this.resetForm("form");
      this.uploadFile.fileList = [];
    },
    conditionToggle() {
      if (this.$refs['toggle-container'].style.display === 'none') {
        this.$refs['toggle-container'].style.display = 'inline-block';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
      } else {
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
        enterpriseId: undefined,
        supplierName: undefined,
        contactName: undefined,
        contactPhone: undefined,
        contactIdcard: undefined,
        supplierType: undefined,
        supplyStatus: undefined,
        address: undefined,
        permissionNum: undefined,
        bussinessScope: undefined,
        attachmentFiles: undefined,
        params: {}
      };
      this.enterpriseId = undefined;
      this.enterpriseName = undefined;
      this.handleQuery();
      this.$refs.highQuery.reset();
    },
    renderHeader(h, {column, $index}, width) {
      let color = '#515a6e';
      let that = this;
      if (that.columnLabel != '' && that.columnLabel == column.label) {
        color = "#ff6600";
      }
      let style = {};
      if (width) {
        // width: 'calc(' + width + '% - 48px)'
        style = {
          textAlign: 'center',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color,
          width: width + "%"
        }
      } else {
        style = {
          textAlign: 'left',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color
        }
      }

      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
    //表格排序
    changeTableSort(column) {
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
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增供应商";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;

      this.$nextTick(function () {
        this.$refs.baseForm.initBaseFormByEnterpriseId(this.$store.getters.enterpriseId)
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseSupplier(id).then(response => {
        this.form = response.data;
        if(this.form.appendixList){
          this.form.appendixList.forEach(item => {
            let file = {};
            file['uid'] = item.appendixId;
            file['url'] = process.env.VUE_APP_PICTURE_PATH+item.appendixPath;
            file['name'] = item.appendixName;
            this.uploadFile.fileList.push(file);
          });
        }
        this.open = true;
        this.title = "修改供应商";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;

        this.$nextTick(function () {
          this.$refs.baseForm.initBaseFormByEnterpriseId(response.data.enterpriseId)
        })
      });
    },
    /** 修改商品关联操作 */
    handleGoodsAssociation(row) {
      this.goodAssociationId= row.id;
      this.openGoodsAssociation=true;
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseSupplier(id).then(response => {
        this.form = response.data;
        if(this.form.appendixList){
          this.form.appendixList.forEach(item => {
            let file = {};
            file['uid'] = item.appendixId;
            file['url'] = process.env.VUE_APP_PICTURE_PATH+item.appendixPath;
            file['name'] = item.appendixName;
            this.uploadFile.fileList.push(file);
          });
        }
        this.open = true;
        this.title = "供应商详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;

        this.$nextTick(function () {
          this.$refs.baseForm.initBaseFormByEnterpriseId(response.data.enterpriseId)
        })
      });
    },
    handleDoubleClick(row, column, event) {
      this.handleView(row);
    },
    openDialog() {
      // $('.purchaseSupplier-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      let that=this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePurchaseSupplier(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseSupplier(this.form).then(response => {
              if (response.code === 200) {
                this.open = false;
                this.$alert(response.msg, "提示", {
                  confirmButtonText: '确定',
                  callback: action => {
                    that.getList();
                  }
                });
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
      // const ids = row.id || this.ids;
      const ids = row.id;
      this.$confirm('是否确认删除所选采购供应商数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delPurchaseSupplier(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购供应商数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportPurchaseSupplier(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    beforeUploadAttachment(file) {
      //文件类型判断
      let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      let extension1 = fileType === 'doc' || fileType === 'docx'
      let extension2 = fileType === 'xls' || fileType === 'xlsx'
      let extension3 = fileType === 'ppt' || fileType === 'pptx'
      let extension4 = fileType === 'pdf'
      let extension5 = fileType === 'mp4'
      let extension6 = fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png'
      let extension7 = fileType === 'zip' || fileType === 'rar'
      if(!extension1 && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7){
        this.$message.error('上传文件只能是 doc、docx、xls、xlsx、ppt、pptx、pdf、mp4、jpg、jpeg、png格式!');
        return false;
      }

      //判断文件大小
      let isLt20M = file.size / 1024 / 1024 < 20
      if(isLt20M) {
        this.uploadFile.enabledUploadBtn = false;
        this.uploadFile.uploadBtnIcon = "el-icon-loading";
        this.uploadFile.btnText = "正在导入";
      }else{
        this.$message.error('上传文件大小不能超过 20MB!');
      }

      return extension1 || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || isLt20M;
    },
    downloadFile(item){
      let url = item.url +'?attname=' + item.name;
      window.location.href = url;
      // window.open(encodeURI(url));
    },
    handleAttachmentRemove(file) {
      //确定要删除的文件，后台通过定时任务自动删除文件
      //更新附件信息
      let fileIds = [];
      for(let i = 0; i < this.uploadFile.fileList.length; i++){
        if(this.uploadFile.fileList[i].uid !== file.uid){
          fileIds.push(this.uploadFile.fileList[i].uid);
        }else{
          this.uploadFile.fileList.splice(i, 1);
          i--;
        }
      }
      this.form.attachmentFiles = fileIds.join(",");
    },
    handleAttachmentSuccess(res, file, fileList) {
      if(res && res.code === 200){
        if(this.form.attachmentFiles&&this.form.attachmentFiles!=''){
          this.form.attachmentFiles = this.form.attachmentFiles + "," + res.appendix.id;
        }else{
          this.form.attachmentFiles = res.appendix.id;
        }

        let item = res.appendix;
        let file = {};
        file['uid'] = item.id;
        file['url'] = process.env.VUE_APP_PICTURE_PATH + item.appendixPath;
        file['name'] = item.appendixName;
        if(this.uploadFile.fileList && this.uploadFile.fileList.length > 0){
          this.uploadFile.fileList.push(file);
        }else{
          this.uploadFile.fileList = [];
          this.uploadFile.fileList.push(file);
        }
      }
      this.uploadFile.enabledUploadBtn = true;
      this.uploadFile.uploadBtnIcon = "el-icon-plus";
      this.uploadFile.btnText = "选择文件";
    },


    enterpriseClick(id){
      this.enterpriseId=id;
      this.getList();
    },

    clickSupplierAssociation(){
      if(this.enterpriseId&&this.enterpriseId!=''){
        treePurchaseSupplierByEnterpriseId(this.enterpriseId).then(res=>{
          this.supplierAssociationData=res.data;
          this.openSupplierAssociation=true;
        })
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
    });
  }
};
