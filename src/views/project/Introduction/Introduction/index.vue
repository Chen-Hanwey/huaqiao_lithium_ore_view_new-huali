<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
      <div class="con-container">
        <div class="lab-container">
          <label class="condition-item-title">企业名称</label>
          <el-form-item label="" prop="name" class="custom-el-form-item">
            <el-input v-model="queryParams.name" class="query-param" placeholder="请输入企业名称" clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
        </div>

        <div class="btn-container">
          <el-form-item>
            <!-- <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">高级查询
            </el-button> -->
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <!--<el-button v-if="IntroductionList.length ===0" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['Introduction:Introduction:add']">新增
            </el-button>-->
            <el-button type="warning" icon="el-icon-download" plain size="mini" @click="handleExport" v-hasPermi="['Introduction:Introduction:export']">导出
            </el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['Introduction:Introduction:remove']">删除</el-button>
          </el-form-item>
        </div>
      </div>

      <div class="toggle-container" ref="toggle-container" style="display: none;">

      </div>
    </el-form>

    <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe @row-dblclick="handleDoubleClick" :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="IntroductionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="60" align="left">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业名称" align="left" prop="name" sortable :render-header="renderHeader" />
      <el-table-column label="企业简介" align="left" prop="introduction" sortable :render-header="renderHeader" />
      <el-table-column label="宣传图片" align="left" prop="businessLicensePicture" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          <el-avatar @click="handleView(scope.row)" shape="square" size="large" :src="getPicUrl(scope.row.businessLicensePicture)"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="企业介绍视频" align="left" prop="video" sortable :render-header="renderHeader">
        <template slot-scope="scope">
          请在详情查看视频
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['Introduction:Introduction:query']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['Introduction:Introduction:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['Introduction:Introduction:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改企业基本信息对话框 -->
    <el-dialog :visible.sync="open"  :close-on-click-modal="false" class="_baseForm_big" >
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="Introduction-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="企业名称" prop="name" v-if="!readOnly">
                  <el-input v-model="form.name" placeholder="请输入企业名称" />
                </el-form-item>
                <el-form-item label="企业名称：" prop="name" v-if="readOnly" class="custom-form-item">
                  {{form.name}}
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="企业面积(㎡)" prop="area" v-if="!readOnly">
                  <el-input v-model="form.area" placeholder="请输入企业面积" />
                </el-form-item>
                <el-form-item label="企业面积(㎡):" prop="area" v-if="readOnly" class="custom-form-item">
                  {{form.area}}
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="企业简介" prop="introduction" v-if="!readOnly">
                  <el-input v-model="form.introduction" type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="企业简介：" prop="introduction" v-if="readOnly" class="custom-form-item">
                  <el-input v-model="form.introduction" type="textarea" :autosize="true" placeholder="" :readonly="readOnly" resize="none" class="custom-textarea custom-form-item" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
                <el-form-item label="企业介绍图片" prop="businessLicensePicture" v-if="!readOnly">
                  <el-input v-model="form.businessLicensePicture" type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="企业介绍图片：" prop="businessLicensePicture" v-if="readOnly" class="custom-form-item">
                  <el-input v-model="form.businessLicensePicture" type="textarea" :autosize="true" placeholder="" :readonly="readOnly" resize="none" class="custom-textarea custom-form-item" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="企业介绍视频" prop="video" v-if="!readOnly">
                  <el-input v-model="form.video" type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="企业介绍视频：" prop="video" v-if="readOnly" class="custom-form-item">
                  <el-input v-model="form.video" type="textarea" :autosize="true" placeholder="" :readonly="readOnly" resize="none" class="custom-textarea custom-form-item" />
                </el-form-item>
              </el-col> -->

              <el-col :span="24">
                <el-form-item label="宣传图片" prop="businessLicensePicture" v-if="!readOnly">
                  <el-upload :action="uploadPic.uploadImgUrl" list-type="picture-card" :file-list="uploadPic.pictureFileList1" :on-success="businessLicensePictureUpSuccess" :on-remove="businessLicensePictureRemove" :on-preview="handlePictureCardPreview" :on-error="picUploadErr" :on-progress="picUpProcess" :headers="uploadPic.uploadHeader" :before-upload="beforePicUpload" accept=".png,.jpg,.jpeg,.svg">
                    <i class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg/svg文件，且不超过20M</div>
                  </el-upload>
                </el-form-item>

                <el-form-item label="宣传图片：" prop="picture" v-if="readOnly" class="custom-form-item">
                  <!-- <el-image v-if="uploadPic.pictureList1&&uploadPic.pictureList1.length==0" style="min-width: 100px;min-height: 100px;margin-right: 15px">
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
                        暂无图片</i>
                    </div>
                  </el-image>
                  <el-image v-if="uploadPic.pictureList1&&uploadPic.pictureList1.length > 0" v-for="(url,index) in uploadPic.pictureList1" :key="url" :src="url" style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down" @click="getCurrentPreviewImg(url)">
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                        加载失败</i>
                    </div>
                    <div slot="placeholder" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                        加载中</i>
                    </div>
                  </el-image>  -->

                  <el-carousel :interval="4000" width="50%">
                    <el-carousel-item v-for="item in uploadPic.pictureList1" :key="item">
                      <el-image :src="item"></el-image>
                    </el-carousel-item>
                  </el-carousel>

                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="宣传视频" prop="video" style="width:90%;" v-if="operationType != 3">
                  <el-upload class="upload-demo" :action="uploadPic.uploadFile" :on-success="handleSuccess" :on-remove="handleRemove" :before-remove="beforeRemove" :headers="uploadPic.uploadHeader" accept=".mp4,.3gp" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList3">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传MP4、3GP文件，且不超过50M</div>
                  </el-upload>
                </el-form-item>

                <br>
                <br>
                <br>
                <el-form-item label="宣传视频:" prop="video" style="width:90%;" v-if="operationType == 3">
                  <!-- {{getUrl(form.video)}} -->
                  <video v-if="getUrl(form.video) !== ''" width="50%" height="240" controls controlslist="nodownload" preload="none" autoplay="autoplay" :src="getUrl(form.video)">>
                    <!-- <source :src="this.$route.query.src" type="video/mp4"> -->
                  </video>
                  <p v-if="getUrl(form.video) == ''">暂无视频</p>
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
import Introduction from "./Introduction";
export default {
  ...Introduction
}
</script>
<style scoped>
.form-item {
  width: 100%;
}
</style>
