<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--辖区数据-->
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入辖区名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 5px"
          />
        </div>
        <div class="head-container treeShow" :style="{'height':treeHeight+'px', 'overflow': 'auto'}">
          <el-tree
            :style="treeStyle"
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree"
            :default-expanded-keys="expandArr"
            @node-click="handleNodeClick"
          />
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
            <!--<el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:details:edit']">修改</el-button>-->
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:details:remove']">删除</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:details:export']">导出</el-button>
          </el-form-item>
          <div class="toggle-container" ref="toggle-container" style="display: none; border-left: none">
            <el-form-item label="所属产品" prop="prodectId">
              <el-select v-model="queryParams.prodectId" placeholder="请选择设备归属产品" clearable size="small">
                <el-option v-for="dict in productOptions" :key="dict.productId" :label="dict.name" :value="dict.productId" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备描述" prop="devDesc">
              <el-input
                v-model="queryParams.devDesc"
                placeholder="请输入设备描述"
                clearable
                size="small"
                class="query-param"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>

        <!--<el-row :gutter="10" class="table-button-container">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>-->

        <el-table ref="table" :height="tableHeight" v-loading="loading" :data="detailsList" @sort-change="changeTableSort" stripe
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <!--<el-table-column label="设备名称" align="center" prop="id" />-->
          <el-table-column label="设备名称" prop="devName" sortable :render-header="renderHeader"/>
          <el-table-column label="所属产品" prop="prodectName" :render-header="renderHeader"/>
          <el-table-column label="所在辖区" align="center" prop="deptId" width="200" :show-overflow-tooltip="true" sortable :render-header="renderHeader">
            <template slot-scope="scope">
              {{acodeMap[scope.row.deptId]}}
            </template>
          </el-table-column>
          <el-table-column label="经度" prop="lat" :render-header="renderHeader"/>
          <el-table-column label="纬度" prop="lon" :render-header="renderHeader"/>
          <el-table-column label="设备描述" prop="devDesc" :render-header="renderHeader"/>
          <el-table-column label="操作" width="300" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleThreshold(scope.row)">阈值设置</el-button>
              <el-button size="mini" type="text" icon="el-icon-view" @click="handleDeviceProperty(scope.row)">监测数据</el-button>
              <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['system:details:edit']">详情</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:details:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:details:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>
    <!-- 添加或修改物联感知设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" class="_baseForm_big" append-to-body>
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="sub-project">
        <div class="sub-title">
          <div class="sub-title-name">基本信息</div>
        </div>
        <div class="sub-body">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="设备名称" prop="devName" v-if="operationType==1">
                  <el-input v-model="form.devName" placeholder="请输入设备名称" />
                </el-form-item>
                <el-form-item label="设备名称" prop="devName" v-if="operationType==2">
                  <el-input v-model="form.devName" placeholder="请输入设备名称"  disabled/>
                </el-form-item>
                <el-form-item label="设备名称：" prop="devName" v-if="operationType==3">
                  <span>{{ form.devName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属产品" prop="prodectId" v-if="operationType==1">
                  <el-select v-model="form.prodectId" ref="selectCh"  placeholder="请选择设备所属产品" clearable style="width: 100%" >
                    <el-option
                      v-for="dict in productOptions"
                      :key="dict.productId"
                      :label="dict.name"
                      :value="dict.productId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="所属产品" prop="prodectName" v-if="operationType==2">
                  <el-input v-model="form.prodectName" placeholder="请输入设备名称" disabled/>
                </el-form-item>
                <el-form-item label="所属产品：" prop="prodectName" v-if="operationType == 3">
                  <span>{{ form.prodectName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所在辖区" prop="deptId" v-if="operationType != 3">
                  <treeselect v-model="form.deptId" :options="deptOptionsSelect"
                              :normalizer="normalizer" placeholder="选择上级辖区"/>
                </el-form-item>
                <el-form-item label="所在辖区：" prop="deptId" v-if="operationType == 3">
                  <span>{{ acodeMap[form.deptId] }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="经度" prop="lat" v-if="operationType != 3">
                  <el-input v-model="form.lat" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="经度：" prop="lat" v-if="operationType == 3">
                  <span>{{form.lat}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纬度" prop="lon" v-if="operationType != 3">
                  <el-input v-model="form.lon" placeholder="请输入纬度" />
                </el-form-item>
                <el-form-item label="纬度：" prop="lon" v-if="operationType == 3">
                  <span>{{form.lon}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="设备描述" prop="devDesc" v-if="operationType != 3">
                  <el-input type="textarea" v-model="form.devDesc" :rows="3" placeholder="请输入设备描述" />
                </el-form-item>
                <el-form-item label="设备描述：" prop="devDesc" v-if="operationType == 3">
                  <span>{{form.devDesc}}</span>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="operationType != 3" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--监测数据-->
    <el-dialog :title="title" :visible.sync="openProperty" class="_baseForm_big" append-to-body>
      <el-row :gutter="20">
        <!--左侧-->
        <el-col :span="5" :xs="24">
          <div class="head-container treeShow" style="margin-top: 15px;" :style="{'height':430+'px', 'overflow': 'auto'}">
              <span class="custom-tree-node" v-for="(item,idx) in devicePropertyList">
                  <div @click="treeClick(item)" :class="[item.isActivity==='1'?'isActivity':'']" style="margin-top: 10px;cursor: pointer">
                    <span>{{ item.name }}</span>
                  </div>
              </span>
          </div>
        </el-col>
        <el-col :span="19" :xs="24" style="border-left: 1px solid #e2e2e2">
          <el-table ref="table" :height="430" v-loading="loadingProperty" :data="recordList" stripe>
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="上报值" prop="value" align="center" sortable :render-header="renderHeader"/>
            <el-table-column label="上报时间" prop="time" align="center" sortable :render-header="renderHeader"/>
          </el-table>
          <pagination
              :total="propertyTotal"
              :page.sync="queryParm.pageNum"
              :limit.sync="queryParm.pageSize"
              @pagination="getListHistory" />
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
                    <el-select v-model="formThreshold.alarmLevel" v-if="levelType==1" disabled placeholder="请选择告警级别" clearable >
                      <el-option
                        v-for="dict in contentDevLevelOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                    <el-select v-model="formThreshold.alarmLevel" v-else placeholder="请选择告警级别" clearable >
                      <el-option
                        v-for="dict in contentDevLevelOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
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
                <el-form-item label="电池电量" prop="batteryPercentage">
                  <el-input-number v-model="formThreshold.batteryPercentage" :min="0" placeholder="请输入电池电量" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="二氧化碳浓度" prop="co2">
                  <el-input-number v-model="formThreshold.co2" :min="0" placeholder="请输入二氧化碳浓度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="当前湿度" prop="currentHumidity">
                  <el-input-number v-model="formThreshold.currentHumidity" :min="0" placeholder="请输入当前湿度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="当前温度" prop="currentTemperature">
                  <el-input-number v-model="formThreshold.currentTemperature" :min="0" placeholder="请输入当前温度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="PM25指数" prop="pm25">
                  <el-input-number v-model="formThreshold.pm25" :min="0" placeholder="请输入PM25指数" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="甲醛浓度" prop="hcho">
                  <el-input-number v-model="formThreshold.hcho" :min="0" placeholder="请输入甲醛浓度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="TVOC_VOC浓度" prop="tvoc">
                  <el-input-number v-model="formThreshold.tvoc" :min="0" placeholder="请输入TVOC_VOC浓度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="接收信号强度" prop="rssi">
                  <el-input-number v-model="formThreshold.rssi" :min="0" placeholder="请输入接收信号强度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="电源开关" prop="powerSwitch">
                  <el-select v-model="formThreshold.powerSwitch" placeholder="请选择设备所属产品" clearable >
                    <el-option
                      v-for="dict in powerSwitchOptions"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
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

  </div>
</template>

<script>
import { listDetails, getDetails, checkConfigure, delDetails, addDetails, updateDetails, exportDetails,listDeviceProperty,listHistory } from "@/api/contentCoupletPerception/air";
import {getProductList} from "@/api/contentCoupletPerception/soil";
import {getThreshold,updateThreshold,addThreshold} from "@/api/contentCoupletPerception/threshold";
import {getDeptListByUser, getMap, listByTenant} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import {listEnvRecord} from "@/api/project/envDev/envdev";

const checkDevicName = (rule, value, callback) => {
  let name = /^[a-zA-Z0-9_-]{1,32}$/
  if (!name.test(value)) {
    callback(new Error('请输入1-32位，英文、数字以及特殊字符_-'))
  } else {
    callback()
  }
}

export default {
  name: "Ari",
  components: {
    Treeselect
  },
  data () {
    return {
      // 遮罩层
      loading: true,
      loadingProperty:false,
      // 辖区树选项
      deptOptions: [],
      deptOptionsSelect:[],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      propertyTotal:0,
      // 物联感知设备表格数据
      detailsList: [],
      devicePropertyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openThreshold: false,
      openProperty:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        devName: null,
        devType:2,
      },
      treeStyle: {
        height: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      expandArr:[],
      // 表单参数
      form: {},
      formThreshold: {
        alarmRuleName:null,
        alarmLevel:null,
        batteryPercentage:null,
        co2:null,
        currentHumidity:null,
        currentTemperature:null,
        pm25:null,
        hcho:null,
        tvoc:null,
        rssi:null,
        powerSwitch:null,
      },
      // 表单校验
      rules: {
        devName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
          { required: true, validator: checkDevicName, trigger: 'blur' }
        ],
        prodectId: [
          { required: true, message: "所属产品不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所在辖区不能为空", trigger: "blur" }
        ],
        devType: [
          { required: true, message: "设备类型，1-土壤，2-空气，3-防火，4-水质不能为空", trigger: "change" }
        ],
      },
      rulesThreshold:{
        alarmRuleName: [
          { required: true, message: "告警规则名称不能为空", trigger: "blur" }
        ],
        alarmLevel: [
          { required: true, message: "告警级别不能为空", trigger: "blur" }
        ],
        batteryPercentage: [
          { required: true, message: "电池电量不能为空", trigger: "blur" }
        ],
        co2: [
          { required: true, message: "二氧化碳浓度不能为空", trigger: "blur" }
        ],
        currentHumidity: [
          { required: true, message: "当前湿度不能为空", trigger: "blur" }
        ],
        currentTemperature: [
          { required: true, message: "当前温度不能为空", trigger: "blur" }
        ],
        pm25: [
          { required: true, message: "PM25指数不能为空", trigger: "blur" }
        ],
        powerSwitch: [
          { required: true, message: "电源开关不能为空", trigger: "blur" }
        ],
        tvoc: [
          { required: true, message: "TVOC_VOC浓度不能为空", trigger: "blur" }
        ],
        rssi: [
          { required: true, message: "接收信号强度不能为空", trigger: "blur" }
        ],
        hcho: [
          { required: true, message: "甲醛浓度不能为空", trigger: "blur" }
        ],
      },
      tableHeight: 400,
      tableOffset: 145,
      productOptions: [],
      powerSwitchOptions: [
        {
          value:"true",
          label:"打开",
        },
        {
          value:"false",
          label:"关闭",
        }
      ],
      operationType:null,
      levelType:null,
      treeHeight: 450,
      selectRow:[],
      recordList:[],
      queryParm:{
        pageNum: 1,
        pageSize: 10,
      },
      acodeMap: undefined,
      contentDevLevelOptions:[],
    };
  },
  created () {
    //所属产品
    getProductList().then(response =>{
      this.productOptions = response.data;
    })
    listByTenant().then(response => {
      this.deptOptionsSelect = this.handleTree(response.data, "deptId");
    });
    this.getDicts('content_dev_level').then(response => {
      this.contentDevLevelOptions = response.data
    });
    this.getDeptListByUser()
    this.getList();
    this.getMap();
    this.checkConfigure();
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
    /** 查询辖区下拉树结构 */
    getDeptListByUser() {
      getDeptListByUser().then(response => {
        this.deptOptions = response.data;
        if(this.deptOptions!==undefined){
          console.log(this.deptOptions);
          this.deptOptions.forEach(item=>{
            this.expandArr.push(item.id);
          })
        }
        if(this.isFirstEnter){
          let params = {id: this.deptOptions[0].id};
          this.handleNodeClick(params);
          this.isFirstEnter = false;
        }
      })
    },
    setTreeHeight() {
      this.treeHeight = window.innerHeight - 138;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    /** 状态字典翻译 **/
    termTypeFormat(row) {
      return this.selectDictLabel(this.productOptions, row.prodectId);
    },
    getMap () {
      getMap().then(response => {
        this.acodeMap = response.data
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
        id: null,
        devName: null,
        devType: null,
        devDesc: null,
        prodectName: null,
        prodectId: null,
        ip: null,
        imei: null,
        imsi: null,
        lat: null,
        lon: null,
        address: null,
        tenantId: null,
        createTime: null,
        createId: null,
        updateTime: null,
        updateId: null,
        ancestors: null,
        nodeType: null,
        protocol: null,
        authCode: null,
        activeTime: null,
        secKey: null,
        lastTime: null
      };
      this.resetForm("form");
    },
    resetThreshold () {
      this.formThreshold = {
        alarmRuleName:null,
          alarmLevel:null,
          batteryPercentage:null,
          co2:null,
          currentHumidity:null,
          currentTemperature:null,
          pm25:null,
          hcho:null,
          tvoc:null,
          rssi:null,
          powerSwitch:null,
      }
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.operationType = 1;
      this.open = true;
      this.title = "添加物联感知设备";
    },
    /**阈值设置*/
    handleThreshold(row){
      this.title = "阈值设置";
      this.openThreshold = true;
      this.resetThreshold()
      getThreshold(row.devName).then(response => {
        if(response.data){
          this.formThreshold = JSON.parse(response.data.content);
          this.formThreshold.id = response.data.id;
          this.formThreshold.alarmRuleName = response.data.alarmRuleName;
          this.formThreshold.alarmLevel = response.data.alarmLevel;
          this.levelType=1;
        }else{
          this.levelType=null;
        }
        this.formThreshold.devType = row.devType;
        this.formThreshold.devName = row.devName;
      });
    },
    //保存阈值设置
    submitThresholdForm(){
      this.$refs["formThreshold"].validate(valid => {
        if (valid) {
          this.formThreshold.devType=2
          let content = {"alarmRuleName":this.formThreshold.alarmRuleName,"alarmLevel":"","type":"DEVICEALARM",//type固定 设备报警
            "batteryPercentage":this.formThreshold.batteryPercentage,
            "co2":this.formThreshold.co2,"currentHumidity":this.formThreshold.currentHumidity,"currentTemperature":this.formThreshold.currentTemperature,
            "pm25":this.formThreshold.pm25,"hcho":this.formThreshold.hcho,"tvoc":this.formThreshold.tvoc,"rssi":this.formThreshold.rssi,
            "powerSwitch":this.formThreshold.powerSwitch};
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
    //查询监测数据
    handleDeviceProperty(row){
      this.title = "监测数据";
      this.openProperty=true;
      listDeviceProperty(row).then(response => {
        console.log(response)
        this.selectRow = row;
        this.devicePropertyList = response.data;
        this.loading = false;
      });
    },
    //点击查询具体监测数据
    treeClick(data) {
      let that = this
      data.isActivity = '1';
      for(let i=0;i<this.devicePropertyList.length;i++){
        if(this.devicePropertyList[i].identifier!=data.identifier){
          this.devicePropertyList[i].isActivity='';
        }
      }
      this.$forceUpdate();
      console.log(this.selectRow);
      this.loadingProperty = true;
      this.queryParm = {
        devName:this.selectRow.devName,
        prodectId:this.selectRow.prodectId,
        identifier:data.identifier,
        startTime:this.selectRow.createTime,
        devType:2
      }
      this.getListHistory();
    },
    getListHistory(){
      listHistory(this.queryParm).then(response => {
        this.recordList = response.rows;
        this.propertyTotal = response.total;
        this.loadingProperty = false;
      });
    },
    /** 按钮操作 */
    handleView (row) {
      this.reset()
      this.open = true
      this.title = '查看监测设备详情'
      this.dialogIcon = 'el-icon-view';
      this.operationType = 3;
      const id = row.id
      getDetails(id).then(response => {
        this.form = response.data
      })
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      this.open = true;
      this.title = "修改物联感知设备";
      this.operationType = 2;
      const id = row.id || this.ids
      getDetails(id).then(response => {
        this.form = response.data;
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDetails(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.prodectName = this.$refs.selectCh.selected.label;
            addDetails(this.form).then(response => {
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
    /** 转换辖区数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      try{
        return data.label.indexOf(value) !== -1
      }catch (e){
      }
    },
    renderHeader(h, {column, $index}, width) {
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
    //表格排序
    changeTableSort(column) {
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
      this.setTreeHeight()
    });
  }
};
</script>

<style lang="scss" scoped>
.isActivity{
  color: #25b104;
}
</style>
