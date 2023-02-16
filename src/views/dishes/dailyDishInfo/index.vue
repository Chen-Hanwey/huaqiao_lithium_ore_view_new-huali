<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
            <label class="condition-item-title">菜名</label>
            <el-form-item label="" prop="name" class="custom-el-form-item">
                <el-input
                    v-model="queryParams.name" class="query-param"
                    placeholder="请输入菜名"
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
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                       v-hasPermi="['dailyDishInfo:dailyDishInfo:add']">新增
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['dailyDishInfo:dailyDishInfo:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['dailyDishInfo:dailyDishInfo:remove']"
            >删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

        <div class="condition-item">
            <label class="condition-item-title">价格</label>
              <el-form-item label="" prop="price">
                <el-input
                  v-model="queryParams.price" class="query-param"
                  placeholder="请输入价格"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div>
        <div class="condition-item">
          <label class="condition-item-title">类型</label>
          <el-form-item label="" prop="type">
            <el-select  v-model="queryParams.type" placeholder="选择类型" size="small">
              <el-option
              v-for="dict in sampleTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
            </el-select>
          </el-form-item>
        </div>
        <!-- <div class="condition-item">
            <label class="condition-item-title">主要成分</label>
              <el-form-item label="" prop="makeup">
                <el-input
                  v-model="queryParams.makeup" class="query-param"
                  placeholder="请输入主要成分"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div> -->
        <!-- <div class="condition-item">
            <label class="condition-item-title">菜品图片</label>
              <el-form-item label="" prop="dishesImg">
                <el-input
                  v-model="queryParams.dishesImg" class="query-param"
                  placeholder="请输入菜品图片"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div> -->
        <!-- <div class="condition-item">
            <label class="condition-item-title">菜品管理id</label>
              <el-form-item label="" prop="dishesInfoId">
                <el-input
                  v-model="queryParams.dishesInfoId" class="query-param"
                  placeholder="请输入菜品管理id"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div> -->
        <!-- <div class="condition-item">
            <label class="condition-item-title">商品二维码</label>
              <el-form-item label="" prop="productQrCode">
                <el-input
                  v-model="queryParams.productQrCode" class="query-param"
                  placeholder="请输入商品二维码"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
        </div> -->
        <div class="condition-item">
          <label class="condition-item-title">餐次</label>
          <el-form-item label="" prop="mealType">
            <el-select  v-model="queryParams.mealType" placeholder="选择类型" size="small">
              <el-option
              v-for="dict in mealTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
            </el-select>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="DailyDishInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
          <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
      </el-table-column>
      <el-table-column label="菜名" align="left" prop="name" sortable :render-header="renderHeader"/>
      <el-table-column label="价格" align="left" prop="price" sortable :render-header="renderHeader"/>
      <el-table-column label="类型" align="left" prop="type" :formatter="sampleTypeFormat" sortable :render-header="renderHeader"/>
      <el-table-column label="主要成分" align="left" prop="makeup" sortable :render-header="renderHeader"/>
      <el-table-column label="菜品图片" align="left" prop="dishesImg" sortable :render-header="renderHeader">
        <template slot-scope="scope">
            <el-image 
                style="width: 60px; height: 60px"
                :src="getUrl(scope.row.dishesImg)" 
                >
            </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column label="菜品管理id" align="left" prop="dishesInfoId" sortable :render-header="renderHeader"/> -->
      <el-table-column label="菜品时间" align="left" prop="mealTime" sortable :render-header="renderHeader"/>
      <el-table-column label="餐次" align="left" prop="mealType" :formatter="mealTypeFormat" sortable :render-header="renderHeader"/>
      <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['dailyDishInfo:dailyDishInfo:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dailyDishInfo:dailyDishInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dailyDishInfo:dailyDishInfo:remove']"
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

    <!-- 添加或修改每日菜品对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="DailyDishInfo-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <div class="sub-project">
              <div class="sub-title">
                  <div class="sub-title-name">基本信息</div>
              </div>
              <div class="sub-body">
                  <el-row>
        <el-col :span="8">
            <el-form-item label="菜名" prop="name" v-if="!readOnly">
              <el-input v-model="form.name" placeholder="请选择菜名"  @click.native="clickProcurement"/>
            </el-form-item>
            <el-form-item label="菜名：" prop="name" v-if="readOnly" class="custom-form-item">
                {{form.name}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="菜品日期" prop="mealTime" v-if="!readOnly">
              <el-date-picker clearable size="small" class="form-item"
                v-model="form.mealTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择菜品日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="菜品日期：" prop="mealTime" v-if="readOnly" class="custom-form-item">
                {{form.mealTime}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="餐次" prop="mealType" v-if="!readOnly">
              <el-select v-model="form.mealType" placeholder="选择餐次" size="small">
                    <el-option
                    v-for="dict in mealTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                  </el-select>
            </el-form-item>
            <el-form-item label="餐次：" prop="mealType" v-if="readOnly" class="custom-form-item">
                {{mealTypeFormat(form)}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="所用食材" prop="goodsNames" v-if="!readOnly">
              <!-- <el-input v-model="form.goodsNames" placeholder="请选择商品食材"  @click.native="clickProcurement1"/> -->
              <el-select v-model="goodsIds" multiple placeholder="请选择所用食材" @click.native="clickProcurement1">
                <el-option
                  v-for="item in form.goodsNames"
                  :key="item.id"
                  :label="item.goodsName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所用食材：" prop="goodsNames" v-if="readOnly" class="custom-form-item">
                {{form.goodsNameString}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="价格" prop="price"  v-if="!readOnly">
              <el-input v-model="form.price" disabled placeholder="请输入价格" />
            </el-form-item>
            <el-form-item label="价格：" prop="price" v-if="readOnly" class="custom-form-item">
                {{form.price}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="类型" prop="type"  v-if="!readOnly">
              <el-select v-model="form.type" disabled placeholder="选择类型" size="small">
                    <el-option
                    v-for="dict in sampleTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                  </el-select>
            </el-form-item>
            <el-form-item label="类型：" prop="type" v-if="readOnly" class="custom-form-item">
                {{sampleTypeFormat(form)}}
            </el-form-item>
        </el-col>
        
        <el-col :span="24">
            <el-form-item label="主要成分" prop="makeup"  v-if="!readOnly">
              <el-input v-model="form.makeup" disabled placeholder="请输入主要成分" />
            </el-form-item>
            <el-form-item label="主要成分：" prop="makeup" v-if="readOnly" class="custom-form-item">
                {{form.makeup}}
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="描述" prop="remark"  v-if="!readOnly">
              <el-input v-model="form.remark" disabled placeholder="请输入描述" />
            </el-form-item>
            <el-form-item label="描述：" prop="remark" v-if="readOnly" class="custom-form-item">
                {{form.remark}}
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="菜品图片：" prop="inboundImagery" v-if="readOnly" class="custom-form-item">
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
        <el-col :span="24">
            <el-form-item label="二维码：" prop="productQrCode" v-if="readOnly" class="custom-form-item">
              <el-image v-if="form.productQrCode && form.productQrCode.length == 0"
                        style="min-width: 100px;min-height: 100px;margin-right: 15px">
                <div slot="error" class="image-slot" style="text-align: center">
                  <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
                    暂无图片</i>
                </div>
              </el-image>
              <el-image v-if="form.productQrCode && form.productQrCode.length > 0"
                        :src="getUrl1(form.productQrCode)"
                        style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
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
    <dishesInfoDialog ref="record_dialog" @callBack="callBack"></dishesInfoDialog>
    <purchaseLocationOutDialog ref="record_dialog1" @callBack1="callBack1"></purchaseLocationOutDialog>
  </div>
</template>

<script>
    import DailyDishInfo from "./dailyDishInfo";
    export default {
        ...DailyDishInfo
    }
</script>
<style scoped>
    .form-item{
        width: 100%;
    }
</style>
