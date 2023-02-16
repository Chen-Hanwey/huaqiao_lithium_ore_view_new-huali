<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" class="custom-form">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">系统模块</label>
          <el-form-item label="" prop="title" class="custom-el-form-item">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入系统模块"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button
              type="warning" plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:config:export']"
            >导出</el-button>
            <el-button
              type="danger" plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['monitor:operlog:remove']"
            >删除</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleClean"
              v-hasPermi="['monitor:operlog:remove']"
            >清空</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item">
          <label class="condition-item-title">操作人员</label>
          <el-form-item label="" prop="operName">
            <el-input
              v-model="queryParams.operName"
              placeholder="请输入操作人员"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">类型</label>
          <el-form-item label="" prop="businessType">
            <el-select
              v-model="queryParams.businessType"
              placeholder="操作类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">状态</label>
          <el-form-item label="" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="操作状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">操作时间</label>
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

    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="list"
              @sort-change="changeTableSort"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" width="65">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统模块" align="left" prop="title" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作类型" align="left" prop="businessType" :formatter="typeFormat" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="请求方式" align="left" prop="requestMethod" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作人员" align="left" prop="operName" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="主机" align="left" prop="operIp" width="130" :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作地点" align="left" prop="operLocation" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作状态" align="left" prop="status" :formatter="statusFormat" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作日期" align="left" prop="operTime" width="180" sortable :render-header="(h,obj) => renderHeader(h,obj)">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
            v-hasPermi="['monitor:operlog:query']"
          >详细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :page-sizes="pageList"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / 修改</el-form-item>
            <el-form-item
              label="登录信息："
            >{{ form.operName }} / {{ form.operIp }} / {{ form.operLocation }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import log from './log'
export default {
  ...log
}
</script>

