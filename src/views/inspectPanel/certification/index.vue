<template>
  <div style="height: 100%">
    <el-table ref="table" style="height: 80%"  v-loading="loading" :data="certificates" height="335"
             >
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="资质类型"
        align="left"
        prop="certificationType"

        style="height: 100%"
        :formatter="certificationTypeFormat"
      />
      <el-table-column
        label="到期日期"
        align="left"
        prop="expireDate"

        style="height: 100%"
      />
      <el-table-column
        label="审核状态"
        align="left"
        prop="status"

        style="height: 100%"
      >
        <template slot-scope="scope">
          {{scope.row.status == 1 ? '待审核' : scope.row.status == 2 ? '审核通过' : '审核驳回'}}
        </template>
      </el-table-column>
      <el-table-column prop="picture" label="资质图片" align="left"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <img width="80px" :src="getImgPath(scope.row.picture)" alt="">
        </template>
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
export default {
  name: 'certificate',
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
      certificates: [],
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
        pageSize: 3,
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
      list({...this.queryParams,params:{operationId: operationId}}).then(res => {
        this.certificates = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    certificationTypeFormat(row,column){
      return this.selectDictLabel(this.certificationTypeOptions,row.certificationType)
    }
  },
  created() {
    this.getDicts("certification_type").then(response => {
      this.certificationTypeOptions = response.data;
    });
  },
  computed: {
    getImgPath(){
      return function (path) {
        if (path){
          return handlePicturePath(path)
        }
      }
    }
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
