import { listPurchaseInventory, getPurchaseInventory, delPurchaseInventory, addPurchaseInventory, updatePurchaseInventory, exportPurchaseInventory } from "@/api/purchaseManage/purchaseLocationInventory";
import $ from "jquery";

export default {
  name: 'PurchaseInventory',
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
      // 库存表格数据
      purchaseInventoryList: [],
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
        goodsName: undefined,
        standard: undefined,
        firstBuyTime: undefined,
        firstBuyTimeRange: [],
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
        supplierId: undefined,
        purchaseRecordId: undefined,
        produceTime: undefined,
        produceTimeRange: [],
        batchNum: undefined,
        validTime: undefined,
        validTimeRange: [],
        mount: undefined,
        goodsPics: undefined,
        grower: undefined,
        cropDate: undefined,
        cropDateRange: [],
        sprayDate: undefined,
        sprayDateRange: [],
        sprayNum: undefined,
        reapDate: undefined,
        reapDateRange: [],
        lotNumber: undefined,
        productQrCode: undefined,
        productIdentification: undefined,
        expirationTime: undefined,
        expirationTimeRange: [],
        params:{
          beginFirstBuyTime: undefined,
          endFirstBuyTime: undefined,
          beginProduceTime: undefined,
          endProduceTime: undefined,
          beginValidTime: undefined,
          endValidTime: undefined,
          beginCropDate: undefined,
          endCropDate: undefined,
          beginSprayDate: undefined,
          endSprayDate: undefined,
          beginReapDate: undefined,
          endReapDate: undefined,
          beginExpirationTime: undefined,
          endExpirationTime: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsName: [
          // { required: true, message: "商品名称不能为空", trigger: "blur" }
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
    getUrl(val) {
      return process.env.VUE_APP_PICTURE_PATH + val
    },
    goodsTypeFormat(row, column) {
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    goodsUnitFormat(row, column) {
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },
    /** 查询库存列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[0] : undefined;
      this.queryParams.params.endFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[1] : undefined;
      this.queryParams.params.beginProduceTime = this.queryParams.produceTimeRange && this.queryParams.produceTimeRange.length > 0 ? this.queryParams.produceTimeRange[0] : undefined;
      this.queryParams.params.endProduceTime = this.queryParams.produceTimeRange && this.queryParams.produceTimeRange.length > 0 ? this.queryParams.produceTimeRange[1] : undefined;
      this.queryParams.params.beginValidTime = this.queryParams.validTimeRange && this.queryParams.validTimeRange.length > 0 ? this.queryParams.validTimeRange[0] : undefined;
      this.queryParams.params.endValidTime = this.queryParams.validTimeRange && this.queryParams.validTimeRange.length > 0 ? this.queryParams.validTimeRange[1] : undefined;
      this.queryParams.params.beginCropDate = this.queryParams.cropDateRange && this.queryParams.cropDateRange.length > 0 ? this.queryParams.cropDateRange[0] : undefined;
      this.queryParams.params.endCropDate = this.queryParams.cropDateRange && this.queryParams.cropDateRange.length > 0 ? this.queryParams.cropDateRange[1] : undefined;
      this.queryParams.params.beginSprayDate = this.queryParams.sprayDateRange && this.queryParams.sprayDateRange.length > 0 ? this.queryParams.sprayDateRange[0] : undefined;
      this.queryParams.params.endSprayDate = this.queryParams.sprayDateRange && this.queryParams.sprayDateRange.length > 0 ? this.queryParams.sprayDateRange[1] : undefined;
      this.queryParams.params.beginReapDate = this.queryParams.reapDateRange && this.queryParams.reapDateRange.length > 0 ? this.queryParams.reapDateRange[0] : undefined;
      this.queryParams.params.endReapDate = this.queryParams.reapDateRange && this.queryParams.reapDateRange.length > 0 ? this.queryParams.reapDateRange[1] : undefined;
      this.queryParams.params.beginExpirationTime = this.queryParams.expirationTimeRange && this.queryParams.expirationTimeRange.length > 0 ? this.queryParams.expirationTimeRange[0] : undefined;
      this.queryParams.params.endExpirationTime = this.queryParams.expirationTimeRange && this.queryParams.expirationTimeRange.length > 0 ? this.queryParams.expirationTimeRange[1] : undefined;

      listPurchaseInventory(this.queryParams).then(response => {
        this.purchaseInventoryList = response.rows;
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
        supplierId: undefined,
        purchaseRecordId: undefined,
        produceTime: undefined,
        produceTimeRange: [],
        batchNum: undefined,
        validTime: undefined,
        validTimeRange: [],
        mount: undefined,
        goodsPics: undefined,
        grower: undefined,
        cropDate: undefined,
        cropDateRange: [],
        sprayDate: undefined,
        sprayDateRange: [],
        sprayNum: undefined,
        reapDate: undefined,
        reapDateRange: [],
        lotNumber: undefined,
        productQrCode: undefined,
        productIdentification: undefined,
        expirationTime: undefined,
        expirationTimeRange: [],
        params:{
          beginFirstBuyTime: undefined,
          endFirstBuyTime: undefined,
          beginProduceTime: undefined,
          endProduceTime: undefined,
          beginValidTime: undefined,
          endValidTime: undefined,
          beginCropDate: undefined,
          endCropDate: undefined,
          beginSprayDate: undefined,
          endSprayDate: undefined,
          beginReapDate: undefined,
          endReapDate: undefined,
          beginExpirationTime: undefined,
          endExpirationTime: undefined,
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
    inletFormat(row, column) {
      if (row.inlet && row.inlet == '1') {
        return '是'
      } else {
        return '否'
      }
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
      getPurchaseInventory(id).then(response => {
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
      getPurchaseInventory(id).then(response => {
          this.form = response.data;
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
      // $('.purchaseInventory-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePurchaseInventory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseInventory(this.form).then(response => {
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
      this.$confirm('是否确认删除库存编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchaseInventory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有库存数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchaseInventory(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 125;
    });
  }
};
