<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--辖区数据-->
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入辖区名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 5px" />
        </div>
        <div class="head-container treeShow" :style="{'height':treeHeight +'px', 'overflow': 'auto'}">
          <el-tree :style="treeStyle" :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" node-key="id" ref="tree" :default-expanded-keys="expandArr" @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="19" :xs="24" style="border-left: 1px solid rgb(226, 226, 226);">
        <el-form class="search-form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="设备名称" prop="devName">
            <el-input v-model="queryParams.devName" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:details:add']">新增</el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:details:remove']">删除</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:details:export']">导出</el-button>
          </el-form-item>
          <div class="toggle-container" ref="toggle-container" style="display: none; border-left: none">
            <el-form-item label="所属产品" prop="productId">
              <el-select v-model="queryParams.productId" placeholder="请选择设备归属产品" clearable size="small">
                <el-option v-for="dict in productOptions" :key="dict.productId" :label="dict.name" :value="dict.productId" />
              </el-select>
            </el-form-item>
          </div>
        </el-form>

        <el-table ref="table" stripe :height="tableHeight" v-loading="loading" :data="detailsList" @selection-change="handleSelectionChange" @sort-change="changeTableSort">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备名称" sortable prop="devName" align="center" :render-header="renderHeader" />
          <el-table-column label="所属产品" prop="productName" align="center" :render-header="renderHeader" />
          <el-table-column label="所属辖区" align="center" prop="deptId" width="200" :show-overflow-tooltip="true" :render-header="renderHeader">
            <template slot-scope="scope">
              {{acodeMap[scope.row.deptId]}}
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="devDesc" align="center" :render-header="renderHeader" />
          <el-table-column label="经度" prop="lat" align="center" :render-header="renderHeader" />
          <el-table-column label="纬度" prop="lon" align="center" :render-header="renderHeader" />
          <el-table-column label="操作" width="300" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleThreshold(scope.row)">阈值设置</el-button>
              <el-button size="mini" type="text" icon="el-icon-view" @click="handleMonitorData(scope.row)" v-hasPermi="['system:details:edit']">监测数据
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['system:details:edit']">详情
              </el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:details:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:details:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改物联感知设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" @closed="closedDialog" :append-to-body="true" :lock-scroll="false" class="_baseForm_big">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="sub-project">
        <div class="sub-title">
          <div class="sub-title-name">基本信息</div>
        </div>
        <div class="sub-body">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row v-if="operationType != 3">
              <el-col :span="24">
                <el-form-item label="新增设备">
                  <el-button type="primary" @click="openEquipment = true">新增设备</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="设备名称" prop="devName" v-if="operationType == 1">
                  <el-input disabled v-model="form.devName" maxlength="32" placeholder="请输入1-32位，英文、数字以及特殊字符_-" />
                </el-form-item>
                <el-form-item label="设备名称" prop="devName" v-if="operationType == 2">
                  <el-input disabled v-model="form.devName" disabled />
                </el-form-item>
                <el-form-item label="设备名称" prop="devName" v-if="operationType == 3">
                  <span>{{ form.devName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
<!--            <el-row>
              <el-col :span="24">
                <el-form-item label="归属产品" prop="productId" v-if="operationType == 1">
                  <el-select v-model="form.productId" placeholder="请选择设备归属产品" clearable size="small">
                    <el-option v-for="dict in productOptions" :key="dict.productId" :label="dict.name" :value="dict.productId" />
                  </el-select>
                </el-form-item>
                <el-form-item label="所属产品" prop="productName" v-if="operationType==2">
                  <el-input v-model="form.productName" disabled/>
                </el-form-item>
                <el-form-item label="归属产品" prop="productName" hidden>
                  <el-select v-model="form.productName" placeholder="请选择设备归属产品" clearable size="small">
                    <el-option v-for="dict in productOptions" :key="dict.productId" :label="dict.name" :value="dict.name" />
                  </el-select>
                </el-form-item>
                <el-form-item label="归属产品" prop="productName" v-if="operationType == 3">
                  <span>{{ form.productName }}</span>
                </el-form-item>
              </el-col>
            </el-row>-->
            <el-row>
              <el-col :span="24">
                <el-form-item label="归属辖区" prop="deptId" v-if="operationType != 3">
                  <treeselect v-model="form.deptId" :options="deptOptions" placeholder="请选择归属辖区" />
                </el-form-item>
                <el-form-item label="归属辖区:" prop="deptId" v-if="operationType == 3">
                  <span>{{ acodeMap[form.deptId] }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="经度" prop="lat" v-if="operationType != 3">
                  <el-input v-model="form.lat" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="经度:" prop="lat" v-if="operationType == 3">
                  <span>{{ form.lat }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纬度" prop="lon" v-if="operationType != 3">
                  <el-input v-model="form.lon" placeholder="请输入纬度" />
                </el-form-item>
                <el-form-item label="纬度:" prop="lon" v-if="operationType == 3">
                  <span>{{ form.lon }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="描述" prop="devDesc" v-if="operationType != 3">
                  <el-input v-model="form.devDesc" type="textarea" :rows="2" placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="描述" prop="devDesc" v-if="operationType == 3">
                  <span>{{ form.devDesc }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
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
    <el-dialog :title="'监测数据'" :visible.sync="monitorOpen" class="_baseForm_big">
      <el-row :gutter="20">
        <!--左侧-->
        <el-col :span="5" :xs="24">
          <div class="head-container treeShow" style="margin-top: 15px;" :style="{'height':recordTreeHeight+'px', 'overflow': 'auto'}">
            <span class="custom-tree-node" v-for="(item,idx) in devicePropertyList">
              <div @click="treeClick(item)" :class="[item.isActivity==='1'?'isActivity':'']" style="margin-top: 10px;cursor: pointer">
                <span>{{ item.name }}</span>
              </div>
            </span>
          </div>
        </el-col>
        <el-col :span="19" :xs="24" style="border-left: 1px solid #e2e2e2">
          <el-table ref="recordTable" :height="recordTableHeight" v-loading="loadingProperty" :data="recordList" stripe>
            <el-table-column label="上报值" prop="value" align="center" sortable :render-header="renderHeader" />
            <el-table-column label="上报时间" prop="time" align="center" sortable :render-header="renderHeader" />
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>

    <!--阈值设置-->
    <el-dialog :title="title" :visible.sync="openThreshold" class="_baseForm_big" append-to-body>
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="sub-project">
        <div class="sub-title">
          <div class="sub-title-name">基本信息</div>
        </div>
        <el-form ref="formThreshold" :model="formThreshold" :rules="rulesThreshold" label-width="150px">
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="告警规则名称" prop="alarmRuleName">
                  <el-input v-model="formThreshold.alarmRuleName" placeholder="请输入告警规则名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="告警级别" prop="alarmLevel">
                  <el-select v-model="formThreshold.alarmLevel" v-if="levelType==1" disabled placeholder="请选择告警级别" clearable>
                    <el-option v-for="dict in contentDevLevelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                  <el-select v-model="formThreshold.alarmLevel" v-else placeholder="请选择告警级别" clearable>
                    <el-option v-for="dict in contentDevLevelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="sub-title">
            <div class="sub-title-name">阈值</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="12">
                <el-form-item label="大棚空气湿度" prop="airHumidity">
                  <el-input-number v-model="formThreshold.airHumidity" :min="0" placeholder="请输入大棚空气湿度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="大棚空气温度" prop="airTemp">
                  <el-input-number v-model="formThreshold.airTemp" :min="0" placeholder="请输入大棚空气温度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="二氧化碳浓度" prop="co2">
                  <el-input-number v-model="formThreshold.co2" :min="0" placeholder="请输入二氧化碳浓度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="光照度" prop="lightLuxValue">
                  <el-input-number v-model="formThreshold.lightLuxValue" :min="0" placeholder="请输入光照度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="大棚土壤EC值" prop="soilEc">
                  <el-input-number v-model="formThreshold.soilEc" :min="0" placeholder="请输入大棚土壤EC值" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="土壤湿度" prop="soilHumidity">
                  <el-input-number v-model="formThreshold.soilHumidity" :min="0" placeholder="请输入土壤湿度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="土壤PH值" prop="soilPh">
                  <el-input-number v-model="formThreshold.soilPh" :min="0" placeholder="请输入土壤PH值" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="土壤温度" prop="soilTemperature">
                  <el-input-number v-model="formThreshold.soilTemperature" :min="0" placeholder="请输入土壤温度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="电源电压" prop="voltage">
                  <el-input-number v-model="formThreshold.voltage" :min="0" placeholder="请输入电源电压" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitThresholdForm">确 定</el-button>
        <el-button @click="openThreshold=false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="'选择设备'" :visible.sync="openEquipment" class="_baseForm_big" append-to-body>
      <environment-select-equipment v-if="openEquipment" :type="1" :info.sync="info"></environment-select-equipment>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="openEquipment=false">确 定</el-button>
        <el-button @click="openEquipment=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDetails,
  getDetails,
  delDetails,
  addDetails,
  updateDetails,
  exportDetails,
  getProductList,
  listDeviceProperty,
  devicePropertyHistory
} from "@/api/contentCoupletPerception/soil";
import { checkConfigure } from "@/api/contentCoupletPerception/air";
import { getDeptListByUser, getMap } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { addThreshold, getThreshold, updateThreshold } from "@/api/contentCoupletPerception/threshold";

import environmentSelectEquipment from './selectEquipment'

const checkDevicName = (rule, value, callback) => {
  let name = /^[a-zA-Z0-9_-]{1,32}$/
  if (!name.test(value)) {
    callback(new Error('请输入1-32位，英文、数字以及特殊字符_-'))
  } else {
    callback()
  }
}

export default {
  name: "Details",
  components: {
    Treeselect,
    environmentSelectEquipment
  },
  data () {
    return {
      info: undefined,
      openEquipment: false,
      treeHeight: 450,
      recordTreeHeight: 450,
      dialogIcon: undefined,
      productOptions: [],
      operationType: undefined,
      loading: true,
      // 选中数组
      ids: [],
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 物联感知设备表格数据
      detailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        devName: null,
        productId: null,
        deptId: null,
        identifier: null
      },
      // 表单参数
      form: {},
      formThreshold: {
        alarmRuleName: null,
        alarmLevel: null,
        airHumidity: null,
        airTemp: null,
        co2: null,
        lightLuxValue: null,
        soilEc: null,
        soilHumidity: null,
        soilPh: null,
        soilTemperature: null,
        voltage: null,
      },
      // 表单校验
      rules: {
        devName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
          { required: true, validator: checkDevicName, trigger: 'blur' }
        ],
        productId: [
          { required: true, message: "归属产品不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: '归属辖区不能为空', trigger: ['blur', 'change'] }
        ],
      },
      rulesThreshold: {
        alarmRuleName: [
          { required: true, message: "告警规则名称不能为空", trigger: "blur" }
        ],
        alarmLevel: [
          { required: true, message: "告警级别不能为空", trigger: "blur" }
        ],
        airHumidity: [
          { required: true, message: "大棚空气湿度不能为空", trigger: "blur" }
        ],
        airTemp: [
          { required: true, message: "大棚空气温度不能为空", trigger: "blur" }
        ],
        co2: [
          { required: true, message: "二氧化碳浓度不能为空", trigger: "blur" }
        ],
        lightLuxValue: [
          { required: true, message: "光照度不能为空", trigger: "blur" }
        ],
        soilEc: [
          { required: true, message: "大棚土壤EC值不能为空", trigger: "blur" }
        ],
        soilHumidity: [
          { required: true, message: "土壤湿度不能为空", trigger: "blur" }
        ],
        soilPh: [
          { required: true, message: "土壤PH值不能为空", trigger: "blur" }
        ],
        soilTemperature: [
          { required: true, message: "土壤温度不能为空", trigger: "blur" }
        ],
        voltage: [
          { required: true, message: "电源电压不能为空", trigger: "blur" }
        ],
      },
      tableHeight: 400,
      recordTableHeight: 450,
      tableOffset: 145,
      isFirstEnter: false,
      acodeMap: undefined,
      deptName: undefined,
      treeStyle: {
        height: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 辖区树选项
      deptOptions: undefined,
      expandArr: [],
      monitorOpen: false,
      loadingProperty: false,
      devicePropertyList: [],
      recordList: [],
      queryDevName: '',
      queryProductId: '',
      openThreshold: false,
      contentDevLevelOptions: [],
      levelType: null,
    };
  },
  created () {
    this.isFirstEnter = true,
      // this.getList();
      this.getMap()
    this.getDeptListByUser()
    this.getProductList();
    this.checkConfigure();
    this.getDicts('content_dev_level').then(response => {
      this.contentDevLevelOptions = response.data
    });
  },
  methods: {
    checkConfigure() {
      checkConfigure().then(response => {

      }).catch(error => {
        this.$confirm(error.message + '，请在系统管理 -- 基础配置 -- 对接配置中配置对应信息', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {

        })
      })
    },
    //点击查询具体监测数据
    treeClick (data) {
      let that = this
      data.isActivity = '1';
      for (let i = 0; i < this.devicePropertyList.length; i++) {
        if (this.devicePropertyList[i].identifier != data.identifier) {
          this.devicePropertyList[i].isActivity = '';
        }
      }
      this.$forceUpdate();
      this.loadingProperty = true;
      that.queryParams.devName = this.queryDevName
      that.queryParams.productId = this.queryProductId
      that.queryParams.identifier = data.identifier
      devicePropertyHistory(that.queryParams).then(response => {
        that.queryParams.devName = "";
        this.recordList = response.data;
        this.loadingProperty = false;
      });
    },
    handleMonitorData (row) {
      this.monitorOpen = true;
      listDeviceProperty(row).then(response => {
        this.queryProductId = row.productId;
        this.queryDevName = row.devName;
        this.devicePropertyList = response.data;
        console.log(this.devicePropertyList)
      });
    },
    openDialog () {
      $('.popLostIndividual-body').parent().css('height', $(window).innerHeight() - 105).css('top', 0).css('overflow-y', 'auto');
    },
    /** 按钮操作 */
    handleView (row) {
      this.reset()
      const id = row.id
      getDetails(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '查看土壤监测设备'
        this.dialogIcon = 'el-icon-view';
        this.operationType = 3;
      })
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
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      try {
        return data.label.indexOf(value) !== -1
      } catch (e) {
      }
    },
    // 节点单击事件
    handleNodeClick (data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    getMap () {
      getMap().then(response => {
        this.acodeMap = response.data
      })
    },
    /** 查询辖区下拉树结构 */
    getDeptListByUser () {
      getDeptListByUser().then(response => {
        this.deptOptions = response.data;
        if (this.deptOptions !== undefined) {
          console.log(this.deptOptions);
          this.deptOptions.forEach(item => {
            this.expandArr.push(item.id);
          })
        }
        if (this.isFirstEnter) {
          let params = { id: this.deptOptions[0].id };
          this.handleNodeClick(params);
          this.isFirstEnter = false;
        }
      })
    },
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
    setTreeHeight () {
      this.treeHeight = window.innerHeight - 138;
    },
    closedDialog () {
      this.reset();
    },
    getProductList () {
      getProductList().then(response => {
        this.productOptions = response.data;
      })

    },
    /** 查询物联感知设备列表 */
    getList () {
      this.loading = true;
      listDetails(this.queryParams).then(response => {
        this.detailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        devName: null,
        devDesc: null,
        productId: null,
        lat: null,
        lon: null,
        productName: null,
        deptId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.ids = selection.map(item => item.id)
      this.names = selection.map(item => item.devName)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = "添加土壤监测设备";
      this.dialogIcon = 'el-icon-plus';
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      const id = row.id || this.ids
      getDetails(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改土壤监测设备";
        this.dialogIcon = 'el-icon-edit';
        this.operationType = 2;
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.productId) {
            this.productOptions.forEach(item => {
              if (this.form.productId == item.productId) {
                this.form.productName = item.name
              }
            })
          }
          this.productOptions
          if (this.form.id != null) {
            updateDetails(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDetails(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(err => {

            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      const names = row.devName || this.names
      this.$confirm('是否确认删除设备名称为"' + names + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delDetails(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有物联感知设备数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportDetails(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    resetThreshold () {
      this.formThreshold = {
        alarmRuleName: null,
        alarmLevel: null,
        airHumidity: null,
        airTemp: null,
        co2: null,
        lightLuxValue: null,
        soilEc: null,
        soilHumidity: null,
        soilPh: null,
        soilTemperature: null,
        voltage: null,
      }
    },
    /**阈值设置*/
    handleThreshold (row) {
      this.title = "阈值设置";
      this.openThreshold = true;
      this.resetThreshold()
      console.log(row)
      getThreshold(row.devName).then(response => {
        console.log(response)
        if (response.data) {
          this.formThreshold = JSON.parse(response.data.content);
          this.formThreshold.id = response.data.id;
          this.formThreshold.alarmRuleName = response.data.alarmRuleName;
          this.formThreshold.alarmLevel = response.data.alarmLevel;
          this.levelType = 1;
        } else {
          this.levelType = null;
        }
        this.formThreshold.devType = row.devType;
        this.formThreshold.devName = row.devName;
        //this.$forceUpdate();
      });
    },
    //保存阈值设置
    submitThresholdForm () {
      this.$refs["formThreshold"].validate(valid => {
        if (valid) {
          this.formThreshold.devType = 1
          let content = {
            "alarmRuleName": this.formThreshold.alarmRuleName, "alarmLevel": "", "type": "DEVICEALARM",//type固定 设备报警
            "airHumidity": this.formThreshold.airHumidity, "airTemp": this.formThreshold.airTemp,
            "co2": this.formThreshold.co2, "lightLuxValue": this.formThreshold.lightLuxValue, "soilEc": this.formThreshold.soilEc,
            "soilHumidity": this.formThreshold.soilHumidity, "soilPh": this.formThreshold.soilPh, "soilTemperature": this.formThreshold.soilTemperature,
            "voltage": this.formThreshold.voltage
          };
          this.formThreshold.content = JSON.stringify(content);
          if (this.formThreshold.id != null) {
            updateThreshold(this.formThreshold).then(response => {
              this.msgSuccess("编辑成功");
              this.openThreshold = false;
            });
          } else {
            addThreshold(this.formThreshold).then(response => {
              this.msgSuccess("编辑成功");
              this.openThreshold = false;
            });
          }
        }
      });
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
  },
  watch: {
    info(val) {
      this.form.devName = val.deviceName
      this.form.productId = val.productId
    },
    // 根据名称筛选辖区树
    deptName (val) {
      this.$refs.tree.filter(val)
    },
    'form.productId': function (val) {
      if (val) {
        this.$refs['form'].clearValidate('productId');
      }
    },
    showSearch (val) {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      });
    },
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      this.setTreeHeight();
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      this.setTreeHeight();
    });
  }
};
</script>

<style lang="scss" scoped>
.isActivity {
  font-weight: 600;
  color: #25b104;
}
</style>
