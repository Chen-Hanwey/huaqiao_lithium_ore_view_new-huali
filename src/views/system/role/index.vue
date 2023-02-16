<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px;">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">角色名称</label>
          <el-form-item label="" prop="roleName" class="custom-el-form-item">
            <el-input
              v-model="queryParams.roleName"
              placeholder="请输入角色名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['system:role:add']">新增
            </el-button>
<!--            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['system:post:export']">导出
            </el-button>-->
<!--            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                       v-hasPermi="['system:role:remove']">删除</el-button>-->
          </el-form-item>
        </div>
      </div>
      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item" v-if="userType=='00'">
          <label class="condition-item-title">角色类别</label>
          <el-form-item label="" prop="roleType">
            <el-select v-model="queryParams.roleType" placeholder="请选择角色类别" class="query-param">
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">状态</label>
          <el-form-item label="" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="角色状态"
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
<!--        <div class="condition-item">
          <label class="condition-item-title">创建时间</label>
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
        </div>-->
      </div>
    </el-form>
    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="roleList" @sort-change="changeTableSort" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="序号" align="left" type="index" width="120" >
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="角色名称" align="left" prop="roleName" :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="角色类别" align="left" prop="roleType" :formatter="typeFormat" :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj)">
<!--        <template slot-scope="scope">
          <span>{{ showRoleDesc(scope.row.roleType)}}</span>
        </template>-->
      </el-table-column>
<!--      <el-table-column label="权限字符" align="left" prop="roleKey" :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>-->
      <el-table-column label="显示顺序" align="left" prop="roleSort" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="状态" align="left" prop="status" sortable :render-header="(h,obj) => renderHeader(h,obj)">
        <template slot-scope="scope">
          <el-switch
            v-if="userType=='00' || (scope.row.editFlag=='0' && scope.row.roleType==userType)"
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
          <span v-else>{{statusFormat(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="userType=='00'" label="是否可修改删除" align="left" prop="editFlag" sortable :render-header="(h,obj) => renderHeader(h,obj)">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.editFlag"
            active-value="0"
            inactive-value="1"
            @change="handleEditFlagChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
<!--      <el-table-column label="创建时间" align="left" prop="createTime" sortable :render-header="(h,obj) => renderHeader(h,obj)">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="left" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['system:role:query']"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
            v-show="userType=='00' || (scope.row.editFlag=='0' && scope.row.roleType==userType)"
          >修改</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-circle-check"-->
<!--            @click="handleDataScope(scope.row)"-->
<!--            v-hasPermi="['system:role:edit']"-->
<!--          >部门权限</el-button>-->
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-check"
            @click="handlePartyScope(scope.row)"
            v-hasPermi="['system:role:edit']"
          >组织权限</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
            v-show="userType=='00' || (scope.row.editFlag=='0' && scope.row.roleType==userType)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[100, 200, 500, 1000]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 查看角色配置对话框 -->
    <el-dialog :title="title" class="customForm  _baseForm_small" @open="openAcion" :visible.sync="openView">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="角色名称：" prop="roleName">
          {{form.roleName}}
        </el-form-item>
        <el-form-item label="菜单权限：">
          <el-tree
            :data="menuViewOptions"
            ref="menu"
            node-key="id"
            disabled="true"
            empty-text="无菜单权限"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注：">
          {{form.remark}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView=false">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 新增或修改角色配置对话框 -->
    <el-dialog :title="title" class="customForm  _baseForm_small" @open="openAcion" :visible.sync="open"  :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
<!--        <el-form-item label="权限字符" prop="roleKey">-->
<!--          <el-input v-model="form.roleKey" placeholder="请输入权限字符" :disabled="form.roleId == 1 || form.roleId == 2"/>-->
<!--        </el-form-item>-->
        <el-form-item label="角色类别" prop="roleType">
          <el-select v-model="form.roleType"
                     placeholder="请选择"
                     class="customSelect form-item" :disabled="roleTypeDisable">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            disabled="true"
            empty-text="无菜单权限"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
<!--    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="角色类别">
          <el-input v-model="form.roleType" :disabled="true" />
        </el-form-item>
&lt;!&ndash;        <el-form-item label="权限字符">&ndash;&gt;
&lt;!&ndash;          <el-input v-model="form.roleKey" :disabled="true" />&ndash;&gt;
&lt;!&ndash;        </el-form-item>&ndash;&gt;
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-tree
            :data="deptOptions"
            show-checkbox
            :default-expanded-keys="defaultExpandedDepts"
            ref="dept"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>-->

  </div>
</template>

<script>
  import role from './role';
  export default {
    ...role
  }
</script>

<style>
  .customDialog .el-dialog__body{
    padding: 15px 20px 0 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>
