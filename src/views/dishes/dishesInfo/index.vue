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
                       v-hasPermi="['dishesInfo:dishesInfo:add']">新增
            </el-button>
            <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport"
                       v-hasPermi="['dishesInfo:dishesInfo:export']">导出
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['dishesInfo:dishesInfo:remove']"
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
      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick"
              :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
              :data="DishesInfoList" @selection-change="handleSelectionChange">
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
      <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleView(scope.row)"
            v-hasPermi="['dishesInfo:dishesInfo:query']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dishesInfo:dishesInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dishesInfo:dishesInfo:remove']"
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

    <!-- 添加或修改菜品管理对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="DishesInfo-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <div class="sub-project">
              <div class="sub-title">
                  <div class="sub-title-name">基本信息</div>
              </div>
              <div class="sub-body">
                  <el-row>
        <el-col :span="8">
            <el-form-item label="菜名" prop="name" v-if="!readOnly">
              <el-input v-model="form.name" placeholder="请输入菜名" />
            </el-form-item>
            <el-form-item label="菜名：" prop="name" v-if="readOnly" class="custom-form-item">
                {{form.name}}
            </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="价格/元" prop="price" v-if="!readOnly">
              <el-input v-model="form.price" placeholder="请输入价格" />
            </el-form-item>
            <el-form-item label="价格：" prop="price" v-if="readOnly" class="custom-form-item">
                {{form.price}}
            </el-form-item>
        </el-col>
        <el-col :span="8">

            <el-form-item label="类型" prop="type" v-if="!readOnly">
              <el-select v-model="form.type" placeholder="选择类型" size="small">
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
            <el-form-item label="主要成分" prop="makeup" v-if="!readOnly">
              <el-input type="textarea" v-model="form.makeup" placeholder="请输入主要成分" />
            </el-form-item>
            <el-form-item label="主要成分：" prop="makeup" v-if="readOnly" class="custom-form-item">
                {{form.makeup}}
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="描述" prop="remark" v-if="!readOnly">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入描述" />
            </el-form-item>
            <el-form-item label="描述：" prop="remark" v-if="readOnly" class="custom-form-item">
                {{form.remark}}
            </el-form-item>
        </el-col>
        <el-col :span="24">
            <el-form-item label="菜品图片" prop="dishesImg" v-if="!readOnly">
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
    import DishesInfo from "./dishesInfo";
    export default {
        ...DishesInfo
    }
</script>
<style scoped>
    .form-item{
        width: 100%;
    }
</style>
