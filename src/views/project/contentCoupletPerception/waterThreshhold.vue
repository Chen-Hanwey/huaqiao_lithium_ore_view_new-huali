<template>
  <div class="app-container">
    <el-form ref="formThreshold" :model="formThreshold" :rules="rulesThreshold" label-width="150px">
<!--      <div class="sub-body">
        <el-row>
          <el-col :span="12">
            <el-form-item label="告警规则名称" prop="alarmRuleName">
              <el-input v-model="formThreshold.alarmRuleName" placeholder="请输入告警规则名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警级别" prop="alarmLevel">
              <el-select v-model="formThreshold.alarmLevel" placeholder="请选择告警级别" clearable>
                <el-option v-for="dict in contentDevLevelOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>-->
      <div class="sub-title">
        <div class="sub-title-name">阈值</div>
      </div>
      <div class="sub-body">
        <el-row>
          <el-col :span="12">
            <el-form-item label="氨氮" prop="airHumidity">
              <el-input-number v-model="formThreshold.airHumidity" :min="0" placeholder="请输入氨氮" />
              mg/L
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="溶解氧" prop="airTemp">
              <el-input-number v-model="formThreshold.airTemp" :min="0" placeholder="请输入溶解氧" />
              mg/L
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="pH值" prop="co2">
              <el-input-number v-model="formThreshold.co2" :min="0" placeholder="请输入pH值" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水温" prop="lightLuxValue">
              <el-input-number v-model="formThreshold.lightLuxValue" :min="0" placeholder="请输入水温" />
              °C
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="降雨量" prop="soilEc">
              <el-input-number v-model="formThreshold.soilEc" :min="0" placeholder="请输入降雨量" />
              mm/min
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="水位" prop="soilHumidity">
              <el-input-number v-model="formThreshold.soilHumidity" :min="0" placeholder="请输入水温" />
              cm
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电源电压" prop="voltage">
              <el-input-number v-model="formThreshold.voltage" :min="0" placeholder="请输入电源电压" />
              V
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="sub-title">
        <div class="sub-title-name">告警规则</div>
      </div>
      <div class="sub-body">
        <el-row>
          <el-col :span="12">
            <el-form-item label="提醒方式">
              <el-select v-model="formThreshold.remindway" @change="updateOprId">
                <el-option label="短信+待办" value="1"></el-option>
                <el-option label="待办" value="2"></el-option>
                <el-option label="短信" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警频率（分钟）">
              <el-input v-model="formThreshold.frequency" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div style="text-align: center;">
        <el-button type="primary" @click="submitThresholdForm">保 存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { addThreshold, selectOneByType, updateThreshold } from "@/api/contentCoupletPerception/threshold";

export default {
  name: "WaterThreshhold",
  components: {
  },
  props: {
  },
  created() {
    this.getDicts('content_dev_level').then(response => {
      this.contentDevLevelOptions = response.data
    });

    selectOneByType(4).then(response=>{
      if (response.data) {
        this.formThreshold = JSON.parse(response.data.content);
        this.formThreshold.id = response.data.id;
        this.formThreshold.alarmRuleName = response.data.alarmRuleName;
        this.formThreshold.alarmLevel = response.data.alarmLevel;
        //this.formThreshold.remindway = response.data.remindway
        //this.formThreshold.frequency = response.data.frequency
      } else {
      }
    })
  },
  data() {
    return {
      formThreshold: {
        alarmRuleName: null,
        alarmLevel: null,
        airHumidity: null,
        airTemp: null,
        co2: null,
        lightLuxValue: null,
        soilEc: null,
        soilHumidity: null,
        soilPh: null,
        soilTemperature: null,
        voltage: null,
      },
      rulesThreshold: {
        alarmRuleName: [
          { required: true, message: "告警规则名称不能为空", trigger: "blur" }
        ],
        alarmLevel: [
          { required: true, message: "告警级别不能为空", trigger: "blur" }
        ],
        airHumidity: [
          { required: true, message: "大棚空气湿度不能为空", trigger: "blur" }
        ],
        airTemp: [
          { required: true, message: "大棚空气温度不能为空", trigger: "blur" }
        ],
        co2: [
          { required: true, message: "二氧化碳浓度不能为空", trigger: "blur" }
        ],
        lightLuxValue: [
          { required: true, message: "光照度不能为空", trigger: "blur" }
        ],
        soilEc: [
          { required: true, message: "大棚土壤EC值不能为空", trigger: "blur" }
        ],
        soilHumidity: [
          { required: true, message: "土壤湿度不能为空", trigger: "blur" }
        ],
        soilPh: [
          { required: true, message: "土壤PH值不能为空", trigger: "blur" }
        ],
        soilTemperature: [
          { required: true, message: "土壤温度不能为空", trigger: "blur" }
        ],
        voltage: [
          { required: true, message: "电源电压不能为空", trigger: "blur" }
        ],
      },
      contentDevLevelOptions: [],
    }
  },
  mounted() {
  },
  methods: {
    updateOprId() {
      this.$forceUpdate()
    },
    //保存阈值设置
    submitThresholdForm () {
      this.$refs["formThreshold"].validate(valid => {
        if (valid) {
          this.formThreshold.devType = 1
          let content = {
            "alarmRuleName": this.formThreshold.alarmRuleName, "alarmLevel": "", "type": "DEVICEALARM",//type固定 设备报警
            "airHumidity": this.formThreshold.airHumidity, "airTemp": this.formThreshold.airTemp,
            "co2": this.formThreshold.co2, "lightLuxValue": this.formThreshold.lightLuxValue, "soilEc": this.formThreshold.soilEc,
            "soilHumidity": this.formThreshold.soilHumidity, "soilPh": this.formThreshold.soilPh, "soilTemperature": this.formThreshold.soilTemperature,
            "voltage": this.formThreshold.voltage,"remindway":this.formThreshold.remindway,"frequency":this.formThreshold.frequency
          };
          this.formThreshold.content = JSON.stringify(content);
          if (this.formThreshold.id != null) {
            updateThreshold(this.formThreshold).then(response => {
              this.msgSuccess("保存成功");
              this.openThreshold = false;
            });
          } else {
            addThreshold(this.formThreshold).then(response => {
              this.msgSuccess("保存成功");
              this.openThreshold = false;
            });
          }
        }
      });
    },
  }
}
</script>
