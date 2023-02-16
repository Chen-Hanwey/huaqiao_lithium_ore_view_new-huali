<template>
  <div>
    <el-dialog :visible.sync="open" :close-on-click-modal="false" class="customForm _baseForm_big" @opened="openDialog">
      <div slot="title">
        <span><i class="el-icon-view"></i></span>
        <span> {{ operationType == 1 ? '审核企业资质' : '修改企业资质' }} </span>
      </div>
      <div class="foodInspection-body"></div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <base-form :readOnly="true" :operation-open="false" ref="baseForm"></base-form>
        <div class="sub-project">
          <div class="sub-title">
            <div class="sub-title-name">经营场所信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="8">
                <el-form-item v-if="operationType == 2" label="经营场所" prop="operationId"  >
                  <el-select ref="certype_ref" v-model="form.operationId" placeholder="--全部--" clearable
                             size="small"
                             class="form-item">
                    <el-option
                      v-for="o in operations"
                      :key="o.id"
                      :label="o.name"
                      :value="o.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item v-if="operationType == 1" label="经营场所：" style="padding-bottom: 10px" class="custom-form-item">
                  {{ form.operationName }}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="sub-project">

          <div class="sub-title">
            <div class="sub-title-name">企业资质信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
                <el-col :span="8">
                  <el-form-item v-if="operationType == 1" label="资质类型：" prop="certificationType"  class="custom-form-item">
                    {{ certificateTypeFormat(form) }}
                  </el-form-item>
                  <el-form-item v-if="operationType == 2" label="资质类型" prop="certificationType" >
                    <el-select ref="certype_ref" v-model="form.certificationType" placeholder="--全部--" clearable
                               size="small"
                               class="form-item">
                      <el-option
                        v-for="dict in certificationTypes"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-col :span="8">
                  <el-form-item v-if="operationType == 1" label="到期日期：" prop="expireDate"  class="custom-form-item">
                    {{ form.expireDate }}
                  </el-form-item>
                  <el-form-item v-if="operationType == 2" label="到期日期" prop="expireDate" >
                    <el-date-picker clearable size="small" class="form-item"
                                    v-model="form.expireDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择到期日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-form-item label="资质图片：" v-if="operationType == 1" prop="picture" class="custom-form-item">
                  <el-image v-if="uploadPic.pictureList1&&uploadPic.pictureList1.length==0"
                            style="min-width: 100px;min-height: 100px;margin-right: 15px">
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 100px;user-select: none">
                        暂无图片</i>
                    </div>
                  </el-image>
                  <el-image v-if="uploadPic.pictureList1&&uploadPic.pictureList1.length > 0"
                            v-for="(url,index) in uploadPic.pictureList1" :key="url" :src="url"
                            style="width: 200px;height: 200px;margin-right: 15px" fit="scale-down"
                            @click="getCurrentPreviewImg(url)"
                  >
                    <div slot="error" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                        加载失败</i>
                    </div>
                    <div slot="placeholder" class="image-slot" style="text-align: center">
                      <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                        加载中</i>
                    </div>
                  </el-image>
                </el-form-item>
                <el-form-item label="资质图片" v-if="operationType == 2" prop="picture" >
                  <el-upload :action="uploadPic.uploadImgUrl"
                             list-type="picture-card"
                             :file-list="uploadPic.pictureFileList1"
                             :on-success="certificationPicUpSuccess"
                             :on-remove="certificationPicRemove"
                             :on-preview="handlePictureCardPreview"
                             :on-error="picUploadErr"
                             :on-progress="picUpProcess"
                             :headers="uploadPic.uploadHeader"
                             :before-upload="beforePicUpload"
                             accept=".png,.jpg,.jpeg,.svg"
                  >
                    <i class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png/jpeg/svg文件，且不超过20M</div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="operationType == 1" label="备注：" prop="remark" class="custom-form-item">
                  {{form.remark}}
                </el-form-item>
                <el-form-item v-if="operationType == 2" label="备注 " style="margin-bottom: 10px" prop="remark" >
                  <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 3, maxRows: 10}"
                            placeholder="请输入内容" class="form-item"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="sub-project" >

          <div class="sub-title">
            <div class="sub-title-name">资质审核信息</div>
          </div>
          <div class="sub-body">
            <el-row>
              <el-col :span="24">
<!--                <el-form-item label="审核状态：" prop="status"-->
<!--                              class="custom-form-item">-->
<!--                  {{ certificationStatusFormat(form) }}-->
<!--                </el-form-item>-->
                <el-form-item v-if="operationType == 1" label="审核结果：" prop="status" >
                  <el-radio-group v-model="form.status">
                    <el-radio :label="'2'" >通过</el-radio>
                    <el-radio :label="'3'">不通过</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审核结果：" prop="status" v-if="operationType == 2"
                              class="custom-form-item">
                  {{ form.status == 1 ? '待审核' : form.status == 2 ? '通过' : '不通过' }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="operationType == 1" label="审核意见："  prop="verifyRemark" >
                  <el-input style="margin-top: 5px" v-model="form.verifyRemark" type="textarea" resize="none"
                            :autosize="{ minRows: 3, maxRows: 10}"
                            placeholder="" class="form-item"/>
                </el-form-item>
                <el-form-item label="审核意见：" prop="verifyRemark" v-if="operationType == 2"
                              class="custom-form-item">
                  {{ form.verifyRemark }}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <processList v-if="operationType == 1" :wfOrderType="2" :wfOrderEntityId="form.id"></processList>
      </el-form>
      <div slot="footer" class="dialog-footer">
<!--        <div >-->
<!--          <el-button type="primary" @click="audit('2')">通 过</el-button>-->
<!--          <el-button type="danger" @click="audit('3')">不通过</el-button>-->
<!--        </div>-->
        <div >
          <el-button v-if="operationType == 1" type="primary" @click="audit">确 定</el-button>
          <el-button v-if="operationType == 2" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </div>

      <el-dialog :visible.sync="uploadPic.picDialogVisible" :close-on-click-modal="false" append-to-body>
        <div slot="title">
          <span><i class="el-icon-picture"></i></span>
          <span>图片查看</span>
        </div>
        <img width="100%" height="100%" :src="uploadPic.picDialogImageUrl" alt="">
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
import {add, audit, getInfo, update} from "@/api/certification/certification";
import {listOperationManage} from "@/api/operationManage/operationManage";
import processList from "@/views/components/todoComponents/processList";
import {countMyWfOrder} from "@/api/myWork/wfOrder";

export default {
  name: "certificateAudit",
  components:{processList},
  props: {},
  data(){
    return {
      operations: [],
      operationType: 1, // 1 审核  2 修改
      open: false,
      form: {},
      rules: {
        certificationType: [
          { required: true, message: "资质类型不能为空", trigger: "change" }
        ],
        expireDate: [
          { required: true, message: "到期日期不能为空", trigger: "change" }
        ],
        picture: [
          { required: true, message: "资质图片不能为空", trigger: "change" }
        ],
        status: [
          { required: true, message: "请选择审核结果", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value == 1){
                callback(new Error('请选择审核结果'))
              }else {
                callback()
              }
            },
            trigger: "blur"
          }
        ],
        verifyRemark: [
          { required: true, message: "审核意见不能为空", trigger: "change" },
        ]
      },
      certificationTypes: [], //资质类型
      certificationStatus: [],
      uploadPic:{
        uploadImgUrl: process.env.VUE_APP_PICTURE_UPLOAD_PATH,
        uploadHeader: { Authorization: 'Bearer ' + getToken() },
        picDialogVisible:false,
        picDialogImageUrl:undefined,
        pictureList1:[],
        pictureFileList1:[],
        pictureList2:[],
        pictureFileList2:[]
      },
    }
  },
  methods: {
    cancel(){
      this.open = false
      this.reset()
    },
    // 状态字典翻译
    certificationStatusFormat(row, column) {
      return this.selectDictLabel(this.certificationStatus, row.status);
    },
    openDialog(){},
    getInfo(id,operationType){
      this.operationType = operationType
      if (!id){
        this.$message.info('获取id失败')
        return
      }
      this.reset()
      getInfo(id).then(response => {
        if (!response.data){
          this.$message.info('获取信息失败')
        }
        this.open = true
        this.form = response.data;
        this.uploadPic.pictureList1 = handlePicturePath(this.form.picture);
        this.uploadPic.pictureFileList1 = handleFileList(this.uploadPic.pictureList1);
        this.$nextTick(function () {
          this.$refs.baseForm.initBaseFormByEnterpriseId(response.data.enterpriseId)
        })
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        picture: undefined,
        enterpriseId: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        remark: undefined,
      };
      this.uploadPic.pictureList1=[];
      this.uploadPic.pictureFileList1=[];
      this.resetForm("form");
    },
    // 资质类型字典翻译
    certificateTypeFormat(row, column) {
      return this.selectDictLabel(this.certificationTypes, row.certificationType);
    },
    audit(){
      const id = this.form.id;
      const body = {"id": id,"verifyRemark": this.form.verifyRemark,"res": this.form.status}
      this.$refs["form"].validate(valid => {
        if (!valid){
          return
        }
        audit(body).then(result => {
          if (result.code == 200) {
            this.msgSuccess("审核成功");
            this.open = false;
            this.$parent.getList();
            countMyWfOrder().then(res=> {
              if (res.code == 200){
                this.$store.dispatch('app/setTodoNum', res.data);
              }
            });
          } else {
            this.msgError("审核失败: " + result.msg);
          }
        })
      })
    },
    submitForm: function() {
      console.log(111)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            // if (this.operationType == 4){  //审核
            //   this.audit()
            //   return
            // }
            update(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.$parent.getList();
                countMyWfOrder().then(res=> {
                  if (res.code == 200){
                    this.$store.dispatch('app/setTodoNum', res.data);
                  }
                });
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    openOff(){
      this.open = !this.open
    },
  },
  created() {
    this.getDicts("certification_type").then(response => {
      this.certificationTypes = response.data;
    });
    this.getDicts("certification_status").then(response => {
      this.certificationStatus = response.data;
    });
    if (this.$store.getters.enterpriseId){
      listOperationManage({enterpriseId: this.$store.getters.enterpriseId}).then(res=> {
        this.operations = res.rows
      })
    }
  },

}
</script>

<style scoped>

</style>
