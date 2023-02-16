<template>
  <div class="app-container">
    <el-form ref="formThreshold" :model="formThreshold" :rules="rulesThreshold" label-width="150px">
      <div class="sub-title">
        <div class="sub-title-name">阈值</div>
      </div>
      <div class="sub-body">
        <el-row>
          <el-col :span="12">
            <el-form-item label="粉尘浓度" prop="concentration">
              <el-input-number v-model="formThreshold.concentration" style="width: 250px"  :min="1" placeholder="粉尘浓度" />
              mg/m³
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="游离二氧化硅含量" prop="sio2">
              <el-input-number v-model="formThreshold.sio2" style="width: 250px" :min="1" placeholder="游离二氧化硅含量" />
              %
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="粉尘分散度" prop="dispersion">
              <el-input-number v-model="formThreshold.dispersion" style="width: 250px" :min="1" placeholder="粉尘分散度" />
              %
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="sub-title">
        <div class="sub-title-name">告警规则</div>
      </div>
      <div class="sub-body">
        <el-row>
          <!--<el-col :span="12">
            <el-form-item label="提醒方式">
              <el-select v-model="formThreshold.remindway" @change="updateOprId">
                <el-option label="短信+待办" value="1"></el-option>
                <el-option label="待办" value="2"></el-option>
                <el-option label="短信" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="告警频率（分钟）">
              <el-input v-model="formThreshold.frequency" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div style="text-align: center;margin-top:20px">
        <el-button type="primary" @click="submitThresholdForm">保 存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {selectOneByType,updateThreshold,addThreshold} from "@/api/contentCoupletPerception/threshold";

export default {
  name: "AirThreshhold",
  components: {},
  props: {},
  created() {
    this.getDicts('content_dev_level').then(response => {
      this.contentDevLevelOptions = response.data
    });

    selectOneByType(2).then(response=>{
      if (response.data) {
        this.formThreshold = JSON.parse(response.data.content);
        this.formThreshold.id = response.data.id;
        this.formThreshold.alarmRuleName = response.data.alarmRuleName;
        this.formThreshold.alarmLevel = response.data.alarmLevel;
      } else {
      }
    })
  },
  data() {
    return {
      formThreshold: {
        id:null,
        concentration:null,
        sio2:null,
        dispersion:null,
        devType:null
      },
      rulesThreshold:{
        alarmRuleName: [
          { required: true, message: "告警规则名称不能为空", trigger: "blur" }
        ],
        alarmLevel: [
          { required: true, message: "告警级别不能为空", trigger: "blur" }
        ],
        concentration: [
          { required: true, message: "粉尘浓度阈值不能为空", trigger: "blur" }
        ],
        sio2: [
          { required: true, message: "游离二氧化硅含量阈值不能为空", trigger: "blur" }
        ],
        dispersion: [
          { required: true, message: "粉尘分散度阈值不能为空", trigger: "blur" }
        ],
      },
      contentDevLevelOptions:[],
    }
  },
  methods: {
    //保存阈值设置
    submitThresholdForm(){
      this.$refs["formThreshold"].validate(valid => {
        if (valid) {
          this.formThreshold.devType=2
          let content = {"alarmRuleName":this.formThreshold.alarmRuleName,"alarmLevel":"","type":"DEVICEALARM",//type固定 设备报警
            "concentration":this.formThreshold.concentration,
            "sio2":this.formThreshold.sio2,"dispersion":this.formThreshold.dispersion,"frequency":this.formThreshold.frequency};
          this.formThreshold.content = JSON.stringify(content);
          if (this.formThreshold.id != null) {
            updateThreshold(this.formThreshold).then(response => {
              this.msgSuccess("编辑成功");
              this.openThreshold = false;
            });
          } else {
            addThreshold(this.formThreshold).then(response => {
              this.msgSuccess("编辑成功");
              this.openThreshold = false;
            });
          }
        }
      });
    },
  }
}
</script>
