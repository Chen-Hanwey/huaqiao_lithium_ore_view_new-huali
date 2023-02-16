<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">月份</label>
          <el-form-item label="" prop="monyh" class="custom-el-form-item">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.monyhRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择月份">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['month:month:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['month:month:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['month:month:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">计划产量(吨)</label>
          <el-form-item label="" prop="planProduction">
            <el-input v-model="queryParams.planProduction" class="query-param" placeholder="请输入计划产量" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="monthList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="月份" align="left" prop="monyh" width="100" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.monyh }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划产量（吨）" align="left" prop="planProduction" sortable :render-header="renderHeader" />

      <el-table-column label="创建时间" align="left" prop="createTime" sortable :render-header="renderHeader" />

      <el-table-column label="创建人" align="left" prop="createBy" sortable :render-header="renderHeader" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-document" @click="handleView(scope.row)" v-hasPermi="['month:month:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['month:month:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['month:month:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改月度计划对话框 -->
    <el-dialog :visible.sync="open" fullscreen :close-on-click-modal="false" class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="month-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="月份" prop="monyh" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.monyh" type="month" value-format="yyyy-MM" placeholder="选择月份">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="月份：" prop="monyh" v-if="readOnly" class="custom-form-item">
                  {{form.monyh}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计划产量（吨）" prop="planProduction" v-if="!readOnly">
                  <el-input v-model="form.planProduction" placeholder="请输入计划产量" />
                </el-form-item>
                <el-form-item label="计划产量（吨）：" prop="planProduction" v-if="readOnly" class="custom-form-item">
                  {{form.planProduction}}
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
          <el-button type="primary" @click="cancel">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import month from "./month";
export default {
  ...month
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
