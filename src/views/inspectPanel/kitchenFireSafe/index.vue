<template>
  <div style="height: 100%">
    <el-table ref="table" style="height: 80%" v-loading="loading" :data="safeData" height="335" :row-style="{height: '42px'}">
      <el-table-column label="序号" align="left" type="index" width="60">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="安检日期"
        align="left"
        prop="fireDate"
        style="height: 100%"
      />
      <el-table-column
        label="安检地点"
        align="left"
        prop="firePlace"
        style="height: 100%"
      />
      <el-table-column
        label="安检记录"
        align="left"
        prop="fireRecord"
        style="height: 100%"
      />
      <el-table-column
        label="安检人员"
        align="left"
        prop="firePerson"
        style="height: 100%"
      />
      <el-table-column
        label="安检图片"
        align="left"
        prop="firePicture"
        style="height: 100%"
      >
        <template slot-scope="scope">
          <el-tooltip class="item table-img" effect="dark" content="点击查看大图" placement="top-start">
            <div @click="openBigImgShow(scope.row)">
              <el-image style="width: 40px; height: 40px"
                        :src="handleImg(scope.row.firePicture ? scope.row.firePicture.split(',')[0] : '')">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </el-tooltip>
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
    <el-dialog
      :visible.sync="previewBigImg.show"
      width="30%">
      <div slot="title">
        <span><i :class="previewBigImg.dialogIcon"></i></span>
        <span> {{ previewBigImg.title }}</span>
      </div>
      <div style="text-align: center">
        <el-image v-if="previewBigImg.url" :src="previewBigImg.url"></el-image>
        <el-image v-if="!previewBigImg.url" :src="previewBigImg.url" style="width: 200px;">
          <div slot="error" class="image-slot" style="text-align: center">
            <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
              暂无图片</i>
          </div>
        </el-image>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewBigImg.show = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import {listKitchenPerson} from "@/api/kitchenPerson/kitchenPerson";
import {list} from "@/api/certification/certification";
import {handlePicturePath, handlePicturePathSingle} from "@/utils/ruoyi";
import {getList} from "@jiaminghi/data-view/deploy/plugin/ftp";
import {listMorningCheck} from "@/api/morningCheck/morningCheck";
import {listHistory} from "@/api/check/history";
import {listExerciseRecord} from "@/api/exerciseRecord/exerciseRecord";
import {listKitchenFireSafetySupervise} from "@/api/kitchenFireSafetySupervise/kitchenFireSafetySupervise";

export default {
  name: 'exercise',
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
      safeData: [],
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
        pageSize: 5,
      },
      // 表单参数
      form: {},
      // 表单校验
      columnLabel: '',
      previewBigImg: {
        show: false,
        titile: null,
        url: null
      },
    };
  },
  methods: {
    /** 查询公告列表 */
    getList(operationId) {
      this.loading = true;
      listKitchenFireSafetySupervise({...this.queryParams, params: {operationId: operationId}}).then(res => {
        this.safeData = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    handleImg(path){
      return handlePicturePathSingle(path);
    },
    openBigImgShow(row){
      this.previewBigImg.show = true;
      this.previewBigImg.dialogIcon = 'el-icon-picture';
      this.previewBigImg.title = '图片查看';
      if(row.firePicture){
        this.previewBigImg.url = handlePicturePathSingle(row.firePicture.split(',')[0]);
      }else {
        this.previewBigImg.url = null
      }
    },
  },
  created() {

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
