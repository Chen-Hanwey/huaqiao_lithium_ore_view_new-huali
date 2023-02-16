<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">姓名</label>
          <el-form-item label="" prop="name" class="custom-el-form-item">
            <el-input v-model="queryParams.name" class="query-param" placeholder="请输入姓名" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['people:peopleBase:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['people:peopleBase:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['people:peopleBase:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">性别</label>
          <el-form-item label="" prop="sex">
            <el-select v-model="queryParams.sex" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option v-for="dict in sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">职业</label>
          <el-form-item label="" prop="professional">
            <el-select v-model="queryParams.professional" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option v-for="dict in professionalOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">年龄</label>
          <el-form-item label="" prop="age">
            <el-input v-model="queryParams.age" class="query-param" placeholder="请输入年龄" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">手机号</label>
          <el-form-item label="" prop="phone">
            <el-input v-model="queryParams.phone" class="query-param" placeholder="请输入手机号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">家庭住址</label>
          <el-form-item label="" prop="addr">
            <el-input v-model="queryParams.addr" class="query-param" placeholder="请输入家庭住址" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">身份证号</label>
          <el-form-item label="" prop="idCard">
            <el-input v-model="queryParams.idCard" class="query-param" placeholder="请输入身份证号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">人员类别</label>
          <el-form-item label="" prop="category">
            <el-select v-model="queryParams.category" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option v-for="dict in categoryOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="peopleBaseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="left" prop="name" sortable :render-header="renderHeader" />
      <el-table-column label="性别" align="left" prop="sex" :formatter="sexFormat" sortable :render-header="renderHeader" />
      <el-table-column label="职业" align="left" prop="professional" :formatter="professionalFormat" sortable :render-header="renderHeader" />
      <el-table-column label="年龄" align="left" prop="age" sortable :render-header="renderHeader" />
      <el-table-column label="手机号" align="left" prop="phone" sortable :render-header="renderHeader" />
      <el-table-column label="家庭住址" align="left" prop="addr" sortable :render-header="renderHeader" />
      <el-table-column label="身份证号" align="left" prop="idCard" sortable :render-header="renderHeader" />
      <el-table-column label="人员类别" align="left" prop="category" :formatter="categoryFormat" sortable :render-header="renderHeader" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['people:peopleBase:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['people:peopleBase:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['people:peopleBase:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改人员对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="_baseForm_big" >
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="peopleBase-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名" prop="name" v-if="!readOnly">
                  <el-input v-model="form.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="姓名：" prop="name" v-if="readOnly" class="custom-form-item">
                  {{form.name}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄" prop="age" v-if="!readOnly">
                  <el-input v-model="form.age" placeholder="请输入年龄" />
                </el-form-item>
                <el-form-item label="年龄：" prop="age" v-if="readOnly" class="custom-form-item">
                  {{form.age}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号" prop="phone" v-if="!readOnly">
                  <el-input v-model="form.phone" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="手机号：" prop="phone" v-if="readOnly" class="custom-form-item">
                  {{form.phone}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="家庭住址" prop="addr" v-if="!readOnly">
                  <el-input v-model="form.addr" placeholder="请输入家庭住址" />
                </el-form-item>
                <el-form-item label="家庭住址：" prop="addr" v-if="readOnly" class="custom-form-item">
                  {{form.addr}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证号" prop="idCard" v-if="!readOnly">
                  <el-input v-model="form.idCard" placeholder="请输入身份证号" />
                </el-form-item>
                <el-form-item label="身份证号：" prop="idCard" v-if="readOnly" class="custom-form-item">
                  {{form.idCard}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="人员类别" prop="category" v-if="!readOnly">
                  <el-select v-model="form.category" placeholder="请选择人员类别" class="customSelect form-item">
                    <el-option v-for="dict in categoryOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="人员类别：" prop="category" v-if="readOnly" class="custom-form-item">
                  {{categoryFormat(form)}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="性别" prop="sex" v-if="!readOnly">
                  <el-select v-model="form.sex" placeholder="请选择性别" class="customSelect form-item">
                    <el-option v-for="dict in sexOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="性别：" prop="sex" v-if="readOnly" class="custom-form-item">
                  {{sexFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="职业" prop="professional" v-if="!readOnly">
                  <el-select v-model="form.professional" placeholder="请选择职业" class="customSelect form-item">
                    <el-option v-for="dict in professionalOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="职业：" prop="professional" v-if="readOnly" class="custom-form-item">
                  {{professionalFormat(form)}}
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
import peopleBase from "./peopleBase";
export default {
  ...peopleBase
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
