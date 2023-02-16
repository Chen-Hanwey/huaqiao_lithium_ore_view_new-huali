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
                       v-hasPermi="['inOutWarehouse:purchaseLocationStorage:add']">新增
            </el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['inOutWarehouse:purchaseLocationStorage:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['inOutWarehouse:purchaseLocationStorage:remove']"
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
      <el-table-column label="关联商户" align="left" prop="operationName"  :render-header="renderHeader"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['inOutWarehouse:purchaseLocationStorage:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['inOutWarehouse:purchaseLocationStorage:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['inOutWarehouse:purchaseLocationStorage:remove']"
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
        <el-col :span="8">
            <el-form-item label="商品名称" prop="goodsName" v-if="!readOnly">
              <el-input v-model="form.goodsName" placeholder="请选择商品名称" :disabled="operationType == 2"  @click.native="clickProcurement"/>
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
              <el-input v-model="form.mount" disabled placeholder="请输入出库数量" />
            </el-form-item>
            <el-form-item label="出库数量：" prop="mount" v-if="readOnly" class="custom-form-item">
                {{form.mount}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="出库人" prop="outgoingPeople" v-if="!readOnly">
              <el-input v-model="form.outgoingPeople" disabled placeholder="请输入出库人" />
            </el-form-item>
            <el-form-item label="出库人：" prop="outgoingPeople" v-if="readOnly" class="custom-form-item">
                {{form.outgoingPeople}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="出库时间" prop="outgoingTime" v-if="!readOnly">
              <el-input v-model="form.outgoingTime" disabled placeholder="请输入出库时间" />
            </el-form-item>
            <el-form-item label="出库时间：" prop="outgoingTime" v-if="readOnly" class="custom-form-item">
                {{form.outgoingTime}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="领料人" prop="pickers" v-if="!readOnly">
              <el-input v-model="form.pickers" disabled placeholder="请输入领料人" />
            </el-form-item>
            <el-form-item label="领料人：" prop="pickers" v-if="readOnly" class="custom-form-item">
                {{form.pickers}}
            </el-form-item>
        </el-col>
        
        <el-col :span="24">
            <el-form-item label="出库原因" prop="outgoingCause" v-if="!readOnly">
              <el-input v-model="form.outgoingCause" disabled type="textarea" placeholder="请输入出库原因" />
            </el-form-item>
            <el-form-item label="出库原因：" prop="outgoingCause" v-if="readOnly" class="custom-form-item">
                {{form.outgoingCause}}
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
        <!-- <div class="sub-project">
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
        </div> -->
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

    <purchaseOutDialog :inspectionStatus="'1'" ref="record_dialog" @callBack="callBack"></purchaseOutDialog>
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
