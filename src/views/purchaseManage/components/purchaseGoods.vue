<template>
  <div class="app-container">
    <el-form v-if="true" :model="queryParams" ref="queryForm" :inline="true" label-width="68px"
             style="margin-bottom: 5px">
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
        <div class="btn-container" style="position: relative;right: 2px">
          <el-form-item>
<!--            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>-->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

            <el-button type="primary" icon="el-icon-edit" size="mini" v-if="showModifyButton" @click="transferOpen=true">调整</el-button>

            <!--            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"-->
            <!--                       v-hasPermi="['purchaseGoods:purchaseGoods:add']">新增-->
            <!--            </el-button>-->
            <!--            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"-->
            <!--                       v-hasPermi="['purchaseGoods:purchaseGoods:export']">导出-->
            <!--            </el-button>-->
            <!--            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"-->
            <!--                       v-hasPermi="['purchaseGoods:purchaseGoods:remove']"-->
            <!--            >删除-->
            <!--            </el-button>-->
          </el-form-item>
        </div>
      </div>

<!--      <div class="toggle-container" ref="toggle-container" style="display: none;">
        <div class="condition-item">
          <label class="condition-item-title">计量单位</label>
          <el-form-item label="" prop="goodsUnit">
            <el-select v-model="queryParams.goodsUnit" placeholder="&#45;&#45;全部&#45;&#45;" clearable size="small" class="query-param">
              <el-option
                v-for="dict in goodsUnitOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="condition-item">
          <label class="condition-item-title">是否进口</label>
          <el-form-item label="" prop="inlet">
            <el-select v-model="queryParams.inlet" placeholder="&#45;&#45;全部&#45;&#45;" clearable size="small" class="query-param">
              <el-option label="否" :value="'0'"/>
              <el-option label="是" :value="'1'"/>
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">商品类型</label>
          <el-form-item label="" prop="goodsType">
            <el-select v-model="queryParams.goodsType" placeholder="&#45;&#45;全部&#45;&#45;" clearable size="small" class="query-param">
              <el-option
                v-for="dict in goodsTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
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
      </div>-->
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort"  @row-dblclick="handleDoubleClick"
               :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="purchaseGoodsList" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="left" prop="goodsName" sortable :render-header="renderHeader"/>
      <el-table-column label="计量单位" align="left" prop="goodsUnit" :formatter="goodsUnitFormat" sortable
                       :render-header="renderHeader"/>
      <el-table-column label="保质期(天)" align="left" prop="qualityDays" sortable :render-header="renderHeader"/>
      <el-table-column label="商品价格(元)" align="left" width="140" prop="price"  sortable :render-header="renderHeader"/>
      <!--      <el-table-column label="商品产地" align="left" prop="productPlace" sortable :render-header="renderHeader"/>-->
      <el-table-column label="是否进口" align="left" prop="inlet" sortable :formatter="inletFormat"
                       :render-header="renderHeader"/>
      <!--      <el-table-column label="包装形式" align="left" prop="packageType" :formatter="packageTypeFormat" sortable :render-header="renderHeader"/>-->
      <el-table-column label="商品类型" align="left" prop="goodsType" :formatter="goodsTypeFormat" sortable
                       :render-header="renderHeader"/>
      <el-table-column label="商品规格" align="left" prop="standard" sortable :render-header="renderHeader"/>
    </el-table>

    <pagination
      :page-sizes="pageList"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 修改关联关系 -->
    <el-dialog :visible.sync="transferOpen" :close-on-click-modal="false" class="" append-to-body @open="beforeOpenTransfer">
      <div slot="title">
        <span><i class="el-icon-edit"></i></span>
        <span>修改</span>
      </div>
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入商品名称"
        v-model="relatedGoodsList"
        :props="{  key: 'id',    label: 'goodsName'  }"
        :titles="['待关联', '已关联']"
        @change="handleTransferChange"
        :data="allGoodsList">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitTransfer">确 定</el-button>
          <el-button @click="transferOpen=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改采购商品信息对话框 -->
    <el-dialog :visible.sync="componentOpen" :close-on-click-modal="false" class="" append-to-body @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="components-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="商品名称" prop="goodsName" v-if="!readOnly">
                  <el-input v-model="form.goodsName" placeholder="请输入商品名称"/>
                </el-form-item>
                <el-form-item label="商品名称：" prop="goodsName" v-if="readOnly" class="custom-form-item">
                  {{form.goodsName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品规格" prop="standard" v-if="!readOnly">
                  <el-input v-model="form.standard" placeholder="请输入商品规格"/>
                </el-form-item>
                <el-form-item label="商品规格：" prop="standard" v-if="readOnly" class="custom-form-item">
                  {{form.standard}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="首次购进时间" prop="firstBuyTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item"
                                  v-model="form.firstBuyTime"
                                  type="datetime"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择首次购进时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="首次购进时间：" prop="firstBuyTime" v-if="readOnly" class="custom-form-item">
                  {{form.firstBuyTime}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品条码" prop="barcode" v-if="!readOnly">
                  <el-input v-model="form.barcode" placeholder="请输入商品条码"/>
                </el-form-item>
                <el-form-item label="商品条码：" prop="barcode" v-if="readOnly" class="custom-form-item">
                  {{form.barcode}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计量单位" prop="goodsUnit" v-if="!readOnly">
                  <el-select v-model="form.goodsUnit" placeholder="请选择计量单位" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsUnitOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="计量单位：" prop="goodsUnit" v-if="readOnly" class="custom-form-item">
                  {{goodsUnitFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="保质期(天)" prop="qualityDays" v-if="!readOnly">
                  <el-input v-model="form.qualityDays" placeholder="请输入保质期(天)"/>
                </el-form-item>
                <el-form-item label="保质期(天)：" prop="qualityDays" v-if="readOnly" class="custom-form-item">
                  {{form.qualityDays}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品价格(元)" prop="price" v-if="!readOnly">
                  <el-input v-model="form.price" placeholder="请输入商品价格(元)"/>
                </el-form-item>
                <el-form-item label="商品价格(元)：" prop="price" v-if="readOnly" class="custom-form-item">
                  {{form.price}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生产企业" prop="manufacturer" v-if="!readOnly">
                  <el-input v-model="form.manufacturer" placeholder="请输入生产企业"/>
                </el-form-item>
                <el-form-item label="生产企业：" prop="manufacturer" v-if="readOnly" class="custom-form-item">
                  {{form.manufacturer}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品产地" prop="productPlace" v-if="!readOnly">
                  <el-input v-model="form.productPlace" placeholder="请输入商品产地"/>
                </el-form-item>
                <el-form-item label="商品产地：" prop="productPlace" v-if="readOnly" class="custom-form-item">
                  {{form.productPlace}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否进口" prop="inlet" v-if="!readOnly">
                  <el-radio-group v-model="form.inlet">
                    <el-radio :key="0" :label="'0'">否</el-radio>
                    <el-radio :key="1" :label="'1'">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否进口：" prop="inlet" v-if="readOnly" class="custom-form-item">
                  {{inletFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品包装形式" prop="packageType" v-if="!readOnly">
                  <el-select v-model="form.packageType" placeholder="请选择商品包装形式" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsWrapTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="商品包装形式：" prop="packageType" v-if="readOnly" class="custom-form-item">
                  {{packageTypeFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品类型" prop="goodsType" v-if="!readOnly">
                  <el-select v-model="form.goodsType" placeholder="请选择商品类型" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="商品类型：" prop="goodsType" v-if="readOnly" class="custom-form-item">
                  {{goodsTypeFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品存储方式" prop="keepMethod" v-if="!readOnly">
                  <el-select v-model="form.keepMethod" placeholder="请选择商品存储方式" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsKeepMethodOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="商品存储方式：" prop="keepMethod" v-if="readOnly" class="custom-form-item">
                  {{keepMethodFormat(form)}}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="operationType != 3">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
        <div v-if="operationType == 3">
          <el-button type="" @click="cancel">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listPurchaseGoods,
    getPurchaseGoods,
    delPurchaseGoods,
    addPurchaseGoods,
    updatePurchaseGoods,
    exportPurchaseGoods,
    updateRelate
  } from "@/api/purchaseManage/purchaseGoods";
  import $ from "jquery";

  export default {
    name: 'PurchaseGoods',
    props: {
      acceptDataList: {
        type: Array,
        default: () => []
      },
      supplierId: {
        type: Number,
        default: null
      },
      showModifyButton:{
        type:Boolean,
        default: true
      }
    },
    data() {
      return {
        transferOpen: false,
        relatedGoodsList: [],
        allGoodsList: [],
        leftDefaultList:[2,4],
        rightDefaultList:[3],
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
        componentOpen: false,
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
          params: {
            beginFirstBuyTime: undefined,
            endFirstBuyTime: undefined,
          }
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        columnLabel: '',
        goodsUnitOptions: [],
        goodsWrapTypeOptions: [],
        goodsTypeOptions: [],
        goodsKeepMethodOptions: []
      };
    },
    watch: {
/*      '$store.state.app.screenHeight': function () { //监听屏幕高度变化
        if (this.$refs.table.$el.offsetTop) {
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
        } else {
          this.tableHeight = window.innerHeight - 62 - 148;
        }
        this.openDialog();
      } */
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
      this.getAllList();
      this.getList();
    },
    methods: {
      beforeOpenTransfer(){
        this.relatedGoodsList = []
        this.purchaseGoodsList.forEach(item=>{
          this.relatedGoodsList.push(item.id)
        })
      },
      submitTransfer(){
        updateRelate({supplierId: this.supplierId,goodsList:this.relatedGoodsList}).then(res=>{
          this.transferOpen = false;
          this.msgSuccess();
          this.handleQuery();
        }).catch(er=>{
          console.log(er)
        })
      },
      handleTransferChange(value,direction,movedKeys){
        // console.log(value,direction,movedKeys)
      },
      filterMethod(query, item) {
        return item.goodsName.indexOf(query) > -1;
      },
      inletFormat(row, column) {
        if (row.inlet && row.inlet == '1') {
          return '是'
        } else {
          return '否'
        }
      },
      goodsUnitFormat(row, column) {
        return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
      },
      packageTypeFormat(row, column) {
        return this.selectDictLabel(this.goodsWrapTypeOptions, row.packageType);
      },
      goodsTypeFormat(row, column) {
        return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
      },
      keepMethodFormat(row, column) {
        return this.selectDictLabel(this.goodsKeepMethodOptions, row.keepMethod);
      },
      /** 查询采购商品信息列表 */
      getList() {
        this.loading = true;
        this.queryParams.params.beginFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[0] : undefined;
        this.queryParams.params.endFirstBuyTime = this.queryParams.firstBuyTimeRange && this.queryParams.firstBuyTimeRange.length > 0 ? this.queryParams.firstBuyTimeRange[1] : undefined;
        this.queryParams.supplierId = this.supplierId;
        listPurchaseGoods(this.queryParams).then(response => {
          this.purchaseGoodsList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getAllList() {
        listPurchaseGoods({}).then(response => {
          this.allGoodsList = response.rows;
        });
      },
      // 取消按钮
      cancel() {
        this.componentOpen = false;
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
          delFlag: undefined
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
        this.handleQuery();
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
        this.componentOpen = true;
        this.title = "添加";
        this.dialogIcon = 'el-icon-plus';
        this.readOnly = false;
        this.operationType = 1;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getPurchaseGoods(id).then(response => {
          this.form = response.data;
          this.componentOpen = true;
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
        getPurchaseGoods(id).then(response => {
          this.form = response.data;
          this.componentOpen = true;
          this.title = "详情";
          this.dialogIcon = 'el-icon-view';
          this.readOnly = true;
          this.operationType = 3;
        });
      },
      handleDoubleClick(row, column, event) {
        this.handleView(row);
      },
      openDialog() {
        // $('.components-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
      },
      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updatePurchaseGoods(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.componentOpen = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              });
            } else {
              addPurchaseGoods(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.componentOpen = false;
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
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
      });
    }
  };
</script>
<style>
  .el-transfer-panel__body{
    height: 450px;
  }
</style>
<style scoped>
  .form-item {
    width: 100%;
  }
</style>
