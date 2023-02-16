<template>
  <div class="app-container" style="height: 100%">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" >
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">工单来源</label>
          <el-form-item label="" prop="wfOrderType" class="custom-el-form-item">
            <el-select v-model="queryParams.wfOrderType" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option
                v-for="dict in wfOrderTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <!--            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>-->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!--            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['wfOrder:wfOrder:remove']">删除</el-button>-->
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table key="two" ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="'calc(100% - 0px)'" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="demoData" >
      <el-table-column label="序号" type="index" width="90" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单来源" align="left" prop="wfOrderType" :formatter="wfOrderTypeFormat"  :render-header="renderHeader"/>
      <el-table-column label="工单名称" align="left" prop="orderName"  :render-header="renderHeader"/>
      <el-table-column label="当前环节" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
      <el-table-column label="开始时间" align="left" prop="createTime"  :render-header="renderHeader" width="160">
      </el-table-column>
      <el-table-column label="到达时间" align="left" prop="updateTime" :render-header="renderHeader" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="70">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['wfOrder:wfOrder:query']"
          >处理</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :page-sizes="pageList"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <enterprise-approval-audit ref="enterpriseApprovalAudit" @submit="getList"></enterprise-approval-audit>
    <certificate-audit ref="dialog1" ></certificate-audit>
  </div>
</template>

<script>
import wfOrder from "./doneWork";
export default {
  ...wfOrder
}
</script>
<style scoped>
.form-item{
  width: 100%;
}
</style>
