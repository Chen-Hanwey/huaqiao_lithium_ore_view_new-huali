<template>
  <div style="height: 100%">
    <el-table ref="table" style="height: 80%" v-loading="loading" :data="foodSamples" height="335" :row-style="{height: '42px'}">
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="留样时间"
        align="left"
        prop="reserveTime"
        style="height: 100%"
      />
      <el-table-column
        label="留样餐次"
        align="left"
        prop="mealType"
        style="height: 100%"
        :formatter="mealTypeFormat"
      />
      <el-table-column
        label="用餐对象"
        align="left"
        prop="mealEater"
        style="height: 100%"
      />
      <el-table-column
        label="留样部门"
        align="left"
        prop="reserveDeptName"
        style="height: 100%"
      />
      <el-table-column
        label="订餐单位"
        align="left"
        prop="orderUnit"
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

import {handlePicturePath} from "@/utils/ruoyi";
import {listFoodSample} from "@/api/foodSample/foodSample";

export default {
  name: 'foodSample',
  props: ['operationId'],
  data() {
    return {
      foodSamples: [],
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
      mealTypeOptions: [],
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
      certificationTypeOptions: [],
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
    getList(operationId) {
      this.loading = true;
      listFoodSample({...this.queryParams, params: {operationId: operationId}}).then(res => {
        this.foodSamples = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    certificationTypeFormat(row, column) {
      return this.selectDictLabel(this.certificationTypeOptions, row.certificationType)
    },
    mealTypeFormat(row, column) {
      return this.selectDictLabel(this.mealTypeOptions, row.mealType);
    },
  },
  created() {
    this.getDicts("meal_type").then(response => {
      this.mealTypeOptions = response.data;
    });
  },
  computed: {
    getImgPath() {
      return function (path) {
        if (path) {
          return handlePicturePath(path)
        }
      }
    }
  },
  watch: {
    operationId: {
      handler(newValue) {
        this.getList(newValue)
      },
      immediate: true
    }
  }
}

</script>
