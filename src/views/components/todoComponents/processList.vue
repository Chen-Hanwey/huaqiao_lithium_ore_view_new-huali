<template>
  <div>
    <div class="sub-project" v-show="tableList.length > 0">
      <div class="sub-title">
        <div class="sub-title-name">流程信息</div>
      </div>
      <div class="sub-body">
        <el-table key="one" ref="table"  stripe
                  :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                  :data="tableList">
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前环节" align="center" prop="dealName"   :render-header="renderHeader"/>
          <el-table-column label="当前环节处理人" align="center" prop="nickName"  :render-header="renderHeader"/>
<!--          <el-table-column label="待处理人" align="center" prop="dealUser" show-overflow-tooltip  :render-header="renderHeader">-->
<!--            <template slot-scope="scope">-->
<!--              {{(scope.row.dealUser&&(scope.row.dealUser.replace(/\[|]/g,'').replace(/\"/g,'')))|| '&#45;&#45;' }}-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column label="处理状态" align="center" prop="approveStatusCn"  :render-header="renderHeader"/>
          <el-table-column label="处理时间" align="center" prop="approveTime"  :render-header="renderHeader"/>
          <el-table-column label="处理意见" align="center" prop="approveDescription"  :render-header="renderHeader"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

import { getWfOrderList } from '@/api/myWork/wfOrderList'

export default {
  name: "processList",
  props:  ['wfOrderType', 'wfOrderEntityId'],
  data(){
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        sort: undefined,
        order: undefined
      },
      tableList:[]
    }
  },
  methods: {
    /** 查询流程信息 */
    getList() {
      this.queryParams.wfOrderType = this.wfOrderType;
      // this.queryParams.enterpriseId = this.enterpriseId;
      this.queryParams.wfOrderEntityId = this.wfOrderEntityId;
      getWfOrderList(this.queryParams).then(response => {
        this.tableList = response.rows.reverse();
      });
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
  },
  // created() {
  //   this.getList();
  // },
  watch: {
    wfOrderEntityId: {
      handler(){
        this.tableList = []
        this.getList()
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>
