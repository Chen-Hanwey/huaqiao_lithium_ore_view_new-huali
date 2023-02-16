import {
  listPurchaseStorage,
  getPurchaseStorage,
  delPurchaseStorage,
  addPurchaseStorage,
  updatePurchaseStorage,
  exportPurchaseStorage,
  addStorageRecords
} from "@/api/purchaseManage/purchaseLocationStorage";
import $ from "jquery";
import {getToken} from "@/utils/auth";
import purchaseOutDialog from "@/views/purchaseManage/components/purchaseOutDialog";
import { deepClone } from '@/utils/index'
import {listsPurchaseGoods} from "@/api/purchaseManage/purchaseGoods";
import { getPurchaseRecord } from "@/api/purchaseManage/purchaseRecord";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
export default {
  name: 'PurchaseStorage',
  components: {purchaseOutDialog},
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
      // 入库商品表格数据
      purchaseStorageList: [],
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
      goodsList: [],
      goodsListAll: [],
      goodsListRest: [],
      uploadPic:{
        uploadImgUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadImageAndCrtThumbImage',
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        picDialogVisible:false,
        picDialogImageUrl:undefined,
        pictureList1:[],
        pictureFileList1:[]
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        goodsName: undefined,
        standard: undefined,
        firstBuyTime: undefined,
        firstBuyTimeRange: [],
        params:{
          beginFirstBuyTime: undefined,
          endFirstBuyTime: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsName: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
      },
      columnLabel: '',
      goodsUnitOptions: [],
      goodsTypeOptions: [],
    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
        if(this.$refs.table.$el.offsetTop){
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 125;
        }else{
            this.tableHeight = window.innerHeight - 62 - 125;
        }
        this.openDialog();
    }
  },
  created() {
    this.getList();
    this.getDicts("goods_unit").then(response => {
      this.goodsUnitOptions = response.data;
    });
    this.getDicts("goods_type").then(response => {
      this.goodsTypeOptions = response.data;
    });
  },
  methods: {
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
      this.form.inboundImagery = this.form.inboundImagery.replace(fileUrl + ",", '')
      this.form.inboundImagery = this.form.inboundImagery.replace("," + fileUrl, '')
      this.form.inboundImagery = this.form.inboundImagery.replace(fileUrl, '')
      this.uploadPic.pictureFileList1 = fileList
    },
    /** 记录图片上传成功 **/
    exercisePicUpSuccess(response, file, fileList) {
      if (response.code === 200) {
        if (this.form.inboundImagery && this.form.inboundImagery !== '') {
          this.form.inboundImagery += ',' + response.url
        } else {
          this.form.inboundImagery = response.url
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
    callBack(val) {
      console.log(val)
      this.form = val
      this.form.id = undefined
      // getPurchaseRecord(val.id).then(response => {
      //   this.$nextTick(()=>{
      //     console.log(response.data)
      //     this.form = response.data;
      //     this.form.id = null
      //     this.goodsList = this.form.goodsList
      //   })
      //   // this.updateGoodsListAll()
      // });

    },

    clickProcurement() {
      if (this.operationType == 1) {
        this.$refs.record_dialog.visible = true
      }
      
    },
    onChangeSupplier() {
      listsPurchaseGoods({}).then(res => {
        this.goodsList = res.data
        this.goodsListAll = deepClone(res.data)
      })
    },
    goodsUnitFormat(row, column) {
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },
    goodsTypeFormat(row, column) {
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    /** 查询入库商品列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[0] : undefined;
      this.queryParams.params.endFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[1] : undefined;

      listPurchaseStorage(this.queryParams).then(response => {
        this.purchaseStorageList = response.rows;
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
        goodsName: undefined,
        standard: undefined,
        firstBuyTime: undefined,
        barcode: undefined,
        goodsUnit: undefined,
        qualityDays: undefined,
        price: undefined,
        manufacturer: undefined,
        productPlace: undefined,
        inlet: undefined,
        packageType: undefined,
        goodsType: undefined,
        keepMethod: undefined,
        enterpriseId: undefined,
        merchantId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        delFlag: undefined,
        supplierId: undefined,
        purchaseRecordId: undefined,
        produceTime: undefined,
        batchNum: undefined,
        validTime: undefined,
        mount: undefined,
        goodsPics: undefined,
        grower: undefined,
        cropDate: undefined,
        sprayDate: undefined,
        sprayNum: undefined,
        reapDate: undefined,
        lotNumber: undefined,
        productQrCode: undefined,
        productIdentification: undefined,
        inboundImagery: undefined,
        warehouseKeeper: undefined,
        warehouseTime: undefined,
        expirationTime: undefined
      };
      this.resetForm("form");
    },
    conditionToggle() {
        if(this.$refs['toggle-container'].style.display === 'none'){
            this.$refs['toggle-container'].style.display = 'inline-block';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 125;
        }else{
            this.$refs['toggle-container'].style.display = 'none';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 125;
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
        goodsName: undefined,
        standard: undefined,
        firstBuyTime: undefined,
        firstBuyTimeRange: [],
        params:{
          beginFirstBuyTime: undefined,
          endFirstBuyTime: undefined,
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
      this.goodsList = []
      this.uploadPic.picDialogImageUrl = undefined
      this.uploadPic.pictureList1 = []
      this.uploadPic.pictureFileList1 = []

      // this.$refs.record_dialog.visible = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseStorage(id).then(response => {
        this.form = response.data;
        this.uploadPic.pictureList1 = handlePicturePath(this.form.inboundImagery);
        this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
        this.goodsList = this.form.goodsList
        this.form.id = id
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
      this.goodsList = []
      getPurchaseStorage(id).then(response => {
          this.$nextTick(()=>{
            this.form = response.data;
            this.form.id = id
            this.goodsList = this.form.goodsList

            this.uploadPic.pictureList1 = handlePicturePath(this.form.inboundImagery);
            this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
            this.open = true;
            this.title = "详情";
            this.dialogIcon = 'el-icon-view';
            this.readOnly = true;
            this.operationType = 3;
          })
      });
    },
    handleDoubleClick(row, column, event){
      this.handleView(row);
    },
    openDialog(){
      // $('.purchaseStorage-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePurchaseStorage(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseStorage(this.form).then(response => {
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
      this.$confirm('是否确认删除入库商品编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchaseStorage(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有入库商品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchaseStorage(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    handleStorage(selections){
      let ids = selections.map(a=>a.id)
      addStorageRecords(ids).then(res=> {
        if (res.code == 200){
          this.getList()
          this.$message.success('操作成功')
        }
      })
    }
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 125;
    });
  }
};
