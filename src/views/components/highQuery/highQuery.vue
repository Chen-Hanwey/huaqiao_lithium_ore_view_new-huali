<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      style="margin-bottom: 5px"
    >
    <div class="condition-item" v-if="showDistrict">
      <label class="condition-item-title">所属区县</label>
      <el-form-item label="" prop="districtCode">
        <el-select v-model="districtCode" placeholder="--全部--" filterable  clearable size="small" class="query-param" @change="districtChange">
          <el-option
            v-for="dict in queryDistrictList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
    </div>
    <div class="condition-item" v-if="showEnterprise">
      <label class="condition-item-title">{{ enterpriseTitle }}</label>
      <el-form-item label="" prop="enterpriseName">
        <el-input
          v-model="enterpriseName"
          :placeholder="enterprisePlaceholder"
          clearable
          size="small" style="width:240px;"
          @click.native="openEnterprise"  readonly >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
    </div>
    <div class="condition-item" v-if="showOperation">
      <label class="condition-item-title">经营场所名称</label>
      <el-form-item label="" prop="operationName">
        <el-input
          v-model="operationName"
          placeholder="请选择经营场所"
          clearable
          size="small" style="width:240px;"
          @click.native="openOperation" readonly >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-form-item>
    </div>
    </el-form>
    <EnterpriseDialog :show-district="showDistrict"  ref="enterpriseDialog" @callBack="enterpriseCallBack(arguments)"  :close-on-click-modal="false" append-to-body></EnterpriseDialog>
    <OperationDialog :show-enterprise="showEnterprise" ref="operationDialog" @callBack="operationCallBack(arguments)"  :close-on-click-modal="false" append-to-body></OperationDialog>
  </div>
</template>
<script>
import EnterpriseDialog from "@/views/components/highQuery/enterpriseDialog";
import OperationDialog from "@/views/components/highQuery/operationDialog";
import {listDistrict} from "@/api/system/district";
export default {
  name: 'highQuery',
  components: { EnterpriseDialog, OperationDialog},
  props:{
    showDistrict: {
      type: Boolean,
      default: true
    },
    showEnterprise: {
      type: Boolean,
      default: true
    },
    showOperation: {
      type: Boolean,
      default: true
    },
    enterpriseTitle: {
      type: String,
      default: "企业名称"
    },
    enterprisePlaceholder: {
      type: String,
      default: "请选择企业"
    },
  },
  data() {
    return {
      enterpriseId: undefined,
      districtCode: undefined,
      enterpriseName: undefined,
      operationId: undefined,
      operationName: undefined,
      queryDistrictList:[],
      queryParams:{},
      // showEnterprise:true
    }
  },
  created() {
    this.getDistrictList(process.env.VUE_APP_CITY_DEFAULT)
    this.init();
  },
  beforeMount() {
  },
  mounted() {
    this.$bus.$on('defaultSelect',body=> {
      this.operationName = body.operationName
      this.enterpriseName = body.enterpriseName
      this.operationId = body.operationId
    })
  },
  computed: {
  },
  watch: {
    showOperation: {
      handler: function (newValue, oldValue) {
        console.log(newValue)
        if (newValue) {
          this.showOperation = newValue
          
        }
      },
      immediate: true
    },
  },
  methods: {
    init(){
      let userType=this.$store.getters.userType;
      if(userType=='02'){
        this.showEnterprise=false;
        this.showDistrict=false;
        this.showEnterprise=false;
      }
      if(userType=='03'){
        this.showEnterprise=false;
        this.showDistrict=false;
        this.showOperation=false;

      }

    },
    reset(){
      this.districtCode=undefined;
      this.enterpriseId = undefined;
      this.enterpriseName = undefined;
      this.operationId = undefined;
      this.operationName = undefined;
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
    districtChange() {
      this.enterpriseId = undefined;
      this.enterpriseName = undefined;
      this.operationId = undefined;
      this.operationName = undefined;
    },
    openEnterprise() {
      this.$refs.enterpriseDialog.show(this.districtCode)
    },
    enterpriseCallBack(msg) {
      let data = msg[0];

      if (data.length > 0) {
        this.enterpriseId = data[0].id;
        this.enterpriseName = data[0].name;
      } else {
        this.enterpriseId = undefined;
        this.enterpriseName = undefined;
      }
      this.operationId = undefined;
      this.operationName = undefined;
    },
    openOperation() {
      this.$refs.operationDialog.show(this.enterpriseId, this.enterpriseName)
    },
    operationCallBack(msg) {
      let data = msg[0];
      if (data.length > 0) {
        this.operationId = data[0].id;
        this.operationName = data[0].name;
      } else {
        this.operationId = undefined;
        this.operationName = undefined;
      }
    },
  }
}
</script>

