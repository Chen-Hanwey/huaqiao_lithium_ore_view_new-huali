<template>
    <div class="">
      <div class="exam-header">
        <div class="exam-title" >{{exam.name}}</div>
        <el-row v-if="!showUserAnswer">
          <el-col  style="text-align: left" :span="8">被检单位：{{enterpriseName}}</el-col>
          <el-col  style="text-align: center" :span="8">检查总分：{{exam.totalPoint}}分</el-col>
<!--          <el-col style="text-align: center" :span="6">通过分数：{{exam.passPoint}}分</el-col>-->
          <el-col  style="text-align: right" :span="8">检查项数量：{{exam.totalCount}}项</el-col>
        </el-row>
        <el-row v-if="showUserAnswer">
<!--          <el-col style="text-align: center" :span="5">通过分数：{{exam.passPoint}}分</el-col>-->
<!--          <el-col  style="text-align: left" :span="8">检查总分：{{exam.totalPoint}}分</el-col>-->
          <el-col  style="text-align: left" :span="8">检查得分：{{examHistory.myPoint}}分</el-col>
<!--          <el-col style="text-align: center" :span="5">通过项目数：{{exam.correctCount}}<span style="color: #909090;">/{{exam.totalCount}}</span></el-col>-->
          <el-col  style="text-align: center" :span="8">检查时间：{{examHistory.submitTime}}</el-col>
<!--          <el-col :span="5">考试用时：{{exam.useTime}}</el-col>-->
          <el-col  style="text-align: center" :span="8" v-show="operationName">单位：{{operationName}}</el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <div class="text-oneLine" style="text-align: left" :title="exam.remark" > 检查说明：{{exam.remark}}</div>
        </el-row>
        <!-- 餐饮量化水印 -->
        <div v-if="showUserAnswer&&checkType&&checkType=='cylh'&&cylhResultImgSrc!=''" style="position: absolute;top: 10px;right: 20px;">
          <img :src="cylhResultImgSrc" style="width: 60px;">
        </div>
      </div>
      <el-form label-width="120px">
        <div class="exam-module" v-for="(val, key, i) in pageContent" v-if="pageContent[key].length > 0" :key="'module' + i">
  <!--        <div class="exam-module-title">{{getTitle(key)}}<span class="module-title-des">{{getTitleDes(key)}}</span></div>-->
          <div class="exam-items" v-for="(item, index) in pageContent[key]" :key="'single' + index">
            <span class="exam-item-title">{{index + 1}}、{{item.content}}</span>
            <span v-if="!showUserAnswer" class="item-point">本项{{item.point}}分</span>
            <span v-if="showUserAnswer" class="item-point">{{item.myAnswerStatus?item.point:0}}分<span style="color: #909090;">/{{item.point}}分</span></span>
            <div v-if="key == '1'">
              <div class="option-items">
                <div class="option-item" v-for="(singleItemVal, singleItemKey,  singleItemIndex) in item.options" :key="'singleOptionItem' + singleItemIndex">{{singleItemKey}}、{{singleItemVal}}</div>
              </div>
              <el-radio-group v-if="showItems" v-model="customAnswer[item.questionId]" size="small" class="padding-10-20">
                <el-radio :label="singleItemKey" v-for="(singleItemVal, singleItemKey,  singleItemIndex) in item.options"
                          :key="'singleItem' + singleItemIndex" border>{{singleItemKey}}</el-radio>
              </el-radio-group>
            </div>
            <div v-if="key == '2'">
              <div class="option-items">
                <div class="option-item" v-for="(multiItemVal, multiItemKey,  multiItemIndex) in item.options" :key="'multiOptionItem' + multiItemIndex">{{multiItemKey}}、{{multiItemVal}}</div>
              </div>
              <el-checkbox-group v-if="showItems" v-model="customAnswer[item.questionId]" class="padding-10-20">
                <el-checkbox v-for="(multiItemVal, multiItemKey,  multiItemIndex) in item.options" :key="'multiOptionItem' + multiItemIndex" :label="multiItemKey" border>{{multiItemKey}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="key == '3'" >
              <el-form-item label="检查结果：" v-if="showItems" >
                <el-radio-group v-model="customAnswer[item.questionId]" size="small" >
                  <el-radio :label="singleItemVal" v-for="(singleItemVal, singleItemKey, singleItemIndex) in item.options"
                            :key="'singleItem' + singleItemIndex" border>{{singleItemVal}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-if="key == '4'">
              <el-input v-if="showItems" v-model="customAnswer[item.questionId]" placeholder="请输入答案" class="exam-input"></el-input>
            </div>
            <div class="" v-if="showUserAnswer" >
                <div style="width:120px;" class="el-form-item__label">检查结果：</div>
                <div class="el-form-item__content" style="margin-left: 120px;">
                  <span style="color: green" v-if="item.myAnswer=='通过'">{{item.myAnswer}}</span>
                  <span style="color: red" v-else-if="item.myAnswer=='不通过'">{{item.myAnswer}}</span>
                  <span  v-else>{{item.myAnswer}}</span>
<!--                <i class="el-icon-success" v-if="item.myAnswerStatus" style="font-size: 16px;margin-left: 5px;color: #4caf50;"></i>-->
<!--                <i class="el-icon-error" v-if="!item.myAnswerStatus" style="font-size: 16px;margin-left: 5px;color: #ff3a00;"></i>-->
                </div>
              </div>
            <div v-if="item.analysis&&item.analysis!=''" >
              <div style="width:120px;" class="el-form-item__label">备注：</div>
              <div class="el-form-item__content" style="margin-left: 120px;">{{item.analysis}}</div>
            </div>
          </div>
          <div v-if="showItems" class="exam-items" style="padding-top: 25px">
          <el-form-item label="检查日期：" prop="expireDate" >
            <el-date-picker clearable size="small" class="form-item"
                            :picker-options="dateOptions1"
                            v-model="submitTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择到期日期">
            </el-date-picker>
          </el-form-item>
          </div>
        </div>
<!--        <div>-->

<!--        </div>-->
      </el-form>
    </div>
</template>

<script>
  import {getExam} from "@/api/check/check";
  import moment from 'moment';
  export default {
    name: "checkQuestions",
    props: {
      examId: '',
      paperContentJson: '',
      showAnswer: false,
      showItems: true,
      showUserAnswer: false,
      examHistory: undefined,
      enterpriseName:'',
      operationName: '',
      checkType:''
    },
    data () {
        return {
          questionTypeDicList: [],
          exam: {},
          pageContent: {},
          customAnswer: {},
          examResultImgSrc: '',
          cylhResultImgSrc: '',
          submitTime: new Date(),
          dateOptions1: {
            disabledDate(time){
              let d = new Date()
              // d.setDate(d.getDate() - 1)
              return time > d;
            }
          }
        };
    },
    created () {
      this.getDicts("question_type").then(response => {
        this.questionTypeDicList = response.data;
      });
      this.initExam();
    },
    methods: {
      initExam () {
        let that = this;
        if(this.examHistory){
          this.exam = this.examHistory.exam;
          this.customAnswer.examId = this.examHistory.examId;
          let pageContentJson = this.examHistory.content;
          let pageContent = JSON.parse(pageContentJson);
          this.pageContent = pageContent;
          let totalCount = 0;
          let correctCount = 0;
          let myPoint = 0;
          this.exam.questionCondition = {};
          for (let index in pageContent) {
            this.exam.questionCondition[index] = [pageContent[index].length];
            totalCount += pageContent[index].length;
            for (let i = 0; i < pageContent[index].length; i++) {
              /*if (pageContent[index][i].answer) {
                pageContent[index][i].answer = JSON.parse(pageContent[index][i].answer);
              }*/
              if (pageContent[index][i].questionType != '4' && pageContent[index][i].options) {
                pageContent[index][i].options = JSON.parse(pageContent[index][i].options);
              }
              // 初始化一下答案集合
              if (pageContent[index][i].questionType == '2') {
                this.$set(this.customAnswer, pageContent[index][i]['questionId'], []);
              } else {
                this.$set(this.customAnswer, pageContent[index][i]['questionId'], '');
              }
              if (pageContent[index][i].myAnswerStatus) {
                correctCount=correctCount+1;
              }
            }
          }
          this.exam.totalCount = totalCount;
          this.exam.correctCount = correctCount;
/*          let useTime = '';
          let examStartTime = new Date(this.examHistory.startTime);
          let examSubmitTime = new Date(this.examHistory.submitTime);
          let duration = examSubmitTime.getTime() - examStartTime.getTime();
          let formatStr = '';
          if (parseInt(duration / 3600000) > 0) { // 超过小时
            formatStr = "H小时m分s秒";
          } else if (parseInt(duration / 60000) > 0) {
            formatStr = "m分s秒";
          } else {
            formatStr = "s秒";
          }
          useTime = moment('2020-01-01 00:00:00').add(duration, 'milliseconds').format(formatStr);
          this.exam.useTime = useTime;*/
          /*if (this.examHistory.myPoint >= this.exam.passPoint) {
            this.examResultImgSrc = require('./image/pass.png');
          } else {
            this.examResultImgSrc = require('./image/notpass.png');;
          }*/
          //餐饮量化
          if(this.checkType&&this.checkType=='cylh'){
            console.log(0<=this.examHistory.myPoint&&this.examHistory.myPoint<=6)
            if(this.examHistory.myPoint!=undefined){
              if(0<=this.examHistory.myPoint&&this.examHistory.myPoint<=6){
                this.cylhResultImgSrc = require('./image/cylh_1.png');
              }
              if(6<this.examHistory.myPoint&&this.examHistory.myPoint<=15){
                this.cylhResultImgSrc = require('./image/cylh_2.png');
              }
              if(15<this.examHistory.myPoint&&this.examHistory.myPoint<=30){
                this.cylhResultImgSrc = require('./image/cylh_3.png');
              }
            }
          }
        }else{
          getExam(this.examId).then(response => {
            that.exam = response.data;
            that.customAnswer.examId = that.exam.id;
            let pageContentJson = this.paperContentJson || that.exam.paperContent;
            let pageContent = JSON.parse(pageContentJson);
            that.pageContent = pageContent;
            let totalCount = 0;
            for (let index in pageContent) {
              totalCount += pageContent[index].length;
              for (let i = 0; i < pageContent[index].length; i++) {
                if (pageContent[index][i].answer) {
                  pageContent[index][i].answer = JSON.parse(pageContent[index][i].answer);
                }
                if (pageContent[index][i].questionType != '4' && pageContent[index][i].options) {
                  pageContent[index][i].options = JSON.parse(pageContent[index][i].options);
                }
                // 初始化一下答案集合
                if (pageContent[index][i].questionType == '2') {
                  // that.customAnswer[pageContent[index][i]['questionId']] = [];
                  that.$set(that.customAnswer, pageContent[index][i]['questionId'], []);
                } else {
                  // that.customAnswer[pageContent[index][i]['questionId']] = '';
                  that.$set(that.customAnswer, pageContent[index][i]['questionId'], '');
                }
              }
            }
            that.exam.totalCount = totalCount;
          });
        }
      },
      getTitle (key) {
        for (let j = 0; j < this.questionTypeDicList.length; j++) {
          if (key == this.questionTypeDicList[j].dictValue) {
            return this.questionTypeDicList[j].dictLabel;
          }
        }
      },
      getTitleDes (key) {
        let questionCondition = this.exam.questionCondition;
        // if (key == '2') {
        //   return "（共" + questionCondition[key][0] + "题，" + questionCondition[key][0] * questionCondition[key][1] + "分，多选、错选或者不选均不得分）"
        // } else if (key == '4') {
        //   return "（共" + questionCondition[key][0] + "题，" + questionCondition[key][0] * questionCondition[key][1] + "分，填错或者不填均不得分）"
        // } else {
        //   return "（共" + questionCondition[key][0] + "题，" + questionCondition[key][0] * questionCondition[key][1] + "分，错选或者不选均不得分）"
        // }
        if (key == '2') {
          return "（共" + questionCondition[key][0] + "题，多选、错选或者不选均不得分）"
        } else if (key == '4') {
          return "（共" + questionCondition[key][0] + "题，填错或者不填均不得分）"
        } else {
          return "（共" + questionCondition[key][0] + "题，错选或者不选均不得分）"
        }
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
  .padding-10-20{
    padding: 10px 20px;
  }
  .exam-header{
    padding: 0 10px 10px;
    border: 1px solid #dedede;
    background-color: #fcfcfc;
    position: relative;
  }
  .exam-title{
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    padding: 20px 0 10px;
    margin-bottom:10px;
  }
  .exam-module{
    margin-top: 10px;
    padding:10px;
    border: 1px solid #dedede;
    background-color: #fcfcfc;
  }
  .exam-module-title{
    font-size: 16px;
    padding: 10px;
    font-weight: 600;
    background-color: #e2e2e2;
  }
  .module-title-des{
    font-size: 14px;
    font-weight: 500;
  }
  .exam-items:not(:first-child){
    border-top: 1px solid #dedede;
  }
  .exam-items{
    position: relative;
  }
  .exam-item-title{
    width: calc(100% - 90px);
    font-size: 14px;
    padding: 10px 20px;
    font-weight: 600;
    display: block;
  }
  .item-point{
    display: block;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 14px;
    color: #2a93ff;
  }
  .option-items{
    padding: 0 40px;
  }
  .option-item{
    padding: 5px 0;
  }
  .exam-input{
    width: 360px;
    margin: 5px 20px;
  }
  .color-red{
    color: red;
  }
  .color-blue{
    color: #1c84c6;
  }

  .text-oneLine {
    overflow: hidden; /*自动隐藏文字*/
    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
    white-space: nowrap; /*强制不换行*/
    width: 60em; /*不允许出现半汉字截断*/
  }
</style>
