import {
  listQuestion,
  getQuestion,
  delQuestion,
  addQuestion,
  updateQuestion,
  exportQuestion
} from "@/api/check/question";
import {
  listAll
} from "@/api/check/quesBank";
import {getToken} from '@/utils/auth'
import $ from "jquery";

export default {
  name: 'CheckQuestion',
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
      // 题目详情表格数据
      questionList: [],
      // 题目详情表格数据
      questionTypeList: [],
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        quesDetail: undefined,
        options: undefined,
        answer: undefined,
        analysis: undefined,
        keywords: undefined,
        quesBankId: undefined,
        quesType: undefined,
        params: {}
      },
      // 表单参数
      form: {
        id: undefined,
        quesDetail: undefined,
        options: undefined,
        answer: undefined,
        analysis: undefined,
        keywords: undefined,
        quesBankId: undefined,
        quesType: '3',
        answerForSingleOption: undefined,
        answerForMultiOption: [],
        answerForJudgement: undefined,
        answerForFill: undefined,
      },
      optionsForView: [],
      // 表单校验
      rules: {
        quesBankId: [
          {required: true, message: "检查库不能为空", trigger: "blur"}
        ],
        quesDetail: [
          {required: true, message: "题目名称不能为空", trigger: "blur"}
        ],
        answer: [
          {required: true, message: "答案不能为空", trigger: "blur"}
        ],
        answerForFill: [
          {required: true, message: "答案不能为空", trigger: "blur"}
        ]
      },
      columnLabel: '',
      // 检查库字典列表
      quesBankDicList: [],
      // 题目类型字典列表
      questionTypeDicList: [],
      // 选择题默认选项
      defaultChoice: [
        {option: 'A',content:''},
        {option: 'B',content:''},
        {option: 'C',content:''},
        {option: 'D',content:''}
      ],
      // 判断题默认选项
      defaultJudgement:[
        {option: 'A',content:'通过'},
        {option: 'B',content:'不通过'},
        {option: 'C',content:'合理缺项'}
      ],
      optionEle: 'optionEle',
      // 试题导入
      openImport: false,
     /* templateFile: process.env.VUE_APP_BASE_API +'/exam/question/downloadTemplate',
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/exam/question/importData',*/
      uploadHeader: {Authorization: 'Bearer ' + getToken()},
      importForm:{
        quesBankId: undefined,
        fileList: undefined
      },
      importRules:{
        quesBankId: [
          {required: true, message: "检查库不能为空", trigger: "blur"}
        ],
        fileList: [
          {required: true, message: "上传文件不能为空", trigger: "blur"}
        ],
      }
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
      } else {
        this.tableHeight = window.innerHeight - 62 - 145;
      }
      this.openDialog();
    },
    // 监听路由变化，切换到这个标签页时需要执行的操作
    '$route.path'(newVal){
      if(newVal === "/exam/question"){
        // 切换过来时，重新查询检查库
        this.getBankList();
      }
    },
    optionsForView(){
      // 因为题目选项是动态的，所以根据选项的数量来动态改变表单校验规则
      // 删除关于选项的校验规则
      let deleteKeys = [];
      for(let key in this.rules){
        if(key.indexOf(this.optionEle)>-1){
          deleteKeys.push(deleteKeys)
        }
      }
      if(deleteKeys.length>0){
        deleteKeys.forEach(item=>{
          delete this.rules[item];
        })
      }
      // 重新新增规则
      for(let i=0;i<this.optionsForView.length;i++){
        this.rules[this.optionEle+i] = [
          {validator: this.checkOptionContent,trigger: "blur"}
        ];
      }
    }
  },
  created() {
    this.getList();
    this.getDicts("question_type").then(response => {
      this.questionTypeDicList = response.data;
    });
    this.getBankList();
  },
  methods: {
    /** 查询题目详情列表 */
    getList() {
      this.loading = true;

      listQuestion(this.queryParams).then(response => {
        this.questionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询检查库列表 **/
    getBankList() {
      listAll().then(response => {
        if (response.code === 200) {
          this.quesBankDicList = response.data;
        } else {
          this.msgError(response.msg);
        }
      })
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
        quesDetail: undefined,
        options: undefined,
        answer: undefined,
        analysis: undefined,
        keywords: undefined,
        quesBankId: undefined,
        quesType: '3',
        optionsForView: [],
        answerForSingleOption: undefined,
        answerForMultiOption: [],
        answerForJudgement: undefined,
        answerForFill: undefined,
      };
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
        quesDetail: undefined,
        options: undefined,
        answer: undefined,
        analysis: undefined,
        keywords: undefined,
        quesBankId: undefined,
        quesType: undefined,
        params: {}
      };
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增检查项目";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
      // 检查库默认选第一个启用的检查库
      if (this.quesBankDicList.length > 0) {
        for(let i=0;i<this.quesBankDicList.length;i++){
          if(this.quesBankDicList[i].typeStatus === '1'){
            this.importForm.quesBankId = this.quesBankDicList[i].id;
            break;
          }
        }
      }
      // 修改选项显示样式
      this.optionsForView = this.copyOptions(this.optionsForView,this.defaultJudgement);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getQuestion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改检查项目";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;

        this.handleOptionsToView();
        this.handleAnswerToView();
      });
    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getQuestion(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看检查项目";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
    },
    handleDoubleClick(row, column, event) {
      this.handleUpdate(row);
    },
    openDialog() {
      // $('.question-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      this.handleOptionsToApi();
      // this.handleAnswerToApi();
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateQuestion(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addQuestion(this.form).then(response => {
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
        return delQuestion(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导入按钮操作 **/
    handleImport(){
      this.resetForm("importForm");
      this.importForm = {
        quesBankId: undefined,
        fileList: []
      };
      this.openImport = true;
      if(this.quesBankDicList.length>0){
        for(let i=0;i<this.quesBankDicList.length;i++){
          if(this.quesBankDicList[i].typeStatus === '1'){
            this.importForm.quesBankId = this.quesBankDicList[i].id;
            break;
          }
        }
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有题目详情数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
        type: "warning"
      }).then(function () {
        return exportQuestion(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    // 题目类型字典翻译
    quesTypeFormat(row, column) {
      return this.selectDictLabel(this.questionTypeDicList, row.quesType);
    },
    // 所属检查库翻译
    quesBankFormat(row,colunm){
      let tmp = '';
      this.quesBankDicList.forEach(item=>{
        if(item.id === row.quesBankId){
          tmp= item.quesBankName;
        }
      });
      return tmp;
    },
    // 新增选项
    addOptions(){
      // 获取最后一个选项
      let lastOption = this.optionsForView[this.optionsForView.length-1].option;
      let num = this.str2Ascii(lastOption);
      let newOption={
        option: this.ascii2Str(num+1),
        content: ''
      }
      this.optionsForView.push(newOption);
    },
    /** 删除选项 **/
    deleteOption(index){
      if(this.optionsForView.length <= 2){
        this.msgInfo("最少需要保留两个选项");
        return;
      }
      this.optionsForView.splice(index,1);
      // 剩下的选项重新排列选项
      this.reSortOptions();
      // 对比剩下的选项和答案，如果答案中有不存在的选项，则清除此答案
      if(this.form.quesType === '1'){
        // 对于单选
        let clear = true;
        this.optionsForView.forEach(item=>{
          if(item.option === this.form.answerForSingleOption){
            // 包含选项，不需要删除
            clear = false;
          }
        });
        if(clear){
          this.form.answerForSingleOption = undefined;
        }
      } else if(this.form.quesType === '2'){
        // 对于多选
        for(let i=0;i<this.form.answerForMultiOption.length;i++){
          let op = this.form.answerForMultiOption[i];
          let clear = true;
          this.optionsForView.forEach(item=>{
            if(item.option === op){
              // 包含选项，不需要删除
              clear = false;
            }
          });
          // 找到了不包含的选项，那么以后的答案选项肯定都不存在了，删除后边的答案选项
          if(clear){
            this.form.answerForMultiOption.splice(i);
          }
        }
      }
    },
    /** 重新生成ABCD等选项 **/
    reSortOptions(){
      let numStart = 65;
      this.optionsForView.forEach(item=>{
        item.option=this.ascii2Str(numStart++);
      })
    },
    /** ascii码转字符串（这里用来转换ABCD等选项） **/
    ascii2Str(num){
      if(num <= 65){
        // 最小是A
        return 'A';
      }
      if(num>=90){
        // 最大是Z
        return 'Z';
      }
      return String.fromCharCode(num);
    },
    /** 字符串转ascii码（这里用于转换ABCD等选项） **/
    str2Ascii(str){
      return str.charCodeAt();
    },
    /** 题目类型变更时的操作 **/
    quesTypeChange(value){
      if(value === '1' || value === '2'){
        this.optionsForView = this.copyOptions(this.optionsForView,this.defaultChoice);
      } else if(value === '3'){
        this.optionsForView = this.copyOptions(this.optionsForView,this.defaultJudgement);
      } else if( value === '4' ){
        this.optionsForView = [];
      }
    },
    /** 将选项处理成数据库保存的格式，用于表单提交时的处理 **/
    handleOptionsToApi(){
      if(this.optionsForView.length > 0){
        let tmp ={};
        this.optionsForView.forEach(item=>{
          tmp[item.option]=item.content;
        })
        this.form.options = JSON.stringify(tmp);
      }else{
        this.form.options = undefined;
      }
    },
    /** 将后台返回的选项处理成前台显示的样式，用于修改查看 **/
    handleOptionsToView(){
      this.optionsForView = [];
      if(this.form.options){
        let tmp = JSON.parse(this.form.options);
        for(let key in tmp){
          let a = {
            option: key,
            content: tmp[key]
          }
          this.optionsForView.push(a);
        }
      }
    },
    /** 将答案处理成数据库保存的格式，用于表单提交时的处理 **/
    handleAnswerToApi(){
      this.form.answer = undefined;
      let ans = {};
      ans['answer']='通过';
      this.form.answer = JSON.stringify(ans);
    },
    /** 将答案处理成前台显示的格式，用于修改查看 **/
    handleAnswerToView(){
      let tmp = JSON.parse(this.form.answer);
      // 判断
      this.form.answerForJudgement = tmp['answer'];
    },
    checkOptionContent(rule, value, callback){
      let optionIndex = parseInt(rule.fullField.replace(this.optionEle,''));
      let tmpValue = this.optionsForView[optionIndex].content;
      if(tmpValue === undefined || tmpValue === null || tmpValue === ''){
        callback(new Error("选项内容不能为空"));
      } else {
        callback();
      }
    },
    /** 复制元素内容 **/
    copyOptions(target,source){
      target = [];
      source.forEach(item=>{
        let tmp = {
          option: item.option,
          content: item.content
        };
        target.push(tmp);
      });
      return target;
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
    });
  }
};
