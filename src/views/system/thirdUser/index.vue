<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px;">
          <div class="con-container">
            <div class="lab-container">
              <label class="condition-item-title">平台名称</label>
              <el-form-item label="" prop="nickName" class="custom-el-form-item">
                <el-input
                  v-model="queryParams.nickName"
                  placeholder="请输入平台名称"
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
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                           v-hasPermi="['system:user:add']">新增
                </el-button>
                <!--                <el-button type="primary" icon="el-icon-upload2" size="mini" @click="handleImport"
                                           v-hasPermi="['system:user:import']">导入
                                </el-button>-->
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                           v-hasPermi="['system:user:export']">导出
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                           @click="handleDelete"
                           v-hasPermi="['system:user:remove']">删除
                </el-button>
              </el-form-item>
            </div>
          </div>
          <div class="toggle-container" ref="toggle-container" style="display:none;">
            <!--            <div class="condition-item">
                          <label class="condition-item-title">工号</label>
                          <el-form-item label="" prop="jobNo" >
                            <el-input
                              v-model="queryParams.jobNo"
                              placeholder="请输入工号"
                              clearable
                              size="small"
                              style="width: 240px"
                              @keyup.enter.native="handleQuery"
                            />
                          </el-form-item>
                        </div>-->
            <!--            <div class="condition-item">
                          <label class="condition-item-title">用户名</label>
                          <el-form-item label="" prop="userName">
                            <el-input
                              v-model="queryParams.userName"
                              placeholder="请输入用户名"
                              clearable
                              size="small"
                              style="width: 240px"
                              @keyup.enter.native="handleQuery"
                            />
                          </el-form-item>
                        </div>-->
            <!--            <div class="condition-item">
                          <label class="condition-item-title">身份证号</label>
                          <el-form-item label="" prop="idCard">
                            <el-input
                              v-model="queryParams.idCard"
                              placeholder="请输入身份证号"
                              clearable
                              size="small"
                              style="width: 240px"
                              @keyup.enter.native="handleQuery"
                            />
                          </el-form-item>
                        </div>-->
            <!--            <div class="condition-item">
                          <label class="condition-item-title">工作单位</label>
                          <el-form-item label="" prop="deptId">
                            <treeselect class="query-param" v-model="queryParams.deptId" :options="deptOptions" placeholder="&#45;&#45;全部&#45;&#45;" />
                          </el-form-item>
                        </div>-->
            <!--            <div class="condition-item">
                          <label class="condition-item-title">居住社区</label>
                          <el-form-item label="" prop="committee">
                            <treeselect class="query-param" v-model="queryParams.committee" :options="districtList" placeholder="&#45;&#45;全部&#45;&#45;" />
                          </el-form-item>
                        </div>-->
            <!--            <div class="condition-item">
                          <label class="condition-item-title">手机号码</label>
                          <el-form-item label="" prop="phonenumber">
                            <el-input
                              v-model="queryParams.phonenumber"
                              placeholder="请输入手机号码"
                              clearable
                              size="small"
                              style="width: 240px"
                              @keyup.enter.native="handleQuery"
                            />
                          </el-form-item>
                        </div>
                        <div class="condition-item">
                          <label class="condition-item-title">邮箱</label>
                          <el-form-item label="" prop="email">
                            <el-input
                              v-model="queryParams.email"
                              placeholder="请输入邮箱"
                              clearable
                              size="small"
                              style="width: 240px"
                              @keyup.enter.native="handleQuery"
                            />
                          </el-form-item>
                        </div>
                        <div class="condition-item">
                          <label class="condition-item-title">性别</label>
                          <el-form-item label="" prop="sex">
                            <el-select v-model="queryParams.sex" placeholder="&#45;&#45;全部&#45;&#45;" style="width: 240px">
                              <el-option
                                v-for="dict in sexOptions"
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
                              placeholder="&#45;&#45;全部&#45;&#45;"
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
                        <div class="condition-item">
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

        <el-table ref="table" v-loading="loading" :height="tableHeight" :data="userList" @sort-change="changeTableSort"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="left" width="80" type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="工号" align="left" prop="jobNo" :show-overflow-tooltip="true" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)"/>-->
          <!--          <el-table-column label="用户名" align="left" prop="userName" :show-overflow-tooltip="true" sortable
                                     :render-header="(h,obj) => renderHeader(h,obj)"/>-->
          <el-table-column label="平台名称" align="left" prop="nickName" :show-overflow-tooltip="true" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)"/>
          <el-table-column label="AppId" align="left" prop="userName" :show-overflow-tooltip="true" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)"/>
          <el-table-column label="AppSecret" align="left" prop="remark" :show-overflow-tooltip="true" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)"/>

          <!--          <el-table-column label="性别" width="80" align="left" prop="sex" :show-overflow-tooltip="true" sortable
                                     :render-header="(h,obj) => renderHeader(h,obj)" :formatter="sexFormatter"/>-->
          <!--          <el-table-column label="身份证号" align="left" min-width="110px" prop="idCard" :show-overflow-tooltip="true" sortable
                                     :render-header="(h,obj) => renderHeader(h,obj)"/>-->
          <!--<el-table-column label="归属党组织" align="left" prop="partyName" :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj,40)"/>-->
          <!--          <el-table-column label="工作单位" align="left" prop="deptName"  :show-overflow-tooltip="false"/>-->
          <!--          <el-table-column label="所属企业" align="left" prop="enterpriseName"  :show-overflow-tooltip="false"/>-->
          <!--          <el-table-column label="居住社区" align="left" prop="committeeName"  :show-overflow-tooltip="false"/>-->
          <!--          <el-table-column label="手机号码" align="left" min-width="110px" prop="phonenumber" sortable
                                     :render-header="(h,obj) => renderHeader(h,obj)"/>-->
          <!--          <el-table-column label="邮箱" align="left" prop="email" sortable
                                     :render-header="(h,obj) => renderHeader(h,obj)"/>-->
          <el-table-column label="状态" align="left" width="80" prop="status" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="left" prop="createTime" width="150" sortable
                           :render-header="(h,obj) => renderHeader(h,obj)">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="left"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
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
              </el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <!--<el-col :span="12">
            <el-form-item label="工号" prop="jobNo">
              <el-input v-model="form.jobNo" placeholder="请输入工号"/>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="平台名称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入平台名称"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="AppId" prop="userName">
              <el-input v-model="form.userName" readonly placeholder="请输入AppId"/>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item v-if="form.userId == undefined" label="AppSecret" prop="password">
              <el-input v-model="form.password" placeholder="请输入AppSecret">
                <el-button slot="append" icon="el-icon-refresh-right" @click="randomSecret"></el-button>
              </el-input>
            </el-form-item>
            <el-form-item v-else label="AppSecret" prop="remark">
              <el-input v-model="form.remark" readonly placeholder="请输入AppSecret">
              </el-input>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="手机号码" prop="phonenumber">-->
          <!--              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
                      </el-form-item>
                    </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="身份证号" prop="idCard">-->
          <!--              <el-input v-model="form.idCard" placeholder="请输入身份证号"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12">
                      <el-form-item label="工作单位" prop="deptId">
                        <treeselect v-model="form.deptId" :options="deptOptions" placeholder="请选择工作单位" style="height: 33px;"/>
                      </el-form-item>
                    </el-col>-->
          <!--          <el-col :span="12">
                      <el-form-item label="居住社区" prop="committee">
                        <treeselect v-model="form.committee" :options="districtList" :disable-branch-nodes="true"
                                    :show-count="true" placeholder="请选择居住社区"/>
                      </el-form-item>
                    </el-col>-->
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="所属企业" prop="enterpriseId">-->
          <!--              <el-select v-model="form.enterpriseId" placeholder="请选择所属企业" style="width: 100%;">-->
          <!--                <el-option-->
          <!--                  v-for="dict in enterpriseList"-->
          <!--                  :key="dict.id+''"-->
          <!--                  :label="dict.name"-->
          <!--                  :value="Number(dict.id+'')"-->
          <!--                ></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
        <el-row>
          <!--          <el-col :span="12">
                      <el-form-item label="用户性别" prop="sex">
                        <el-select v-model="form.sex" placeholder="请选择" style="width: 100%;">
                          <el-option
                            v-for="dict in sexOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>-->

          <!--          <el-col :span="12">
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
                    </el-col>-->

          <!--<el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
        </el-row>
        <!--        <el-row>
                  <el-col :span="24">
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
                </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <el-form-item label="备注">-->
        <!--              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
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
</script>
