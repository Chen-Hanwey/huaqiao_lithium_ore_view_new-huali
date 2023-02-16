<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">设备名称</label>
          <el-form-item label="" prop="name" class="custom-el-form-item">
            <el-input v-model="queryParams.name" class="query-param" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['device:deviceBase:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['device:deviceBase:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['device:deviceBase:remove']">删除
            </el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">设备类型</label>
          <el-form-item label="" prop="type">
            <el-select v-model="queryParams.type" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">所属部门</label>
          <el-form-item label="" prop="deptId">
            <treeselect class="query-param" v-model="queryParams.deptId" :options="deptOptions" placeholder="--全部--" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">厂家</label>
          <el-form-item label="" prop="manufacturer">
            <el-input v-model="queryParams.manufacturer" class="query-param" placeholder="请输入厂家" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">购置日期</label>
          <el-form-item label="" prop="buyDate">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.buyDateRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择购置日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">设备状态</label>
          <el-form-item label="" prop="state">
            <el-input v-model="queryParams.state" class="query-param" placeholder="请输入设备状态" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="deviceBaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" align="left" prop="name" sortable :render-header="renderHeader" />
      <el-table-column label="设备类型" align="left" prop="type" :formatter="typeFormat" sortable :render-header="renderHeader" />
      <el-table-column label="所属部门" align="left" prop="deptName" sortable :render-header="renderHeader" />
      <el-table-column label="厂家" align="left" prop="manufacturer" sortable :render-header="renderHeader" :show-overflow-tooltip="true" />
      <el-table-column label="型号" align="left" prop="model" sortable :render-header="renderHeader" />
      <!--      <el-table-column label="规格" align="left" prop="spec" sortable :render-header="renderHeader"/>-->
      <el-table-column label="经度" align="left" prop="longitude" sortable :render-header="renderHeader" />
      <el-table-column label="纬度" align="left" prop="latitude" sortable :render-header="renderHeader" />
      <el-table-column label="购置日期" align="left" prop="buyDate" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备状态" align="left" prop="state" :formatter="stateFormat" sortable :render-header="renderHeader" />
<!--
      <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader" :show-overflow-tooltip="true" />
-->
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['device:deviceBase:query']">详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['device:deviceBase:edit']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['device:deviceBase:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改设备基础信息对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class=" _baseForm_big" >
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="deviceBase-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="设备名称" prop="name" v-if="!readOnly">
                  <el-input v-model="form.name" placeholder="请输入设备名称" />
                </el-form-item>
                <el-form-item label="设备名称：" prop="name" v-if="readOnly" class="custom-form-item">
                  {{ form.name }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备类型" prop="type" v-if="!readOnly">
                  <el-select v-model="form.type" placeholder="请选择设备类型" class="customSelect ">
                    <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备类型：" prop="type" v-if="readOnly" class="custom-form-item">
                  {{ typeFormat(form) }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属部门" prop="deptId" v-if="!readOnly">
                  <treeselect width="220px" v-model="form.deptId" :options="deptOptions" placeholder="请选择所属部门" />
                </el-form-item>
                <el-form-item label="所属部门：" prop="deptId" v-if="readOnly" class="custom-form-item">
                  {{ form.deptName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="厂家" prop="manufacturer" v-if="!readOnly">
                  <el-input v-model="form.manufacturer" placeholder="请输入厂家" />
                </el-form-item>
                <el-form-item label="厂家：" prop="manufacturer" v-if="readOnly" class="custom-form-item">
                  {{ form.manufacturer }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="型号" prop="model" v-if="!readOnly">
                  <el-input v-model="form.model" placeholder="请输入型号" />
                </el-form-item>
                <el-form-item label="型号：" prop="model" v-if="readOnly" class="custom-form-item">
                  {{ form.model }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="规格" prop="spec" v-if="!readOnly">
                  <el-input v-model="form.spec" placeholder="请输入规格" />
                </el-form-item>
                <el-form-item label="规格：" prop="spec" v-if="readOnly" class="custom-form-item">
                  {{ form.spec }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="购置日期" prop="buyDate" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="" v-model="form.buyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择购置日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="购置日期：" prop="buyDate" v-if="readOnly" class="custom-form-item">
                  {{ form.buyDate }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备状态" prop="state" v-if="!readOnly">
                  <el-select v-model="form.state" placeholder="请选择设备状态" class="customSelect ">
                    <el-option v-for="dict in stateOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备状态：" prop="state" v-if="readOnly" class="custom-form-item">
                  {{ stateFormat(form) }}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">地理坐标</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="经度" prop="longitude" v-if="!readOnly">
                  <el-input v-model="form.longitude" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="经度：" prop="longitude" v-if="readOnly" class="custom-form-item">
                  {{ form.longitude }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="纬度" prop="latitude" v-if="!readOnly">
                  <el-input v-model="form.latitude" placeholder="请输入纬度" />
                </el-form-item>
                <el-form-item label="纬度：" prop="latitude" v-if="readOnly" class="custom-form-item">
                  {{ form.latitude }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="位置信息" v-if="!readOnly">
                  <div class="amap-page-container1">
                    <a-map ref="location-edit" v-if="open" :lng="form.longitude" :lat="form.latitude" @maker="getMaker" :marker-edit="true" :title="form.name" />
                  </div>
                </el-form-item>
                <el-form-item label="位置信息：" class="custom-form-item" v-if="readOnly">
                  <div class="amap-page-container1" style="padding-top: 10px;margin-bottom: 10px;">
                    <a-map ref="location-unedit" v-if="open" :lng="form.longitude" :lat="form.latitude" :marker-edit="false" :title="form.name" />
                  </div>
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

import deviceBase from "./deviceBase";

export default {

  ...deviceBase
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
.vue-treeselect__control {
  height: 32px;
}
.vue_treeselect .el-form-item__content {
  line-height: 31px;
}

.amap-page-container1 {
  width: 100%;
  height: 350px;
}

.form-item {
  width: 240px;
}

.el-tree {
  height: 100%;
}

.map-container {
}

.map-container .info {
  position: absolute;
  top: 0px;
  border-width: 0;
  opacity: 0.95;
}

.map-container .input-item {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

.map-container .input-item-prepend {
  margin-right: -1px;
}

.map-container .input-item-text {
  width: auto;
  padding: 0.4rem 0.7rem;
  display: inline-block;
  text-align-last: justify;
  align-items: center;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
}

.map-container .tipinput {
  margin-top: 10px;
  margin-left: 10px;
  width: 350px;
}
</style>
