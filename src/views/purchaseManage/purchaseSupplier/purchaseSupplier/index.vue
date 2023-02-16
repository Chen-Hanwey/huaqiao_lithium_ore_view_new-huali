<template>
  <div class="app-container">
    <el-row :gutter="7">
      <!--辖区数据-->
      <el-col v-if="showTree" :span="showTree ? 5 : 0" :xs="24">
        <enterprise-tree @enterpriseClick="enterpriseClick"></enterprise-tree>
      </el-col>
      <el-col :span="showTree ? 19 : 24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
          <div class="con-container">
            <div class="lab-container">
              <label class="condition-item-title" style="width: 90px">供应商名称</label>
              <el-form-item label="" prop="supplierName"  class="custom-el-form-item">
                <el-input
                  v-model="queryParams.supplierName" class="query-param"
                  placeholder="请输入供应商名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>

            <div class="btn-container">
              <el-form-item>
                <el-button type="primary" v-if="userType=='02'" icon="el-icon-share" size="mini" @click="clickSupplierAssociation">溯源图谱
                </el-button>
                <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
                </el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                           v-hasPermi="['purchaseSupplier:purchaseSupplier:add']">新增
                </el-button>
<!--                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                           v-hasPermi="['purchaseSupplier:purchaseSupplier:export']">导出
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                           v-hasPermi="['purchaseSupplier:purchaseSupplier:remove']"
                >删除
                </el-button>-->
              </el-form-item>
            </div>
          </div>

          <div class="toggle-container" ref="toggle-container" style="display: none;">
            <high-query v-if="userType!='04'" ref="highQuery" :show-enterprise="true" :show-operation="false"></high-query>
            <div class="condition-item">
              <label class="condition-item-title">联系人姓名</label>
              <el-form-item label="" prop="contactName">
                <el-input
                  v-model="queryParams.contactName" class="query-param"
                  placeholder="请输入联系人姓名"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">联系方式</label>
              <el-form-item label="" prop="contactPhone">
                <el-input
                  v-model="queryParams.contactPhone" class="query-param"
                  placeholder="请输入联系方式"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">供应类型</label>
              <el-form-item label="" prop="supplierType">
                <el-select v-model="queryParams.supplierType" placeholder="--全部--" clearable size="small"
                           class="query-param">
                  <el-option
                    v-for="dict in supplierTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">供货状态</label>
              <el-form-item label="" prop="supplyStatus">
                <el-select v-model="queryParams.supplyStatus" placeholder="--全部--" clearable size="small"
                           class="query-param">
                  <el-option label="正常" :value="'0'"/>
                  <el-option label="停止" :value="'-1'"/>
                </el-select>
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">主营范围</label>
              <el-form-item label="" prop="bussinessScope">
                <el-input
                  v-model="queryParams.bussinessScope" class="query-param"
                  placeholder="请输入主营范围"
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
                  :data="purchaseSupplierList" @selection-change="handleSelectionChange">
<!--          <el-table-column type="selection" width="55" align="center"/>-->
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="userType!='04'" label="企业名称" width="220" min-width="120" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
          <el-table-column v-if="userType=='04'" label="上级供应商名称" width="220" min-width="120" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
<!--          <el-table-column label="经营场所名称" min-width="120" align="left" prop="operationName"  :render-header="renderHeader"/>-->
          <!--      <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader"/>-->
          <el-table-column label="供应商名称" min-width="100" align="left" prop="supplierName" sortable :render-header="renderHeader"/>
          <el-table-column label="联系人姓名" min-width="100" align="left" prop="contactName" sortable :render-header="renderHeader"/>
          <el-table-column label="联系方式" align="left" prop="contactPhone" sortable :render-header="renderHeader"/>
          <!--      <el-table-column label="联系人身份证" align="left" prop="contactIdcard" sortable :render-header="renderHeader"/>-->
          <el-table-column label="供应类型" align="left" prop="supplierType" sortable :formatter="supplierTypeFormat" :render-header="renderHeader"/>
          <el-table-column label="供货状态" align="left" prop="supplyStatus" sortable :formatter="supplyStatusFormat" :render-header="renderHeader"/>
          <!--      <el-table-column label="地址" align="left" prop="address" sortable :render-header="renderHeader"/>-->
          <!--      <el-table-column label="许可证号" align="left" prop="permissionNum" sortable :render-header="renderHeader"/>-->
          <el-table-column label="主营范围" align="left" prop="bussinessScope" sortable :render-header="renderHeader"/>
          <!--      <el-table-column label="证明材料" align="left" prop="attachmentFiles" sortable :render-header="renderHeader"/>-->
          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                v-hasPermi="['purchaseSupplier:purchaseSupplier:query']"
              >详情
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['purchaseSupplier:purchaseSupplier:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-share"
                @click="handleGoodsAssociation(scope.row)"
                v-show="scope.row.level==1"
                v-hasPermi="['purchaseSupplier:purchaseSupplier:edit']"
              >商品关联
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['purchaseSupplier:purchaseSupplier:remove']"
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
      </el-col>
    </el-row>


    <!-- 添加或修改采购供应商对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="purchaseSupplier-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <base-form v-if="userType!='04'" :readOnly="readOnly" ref="baseForm"></base-form>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">供应商信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="供应商名称" prop="supplierName" v-if="!readOnly">
                  <el-input v-model="form.supplierName" placeholder="请输入供应商名称"/>
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierName" v-if="readOnly" class="custom-form-item">
                  {{form.supplierName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="systemUserName" v-if="!readOnly">
                  <span slot="label">
                    <span class="span-box">
                      <span>供应商账号</span>
                      <el-tooltip style="display: inline" effect="dark" placement="top">
                        <div slot="content">
                                  <span>相关账号会在供应商账号管理中自动创建</span><br/>
                                　<span>建议由字母、数字、下划线等组成</span><br/>
                                　<span>如gy_1</span>
                            </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                  <el-input v-model="form.systemUserName" :disabled="operationType == 2" placeholder="请输入供应商账号"/>
                </el-form-item>
                <el-form-item label="供应商账号：" prop="systemUserName" v-if="readOnly"
                              class="custom-form-item">
                  {{ form.systemUserName }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人姓名" prop="contactName" v-if="!readOnly">
                  <el-input v-model="form.contactName" placeholder="请输入联系人姓名"/>
                </el-form-item>
                <el-form-item label="联系人姓名：" prop="contactName" v-if="readOnly" class="custom-form-item">
                  {{form.contactName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系方式" prop="contactPhone" v-if="!readOnly">
                  <el-input v-model="form.contactPhone" placeholder="请输入联系方式"/>
                </el-form-item>
                <el-form-item label="联系方式：" prop="contactPhone" v-if="readOnly" class="custom-form-item">
                  {{form.contactPhone}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="联系人身份证" prop="contactIdcard" v-if="!readOnly">
                  <el-input v-model="form.contactIdcard" placeholder="请输入联系人身份证"/>
                </el-form-item>
                <el-form-item label="联系人身份证：" prop="contactIdcard" v-if="readOnly" class="custom-form-item">
                  {{form.contactIdcard}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应类型" prop="supplierType" v-if="!readOnly">
                  <el-select v-model="form.supplierType" placeholder="请选择供应类型" class="customSelect form-item">
                    <el-option
                      v-for="dict in supplierTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="供应类型：" prop="supplierType" v-if="readOnly" class="custom-form-item">
                  {{supplierTypeFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供货状态" prop="supplyStatus" v-if="!readOnly">
                  <el-radio-group v-model="form.supplyStatus" class="customRadio form-item">
                    <el-radio :key="0" :label="'0'">正常</el-radio>
                    <el-radio :key="-1" :label="'-1'">停止</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="供货状态：" prop="supplyStatus" v-if="readOnly" class="custom-form-item">
                  {{supplyStatusFormat(form)}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="许可证号" prop="permissionNum" v-if="!readOnly">
                  <el-input v-model="form.permissionNum" placeholder="请输入许可证号"/>
                </el-form-item>
                <el-form-item label="许可证号：" prop="permissionNum" v-if="readOnly" class="custom-form-item">
                  {{form.permissionNum}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="地址" prop="address" v-if="!readOnly">
                  <el-input v-model="form.address" placeholder="请输入地址"/>
                </el-form-item>
                <el-form-item label="地址：" prop="address" v-if="readOnly" class="custom-form-item">
                  {{form.address}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="主营范围" prop="bussinessScope" v-if="!readOnly">
                  <el-input v-model="form.bussinessScope" placeholder="请输入主营范围"/>
                </el-form-item>
                <el-form-item label="主营范围：" prop="bussinessScope" v-if="readOnly" class="custom-form-item">
                  {{form.bussinessScope}}
                </el-form-item>
              </el-col>
<!--              <el-col :span="8">-->
<!--                <el-form-item label="证明材料" prop="attachmentFiles" v-if="!readOnly">-->
<!--                  <el-input v-model="form.attachmentFiles" placeholder="请输入证明材料"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="证明材料：" prop="attachmentFiles" v-if="readOnly" class="custom-form-item">-->
<!--                  {{form.attachmentFiles}}-->
<!--                </el-form-item>-->
<!--              </el-col>-->

              <el-col :span="24">
                <el-form-item label="证明材料" prop="attachmentFiles" v-if="!readOnly">
                  <el-upload ref="uploadAttachment" :headers="uploadFile.headers" :action="uploadFile.uploadFileUrl"
                             :on-success="handleAttachmentSuccess" :on-remove="handleAttachmentRemove"
                             :file-list="uploadFile.fileList"
                             :before-upload="beforeUploadAttachment">
                    <el-button type="primary" size="small" :disabled="!uploadFile.enabledUploadBtn" :icon="uploadFile.uploadBtnIcon">
                      {{uploadFile.btnText}}
                    </el-button>
                    <div slot="tip" class="el-upload__tip">
                      <div>支持扩展名：.doc .docx .xls .xlsx .ppt .pptx .pdf .zip .rar .mp4 .jpg .jpeg .png，大小20M以内</div>
                      <span v-if="uploadFile.fileList && uploadFile.fileList.length > 0">文件列表：</span>
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="证明材料：" prop="attachmentFiles" v-if="readOnly" class="custom-form-item">
                  <div v-if="uploadFile.fileList && uploadFile.fileList.length > 0">
                    <span v-for="item in uploadFile.fileList" style="display:block ">
                      <el-link type="primary" @click="downloadFile(item)">{{item.name}}</el-link>
                    </span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="sub-project" v-if="operationType == 3&&form.level==1">
          <div class="sub-title">
            <div class="sub-title-name">关联商品信息</div>
          </div>
          <div class="sub-body-nopadding">
<!--            <div style="float: right;padding: 0 10px 5px 0px;"><el-button type="primary" @click="editRelatedGoods" icon="el-icon-edit">修改</el-button></div>-->
            <purchase-goods :supplierId="form.id" :showModifyButton="false"></purchase-goods>
          </div>
        </div>
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



    <!-- 添加或修改采购供应商对话框 -->
    <el-dialog :visible.sync="openGoodsAssociation"  :close-on-click-modal="false" class="customForm _baseForm_big">
      <div slot="title">
        <span><i class="el-icon-share"></i></span>
        <span>关联商品</span>
      </div>
      <div class="purchaseSupplier-body"></div>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">关联商品信息</div>
          </div>
          <div class="sub-body-nopadding">
            <purchase-goods :supplierId="goodAssociationId" :showModifyButton="true"></purchase-goods>
          </div>
        </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="" @click="openGoodsAssociation=false">关 闭</el-button>
        </div>
      </div>
    </el-dialog>


    <!-- 添加或修改采购供应商对话框 -->
    <el-dialog :visible.sync="openSupplierAssociation"  :close-on-click-modal="false" class="customForm _baseForm_big">
      <div slot="title">
        <span><i class="el-icon-share"></i></span>
        <span>溯源图谱</span>
      </div>
      <div class="purchaseSupplier-body"></div>
      <div class="sub-project">
        <div class="sub-title">
          <div class="sub-title-name">供应商溯源图谱</div>
        </div>
        <div class="sub-body-nopadding">
          <purchase-supplier-tree v-if="openSupplierAssociation" :chart-data="supplierAssociationData" ></purchase-supplier-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="" @click="openSupplierAssociation=false">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import purchaseSupplier from "./purchaseSupplier";
  import PurchaseSupplierTree from "@/views/purchaseManage/components/purchaseSupplierTree";
  import PurchaseGoods from "@/views/purchaseManage/components/purchaseGoods"
  export default {
    components: {PurchaseSupplierTree,PurchaseGoods},

    ...purchaseSupplier
  }
</script>
<style scoped>
  .form-item {
    width: 100%;
  }
</style>
