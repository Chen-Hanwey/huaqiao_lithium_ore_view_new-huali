<template>
  <div style="height: 100%">
    <el-table ref="table" style="height: 80%"  v-loading="loading" :data="kitchenPersonList" height="335" :row-style="{height: '42px'}">
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="单位名称"
        align="left"
        prop="operationName"
        min-width="120px"
        style="height: 100%"

      />
      <el-table-column
        label="姓名"
        align="left"
        prop="name"
        min-width="80px"
        style="height: 100%"

      />
      <el-table-column prop="sex" label="性别" align="left" width="80" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          {{ scope.row.sex == 0 ? '男' : scope.sex == 1 ? '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column
        label="电话"
        align="left"
        prop="telephone"
        min-width="140px"
        style="height: 100%"

      />
    </el-table>
    <el-pagination
      small

      style="text-align: right"
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="queryParams.pageNum"
      :page-size.sync="queryParams.pageSize"
      @current-change="getList(operationId)">
    </el-pagination>
  </div>
</template>

<script>
import $ from "jquery";
import {listKitchenPerson} from "@/api/kitchenPerson/kitchenPerson";
import {getList} from "@jiaminghi/data-view/deploy/plugin/ftp";

export default {
  name: 'kitchenPerson',
  props: ['operationId'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 公告表格数据
      noticeList: [],
      kitchenPersonList: [],
      //表格高度
      tableHeight: '100%',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      viewOpen: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 7,
      },
      // 表单参数
      form: {},
      // 表单校验
      columnLabel: ''
    };
  },
  methods: {
    /** 查询公告列表 */
    getList(enterpriseId) {
      this.loading = true;
      listKitchenPerson({...this.queryParams, enterpriseId: enterpriseId}).then(res => {
        this.kitchenPersonList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
  },
  watch: {
    operationId: {
      handler(newValue){
        this.getList(newValue)
      },
      immediate: true
    }
  }
}

</script>
