<template>
  <div class="app-container">
    <div class="datav-config-box">
      <div class="datav-contig-header">
        <el-button
          v-show="readOnly"
          size="mini"
          type="primary"
          icon="el-icon-edit"
          @click="handleUpdate()"
          v-hasPermi="['envMonitorStandard:standard:edit']"
        >修改</el-button>
        <el-button
          size="mini"
          type="success"
          icon="el-icon-upload"
          @click="handleSave()"
          v-show="!readOnly"
          v-hasPermi="['envMonitorStandard:standard:remove']"
        >保存</el-button>
        <el-button
          size="mini"
          type="info"
          icon="el-icon-refresh"
          v-show="!readOnly"
          @click="resetQuery()"
          v-hasPermi="['envMonitorStandard:standard:remove']"
        >取消</el-button>
      </div>
      <div class="datav-coifg-content sub-body">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" >
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
           <el-row>
              <el-col :span="8">
                <el-form-item label="PH值(最小)" prop="phMin">
                    <el-input-number v-model="form.phMin"  v-if="!readOnly"/>
                    <span v-if="readOnly">{{form.phMin}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="PH值(最大)" prop="phMax">
                     <el-input-number v-model="form.phMax" v-if="!readOnly"/>
              <span v-if="readOnly">{{form.phMax}}</span>
            </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="电导率(最小)" prop="conductivityMin">
                     <el-input-number v-model="form.conductivityMin" v-if="!readOnly"/>
              <span v-if="readOnly">{{form.conductivityMin}}</span>
            </el-form-item>
              </el-col>
            </el-row>
         <el-row>
              <el-col :span="8">
                <el-form-item label="电导率(最大)" prop="conductivityMax">
                    <el-input-number v-model="form.conductivityMax"  v-if="!readOnly"/>
                    <span v-if="readOnly">{{form.conductivityMax}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="溶解氧(最小)" prop="dissolveOxyMin">
                     <el-input-number v-model="form.dissolveOxyMin" v-if="!readOnly"/>
              <span v-if="readOnly">{{form.dissolveOxyMin}}</span>
            </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="溶解氧(最大)" prop="dissolveOxyMax">
                     <el-input-number v-model="form.dissolveOxyMax" v-if="!readOnly"/>
              <span v-if="readOnly">{{form.dissolveOxyMax}}</span>
            </el-form-item>
              </el-col>
            </el-row>
         <el-row>
              <el-col :span="8">
                <el-form-item label="浊度(最小)" prop="turbidityMin">
                    <el-input-number v-model="form.turbidityMin"  v-if="!readOnly"/>
                    <span v-if="readOnly">{{form.turbidityMin}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="浊度(最大)" prop="turbidityMax">
                     <el-input-number v-model="form.turbidityMax" v-if="!readOnly"/>
              <span v-if="readOnly">{{form.turbidityMax}}</span>
            </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="温度(最小)" prop="temperatureMin">
                     <el-input-number v-model="form.temperatureMin" v-if="!readOnly"/>
              <span v-if="readOnly">{{form.temperatureMin}}</span>
            </el-form-item>
              </el-col>
            </el-row>
         <el-row>
              <el-col :span="8">
                <el-form-item label="温度(最大)" prop="temperatureMax">
                    <el-input-number v-model="form.temperatureMax"  v-if="!readOnly"/>
                    <span v-if="readOnly">{{form.temperatureMax}}</span>
                </el-form-item>
              </el-col>
            </el-row>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script>
import {
  addStandard,
  delStandard,
  exportStandard,
  getStandard,
  listStandard,
  updateStandard
} from "@/api/project/envDev/standard";

export default {
  name: "Standard",
  components: {
  },
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 水质标准表格数据
      standardList: [],
      // 弹出层标题
      title: "",
      waterspi:[],
      // 是否显示弹出层
      open: false,
      readOnly:true,
      // 查询参数
      form:{},
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        temperature: null,
        ph: null,
        dissolveOxy: null,
        conductivity: null,
        turbidity: null,
      },

      // 表单校验
      rules: {
        phMin: [
          { required: true, message: "最小PH值不能为空", trigger: "blur" }
        ],
        phMax: [
          { required: true, message: "最大PH值不能为空", trigger: "blur" }
        ],
        conductivityMin: [
          { required: true, message: "电导率最小值不能为空", trigger: "blur" }
        ],
        conductivityMax: [
          { required: true, message: "电导率最大值不能为空", trigger: "blur" }
        ],
        dissolveOxyMin: [
          { required: true, message: "溶解氧最小值不能为空", trigger: "blur" }
        ],
        dissolveOxyMax: [
          { required: true, message: "溶解氧最大值不能为空", trigger: "blur" }
        ],
        turbidityMin: [
          { required: true, message: "浊度最小值不能为空", trigger: "blur" }
        ],
        turbidityMax: [
          { required: true, message: "浊度最大值不能为空", trigger: "blur" }
        ],
        temperatureMin: [
          { required: true, message: "温度最小值不能为空", trigger: "blur" }
        ],
        temperatureMax: [
          { required: true, message: "温度最大值不能为空", trigger: "blur" }
        ],
      },
      tableHeight: 400,
      tableOffset: 140
    };
  },
  created() {
    this.getone();
  },
  methods: {
    /** 查询水质标准列表 */
    getone() {
      this.reset()
      getStandard().then(response => {
        if(response.data!=null) {
          try {
            this.form = response.data;
          }catch (e){

          }
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        temperature: null,
        ph: null,
        dissolveOxy: null,
        conductivity: null,
        turbidity: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },

    /** 修改按钮操作 */
    handleUpdate() {
      this.readOnly=false
      this.reset();
      this.getone()
    },
    // 保存
    handleSave(){
      this.$refs["form"].validate(valid => {
        updateStandard(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.readOnly=true
              this.getone();
            });

      })
    },
    resetQuery() {
      this.readOnly = true;
      this.getone();
    },
    /** 提交按钮 */
  //   submitForm() {
  //     this.$refs["form"].validate(valid => {
  //       if (valid) {
  //         if (this.form.id != null) {
  //           updateStandard(this.form).then(response => {
  //             this.msgSuccess("修改成功");
  //             this.open = false;
  //             this.getList();
  //           });
  //         } else {
  //           addStandard(this.form).then(response => {
  //             this.msgSuccess("新增成功");
  //             this.open = false;
  //             this.getList();
  //           });
  //         }
  //       }
  //     });
  //   },
  },
  watch: {
    showSearch(val) {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.form.$el.offsetTop - this.tableOffset;
      });
    },
    '$store.state.app.screenHeight':function(){ //监听屏幕高度变化
      this.tableHeight = window.innerHeight - this.$refs.form.$el.offsetTop - this.tableOffset;
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.$refs.form.$el.offsetTop - this.tableOffset;
    });
  }
};
</script>
<style scoped>
.app-container {
  background-color: #fff;
  height: 100%;
  overflow: auto;
}
.datav-config-box {
  width: 80%;
  margin: 0 auto;}
  .datav-contig-header {
    margin-bottom: 10px;
    text-align: right;
  }
  .el-input-number {
  width: 150px;

  }

</style>
