<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">检查库名称</label>
          <el-form-item label="" prop="quesBankName" class="custom-el-form-item">
            <el-input
              v-model="queryParams.quesBankName" class="query-param"
              placeholder="请输入检查库名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="lab-container">
          <label class="condition-item-title">状态</label>
          <el-form-item label="" prop="typeStatus" class="custom-el-form-item">
            <el-select v-model="queryParams.typeStatus" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option v-for="(dic,index) in typeStatusDicList"
                         :key="index"
                         :label="dic.dictLabel"
                         :value="dic.dictValue"/>
            </el-select>
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['exam:quesBank:add']">新增
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['exam:quesBank:export']" v-if="false">导出
            </el-button>
<!--            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                       v-hasPermi="['exam:quesBank:remove']"
            >删除
            </el-button>-->
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="quesBankList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查库名称" align="left" prop="quesBankName" sortable :render-header="renderHeader"/>
      <el-table-column label="检查库描述" align="left" prop="quesBankDescribe" sortable :render-header="renderHeader"/>
      <el-table-column label="启用状态" align="left" prop="typeStatus" sortable :render-header="renderHeader"
                       :formatter="statusFormat"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['exam:quesBank:query']" v-if="false"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['exam:quesBank:edit']"
          >修改
          </el-button>
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['exam:quesBank:remove']"
          >删除
          </el-button>-->
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

    <!-- 新增或修改检查库分类管理对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" width="600px">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="quesBank-body">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="检查库名称" prop="quesBankName">
            <el-input v-model="form.quesBankName" placeholder="请输入检查库名称" :readonly="readOnly"/>
          </el-form-item>
          <el-form-item label="检查库描述" prop="quesBankDescribe">
            <el-input type="textarea" :rows="2" v-model="form.quesBankDescribe" placeholder="请输入检查库描述"
                      :readonly="readOnly"/>
          </el-form-item>
          <el-form-item label="启用状态" prop="typeStatus">
            <el-select v-model="form.typeStatus" size="small" :disabled="readOnly" class="customSelect">
              <el-option v-for="(dic,index) in typeStatusDicList"
                         :key="index"
                         :label="dic.dictLabel"
                         :value="dic.dictValue"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
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
    import quesBank from "./quesBank";

    export default {
        ...quesBank
    }
</script>
