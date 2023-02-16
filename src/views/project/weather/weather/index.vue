<template>
  <div class="app-container">
    <!-- <canvas id="video-canvas"></canvas> -->

    <!-- <div class="myVideo">
      <canvas class="video-canvas" ref="video-canvas" style="width:100%;"></canvas>
    </div> -->
    <!-- <img src="//ww-adas.oss-cn-hangzhou.aliyuncs.com/adas/863042041255119_1381168215_00_64_6403_0_.jpg" alt="Smiley face" width="42" height="42">

    <img src="//ww-adas.oss-cn-hangzhou.aliyuncs.com/adas/863042041255119_1381168215_00_64_6403_1_.jpg" alt="Smiley face" width="42" height="42"> -->
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">日期</label>
          <el-form-item label="" prop="date" class="custom-el-form-item">
            <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.dateRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['weather:weather:add']">新增
            </el-button> -->
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addWeather" v-hasPermi="['weather:weather:add']">获取天气
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['weather:weather:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['weather:weather:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
          <label class="condition-item-title">星期</label>
          <el-form-item label="" prop="week">
            <el-input v-model="queryParams.week" class="query-param" placeholder="请输入星期" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">白天天气现象</label>
          <el-form-item label="" prop="dayweather">
            <el-input v-model="queryParams.dayweather" class="query-param" placeholder="请输入白天天气现象" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">夜间天气现象</label>
          <el-form-item label="" prop="nightweather">
            <el-input v-model="queryParams.nightweather" class="query-param" placeholder="请输入夜间天气现象" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">最高温</label>
          <el-form-item label="" prop="daytemp">
            <el-input v-model="queryParams.daytemp" class="query-param" placeholder="请输入最高温" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">最低温</label>
          <el-form-item label="" prop="nighttemp">
            <el-input v-model="queryParams.nighttemp" class="query-param" placeholder="请输入最低温" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">白天风向</label>
          <el-form-item label="" prop="daywind">
            <el-input v-model="queryParams.daywind" class="query-param" placeholder="请输入白天风向" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">夜晚风向</label>
          <el-form-item label="" prop="nightwind">
            <el-input v-model="queryParams.nightwind" class="query-param" placeholder="请输入夜晚风向" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">白天风力</label>
          <el-form-item label="" prop="daypower">
            <el-input v-model="queryParams.daypower" class="query-param" placeholder="请输入白天风力" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">夜晚风力</label>
          <el-form-item label="" prop="nightpower">
            <el-input v-model="queryParams.nightpower" class="query-param" placeholder="请输入夜晚风力" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="weatherList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="日期" align="left" prop="date" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ isTody(scope.row.date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="星期" align="left" prop="week" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ fomart(scope.row.week) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="白天天气" align="left" prop="dayweather" sortable :render-header="renderHeader" />
      <el-table-column label="夜间天气" align="left" prop="nightweather" sortable :render-header="renderHeader" />
      <el-table-column label="最高温" align="left" prop="daytemp" sortable :render-header="renderHeader" />
      <el-table-column label="最低温" align="left" prop="nighttemp" sortable :render-header="renderHeader" />
      <el-table-column label="白天风向" align="left" prop="daywind" sortable :render-header="renderHeader" />
      <el-table-column label="夜晚风向" align="left" prop="nightwind" sortable :render-header="renderHeader" />
      <el-table-column label="白天风力" align="left" prop="daypower" sortable :render-header="renderHeader" />
      <el-table-column label="夜晚风力" align="left" prop="nightpower" sortable :render-header="renderHeader" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['weather:weather:query']">详情</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['weather:weather:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['weather:weather:remove']">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改天气预报对话框 -->
    <el-dialog :visible.sync="open" fullscreen :close-on-click-modal="false" class="customForm" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="weather-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="日期" prop="date" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="日期：" prop="date" v-if="readOnly" class="custom-form-item">
                  {{form.date}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="星期" prop="week" v-if="!readOnly">
                  <el-input v-model="form.week" placeholder="请输入星期" />
                </el-form-item>
                <el-form-item label="星期：" prop="week" v-if="readOnly" class="custom-form-item">
                  {{form.week}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="白天天气现象" prop="dayweather" v-if="!readOnly">
                  <el-input v-model="form.dayweather" placeholder="请输入白天天气现象" />
                </el-form-item>
                <el-form-item label="白天天气现象：" prop="dayweather" v-if="readOnly" class="custom-form-item">
                  {{form.dayweather}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="夜间天气现象" prop="nightweather" v-if="!readOnly">
                  <el-input v-model="form.nightweather" placeholder="请输入夜间天气现象" />
                </el-form-item>
                <el-form-item label="夜间天气现象：" prop="nightweather" v-if="readOnly" class="custom-form-item">
                  {{form.nightweather}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最高温" prop="daytemp" v-if="!readOnly">
                  <el-input v-model="form.daytemp" placeholder="请输入最高温" />
                </el-form-item>
                <el-form-item label="最高温：" prop="daytemp" v-if="readOnly" class="custom-form-item">
                  {{form.daytemp}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最低温" prop="nighttemp" v-if="!readOnly">
                  <el-input v-model="form.nighttemp" placeholder="请输入最低温" />
                </el-form-item>
                <el-form-item label="最低温：" prop="nighttemp" v-if="readOnly" class="custom-form-item">
                  {{form.nighttemp}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="白天风向" prop="daywind" v-if="!readOnly">
                  <el-input v-model="form.daywind" placeholder="请输入白天风向" />
                </el-form-item>
                <el-form-item label="白天风向：" prop="daywind" v-if="readOnly" class="custom-form-item">
                  {{form.daywind}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="夜晚风向" prop="nightwind" v-if="!readOnly">
                  <el-input v-model="form.nightwind" placeholder="请输入夜晚风向" />
                </el-form-item>
                <el-form-item label="夜晚风向：" prop="nightwind" v-if="readOnly" class="custom-form-item">
                  {{form.nightwind}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="白天风力" prop="daypower" v-if="!readOnly">
                  <el-input v-model="form.daypower" placeholder="请输入白天风力" />
                </el-form-item>
                <el-form-item label="白天风力：" prop="daypower" v-if="readOnly" class="custom-form-item">
                  {{form.daypower}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="夜晚风力" prop="nightpower" v-if="!readOnly">
                  <el-input v-model="form.nightpower" placeholder="请输入夜晚风力" />
                </el-form-item>
                <el-form-item label="夜晚风力：" prop="nightpower" v-if="readOnly" class="custom-form-item">
                  {{form.nightpower}}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
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
  </div>
</template>

<script>
import weather from "./weather";
export default {
  ...weather
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
