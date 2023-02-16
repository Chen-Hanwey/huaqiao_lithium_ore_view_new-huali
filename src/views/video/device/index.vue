<template>
  <div class="app-container">
    <el-form class="search-form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件
        </el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="warning" plain icon="el-icon-refresh" size="mini" @click="handleSync" v-hasPermi="['dev:device:sync']">同步
        </el-button>
      </el-form-item>
      <div class="toggle-container" ref="toggle-container" style="display: none; border-left: none">
        <!--<el-form-item label="组织ID" prop="branchId">
          <el-input
            v-model="queryParams.branchId"
            placeholder="请输入组织ID"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>-->
        <el-form-item label="设备MAC" prop="macId">
          <el-input v-model="queryParams.macId" placeholder="请输入设备mac" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="组织名称" prop="branchName">
          <el-input v-model="queryParams.branchName" placeholder="请输入组织名称" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="所属辖区" prop="deptName">
          <el-input v-model="queryParams.deptName" class="query-param" placeholder="请输入设备所属辖区" clearable size="small" />
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择设备状态" clearable size="small">
            <el-option label="离线" value="0" />
            <el-option label="在线" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备地址" prop="location">
          <el-input v-model="queryParams.location" placeholder="请输入设备地址" clearable size="small" @keyup.enter.native="handleQuery" />
        </el-form-item>
      </div>

    </el-form>

    <!-- <el-table ref="table" :height="tableHeight" v-loading="loading" :data="deviceList" @sort-change="changeTableSort" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="设备MAC" prop="macId" sortable width="220" :render-header="renderHeader" />
      <el-table-column label="设备名称" align="center" prop="deviceName" width="220" sortable :render-header="renderHeader" />
      <el-table-column label="组织名称" align="center" prop="branchName" width="220" sortable :render-header="renderHeader" />
      <el-table-column label="所属辖区" align="center" prop="deptId" width="150" :show-overflow-tooltip="true" :render-header="renderHeader">
        <template slot-scope="scope">
          {{acodeMap[scope.row.deptId]}}
        </template>
      </el-table-column>
      <el-table-column label="经度" align="center" prop="longitude" width="150" sortable :render-header="renderHeader" />
      <el-table-column label="纬度" align="center" prop="latitude" width="150" sortable :render-header="renderHeader" />
      <el-table-column label="设备状态" align="center" prop="status" width="100" :formatter="statusFormat" sortable />
      <el-table-column label="设备地址" prop="location" width="300" sortable :render-header="renderHeader" />
      <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['hejq:device:edit']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['hejq:device:edit']">修改</el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="海拔" align="left" prop="altitude" sortable :render-header="renderHeader" />
      <el-table-column label="监控唯一标识点" align="left" prop="cameraIndexCode" sortable :render-header="renderHeader" />
      <el-table-column label="监控名称" align="left" prop="cameraName" sortable :render-header="renderHeader" />
      <el-table-column label="监控类型" align="left" prop="cameraType" sortable :render-header="renderHeader" />
      <el-table-column label="监控类型名称" align="left" prop="cameraTypeName" sortable :render-header="renderHeader" />
      <el-table-column label="通道编号" align="left" prop="channelNo" sortable :render-header="renderHeader" />
      <el-table-column label="通道类型" align="left" prop="channelType" sortable :render-header="renderHeader" />
      <el-table-column label="通道类型名称" align="left" prop="channelTypeName" sortable :render-header="renderHeader" />
      <el-table-column label="所属设备id" align="left" prop="encodeDevIndexCode" sortable :render-header="renderHeader" />
      <el-table-column label="安装地点" align="left" prop="installLocation" sortable :render-header="renderHeader" />
      <el-table-column label="经度" align="left" prop="latitude" sortable :render-header="renderHeader" />
      <el-table-column label="纬度" align="left" prop="longitude" sortable :render-header="renderHeader" />
      <el-table-column label="在线状态" align="left" prop="status" sortable :render-header="renderHeader" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['camera:camera:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['camera:camera:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['camera:camera:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page-sizes="[20, 30, 50, 100]" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改和家亲-设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" class="_baseForm_big" append-to-body>
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <!--<el-form-item label="组织ID" prop="branchId">
          <el-input v-model="form.branchId" placeholder="请输入组织ID" />
        </el-form-item>
        -->
        <div class="sub-title">
          <div class="sub-title-name">基本信息</div>
        </div>
        <div class="sub-body">
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备名称" prop="deviceName" v-if="operationType != 3">
                <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
              </el-form-item>
              <el-form-item label="设备名称：" prop="deviceName" v-if="operationType == 3">
                <span>{{form.deviceName}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备MAC" prop="macId" v-if="operationType != 3">
                <el-input v-model="form.macId" disabled placeholder="请输入设备mac" />
              </el-form-item>
              <el-form-item label="设备MAC：" prop="macId" v-if="operationType == 3">
                <span>{{form.macId}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="经度" prop="longitude" v-if="operationType != 3">
                <el-input v-model="form.longitude" placeholder="请输入经度" />
              </el-form-item>
              <el-form-item label="经度：" prop="longitude" v-if="operationType == 3">
                <span>{{form.longitude}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度" prop="latitude" v-if="operationType != 3">
                <el-input v-model="form.latitude" placeholder="请输入纬度" />
              </el-form-item>
              <el-form-item label="纬度：" prop="latitude" v-if="operationType == 3">
                <span>{{form.latitude}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="设备地址" prop="location" v-if="operationType != 3">
                <el-input type="textarea" v-model="form.location" placeholder="请输入设备地址" />
              </el-form-item>
              <el-form-item label="设备地址：" prop="location" v-if="operationType == 3">
                <span>{{form.location}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所在辖区" prop="deptId" v-if="operationType != 3">
                <treeselect v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级辖区" />
              </el-form-item>
              <el-form-item label="所在辖区：" prop="deptId" v-if="operationType == 3">
                <span>{{ acodeMap[form.deptId] }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--<el-form-item label="mac" prop="mac">
          <el-input v-model="form.mac" placeholder="请输入mac" />
        </el-form-item>-->
        <!--<el-form-item label="0离线 1在线">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="operationType != 3" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listDevice, getDevice, delDevice,
  addDevice, updateDevice, exportDevice, syncCvrDeviceAndBranch
} from "@/api/video/device";
import { listCamera, getCamera, delCamera, addCamera, updateCamera, exportCamera, syncDev } from "@/api/project/ga/camera";
//import {getMap, listByTenant} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
export default {
  name: "Device",
  components: {
    Treeselect
  },
  data () {
    return {
      dialogIcon: '',
      // 遮罩层
      loading: true,
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
      // 和家亲-设备表格数据
      deviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 辖区树选项
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        branchId: null,
        branchName: null,
        macId: null,
        deviceName: null,
        latitude: null,
        longitude: null,
        mac: null,
        location: null,
        status: null,
        tenantId: null,
        ancestors: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        macId: [
          { required: true, message: "设备MAC不能为空", trigger: "blur" }
        ],
        deptId: [
          { required: true, message: "所在辖区不能为空", trigger: "blur" }
        ],
      },
      //状态
      statusOptions: [
        {
          dictLabel: "离线",
          dictValue: 0
        },
        {
          dictLabel: "在线",
          dictValue: 1
        }
      ],
      operationType: null,
      tableHeight: 400,
      tableOffset: 140,
      acodeMap: undefined,
    };
  },
  created () {
    //this.getMap();
    this.getList();
  },
  methods: {
    /** 查询和家亲-设备列表 */
    getList () {
      this.loading = false;
      /*listDevice(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });*/
      listCamera(this.queryParams).then(response => {
        this.deviceList = response.rows;
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
        branchId: null,
        macId: null,
        deviceName: null,
        latitude: null,
        longitude: null,
        mac: null,
        location: null,
        status: 0,
        tenantId: null,
        ancestors: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null
      };
      this.resetForm("form");
    },
    // 公告状态字典翻译
    statusFormat (row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
      this.open = true;
      this.operationType = 1;
      this.title = "添加设备信息";
    },
    /** 按钮操作 */
    handleView (row) {
      this.reset()
      this.open = true
      this.title = '查看监测设备详情'
      this.dialogIcon = 'el-icon-view';
      this.operationType = 3;
      const id = row.id
      getDevice(id).then(response => {
        this.form = response.data
      })
    },
    /** 修改按钮操作 */
    handleUpdate (row) {
      this.reset();
      this.open = true;
      this.title = "修改设备信息";
      this.operationType = 2;
      const id = row.id || this.ids
      listByTenant().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
      getDevice(id).then(response => {
        this.form = response.data;
      });
    },
    /** 提交按钮 */
    submitForm () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDevice(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDevice(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /**同步按钮操作**/
    handleSync () {
      let that = this
      this.$confirm('是否确认同步设备与组织信息，现数据将被同步的数据覆盖?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        that.loading = true
        try {
          return syncCvrDeviceAndBranch();
        } catch (e) {
          this.msgError("同步失败");
          that.loading = false
        }
      }).then(() => {
        this.getList();
        this.msgSuccess("同步成功");
        that.loading = false
      })
      /*.then(function () {
      that.loading = true
       syncCvrDeviceAndBranch(()=>{
         that.loading = false
          that.getList();
          that.msgSuccess("同步成功");
       }).catch((err)=>{
        that.loading = false
      })
    })*/
    },
    /** 删除按钮操作 */
    handleDelete (row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除和家亲-设备编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delDevice(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport () {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有和家亲-设备数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportDevice(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    },
    getMap () {
      getMap().then(response => {
        this.acodeMap = response.data
      })
    },
    /** 转换辖区数据结构 */
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
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
