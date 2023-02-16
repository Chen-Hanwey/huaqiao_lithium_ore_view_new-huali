<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">

                    <label class="condition-item-title">用户账号</label>
            <el-form-item label="" prop="userName" class="custom-el-form-item">
                <el-input
                        v-model="queryParams.userName" class="query-param"
                        placeholder="请输入用户账号"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
                </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['feedback:feedback:add']">新增
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['feedback:feedback:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['feedback:feedback:remove']"
            >删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">

        <div class="condition-item">
            <label class="condition-item-title">用户昵称</label>
              <el-form-item label="" prop="nickName">
                <el-input
                  v-model="queryParams.nickName" class="query-param"
                  placeholder="请输入用户昵称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
        <div class="condition-item">
            <label class="condition-item-title">联系方式</label>
              <el-form-item label="" prop="contactInfo">
                <el-input
                  v-model="queryParams.contactInfo" class="query-param"
                  placeholder="请输入联系方式"
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
              :data="feedbackList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="用户账号" align="left" prop="userName" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="用户昵称" align="left" prop="nickName" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="意见" align="left" prop="opinion" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="联系方式" align="left" prop="contactInfo" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="备注" align="left" prop="remark" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
            <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-document"
                    @click="handleView(scope.row)"
                    v-hasPermi="['feedback:feedback:query']"
            >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['feedback:feedback:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['feedback:feedback:remove']"
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

    <!-- 新增或修改意见反馈对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
        <div slot="title">
            <span><i :class="dialogIcon"></i></span>
            <span> {{ title }}</span>
        </div>
        <div class="modal-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <!--  <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="用户账号" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户账号" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入用户昵称" :readonly="readOnly"/>
        </el-form-item>-->
        <el-form-item label="您的建议:(50字以内)" prop="opinion">
          <el-input v-model="form.opinion"  type="textarea" placeholder="请输入您的宝贵意见，我们会改进" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="您的联系方式" prop="contactInfo">
          <el-input v-model="form.contactInfo" placeholder="请输入手机号或者邮箱，方便我们跟您联系(可选填)" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="备注" prop="contactInfo">
          <el-input v-model="form.remark"  type="textarea"  placeholder="请输入备注信息" :readonly="readOnly"/>
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

    <!-- 新增或修改意见反馈对话框 -->
    <el-dialog :visible.sync="viewOpen" fullscreen :close-on-click-modal="false" class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="modal-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!--  <el-form-item label="用户id" prop="userId">
            <el-input v-model="form.userId" placeholder="请输入用户id" :readonly="readOnly"/>
          </el-form-item>
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户账号" :readonly="readOnly"/>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入用户昵称" :readonly="readOnly"/>
          </el-form-item>-->
        <el-form-item label="您的建议：" prop="opinion" class="custom-form-item">
          <el-input v-model="form.opinion"  type="textarea" :autosize="true" :readonly="readOnly" resize="none" class="custom-textarea custom-form-item"/>
        </el-form-item>
        <el-form-item label="您的联系方式：" prop="contactInfo" class="custom-form-item">
          {{form.contactInfo}}
<!--          <el-input v-model="form.contactInfo" placeholder="请输入手机号或者邮箱，方便我们跟您联系(可选填)" :readonly="readOnly"/>-->
        </el-form-item>
        <el-form-item label="备注：" prop="contactInfo" class="custom-form-item">
          <el-input v-model="form.remark"  type="textarea" :autosize="true" :readonly="readOnly" resize="none" class="custom-textarea custom-form-item"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="viewOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
    import feedback from "./feedback";
    export default {
        ...feedback
    }
</script>
<style scoped>
  /deep/ .el-textarea__inner{
    height: 200px;
  }
  /deep/.el-dialog__body .el-form-item__label{
    width: 150px !important;
  }
  /deep/.el-dialog__body .el-form-item__content{
    margin-left: 150px !important;
  }
</style>
