import {
  listHistory,
  getHistory,
  delHistory,
  addHistory,
  updateHistory,
  exportHistory,
  startExam,
  finishExam,
  previewResult,
  rectification,
  audit
} from "@/api/check/history";
import moment from 'moment';
import $ from "jquery";
import {getBaseFormData} from "@/api/operationManage/operationManage";
import {parseTime} from "../../../utils/ruoyi";


export default {
  name: 'SazcCheck',
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
      // 考试历史表格数据
      historyList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon: '',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=新增，2=编辑，3=查看 4=开始考试 5=巡检  6=审核
      tableHeight: 450,
      pageList: [100, 200, 500, 1000],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        examId: this.examId,
        content: undefined,
        myAnswerList: undefined,
        realAnswerList: undefined,
        orgCode: undefined,
        orgName: undefined,
        perId: undefined,
        perName: undefined,
        startTime: undefined,
        startTimeRange: [],
        submitTime: undefined,
        submitTimeRange: [],
        myPoint: undefined,
        examStatus: undefined,
        params: {
          beginStartTime: undefined,
          endStartTime: undefined,
          beginSubmitTime: undefined,
          endSubmitTime: undefined,
        },
        exam: {
          name: undefined
        }
      },
      // 表单参数
      form: {},
      columnLabel: '',
      examPaperStatusDicList: [],
      myExamStatusDicList: [],
      examVisible: false,
      examResultVisible: false,
      examHistoryDetail: {},
      autoSubmit: 0,
      socketUrl: process.env.VUE_APP_BASE_API + "/examSocket",
      socket: undefined,
      timeInterval: undefined,

      examId: 3,
      enterpriseName: '',
      enterpriseId: '',

      rectificationInfo: {
        rectificationItem: undefined,
        rectificationOpinion: undefined,
        rectificationImage: undefined,
        rectificationResult: undefined,
        rectificationResultImage: undefined,
        auditOpinion: undefined,
        rectificationRadio: undefined,
      },
      rectificationVisible: false,
      reviewVisible: false,
      rectificationAuditVisible: false,
      showTree: this.$store.getters.showTree,
      rectificationStatusOptions: [
        {dictLabel: '待整改', dictValue: '1'},
        {dictLabel: '待审核整改结果', dictValue: '2'},
        {dictLabel: '整改审核通过', dictValue: '3'},
        {dictLabel: '无需整改', dictValue: '4'}
      ],
      rectificationStatusDicList: []
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
      } else {
        this.tableHeight = window.innerHeight - 62 - 148;
      }
    },
  },
  created() {
    this.getList();
    this.getDicts("exam_paper_status").then(response => {
      this.examPaperStatusDicList = response.data;
    });
    this.getDicts("exam_history_status").then(response => {
      this.myExamStatusDicList = response.data;
    });
    this.getDicts("rectification_status").then(response => {
      this.rectificationStatusDicList = response.data;
    });
  },
  methods: {
    rectificationChange(info) {
      this.rectificationInfo.rectificationItem = info.rectificationItem
      this.rectificationInfo.rectificationOpinion = info.rectificationOpinion
      this.rectificationInfo.rectificationImage = info.rectificationImage
      this.rectificationInfo.rectificationResult = info.rectificationResult
      this.rectificationInfo.rectificationResultImage = info.rectificationResultImage
      this.rectificationInfo.auditOpinion = info.auditOpinion
      this.rectificationInfo.rectificationRadio = info.rectificationRadio
      this.rectificationInfo.rectificationStatus = info.rectificationStatus
    },
    handleRectification(row) {
      const id = row.id
      previewResult(id).then(response => {
        this.form.id = id;
        // this.form.paperContent = response.data.content;
        this.examHistoryDetail = response.data;
        this.rectificationVisible = true;
        this.title = '食安自查整改';
        this.dialogIcon = 'el-icon-view';
      });
    },
    //--巡检--
    handleReview(row) {
      const id = row.id
      previewResult(id).then(response => {
        this.form.id = id;
        this.form.enterpriseId = response.data.enterpriseId
        this.form.operationId = response.data.operationId
        // this.form.paperContent = response.data.content;
        this.examHistoryDetail = response.data;
        this.reviewVisible = true;
        this.title = '食安自查巡检';
        this.dialogIcon = 'el-icon-view';
      });
      this.operationType = 5
    },
    //提交巡检
    submitReview() {
      if (!this.$refs.review_rec.validate()) {
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
      // this.form.rectificationStatus = this.rectificationInfo.rectificationStatus

      if (this.form.rectificationRadio == '1') { //不整改 视为审核通过
        this.form.rectificationStatus = '2'
      } else if (this.form.rectificationRadio == '2') { //需要整改 则状态调整为待整改
        this.form.rectificationStatus = '3'
      }
      rectification({...this.form, examId: 3}).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.reviewVisible = false;
          this.form = {}
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    handleAudit(row) {
      const id = row.id
      previewResult(id).then(response => {
        this.form.id = id;
        // this.form.paperContent = response.data.content;
        this.examHistoryDetail = response.data;
        this.rectificationAuditVisible = true;
        this.title = '食安自查审核';
        this.dialogIcon = 'el-icon-view';
      });
    },
    submitRectification() {
      // this.form.rectificationOpinion=undefined
      this.form.rectificationResult = this.rectificationInfo.rectificationResult
      this.form.rectificationResultImage = this.rectificationInfo.rectificationResultImage

      this.form.rectificationStatus = '4'
      rectification({...this.form, examId: 3}).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.form = {}
          this.rectificationVisible = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    rectificationPassOrReject() {
      // console.log(this.rectificationInfo.rectificationStatus)
      if (!this.$refs.audit1.validate()) {
        return
      }
      if (this.rectificationInfo.rectificationStatus == '3') {
        this.rectificationReject()
      } else if (this.rectificationInfo.rectificationStatus == '5') {
        this.rectificationPass()
      }
    },
    rectificationReject() {
      if (!this.$refs.audit1.validate()) {
        return
      }
      this.form.auditOpinion = this.rectificationInfo.auditOpinion
      this.form.rectificationStatus = '3' //审核不通过状态仍未待整改
      audit({...this.form, examId: 3}).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.rectificationAuditVisible = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    rectificationPass() {
      if (!this.$refs.audit1.validate()) {
        return
      }
      this.form.rectificationStatus = '5'
      this.form.auditOpinion = this.rectificationInfo.auditOpinion
      audit({...this.form, examId: 3}).then(response => {
        if (response.code === 200) {
          this.msgSuccess("提交成功");
          this.rectificationAuditVisible = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 查询考试历史列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginStartTime = this.queryParams.startTimeRange && this.queryParams.startTimeRange.length > 0 ? this.queryParams.startTimeRange[0] : undefined;
      this.queryParams.params.endStartTime = this.queryParams.startTimeRange && this.queryParams.startTimeRange.length > 0 ? this.queryParams.startTimeRange[1] : undefined;
      this.queryParams.params.beginSubmitTime = this.queryParams.submitTimeRange && this.queryParams.submitTimeRange.length > 0 ? this.queryParams.submitTimeRange[0] : undefined;
      this.queryParams.params.endSubmitTime = this.queryParams.submitTimeRange && this.queryParams.submitTimeRange.length > 0 ? this.queryParams.submitTimeRange[1] : undefined;
      this.queryParams.examId = this.examId;
      if (this.$refs.highQuery) {
        this.queryParams.params.districtCode = this.$refs.highQuery.districtCode;
        this.queryParams.params.enterpriseId = this.$refs.highQuery.enterpriseId;
        this.queryParams.params.operationId = this.$refs.highQuery.operationId;
      }
      listHistory(this.queryParams).then(response => {
        this.historyList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.rectificationAuditVisible = false;
      this.reset();
    },
    // 取消按钮
    cancelExam() {
      this.examResultVisible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        examId: undefined,
        content: undefined,
        myAnswerList: undefined,
        realAnswerList: undefined,
        orgCode: undefined,
        orgName: undefined,
        perId: undefined,
        perName: undefined,
        startTime: undefined,
        submitTime: undefined,
        myPoint: undefined,
        examStatus: "0"
      };
      this.enterpriseName = '';
      this.enterpriseId = '';
      this.resetForm("form");
      this.operationType = 0
    },
    conditionToggle() {
      if (this.$refs['toggle-container'].style.display === 'none') {
        this.$refs['toggle-container'].style.display = 'inline-block';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
      } else {
        this.$refs['toggle-container'].style.display = 'none';
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
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
        examId: this.examId,
        content: undefined,
        myAnswerList: undefined,
        realAnswerList: undefined,
        orgCode: undefined,
        orgName: undefined,
        perId: undefined,
        perName: undefined,
        startTime: undefined,
        startTimeRange: [],
        submitTime: undefined,
        submitTimeRange: [],
        myPoint: undefined,
        examStatus: undefined,
        params: {
          beginStartTime: undefined,
          endStartTime: undefined,
          beginSubmitTime: undefined,
          endSubmitTime: undefined,
          districtCode: undefined,
          enterpriseId: undefined,
          operationId: undefined,
        },
        exam: {
          name: undefined
        }
      };
      this.enterpriseId = undefined;
      this.enterpriseName = undefined;
      this.$refs.highQuery.reset();
      this.handleQuery();
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getHistory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改食安自查";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getHistory(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看食安自查记录";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    /** 开始考试 **/
    handleStartExam() {
      const id = this.examId;
      this.operationId = this.$store.getters.operationId;
      if (!this.operationId || this.operationId == '') {
        this.msgInfo("未获取到当前登录用户所属经营场所，请联系管理员");
        return;
      }

      getBaseFormData(this.operationId).then(res => {
        this.enterpriseName = res.data.enterprise.name
        this.enterpriseId = res.data.enterprise.id
        this.operationName = res.data.operation.name
      })

      startExam(id).then(response => {
        if (response && response.code == 200) {
          this.form.id = id;
          this.examHistoryDetail = response.data;
          this.examVisible = true;
          this.title = '正在检查';
          this.dialogIcon = 'el-icon-edit';
        } else {
          this.msgError('获取检查配置出错');
        }
      });
      this.operationType = 4;
    },
    /** 查看考试结果 **/
    handleViewResult(row) {
      const id = row.id
      previewResult(id).then(response => {
        this.form.id = id;
        // this.form.paperContent = response.data.content;
        this.examHistoryDetail = response.data;
        this.examResultVisible = true;
        this.title = '检查结果';
        this.dialogIcon = 'el-icon-view';
      });
    },
    handleDoubleClick(row, column, event) {
      // this.handleView(row);
    },
    openDialog() {
      // $('.history-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    submitCurrentExam() {
      // if (!this.$refs.rec.validate()){
      //   return;
      // }
      let that = this;
      let exam = this.$refs.currentExam.customAnswer;
      for (let key in exam) {
        if (Array.isArray(exam[key])) {
          exam[key].sort();
        }
      }
      let examAnswer = this.examHistoryDetail;
      // examAnswer.rectificationItem = this.rectificationInfo.rectificationItem
      // examAnswer.rectificationOpinion = this.rectificationInfo.rectificationOpinion
      // examAnswer.rectificationImage = this.rectificationInfo.rectificationImage
      // examAnswer.rectificationResult = this.rectificationInfo.rectificationResult
      // examAnswer.rectificationResultImage = this.rectificationInfo.rectificationResultImage
      // examAnswer.auditOpinion = this.rectificationInfo.auditOpinion
      // examAnswer.rectificationRadio = this.rectificationInfo.rectificationRadio
      examAnswer.rectificationStatus = '1' //待巡检

      examAnswer.examId = exam.examId;
      let myAnswerList = [];
      for (let key in exam) {
        if (key != 'examId') {
          if (Array.isArray(exam[key])) {
            myAnswerList.push({
              questionId: key,
              myAnswer: exam[key].join('')
            });
          } else {
            myAnswerList.push({
              questionId: key,
              myAnswer: exam[key]
            });
          }
        }
      }
      examAnswer.myAnswerList = JSON.stringify(myAnswerList);
      let allDone = true;
      for (let key in exam) {
        if (exam[key].length == 0) {
          allDone = false;
          break;
        }
      }
      let tipStr = '';
      if (allDone) {
        tipStr = '请确认是否提交检查？';
      } else {
        that.msgError('有未选择检查项');
        return;
      }
      if (!this.operationId || this.operationId == '') {
        this.msgInfo("未获取到当前登录用户所属经营场所，请联系管理员");
        return;
      }
      examAnswer.operationId = this.operationId;
      examAnswer.operationName = this.operationName;
      examAnswer.enterpriseId = this.enterpriseId;
      examAnswer.enterpriseName = this.enterpriseName;
      examAnswer.submitTime = parseTime(new Date(this.$refs.currentExam.submitTime))
      examAnswer.examId = this.examId;
      this.$confirm(tipStr, '提示', {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonClass: "btn-confirm",
      }).then(() => {
        finishExam(examAnswer).then(r => {
          if (r && r.code == 200) {
            that.msgSuccess(r.msg);
            that.examVisible = false;
            that.getList();
          } else {
            that.msgError(r.msg);
          }
        });
      }).catch(() => {
      });
    },
    //关闭检查模态框
    closeCheck() {
      //刷新试卷
      // this.$refs.rec.formRefresh();
      // this.rectificationInfo = {rectificationRadio: '1'}
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "btn-confirm",
      }).then(function () {
        return delHistory(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考试历史数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "btn-confirm",
      }).then(function () {
        return exportHistory(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    // 考试状态字典翻译
    examPaperStatusFormat(row, column) {
      return this.selectDictLabel(this.examPaperStatusDicList, row.exam.examPaperStatus);
    },
    // 考试状态字典翻译
    myExamStatusFormat(row, column) {
      return this.selectDictLabel(this.myExamStatusDicList, row.examStatus);
    },
    // 整改状态字典翻译
    rectificationStatusFormat(row, column) {
      return this.selectDictLabel(this.rectificationStatusDicList, row.rectificationStatus);
    },
    exitExam() {
      this.$confirm('确定退出检查?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "btn-confirm",
      }).then(() => {
        this.examVisible = false;
      });
    },
    submitTimeChangeEv(e, e1) {
      if (e) {
        this.queryParams.submitTimeStart = e[0];
        this.queryParams.submitTimeEnd = e[1];
      } else {
        this.queryParams.submitTimeStart = null;
        this.queryParams.submitTimeEnd = null;
      }
    },
    // 考试时间范围格式处理
    examTimeFormat(dateTime) {
      let time = moment(new Date(dateTime)).format('YYYY-MM-DD');
      return time;
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
  },
  mounted() {
    if (this.$route.query.operationId) {
      this.queryParams.params.operationId = this.$route.query.operationId
    }
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
    });
  }
};
