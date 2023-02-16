<template>
  <div ref="profileInfo" class="app-container" style="overflow-y: auto;">
    <el-card :style="{height: cardHeight}">
      <div style="overflow-y: auto;" :style="{height: contentHeight}">
<!--        <div style="text-align: right;padding-right: 20px">
          <el-button type="primary" @click="updateUser">修改</el-button>
        </div>-->
        <el-form ref="form" label-width="100px">
          <div class="sub-project" style="padding: 0px 20px 0 0;">
            <div class="sub-title">
              <div class="sub-title-name">个人信息</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="18">
                  <el-row>
<!--                    <el-col :span="12">
                      <el-form-item label="用户名：" class="custom-form-item">
                        {{ user.userName }}
                      </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                      <el-form-item label="用户名：" class="custom-form-item">
                        {{ user.nickName }}
                      </el-form-item>
                    </el-col>
<!--                    <el-col :span="12">
                      <el-form-item label="联系电话：" class="custom-form-item">
                        {{ user.phonenumber }}
                      </el-form-item>
                    </el-col>-->
                    <el-col :span="12">
                      <el-form-item label="工作单位：" class="custom-form-item">
                        {{ user.deptName }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="所属企业：" class="custom-form-item">
                        {{ user.enterpriseName }}
                      </el-form-item>
                    </el-col>
<!--                    <el-col :span="12">
                      <el-form-item label="身份证号：" class="custom-form-item">
                        {{ user.idCard }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="电子邮箱：" class="custom-form-item">
                        {{ user.email }}
                      </el-form-item>
                    </el-col>-->
<!--                    <el-col :span="12">
                      <el-form-item label="性别：" class="custom-form-item">
                        {{ sexFormatter(user) }}
                      </el-form-item>
                    </el-col>-->
                  </el-row>
                </el-col>
                <el-col :span="6">
                  <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                    <!--<img :src="perPmBase.photo" style="width: 100px;height: 100px;border-radius: 50%" v-if="perPmBase.photo!=null && perPmBase.photo!=''">
                    <img src="../../../../assets/image/partybase/nophoto.png" style="width: 100px;height: 100px;border-radius: 50%" v-else>
                    <div><span style="font-size: 12px;cursor: pointer;" @click="">点击上传头像</span></div>-->
                    <userAvatar :user="user"/>
                    <!--                        <div><span style="font-size: 12px;">点击上传头像</span></div>-->
                  </div>
                </el-col>
              </el-row>

            </div>
            <!--<div class="sub-title">
              <div class="sub-title-name">详细信息</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="婚姻状况："  class="custom-form-item">
                    <span v-for="dict in maritalStatusOptions">
                      <span v-if="dict.dictValue == perPmBase.maritalStatus">{{dict.dictLabel}}</span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="工作时间："  class="custom-form-item">
                    {{perPmBase.workingTime}}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工作单位："  class="custom-form-item">
                    {{perPmBase.workingUnit}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="籍贯："  class="custom-form-item">
                      <span v-for="dict in formPofProvinceList">
                        <span v-if="dict.code == perPmBase.pofProvince">{{dict.name}}</span>
                      </span>
                      <span v-for="dict in formPofCityList">
                        <span v-if="dict.code == perPmBase.pofCity">{{dict.name}}</span>
                      </span>
                      <span v-for="dict in formPofDistrictList">
                        <span v-if="dict.code == perPmBase.pofCounty">{{dict.name}}</span>
                      </span>
                      <span>{{perPmBase.pofDetail}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="现居住地："  class="custom-form-item">
                      <span v-for="dict in formProvinceList">
                        <span v-if="dict.code == perPmBase.nowProvince">{{dict.name}}</span>
                      </span>
                      <span v-for="dict in formCityList">
                        <span v-if="dict.code == perPmBase.nowCity">{{dict.name}}</span>
                      </span>
                      <span v-for="dict in formDistrictList">
                        <span v-if="dict.code == perPmBase.nowCounty">{{dict.name}}</span>
                      </span>
                      <span>{{perPmBase.nowDetail}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注：">
                    {{perPmBase.perRemark}}
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="sub-title">
              <div class="sub-title-name">党籍信息</div>
            </div>
            <div class="sub-body">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="人员类别：" class="custom-form-item">
                    <span v-for="dict in politicalStatusOptions">
                      <span v-if="dict.dictValue == perPmBase.politicalStatus">{{dict.dictLabel}}</span>
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="所在支部：" class="custom-form-item">
                    {{perPmBase.rePartyOrgName}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="党内职务：" class="custom-form-item">
                      <span v-for="dict in postOptions">
                        <span v-if="dict.dictValue == perPmBase.post">{{dict.dictLabel}}</span>
                      </span>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="入党时间：">
                    {{perPmBase.joinTime}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="转正时间：">
                    {{perPmBase.fullMemberTime}}
                  </el-form-item>
                </el-col>
                <el-col :span="8"></el-col>
              </el-row>
            </div>-->
          </div>
        </el-form>
      </div>
      <!--<el-tabs class="indexTab1" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人主页" name="first">

        </el-tab-pane>

        <el-tab-pane label="日常操作" name="second">
          <div style="overflow-y: auto;" :style="{height: contentHeight}">
            <dailyOperation :perPmBase="perPmBase"></dailyOperation>
          </div>
        </el-tab-pane>
        <el-tab-pane label="他人操作" name="third">
          <div style="overflow-y: auto;" :style="{height: contentHeight}" v-if="contentHeightV > 0">
            <othersOperation :contentHeight="contentHeightV" v-show="contentHeightV > 0"></othersOperation>
          </div>
        </el-tab-pane>
        <el-tab-pane label="党员汇报" name="fourth">
          <div style="overflow-y: auto;overflow-x: hidden" :style="{height: contentHeight}" v-if="contentHeightV > 0">
            <partyReport :contentHeight="contentHeightV" v-show="contentHeightV > 0"></partyReport>
          </div>
        </el-tab-pane>-->
        <!--<el-tab-pane label="思想汇报" name="fourth">
          <div style="overflow-y: auto;overflow-x: hidden" :style="{height: contentHeight}" v-if="contentHeightV > 0">
            <throughtReport :contentHeight="contentHeightV" v-show="contentHeightV > 0"></throughtReport>
          </div>
        </el-tab-pane>
        <el-tab-pane label="个人承诺" name="fifth">
          <div style="overflow-y: auto;overflow-x: hidden" :style="{height: contentHeight}" v-if="contentHeightV > 0">
            <memberPromise :contentHeight="contentHeightV" v-show="contentHeightV > 0"></memberPromise>
          </div>
        </el-tab-pane>
      </el-tabs>-->
    </el-card>
    <el-dialog
      title="修改"
      :visible.sync="open"
      width="600px" :before-close="cancel"
    >
      <el-tabs v-model="activeTab" class="indexTab1">
        <el-tab-pane label="基本信息" name="userinfo">
          <user-info :user="user" :fullTimeEducationOptions="fullTimeEducationOptions" v-if="open" @closeDialog="cancel"/>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="resetPwd">
          <reset-pwd-comp :user="user" v-if="open" @closeDialog="cancel"/>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
import profile from './profile'

export default {
  ...profile
}
</script>

<style>
.indexTab1 .el-tabs__active-bar {
  background-color: #409EFF;
}

.indexTab1 .el-tabs__item {
  font-size: 16px;
}
</style>
