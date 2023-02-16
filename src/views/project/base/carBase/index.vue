<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">车牌号</label>
          <el-form-item label="" prop="licenseNo" class="custom-el-form-item">
            <el-input v-model="queryParams.licenseNo" class="query-param" placeholder="请输入车牌号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['base:carBase:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['base:carBase:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['base:carBase:remove']">删除
            </el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">车型</label>
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
          <label class="condition-item-title">购置日期</label>
          <el-form-item label="" prop="buyDate">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.buyDateRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择购置日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">车辆状态</label>
          <el-form-item label="" prop="state">
            <el-select v-model="queryParams.state" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option v-for="dict in stateOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="carBaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" align="left" prop="licenseNo" sortable :render-header="renderHeader" />
      <el-table-column label="车型" align="left" prop="type" :formatter="typeFormat" sortable :render-header="renderHeader" />
      <el-table-column label="所属部门" align="left" prop="deptName" sortable :render-header="renderHeader" />
      <el-table-column label="用途" align="left" prop="carUse" sortable :render-header="renderHeader" :show-overflow-tooltip="true" />
      <el-table-column label="购置日期" align="left" prop="buyDate" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.buyDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆状态" align="left" prop="state" :formatter="stateFormat" sortable :render-header="renderHeader" />
      <!--  <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader" :show-overflow-tooltip="true" />
-->
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['base:carBase:query']">详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['base:carBase:edit']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['base:carBase:remove']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改车辆基础信息对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="_baseForm_big">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="carBase-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="车牌号" prop="licenseNo" v-if="!readOnly">
                  <el-input v-model="form.licenseNo" placeholder="请输入车牌号" />
                </el-form-item>
                <el-form-item label="车牌号：" prop="licenseNo" v-if="readOnly" class="custom-form-item">
                  {{ form.licenseNo }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="车型" prop="type" v-if="!readOnly">
                  <el-select v-model="form.type" placeholder="请选择车型" class="customSelect form-item">
                    <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车型：" prop="type" v-if="readOnly" class="custom-form-item">
                  {{ typeFormat(form) }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属部门" prop="deptId" v-if="!readOnly">
                  <treeselect v-model="form.deptId" :options="deptOptions" placeholder="请选择所属部门" />
                </el-form-item>
                <el-form-item label="所属部门：" prop="deptId" v-if="readOnly" class="custom-form-item">
                  {{ form.deptName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="用途" prop="carUse" v-if="!readOnly">
                  <el-input v-model="form.carUse" placeholder="请输入用途" maxlength="100" />
                </el-form-item>
                <el-form-item label="用途：" prop="carUse" v-if="readOnly" class="custom-form-item">
                  {{ form.carUse }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="购置日期" prop="buyDate" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.buyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择购置日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="购置日期：" prop="buyDate" v-if="readOnly" class="custom-form-item">
                  {{ form.buyDate }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="车辆状态" prop="state" v-if="!readOnly">
                  <el-select v-model="form.state" placeholder="请选择车辆状态" class="customSelect form-item">
                    <el-option v-for="dict in stateOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆状态：" prop="state" v-if="readOnly" class="custom-form-item">
                  {{ stateFormat(form) }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="司机名称" prop="personName" v-if="!readOnly">
                  <el-input v-model="form.personName" placeholder="请输入司机名称" maxlength="100" />
                </el-form-item>
                <el-form-item label="司机名称：" prop="personName" v-if="readOnly" class="custom-form-item">
                  {{ form.personName }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="司机手机号" prop="personNumber" v-if="!readOnly">
                  <el-input v-model="form.personNumber" placeholder="请输入司机手机号" maxlength="100" />
                </el-form-item>
                <el-form-item label="司机手机号" prop="personNumber" v-if="readOnly" class="custom-form-item">
                  {{ form.personNumber }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="是否安装定位" prop="positioning" v-if="!readOnly">
                  <el-radio-group v-model="form.positioning">
                    <el-radio :label="'0'">未安装</el-radio>
                    <el-radio :label="'1'">已安装</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否安装定位" prop="sex" v-if="readOnly" class="custom-form-item">
                  {{formats(form.positioning)}}
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="备注" prop="remark" v-if="!readOnly">
                  <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" maxlength="100" :show-word-limit="true" />
                </el-form-item>
                <el-form-item label="备注" prop="remark" v-if="readOnly">
                  {{ form.remark }}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="sub-project" v-if="readOnly">
          <div class="sub-title">
            <div class="sub-title-name">运行信息：</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="行驶状态:" prop="lng" v-if="readOnly" class="custom-form-item">
                  {{ form.status }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="车速:" prop="lng" v-if="readOnly" class="custom-form-item">
                  {{ formart(form.speed)}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="车辆位置:" prop="lng" v-if="readOnly" class="custom-form-item">
                  {{ form.address }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="经度" prop="lng" v-if="!readOnly">
                  <el-input v-model="form.lng" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="经度：" prop="lng" v-if="readOnly" class="custom-form-item">
                  {{ form.lng }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="纬度" prop="lat" v-if="!readOnly">
                  <el-input v-model="form.lat" placeholder="请输入纬度" />
                </el-form-item>
                <el-form-item label="纬度：" prop="lat" v-if="readOnly" class="custom-form-item">
                  {{ form.lat }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="位置信息" v-if="!readOnly">
                  <div class="amap-page-container1">
                    <a-map ref="location-edit" v-if="open" :lng="form.lng" :lat="form.lat" @maker="getMaker" :marker-edit="true" :title="form.name" />
                  </div>
                </el-form-item>
                <el-form-item label="位置信息：" class="custom-form-item" v-if="readOnly">
                  <div class="amap-page-container1" style="padding-top: 10px;margin-bottom: 10px;">
                    <a-map ref="location-unedit" v-if="open" :lng="form.lng" :lat="form.lat" :marker-edit="false" :title="form.name" />
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

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">

      <play></play>

    </el-dialog>

    <!-- <el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button> -->
  </div>
</template>

<script>
import carBase from "./carBase";

export default {
  ...carBase
}
</script>
<style scoped>
/* .form-item {
  width: 100%;
}
.vue-treeselect__control {
  height: 32px;
}
.vue_treeselect .el-form-item__content {
  line-height: 31px;
} */
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
