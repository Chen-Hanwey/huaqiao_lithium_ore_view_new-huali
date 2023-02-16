<template>
  <div class="app-container">
    <el-row :gutter="7">
      <!--辖区数据-->
      <el-col v-if="showTree" :span="showTree ? 5 : 0" :xs="24">
        <enterprise-tree @enterpriseClick="enterpriseClick"></enterprise-tree>
      </el-col>
      <el-col :span="showTree ? 19 : 24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
          <div class="con-container">
            <div class="lab-container">
              <label class="condition-item-title">申请人</label>
              <el-form-item label="" prop="applicant" class="custom-el-form-item">
                <el-input v-model="queryParams.applicant" class="query-param" placeholder="请输入申请人" clearable size="small" @keyup.enter.native="handleQuery" />
              </el-form-item>
            </div>

            <div class="btn-container">
              <el-form-item>
                <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
                </el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['purchaseRecord:purchaseRecord:add']">新增
                </el-button>
                <!-- <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                           v-hasPermi="['purchaseRecord:purchaseRecord:export']">导出
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                           v-hasPermi="['purchaseRecord:purchaseRecord:remove']"
                >删除
                </el-button> -->
              </el-form-item>
            </div>
          </div>

          <div class="toggle-container" ref="toggle-container" style="display: none;">
            <high-query v-if="userType!='04'" ref="highQuery" :show-enterprise="true" :show-operation="false"></high-query>
            <div class="condition-item">
              <label class="condition-item-title">申请时间</label>
              <el-form-item label="" prop="applicationTime">
                <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.purchaseTimeRange1" type="daterange" value-format="yyyy-MM-dd" placeholder="选择申请时间">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">计划收货时间</label>
              <el-form-item label="" prop="scheduleDeliveryTime">
                <el-date-picker clearable size="small" style="width: 240px;" v-model="queryParams.purchaseTimeRange" type="daterange" value-format="yyyy-MM-dd" placeholder="选择计划收货时间">
                </el-date-picker>
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">状态</label>
              <el-form-item label="" prop="purchased">
                <el-select v-model="queryParams.purchased" clearable placeholder="请选择状态">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>

        <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="purchaseRecordList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业名称" min-width="120" align="left" prop="enterpriseName" :render-header="renderHeader" />
          <!-- <el-table-column label="经营场所名称" min-width="120" align="left" prop="operationName"  :render-header="renderHeader"/> -->
          <el-table-column label="申请人" align="left" prop="applicant" sortable :render-header="renderHeader" />
          <el-table-column label="申请时间" align="left" prop="applicationTime" sortable :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.applicationTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计划收货时间" align="left" prop="scheduleDeliveryTime" width="150" sortable :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ scope.row.scheduleDeliveryTime }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="购进总额" align="left" prop="totalMoney" sortable :render-header="renderHeader"/> -->
          <el-table-column label="状态" align="left" prop="purchased" sortable :render-header="renderHeader">
            <template slot-scope="scope">
              <span>{{ getPurchased(scope.row.purchased) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['purchaseRecord:purchaseRecord:query']">详情
              </el-button>
              <el-button size="mini" v-if="scope.row.purchased === 1" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['purchaseRecord:purchaseRecord:edit']">修改
              </el-button>
              <el-button size="mini" v-if="scope.row.purchased === 1" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['purchaseRecord:purchaseRecord:remove']">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改采购记录对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="purchaseRecord-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <base-form v-if="userType!='04'" :readOnly="readOnly" ref="baseForm"></base-form>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">申请人信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="申请人" prop="applicant" v-if="!readOnly">
                  <el-input v-model="form.applicant" placeholder="请输入申请人" />
                </el-form-item>
                <el-form-item label="申请人：" prop="applicant" v-if="readOnly" class="custom-form-item">
                  {{form.applicant}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="申请时间：" prop="applicationTime" v-if="readOnly" class="custom-form-item">
                  {{form.applicationTime}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计划收货时间" prop="scheduleDeliveryTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item" v-model="form.scheduleDeliveryTime" type="date" :picker-options="dateOptions1" value-format="yyyy-MM-dd" placeholder="选择计划收货时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="计划收货时间：" prop="scheduleDeliveryTime" v-if="readOnly" class="custom-form-item">
                  {{form.scheduleDeliveryTime}}
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">待采购商品</div>
          </div>
          <div class="sub-body">
            <el-button v-if="!readOnly" style="margin: 0px 5px 5px 5px" @click="addGoods" type="primary" icon="el-icon-plus">添加</el-button>
            <el-table ref="goodsTable" stripe :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="goodsList" default-expand-all>
              <el-table-column label="序号" type="index" width="60" align="left">
                <template slot-scope="scope">
                  <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" align="left" prop="goodsName" sortable :render-header="renderHeader" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.goodsName" filterable allow-create placeholder="选择或新建商品" size="small" @change="goodsNameChange(scope.row)">
                    <el-option v-for="dict in goodsListRest" :key="dict.id" :label="dict.goodsName" :value="dict.id" />
                  </el-select>
                  <span v-if="!scope.row.editable">{{scope.row.goodsName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="计量单位" align="left" prop="goodsUnit" sortable :formatter="goodsUnitFormat" :render-header="renderHeader" width="120">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.goodsUnit" placeholder="选择计量单位" size="small">
                    <el-option v-for="dict in goodsUnitOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                  <span v-if="!scope.row.editable">{{goodsUnitFormat(scope.row)}}</span>
                </template>
              </el-table-column>

              <el-table-column label="数量" align="left" prop="mount" sortable :render-header="renderHeader" min-width="100">
                <template slot-scope="scope">
                  <el-input-number v-if="scope.row.editable" v-model="scope.row.mount" :precision="2" :controls="false"></el-input-number>
                  <span v-if="!scope.row.editable">{{scope.row.mount}}</span>
                </template>
              </el-table-column>

              <el-table-column label="类型" align="left" prop="goodsType" sortable :formatter="goodsTypeFormat" :render-header="renderHeader" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.goodsType" placeholder="选择类型" size="small">
                    <el-option v-for="dict in goodsTypeOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                  </el-select>
                  <span v-if="!scope.row.editable">{{goodsTypeFormat(scope.row)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否进口" align="left" prop="inlet" sortable :formatter="inletFormat" :render-header="renderHeader" width="120">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.inlet" placeholder="选择是否进口" size="small">
                    <el-option :key="0" label="否" :value="'0'" />
                    <el-option :key="1" label="是" :value="'1'" />
                  </el-select>
                  <span v-if="!scope.row.editable">{{scope.row.inlet=='1'?'是':'否'}}</span>
                </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" min-width="100" v-if="!readOnly" :render-header="renderHeader">
                <template slot-scope="scope">
                  <el-button @click="handleEditGoods(scope.row,scope.$index)" v-if="curRowIndex<0" style="color: #409eff" type="text" size="small">编辑</el-button>
                  <el-button @click="handleSaveGoods(scope.row,scope.$index)" v-if="curRowIndex>=0 && scope.row.editable && curRowIndex == scope.$index" style="color: #409eff" type="text" size="small">确定</el-button>
                  <el-button v-if="curRowIndex>=0 && curRowIndex != scope.$index" style="color: #999" type="text" size="small">编辑</el-button>
                  <el-button @click="handleDeleteGoods(scope.row,scope.$index)" v-if="curRowIndex<0" style="color: #f70000" type="text" size="small">删除</el-button>
                  <el-button @click="handleDeleteGoods(scope.row,scope.$index)" v-if="curRowIndex>=0 && curRowIndex == scope.$index" type="text" style="color: #f70000" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="operationType != 3">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
        <div v-if="operationType == 3">
          <el-button type="" @click="cancel">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import purchaseRecord from "./purchaseRecord";

export default {
  ...purchaseRecord
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
