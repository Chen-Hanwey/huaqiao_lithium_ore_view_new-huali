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
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
                </div>
            </div>

            </el-form>

            <el-table ref="table" v-loading="loading"  stripe
                    :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                    :data="purchaseInventoryList"> <!-- @selection-change="handleSelectionChange"  @row-dblclick="handleDoubleClick"-->
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" type="index" width="60" align="left">
                <template slot-scope="scope">
                    <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称" align="left" prop="goodsName" sortable :render-header="renderHeader"/>
            <!-- <el-table-column label="商品规格" align="left" prop="standard" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="购进时间" align="left" prop="firstBuyTime" width="150" sortable :render-header="renderHeader">
                <template slot-scope="scope">
                <span>{{ scope.row.firstBuyTime }}</span>
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="商品条码" align="left" prop="barcode" sortable :render-header="renderHeader"/> -->
            <el-table-column label="单位" align="left" prop="goodsUnit" sortable :formatter="goodsUnitFormat" :render-header="renderHeader"/>
            <!-- <el-table-column label="保质期" align="left" prop="qualityDays" sortable :render-header="renderHeader"/> -->
            <el-table-column label="价格" align="left" prop="price" sortable :render-header="renderHeader"/>
            <!-- <el-table-column label="生产企业" align="left" prop="manufacturer" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="商品产地" align="left" prop="productPlace" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="是否进口" align="left" prop="inlet" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="商品包装形式" align="left" prop="packageType" sortable :render-header="renderHeader"/> -->
            <el-table-column label="类型" align="left" prop="goodsType" sortable :formatter="goodsTypeFormat"  :render-header="renderHeader"/>
            <!-- <el-table-column label="商品存储方式" align="left" prop="keepMethod" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="关联企业" align="left" prop="enterpriseId" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="关联商户" align="left" prop="merchantId" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="供货商id" align="left" prop="supplierId" sortable :render-header="renderHeader"/> -->
            <!-- <el-table-column label="采购记录id" align="left" prop="purchaseRecordId" sortable :render-header="renderHeader"/> -->
            <el-table-column label="生产日期" align="left" prop="produceTime" width="150" sortable :render-header="renderHeader">
                <template slot-scope="scope">
                <span>{{ scope.row.produceTime }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="批号" align="left" prop="batchNum" sortable :render-header="renderHeader"/> -->
            <el-table-column label="有效期" align="left" prop="validTime" width="150" sortable :render-header="renderHeader">
                <template slot-scope="scope">
                <span>{{ scope.row.validTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="数量" align="left" prop="mount" sortable :render-header="renderHeader"/>
            <el-table-column label="图片" align="left" prop="goodsPics" sortable :render-header="renderHeader">
                <template slot-scope="scope">
                    <el-image 
                        style="width: 60px; height: 60px"
                        :src="getUrl(scope.row.goodsPics)" 
                        >
                    </el-image>
                </template>
            </el-table-column>
            <!-- <el-table-column label="种植户/养殖户" align="left" prop="grower" sortable :render-header="renderHeader"/>
            <el-table-column label="种植时间" align="left" prop="cropDate" width="100" sortable :render-header="renderHeader">
            <template slot-scope="scope">
                <span>{{ scope.row.cropDate }}</span>
            </template>
            </el-table-column>
            <el-table-column label="农药喷洒时间" align="left" prop="sprayDate" width="100" sortable :render-header="renderHeader">
            <template slot-scope="scope">
                <span>{{ scope.row.sprayDate }}</span>
            </template>
            </el-table-column>
            <el-table-column label="农药喷洒次数" align="left" prop="sprayNum" sortable :render-header="renderHeader"/>
            <el-table-column label="收割时间" align="left" prop="reapDate" width="100" sortable :render-header="renderHeader">
            <template slot-scope="scope">
                <span>{{ scope.row.reapDate }}</span>
            </template>
            </el-table-column> -->
            <el-table-column label="批号" align="left" prop="lotNumber" sortable :render-header="renderHeader"/>
            <!-- <el-table-column label="商品二维码" align="left" prop="productQrCode" sortable :render-header="renderHeader"/> -->
            <el-table-column label="标识" align="left" prop="productIdentification" sortable :render-header="renderHeader"/>
            <el-table-column label="过期时间" align="left" prop="expirationTime" width="150" sortable :render-header="renderHeader">
                <template slot-scope="scope">
                <span>{{ scope.row.expirationTime }}</span>
                </template>
            </el-table-column>
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
    
    import { listLocationPurchaseOut, getPurchaseOut, delPurchaseOut, addPurchaseOut, updatePurchaseOut, exportPurchaseOut } from "@/api/purchaseManage/purchaseOut";
// import $ from "jquery";

export default {
  name: 'PurchaseInventoryDialog',
  data() {
    return {
      visible:false,
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
      columnLabel: '',
      goodsUnitOptions: [],
      goodsTypeOptions: [],
    };
  },
 
  created() {
    this.handleQuery()
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
      getUrl(val) {
          return process.env.VUE_APP_PICTURE_PATH + val
      },
      save() {
      let selection = this.$refs.table.selection;
      // (selection.length>0)?(this.curOperationId = selection[0].id):(this.curOperationId=undefined)
      if (selection.length == 0){
        this.$message.info('请选择要出库的商品')
        return
      }
      if (selection.length > 1){
        this.$message.info('只能选择一个')
        return
      }
      this.$emit('callBack', selection[0], this.callBack);
      this.close();
    },
    goodsTypeFormat(row, column) {
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    goodsUnitFormat(row, column) {
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },
    close() {
      this.visible = false;
      this.resetQuery()
    },
    /** 查询库存列表 */
    handleQuery() {
       this.loading = true;
      listLocationPurchaseOut(this.queryParams).then(response => {
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
    
    // /** 搜索按钮操作 */
    // handleQuery() {
    //   this.queryParams.pageNum = 1;
    //   this.handleQuery();
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
      $('.purchaseInventory-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
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
            
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseOut(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
              
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
          return delPurchaseOut(ids);
        }).then(() => {
          
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
          return exportPurchaseOut(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
  
};

</script>
<style scoped>
    .form-item{
        width: 100%;
    }
</style>
