<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">告警类型</label>

          <el-form-item label="" prop="type" class="custom-el-form-item">
            <el-select v-model="queryParams.type" placeholder="请选择告警类型" clearable size="small" class="query-param">
              <el-option v-for="dict in typeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>

        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['event:event:add']">新增
            </el-button> -->
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['event:event:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['event:event:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">设备编号</label>
          <el-form-item label="" prop="deviceSn">
            <el-input v-model="queryParams.deviceSn" class="query-param" placeholder="请输入设备编号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">设备编号</label>
          <el-form-item label="" prop="cameraSn">
            <el-input v-model="queryParams.cameraSn" class="query-param" placeholder="请输入设备编号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">审核员</label>
          <el-form-item label="" prop="auditUserId">
            <el-input v-model="queryParams.auditUserId" class="query-param" placeholder="请输入审核员" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <!-- <div class="condition-item">
          <label class="condition-item-title">联系方式</label>
          <el-form-item label="" prop="auditUserPhone">
            <el-input v-model="queryParams.auditUserPhone" class="query-param" placeholder="请输入联系方式" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">短信通知</label>
          <el-form-item label="" prop="msgContent">
            <el-input v-model="queryParams.msgContent" class="query-param" placeholder="请输入短信通知" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">事件发生时间</label>
          <el-form-item label="" prop="receiveTime">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.receiveTimeRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择事件发生时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">处理状态</label>
          <el-form-item label="" prop="handleStatus">
            <el-select v-model="queryParams.handleStatus" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">处理时间</label>
          <el-form-item label="" prop="handleTime">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.handleTimeRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择处理时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">挂起次数</label>
          <el-form-item label="" prop="hangCount">
            <el-input v-model="queryParams.hangCount" class="query-param" placeholder="请输入挂起次数" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">是否联动</label>
          <el-form-item label="" prop="isLinkage">
            <el-input v-model="queryParams.isLinkage" class="query-param" placeholder="请输入是否联动" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">分派人ID</label>
          <el-form-item label="" prop="assignUserId">
            <el-input v-model="queryParams.assignUserId" class="query-param" placeholder="请输入分派人ID" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">分派时间</label>
          <el-form-item label="" prop="assignTime">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.assignTimeRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择分派时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">处理人</label>
          <el-form-item label="" prop="handleBy">
            <el-input v-model="queryParams.handleBy" class="query-param" placeholder="请输入处理人" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">告警数据保存的ID</label>
          <el-form-item label="" prop="incidentId">
            <el-input v-model="queryParams.incidentId" class="query-param" placeholder="请输入告警数据保存的ID" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">租户ID</label>
          <el-form-item label="" prop="tenantId">
            <el-input v-model="queryParams.tenantId" class="query-param" placeholder="请输入租户ID" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">祖级列表</label>
          <el-form-item label="" prop="ancestors">
            <el-input v-model="queryParams.ancestors" class="query-param" placeholder="请输入祖级列表" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div> -->
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="eventList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警类型" align="left" prop="typeName" sortable :render-header="renderHeader" />
      <el-table-column label="设备编号" align="left" prop="deviceSn" sortable :render-header="renderHeader" width="150px" />
      <el-table-column label="摄像头编号" align="left" prop="cameraSn" sortable :render-header="renderHeader" width="150px" />
      <el-table-column label="事件发生时间" align="left" prop="receiveTime" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="left" prop="handleStatus" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ fromatStatus(scope.row.handleStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="left" prop="handleTime" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.handleTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理人" align="left" prop="handleBy" sortable :render-header="renderHeader" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleView(scope.row)" v-hasPermi="['event:event:list']">处理</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['event:event:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改告警事件对话框 -->
    <el-dialog :visible.sync="open" fullscreen :close-on-click-modal="false" class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="event-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="告警类型" prop="type" v-if="!readOnly">
                  <el-select v-model="form.type" placeholder="请选择告警类型" class="customSelect form-item">
                    <el-option label="请选择字典生成" value="" />
                  </el-select>
                </el-form-item>
                <el-form-item label="告警类型：" prop="type" v-if="readOnly" class="custom-form-item">
                  {{form.typeName}}
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="form.typeName ==='超速告警'">
                <el-form-item label="设备编号" prop="deviceSn" v-if="!readOnly">
                  <el-input v-model="form.deviceSn" placeholder="请输入设备编号" />
                </el-form-item>
                <el-form-item label="车牌号：" prop="deviceSn" v-if="readOnly" class="custom-form-item">
                  {{form.deviceSn}}
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="form.typeName !='超速告警'">
                <el-form-item label="设备编号" prop="cameraSn" v-if="!readOnly">
                  <el-input v-model="form.cameraSn" placeholder="请输入设备编号" />
                </el-form-item>
                <el-form-item label="设备编号：" prop="cameraSn" v-if="readOnly" class="custom-form-item">
                  {{form.cameraSn}}
                </el-form-item>
              </el-col>

              <!-- <el-col :span="24" v-if="form.typeName !=='超速告警'">
                <el-form-item label="告警图片：" prop="image">
                  <div v-for="(src,index) in splitImg(form.image)" :key="index" style="display: inline-block;margin-right: 10px">
                    <el-image v-if="form.alarmSource=='camera'" style="width: 87px; height: 50px" :src="VUE_APP_PICTURE_PATH+src" :preview-src-list="[VUE_APP_PICTURE_PATH+src]" fit="fill"></el-image>

                    <el-image v-if="form.alarmSource=='car'" style="width: 87px; height: 50px" :src="src" :preview-src-list="[src]" fit="fill"></el-image>
                  </div>

                </el-form-item>
              </el-col>

              <el-col :span="24" v-if="form.typeName ==='超速告警'">
                <el-form-item label="告警图片：" prop="image">
                  <div style="display: inline-block;margin-right: 10px">
                    <el-image style="width: 87px; height: 50px" :src="form.picUrl" :preview-src-list="[form.picUrl]" fit="fill"></el-image>
                  </div>

                </el-form-item>
              </el-col> -->
              <div v-if="form.typeName !=='未盖篷布' && form.typeName !=='未带安全帽'">
                <el-col :span="24" v-if="form.typeName !=='超速告警'">
                  <el-form-item label="告警图片：" prop="image">
                    <div v-for="(src,index) in splitImg(form.image)" :key="index" style="display: inline-block;margin-right: 10px">
                      <el-image v-if="form.alarmSource=='camera'" style="width: 87px; height: 50px" :src="VUE_APP_PICTURE_PATH+src" :preview-src-list="[VUE_APP_PICTURE_PATH+src]" fit="fill"></el-image>

                      <el-image v-if="form.alarmSource=='car'" style="width: 87px; height: 50px" :src="src" :preview-src-list="[src]" fit="fill"></el-image>
                    </div>

                  </el-form-item>
                </el-col>

                <el-col :span="24" v-if="form.typeName ==='超速告警'">
                  <el-form-item label="告警图片：" prop="image">
                    <div style="display: inline-block;margin-right: 10px">
                      <el-image style="width: 87px; height: 50px" :src="form.picUrl" :preview-src-list="[form.picUrl]" fit="fill"></el-image>
                    </div>
                  </el-form-item>
                </el-col>
              </div>
              <el-col :span="24" v-if="form.typeName ==='未盖篷布' ||form.typeName ==='未带安全帽'">
                <el-form-item label="告警图片：" prop="image">
                  <div style="display: inline-block;margin-right: 10px">
                    <el-image style="width: 87px; height: 50px" :src="form.picUrl" :preview-src-list="[form.picUrl]" fit="fill"></el-image>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="分派人ID" prop="assignUserId" v-if="!readOnly">
                  <el-input v-model="form.assignUserId" placeholder="请输入分派人ID" />
                </el-form-item>
                <el-form-item label="分派人：" prop="assignUserId" v-if="readOnly" class="custom-form-item">
                  {{form.assignUser}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="分派时间" prop="assignTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.assignTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择分派时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="分派时间：" prop="assignTime" v-if="readOnly" class="custom-form-item">
                  {{form.createTime}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="处理人" prop="handleBy" v-if="!readOnly">
                  <el-input v-model="form.handleBy" placeholder="请输入处理人" />
                </el-form-item>
                <el-form-item label="处理人：" prop="handleBy" v-if="readOnly" class="custom-form-item">
                  {{form.handleBy}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="处理状态" prop="handleStatus" v-if="!readOnly">
                  <el-radio-group v-model="form.handleStatus" class="customRadio form-item">
                    <el-radio label="1">请选择字典生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="处理状态：" prop="handleStatus" v-if="readOnly" class="custom-form-item">
                  {{fromatStatus(form.handleStatus)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="处理时间" prop="handleTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.handleTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择处理时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="处理时间：" prop="handleTime" v-if="readOnly" class="custom-form-item">
                  {{form.handleTime}}
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>

        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">处理情况</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="处理情况" prop="remark">
                  <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="remark">
                  </el-input>
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
          <el-button type="primary" @click="handleEvent">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import data from '../../../system/dict/data.vue';
import event from "./toduEvent";
export default {
  components: { data },
  ...event
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
