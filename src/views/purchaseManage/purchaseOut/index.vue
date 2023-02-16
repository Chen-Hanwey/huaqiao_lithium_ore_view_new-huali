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
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['inOutWareHouse:purchaseOut:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['inOutWareHouse:purchaseOut:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['inOutWareHouse:purchaseOut:remove']"
            >删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

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
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="purchaseOutList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="名称" align="left" prop="goodsName"  :render-header="renderHeader"/>
      <el-table-column label="单位" align="left" prop="goodsUnit" :formatter="goodsUnitFormat" :render-header="renderHeader"/>
      <el-table-column label="购进时间" align="left" prop="firstBuyTime" width="150"  :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.firstBuyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="left" prop="price"  :render-header="renderHeader"/>
      <el-table-column label="类型" align="left" prop="goodsType" :formatter="goodsTypeFormat"  :render-header="renderHeader"/>
      <el-table-column label="批号" align="left" prop="lotNumber" sortable :render-header="renderHeader"/>
      <el-table-column label="生产日期" align="left" prop="produceTime"  :render-header="renderHeader"/>
      <el-table-column label="有效期" align="left" prop="validTime" width="150" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <span>{{ scope.row.validTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="left" prop="mount"  :render-header="renderHeader"/>
      <el-table-column label="图片" align="left" prop="goodsPics" sortable :render-header="renderHeader">
        <template slot-scope="scope">
            <el-image
                style="width: 60px; height: 60px"
                :src="getUrl(scope.row.goodsPics)"
                >
            </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['inOutWareHouse:purchaseOut:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['inOutWareHouse:purchaseOut:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['inOutWareHouse:purchaseOut:remove']"
          >删除</el-button>
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

    <!-- 添加或修改出库商品对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="purchaseOut-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <div class="sub-project">
              <div class="sub-title">
                  <div class="sub-title-name">商品数据</div>
              </div>
              <div class="sub-body">
                  <el-row>
        <el-col :span="8">
            <el-form-item label="商品名称" prop="goodsName" v-if="!readOnly">
              <el-input v-model="form.goodsName" placeholder="请选择商品名称" :disabled="operationType1 == 2"  @click.native="clickProcurement"/>
            </el-form-item>
            <el-form-item label="商品名称：" prop="goodsName" v-if="readOnly" class="custom-form-item">
                {{form.goodsName}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
                <el-form-item label="计量单位" prop="goodsUnit" v-if="!readOnly">
                  <el-select v-model="form.goodsUnit" disabled placeholder="请选择计量单位" class="customSelect form-item">
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
            <el-form-item label="价格" prop="price" v-if="!readOnly">
              <el-input v-model="form.price" disabled placeholder="请输入商品规格" />
            </el-form-item>
            <el-form-item label="价格" prop="price" v-if="readOnly" class="custom-form-item">
                {{form.price}}
            </el-form-item>
        </el-col>
         <el-col :span="8">
                <el-form-item label="类型" prop="goodsType" v-if="!readOnly">
                  <el-select v-model="form.goodsType" disabled placeholder="请选择类型" class="customSelect form-item">
                    <el-option
                      v-for="dict in goodsTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="类型：" prop="goodsType" v-if="readOnly" class="custom-form-item">
                  {{goodsTypeFormat(form)}}
                </el-form-item>
              </el-col>
        <el-col :span="8">
            <el-form-item label="购进时间" prop="firstBuyTime" v-if="!readOnly">
              <el-date-picker clearable size="small" disabled class="form-item"
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
        <el-col :span="8">
            <el-form-item label="到期日期" prop="validTime" v-if="!readOnly">
              <el-date-picker clearable size="small" disabled class="form-item"
                v-model="form.validTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择到期日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="到期日期：" prop="validTime" v-if="readOnly" class="custom-form-item">
                {{form.validTime}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="批号" prop="lotNumber" v-if="!readOnly">
              <el-input v-model="form.lotNumber" disabled placeholder="请输入批号" />
            </el-form-item>
            <el-form-item label="批号：" prop="lotNumber" v-if="readOnly" class="custom-form-item">
                {{form.lotNumber}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="出库数量" prop="mount" v-if="!readOnly">
              <el-input v-model="form.mount" placeholder="请输入出库数量" />
            </el-form-item>
            <el-form-item label="出库数量：" prop="mount" v-if="readOnly" class="custom-form-item">
                {{form.mount}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="出库人" prop="outgoingPeople" v-if="!readOnly">
              <el-input v-model="form.outgoingPeople" placeholder="请输入出库人" />
            </el-form-item>
            <el-form-item label="出库人：" prop="outgoingPeople" v-if="readOnly" class="custom-form-item">
                {{form.outgoingPeople}}
            </el-form-item>
        </el-col>

        <el-col :span="8">
            <el-form-item label="领料人" prop="pickers" v-if="!readOnly">
              <el-input v-model="form.pickers" placeholder="请输入领料人" />
            </el-form-item>
            <el-form-item label="领料人：" prop="pickers" v-if="readOnly" class="custom-form-item">
                {{form.pickers}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="运营场所" prop="operationName" v-if="!readOnly">
              <el-input
                v-model="operationName"
                placeholder="请选择经营场所"
                clearable
                @click.native="openOperation" readonly >
              </el-input>
            </el-form-item>
            <el-form-item label="运营场所：" prop="distributeOperation" v-if="readOnly" class="custom-form-item">
                {{form.distributeOperationName}}
            </el-form-item>
        </el-col>

        <el-col :span="24">
            <el-form-item label="出库原因" prop="outgoingCause" v-if="!readOnly">
              <el-input v-model="form.outgoingCause" type="textarea" placeholder="请输入出库原因" />
            </el-form-item>
            <el-form-item label="出库原因：" prop="outgoingCause" v-if="readOnly" class="custom-form-item">
                {{form.outgoingCause}}
            </el-form-item>
        </el-col>
        <el-col :span="8" v-if="operationType1 == 3">
            <el-form-item label="商品图片：" prop="goodsPics" v-if="readOnly" class="custom-form-item">
                <el-image
                        style="width: 120px; height: 120px"
                        :src="getUrl(form.goodsPics)"
                        >
                    </el-image>
            </el-form-item>
        </el-col>
        <el-col :span="8" v-if="operationType1 == 3">
            <el-form-item label="商品二维码：" prop="productQrCode" v-if="readOnly" class="custom-form-item">
                <el-image
                        style="width: 120px; height: 120px"
                        :src="getUrl(form.productQrCode)"
                        >
                    </el-image>
            </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
            <el-form-item label="生产企业" prop="manufacturer" v-if="!readOnly">
              <el-input v-model="form.manufacturer" placeholder="请输入生产企业" />
            </el-form-item>
            <el-form-item label="生产企业：" prop="manufacturer" v-if="readOnly" class="custom-form-item">
                {{form.manufacturer}}
            </el-form-item>
        </el-col> -->
                  </el-row>
              </div>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <div v-if="operationType1 != 3">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
          </div>
          <div v-if="operationType1 == 3">
              <el-button type="" @click="cancel">关 闭</el-button>
          </div>
      </div>
    </el-dialog>
    <purchaseInventoryDialog ref="record_dialog" @callBack="callBack"></purchaseInventoryDialog>
    <OperationDialog  ref="operationDialog" @callBack="operationCallBack(arguments)"  :close-on-click-modal="false" append-to-body></OperationDialog>
  </div>
</template>

<script>
    import purchaseOut from "./purchaseOut";
    export default {
        ...purchaseOut
    }
</script>
<style scoped>
    .form-item{
        width: 100%;
    }
</style>
