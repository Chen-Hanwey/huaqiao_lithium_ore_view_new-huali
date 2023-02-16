<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
            <label class="condition-item-title">备份日期</label>
            <el-form-item label="" prop="backupDate" class="custom-el-form-item">
                <el-date-picker clearable size="small" style="width: 240px;"
                                v-model="queryParams.backupDateRange"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                placeholder="选择备份日期">
                </el-date-picker>
            </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleBackup"
                       v-hasPermi="['system:backupRecord:backup']">立即备份
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['system:backupRecord:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['system:backupRecord:remove']"
            >删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
            <label class="condition-item-title">大小</label>
              <el-form-item label="" prop="size">
                <el-input
                  v-model="queryParams.size" class="query-param"
                  placeholder="请输入大小"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
        <div class="condition-item">
            <label class="condition-item-title">操作用户</label>
              <el-form-item label="" prop="opUser">
                <el-input
                  v-model="queryParams.opUser" class="query-param"
                  placeholder="请输入操作用户"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
    <div class="condition-item">
        <label class="condition-item-title">创建时间</label>
        <el-form-item label="" prop="createTime">
          <el-date-picker clearable size="small" style="width: 240px;"
            v-model="queryParams.createTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
    </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="backupRecordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
    <el-table-column label="备份日期" align="left" prop="backupDate" min-width="110px" sortable :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.backupDate }}</span>
      </template>
    </el-table-column>
      <el-table-column label="大小" align="left" prop="size" sortable :render-header="renderHeader"/>
      <el-table-column label="操作用户" align="left" prop="opUser" sortable :render-header="renderHeader"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['system:backupRecord:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDownload(scope.row)"
            v-hasPermi="['system:backupRecord:download']"
          >下载</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:backupRecord:remove']"
          >删除</el-button>
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

    <!-- 新增或修改数据库备份记录对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="backupRecord-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="备份日期" prop="backupDate">
          <el-date-picker clearable size="small" style="width: 200px" :readonly="readOnly"
            v-model="form.backupDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择备份日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="大小" prop="size">
          <el-input v-model="form.size" placeholder="请输入大小" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="操作用户" prop="opUser">
          <el-input v-model="form.opUser" placeholder="请输入操作用户" :readonly="readOnly"/>
        </el-form-item>
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
    import backupRecord from "./backupRecord";
    export default {
        ...backupRecord
    }
</script>
