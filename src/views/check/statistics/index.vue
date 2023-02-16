<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <el-radio-group v-model="queryParams.scopeType" @change="getList">
          <el-radio-button :label="1">本月</el-radio-button>
          <el-radio-button :label="2">本年</el-radio-button>
        </el-radio-group>
<!--        <div class="lab-container">
          <label class="condition-item-title">企业</label>
          <el-form-item label="" prop="enterpriseName" class="custom-el-form-item">
            <el-select v-model="queryParams.enterpriseId" placeholder="&#45;&#45;全部&#45;&#45;" clearable size="small" class="query-param">
              <el-option
                v-for="enterprise in enterpriseOptions"
                :key="enterprise.id"
                :label="enterprise.name"
                :value="enterprise.id"
              />
            </el-select>
          </el-form-item>
        </div>-->

        <div class="btn-container">
          <el-form-item>
<!--            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>-->
<!--            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['qualityScore:qualityScore:add']">新增
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['qualityScore:qualityScore:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                       v-hasPermi="['qualityScore:qualityScore:remove']"
            >删除</el-button>-->
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

      </div>
    </el-form>

    <el-table ref="table" v-loading="loading"  stripe
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="qualityScoreList" >
<!--      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="企业" width="200" header-align="center" align="left" prop="enterpriseName" :render-header="renderHeader"/>
      <el-table-column label="餐饮量化" header-align="center">
        <el-table-column label="检查次数"  align="center" prop="cateringQuantifyStatistic.count"></el-table-column>
        <el-table-column label="通过数"  align="center" prop="cateringQuantifyStatistic.passCount"></el-table-column>
        <el-table-column label="均分"  align="center" prop="cateringQuantifyStatistic.avg"></el-table-column>
      </el-table-column>
      <el-table-column label="信用评定" header-align="center">
        <el-table-column label="检查次数"  align="center" prop="creditRatingStatistic.count"></el-table-column>
        <el-table-column label="通过数"  align="center" prop="creditRatingStatistic.passCount"></el-table-column>
        <el-table-column label="均分"  align="center" prop="creditRatingStatistic.avg"></el-table-column>
      </el-table-column>
      <el-table-column label="食安自查" header-align="center">
        <el-table-column label="检查次数"  align="center" prop="selfExaminationStatistic.count"></el-table-column>
        <el-table-column label="通过数"  align="center" prop="selfExaminationStatistic.passCount"></el-table-column>
        <el-table-column label="均分"  align="center" prop="selfExaminationStatistic.avg"></el-table-column>
      </el-table-column>
    </el-table>

    <pagination
      :page-sizes="pageList"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import CheckStatistics from "./statistics";
export default {
  ...CheckStatistics
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
/* ↓ 评分控件居中 ↓ */
.el-rate {
  height: 33px;
}
/deep/ .el-rate__item {
  height: 100% !important;
}
/deep/ .el-rate__icon {
  top: 50%;
  transform: translate(0, -50%);
}
/* ↑ 评分控件居中 ↑ */
</style>
