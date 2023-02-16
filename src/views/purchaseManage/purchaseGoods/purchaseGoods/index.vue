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
              <label class="condition-item-title">供应商</label>
              <el-form-item label="" prop="supplierId" class="custom-el-form-item">
                <el-select v-model="queryParams.supplierId" placeholder="--全部--" clearable size="small" class="query-param">
                  <el-option
                    v-for="dict in supplierOptions"
                    :key="dict.id"
                    :label="dict.supplierName"
                    :value="dict.id"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div class="btn-container">
              <el-form-item>
                <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
                </el-button>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                           v-hasPermi="['purchaseGoods:purchaseGoods:add']">新增
                </el-button>
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                           v-hasPermi="['purchaseGoods:purchaseGoods:export']">导出
                </el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                           v-hasPermi="['purchaseGoods:purchaseGoods:remove']"
                >删除
                </el-button>
              </el-form-item>
            </div>
          </div>

          <div class="toggle-container" ref="toggle-container" style="display: none;">
            <high-query ref="highQuery" :show-enterprise="true" :show-operation="false"></high-query>
            <div class="condition-item">
              <label class="condition-item-title">商品名称</label>
              <el-form-item label="" prop="goodsName" class="custom-el-form-item">
                <el-input
                  v-model="queryParams.goodsName" class="query-param"
                  placeholder="请输入商品名称"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">计量单位</label>
              <el-form-item label="" prop="goodsUnit">
                <el-select v-model="queryParams.goodsUnit" placeholder="--全部--" clearable size="small" class="query-param">
                  <el-option
                    v-for="dict in goodsUnitOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </div>

            <!-- <div class="condition-item">
              <label class="condition-item-title">是否进口</label>
              <el-form-item label="" prop="inlet">
                <el-select v-model="queryParams.inlet" placeholder="--全部--" clearable size="small" class="query-param">
                  <el-option label="否" :value="'0'"/>
                  <el-option label="是" :value="'1'"/>
                </el-select>
              </el-form-item>
            </div> -->
            <div class="condition-item">
              <label class="condition-item-title">参考单价（元）</label>
              <el-form-item label="" prop="price">
                <el-input
                  v-model="queryParams.price" class="query-param"
                  placeholder="请输入参考单价"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">商品类型</label>
              <el-form-item label="" prop="goodsType">
                <el-select v-model="queryParams.goodsType" placeholder="--全部--" clearable size="small" class="query-param">
                  <el-option
                    v-for="dict in goodsTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="condition-item">
              <label class="condition-item-title">商品规格</label>
              <el-form-item label="" prop="standard">
                <el-input
                  v-model="queryParams.standard" class="query-param"
                  placeholder="请输入商品规格"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>

        <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
                  :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                  :data="purchaseGoodsList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="企业名称" min-width="120" width="220" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
          <!-- <el-table-column label="经营场所名称" min-width="120" align="left" prop="operationName"  :render-header="renderHeader"/> -->
          <el-table-column label="商品名称" align="left" prop="goodsName" sortable :render-header="renderHeader"/>
          <el-table-column label="计量单位" align="left" prop="goodsUnit" :formatter="goodsUnitFormat" sortable
                           :render-header="renderHeader"/>
<!--          <el-table-column label="保质期(天)" align="left" prop="qualityDays" sortable :render-header="renderHeader"/>-->
          <el-table-column label="参考单价(元)" align="left" prop="price" min-width="110" sortable :render-header="renderHeader"/>
          <!--      <el-table-column label="商品产地" align="left" prop="productPlace" sortable :render-header="renderHeader"/>-->
<!--          <el-table-column label="是否进口" align="left" prop="inlet" sortable :formatter="inletFormat"
                           :render-header="renderHeader"/>-->
          <!--      <el-table-column label="包装形式" align="left" prop="packageType" :formatter="packageTypeFormat" sortable :render-header="renderHeader"/>-->
          <el-table-column label="商品类型" align="left" prop="goodsType" :formatter="goodsTypeFormat" sortable
                           :render-header="renderHeader"/>
          <el-table-column label="商品规格" align="left" prop="standard" sortable :render-header="renderHeader"/>

          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-view"
                @click="handleView(scope.row)"
                v-hasPermi="['purchaseGoods:purchaseGoods:query']"
              >详情
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['purchaseGoods:purchaseGoods:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['purchaseGoods:purchaseGoods:remove']"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :page-sizes="pageList"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改采购商品信息对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="purchaseGoods-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <base-form :readOnly="readOnly" ref="baseForm"></base-form>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">商品信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="商品名称" prop="goodsName" v-if="!readOnly">
                  <el-input v-model="form.goodsName" placeholder="请输入商品名称"/>
                </el-form-item>
                <el-form-item label="商品名称：" prop="goodsName" v-if="readOnly" class="custom-form-item">
                  {{form.goodsName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计量单位" prop="goodsUnit" v-if="!readOnly">
                  <el-select v-model="form.goodsUnit" placeholder="请选择计量单位" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsUnitOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="计量单位：" prop="goodsUnit" v-if="readOnly" class="custom-form-item">
                  {{goodsUnitFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="保质期(天)" prop="qualityDays" v-if="!readOnly">
                  <el-input v-model="form.qualityDays" οnkeyup="value=value.replace(/[^\d]/g,'')" onkeyup="value=value.replace(/\D/g,'')" placeholder="请输入保质期(天)"/>
                </el-form-item>
                <el-form-item label="保质期(天)：" prop="qualityDays" v-if="readOnly" class="custom-form-item">
                  {{form.qualityDays}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="参考单价(元)" prop="price" v-if="!readOnly">
                  <el-input v-model="form.price" onkeyup="value=value.replace(/\D/g,'')" placeholder="请输入参考单价(元)"/>
                </el-form-item>
                <el-form-item label="参考单价(元)：" prop="price" v-if="readOnly" class="custom-form-item">
                  {{form.price}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否进口" prop="inlet" v-if="!readOnly">
                  <el-radio-group v-model="form.inlet">
                    <el-radio :key="0" :label="'0'">否</el-radio>
                    <el-radio :key="1" :label="'1'">是</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否进口：" prop="inlet" v-if="readOnly" class="custom-form-item">
                  {{inletFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品类型" prop="goodsType" v-if="!readOnly">
                  <el-select v-model="form.goodsType" placeholder="请选择商品类型" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="商品类型：" prop="goodsType" v-if="readOnly" class="custom-form-item">
                  {{goodsTypeFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品规格" prop="standard" v-if="!readOnly">
                  <el-input v-model="form.standard" placeholder="请输入商品规格"/>
                </el-form-item>
                <el-form-item label="商品规格：" prop="standard" v-if="readOnly" class="custom-form-item">
                  {{form.standard}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="首次购进时间" prop="firstBuyTime" v-if="!readOnly">
                  <el-date-picker clearable size="small" class="form-item"
                                  v-model="form.firstBuyTime"
                                  type="datetime"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  :picker-options="pickOptions"
                                  placeholder="选择首次购进时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="首次购进时间：" prop="firstBuyTime" v-if="readOnly" class="custom-form-item">
                  {{form.firstBuyTime}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品条码" prop="barcode" v-if="!readOnly">
                  <el-input v-model="form.barcode" placeholder="请输入商品条码"/>
                </el-form-item>
                <el-form-item label="商品条码：" prop="barcode" v-if="readOnly" class="custom-form-item">
                  {{form.barcode}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="生产企业" prop="manufacturer" v-if="!readOnly">
                  <el-input v-model="form.manufacturer" placeholder="请输入生产企业"/>
                </el-form-item>
                <el-form-item label="生产企业：" prop="manufacturer" v-if="readOnly" class="custom-form-item">
                  {{form.manufacturer}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品产地" prop="productPlace" v-if="!readOnly">
                  <el-input v-model="form.productPlace" placeholder="请输入商品产地"/>
                </el-form-item>
                <el-form-item label="商品产地：" prop="productPlace" v-if="readOnly" class="custom-form-item">
                  {{form.productPlace}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="商品包装形式" prop="packageType" v-if="!readOnly">
                  <el-select v-model="form.packageType" placeholder="请选择商品包装形式" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsWrapTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="商品包装形式：" prop="packageType" v-if="readOnly" class="custom-form-item">
                  {{packageTypeFormat(form)}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="商品存储方式" prop="keepMethod" v-if="!readOnly">
                  <el-select v-model="form.keepMethod" placeholder="请选择商品存储方式" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsKeepMethodOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="商品存储方式：" prop="keepMethod" v-if="readOnly" class="custom-form-item">
                  {{keepMethodFormat(form)}}
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
          <el-button type="" @click="cancel">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import purchaseGoods from "./purchaseGoods";

  export default {
    ...purchaseGoods
  }
</script>
<style scoped>
  .form-item {
    width: 100%;
  }
</style>
