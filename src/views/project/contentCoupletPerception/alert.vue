<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm"
             :inline="true" v-show="showSearch" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">设备名称</label>
          <el-form-item label="" prop="devName" class="custom-el-form-item">
            <el-input v-model="queryParams.devName" class="query-param" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:details:export']">导出告警</el-button>
          </el-form-item>
        </div>
      </div>




      <div class="toggle-container" ref="toggle-container" style="display: none;">
        <!--<el-form-item label="所属辖区" prop="deptName">
          <el-input v-model="queryParams.deptName" placeholder="请输入所属辖区" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>-->
        <div class="condition-item">
          <label class="condition-item-title">告警指标</label>
          <el-form-item label="" prop="alarmIndex">
            <el-input v-model="queryParams.alarmIndex" placeholder="请输入告警指标" class="query-param" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">监测值</label>
          <el-form-item label="" prop="monitor">
            <el-input v-model="queryParams.monitor" placeholder="请输入监测值" class="query-param" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">告警阈值</label>
          <el-form-item label="" prop="threshold">
            <el-input v-model="queryParams.threshold" placeholder="请输入告警阈值" class="query-param" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">告警时间</label>
          <el-form-item label="" prop="createTime">
            <el-date-picker clearable size="small" v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" style="width: 240px" range-separator="-">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">处理状态</label>
          <el-form-item label="" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择处理状态" class="query-param" clearable size="small" @keyup.enter.native="handleQuery">
              <el-option label="待处理" value="0"></el-option>
              <el-option label="已确认" value="1"></el-option>
              <el-option label="误报" value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!--<el-form-item label="告警级别" prop="level">
          <el-select v-model="queryParams.level" placeholder="请选择告警级别" clearable size="small">
            <el-option v-for="dict in levelOptions"
                       :key="dict.dictValue"
                       :label="dict.dictLabel"
                       :value="dict.dictValue" />
          </el-select>
        </el-form-item>-->
      </div>
    </el-form>

    <el-table ref="table" :height="tableHeight" v-loading="loading" @sort-change="changeTableSort" :data="alertList" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" width="60" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" prop="devName" align="center" :render-header="renderHeader" />
      <!--<el-table-column label="告警指标" prop="alarmIndex" align="center" :render-header="renderHeader" />-->
      <el-table-column label="告警指标" prop="alarmLabel" align="center" :render-header="renderHeader" />
      <el-table-column label="监测值" prop="monitor" align="center" :render-header="renderHeader" />
      <el-table-column label="告警阈值" prop="threshold" align="center" :render-header="renderHeader" />
      <el-table-column label="告警时间" prop="createTime" width="180" align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" prop="status" align="center" :render-header="renderHeader">
        <template scope="scope">
          <span v-if="scope.row.status==='0'" >待处理</span>
          <span v-else-if="scope.row.status==='1'" >已确认</span>
          <span v-else-if="scope.row.status==='2'" >误报</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['system:alert:edit']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit"
                     v-if="scope.row.status==='0'" @click="handleFalse(scope.row)" v-hasPermi="['system:alert:edit']">误报</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit"
                     v-if="scope.row.status==='0'" @click="handleConfirm(scope.row)" v-hasPermi="['system:alert:edit']">确认</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:alert:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 告警确认 -->
    <el-dialog :visible.sync="openStatusDialog" class="_baseForm_big" append-to-body>
      <div slot="title">
        <span><i class="el-icon-check"></i></span>
        <span> {{statusDialogTitle}}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" v-loading="loadingDig">
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
        <!--镇级管理员下发-->
        <!--<el-form-item label="是否下发：" prop="isIssue" v-if="tenantId.length==9">
          <el-radio-group v-model="form.isIssue" @change="isIssueChange(form)">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择镇级网格员：" prop="assignUserId" v-if="tenantId.length==9 && form.isIssue=='0'">
          <el-row>
            <el-col :span="12">
              <el-input disabled :value="selectProcessUser.nickName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button @click="selectUser('town_grid')" style="margin-left: 5px;">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="选择村级调度员：" prop="assignUserId" v-if="tenantId.length==9 && form.isIssue=='1'">
          <el-row>
            <el-col :span="12">
              <el-input disabled :value="selectProcessUser.nickName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button @click="selectUser('village_dispatch')" style="margin-left: 5px;">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="下发原因：" prop="description" v-if="tenantId.length==9 && form.isIssue=='1'">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入下发原因" />
        </el-form-item>-->
        <!--村级管理员升级-->
        <!--<el-form-item label="是否升级:" prop="isUpgrade" v-if="tenantId.length>9">
          <el-radio-group v-model="form.isUpgrade" @change="isUpgradeChange(form)">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择村级网格员:" prop="assignUserId" v-if="tenantId.length>9 && form.isUpgrade=='0'">
          <el-row>
            <el-col :span="12">
              <el-input disabled :value="selectProcessUser.nickName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button @click="selectUser('village_grid')" style="margin-left: 5px;">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="选择镇级调度员:" prop="assignUserId" v-if="tenantId.length>9 && form.isUpgrade=='1'">
          <el-row>
            <el-col :span="12">
              <el-input disabled :value="selectProcessUser.nickName"></el-input>
            </el-col>
            <el-col :span="12">
              <el-button @click="selectUser('town_dispatch')" style="margin-left: 5px;">选择</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="升级原因:" prop="description" v-if="tenantId.length>9 && form.isUpgrade=='1'">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入升级原因" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitConfirm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 选择审批人 -->
    <!--<el-dialog center :visible.sync="openSelectUser" class="_baseForm_big" :close-on-click-modal="false" append-to-body>
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
    </el-dialog>-->

    <!--详情-->
    <alert-task-process ref="alertTaskProcessDialog"></alert-task-process>

  </div>
</template>

<script>
import { listAlert, getAlert, delAlert, addAlert, updateAlert,
  exportAlert,handleTaskConfirm,handleTaskFalse } from "@/api/contentCoupletPerception/alert";
import Editor from '@/components/Editor';
//import {getMap} from "@/api/system/dept";
//import ProcessSelectUser from "@/views/system/user/processSelectUser";
import AlertTaskProcess from "@/views/project/contentCoupletPerception/alertTaskProcess";
export default {
  name: "Alert",
  components: {
    AlertTaskProcess,
    Editor,
    //ProcessSelectUser,
  },
  data () {
    return {
      levelOptions: [],
      // 遮罩层
      loading: true,
      loadingDig: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 日期范围
      dateRange: [],
      // 总条数
      total: 0,
      // 告警表格数据
      alertList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        devType: null,
        ruleName: null,
        ruleDesc: null,
        level: null,
        processTime: null,
        status: null,
        content: null,
        devicId: null,
        tenantId: null,
        ancestors: null,
        alarmIndex:null,
        createTime: undefined,
        createTimeRange: undefined,
        deptName:null,
      },
      // 表单参数
      form: {
        isIssue: "0",
        isUpgrade: "0",
      },
      // 表单校验
      rules: {
        devicId: [
          { required: true, message: "设备id不能为空", trigger: "blur" }
        ],
        tenantId: [
          { required: true, message: "租户ID不能为空", trigger: "blur" }
        ],
      },
      tableHeight: 400,
      tableOffset: 138,
      acodeMap: undefined,
      // 误报 确认
      openStatusDialog: false,
      statusDialogTitle: "",
      tenantId: '',
      // 选择分派人
      selectProcessUser: {},
      openSelectUser: false,
      queryPerms: '',
    };
  },
  created () {
    this.getDicts('content_dev_level').then(response => {
      this.levelOptions = response.data
    });
    //this.getMap()
    this.getList();
  },
  methods: {
    devTypeFormatter (row) {
      if (row.devType == "1") {
        return "噪声监测";
      }else if(row.devType == "2"){
        return "粉尘监测";
      }
    },
    /*getMap () {
      getMap().then(response => {
        this.acodeMap = response.data
      })
    },*/
    //条件查询
    conditionToggle () {
      if (this.$refs['toggle-container'].style.display === 'none') {
        this.$refs['toggle-container'].style.display = 'inline-block';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        this.$refs['toggle-container'].style.display = 'none';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      }
    },
    /** 查询告警列表 */
    getList () {
      this.loading = true;
      if (this.$route.path.indexOf("airAlert")>-1) {//噪声
        this.queryParams.devType = 1;
      }else if (this.$route.path.indexOf("soilAlert")>-1) {//粉尘
        this.queryParams.devType = 2;
      }
      listAlert(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.alertList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.openStatusDialog = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: null,
        ruleName: null,
        ruleDesc: null,
        level: null,
        processTime: null,
        status: "0",
        content: null,
        devicId: null,
        tenantId: null,
        createTime: null,
        createTimeRange: undefined,
        updateTime: null,
        ancestors: null,
        isIssue: "0",
        isUpgrade: "0",
        devName:null,
        monitor:null,
        threshold:null,
        deptName:null,
      };
      this.selectProcessUser = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.queryParams.createTimeRange = []
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 误报
    handleFalse (row) {
      this.$confirm('是否确认当前告警为误报？', "告警误报", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        let queryData = {
          id: row.id,
        };
        return handleTaskFalse(queryData);
      }).then(() => {
        this.getList();
        this.msgSuccess("误报提交成功");
      });
    },
    // 处理
    handleConfirm (row) {
      let that = this;
      that.openStatusDialog = true;
      that.statusDialogTitle = "告警处理-确认";
      that.loadingDig = true;
      const id = row.id || this.ids
      getAlert(id).then(response => {
        that.form = response.data;
        that.tenantId = that.form.tenantId + "";
        that.form.isIssue = '0';
        that.form.isUpgrade = '0';
        that.loadingDig = false;
      });
    },
    //提交审核
    submitConfirm () {
      /*if (!this.selectProcessUser.userId) {
        this.msgError("请选择处理人");
        return false;
      }*/
      this.loadingDig = true;
      //this.form.handleUserId = this.selectProcessUser.userId;
      handleTaskConfirm(this.form).then(response => {
        this.msgSuccess("确认成功");
        this.loadingDig = false;
        this.openStatusDialog = false;
        this.getList();
      });
    },

    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加告警";
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      /*this.reset();
      const id = row.id || this.ids*/
      row.taskDefKey = '';
      this.$refs.alertTaskProcessDialog.init(row);
      /*getAlert(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改告警";
      });*/
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAlert(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAlert(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除告警编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAlert(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有告警数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportAlert(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    //选择审核人
    selectUser (perms) {
      this.openSelectUser = true;
      this.queryPerms = perms;
      this.$refs.selectProcessUserDialog.init(this.queryPerms);
    },
    //是否下发
    isIssueChange (row) {
      this.$forceUpdate();
    },
    isUpgradeChange (row) {
      this.$forceUpdate();
    },
    //表格排序
    changeTableSort (column) {
      let order = '';
      if (column.order === 'ascending') {
        order = 'asc';
      } else if (column.order === 'descending') {
        order = 'desc';
      }
      if (order !== '') {
        this.queryParams.sort = column.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
        this.queryParams.order = order;
        this.queryParams.pageNum = 1;
        this.columnLabel = column.column.label;
      } else {
        this.queryParams.sort = '';
        this.queryParams.order = '';
        this.queryParams.pageNum = 1;
        this.columnLabel = '';
      }
      this.getList();
    },
    renderHeader (h, { column, $index }, width) {
      let color = '#515a6e';
      let that = this;
      if (that.columnLabel != '' && that.columnLabel == column.label) {
        color = "#ff6600";
      }
      let style = {};
      if (width) {
        // width: 'calc(' + width + '% - 48px)'
        style = {
          textAlign: 'center',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color,
          width: width + "%"
        }
      } else {
        style = {
          textAlign: 'left',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color
        }
      }
      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
  },
  watch: {
    showSearch (val) {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      });
    },
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
    });
  }
};
</script>
