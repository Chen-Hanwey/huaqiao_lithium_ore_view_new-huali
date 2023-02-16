import {
  listPurchaseGoods,
  getPurchaseGoods,
  delPurchaseGoods,
  addPurchaseGoods,
  updatePurchaseGoods,
  exportPurchaseGoods
} from "@/api/purchaseManage/purchaseGoods";
import {listPurchaseSupplier} from "@/api/purchaseManage/purchaseSupplier";
import $ from "jquery";

export default {
  name: 'PurchaseGoods',
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
      // 采购商品信息表格数据
      purchaseGoodsList: [],
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
        supplierId: undefined,
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
        params: {
          beginFirstBuyTime: undefined,
          endFirstBuyTime: undefined,
          districtCode: undefined,
          enterpriseId: undefined,
          operationId: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        goodsName: [{required: true,message: '商品名称不能为空'}],
        goodsUnitL: [{required: true,message: '计量单位不能为空'}],
        qualityDays: [{required: true,message: '保质期不能为空'}],
        inlet: [{required: true,message: '是否进口不能为空'}],
        goodsType: [{required: true,message: '商品类型不能为空'}],
        goodsUnit: [{required: true,message: '计量单位不能为空'}],
        price: [{required: true,message: '参考单价不能为空'}],
        firstBuyTime: [{required: true,message: '不能为空'}]
      },
      columnLabel: '',
      goodsUnitOptions: [],
      goodsWrapTypeOptions: [],
      goodsTypeOptions: [],
      goodsKeepMethodOptions: [],
      supplierOptions: [],
      enterpriseId:'',
      showTree: this.$store.getters.showTree,
      pickOptions: {
        disabledDate(date){
          let now = new Date();
          return now < date
        }
      }
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
    this.getDicts("goods_unit").then(response => {
      this.goodsUnitOptions = response.data;
    });
    this.getDicts("goods_wrap_type").then(response => {
      this.goodsWrapTypeOptions = response.data;
    });
    this.getDicts("goods_type").then(response => {
      this.goodsTypeOptions = response.data;
    });
    this.getDicts("goods_keep_method").then(response => {
      this.goodsKeepMethodOptions = response.data;
    });
    listPurchaseSupplier({}).then(res=>{
      this.supplierOptions = res.rows
    })
    this.getList();
  },
  methods: {
    inletFormat(row,column){
      if (row.inlet && row.inlet== '1'){
        return '是'
      } else{
        return '否'
      }
    },
    goodsUnitFormat(row,column){
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },
    packageTypeFormat(row,column){
      return this.selectDictLabel(this.goodsWrapTypeOptions, row.packageType);
    },
    goodsTypeFormat(row,column){
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    keepMethodFormat(row,column){
      return this.selectDictLabel(this.goodsKeepMethodOptions, row.keepMethod);
    },
    /** 查询采购商品信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[0] : undefined;
      this.queryParams.params.endFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[1] : undefined;
      this.queryParams.enterpriseId=this.enterpriseId;
      if(this.$refs.highQuery){
        this.queryParams.params.districtCode=this.$refs.highQuery.districtCode;
        this.queryParams.params.enterpriseId=this.$refs.highQuery.enterpriseId;
        this.queryParams.params.operationId=this.$refs.highQuery.operationId;
      }
      listPurchaseGoods(this.queryParams).then(response => {
        this.purchaseGoodsList = response.rows;
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
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        delFlag: undefined,
      };
      this.resetForm("form");
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
        supplierId: undefined,
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
        params: {
          beginFirstBuyTime: undefined,
          endFirstBuyTime: undefined,
        }
      };
      this.enterpriseId=undefined;
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
      this.title = "新增商品管理";
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
      getPurchaseGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改商品管理";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
        this.$nextTick(function () {
          this.$refs.baseForm.initBaseFormByEnterpriseId(response.data.enterpriseId)
        })
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseGoods(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "商品管理详情";
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
     // $('.purchaseGoods-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePurchaseGoods(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseGoods(this.form).then(response => {
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
      this.$confirm('是否确认删除采购商品信息编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delPurchaseGoods(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购商品信息数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportPurchaseGoods(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    enterpriseClick(id){
      this.enterpriseId=id;
      this.getList();
    },

  },
  mounted() {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
    });
  }
};
