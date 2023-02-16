<template>
    <div>
        <div class="sub-project" v-if="enterpriseOpen">
            <div class="sub-title">
                <div class="sub-title-name">{{enterpriseTitle}}</div>
            </div>
            <div class="sub-body">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="企业名称" prop="enterpriseName" v-if="!readOnly">
                            <el-input  v-model="form.enterprise.name" placeholder="" disabled/>
                        </el-form-item>
                        <el-form-item label="企业名称："  prop="enterpriseName" v-if="readOnly" class="custom-form-item">
                          <el-link style="padding-bottom: 12px" :underline="false" @click="openEnterpriseDialog" type="primary">{{ form.enterprise.name }}</el-link>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="信用代码" prop="enterpriseCreditCode" v-if="!readOnly">
                            <el-input v-model="form.enterprise.creditCode" placeholder="" disabled/>
                        </el-form-item>
                        <el-form-item label="信用代码：" prop="enterpriseCreditCode"  v-if="readOnly" class="custom-form-item">
                            {{ form.enterprise.creditCode }}
                        </el-form-item>
                    </el-col>

                </el-row>
          </div>
        </div>
        <div class="sub-project" v-if="operationOpen">
            <div class="sub-title">
                <div class="sub-title-name">{{ operationTitle }}</div>
            </div>
            <div class="sub-body">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="经营场所名称" prop="operationName" v-if="!readOnly">
                            <el-input v-model="form.operation.name" style="color: blue;cursor: pointer" placeholder="" disabled/>
                        </el-form-item>
                        <el-form-item label="经营场所名称：" prop="operationName" v-if="readOnly" class="custom-form-item">
                            {{ form.operation.name }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="行业类别" prop="operationBigType" v-if="!readOnly">
                            <el-input v-model="form.operation.bigTypeName" placeholder="" disabled/>
                        </el-form-item>
                        <el-form-item label="行业类别：" prop="operationBigType" v-if="readOnly" class="custom-form-item">
                            {{ form.operation.bigTypeName }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="负责人" prop="operationConcat" v-if="!readOnly">
                            <el-input v-model="form.operation.concat" placeholder="" disabled/>
                        </el-form-item>
                        <el-form-item label="负责人：" prop="operationConcat" v-if="readOnly" class="custom-form-item">
                            {{ form.operation.concat }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </div>
      <el-dialog append-to-body :visible.sync="openEnterprise"   :close-on-click-modal="false" class="customForm  _baseForm_small">
        <div slot="title">
          <span><i class="el-icon-view"></i></span>
          <span>经营主体信息</span>
        </div>
        <div class="enterprise-body"></div>
        <el-form ref="form" :model="form" label-width="140px">
          <div class="sub-project">
            <div class="sub-title">
              <div class="sub-title-name">基本信息</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="企业名称：" prop="name" class="custom-form-item">
                    <div class="text-oneLine" :title="form.enterprise.name">{{ form.enterprise.name }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="企业负责人：" prop="principal"  class="custom-form-item">
                    {{ form.enterprise.principal }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="负责人联系方式：" prop="principalPhone"  class="custom-form-item">
                    {{ form.enterprise.principalPhone }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="安全管理员：" prop="securityAdministrator"  class="custom-form-item">
                    {{ form.enterprise.securityAdministrator }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="管理员联系方式：" prop="securityAdministratorPhone"
                                class="custom-form-item">
                    {{ form.enterprise.securityAdministratorPhone }}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="sub-project">
            <div class="sub-title">
              <div class="sub-title-name">工商信息</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="企业法人：" prop="legalPerson"  class="custom-form-item">
                    {{ form.enterprise.legalPerson }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="法人身份证号：" prop="legalPersonIdcard"  class="custom-form-item">
                    {{ form.enterprise.legalPersonIdcard }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="法人联系方式：" prop="legalPersonPhone"  class="custom-form-item">
                    {{ form.enterprise.legalPersonPhone }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="信用代码：" prop="creditCode"  class="custom-form-item">
                    {{ form.enterprise.creditCode }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="成立日期：" prop="establishmentDate"  class="custom-form-item">
                    {{form.enterprise.establishmentDate}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工商注册号：" prop="businessRegistrationNumber"  class="custom-form-item">
                    {{form.enterprise.businessRegistrationNumber}}
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="组织机构代码：" prop="organizationCode"  class="custom-form-item">
                    {{form.enterprise.organizationCode}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="纳税人识别号：" prop="taxpayerIdentificationNumber"  class="custom-form-item">
                    {{form.enterprise.taxpayerIdentificationNumber}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="注册资本(万)：" prop="registeredCapital"  class="custom-form-item">
                    {{form.enterprise.registeredCapital}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="登记机关：" prop="registrationAuthority"  class="custom-form-item">
                    {{form.enterprise.registrationAuthority}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                  <el-col :span="24">
                    <el-form-item label="注册地址：" prop="registeredAddress"  class="custom-form-item">
                      {{ form.enterprise.registeredAddress }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="经营范围：" prop="businessScope"  class="custom-form-item">
                      <el-input v-model="form.enterprise.businessScope" type="textarea" :autosize="true" placeholder=""
                                :readonly="readOnly" resize="none" class="custom-textarea custom-form-item"/>
                    </el-form-item>
                  </el-col>
              </el-row>
            </div>
          </div>
          <div class="sub-project">
            <div class="sub-title">
              <div class="sub-title-name">所属区域</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="地市：" prop="areaCity" class="custom-form-item">
                    {{ form.enterprise.areaCityName }}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="区县：" prop="areaDistrict"  class="custom-form-item">
                    {{ form.enterprise.areaDistrictName }}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="街道：" prop="areaStreet" class="custom-form-item">
                    {{ form.enterprise.areaStreetName }}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="管辖单位：" prop="supervisionDeptId" class="custom-form-item">
                    {{ form.enterprise.supervisionDeptName }}
                  </el-form-item>
                </el-col>
              </el-row>
             <!-- <el-row>
                <el-col :span="24">
                  <el-form-item label="位置信息:" class="custom-form-item" >
                    <div style="height: 500px;width: 100%;padding-top: 10px;margin-bottom: 10px;">
                      <a-map ref="location-edit" :lng="form.enterprise.longitude"
                             :lat="form.enterprise.latitude" :marker-edit="false"></a-map>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>-->
            </div>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <div>
            <el-button type="" @click="openEnterprise=false">关 闭</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>
<script>

    import { getBaseFormData } from "@/api/operationManage/operationManage";
    import {getEnterprise} from "@/api/enterprise/enterprise";
    import AMap from "@/views/components/Amap/location";
    export default {
        name: 'FoodInspection',
        components: {AMap},
        props: {
            readOnly: {
                type: Boolean,
                default: false
            },
          enterpriseOpen: {
              type: Boolean,
              default: true
          },
          operationOpen: {
            type: Boolean,
            default: true
          },
          enterpriseTitle: {
            type: String,
            default: "企业信息"
          },
          operationTitle: {
            type: String,
            default: "经营场所信息"
          },
        },
        data() {
            return {
                // 表单数据
                form: {
                    enterprise: {
                        name: null,
                        creditCode: null,
                        enterpriseBigType: null
                    },
                    operation: {
                        name: null,
                        concat: null,
                        concatPhone: null
                    }

                },
              openEnterprise:false
            }

        },
        methods: {
            /**
             * 初始化表单
             */
            initBaseForm(operationId) {
                this.initBaseFormData(operationId);
                // this.readOnly = this.readOnly
            },
            /**
             * 初始化表单数据
             */
            initBaseFormByEnterpriseId(enterpriseId) {
              if (!enterpriseId) {
                this.msgError("仅可企业账号维护");
                return;
              }
              getEnterprise(enterpriseId).then(res => {
                this.form.enterprise = res.data;
                this.operationOpen=false;
              })
            },
            /**
             * 初始化表单数据
             */
            initBaseFormData(operationId) {
              /*if (!operationId) {   //先去掉，监管要看详情zhang.zw 20220430
                this.msgError("仅可运营商账号维护");
                return;
              }*/
              getBaseFormData(operationId).then(res => {
                this.form = res.data;
              })
            },

          /**
           * 初始化表单数据
           */
          init(operationId) {
          /*  if (!operationId) { //先去掉，监管要看详情zhang.zw 20220430
              this.msgError("仅可运营商账号维护");
              return;
            }*/
            getBaseFormData(operationId).then(res => {
              this.form = res.data;
            })
          },
            /**
             * 获取企业Id
             */
            getEnterpriseId() {
                return this.form.enterprise.id;
            },
            /**
             * 获取运营商Id
             */
            getOperationId() {
                return this.form.operation.id;
            },
            openEnterpriseDialog() {
              this.openEnterprise=true;
            }
        }

    }
</script>
