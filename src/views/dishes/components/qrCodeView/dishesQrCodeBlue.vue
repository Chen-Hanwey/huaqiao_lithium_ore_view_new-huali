<template>
    <div>
        <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <div>
          <div class=" content_module">
            <div class="content_module_title" style="margin-bottom: 10px;">菜品基本信息</div>
            <el-row>
              <el-col :span="24">
                <el-form-item label="菜品图片：" prop="attachmentFiles" class="custom-form-item">
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
                            :preview-src-list="[url]"
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
                <el-form-item label="菜品名称：" prop="goodsName" class="custom-form-item">
                  {{form.name}}
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="菜品价格：" prop="price"  class="custom-form-item">
                  {{form.price}} / 元
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="菜品类型：" prop="type"  class="custom-form-item">
                  {{sampleTypeFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="主要成分：" prop="makeup"  class="custom-form-item">
                  {{form.makeup}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="餐次：" prop="mealType" class="custom-form-item">
                  {{mealTypeFormat(form)}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="菜品日期：" prop="mealTime"  class="custom-form-item">
                  {{form.mealTime}}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="菜品描述：" prop="remark"  class="custom-form-item">
                  {{form.remark}}
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>
        <div >
          <div class="content_module">
              <div class="content_module_title" style="margin-bottom: 10px;">食材基本信息<span style="font-size: 10px;color: #DEE1E6;">（点击食材名称可溯源）</span></div>
               <div style="padding-left:100px;">
              <el-tag v-for="item in form.dailyDishOutLibararies" :key="item.id" :effect="buttonType(item)" style="margin-left: 10px;cursor:pointer;" @click.native="clickTag(item)">{{item.goodsName}}</el-tag>
              </div>
            </div>
        </div>
        <div>
            <storageQrCode v-if="showStorageQrCode" ref="storageQrCode" :codez="code" :productIdentificationz="productIdentificationz" :lotNumberz="lotNumberz" :typez="typez" ></storageQrCode>
        </div>
      </el-form>
    </div>
</template>
<script>
import { getDailyDishQrCode } from "@/api/dishes/dailyDishInfo";
import {getToken} from "@/utils/auth";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
import storageQrCode from "@/views/purchaseManage/components/qrCodeView/StorageQrCodeBlue"

export default {
  name: 'StorageQrCode',
  components: {storageQrCode},
  props: {
    Id: {
    }
  },
  data() {
    return {
        code: '',
        form: {},
        currentType: {},
        showStorageQrCode: false,
        productIdentificationz: '',
        lotNumberz: '',
        typez: '',
        rules: {},
        uploadPic:{
            uploadImgUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadImageAndCrtThumbImage',
            uploadHeader: { Authorization: 'Bearer ' + getToken() },
            picDialogVisible:false,
            picDialogImageUrl:undefined,
            pictureList1:[],
            pictureList2: [],
            pictureFileList1:[],
            pictureFileList2:[]
        },
        sampleTypeOptions: [],
        mealTypeOptions: []

    }
  },
  watch: {
    Id: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.code = newValue
          // this.getDailyDishQrCodes()
        }
      },
      immediate: true
    }
  },
  created() {
      console.log(this.$route.query.code)
      if (this.$route.query.code) {
          this.code = this.$route.query.code
      }
      this.getDicts("sample_type").then(response => {
      this.sampleTypeOptions = response.data;
    });
    this.getDicts("meal_type").then(response => {
      this.mealTypeOptions = response.data;
    });

      getDailyDishQrCode(this.code).then(response => {
          this.$nextTick(()=>{
            this.form = response.data
            this.uploadPic.pictureList1 = handlePicturePath(this.form.dishesImg);
            this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
          //   this.$nextTick(function () {
          //     this.$refs.baseForm.initBaseForm(response.data.purchaseRecord.enterpriseId)
          //   })
          // this.form.dailyDishOutLibararies.forEach(item => {
          //     item.plain = 'plain'
          // });
            if (this.form.dailyDishOutLibararies && this.form.dailyDishOutLibararies.length > 0) {
              this.clickTag(this.form.dailyDishOutLibararies[0])
            } else {
              this.currentType = {}
               this.showStorageQrCode = false
            }
          })
      })
  },
  methods: {
    init() {
      this.form = {}
      this.getDailyDishQrCodes()
    },
    getDailyDishQrCodes() {
      this.form.dailyDishOutLibararies = []
      getDailyDishQrCode(this.code).then(response => {
        this.$nextTick(()=>{
            this.form = response.data
            this.uploadPic.pictureList1 = handlePicturePath(this.form.dishesImg);
            this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
          //   this.$nextTick(function () {
          //     this.$refs.baseForm.initBaseForm(response.data.purchaseRecord.enterpriseId)
          //   })
          // this.form.dailyDishOutLibararies.forEach(item => {
          //     item.plain = 'plain'
          // });
            
            if (this.form.dailyDishOutLibararies && this.form.dailyDishOutLibararies.length > 0) {
              this.clickTag(this.form.dailyDishOutLibararies[0])
              this.$refs.storageQrCode.init()
            } else {
              this.currentType = {}
               this.showStorageQrCode = false
            }
          })
      })
    },
    buttonType(val){
      if (val.id === this.currentType.id) {
        return 'dark'
      } else {
        return 'plain'
      }
    },
    clickTag(val) {
        this.currentType = val
        this.buttonType(val)
        this.showStorageQrCode = true
        this.productIdentificationz = val.productIdentification
        this.lotNumberz = val.lotNumber
        this.typez = 'OUT_LIBRARY'
        // this.$refs.storageQrCode.init()
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
    sampleTypeFormat(row,column){
      return this.selectDictLabel(this.sampleTypeOptions, row.type);
    },
    mealTypeFormat(row,column){
      return this.selectDictLabel(this.mealTypeOptions, row.mealType);
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
<style scoped lang="scss">
@import '~@/views/bigscreen/components/mapInspectPanel/styles/main.scss';
.content_module{
  padding: 0 !important;
  .content_module_title{
    background: url("~@/assets/image/bigScreen/content_module_title_bg2.png") no-repeat ;
  }
}
</style>
