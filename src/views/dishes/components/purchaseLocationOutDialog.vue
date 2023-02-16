<template>
  <div>
      <el-dialog title="选择采购记录" :visible.sync="visible" v-if="visible"
             append-to-body class="_baseForm_small"
             :before-close="close" :close-on-click-modal="false">
        <div class="app-container">
        <el-row :gutter="7">
        <el-col :span="24" :xs="24">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
            <label class="condition-item-title">商品名称</label>
            <el-form-item label="" prop="goodsName" class="custom-el-form-item">
                <el-input
                    v-model="queryParams.goodsName" class="query-param"
                    placeholder="请输入商品名称"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!-- <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['inOutWareHouse:purchaseOut:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['inOutWareHouse:purchaseOut:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['inOutWareHouse:purchaseOut:remove']"
            >删除</el-button> -->
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
            <label class="condition-item-title">商品规格</label>
              <el-form-item label="" prop="standard">
                <el-input
                  v-model="queryParams.standard" class="query-param"
                  placeholder="请输入商品规格"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
    <div class="condition-item">
        <label class="condition-item-title">购进时间</label>
        <el-form-item label="" prop="firstBuyTime">
          <el-date-picker clearable size="small" style="width: 240px;"
            v-model="queryParams.firstBuyTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="选择购进时间">
          </el-date-picker>
        </el-form-item>
    </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="purchaseOutList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="名称" align="left" prop="goodsName"  :render-header="renderHeader"/>
      <el-table-column label="单位" align="left" prop="goodsUnit" :formatter="goodsUnitFormat" :render-header="renderHeader"/>
      <el-table-column label="购进时间" align="left" prop="firstBuyTime" width="150"  :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.firstBuyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="left" prop="price"  :render-header="renderHeader"/>
      <el-table-column label="类型" align="left" prop="goodsType" :formatter="goodsTypeFormat"  :render-header="renderHeader"/>
      <el-table-column label="批号" align="left" prop="lotNumber" sortable :render-header="renderHeader"/>
      <el-table-column label="生产日期" align="left" prop="produceTime"  :render-header="renderHeader"/>
      <el-table-column label="有效期" align="left" prop="validTime" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.validTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="left" prop="mount"  :render-header="renderHeader"/>
      <el-table-column label="图片" align="left" prop="goodsPics" sortable :render-header="renderHeader">
        <template slot-scope="scope">
            <el-image
                style="width: 60px; height: 60px"
                :src="getUrl(scope.row.goodsPics)"
                >
            </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['inOutWareHouse:purchaseOut:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['inOutWareHouse:purchaseOut:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['inOutWareHouse:purchaseOut:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      :page-sizes="pageList"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="handleQuery"
    />

        </el-col>
        </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
        <div>
            <el-button type="primary" @click="save">确 定</el-button>
            <el-button @click="close">取 消</el-button>
        </div>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import { listPurchaseOut, getPurchaseOut, delPurchaseOut, addPurchaseOut, updatePurchaseOut, exportPurchaseOut } from "@/api/purchaseManage/purchaseLocationOut";
import $ from "jquery";
import purchaseInventoryDialog from "@/views/purchaseManage/components/purchaseInventoryDialog";
export default {
  name: 'PurchaseOut',
  components: {purchaseInventoryDialog},
  data() {
    return {
      visible: false,
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
      // 出库商品表格数据
      purchaseOutList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon:'',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=添加，2=编辑，3=详情
      // tableHeight: 450,
      pageList: [100,200,500,1000],
      goodsUnitOptions: [],
      goodsTypeOptions: [],
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
          { required: true, message: "商品名称不能为空", trigger: "change" }
        ],
        goodsUnit: [
          { required: true, message: "计量单位不能为空", trigger: "change" }
        ],
        price: [
          { required: true, message: "价格不能为空", trigger: "blur" }
        ],
        goodsType: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        firstBuyTime: [
          { required: true, message: "购进时间不能为空", trigger: "change" }
        ],
        validTime: [
          { required: true, message: "到期日期不能为空", trigger: "change" }
        ],
        lotNumber: [
          { required: true, message: "批号不能为空", trigger: "blur" }
        ],
        mount: [
          { required: true, message: "出库数量不能为空", trigger: "blur" }
        ],
        outgoingPeople: [
          { required: true, message: "出库人不能为空", trigger: "blur" }
        ],
        outgoingCause: [
          { required: true, message: "出库原因不能为空", trigger: "blur" }
        ],
        pickers: [
          { required: true, message: "领料人不能为空", trigger: "blur" }
        ]
      },
      columnLabel: ''
    };
  },
  // watch:{
  //   '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
  //       if(this.$refs.table.$el.offsetTop){
  //           this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 125;
  //       }else{
  //           this.tableHeight = window.innerHeight - 62 - 125;
  //       }
  //       this.openDialog();
  //   }
  // },
  created() {
    this.handleQuery();
    this.getDicts("goods_unit").then(response => {
      this.goodsUnitOptions = response.data;
    });
    this.getDicts("goods_type").then(response => {
      this.goodsTypeOptions = response.data;
    });
  },
  mounted() {
        this.handleQuery()
        this.$bus.$on('reset',()=> {
        this.resetQuery()
        })
        this.$bus.$on('defaultSelect',body=> {
        this.curOperationId = body.operationId
        })
    },
    computed: {
        contentHeight: function () {
        return '410px';
        },
        tableHeight: function () {
        return '360px';
        }
    },
  methods: {
    save() {
      let selection = this.$refs.table.selection;
      // (selection.length>0)?(this.curOperationId = selection[0].id):(this.curOperationId=undefined)
      if (selection.length == 0){
        this.$message.info('请选择要出库的商品')
        return
      }

      this.$emit('callBack1', selection, this.callBack1);
      this.close();
    },
    close() {
      this.visible = false;
      this.resetQuery()
    },
    goodsTypeFormat(row,column){
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    goodsUnitFormat(row,column){
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },

    getUrl(val) {
      return process.env.VUE_APP_PICTURE_PATH + val
    },
    /** 查询出库商品列表 */
    handleQuery() {
      this.loading = true;
      this.queryParams.params.beginFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[0] : undefined;
      this.queryParams.params.endFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[1] : undefined;

      listPurchaseOut(this.queryParams).then(response => {
        this.purchaseOutList = response.rows;
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
        outgoingPeople: undefined,
        outgoingTime: undefined,
        outgoingCause: undefined,
        pickers: undefined,
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
    // handleQuery() {
    //   this.queryParams.pageNum = 1;
    //   this.getList();
    // },
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
      this.handleQuery();
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
      this.title = "出库";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseOut(id).then(response => {
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
      getPurchaseOut(id).then(response => {
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
      // $('.purchaseOut-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updatePurchaseOut(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.handleQuery();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseOut(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.handleQuery();
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
      this.$confirm('是否确认删除出库商品编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPurchaseOut(ids);
        }).then(() => {
          this.handleQuery();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有出库商品数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPurchaseOut(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  },
  mounted() {
    // this.$nextTick(function () {
    //     this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 125;
    // });
  }
};


</script>
