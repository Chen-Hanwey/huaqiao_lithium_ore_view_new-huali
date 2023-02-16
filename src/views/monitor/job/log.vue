<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px;">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">任务名称</label>
          <el-form-item label="" prop="jobName" class="custom-el-form-item">
            <el-input
              v-model="queryParams.jobName"
              placeholder="请输入任务名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['monitor:job:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                       v-hasPermi="['monitor:job:remove']">删除
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleClean"
                       v-hasPermi="['monitor:job:remove']">清空
            </el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item">
          <label class="condition-item-title">任务组名</label>
          <el-form-item label="" prop="jobGroup">
            <el-select
              v-model="queryParams.jobGroup"
              placeholder="请任务组名"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in jobGroupOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">执行状态</label>
          <el-form-item label="" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择执行状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">执行时间</label>
          <el-form-item label="">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="jobLogList" @row-dblclick="handleDoubleClick"
              @selection-change="handleSelectionChange" @sort-change="changeTableSort">
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="日志编号" width="80" align="center" prop="jobLogId" />-->
      <el-table-column label="序号" align="left" type="index" width="120">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务名称" align="left" prop="jobName" :show-overflow-tooltip="true" sortable
                       :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="任务组名" align="left" prop="jobGroup" :formatter="jobGroupFormat"
                       :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="调用目标字符串" align="left" prop="invokeTarget" :show-overflow-tooltip="true" sortable
                       :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="日志信息" align="left" prop="jobMessage" :show-overflow-tooltip="true" sortable
                       :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="执行状态" align="left" prop="status" :formatter="statusFormat" sortable
                       :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="执行时间" align="left" prop="createTime" width="180" sortable
                       :render-header="(h,obj) => renderHeader(h,obj)">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['monitor:job:query']"
          >详细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[100, 200, 500, 1000]"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 调度日志详细 -->
    <el-dialog :visible.sync="open" fullscreen class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="modal-body"></div>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status == 1">{{ form.exceptionInfo }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="" @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {listJobLog, delJobLog, exportJobLog, cleanJobLog} from "@/api/monitor/jobLog";
    import $ from 'jquery'

    export default {
        name: "JobLog",
        data() {
            return {
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非多个禁用
                multiple: true,
                // 总条数
                total: 0,
                // 调度日志表格数据
                jobLogList: [],
                // 是否显示弹出层
                open: false,
                // 日期范围
                dateRange: [],
                // 表单参数
                form: {},
                // 执行状态字典
                statusOptions: [],
                // 任务组名字典
                jobGroupOptions: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 100,
                    jobName: undefined,
                    jobGroup: undefined,
                    status: undefined
                },
                // 表单参数
                form: {},
                title: '',
                //表格高度
                tableHeight: 400,
                columnLabel: ''
            };
        },
        watch: {
            '$store.state.app.screenHeight': function () { //监听屏幕高度变化
                if (this.$refs.table.$el.offsetTop) {
                    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
                } else {
                    this.tableHeight = window.innerHeight - 62 - 145;
                }
                this.openDialog();
            },
        },
        created() {
            this.getList();
            this.getDicts("sys_job_status").then(response => {
                this.statusOptions = response.data;
            });
            this.getDicts("sys_job_group").then(response => {
                this.jobGroupOptions = response.data;
            });
        },
        methods: {
            handleDoubleClick(row, column, event) {
                this.handleView(row);
            },
            openDialog() {
                $('.modal-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
            },
            conditionToggle() {
                if ($('.toggle-container').css('display') == 'none') {
                    $('.toggle-container').css('display', 'inline-block');
                    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
                } else {
                    $('.toggle-container').css('display', 'none');
                    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
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
                        textAlign: 'left',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-line',
                        display: 'inline-block',
                        lineHeight: 'normal',
                        color: color,
                        width: width + "px"
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
            /** 查询调度日志列表 */
            getList() {
                this.loading = true;
                listJobLog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                        this.jobLogList = response.rows;
                        this.total = response.total;
                        this.loading = false;
                    }
                );
            },
            // 执行状态字典翻译
            statusFormat(row, column) {
                return this.selectDictLabel(this.statusOptions, row.status);
            },
            // 任务组名字典翻译
            jobGroupFormat(row, column) {
                return this.selectDictLabel(this.jobGroupOptions, row.jobGroup);
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.pageNum = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.dateRange = [];
                this.resetForm("queryForm");
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.jobLogId);
                this.multiple = !selection.length;
            },
            /** 详细按钮操作 */
            handleView(row) {
                this.open = true;
                this.title = "查看调度日志";
                this.dialogIcon = 'el-icon-document';
                this.form = row;
            },
            /** 删除按钮操作 */
            handleDelete(row) {
                const jobLogIds = this.ids;
                this.$confirm('是否确认删除调度日志编号为"' + jobLogIds + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    confirmButtonClass: "btn-confirm",
                    type: "warning"
                }).then(function () {
                    return delJobLog(jobLogIds);
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(function () {
                });
            },
            /** 清空按钮操作 */
            handleClean() {
                this.$confirm("是否确认清空所有调度日志数据项?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return cleanJobLog();
                }).then(() => {
                    this.getList();
                    this.msgSuccess("清空成功");
                }).catch(function () {
                });
            },
            /** 导出按钮操作 */
            handleExport() {
                const queryParams = this.queryParams;
                this.$confirm("是否确认导出所有调度日志数据项?", "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function () {
                    return exportJobLog(queryParams);
                }).then(response => {
                    this.download(response.msg);
                }).catch(function () {
                });
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
            });
        }
    };
</script>
