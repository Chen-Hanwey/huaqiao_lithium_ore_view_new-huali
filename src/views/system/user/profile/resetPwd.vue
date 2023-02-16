<template>
  <div class="app-container" style="padding: 30px 25%;">
    <div style="text-align: center; padding: 20px 0;"><span>注意：密码至少包含大写字母、小写字母、数字，长度在8-18位之间</span></div>
    <el-form ref="form" :model="user" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" />
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" size="small" @click="submit">保存</el-button>
        <el-button type="danger" size="small" @click="close">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";
import { getPublicKeyPermi } from '@/api/login'
import { encryptDataArray } from '@/utils/ecdh';
import regexp from '@/api/regexp/regexp'

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      test: "1test",
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            validator: regexp.validatePassword,
            trigger: 'blur'
          }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      },
      username:　this.$store.state.user.name
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          getPublicKeyPermi(this.username).then(res => {
            if(res.code === 200){
              let en_data = [this.user.oldPassword, this.user.newPassword];
              let result = encryptDataArray(res.data, en_data);
              let aes_password = result.encryptedData;

              updateUserPwd(aes_password[0], aes_password[1], result.clientKey).then(
                response => {
                  if (response.code === 200) {
                    this.msgSuccess("修改成功");
                    this.close();
                  } else {
                    this.msgError(response.msg);
                  }
                }
              );
            }
          });
        }
      });
    },
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/index" });
    }
  }
};
</script>
