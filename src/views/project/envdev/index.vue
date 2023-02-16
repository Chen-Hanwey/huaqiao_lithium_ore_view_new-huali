<template>
  <div class="app-container">
    <el-form class="search-form" :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="80px">
      <el-form-item label="设备名称" prop="devName">
        <el-input
          v-model="queryParams.devName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="设备状态" prop="devStatus">
        <el-select v-model="queryParams.devStatus" placeholder="请选择设备状态" clearable size="small">
          <el-option
            v-for="dict in devstatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="经度" prop="longitude">
        <el-input
          v-model="queryParams.longitude"
          placeholder="请输入经度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input
          v-model="queryParams.latitude"
          placeholder="请输入纬度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件
        </el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:envdev:add']"
        >新增
        </el-button>
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:envdev:remove']"
        >删除
        </el-button>
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:envdev:export']"
        >导出
        </el-button>
      </el-form-item>

      <div class="toggle-container" ref="toggle-container" style="display: none;border-left:none">
        <el-form-item label="设备状态" prop="devStatus">
          <el-select v-model="queryParams.devStatus" placeholder="请选择设备状态" clearable size="small">
            <el-option
              v-for="dict in devstatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input
            v-model="queryParams.longitude"
            placeholder="请输入经度"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input
            v-model="queryParams.latitude"
            placeholder="请输入纬度"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </div>
    </el-form>


    <!--<el-row :gutter="10" class="table-button-container">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['project:envdev:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['project:envdev:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['project:envdev:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>-->

    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="envdevList" @sort-change="changeTableSort"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" prop="devName" sortable :formatter="formatterType"/>
      <el-table-column label="设备状态" prop="devStatus" sortable :formatter="devstatusFormat"/>
      <el-table-column label="经度" prop="longitude" sortable :formatter="formatterType"/>
      <el-table-column label="纬度" prop="latitude" sortable :formatter="formatterType"/>
      <!--<el-table-column label="备注" prop="remark" :formatter="formatterType" />-->
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['project:envdev:query']"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['project:envdev:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['project:envdev:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[20, 30, 50, 100]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改环境监测设备信息对话框
    <el-dialog center :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备编号" prop="devNumber">
          <el-input v-model="form.devNumber" placeholder="请输入设备编号"/>
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input v-model="form.devName" placeholder="请输入设备名称"/>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-radio-group v-model="form.devStatus">
            <el-radio
              v-for="dict in devstatusOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入设备状态"/>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入设备状态"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>-->
    <el-dialog center :title="title" :visible.sync="open" class="_baseForm_big" append-to-body>
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="设备编号" prop="devNumber">
                  <el-input v-model="form.devNumber" placeholder="请输入设备编号"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="设备名称" prop="devName">
                  <el-input v-model="form.devName" placeholder="请输入设备名称"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="设备状态">
                  <el-radio-group v-model="form.devStatus">
                    <el-radio
                      v-for="dict in devstatusOptions"
                      :key="dict.dictValue"
                      style="margin-bottom: 5px"
                      :label="parseInt(dict.dictValue)"
                    >{{dict.dictLabel}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="经度" prop="longitude">
                  <el-input v-model="form.longitude" placeholder="请输入经度"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纬度" prop="latitude">
                  <el-input v-model="form.latitude" placeholder="请输入纬度"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
              </el-form-item>
            </el-row>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog center :visible.sync="viewOpen" :close-on-click-modal="false" class="_baseForm_big">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> 设备管理详情</span>
      </div>
      <div class="content-body"></div>
      <el-form ref="viewForm" :model="form" :rules="rules" label-width="130px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-form-item label="设备编号" prop="devNumber" class="custom-form-item">
                {{form.devNumber}}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="设备名称" prop="devName" class="custom-form-item">
                {{form.devName}}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="设备状态" prop="devStatus" class="custom-form-item" :formatter="devstatusFormat">
                {{devstatusFormat(form)}}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="经度" prop="longitude" class="custom-form-item">
                {{form.longitude}}
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="纬度" prop="latitude" class="custom-form-item">
                {{form.latitude}}
              </el-form-item>
            </el-row>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="viewOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addEnvdev, delEnvdev, exportEnvdev, getEnvdev, listEnvdev, updateEnvdev} from "@/api/project/envDev/envdev";

export default {
    name: "Envdev",
    components: {},
    data() {
      const validateLongitude = (rule, value, callback) => {
        //经度,整数部分为0-180小数部分为0到15位
        var longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,15})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,15}|180)$/
        if (!longreg.test(value)) {
          callback(new Error('经度整数部分为0-180,小数部分为0到15位!'))
        }
        callback()
      }
      const validateLatitude = (rule, value, callback) => {
        //纬度,整数部分为0-90小数部分为0到15位
        var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,15}|90\.0{0,15}|[0-8]?\d{1}|90)$/
        if (!latreg.test(value)) {
          callback(new Error('纬度整数部分为0-90,小数部分为0到15位!'))
        }
        callback()
      }
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
        // 环境监测设备信息表格数据
        envdevList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        viewOpen: false,
        // 设备状态字典
        devstatusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 20,
          devName: null,
          devStatus: null,
          longitude: null,
          latitude: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          devNumber: [
            {required: true, message: "设备编号不能为空", trigger: "blur"}
          ],
          devName: [
            {required: true, message: "设备名称不能为空", trigger: "blur"}
          ],
          longitude: [
            { validator: validateLongitude, trigger: 'blur' },
            { validator: validateLongitude, trigger: 'change' }
          ],
          latitude: [
            { validator: validateLatitude, trigger: 'blur' },
            { validator: validateLatitude, trigger: 'change' }
          ]
        },
        tableHeight: 400,
        tableOffset: 138
      };
    },
    created() {
      this.getList();
      this.getDicts("peace_country_dev_status").then(response => {
        this.devstatusOptions = response.data;
      });
    },
    methods: {
      /** 条件按钮 */
      conditionToggle() {
        if (this.$refs['toggle-container'].style.display === 'none') {
          this.$refs['toggle-container'].style.display = 'inline-block';
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
        } else {
          this.$refs['toggle-container'].style.display = 'none';
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
        }
      },
      /** 查询环境监测设备信息列表 */
      getList() {
        this.loading = true;
        listEnvdev(this.queryParams).then(response => {
          this.envdevList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 设备状态字典翻译
      devstatusFormat(row, column) {
        return this.selectDictLabel(this.devstatusOptions, row.devStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          devId: null,
          devName: null,
          devStatus: 0,
          longitude: null,
          latitude: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.devId);
        this.devNames = selection.map(item => item.devName);
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.dialogIcon = 'el-icon-plus';
       /* this.title = "新增环境监测设备信息";*/
        this.title = "新增设备信息";
      },
      /** 详情操作 */
      handleView(row) {
        this.reset();
        const id = row.devId;
        this.fileList = [];
        getEnvdev(id).then(response => {
          this.form = response.data;
          this.viewOpen = true;
          this.title = "查看";
          this.dialogIcon = 'el-icon-view';
          this.readOnly = true;
          if (this.form.link == null || this.form.link == '') {
            this.localContent = true;
          } else {
            this.localContent = false;
          }
          this.operationType = 3;
          if (this.form.picturePath != null && this.form.picturePath != '') {
            this.isImage = true;
            this.dialogImageUrl = process.env.VUE_APP_PICTURE_PATH + this.form.picturePath;
          }
          if (response.data.appendixList) {
            response.data.appendixList.forEach(item => {
              let file = {};
              file['uid'] = item.appendixId;
              file['url'] = process.env.VUE_APP_PICTURE_PATH + item.appendixPath;
              file['name'] = item.appendixName;
              this.fileList.push(file);
            });
          }
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const devId = row.devId || this.ids
        getEnvdev(devId).then(response => {
          this.form = response.data;
          this.open = true;
          this.dialogIcon = 'el-icon-edit';
          /*this.title = "修改环境监测设备信息";*/
          this.title = "修改设备信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.devId != null) {
              updateEnvdev(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addEnvdev(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const devIds = row.devId || this.ids;
        const devNames = row.devName || this.devNames;
        this.$confirm('是否确认删除环境监测设备信息为 "' + devNames + '" 的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delEnvdev(devIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        let exportMsg = '是否导出所有信息项?'
        if (this.ids && this.ids.length > 0) {
          this.queryParams.ids = this.ids
          exportMsg = '是否需要导出已选信息项?'
        } else {
          delete this.queryParams.ids
        }
        const queryParams = JSON.parse(JSON.stringify(this.queryParams));
        delete queryParams.page
        delete queryParams.pageNum
        delete queryParams.pageSize
        this.$confirm(exportMsg, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportEnvdev(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      /** 字段排序显示 */
      renderHeader(h, {column, $index}, width) {
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
      }
    },
    watch: {
      showSearch(val) {
        this.$nextTick(function () {
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
        });
      },
      '$store.state.app.screenHeight': function () { //监听屏幕高度变化
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      });
    }
  };
</script>
