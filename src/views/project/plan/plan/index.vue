<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">总储量</label>
          <el-form-item label="" prop="totalReserves" class="custom-el-form-item">
            <el-input v-model="queryParams.totalReserves" class="query-param" placeholder="请输入总储量" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['plan:plan:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['plan:plan:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['plan:plan:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">可利用开采量</label>
          <el-form-item label="" prop="availableReserves">
            <el-input v-model="queryParams.availableReserves" class="query-param" placeholder="请输入可利用开采量" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">实际开采量</label>
          <el-form-item label="" prop="actualProduction">
            <el-input v-model="queryParams.actualProduction" class="query-param" placeholder="请输入实际开采量" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">年份</label>
          <el-form-item label="" prop="year">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.yearRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择年份">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">年度开采计划量</label>
          <el-form-item label="" prop="annualPlanned">
            <el-input v-model="queryParams.annualPlanned" class="query-param" placeholder="请输入年度开采计划量" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">年度实际开采量</label>
          <el-form-item label="" prop="annualActual">
            <el-input v-model="queryParams.annualActual" class="query-param" placeholder="请输入年度实际开采量" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总储量(吨)" align="left" prop="totalReserves" sortable :render-header="renderHeader" />
      <el-table-column label="可利用开采量(吨)" align="left" prop="availableReserves" sortable :render-header="renderHeader" />
      <el-table-column label="实际开采量(吨)" align="left" prop="actualProduction" sortable :render-header="renderHeader" />
      <el-table-column label="年份" align="left" prop="year" width="100" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.year }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年度开采计划量(吨)" align="left" prop="annualPlanned" sortable :render-header="renderHeader" />
      <el-table-column label="年度实际开采量(吨)" align="left" prop="annualActual" sortable :render-header="renderHeader" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['plan:plan:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['plan:plan:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['plan:plan:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改开采计划对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="_baseForm_small" >
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="plan-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="总储量(吨)" prop="totalReserves" v-if="!readOnly">
                  <el-input v-model="form.totalReserves" placeholder="请输入总储量" />
                </el-form-item>
                <el-form-item label="总储量(吨)：" prop="totalReserves" v-if="readOnly" class="custom-form-item">
                  {{form.totalReserves}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="可利用开采量(吨)" prop="availableReserves" v-if="!readOnly">
                  <el-input v-model="form.availableReserves" placeholder="请输入可利用开采量" />
                </el-form-item>
                <el-form-item label="可利用开采量(吨)：" prop="availableReserves" v-if="readOnly" class="custom-form-item">
                  {{form.availableReserves}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实际开采量(吨)" prop="actualProduction" v-if="!readOnly">
                  <el-input v-model="form.actualProduction" placeholder="请输入实际开采量" />
                </el-form-item>
                <el-form-item label="实际开采量(吨)：" prop="actualProduction" v-if="readOnly" class="custom-form-item">
                  {{form.actualProduction}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年份" prop="year" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.year" type="year" value-format="yyyy" placeholder="选择年份">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="年份：" prop="year" v-if="readOnly" class="custom-form-item">
                  {{form.year}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年度开采计划量(吨)" prop="annualPlanned" v-if="!readOnly">
                  <el-input v-model="form.annualPlanned" placeholder="请输入年度开采计划量" />
                </el-form-item>
                <el-form-item label="年度开采计划量(吨)：" prop="annualPlanned" v-if="readOnly" class="custom-form-item">
                  {{form.annualPlanned}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年度实际开采量(吨)" prop="annualActual" v-if="!readOnly">
                  <el-input v-model="form.annualActual" placeholder="请输入年度实际开采量" />
                </el-form-item>
                <el-form-item label="年度实际开采量(吨)：" prop="annualActual" v-if="readOnly" class="custom-form-item">
                  {{form.annualActual}}
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
import plan from "./plan";
export default {
  ...plan
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
