<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">区域名称</label>
          <el-form-item label="" prop="name" class="custom-el-form-item">
            <el-input
              v-model="queryParams.name" class="query-param"
              placeholder="请输入区域名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
<!--            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>-->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['district:district:add']"
            >新增
            </el-button>
<!--            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['district:district:export']"
            >导出</el-button>-->
<!--            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['district:district:remove']">删除</el-button>-->
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">
        <div class="condition-item">
          <label class="condition-item-title">级别</label>
          <el-form-item label="" prop="level">
            <el-select v-model="queryParams.level" placeholder="请选择级别" size="small" class="query-param">
              <el-option
                v-for="dict in districtTypeList"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">描述</label>
          <el-form-item label="" prop="remark">
            <el-input
              v-model="queryParams.remark" class="query-param"
              placeholder="请输入描述"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              row-key="code"
              lazy
              :load="loadDistrict"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="districtList" @selection-change="handleSelectionChange"
    >
      <el-table-column label="区域名称" align="left" prop="name" min-width="180"/>
      <el-table-column label="区域代码" align="left" prop="code"/>
<!--      <el-table-column label="级别" align="left" :formatter="formatLevel" prop="level"/>-->
      <el-table-column label="经度" align="left" prop="longitude"/>
      <el-table-column label="纬度" align="left" prop="latitude"/>
      <el-table-column label="描述" align="left" prop="remark"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="240">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['district:district:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['district:district:edit']"
          >修改
          </el-button>
          <el-button v-if="scope.row.level != 5"
                     size="mini"
                     type="text"
                     icon="el-icon-plus"
                     @click="handleAdd(scope.row)"
                     v-hasPermi="['district:district:add']"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['district:district:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination
      :page-sizes="pageList"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />-->

    <!-- 新增或修改区域信息对话框 -->
    <el-dialog :visible.sync="open" fullscreen :close-on-click-modal="false" class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="modal-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入区域名称" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="区域代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入区域代码，如110000" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="行政号" prop="cityCode">
          <el-input v-model="form.cityCode" placeholder="请输入行政号，如010" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择级别" clearable size="small" :disabled="true"
                     class="customSelect"
          >
            <el-option
              v-for="dict in districtTypeList"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入描述" :readonly="readOnly"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="operationType != 3">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
        <div v-if="operationType == 3">
          <el-button type="primary" @click="cancel">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import district from './district'

export default {
  ...district
}
</script>
