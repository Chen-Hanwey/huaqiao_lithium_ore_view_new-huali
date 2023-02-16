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
            <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['alarm:alarm:add']">新增
            </el-button> -->
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['alarm:alarm:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['alarm:alarm:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">摄像头编号</label>
          <el-form-item label="" prop="cameraSn">
            <el-input v-model="queryParams.cameraSn" class="query-param" placeholder="请输入摄像头编号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">设备编号</label>
          <el-form-item label="" prop="deviceSn">
            <el-input v-model="queryParams.deviceSn" class="query-param" placeholder="请输入设备编号" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <!-- <div class="condition-item">
          <label class="condition-item-title">状态 1待分派 2待处理 3 已完成</label>
          <el-form-item label="" prop="status">
            <el-select v-model="queryParams.status" placeholder="--全部--" clearable size="small" class="query-param">
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </div> -->
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="alarmList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警类型" align="left" prop="typeName" sortable :render-header="renderHeader" />
      <el-table-column label="摄像头编号" align="left" prop="cameraSn" sortable :render-header="renderHeader" />
      <el-table-column label="设备编号" align="left" prop="deviceSn" sortable :render-header="renderHeader" />
      <!-- <el-table-column label="渲染后图片" align="left" prop="image" sortable :render-header="renderHeader" /> -->
      <el-table-column label="状态" align="left" prop="status" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ fomart(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="告警时间" align="left" prop="curTime" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.curTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="更新时间" align="left" prop="frequency" sortable :render-header="renderHeader" /> -->
      <!-- <el-table-column label="是否挂起" align="left" prop="isHang" sortable :render-header="renderHeader" />
      <el-table-column label="挂起父级ID" align="left" prop="hangParentId" sortable :render-header="renderHeader" />
      <el-table-column label="是否联动" align="left" prop="isLinkage" sortable :render-header="renderHeader" />
      <el-table-column label="视频云账号" align="left" prop="videoCloudAccount" sortable :render-header="renderHeader" />
      <el-table-column label="事件编号" align="left" prop="eventSn" sortable :render-header="renderHeader" />
      <el-table-column label="租户ID" align="left" prop="tenantId" sortable :render-header="renderHeader" />
      <el-table-column label="祖级列表" align="left" prop="ancestors" sortable :render-header="renderHeader" />
      <el-table-column label="是否下发 1是 0否" align="left" prop="isIssue" sortable :render-header="renderHeader" />
      <el-table-column label="是否升级 1是 0否" align="left" prop="isUpgrade" sortable :render-header="renderHeader" />
      <el-table-column label="下发/升级原因" align="left" prop="description" sortable :render-header="renderHeader" />
      <el-table-column label="流程类型 1镇级 2村级" align="left" prop="processType" sortable :render-header="renderHeader" /> -->
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="230">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-close" @click="handleFalse(scope.row)" v-hasPermi="['incident:receive:review']" v-if="scope.row.status == 0 ">误报
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-check" @click="handleConfirm(scope.row)" v-hasPermi="['incident:receive:review']" v-if="scope.row.status == 0 ">确认
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['alarm:alarm:query']">详情</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['alarm:alarm:edit']">修改</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['alarm:alarm:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改事件告警对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="_baseForm_small">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="alarm-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="能力类型" prop="type" v-if="!readOnly">
                  <el-select v-model="form.type" placeholder="请选择能力类型" class="customSelect form-item">
                    <el-option label="请选择字典生成" value="" />
                  </el-select>
                </el-form-item>
                <el-form-item label="告警类型：" prop="typeName" v-if="readOnly" class="custom-form-item">
                  {{form.typeName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="摄像头编号" prop="cameraSn" v-if="!readOnly">
                  <el-input v-model="form.cameraSn" placeholder="请输入摄像头编号" />
                </el-form-item>
                <el-form-item label="摄像头编号：" prop="cameraSn" v-if="readOnly" class="custom-form-item">
                  {{form.cameraSn}}
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="form.typeName !=='超速告警'">
                <el-form-item label="设备编号" prop="deviceSn" v-if="!readOnly">
                  <el-input v-model="form.deviceSn" placeholder="请输入设备编号" />
                </el-form-item>
                <el-form-item label="设备编号：" prop="deviceSn" v-if="readOnly" class="custom-form-item">
                  {{form.deviceSn}}
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

              <el-col :span="8" v-if="form.typeName ==='超速告警'">
                <el-form-item label="设备编号" prop="deviceSn" v-if="!readOnly">
                  <el-input v-model="form.deviceSn" placeholder="请输入设备编号" />
                </el-form-item>
                <el-form-item label="超速速度：" prop="deviceSn" v-if="readOnly" class="custom-form-item">
                  {{formatSpeed(form.speed)}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="告警时间" prop="curTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.curTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择分析时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="告警时间：" prop="curTime" v-if="readOnly" class="custom-form-item">
                  {{form.curTime}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态 1待分派 2待处理 3 已完成" prop="status" v-if="!readOnly">
                  <el-radio-group v-model="form.status" class="customRadio form-item">
                    <el-radio label="1">请选择字典生成</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="状态：" prop="status" v-if="readOnly" class="custom-form-item">

                  <span>{{ fomart(this.form.status) }}</span>

                </el-form-item>
              </el-col>
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

            </el-row>
          </div>
        </div>
        <div v-show="show">
          <div class="sub-project">
            <div class="sub-title">
              <div class="sub-title-name">车辆信息</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="车牌号" prop="licenseNo" v-if="!readOnly">
                    <el-input v-model="formCar.licenseNo" placeholder="请输入车牌号" />
                  </el-form-item>
                  <el-form-item label="车牌号：" prop="licenseNo" v-if="readOnly" class="custom-form-item">
                    {{ formCar.licenseNo }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="所属部门：" prop="deptId" v-if="readOnly" class="custom-form-item">
                    {{ formCar.deptName }}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用途" prop="carUse" v-if="!readOnly">
                    <el-input v-model="form.carUse" placeholder="请输入用途" maxlength="100" />
                  </el-form-item>
                  <el-form-item label="用途：" prop="carUse" v-if="readOnly" class="custom-form-item">
                    {{ formCar.carUse }}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="购置日期" prop="buyDate" v-if="!readOnly">
                    <el-date-picker clearable size="small" class="form-item" v-model="form.buyDate" type="date" value-format="yyyy-MM-dd" placeholder="选择购置日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="购置日期：" prop="buyDate" v-if="readOnly" class="custom-form-item">
                    {{ formCar.buyDate }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="司机名称" prop="personName" v-if="!readOnly">
                    <el-input v-model="form.personName" placeholder="请输入司机名称" maxlength="100" />
                  </el-form-item>
                  <el-form-item label="司机名称：" prop="personName" v-if="readOnly" class="custom-form-item">
                    {{ formCar.personName }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="司机手机号" prop="personNumber" v-if="!readOnly">
                    <el-input v-model="form.personNumber" placeholder="请输入司机手机号" maxlength="100" />
                  </el-form-item>
                  <el-form-item label="司机手机号" prop="personNumber" v-if="readOnly" class="custom-form-item">
                    {{ formCar.personNumber }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="是否安装定位" prop="positioning" v-if="!readOnly">
                    <el-radio-group v-model="formCar.positioning">
                      <el-radio :label="'0'">未安装</el-radio>
                      <el-radio :label="'1'">已安装</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="是否安装定位" prop="sex" v-if="readOnly" class="custom-form-item">
                    {{form.positioning}}
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="备注" prop="remark" v-if="!readOnly">
                    <el-input type="textarea" v-model="form.remark" placeholder="请输入备注" maxlength="100" :show-word-limit="true" />
                  </el-form-item>
                  <el-form-item label="备注" prop="remark" v-if="readOnly">
                    {{ formCar.remark }}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="sub-project" v-if="readOnly">
            <div class="sub-title">
              <div class="sub-title-name">运行信息：</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="行驶状态:" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formCar.status }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="车速:" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formart(formCar.speed)}}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="车辆位置:" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formCar.address }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="经度" prop="lng" v-if="!readOnly">
                    <el-input v-model="form.lng" placeholder="请输入经度" />
                  </el-form-item>
                  <el-form-item label="经度：" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formCar.lng }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="纬度" prop="lat" v-if="!readOnly">
                    <el-input v-model="form.lat" placeholder="请输入纬度" />
                  </el-form-item>
                  <el-form-item label="纬度：" prop="lat" v-if="readOnly" class="custom-form-item">
                    {{ formCar.lat }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="位置信息：" class="custom-form-item" v-if="readOnly">
                    <div class="amap-page-container1" style="padding-top: 10px;margin-bottom: 10px;" v-if="show">
                      <a-map ref="location-unedit" v-if="open" :lng="formCar.lng" :lat="formCar.lat" :marker-edit="false" />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
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

    <!-- 告警确认 -->
    <el-dialog :visible.sync="openStatusDialog" class="_baseForm_big" append-to-body>
      <div slot="title">
        <span><i class="el-icon-check"></i></span>
        <span> {{statusDialogTitle}}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-loading="loadingDig">
        <el-form-item label="告警类型:" prop="type">
          <span>{{ typeFormat(form) }}</span>
        </el-form-item>
        <el-form-item label="设备名称:" prop="cameraName">
          <span>{{ form.cameraName }}</span>
        </el-form-item>

        <el-form-item label="告警时间:" prop="receiveTime">
          <span>{{ form.curTime }}</span>
        </el-form-item>
        <!-- <el-form-item label="是否联动:" prop="isLinkage">
          <el-radio-group v-model="form.isLinkage" @change="isLinkageChange(form)">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <div v-if="form.isLinkage == 1 && form.linkageData !== null && form.programId == null">
          <el-form-item label="联动云喇叭:">
            <span>{{ form.linkageData.targetDriveNames }}</span>
          </el-form-item>
          <el-form-item label="联动手机号:">
            <span>{{ form.linkageData.phone }}</span>
          </el-form-item>
          <el-form-item label="联动短信内容:">
            <span>{{ form.linkageData.msgContent }}</span>
          </el-form-item>
        </div>

        <el-form-item label="联动说明:" v-if="form.isLinkage == 1">
          <span @click="toLinkage(form)" style="color: #38b3ff; ">点击前往告警联动配置</span>-
        </el-form-item>

        <!-- 选择处理人-->
        <el-form-item label="选择处理人:" prop="assignUserId">
          <el-row>
            <el-col :span="12">
              <el-input disabled :value="selectProcessUser.nickName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button @click="selectUser('town_grid')" style="margin-left: 5px;">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <span style="color: red;">
            {{ statusOpDes }}，确认后无法修改!
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择审批人 -->
    <el-dialog center :visible.sync="openSelectUser" class="_baseForm_big" :close-on-click-modal="false" append-to-body>
      <div slot="title">
        <span><i class="el-icon-view"></i></span>
        <span>请选择处理人</span>
      </div>
      <div class="collectForm-body"></div>
      <process-select-user :selectProcessUser.sync="selectProcessUser" ref="selectProcessUserDialog" :perms="queryPerms"></process-select-user>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="openSelectUser = false;">确 定</el-button>
          <el-button @click="openSelectUser = false;">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import alarm from "./alarm";
export default {
  ...alarm
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
.form-item {
  width: 100%;
}
.vue-treeselect__control {
  height: 32px;
}
.vue_treeselect .el-form-item__content {
  line-height: 31px;
}

.amap-page-container1 {
  width: 100%;
  height: 350px;
}

.form-item {
  width: 240px;
}

.el-tree {
  height: 100%;
}

.map-container {
}

.map-container .info {
  position: absolute;
  top: 0px;
  border-width: 0;
  opacity: 0.95;
}

.map-container .input-item {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

.map-container .input-item-prepend {
  margin-right: -1px;
}

.map-container .input-item-text {
  width: auto;
  padding: 0.4rem 0.7rem;
  display: inline-block;
  text-align-last: justify;
  align-items: center;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
}

.map-container .tipinput {
  margin-top: 10px;
  margin-left: 10px;
  width: 350px;
}
</style>
