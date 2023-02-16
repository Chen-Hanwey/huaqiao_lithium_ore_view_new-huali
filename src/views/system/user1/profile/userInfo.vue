<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px" style="height: 350px">
    <el-row>
<!--      <el-col :span="24">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName"/>
        </el-form-item>
      </el-col>-->
      <el-col :span="24">
        <el-form-item label="工作单位" prop="deptId">
          <treeselect v-model="user.deptId" :options="deptOptions" placeholder="请选择工作单位"
                      class="treeselect"/>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="居住社区" prop="committee">
          <treeselect v-model="user.committee" :options="districtList" placeholder="请选择居住社区"  :disable-branch-nodes="true"
                      :show-count="true" class="treeselect"/>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="姓名" prop="nickName">
          <el-input v-model="user.nickName"/>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="手机号码" prop="phonenumber">
          <el-input v-model="user.phonenumber" maxlength="11"/>
        </el-form-item>
      </el-col>

      <!--<el-col :span="24">
        <el-form-item label="" prop="isSecret">
          <el-radio-group v-model="user.isSecret" size="medium">
            <el-radio label="0">保密</el-radio>
            <el-radio label="1">公开</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>-->

      <el-col :span="24">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="user.email" maxlength="50"/>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="user.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item style="text-align: center;">
      <el-button type="primary" size="large" @click="submit">保存</el-button>
      <el-button size="large" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserProfile } from '@/api/system/user'
import { treeselect } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {treeDistrict} from '@/api/system/district'

export default {
  props: {
    user: {
      type: Object
    },
    fullTimeEducationOptions: {
      type: Array,
      default: () => []
    }
  },
  components: { Treeselect },
  data() {
    return {
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: '\'请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
        /*deptId: [
          { required: true, message: '工作单位不能为空', trigger: 'change' }
        ],*/
        committee: [
          { required: true, message: '居住社区不能为空', trigger: 'change' }
        ]
      },
      deptOptions: [],
      districtList: []
    }
  },
  created() {
    this.getDeptTreeSelect()
    this.getDistrictList()
  },
  methods: {
    getDistrictList(){
      let params = {}
      params.code = '511302'
      treeDistrict(params).then(res => {
        if(res.code === 200){
          this.districtList = res.data;
        }
      })
    },
    getDeptTreeSelect() {
      treeselect({}).then(response => {
        this.deptOptions = response.data
      })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            if (response.code === 200) {
              this.msgSuccess('修改成功')
              this.close();
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    close() {
      /*this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/index' })*/
      this.$emit("closeDialog");
    }
  }
}
</script>

<style>
.treeselect .vue-treeselect__menu {
  max-height: 250px !important;
}
</style>
