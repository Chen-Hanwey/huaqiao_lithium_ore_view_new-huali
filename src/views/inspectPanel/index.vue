<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="12">
      <el-col :span="5">
        <div class="card_shadow" style="font-weight:bold;background-color: #1483d8;align-content: center;text-align: center">
          <div style="color: white;letter-spacing: 3px;font-size:17px;padding: 30px 0px 0px 0px;text-align: center;font-family: Heiti">餐饮量化食品安全等级公示</div>
          <div style="color: white;text-align: center;padding-top: 10px;font-size: 13px;font-family: Heiti">( Food Safety Grades Notification )
          </div>
          <img style="padding: 12px 0px 0px 0px;" :src="rankImg(form.checkPoint)" alt="">
          <div style="font-family:'NSimSun';color: white;font-size: 14px;letter-spacing: 2px;padding-top: 5px;">本次检查量化等级</div>
          <!--          display: inline-->
          <div style="width: calc(100% - 20px);height:38px;line-height:38px;margin:20px 10px;">
            <div style="float:left;width:33%;">
              <img style="width: 38px;float:left;" :src="require('../check/template/image/cylh_1.png')" alt="">
              <div style="color: #2ecc71;font-size:17px;float:left;">优秀</div>
            </div>
            <div style="float:left;width:33%;">
              <img style="width: 38px;float:left;" :src="require('../check/template/image/cylh_2.png')" alt="">
              <div style="color: yellow;font-size:17px;float:left;">良好</div>
            </div>
            <div style="float:left;width:33%;">
              <img style="width: 38px;float:left;" :src="require('../check/template/image/cylh_3.png')" alt="">
              <div style="color: red;font-size:17px;float:left;"> 合格</div>
            </div>
            <div style="clear:both"></div>
          </div>
          <div style="border: solid #f4ffff 2px; width: 220px;height: 75px; margin: 20px auto 0 auto;font-weight:normal;">
            <div style="margin-top: 14px;color: white">投诉举报电话</div>
            <div style="margin-top: 9px;color: white">12345</div>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="card_shadow" style="height: 50px;white-space:nowrap;">
          <high-query :showDistrict="false" ref="highQuery" :show-operation="true"
                      :enterpriseTitle="queryEnterpriseTitle"
                      style="padding-top: 10px"
                      :enterprisePlaceholder="queryEnterprisePlaceholder"></high-query>
          <div class="btn-container" style="margin-top: -5px">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="card_shadow" style="height: 308px">
          <el-form label-width="120px" style="padding: 20px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="企业名称: ">
                  {{ form.enterpriseName }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="企业负责人: ">
                  {{ form.principal }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="营业状态: ">
                  {{ businessStatusFormat(form) }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="成立日期: ">
                  {{ form.establishment_date }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="企业类型: ">
                  {{ businessRegistrationTypeFormat(form) }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="注册资本(万): ">
                  {{ form.registered_capital }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="营业执照: ">
                  <!--                  businessLicensePicture -->
                  <el-link :underline="false" @click.prevent="getCurrentPreviewImg(form.business_license_picture,'营业执照图片')"
                           type="primary">点击查看
                  </el-link>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="信用代码: " class="text-oneLine">
                  {{ form.credit_code }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="组织机构代码: ">
                  {{ form.organization_code }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="经营场所名称:">
                  <!--                    <span slot="label"><span  style="color: black"><strong>运营场所名称:</strong></span></span>-->
                  <span :title="form.name" class="text-oneLine">{{ form.name }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="行业类别: ">
                  <!-- {{ enterpriseTypeFormat(form) }} -->
                  {{form.bigType}}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地址: ">
                  <span :title="form.address" class="text-oneLine"> {{ form.address }} </span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="负责人: ">
                  {{ form.concat }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="负责人联系方式: ">
                  {{ form.concatPhone }}
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="场所照片: ">
                  <!--                  {{form.placePicture }}-->
                  <el-link :underline="false" @click.prevent="getCurrentPreviewImg(form.placePicture,'经营场所图片')" type="primary">
                    点击查看
                  </el-link>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <!--    <el-dialog :visible.sync="uploadPic.picDialogVisible" :close-on-click-modal="false" append-to-body>-->
    <!--      <div slot="title">-->
    <!--        <span><i class="el-icon-picture"></i></span>-->
    <!--        <span>资质图片</span>-->
    <!--      </div>-->
    <!--      <img width="100%" height="100%" :src="uploadPic.picDialogImageUrl" alt="">-->
    <!--    </el-dialog>-->

    <el-dialog
      :title="'图片'"
      :visible.sync="uploadPic.picDialogVisible"
      width="50%">
      <div slot="title">
        <i class="el-icon-picture"></i> {{ imgTitle }}
      </div>
      <div style="text-align: center">
        <el-image :src="uploadPic.picDialogImageUrl">
          <div slot="error" class="image-slot" style="text-align: center">
            <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
              暂无图片</i>
          </div>
        </el-image>
      </div>
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="uploadPic.picDialogVisible = false">关 闭</el-button>-->
<!--      </span>-->
    </el-dialog>

    <el-row :gutter="12">
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <!--            <i class="icon fa fa-photo" /> <span>从业人员</span>-->
            <i class="icon fa fa-photo"/><span>企业资质</span>
            <router-link :to="'/EnterpriseManage/certification?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>

          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <!--              <notice></notice>-->

              <certification :operation-id="operationId"></certification>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon fa fa-user"/> <span>从业人员</span>
            <router-link :to="'/EnterpriseManage/kitchenPerson?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <!--              <notice></notice>-->
              <kitchen-person :operation-id="operationId" ref="kit"></kitchen-person>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon fa fa-delicious"/><span>陪餐管理</span>
            <router-link :to="'/ProcessSup/everyDay/accompanyManage?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <!--              <notice></notice>-->
              <accompany :operation-id="operationId" ref="acc"></accompany>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon el-icon-grape"/> <span>餐品留样</span>
            <router-link :to="'/ProcessSup/everyDay/foodSample?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <food-sample :operation-id="operationId"></food-sample>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>

    <el-row :gutter="12">
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <!--            <i class="icon fa fa-photo" /> <span>从业人员</span>-->
            <i class="icon fa fa-grav"/><span>消杀记录</span>
            <router-link :to="'/ProcessSup/everyDay/killProcessSupervise?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>

          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <!--              <notice></notice>-->
              <kill-process :operation-id="operationId"/>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon fa fa-tasks"/> <span>晨检记录</span>
            <router-link :to="'/ProcessSup/everyDay/morningCheck?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <morning :operation-id="operationId"></morning>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon fa fa-podcast"/> <span>消防安检</span>
            <router-link :to="'/ProcessSup/everyDay/kitchenFireSafety?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <kitchen-fire-safe :operation-id="operationId"/>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <!--            <i class="icon fa fa-photo" /> <span>从业人员</span>-->
            <i class="icon fa fa-opencart"/><span>食安自查</span>
            <router-link :to="'/ProcessSup/institutional/sazc?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <!--              <notice></notice>-->
              <sazc :operation-id="operationId"/>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <!--            <i class="icon fa fa-photo" /> <span>从业人员</span>-->
            <i class="icon fa fa-xing-square"/><span>卫生防疫</span>
            <router-link :to="'/ProcessSup/everyDay/epidemicPrevention?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>

          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <epidmic :operation-id="operationId"></epidmic>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon fa fa-align-right"/> <span>演练记录</span>
            <router-link :to="'/ProcessSup/everyDay/exerciseRecord?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <exercise-record :operation-id="operationId"></exercise-record>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <!--            <i class="icon fa fa-photo" /> <span>从业人员</span>-->
            <i class="icon fa fa-cutlery"/><span>食材检测</span>
            <router-link :to="'/ProcessSup/everyDay/foodInspection?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>

          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <food-inspection :operation-id="operationId"></food-inspection>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon el-icon-guide"/> <span>食安监督</span>
            <router-link :to="'/RegulatoryAssessment/jdjc?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <jdjc :operation-id="operationId"></jdjc>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <!--            <i class="icon fa fa-photo" /> <span>从业人员</span>-->
            <i class="icon fa fa-codepen"/><span>餐饮量化</span>
            <router-link :to="'/RegulatoryAssessment/cylh?operationId=' + operationId" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>

          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <cylh :operation-id="operationId"></cylh>
            </div>
          </div>

        </div>
      </el-col>
      <el-col :span="12">
        <div class="card_shadow" style="height: 400px">
          <div class="card_title_index">
            <i class="icon fa fa-photo"/> <span>我的培训</span>
            <router-link to="/ProcessSup/institutional/exam/myExamList" style="position:absolute;right: 10px;font-weight: 600">
              <el-link :underline="false" href="" type="primary">更多<i class=" el-icon-d-arrow-right"></i></el-link>
            </router-link>
          </div>
          <div class="card_content notice-box">
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <exam></exam>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import EnterpriseDialog from "@/views/components/highQuery/enterpriseDialog";
import Notice from "../system/notice/homepage";
import {getInspectData, getOperationInfo} from "@/api/bigScreen/inspectPanel";
import {getToken} from "@/utils/auth";
import {handlePicturePath} from "@/utils/ruoyi";
import kitchenPerson from "./kitchenPersion";
import accompany from './accompany'
import certification from './certification'
import foodSample from "./foodSample";
import killProcess from './killProcess'
import morning from "./morning";
import sazc from './sazc'
import exerciseRecord from "./exerciseRecord";
import epidmic from './epidmic'
import kitchenFireSafe from './kitchenFireSafe'
import foodInspection from "./foodInspection";
import cylh from './cylh'
import jdjc from './jdjc'
import exam from './myExam'

export default {
  name: "index",
  components: {
    EnterpriseDialog, Notice, kitchenPerson,
    accompany, certification, foodSample, killProcess, morning, sazc,
    exerciseRecord, epidmic, kitchenFireSafe, foodInspection, cylh, jdjc, exam
  },
  data() {
    return {
      operationId: 1,
      form: {},
      uploadPic: {
        accept: '.png,.jpg,.jpeg,.svg',
        uploadImgUrl: process.env.VUE_APP_PICTURE_UPLOAD_PATH,
        uploadHeader: {Authorization: 'Bearer ' + getToken()},
        picDialogVisible: false,
        picDialogImageUrl: undefined,
        // pictureList:[],
        // pictureFileList:[]
      },
      queryEnterpriseTitle: '所属企业',
      queryEnterprisePlaceholder: '请选择企业',
      // 营业状态字典
      businessStatusOptions: [],
      businessRegistrationTypeOptions: [],
      enterpriseTypeOptions: [],
      pageList: [100, 200, 500, 1000],
      // 总条数
      total: 0,
      queryParams: {},
      imgTitle: '营业执照图片'
    }
  },
  methods: {
    handleQuery() {
      if (!this.$refs.highQuery.operationId) {
        this.$message.info('请选择经营场所')
        return
      }
      this.getOperationInfo(this.$refs.highQuery.operationId)
      this.operationId = this.$refs.highQuery.operationId
    },
    getOperationInfo(id) {
      getOperationInfo(id).then(res => {
        if (res.code == 200) {
          this.form = res.data

        }
      })
    },
    getCurrentPreviewImg(url,title) {
      this.imgTitle = title
      this.uploadPic.picDialogImageUrl = handlePicturePath(url)
      this.uploadPic.picDialogVisible = true
    },
    // 营业状态字典翻译
    businessStatusFormat(row, column) {
      return this.selectDictLabel(this.businessStatusOptions, row.business_status);
    },
    // 企业类型字典翻译
    businessRegistrationTypeFormat(row, column) {
      return this.selectDictLabel(this.businessRegistrationTypeOptions, row.enterprise_type);
    },
    // 企业类别字典翻译
    enterpriseTypeFormat(row, column) {
      return this.selectDictLabel(this.enterpriseTypeOptions, row.bigType);
    },
    resetQuery() {
      this.$refs.highQuery.reset()
      this.$bus.$emit('reset')
    }
  },
  computed: {
    rankImg() {
      return function (value) {
        return (value < 7) ?
          require('../check/template/image/cylh_1.png') :
          value < 16 ? require('../check/template/image/cylh_2.png') : require('../check/template/image/cylh_3.png')
      }
    }
  },
  created() {
    getInspectData().then(res => {
      if (res.code == 200) {
        this.operations = res.data
      }
    })
    this.getDicts("business_status").then(response => {
      this.businessStatusOptions = response.data;
    });
    this.getDicts("business_registration_type").then(response => {
      this.businessRegistrationTypeOptions = response.data;
    });
    this.getDicts("enterprise_type").then(response => {
      this.enterpriseTypeOptions = response.data;
    });
    let operationId = this.$route.query.operationId || 1
    getOperationInfo(operationId).then(res => {
      console.log('------')
      console.log(res)
      if (res.code == 200) {
        this.form = res.data
        let body = {
          operationId: operationId,
          enterpriseName: this.form.enterpriseName,
          enterpriseId: this.form.enterpriseId,
          operationName: this.form.operationName
        }
        this.$bus.$emit('defaultSelect',body)
      }
    })
  },
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 0 12px 16px 12px;
}

.card_shadow {
  height: 370px;
  position: relative;
  margin-top: 12px;
  /* box-shadow: 0 0 8px -2px #06c;*/
  background: #ffffff;
  border-radius: 3px;
}

.card_title_index span {
  font-size: 16px;
  padding: 0 2px 7px 2px;
  float: left;
  /*border-bottom: 3px solid #0085d0;*/
}

.card_title_index {
  padding: 14px 0px 0px 0px;
  min-height: 40px;
  margin: 0 8px;
  border-bottom: 1px dashed #dbdfe6;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);

  .icon {
    width: 18px;
    float: left;
    margin-right: 2px;
  }
}

.text-oneLine {
  display: block; /*内联对象需加*/
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}

/deep/.el-dialog__body {
  padding: 0px 0px;
}
</style>
