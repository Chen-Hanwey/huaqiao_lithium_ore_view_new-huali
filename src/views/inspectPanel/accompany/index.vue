<template>
  <div style="height: 100%">
    <el-table ref="table" style="height: 80%"  v-loading="loading" :data="accompanyList" height="335" :row-style="{height: '42px'}">
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="陪餐日期"
        align="left"
        prop="accDate"

        style="height: 100%"

      />
      <el-table-column
        label="陪餐餐次"
        align="left"
        prop="accMealType"

        style="height: 100%" :formatter="mealTypeFormat"
      />
      <el-table-column prop="acc_meal_status" :formatter="manageStatusFormat" label="陪餐状态" align="left" class-name="small-padding fixed-width">

      </el-table-column>
      <el-table-column
        label="陪餐菜单"
        align="left"
        prop="accMenuName"

        style="height: 100%"

      />
    </el-table>
    <el-pagination
      small
      :page-size="[8, 100, 200, 500, 1000]"
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
import {listAccompanyManage} from "@/api/accompanyManage/accompanyManage";

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
      accompanyList: [],
      //表格高度
      tableHeight: '100%',
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      viewOpen: false,
      // 类型数据字典
      statusOptions: [],
      mealTypeOptions: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 7,
      },
      // 表单参数
      form: {},
      columnLabel: ''
    };
  },
  methods: {
    /** 查询公告列表 */
    getList(enterpriseId) {
      this.loading = true;
      listAccompanyManage({...this.queryParams, enterpriseId: enterpriseId}).then(res => {
        this.accompanyList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    mealTypeFormat(row, column) {
      return this.selectDictLabel(this.mealTypeOptions, row.accMealType);
    },
    manageStatusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.accMealStatus);
    },
  },
  created() {
    this.getDicts("meal_type").then(response => {
      this.mealTypeOptions = response.data;
    });
    this.getDicts("accompany_manage_status").then(response => {
      this.statusOptions = response.data;
    });
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
