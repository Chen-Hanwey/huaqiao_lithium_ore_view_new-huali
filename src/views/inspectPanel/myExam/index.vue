<template>
  <div style="height: 100%">
    <el-table ref="table" style="height: 80%"  v-loading="loading" :data="exerciseData" height="335" :row-style="{height: '42px'}">
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="考试日期"
        align="left"
        prop="exerciseTheme"
        style="height: 100%"
      />
      <el-table-column
        label="考试名称"
        align="left"
        prop="exercisePerson"
        style="height: 100%"
      />
      <el-table-column
        label="考试状态"
        align="left"
        prop="exerciseDate"
        style="height: 100%"
      >
      </el-table-column>
      <el-table-column
        label="考试分数"
        align="left"
        prop="exerciseDate"
        style="height: 100%"
      >
      </el-table-column>
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
import {list} from "@/api/certification/certification";
import {handlePicturePath} from "@/utils/ruoyi";
import {getList} from "@jiaminghi/data-view/deploy/plugin/ftp";
import {listMorningCheck} from "@/api/morningCheck/morningCheck";
import {listHistory} from "@/api/check/history";
import {listExerciseRecord} from "@/api/exerciseRecord/exerciseRecord";
export default {
  name: 'myExam',
  props: ['operationId'],
  data() {
    return {
      // 遮罩层
      loading: false,
      rectificationStatusDicList: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      exerciseData: [],
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
    // getList(operationId) {
    //   this.loading = true;
    //   listExerciseRecord({...this.queryParams,params:{operationId: operationId}}).then(res => {
    //     this.exerciseData = res.rows
    //     this.total = res.total
    //     this.loading = false
    //   })
    // },
  },
  created() {
    // this.getDicts("rectification_status").then(response => {
    //   this.rectificationStatusDicList = response.data;
    // });
  },
  // watch: {
  //   operationId: {
  //     handler(newValue){
  //       this.getList(newValue)
  //     },
  //     immediate: true
  //   }
  // }
}

</script>
