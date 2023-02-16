<template>
  <div class="body">
    <div class="el-forget-main">
      <el-form ref="forgetForm" :model="forgetForm" :rules="forgetRules" class="forget-form" label-width="110px">
        <div style="text-align: left;font-size: 2em;font-weight: bold;margin-bottom: 40px;">
          重置密码
        </div>
        <div class="el-login-header">
          <el-steps :active="active" finish-status="success" align-center style="width: 100%;">
            <el-step title="身份验证"></el-step>
            <el-step title="重置密码"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
        </div>

        <div id="firstStep" v-if="firstStep" style="padding: 0 15% 0 10%">
          <!--<el-form-item label="手机号/身份证" prop="username">-->
            <!--<el-input v-model="forgetForm.username" type="text" auto-complete="off" @keyup.enter.native="verifyCode">-->
              <!--<svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="forgetForm.phoneNumber" type="text" auto-complete="off" @keyup.enter.native="verifyCode">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <!--<el-form-item label="邮箱" prop="email">-->
            <!--<el-input-->
              <!--v-model="forgetForm.email"-->
              <!--type="email"-->
              <!--auto-complete="off"-->
              <!--@keyup.enter.native="verifyCode"-->
            <!--&gt;-->
              <!--<svg-icon slot="prefix" icon-class="email" class="el-input__icon input-icon"/>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="验证码" prop="verifyCode"></el-form-item>
          <el-input
            v-model="forgetForm.verifyCode"
            type="text"
            placeholder=""
            class="forget-item"
            @keyup.enter.native="verifyCode"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
          </el-input>
          <div class="verify-code" v-if="!showCount">
            <el-button type="primary" size="medium" @click="getVerifyCode">获取验证码</el-button>
          </div>
          <div class="verify-code" v-if="showCount">
            <el-button type="primary" size="medium" style="cursor: not-allowed" @click="">{{formatCount()}}秒后重发
            </el-button>
          </div>


          <div style="text-align: center; margin-top: 30px;margin-left: 10%;">
            <el-button
              type="primary"
              size="large"
              class="btn-cus"
              @click.native.prevent="verifyCode"
            >
              确 定
            </el-button>
            <el-button size="large" class="btn-cus" @click="gotoLogin">取 消</el-button>
          </div>
        </div>

        <div id="secondStep" v-if="secondStep" style="padding: 15px 15% 0 10%">
          <el-form-item label="请输入密码" prop="password">
            <el-input v-model="forgetForm.password" type="password" auto-complete="off">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item label="再次输入密码" prop="password2">
            <el-input
              v-model="forgetForm.password2"
              type="password"
              auto-complete="off"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>

          <div style="text-align: center;"><span>注意：密码至少包含英文字母、数字，长度在8-18位之间</span></div>

          <div style="text-align: center; margin-top: 25px;margin-left: 5%;">
            <el-button
              :loading="loading"
              size="large"
              class="btn-cus"
              type="primary"
              @click.native.prevent="resetPwd"
            >
              确定
            </el-button>
            <el-button size="large" class="btn-cus" @click="gotoLogin">取 消</el-button>
          </div>
        </div>

        <div id="thirdStep" v-show="thirdStep" style="padding: 80px 10% 0 10%; text-align: center">
          您的密码已经重置成功，请
          <router-link :to="'/login'" class="sys-link-type">
            <span>点击此处</span>
          </router-link>
          重新登录。

        </div>

      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>{{footer}}</span>
      <span>为了获得更好的系统体验，建议使用360极速浏览器、Google浏览器或者Google内核的浏览器。</span>
    </div>
  </div>
</template>

<script>
  import defaultSettings from '@/settings.js'
  import { getVerifyCode, resetPwd, verifyCode,getVerifyCodeBySms,verifySmsCode } from '@/api/system/forgetPwd'
  import logoUrl from '@/assets/image/logo.jpg'
  import bgUrl from '@/assets/image/bg-bj.png'
  import regexp from '@/api/regexp/regexp'
  import { getPublicKey } from '@/api/login'
  import { encryptData } from '@/utils/ecdh';

  export default {
    name: 'ForgetPwd',
    data() {
      return {
        active: 0,
        firstStep: true,
        secondStep: false,
        thirdStep: false,
        codeUrl: '',
        showCount: false,
        count: '',
        strCount: '',
        timer: null,
        title: defaultSettings.title,
        footer: defaultSettings.footer,
        forgetForm: {
          username: '',
          email: '',
          verifyCode: '',
          password: '',
          password2: ''
        },
        forgetRules: {
          username: [
            { required: true, trigger: 'blur', message: '手机号/身份证不能为空' },
            { validator: regexp.validatePhoneOrIDCard, trigger: 'blur' }
          ],
          phoneNumber: [
            { required: true, trigger: 'blur', message: '手机号不能为空' },
            { validator: regexp.validatePhone, trigger: 'blur' }
          ],
          email: [
            { required: true, trigger: 'blur', message: '邮箱不能为空' },
            { validator: regexp.validateEmail, trigger: 'blur' }
          ],
          verifyCode: [{ required: true, trigger: 'blur', message: '验证码不能为空' }],
          password: [{ required: true, trigger: 'blur', message: '密码不能为空' }, {
            validator: regexp.validatePassword,
            trigger: 'blur'
          }],
          password2: [{
            required: true,
            trigger: 'blur',
            message: '确认密码不能为空'
          }, { validator: this.validateConfirmPassword, trigger: 'blur' }]
        },
        loading: false,
        logoUrl: logoUrl,
        bgUrl: bgUrl
      }
    },

    methods: {
      gotoLogin() {
        this.$router.push({ path: '/login' })
      },
      getVerifyCode() {
        let result = false;
        this.$refs.forgetForm.validateField('phoneNumber', errorMessage => {
          if (!errorMessage) {
            result = true  //验证通过
          } else {
            result = false
            return false
          }
        })
        if (result) {
          getVerifyCodeBySms(this.forgetForm.phoneNumber).then(response => {
            if (response.code === 200) {
              let TIME_COUNT = 60
              if (!this.timer) {
                this.count = TIME_COUNT
                this.showCount = true
                this.timer = setInterval(() => {
                  if (this.count > 0 && this.count <= TIME_COUNT) {
                    this.count--
                  } else {
                    this.showCount = false
                    clearInterval(this.timer)
                    this.timer = null
                  }
                }, 1000)
              }
            }
          })
        }
        //
        // this.$refs.forgetForm.validateField('username', errorMessage => {
        //   if (!errorMessage) {
        //     result = true  //验证通过
        //   } else {
        //     result = false
        //     return false
        //   }
        // })
        // this.$refs.forgetForm.validateField('email', errorMessage => {
        //   if (!errorMessage) {
        //     result = true  //验证通过
        //   } else {
        //     result = false
        //     return false
        //   }
        // })
        // if (result) {
        //   getVerifyCode(this.forgetForm.username, this.forgetForm.email).then(response => {
        //     if (response.code === 200) {
        //       let TIME_COUNT = 60
        //       if (!this.timer) {
        //         this.count = TIME_COUNT
        //         this.showCount = true
        //         this.timer = setInterval(() => {
        //           if (this.count > 0 && this.count <= TIME_COUNT) {
        //             this.count--
        //           } else {
        //             this.showCount = false
        //             clearInterval(this.timer)
        //             this.timer = null
        //           }
        //         }, 1000)
        //       }
        //     }
        //   })
        // }

      },
      formatCount() {
        if (this.count < 10) {
          return '0' + this.count
        } else {
          return this.count
        }
      },
      verifyCode() {
        let result = false;
        // this.$refs.forgetForm.validateField('username', errorMessage => {
        //   if (!errorMessage) {
        //     result = true  //验证通过
        //   } else {
        //     result = false
        //     return false
        //   }
        // })
        // this.$refs.forgetForm.validateField('email', errorMessage => {
        //   if (!errorMessage) {
        //     result = true  //验证通过
        //   } else {
        //     result = false
        //     return false
        //   }
        // })
        this.$refs.forgetForm.validateField('phoneNumber', errorMessage => {
          if (!errorMessage) {
            result = true  //验证通过
          } else {
            result = false
            return false
          }
        })
        this.$refs.forgetForm.validateField('verifyCode', errorMessage => {
          if (!errorMessage) {
            result = true  //验证通过
          } else {
            result = false
            return false
          }
        })
        if (result) {
          verifySmsCode(this.forgetForm.phoneNumber, this.forgetForm.verifyCode).then(response => {
            if (response.code === 200) {
              this.firstStep = false
              this.secondStep = true
              this.active = 1
            } else {
              this.msgError(response.msg)
            }
          })

        }
      },
      resetPwd() {
        let result = false;
        this.$refs.forgetForm.validateField('password', errorMessage => {
          if (!errorMessage) {
            result = true  //验证通过
          } else {
            result = false
            return false
          }
        })
        this.$refs.forgetForm.validateField('password2', errorMessage => {
          if (!errorMessage) {
            result = true  //验证通过
          } else {
            result = false
            return false
          }
        })
        if (result) {
          if (this.forgetForm.password === this.forgetForm.password2) {
            getPublicKey(this.forgetForm.phoneNumber).then(res => {
              if(res.code === 200){
                let result = encryptData(res.data, this.forgetForm.password);
                let aes_password = result.encryptedData;
                resetPwd(this.forgetForm.phoneNumber, aes_password, result.clientKey).then(response => {
                  if (response.code === 200) {
                    this.secondStep = false
                    this.thirdStep = true
                    this.active = 3
                  } else {
                    this.msgError(response.msg)
                  }
                })
              }
            });

          } else {

          }
        }
      },

      /** 密码验证 **/
      validateConfirmPassword: function(rule, value, callback) {
        if (this.forgetForm.password === this.forgetForm.password2) {
          callback()
        } else {
          callback(new Error('密码与上面的输入不一致'))
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-login-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 18px;
  }

  .header-logo {
    flex: 1;
  }

  .header-divider {
    margin-left: 10px;
    margin-right: 10px;
    width: 2px;
    height: 30px;
    background-color: #1890ff;
  }

  .header-title {
    font-size: 1.4em;
    font-weight: bold;
    color: #1890ff;
    flex: 3;
  }

  .forget-item {
    width: 54%;
  }

  .body {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-image: url("../assets/image/bg-bj.png");
    background-size: 100% 100%;
    font-family: "SF Pro SC", "SF Pro Text", "SF Pro Icons",  "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }

  .el-forget-main {
    width: 550px;
    height: 430px;
    background: #ffffff;
    margin: 0 auto;
    border-radius: 25px;
    background: rgba(255,255,255,1)
  }

  .btn-cus{
    width: 40%;
    font-size: 16px;
    border-radius: 6px;
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

  .forget-form {
    border-radius: 6px;
    //background: #ffffff;
    padding: 25px 25px 5px 25px;

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

  .verify-code {
    display: inline-block;
    margin-left: 8px;
    width: 24%;
  }

</style>
