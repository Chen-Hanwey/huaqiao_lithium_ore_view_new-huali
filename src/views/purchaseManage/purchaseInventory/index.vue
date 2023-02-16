<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
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

        <div class="btn-container">
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['purchaseInventory:purchaseInventory:add']">新增
            </el-button> -->
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['purchaseInventory:purchaseInventory:export']">导出
            </el-button>
            <!-- <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['purchaseInventory:purchaseInventory:remove']"
            >删除</el-button> -->
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">
    <div class="condition-item">
        <label class="condition-item-title">购进时间</label>
        <el-form-item label="" prop="firstBuyTime">
          <el-date-picker clearable size="small" style="width: 240px;"
            v-model="queryParams.firstBuyTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="选择购进时间">
          </el-date-picker>
        </el-form-item>
    </div>


        <div class="condition-item">
            <label class="condition-item-title">保质期</label>
              <el-form-item label="" prop="qualityDays">
                <el-input
                  v-model="queryParams.qualityDays" class="query-param"
                  placeholder="请输入保质期"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
        <div class="condition-item">
            <label class="condition-item-title">商品产地</label>
              <el-form-item label="" prop="productPlace">
                <el-input
                  v-model="queryParams.productPlace" class="query-param"
                  placeholder="请输入商品产地"
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
              <el-option label="请选择字典生成" value="" />
            </el-select>
          </el-form-item>
        </div>


        <div class="condition-item">
            <label class="condition-item-title">供货商id</label>
              <el-form-item label="" prop="supplierId">
                <el-input
                  v-model="queryParams.supplierId" class="query-param"
                  placeholder="请输入供货商id"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>

    <div class="condition-item">
        <label class="condition-item-title">生产日期</label>
        <el-form-item label="" prop="produceTime">
          <el-date-picker clearable size="small" style="width: 240px;"
            v-model="queryParams.produceTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="选择生产日期">
          </el-date-picker>
        </el-form-item>
    </div>


        <div class="condition-item">
            <label class="condition-item-title">批号</label>
              <el-form-item label="" prop="lotNumber">
                <el-input
                  v-model="queryParams.lotNumber" class="query-param"
                  placeholder="请输入批号"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>

        <div class="condition-item">
            <label class="condition-item-title">商品标识</label>
              <el-form-item label="" prop="productIdentification">
                <el-input
                  v-model="queryParams.productIdentification" class="query-param"
                  placeholder="请输入商品标识"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
    <div class="condition-item">
        <label class="condition-item-title">过期时间</label>
        <el-form-item label="" prop="expirationTime">
          <el-date-picker clearable size="small" style="width: 240px;"
            v-model="queryParams.expirationTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="选择过期时间">
          </el-date-picker>
        </el-form-item>
    </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="purchaseInventoryList"> <!-- @selection-change="handleSelectionChange"  @row-dblclick="handleDoubleClick"-->
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="名称" align="left" prop="goodsName" sortable :render-header="renderHeader"/>
      <!-- <el-table-column label="商品规格" align="left" prop="standard" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="购进时间" align="left" prop="firstBuyTime" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.firstBuyTime }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="商品条码" align="left" prop="barcode" sortable :render-header="renderHeader"/> -->
      <el-table-column label="单位" align="left" prop="goodsUnit" sortable :formatter="goodsUnitFormat" :render-header="renderHeader"/>
      <!-- <el-table-column label="保质期" align="left" prop="qualityDays" sortable :render-header="renderHeader"/> -->
      <el-table-column label="价格" align="left" prop="price" sortable :render-header="renderHeader"/>
      <el-table-column label="批号" align="left" prop="lotNumber" sortable :render-header="renderHeader"/>
      <!-- <el-table-column label="生产企业" align="left" prop="manufacturer" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="商品产地" align="left" prop="productPlace" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="是否进口" align="left" prop="inlet" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="商品包装形式" align="left" prop="packageType" sortable :render-header="renderHeader"/> -->
      <el-table-column label="类型" align="left" prop="goodsType" sortable :formatter="goodsTypeFormat"  :render-header="renderHeader"/>
      <!-- <el-table-column label="商品存储方式" align="left" prop="keepMethod" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="关联企业" align="left" prop="enterpriseId" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="关联商户" align="left" prop="merchantId" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="供货商id" align="left" prop="supplierId" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="采购记录id" align="left" prop="purchaseRecordId" sortable :render-header="renderHeader"/> -->
<!--      <el-table-column label="生产日期" align="left" prop="produceTime" width="150" sortable :render-header="renderHeader">-->
      <el-table-column label="购进时间" align="left" prop="firstBuyTime" width="150" sortable :render-header="renderHeader">

      </el-table-column>
      <!-- <el-table-column label="批号" align="left" prop="batchNum" sortable :render-header="renderHeader"/> -->
      <el-table-column label="商品条码" align="left" prop="barcode" width="150" sortable :render-header="renderHeader">
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.validTime }}</span>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="数量" align="left" prop="mount" sortable :render-header="renderHeader"/>
      <el-table-column label="商品类型" align="left" prop="goodsType" :formatter="goodsTypeFormat" sortable :render-header="renderHeader"/>
<!--      <el-table-column label="图片" align="left" prop="goodsPics" sortable :render-header="renderHeader">-->
<!--        <template slot-scope="scope">-->
<!--                    <el-image-->
<!--                        style="width: 60px; height: 60px"-->
<!--                        :src="getUrl(scope.row.goodsPics)"-->
<!--                        >-->
<!--                    </el-image>-->
<!--                </template>-->
<!--      </el-table-column>-->
      <!-- <el-table-column label="种植户/养殖户" align="left" prop="grower" sortable :render-header="renderHeader"/>
    <el-table-column label="种植时间" align="left" prop="cropDate" width="100" sortable :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.cropDate }}</span>
      </template>
    </el-table-column>
    <el-table-column label="农药喷洒时间" align="left" prop="sprayDate" width="100" sortable :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.sprayDate }}</span>
      </template>
    </el-table-column>
      <el-table-column label="农药喷洒次数" align="left" prop="sprayNum" sortable :render-header="renderHeader"/>
    <el-table-column label="收割时间" align="left" prop="reapDate" width="100" sortable :render-header="renderHeader">
      <template slot-scope="scope">
        <span>{{ scope.row.reapDate }}</span>
      </template>
    </el-table-column> -->
      <!-- <el-table-column label="批号" align="left" prop="lotNumber" sortable :render-header="renderHeader"/> -->
      <!-- <el-table-column label="商品二维码" align="left" prop="productQrCode" sortable :render-header="renderHeader"/> -->
      <el-table-column label="批号" align="left" prop="lotNumber" sortable :render-header="renderHeader"/>
      <el-table-column label="标识" align="left" prop="productIdentification" sortable :render-header="renderHeader"/>
<!--      <el-table-column label="过期时间" align="left" prop="expirationTime" width="150" sortable :render-header="renderHeader">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.expirationTime }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['purchaseInventory:purchaseInventory:query']"
          >详情</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['purchaseInventory:purchaseInventory:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['purchaseInventory:purchaseInventory:remove']"
          >删除</el-button> -->
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

    <!-- 添加或修改库存对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="purchaseInventory-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <div class="sub-project">
              <div class="sub-title">
                  <div class="sub-title-name">基本信息</div>
              </div>
              <div class="sub-body">
                  <el-row>
        <el-col :span="8">
            <el-form-item label="商品名称" prop="goodsName" v-if="!readOnly">
              <el-input v-model="form.goodsName" placeholder="请输入商品名称" />
            </el-form-item>
            <el-form-item label="商品名称：" prop="goodsName" v-if="readOnly" class="custom-form-item">
                {{form.goodsName}}
            </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
            <el-form-item label="商品规格" prop="standard" v-if="!readOnly">
              <el-input v-model="form.standard" placeholder="请输入商品规格" />
            </el-form-item>
            <el-form-item label="商品规格：" prop="standard" v-if="readOnly" class="custom-form-item">
                {{form.standard}}
            </el-form-item>
        </el-col> -->
        <el-col :span="8">
            <el-form-item label="购进时间" prop="firstBuyTime" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.firstBuyTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择购进时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="购进时间：" prop="firstBuyTime" v-if="readOnly" class="custom-form-item">
                {{form.firstBuyTime}}
            </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
            <el-form-item label="商品条码" prop="barcode" v-if="!readOnly">
              <el-input v-model="form.barcode" placeholder="请输入商品条码" />
            </el-form-item>
            <el-form-item label="商品条码：" prop="barcode" v-if="readOnly" class="custom-form-item">
                {{form.barcode}}
            </el-form-item>
        </el-col> -->
        <el-col :span="8">
            <el-form-item label="商品单位" prop="goodsUnit" v-if="!readOnly">
              <el-input v-model="form.goodsUnit" placeholder="请输入商品单位" />
            </el-form-item>
            <el-form-item label="商品单位：" prop="goodsUnit" v-if="readOnly" class="custom-form-item">
                {{goodsUnitFormat(form,null)}}
            </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
            <el-form-item label="保质期" prop="qualityDays" v-if="!readOnly">
              <el-input v-model="form.qualityDays" placeholder="请输入保质期" />
            </el-form-item>
            <el-form-item label="保质期：" prop="qualityDays" v-if="readOnly" class="custom-form-item">
                {{form.qualityDays}}
            </el-form-item>
        </el-col> -->
        <el-col :span="8">
            <el-form-item label="采购价格" prop="price" v-if="!readOnly">
              <el-input v-model="form.price" placeholder="请输入采购价格" />
            </el-form-item>
            <el-form-item label="采购价格：" prop="price" v-if="readOnly" class="custom-form-item">
                {{form.price}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="生产企业" prop="manufacturer" v-if="!readOnly">
              <el-input v-model="form.manufacturer" placeholder="请输入生产企业" />
            </el-form-item>
            <el-form-item label="生产企业：" prop="manufacturer" v-if="readOnly" class="custom-form-item">
                {{form.manufacturer}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="商品产地" prop="productPlace" v-if="!readOnly">
              <el-input v-model="form.productPlace" placeholder="请输入商品产地" />
            </el-form-item>
            <el-form-item label="商品产地：" prop="productPlace" v-if="readOnly" class="custom-form-item">
                {{form.productPlace}}
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
            <el-form-item label="商品包装形式" prop="packageType" v-if="!readOnly">
              <el-select v-model="form.packageType" placeholder="请选择商品包装形式" class="customSelect form-item">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>
            <el-form-item label="商品包装形式：" prop="packageType" v-if="readOnly" class="custom-form-item">
                <!--{{packageTypeFormat(form)}}-->
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="商品类型" prop="goodsType" v-if="!readOnly">
              <el-select v-model="form.goodsType" placeholder="请选择商品类型" class="customSelect form-item">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </el-form-item>
            <el-form-item label="商品类型：" prop="goodsType" v-if="readOnly" class="custom-form-item">
                {{goodsTypeFormat(form)}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="商品存储方式" prop="keepMethod" v-if="!readOnly">
              <el-input v-model="form.keepMethod" placeholder="请输入商品存储方式" />
            </el-form-item>
            <el-form-item label="商品存储方式：" prop="keepMethod" v-if="readOnly" class="custom-form-item">
                {{form.keepMethod}}
            </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
            <el-form-item label="关联企业" prop="enterpriseId" v-if="!readOnly">
              <el-input v-model="form.enterpriseId" placeholder="请输入关联企业" />
            </el-form-item>
            <el-form-item label="关联企业：" prop="enterpriseId" v-if="readOnly" class="custom-form-item">
                {{form.enterpriseId}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="关联商户" prop="merchantId" v-if="!readOnly">
              <el-input v-model="form.merchantId" placeholder="请输入关联商户" />
            </el-form-item>
            <el-form-item label="关联商户：" prop="merchantId" v-if="readOnly" class="custom-form-item">
                {{form.merchantId}}
            </el-form-item>
        </el-col> -->
        <!-- <el-col :span="8">
            <el-form-item label="删除状态，0正常，1删除" prop="delFlag" v-if="!readOnly">
              <el-input v-model="form.delFlag" placeholder="请输入删除状态，0正常，1删除" />
            </el-form-item>
            <el-form-item label="删除状态，0正常，1删除：" prop="delFlag" v-if="readOnly" class="custom-form-item">
                {{form.delFlag}}
            </el-form-item>
        </el-col> -->
        <el-col :span="8">
            <el-form-item label="供货商id" prop="supplierId" v-if="!readOnly">
              <el-input v-model="form.supplierId" placeholder="请输入供货商id" />
            </el-form-item>
            <el-form-item label="供货商id：" prop="supplierId" v-if="readOnly" class="custom-form-item">
                {{form.supplierId}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="采购记录id" prop="purchaseRecordId" v-if="!readOnly">
              <el-input v-model="form.purchaseRecordId" placeholder="请输入采购记录id" />
            </el-form-item>
            <el-form-item label="采购记录id：" prop="purchaseRecordId" v-if="readOnly" class="custom-form-item">
                {{form.purchaseRecordId}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="生产日期" prop="produceTime" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.produceTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择生产日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="生产日期：" prop="produceTime" v-if="readOnly" class="custom-form-item">
                {{form.produceTime}}
            </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
            <el-form-item label="批号" prop="batchNum" v-if="!readOnly">
              <el-input v-model="form.batchNum" placeholder="请输入批号" />
            </el-form-item>
            <el-form-item label="批号：" prop="batchNum" v-if="readOnly" class="custom-form-item">
                {{form.batchNum}}
            </el-form-item>
        </el-col> -->
        <!-- <el-col :span="8">
            <el-form-item label="有效期至" prop="validTime" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.validTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择有效期至">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期至：" prop="validTime" v-if="readOnly" class="custom-form-item">
                {{form.validTime}}
            </el-form-item>
        </el-col> -->
        <el-col :span="8">
            <el-form-item label="采购数量" prop="mount" v-if="!readOnly">
              <el-input v-model="form.mount" placeholder="请输入采购数量" />
            </el-form-item>
            <el-form-item label="采购数量：" prop="mount" v-if="readOnly" class="custom-form-item">
                {{form.mount}}
            </el-form-item>
        </el-col>
<!--        <el-col :span="8">-->
<!--            <el-form-item label="商品照片" prop="goodsPics" v-if="!readOnly">-->
<!--              <el-input v-model="form.goodsPics" placeholder="请输入商品照片" />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="商品照片：" prop="goodsPics" v-if="readOnly" class="custom-form-item">-->
<!--                <el-image-->
<!--                        style="width: 60px; height: 60px"-->
<!--                        :src="getUrl(form.goodsPics)"-->
<!--                        >-->
<!--                    </el-image>-->
<!--            </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="8">
            <el-form-item label="种植户/养殖户" prop="grower" v-if="!readOnly">
              <el-input v-model="form.grower" placeholder="请输入种植户/养殖户" />
            </el-form-item>
            <el-form-item label="种植户/养殖户：" prop="grower" v-if="readOnly" class="custom-form-item">
                {{form.grower}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="种植时间" prop="cropDate" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.cropDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择种植时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="种植时间：" prop="cropDate" v-if="readOnly" class="custom-form-item">
                {{form.cropDate}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="农药喷洒时间" prop="sprayDate" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.sprayDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择农药喷洒时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="农药喷洒时间：" prop="sprayDate" v-if="readOnly" class="custom-form-item">
                {{form.sprayDate}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="农药喷洒次数" prop="sprayNum" v-if="!readOnly">
              <el-input v-model="form.sprayNum" placeholder="请输入农药喷洒次数" />
            </el-form-item>
            <el-form-item label="农药喷洒次数：" prop="sprayNum" v-if="readOnly" class="custom-form-item">
                {{form.sprayNum}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="收割时间" prop="reapDate" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.reapDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择收割时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="收割时间：" prop="reapDate" v-if="readOnly" class="custom-form-item">
                {{form.reapDate}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="批号" prop="lotNumber" v-if="!readOnly">
              <el-input v-model="form.lotNumber" placeholder="请输入批号" />
            </el-form-item>
            <el-form-item label="批号：" prop="lotNumber" v-if="readOnly" class="custom-form-item">
                {{form.lotNumber}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="商品二维码" prop="productQrCode" v-if="!readOnly">
              <el-input v-model="form.productQrCode" placeholder="请输入商品二维码" />
            </el-form-item>
            <el-form-item label="商品二维码：" prop="productQrCode" v-if="readOnly" class="custom-form-item">
                <el-image
                        style="width: 60px; height: 60px"
                        :src="getUrl(form.productQrCode)"
                        >
                    </el-image>
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="商品标识" prop="productIdentification" v-if="!readOnly">
              <el-input v-model="form.productIdentification" placeholder="请输入商品标识" />
            </el-form-item>
            <el-form-item label="商品标识：" prop="productIdentification" v-if="readOnly" class="custom-form-item">
                {{form.productIdentification}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="过期时间" prop="expirationTime" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.expirationTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择过期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="过期时间：" prop="expirationTime" v-if="readOnly" class="custom-form-item">
                {{form.expirationTime}}
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
    import purchaseInventory from "./purchaseInventory";
    export default {
        ...purchaseInventory
    }
</script>
<style scoped>
    .form-item{
        width: 100%;
    }
</style>
