<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">海拔</label>
          <el-form-item label="" prop="altitude" class="custom-el-form-item">
            <el-input v-model="queryParams.altitude" class="query-param" placeholder="请输入海拔" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['camera:camera:add']">新增
            </el-button> -->

            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="sync" v-hasPermi="['camera:camera:add']">同步设备
            </el-button>
            <!-- <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['camera:camera:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['camera:camera:remove']">删除</el-button> -->
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">监控唯一标识点</label>
          <el-form-item label="" prop="cameraIndexCode">
            <el-input v-model="queryParams.cameraIndexCode" class="query-param" placeholder="请输入监控唯一标识点" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">监控名称</label>
          <el-form-item label="" prop="cameraName">
            <el-input v-model="queryParams.cameraName" class="query-param" placeholder="请输入监控名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">监控类型</label>
          <el-form-item label="" prop="cameraType">
            <el-select v-model="queryParams.cameraType" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">监控类型名称</label>
          <el-form-item label="" prop="cameraTypeName">
            <el-input v-model="queryParams.cameraTypeName" class="query-param" placeholder="请输入监控类型名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">通道编号</label>
          <el-form-item label="" prop="channelNo">
            <el-input v-model="queryParams.channelNo" class="query-param" placeholder="请输入通道编号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">通道类型</label>
          <el-form-item label="" prop="channelType">
            <el-select v-model="queryParams.channelType" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">通道类型名称</label>
          <el-form-item label="" prop="channelTypeName">
            <el-input v-model="queryParams.channelTypeName" class="query-param" placeholder="请输入通道类型名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">所属设备id</label>
          <el-form-item label="" prop="encodeDevIndexCode">
            <el-input v-model="queryParams.encodeDevIndexCode" class="query-param" placeholder="请输入所属设备id" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">安装地点</label>
          <el-form-item label="" prop="installLocation">
            <el-input v-model="queryParams.installLocation" class="query-param" placeholder="请输入安装地点" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">经度</label>
          <el-form-item label="" prop="latitude">
            <el-input v-model="queryParams.latitude" class="query-param" placeholder="请输入经度" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">纬度</label>
          <el-form-item label="" prop="longitude">
            <el-input v-model="queryParams.longitude" class="query-param" placeholder="请输入纬度" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">在线状态</label>
          <el-form-item label="" prop="status">
            <el-select v-model="queryParams.status" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="cameraList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="海拔" align="left" prop="altitude" sortable :render-header="renderHeader" />
      <el-table-column label="监控编码" align="left" prop="cameraIndexCode" sortable :render-header="renderHeader" />
      <el-table-column label="监控名称" align="left" prop="cameraName" sortable :render-header="renderHeader" />
      <el-table-column label="监控类型" align="left" prop="cameraTypeName" sortable :render-header="renderHeader" />
      <!-- <el-table-column label="监控类型" align="left" prop="cameraType" sortable :render-header="renderHeader" /> -->
      <!--  <el-table-column label="监控类型名称" align="left" prop="cameraTypeName" sortable :render-header="renderHeader" />
      <el-table-column label="通道编号" align="left" prop="channelNo" sortable :render-header="renderHeader" />
       <el-table-column label="通道类型" align="left" prop="channelType" sortable :render-header="renderHeader" />
       <el-table-column label="通道类型名称" align="left" prop="channelTypeName" sortable :render-header="renderHeader" />
       <el-table-column label="所属设备id" align="left" prop="encodeDevIndexCode" sortable :render-header="renderHeader" />-->
      <el-table-column label="安装地点" align="left" prop="installLocation" sortable :render-header="renderHeader" />
      <el-table-column label="维度" align="left" prop="latitude" sortable :render-header="renderHeader" />
      <el-table-column label="经度" align="left" prop="longitude" sortable :render-header="renderHeader" />
      <el-table-column label="在线状态" align="left" prop="status" sortable :render-header="renderHeader" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['camera:camera:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['camera:camera:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['camera:camera:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改摄像头列对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="_baseForm_big">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="camera-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="海拔" prop="altitude" v-if="!readOnly">
                  <el-input v-model="form.altitude" placeholder="请输入海拔" />
                </el-form-item>
                <el-form-item label="海拔：" prop="altitude" v-if="readOnly" class="custom-form-item">
                  {{form.altitude}}
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                <el-form-item label="监控唯一标识点" prop="cameraIndexCode" v-if="!readOnly">
                  <el-input v-model="form.cameraIndexCode" placeholder="请输入监控唯一标识点" />
                </el-form-item>
                <el-form-item label="监控唯一标识点：" prop="cameraIndexCode" v-if="readOnly" class="custom-form-item">
                  {{form.cameraIndexCode}}
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item label="监控名称" prop="cameraName" v-if="!readOnly">
                  <el-input v-model="form.cameraName" placeholder="请输入监控名称" />
                </el-form-item>
                <el-form-item label="监控名称：" prop="cameraName" v-if="readOnly" class="custom-form-item">
                  {{form.cameraName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="监控类型" prop="cameraType" v-if="!readOnly">
                  <el-select v-model="form.cameraType" placeholder="请选择监控类型" class="customSelect form-item">
                    <el-option label="请选择字典生成" value="" />
                  </el-select>
                </el-form-item>
                <el-form-item label="监控类型：" prop="cameraType" v-if="readOnly" class="custom-form-item">
                  <!--{{cameraTypeFormat(form)}}-->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="监控类型名称" prop="cameraTypeName" v-if="!readOnly">
                  <el-input v-model="form.cameraTypeName" placeholder="请输入监控类型名称" />
                </el-form-item>
                <el-form-item label="监控类型名称：" prop="cameraTypeName" v-if="readOnly" class="custom-form-item">
                  {{form.cameraTypeName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="通道编号" prop="channelNo" v-if="!readOnly">
                  <el-input v-model="form.channelNo" placeholder="请输入通道编号" />
                </el-form-item>
                <el-form-item label="通道编号：" prop="channelNo" v-if="readOnly" class="custom-form-item">
                  {{form.channelNo}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="通道类型" prop="channelType" v-if="!readOnly">
                  <el-select v-model="form.channelType" placeholder="请选择通道类型" class="customSelect form-item">
                    <el-option label="请选择字典生成" value="" />
                  </el-select>
                </el-form-item>
                <el-form-item label="通道类型：" prop="channelType" v-if="readOnly" class="custom-form-item">
                  <!--{{channelTypeFormat(form)}}-->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="通道类型名称" prop="channelTypeName" v-if="!readOnly">
                  <el-input v-model="form.channelTypeName" placeholder="请输入通道类型名称" />
                </el-form-item>
                <el-form-item label="通道类型名称：" prop="channelTypeName" v-if="readOnly" class="custom-form-item">
                  {{form.channelTypeName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="所属设备id" prop="encodeDevIndexCode" v-if="!readOnly">
                  <el-input v-model="form.encodeDevIndexCode" placeholder="请输入所属设备id" />
                </el-form-item>
                <el-form-item label="所属设备id：" prop="encodeDevIndexCode" v-if="readOnly" class="custom-form-item">
                  {{form.encodeDevIndexCode}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="安装地点" prop="installLocation" v-if="!readOnly">
                  <el-input v-model="form.installLocation" placeholder="请输入安装地点" />
                </el-form-item>
                <el-form-item label="安装地点：" prop="installLocation" v-if="readOnly" class="custom-form-item">
                  {{form.installLocation}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="维度" prop="latitude" v-if="!readOnly">
                  <el-input v-model="form.latitude" placeholder="请输入维度" />
                </el-form-item>
                <el-form-item label="维度：" prop="latitude" v-if="readOnly" class="custom-form-item">
                  {{form.latitude}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="经度" prop="longitude" v-if="!readOnly">
                  <el-input v-model="form.longitude" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="经度" prop="longitude" v-if="readOnly" class="custom-form-item">
                  {{form.longitude}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="在线状态" prop="status" v-if="!readOnly">
                  <el-radio-group v-model="form.status" class="customRadio form-item">
                    <el-radio label="1">请选择字典生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="在线状态：" prop="status" v-if="readOnly" class="custom-form-item">
                  <!--{{statusFormat(form)}}-->
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
import camera from "./camera";
export default {
  ...camera
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
