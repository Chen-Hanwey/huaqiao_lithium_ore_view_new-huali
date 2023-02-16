<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" class="_baseForm_small">
      <div slot="title">
        <span><i :class="dialogIcon"></i></span>
        <span> {{ title }}</span>
      </div>
      <div class="alarm-body"></div>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">基本信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item label="告警类型：" prop="typeName" v-if="readOnly" class="custom-form-item">
                  {{form.typeName}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="摄像头编号：" prop="cameraSn" v-if="readOnly" class="custom-form-item">
                  {{form.cameraSn}}
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="form.typeName !=='超速告警'">
                <el-form-item label="设备编号：" prop="deviceSn" v-if="readOnly" class="custom-form-item">
                  {{form.deviceSn}}
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="form.typeName ==='超速告警'">
                <el-form-item label="车牌号：" prop="deviceSn" v-if="readOnly" class="custom-form-item">
                  {{form.deviceSn}}
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="form.typeName ==='超速告警'">
                <el-form-item label="超速速度：" prop="deviceSn" v-if="readOnly" class="custom-form-item">
                  {{formatSpeed(form.speed)}}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="告警时间：" prop="curTime" v-if="readOnly" class="custom-form-item">
                  {{form.curTime}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态：" prop="status" v-if="readOnly" class="custom-form-item">

                  <span>{{ fomart(this.form.status) }}</span>

                </el-form-item>
              </el-col>
              <!-- <el-col :span="24" v-if="form.typeName !=='超速告警'">
                <el-form-item label="告警图片：" prop="image">
                  <div v-for="(src,index) in splitImg(form.image)" :key="index" style="display: inline-block;margin-right: 10px">
                    <el-image v-if="form.alarmSource=='camera'" style="width: 87px; height: 50px" :src="VUE_APP_PICTURE_PATH+src" :preview-src-list="[VUE_APP_PICTURE_PATH+src]" fit="fill"></el-image>

                    <el-image v-if="form.alarmSource=='car'" style="width: 87px; height: 50px" :src="src" :preview-src-list="[src]" fit="fill"></el-image>
                  </div>

                </el-form-item>
              </el-col>

              <el-col :span="24" v-if="form.typeName ==='超速告警'">
                <el-form-item label="告警图片：" prop="image">
                  <div style="display: inline-block;margin-right: 10px">
                    <el-image style="width: 87px; height: 50px" :src="form.picUrl" :preview-src-list="[form.picUrl]" fit="fill"></el-image>
                  </div>

                </el-form-item>
              </el-col> -->
              <div v-if="form.typeName !=='未盖篷布' && form.typeName !=='未带安全帽'">
                <el-col :span="24" v-if="form.typeName !=='超速告警'">
                  <el-form-item label="告警图片：" prop="image">
                    <div v-for="(src,index) in splitImg(form.image)" :key="index" style="display: inline-block;margin-right: 10px">
                      <el-image v-if="form.alarmSource=='camera'" style="width: 87px; height: 50px" :src="VUE_APP_PICTURE_PATH+src" :preview-src-list="[VUE_APP_PICTURE_PATH+src]" fit="fill"></el-image>

                      <el-image v-if="form.alarmSource=='car'" style="width: 87px; height: 50px" :src="src" :preview-src-list="[src]" fit="fill"></el-image>
                    </div>

                  </el-form-item>
                </el-col>

                <el-col :span="24" v-if="form.typeName ==='超速告警'">
                  <el-form-item label="告警图片：" prop="image">
                    <div style="display: inline-block;margin-right: 10px">
                      <el-image style="width: 87px; height: 50px" :src="form.picUrl" :preview-src-list="[form.picUrl]" fit="fill"></el-image>
                    </div>
                  </el-form-item>
                </el-col>
              </div>
              <el-col :span="24" v-if="form.typeName ==='未盖篷布' ||form.typeName ==='未带安全帽'">
                <el-form-item label="告警图片：" prop="image">
                  <div style="display: inline-block;margin-right: 10px">
                    <el-image style="width: 87px; height: 50px" :src="form.picUrl" :preview-src-list="[form.picUrl]" fit="fill"></el-image>
                  </div>
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </div>
        <div v-show="show">
          <div class="sub-project">
            <div class="sub-title">
              <div class="sub-title-name">车辆信息</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="车牌号：" prop="licenseNo" v-if="readOnly" class="custom-form-item">
                    {{ formCar.licenseNo }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="所属部门：" prop="deptId" v-if="readOnly" class="custom-form-item">
                    {{ formCar.deptName }}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用途：" prop="carUse" v-if="readOnly" class="custom-form-item">
                    {{ formCar.carUse }}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="购置日期：" prop="buyDate" v-if="readOnly" class="custom-form-item">
                    {{ formCar.buyDate }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="司机名称：" prop="personName" v-if="readOnly" class="custom-form-item">
                    {{ formCar.personName }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">

                  <el-form-item label="司机手机号" prop="personNumber" v-if="readOnly" class="custom-form-item">
                    {{ formCar.personNumber }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">

                  <el-form-item label="是否安装定位" prop="sex" v-if="readOnly" class="custom-form-item">
                    {{form.positioning}}
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="备注" prop="remark" v-if="readOnly">
                    {{ formCar.remark }}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <!-- <div class="sub-project" v-if="readOnly">
            <div class="sub-title">
              <div class="sub-title-name">运行信息：</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="行驶状态:" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formCar.status }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="车速:" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formart(formCar.speed)}}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="车辆位置:" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formCar.address }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="经度" prop="lng" v-if="!readOnly">
                    <el-input v-model="form.lng" placeholder="请输入经度" />
                  </el-form-item>
                  <el-form-item label="经度：" prop="lng" v-if="readOnly" class="custom-form-item">
                    {{ formCar.lng }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="纬度" prop="lat" v-if="!readOnly">
                    <el-input v-model="form.lat" placeholder="请输入纬度" />
                  </el-form-item>
                  <el-form-item label="纬度：" prop="lat" v-if="readOnly" class="custom-form-item">
                    {{ formCar.lat }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="位置信息：" class="custom-form-item" v-if="readOnly">
                    <div class="amap-page-container1" style="padding-top: 10px;margin-bottom: 10px;" v-if="show">
                      <a-map ref="location-unedit" v-if="open" :lng="formCar.lng" :lat="formCar.lat" :marker-edit="false" />
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div> -->
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="operationType != 3">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
        <div v-if="operationType == 3">
          <el-button type="primary" @click="cancel">关 闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAlarm } from "@/api/project/alarm/alarm";
export default {
  data () {
    return {
      dialogVisible: false,
      form: {},
      title: "详情",
      dialogIcon: 'el-icon-view',
      readOnly: true,
      operationType: 3,
      show: false,
      formCar: {},
    }
  },
  props: ['id'],
  watch: {
    id (newval, oldval) {
      window.console.log(newval)
      if (newval !== '') {
        this.handleView(newval)
      }
    }
  },
  methods: {
    splitImg (strStr) {
      if (!strStr) return []
      return strStr.split(',')
    },
    fomart (val) {
      const map = {
        0: "待处理",
        1: "已确认",
        2: "误报"
      }
      return map[val]
    },
    formatSpeed (val) {
      if (val == undefined) {
        return '0km/h'
      } else {
        return val + 'km/h'
      }
    },
    cancel () {
      this.dialogVisible = false;

    },
    /** 查看按钮操作 */
    handleView (id) {
      getAlarm(id).then(response => {
        this.form = response.data;
        this.dialogVisible = true;
        this.title = "详情";
        this.dialogIcon = 'el-icon-view';
        this.readOnly = true;
        this.operationType = 3;
      });
      // this.show = false
      // if (row.alarmSource == "car") {
      //   this.handleViewByNo(row);
      // }
    },
  }


}
</script>

<style>
</style>