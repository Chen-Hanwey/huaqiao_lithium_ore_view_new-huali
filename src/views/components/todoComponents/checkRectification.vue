<template>
  <el-dialog :visible.sync="rectificationVisible"  :close-on-click-modal="false" class="customForm _baseForm_big">
    <div slot="title">
      <span><i :class="dialogIcon"></i></span>
      <span> {{ title }}</span>
    </div>
    <div class="history-body"></div>
    <check-questions :operation-name="examHistoryDetail.operationName" v-if="rectificationVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                     :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
    <rectification v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2"></rectification>
    <rectification-result ref="rec_res" v-if="rectificationVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-result>
    <rectification-audit v-if="rectificationVisible" :info="examHistoryDetail" :modeType="2" @on-change="rectificationChange"></rectification-audit>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitRectification">提交整改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import checkQuestions from "@/views/check/template/checkQuestions";
import Rectification from "@/views/check/template/rectification";
import RectificationResult from "@/views/check/template/rectificationResult";
import RectificationAudit from "@/views/check/template/rectificationAudit";
import {previewResult, rectification} from "@/api/check/history";
import {countMyWfOrder} from "@/api/myWork/wfOrder";
export default {
  name: "checkRectification",
  components: {
    checkQuestions, Rectification, RectificationResult, RectificationAudit
  },
  data(){
    return {
      rectificationVisible: false,
      form: {},
      examHistoryDetail: {},
      rectificationInfo:{
        rectificationItem: undefined,
        rectificationOpinion: undefined,
        rectificationImage: undefined,
        rectificationResult: undefined,
        rectificationResultImage: undefined,
        auditOpinion: undefined,
        rectificationRadio: undefined,
      },
      examId: 0
    }
  },
  methods: {
    getInfo(id,examId){
      console.log(111)
      this.examId = examId
      previewResult(id).then(response=>{
        this.form.id = id;
        // this.form.paperContent = response.data.content;
        this.examHistoryDetail = response.data;
        this.rectificationVisible = true;
        this.title = examId == '3' ? '食安自查整改' : examId == '1' ?
          '餐饮量化整改' : examId == '2' ? '信用评定整改' : examId == '4' ? '食安监督整改' : '';
        this.dialogIcon = 'el-icon-view';
      });
    },
    rectificationChange(info){
      // this.rectificationInfo.rectificationItem = info.rectificationItem
      // this.rectificationInfo.rectificationOpinion = info.rectificationOpinion
      // this.rectificationInfo.rectificationImage = info.rectificationImage
      this.rectificationInfo.rectificationResult = info.rectificationResult
      this.rectificationInfo.rectificationResultImage = info.rectificationResultImage
      // this.rectificationInfo.auditOpinion = info.auditOpinion
      // this.rectificationInfo.rectificationRadio = info.rectificationRadio
      // this.rectificationInfo.rectificationStatus = info.rectificationStatus
    },
    submitRectification(){
      if (!this.$refs.rec_res.formValid()){
        return
      }
      // this.form.rectificationOpinion=undefined
      this.form.rectificationResult = this.rectificationInfo.rectificationResult
      this.form.rectificationResultImage = this.rectificationInfo.rectificationResultImage

      this.form.rectificationStatus = '4'
      rectification({...this.form,examId: this.examId}).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.form = {}
          this.rectificationVisible = false;
          this.$parent.getList();
          countMyWfOrder().then(res=> {
            if (res.code == 200){
              this.$store.dispatch('app/setTodoNum', res.data);
            }
          });
        } else {
          this.msgError(response.msg);
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
