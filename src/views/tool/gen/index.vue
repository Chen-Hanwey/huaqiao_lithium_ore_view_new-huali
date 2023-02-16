<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px;">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">表名称</label>
          <el-form-item label="" prop="tableName" class="custom-el-form-item">
            <el-input class="query-param"
              v-model="queryParams.tableName"
              placeholder="请输入表名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button
              type="primary"
              icon="el-icon-download"
              size="mini"
              @click="handleGenTable"
              v-hasPermi="['tool:gen:code']"
            >生成</el-button>
            <el-button
              type="primary"
              icon="el-icon-upload"
              size="mini"
              @click="openImportTable"
              v-hasPermi="['tool:gen:import']"
            >导入</el-button>
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['tool:gen:remove']"
            >删除</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item">
          <label class="condition-item-title">表描述</label>
          <el-form-item label="" prop="tableComment">
            <el-input class="query-param"
              v-model="queryParams.tableComment"
              placeholder="请输入表描述"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">创建时间</label>
          <el-form-item label="">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="tableList" @sort-change="changeTableSort" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="序号" type="index" width="60">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="表名称"
        align="left"
        prop="tableName"
        :show-overflow-tooltip="true"
        width="220" sortable
      />
      <el-table-column
        label="表描述"
        align="left"
        prop="tableComment"
        :show-overflow-tooltip="true"
        width="200" sortable
      />
      <el-table-column
        label="实体"
        align="left"
        prop="className"
        :show-overflow-tooltip="true"
        width="200" sortable
      />
      <el-table-column label="创建时间" align="left" prop="createTime" width="160" sortable/>
      <el-table-column label="更新时间" align="left" prop="updateTime" width="160" sortable/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-document"
            @click="handlePreview(scope.row)"
            v-hasPermi="['tool:gen:preview']"
          >预览</el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
            @click="handleEditTable(scope.row)"
            v-hasPermi="['tool:gen:edit']"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tool:gen:remove']"
          >删除</el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-download"
            @click="handleGenTable(scope.row)"
            v-hasPermi="['tool:gen:code']"
          >生成代码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[100, 200, 500, 1000]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 预览界面 -->
    <el-dialog :visible.sync="preview.open" fullscreen :close-on-click-modal="false" @opened="openDialog"
               class="customForm1">
      <div slot="title">
        <span><i class="el-icon-document"></i></span>
        <span> {{ preview.title }}</span>
      </div>
      <div class="gencode-body"></div>
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
          :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
          :key="key"
        >
          <pre class="gencodeClass">{{ value }}</pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <import-table ref="import" @ok="handleQuery" />
  </div>
</template>

<script>
  import gen from './gen';
  export default {
    ...gen
  }
</script>
