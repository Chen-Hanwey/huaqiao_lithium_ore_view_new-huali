<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-row>
      <el-form-item label="姓名" prop="nickName">
        <el-input v-model="user.nickName" />
      </el-form-item>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="user.phonenumber" maxlength="6" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="" prop="isSecret">
          <el-radio-group v-model="user.isSecret" size="medium">
            <el-radio label="0">保密</el-radio>
            <el-radio label="1">公开</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>

    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" maxlength="50" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="user.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="学历" prop="fullTimeEducation">
          <el-select v-model="user.fullTimeEducation" placeholder="请选择学历" style="width: 300px;"
                      class="customSelect">
            <el-option
              v-for="dict in fullTimeEducationOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="毕业院校" prop="graduateUniversity">
          <el-input v-model="user.graduateUniversity" placeholder="请输入毕业院校" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>

    </el-row>

    <el-form-item>
      <el-button type="primary" size="small" @click="submit">保存</el-button>
<!--      <el-button type="danger" size="small" @click="close">关闭</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";

export default {
  props: {
    user: {
      type: Object
    },
    fullTimeEducationOptions:{
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        fullTimeEducation:[
          { required: true, message: "学历不能为空", trigger: "change" }
        ]
      },
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
            } else {
              this.msgError(response.msg);
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
