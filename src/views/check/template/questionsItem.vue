<template>
  <div class="app-container">
    <div class="exam-item-title">{{'(' + questionFormat.quesType + ')'}}</div>
    <div class="exam-item-title">{{questionFormat.quesDetail}}</div>
    <div class="option-items" v-if="questionFormat.optionsForView.length > 0">
      <div class="option-item" v-for="(item,index) in questionFormat.optionsForView" :key="item.option">
        <span>{{item.option + '、' + item.optionDescribe}}</span>
      </div>
    </div>
    <div class="padding-10-20">备注：
      <span>{{questionFormat.analysis || '无'}}</span>
    </div>
  </div>
</template>

<script>

  export default {
    name: "questionItem",
    props: {
      questionDetail: {
        type: Object
      },
      questionTypeDicList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        questionFormat: {
          quesType: undefined,
          quesDetail: undefined,
          answer: undefined,
          analysis: undefined,
          optionsForView: []
        }
      };
    },
    created() {
      this.questionFormatFromProp();
    },
    methods: {
      // 题目类型字典翻译
      quesTypeFormat(questionType) {
        return this.selectDictLabel(this.questionTypeDicList, questionType);
      },
      // 将数据转换成标准格式
      questionFormatFromProp() {
        this.reset();
        this.questionFormat.quesType = this.quesTypeFormat(this.questionDetail.quesType);
        this.questionFormat.quesDetail = this.questionDetail.quesDetail;
        // 标准化选项列表
        if (this.questionDetail.options) {
          let tmpOptions = JSON.parse(this.questionDetail.options);
          for (let key in tmpOptions) {
            let tmp = {
              option: key,
              optionDescribe: tmpOptions[key]
            }
            this.questionFormat.optionsForView.push(tmp);
          }
        }
        // 答案数据格式化
        let tmpAnswer = JSON.parse(this.questionDetail.answer);
        let ans = '';
        if(this.questionDetail.quesType == '1' || this.questionDetail.quesType == '2' ){
          for(let key in tmpAnswer){
            ans+=key;
          }
        }else{
          ans=tmpAnswer.answer;
        }
        this.questionFormat.answer = ans;
        this.questionFormat.analysis = this.questionDetail.analysis;
      },
      reset() {
        this.questionFormat = {
          quesType: undefined,
          quesDetail: undefined,
          answer: undefined,
          analysis: undefined,
          optionsForView: []
        }
      }
    },
    mounted() {

    }
  }
</script>
<style scoped>

  .padding-10-20{
    padding: 10px 20px;
  }

  .exam-item-title{
    width: (100% - 90px);
    font-size: 14px;
    padding: 10px 20px;
    font-weight: 600;
    display: block;
  }

  .option-items{
    padding: 0 40px;
  }
  .option-item{
    padding: 5px 0;
  }

</style>
