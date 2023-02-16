import { listDistrict, listDistrictByPCode, getDistrictById, getDistrictByParentId, getDistrict, getDistrictByPCode, delDistrict, addDistrict, updateDistrict, exportDistrict } from "@/api/system/district";
import $ from "jquery";

export default {
  name: 'District',
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
      // 区域信息表格数据
      districtList: [],
      districtTypeList: [],
      // 弹出层标题
      title: "",
      //弹出层标题图标
      dialogIcon:'',
      readOnly: false,   //查看按钮默认不能编辑
      operationType: 1,  //操作类型，1=新增，2=编辑，3=详情
      tableHeight: 450,
      pageList: [100,200,500,1000],
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 100,
        id: undefined,
        parentId: undefined,
        sort: undefined,
        order: undefined,
        name: undefined,
        pcode: undefined,
        ancestors: undefined,
        cityCode: undefined,
        level: '1',
        longitude: undefined,
        latitude: undefined,
        remark: undefined,
        params:{
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [{ required: true, message: "区域名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "区域代码不能为空", trigger: "blur" }],
        level: [{ required: true, message: "级别不能为空", trigger: "blur" }]
      },
      columnLabel: '',
      nodeData:{
        tree:null,
        treeNode:null,
        resolve:null
      },
      nodeDataList: []

    };
  },
  watch:{
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
        if(this.$refs.table.$el.offsetTop){
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 90;
        }else{
            this.tableHeight = window.innerHeight - 62 - 90;
        }
    }
  },
  created() {
    this.getDicts("district_type").then(response => {
      this.districtTypeList = response.data;
    });
    this.getList();
  },
  methods: {
    /** 查询区域信息列表 */
    getList() {
      this.loading = true;

      listDistrict(this.queryParams).then(response => {
        this.districtList = response.rows;
        this.districtList.forEach(item => {
          if(item.level != 5){
            item.hasChildren = true;
          }
        });

        this.total = response.total;
        this.loading = false;
      });
    },
    loadDistrict(tree, treeNode, resolve) {
      if(tree != null){
        let tempNode = {};
        tempNode.tree = tree;
        tempNode.treeNode = treeNode;
        tempNode.resolve = resolve;

        let findNode = false;
        this.nodeDataList.forEach(item => {
          if(item.tree.code == tempNode.tree.code){
            findNode = true;
            return false;
          }
        });
        if(!findNode){
          this.nodeDataList.push(tempNode);
        }

        let params = {pcode: tree.code};
        let result = [];
        listDistrictByPCode(params).then(reponse => {
          result = reponse.rows;
          if(tree.level < 4){
            result.forEach(item => {
              if(item.remark !== '市辖区'){
                item.hasChildren = true;
              }
            });
          }
          resolve(result);
        });
      }else{
        this.getList();
      }

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
        parentId: undefined,
        code: undefined,
        name: undefined,
        pcode: undefined,
        ancestors: undefined,
        cityCode: undefined,
        level: undefined,
        longitude: undefined,
        latitude: undefined,
        remark: undefined
      };
      this.resetForm("form");
    },
    conditionToggle() {
        if(this.$refs['toggle-container'].style.display === 'none'){
            this.$refs['toggle-container'].style.display = 'inline-block';
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
        }else{
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
        // pageNum: 1,
        // pageSize: 100,
        id: undefined,
        parentId: undefined,
        sort: undefined,
        order: undefined,
        name: undefined,
        pcode: undefined,
        ancestors: undefined,
        cityCode: undefined,
        level: '1',
        longitude: undefined,
        latitude: undefined,
        remark: undefined,
        params:{
        }
      };
      this.handleQuery();
    },
    formatLevel(row, column){
      return this.selectDictLabel(this.districtTypeList, row.level);
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
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.open = true;
      this.title = "新增";
      this.dialogIcon = 'el-icon-plus';
      if (row.code != undefined && row.code != null) {
        this.form.pcode = row.code;
        this.form.parentId = row.id;
        this.form.level = (parseInt(row.level) + 1) + '';
      }else{
        this.form.pcode = '0';
        this.form.parentId = 1;
        this.form.level = '1'
      }
      this.readOnly = false;
      this.operationType = 1;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const code = row.code;
      getDistrict(code).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.dialogIcon = 'el-icon-edit';
        this.readOnly = false;
        this.operationType = 2;
      });
    },
      /** 修改按钮操作 */
    handleView(row) {
      this.reset();
      const code = row.code;
      getDistrict(code).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "详情";
          this.dialogIcon = 'el-icon-document';
          this.readOnly = true;
          this.operationType = 3;
      });
    },
    handleDoubleClick(row, column, event){
      this.handleView(row);
    },
    openDialog(){
      // $('.modal-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto');
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.operationType === 2) {
            updateDistrict(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                // this.getList();
                this.nodeDataList.forEach(item => {
                  if(item.tree.code === this.form.pcode){
                    this.nodeData = item;
                    return false;
                  }
                });
                this.loadDistrict(this.nodeData.tree, this.nodeData.treeNode, this.nodeData.resolve);
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDistrict(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                // this.getList();
                this.nodeDataList.forEach(item => {
                  if(item.tree.code === this.form.pcode){
                    this.nodeData = item;
                    return false;
                  }
                });
                this.loadDistrict(this.nodeData.tree, this.nodeData.treeNode, this.nodeData.resolve);
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
      const codes = row.code || this.ids;
      this.$confirm('是否确认删除区域信息编号为"' + codes + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        confirmButtonClass: "btn-confirm",
          type: "warning"
        }).then(function() {
          return delDistrict(codes);
        }).then(() => {
          // this.getList();
          this.nodeDataList.forEach(item => {
            if(item.tree.code === row.pcode){
              this.nodeData = item;
              return false;
            }
          });
          this.loadDistrict(this.nodeData.tree, this.nodeData.treeNode, this.nodeData.resolve);
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有区域信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDistrict(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  },
  mounted() {
    this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 90;
    });


  }
};
