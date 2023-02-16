<template>
  <el-dialog title="视频设备选择" :visible.sync="visible" v-if="visible"
             append-to-body class="_baseForm_big"
             :before-close="close" :close-on-click-modal="false">
    <div >
      <el-row :gutter="7">
        <el-col :span="7" :xs="24">
          <div class="head-container">
            <el-input v-model="treeName" placeholder="请输入分组名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 5px" />
          </div>
          <div class="head-container treeShow" :style="{'height':treeHeight +'px','width':'100%', 'overflow': 'auto'}">
            <el-tree class="el-tree" :style="treeStyle" :data="groupTreeList" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" node-key="id" ref="tree" :default-expanded-keys="expandArr" @node-click="handleNodeClick" />
          </div>
        </el-col>
        <el-col :span="17" :xs="24">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="68px"
            style="margin-bottom: 5px">
            <div class="con-container">
              <div class="lab-container">
                <label class="condition-item-title">设备名称</label>
                <el-form-item label="" prop="devName" class="custom-el-form-item">
                  <el-input v-model="queryParams.devName" class="query-param " style="width:180px"
                            placeholder="请输入设备名称"
                            clearable size="small"/>
                </el-form-item>
              </div>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
              <el-button plain icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </div>

          </el-form>
          <el-table ref="table" v-loading="loading" stripe
                    height="380" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                    :data="devideList" @selection-change="selectionChange" @current-change="currentChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="设备名称" align="center" min-width="180px" prop="devName"
                             :render-header="renderHeader"/>
            <el-table-column label="设备编号" align="center" min-width="180px" prop="devCode"
                             :render-header="renderHeader"/>
            <el-table-column label="设备状态" align="center" width="180px" prop="status"
                             :render-header="renderHeader">
              <template slot-scope="scope">
                <span v-if="scope.row.status=='1'" style="color: green">在线</span>
                <span v-if="scope.row.status=='0'" style="color: red">离线</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            :pager-count="4"
            :page-sizes="pageList"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <div>
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
// import $ from 'jquery'
import {listOperationManage} from "@/api/operationManage/operationManage";
import {getPlatFormDevList,getGroupTree} from "@/api/video/videoApi";

export default {
  name: 'videoDeviceSelectDialog',
  props: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      visible: false,
      pageList: [20, 50, 100],
      total: 0,
      operationManageList: null,
      // 企业类型字典
      enterpriseTypeOptions: [],
      districtDisabled: true,
      queryDistrictList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        order: undefined,
        name: undefined,
        enterpriseId: undefined,
        enterpriseName: undefined,
      },
      groupTreeList:[],
      treeName:'',
      treeStyle: {
        height: '360px',
      },
      defaultProps: {
        children: 'children',
        label: 'devName'
      },
      treeHeight: 450,
      expandArr:[],
      devideList:[]
    }
  },
  watch: {
    // 根据名称筛选部门树
    treeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.init();
  },
  beforeMount() {
  },
  mounted() {
  },
  computed: {
    contentHeight: function () {
      return '410px';
    }, tableHeight: function () {
      return '360px';
    }
  },
  methods: {
    init(){
      getGroupTree().then(res=>{
        this.groupTreeList=res.data;
        if (this.groupTreeList !== undefined) {
          this.groupTreeList.forEach(item => {
            this.expandArr.push(item.id);
          })
        }
      });

    },
    show() {
      this.visible = true;
      this.handleQuery();
    },
    save() {
      let selection = this.$refs.table.selection;
      this.$emit('callBack', selection, this.callBack);
      this.close();
    },
    close() {
      this.visible = false;
    },
    handleQuery() {
      this.loading = true;
      getPlatFormDevList(this.queryParams).then(response => {
        this.devideList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        order: undefined,
        name: undefined,
        enterpriseId: this.queryParams.enterpriseId,
        enterpriseName: this.queryParams.enterpriseName,
      }
      this.handleQuery();
    },
    selectionChange(val) {
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$refs.table.toggleRowSelection(currentRow)
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
    // 企业类别字典翻译
    enterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.enterpriseTypeOptions, row.bigType);
    },
    handleNodeClick(node){
      this.queryParams.parentPlat=node.id;
      this.handleQuery()
    },
    // 筛选节点
    filterNode (value, data) {
      if (!value) return true
      try {
        return data.devName.indexOf(value) !== -1
      } catch (e) {
      }
    },
  }
}
</script>

<style scoped>
.el-tree{
  display: inline-block;
  min-width: 100%;
}
</style>

