<template>
  <div class="body">
    <div class="el-login-main">
      <el-form ref="forgotForm" :model="forgotForm" :rules="forgotRules" class="login-form1">
        <img width="auto" height="auto" class="bg-form-left-top" src="../assets/image/bg-form-left-top.png" alt=""/>
        <img width="auto" height="auto" class="bg-form-right-top" src="../assets/image/bg-form-right-top.png" alt=""/>
        <img width="auto" height="auto" class="bg-form-left-bottom" src="../assets/image/bg-form-left-bottom.png"
             alt=""/>
        <img width="auto" height="auto" class="bg-form-right-bottom" src="../assets/image/bg-form-right-bottom.png"
             alt=""/>
        <div class="el-login-header">
          <el-image :src="logoUrl" class="header-logo"></el-image>
          <span class="header-title">用户找回密码</span>
        </div>
        <div id="passwordType">
          <el-form-item prop="phone">
            <el-input v-model="forgotForm.phone" type="text" auto-complete="off" placeholder="请输入手机号" >
              <svg-icon slot="prefix" icon-class="phone" aria-hidden="true" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="forgotForm.password"
              type="password"
              auto-complete="off"
              placeholder="新密码"
              @keyup.enter.native="handleForgot"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="forgotForm.confirmPassword"
              type="password"
              auto-complete="off"
              placeholder="确认新密码"
              @keyup.enter.native="handleForgot"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input
              v-model="forgotForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
            >
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
            </el-input>
            <div class="login-code">
            <el-button
              size="medium"
              type="primary"
              :disabled="isDisabled"

              @click.native.prevent="getPhoneCode1"
            >{{ buttonName }}
            </el-button>
            </div>
          </el-form-item>

          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              style="width:100%;font-size: 20px;  font-weight: bold;"
              @click.native.prevent="handleForgot"
              type="primary"
            >
              <span v-if="!loading">重 置</span>
              <span v-else>重 置 中...</span>
            </el-button>
          </el-form-item>

          <div style="float: right;margin-right:4px;">
            <router-link class="link-type" :to="'/login'" style="color: #ffffff;font-size:14px;">返回登录</router-link>
          </div>

        </div>
        <div id="qrcodeType" style="display: none;text-align: center">
        </div>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span
        style="display: block; height: 20px;color: #FFFFFF;">{{
          footer + "为了获得更好的系统体验，建议使用360极速浏览器、Google浏览器或者Google内核的浏览器。"
        }}</span>
    </div>


  </div>
</template>

<script>
import defaultSettings from '@/settings.js'
import logoUrl from '@/assets/image/logo-2.png'
import bgUrl from '@/assets/image/bg-bj.png'
import vueQr from "vue-qr";
import $ from 'jquery'
import { getVerifyCode, getVerifyCodeBySms, resetPwd, verifyCode, verifySmsCode } from '@/api/system/forgetPwd'
import { getPublicKey } from '@/api/login'
import { encryptData } from '@/utils/ecdh'

export default {
  name: 'ForgetPwdz',
  components: {
    vueQr
  },
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.forgotForm.password !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const checkphone = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入手机号'))
      } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号!'))
      } else {
        callback()
      }
    }
    return {
      gg: false,
      showCount: false,
      appDownloadUrl:'',
      codeUrl: '',
      cookiePassword: '',
      footer: defaultSettings.footer,
      forgotForm: {
        username: '',
        password: '',
        confirmPassword: '',
        phone: '',
        code: '',
        uuid: '',
        rememberPolicy: false
      },
      approvalForm:{
      },
      forgotRules: {
        password: [
          {required: true, trigger: 'blur', message: '请输入您的密码'},
        ],
        confirmPassword: [
          {required: true, trigger: 'blur', message: '请再次输入您的密码'},
          {required: true, validator: equalToPassword, trigger: 'blur'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '请输入您的手机号'},
          {required: true, validator: checkphone, trigger: 'blur'}
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}]
      },
      loading: false,
      redirect: undefined,
      logoUrl: logoUrl,
      bgUrl: bgUrl,
      qrcodeUrl: '',
      openApproval:false,
      activeName: 'first',
      // 短信验证码
      isDisabled: false,
      buttonName: '获取验证码',
      time: 60
    }
  },

  created() {
    this.appDownloadUrl = `http://${window.location.hostname}:8002/#/download_app`
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.creatQrCode();
    // })
  },
  methods: {
    handleForgot() {
      debugger
      this.$refs.forgotForm.validate(valid => {
        if (valid) {
          //暂时关闭验证码校验
          // if(this.forgotForm.code){
          //   verifyCode(this.forgotForm.phone, this.forgotForm.code).then(response => {
          //     if (response.code === 200) {
          //       this.active = 1
                getPublicKey(this.forgotForm.phone).then(res => {
                  if (res.code === 200) {
                    this.loading = true
                    let result = encryptData(res.data, this.forgotForm.password)
                    let aes_password = result.encryptedData
                    resetPwd(this.forgotForm.phone, aes_password, result.clientKey).then(response => {
                      if (response.code === 200) {
                        this.active = 3
                        const phone = this.forgotForm.phone
                        this.$alert('<font >您的账号“' + phone + '”找回密码成功！</font>', '系统提示', {
                          dangerouslyUseHTMLString: true
                        }).then(() => {
                          this.loading = false
                          // removeTenant();
                          this.$router.push('/login')
                        }).catch(() => {
                          // removeTenant();
                        })
                      } else {
                        this.msgError(response.msg)
                        this.loading = false
                      }
                    })
                  }
                })
              } else {
                this.msgError(response.msg)
                this.loading = false
              }
            // })
          // }
        // }
      })
    },

    getPhoneCode1() {
      debugger
      let flag = true
      let me = this
      this.$refs.forgotForm.validateField(['phone'], valid => {
        if (valid && valid != '') {
          flag = false
        }
      })
      if (flag) {
        me.isDisabled = true
        let interval = window.setInterval(function () {
          me.buttonName = '（' + me.time + '秒）后重新发送'
          --me.time
          if (me.time < 0) {
            me.buttonName = '重新发送'
            me.time = 60
            me.isDisabled = false
            window.clearInterval(interval)
          }
        }, 1000)
        getVerifyCode(this.forgotForm.phone).then(res => {

        })
      }
    },
    showPassword() {
      $('.login-type-title-password').css('color', '#ffffff').css('border-bottom', '2px solid #1890ff')
      $('.login-type-title-qrcode').css('color', '#000000').css('border-bottom', 'none')
      $('#qrcodeType').hide()
      $('#passwordType').show()
    },
    showQrcode() {
      $('.login-type-title-password').css('color', '#000000').css('border-bottom', 'none')
      $('.login-type-title-qrcode').css('color', '#1890ff').css('border-bottom', '2px solid #1890ff')
      $('#qrcodeType').show()
      $('#passwordType').hide()
    },




  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
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
  color: #FFFFFF;
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
  font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
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

.login-form1 {
  //border-radius: 25px;
  background-color: rgba(41, 117, 255, 0.2);
  width: 450px;
  height: 430px;
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
  height: 35px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

</style>


<style scoped>
/deep/ .login-form1 .el-input input {
  border-radius: 0px;
  height: 0px;
  padding: 18px 40px;
  background-clip: content-box;
  border-style: solid solid solid solid;
  border-color: rgb(19, 158, 234);
  background: rgba(18, 129, 206, 0.6);
  filter: grayscale(15%);
  color: #FFFFFF;
  font-size: 15px;
}


/deep/ .login-form1 .el-input .el-input__inner::placeholder {
  /*color: #fff;*/
}


/deep/ .login-form1 .input-icon {
  height: 39px;
  width: 14px;
  margin-left: 2px;
  color: #ffffff;
}

/deep/ .login-form1 .el-checkbox__input.is-checked + .el-checkbox__label {
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
