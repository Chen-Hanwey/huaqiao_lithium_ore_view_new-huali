<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">设备名称</label>
          <el-form-item label="" prop="devName" class="custom-el-form-item">
            <el-input v-model="queryParams.devName" class="query-param" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:details:add']">新增</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:details:export']">导出</el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:details:remove']">删除</el-button>
          </el-form-item>
        </div>
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
      <!--<el-table-column label="所属产品" prop="productName" align="center" :render-header="renderHeader" />-->
      <el-table-column label="描述" prop="devDesc" align="center" :render-header="renderHeader" />
      <el-table-column label="经度" prop="lat" align="center" :render-header="renderHeader" />
      <el-table-column label="纬度" prop="lon" align="center" :render-header="renderHeader" />
      <el-table-column label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['system:details:edit']">详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:details:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:details:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />


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
                <el-form-item label="选择设备">
                  <el-button type="primary" @click="openEquipment = true">选择设备</el-button>
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
              <el-col :span="12">
                <el-form-item label="上报间隔" prop="interval" v-if="operationType != 3">
                  <el-input oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="form.interval" :rows="2" placeholder="请输入上报间隔" />
                </el-form-item>
                <el-form-item label="上报间隔" prop="interval" v-if="operationType == 3">
                  <span>{{ form.interval }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <span style="line-height: 36px;margin-left: 10px;">分</span>
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

    <el-dialog :title="'选择设备'" :visible.sync="openEquipment" class="_baseForm_big" append-to-body>
      <environment-select-equipment v-if="openEquipment" :type="type" :info.sync="info"></environment-select-equipment>
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
} from "@/api/contentCoupletPerception/soil";
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
  name: "EnvironmentalMonitoringCommonEquipment",
  components: {
    environmentSelectEquipment
  },
  props: {
    type: {
      type: String,
      default: "",
    }
  },
  data () {
    return {
      environmentStatus:{
        'INACTIVE': '未激活',
        'OFFLINE': '离线',
        'ONLINE': '在线'
      },
      openEquipment: false,
      treeHeight: 480,
      recordTreeHeight: 480,
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
      info: undefined,
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
      form: {
        selectUsers: []
      },
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
          // { required: true, validator: checkDevicName, trigger: 'blur' }
        ],
        productId: [
          { required: true, message: "归属产品不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: '归属辖区不能为空', trigger: ['blur', 'change'] }
        ],
        interval: [
          { required: true, message: '上报间隔不能为空', trigger: "blur" }
        ],
        lat: [
          { required: true, message: '经度不能为空', trigger: "blur" }
        ],
        lon: [
          { required: true, message: '纬度不能为空', trigger: "blur" }
        ],
        selectUsers:[
          {type: 'array',required: true, message: '短信接收员不能为空', trigger: 'change'}
        ]
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
      tableOffset: 170,
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
      loadingProperty: false,
      devicePropertyList: [],
      recordList: [],
      queryDevName: '',
      queryProductId: '',
      contentDevLevelOptions: [],
      levelType: null,
      users: undefined,
    };
  },
  created () {
      this.isFirstEnter = true,
      this.getList();
      this.getDicts('content_dev_level').then(response => {
        this.contentDevLevelOptions = response.data
      });
  },
  methods: {
    /** 按钮操作 */
    handleView (row) {
      this.reset()
      const id = row.id
      getDetails(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '设备详情'
        this.dialogIcon = 'el-icon-view';
        this.operationType = 3;
      })
    },
    closedDialog () {
      this.reset();
    },
    /*getProductList () {
      getProductList().then(response => {
        this.productOptions = response.data;
      })
    },*/
    /** 查询物联感知设备列表 */
    getList () {
      this.loading = true;
      this.queryParams.devType = this.type
      listDetails(this.queryParams).then(response => {
        console.log(response)
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
        deptId: null,
        selectUsers: undefined
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
      if(this.type==1){
        this.title = "添加噪声监测设备";
      }else if(this.type==2){
        this.title = "添加粉尘监测设备";
      }
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
        if(this.type==1){
          this.title = "修改噪声监测设备";
        }else if(this.type==2){
          this.title = "修改粉尘监测设备";
        }
        this.dialogIcon = 'el-icon-edit';
        this.operationType = 2;
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.devType = this.type
          if (this.form.productId) {
            this.productOptions.forEach(item => {
              if (this.form.productId == item.productId) {
                this.form.productName = item.name
              }
            })
          }
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
    info(val) {
      this.form.devName = val.deviceName
      this.form.productId = val.productId
      this.form.status = val.status
    },
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
      this.tableHeight = window.innerHeight - 98 - this.tableOffset;
    });
  }
};
</script>
