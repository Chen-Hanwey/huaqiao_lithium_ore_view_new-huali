<template>
  <div style="height: 100%">
    <el-table ref="table" style="height: 80%" v-loading="loading" :data="kills" height="335" :row-style="{height: '42px'}">
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消杀对象"
        align="left"
        prop="killObj"
        style="height: 100%"
      />
      <el-table-column
        label="消杀日期"
        align="left"
        prop="killStartTime"
        style="height: 100%"
      />
      <el-table-column
        label="清洗方式"
        align="left"
        prop="cleanWay"
        style="height: 100%"
        :formatter="cleanWayFormat"
      />
      <el-table-column
        label="消毒方式"
        align="left"
        prop="disinfectWay"
        style="height: 100%"
        :formatter="disinfectWayFormat"
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
import {listKillProcessSupervise} from "@/api/killProcessSupervise/killProcessSupervise";

export default {
  name: 'killProcess',
  props: ['operationId'],
  data() {
    return {
      // 消毒方式字典
      disinfectWayOptions: [],
      // 消杀对象字典
      killObjOptions: [],
      // 清洗方式字典
      cleanWayOptions: [],
      kills: [],
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
      listKillProcessSupervise({...this.queryParams, params: {operationId: operationId}}).then(res => {
        this.kills = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    // 消毒方式字典翻译
    disinfectWayFormat(row, column) {
      return this.selectDictLabel(this.disinfectWayOptions, row.disinfectWay);
    },
    killObjFormat(row, column) {
      return this.selectDictLabel(this.killObjOptions, row.killObj);
    },
    // 清洗方式字典翻译
    cleanWayFormat(row, column) {
      return this.selectDictLabel(this.cleanWayOptions, row.cleanWay);
    },
  },
  created() {
    this.getDicts("kill_obj").then(response => {
      this.killObjOptions = response.data;
    });
    this.getDicts("clean_way").then(response => {
      this.cleanWayOptions = response.data;
    });
    this.getDicts("disinfect_way").then(response => {
      this.disinfectWayOptions = response.data;
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
