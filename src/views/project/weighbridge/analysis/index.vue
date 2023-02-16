<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: 5px">
            <div class="con-container">
                <div class="lab-container">
                    <label class="condition-item-title">过毛时间</label>
                    <el-form-item label="" prop="grossTime" class="custom-el-form-item">
                        <!-- <el-input v-model="queryParams.grossTime" class="query-param" placeholder="请输入过毛时间" clearable
                            size="small" @keyup.enter.native="handleQuery" /> -->
                            <el-date-picker value-format="timestamp" type="date" placeholder="选择日期" v-model="queryParams.grossTime" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </div>
                <div class="lab-container">
                    <label class="condition-item-title">过皮时间</label>
                    <el-form-item label="" prop="tareTime" class="custom-el-form-item">
                        <!-- <el-input v-model="queryParams.tareTime" class="query-param" placeholder="请输入过皮时间" clearable
                            size="small" @keyup.enter.native="handleQuery" /> -->
                            <el-date-picker value-format="timestamp" type="date" placeholder="选择日期" v-model="queryParams.tareTime" style="width: 100%;"></el-date-picker>
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


    <div class="echrts" style="display: flex;">
        <div class="leftEchrts" style="width: 50%;margin: 12px 0;">
            <div class="top" style="display: flex;">
                <div class="itemshow">
                    <div class="topshow">
                        <div>当日重量</div>
                        <div style="height: 20px;line-height: 20px ;background-color: rgb(14, 159, 79);">吨</div>
                    </div>
                    <div class="bottomshow">
                        <h3>904.6吨</h3>
                    </div>
                </div>
                <div class="itemshow">
                    <div class="topshow">
                        <div>当日重量</div>
                        <div style="height: 20px;line-height: 20px ;background-color: rgb(76, 76, 187);">吨</div>
                    </div>
                    <div class="bottomshow">
                        <h3>904.6吨</h3>
                    </div>
                </div>
            </div>
           
            <div ref="chart" class="itemshows" style="height:300px;margin: 6px 5px;"></div>
        </div>
        <div class="rightEchrts"  style="width: 50%;margin: 12px 0;">
            <div class="top" style="display: flex;">
                <div class="itemshow">
                    <div class="topshow">
                        <div>总车次</div>
                        <div style="height: 20px;line-height: 20px ;background-color: rgb(175, 90, 90);">次</div>
                    </div>
                    <div class="bottomshow">
                        <h3>210次</h3>
                    </div>
                </div>
                <div class="itemshow">
                    <div class="topshow">
                        <div>当日车次</div>
                        <div style="height: 20px;line-height: 20px ;background-color: blanchedalmond;">次</div>
                    </div>
                    <div class="bottomshow">
                        <h3>0次</h3>
                    </div>
                </div>
            </div>
           
            <div ref="chart1" class="itemshows" style="height:300px; margin: 6px 5px;"></div>
        </div>
    </div>



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
                        <el-row style="margin-bottom: 0px">
                            <el-col :span="12">
                                <el-form-item class="comright" label="车牌号码">
                                    <el-input v-model="formData.licensePlate"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="车牌颜色" prop="projectName">
                                    <el-input v-model="formData.plateColor"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="毛重" prop="projectName">
                                    <el-input v-model="formData.grossWeight"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="comright" label="皮重">
                                    <el-input v-model="formData.tareWeight"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="净重" prop="projectName">
                                    <el-input v-model="formData.netWeight"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="皮重类型">
                                    <el-input v-model="formData.tareType"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="过毛时间">
                                    <el-input v-model="formData.grossTime"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="过皮时间">
                                    <el-input v-model="formData.tareTime"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="出入库类型">
                                    <el-input v-model="formData.stockType"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="12">

                                <el-form-item class="comright" label="库房确认状态">
                                    <el-input v-model="formData.storehouseType"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="过毛称重状态">
                                    <el-input v-model="formData.grossWeightOperateType"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">

                                <el-form-item class="comright" label="过皮称重状态">
                                    <el-input v-model="formData.tareWeightOperateType"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="comright" label="司机姓名">
                                    <el-input v-model="formData.driverName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="comright" label="司机电话">
                                    <el-input v-model="formData.driverMobile"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="comright" label="货品名称">
                                    <el-input v-model="formData.goodsName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="comright" label="规格型号">
                                    <el-input v-model="formData.goodsModel"></el-input>
                                </el-form-item>
                            </el-col>






                        </el-row>

                        <el-row :span="20">
                            <el-form-item class="comright" label="收货单位">
                                <el-input v-model="formData.receiptCompany"></el-input>
                            </el-form-item>

                            <el-form-item class="comright" label="发货单位">
                                <el-input v-model="formData.shippingCompany"></el-input>
                            </el-form-item>
                            <el-form-item class="comright" label="运输单位">
                                <el-input v-model="formData.transportCompany"></el-input>
                            </el-form-item>
                            <el-form-item class="comright" label="运输路线">
                                <el-input v-model="formData.transportRoute"></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item class="comright" label="过毛车牌图片">
                                    <!-- <el-input v-model="formData.grossPlateName"></el-input> -->
                                    <el-image style="width: 100px; height: 100px" :src="urltwo" :preview-src-list="srcListtwo"></el-image>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="comright" label="过毛车图片">
                                    <!-- <el-input v-model="formData.grossLicenseName"></el-input> -->
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
    import analysis from './analysis'
    export default {
        ...analysis
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