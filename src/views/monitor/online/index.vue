<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px;">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">用户名称</label>
          <el-form-item label="" prop="userName" class="custom-el-form-item">
            <el-input class="query-param"
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="lab-container">
          <label class="condition-item-title">登录主机IP</label>
          <el-form-item label="" prop="ipaddr" class="custom-el-form-item">
            <el-input class="query-param"
              v-model="queryParams.ipaddr"
              placeholder="请输入登录地址"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </div>
        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table
      v-loading="loading" ref="table" :height="tableHeight"
      :data="list.slice((queryParams.pageNum-1)*queryParams.pageSize,queryParams.pageNum*queryParams.pageSize)"
      style="width: 100%;" @sort-change="changeTableSort"
    >
      <el-table-column label="序号" type="index" width="60">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="会话编号" align="left" prop="tokenId" :show-overflow-tooltip="true" sortable/>
      <el-table-column label="登录名称" align="left" prop="userName" :show-overflow-tooltip="true" sortable/>
      <el-table-column label="部门名称" align="left" prop="deptName" sortable/>
      <el-table-column label="主机" align="left" prop="ipaddr" :show-overflow-tooltip="true" sortable/>
      <el-table-column label="登录地点" align="left" prop="loginLocation" sortable/>
      <el-table-column label="浏览器" align="left" prop="browser" sortable/>
      <el-table-column label="操作系统" align="left" prop="os" sortable/>
      <el-table-column label="登录时间" align="left" prop="loginTime" width="180" sortable>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleForceLogout(scope.row)"
            v-hasPermi="['monitor:online:forceLogout']"
          >强退</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :page-sizes="[100, 200, 500, 1000]" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
  </div>
</template>

<script>
  import online from './online';
  export default {
    ...online
  }
</script>

