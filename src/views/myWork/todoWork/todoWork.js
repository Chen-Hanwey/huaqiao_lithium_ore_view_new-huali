import { listWfOrder} from "@/api/myWork/wfOrder";
import $ from "jquery";
import EnterpriseApprovalAudit from "@/views/components/todoComponents/enterpriseApprovalAudit";
import CertificateAudit from "@/views/components/todoComponents/certificateAudit";
import SazcReview from "@/views/components/todoComponents/sazcReview";
import sazcAudit from "@/views/components/todoComponents/sazcAudit";
import checkRectification from "@/views/components/todoComponents/checkRectification";
export default {
  name: 'TodoWork',
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
      // 工单信息表格数据
      wfOrderList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon:'',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=添加，2=编辑，3=详情
      tableHeight: 450,
      pageList: [100,200,500,1000],
      // 是否显示弹出层
      open: false,
      // 工单来源类型字典
      wfOrderTypeOptions: [],
      // 工单状态字典
      wfOrderStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined,
        wfOrderType: undefined,
        orderName: undefined,
        createTime: undefined,
        createTimeRange: [],
        params:{
          beginCreateTime: undefined,
          endCreateTime: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      columnLabel: ''
    };
  },
  components:{
    EnterpriseApprovalAudit,CertificateAudit,SazcReview,sazcAudit,checkRectification
  } ,
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
        if(this.$refs.table.$el.offsetTop){
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
        }else{
            this.tableHeight = window.innerHeight - 62 - 148;
        }
        this.openDialog();
    }
  },
  created() {

    this.getDicts("wf_order_type").then(response => {
      this.wfOrderTypeOptions = response.data;
    });
    this.getDicts("wf_order_status").then(response => {
      this.wfOrderStatusOptions = response.data;
    });
  },
  methods: {
    /** 查询工单信息列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginCreateTime = this.queryParams.createTimeRange && this.queryParams.createTimeRange.length > 0 ? this.queryParams.createTimeRange[0] : undefined;
      this.queryParams.params.endCreateTime = this.queryParams.createTimeRange && this.queryParams.createTimeRange.length > 0 ? this.queryParams.createTimeRange[1] : undefined;

      listWfOrder({...this.queryParams}).then(response => {
        this.wfOrderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 工单来源类型字典翻译
    wfOrderTypeFormat(row, column) {
      return this.selectDictLabel(this.wfOrderTypeOptions, row.wfOrderType);
    },
    // 工单状态字典翻译
    wfOrderStatusFormat(row, column) {
      return this.selectDictLabel(this.wfOrderStatusOptions, row.wfOrderStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        wfOrderId: undefined,
        wfOrderType: undefined,
        wfOrderEntityId: undefined,
        wfOrderStatus: undefined,
        enterpriseId: undefined,
        processDefinitionId: undefined,
        orderId: undefined,
        orderName: undefined,
        lastorderId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined
      };
      this.resetForm("form");
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
        wfOrderType: undefined,
        orderName: undefined,
        createTime: undefined,
        createTimeRange: [],
        params:{
          beginCreateTime: undefined,
          endCreateTime: undefined,
        }
      };
      this.handleQuery();
    },
    renderHeader(h, { column, $index }, width){
      let color = '#515a6e';
      let that = this;
      if(that.columnLabel != '' && that.columnLabel == column.label){
          color = "#ff6600";
      }
      let style = {};
      if(width){
          // width: 'calc(' + width + '% - 48px)'
          style = {textAlign:'center',wordBreak: 'break-all',whiteSpace: 'pre-line',display:'inline-block',lineHeight: 'normal',color: color, width: width+"%"}
      }else{
          style = {textAlign:'left',wordBreak: 'break-all',whiteSpace: 'pre-line',display:'inline-block',lineHeight: 'normal',color: color}
      }

      return h(
          'span',
          {
              style: style,
          },
          column.label)
    },
    //表格排序
    changeTableSort(column){
      let order = '';
      if(column.order === 'ascending'){
          order = 'asc';
      }else if(column.order === 'descending'){
          order = 'desc';
      }
      if(order !== ''){
          this.queryParams.sort = column.prop.replace(/([A-Z])/g,"_$1").toLowerCase();
          this.queryParams.order = order;
          this.queryParams.pageNum = 1;
          this.columnLabel = column.column.label;
      }else{
          this.queryParams.sort = '';
          this.queryParams.order = '';
          this.queryParams.pageNum = 1;
          this.columnLabel = '';
      }
      this.getList();
    },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.wfOrderId)
    //   this.single = selection.length!=1
    //   this.multiple = !selection.length
    // },
      /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      let id = row.wfOrderEntityId
      if (row.wfOrderType == '1'){  //企业主体审批
        this.$refs.enterpriseApprovalAudit.init(id,false,row.wfOrderStatus,'经营主体审批');
      }else if (row.wfOrderType == '2'){  //企业资质审批
        if (row.wfOrderStatus == 1){  //审核
          this.$refs.dialog1.getInfo(id,1)
        }else if (row.wfOrderStatus == 3){  //修改
          this.$refs.dialog1.getInfo(id,2)
        }
      }else if (row.wfOrderType == '3'){  //食安自查
        if (row.wfOrderStatus == 1){  //检阅
          this.$refs.dialog2.getInfo(id)
        }else if (row.wfOrderStatus == 5){  //审核
          this.$refs.dialog3.getInfo(id,3)
        }else if (row.wfOrderStatus == 4){  //整改
          this.$refs.dialog4.getInfo(id,3)
        }
      }else if (row.wfOrderType == '4'){  //餐饮量化
        if (row.wfOrderStatus == 5){  //审核
          this.$refs.dialog3.getInfo(id,1)
        }else if (row.wfOrderStatus == 4){  //整改
          this.$refs.dialog4.getInfo(id,1)
        }
      }else if (row.wfOrderType == '5'){  //信用评定
        // this.$refs.dialog3.getInfo(id,2)
        if (row.wfOrderStatus == 5){  //审核
          this.$refs.dialog3.getInfo(id,2)
        }else if (row.wfOrderStatus == 4){  //整改
          this.$refs.dialog4.getInfo(id,2)
        }
      }else if (row.wfOrderType == '6'){  //食安监督
        // this.$refs.dialog3.getInfo(id,4)
        if (row.wfOrderStatus == 5){  //审核
          this.$refs.dialog3.getInfo(id,4)
        }else if (row.wfOrderStatus == 4){  //整改
          this.$refs.dialog4.getInfo(id,4)
        }
      }
    },
    handleDoubleClick(row, column, event){
      this.handleView(row);
    },
    openDialog(){
      $('.wfOrder-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    // submitForm: function() {
    //   this.$refs["form"].validate(valid => {
    //     if (valid) {
    //       if (this.form.wfOrderId != undefined) {
    //         updateWfOrder(this.form).then(response => {
    //           if (response.code === 200) {
    //             this.msgSuccess("修改成功");
    //             this.open = false;
    //             this.getList();
    //           } else {
    //             this.msgError(response.msg);
    //           }
    //         });
    //       } else {
    //         addWfOrder(this.form).then(response => {
    //           if (response.code === 200) {
    //             this.msgSuccess("新增成功");
    //             this.open = false;
    //             this.getList();
    //           } else {
    //             this.msgError(response.msg);
    //           }
    //         });
    //       }
    //     }
    //   });
    // },
    /** 导出按钮操作 */
    // handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm('是否确认导出所有工单信息数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return exportWfOrder(queryParams);
    //     }).then(response => {
    //       this.download(response.msg);
    //     }).catch(function() {});
    // }
  },
  computed: {
    showBtnText(){
      return function (wfOrderType,wfOrderStatus) {
        let t = ''
        if (wfOrderType == 1 && wfOrderStatus == 1){
          t = '审核'
        }
        if (wfOrderType == 2){
          if (wfOrderStatus == 1){
            t = '审核'
          }else if (wfOrderStatus == 3){
            t = '修改'
          }
        }else if (wfOrderType != 1){
          t = wfOrderStatus == 4 ? '整改' : wfOrderStatus == 5 ? '审核' : wfOrderStatus == 4 ? '整改' : ''
        }
        return t
      }
    },
    orderTypeFilter(){
      let userType = this.$store.getters.userType
      if (userType == '02'){
        return this.wfOrderTypeOptions.filter(a=> a.dictValue == 1 || a.dictValue == 2)
      }else if (userType == '03'){
        return this.wfOrderTypeOptions.filter(a=> a.dictValue  == 3 || a.dictValue  == 4 || a.dictValue  == 5 || a.dictValue  == 6)
      }
      return this.wfOrderTypeOptions
    }
  },
  mounted() {
    if (this.$route.query.wfOrderType){
      this.queryParams.wfOrderType = this.$route.query.wfOrderType
    }
    this.getList();
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop  - 62 - 148;
    });
  }
};
