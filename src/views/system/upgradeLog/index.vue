<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
            <label class="condition-item-title">平台类型</label>
            <el-form-item label="" prop="platformType" class="custom-el-form-item">
                <el-select v-model="queryParams.platformType" placeholder="--全部--" clearable size="small" class="query-param">
                    <el-option
                        v-for="dict in platformTypeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['upgradeLog:upgradeLog:add']">新增
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['upgradeLog:upgradeLog:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['upgradeLog:upgradeLog:remove']"
            >删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">

        <div class="condition-item">
            <label class="condition-item-title">系统名称</label>
              <el-form-item label="" prop="sysName">
                <el-input
                  v-model="queryParams.sysName" class="query-param"
                  placeholder="请输入系统名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
        <div class="condition-item">
            <label class="condition-item-title">系统版本</label>
              <el-form-item label="" prop="sysVersion">
                <el-input
                  v-model="queryParams.sysVersion" class="query-param"
                  placeholder="请输入系统版本"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">更新日期</label>
          <el-form-item label="" prop="upgradeDate">
            <el-date-picker clearable size="small" style="width: 240px;"
              v-model="queryParams.upgradeDateRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              placeholder="选择更新日期">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
            <label class="condition-item-title">更新人</label>
              <el-form-item label="" prop="nickName">
                <el-input
                  v-model="queryParams.nickName" class="query-param"
                  placeholder="请输入更新人"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="upgradeLogList" @selection-change="handleSelectionChange" class="upgrade-log-table">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="系统名称" align="left" prop="sysName"  width="150" sortable :render-header="renderHeader"/>
      <el-table-column label="平台类型" align="left" prop="platformType"  width="100" :formatter="platformTypeFormat" sortable :render-header="renderHeader"/>
      <el-table-column label="系统版本" align="left" prop="sysVersion"  width="100" sortable :render-header="renderHeader"/>
      <el-table-column label="更新内容" align="left" prop="upgradeContent">
        <template slot-scope="scope">
          <el-input type="textarea" :value="scope.row.upgradeContent" readonly :autosize="{ minRows: 1, maxRows: 100}" resize="none" class="custom-textarea"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="更新日期" align="left" prop="upgradeDate" width="100" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.upgradeDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="left" prop="nickName"  width="100" sortable :render-header="renderHeader"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['upgradeLog:upgradeLog:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['upgradeLog:upgradeLog:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['upgradeLog:upgradeLog:remove']"
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

    <!-- 新增或修改系统升级日志对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="upgradeLog-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="系统名称" prop="sysName">
          <el-input v-model="form.sysName" placeholder="请输入系统名称" :readonly="readOnly" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="平台类型" prop="platformType">
          <el-select v-model="form.platformType" placeholder="请选择平台类型" :disabled="readOnly" class="customSelect" style="width: 100%">
            <el-option
              v-for="dict in platformTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统版本" prop="sysVersion">
          <el-input v-model="form.sysVersion" placeholder="请输入系统版本" :readonly="readOnly" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="更新内容" prop="upgradeContent">
          <el-input v-model="form.upgradeContent" type="textarea" placeholder="请输入内容" :readonly="readOnly" :autosize="{ minRows: 7, maxRows: 10}"/>
        </el-form-item>
        <el-form-item label="更新日期" prop="upgradeDate">
          <el-date-picker clearable size="small" style="width: 100%" :readonly="readOnly"
            v-model="form.upgradeDate"
            type="date"
            value-format="yyyy-MM-dd"
            :picker-options="transitionTimeOptions"
            placeholder="选择更新日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下载地址" prop="downloadLink">
          <el-input v-model="form.downloadLink" placeholder="请输入下载地址" :readonly="readOnly" style="width: 100%"/>
        </el-form-item>
        <!--<el-form-item label="更新人" prop="upgradeUser">
          <el-input v-model="form.upgradeUser" placeholder="请输入更新人" :readonly="readOnly"/>
        </el-form-item>-->
      </el-form>
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


    <!-- 查看系统升级日志对话框 -->
    <el-dialog :visible.sync="viewOpen" fullscreen :close-on-click-modal="false" class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="upgradeLog-body"></div>
      <el-form ref="viewForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="平台类型：" prop="platformType" class="custom-form-item">
          {{this.platformTypeFormat(form)}}
        </el-form-item>
        <el-form-item label="系统名称：" prop="sysName" class="custom-form-item">
          {{form.sysName}}
        </el-form-item>
        <el-form-item label="系统版本：" prop="sysVersion" class="custom-form-item">
          {{form.sysVersion}}
        </el-form-item>
        <el-form-item label="更新内容：" prop="upgradeContent" class="custom-form-item">
          <el-input v-model="form.upgradeContent" type="textarea" placeholder="" :autosize="true" readonly resize="none" class="custom-textarea custom-form-item"/>
        </el-form-item>
        <el-form-item label="更新日期：" prop="upgradeDate" class="custom-form-item">
          {{form.upgradeDate}}
        </el-form-item>
        <el-form-item label="下载地址：" prop="downloadLink" class="custom-form-item">
          {{form.downloadLink}}
        </el-form-item>
        <el-form-item label="更新人：" prop="nickName" class="custom-form-item">
          {{form.nickName}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button type="" @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import upgradeLog from "./upgradeLog";
    export default {
        ...upgradeLog
    }
</script>

<style>

  .custom-textarea .el-textarea__inner {
    display: block;
    resize: vertical;
    padding: 5px 0px;
    line-height: 1.5;
    width: 100%;
    font-size: inherit;
    color: #606266;
    background-color: #fff;
    background-image: none;
    border: none;
    transition: all 0.15s linear;
  }

  .upgrade-log-table .el-table__body-wrapper .el-table__body tr:hover textarea{
    background-color: #f4f7fa !important;
    transition-property:all;
    transition-duration:0.2s;
  }

</style>
