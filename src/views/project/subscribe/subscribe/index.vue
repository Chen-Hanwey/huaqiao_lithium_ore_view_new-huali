<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">类型名称</label>
          <el-form-item label="" prop="type" class="custom-el-form-item">
            <el-input v-model="queryParams.type" class="query-param" placeholder="请输入类型名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['subscribe:subscribe:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['subscribe:subscribe:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['subscribe:subscribe:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">类型编号</label>
          <el-form-item label="" prop="typeName">
            <el-input v-model="queryParams.typeName" class="query-param" placeholder="请输入类型编号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">状态</label>
          <el-form-item label="" prop="status">
            <el-select v-model="queryParams.status" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">订阅时间</label>
          <el-form-item label="" prop="subscribeTime">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.subscribeTimeRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择订阅时间">
            </el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="subscribeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名称" align="left" prop="type" sortable :render-header="renderHeader" />
      <el-table-column label="类型编号" align="left" prop="typeName" sortable :render-header="renderHeader" />
      <el-table-column label="状态" align="left" prop="status" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ fomartStatus(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="left" prop="subscribeTime" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.subscribeTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['subscribe:subscribe:query']">详情</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-edit" v-if="scope.row.status=='0'" @click="handleUpdate(scope.row)" v-hasPermi="['subscribe:subscribe:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status=='0'" @click="handleDelete(scope.row)" v-hasPermi="['subscribe:subscribe:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-s-promotion" v-if="scope.row.status=='0'" @click="subscribe(scope.row)" v-hasPermi="['subscribe:subscribe:remove']">订阅</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-if="scope.row.status=='1'" @click="unSubscribe(scope.row)" v-hasPermi="['subscribe:subscribe:remove']">取消订阅</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改事件订阅对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="_baseForm_small" >
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="subscribe-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="类型名称" prop="type" v-if="!readOnly">
                  <el-input v-model="form.type" placeholder="请输入类型名称" />
                </el-form-item>
                <el-form-item label="类型名称：" prop="type" v-if="readOnly" class="custom-form-item">
                  {{form.type}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类型编号" prop="typeName" v-if="!readOnly">
                  <el-input v-model="form.typeName" placeholder="请输入类型编号" />
                </el-form-item>
                <el-form-item label="类型编号：" prop="typeName" v-if="readOnly" class="custom-form-item">
                  {{form.typeName}}
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="状态，是否被订阅" prop="status" v-if="!readOnly">
                  <el-radio-group v-model="form.status" class="customRadio form-item">
                    <el-radio label="1">请选择字典生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="状态，是否被订阅：" prop="status" v-if="readOnly" class="custom-form-item">
                  {{statusFormat(form)}}
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="8">
                <el-form-item label="订阅时间" prop="subscribeTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.subscribeTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择订阅时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="订阅时间：" prop="subscribeTime" v-if="readOnly" class="custom-form-item">
                  {{form.subscribeTime}}
                </el-form-item>
              </el-col> -->
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
import subscribe from "./subscribe";
export default {
  ...subscribe
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
