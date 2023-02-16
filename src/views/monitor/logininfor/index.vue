<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" class="custom-form">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">用户名称</label>
          <el-form-item label="" prop="userName" class="custom-el-form-item">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询</el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button
              type="warning" plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:logininfor:export']"
            >导出</el-button>
            <el-button
              type="danger" plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['monitor:logininfor:remove']"
            >删除</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleClean"
              v-hasPermi="['monitor:logininfor:remove']"
            >清空</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: inline-block;">
        <div class="condition-item">
          <label class="condition-item-title">登录地址</label>
          <el-form-item label="" prop="ipaddr">
            <el-input
              v-model="queryParams.ipaddr"
              placeholder="请输入登录地址"
              clearable
              style="width: 240px;"
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">状态</label>
          <el-form-item label="" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="登录状态"
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
          <label class="condition-item-title">登录时间</label>
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

    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="list"
              @sort-change="changeTableSort"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" width="80">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" align="left" prop="userName" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="登录地址" align="left" prop="ipaddr" width="130" :show-overflow-tooltip="true" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="登录地点" align="left" prop="loginLocation" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="浏览器" align="left" prop="browser" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作系统" align="left" prop="os" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="登录状态" align="left" prop="status" :formatter="statusFormat" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="操作信息" align="left" prop="msg" sortable :render-header="(h,obj) => renderHeader(h,obj)"/>
      <el-table-column label="登录日期" align="left" prop="loginTime" width="180" sortable :render-header="(h,obj) => renderHeader(h,obj)">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :page-sizes="pageList"
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { list, delLogininfor, cleanLogininfor, exportLogininfor } from "@/api/monitor/logininfor";
import $ from "jquery";

export default {
  name: "Logininfor",
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
      tableHeight: 450,
      // 表格数据
      list: [],
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      pageList: [100,200,500,1000],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
      },
      columnLabel: ''
    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
      if(this.$refs.table.$el.offsetTop){
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 139;
      }else{
        this.tableHeight = window.innerHeight - 62 - 139;
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("sys_common_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    conditionToggle() {
      if ($('.toggle-container').css('display') == 'none') {
        $('.toggle-container').css('display', 'inline-block');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 139;
      } else {
        $('.toggle-container').css('display', 'none');
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 139;
      }
    },
    renderHeader(h, { column, $index }, width){
      let color = '#515a6e';
      let that = this;
      if(that.columnLabel != '' && that.columnLabel == column.label){
        color = "#ff6600";
      }
      let style = {};
      if(width){
        // width: 'calc(' + width + '% - 48px)'
        style = {textAlign:'left',wordBreak: 'break-all',whiteSpace: 'pre-line',display:'inline-block',lineHeight: 'normal',color: color, width: width+"px"}
      }else{
        style = {textAlign:'left',wordBreak: 'break-all',whiteSpace: 'pre-line',display:'inline-block',lineHeight: 'normal',color: color}
      }

      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
    //表格排序
    changeTableSort(column){
      let order = '';
      if(column.order === 'ascending'){
        order = 'asc';
      }else if(column.order === 'descending'){
        order = 'desc';
      }
      if(order !== ''){
        this.queryParams.sort = column.prop.replace(/([A-Z])/g,"_$1").toLowerCase();
        this.queryParams.order = order;
        this.queryParams.pageNum = 1;
        this.columnLabel = column.column.label;
      }else{
        this.queryParams.sort = '';
        this.queryParams.order = '';
        this.queryParams.pageNum = 1;
        this.columnLabel = '';
      }
      this.getList();
    },
    // 登录状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
      this.ids = selection.map(item => item.infoId)
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids;
      this.$confirm('是否确认删除访问编号为"' + infoIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          confirmButtonClass: "btn-confirm",
          type: "warning"
        }).then(function() {
          return delLogininfor(infoIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 清空按钮操作 */
    handleClean() {
        this.$confirm('是否确认清空所有登录日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return cleanLogininfor();
        }).then(() => {
          this.getList();
          this.msgSuccess("清空成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有操作日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLogininfor(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 139;
    });
  }
};
</script>

