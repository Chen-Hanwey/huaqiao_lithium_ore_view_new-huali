<template>
  <div class="body">

    <div class="loginLogo"></div>
    <div class="el-login-main">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
        <img width="auto" height="auto" class="bg-form-left-top" src="../assets/image/bg-form-left-top.png" alt="" />
        <img width="auto" height="auto" class="bg-form-right-top" src="../assets/image/bg-form-right-top.png" alt="" />
        <img width="auto" height="auto" class="bg-form-left-bottom" src="../assets/image/bg-form-left-bottom.png" alt="" />
        <img width="auto" height="auto" class="bg-form-right-bottom" src="../assets/image/bg-form-right-bottom.png" alt="" />
        <!--        <img width="auto" height="auto" class="bg-form-left-top" src="../assets/image/bg-form-left-top.png" alt=""/>-->
        <!--        <img width="auto" height="auto" class="bg-form-left-top" src="../assets/image/bg-form-left-top.png" alt=""/>-->
        <div class="el-login-header">
          <el-image :src="logoUrl" class="header-logo"></el-image>
          <!--            <span class="header-divider"></span>-->
          <span class="header-title">{{ title }}</span>
        </div>
        <!--        <div class="el-login-header">
                  <span class="login-type-title-password" @click="showPassword">账号登录</span>
        &lt;!&ndash;          <span class="login-type-title-qrcode" @click="showQrcode">扫码下载</span>&ndash;&gt;
                </div>-->
        <div id="passwordType">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入用户名">
              <i slot="prefix" class="fa fa-user-o" aria-hidden="true" style="margin-left:4px;display:block;padding-top:14px;color:#ffffff" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" />
            </div>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;color: #FFFFFF">记住密码</el-checkbox>
          <!--          <span style="display: inline-block; float: right; font-size: 13px; padding-top: 3px;"><button @click="gotoForgetPwd">忘记密码？</button></span>-->
          <!--          <router-link :to="'/forgetPwd'" class="sys-link-type-forgetPwd">
                      <span style="display: inline-block; float: right; font-size: 14px; padding-top: 3px;">忘记密码？</span>
                    </router-link>-->
          <el-form-item style="width:100%;">
            <el-button :loading="loading" size="large" type="primary" style="width:100%;font-size: 20px;  font-weight: bold;" @click.native.prevent="handleLogin">
              <span v-if="!loading">登&nbsp&nbsp&nbsp&nbsp录</span>
              <span v-else>登 录 中...</span>
            </el-button>

            <!--            <el-button
                          size="large"
                          type="primary"
                          style="width:45%;float: right;font-size: 16px;"
                          @click.native.prevent="gotoSignUp"
                        >
                          注 册
                        </el-button>-->
          </el-form-item>
          <!--
          <div style="float: right;margin-right:4px;">
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content" style="width: 200px;height:200px;display: flex;justify-content: center;align-items: center;flex-direction: column;">
                <div style="">

                  <vue-qr :correctLevel="3" :logoSrc="require('@/assets/image/logo-3.png')" :logoScale="0.3" :logoMargin="4" :text="appDownloadUrl" :size="180"></vue-qr>
                </div>
                <div>
                  <h3 style="padding: 0;margin: 0px 0 0;">扫描二维码下载app</h3>
                </div>
              </div>
              <router-link class="link-type" to="" style="color: #ffffff;font-size:14px;">APP下载</router-link>
            </el-tooltip>
            &nbsp;&nbsp; <span style="color: #ffffff;">|</span> &nbsp;&nbsp;

            <router-link class="link-type" :to="'/approval'" style="color: #ffffff;font-size:14px;">企业申请</router-link>&nbsp;&nbsp;
            <span style="color: #ffffff;">|</span> &nbsp;&nbsp;
            <router-link class="link-type" :to="'/forgetPwdz'" style="color: #ffffff;font-size:14px;">找回密码</router-link>
          </div> -->

        </div>
        <div id="qrcodeType" style="display: none;text-align: center">

        </div>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span style="display: block; height: 20px;color: #FFFFFF;">{{
          footer + "为了获得更好的系统体验，建议使用360极速浏览器、Google浏览器或者Google内核的浏览器。"
        }}</span>
      <!--      <span style="display: block; height: 20px;"><a href="https://beian.miit.gov.cn/" target="_blank">蜀ICP备2020032944号 中国共产党南充市顺庆区委员会组织部 蜀ICP备2020032944号-1</a>  </span>-->
    </div>

    <!--    <el-dialog :visible.sync="openApproval" :close-on-click-modal="false" >
&lt;!&ndash;      <div slot="title">
&lt;!&ndash;        <span><i :class="dialogIcon"></i></span>&ndash;&gt;
        <span> 企业申请</span>
      </div>&ndash;&gt;
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="企业申请" name="first">
          <el-form ref="approvalForm" :model="approvalForm" :rules="approvalRules" label-width="120px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="企业名称" prop="name" >
                  <el-input v-model="approvalForm.name" placeholder="请输入企业名称"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="企业负责人" prop="principal" >
                  <el-input v-model="approvalForm.principal" placeholder="请输入企业负责人"/>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="负责人联系方式" prop="principalPhone">
                  <el-input v-model="approvalForm.principalPhone" placeholder="请输入负责人联系方式"/>
                </el-form-item>
                <el-col :span="24">
                  <el-form-item label="企业法人" prop="legalPerson" >
                    <el-input v-model="approvalForm.legalPerson" placeholder="请输入法人"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="法人身份证号" prop="legalPersonIdcard" >
                    <el-input v-model="approvalForm.legalPersonIdcard" placeholder="请输入法人身份证"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="法人联系方式" prop="legalPersonPhone" >
                    <el-input v-model="approvalForm.legalPersonPhone" placeholder="请输入法人联系方式"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="信用代码" prop="creditCode" >
                    <el-input v-model="approvalForm.creditCode" placeholder="请输入信用代码"/>
                  </el-form-item>
                </el-col>
              </el-col>
            </el-row>
            <div style="text-align:center; width:100%;height:100%;margin:0px; ">
                <el-button type="primary" @click="submitApprovalForm" style="width: 10%;">确 定</el-button>
                <el-button @click="openApproval=false" style="width: 10%">取 消</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="申请结果" name="second">
          <el-form ref="resultForm" :model="resultForm" :rules="resultRules" label-width="120px">
            <el-row>
                <el-col :span="24">
                  <el-form-item label="信用代码" prop="creditCode" >
                    <el-input v-model="resultForm.creditCode" placeholder="请输入信用代码"/>
                  </el-form-item>
                </el-col>
            </el-row>
            <div style="text-align:center; width:100%;height:100%;margin:0px; ">
              <el-button type="primary" @click="submitResultForm" style="width: 10%;">查 询</el-button>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>-->
  </div>
</template>

<script>
import defaultSettings from '@/settings.js'
import { getCodeImg } from '@/api/login'
import Cookies from 'js-cookie'
import { decrypt, encrypt } from '@/utils/jsencrypt'
import logoUrl from '@/assets/image/logo-2.png'
import bgUrl from '@/assets/image/bg-bj.png'
// import qrcodeUrl from '@/assets/logo/qrcode.png'
// import QRCode from 'qrcodejs2'
import vueQr from "vue-qr";
import Regx from "@/utils/regexp";
import $ from 'jquery'
import { addEnterpriseApproval, getApprovalResult } from "@/api/enterprise/enterprise";

export default {
  name: 'Login',
  components: {
    vueQr
  },
  data () {
    return {
      appDownloadUrl: '',
      codeUrl: '',
      cookiePassword: '',
      title: defaultSettings.title,
      footer: defaultSettings.footer,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      approvalForm: {

      },
      resultForm: {

      },
      approvalRules: {
        name: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        principal: [
          { required: true, message: "企业负责人不能为空", trigger: "blur" }
        ],
        principalPhone: [
          { required: true, message: "负责人联系方式不能为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              Regx.validateTeleAndMobilePhone(rule, value, callback, '请填写正确的负责人联系方式')
            },
            trigger: "blur"
          }
        ],
        legalPerson: [
          { required: true, message: "企业法人不能为空", trigger: "blur" }
        ],
        legalPersonIdcard: [
          { required: true, message: "法人身份证号不能为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              Regx.validIdCard(rule, value, callback, '请填写正确的法人身份证号')
            },
            trigger: "blur"
          }
        ],
        legalPersonPhone: [
          { required: true, message: "法人联系方式不能为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              Regx.validateTeleAndMobilePhone(rule, value, callback, '请填写正确的法人联系方式')
            },
            trigger: "blur"
          }
        ],
        creditCode: [
          { required: true, message: "信用代码不能为空", trigger: "blur" }
        ],
      },
      resultRules: {
        creditCode: [
          { required: true, message: "信用代码不能为空", trigger: "blur" }
        ],
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined,
      logoUrl: logoUrl,
      bgUrl: bgUrl,
      qrcodeUrl: '',
      openApproval: false,
      activeName: 'first'
    }
  },
  /*watch: {
      $route: {
          handler: function (route) {
              this.redirect = route.query && route.query.redirect;
          },
          immediate: true
      }
  },*/
  created () {
    this.appDownloadUrl = `http://${window.location.hostname}:${process.env.VUE_APP_MOBILE_PORT}/#/download_app`
    this.getCode()
    this.getCookie()
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.creatQrCode();
    // })
  },
  methods: {
    // creatQrCode() {
    //   var qrcode = new QRCode(this.$refs.qrCodeUrl, {
    //     text: `http://${window.location.hostname}:8002/#/download_app`, // 需要转换为二维码的内容
    //     width: 150,
    //     height: 150,
    //     colorDark: '#000000',
    //     colorLight: '#ffffff',
    //     correctLevel: QRCode.CorrectLevel.H
    //   })
    // },
    showPassword () {
      $('.login-type-title-password').css('color', '#ffffff').css('border-bottom', '2px solid #1890ff')
      $('.login-type-title-qrcode').css('color', '#000000').css('border-bottom', 'none')
      $('#qrcodeType').hide()
      $('#passwordType').show()
    },
    showQrcode () {
      $('.login-type-title-password').css('color', '#000000').css('border-bottom', 'none')
      $('.login-type-title-qrcode').css('color', '#1890ff').css('border-bottom', '2px solid #1890ff')
      $('#qrcodeType').show()
      $('#passwordType').hide()
    },
    getCode () {
      getCodeImg().then(res => {
        this.codeUrl = 'data:image/gif;base64,' + res.img
        this.loginForm.uuid = res.uuid
      })
    },
    getCookie () {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 })
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              // this.loading = false;
              // this.$router.push({ path: this.redirect || '/' })
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
              this.getCode()
            })
        }
      })
    },
    gotoForgetPwd () {
      // console.log("test");
      this.$router.push({ name: 'ForgetPwd', params: {} })
    },
    gotoSignUp () {
      this.$router.push({ path: '/signUp' })
    },
    clickApproval () {
      this.approvalForm = {};
      this.openApproval = true;
    },
    submitApprovalForm: function () {
      let that = this;
      this.$refs["approvalForm"].validate(valid => {
        if (valid) {
          addEnterpriseApproval(this.approvalForm).then(response => {
            if (response.code === 200) {
              this.$alert(response.msg, "提示", {
                confirmButtonText: '确定',
                callback: action => {
                  that.openApproval = false;
                }
              });
            } else {
              this.msgError(response.msg);
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
              let msg = "未获取到该信用代码关联企业信息";
              if (response.data && response.data.approvalStatus && response.data.approvalStatus != "") {
                if (response.data.approvalStatus == '1') {
                  msg = "该信用代码关联企业审核状态为待审批，请等待审批";
                }
                if (response.data.approvalStatus == '2') {
                  msg = "该信用代码关联企业审核状态为已通过";
                }
                if (response.data.approvalStatus == '3') {
                  msg = "该信用代码关联企业审核状态为未通过，未通过原因：" + response.data.approvalRemark;
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

<style rel="stylesheet/scss" lang="scss">
  .loginLogo {
    height: 130px;
    position: absolute;
    width: 300px;
    top: 2%;
    left: 2%;
    background-image: url(../assets/image/loginlogo.png);
    background-repeat: no-repeat;
  }
.el-login-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
}

.header-logo .el-image__inner {
  flex: 1;
  vertical-align: top;
  width: 50px;
  height: 50px;
}

.header-divider {
  margin-left: 10px;
  margin-right: 10px;
  width: 2px;
  height: 30px;
  background-color: #1890ff;
}

.header-title {
  font-size: 2em;
  font-weight: bold;
  color: #ffffff;
  flex: 3;
  margin-left: 15px;
}

.login-type-title-password {
  line-height: 2em;
  font-size: 1em;
  font-weight: 600;
  flex: 1;
  text-align: center;
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}

.login-type-title-qrcode {
  line-height: 2em;
  font-size: 1em;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.body {
  width: 100%;
  height: 100%;
  background-image: url("../assets/image/bg-bj-4.png");
  background-size: 100% 100%;
  font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", "Helvetica Neue",
    "Helvetica", "Arial", sans-serif;
}

.el-login-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  //border-radius: 25px;
  background-color: rgba(41, 117, 255, 0.2);
  width: 450px;
  height: 420px;
  padding: 40px 25px 5px 25px;
  margin-left: 50%;
  position: relative;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

/*  .login-form::after{
    width: 450px;
    height: 400px;
    content: "";
    background:url('../assets/image/bg-form-left-top.png') no-repeat left top,url('../assets/image/bg-form-right-top.png') no-repeat right top,url('../assets/image/bg-form-left-bottom.png') no-repeat left bottom,url('../assets/image/bg-form-right-bottom.png') no-repeat right bottom;
  }*/

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>


<style scoped>
/deep/ .login-form .el-input input {
  border-radius: 0px;
  height: 0px;
  padding: 18px 40px;
  background-clip: content-box;
  border-style: solid solid solid solid;
  border-color: rgb(19, 158, 234);
  background: rgba(18, 129, 206, 0.6);
  filter: grayscale(15%);
  color: #ffffff;
  font-size: 15px;
}

/deep/ .login-form .el-input .el-input__inner::placeholder {
  /*color: #fff;*/
}

/deep/ .login-form .input-icon {
  height: 39px;
  width: 14px;
  margin-left: 2px;
  color: #ffffff;
}

/deep/ .login-form .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #ffffff;
}

.bg-form-left-top {
  position: absolute;
  top: 0px;
  left: 0px;
}

.bg-form-right-top {
  position: absolute;
  right: 0px;
  top: 0px;
}

.bg-form-right-bottom {
  position: absolute;
  right: 0px;
  bottom: 0px;
}

.bg-form-left-bottom {
  position: absolute;
  left: 0px;
  bottom: 0px;
}

/deep/ .el-dialog__header {
  background: white;
}
</style>
