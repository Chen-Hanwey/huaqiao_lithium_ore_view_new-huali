<template>
  <div class="app-container">
    <el-table ref="table" :height="tableHeight" v-loading="loading" :data="objList">
      <el-table-column width="50px;" label="选择">
        <template slot-scope="scope">
          <el-radio :label="scope.$index" v-model="radio" @change.native="getCurrentRow(scope.row)">{{''}}</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" prop="deviceName" align="center" />
      <el-table-column label="状态" prop="deviceName" align="center">
        <template slot-scope="scope">
          <span>{{environmentStatus[scope.row.status]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { environmentList } from "@/api/contentCoupletPerception/soil";
export default {
  name: "environmentSelectEquipment",
  components: {
  },
  props: {
    // 设备类型，1-噪声，2-粉尘
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      radio: undefined,
      loading: true,
      tableHeight: 460,
      objList: [],
      environmentStatus:{
        'INACTIVE': '未激活',
        'OFFLINE': '离线',
        'ONLINE': '在线'
      }
    }
  },
  mounted() {
    this.environmentList()
  },
  methods: {
    environmentList() {
      environmentList({devType:this.type}).then(res=>{
        if(res.code==200){
          if(res.data==500){
            this.$alert(res.msg, '提示');
            this.loading = false;
          }else{
            this.objList = res.data
            this.loading = false;
          }
        }
      })
    },
    getCurrentRow(row) {
      this.$emit('update:info', row)
    },
  }
}
</script>
