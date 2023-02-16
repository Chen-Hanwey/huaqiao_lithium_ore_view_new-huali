<template>
  <div class="">
    <div class="exam-module">
    <div>
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="是否需要整改：" prop="rectificationRadio" >
          <template v-if="modeType==1">
            <el-radio @change="emitRectificationInfo" v-model="form.rectificationRadio" label="1">不需要</el-radio>
            <el-radio @change="emitRectificationInfo" v-model="form.rectificationRadio" label="2">需要</el-radio>
          </template>
          <template v-if="modeType==2">
            <template v-if="form.rectificationRadio==1">
              不需要
            </template>
            <template v-if="form.rectificationRadio==2">
              需要
            </template>
          </template>
        </el-form-item>
        <el-form-item label="待整改项：" v-if="rectificationOpen" prop="rectificationItem" >
          <el-input
            type="textarea"
            v-model="form.rectificationItem"
            placeholder="请输入待整改项"
            @input="emitRectificationInfo()"
            v-if="modeType==1"
          />
          <div v-if="modeType==2">{{form.rectificationItem}}</div>
        </el-form-item>
        <el-form-item label="待整改意见：" v-if="rectificationOpen" prop="rectificationOpinion" >
          <el-input
            type="textarea"
            v-model="form.rectificationOpinion"
            placeholder="请输入待整改意见"
            @input="emitRectificationInfo()"
            v-if="modeType==1"
          />
          <div v-if="modeType==2">{{form.rectificationOpinion}}</div>
        </el-form-item>
        <el-form-item label="待整改图片：" prop="rectificationImage" v-if="modeType==1 && rectificationOpen">
          <el-upload :action="uploadPic.uploadImgUrl"
                     list-type="picture-card"
                     :file-list="uploadPic.pictureFileList1"
                     :on-success="inspectionPicUpSuccess"
                     :on-remove="inspectionPicRemove"
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
        <el-form-item label="待整改图片：" prop="inspectionPicture" v-if="modeType==2 && rectificationOpen" >
          <el-image v-if="uploadPic.pictureList1&&uploadPic.pictureList1.length==0"
                    style="min-width: 100px;min-height: 100px;margin-right: 15px">
            <div slot="error" class="image-slot" style="text-align: center">
              <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none"> 暂无图片</i>
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
      </el-form>
    </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
export default {
  name: "Rectification",
  props: {
    modeType: {
      type: Number,
      default: 1
    },
    info:{}
  },
  data() {
    return {
      form:{
        rectificationRadio:'1',
      },
      uploadPic:{
        uploadImgUrl: process.env.VUE_APP_PICTURE_UPLOAD_PATH,
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        picDialogVisible:false,
        picDialogImageUrl:undefined,
        pictureList1:[],
        pictureFileList1:[],
        pictureList2:[],
        pictureFileList2:[]
      },
      rules: {
        rectificationRadio: [
          { required: true, message: "是否需要整改不能为空", trigger: "blur" }
        ],
        rectificationItem: [
          { required: true, message: "待整改项不能为空", trigger: "blur" }
        ],
        rectificationOpinion: [
          { required: true, message: "待整改意见不能为空", trigger: "blur" }
        ],

      }
    }
  },
  created() {
    if(this.info){
      this.form = this.info
    }
    if(this.modeType==2){
      this.uploadPic.pictureList1 = handlePicturePath(this.form.rectificationImage);
      this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
    }
  },
  computed: {
    rectificationOpen(){
      return this.form.rectificationRadio == '2'
    }
  },
  methods: {
    emitRectificationInfo(){
      this.$emit("on-change",this.form)
    },
    /** 记录图片上传成功 **/
    inspectionPicUpSuccess(response, file, fileList) {
      if (response.code === 200) {
        if (this.form.rectificationImage && this.form.rectificationImage !== '') {
          this.form.rectificationImage += ',' + response.url
        } else {
          this.form.rectificationImage = response.url
        }
        this.uploadPic.pictureFileList1 = fileList
        this.emitRectificationInfo();
      } else {
        this.msgError(response.msg)
      }
    },
    /** 图片上传失败 **/
    picUploadErr(err) {

    },
    /** 图片上传过程中的钩子 **/
    picUpProcess(event, file, fileList) {

    },
    beforePicUpload(file) {
      let isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isLt2M
    },
    /** 事件图片删除 **/
    inspectionPicRemove(file, fileList) {
      let fileUrl = file.response ? file.response.url : file.url.replace(process.env.VUE_APP_PICTURE_PATH, '')
      this.form.rectificationImage = this.form.rectificationImage.replace(fileUrl + ",", '')
      this.form.rectificationImage = this.form.rectificationImage.replace("," + fileUrl, '')
      this.form.rectificationImage = this.form.rectificationImage.replace(fileUrl, '')
      this.uploadPic.pictureFileList1 = fileList
    },
    /** 图片大图查看 **/
    handlePictureCardPreview(file) {
      this.uploadPic.picDialogImageUrl = file.url
      this.uploadPic.picDialogVisible = true
    },
    // 预览大图时定位到当前选中的图片
    getCurrentPreviewImg(url){
      // return urls.slice(index).concat(urls.slice(0,index));
      this.uploadPic.picDialogImageUrl = url
      this.uploadPic.picDialogVisible = true
    },
    validate() {
      let vali = false;
      this.$refs["form"].validate(valid => {
       if(valid){
         vali = true;
       }else{
         vali = false;
       }
      })
      return vali;
    },
    formRefresh(){
      this.form = {rectificationRadio:'1'}
    }
  },
}
</script>

<style scoped>
/*.exam-items{*/
/*  border-top: 1px solid #dedede;*/
/*  position: relative;*/
/*}*/
.exam-module{
  margin-top: 10px;
  padding:10px;
  border: 1px solid #dedede;
  background-color: #fcfcfc;
}
</style>
