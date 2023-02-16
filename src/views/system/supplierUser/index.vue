<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px;">
          <div class="con-container">
            <div class="lab-container">
              <label class="condition-item-title">用户名</label>
              <el-form-item label="" prop="nickName" class="custom-el-form-item">
                <el-input
                  v-model="queryParams.nickName"
                  placeholder="请输入用户名称"
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
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
<!--                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                           v-hasPermi="['system:user:add']">新增
                </el-button>

                <el-button type="warning" plain  icon="el-icon-download" size="mini" @click="handleExport"
                           v-hasPermi="['system:user:export']">导出
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                           v-hasPermi="['system:user:remove']">删除
                </el-button>-->
              </el-form-item>
            </div>
          </div>
          <div class="toggle-container" ref="toggle-container" style="display:none;">
            <high-query :showDistrict="false" :show-enterprise="false" ref="highQuery"
            ></high-query>
          </div>
        </el-form>

        <el-table ref="table" v-loading="loading" :height="tableHeight" :data="userList" @sort-change="changeTableSort"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="left" width="80" type="index">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="账号" align="left" prop="userName" :show-overflow-tooltip="true" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)"/>
          <el-table-column label="用户名" align="left" prop="nickName" :show-overflow-tooltip="true" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)"/>
          <el-table-column label="供应商" align="left" prop="supplierName"  :show-overflow-tooltip="false"/>
          <el-table-column
            label="操作"
            align="left"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
<!--              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除
              </el-button>-->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
                v-hasPermi="['system:user:resetPwd']"
              >重置
              </el-button>
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
      </el-col>
    </el-row>

    <!-- 新增或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" class="_baseForm_small" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="userName" v-if="operationType == 1">
              <el-input v-model="form.userName" placeholder="请输入账号"/>
            </el-form-item>
            <el-form-item label="账号" prop="userName" v-if="operationType == 2">
              <el-input v-model="form.userName" disabled placeholder="请输入账号"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户名" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.userId == undefined">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营场所" prop="operationId">
              <el-select v-model="form.operationId" placeholder="请选择经营场所" style="width: 100%;">
                <el-option
                  v-for="dict in operationList"
                  :key="dict.id+''"
                  :label="dict.name"
                  :value="dict.id+''"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-select v-model="form.roleIds" multiple placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{dict.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import user from './user';

    export default {
        ...user
    }
    // import MerchantUser from './user';
    //
    // export default {
    //   ...MerchantUser
    // }
</script>
