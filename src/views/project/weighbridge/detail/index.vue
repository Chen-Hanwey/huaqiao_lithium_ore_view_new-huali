<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
            <div class="con-container">
                <div class="lab-container">
                    <label class="condition-item-title">过毛时间</label>
                    <el-form-item label="" prop="grossTime" class="custom-el-form-item">
                        <!-- <el-input v-model="queryParams.grossTime" class="query-param" placeholder="请输入过毛时间" clearable
                            size="small" @keyup.enter.native="handleQuery" /> -->
                        <el-date-picker value-format="timestamp" type="date" placeholder="选择日期" v-model="queryParams.grossTime"
                            style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="lab-container">
                    <label class="condition-item-title">过皮时间</label>
                    <el-form-item label="" prop="tareTime" class="custom-el-form-item">
                        <!-- <el-input v-model="queryParams.tareTime" class="query-param" placeholder="请输入过皮时间" clearable
                            size="small" @keyup.enter.native="handleQuery" /> -->
                        <el-date-picker value-format="timestamp" type="date" placeholder="选择日期" v-model="queryParams.tareTime"
                            style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="lab-container">
                    <label class="condition-item-title">车牌号码</label>
                    <el-form-item label="" prop="licensePlate" class="custom-el-form-item">
                        <el-input v-model="queryParams.licensePlate" class="query-param" placeholder="请输入车牌号" clearable
                            size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                </div>
                <div class="btn-container">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>
        <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe
            @row-dblclick="handleDoubleClick" :height="tableHeight"
            :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="weighBridgeList"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" type="index" width="60" align="left">
                <template slot-scope="scope">
                    <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="车牌号码" align="left" prop="licensePlate" sortable :render-header="renderHeader" />
            <el-table-column label="车牌颜色" align="left" prop="plateColor" sortable :render-header="renderHeader" />
            <el-table-column label="毛重" align="left" prop="grossWeight" sortable :render-header="renderHeader" />
            <el-table-column label="皮重" align="left" prop="tareWeight" sortable :render-header="renderHeader"
                :show-overflow-tooltip="true" />
            <el-table-column label="净重" align="left" prop="netWeight" sortable :render-header="renderHeader"
                :show-overflow-tooltip="true" />
            <el-table-column label="过毛时间" align="left" prop="grossTime" width="150" sortable
                :render-header="renderHeader">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.grossTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="过皮时间" align="left" prop="tareTime" width="150" sortable
                :render-header="renderHeader">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.tareTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <!--  <el-table-column label="备注" align="left" prop="remark" sortable :render-header="renderHeader" :show-overflow-tooltip="true" />
      -->
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">详情
                    </el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['base:carBase:edit']">修改
                </el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['base:carBase:remove']">删除
                </el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <pagination :page-sizes="pageList" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getweighBridgeList" />

        <!-- 添加或修改车辆基础信息对话框 -->
        <el-dialog :visible.sync="open" :close-on-click-modal="false">
            <div slot="title">
                <span><i :class="dialogIcon"></i></span>
                <span>信息详情</span>
            </div>
            <div class="carBase-body"></div>
            <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
                <div class="sub-project">
                    <!-- <div class="sub-title">
                        <div class="sub-title-name">信息详情</div>
                    </div> -->
                    <div class="sub-body">
                        <el-row type="flex" style="margin-bottom: 0px" justify="space-around">
                            <el-col :span="9">
                                <el-form-item class="comright" label="车牌号码">
                                    <el-input v-model="formData.licensePlate"></el-input>
                                </el-form-item>
                                <el-form-item class="comright" label="车牌颜色">
                                    <el-input v-model="formData.plateColor"></el-input>
                                </el-form-item>
                                <el-form-item class="comright" label="毛重">
                                    <el-input v-model="formData.grossWeight" placeholder="KG"></el-input>
                                </el-form-item>
                                <el-form-item class="comright" label="皮重">
                                    <el-input v-model="formData.tareWeight" placeholder="KG"></el-input>
                                </el-form-item>
                                <el-form-item class="comright" label="净重">
                                    <el-input v-model="formData.netWeight" placeholder="KG"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <!-- <el-form-item class="comright" label="过毛车牌图片">
                                    <el-input v-model="formData.grossPlateName"></el-input>
                                </el-form-item>
                                <el-form-item class="comright" label="过毛车图片">
                                    <el-input v-model="formData.grossLicenseName"></el-input>
                                </el-form-item> -->
                                <el-form-item label="过毛车牌图片" v-if="!readOnly">
                                    <!-- <img :action="uploadPic.uploadImgUrl" list-type="picture-card" :file-list="uploadPic.pictureFileList1" :on-success="businessLicensePictureUpSuccess" :on-remove="businessLicensePictureRemove" :on-preview="handlePictureCardPreview" :on-error="picUploadErr" :on-progress="picUpProcess" :headers="uploadPic.uploadHeader" :before-upload="beforePicUpload" accept=".png,.jpg,.jpeg,.svg">
                                      <i class="el-icon-plus"></i>
                                      <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg/svg文件，且不超过20M</div>
                                    </img> -->
                                    <!-- <img :src="formData.grossPlateName" alt=""> -->
                                    <el-image style="width: 100px; height: 100px" :src="urltwo" :preview-src-list="srcListtwo"></el-image>
                                </el-form-item>

                                <el-form-item label="过毛车图片" v-if="!readOnly">
                                    <!-- <el-upload :action="uploadPic.uploadImgUrl" list-type="picture-card" :file-list="uploadPic.pictureFileList1" :on-success="businessLicensePictureUpSuccess" :on-remove="businessLicensePictureRemove" :on-preview="handlePictureCardPreview" :on-error="picUploadErr" :on-progress="picUpProcess" :headers="uploadPic.uploadHeader" :before-upload="beforePicUpload" accept=".png,.jpg,.jpeg,.svg">
                                      <i class="el-icon-plus"></i>
                                      <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg/svg文件，且不超过20M</div>
                                    </el-upload> -->
                                    <!-- <img :src="formData.grossLicenseName" alt=""> -->
                                    <el-image style="width: 100px; height: 100px" :src="urlone" :preview-src-list="srcListone"></el-image>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div>
                    <!-- <el-button type="primary">确 定</el-button> -->
                    <el-button size="middle" type="primary" @click="open=false">关闭</el-button>
                    <el-button size="middle" type="primary" @click="handleExport">导出</el-button>
                </div>
                <!-- <div>
            <el-button type="primary">关 闭</el-button>
          </div> -->
            </div>
        </el-dialog>


    </div>
</template>
<script>
    import detail from './detail'
    export default {
        ...detail
    }
</script>
<style scoped>
    /* .form-item {
      width: 100%;
    }
    .vue-treeselect__control {
      height: 32px;
    }
    .vue_treeselect .el-form-item__content {
      line-height: 31px;
    } */
    .form-item {
        width: 100%;
    }

    .vue-treeselect__control {
        height: 32px;
    }

    .vue_treeselect .el-form-item__content {
        line-height: 31px;
    }

    .amap-page-container1 {
        width: 100%;
        height: 350px;
    }

    .form-item {
        width: 240px;
    }

    .el-tree {
        height: 100%;
    }

    .map-container {}

    .map-container .info {
        position: absolute;
        top: 0px;
        border-width: 0;
        opacity: 0.95;
    }

    .map-container .input-item {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
    }

    .map-container .input-item-prepend {
        margin-right: -1px;
    }

    .map-container .input-item-text {
        width: auto;
        padding: 0.4rem 0.7rem;
        display: inline-block;
        text-align-last: justify;
        align-items: center;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        text-align: center;
        white-space: nowrap;
    }

    .map-container .tipinput {
        margin-top: 10px;
        margin-left: 10px;
        width: 350px;
    }

    .showFour {
        display: flex;
        justify-content: space-evenly;
    }

    .itemshow {
        margin: 6px auto;
        text-align: center;
        width: 49%;
        border: 1px solid rgb(223, 220, 220);
        background-color: #fff;
        color: rgb(55, 54, 54);

    }

    .itemshows {
        margin: 6px auto;
        text-align: center;
        border: 1px solid rgb(223, 220, 220);
        background-color: #fff;
        color: rgb(55, 54, 54);

    }

    .topshow {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        line-height: 40px;
        padding: 5px 13px;
        box-sizing: border-box;
        border-bottom: 1px solid rgb(218, 214, 214);
    }

    .bottomshow {
        height: 50px;
    }
</style>