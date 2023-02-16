
import $ from "jquery";

export default {
  name: 'handleBusiness',
  data () {
    return {
      forHomepage: false,
      activeTabName: 'todo-list',
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
      // 发起事项表格数据
      startBusinessList: [],

      //已办列表
      loadingFinish: true,
      totalFinish: 0,
      startBusinessFinishList: [],

      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon: '',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=新增，2=编辑，3=详情
      tableHeight: 450,
      pageList: [20, 30, 50, 100],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        sort: undefined,
        order: undefined,
        title: undefined,
        content: undefined,
        handleUser: undefined,
        handleUserName: undefined,
        createByName: undefined,
        status: undefined,
        handleDesc: undefined,
        handleResult: undefined,
        handleTime: undefined,
        handleTimeRange: [],
        params: {
          beginCreateTime: undefined,
          endCreateTime: undefined,
          type: 1
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        handleUserName: [
          { required: true, message: "处理人不能为空", trigger: "blur" }
        ],
        handleResult: [
          { required: true, message: "处理结果不能为空", trigger: "blur" }
        ],
        handleDesc: [
          { required: true, message: "处理情况不能为空", trigger: "blur" }
        ]
      },
      columnLabel: '',

      // 处理结果字典
      handleResultOptions: [],

      //用户选择
      dialogUserVisible: false,
      defaultCheckedUserKeys: []
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      this.tableHeight = window.innerHeight - 155;
      // this.openDialog();
    }
  },
  created () {
    /*    this.getList();
        this.getFinishList();*/

    /*    this.getDicts("business_handle_result").then(response => {
          this.handleResultOptions = response.data;
        });*/
  },
  methods: {
    initTab (obj) {
      if (obj.index == '0') {
        this.$refs.todoList.getList();
      } else if (obj.index == '1') {
        this.$refs.finishList.getList();
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - 155;
    });
  }
};
