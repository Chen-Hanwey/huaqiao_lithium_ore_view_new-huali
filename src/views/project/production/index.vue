<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">产量</label>
          <el-form-item label="" prop="production" class="custom-el-form-item">
            <el-input v-model="queryParams.production" class="query-param" placeholder="请输入产量" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!-- <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['production:production:add']">新增
            </el-button> -->
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['production:production:export']">导出
            </el-button>
            <!-- <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['production:production:remove']">删除</el-button> -->
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">上报时间</label>
          <el-form-item label="" prop="reportTime">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.reportTimeRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择上报时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="productionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="产量" align="left" prop="production" sortable :render-header="renderHeader" />
      <el-table-column label="上报人" align="left" prop="createBy" sortable :render-header="renderHeader" />
      <el-table-column label="上报时间" align="left" prop="reportTime" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ returnTime(scope.row.reportTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['production:production:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['production:production:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['production:production:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改矿山产量对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="_baseForm_small" >
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="production-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="产量" prop="production" v-if="!readOnly">
                  <el-input v-model="form.production" placeholder="请输入产量" />
                </el-form-item>
                <el-form-item label="产量：" prop="production" v-if="readOnly" class="custom-form-item">
                  {{form.production}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上报时间" prop="reportTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.reportTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择上报时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="上报时间：" prop="reportTime" v-if="readOnly" class="custom-form-item">
                  {{form.reportTime}}
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
import production from "./production";
export default {
  ...production
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
