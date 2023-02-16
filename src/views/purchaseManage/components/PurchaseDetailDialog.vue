<template>
  <el-dialog @close="reset" :visible.sync="open"  :close-on-click-modal="false" class="customForm _baseForm_big" >
    <div slot="title">
      <span><i class="el-icon-view"></i></span>
      <span> 采购记录详情 </span>
    </div>
    <el-form ref="form" :model="form"  label-width="120px">
      <base-form :readOnly="true" ref="baseForm"></base-form>
      <div class="sub-project">
        <div class="sub-title">
          <div class="sub-title-name">申请人信息</div>
        </div>
        <div class="sub-body">
          <el-row>
            <el-col :span="8">

              <el-form-item label="申请人：" prop="applicant" class="custom-form-item">
                {{form.applicant}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请时间：" prop="applicationTime" v-if="readOnly" class="custom-form-item">
                {{form.applicationTime}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划收货时间：" prop="scheduleDeliveryTime"  class="custom-form-item">
                {{form.scheduleDeliveryTime}}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="sub-project">
        <div class="sub-title">
          <div class="sub-title-name">采购信息</div>
        </div>
        <div class="sub-body">
          <el-row>
            <el-col :span="24">
<!--              <el-form-item label="供应商" prop="supplierId" v-if="!readOnly">-->
<!--                <el-select v-model="form.supplierId" placeholder="请选择供应商" class="customSelect form-item" >&lt;!&ndash;@change="onChangeSupplier"&ndash;&gt;-->
<!--                  <el-option-->
<!--                    v-for="dict in supplierOptions"-->
<!--                    :key="dict.id"-->
<!--                    :label="dict.supplierName"-->
<!--                    :value="dict.id"-->
<!--                  />-->
<!--                </el-select>-->
<!--              </el-form-item>-->
              <el-form-item label="供应商：" prop="supplierId" v-if="readOnly" class="custom-form-item">
                {{form.supplierName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
<!--              <el-form-item label="采购人" prop="purchaser" v-if="!readOnly">-->
<!--                <el-input v-model="form.purchaser" placeholder="请输入采购人"/>-->
<!--              </el-form-item>-->
              <el-form-item label="采购人：" prop="purchaser" v-if="readOnly" class="custom-form-item">
                {{form.purchaser}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="采购时间：" prop="purchaserTime" v-if="readOnly" class="custom-form-item">
                {{form.purchaserTime}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
<!--              <el-form-item label="购进单号" prop="orderNum" v-if="!readOnly">-->
<!--                <el-input v-model="form.orderNum" placeholder="请输入购进单号"/>-->
<!--              </el-form-item>-->
              <el-form-item label="购进单号：" prop="orderNum" v-if="readOnly" class="custom-form-item">
                {{form.orderNum}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
<!--              <el-form-item label="购进时间" prop="purchaseTime" v-if="!readOnly">-->
<!--                <el-date-picker clearable size="small" class="form-item"-->
<!--                                v-model="form.purchaseTime"-->
<!--                                type="datetime"-->
<!--                                value-format="yyyy-MM-dd HH:mm:ss"-->
<!--                                placeholder="选择购进时间">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
              <el-form-item label="购进时间：" prop="purchaseTime" v-if="readOnly" class="custom-form-item">
                {{form.purchaseTime}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
<!--              <el-form-item label="购进总额" prop="totalMoney" v-if="!readOnly">-->
<!--                <el-input v-model="form.totalMoney" placeholder="选择商品后自动计算总额"/>-->
<!--              </el-form-item>-->
              <el-form-item label="购进总额：" prop="totalMoney" v-if="readOnly" class="custom-form-item">
                {{form.totalMoney}}
              </el-form-item>
            </el-col>
            <!--              <el-col :span="8">-->
            <!--                <el-form-item label="采购票据图片" prop="attachmentFiles" v-if="!readOnly">-->
            <!--                  <el-input v-model="form.attachmentFiles" placeholder="请输入采购票据图片"/>-->
            <!--                </el-form-item>-->
            <!--                <el-form-item label="采购票据图片：" prop="attachmentFiles" v-if="readOnly" class="custom-form-item">-->
            <!--                  {{form.attachmentFiles}}-->
            <!--                </el-form-item>-->
            <!--              </el-col>-->

            <el-col :span="24">
<!--              <el-form-item label="采购票据图片" prop="attachmentFiles" v-if="!readOnly">-->
<!--                <el-upload :action="uploadPic.uploadImgUrl"-->
<!--                           list-type="picture-card"-->
<!--                           :file-list="uploadPic.pictureFileList1"-->
<!--                           :on-success="exercisePicUpSuccess"-->
<!--                           :on-remove="exercisePicRemove"-->
<!--                           :on-preview="handlePictureCardPreview"-->
<!--                           :on-error="picUploadErr"-->
<!--                           :on-progress="picUpProcess"-->
<!--                           :headers="uploadPic.uploadHeader"-->
<!--                           :before-upload="beforePicUpload"-->
<!--                           accept=".png,.jpg,.jpeg,.svg"-->
<!--                >-->
<!--                  <i class="el-icon-plus"></i>-->
<!--                  <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg/svg文件，且不超过20M</div>-->
<!--                </el-upload>-->
<!--              </el-form-item>-->
              <el-form-item label="采购票据图片：" prop="attachmentFiles" v-if="readOnly" class="custom-form-item">
                <el-image v-if="uploadPic.pictureList1&&uploadPic.pictureList1.length==0"
                          style="min-width: 100px;min-height: 100px;margin-right: 15px">
                  <div slot="error" class="image-slot" style="text-align: center">
                    <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
                      暂无图片</i>
                  </div>
                </el-image>
                <el-image v-if="uploadPic.pictureList1&&uploadPic.pictureList1.length > 0"
                          v-for="(url,index) in uploadPic.pictureList1" :key="url" :src="url"
                          style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                          @click="getCurrentPreviewImg(url)"
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
          <div class="sub-title-name">采购商品</div>
        </div>
        <div class="sub-body">
          <!-- <el-button v-if="!readOnly" style="margin: 0px 5px 5px 5px" @click="addGoods" type="primary" icon="el-icon-plus">添加</el-button> -->
          <el-table ref="goodsTable"  stripe  :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="goodsList" >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item>
                    <span style="padding-right: 20px">种植户/养殖户: {{!scope.row.editable ? (isEmptyStr(scope.row.grower) ? '无' : scope.row.grower) : ''}}</span>
<!--                    <el-input style="width: 140px" v-if="scope.row.editable" v-model="scope.row.grower" ></el-input>-->
                  </el-form-item>
                  <el-form-item>
                    种植时间: {{!scope.row.editable ? (isEmptyStr(scope.row.cropDate) ? '无' : scope.row.cropDate) : ''}}
                  </el-form-item>
<!--                  <el-form-item>-->
<!--                    <el-date-picker v-if="scope.row.editable" size="small" class="form-item"-->
<!--                                    v-model="scope.row.cropDate"-->
<!--                                    type="date"-->
<!--                                    value-format="yyyy-MM-dd"-->
<!--                                    placeholder="选择种植时间">-->
<!--                    </el-date-picker>-->
<!--                  </el-form-item>-->
                  <el-form-item>
                    <span style="padding-right: 20px">农药喷洒次数: {{!scope.row.editable ? (isEmptyStr(scope.row.sprayNum) ? '无' : scope.row.sprayNum)  : ''}}</span>
<!--                    <el-input-number v-if="scope.row.editable" v-model="scope.row.sprayNum" :controls="false"></el-input-number>-->
                  </el-form-item>
                  <el-form-item>
                    农药喷洒时间: {{!scope.row.editable ? (isEmptyStr(scope.row.sprayDate) ? '无' : scope.row.sprayDate) : ''}}
                  </el-form-item>
<!--                  <el-form-item>-->
<!--                    &lt;!&ndash;                      <span style="padding-right: 20px">种植时间: </span>&ndash;&gt;-->
<!--                    <el-date-picker v-if="scope.row.editable" size="small" class="form-item"-->
<!--                                    v-model="scope.row.sprayDate"-->
<!--                                    type="date"-->
<!--                                    value-format="yyyy-MM-dd"-->
<!--                                    placeholder="选择农药喷洒时间">-->
<!--                    </el-date-picker>-->
<!--                  </el-form-item>-->
                  <el-form-item>
                    收割时间: {{!scope.row.editable ? (isEmptyStr(scope.row.reapDate) ? '无' : scope.row.reapDate) : ''}}
                  </el-form-item>
<!--                  <el-form-item>-->
<!--                    <el-date-picker-->
<!--                      v-if="scope.row.editable"-->
<!--                      size="small"-->
<!--                      class="form-item"-->
<!--                      v-model="scope.row.reapDate"-->
<!--                      type="date"-->
<!--                      value-format="yyyy-MM-dd"-->
<!--                      placeholder="选择收割时间">-->
<!--                    </el-date-picker>-->
<!--                  </el-form-item>-->

                  <!--                    <el-form-item>-->
<!--                  <div v-if="scope.row.editable" style="display: flex;flex-direction: row;align-items: center">-->
<!--                    <span style="padding-right: 20px">相关照片: </span>-->
<!--                    <img v-show="scope.row.goodsPics" :src="handlePicturePathSingle(scope.row.goodsPics)"-->
<!--                         style="width: 100px;height: 100px;margin-right: 15px">-->
<!--                    <el-upload :action="uploadPic.uploadImgUrl"-->
<!--                               :headers="uploadPic.uploadHeader"-->
<!--                               :limit="1"-->
<!--                               :on-exceed="handleExceed"-->
<!--                               :before-upload="beforePicUpload"-->
<!--                               accept=".png,.jpg,.jpeg,.svg"-->
<!--                               list-type="picture-card"-->
<!--                               :file-list="scope.row.pictureFileList"-->
<!--                               :on-success="handlePicUpSuccess"-->
<!--                               :on-remove="handlePicRemove"-->
<!--                               v-show="!scope.row.goodsPics"-->
<!--                    >-->
<!--                      <i class="el-icon-plus" @click="curRowIndex=scope.$index"></i>-->
<!--                    </el-upload>-->
<!--                  </div>-->
                  <div v-if="!scope.row.editable">
                    <div v-if="scope.row.goodsPics && scope.row.goodsPics.length>0">
                      <img v-for="(url,index) in scope.row.goodsPics.split(',')" :key="url" :src="handlePicturePathSingle(url)"
                           style="width: 100px;height: 100px;margin-right: 15px">
                    </div>
                    <div v-else>暂无图片</div>
                  </div>
                  <!--                    </el-form-item>-->
                </el-form>
              </template>
            </el-table-column>

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

            <el-table-column label="单价(元)" align="left" prop="price" sortable :render-header="renderHeader" min-width="100">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.editable" v-model="scope.row.price" :precision="2"  :controls="false"></el-input-number>
                <span v-if="!scope.row.editable">{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" align="left" prop="mount" sortable :render-header="renderHeader" min-width="100">
              <template slot-scope="scope">
                <el-input-number v-if="scope.row.editable" v-model="scope.row.mount" :precision="2" :controls="false"></el-input-number>
                <span v-if="!scope.row.editable">{{scope.row.mount}}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额(元)" align="left" prop="amount" sortable :render-header="renderHeader" min-width="100">
              <template slot-scope="scope">
                <span>{{scope.row.price * scope.row.mount}}</span>
              </template>
            </el-table-column>
            <el-table-column label="生产日期" align="left" prop="produceTime" sortable :render-header="renderHeader" min-width="150">
              <template slot-scope="scope">
                <el-date-picker v-if="scope.row.editable" size="small" class="form-item"
                                v-model="scope.row.produceTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择生产日期">
                </el-date-picker>
                <span v-if="!scope.row.editable">{{scope.row.produceTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="有效期至" align="left" prop="validTime" sortable :render-header="renderHeader" min-width="150">
              <template slot-scope="scope">
                <el-date-picker v-if="scope.row.editable" size="small" class="form-item"
                                v-model="scope.row.validTime"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择有效期至">
                </el-date-picker>
                <span v-if="!scope.row.editable">{{scope.row.validTime}}</span>
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

<!--            <el-table-column fixed="right" label="操作" min-width="100" v-if="!readOnly" :render-header="renderHeader">-->
<!--              <template slot-scope="scope">-->
<!--                <el-button @click="handleEditGoods(scope.row,scope.$index)" v-if="curRowIndex<0" style="color: #409eff" type="text" size="small">编辑</el-button>-->
<!--                <el-button @click="handleEditGoods(scope.row,scope.$index)" v-if="curRowIndex>=0 && scope.row.editable && curRowIndex == scope.$index" style="color: #409eff" type="text" size="small">确定</el-button>-->
<!--                <el-button v-if="curRowIndex>=0 && curRowIndex != scope.$index" style="color: #999" type="text" size="small">编辑</el-button>-->
<!--                &lt;!&ndash; <el-button @click="handleDeleteGoods(scope.row,scope.$index)" v-if="curRowIndex<0" style="color: #f70000" type="text" size="small">删除</el-button>-->
<!--                <el-button @click="handleDeleteGoods(scope.row,scope.$index)" v-if="curRowIndex>=0 && curRowIndex == scope.$index" type="text" style="color: #f70000" size="small">删除</el-button> &ndash;&gt;-->
<!--              </template>-->
<!--            </el-table-column>-->
          </el-table>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div>
        <!-- <el-button type="primary" @click="save">确 定</el-button> -->
        <el-button type="" @click="cancel">关 闭</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {getPurchaseRecord} from "@/api/purchaseManage/purchaseRecord";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
import {getToken} from "@/utils/auth";

export default {
  props: ['purchaseId'],
  name: "PurchaseDetailDialog",
  data(){
    return {
      open: false,
      form: {},
      readOnly: true,
      goodsList: [],
      uploadPic:{
        uploadImgUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadImageAndCrtThumbImage',
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        picDialogVisible:false,
        picDialogImageUrl:undefined,
        pictureList1:[],
        pictureFileList1:[]
      },
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        params: {
        }
      },
      goodsUnitOptions: [],
      goodsTypeOptions: [],
    }
  },
  created() {
    this.getDicts("goods_unit").then(response => {
      this.goodsUnitOptions = response.data;
    });
    this.getDicts("goods_type").then(response => {
      this.goodsTypeOptions = response.data;
    });
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    renderHeader(h, {column, $index}, width) {
        let color = '#515a6e';
        let that = this;
        if (that.columnLabel != '' && that.columnLabel == column.label) {
          color = "#ff6600";
        }
        let style = {};
        if (width) {
          // width: 'calc(' + width + '% - 48px)'
          style = {
            textAlign: 'center',
            wordBreak: 'break-all',
            whiteSpace: 'pre-line',
            display: 'inline-block',
            lineHeight: 'normal',
            color: color,
            width: width + "%"
          }
        } else {
          style = {
            textAlign: 'left',
            wordBreak: 'break-all',
            whiteSpace: 'pre-line',
            display: 'inline-block',
            lineHeight: 'normal',
            color: color
          }
        }

        return h(
          'span',
          {
            style: style,
          },
          column.label)
      },
    goodsUnitFormat(row, column) {
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },
    goodsTypeFormat(row, column) {
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    isEmptyStr(s) {
      if (s == undefined || s == null || s === '') {
        return true
      }
      return false
    },
// 表单重置
    reset() {
      this.form = {
        id: undefined,
        enterpriseId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        delFlag: undefined,
        supplierId: undefined,
        supplierName: undefined,
        orderNum: undefined,
        purchaseTime: undefined,
        totalMoney: undefined,
        attachmentFiles: undefined
      };
      this.resetForm("form");
      this.goodsList = []
      this.goodsListAll = []
      this.goodsListRest = []
      this.uploadPic.pictureList1=[];
      this.uploadPic.pictureFileList1=[];
    }
  },
  watch: {
    purchaseId: {
      handler(newValue,oldValue){
        this.reset();
        getPurchaseRecord(newValue).then(response=> {
          this.form = response.data
          this.goodsList = this.form.goodsList
          this.uploadPic.pictureList1 = handlePicturePath(this.form.attachmentFiles);
          this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);

          this.open = true;
          this.$nextTick(function () {
            this.$refs.baseForm.initBaseFormByEnterpriseId(response.data.enterpriseId)
          })
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
