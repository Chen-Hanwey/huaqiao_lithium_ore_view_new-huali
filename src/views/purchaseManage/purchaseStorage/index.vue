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
            <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['inOutWarehouse:purchaseStorage:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['inOutWarehouse:purchaseStorage:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['inOutWarehouse:purchaseStorage:remove']"
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
              :data="purchaseStorageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="商品名称" align="left" prop="goodsName"  :render-header="renderHeader"/>
      <!-- <el-table-column label="商品规格" align="left" prop="standard"  :render-header="renderHeader"/> -->
      <el-table-column label="购进时间" align="left" prop="firstBuyTime"  :render-header="renderHeader">
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.firstBuyTime }}</span>-->
<!--        </template>-->
      </el-table-column>
      <!-- <el-table-column label="商品条码" align="left" prop="barcode"  :render-header="renderHeader"/> -->
      <el-table-column label="商品单位" align="left" prop="goodsUnit" :formatter="goodsUnitFormat"  :render-header="renderHeader"/>
      <el-table-column label="到期时间" align="left" prop="expirationTime"  :render-header="renderHeader"/>
      <el-table-column label="采购价格" align="left" prop="price"  :render-header="renderHeader"/>
      <el-table-column label="数量" align="left" prop="mount"  :render-header="renderHeader"/>
      <el-table-column label="批号" align="left" prop="lotNumber"  :render-header="renderHeader"/>
      <!-- <el-table-column label="生产企业" align="left" prop="manufacturer"  :render-header="renderHeader"/> -->
      <!-- <el-table-column label="商品产地" align="left" prop="productPlace"  :render-header="renderHeader"/> -->
      <el-table-column label="商品类型" align="left" prop="goodsType" :formatter="goodsTypeFormat"  :render-header="renderHeader"/>
      <el-table-column label="关联企业" align="left" prop="enterpriseName"  :render-header="renderHeader"/>
      <!-- <el-table-column label="关联商户" align="left" prop="operationName"  :render-header="renderHeader"/> -->
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['inOutWarehouse:purchaseStorage:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['inOutWarehouse:purchaseStorage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['inOutWarehouse:purchaseStorage:remove']"
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

    <!-- 添加或修改入库商品对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="purchaseStorage-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <div class="sub-project">
              <div class="sub-title">
                  <div class="sub-title-name">基本信息</div>
              </div>
              <div class="sub-body">
                  <el-row>
        <el-col :span="24">
            <el-form-item label="选择采购" prop="orderNum" v-if="!readOnly && operationType == 1">
              <el-input v-model="form.orderNum" placeholder="请输入采购" @click.native="clickProcurement"/>
            </el-form-item>
            <el-form-item label="采购单号" prop="orderNum" v-else>
              {{form.orderNum}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="申请人：" prop="applicant"  class="custom-form-item">
                {{form.applicant}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="申请时间：" prop="applicationTime"  class="custom-form-item">
                {{form.applicationTime}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="采购人：" prop="purchaser"  class="custom-form-item">
                {{form.purchaser}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="采购时间：" prop="purchaserTime"  class="custom-form-item">
                {{form.purchaserTime}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="购进时间：" prop="purchaseTime"  class="custom-form-item">
                {{form.purchaserTime}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="供应商：" prop="supplierName"  class="custom-form-item">
                {{form.supplierName}}
            </el-form-item>
        </el-col>

                  </el-row>
              </div>
          </div>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">入库信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="入库人" prop="warehouseKeeper" v-if="!readOnly">
                   <el-input v-model="form.warehouseKeeper" placeholder="请输入入库人"/>
                </el-form-item>
                <el-form-item label="入库人：" prop="warehouseKeeper" v-if="readOnly" class="custom-form-item">
                  {{form.warehouseKeeper}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="入库凭证" prop="inboundImagery" v-if="!readOnly">
                        <el-upload :action="uploadPic.uploadImgUrl"
                                  list-type="picture-card"
                                  :file-list="uploadPic.pictureFileList1"
                                  :on-success="exercisePicUpSuccess"
                                  :on-remove="exercisePicRemove"
                                  :on-preview="handlePictureCardPreview"
                                  :on-error="picUploadErr"
                                  :on-progress="picUpProcess"
                                  :headers="uploadPic.uploadHeader"
                                  :before-upload="beforePicUpload"
                                  accept=".png,.jpg,.jpeg,.svg"
                        >
                          <i class="el-icon-plus"></i>
                          <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg/svg文件，且不超过20M</div>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="入库凭证：" prop="inboundImagery" v-if="readOnly" class="custom-form-item">
                  <el-image v-if="uploadPic.pictureFileList1&&uploadPic.pictureFileList1.length==0"
                            style="min-width: 100px;min-height: 100px;margin-right: 15px">
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
                        暂无图片</i>
                    </div>
                  </el-image>
                  <el-image v-if="uploadPic.pictureFileList1&&uploadPic.pictureFileList1.length > 0"
                            v-for="(url,index) in uploadPic.pictureFileList1" :key="url.uid" :src="url.url"
                            style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                            @click="getCurrentPreviewImg(url.url)"
                  >
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                        加载失败</i>
                    </div>
                    <div slot="placeholder" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                        加载中</i>
                    </div>
                  </el-image>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
         </div>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">商品</div>
          </div>
          <div class="sub-body">
            <el-table ref="goodsTable"  stripe  :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="goodsList" default-expand-all>
              <el-table-column label="序号" type="index" width="60" align="left">
                <template slot-scope="scope">
                  <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" align="left" prop="goodsName" sortable :render-header="renderHeader" min-width="100">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.goodsName" filterable allow-create
                             placeholder="选择或新建商品" size="small">
                    <el-option
                      v-for="dict in goodsListRest"
                      :key="dict.id"
                      :label="dict.goodsName"
                      :value="dict.goodsName"
                    />
                  </el-select>
                  <span v-if="!scope.row.editable">{{scope.row.goodsName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="计量单位" align="left" prop="goodsUnit" sortable :formatter="goodsUnitFormat" :render-header="renderHeader" width="120">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.goodsUnit" placeholder="选择计量单位" size="small">
                    <el-option
                      v-for="dict in goodsUnitOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
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
                    <el-option
                      v-for="dict in goodsTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                  <span v-if="!scope.row.editable">{{goodsTypeFormat(scope.row)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="是否进口" align="left" prop="inlet" sortable :render-header="renderHeader" width="120">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.editable" v-model="scope.row.inlet" placeholder="选择是否进口" size="small">
                    <el-option :key="0" label="否"  :value="'0'"  />
                    <el-option :key="1" label="是"  :value="'1'"  />
                  </el-select>
                  <span v-if="!scope.row.editable">{{scope.row.inlet=='1'?'是':'否'}}</span>
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

    <purchaseRecordDialog :purchased="3" :inspectionStatus="'1'" ref="record_dialog" @callBack="callBack"></purchaseRecordDialog>
    <!-- <purchaseRecordDialog @callBack="handleStorage" ref="record_dialog"></purchaseRecordDialog> -->
  </div>
</template>

<script>
    import purchaseStorage from "./purchaseStorage";
    export default {
        ...purchaseStorage
    }
</script>
<style scoped>
    .form-item{
        width: 100%;
    }
</style>
