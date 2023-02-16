<template>
  <div ref="profileInfo" class="app-container" style="overflow-y: auto;">
    <el-card :style="{height: cardHeight}">
      <el-tabs class="indexTab1" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人主页" name="first">
          <div style="overflow-y: auto;" :style="{height: contentHeight}">
            <div style="text-align: right;padding-right: 20px">
              <el-button type="primary" @click="updateUser">修改</el-button>
            </div>
            <el-form ref="form" label-width="100px">
              <div class="sub-project" style="padding: 0px 20px 0 0;">
                <div class="sub-title">
                  <div class="sub-title-name">基本信息</div>
                </div>
                <div class="sub-body">
                  <el-row>
                    <el-col :span="18">
                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="用户名：" class="custom-form-item">
                            {{user.userName}}
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="姓名：" class="custom-form-item">
                            {{user.nickName}}
                          </el-form-item>
                        </el-col>

                      </el-row>

                      <el-row>
                        <el-col :span="8">
                          <el-form-item label="电子邮箱："  class="custom-form-item">
                            {{user.email}}
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item label="联系电话：" class="custom-form-item">
                            {{user.phonenumber}}
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :span="6">
                      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
                        <userAvatar :user="user" />
                      </div>
                    </el-col>
                  </el-row>

                </div>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      title="修改用户基本信息/重置密码"
      :visible.sync="open"
      width="800px" :before-close="cancel"
      >
      <el-tabs v-model="activeTab" class="indexTab1" >
        <el-tab-pane label="基本信息" name="userinfo">
          <userInfo :user="user" :fullTimeEducationOptions="fullTimeEducationOptions"  v-if="open"/>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="resetPwd">
          <resetPwd :user="user"  v-if="open"/>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
  import profile from './profile';
  export default {
    ...profile
  }
</script>

<style>
  .indexTab1 .el-tabs__active-bar {
    background-color: #409EFF;
  }
  .indexTab1 .el-tabs__item{
    font-size: 16px;
  }
</style>
