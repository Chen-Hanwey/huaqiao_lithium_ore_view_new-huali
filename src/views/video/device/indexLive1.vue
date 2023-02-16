<template>
  <div class="app-container" style="overflow:hidden;" :style="{height:contentHeight}">
    <el-row :gutter="20">
      <!--左侧-->
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input placeholder="请输入" maxlength="50" size="mini" v-model="tree.square.search" clearable style="margin-bottom:8px;">
            <el-button slot="append" icon="el-icon-search" @click="initTreeSquare"></el-button>
          </el-input>
        </div>
        <!-- <div class="head-container treeShow" :style="{'height':treeHeight+'px', 'overflow': 'auto','background':' #ffffff'}">
          <el-tree :default-expand-all="defaultExpandAll" :data="tree.square.data" :props="tree.defaultTreeProps" ref="treeSquare" :highlight-current="true">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div @click="treeClick(data)" :class="[data.isEnable==='1'?(data.status==='1'?'isOnline':'isOutline'):'',data.isActivity==='1'?'isActivity':'','custom-tree-node-left']">
                <i class="el-icon-camera-solid" v-if="data.isEnable==='1'"></i>
                <span :title="node.label"> {{ node.label }}</span>
                <span v-if="data.isEnable==='1'" style="margin-left: 15px;">
                  <span v-if="data.status==='0'" class="isDisabled">离线</span>
                  <span v-else-if="data.status==='1'" class="isEnabled">在线</span>
                  <span v-else class="isEnable">离线</span>
                </span>
              </div>
            </div>
          </el-tree>
        </div> -->
        <el-table ref="table" v-loading="loading" stripe :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="deviceList">
          <!-- <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" type="index" width="60" align="left">
            <template slot-scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column> -->

          <!-- <el-table-column label="监控唯一标识点" align="left" prop="cameraIndexCode" :render-header="renderHeader" /> -->
          <el-table-column label="监控名称" align="left" prop="cameraName" />

          <!-- <el-table-column label="在线状态" align="left" prop="status" /> -->
          <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="80">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-video-play" @click="rowClick(scope.row)" v-hasPermi="['camera:camera:query']">播放</el-button>

            </template>
          </el-table-column>
        </el-table>

      </el-col>
      <!--右侧视频-->
      <el-col :span="19" :xs="24">
        <el-card :style="{height:contentHeight, overflow: 'auto',width:'100%'}">
          <div class="right-container">
            <div class="right-container-top" style="margin-bottom:6px;">
              <el-radio-group v-model="video.screenNum" size="medium" @change="changeShowType">
                <el-radio-button label="1">单屏</el-radio-button>
                <el-radio-button label="4">四分屏</el-radio-button>
                <el-radio-button label="9">九分屏</el-radio-button>
                <!-- <el-radio-button label="16">十六分屏</el-radio-button> -->
              </el-radio-group>
              <el-button type="primary" plain style="float:right;margin-right:4px;" @click="toggleFullscreen">全屏
              </el-button>
            </div>
            <!--<div class="right-container-video" style="background:#ffffff;">
                <el-row :gutter="0">
                  <div v-for="(item,index) in video.videoList" :key="item.id">
                    <div :id="'video_' + index" ></div>
                  </div>
                  &lt;!&ndash;<div :id="'video_1'" ></div>
                  <div :id="'video_2'" ></div>&ndash;&gt;
              </el-row>
            </div>-->
            <fullscreen :fullscreen.sync="video.fullscreen">
              <div class="right-container-video" style="background:#ffffff;">
                <el-row :gutter="0">
                  <el-col :span="video.playerSpan" v-for="(item,index) in video.videoList" :key="item.id" style="padding-left:1px;padding-right: 1px;">
                    <div class="closeBox" @mouseover="mouseOverDiv(item)" @mouseleave="mouseLeaveDiv(item)">
                      <div class="closeText" v-if="item.closeShow && item.activity" @click="closeViedo(item)">
                        <svg t="1650957126202" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2422" width="20" height="20">
                          <path d="M452.266667 512L362.666667 422.4l59.733333-59.733333 89.6 89.6 89.6-89.6 59.733333 59.733333-89.6 89.6 89.6 89.6-59.733333 59.733333-89.6-89.6-89.6 89.6-59.733333-59.733333 89.6-89.6z m59.733333 341.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z" fill="#ffffff" p-id="2423"></path>
                        </svg>
                      </div>
                      <div style="margin-top:2px;border: 2px solid #ffffff" :id="'video_border' + index" @mouseover="mouseOverViedo(item)" @mouseleave="mouseLeaveViedo(item)">
                        <!--<EasyPlayer style="{width: 100%}" :id="'video_' + index"
                                    :videoUrl="item.videoUrl"
                                    fluent autoplay live stretch loading>
                        </EasyPlayer>-->
                        <div style="{width: 100%}" :id="'video_' + index"></div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </fullscreen>

          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import $ from 'jquery'
//import { getTreeSquareHjq } from "@/api/project/peacecountry/liveVideo";
import { getDeviceStream } from "@/api/video/device";
import { listCamera, getCamera, delCamera, addCamera, updateCamera, exportCamera, syncDev, getPlayStream } from "@/api/project/ga/camera";
import VueFullscreen from 'vue-fullscreen'
import Vue from 'vue'
Vue.use(VueFullscreen)
export default {
  name: 'preview',
  components: {

  },
  data () {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 40,
        branchId: null,
        branchName: null,
        macId: null,
        deviceName: null,
        latitude: null,
        longitude: null,
        mac: null,
        location: null,
        status: null,
        tenantId: null,
        ancestors: null,
      },
      deviceList: [],
      loading: false,
      oWebControl: null,
      defaultExpandAll: true,
      tree: {
        defaultTreeProps: {
          children: 'children',
          label: 'label'
        },
        square: {
          data: null,
          search: ''
        },
        squareTemp: {
          data: null,
          search: ''
        },
        label: {
          data: null
        },
        favorite: {
          data: null,
          search: ''
        }
      },
      activeName: 'first',
      contentHeight: $(window).height() - 100 + 'px',
      video: {
        screenNum: 4,
        fullscreen: false,
        playerHeight: null,
        playerSpan: 24,
        poster: require('@/assets/images/video/black.png'),
        videoList: [],
        haveVideo: false,
        timer: '',
        refreshTime: 10000
      },
      tableHeight: 400,
      tableOffset: 138,
      treeHeight: 450,
      player0: '',
      player1: '',
      player2: '',
      player3: '',
      player4: '',
      player5: '',
      player6: '',
      player7: '',
      player8: '',
      player9: '',
      player10: '',
      player11: '',
      player12: '',
      player13: '',
      player14: '',
      player15: '',
      url: ''
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    let that = this
    that.changeShowType('init')
    that.initTreeSquare()
    this.treeHeight = window.innerHeight - 138;
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.tableOffset + 2;
    });
  },
  beforeDestroy () {
    let that = this
    that.closeAll()
  },
  methods: {

    getList () {
      this.loading = false;
      /*listDevice(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });*/
      listCamera(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });

    },
    callbackfun (e) {
      console.log('callbackfun', e);
    },
    // 获取广场视频树
    initTreeSquare () {
      let that = this
      let query = {
        name: that.tree.square.search
      }
      /*getTreeSquareHjq(query).then(response => {
        that.tree.square.data = response.data
      })*/
    },
    //-------------------------------------------------------------------------右侧视频相关
    // 点击左侧树联动右侧视频
    // 全屏切换
    toggleFullscreen () {
      this.video.fullscreen = !this.video.fullscreen
    },
    // 点击树
    rowClick (data) {
      let that = this
      //that.player0.play(data.msg, 1)
      let isInActivity = false
      // if (data.status == "0") { // 已离线，返回
      //   that.msgError(data.label + '已离线！')
      //   return false
      // }

      // for (let i = 0; i < that.video.videoList.length; i++) {// 判断是否已在播放列表
      //   let item = that.video.videoList[i]
      //   if (item.channelId === data.channelNo) {
      //     isInActivity = true
      //     break
      //   }
      // }
      // if (isInActivity === true) { // 已在播放列表中，返回
      //   return false
      // }
      // for (let i = 0; i < that.video.videoList.length; i++) { // 判断是否超过最大播放量
      //   let item = that.video.videoList[i]
      //   if (item.activity === false) {
      //     item.channelId = data.channelNo
      //     break
      //   }
      //   if (i === (that.video.videoList.length - 1)) {
      //     this.msgError('已超最多播放数！')
      //   }
      // }
      // 获取播放地址，播放视频

      //data.isActivity = '1';
      getPlayStream(data.cameraIndexCode).then(response => {
        console.log(response)

        let videoUrl = response.msg
        for (let i = 0; i < that.video.videoList.length; i++) {
          let item = that.video.videoList[i]
          if (item.activity === false) {
            //item.channelId = data.cameraId
            item.channelId = data.channelNo
            item.videoUrl = videoUrl
            item.activity = true
            item.data = data
            that.haveVideo = true
            if (i == 0) {
              that.player0.play(videoUrl, 1)
            } else if (i == 1) {
              that.player1.play(videoUrl, 1)
            } else if (i == 2) {
              that.player2.play(videoUrl, 1)
            } else if (i == 3) {
              that.player3.play(videoUrl, 1)
            } else if (i == 4) {
              that.player4.play(videoUrl, 1)
            } else if (i == 5) {
              that.player5.play(videoUrl, 1)
            } else if (i == 6) {
              that.player6.play(videoUrl, 1)
            } else if (i == 7) {
              that.player7.play(videoUrl, 1)
            } else if (i == 8) {
              that.player8.play(videoUrl, 1)
            } else if (i == 9) {
              that.player9.play(videoUrl, 1)
            } else if (i == 10) {
              that.player10.play(videoUrl, 1)
            } else if (i == 11) {
              that.player11.play(videoUrl, 1)
            } else if (i == 12) {
              that.player12.play(videoUrl, 1)
            } else if (i == 13) {
              that.player13.play(videoUrl, 1)
            } else if (i == 14) {
              that.player14.play(videoUrl, 1)
            } else if (i == 15) {
              that.player15.play(videoUrl, 1)
            }
            that.$forceUpdate()
            break
          }
        }
      })
    },
    treeClick (data) {

      let that = this
      let isInActivity = false
      if (data.status == "0") { // 已离线，返回
        that.msgError(data.label + '已离线！')
        return false
      }
      for (let i = 0; i < that.video.videoList.length; i++) {// 判断是否已在播放列表
        let item = that.video.videoList[i]
        if (item.channelId === data.cameraId) {
          isInActivity = true
          break
        }
      }
      if (isInActivity === true) { // 已在播放列表中，返回
        return false
      }
      for (let i = 0; i < that.video.videoList.length; i++) { // 判断是否超过最大播放量
        let item = that.video.videoList[i]
        if (item.activity === false) {
          item.channelId = data.cameraId
          break
        }
        if (i === (that.video.videoList.length - 1)) {
          this.msgError('已超最多播放数！')
        }
      }
      // 获取播放地址，播放视频
      let query = {
        macId: data.cameraId
      }
      data.isActivity = '1';
      getDeviceStream(query).then(response => {
        console.log(response)
        for (let i = 0; i < that.video.videoList.length; i++) {
          let item = that.video.videoList[i]
          if (item.activity === false) {
            item.channelId = data.cameraId
            item.videoUrl = videoUrl
            item.activity = true
            item.data = data
            that.haveVideo = true
            if (i == 0) {
              window.console.log("1111")
              that.player0.play(videoUrl, 1)
            } else if (i == 1) {
              that.player1.play(videoUrl, 1)
            } else if (i == 2) {
              that.player2.play(videoUrl, 1)
            } else if (i == 3) {
              that.player3.play(videoUrl, 1)
            } else if (i == 4) {
              that.player4.play(videoUrl, 1)
            } else if (i == 5) {
              that.player5.play(videoUrl, 1)
            } else if (i == 6) {
              that.player6.play(videoUrl, 1)
            } else if (i == 7) {
              that.player7.play(videoUrl, 1)
            } else if (i == 8) {
              that.player8.play(videoUrl, 1)
            } else if (i == 9) {
              that.player9.play(videoUrl, 1)
            } else if (i == 10) {
              that.player10.play(videoUrl, 1)
            } else if (i == 11) {
              that.player11.play(videoUrl, 1)
            } else if (i == 12) {
              that.player12.play(videoUrl, 1)
            } else if (i == 13) {
              that.player13.play(videoUrl, 1)
            } else if (i == 14) {
              that.player14.play(videoUrl, 1)
            } else if (i == 15) {
              that.player15.play(videoUrl, 1)
            }
            that.$forceUpdate()
            break
          }
        }
      })
    },
    // 修改大屏、四屏、九屏、十六屏
    changeShowType (type) {
      let that = this
      that.clearVideoList()
      that.initVideoSpan(that.video.screenNum)
      if (that.video.screenNum === 1) {
        that.video.poster = require('@/assets/images/video/blackSmall.png')
      } else {
        that.video.poster = require('@/assets/images/video/black.png')
      }
      for (let i = 0; i < that.video.screenNum; i++) {
        that.video.videoList.push({
          index: i,
          activity: false,
          player: null,
          url: ''
        })
      }
      //初始化播放器
      setTimeout(function () {
        console.log(that.videoList)
        for (let i = 0; i < that.video.screenNum; i++) {
          if (i == 0) {
            that.player0 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 1) {
            that.player1 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 2) {
            that.player2 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 3) {
            that.player3 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 4) {
            that.player4 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 5) {
            that.player5 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 6) {
            that.player6 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 7) {
            that.player7 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 8) {
            that.player8 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 9) {
            that.player9 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 10) {
            that.player10 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 11) {
            that.player11 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 12) {
            that.player12 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 13) {
            that.player13 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 14) {
            that.player14 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          } else if (i == 15) {
            that.player15 = new WasmPlayer(null, 'video_' + i, this.callbackfun)
          }
        }
      }, 200)
    },
    clearVideoList () {
      let that = this
      for (let i = 0; i < that.video.videoList.length; i++) {
        if (i == 0) {
          //that.player0.destroy(that.video.videoList[i].videoUrl);
          that.player0 = '';
        } else if (i == 1) {
          //that.player1.destroy(that.video.videoList[i].videoUrl);
          that.player1 = '';
        } else if (i == 2) {
          //that.player2.destroy(that.video.videoList[i].videoUrl);
          that.player2 = '';
        } else if (i == 3) {
          //that.player3.destroy(that.video.videoList[i].videoUrl);
          that.player3 = '';
        } else if (i == 4) {
          //that.player4.destroy(that.video.videoList[i].videoUrl);
          that.player4 = '';
        } else if (i == 5) {
          //that.player5.destroy(that.video.videoList[i].videoUrl);
          that.player5 = '';
        } else if (i == 6) {
          //that.player6.destroy(that.video.videoList[i].videoUrl);
          that.player6 = '';
        } else if (i == 7) {
          //that.player7.destroy(that.video.videoList[i].videoUrl);
          that.player7 = '';
        } else if (i == 8) {
          //that.player8.destroy(that.video.videoList[i].videoUrl);
          that.player8 = '';
        } else if (i == 9) {
          //that.player9.destroy(that.video.videoList[i].videoUrl);
          that.player9 = '';
        } else if (i == 10) {
          //that.player10.destroy(that.video.videoList[i].videoUrl);
          that.player10 = '';
        } else if (i == 11) {
          //that.player11.destroy(that.video.videoList[i].videoUrl);
          that.player11 = '';
        } else if (i == 12) {
          //that.player12.destroy(that.video.videoList[i].videoUrl);
          that.player12 = '';
        } else if (i == 13) {
          //that.player13.destroy(that.video.videoList[i].videoUrl);
          that.player13 = '';
        } else if (i == 14) {
          //that.player14.destroy(that.video.videoList[i].videoUrl);
          that.player14 = '';
        } else if (i == 15) {
          //that.player15.destroy(that.video.videoList[i].videoUrl);
          that.player15 = '';
        }
      }
      that.video.videoList = []
      that.haveVideo = false
    },
    // 设置分屏高度
    initVideoSpan (videoNum) {
      let num = parseInt(videoNum)
      if (num === 1) {
        this.video.playerSpan = 24
      } else if (num === 4) {
        this.video.playerSpan = 12
      } else if (num === 9) {
        this.video.playerSpan = 8
      } else if (num === 16) {
        this.video.playerSpan = 6
      }
    },
    mouseOverDiv (item) {
      this.video.videoList[item.index].closeShow = true
      this.$forceUpdate()
    },
    mouseLeaveDiv (item) {
      this.video.videoList[item.index].closeShow = false
      this.$forceUpdate()
    },
    mouseOverViedo (item) {
      $("#video_border" + item.index).css({ "border": "2px solid #00a0e9" });
      this.$forceUpdate()
    },
    mouseLeaveViedo (item) {
      $("#video_border" + item.index).css({ "border": "2px solid #ffffff" });
      this.$forceUpdate()
    },
    closeAll () {
      let that = this;
      for (let i = 0; i < that.video.videoList.length; i++) {
        let item = that.video.videoList[i]
        //关闭所有播放中的
        that.closeViedo(item);
      }
    },
    closeViedo (item) {
      console.log(item)
      let that = this
      let obj = {
        index: item.index,
        activity: false
      }
      this.video.videoList[item.index] = obj
      if (item.index == 0) {
        that.player0.destroy(that.video.videoList[item.index].videoUrl);
        that.player0 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 1) {
        that.player1.destroy(that.video.videoList[item.index].videoUrl);
        that.player1 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 2) {
        that.player2.destroy(that.video.videoList[item.index].videoUrl);
        that.player2 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 3) {
        that.player3.destroy(that.video.videoList[item.index].videoUrl);
        that.player3 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 4) {
        that.player4.destroy(that.video.videoList[item.index].videoUrl);
        that.player4 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 5) {
        that.player5.destroy(that.video.videoList[item.index].videoUrl);
        that.player5 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 6) {
        that.player6.destroy(that.video.videoList[item.index].videoUrl);
        that.player6 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 7) {
        that.player7.destroy(that.video.videoList[item.index].videoUrl);
        that.player7 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 8) {
        that.player8.destroy(that.video.videoList[item.index].videoUrl);
        that.player8 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 9) {
        that.player9.destroy(that.video.videoList[item.index].videoUrl);
        that.player9 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 10) {
        that.player10.destroy(that.video.videoList[item.index].videoUrl);
        that.player10 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 11) {
        that.player11.destroy(that.video.videoList[item.index].videoUrl);
        that.player11 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 12) {
        that.player12.destroy(that.video.videoList[item.index].videoUrl);
        that.player12 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 13) {
        that.player13.destroy(that.video.videoList[item.index].videoUrl);
        that.player13 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 14) {
        that.player14.destroy(that.video.videoList[item.index].videoUrl);
        that.player14 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      } else if (item.index == 15) {
        that.player15.destroy(that.video.videoList[item.index].videoUrl);
        that.player15 = new WasmPlayer(null, 'video_' + item.index, this.callbackfun)
      }
      item.data.isActivity = '0'
      this.$forceUpdate()
    },
  }
}
</script>
<style lang="scss" scoped>
.right-container {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.playWnd {
  margin: 20px 40px;
}
::v-deep .el-tabs__item {
  padding: 0 10px;
}

::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
}

.right-container-video {
}

.custom-tree-node {
  font-size: 12px;
  width: 100%;
}
.custom-tree-node-left {
  float: left;
  font-size: 12px;
  white-space: nowrap;
  color: #000000;
}
.isOnline {
  /*  color: #279c32;*/
}
.isOutline {
  color: #c3bfbf;
}
.isActivity {
  color: #25b104;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  overflow: unset;
}
::v-deep .el-tree-node > .el-tree-node__children {
  overflow: unset;
  background-color: transparent;
}
.loading {
  left: 30px;
  position: absolute;
  z-index: 1;
  top: 25px;
  background: url("../../../assets/images/loading-0.gif") center no-repeat;
}
</style>
<style>
.arges-video-zhuti {
  position: absolute;
  z-index: 3;
  /* box-shadow:0 0 5px white; */
  overflow: hidden;
  border-radius: 4px;
}
.arges-video-zhuti .content {
  padding: 0 20px;
}
.arges-video-title {
  vertical-align: middle;
  height: 40px;
  width: 100%;
  line-height: 40px;
  font-size: 18px;
  background: #f2f2f2;
  padding-left: 20px;
}
.arges-dialog-colose {
  font-size: 20px;
  float: right;
  margin-right: 10px;
}
.arges-mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  left: 0;
  top: 0;
  z-index: 2;
  position: absolute;
}
</style>
<style scoped>
.closeBox {
  position: relative;
}

.closeText {
  position: absolute;
  cursor: pointer;
  top: 5px;
  right: 5px;
  z-index: 9999;
  color: #ffffff;
  background-color: #1f1f1f;
  border-radius: 5px;
  font-size: 12px;
  padding: 3px;
}
</style>
