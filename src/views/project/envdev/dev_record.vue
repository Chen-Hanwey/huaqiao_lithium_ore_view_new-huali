<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--左侧-->
      <el-col :span="5" :xs="24">
        <!--<el-tabs v-model="activeName" :style="{height:contentHeight, overflow: 'auto',width:'100%'}" type="border-card"
                 @tab-click="handleClick">-->
        <!-- <el-tab-pane label="广场视频" name="first">
          <el-input placeholder="请输入" maxlength="50" size="mini" v-model="tree.square.search" clearable
                    style="margin-bottom:8px;">
            <el-button slot="append" icon="el-icon-search" @click="initTreeSquare"></el-button>
          </el-input>
          <el-tree
            :data="tree.square.data"
            :props="tree.defaultTreeProps"
            ref="treeSquare"
            :highlight-current="true"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div @click="treeClick(data)" :class="[data.isOnline===0?'isOnline_0':'isOnline_1','custom-tree-node-left']">
                <i v-if="data.type===2" class="el-icon-s-order"></i>
                <i v-if="data.type===3" class="el-icon-camera-solid"></i>
                <span>{{ node.label }}</span>
              </div>
              <div :class="[data.isOnline===0?'isOnline_0':'isOnline_1','custom-tree-node-right']">
                <span v-if="data.isEnable===0" class="isEnable">启用</span>
                <span v-else-if="data.isEnable===1" class="isEnable">未用</span>
                <span v-else class="isEnable">未用</span>
                <div style="width: 15px;text-align: center;float: right;">
                  <i v-if="data.type===3" :class="data.isFavorite===0?'el-icon-star-on':'el-icon-star-off'"
                     @click="changeFavorite(data,1)"></i>
                </div>
              </div>
            </div>
          </el-tree>
        </el-tab-pane> -->
        <!--<el-tab-pane label="设备列表" name="second">-->
        <div class="head-container">
          <el-input
            placeholder="请输入"
            style="margin-bottom: 5px"
            v-model="filterText">
          </el-input>
        </div>
        <div class="head-container treeShow" :style="{'height':treeHeight+'px', 'overflow': 'auto'}">
          <el-tree
            :data="tree.label.data"
            :props="tree.defaultTreeProps"
            ref="treeLabel"
            :highlight-current="true"
            :filter-node-method="filterNode"
          ><!--@node-click="treeClick"-->
            <span class="custom-tree-node" slot-scope="{ node, data }">
                  <div @click="treeClick(data)"
                       :class="[data.isOnline===0?'isOnline_0':'isOnline_1','custom-tree-node-left']">
                    <!-- <i v-if="data.type===1" class="el-icon-folder-opened"></i>-->
                    <i class="el-icon-camera-solid"></i>
                    <span>{{ node.label }}</span>
                  </div>
              <!-- <div :class="[data.isOnline===0?'isOnline_0':'isOnline_1','custom-tree-node-right']">
                <span v-if="data.isEnable===0" class="isEnable">启用</span>
                <span v-else-if="data.isEnable===1" class="isEnable">未用</span>
                <div style="width: 15px;text-align: center;float: right" :class="'star_id_'+data.deviceId">
                <i v-if="data.type===3" :class="data.isFavorite===0?'el-icon-star-on':'el-icon-star-off'"
                   @click="changeFavorite(data,2)"></i>
                </div>
              </div> -->
                </span>
          </el-tree>
        </div>
        <!--</el-tab-pane>-->
        <!-- <el-tab-pane label="收藏" name="third">
           <el-input placeholder="请输入" maxlength="50" size="mini" v-model="tree.favorite.search" clearable
                     style="margin-bottom:8px;">
             <el-button slot="append" icon="el-icon-search" @click="initTreeFavorite"></el-button>
           </el-input>
           <el-tree
             :data="tree.favorite.data"
             :props="tree.defaultTreeProps"
             ref="treeFavorite"
             :highlight-current="true"
           >&lt;!&ndash;@node-click="treeClick"&ndash;&gt;
             <div class="custom-tree-node" slot-scope="{ node, data }">
               <div @click="treeClick(data)" :class="[data.isOnline===0?'isOnline_0':'isOnline_1','custom-tree-node-left']">
                 <i v-if="data.type===2" class="el-icon-s-order"></i>
                 <i v-if="data.type===3" class="el-icon-camera-solid"></i>
                 <span>{{ node.label }}</span>
               </div>
               <div :class="[data.isOnline===0?'isOnline_0':'isOnline_1','custom-tree-node-right']">
                 <span v-if="data.isEnable===0" class="isEnable">启用</span>
                 <span v-else-if="data.isEnable===1" class="isEnable">未用</span>
                 <span v-else class="isEnable">未用</span>
                 <div style="width: 15px;text-align: center;float: right">
                   <i v-if="data.type===3" :class="data.isFavorite===0?'el-icon-star-on':'el-icon-star-off'"
                      @click="changeFavorite(data,3)"></i>
                 </div>
               </div>
             </div>
           </el-tree>
         </el-tab-pane>-->
        <!--</el-tabs>-->
      </el-col>
      <!--右侧视频-->
      <el-col :span="19" :xs="24" style="border-left: 1px solid #e2e2e2">
        <!--<el-card :style="{height:contentHeight, overflow: 'auto',width:'100%'}">-->
        <!--<div class="right-container">-->
        <el-form :model="queryParams" class="search-form" ref="queryForm" :inline="true" label-width="68px"
                 style="margin-bottom: 5px">
          <el-form-item label="采集时间" prop="birthday">
            <el-date-picker clearable size="small" style="width: 240px;"
                            v-model="queryParams.birthdayRange"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            placeholder="选择出生日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-setting" size="mini" @click="conditionToggle">条件
            </el-button>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="getRecordList">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini"
                       @click="handleExport()" v-hasPermi="['project:record:export']">导出
            </el-button>
          </el-form-item>
          <div class="toggle-container" ref="toggle-container" style="display: none;border-left:none">
            <el-form-item label="ph" prop="ph">
              <el-input v-model="queryParams.ph" placeholder="请输入ph" clearable size="small" class="query-param">
              </el-input>
            </el-form-item>
            <el-form-item label="水温" prop="temperature">
              <el-input v-model="queryParams.temperature" placeholder="请输入水温" clearable size="small"
                        class="query-param">
              </el-input>
            </el-form-item>
            <el-form-item label="溶解氧" prop="dissolveOxy">
              <el-input v-model="queryParams.dissolveOxy" placeholder="请输入溶解氧" clearable size="small"
                        class="query-param">
              </el-input>
            </el-form-item>
            <el-form-item label="电导率" prop="conductivity">
              <el-input v-model="queryParams.conductivity" placeholder="请输入电导率" clearable size="small"
                        class="query-param">
              </el-input>
            </el-form-item>
            <el-form-item label="浊度" prop="turbidity">
              <el-input v-model="queryParams.turbidity" placeholder="请输入浊度" clearable size="small" class="query-param">
              </el-input>
            </el-form-item>
          </div>
        </el-form>

        <el-table ref="table" v-loading="loading" stripe @sort-change="changeTableSort"
                  :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                  :data="recordList" @selection-change="handleSelectionChange">
          <el-table-column sortable label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column sortable label="设备名称" width="250" sortable :render-header="renderHeader" prop="devName"/>
          <el-table-column sortable label="ph" sortable :render-header="renderHeader" prop="ph"/>
          <el-table-column sortable label="水温" sortable :render-header="renderHeader" prop="temperature"/>
          <el-table-column sortable label="溶解氧" sortable :render-header="renderHeader" prop="dissolveOxy"/>
          <el-table-column sortable label="电导率" sortable :render-header="renderHeader" prop="conductivity"/>
          <el-table-column sortable label="浊度" sortable :render-header="renderHeader" prop="turbidity"/>
          <el-table-column sortable label="采集时间" sortable :render-header="renderHeader" prop="acqtime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.acqtime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
                v-hasPermi="['project:record:query']"
              >详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page-sizes="[20, 30, 50, 100]"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getRecordList"
        />
        <!-- 查看详情 -->
        <el-dialog center :visible.sync="open" :close-on-click-modal="false" class="_baseForm_big">
          <div slot="title">
            <span><i :class="dialogIcon"></i></span>
            <span> 数据监测详情</span>
          </div>
          <div class="content-body"></div>
          <el-form ref="viewForm" :model="form" label-width="130px">
            <div class="sub-project">
              <div class="sub-title">
                <div class="sub-title-name">基本信息</div>
              </div>
              <div class="sub-body">
                <el-row>
                  <el-form-item sortable label="ph" prop="ph" class="custom-form-item">
                    {{form.ph}}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item sortable label="水温" prop="temperature" class="custom-form-item">
                    {{form.temperature}}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item sortable label="溶解氧" prop="dissolveOxy" class="custom-form-item">
                    {{form.dissolveOxy}}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item sortable label="电导率" prop="conductivity" class="custom-form-item">
                    {{form.conductivity}}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item sortable label="浊度" prop="turbidity" class="custom-form-item">
                    {{form.turbidity}}
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item sortable label="采集时间" prop="acqtime" class="custom-form-item">
                    {{form.acqtime}}
                  </el-form-item>
                </el-row>
              </div>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="" @click="open = false">关 闭</el-button>
          </div>
        </el-dialog>
        <!--</div>-->
        <!--</el-card>-->
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
  .closeBox {
    position: relative;
  }

  .closeText {
    position: absolute;
    cursor: pointer;
    top: 5px;
    right: 5px;
    z-index: 9999;
    color: #FFFFFF;
    background-color: #1f1f1f;
    border-radius: 5px;
    font-size: 12px;
    padding: 3px;
  }
</style>

<script>
import $ from 'jquery'

import {exportEnvRecord, getEnvRecord, listEnvRecord, tree} from '@/api/project/envDev/envdev'

export default {
    name: 'preview',
    components: {
    },
    data() {
      return {
        // 弹出框
        open: false,
        dialogIcon: '',
        ids: [],
        devIds: [],
        // 遮罩层
        loading: false,
        // 总条数
        total: 0,
        // 环境监测设备表格数据
        recordList: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 20,
          devId: null,
          params: {
            beginTransitionTime: undefined,
            endTransitionTime: undefined,
          }
        },
        form:{},
        recordInfo: {},
        filterText: '',
        tree: {
          defaultTreeProps: {
            children: 'children',
            label: 'label'
          },
          square: {
            data: null,
            search: ''
          },
          label: {
            data: null
          },
          favorite: {
            data: null,
            search: ''
          }
        },
        activeName: 'second',
        contentHeight: $(window).height() - 92 + 'px',
        treeHeight: 450,
        tableHeight: 450,
      }
    },
    watch: {
      filterText(val) {
        this.$refs.treeLabel.filter(val);
      },

      showSearch(val) {
        this.$nextTick(function () {
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
        });
      },
      '$store.state.app.screenHeight': function () { //监听屏幕高度变化
    /*    this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;*/
        if (this.$refs.table.$el.offsetTop) {
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 140;
        } else {
          this.tableHeight = window.innerHeight - 62 - 140;
        }
        this.treeHeight = window.innerHeight - 170;
        this.openDialog();
      },
      selectGridInfo: function (newVal, oldVal) {
        if (newVal) {
          this.form.gridName = newVal.gridName
          this.form.gridid = newVal.id
          this.showSelectGridInfo = false
        }
      }
    },
    created() {

    },
    mounted() {
      let that = this
      that.initTreeLabel()
      that.getRecordList()
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
        this.treeHeight = window.innerHeight - 170;
      });
    },
    beforeDestroy() {
      let that = this
      clearInterval(that.timer)
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handleClick(tab, event) {
        let that = this
        if (tab.name == 'first') {
          that.initTreeSquare()
        } else if (tab.name == 'second') {
          that.initTreeLabel()
        } else if (tab.name == 'third') {
          that.initTreeFavorite()
        }
      },
      /** 多选 */
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id);
        this.devIds = selection.map(item => item.devId);
      },
      /** 导出按钮操作 */
      handleExport() {
        let exportMsg = '是否导出所有信息项?'
        if (this.devIds && this.devIds.length > 0) {
          this.queryParams.devIds = this.devIds
          exportMsg = '是否需要导出所有信息项?'
        } else {
          delete this.queryParams.devIds
        }
        const queryParams = JSON.parse(JSON.stringify(this.queryParams));
        delete queryParams.page
        delete queryParams.pageNum
        delete queryParams.pageSize
        this.$confirm(exportMsg, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportEnvRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      },
      /** 查看按钮操作 */
      handleView(row) {
        //this.resetQuery();
        const id = row.id;
        this.fileList = [];
        getEnvRecord(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "查看";
          this.dialogIcon = 'el-icon-view';
          this.readOnly = true;
          if (this.form.link == null || this.form.link == '') {
            this.localContent = true;
          } else {
            this.localContent = false;
          }
          this.operationType = 3;
          if (this.form.picturePath != null && this.form.picturePath != '') {
            this.isImage = true;
            this.dialogImageUrl = process.env.VUE_APP_PICTURE_PATH + this.form.picturePath;
          }
          if (response.data.appendixList) {
            response.data.appendixList.forEach(item => {
              let file = {};
              file['uid'] = item.appendixId;
              file['url'] = process.env.VUE_APP_PICTURE_PATH + item.appendixPath;
              file['name'] = item.appendixName;
              this.fileList.push(file);
            });
          }
        });
      },
      // 获取广场视频树
      initTreeSquare() {
        let that = this
        let query = {
          name: that.tree.square.search
        }
        getTreeSquare(query).then(response => {
          that.tree.square.data = response.data
        })
      },
      // 获取分组列表树
      initTreeLabel() {
        let that = this
        tree().then(response => {
          that.tree.label.data = response.data
        })
      },
      // 获取收藏树
      initTreeFavorite() {
        let that = this
        let query = {
          name: that.tree.favorite.search
        }
        getTreeFavorite(query).then(response => {
          that.tree.favorite.data = response.data
        })
      },
      // 修改是否收藏
      changeFavorite(data, type) {
        let that = this
        let favoriteData = {
          channelId: data.id
        }
        if (data.isFavorite === 0) { // 已收藏，改为未收藏
          delFavorite(favoriteData).then(response => {
            this.changeTreeFavorite(data.id, type, 1)
            this.msgSuccess('通道已移除收藏夹！')
            if (type === 2) {//分组单独处理
              $('.star_id_' + data.deviceId).find("i").attr("class", "el-icon-star-off");
              data.isFavorite = 1;
            }
          })
        }
        if (data.isFavorite === 1) { //未收藏，改为收藏
          addFavorite(favoriteData).then(response => {
            this.changeTreeFavorite(data.id, type, 0)
            this.msgSuccess('通道已添加收藏夹！')
            if (type === 2) {//分组单独处理
              $('.star_id_' + data.deviceId).find("i").attr("class", "el-icon-star-on");
              data.isFavorite = 0;
            }
          })
        }
      },
      //修改广场视频收藏
      changeTreeFavorite(channelId, type, isFavorite) {
        if (type === 2) {

        } else {
          let treeData = null
          if (type === 1) {
            treeData = this.tree.square.data
          }
          /*if (type === 2) {
            treeData = this.tree.label.data
          }*/
          if (type === 3) {
            treeData = this.tree.favorite.data
          }
          for (let i = 0; i < treeData.length; i++) {
            let item = treeData[i]
            if (item.children) {
              for (let m = 0; m < item.children.length; m++) {
                if (item.children[m].type === 3 && item.children[m].id == channelId) {
                  item.children[m].isFavorite = isFavorite
                  break
                }
              }

            }
          }
        }
      },
      /** 字段排序显示 */
      renderHeader(h, {column, $index}, width) {
        let color = '#515a6e';
        let that = this;
        if (that.columnLabel != '' && that.columnLabel == column.label) {
          color = "#ff6600";
        }
        let style = {};
        if (width) {
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
        this.getRecordList();
      },
      //-------------------------------------------------------------------------右侧视频相关
      // 点击左侧树联动右侧视频
      treeClick(data, node) {
        let that = this
        let isInActivity = false
        this.loading = true;
        that.queryParams.devId = data.data.devId
        listEnvRecord(that.queryParams).then(response => {
          this.recordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getRecordList() {
        let that = this
        this.loading = true;
        this.queryParams.params.beginTransitionTime = this.queryParams.transitionTimeRange && this.queryParams.transitionTimeRange.length > 0 ? this.queryParams.transitionTimeRange[0] : '';
        this.queryParams.params.endTransitionTime = this.queryParams.transitionTimeRange && this.queryParams.transitionTimeRange.length > 0 ? this.queryParams.transitionTimeRange[1] : '';
        console.log(this.queryParams)
        listEnvRecord(that.queryParams).then(response => {
          this.recordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      resetQuery() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 20,
          params: {
            beginTransitionTime: undefined,
            endTransitionTime: undefined,
          }
        };
        this.getRecordList();
      },
      /** 条件按钮 */
      conditionToggle() {
        if (this.$refs['toggle-container'].style.display === 'none') {
          this.$refs['toggle-container'].style.display = 'inline-block';
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
        } else {
          this.$refs['toggle-container'].style.display = 'none';
          this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 145;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .right-container {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  ::v-deep .el-tabs__item {
    padding: 0 10px;
  }

  ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  }

  .right-container-video {
  }

  .custom-tree-node {
    font-size: 14px;
    width: 100%;
  }

  .custom-tree-node-left {
    float: left;
    font-size: 12px;
    width: 60%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .custom-tree-node-right {
    float: right;
    font-size: 12px;
    padding-right: 4px;
    text-align: right;
  }

  .isOnline_1 {
    font-size: 12px;
  }

  .isOnline_1 .isEnable {
    color: #279c32;
  }

  .isOnline_1 .el-icon-star-on {
    color: #f90;
    font-size: 15px;
  }

  .isOnline_0 .el-icon-star-on {
    font-size: 14px;
    color: #f90;
  }

  .isOnline_0 {
    font-size: 12px;
    color: #b9b9b9;
  }
</style>
