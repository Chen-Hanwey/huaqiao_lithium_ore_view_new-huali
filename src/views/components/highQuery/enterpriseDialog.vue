<template>
  <el-dialog title="选择企业" :visible.sync="visible" v-if="visible"
             append-to-body class="_baseForm_small"
             :before-close="close" :close-on-click-modal="false">
    <div>
      <el-row :gutter="7">
        <el-col :span="24" :xs="24">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="68px"
            style="margin-bottom: 5px">
            <div class="con-container">
              <div class="lab-container">
                <label class="condition-item-title" v-if="showDistrict">所属区县</label>
                <el-select v-if="showDistrict" v-model="queryParams.areaDistrict" placeholder="--全部--" style="width:180px" filterable
                           disabled
                           size="small" class="query-param">
                  <el-option
                    v-for="dict in queryDistrictList"
                    :key="dict.code"
                    :label="dict.name"
                    :value="dict.code"
                  />
                </el-select>
                <label class="condition-item-title">企业名称</label>
                <el-form-item label="" prop="name" class="custom-el-form-item">
                  <el-input v-model="queryParams.name" class="query-param " style="width:180px" placeholder="请输入企业名称"
                            clearable size="small"/>
                </el-form-item>
              </div>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
              <el-button plain icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </div>

          </el-form>
          <el-table ref="table" v-loading="loading" stripe
                    height="380" :header-cell-style="{fontSize:'14px', fontWeight:'500'}"
                    :data="enterpriseList" @selection-change="selectionChange" @current-change="currentChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="企业名称" align="center" prop="name" :render-header="renderHeader"/>
            <el-table-column label="信用代码" align="center" prop="creditCode" :render-header="renderHeader"/>
            <el-table-column label="企业负责人" align="center" prop="principal" :render-header="renderHeader"/>
            <el-table-column label="负责人联系方式" align="center" prop="principalPhone" :render-header="renderHeader"/>
          </el-table>

          <pagination
            :page-sizes="pageList"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <div>
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
// import $ from 'jquery'
import {listEnterprise} from "@/api/enterprise/enterprise";
import {listDistrict} from "@/api/system/district";

export default {
  name: 'enterpriseDialog',
  props: {
    showDistrict: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      visible: false,
      pageList: [10, 20, 30, 50],
      total: 0,
      enterpriseList: null,
      // 企业类型字典
      enterpriseTypeOptions: [],
      districtDisabled: true,
      queryDistrictList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        order: undefined,
        name: undefined,
        districtCode: undefined,
        areaDistrict: undefined,
      },
      curEnterpriseId: undefined
    }
  },
  created() {

  },
  beforeMount() {
  },
  mounted() {
    this.$bus.$on('defaultSelect',body=> {
      this.curEnterpriseId = body.enterpriseId
    })
    this.$bus.$on('reset',()=> {
      this.resetQuery()
    })
  },
  computed: {
    contentHeight: function () {
      return '510px';
    }, tableHeight: function () {
      return '360px';
    }
  },
  methods: {
    show(districtCode) {
      this.visible = true;
      this.handleQuery();
      this.queryParams.districtCode = districtCode;
      this.queryParams.areaDistrict = districtCode;
      this.getDistrictList(process.env.VUE_APP_CITY_DEFAULT)
    },
    save() {
      let selection = this.$refs.table.selection;
      (selection.length>0)?(this.curEnterpriseId = selection[0].id):(this.curEnterpriseId=undefined)
      this.$emit('callBack', selection, this.callBack);
      this.close();
    },
    close() {
      this.visible = false;
    },
    handleQuery() {
      this.loading = true;
      this.queryParams.logoutFlag='N';
      listEnterprise(this.queryParams).then(response => {
        this.enterpriseList = response.rows;
        this.total = response.total;
        this.loading = false;

        if (this.curEnterpriseId){
          this.$nextTick(()=>{
            for (let i = 0; i < this.enterpriseList.length; i++) {
              if (this.curEnterpriseId == this.enterpriseList[i].id){
                this.$refs.table.toggleRowSelection(this.enterpriseList[i],true)
              }
            }
          })
        }
      });
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        sort: undefined,
        order: undefined,
        name: undefined,
        districtCode: this.queryParams.districtCode,
        areaDistrict: this.queryParams.districtCode,
      }
      this.curEnterpriseId = undefined
      this.handleQuery();
    },
    selectionChange(val) {
      if (val.length > 1) {
        this.$refs.table.clearSelection()
        this.$refs.table.toggleRowSelection(val.pop())
      } else {
      }
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$refs.table.toggleRowSelection(currentRow)
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
    // 企业类别字典翻译
    enterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.enterpriseTypeOptions, row.enterpriseBigType);
    },

    /** 根据地市获取区县列表，type为1时表示查询条件的列表，type为2时表示form内的列表，type为3时表示点击查看和修改时第一次从数据库加载数据 **/
    getDistrictList(city) {
      let params = {}
      params.pcode = city
      if (city === null || city === '') {
        console.log('未获取到city')
        return
      }
      listDistrict(params).then(response => {
        this.queryDistrictList = response.rows;
      })
    },
  }
}
</script>

