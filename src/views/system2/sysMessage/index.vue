<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
            <label class="condition-item-title">消息类型</label>
            <el-form-item label="" prop="messageType" class="custom-el-form-item">
                <el-select v-model="queryParams.messageType" placeholder="--全部--" clearable size="small" class="query-param">
                    <el-option
                        v-for="dict in messageTypeOptions"
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
            <!--<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['sysMessage:sysMessage:add']">新增
            </el-button>-->
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['sysMessage:sysMessage:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['sysMessage:sysMessage:remove']"
            >删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">

        <div class="condition-item">
          <label class="condition-item-title">消息子类型</label>
          <el-form-item label="" prop="messageChildType">
            <el-select v-model="queryParams.messageChildType" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option
                v-for="dict in messageChildTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">消息状态</label>
          <el-form-item label="" prop="messageStatus">
            <el-select v-model="queryParams.messageStatus" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option
                v-for="dict in messageStatusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="sysMessageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="消息类型" align="left" prop="messageType" :formatter="messageTypeFormat" sortable :render-header="renderHeader"/>
      <el-table-column label="消息子类型" align="left" prop="messageChildType" :formatter="messageChildTypeFormat" sortable :render-header="renderHeader"/>
      <el-table-column label="消息内容" align="left" prop="messageInfo"/>
      <el-table-column label="组织名称" align="left" prop="partyName" sortable :render-header="renderHeader"/>
      <el-table-column label="消息接收人" align="left" prop="name" sortable :render-header="renderHeader"/>
      <el-table-column label="消息状态" align="left" prop="messageStatus" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <div style="background-color: red; border-radius: 50%; width: 10px; height: 10px; display: inline-block; padding-right: 5px;" v-if="scope.row.messageStatus === '0'"></div>
          <div style="background-color: #1890ff; border-radius: 50%; width: 10px; height: 10px; display: inline-block; padding-right: 5px;" v-else></div>
          {{selectDictLabel(messageStatusOptions, scope.row.messageStatus)}}
        </template>
      </el-table-column>
      <el-table-column label="消息时间" align="left" prop="createTime" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          {{scope.row.createTime}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['sysMessage:sysMessage:query']"
          >详情</el-button>
          <!--<el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sysMessage:sysMessage:edit']"
          >修改</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sysMessage:sysMessage:remove']"
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

    <!-- 新增或修改系统消息对话框 -->
    <el-dialog :visible.sync="open" fullscreen :close-on-click-modal="false" class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="sysMessage-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="form.messageType" placeholder="请选择消息类型" :disabled="readOnly" class="customSelect">
            <el-option
              v-for="dict in messageTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息子类型" prop="messageChildType">
          <el-select v-model="form.messageChildType" placeholder="请选择消息类型子类型" :disabled="readOnly" class="customSelect">
            <el-option
              v-for="dict in messageChildTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息内容" prop="messageInfo">
          <el-input v-model="form.messageInfo" type="textarea" placeholder="请输入内容" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="组织名称" prop="partyName">
          <el-input v-model="form.partyName" placeholder="请输入组织名称" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="消息接收人" prop="receivePerson">
          <el-input v-model="form.receivePerson" placeholder="请输入消息接收人" :readonly="readOnly"/>
        </el-form-item>
        <el-form-item label="消息状态" prop="messageStatus">
          <el-select v-model="form.messageStatus" placeholder="请选择消息状态" :disabled="readOnly" class="customSelect">
            <el-option
              v-for="dict in messageStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
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


    <!-- 新增或修改系统消息对话框 -->
    <el-dialog :visible.sync="viewOpen" :close-on-click-modal="false" >
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="消息类型：" prop="messageType">
          {{this.selectDictLabel(messageTypeOptions, form.messageType)}}
        </el-form-item>
        <el-form-item label="消息子类型：" prop="messageChildType">
          {{this.selectDictLabel(messageChildTypeOptions, form.messageChildType)}}
        </el-form-item>
        <el-form-item label="消息内容：" prop="messageInfo">
          {{form.messageInfo}}
        </el-form-item>
        <el-form-item label="组织名称：" prop="partyName">
          {{form.partyName}}
        </el-form-item>
        <el-form-item label="消息时间：" prop="createTime">
          {{form.createTime}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    import sysMessage from "./sysMessage";
    export default {
        ...sysMessage
    }
</script>
