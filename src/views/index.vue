<template>
  <div class="dashboard-editor-container">
    <!-- 查看系统升级日志对话框 -->
    <el-dialog :visible.sync="UpgradeLogOpen" style=";margin-top: 150px" :close-on-click-modal="false"
               class="customForm" @opened="openDialog">
      <div slot="title">
        <span> 升级公告</span>
      </div>
      <div class="title"><span class="name">系统名称：</span>{{ NerUpgradeLog.sysName }}</div>
      <div class="title"><span class="name">系统版本：</span>{{ NerUpgradeLog.sysVersion }}</div>
      <div class="title">
        <span class="name">更新内容：</span>
        <span
          style="word-break:normal; width:auto; display:block; white-space:pre-wrap; word-wrap : break-word ; overflow: hidden ;">{{
            NerUpgradeLog.upgradeContent
          }}</span>
      </div>
      <div class="title"><span class="name">更新日期：</span>{{ NerUpgradeLog.upgradeDate }}</div>
    </el-dialog>
    <el-row :gutter="12">
      <el-col :span="17">
        <div class="card_shadow" style="height: 200px">
          <div class="card_title_index"><img class="icon" src="../assets/images/home/快捷入口.png"><span>快捷入口</span></div>
          <div class="card_content link-box">
            <div class="vert-half-party">
              <div class="link-item" v-if="userType != '01'">
                <router-link to="/ProcessSup/everyDay/killProcessSupervise">
                  <img src="../assets/image/index/dataV.png">
                  <p>消杀记录</p>
                </router-link>
              </div>
              <div class="link-item" v-if="supervisionType == 1 ||supervisionType == 2 ||supervisionType == 3">
                <router-link to="/Home/bigScreen" v-if="supervisionType == 1 ">
                  <img src="../assets/image/index/dataV.png">
                  <p>监管驾驶舱</p>
                </router-link>
                <router-link to="/Home/bigScreen2" v-if="supervisionType == 2 ">
                  <img src="../assets/image/index/dataV.png">
                  <p>教育驾驶舱</p>
                </router-link>
                <router-link to="/Home/bigScreen3" v-if="supervisionType == 3 ">
                  <img src="../assets/image/index/dataV.png">
                  <p>商务驾驶舱</p>
                </router-link>
              </div>

              <div class="link-item" v-if="userType != '03'">
                <router-link to="/EnterpriseManage/enterprise">
                  <img src="../assets/image/index/vote.png">
                  <p>经营主体</p>
                </router-link>
              </div>
              <div class="link-item"  v-if="userType != '03'">
                <router-link to="/EnterpriseManage/certification">
                  <img src="../assets/image/index/zongzhi.png">
                  <p>企业资质</p>
                </router-link>
              </div>
              <div class="link-item">
                <router-link to="/EnterpriseManage/operationManage">
                  <img src="../assets/image/index/bangfu.png">
                  <p>经营场所</p>
                </router-link>
              </div>
              <div class="link-item">
                <router-link to="/EnterpriseManage/kitchenPerson">
                  <img src="../assets/image/index/common.png">
                  <p>从业人员</p>
                </router-link>
              </div>
              <div class="link-item">
                <router-link to="/processSup/institutional/exerciseRecord">
                  <img src="../assets/image/index/comp.png">
                  <p>演练记录</p>
                </router-link>
              </div>
              <div class="link-item">
                <router-link to="/processSup/everyDay/morningCheck">
                  <img src="../assets/image/index/customize.png">
                  <p>晨检记录</p>
                </router-link>
              </div>
              <div class="link-item" v-if="userType != '03'">
                <router-link to="/video/openHall/play">
                  <img src="../assets/image/index/video.png">
                  <p>视频查看</p>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <el-row :gutter="12">

          <el-col :span="24">
            <div class="card_shadow">
              <el-tabs type="border-card">
                <el-tab-pane style="height: 100%">
                  <div slot="label" style="display:flex;justify-content: center;align-items: center;color: #333333">
                    <img class="icon" src="../assets/images/home/我的待办.png"
                         style="width: 20px;height: 20px"><span style="font-weight: 600;">我的待办</span>
                  </div>
                  <div class="card_content finish-box">
                    <todoWork></todoWork>
                  </div>
                  <!--                  <span slot="label"><i class="el-icon-date"></i> 我的代办</span>-->
                </el-tab-pane>
                <el-tab-pane>
                  <div slot="label" style="display:flex;justify-content: center;align-items: center;color: #333333">
                    <img class="icon" src="../assets/images/home/我的已办.png" style="width: 20px;height: 20px">
                    <span style="font-weight: 600;">我的已办</span>
                  </div>
                  <!--                  <span slot="label"><i class="el-icon-date"></i> 我的已办</span>-->
                  <div class="card_content finish-box">
                    <doneWork></doneWork>
                    <!--                    <el-table :data="detailsList" :height="'calc(100% - 30px)'">-->
                    <!--                      <el-table-column label="工单编号" prop="no" align="left"/>-->
                    <!--                      <el-table-column label="事件分类" prop="type" align="left"/>-->
                    <!--                      <el-table-column label="最后处理环节" prop="step" align="left"/>-->
                    <!--                    </el-table>-->
                  </div>
                </el-tab-pane>
              </el-tabs>
              <!--              <div class="card_title_index"><img class="icon" src="../assets/images/home/我的已办.png"><span>我的已办</span>-->
              <!--              </div>-->
              <!--              <div class="card_content finish-box">-->
              <!--                <el-table :data="detailsList" :height="'calc(100% - 30px)'">-->
              <!--                  <el-table-column label="工单编号" prop="no" align="left"/>-->
              <!--                  <el-table-column label="事件分类" prop="type" align="left"/>-->
              <!--                  <el-table-column label="最后处理环节" prop="step" align="left"/>-->
              <!--                </el-table>-->
              <!--              </div>-->
            </div>
          </el-col>

          <!--          <el-col :span="12">-->
          <!--            <div class="card_shadow">-->
          <!--              <div class="card_title_index"><img class="icon" src="../assets/images/home/告警.png"><span>预警信息</span></div>-->
          <!--              <div class="card_content meeting-box">-->
          <!--                <missing-record></missing-record>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </el-col>-->
        </el-row>
      </el-col>


      <el-col :span="7">
        <el-row>
          <el-col :span="24">
            <div class="card_shadow" style="overflow:hidden;height: 200px">
              <div class="card_title_index">
                <img class="icon" src="../assets/images/home/通知公告.png"> <span>通知公告</span>
                <!--            <router-link to="/System/notice_user" style="position:absolute;right: 10px;">
                              <el-link href="" type="primary">更多>></el-link>
                            </router-link>-->
              </div>
              <div class="card_content notice-box">
                <!--            <div class="el-table el-table&#45;&#45;enable-row-hover el-table&#45;&#45;medium">-->
                <notice></notice>
                <!--            </div>-->
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="card_shadow">
          <div class="card_title_index"><img class="icon" src="../assets/images/home/告警.png"><span>AI告警</span></div>
          <div class="card_content alarm-box-1" style="padding-top: 10px">
            <router-link v-for="(item, index) in incidentSum"
                         :to="`/Video/aiAlarm/appear?type=${incidentType[item.dictLabel]}`">
              <div class="alarm-box-item" :class="index % 2 == 1? 'ml-20' : ''"
                   :style="{'background-image': 'url('+item.bgImage+')'}">
                <img :src="item.iconUrl">
                <div class="event-content">
                  <p class="value">{{ alertNum(item.dictLabel) }}</p>
                  <p>{{ item.dictLabel }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import $ from "jquery";
import Notice from "./system/notice/homepage";
import {todoTypes} from "@/api/myWork/wfOrder";
import {countNumByAlertType} from "@/api/arithEvent/arithEvent";
import missingRecord from "@/views/inspectPanel/missRecord";
import doneWork from "@/views/myWork/doneWork/index_block";
import todoWork from "@/views/myWork/todoWork/index_block";

export default {
  name: 'Index',
  components: {Notice, missingRecord, doneWork,todoWork},
  data() {
    return {
      userType: this.$store.getters.userType,
      detailsList: [
        {
          no: 582501,
          type: '事件告警',
          step: '事件告警提交'
        },
        {
          no: 582502,
          type: '事件告警',
          step: '事件告警提交'
        },
        {
          no: 582503,
          type: '事件告警',
          step: '事件告警提交'
        }
      ],
      NerUpgradeLog: {},
      UpgradeLogOpen: false,
      quickNavSetting: false,
      noticeOpen: false,
      noticeTypeOptions: [],
      statusOptions: [],
      noticeForm: {},
      meetingTotal: {
        total: 0,
        value: 0,
        name: ''
      },
      //支部党员大会
      zbdyMeetingData: {
        total: 0,
        value: 0,
        name: ''
      },
      //支部委员会
      zbwyMeetingData: {
        total: 0,
        value: 0,
        name: ''
      },
      //党小组会
      dxzMeetingData: {
        total: 0,
        value: 0,
        name: ''
      },
      //党课
      dkMeetingData: {
        total: 0,
        value: 0,
        name: ''
      },
      noticeList: [],
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceCode: null,
        action: null
      },
      // 事件接收表格数据
      receiveList: [],
      toDoList: [],
      doneListQueryParams: {
        pageNum: 1,
        pageSize: 100,
        procInstId: undefined
      },
      // 能力类型字典
      incidentTypeOptions: [],
      timers: [],
      //自定义快捷入口
      customerQuickNavs: [],
      menuOptions: [],
      //代办汇总
      todoSum: {},
      //告警汇总
      typeOptions: [],
      incidentSum: [
        {
          dictLabel: "打手机识别",
          iconUrl: require("../assets/images/home/ai/手机.png"),
          bgImage: require("../assets/images/home/ai/手机1.png"),
        },
        {
          dictLabel: "厨师工帽",
          iconUrl: require("../assets/images/home/ai/工帽.png"),
          bgImage: require("../assets/images/home/ai/工帽1.png"),
        },
        {
          dictLabel: "口罩佩戴",
          iconUrl: require("../assets/images/home/ai/口罩.png"),
          bgImage: require("../assets/images/home/ai/森林防护.png"),
        },
        {
          dictLabel: "鼠患检测",
          iconUrl: require("../assets/images/home/ai/老鼠.png"),
          bgImage: require("../assets/images/home/ai/重点人群.png"),
        },
        {
          dictLabel: "抽烟识别",
          iconUrl: require("../assets/images/home/ai/抽烟.png"),
          bgImage: require("../assets/images/home/ai/抽烟1.png"),
        },
      ],
      incidentType: [],
      incidentRouterLinkBasePath: '/EnvironmentMonitor/incident/incident/area_invading',
      //三会一课汇总
      meetingSum: {},
      todoTypeNum: {},
      alertTypeNum: {},
      tableHeight: 300
    }
  },
  computed: {
    ...mapGetters([
      'mapBoundary',
      'tenantId',
      'dapingTitle',
      'mapCenter',
      'mapLevel',
      'governmentPoint',
      'governmentName',
      'cameraListIds',
      'userType',
      'supervisionType'
    ]),
    alertNum() {
      return function (type) {

        return this.alertTypeNum[type] || 0
      }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(v => {
      this.tableHeight = this.$refs.box.offsetHeight - 30
    })
    todoTypes().then(res => {
      if (res.code == 200) {
        this.todoTypeNum = res.data
      }
    })
    this.getDicts("ai_alert_type").then(response => {
      if (response.data) {
        this.incidentType = []
        response.data.forEach(item=>{
          this.incidentType[item.dictLabel] = item.dictValue
        })

        countNumByAlertType().then(res => {
          if (res.code == 200) {
            this.alertTypeNum = {}
            var map = new Map(Object.entries(res.data))
            for (var [key,value] of map.entries()) {
              this.alertTypeNum[this.selectDictLabel(response.data, key)] = value

            }
          }
        })
      }

    });

  },
  methods: {

    handleClose() {
      this.noticeOpen = false;
    },
    openDialog() {
      $('.newsDetail-body').parent().css('height', $(window).innerHeight() - 85).css('top', 0).css('overflow-y', 'auto');
    },
    // 告警类型列表
    getTypeList() {
      let params = {
        status: 0,
        isHomeShow: 'Y'
      }
      listTypeAll(params).then(response => {
        this.incidentTypeOptions = response.data;
      });
    },
    getHasViewUpgrade() {
      checkView().then(res => {
        if (res.data.upgradeView && res.data.upgradeView === '0' && res.data.upgrageId) {
          getUpgradeLogAndUpdateView(res.data.upgrageId).then(response => {
            this.NerUpgradeLog = response.data;
            this.UpgradeLogOpen = true;
          })
        }
      })
    },
    handleWork(row) {
      if (row.taskKey) {
        if (row.taskKey == 'horn_task_examine' || row.taskKey == 'horn_task_submit') {
          let obj = {
            procinstId: row.procInstId
          }
          this.$refs.hornTaskProcessDiaog.init(obj);
        } else if (row.taskKey == 'action_res_process_submit' || row.taskKey == 'action_res_process_examine') {
          let obj = {
            procinstId: row.procInstId
          }
          this.$refs.actionTaskProcessDiaog.init(obj);
        } else if (row.taskKey == 'suishoupai_examine' || row.taskKey == 'suishoupai_submit') {
          let obj = {
            processId: row.procInstId
          }
          this.$refs.postListProcessDiaog.init(obj);
        }
      } else {
        this.$message("获取流程相关信息失败，请联系管理员");
      }
    },

    goTopage(taskKey) {
      if (taskKey == 'horn_task') {
        this.$router.push({name: 'Handle', params: {taskKey: 'horn_task'}})
      } else if (taskKey == 'suishoupai') {
        this.$router.push({name: 'Handle', params: {taskKey: 'suishoupai'}})
      } else if (taskKey == 'process_incident_alarm') {
        this.$router.push({name: 'Handle', params: {taskKey: 'process_incident_alarm'}})
      } else if (taskKey == 'action_res_process') {
        this.$router.push({name: 'Handle', params: {taskKey: 'action_res_process'}})
      } else if (taskKey == 'video_monitoring') {
        this.$router.push({name: 'Handle', params: {taskKey: 'video_monitoring'}})
      } else if (taskKey == 'water_quality') {
        this.$router.push({name: 'Handle', params: {taskKey: 'water_quality'}})
      } else {
        this.$router.push({name: 'Handle'})   //带参数，跳转页面。
      }
    },


    // 页面跳转
    quickNavTo(item) {
      let nodes = this.getParentId(this.menuOptions, item.menuId)
      let path = ""
      nodes.forEach(v => {
        let p = v.path
        if (p[0] != "/")
          p = "/" + p
        path = p + path
      })

      //兼容外链
      if (path.indexOf('/http') != -1) {
        path = path.substr(path.indexOf('/http') + 1)
        window.open(path)
        return
      }

      this.$router.push(path)
    }
    ,
    //查询叶子节点的父节点
    getParentId(list, id) {
      for (let i in list) {
        if (list[i].menuId == id) {
          return [list[i]]
        }
        if (list[i].children) {
          let node = this.getParentId(list[i].children, id);
          if (node !== undefined) {
            return node.concat(list[i])
          }
        }
      }
    }
    ,
    getAccessRoute() {
      // 判断当前用户是否已拉取完user_info信息
      store.dispatch('GetInfo').then(res => {
        // 拉取user_info
        const roles = res.roles
        store.dispatch('GenerateRoutes', {roles}).then(accessRoutes => {
          //去除默认的404页面
          this.menuOptions = accessRoutes.filter(v => v.path != "*")
        })

      })
    }
    ,
    getAllQuickNav() {
      allQuickNav().then(v => {
        this.customerQuickNavs = v.data
      })
    }
    ,
    getList() {
      this.loading = true;
      listNotice({
        pageNum: 1,
        pageSize: 7
      }).then(response => {
        this.noticeList = response.rows.slice(0, 7);
        this.loading = false;
      })
    }
    ,
    handleNoticeContent(row) {
      const noticeId = row.noticeId
      getNotice(noticeId).then(response => {
        this.noticeForm = response.data;
        this.noticeOpen = true;
      });
    }
    ,
    // 取消按钮
    noticeCancel() {
      this.noticeOpen = false;
      this.noticeForm = {
        noticeId: undefined,
        noticeTitle: undefined,
        noticeType: undefined,
        noticeContent: undefined,
        tenantId: undefined,
        status: "0"
      };
    }
    ,
    getTotalMeeting() {
      this.meetingTotal = {
        total: 100,
        value: 20,
        name: '党课'
      }
    }
    ,
    getMeetingByType(type) {
      if (type == 'zbdy') {
        this.zbdyMeetingData = {
          total: 0,
          value: 0,
          name: '完成率'
        }
      } else if (type == 'zbwy') {
        this.zbwyMeetingData = {
          total: 0,
          value: 0,
          name: '完成率'
        }
      } else if (type == 'dxz') {
        this.dxzMeetingData = {
          total: 0,
          value: 0,
          name: '完成率'
        }
      } else if (type == 'dk') {
        this.dkMeetingData = {
          total: 0,
          value: 0,
          name: '完成率'
        }
      }

    }
    ,
    async getDictAlarm() {
      this.getDicts("incident_type").then(response => {
        this.typeOptions = response.data;
      });
    }
    ,
    /** 查询发起事项列表 */
    getDoneList() {
      this.loading = true;
      selectMyWorkDone(this.doneListQueryParams).then(response => {
        this.toDoList = response.rows;
      });
    },
    /** 查询事件接收列表 */
    getActionList() {
      let that = this;
      listReceive(this.queryParams).then(response => {
        if (response.rows) {
          this.receiveList = response.rows;
          this.receiveList.forEach(item => {
            if (this.typeOptions.length > 0) {
              this.typeOptions.forEach(jtem => {
                if (jtem.dictValue == item.type) {
                  item.typeName = jtem.dictLabel;
                }
              })
            }

          })
        }
        window.setTimeout(function () {
          that.initRoolBox('alarm-table');
        }, 1000)


      });
    }
    ,
    // 能力类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
    },
    processKeyTypeFormat(row, column) {
      return this.selectDictLabel(this.taskKeyOptions, row.taskKey);
    },
    initRoolBox(id) {
      let rollBox = document.getElementById(id);
      let rollEl = rollBox.getElementsByClassName('rollEl')[0];
      let rollHeight = rollEl.getElementsByTagName('li')[0].offsetHeight + 5;
      let iTaget = parseInt(getStyle(rollEl, 'margin-top'));
      let rollBoxHheight = rollBox.offsetHeight;
      let sHtml = rollEl.innerHTML;

      function move(obj, attr, target, fnEnd) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
          //计算速度
          let speed = (target - parseInt(getStyle(obj, attr))) / 8;
          //判断速度是正还是负，正速度向上取整，负的向下取整
          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
          let dist = parseInt(getStyle(obj, attr));
          if (dist == target) {
            clearInterval(obj.timer);
            fnEnd && fnEnd();
          } else {
            dist += speed;
            obj.style[attr] = dist + 'px';
          }
        }, 50);
      }

      function getStyle(obj, attr) {//获取计算后的样式
        return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
      }

      let timer = setInterval(function () {
        if ((parseInt(rollEl.offsetHeight) - Math.abs(iTaget)) <= parseInt(rollBoxHheight)) {

          rollEl.innerHTML += sHtml;
        } else if (parseInt(rollEl.offsetHeight) / 2 == Math.abs(iTaget)) {
          rollEl.style.marginTop = 0;
          iTaget = 0;
          rollEl.innerHTML = sHtml;
        }
        iTaget -= rollHeight;
        move(rollEl, 'margin-top', iTaget);
      }, 2000);
      this.timers.push(timer);
    }
    ,
  },
  destroyed() {
  }
  ,
  beforeDestroy() {
    if (this.timers.length > 0) {
      for (let i = 0; i < this.timers.length; i++) {
        window.clearInterval(this.timers[i])
      }
    }
    this.timers = [];
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 0 12px 16px 12px;
}

.card_shadow {
  position: relative;
  //height: 370px;
  height: calc(100vh - 330px);
  position: relative;
  margin-top: 12px;
  /* box-shadow: 0 0 8px -2px #06c;*/
  background: #ffffff;
  border-radius: 3px;
}

.card_title_index {
  padding: 14px 0px 0px 0px;
  min-height: 40px;
  margin: 0 8px;
  border-bottom: 1px dashed #dbdfe6;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);

  .icon {
    width: 18px;
    float: left;
    margin-right: 2px;
  }
}

.card_title_index span {
  font-size: 16px;
  padding: 0 2px 7px 2px;
  float: left;
  /*border-bottom: 3px solid #0085d0;*/
}

.card_content {
  position: relative;
  height: calc(100% - 46px);
}

.meeting-box {
  .meeting-total-box {
    height: 40%;
    width: 85%;
    margin: 0 auto;

    .chart-text {
      width: 100px;
      float: left;
      height: 100%;
      font-size: 14px;

      p:first-child {
        margin-top: 35px;
      }

      .value {
        color: rgba(85, 160, 255, 1);
        font-size: 16px;
      }
    }

    .chart-box {
      width: 150px;
      float: left;
      height: 100%;
    }
  }

  .meeting-detail-box {
    height: 50%;
    width: 500px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .chart-item {
      flex-direction: column;
      flex: 1;

      .title {
        text-align: center;
        margin: 10px 0;
        color: #333333;
        font-size: 18px;
        font-weight: 500;
      }

      .chart-text {
        width: 100px;
        float: left;
        height: 100%;
        font-size: 12px;

        .title {
          margin: 10px 0;
          color: rgba(0, 0, 0, 0.6);
        }

        .item {
          margin: 5px 0;

          .value {
            color: rgba(85, 160, 255, 1);
            font-size: 14px;
          }
        }
      }

      .chart-box {
        width: calc(100% - 100px);
        float: left;
        height: 100%;
      }
    }
  }
}

.link-box {
  padding: 20px 0;

  .vert-half-party {
    height: 100%;

    .link-item {
      height: 50%;
      width: 12.5%;
      float: left;
      cursor: pointer;

      img {
        width: 60px;
        margin-top: 20px;
        float: left;
        margin-left: calc(50% - 30px);
        margin-bottom: 10px;
      }

      p {
        clear: both;
        margin: 30px 0 10px 0;
        text-align: center;
        font-size: 12px;
      }
    }
  }
}

.notice-box {
  color: rgba(255, 255, 255, 0.8);
}

.event-box {
  padding: 30px 20px 0 20px;

  .event-box-item {
    height: calc(33.33% - 20px);
    max-height: 70px;
    //width: calc(50% - 10px);
    width: calc(25% - 15px);
    margin-bottom: 20px;
    float: left;
    background-size: 100% 100%;
    padding-top: 15px;
    position: relative;
    //cursor: pointer;

    .num-tip {
      height: 26px;
      line-height: 26px;
      color: rgb(22, 119, 255);
      float: left;
      font-size: 22px;
    }

    .num-tip1 {
      clear: both;
      float: left;
      font-size: 12px;
    }

    .three-text {
      top: 11px;
      left: 130px;
    }
  }

  .bg-1 {
    background: #dce6ff;
    border-radius: 4px;
  }

  .bg-2 {
    background: #ffe9e9;
    border-radius: 4px;
  }

  .bg-3 {
    background: #d1fef9;
    border-radius: 4px;
  }

  .bg-4 {
    background: #fff1db;
    border-radius: 4px;
  }

  .bg-5 {
    background: #fee7fb;
    border-radius: 4px;
  }

  .bg-6 {
    background: #d6ffd9;
    border-radius: 4px;
  }

  .ml-20 {
    margin-left: 20px;
  }
}

.finish-box {
  //padding: 10px;

  .finish-selection {
    height: 40px;
  }
}

.alarm-box-1 {
  padding: 30px 20px 0 20px;

  .alarm-box-item {
    height: calc(50% - 10px);
    max-height: 60px;
    width: calc(50% - 5px);
    margin-bottom: 13px;
    float: left;
    background-size: 100% 100%;
    position: relative;

    img {
      position: absolute;
      top: 12px;
      left: 10px;
      width: 36px;
      height: 36px;
    }

    img:not([src]) {
      opacity: 0;
    }

    .event-content {
      padding-left: 60px;
      padding-top: 5px;
      font-size: 14px;

      p {
        color: #fff;
        margin: 0;
        font-size: 15px;
      }

      .value {
        color: #fff;
        font-size: 20px;
        margin: 3px 0 0px 0;
      }
    }
  }

  .ml-20 {
    margin-left: 10px;
  }
}

.wu-table-1 {
  width: 99%;
  height: calc(100% - 40px);
  color: #000;
  text-align: center;
  padding: 0;
  font-size: 14px;
}

.wu-table-header {
  height: 30px;
  line-height: 30px;
  display: flex;

  background-color: #b0d5ec;
}

.wu-table-header .wu-table-th {
  flex: 1;
  margin: 0;
}

.wu-table-body {
  height: calc(100% - 40px);
  overflow: hidden;
  color: #000;
}

.wu-table-body ul {
  padding: 0;
  margin-top: 5px;
}

.wu-table-body .rollEl li {
  display: flex;
  line-height: 30px;
  margin-bottom: 2px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.wu-table-body .rollEl li .wu-table-td {
  flex: 1;
  overflow: hidden;
  height: 30px;
}

.title {
  width: 80%;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  line-height: 30px;
}

.title .name {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 30px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  width: 100px;
}

.event-box-item-image {
  float: left;
  width: 50px;
  margin-left: 20px;
  margin-right: 20px;
}

.event-box-item-content {
  float: left;
}

::v-deep.card_shadow .el-tabs--border-card {
  height: 100% !important;
  box-shadow: none !important;
  border: none !important;
}

::v-deep.card_shadow .el-tabs__content {
  padding: 0 !important;
  height: calc(100% - 40px) !important;
}

::v-deep.card_shadow .el-tab-pane {
  height: calc(100% - 40px) !important;
}
</style>
