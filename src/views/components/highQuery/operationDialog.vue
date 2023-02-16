<template>
  <el-dialog title="选择经营场所" :visible.sync="visible" v-if="visible"
             append-to-body class="_baseForm_small"
             :before-close="close" :close-on-click-modal="false">
    <div >
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
                <label class="condition-item-title" v-if="showEnterprise&&queryParams.enterpriseName&&queryParams.enterpriseName!=''">企业名称</label>
                <el-form-item label="" prop="enterpriseName" class="custom-el-form-item">
                  <el-input v-model="queryParams.enterpriseName" class="query-param " style="width:180px"
                            placeholder="" disabled v-if="showEnterprise&&queryParams.enterpriseName&&queryParams.enterpriseName!=''"
                            clearable size="small"/>
                </el-form-item>
                <label class="condition-item-title">经营场所名称</label>
                <el-form-item label="" prop="name" class="custom-el-form-item">
                  <el-input v-model="queryParams.name" class="query-param " style="width:180px"
                            placeholder="请输入经营场所名称"
                            clearable size="small"/>
                </el-form-item>
              </div>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
              <el-button plain icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </div>

          </el-form>
          <el-table ref="table" v-loading="loading" stripe
                    height="380" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                    :data="operationManageList" @selection-change="selectionChange" @current-change="currentChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="企业名称" align="center" width="180px" prop="enterpriseName"
                             :render-header="renderHeader"/>
            <el-table-column label="经营场所名称" align="center" prop="name" width="150px" :render-header="renderHeader"/>
            <el-table-column label="行业类别" :formatter="enterpriseTypeFormat" width="80px" align="left" prop="bigType"
                             :render-header="renderHeader"/>
            <el-table-column label="负责人" align="center" prop="concat" :render-header="renderHeader"/>
            <el-table-column label="负责人联系方式" align="center" prop="concatPhone" :render-header="renderHeader"/>
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
</template>
<script>
// import $ from 'jquery'
import {listEnterprise} from "@/api/enterprise/enterprise";
import {listDistrict} from "@/api/system/district";
import {listOperationManage} from "@/api/operationManage/operationManage";

export default {
  name: 'operationDialog',
  props: {
    showEnterprise: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      visible: false,
      pageList: [10, 20, 30, 50],
      total: 0,
      operationManageList: null,
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
      },
      curOperationId: undefined
    }
  },
  created() {

  },
  beforeMount() {
  },
  mounted() {
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
    }, tableHeight: function () {
      return '360px';
    }
  },
  methods: {
    show(enterpriseId, enterpriseName) {
      this.visible = true;
      this.queryParams.enterpriseId = enterpriseId;
      this.queryParams.enterpriseName = enterpriseName;
      this.handleQuery();
      this.getDicts("enterprise_type").then(response => {
        this.enterpriseTypeOptions = response.data;
      });
    },
    save() {
      let selection = this.$refs.table.selection;
      (selection.length>0)?(this.curOperationId = selection[0].id):(this.curOperationId=undefined)
      this.$emit('callBack', selection, this.callBack);
      this.close();
    },
    close() {
      this.visible = false;
      this.resetQuery()
    },
    handleQuery() {
      this.loading = true;
      listOperationManage(this.queryParams).then(response => {
        this.operationManageList = response.rows;
        this.total = response.total;
        this.loading = false;
        if (this.curOperationId){
          this.$nextTick(()=>{
            for (let i = 0; i < this.operationManageList.length; i++) {
              if (this.curOperationId == this.operationManageList[i].id){
                this.$refs.table.toggleRowSelection(this.operationManageList[i],true)
              }
            }
          })
        }
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
      this.$refs.table.toggleRowSelection(currentRow)
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

