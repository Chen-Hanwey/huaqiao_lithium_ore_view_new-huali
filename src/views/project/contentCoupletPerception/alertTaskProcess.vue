<template>
  <el-dialog center :visible.sync="openProcess" class="_baseForm_big" :close-on-click-modal="false">
    <div slot="title">
      <span><i :class="dialogIcon"></i></span>
      <span> {{ title }}</span>
    </div>
    <div class="collectForm-body"></div>
    <div v-loading="loadingDig">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project" v-if="taskDefKey!='horn_task_submit'">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>

          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="告警类型：">
                  <span>环境监测</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="告警分类：" prop="devType">
                  <span>{{ devTypeFormatter(form) }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="设备名称：" prop="devName">
                  <span>{{ form.devName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="告警指标：" prop="alarmLabel">
                  <span>{{ form.alarmLabel }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="监测值：" prop="monitor">
                  <span>{{ form.monitor }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="告警时间：" prop="createTime">
                  <span>{{ form.createTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <!--<div class="sub-project" v-if="form.processId">
          <div class="sub-title">
            <div class="sub-title-name">流程信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="流程图：" prop="">
                  <el-image :style="imageStyle" :src="processImageUrl" fit="scale-down"></el-image>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="当前节点：" prop="" v-if="form.currentTaskList&&form.currentTaskList.length>0">
                  <el-row>
                    <el-col :span="24">
                      <el-table :data="form.currentTaskList" style="width: 100%">
                        <el-table-column prop="activityName" label="节点名称"></el-table-column>
                        <el-table-column prop="assignee" label="经办人"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间"></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="办理记录：" prop="">
                  <el-row>
                    <el-col :span="24">
                      <el-table :data="form.taskList" style="width: 100%">
                        <el-table-column prop="activityName" label="节点名称"></el-table-column>
                        <el-table-column prop="assignee" label="经办人"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间"></el-table-column>
                        <el-table-column prop="endTime" label="办理时间"></el-table-column>
                        <el-table-column prop="comment" label="意见/情况"></el-table-column>
                      </el-table>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>-->

        <!--告警处理-->
        <!--<div class="sub-project" v-if="form.processId!=null && form.processId!=undefined && form.processId!=''
        && workType!='1' && workType!='' && workType!=null">
          <div class="sub-title">
            <div class="sub-title-name">告警处理</div>
          </div>
          <div class="sub-body">

            <el-form-item label="选择村级网格员：" prop="assignUserId" v-if="taskDefKey=='environmental_monitoring_task_dispatch_cun'">
              <el-row>
                <el-col :span="12">
                  <el-input disabled :value="selectProcessUser.nickName"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-button @click="selectUser('village_grid')" style="margin-left: 5px;">选择</el-button>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="处理意见：" prop="isStatus" v-if="taskDefKey=='environmental_monitoring_village_task_dispatch_zhen'">
              <el-radio-group v-model="form.isStatus" @change="isStatusChange(form)">
                <el-radio label="1">通过</el-radio>
                <el-radio label="0">驳回</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="选择镇级网格员：" prop="assignUserId" v-if="taskDefKey=='environmental_monitoring_village_task_dispatch_zhen' && form.isStatus=='1'">
              <el-row>
                <el-col :span="12">
                  <el-input disabled :value="selectProcessUser.nickName"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-button @click="selectUser('town_grid')" style="margin-left: 5px;">选择</el-button>
                </el-col>
              </el-row>
            </el-form-item>


            &lt;!&ndash;村级管理员升级&ndash;&gt;
            <el-form-item label="是否升级:" prop="isUpgrade" v-if="taskDefKey=='environmental_monitoring_village_task_dispatch_cun'">
              <el-radio-group v-model="form.isUpgrade" @change="isUpgradeChange(form)">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择村级网格员:" prop="assignUserId" v-if="taskDefKey=='environmental_monitoring_village_task_dispatch_cun' && form.isUpgrade=='0'">
              <el-row>
                <el-col :span="12">
                  <el-input disabled :value="selectProcessUser.nickName"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-button @click="selectUser('village_grid')" style="margin-left: 5px;">选择</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="选择镇级调度员:" prop="assignUserId" v-if="taskDefKey=='environmental_monitoring_village_task_dispatch_cun' && form.isUpgrade=='1'">
              <el-row>
                <el-col :span="12">
                  <el-input disabled :value="selectProcessUser.nickName"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-button @click="selectUser('town_dispatch')" style="margin-left: 5px;">选择</el-button>
                </el-col>
              </el-row>
            </el-form-item>


            <el-row>
              <el-col :span="24">
                <el-form-item label="处理情况：" prop="statustContent">
                  <el-input v-model="statustContent" type="textarea" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入处理情况说明"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

        </div>-->

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <!--<div v-if="workType=='2'">
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_task_grid_zhen'" v-loading="loadingDig" style="width: 100px;" @click="submitStatusForm">处理</el-button>
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_task_dispatch_cun'" v-loading="loadingDig" style="width: 100px;" @click="submitDispatch(1)">提交处理</el-button>
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_task_grid_cun'" v-loading="loadingDig" style="width: 100px;" @click="submitStatusForm()">处理</el-button>
        <el-button style="width: 100px;" @click="openProcess = false;">关 闭</el-button>
      </div>
      <div v-else-if="workType=='3'">
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_village_task_grid_cun'" v-loading="loadingDig" style="width: 100px;" @click="submitStatusForm">处理</el-button>
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_village_task_dispatch_zhen'" v-loading="loadingDig" style="width: 100px;" @click="submitDispatch(2)">提交处理</el-button>
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_task_grid_cun'" v-loading="loadingDig" style="width: 100px;" @click="submitStatusForm()">处理</el-button>
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_village_task_dispatch_cun'" v-loading="loadingDig" style="width: 100px;" @click="submitDispatch(3)">提交处理</el-button>
        <el-button type="primary" v-if="taskDefKey=='environmental_monitoring_village_task_grid_zhen'" v-loading="loadingDig" style="width: 100px;" @click="submitStatusForm()">处理</el-button>
        <el-button style="width: 100px;" @click="openProcess = false;">关 闭</el-button>
      </div>-->
      <div>
        <el-button @click="openProcess = false;">关 闭</el-button>
      </div>
    </div>

    <!-- 选择审批人 -->
    <!--<el-dialog center :append-to-body="true" class="_baseForm_big" :visible.sync="openSelectUser" :close-on-click-modal="false">
      <div slot="title">
        <span><i class="el-icon-view"></i></span>
        <span>请选择处理人</span>
      </div>
      <div class="collectForm-body"></div>
      <process-select-user :perms="queryPerms" ref="selectProcessUserDialog"
                           :selectProcessUser.sync="selectProcessUser"></process-select-user>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="openSelectUser = false;">确 定</el-button>
          <el-button @click="openSelectUser = false;">取 消</el-button>
        </div>
      </div>
    </el-dialog>-->

  </el-dialog>

</template>
<script>
import { getTasksInfoProcess,getAlert,answerAssignClose,answerDispatchHandle } from "@/api/contentCoupletPerception/alert";
import defaultSetting from "@/settings";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
//import ProcessSelectUser from "@/views/system/user/processSelectUser";
//import { Router_smart_town_admin } from '@/utils/serviceUrlRouter';
import $ from "jquery";

export default {
  name: "alertTaskProcess",
  components: {
    //ProcessSelectUser
  },
  data () {
    return {
      selectProcessUser: {},
      openSelectUser: false,
      readOnly: false,   //查看按钮默认不能编辑
      loadingDig: false,
      form: {

      },
      statusForm: 1,
      statustContent: '',
      dialogIcon: 'el-icon-view',
      openProcess: false,
      // 表单校验
      rules: {

      },
      fileList: [],
      title: "详情",
      processImageUrl: '',
      imageStyle: { width: '100%' },
      toggleImageTitle: '点击查看大图',
      taskList: [],
      // 显示部门信息
      showDeptInfo: false,
      taskDefKey: "",
      formExamine: {

      },
      showTarget: '',
      showMedia: '',
      workType:undefined,
      queryPerms:'',
    };
  },
  watch: {

  },
  created () {

  },
  methods: {
    selectUser (perms) {
      this.openSelectUser = true
      this.selectProcessUser = {}
      this.openSelectUser = true;
      this.queryPerms = perms;
      this.$refs.selectProcessUserDialog.init(this.queryPerms);
    },
    openDialogView () {
      $('.collectForm-body').parent().css('height', $(window).innerHeight() - 120).css('top', 0).css('overflow-y', 'auto')
    },
    init (row) {
      let that = this;
      this.reset();
      this.openProcess = true;
      this.workType = row.workType;
      this.taskDefKey = row.taskDefKey;
      let data = {
        processId: row.processId
      }
      //查询详情
      this.loadingDig = true;
      //流程
      if (this.taskDefKey != '') {
        //查询信息
        getTasksInfoProcess(data).then(response => {
          this.loadingDig = false;
          if (response.data != null) {
            that.form = response.data
            this.form.userId = '';
            this.form.isStatus = "1";
            this.form.isUpgrade = '0';
            //this.processImageUrl = Router_smart_town_admin() + '/process/info?processInstanceId=' + this.form.processId + '&executionId=' + this.form.processId;
          }
        })
      } else {
        getAlert(row.id).then(response => {
          this.loadingDig = false;
          if (response.data != null) {
            that.form = response.data;
            //this.processImageUrl = Router_smart_town_admin() + '/process/info?processInstanceId=' + this.form.processId + '&executionId=' + this.form.processId;
          }
        });
       }
    },
    devTypeFormatter (row) {
      if (row.devType == "1") {
        return "噪声监测";
      }else if(row.devType == "2"){
        return "粉尘监测";
      }
    },
    /**
     * 提交
     */
    submitStatusForm: function () {
      if (this.form.id != undefined) {
        this.loadingDig = true;
        if(this.statustContent=='' || this.statustContent==null){
          this.msgError("请输入处理情况");
          this.loadingDig = false;
          return false;
        }
        this.form.statustContent = this.statustContent;
        answerAssignClose(this.form).then(response => {
          this.msgSuccess('提交成功')
          this.openProcess = false
          this.loadingDig = false;
          this.$parent.getList();
        })
      }
    },
    /** 提交按钮 */
    submitDispatch: function (val)  {
      if (this.form.id != undefined) {
        this.loadingDig = true;
        if(val==1){
          if (!this.selectProcessUser.userId) {
            this.msgError("请选择村级网格员");
            this.loadingDig = false;
            return false;
          }
        }else if(val==2){
          if(this.form.isStatus=='1'){
            if (!this.selectProcessUser.userId) {
              this.msgError("请选择镇级网格员");
              this.loadingDig = false;
              return false;
            }
          }
        }else if(val==3){
          if(this.form.isUpgrade=='0'){
            if (!this.selectProcessUser.userId) {
              this.msgError("请选择村级网格员");
              this.loadingDig = false;
              return false;
            }
          }else if(this.form.isUpgrade=='1'){
            if (!this.selectProcessUser.userId) {
              this.msgError("请选择镇级调度员");
              this.loadingDig = false;
              return false;
            }
          }
        }
        if(this.statustContent=='' || this.statustContent==null){
          this.msgError("请输入处理情况");
          this.loadingDig = false;
          return false;
        }
        this.form.statustContent = this.statustContent;
        this.form.handleUserId = this.selectProcessUser.userId;
        this.form.taskDefKey = this.taskDefKey;
        answerDispatchHandle(this.form).then(response => {
          this.msgSuccess('提交成功')
          this.openProcess = false
          this.loadingDig = false;
          this.$parent.getList();
        })
      }
    },
    reset () {
      this.form = {

      }
      this.resetForm('form')
    },
    handSelectTerm () {
      this.$forceUpdate();
    },
    toggleImage () {
      if (this.imageStyle.height === '200px') {
        this.imageStyle = { width: '100%' };
        this.toggleImageTitle = "点击缩小图片";
      } else {
        this.imageStyle = { height: '200px' };
        this.toggleImageTitle = "点击查看大图";
      }
    },

    downloadFile (item) {
      let url = item.url + "?attname=" + item.name;
      // window.location.href = url;
      window.open(url);
    },
    downloadOriginalFile (item) {
      let url = defaultSetting.picturePath + item.appendixPath + '?attname=' + item.appendixName;
      window.open(url);
    },
  },
  mounted () {
    this.$nextTick(function () {
      this.openDialogView()
    })
  }
};
</script>
<style scoped>
.form-item {
  width: 100%;
}

.table-custom-header {
  padding: 1px 0 13px 0;
  font-weight: 600;
  border-bottom: 1px solid #dfe6ec;
  background: #f8f8f9;
}
</style>

<style>
.el-table .cus-current-row {
  color: #fff;
  background: #1890ff;
}
.el-table .cus-current-row:hover {
  color: #606266;
  background: #fff;
}

.custom-tree-node > span {
  width: 180px;
  display: inline-block;
  color: #c0c4cc;
}

.company-title {
  border-bottom: 1px dotted;
  border-left: 5px solid #1890ff;
  padding-left: 20px;
  color: #999;
  margin: 10px 0;
}

.table-custom-header {
  padding: 4px 0;
  font-weight: 600;
  border-bottom: 1px solid #dfe6ec;
  background: #f8f8f9;
}
.table-custom-header span {
  white-space: nowrap;
  display: inline-block;
}
</style>
