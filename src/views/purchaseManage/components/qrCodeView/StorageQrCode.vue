<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- <base-form :readOnly="false" ref="baseForm"></base-form> -->
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">商品基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="商品图片：" prop="goodsName" class="custom-form-item">
                  <el-image
                             :src="getUrl(form.commodity.goodsPics)"
                            style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                            
                            @click="onPreview(getUrl(form.commodity.goodsPics))"
                  ><!--:preview-src-list="[getUrl(form.commodity.goodsPics)]"-->
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
                <el-form-item label="商品名称：" prop="goodsName" class="custom-form-item">
                  {{form.commodity.goodsName}}
                </el-form-item>
              </el-col>
              <!-- <el-col :span="24">
                <el-form-item label="数量：" prop="mount"  class="custom-form-item">
                  {{form.commodity.mount}} / {{goodsUnitFormat(form.commodity)}}
                </el-form-item>
              </el-col> -->
              <el-col :span="24">
                <el-form-item label="保质期：" prop="qualityDays"  class="custom-form-item">
                  {{form.commodity.qualityDays}} / 天
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品价格：" prop="price"  class="custom-form-item">
                  {{form.commodity.price}} / 元
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="生产企业：" prop="manufacturer"  class="custom-form-item">
                  {{form.commodity.manufacturer}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品产地：" prop="productPlace"  class="custom-form-item">
                  {{form.commodity.productPlace}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品规格：" prop="standard" class="custom-form-item">
                  {{form.commodity.standard}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="是否进口：" prop="inlet"  class="custom-form-item">
                  {{inletFormat(form.commodity)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品包装形式：" prop="packageType"  class="custom-form-item">
                  {{packageTypeFormat(form.commodity)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品类型：" prop="goodsType"  class="custom-form-item">
                  {{goodsTypeFormat(form.commodity)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品存储方式：" prop="keepMethod"  class="custom-form-item">
                  {{keepMethodFormat(form.commodity)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="生产日期：" prop="produceTime"  class="custom-form-item">
                  {{form.commodity.produceTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="有效期至：" prop="validTime"  class="custom-form-item">
                  {{form.commodity.validTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="批号：" prop="lotNumber"  class="custom-form-item">
                  {{form.commodity.lotNumber}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="商品编号：" prop="productIdentification"  class="custom-form-item">
                  {{form.commodity.productIdentification}}
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">商品种植情况</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="种植户：" prop="grower" class="custom-form-item">
                  {{form.commodity.grower}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="种植时间：" prop="cropDate" class="custom-form-item">
                  {{form.commodity.cropDate}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="农药喷洒次数：" prop="sprayNum"  class="custom-form-item">
                  {{form.commodity.sprayNum}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="农药喷洒时间：" prop="sprayDate"  class="custom-form-item">
                  {{form.commodity.sprayDate}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="收割时间：" prop="reapDate"  class="custom-form-item">
                  {{form.commodity.reapDate}}
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">申请采购人信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="申请人：" prop="applicant" class="custom-form-item">
                  {{form.purchaseRecord.applicant}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="申请时间：" prop="applicationTime" class="custom-form-item">
                  {{form.purchaseRecord.applicationTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="申请数量：" prop="mount" class="custom-form-item">
                  {{form.storage.mount}} / {{goodsUnitFormat(form.storage)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                
                <el-form-item label="计划收货时间：" prop="scheduleDeliveryTime"  class="custom-form-item">
                  {{form.purchaseRecord.scheduleDeliveryTime}}
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
                
                <el-form-item label="供应商：" prop="supplierId" class="custom-form-item">
                  {{form.purchaseRecord.supplierName}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="采购人：" prop="purchaser" class="custom-form-item">
                  {{form.purchaseRecord.purchaser}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="采购时间：" prop="purchaserTime" class="custom-form-item">
                  {{form.purchaseRecord.purchaserTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                
                <el-form-item label="购进单号：" prop="orderNum" class="custom-form-item">
                  {{form.purchaseRecord.orderNum}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="购进时间：" prop="purchaseTime" class="custom-form-item">
                  {{form.purchaseRecord.purchaseTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="采购数量：" prop="mount" class="custom-form-item">
                  {{form.storage.mount}} / {{goodsUnitFormat(form.storage)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="采购价格：" prop="price" class="custom-form-item">
                  {{form.commodity.price}} / 元
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="购进总额：" prop="totalMoney" class="custom-form-item">
                  {{form.purchaseRecord.totalMoney}}
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
                <el-form-item label="采购票据图片：" prop="attachmentFiles" class="custom-form-item">
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
                            
                             @click="onPreview(url)"
                  ><!--:preview-src-list="[url]"-->
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
            <div class="sub-title-name">供应商信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="供应商名称：" prop="supplierName" class="custom-form-item">
                  {{form.supplier.supplierName}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="联系人姓名：" prop="contactName" class="custom-form-item">
                  {{form.supplier.contactName}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="联系方式：" prop="contactPhone"  class="custom-form-item">
                  {{form.supplier.contactPhone}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="联系人身份证：" prop="contactIdcard"  class="custom-form-item">
                  {{form.supplier.contactIdcard}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="供应类型：" prop="supplierType"  class="custom-form-item">
                  {{supplierTypeFormat(form.supplier)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="主营范围：" prop="bussinessScope"  class="custom-form-item">
                  {{form.supplier.bussinessScope}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="许可证号：" prop="permissionNum"  class="custom-form-item">
                  {{form.supplier.permissionNum}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="供货状态：" prop="supplyStatus"  class="custom-form-item">
                  {{supplyStatusFormat(form.supplier)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="地址：" prop="address"  class="custom-form-item">
                  {{form.supplier.address}}
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>
        <div class="sub-project" v-if="form.foodInspection">
          <div class="sub-title">
            <div class="sub-title-name">食材检查</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="检测时间：" prop="inspectionDate" class="custom-form-item">
                  {{form.foodInspection.inspectionDate}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="检测状态：" prop="checkStatus" class="custom-form-item">
                  {{form.foodInspection.checkStatus == 1? '正常':'异常'}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="检测图片：" prop="inspectionPicture" class="custom-form-item">
                  <!-- {{form.foodInspection.inspectionPicture}} -->
                  <el-image
                             :src="getUrl(form.foodInspection.inspectionPicture)"
                            style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                            
                            @click="onPreview(getUrl(form.foodInspection.inspectionPicture))"
                  ><!--:preview-src-list="[getUrl(form.foodInspection.inspectionPicture)]"-->
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
                <el-form-item label="检测备注：" prop="inspectionRemark" class="custom-form-item">
                  {{form.foodInspection.inspectionRemark}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="快检时间：" prop="quickCheckDate" class="custom-form-item">
                  {{form.foodInspection.quickCheckDate}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="快检图片：" prop="quickCheckPicture" class="custom-form-item">
                  <!-- {{form.foodInspection.quickCheckPicture}} -->
                  <el-image
                             :src="getUrl(form.foodInspection.quickCheckPicture)"
                            style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                            @click="onPreview(getUrl(form.foodInspection.quickCheckPicture))"
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
                <el-form-item label="快检备注：" prop="quickCheckRemark" class="custom-form-item">
                  {{form.foodInspection.quickCheckRemark}}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">企业入库信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="入库人：" prop="warehouseKeeper" class="custom-form-item">
                  {{form.storage.warehouseKeeper}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="入库时间：" prop="warehouseTime" class="custom-form-item">
                  {{form.storage.warehouseTime}}
                </el-form-item>
              </el-col>
               <el-col :span="24">
                <el-form-item label="入库数量：" prop="mount" class="custom-form-item">
                  {{form.storage.mount}} / {{goodsUnitFormat(form.storage)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="入库影像：" prop="inboundImagery"  class="custom-form-item">
                  <el-image v-if="uploadPic.pictureList2&&uploadPic.pictureList2.length==0"
                            style="min-width: 100px;min-height: 100px;margin-right: 15px">
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
                        暂无图片</i>
                    </div>
                  </el-image>
                  <el-image v-if="uploadPic.pictureList2&&uploadPic.pictureList2.length > 0"
                            v-for="(url,index) in uploadPic.pictureList2" :key="url" :src="url"
                            style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                             @click="onPreview(url)"
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
        <div class="sub-project" v-if="form.outLibrary">
          <div class="sub-title">
            <div class="sub-title-name">企业出库信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="出库人：" prop="outgoingPeople" class="custom-form-item">
                  {{form.outLibrary.outgoingPeople}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="出库时间：" prop="outgoingTime" class="custom-form-item">
                  {{form.outLibrary.outgoingTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="出库数量：" prop="mount" class="custom-form-item">
                  {{form.outLibrary.mount}} / {{goodsUnitFormat(form.outLibrary)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="领料人：" prop="pickers" class="custom-form-item">
                  {{form.outLibrary.pickers}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="出库原因：" prop="outgoingCause" class="custom-form-item">
                  {{form.outLibrary.outgoingCause}}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="sub-project" v-if="form.locationStorage">
          <div class="sub-title">
            <div class="sub-title-name">经营场所入库信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="入库人：" prop="warehouseKeeper" class="custom-form-item">
                  {{form.locationStorage.warehouseKeeper}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="入库时间：" prop="warehouseTime" class="custom-form-item">
                  {{form.locationStorage.warehouseTime}}
                </el-form-item>
              </el-col>
               <el-col :span="24">
                <el-form-item label="入库数量：" prop="mount" class="custom-form-item">
                  {{form.locationStorage.mount}} / {{goodsUnitFormat(form.locationStorage)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="入库影像：" prop="inboundImagery"  class="custom-form-item">
                  <el-image v-if="uploadPic.pictureList3&&uploadPic.pictureList3.length==0"
                            style="min-width: 100px;min-height: 100px;margin-right: 15px">
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
                        暂无图片</i>
                    </div>
                  </el-image>
                  <el-image v-if="uploadPic.pictureList3&&uploadPic.pictureList3.length > 0"
                            v-for="(url,index) in uploadPic.pictureList3" :key="url" :src="url"
                            style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                            @click="onPreview(url)"
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
        <div class="sub-project" v-if="form.locationOutLibrary">
          <div class="sub-title">
            <div class="sub-title-name">经营场所出库信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-form-item label="出库人：" prop="outgoingPeople" class="custom-form-item">
                  {{form.locationOutLibrary.outgoingPeople}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="出库时间：" prop="outgoingTime" class="custom-form-item">
                  {{form.locationOutLibrary.outgoingTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="出库数量：" prop="mount" class="custom-form-item">
                  {{form.locationOutLibrary.mount}} / {{goodsUnitFormat(form.locationOutLibrary)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="领料人：" prop="pickers" class="custom-form-item">
                  {{form.locationOutLibrary.pickers}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="出库原因：" prop="outgoingCause" class="custom-form-item">
                  {{form.locationOutLibrary.outgoingCause}}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
</template>
<script>
import { getStorageQrCode } from "@/api/purchaseManage/purchaseStorage";
import {getToken} from "@/utils/auth";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";

export default {
  name: 'StorageQrCode',
  props: {
    productIdentificationz: {

    },
    lotNumberz: {

    },
    typez:{

    },
    codez: {

    }
  },
  data() {
    return {
        productIdentification: '',
        lotNumber: '',
        type: '',
        code: '',
        operationId: '',
        form: {},
        rules: {},
        uploadPic:{
            uploadImgUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadImageAndCrtThumbImage',
            uploadHeader: { Authorization: 'Bearer ' + getToken() },
            picDialogVisible:false,
            picDialogImageUrl:undefined,
            pictureList1:[],
            pictureList2: [],
            pictureList3: [],
            pictureFileList1:[],
            pictureFileList2:[],
            pictureFileList3:[]
        },
        goodsUnitOptions: [],
        goodsTypeOptions: [],
        goodsWrapTypeOptions: [],
        goodsKeepMethodOptions: [],
        supplierTypeOptions: []
    }
  },
  watch: {
    productIdentificationz: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.productIdentification = newValue
          this.init()
        }
      },
      immediate: true
    },
    lotNumberz: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.lotNumber = newValue
          // this.init()
        }
      },
      immediate: true
    },
    typez: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.type = newValue
          // this.init()
        }
      },
      immediate: true
    },
    codez: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.code = newValue
          // this.init()
        }
      },
      immediate: true
    }
  },

  created() {
      if (this.$route.query.productIdentification) {
          this.productIdentification = this.$route.query.productIdentification
      }
      if (this.$route.query.lotNumber) {
          this.lotNumber = this.$route.query.lotNumber
      }
      if (this.$route.query.type) {
          this.type = this.$route.query.type
      }
      if (this.$route.query.operationId) {
          this.operationId = this.$route.query.operationId
      }
      this.getDicts("goods_unit").then(response => {
        this.goodsUnitOptions = response.data;
      });
      this.getDicts("goods_wrap_type").then(response => {
        this.goodsWrapTypeOptions = response.data;
      });
      this.getDicts("goods_type").then(response => {
        this.goodsTypeOptions = response.data;
      });
      this.getDicts("goods_keep_method").then(response => {
        this.goodsKeepMethodOptions = response.data;
      });
      this.getDicts("supplier_type").then(response => {
        this.supplierTypeOptions = response.data;
      });
      if (this.type.length > 0 && this.productIdentification.length > 0 && this.lotNumber.length > 0) {
        getStorageQrCode(this.operationId,this.code,this.type,this.productIdentification,this.lotNumber).then(response => {
          this.$nextTick(()=>{
            this.form = response.data
            this.uploadPic.pictureList1 = handlePicturePath(this.form.purchaseRecord.attachmentFiles);
            this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
            this.uploadPic.pictureList2 = handlePicturePath(this.form.storage.inboundImagery);
            this.uploadPic.pictureFileList2 = handleFileList(this.uploadPic.pictureList2);
            this.uploadPic.pictureList3 = handlePicturePath(this.form.locationStorage.inboundImagery);
            this.uploadPic.pictureFileList3 = handleFileList(this.uploadPic.pictureList3);
          })
        //   this.$nextTick(function () {
        //     this.$refs.baseForm.initBaseForm(response.data.purchaseRecord.enterpriseId)
        //   })
        })
      }
  },
  methods: {
    onPreview(val) {
      this.$emit('onPreview',val)
    },
    init() {
      if (this.type.length > 0 && this.productIdentification.length > 0 && this.lotNumber.length > 0) {
        getStorageQrCode(this.operationId,this.code,this.type,this.productIdentification,this.lotNumber).then(response => {
          this.$nextTick(()=>{
            this.form = response.data
            this.uploadPic.pictureList1 = handlePicturePath(this.form.purchaseRecord.attachmentFiles);
            this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
            this.uploadPic.pictureList2 = handlePicturePath(this.form.storage.inboundImagery);
            this.uploadPic.pictureFileList2 = handleFileList(this.uploadPic.pictureList2);
            this.uploadPic.pictureList3 = handlePicturePath(this.form.locationStorage.inboundImagery);
            this.uploadPic.pictureFileList3 = handleFileList(this.uploadPic.pictureList3);
          })
        //   this.$nextTick(function () {
        //     this.$refs.baseForm.initBaseForm(response.data.purchaseRecord.enterpriseId)
        //   })
        })
      }
    },
    // 预览大图时定位到当前选中的图片
    getCurrentPreviewImg(url){
      // return urls.slice(index).concat(urls.slice(0,index));
      this.uploadPic.picDialogImageUrl = url
      this.uploadPic.picDialogVisible = true
    },
    getCurrentPreviewImg1(url){
      // return urls.slice(index).concat(urls.slice(0,index));
      this.uploadPic.picDialogImageUrl = url
      this.uploadPic.picDialogVisible = true
    },
    getUrl(val) {
      return process.env.VUE_APP_PICTURE_PATH + val
    },
    supplierTypeFormat(row,column){
      return this.selectDictLabel(this.supplierTypeOptions, row.supplierType);
    },
    goodsUnitFormat(row,column){
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },
    packageTypeFormat(row,column){
      return this.selectDictLabel(this.goodsWrapTypeOptions, row.packageType);
    },
    goodsTypeFormat(row,column){
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    keepMethodFormat(row,column){
      return this.selectDictLabel(this.goodsKeepMethodOptions, row.keepMethod);
    },
    inletFormat(row,column){
      if (row.inlet && row.inlet== '1'){
        return '是'
      } else{
        return '否'
      }
    },
    supplyStatusFormat(row,column){
      if (row.supplyStatus && row.supplyStatus== '-1'){
        return '停止'
      } else{
        return '正常'
      }
    },
  }

}

</script>