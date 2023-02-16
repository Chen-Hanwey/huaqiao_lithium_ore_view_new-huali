import {
  listPurchaseRecord,
  getPurchaseRecord,
  delPurchaseRecord,
  addPurchaseRecord,
  updatePurchaseRecord,
  exportPurchaseRecord
} from "@/api/purchaseManage/purchaseRecord";
import {listPurchaseSupplier} from "@/api/purchaseManage/purchaseSupplier";
import {listPurchaseGoods,addPurchaseGoods} from "@/api/purchaseManage/purchaseGoods";
import $ from "jquery";
import { deepClone } from '@/utils/index'
import {getToken} from "@/utils/auth";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";

export default {
  name: 'PurchaseRecord',
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
      // 采购记录表格数据
      purchaseRecordList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon: '',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=添加，2=编辑，3=详情
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
        enterpriseId: undefined,
        supplierId: undefined,
        supplierName: undefined,
        orderNum: undefined,
        purchaseTime: undefined,
        purchaseTimeRange: [],
        totalMoney: undefined,
        attachmentFiles: undefined,
        params: {
          beginPurchaseTime: undefined,
          endPurchaseTime: undefined,
          districtCode: undefined,
          enterpriseId: undefined,
          operationId: undefined,
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        purchaser: [
          { required: true, message: '请输入申请人', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      columnLabel: '',
      supplierOptions: [],
      goodsList: [],
      goodsListAll: [],
      goodsListRest: [],
      goodsUnitOptions: [],
      goodsTypeOptions: [],
      uploadPic:{
        uploadImgUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadImageAndCrtThumbImage',
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        picDialogVisible:false,
        picDialogImageUrl:undefined,
        pictureList1:[],
        pictureFileList1:[]
      },
      curRowIndex:-1,
      enterpriseName:'',
      enterpriseId:'',
      showTree: this.$store.getters.showTree
    };
  },
  watch: {
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      if (this.$refs.table.$el.offsetTop) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
      } else {
        this.tableHeight = window.innerHeight - 62 - 148;
      }
      this.openDialog();
    }
  },
  created() {
    this.getDicts("goods_unit").then(response => {
      this.goodsUnitOptions = response.data;
    });
    this.getDicts("goods_type").then(response => {
      this.goodsTypeOptions = response.data;
    });
    listPurchaseSupplier({}).then(res => {
      this.supplierOptions = res.rows
    })
    this.getList();
  },
  methods: {
    handleExceed(){
      this.msgError('最多上传3张')
    },
    handlePicUpSuccess(res, file,fileList){
      let picList = []
      fileList.forEach(file=>{
        picList.push(file.response.url)
      })
      this.goodsList[this.curRowIndex].goodsPics = picList.join(',')
      // console.log(this.goodsList[this.curRowIndex])
    },
    handlePicRemove(file, fileList,index){
      let picList = []
      fileList.forEach(file=>{
        picList.push(file.response.url)
      })
      this.goodsList[this.curRowIndex].goodsPics = picList.join(',')
      // console.log(this.goodsList[this.curRowIndex])
    },
    addGoods() {
      if (!this.form.supplierId) {
        this.msgError("请先选择供应商")
        return
      }
      let editable = false
      this.goodsList.forEach(item => {
        if (item.editable) {
          editable = true
        }
      })
      if (editable) {
        this.msgError('请先确定其他采购的商品')
        return
      }
      this.curRowIndex = this.goodsList.length

      this.makeGoodsListRest()//先生成备选类别再新增
      let goods = {
        editable: true,
        init: true,//设置为初始状态
        goodsName: '',
        goodsUnit: '',
        goodsType:'',
        price: 0,
        mount: 0,
        produceTime: undefined,
        validTime: undefined,
        inlet: '0',
        supplierId: this.form.supplierId,
        goodsPics:'',
        pictureFileList: []
      }
      this.goodsList.push(goods)
    },
    makeGoodsListRest() {
      this.goodsListRest = [] // 初始化
      // 生成选项，goodsListAll  减去 goodsList
      if (this.goodsList.length > 0) {
        let goodsListNames = this.goodsList.map(goods => goods.goodsName)// 获取goodsList的goodsName集合
        this.goodsListAll.forEach(item => {
          if (goodsListNames.indexOf(item.goodsName) == -1) {
            this.goodsListRest.push(item)
          }
        })
      } else {
        // 必须用深拷贝
        this.goodsListRest = deepClone(this.goodsListAll)
      }
    },
    handleEditGoods(row,index) {
      this.curRowIndex = index
      if (row.init) {
        // 判断当前商品是否在goodsListAll中，没有的话就添加到goods列表中去，并且与当前supplier相关联
        let goodsListNames = this.goodsListAll.map(goods => goods.goodsName)
        if (goodsListNames.indexOf(row.goodsName) > -1) {
          // this.msgError("新增失败，该商品已存在") // 该商品已存在无需新增
          // return
        } else {
          addPurchaseGoods(row).then(res=>{
            this.msgSuccess("新商品添加成功")
            this.updateGoodsListAll()
          })
        }
      }
      row.init = false;//接触初始状态
      row.editable = !row.editable;// !!! 注意在对应java类中必须加上editable字段，否则点击编辑无效
      if(row.editable){
        row.pictureFileList = handleFileList(handlePicturePath(row.goodsPics));
      }
      if(!row.editable){
        if (!row.validTime){
          this.$message.info('请输入有效期')
          row.editable = true
          return
        }
        this.curRowIndex = -1
        this.calcTotalMoney()
      }
    },
    handleDeleteGoods(row, index) {
      this.curRowIndex = -1
      this.goodsList.splice(index, 1)
      this.calcTotalMoney()
    },
    calcTotalMoney() {
      let total = 0;
      this.goodsList.forEach(item => {
        total = total + item.price * item.mount
      })
      this.form.totalMoney = total
    },
    onChangeSupplier(option) {
      listPurchaseGoods({supplierId: option}).then(res => {
        this.goodsList = res.rows
        this.goodsListAll = deepClone(res.rows)
      })
    },
    updateGoodsListAll(){
      if(this.form.supplierId){
        listPurchaseGoods({supplierId: this.form.supplierId}).then(res => {
          this.goodsListAll = deepClone(res.rows)
        })
      }
    },
    inletFormat(row, column) {
      if (row.inlet && row.inlet == '1') {
        return '是'
      } else {
        return '否'
      }
    },
    getPurchased(val) {
      if (val === 1 || val === '1') {
        return '待采购'
      }
      if (val === 2 || val === '2') {
        return '已采购'
      }
      if (val === 3 || val === '3') {
        return '已检测'
      }
      if (val === 4 || val === '4') {
        return '已入库'
      }
      if (val === 5 || val === '5') {
        return '已出库'
      }
      return ''
    },
    goodsUnitFormat(row, column) {
      return this.selectDictLabel(this.goodsUnitOptions, row.goodsUnit);
    },
    goodsTypeFormat(row, column) {
      return this.selectDictLabel(this.goodsTypeOptions, row.goodsType);
    },
    /** 查询采购记录列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginPurchaseTime = this.queryParams.purchaseTimeRange && this.queryParams.purchaseTimeRange.length > 0 ? this.queryParams.purchaseTimeRange[0] : undefined;
      this.queryParams.params.endPurchaseTime = this.queryParams.purchaseTimeRange && this.queryParams.purchaseTimeRange.length > 0 ? this.queryParams.purchaseTimeRange[1] : undefined;
      this.queryParams.enterpriseId=this.enterpriseId;
      if(this.$refs.highQuery){
        this.queryParams.params.districtCode=this.$refs.highQuery.districtCode;
        this.queryParams.params.enterpriseId=this.$refs.highQuery.enterpriseId;
        this.queryParams.params.operationId=this.$refs.highQuery.operationId;
      }
      listPurchaseRecord(this.queryParams).then(response => {
        this.purchaseRecordList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        enterpriseId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
        delFlag: undefined,
        supplierId: undefined,
        supplierName: undefined,
        orderNum: undefined,
        purchaseTime: undefined,
        totalMoney: undefined,
        attachmentFiles: undefined
      };
      this.resetForm("form");
      this.goodsList = []
      this.goodsListAll = []
      this.goodsListRest = []
      this.uploadPic.pictureList1=[];
      this.uploadPic.pictureFileList1=[];
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
        enterpriseId: undefined,
        supplierId: undefined,
        supplierName: undefined,
        orderNum: undefined,
        purchaseTime: undefined,
        purchaseTimeRange: [],
        totalMoney: undefined,
        attachmentFiles: undefined,
        params: {
          beginPurchaseTime: undefined,
          endPurchaseTime: undefined,
        }
      };
      this.enterpriseId = undefined;
      this.enterpriseName = undefined;
      this.handleQuery();
      this.$refs.highQuery.reset();
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
      this.title = "新增采购记录";
      this.dialogIcon = 'el-icon-plus';
      this.readOnly = false;
      this.operationType = 1;
      this.$nextTick(function () {
        this.$refs.baseForm.initBaseFormByEnterpriseId(this.$store.getters.enterpriseId)
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseRecord(id).then(response => {
        this.form = response.data;
        this.uploadPic.pictureList1 = handlePicturePath(this.form.attachmentFiles);
        this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
        this.goodsList = this.form.goodsList
        this.updateGoodsListAll()
        this.open = true;
        this.title = "商品采购";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
        this.$nextTick(function () {
          this.$refs.baseForm.initBaseFormByEnterpriseId(response.data.enterpriseId)
        })
      });

    },
    /** 查看按钮操作 */
    handleView(row) {
      this.reset();
      const id = row.id || this.ids
      getPurchaseRecord(id).then(response => {
        this.form = response.data;
        this.goodsList = this.form.goodsList
        this.uploadPic.pictureList1 = handlePicturePath(this.form.attachmentFiles);
        this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);

        this.open = true;
        this.title = "采购记录详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;

        this.$nextTick(function () {
          this.$refs.baseForm.initBaseFormByEnterpriseId(response.data.enterpriseId)
        })
      });
    },
    handleDoubleClick(row, column, event) {
      this.handleView(row);
    },
    openDialog() {
     // $('.purchaseRecord-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function () {
      let editable = false
      this.goodsList.forEach(item => {
        if (item.editable) {
          editable = true
        }
      })
      if (editable) {
        this.msgError('请先确定所有采购的商品')
        return
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.goodsList = this.goodsList;  //给goodsList赋值
          if (this.form.id != undefined) {
            updatePurchaseRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPurchaseRecord(this.form).then(response => {
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
      this.$confirm('是否确认删除采购记录编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delPurchaseRecord(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有采购记录数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportPurchaseRecord(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    /** 图片大图查看 **/
    handlePictureCardPreview(file) {
      this.uploadPic.picDialogImageUrl = file.url
      this.uploadPic.picDialogVisible = true
    },
    // 预览大图时定位到当前选中的图片
    getCurrentPreviewImg(url){
      // return urls.slice(index).concat(urls.slice(0,index));
      this.uploadPic.picDialogImageUrl = url
      this.uploadPic.picDialogVisible = true
    },

    /** 事件图片删除 **/
    exercisePicRemove(file, fileList) {
      let fileUrl = file.response ? file.response.url : file.url.replace(process.env.VUE_APP_PICTURE_PATH, '')
      this.form.attachmentFiles = this.form.attachmentFiles.replace(fileUrl + ",", '')
      this.form.attachmentFiles = this.form.attachmentFiles.replace("," + fileUrl, '')
      this.form.attachmentFiles = this.form.attachmentFiles.replace(fileUrl, '')
      this.uploadPic.pictureFileList1 = fileList
    },

    /** 记录图片上传成功 **/
    exercisePicUpSuccess(response, file, fileList) {
      if (response.code === 200) {
        if (this.form.attachmentFiles && this.form.attachmentFiles !== '') {
          this.form.attachmentFiles += ',' + response.url
        } else {
          this.form.attachmentFiles = response.url
        }
        this.uploadPic.pictureFileList1 = fileList
      } else {
        this.msgError(response.msg)
      }
    },
    /** 图片上传失败 **/
    picUploadErr(err) {

    },
    /** 图片上传过程中的钩子 **/
    picUpProcess(event, file, fileList) {

    },
    beforePicUpload(file) {
      let isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return isLt2M
    },
    isEmptyStr(s) {
      if (s == undefined || s == null || s === '') {
        return true
      }
      return false
    },

    enterpriseClick(id){
      this.enterpriseId=id;
      this.getList();
    },
    dateOptions1: {
      disabledDate(time){
        let d = new Date()
        // d.setDate(d.getDate() - 1)
        return time > d;
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 148;
    });
  }
};
