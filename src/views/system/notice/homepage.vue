<template>
  <div style="height: 100%" ref="box">
    <el-table ref="table" style="height: 100%" :height="tableHeight" v-loading="loading" :data="noticeList"
              :show-header="false"
              @sort-change="changeTableSort" @selection-change="handleSelectionChange">
      <!--      <el-table-column label="序号" align="left" type="index" width="60">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        label="公告标题"
        align="left"
        prop="noticeTitle"
        min-width="140px"
        style="height: 100%"
        :show-overflow-tooltip="true" :render-header="(h,obj) => renderHeader(h,obj)"
      >
        <template slot-scope="scope">
          <span @click="handleView(scope.row)"
                style="color: rgb(64, 158, 255);cursor: pointer;font-size: 13px;">{{ scope.row.noticeTitle }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作" align="left" width="80" class-name="small-padding fixed-width">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            type="text"-->
      <!--            icon="el-icon-document"-->
      <!--            @click="handleView(scope.row)"-->
      <!--          >详情-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <el-pagination
      small
      :page-size="[8, 100, 200, 500, 1000]"
      style="text-align: right"
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="queryParams.pageNum"
      :page-size.sync="queryParams.pageSize"
      @current-change="getList">
    </el-pagination>
    <!-- 新增或修改公告对话框 -->
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog"
               :before-close="beforeCloseDialog">
      <div slot="title">
        <!--<span><i :class="dialogIcon"></i></span>-->
        <span> {{ title }}</span>
      </div>
      <div class="notice-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公告类型" prop="noticeType">
              <el-select v-model="form.noticeType" placeholder="请选择">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="noticeContent">
              <!--<Editor v-if="open" ref="editor" v-model="form.noticeContent" />-->
              <NEditor v-if="open" ref="editor" v-model="form.noticeContent"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增或修改公告对话框 -->
<!--    <el-dialog :visible.sync="viewOpen" width="500px" style="top:10%;height: 80%" :close-on-click-modal="false"-->
<!--               class="customForm " :title="form.noticeTitle">-->
      <el-dialog :visible.sync="viewOpen" :close-on-click-modal="false"
                 class="customForm _baseForm_big" :title="form.noticeTitle">
      <div class="notice-body">
        <div v-html="form.noticeContent" style="overflow-x: hidden"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import notice from './notice';
import $ from "jquery";

export default {
  ...notice,
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
      // 公告表格数据
      noticeList: [],
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
        pageSize: 8,
        noticeTitle: undefined,
        nickName: undefined,
        createBy: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeTitle: [
          {required: true, message: "公告标题不能为空", trigger: "blur"}
        ],
        noticeType: [
          {required: true, message: "公告类型不能为空", trigger: "blur"}
        ],
        status: [
          {required: true, message: "公告状态不能为空", trigger: "blur"}
        ],
        noticeContent: [
          {required: true, message: "公告内容不能为空", trigger: "blur"}
        ]
      },
      columnLabel: ''
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_notice_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_notice_type").then(response => {
      this.typeOptions = response.data;
    });
  },
  /** 查询公告列表 */
  getList() {
    this.loading = true;
    listNotice(this.queryParams).then(response => {
      this.noticeList = response.rows;
      this.total = response.total;
      this.loading = false;
    });
  },
  mounted() {
    this.$nextTick(v => {
      this.tableHeight = this.$refs.box.offsetHeight - 30
    })
  }
}

</script>
