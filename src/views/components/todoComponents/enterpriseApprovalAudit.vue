<template>
  <el-dialog :visible.sync="visible" v-if="visible"
             append-to-body class="_baseForm_big"
             :before-close="close" :close-on-click-modal="false">
    <div slot="title">
      <span><i class="el-icon-share"></i></span>
      <span> {{ title }}</span>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <div class="sub-project">
        <div class="sub-title">
          <div class="sub-title-name">申请信息</div>
        </div>
        <div class="sub-body">
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业名称：" prop="name" class="custom-form-item">
                <!--                  <div class="text-oneLine" :title="form.name">{{ form.name }}</div>-->
                <div :title="form.name">{{ form.name }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业负责人：" prop="principal" class="custom-form-item">
                {{ form.principal }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人联系方式：" prop="principalPhone" class="custom-form-item">
                {{ form.principalPhone }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业法人：" prop="legalPerson" v-if="readOnly" class="custom-form-item">
                {{ form.legalPerson }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人身份证号：" prop="legalPersonIdcard" class="custom-form-item">
                {{ form.legalPersonIdcard }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人联系方式：" prop="legalPersonPhone" class="custom-form-item">
                {{ form.legalPersonPhone }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="信用代码：" prop="creditCode" class="custom-form-item">
                {{ form.creditCode }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业邮箱：" prop="email" class="custom-form-item">
                {{ form.email }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="sub-project" v-if="!readOnly">
        <div class="sub-title">
          <div class="sub-title-name">审批信息</div>
        </div>
        <div class="sub-body">
          <el-row v-if="form.wfOrderStatus=='2'">
            <el-col :span="12">
              <el-form-item label="管辖单位" :key="supervisionDeptId" prop="supervisionDeptId" v-if="!readOnly">
                <treeselect v-model="form.supervisionDeptId" :disable-branch-nodes="true" :options="deptOptions"
                            placeholder="请选择管辖单位" style="height: 33px;"/>
              </el-form-item>
              <el-form-item label="管辖单位：" prop="supervisionDeptId" v-if="readOnly" class="custom-form-item">
                {{ form.supervisionDeptName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="systemUserName" v-if="!readOnly">
                  <span slot="label">
                    <span class="span-box">
                      <span>企业账号</span>
                      <el-tooltip style="display: inline" effect="dark" placement="top">
                        <div slot="content">
                                  <span>相关账号会在企业账号管理中自动创建</span><br/>
                                　<span>建议由字母、数字、下划线等组成</span><br/>
                                　<span>如qy_1</span>
                            </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>
                  </span>
                <el-input v-model="form.systemUserName" placeholder="请输入系统关联账号"/>
              </el-form-item>
              <el-form-item prop="systemUserName" v-if="readOnly">
                  <span slot="label">
                    <span class="span-box">
                      <span>企业账号</span>
                      <el-tooltip style="display: inline" effect="dark" placement="top">
                        <div slot="content">
                                  <span>相关账号会在企业账号管理中自动创建</span><br/>
                                　<span>建议由字母、数字、下划线等组成</span><br/>
                                　<span>如qy_1</span>
                            </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </span>：
                  </span>
                {{ form.systemUserName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="审批结果" prop="wfOrderStatus">
              <el-radio-group v-model="form.wfOrderStatus">
                <el-radio :label="'2'">通过</el-radio>
                <el-radio :label="'3'">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审批意见" prop="approveDescription">
                <el-input v-model="form.approveDescription" type="textarea" :autosize="{ minRows: 3, maxRows: 10}"
                          placeholder="请输入审批意见"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <processList  :wfOrderType="wfOrderType" :wfOrderEntityId="enterpriseId"></processList>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <template v-if="readOnly==false">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </template>
      <template v-if="readOnly==true">
        <el-button @click="close">关 闭</el-button>
      </template>
    </div>
  </el-dialog>
</template>
<script>
import { auditEnterprise, getEnterprise } from '@/api/enterprise/enterprise'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { treeselect } from '@/api/system/dept'
import processList from '@/views/components/todoComponents/processList'
import {countMyWfOrder} from "@/api/myWork/wfOrder";

export default {
  name: 'enterpriseApprovalAudit',
  components: { Treeselect, processList },
  props: {},
  data() {
    return {
      visible: false,
      form: {},
      readOnly: false,
      wfOrderStatus: undefined,
      wfOrderType:1,
      enterpriseId: undefined,
      title: '',
      // 表单校验
      rules: {
        wfOrderStatus: [
          { required: true, message: '审批结果为必选项', trigger: 'change' }
        ],
        systemUserName: [
          { required: true, message: '企业账号不能为空', trigger: 'blur' }
        ],
        supervisionDeptId: [
          { required: true, message: '管辖单位不能为空', trigger: 'change' }
        ],
        approveDescription: [
          { required: true, message: '审批意见不能为空', trigger: 'change' }
        ]
      },
      deptOptions: []
    }
  },
  created() {
    this.getDeptTreeSelect()
  },
  beforeMount() {
  },
  mounted() {
  },
  computed: {},
  methods: {
    close() {
      this.visible = false
    },
    getDeptTreeSelect() {
      treeselect({}).then(response => {
        this.deptOptions = response.data
      })
    },
    /**
     * 初始化表单
     */
    init(enterpriseId, readOnly, wfOrderStatus,title) {
      this.enterpriseId = enterpriseId;
      this.readOnly = readOnly
      this.wfOrderStatus = wfOrderStatus
      this.title = title;
      getEnterprise(enterpriseId).then(response => {
          let data = response.data;
          if (this.wfOrderStatus != 2) {
            data.supervisionDeptId = undefined
            data.supervisionDeptName = undefined
            data.systemUserName = undefined
          }
          this.form = data
          this.visible = true
          this.form.wfOrderStatus = '2'
          if (!this.readOnly) {
            this.form.systemUserName = 'qy_' + this.form.principalPhone
          }
        }
      )
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let that = this
          auditEnterprise(this.form).then(response => {
            if (response.code === 200) {
              this.$alert(response.msg, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  that.visible = false
                  that.$emit('submit')
                  countMyWfOrder().then(res=> {
                    if (res.code == 200){
                      that.$store.dispatch('app/setTodoNum', res.data);
                    }
                  });
                }
              })
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    // 取消按钮
    cancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
.form-item {
  width: 100%;
}

/deep/ .vue-treeselect--single .vue-treeselect__input-container {
  height: 30px;
}

/deep/ .vue-treeselect__control {
  height: 32px;
}

/deep/ .vue-treeselect--searchable .vue-treeselect__input-container {
  padding-left: 10px;
  padding-right: 10px;
}

/deep/ .vue-treeselect__single-value {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 13px;
}

/deep/ .vue-treeselect__placeholder {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 13px;
}
</style>

