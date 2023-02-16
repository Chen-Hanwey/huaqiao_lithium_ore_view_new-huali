<template>
  <div class="app-container">
    <el-form  :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch"
             label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <el-form-item label="标题" prop="title" style="margin-bottom: 0">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <div class="btn-container">
        <el-form-item style="margin-bottom: 0">
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
            v-hasPermi="['system:appVersions:add']"
          >新增
          </el-button>

          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:appVersions:remove']"
          >删除
          </el-button>

          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:appVersions:export']"
          >导出
          </el-button>
        </el-form-item>
        </div>

        <div class="toggle-container" ref="toggle-container" style="display: none;">
          <el-form-item label="包类型" prop="type" style="margin-bottom: 0">
            <el-select v-model="queryParams.type" placeholder="请选择安装包类型" clearable size="small">
              <el-option
                v-for="dict in typeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上线发行" prop="stablePublish" style="margin-bottom: 0">
            <el-select v-model="queryParams.stablePublish" placeholder="请选择是否上线发行" clearable size="small">
              <el-option
                v-for="dict in yesOrNoOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="静默更新" prop="isSilently" style="margin-bottom: 0">
            <el-select v-model="queryParams.isSilently" placeholder="请选择是否静默更新" clearable size="small">
              <el-option
                v-for="dict in yesOrNoOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="强制更新" prop="isMandatory" style="margin-bottom: 0">
            <el-select v-model="queryParams.isMandatory" placeholder="请选择是否强制更新" clearable size="small">
              <el-option
                v-for="dict in yesOrNoOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="appVersionsList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id"/>
      <el-table-column label="标题" width="240" prop="title"/>
      <el-table-column label="平台" prop="platform"/>
      <el-table-column label="包类型" prop="type"/>
      <el-table-column label="版本号" prop="version"/>
      <!--      <el-table-column label="原生App最低版本" prop="minUniVersion"/>-->
      <el-table-column label="上线发行" prop="stablePublish">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.stablePublish==1" type="success">发行中</el-tag>
          <el-tag v-else type="info">未发行</el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column label="静默更新" prop="isSilently"/>-->
      <!--      <el-table-column label="强制更新" prop="isMandatory"/>-->
      <!--      <el-table-column label="上传时间" prop="createDate" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:appVersions:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:appVersions:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改App版本控制对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="更新内容" prop="contents">
          <el-input v-model="form.contents" type="textarea" placeholder="请输入内容"/>
        </el-form-item>

        <el-row>
          <el-col span="12">
            <el-form-item label="安装包类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择安装包类型">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item label="更新平台" prop="platform">
              <el-select v-model="form.platform" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in platformOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="必须大于当前线上发行版本号，如1.0.1"/>
            </el-form-item>
          </el-col>
          <el-col span="12" v-if="form.type=='wgt'">
            <el-form-item label="最低版本" prop="minUniVersion">
              <el-input v-model="form.minUniVersion" placeholder="请输入原生App最低版本"/>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="包地址" prop="url">
          <el-input v-model="form.url" type="textarea" placeholder="请输入包下载地址，如果是IOS完整包请填写应用商店地址"/>
        </el-form-item>

        <el-row>
          <el-col span="8" v-if="form.type=='wgt'">
            <el-form-item label="是否静默更新" prop="isSilently">
              <el-select v-model="form.isSilently" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in yesOrNoOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="是否强制更新" prop="isMandatory">
              <el-select v-model="form.isMandatory" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in yesOrNoOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="8">
            <el-form-item label="是否上线发行" prop="stablePublish">
              <el-select v-model="form.stablePublish" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in yesOrNoOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-form-item label="上传时间" prop="createDate">-->
        <!--          <el-date-picker clearable size="small"-->
        <!--                          v-model="form.createDate"-->
        <!--                          type="date"-->
        <!--                          value-format="yyyy-MM-dd"-->
        <!--                          placeholder="选择上传时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAppVersions,
  getAppVersions,
  delAppVersions,
  addAppVersions,
  updateAppVersions,
  exportAppVersions
} from "@/api/system/appVersions";

export default {
  name: "AppVersions",
  components: {},
  data() {
    return {
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
      // App版本控制表格数据
      appVersionsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        platform: null,
        type: null,
        stablePublish: null,
        isSilently: null,
        isMandatory: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          {required: true, message: '更新标题不能为空', trigger: 'blur'}
        ],
        contents: [
          {required: true, message: '更新内容不能为空', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '包类型不能为空', trigger: 'blur'}
        ],
        platform: [
          {required: true, message: '平台不能为空', trigger: 'blur'}
        ],
        version: [
          {required: true, message: '版本号不能为空', trigger: 'blur'}
        ],
        url: [
          {required: true, message: '包地址不能为空', trigger: 'blur'}
        ],
        stablePublish: [
          {required: true, message: '发行状态不能为空', trigger: 'blur'}
        ],
      },
      tableHeight: 400,
      tableOffset: 126,
      yesOrNoOptions: [
        {
          dictValue: 1,
          dictLabel: '是'
        },
        {
          dictValue: 0,
          dictLabel: '否'
        }
      ],
      typeOptions: [
        {
          dictValue: 'native_app',
          dictLabel: '原生App安装包-native_app'
        },
        {
          dictValue: 'wgt',
          dictLabel: 'App资源包-wgt'
        }
      ],
      platformOptions: [
        {
          dictValue: 'Android',
          dictLabel: '安卓'
        },
        {
          dictValue: 'iOS',
          dictLabel: '苹果'
        }
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    conditionToggle() {
      if (this.$refs['toggle-container'].style.display === 'none') {
        this.$refs['toggle-container'].style.display = 'inline-block';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 135;
      } else {
        this.$refs['toggle-container'].style.display = 'none';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 135;
      }
    },
    /** 查询App版本控制列表 */
    getList() {
      this.loading = true;
      listAppVersions(this.queryParams).then(response => {
        this.appVersionsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        contents: null,
        platform: null,
        type: null,
        version: null,
        minUniVersion: null,
        url: null,
        stablePublish: 0,
        isSilently: 0,
        isMandatory: 0,
        createDate: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加App版本";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAppVersions(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改App版本";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAppVersions(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAppVersions(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除App版本控制编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAppVersions(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有App版本控制数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportAppVersions(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
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
