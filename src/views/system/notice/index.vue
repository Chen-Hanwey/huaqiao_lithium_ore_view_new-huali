<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px;">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">公告标题</label>
          <el-form-item label="" prop="noticeTitle" class="custom-el-form-item">
            <el-input class="query-param"
              v-model="queryParams.noticeTitle"
              placeholder="请输入公告标题"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['system:notice:add']">新增
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                       v-hasPermi="['system:notice:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item">
          <label class="condition-item-title">创建人</label>
          <el-form-item label="" prop="nickName">
            <el-input class="query-param"
              v-model="queryParams.nickName"
              placeholder="请输入创建人"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">类型</label>
          <el-form-item label="" prop="noticeType">
            <el-select v-model="queryParams.noticeType" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="noticeList" @sort-change="changeTableSort" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="公告标题"
        align="left"
        prop="noticeTitle"
        min-width="140px"
        :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj)"
      />
      <el-table-column
        label="公告类型"
        align="left"
        prop="noticeType"
        :formatter="typeFormat"
        min-width="110px"
        :show-overflow-tooltip="true"
        sortable :render-header="(h,obj) => renderHeader(h,obj)"
      />
      <el-table-column
        label="状态"
        align="left"
        prop="status"
        min-width="90px"
        :show-overflow-tooltip="true"
        sortable :render-header="(h,obj) => renderHeader(h,obj)"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="置顶"
        align="left"
        prop="stickTop"
        sortable :render-header="(h,obj) => renderHeader(h,obj)"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.stickTop"
            active-value="1"
            inactive-value="0"
            @change="handleStickChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建者" min-width="100px" align="left" prop="nickName" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="创建时间" align="left" min-width="110px" prop="createTime" sortable :render-header="(h,obj) => renderHeader(h,obj)">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:notice:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:notice:remove']"
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

    <!-- 新增或修改公告对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog" :before-close="beforeCloseDialog">
      <div slot="title">
        <!--<span><i :class="dialogIcon"></i></span>-->
        <span> {{ title }}</span>
      </div>
      <div class="notice-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="公告标题" prop="noticeTitle">
                  <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公告类型" prop="noticeType">
                  <el-select v-model="form.noticeType" placeholder="请选择">
                    <el-option
                      v-for="dict in typeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                    >{{dict.dictLabel}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容" prop="noticeContent">
                  <!--<Editor v-if="open" ref="editor" v-model="form.noticeContent" />-->
                  <NEditor v-if="open" ref="editor" v-model="form.noticeContent" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增或修改公告对话框 -->
    <el-dialog :visible.sync="viewOpen"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <!--<span><i :class="dialogIcon"></i></span>-->
        <span> {{ title }}</span>
      </div>
      <div class="notice-body"></div>
      <el-form ref="viewForm" :model="form" :rules="rules" label-width="100px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="公告标题：" prop="noticeTitle" class="custom-form-item">
                  {{form.noticeTitle}}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公告类型：" prop="noticeType" class="custom-form-item">
                  {{selectDictLabel(typeOptions, form.noticeType)}}
                  <!--<el-select v-model="form.noticeType" placeholder="请选择">
                    <el-option
                      v-for="dict in typeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>-->
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态：" prop="status" class="custom-form-item">
                  {{selectDictLabel(statusOptions, form.status)}}
                  <!--<el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                    >{{dict.dictLabel}}</el-radio>
                  </el-radio-group>-->
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="内容：" prop="noticeContent" class="custom-form-item">
    <!--              {{form.noticeContent}}-->
    <!--              <Editor v-if="viewOpen" ref="editorView" v-model="form.noticeContent" />-->
                  <div v-html="form.noticeContent" style="overflow-x: hidden"></div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" @click="submitForm">确 定</el-button>-->
        <el-button type="" @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import notice from './notice';
  import NEditor from '@/components/UEditor/neditor'
  export default {
    components: {NEditor},
    ...notice
  }
</script>
