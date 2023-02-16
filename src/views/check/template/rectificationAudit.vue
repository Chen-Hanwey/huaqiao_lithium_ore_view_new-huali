<template>
  <div>
    <div class="exam-module" style="margin-top: 10px;" v-if="(modeType==1)||(modeType==2&&info.auditOpinion&&info.auditOpinion!='')">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" style="margin-top: 10px;">
        <el-form-item label="审核意见：" prop="auditOpinion" >
          <el-input
            type="textarea"
            v-model="form.auditOpinion"
            placeholder="请输入审核意见："
            @input="emitRectificationInfo()"
            v-if="modeType==1"
          />
          <div v-if="modeType==2" style="color: red;">{{form.auditOpinion}}</div>
        </el-form-item>
        <el-form-item label="审核结果：" prop="rectificationStatus" v-if="modeType == 1">
          <el-radio-group v-model="form.rectificationStatus" @change="emitRectificationInfo()">
            <el-radio :label="'5'" >通过</el-radio>
            <el-radio :label="'3'">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核结果：" prop="rectificationStatus" v-if="modeType == 2"
                      class="custom-form-item">
          {{ info.rectificationStatus == 4 ? '待审核' : info.rectificationStatus == 5 ? '通过' : '未知' }}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
export default {
  name: "RectificationAudit",
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
        auditOpinion:[{required: true,message: '请输入审核意见'}],
        rectificationStatus: [{required: true,message: '请选择审核结果'}]
      }
    }
  },
  created() {
    if(this.info){
      this.form = {...this.info}
      this.form.rectificationStatus = undefined
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
