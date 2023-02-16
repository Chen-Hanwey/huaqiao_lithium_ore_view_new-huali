export default {

  /**
   * 验证手机号
   */
  validatePhoneOrIDCard: (rule, value, callback) => {
    if(value.length === 11){
      let regx = /^((13[0-9])|(14[1|4|5|6|7|8|9])|(15([0|1|2|3|5|6|7|8|9]))|(16[2|5|6|7])|(17[0|1|2|3|5|6|7|8])|(18[0-9])|(19[1|8|9]))\d{8}$/;
      if (!regx.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    }else if(value.length === 15 || value.length === 18){
      let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      let code = value.substring(17);
      if(p.test(value)) {
        let sum = 0;
        for(let i = 0; i < 17; i++) {
          sum += value[i] * factor[i];
        }
        if(parity[sum % 11] == code.toUpperCase()) {
          callback();
        }
      }
      callback(new Error('请输入正确的身份证信息'));
    }else{
      callback(new Error('请输入正确的手机号/身份证'));
    }
  },

  /**
   * 验证密码
   */
  validatePassword: (rule, value, callback) => {
    let reg1 = /[!@#$%^&*()_?<>{}]{1}/;
    let reg2 = /([a-zA-Z0-9!@#$%^&*()_?<>{}]){8,18}/;
    let reg3 = /[a-z]+/;
    let reg4 = /[A-Z]+/;
    let reg5 = /[0-9]+/;
    if(reg2.test(value) && (reg3.test(value) || reg4.test(value)) && reg5.test(value)){
      callback();
    // }else if(!reg1.test(value)){
    //   callback(new Error("需包含一个特殊字符"));
    }else if(!reg2.test(value)){
      callback(new Error("长度在8-18位"));
    }else if(!reg3.test(value) && !reg4.test(value)){
      callback(new Error("需含有英文字母"));
    // }else if(!reg4.test(value)){
    //   callback(new Error("需含有大写字母"));
    }else if(!reg5.test(value)){
      callback(new Error("需含有数字"));
    }
  },

  /**
   * 验证手机号
   */
  validatePhone: (rule, value, callback) => {
    if (value == null || value === undefined || value === ''){
      callback();
    }
    // let regx = /^1(3|4|5|6|7|8|9)\d{9}$/;
    let regx = /^((13[0-9])|(14[1|4|5|6|7|8|9])|(15([0|1|2|3|5|6|7|8|9]))|(16[2|5|6|7])|(17[0|1|2|3|5|6|7|8])|(18[0-9])|(19[1|8|9]))\d{8}$/;
    if (!regx.test(value)) {
      callback(new Error('请输入正确的手机号'));
    } else {
      callback();
    }
  },
  /**
   * 电话或手机
   * @param rule
   * @param value
   * @param callback
   */
  validateTelephone: (rule, value, callback) => {
    if (value == null || value === undefined || value === ''){
      callback();
    }
    var telephoneReg=/([0-9]{3,4}-)?[0-9]{7,8}/;
    var mobilephoneReg=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
    if (!telephoneReg.test(value) && mobilephoneReg.test(value)) {
      callback(new Error('请填写正确的电话号码'));
    } else {
      callback();
    }
  },
  /**
   * 验证邮箱
   */
  validateEmail: (rule, value, callback) => {
    if (value == null || value === undefined || value === ''){
      callback();
    }
    let regx = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!regx.test(value)) {
      callback(new Error('请输入正确的邮箱'));
    } else {
      callback();
    }
  },
  validateIDNumber: (rule, value, callback) => {
    let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
    let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
    let code = value.substring(17);
    if(p.test(value)) {
        let sum = 0;
        for(let i = 0; i < 17; i++) {
          sum += value[i] * factor[i];
        }
        if(parity[sum % 11] == code.toUpperCase()) {
          callback();
        }
    }
    callback(new Error('请输入正确的身份信息'));
  },
  /**
   * IP
   */
  validateIP: (rule, value, callback) => {
    let regx = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (!regx.test(value)) {
      callback(new Error('请输入正确的IP地址，比如：127.0.0.1'));
    } else {
      callback();
    }
  },
  /**
   * 端口
   */
  validatePort: (rule, value, callback) => {
    let regx = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
    if (!regx.test(value)) {
      callback(new Error('请输入正确的端口号，填入0-65535范围内端口号数字'));
    } else {
      callback();
    }
  },
  /**
   * 正整数或 0
   */
  validatePositiveNumber:(rule, value, callback) => {
    let regx = /^([0]|[1-9][0-9]*)$/;
    if (!regx.test(value)) {
      callback(new Error('请输入正确的数字'));
    } else {
      callback();
    }
  },
  /**
   * 负数
   */
  validateNegativeNumber:(rule, value, callback) => {
    let regx = /^(\-)\d+?$/;
    if (!regx.test(value)) {
      callback(new Error('请输入正确的数字'));
    } else {
      callback();
    }
  },
  /**
   * 所有数字（正数、负数、小数）
   */
  validateAllNumber: (rule, value, callback) => {
    let regx = /^(\-|\+)?\d+(\.\d+)?$/;
    if (!regx.test(value)) {
      callback(new Error('请输入正确的数字'));
    } else {
      callback();
    }
  },
  /**
   * 校验版本号  xxxx.xxxx.xxxx.xxxx
   */
  validateSysVersion: (rule, value, callback) => {
    let regExp = /^\d{1,4}(\.\d{1,4}){2,3}$/;
    if (!regExp.test(value)) {
      callback(new Error('请输入正确的版本号，xxxx.xxxx.xxxx.xxxx'));
    } else {
      callback();
    }
  },
}
