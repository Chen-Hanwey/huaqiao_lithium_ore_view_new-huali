<template>
  <div >
    <div class="exam-module" style="margin-top: 10px;">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" style="margin-top: 10px;">
        <el-form-item label="整改结果：" prop="rectificationResult" >
          <el-input
            type="textarea"
            v-model="form.rectificationResult"
            placeholder="请输入整改结果"
            @input="emitRectificationInfo()"
            v-if="modeType==1"
          />
          <div v-if="modeType==2">{{form.rectificationResult}}</div>
        </el-form-item>
        <el-form-item label="整改结果图片：" prop="rectificationResultImage" v-if="modeType==1" >
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
        <el-form-item label="整改结果图片：" prop="rectificationResultImage" v-if="modeType==2" >
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
      </el-form>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
export default {
  name: "RectificationResult",
  props: {
    modeType: {
      type: Number,
      default: 1
    },
    info:{}
  },
  data() {
    return {
      form: {
        rectificationRadio: '1',
      },
      uploadPic: {
        uploadImgUrl: process.env.VUE_APP_PICTURE_UPLOAD_PATH,
        uploadHeader: {Authorization: 'Bearer ' + getToken()},
        picDialogVisible: false,
        picDialogImageUrl: undefined,
        pictureList1: [],
        pictureFileList1: [],
        pictureList2: [],
        pictureFileList2: []
      },
      rules: {
        rectificationResult: [{required: true,message: '请输入整改结果'}]
      }
    }
  },
  created() {
    if(this.info){
      this.form = {...this.info}
    }

    if (this.modeType==1){  //整改时 清空上次整改上传的图片
      this.form.rectificationResultImage = undefined
    }

    if(this.modeType==2){
      this.uploadPic.pictureList1 = handlePicturePath(this.form.rectificationResultImage);
      this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
    }
  },
  methods: {
    formValid(){
      let flag = false
       this.$refs.form.validate(valid => {
         flag = valid
      })
      return flag
    },
    emitRectificationInfo(){
      this.$emit("on-change",this.form)
    },
    /** 记录图片上传成功 **/
    inspectionPicUpSuccess(response, file, fileList) {
      if (response.code === 200) {
        if (this.form.rectificationResultImage && this.form.rectificationResultImage !== '') {
          this.form.rectificationResultImage += ',' + response.url
        } else {
          this.form.rectificationResultImage = response.url
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
      this.form.rectificationResultImage = this.form.rectificationResultImage.replace(fileUrl + ",", '')
      this.form.rectificationResultImage = this.form.rectificationResultImage.replace("," + fileUrl, '')
      this.form.rectificationResultImage = this.form.rectificationResultImage.replace(fileUrl, '')
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
  }
}
</script>
<style scoped>
.exam-module{
  margin-top: 10px;
  padding:10px;
  border: 1px solid #dedede;
  background-color: #fcfcfc;
}
</style>
