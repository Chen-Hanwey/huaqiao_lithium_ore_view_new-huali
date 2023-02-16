<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">检查库</label>
          <el-form-item label="" prop="quesTypeId" class="custom-el-form-item">
            <el-select v-model="queryParams.quesBankId" placeholder="--全部--" clearable size="small" class="query-param"
                       filterable>
              <el-option v-for="(dic,index) in quesBankDicList"
                         :key="index"
                         :label="dic.quesBankName"
                         :value="dic.id"/>
            </el-select>
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       >新增
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            >删除
            </el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item">
          <label class="condition-item-title">类型</label>
          <el-form-item label="" prop="quesType">
            <el-select v-model="queryParams.quesType" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option v-for="(dic,index) in questionTypeDicList"
                         :key="index"
                         :label="dic.dictLabel"
                         :value="dic.dictValue"/>
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">关键字</label>
          <el-form-item label="" prop="keywords">
            <el-input
              v-model="queryParams.keywords" class="query-param"
              placeholder="请输入关键字"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>

      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="questionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查项" align="left" prop="quesDetail" sortable :render-header="renderHeader"/>
      <el-table-column label="检查库" align="left" prop="quesBankId" width="250" sortable :render-header="renderHeader"
                       :formatter="quesBankFormat"/>
<!--      <el-table-column label="关键字" align="left" prop="keywords" width="180" sortable :render-header="renderHeader"/>-->
<!--      <el-table-column label="类型" align="left" prop="quesType" width="80" sortable :formatter="quesTypeFormat"
                       :render-header="renderHeader"/>-->
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-if="false"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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

    <!-- 新增或修改检查项详情对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog"
               :lock-scroll="false" :append-to-body="true">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="question-body">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="检查库" prop="quesBankId">
                <el-select v-model="form.quesBankId" :disabled="readOnly" filterable>
                  <el-option v-for="(dic,index) in quesBankDicList"
                             :key="index"
                             :label="dic.quesBankName"
                             :value="dic.id" :disabled="dic.typeStatus === '2'"/>
                </el-select>
              </el-form-item>
            </el-col>
<!--            <el-col :span="8">
              <el-form-item label="检查项类型" prop="quesType">
                <el-select v-model="form.quesType" placeholder="请选择检查项类型" :disabled="readOnly"
                           class="customSelect" @change="quesTypeChange">
                  <el-option v-for="(dic,index) in questionTypeDicList"
                             :key="index"
                             :label="dic.dictLabel"
                             :value="dic.dictValue"/>
                </el-select>
              </el-form-item>
            </el-col>-->
<!--            <el-col :span="8">
              <el-form-item label="关键字" prop="keywords">
                <el-input v-model="form.keywords" placeholder="请输入关键字" :readonly="readOnly"/>
              </el-form-item>
            </el-col>-->
          </el-row>
          <el-form-item label="检查项名称" prop="quesDetail">
            <el-input v-model="form.quesDetail" type="textarea" placeholder="请输入内容" :readonly="readOnly"/>
          </el-form-item>
          <!--判断题的选项-->
          <el-form-item label="选项" prop="options">
            <el-row v-for="(opt,index) in optionsForView" :key="index">
              <el-col :span="6">
                <el-form-item label="" style="margin-left: 0px" label-width="0px">
                  <el-input v-model="opt.content" readOnly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="检查备注" prop="analysis">
            <el-input v-model="form.analysis" type="textarea" placeholder="请输入内容" :readonly="readOnly"/>
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
    import question from "./question";

    export default {
        ...question
    }
</script>

<style scoped>
  .upload-demo .el-button--primary {
    background-color: #ffffff;
    color: #333;
    border: 1px solid #999;
  }
</style>
