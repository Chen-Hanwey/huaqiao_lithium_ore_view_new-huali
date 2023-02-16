import {
  listExam,
  getExam,
  delExam,
  addExam,
  updateExam,
  exportExam,
  exportStatistics,
  statistic,
  statisticHistory
} from "@/api/check/check";
import {
  listAll
} from "@/api/check/quesBank";
import moment from 'moment';
import $ from "jquery";
import {
  listQuestion
} from "@/api/check/question";
import examQuestions from '../template/checkQuestions';
import QuestionItem from '../template/questionsItem';

export default {
  components: {examQuestions, QuestionItem},
  name: 'Check',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 考试管理表格数据
      examList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon: '',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=新增，2=编辑，3=查看
      tableHeight: 450,
      pageList: [100, 200, 500, 1000],
      // 是否显示弹出层
      open: false,
      chapterDialogVisible: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        name: undefined,
        paperContent: undefined,
        examType: undefined,
        quesSortType: undefined,
        publishOrgCode: undefined,
        publishOrgName: undefined,
        examStartTime: undefined,
        examStartTimeRange: [],
        examEndTime: undefined,
        examEndTimeRange: [],
        totalPoint: undefined,
        passPoint: undefined,
        params: {
          examStartTimeBegin: undefined,
          examStartTimeEnd: undefined
        }
      },
      // 表单参数
      form: {
        id: undefined,
        name: undefined,
        paperContent: undefined,
        examType: undefined,
        quesSortType: '2',
        buildPaper: '1',
        publishOrgCode: undefined,
        publishOrgName: undefined,
        examStartTime: undefined,
        examEndTime: undefined,
        totalPoint: undefined,
        passPoint: undefined,
        remark: undefined,
        reAutoBuild: false,
        timeLimit: 60,
        questionCondition: {},
        rulePointValue: 0,
        quesBankIds: []
      },
      questionConditionForView: [{
        questionType: '1',
        questionNum: 0,
        questionPoint: 0
      }, {
        questionType: '2',
        questionNum: 0,
        questionPoint: 0
      }, {
        questionType: '3',
        questionNum: 0,
        questionPoint: 0
      }, {
        questionType: '4',
        questionNum: 0,
        questionPoint: 0
      }],
      // 表单校验
      rules: {
        name: [
          {required: true, message: "检查名称不能为空", trigger: "blur"}
        ],
        totalPoint: [
          {required: true, message: "总分不能为空", trigger: "blur"}
        ]
      },
      columnLabel: '',
      // 试卷题目排序方式字典数据
      examQuestionSortTypeDicList: [],
      // 试卷组卷方式字典数据
      examBuildPaperDicList: [],
      // 题目类型
      questionTypeDicList: [],
      // 考试状态字典数据
      examPaperStatusDicList: [],
      viewOpen: false,
      statisticView: false,
      exam: {statistics: {}},
      heightStyle: '',
      statisticsTableHeight: 450,
      statisticPapers: [],
      statisticPageList: [100, 200, 500, 1000],
      statisticTotal: 0,
      statisticParams: {
        id: undefined,
        pageNum: 1,
        pageSize: 100,
      },
      myExamStatusDicList: [],
      quesBankMultiLimit: 5,
      questionBankList: [],
      examTimeRange: [],
      showAddQuestionDialog: false,
      questionQueryParams: {
        quesBankId: undefined,
        quesType: undefined,
        keywords: undefined,
        pageNum: 1,
        pageSize: 100
      },
      questionTotal: 0,
      questionListLoading: false,
      questionList: [],
      questionTableHeight: 450,
      // 选择的单选题列表
      selectedSingleQuestions: [],
      // 选择的多选题列表
      selectedMultiQuestions: [],
      // 选择的判断题列表
      selectedJudgementQuestions: [],
      // 选择的填空题列表
      selectedBlankQuestions: [],
      // 为了防止切换分页时选中的数据消失，用这个变量记录一下所有选中的数据，其中key为页数，value为当前页选择的数据
      selectedAllQuestions: {},
      examQuestionView: false,
      selectedQuestionForView: undefined,
      singleQuetsionPoint: 0,
      multiQuetsionPoint: 0,
      judgementQuetsionPoint: 0,
      blankQuetsionPoint: 0,
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        this.tableHeight = window.innerHeight - 57 - 145;
      }
      this.openDialog();
      this.openDialogView();
      if (this.showAddQuestionDialog) {
        this.openQuestionDialog();
      }
    },
    examTimeRange: {
      deep: true,
      handler: function (val, oldval) {
        if (val) {
          this.form.examStartTime = val[0];
          this.form.examEndTime = val[1];
        } else {
          this.form.examStartTime = '';
          this.form.examEndTime = '';
        }
      }
    },
    // singleQuetsionPoint: {
    //   // 手动组卷时题目分数发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
    // multiQuetsionPoint: {
    //   // 手动组卷时题目分数发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
    // judgementQuetsionPoint: {
    //   // 手动组卷时题目分数发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
    // blankQuetsionPoint: {
    //   // 手动组卷时题目分数发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
    // selectedSingleQuestions: {
    //   // 手动组卷时题目发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
    // selectedMultiQuestions: {
    //   // 手动组卷时题目发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
    // selectedJudgementQuestions: {
    //   // 手动组卷时题目发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
    // selectedBlankQuestions: {
    //   // 手动组卷时题目发生变化，重新计算总分
    //   deep: true,
    //   handler: function (val, oldval) {
    //     if (val && this.form.buildPaper == '2') {
    //       this.calTotalPointForSelected();
    //     }
    //   }
    // },
  },
  created() {
    this.getList();
    this.getDicts("exam_build_paper").then(response => {
      this.examBuildPaperDicList = response.data;
    });
    this.getDicts("exam_question_sort_type").then(response => {
      this.examQuestionSortTypeDicList = response.data;
    });
    this.getDicts("question_type").then(response => {
      this.questionTypeDicList = response.data;
    });
    this.getDicts("exam_paper_status").then(response => {
      this.examPaperStatusDicList = response.data;
    });
    this.getDicts("exam_history_status").then(response => {
      this.myExamStatusDicList = response.data;
    });
    this.getBankList();
  },
  methods: {
    //将选项由json转为list
    questionOptionFormat(optionsJson) {
      let result = [];
      if (optionsJson && optionsJson != '') {
        let tmpOptions = JSON.parse(optionsJson);
        for (let key in tmpOptions) {
          let tmp = {
            option: key,
            optionDescribe: tmpOptions[key]
          }
          result.push(tmp);
        }
      }
      return result;

    },
    /** 查询考试管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.examStartTimeBegin = this.queryParams.examStartTimeRange && this.queryParams.examStartTimeRange.length > 0 ? this.queryParams.examStartTimeRange[0] : undefined;
      this.queryParams.params.examStartTimeEnd = this.queryParams.examStartTimeRange && this.queryParams.examStartTimeRange.length > 0 ? this.queryParams.examStartTimeRange[1] : undefined;

      listExam(this.queryParams).then(response => {
        this.examList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询检查库列表 **/
    getBankList() {
      listAll().then(response => {
        if (response.code === 200) {
          this.questionBankList = response.data;
        } else {
          this.msgError(response.msg);
        }
      })
    },
    /** 查询题目列表 **/
    getQuestionList() {
      this.questionListLoading = true;
      listQuestion(this.questionQueryParams).then(response => {
        this.questionList = response.rows;
        this.questionTotal = response.total;
        this.questionListLoading = false;
        // 查询数据之后查看当前分页内是否有选中的数据，如果有则选中
        if (this.selectedAllQuestions[this.questionQueryParams.pageNum]) {
          this.toggleSelection(this.selectedAllQuestions[this.questionQueryParams.pageNum]);
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        paperContent: undefined,
        examType: undefined,
        quesSortType: '1',
        buildPaper: '2',
        publishOrgCode: undefined,
        publishOrgName: undefined,
        examStartTime: undefined,
        examEndTime: undefined,
        totalPoint: undefined,
        passPoint: undefined,
        remark: undefined,
        timeLimit: 60,
        reAutoBuild: false,
        questionCondition: {},
        rulePointValue: 0,
        quesBankIds: []
      };
      examTimeRange: [];
      this.questionConditionForView = [{
        questionType: '1',
        questionNum: 0,
        questionPoint: 0
      }, {
        questionType: '2',
        questionNum: 0,
        questionPoint: 0
      }, {
        questionType: '3',
        questionNum: 0,
        questionPoint: 0
      }, {
        questionType: '4',
        questionNum: 0,
        questionPoint: 0
      }];
      this.selectedSingleQuestions = [];
      this.selectedMultiQuestions = [];
      this.selectedJudgementQuestions = [];
      this.selectedBlankQuestions = [];

      /*      this.singleQuetsionPoint = 0;
            this.multiQuetsionPoint = 0;
            this.judgementQuetsionPoint = 0;
            this.blankQuetsionPoint = 0;*/
      this.resetForm("form");
    },
    conditionToggle() {


      if (this.$refs['toggle-container'].style.display === 'none') {
        this.$refs['toggle-container'].style.display = 'inline-block';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        this.$refs['toggle-container'].style.display = 'none';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        name: undefined,
        paperContent: undefined,
        examType: undefined,
        quesSortType: undefined,
        publishOrgCode: undefined,
        publishOrgName: undefined,
        examStartTime: undefined,
        examStartTimeRange: [],
        examEndTime: undefined,
        examEndTimeRange: [],
        totalPoint: undefined,
        passPoint: undefined,
        params: {
          examStartTimeBegin: undefined,
          StartTimeEnd: undefined
        }
      };
      this.handleQuery();
    },
    handleQuestionQuery() {
      this.selectedAllQuestions = {};
      this.questionQueryParams.pageNum = 1;
      this.getQuestionList();
    },
    resetQuestionQuery() {
      this.questionQueryParams = {
        quesBankId: undefined,
        quesType: undefined,
        keywords: undefined,
        pageNum: 1,
        pageSize: 100
      }
      this.handleQuestionQuery();
    },
    renderHeader(h, {column, $index}, width) {
      let color = '#515a6e';
      let that = this;
      if (that.columnLabel != '' && that.columnLabel == column.label) {
        color = "#ff6600";
      }
      let style = {};
      if (width) {
        // width: 'calc(' + width + '% - 48px)'
        style = {
          textAlign: 'center',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color,
          width: width + "%"
        }
      } else {
        style = {
          textAlign: 'left',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color
        }
      }

      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
    //表格排序
    changeTableSort(column) {
      let order = '';
      if (column.order === 'ascending') {
        order = 'asc';
      } else if (column.order === 'descending') {
        order = 'desc';
      }
      if (order !== '') {
        this.queryParams.sort = column.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
        this.queryParams.order = order;
        this.queryParams.pageNum = 1;
        this.columnLabel = column.column.label;
      } else {
        this.queryParams.sort = '';
        this.queryParams.order = '';
        this.queryParams.pageNum = 1;
        this.columnLabel = '';
      }
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增检查项";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getExam(id).then(response => {
        this.form = response.data;
        this.title = "修改检查项";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
        this.examTimeRange = [this.form.examStartTime, this.form.examEndTime];
        // 手动组卷，解析题目
        if (this.form.questionWithType['3']) {
          this.selectedJudgementQuestions = this.form.questionWithType['3'];
          this.selectedJudgementQuestions.forEach(item => {
            item.answerArray = item.answer.split(",");
          })
        }
        this.open = true;
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids;
      this.form.id = id;
      this.viewOpen = true;
      this.title = "预览检查项";
      this.dialogIcon = 'el-icon-view';
    },
    handleDoubleClick(row, column, event) {
      this.handleView(row);
    },
    openDialog() {
      // $('.exam-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    openQuestionDialog() {
      // $('#question-list').parent().css('height', $(window).innerHeight() - 100).css('overflow-y', 'auto').css('padding', '10px 10px');
      // this.questionTableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    },
    openDialogView() {
      $('.exam-body').parent().css('height', $(window).innerHeight() - 70).css('top', 0).css('overflow-y', 'auto');
      if (this.statisticView) {
        let height = window.innerHeight - 290;
        this.heightStyle = 'height:' + height + 'px';
        this.statisticsTableHeight = height - 90;
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        console.log(valid);
        if (valid) {
          // 手动组卷，把选择的题目发送到后台
          this.form.questionList = [];
          if (this.selectedJudgementQuestions) {
            let flag = true;
            this.selectedJudgementQuestions.forEach(item => {
              if (item.answerArray && item.answerArray.length > 0) {
                item.answer = item.answerArray.join(",");
              } else {
                flag = false;
              }
            })
            if (flag == false) {
              this.msgError('请选择题目加分选项');
              return;
            }
            this.form.questionList = this.form.questionList.concat(this.selectedJudgementQuestions);
          }
          if (this.form.questionList.length == 0) {
            this.msgError('请选择题目');
            return;
          }
          if (this.form.id != undefined) {
            updateExam(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addExam(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
        type: "warning"
      }).then(function () {
        return delExam(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    // 题目类型字典翻译
    quesTypeFormat(questionType) {
      return this.selectDictLabel(this.questionTypeDicList, questionType);
    },
    // 计算试卷总分(手动组卷)
    calTotalPointForSelected() {
      this.form.totalPoint = 0;
      /*      let singleNum = this.selectedSingleQuestions.length;
            let multiNum = this.selectedMultiQuestions.length;
            let judgeNum = this.selectedJudgementQuestions.length;
            let blankNum = this.selectedBlankQuestions.length;*/
      this.selectedJudgementQuestions.forEach(item => {
        if (!item.quesPoint) {
          item.quesPoint = 1;
        }
        this.form.totalPoint += item.quesPoint;
      })
      /*if (this.singleQuetsionPoint) {
        let point = singleNum * this.singleQuetsionPoint;
        this.form.totalPoint += point;
      }
      if (this.multiQuetsionPoint) {
        let point = multiNum * this.multiQuetsionPoint;
        this.form.totalPoint += point;
      }
      if (this.judgementQuetsionPoint) {
        let point = judgeNum * this.judgementQuetsionPoint;
        this.form.totalPoint += point;
      }
      if (this.blankQuetsionPoint) {
        let point = blankNum * this.blankQuetsionPoint;
        this.form.totalPoint += point;
      }*/
      if (this.form.totalPoint && this.$refs.form) {
        // 校验总分是不是满足条件
        this.$refs.form.validateField('totalPoint');
      }
      /*      if (this.form.passPoint && this.$refs.form) {
              // 校验及格分是不是满足条件
              this.$refs.form.validateField('passPoint');
            }*/
    },
    // 校验及格分，不能大于总分
    passPointValidate(rule, value, callback) {
      if (value > this.form.totalPoint) {
        callback(new Error("及格分不能大于总分"));
      } else {
        callback();
      }
    },
    // 考试时长验证，不得小于10分钟
    timeLimitValidate(rule, value, callback) {
      if (value < 10) {
        callback(new Error("考试时长不得小于10分钟"));
      } else {
        callback();
      }
    },
    // 考试状态字典翻译
    examPaperStatusFormat(row, column) {
      return this.selectDictLabel(this.examPaperStatusDicList, row.examPaperStatus);
    },
    // 考试时间范围格式处理
    examTimeFormat(dateTime) {
      let time = moment(new Date(dateTime)).format('YYYY-MM-DD');
      return time;
    },
    handleStatistics(row) {
      this.statisticView = true;
      this.title = "考试统计";
      this.dialogIcon = 'el-icon-pie-chart';
      let that = this;
      statistic(row.id).then(r => {
        if (r && r.code == 200) {
          that.exam = r.data;
        } else {
          this.msgError(r.msg);
        }
      });
      this.statisticParams = {
        id: row.id,
        pageNum: 1,
        pageSize: 100
      }
      this.getStatisticPaperList();
    },
    getStatisticPaperList() {
      this.loading = true;
      this.statisticPapers = [];
      this.statisticTotal = 0;
      statisticHistory(this.statisticParams).then(response => {
        this.statisticPapers = response.rows;
        this.statisticTotal = response.total;
        this.loading = false;
      });
    },
    calculateUseTime(row) {
      let useTime = '';
      let examStartTime = new Date(row.startTime);
      let examSubmitTime = new Date(row.submitTime);
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
      return useTime;
    },
    renderStatusText(status) {
      return this.selectDictLabel(this.myExamStatusDicList, status);
    },
    /** 手动添加题目dialog **/
    addQuestions() {
      this.selectedAllQuestions = [];
      this.questionList = [];
      this.showAddQuestionDialog = true;
      this.resetQuestionQuery();
    },
    addQuestionsChapter() {
      this.chapterDialogVisible = true
    },
    chapterAdd() {
      this.chapterDialogVisible = false
    },
    /** 添加题目的确定事件 **/
    addQuestionOk() {
      // 根据题型放到不同的集合中
      let selectedQuestionList = [];
      for (let key in this.selectedAllQuestions) {
        selectedQuestionList = selectedQuestionList.concat(this.selectedAllQuestions[key]);
      }
      selectedQuestionList.forEach(item => {
        if (item.quesType == '1') {
          this.selectedSingleQuestions.push(item);
        } else if (item.quesType == '2') {
          this.selectedMultiQuestions.push(item);
        } else if (item.quesType == '3') {
          this.selectedJudgementQuestions.push(item);
        } else if (item.quesType == '4') {
          this.selectedBlankQuestions.push(item);
        }
      })
      this.showAddQuestionDialog = false;
      // 新增题目，重新计算总分
      this.calTotalPointForSelected();
    },
    /** 添加题目的取消事件 **/
    addQuestionCancel() {
      this.showAddQuestionDialog = false;
    },
    // 所属检查库翻译
    quesBankFormat(row, colunm) {
      let tmp = '';
      this.questionBankList.forEach(item => {
        if (item.id === row.quesBankId) {
          tmp = item.quesBankName;
        }
      });
      return tmp;
    },
    quesTypeFormatForTable(row, colunm) {
      return this.selectDictLabel(this.questionTypeDicList, row.quesType);
    },
    handleQuestionSelectionChange(selection) {
      // 按页数记录选中的数据
      this.selectedAllQuestions[this.questionQueryParams.pageNum] = selection;
    },
    /** 设置表格中选中的数据 **/
    toggleSelection(rows) {
      if (rows && rows.length > 0) {
        let tmpRows = [];
        rows.forEach(row => {
          this.questionList.forEach(question => {
            if (question.id == row.id) {
              tmpRows.push(question);
            }
          })
        })
        this.selectedAllQuestions[this.questionQueryParams.pageNum] = tmpRows;
        this.$nextTick(function () {
          tmpRows.forEach(row => {
            this.$refs.questionTable.toggleRowSelection(row, true);
          });
        });
      } else {
        this.$refs.questionTable.clearSelection();
      }
    },
    /** 判断题目列表中当前行能否被选中 **/
    checkQuestionSelectable(row, index) {
      return true;
    },
    /** 查看题目 **/
    handleQuestionView(row, questionType) {
      this.selectedQuestionForView = undefined;
      this.selectedQuestionForView = row;
      this.examQuestionView = true;
    },
    /** 向上调整题目位置 **/
    handleQuestionMoveUp(index, questionType) {
      if (questionType == '1') {
        // 单选
        if (index != 0) {
          this.$nextTick(function () {
            let tmp = this.selectedSingleQuestions[index];
            this.selectedSingleQuestions[index] = this.selectedSingleQuestions[index - 1];
            this.selectedSingleQuestions[index - 1] = tmp;
            let tmpArray = Object.assign([], this.selectedSingleQuestions);
            this.selectedSingleQuestions = tmpArray;
          });
        }
      } else if (questionType == '2') {
        // 多选
        if (index != 0) {
          this.$nextTick(function () {
            let tmp = this.selectedMultiQuestions[index];
            this.selectedMultiQuestions[index] = this.selectedMultiQuestions[index - 1];
            this.selectedMultiQuestions[index - 1] = tmp;
            let tmpArray = Object.assign([], this.selectedMultiQuestions);
            this.selectedMultiQuestions = tmpArray;
          });
        }
      } else if (questionType == '3') {
        // 判断
        if (index != 0) {
          this.$nextTick(function () {
            let tmp = this.selectedJudgementQuestions[index];
            this.selectedJudgementQuestions[index] = this.selectedJudgementQuestions[index - 1];
            this.selectedJudgementQuestions[index - 1] = tmp;
            let tmpArray = Object.assign([], this.selectedJudgementQuestions);
            this.selectedJudgementQuestions = tmpArray;
          });
        }
      } else if (questionType == '4') {
        // 填空
        if (index != 0) {
          this.$nextTick(function () {
            let tmp = this.selectedBlankQuestions[index];
            this.selectedBlankQuestions[index] = this.selectedBlankQuestions[index - 1];
            this.selectedBlankQuestions[index - 1] = tmp;
            let tmpArray = Object.assign([], this.selectedBlankQuestions);
            this.selectedBlankQuestions = tmpArray;
          });
        }
      }
    },
    /** 向下调整题目位置 **/
    handleQuestionMoveDown(index, questionType) {
      if (questionType == '1') {
        // 单选
        if (index != this.selectedSingleQuestions.length - 1) {
          this.$nextTick(function () {
            let tmp = this.selectedSingleQuestions[index];
            this.selectedSingleQuestions[index] = this.selectedSingleQuestions[index + 1];
            this.selectedSingleQuestions[index + 1] = tmp;
            let tmpArray = Object.assign([], this.selectedSingleQuestions);
            this.selectedSingleQuestions = tmpArray;
          });
        }
      } else if (questionType == '2') {
        // 多选
        if (index != this.selectedMultiQuestions.length - 1) {
          this.$nextTick(function () {
            let tmp = this.selectedMultiQuestions[index];
            this.selectedMultiQuestions[index] = this.selectedMultiQuestions[index + 1];
            this.selectedMultiQuestions[index + 1] = tmp;
            let tmpArray = Object.assign([], this.selectedMultiQuestions);
            this.selectedMultiQuestions = tmpArray;
          });
        }
      } else if (questionType == '3') {
        // 判断
        if (index != this.selectedJudgementQuestions.length - 1) {
          this.$nextTick(function () {
            let tmp = this.selectedJudgementQuestions[index];
            this.selectedJudgementQuestions[index] = this.selectedJudgementQuestions[index + 1];
            this.selectedJudgementQuestions[index + 1] = tmp;
            let tmpArray = Object.assign([], this.selectedJudgementQuestions);
            this.selectedJudgementQuestions = tmpArray;
          });
        }
      } else if (questionType == '4') {
        // 填空
        if (index != this.selectedBlankQuestions.length - 1) {
          this.$nextTick(function () {
            let tmp = this.selectedBlankQuestions[index];
            this.selectedBlankQuestions[index] = this.selectedBlankQuestions[index + 1];
            this.selectedBlankQuestions[index + 1] = tmp;
            let tmpArray = Object.assign([], this.selectedBlankQuestions);
            this.selectedBlankQuestions = tmpArray;
          });
        }
      }
    },
    /** 删除题目 **/
    handleQuestionDelete(index, questionType) {
      if (questionType == '1') {
        // 单选
        this.$nextTick(function () {
          this.selectedSingleQuestions.splice(index, 1);
          // 删除涉及到题目的变化，需要重新计算分数
          this.calTotalPointForSelected();
        });
      } else if (questionType == '2') {
        // 多选
        this.$nextTick(function () {
          this.selectedMultiQuestions.splice(index, 1);
          // 删除涉及到题目的变化，需要重新计算分数
          this.calTotalPointForSelected();
        });
      } else if (questionType == '3') {
        // 判断
        this.$nextTick(function () {
          this.selectedJudgementQuestions.splice(index, 1);
          // 删除涉及到题目的变化，需要重新计算分数
          this.calTotalPointForSelected();
        });
      } else if (questionType == '4') {
        // 填空
        this.$nextTick(function () {
          this.selectedBlankQuestions.splice(index, 1);
          // 删除涉及到题目的变化，需要重新计算分数
          this.calTotalPointForSelected();
        });
      }
    },

  },
  mounted() {
    this.$nextTick(function () {
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        this.tableHeight = window.innerHeight - 57 - 145;
      }
    });
    this.$nextTick(function () {
      this.questionTableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    });
  }
};
