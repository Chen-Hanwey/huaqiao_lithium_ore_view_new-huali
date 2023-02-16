export default {
  /**
   * 验证电话或手机
   * @param rule
   * @param value
   * @param callback
   */
  validateTeleAndMobilePhone: (rule, value, callback,errorTitle) => {
    if (value == null || value === undefined || value === ''){
      callback();
    }
    let telephoneReg=/([0-9]{3,4}-)?[0-9]{7,8}/;
    let mobilephoneReg=/^[1]([3-9])[0-9]{9}$/;
    // let newmobilephoneReg = /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])d{8}$/
    if (!telephoneReg.test(value) || !mobilephoneReg.test(value)) {
      if(!errorTitle){
        errorTitle = '请填写正确的电话号码'
      }
      callback(new Error(errorTitle));
    } else {
      callback();
    }
  },


  validIdCard: (rule, value, callback, errorTitle) => {

    // 加权因子
    var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    var code = value + "";
    var last = value[17];//最后一位

    var seventeen = code.substring(0, 17);

    // ISO 7064:1983.MOD 11-2
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for (var i = 0; i < len; i++) {
      num = num + arr[i] * weight_factor[i];
    }

    var resisue = num % 11;
    var last_no = check_code[resisue];

    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    var format = idcard_patter.test(value);
    if ((last === last_no && format) == true) {
      return callback();
    } else {
      if(!errorTitle){
        errorTitle = '请填写正确的身份证号'
      }
      callback(new Error(errorTitle));
    }
  }

}
