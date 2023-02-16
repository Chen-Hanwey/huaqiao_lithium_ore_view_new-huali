<template>
  <div>
  <el-dialog title="选择采购记录" :visible.sync="visible" v-if="visible"
             append-to-body class="_baseForm_small"
             :before-close="close" :close-on-click-modal="false">
    <div class="app-container" >
      <el-row :gutter="7">
        <el-col :span="24" :xs="24">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="68px"
            style="margin-bottom: 5px">
            <div class="con-container">
              <div class="lab-container">
                <label class="condition-item-title" v-if="showEnterprise">企业名称</label>
                <el-form-item label="" prop="enterpriseName" class="custom-el-form-item">
                  <el-input v-model="queryParams.enterpriseName" class="query-param " style="width:180px"
                            placeholder="请输入企业名称" v-if="showEnterprise"
                            clearable size="small"/>
                </el-form-item>
                <!-- <label class="condition-item-title">经营场所名称</label>
                <el-form-item label="" prop="name" class="custom-el-form-item">
                  <el-input v-model="queryParams.operationName" class="query-param " style="width:180px"
                            placeholder="请输入经营场所名称"
                            clearable size="small"/>
                </el-form-item> -->
              </div>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
              <el-button plain icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </div>

          </el-form>
          <el-table ref="table" v-loading="loading" stripe
                    :style="{height: tableHeight}" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                    :data="purchaseRecordList" @selection-change="selectionChange" @current-change="currentChange">
            <el-table-column type="selection" width="55" align="center"/>
                       <el-table-column label="企业名称" align="center" width="180px" prop="enterpriseName"
                                        :render-header="renderHeader"/>
            <!-- <el-table-column label="经营场所名称" align="center" prop="operationName" width="150px" :render-header="renderHeader"/> -->
            <el-table-column label="供应商" align="left" prop="supplierName" sortable :render-header="renderHeader"/>
            <el-table-column label="购进单号" align="left" prop="orderNum" sortable :render-header="renderHeader"/>
            <el-table-column label="购进时间" align="left" prop="purchaseTime" width="150" sortable :render-header="renderHeader"></el-table-column>
            <el-table-column label="购进总额" align="left" prop="totalMoney" sortable :render-header="renderHeader"/>
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width" >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  @click="curPurchaseId = scope.row.id;$refs.pur_dtl.open = true"
                  v-hasPermi="['inOutWarehouse:purchaseStorage:query']"
                >详情</el-button>
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
    <PurchaseDetailDialog ref="pur_dtl" :purchase-id="curPurchaseId"></PurchaseDetailDialog>
  </div>
</template>
<script>
// import $ from 'jquery'
import {listEnterprise} from "@/api/enterprise/enterprise";
import {listDistrict} from "@/api/system/district";
import {listOperationManage} from "@/api/operationManage/operationManage";
import {listPurchaseRecord} from "@/api/purchaseManage/purchaseRecord";
import PurchaseDetailDialog from "@/views/purchaseManage/components/PurchaseDetailDialog";
import {mapGetters} from "vuex";

export default {
  name: 'purchaseRecordDialog',
  components: {PurchaseDetailDialog},
  props: {
    showEnterprise: {
      type: Boolean,
      default: true
    },
    inspectionStatus: {
      type: String,
      default: undefined
    },
    purchased: {

    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      visible: false,
      pageList: [10, 20, 30, 50],
      total: 0,
      operationManageList: null,
      purchaseRecordList: [],
      // 企业类型字典
      enterpriseTypeOptions: [],
      districtDisabled: true,
      queryDistrictList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        order: undefined,
        name: undefined,
        enterpriseId: undefined,
        operationId: undefined,
        enterpriseName: undefined,
        // purchased: 2
      },
      // curOperationId: undefined
      curPurchaseId: undefined,
    }
  },
  created() {
    this.handleQuery()
  },
  beforeMount() {
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
    ...mapGetters(['enterpriseId']),
    contentHeight: function () {
      return '410px';
    }, tableHeight: function () {
      return '360px';
    },
  },
  methods: {
    handleViewRecord(id){

    },
    save() {
      let selection = this.$refs.table.selection;
      // (selection.length>0)?(this.curOperationId = selection[0].id):(this.curOperationId=undefined)
      if (selection.length == 0){
        this.$message.info('请选择采购记录')
        return
      }
      if (selection.length > 1){
        this.$message.info('只能选择一个')
        return
      }
      this.$emit('callBack', selection[0]);
      this.close();
    },
    close() {
      this.visible = false;
      this.resetQuery()
    },
    handleQuery() {
      this.loading = true;
      // let enterpriseId = this.enterpriseId
      listPurchaseRecord({...this.queryParams,purchased:this.purchased,inspectionStatus: this.inspectionStatus}).then(response => {
        this.purchaseRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        order: undefined,
        name: undefined,
        enterpriseId: this.queryParams.enterpriseId,
        enterpriseName: this.queryParams.enterpriseName,
        purchased: 2
      }
      this.curOperationId = undefined
      this.handleQuery();
    },
    selectionChange(val) {
      if (val.length > 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(val.pop())
      } else {
      }
    },
    currentChange(currentRow, oldCurrentRow) {
      // this.$refs.table.toggleRowSelection(currentRow)
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
    // 企业类别字典翻译
    enterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.enterpriseTypeOptions, row.bigType);
    },
  },
}
</script>

