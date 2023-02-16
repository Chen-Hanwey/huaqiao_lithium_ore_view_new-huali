<template>
  <div class="app-container" style="overflow:hidden;">
    <el-row :gutter="20">
      <!--左侧-->
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input placeholder="请输入" maxlength="50" size="mini" v-model="tree.square.search" clearable style="margin-bottom:8px;">
            <el-button slot="append" icon="el-icon-search" @click="initTreeSquare"></el-button>
          </el-input>
        </div>
        <div class="head-container treeShow" :style="{'height':treeHeight+'px', 'overflow': 'auto','background':' #ffffff'}">
          <!-- <el-tree :default-expand-all="defaultExpandAll" :data="tree.square.data" :props="tree.defaultTreeProps" ref="treeSquare" :highlight-current="true">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div @click="treeClick(data)" :class="[data.isEnable==='1'?(data.status==='1'?'isOnline':'isOutline'):'',data.isActivity==='1'?'isActivity':'','custom-tree-node-left']">
                <i class="el-icon-camera-solid" v-if="data.isEnable==='1'"></i>
                <span :title="node.label"> {{ node.label }}</span>
                <span v-if="data.isEnable==='1'" style="margin-left: 15px;">
                  <span v-if="data.status==='0'" class="isDisabled">离线</span>
                  <span v-else-if="data.status==='1'" class="isEnabled">在线</span>
                  <span v-else-if="data.status==='2'" class="isDisabled">休眠</span>
                  <span v-else-if="data.status==='3'" class="isDisabled">能力未上报</span>
                  <span v-else-if="data.status==='4'" class="isDisabled">离线停机</span>
                  <span v-else-if="data.status==='5'" class="isDisabled">在线停机</span>
                  <span v-else-if="data.status==='6'" class="isDisabled">休眠停机</span>
                  <span v-else class="isEnable">离线</span>
                </span>
              </div>
            </div>
          </el-tree> -->

          <!-- <el-table ref="table" v-loading="loading" @sort-change="changeTableSort" stripe :height="tableHeight" :header-cell-style="{fontSize:'14px', fontWeight:'500'}" :data="deviceList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="序号" type="index" width="60" align="left">
              <template slot-scope="scope">
                <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column label="海拔" align="left" prop="altitude" sortable :render-header="renderHeader" />
            <el-table-column label="监控唯一标识点" align="left" prop="cameraIndexCode" sortable :render-header="renderHeader" />
            <el-table-column label="监控名称" align="left" prop="cameraName" sortable :render-header="renderHeader" />
            <el-table-column label="监控类型" align="left" prop="cameraType" sortable :render-header="renderHeader" />
            <el-table-column label="监控类型名称" align="left" prop="cameraTypeName" sortable :render-header="renderHeader" />
            <el-table-column label="通道编号" align="left" prop="channelNo" sortable :render-header="renderHeader" />
            <el-table-column label="通道类型" align="left" prop="channelType" sortable :render-header="renderHeader" />
            <el-table-column label="通道类型名称" align="left" prop="channelTypeName" sortable :render-header="renderHeader" />
            <el-table-column label="所属设备id" align="left" prop="encodeDevIndexCode" sortable :render-header="renderHeader" />
            <el-table-column label="安装地点" align="left" prop="installLocation" sortable :render-header="renderHeader" />
            <el-table-column label="经度" align="left" prop="latitude" sortable :render-header="renderHeader" />
            <el-table-column label="纬度" align="left" prop="longitude" sortable :render-header="renderHeader" />
            <el-table-column label="在线状态" align="left" prop="status" sortable :render-header="renderHeader" />
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)" v-hasPermi="['camera:camera:query']">详情</el-button>
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['camera:camera:edit']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['camera:camera:remove']">删除</el-button>
              </template>
            </el-table-column>
          </el-table> -->
        </div>
      </el-col>
      <!--右侧视频-->
      <el-col :span="19" :xs="24">
        <el-card :style="{height:contentHeight, overflow: 'auto',width:'100%'}">
          <div class="right-container">
            <div class="right-container-top">
              <!--              <el-radio-group v-model="video.screenNum" size="medium" @change="changeShowType">
                <el-radio-button label="1">单屏</el-radio-button>
                <el-radio-button label="4">四分屏</el-radio-button>
                <el-radio-button label="9">九分屏</el-radio-button>
                <el-radio-button label="16">十六分屏</el-radio-button>
              </el-radio-group>-->
              <!--<el-button type="primary"  plain style="float:right;margin-right:4px;" @click="downWord">视频播放需知</el-button>-->
            </div>
            <div class="right-container-video" style="background:#ffffff;">
              <el-row :gutter="0">
                <!--     <EasyPlayer style="{width: 100%}"
                            :videoUrl="videoUrl"
                            fluent autoplay live stretch loading>
                </EasyPlayer>-->
                <div style="{width: 100%}" id="video1"></div>
              </el-row>
              <el-row style="margin-top: 5px">
                <el-col :span="23">
                  <timePlayBack :loadRecordList="loadRecordList" style="background-color: #fff" :vbl="vbl" @timeChange="onTimeChange" ref="timeRule"></timePlayBack>
                </el-col>
                <el-col :span="1" class="inputDeep">
                  <el-date-picker style="width: 100%;padding-left: 10px;margin-top: 8px;" v-model="curretTime" editable="false" :clearable="true" @change="changeTime" value-format="yyyy-MM-dd" type="date" ref="datePickerRef" placeholder="选择日期">
                  </el-date-picker>
                </el-col>
                <!--            <el-slider
                  v-model="timeValue"
                  range
                  show-stops
                  :max="23">
                </el-slider>-->
              </el-row>
            </div>

          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

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
/* 利用穿透，设置input边框隐藏 */
.inputDeep >>> .el-input__inner {
  border: 0;
}
</style>

<script>
import $ from 'jquery'
import VueFullscreen from 'vue-fullscreen'
import Vue from 'vue'
//import { getTreeSquareHjq } from '@/api/project/peacecountry/liveVideo'
import { mapGetters } from 'vuex'
import timePlayBack from '../components/timePlayBack'
import { getPlayback, queryRecords } from '@/api/video/hejq'
import { getDeviceStream } from '@/api/video/device'



Vue.use(VueFullscreen)
export default {
  name: 'preview',
  components: {

    timePlayBack
  },
  computed: {
    ...mapGetters([
      'videoType',
      'tenantId'
    ]),
  },
  data () {
    return {
      player0: '',
      curretTime: this.getNowTime(),
      timeValue: [4, 8],
      videoUrl: '',
      loading: false,
      oWebControl: null,
      // loadRecordList: [ {"name": "海康枪机", "startTime": 1649779200000,"endTime":1649782800000}],
      loadRecordList: [],
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
        screenNum: 1,
        fullscreen: false,
        playerHeight: null,
        playerSpan: 24,
        poster: require('@/assets/images/video/black.png'),
        videoList: [],
        haveVideo: false,
        timer: '',
        refreshTime: 10000
      },
      playerOptions: {
        playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
        autoplay: false, // 如果为true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 是否视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "application/x-mpegURL",  // 类型
          src: 'https://elive.komect.com/camera/stream-16496687062417364.m3u8?token=864c7306b1bd1f255453ab24a84500bd&st=6257a064' // url地址
        }],
        notSupportedMessage: '很抱歉，当前时间无录像文件，无法播放',
      },
      tableHeight: 400,
      tableOffset: 138,
      treeHeight: 450,
      videoWidth: ($(window).width() - 550) / 2,
      videoHeight: ($(window).height() - 106 - 77 - 20) / 2,
      uploadVisble: false,
      videoErrorCount: 0,//视频播放加载失败次数
      videoPlugId: null,//视频播放插件id
      videoWindow: {
        x: 0,
        idzt: [],
        rect: {}, //弹窗左上坐标和宽高
        mask: [] //需要传给插件的弹窗的数组
      },
      vbl: 0,
      row: null,
      dataPre: null
    }
  },
  created () {

  },
  mounted () {
    let that = this
    that.initTreeSquare()
    this.treeHeight = window.innerHeight - 138;
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.tableOffset - 100;
      that.player0 = new WasmPlayer(null, 'video1', this.callbackfun)
    });
  },
  beforeDestroy () {
    let that = this
    that.player0.destroy(that.videoUrl);
    that.player0 = null;
  },
  methods: {
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
    changeTime () {
      if (null !== this.row) {
        this.treeClick(this.row)
      } else {
        this.msgInfo('请先选择设备！')
      }
    },
    // 点击左侧树联动右侧视频
    getYearMd (val) {
      var date = new Date(val);
      var year = date.getFullYear();
      var MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return year + "-" + MM + "-" + d;
    },
    onTimeChange (timeCursorText) {
      let that = this;
      if (null !== that.row) {
        let recordTime = that.getYearMd(that.curretTime);
        let slideTime = recordTime + " " + timeCursorText + ":00";
        let flag = 'false'
        let startTime = "";
        let endTime = "";
        let loadRecordLists = that.loadRecordList;
        if (!loadRecordLists.length > 0) {
          that.msgInfo('很抱歉，当前时间无录像文件，无法播放！')
        } else {
          for (let z = 0; z < loadRecordLists.length; z++) {
            /*     console.log(Date.parse(that.formatDate(loadRecordLists[z].startTime, 'space')) )
                 console.log(Date.parse(slideTime))
                 console.log( Date.parse(that.formatDate(loadRecordLists[z].endTime, 'space')))*/
            if (Date.parse(that.formatDate(loadRecordLists[z].startTime, 'space')) <= Date.parse(slideTime)) {
              if (Date.parse(slideTime) < Date.parse(that.formatDate(loadRecordLists[z].endTime, 'space'))) {
                flag = 'true';
                startTime = Date.parse(that.formatDate(loadRecordLists[z].startTime, 'space'));
                endTime = Date.parse(that.formatDate(loadRecordLists[z].endTime, 'space'));
                break;
              }
            }
          }
          if (flag === 'false') {
            //that.msgInfo('该时间段无历史视频！')
          } else {
            if (that.videoUrl !== '') { //如果存在播放地址，先停止播放在重新实例化播放器
              that.player0.stop();
              that.player0.destroy(that.videoUrl);
              that.player0 = null;
              that.player0 = new WasmPlayer(null, 'video1', this.callbackfun)
            }
            let params = { macId: this.row.cameraId, tenantId: this.tenantId, sessionId: 'qwe1231213we23r', startTime: startTime, endTime: endTime }
            getPlayback(params).then(response => {
              that.videoUrl = response.data;
              console.log(that.videoUrl)
              that.player0.play(that.videoUrl, 1)
            })

          }
        }
      } else {
        that.msgInfo('请先选择设备！')
      }
    },
    // 全屏切换
    toggleFullscreen () {
      this.video.fullscreen = !this.video.fullscreen
    },
    closeWindowDialog () {
      let that = this;
    },
    // 点击树
    treeClick (data) {
      let that = this
      if (data.status === '1') {
        that.loadRecordList = []
        data.isActivity = '1'
        if (that.dataPre && that.dataPre != data) {
          that.dataPre.isActivity = '0'
        }
        that.row = data
        let a = new Date(that.curretTime);
        let c = a.setHours(a.getHours() + 6)
        let d = a.setHours(a.getHours() + 6)
        let e = a.setHours(a.getHours() + 6)
        let b = a.setHours(a.getHours() + 6)
        let inputTime = [{ startTime: a.getTime(), endTime: c }, { startTime: c, endTime: d }, { startTime: d, endTime: e }, { startTime: e, endTime: b }]
        inputTime.forEach(function (item) {
          let parmas = { macId: data.cameraId, tenantId: that.tenantId, startTime: item.startTime, endTime: item.endTime }
          //获取地址播放
          queryRecords(parmas).then(response => {
            let arecodList = [];
            arecodList = response.data.data.times === null || response.data.data.times === undefined ? [] : response.data.data.times;
            that.loadRecordList = that.loadRecordList.concat(arecodList)
          })
        })
        that.playVideo(data);
      } else {
        that.msgError(data.label + '不是在线状态！')
        return false
      }
    },
    playVideo (data) {
      let that = this;
      let query = {
        macId: data.cameraId
      }
      getDeviceStream(query).then(response => {
        if (that.videoUrl !== '') { //如果存在播放地址，先停止播放在重新实例化播放器
          that.player0.stop();
          that.player0.destroy(that.videoUrl);
          that.player0 = null;
          that.player0 = new WasmPlayer(null, 'video1', this.callbackfun)
        }
        that.dataPre = data
        that.videoUrl = response.data
        that.player0.play(that.videoUrl, 1)
      })

    },
    formatDate: function (value, type) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      if (type === 'space') {
        return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
      } else if (type === 'time') {
        return h + ':' + m + ':' + s;
      } else {
        return y + '-' + MM + '-' + d + '' + h + ':' + m + ':' + s;
      }
    },
    //处理默认选中当前日期
    getNowTime () {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      var hour = " 00:00:00"; //默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}${hour}`;
      return defaultDate;
      this.$set(this.info, "stockDate", defaultDate);
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
  margin: 50px 40px;
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
