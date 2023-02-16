<template>
  <div class="body-approval">
    <div class="body-top"></div>
    <div class="body-bottom">
      <el-tabs style="height: 100%;width: 80%;margin-left: 10%;margin-top: 20px" v-model="activeName" :stretch="true">
        <el-tab-pane label="企业申请" name="first">
          <el-form ref="approvalForm" :model="approvalForm" :rules="approvalRules" label-width="200px">
            <el-row style="margin-top: 30px">
              <el-col :span="12">
                <el-form-item label="企业名称" prop="name">
                  <el-input v-model="approvalForm.name" placeholder="请输入企业名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="信用代码" prop="creditCode">
                  <el-input v-model="approvalForm.creditCode" placeholder="请输入信用代码"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业负责人" prop="principal">
                  <el-input v-model="approvalForm.principal" placeholder="请输入企业负责人"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人联系方式" prop="principalPhone">
                  <el-input v-model="approvalForm.principalPhone" placeholder="请输入负责人联系方式"/>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="企业法人" prop="legalPerson">
                    <el-input v-model="approvalForm.legalPerson" placeholder="请输入法人"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="法人身份证号" prop="legalPersonIdcard">
                    <el-input v-model="approvalForm.legalPersonIdcard" placeholder="请输入法人身份证"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="法人联系方式" prop="legalPersonPhone">
                    <el-input v-model="approvalForm.legalPersonPhone" placeholder="请输入法人联系方式"/>
                  </el-form-item>
                </el-col>
              <el-col :span="12">
                <el-form-item label="企业邮箱" prop="email">
                  <el-input v-model="approvalForm.email" placeholder="请输入企业邮箱"/>
                </el-form-item>
              </el-col>
            </el-row>

            <div style="text-align:center; width:100%;height:100%;margin-top: 20px ">
              <el-button type="primary" @click="submitApprovalForm" style="width: 150px">提交</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="申请结果" name="second">
          <el-form ref="resultForm" :model="resultForm" :rules="resultRules" label-width="200px">
            <el-row align="middle" style="margin-top: 30px">
              <el-col :span="24">
                <el-form-item label="信用代码" prop="creditCode">
                  <el-input v-model="resultForm.creditCode" placeholder="请输入信用代码"/>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="text-align:center; width:100%;height:100%;margin-top: 30px ">
              <el-button type="primary" @click="submitResultForm" style="width: 10%;">查询</el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span
        style="display: block; height: 20px;color: #000000;">{{
          footer + "为了获得更好的系统体验，建议使用360极速浏览器、Google浏览器或者Google内核的浏览器。"
        }}</span>
      <!--      <span style="display: block; height: 20px;"><a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2020032944号 中国共产党南充市顺庆区委员会组织部 蜀ICP备2020032944号-1</a>  </span>-->
    </div>
  </div>
</template>

<script>
import defaultSettings from '@/settings.js'
import Regx from "@/utils/regexp";
import $ from 'jquery'
import {addEnterpriseApproval, getApprovalResult} from "@/api/enterprise/enterprise";
import regexp from "@/api/regexp/regexp";

export default {
  name: 'Approval',
  data() {
    return {
      title: defaultSettings.title,
      footer: defaultSettings.footer,
      approvalForm: {},
      resultForm: {},
      approvalRules: {
        name: [
          {required: true, message: "企业名称不能为空", trigger: "blur"}
        ],
        principal: [
          {required: true, message: "企业负责人不能为空", trigger: "blur"}
        ],
        principalPhone: [
          {required: true, message: "负责人联系方式不能为空", trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              Regx.validateTeleAndMobilePhone(rule, value, callback, '请填写正确的负责人联系方式')
            },
            trigger: "blur"
          }
        ],
        legalPerson: [
          {required: true, message: "企业法人不能为空", trigger: "blur"}
        ],
        legalPersonIdcard: [
          {required: true, message: "法人身份证号不能为空", trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              Regx.validIdCard(rule, value, callback, '请填写正确的法人身份证号')
            },
            trigger: "blur"
          }
        ],
        email: [
          {required: true, message: "企业邮箱不能为空", trigger: "blur"},
          { validator: regexp.validateEmail, trigger: 'blur' }
        ],
        legalPersonPhone: [
          {required: true, message: "法人联系方式不能为空", trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              Regx.validateTeleAndMobilePhone(rule, value, callback, '请填写正确的法人联系方式')
            },
            trigger: "blur"
          }
        ],
        creditCode: [
          {required: true, message: "信用代码不能为空", trigger: "blur"}
        ],
      },
      resultRules: {
        creditCode: [
          {required: true, message: "信用代码不能为空", trigger: "blur"}
        ],
      },
      loading: false,
      redirect: undefined,
      activeName: 'first'
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    submitApprovalForm: function () {
      let that = this;
      this.$refs["approvalForm"].validate(valid => {
        if (valid) {
          addEnterpriseApproval(this.approvalForm).then(response => {
            if(response.data.status=='1'){
              this.$alert(response.msg, "提示", {
                confirmButtonText: '确定',
                callback: action => {
                  that.$router.push("/login")
                }
              });
            }
            else{
              this.$alert(response.msg, "提示", {
                confirmButtonText: '确定'
              });
            }
          });
        }
      })
    },
    submitResultForm: function () {
      let that = this;
      this.$refs["resultForm"].validate(valid => {
        if (valid) {
          getApprovalResult(this.resultForm).then(response => {
            if (response.code === 200) {
              let msg = "未获取到该企业申请信息";
              console.log(response);
              if (response.data && response.data.wfOrderStatus ) {
                if (response.data.wfOrderStatus == 1) {
                  msg = "该企业申请审批状态为待审批，请等待审批";
                }
                if (response.data.wfOrderStatus == 4 || response.data.wfOrderStatus == 2) {
                  msg = "该企业申请审批状态为通过,请通过登记邮箱查看登录账户及初始密码";
                }
                if (response.data.wfOrderStatus == 3) {
                  msg = "该企业申请审批状态为不通过，不通过原因：" + response.data.approveDescription;
                }
              }
              this.$alert(msg, "查询结果", {
                confirmButtonText: '确定'
              });
            } else {
              this.msgError(response.msg);
            }
          });
        }
      })
    },
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.body-approval {
  width: 100%;
  height: 100%;

  font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
}

.body-top {
  width: 100%;
  height: 40%;
  background-image: url("../assets/image/bg-bj-6.png");
  background-size: 100% 100%;
}

.body-bottom {
  width: 100%;
  height: calc(60% - 80px);
}


.el-login-footer {
  width: 100%;
  height: 80px;
  /*background-color: #fff;*/
  position: absolute;
  bottom: 0;
  line-height: 80px;
  text-align: center;
  color: #000;
  /*font-family: Arial;*/
  font-size: 12px;
  letter-spacing: 1px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}
/deep/ .el-input__inner {
  border-radius: 0;
}

/deep/ .el-button--small{
  border-radius: 0;
}
</style>

