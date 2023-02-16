<template>

  <el-dialog :visible.sync="reviewVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
             @opened="">
    <div slot="title">
      <span><i :class="dialogIcon"></i></span>
      <span> {{ title }}</span>
    </div>
    <div class="history-body"></div>
    <check-questions v-if="reviewVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                     :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
    <rectification ref="review_rec" v-if="reviewVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification>
    <!--      <rectification-result v-if="reviewVisible" :info="examHistoryDetail" :modeType="1" @on-change="rectificationChange"></rectification-result>-->
    <!--      <rectification-audit v-if="reviewVisible" :info="examHistoryDetail" :modeType="2"></rectification-audit>-->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitReview">确 定</el-button>
    </div>
  </el-dialog>

</template>

<script>
import {previewResult, rectification,} from "@/api/check/history";
import checkQuestions from "@/views/check/template/checkQuestions";
import Rectification from "@/views/check/template/rectification";
import {countMyWfOrder} from "@/api/myWork/wfOrder";
export default {
  name: "sazcReview",
  components: {checkQuestions,Rectification},
  data(){
    return {
      reviewVisible: false,
      examHistoryDetail: {},
      form: {},
      rectificationInfo:{
        rectificationItem: undefined,
        rectificationOpinion: undefined,
        rectificationImage: undefined,
        rectificationResult: undefined,
        rectificationResultImage: undefined,
        auditOpinion: undefined,
        rectificationRadio: undefined,
      },
    }
  },
  methods: {
    //--巡检--
    getInfo(id){
      previewResult(id).then(response=>{
        this.form.id = id;
        // this.form.paperContent = response.data.content;
        this.examHistoryDetail = response.data;
        this.reviewVisible = true;
        this.title = '食安自查巡检';
        this.dialogIcon = 'el-icon-view';
      });
    },
    rectificationChange(info){
      this.rectificationInfo.rectificationItem = info.rectificationItem
      this.rectificationInfo.rectificationOpinion = info.rectificationOpinion
      this.rectificationInfo.rectificationImage = info.rectificationImage
      this.rectificationInfo.rectificationResult = info.rectificationResult
      this.rectificationInfo.rectificationResultImage = info.rectificationResultImage
      this.rectificationInfo.auditOpinion = info.auditOpinion
      this.rectificationInfo.rectificationRadio = info.rectificationRadio
    },
    submitReview(){
      if (!this.$refs.review_rec.validate()){
        return
      }
      // this.form.rectificationOpinion=undefined
      this.form.rectificationResult = this.rectificationInfo.rectificationResult
      this.form.rectificationResultImage = this.rectificationInfo.rectificationResultImage

      this.form.rectificationItem = this.rectificationInfo.rectificationItem
      this.form.rectificationOpinion = this.rectificationInfo.rectificationOpinion
      this.form.rectificationImage = this.rectificationInfo.rectificationImage
      this.form.rectificationResult = this.rectificationInfo.rectificationResult
      this.form.rectificationResultImage = this.rectificationInfo.rectificationResultImage
      this.form.auditOpinion = this.rectificationInfo.auditOpinion
      this.form.rectificationRadio = this.rectificationInfo.rectificationRadio

      if (this.form.rectificationRadio == '1'){ //不整改 视为审核通过
        this.form.rectificationStatus = '2'
      }else if (this.form.rectificationRadio == '2'){ //需要整改 则状态调整为待整改
        this.form.rectificationStatus = '3'
      }
      rectification(this.form).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.reviewVisible = false;
          this.form = {}
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
