<template>
  <div class="app-container">
    <el-row :gutter="8">

      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input v-model="queryEnterpriseName" placeholder="请输入企业名称" clearable size="small" prefix-icon="el-icon-search"
                    style="margin-bottom: 5px"/>
        </div>
        <div class="head-container" :style="{'height':tableHeight + 57 +'px', 'overflow': 'auto','background':' #ffffff'}">
          <el-tree :style="treeStyle" :data="enterpriseList"  :expand-on-click-node="true"
                    ref="tree" default-expand-all @node-click="handleNodeClick" :filter-node-method="enterpriseNameFilter"
                   class="elTree"/>
        </div>
      </el-col>
<!--    </el-row>-->
        <el-col :span="19" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
          <div class="con-container">
            <div class="lab-container">
              <label class="condition-item-title">设备名称</label>
              <el-form-item label="" prop="deviceName" class="custom-el-form-item">
                <el-input
                  v-model="queryParams.deviceName" class="query-param"
                  placeholder="请输入设备名称"
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
                <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                           v-hasPermi="['video:operationVideo:add']">新增
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                           v-hasPermi="['video:operationVideo:remove']"
                >删除
                </el-button>
              </el-form-item>
            </div>
          </div>

          <div class="toggle-container" ref="toggle-container" style="display: none;">
<!--            <high-query ref="highQuery"></high-query>-->
            <div class="condition-item">
              <label class="condition-item-title">设备编号</label>
              <el-form-item label="" prop="deviceCode">
                <el-input
                  v-model="queryParams.deviceCode" class="query-param"
                  placeholder="请输入设备编号"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>
            <div class="condition-item">

            </div>
          </div>
        </el-form>

        <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
                  :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                  :data="operationVideoList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="经营场所" align="left" prop="operationName"  :render-header="renderHeader"/>
          <el-table-column label="设备名称" align="left" prop="deviceName"  :render-header="renderHeader"/>
          <el-table-column label="设备编号" align="left" prop="deviceCode"  :render-header="renderHeader"/>
          <el-table-column label="设备状态" align="center"  :render-header="renderHeader">
            <template slot-scope="{row}">
              <span v-if="row.params.status === 'ON'" style="color: #2ecc71">开启</span>
              <span v-else style="color: #ccc">关闭</span>
            </template>
          </el-table-column>
          <el-table-column label="缩略图" align="center" prop="previewPic" :render-header="renderHeader">
            <template slot-scope="scope">
              <el-tooltip class="item table-img" effect="dark" content="点击查看大图" placement="top-start">
                <div @click="openBigImgShow(scope.row)">
                  <el-image style="width: 40px; height: 40px"
                            :src="scope.row.previewPic ? scope.row.previewPic.split(',')[0] : ''">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document"
                @click="handleView(scope.row)"
                v-hasPermi="['video:operationVideo:query']"
              >详情
              </el-button>
    <!--          <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['video:operationVideo:edit']"
              >修改
              </el-button>-->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['video:operationVideo:remove']"
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
    <!-- 添加或修改设备关联管理对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="operationVideo-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="经营场所" prop="operationName" v-if="!readOnly">
                  <el-input v-model="form.operationName" :disabled="true" readonly placeholder="请输入经营场所id"/>
                </el-form-item>
                <el-form-item label="经营场所：" prop="operationName" v-if="readOnly" class="custom-form-item">
                  {{ form.operationName }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备编号" prop="deviceCode" v-if="!readOnly">
                  <el-input v-model="form.deviceCode" :disabled="true" readonly placeholder="请输入设备编号"/>
                </el-form-item>
                <el-form-item label="设备编号：" prop="deviceCode" v-if="readOnly" class="custom-form-item">
                  {{ form.deviceCode }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称" prop="deviceName" v-if="!readOnly">
                  <el-input v-model="form.deviceName" placeholder="请输入设备名称"/>
                </el-form-item>
                <el-form-item label="设备名称：" prop="deviceName" v-if="readOnly" class="custom-form-item">
                  {{ form.deviceName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="缩略图：" prop="picturePath">
                  <el-upload
                    style="margin-top: 10px"
                    v-loading="picLoading"
                    :disabled="readOnly"
                    class="avatar-uploader"
                    :headers="uploadPic.uploadHeader"
                    :action="uploadPic.uploadImgUrl"
                    accept=".png,.jpg"
                    list-type="picture-card"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="uploadPic.dialogImageUrl&&uploadPic.dialogImageUrl!=''" :src="uploadPic.dialogImageUrl" class="avatar">
                    <i v-else-if="!readOnly" class="el-icon-plus avatar-uploader-icon"></i>
                    <i v-else class="avatar-uploader-icon">暂无照片</i>
                  </el-upload>
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
    <el-dialog
      :visible.sync="previewBigImg.show"
      width="30%">
      <div slot="title">
        <span><i :class="previewBigImg.dialogIcon"></i></span>
        <span> {{ previewBigImg.title }}</span>
      </div>
      <div style="text-align: center">
        <el-image v-if="previewBigImg.url" :src="previewBigImg.url"></el-image>
        <el-image v-if="!previewBigImg.url" :src="previewBigImg.url" style="width: 200px;">
          <div slot="error" class="image-slot" style="text-align: center">
            <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
              暂无图片</i>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewBigImg.show = false">关 闭</el-button>
      </span>
    </el-dialog>
    <video-device-select-dialog ref="videoDeviceSelectDialog"
                                @callBack="videoSelectCallBack(arguments)"></video-device-select-dialog>
    <operation-dialog :show-enterprise="false" ref="operationDialog" @callBack="operationCallBack(arguments)"
                      :close-on-click-modal="false"></operation-dialog>
  </div>
</template>

<script>
import operationVideo from "./operationVideo";
import VideoDeviceSelectDialog from "@/views/video/components/videoDeviceSelectDialog";
import OperationDialog from "@/views/components/highQuery/operationDialog";

export default {
  components: {OperationDialog, VideoDeviceSelectDialog},
  ...operationVideo
}
</script>
<style scoped>
.form-item {
  width: 100%;
}

.avatar {
  width: 200px;
  height: 150px;
  display: block;
  margin-left: -1px;
  margin-top: -1px;
}

.avatar-uploader .el-upload--picture-card{
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 198px;
  height: 148px;
  cursor: pointer;
  line-height: 155px;
  vertical-align: top;
}
/deep/ .el-tree-node__label{
  font-size: 12px !important;
}
</style>
