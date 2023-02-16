<template>

  <el-dialog :visible.sync="rectificationAuditVisible"  :close-on-click-modal="false" class="customForm _baseForm_big"
             @opened="">
    <div slot="title">
      <span><i :class="dialogIcon"></i></span>
      <span> {{ title }}</span>
    </div>
    <div class="history-body"></div>
    <check-questions :operation-name="examHistoryDetail.operationName" v-if="rectificationAuditVisible" :examId="form.id" :examHistory="examHistoryDetail" :showItems="false"
                     :showAnswer="true" :showUserAnswer="true" ref="currentExam"></check-questions>
    <rectification  v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2" @on-change="rectificationChange"></rectification>
          <rectification-result v-if="rectificationAuditVisible" :info="examHistoryDetail" :modeType="2" @on-change="rectificationChange"></rectification-result>
          <rectification-audit ref="audit1" v-if="rectificationAuditVisible" :info="examHistoryDetail" @on-change="rectificationChange" :modeType="1"></rectification-audit>
    <processList :wfOrderType="getWorkOrderTypeByExamId(examId)" :wfOrderEntityId="form.id"></processList>
    <div slot="footer" class="dialog-footer">
<!--      <el-button type="primary" @click="rectificationReject">驳回</el-button>-->
<!--      <el-button type="primary" @click="rectificationPass">通过</el-button>-->
      <el-button type="primary" @click="rectificationPassOrReject">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>

</template>

<script>
import {audit, previewResult, rectification,} from "@/api/check/history";
import checkQuestions from "@/views/check/template/checkQuestions";
import Rectification from "@/views/check/template/rectification";
import rectificationAudit from "@/views/check/template/rectificationAudit";
import rectificationResult from "@/views/check/template/rectificationResult";
import processList from "@/views/components/todoComponents/processList";
import {countMyWfOrder} from "@/api/myWork/wfOrder";
export default {
  name: "sazcAudit",
  components: {checkQuestions,Rectification,rectificationAudit,rectificationResult,processList},
  data(){
    return {
      rectificationAuditVisible: false,
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
      examId: 0,
      wfOrderTypeOptions: []
    }
  },
  methods: {
    rectificationPassOrReject(){
      if (!this.$refs.audit1.validate()){
        return
      }
      console.log(this.rectificationInfo.rectificationStatus)
      if (this.rectificationInfo.rectificationStatus == '3'){
        this.rectificationReject()
      }else if (this.rectificationInfo.rectificationStatus == '5'){
        this.rectificationPass()
      }
    },
    cancel() {
      this.rectificationAuditVisible = false;
      this.reset();
    },
    getInfo(id,examId){
      this.examId = examId
      previewResult(id).then(response=>{
        this.form.id = id;
        // this.form.paperContent = response.data.content;
        this.examHistoryDetail = response.data;
        this.rectificationAuditVisible = true;
        this.title = examId == '3' ? '食安自查审核' : examId == '1' ?
          '餐饮量化审核' : examId == '2' ? '信用评定审核' : examId == '4' ? '食安监督审核' : '';
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
      this.rectificationInfo.rectificationStatus = info.rectificationStatus
    },
    rectificationReject(){
      if (!this.$refs.audit1.validate()){
        return
      }
      this.form.auditOpinion = this.rectificationInfo.auditOpinion
      this.form.rectificationStatus = '3' //审核不通过状态仍未待整改
      audit({...this.form,examId: this.examId}).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.rectificationAuditVisible = false;
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
    rectificationPass(){
      if (!this.$refs.audit1.validate()){
        return
      }
      this.form.rectificationStatus = '5'
      this.form.auditOpinion = this.rectificationInfo.auditOpinion
      audit({...this.form,examId: this.examId}).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.rectificationAuditVisible = false;
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
  },
  computed: {
    getWorkOrderTypeByExamId(){
      return function (examId) {
        switch (examId){
          case 1 :
            return 4
          case 2:
            return 5
          case 3 :
            return 3
          case 4 :
            return 6
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
