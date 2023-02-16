<template>
  <div>
    <div class="inspectPanelContent">
      <div class="box1">
        <div class="a1 content_module">
          <div class="content_module_title">从业人员</div>
          <div v-if="kitchenPersonList && kitchenPersonList.length > 0">
            <el-carousel height="130px" indicator-position="none">
              <el-carousel-item v-for="item in kitchenPersonList" :key="item.id">
                <el-row>
                  <el-col :span="12">
                    <div class="grid-content bg-purple"
                         style="width: 230px; height: 116px;padding-left:30px;padding-top:8px;">
                      <el-image
                        style=" height: 116px;width:130px;"
                        :src="getDefaultUrl(item.picPath)"
                      >
                        <div slot="error" class="image-slot" style="text-align: center">
                          <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                            加载失败</i>
                        </div>
                      </el-image>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="grid-content bg-purple-light" style="padding-top:8px;line-height:20px;font-size: 12px;">
                      <div>姓名：{{ item.name }}</div>
                      <div>性别：{{ sexFormat(item) }}</div>
                      <div>电话：{{ item.telephone }}</div>
                      <div>岗位：{{ positionFormat(item) }}</div>
                      <div>健康证号：{{ item.healthNo }}</div>
                      <div>健康证：{{ getHealthCertificate(item) }}</div>
                    </div>
                  </el-col>
                </el-row>
              </el-carousel-item>
            </el-carousel>
          </div>
          <div v-else>
            <div style="height: 100px; width:100%;text-align: center;margin-top: 50px;color:#9E93B3">
              暂无数据
            </div>
          </div>
        </div>
        <div class="a2 content_module">
          <div class="content_module_title">晨检记录</div>
          <div class="scrollBoard_bg" style="height:130px;"></div>
          <dv-scroll-board ref="scrollBoard" :config="config" style="height:130px;"/>
        </div>
        <div class="a3 content_module">
          <div class="content_module_title">消毒记录</div>
          <div class="scrollBoard_bg" style="height:130px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="config1" style="height:130px;"/>
        </div>
      </div>
      <div class="box3">
        <div class="a1 content_module">
          <div class="content_module_title">人工抓拍
           <!-- <el-date-picker
                v-model="queryParams2.alertTimeRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始"
                end-placeholder="结束"
                style="width: 210px;position:absolute;height: 29px; margin-left: 104px;background-color:#185695"
               @change="getArtificial">
              </el-date-picker>-->
          </div>
          <div style="height:210px;overflow:auto;" id="div1" ref="personDom1" @scroll="scroll1">
            <div v-if="artificialList && artificialList.length > 0">
              <div  v-for="(item, index)  in artificialList" :key="index" >
                <div>
                  <div style="margin-left: 10px; height: 100px;margin-top: 5px;font-size:12px;padding-top:12px; " class="demo-image__lazy">
                    <el-col :span="7">
                        <el-image
                            style=" height: 90px"
                            :src="getUrl(item.pic)"
                            lazy
                            fit="cover"
                            :scroll-container="scrollContainer1"
                            :preview-src-list="[getUrl(item.pic)]"
                          ></el-image>
                    </el-col>
                    <el-col :span="17" style="padding-top:2px;padding-left:6px;">
                        <div style="font-weight:bold;margin-left: 4px;">{{item.algoName}}</div>
                        <div style="margin-left: 4px;margin-top: 9px;">抓拍时间：{{item.alertTime}}</div>
                        <div style="margin-left: 4px;margin-top: 9px;">摄像机ID：{{item.cid}}</div>
                        <div style="margin-left: 4px;margin-top: 9px;">摄像机名称：{{item.cameraName}}</div>
                    </el-col>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div style="height: 100px; width:100%;text-align: center;margin-top: 100px;color:#9E93B3">
                暂无数据
              </div>
            </div>
          </div>
        </div>
        <div class="a2 content_module" >
          <div class="content_module_title">AI抓拍
             <!--  <el-date-picker
                v-model="queryParams1.alertTimeRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始"
                end-placeholder="结束"
                style="width: 210px;position:absolute;height: 29px; margin-left: 121px;background-color:#185695"
               @change="getAurora">
              </el-date-picker>-->
          </div>
          <div style="height:210px;overflow:auto; " id="div1"  ref="personDom" @scroll="scroll">
            <div v-if="auroraList && auroraList.length > 0">
              <div v-for="(item, index) in auroraList" :key="index" >
                <div >
                  <div style="margin-left: 10px; height: 100px;margin-top: 5px;font-size:12px;padding-top:12px;" class="demo-image__lazy">
                    <el-col :span="7">
                        <el-image
                            style=" height: 90px"
                            :src="getUrl(item.pic)"
                            lazy
                            fit="cover"
                            :scroll-container="scrollContainer"
                            :preview-src-list="[getUrl(item.pic)]"
                          ></el-image>
                    </el-col>
                    <el-col :span="17" style="padding-top:2px;padding-left:6px;">
                        <div style="font-weight:bold;margin-left: 4px;">{{item.algoName}}</div>
                        <div style="margin-left: 4px;margin-top: 9px;">抓拍时间：{{item.alertTime}}</div>
                        <div style="margin-left: 4px;margin-top: 9px;">摄像机ID：{{item.cid}}</div>
                        <div style="margin-left: 4px;margin-top: 9px;">摄像机名称：{{item.cameraName}}</div>
                    </el-col>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div style="height: 100px; width:100%;text-align: center;margin-top: 100px;color:#9E93B3">
                暂无数据
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <div class="box2">
        <div class="a1 content_module">
          <div>
            <div class="content_module_title">后厨直播</div>
            <div v-if="operationVideoList.length > 0">
              <div class="nameDiv">
                <div class="nameDivBg" ></div> <div class="nameDivTitle">{{ videoName }}</div>
                <div style="clear:both"></div>
              </div>
              <div v-if="showLive" class="box-space" style="height: 200px">
                <MyEasyPlayerV2  ref="myPlayer" :sourceUrl="videoUrl"></MyEasyPlayerV2>
              </div>
              <div v-if="!showLive" class="box-space" :style="{height:canvasHeight+'px'}">
                <el-image
                  width="100%"
                  height="100%"
                  fit="fill"
                  :src="noImage"
                  style="height:282px"
                >
                  <div slot="error" class="image-slot" style="text-align: center">
                    <i class="el-icon-picture-outline" style="color: #999;line-height: 200px;user-select: none">
                      加载失败</i>
                  </div>
                </el-image>
              </div>
            </div>

          </div>
          <div>
            <div class="banner-container" id="box" @mouseenter="enter()" @mouseleave="leave()">
              <button type="button" class="el-carousel__arrow el-carousel__arrow--left" id="leftButton" style="display: none;margin-top: 190px;" @click="scrollInit1(150)">
                <i class="el-icon-arrow-left"></i>
              </button>
              <button type="button" class="el-carousel__arrow el-carousel__arrow--right" id="rightButton" style="display: none;margin-top: 190px;" @click="scrollInit1(-150)">
                <i class="el-icon-arrow-right"></i>
              </button>
              <div v-for="(item,index) in operationVideoList" :key="index" class="box" @click="playVideo(index)">
                <div class="label single-line nameDiv" :style="{marginBottom:'7px',cursor:'pointer',fontWeight:curKitchen==index?'bold':'',color:curKitchen==index?'#409EFF':''}" >
                  <div class="nameDivBg"
                     :style="{fontWeight:curKitchen==index?'bold':'',verticalAlign: 'middle'}"></div>
                  <div class="nameDivTitle">{{ item.deviceName || '默认设备' }}</div>
                  <div style="clear:both"></div>
                </div>
                <div :style="{cursor :'pointer' }">
                  <img :src="item.previewPic||kitchenBg" class="img">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import { listAllOperation } from '@/api/operationManage/operationManage'
import { listOperationVideo } from '@/api/video/operationVideo'
import { listKitchenPerson } from '@/api/kitchenPerson/kitchenPerson'
import { listMorningCheck } from '@/api/morningCheck/morningCheck'
import { listKillProcessSupervise } from '@/api/killProcessSupervise/killProcessSupervise'
import { queryKitchenPersonOptions } from '@/api/kitchenPerson/kitchenPerson'
import videoBg from '@/assets/images/videobg.png'
import kitchenBg from '@/assets/images/kitchen-bg.png'
import Exclamation from '@/assets/images/exclamation2.png'
import Nophoto from '@/assets/image/partybase/nophoto.png'
import axios from 'axios'
import { listAurora } from '@/api/aurora/aurora'
import MyEasyPlayerV2 from '@/views/components/videoPlay/MyEasyPlayerV2'

export default {
  name: 'brightCookingHob',
  components: {MyEasyPlayerV2},
  props: {
    operationId: {
      default: '1'
    },
    enterpriseId: {
      default: '1'
    }
  },
  data() {
    return {
      operationVideoList: [],
      kitchenPersonList: [],
      auroraList: [],
      artificialList: [],
      canvasHeight: 200,
      fontWeight: {
        fontWeight: ''
      },
      videoUrl: '',
      videoName: '',
      showLive: false,
      curKitchen: 0,
      noImage: videoBg,
      sexOptions: [],
      positionOptions: [],
      scrollContainer: '',
      scrollContainer1: '',
      data: [],
      data1: [],
      kitchenBg: kitchenBg,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1000,
        params: {
          operationId: undefined
        }
      },
      // AI抓拍查询参数
      queryParams1: {
        pageNum: 1,
        pageSize: 3,
        params: {
          operationId: undefined
        },
        num: ''
      },
      // 人工抓拍查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 3,
        params: {
          operationId: undefined
        },
        num: ''
      },
      config: {},
      config1: {},
      // 消杀对象字典
      killObjOptions: [],
      // 清洗方式字典
      cleanWayOptions: [],
      // 消毒方式字典
      disinfectWayOptions: [],
      // 从业管理人员
      kitchenPersonOptions: []
    }
  },
  watch: {
    operationId: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.queryParams.params.operationId = newValue
          this.queryParams1.params.operationId = newValue
          this.queryParams2.params.operationId = newValue
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
   console.log('销毁了')
   this.showLive = false
  },
  mounted() {
    this.scrollInit()
    this.scrollContainer = this.$refs.personDom.warp
    this.scrollContainer1 = this.$refs.personDom1.warp
    $('body').addClass("el-popup-parent--hidden");
    // this.$refs.personDom.addEventListener('scroll', this.scrool);
    this.scroll()
    this.scroll1()
  },
  created() {

    this.getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
    this.getDicts('kitchen_person_positon').then(response => {
      this.positionOptions = response.data
    })
    this.getDicts('kill_obj').then(response => {
      this.killObjOptions = response.data
    })
    this.getDicts('clean_way').then(response => {
      this.cleanWayOptions = response.data
    })
    this.getDicts('disinfect_way').then(response => {
      this.disinfectWayOptions = response.data
    })
    // 获取从业人员
    this.getKitchenPersonOptions()
    this.getList()
    this.getKitchenPerson()
    this.getMorningCheck()
    this.getAurora()
    this.getArtificial()
  },
  methods: {
    //滚动分页加载数据
    scroll() {
      console.log('------------jinlail')
        let isLoading = true;//是否有数据可以加载
            // 距离底部200px时加载一次

        if (this.queryParams1.num > this.auroraList.length && isLoading == true) {
            this.queryParams1.pageNum = this.queryParams1.pageNum + 1;//每次分页+1

            //自己封装的请求数据的方法
            this.queryParams1.params.alertStartTime = this.queryParams1.alertTimeRange && this.queryParams1.alertTimeRange.length > 0 ? this.queryParams1.alertTimeRange[0] : undefined;
            this.queryParams1.params.alertEndTime = this.queryParams1.alertTimeRange && this.queryParams1.alertTimeRange.length > 0 ? this.queryParams1.alertTimeRange[1] : undefined;
            listAurora(this.queryParams1).then(response => {
              //有数据的时候加载
              if(response.rows.length > 0){
                  this.auroraList.push(...response.rows);//追加数据 使用 ...语法
                  isLoading = true;
              }else{
                isLoading = false;//无数据可以加载
              }
            })

        }
    },

    //滚动分页加载数据
    scroll1() {
      console.log('------------jinlail')
        let isLoading = true;//是否有数据可以加载
            // 距离底部200px时加载一次

        if (this.queryParams2.num > this.auroraList.length && isLoading == true) {
            this.queryParams2.pageNum = this.queryParams2.pageNum + 1;//每次分页+1

            //自己封装的请求数据的方法
            this.queryParams2.params.alertStartTime = this.queryParams2.alertTimeRange && this.queryParams2.alertTimeRange.length > 0 ? this.queryParams2.alertTimeRange[0] : undefined;
            this.queryParams2.params.alertEndTime = this.queryParams2.alertTimeRange && this.queryParams2.alertTimeRange.length > 0 ? this.queryParams2.alertTimeRange[1] : undefined;
            listAurora(this.queryParams2).then(response => {
              //有数据的时候加载
              if(response.rows.length > 0){
                  this.artificialList.push(...response.rows);//追加数据 使用 ...语法
                  isLoading = true;
              }else{
                isLoading = false;//无数据可以加载
              }
            })

        }
    },
    // 鼠标移入
    enter() {
      var leftButton = document.getElementById('leftButton')
      leftButton.style = 'margin-top: 190px;'
      var rightButton = document.getElementById('rightButton')
      rightButton.style = 'margin-top: 190px;'
    },
    // 移出
    leave() {
      var leftButton = document.getElementById('leftButton')
      leftButton.style = 'display: none;margin-top: 190px;'
      var rightButton = document.getElementById('rightButton')
      rightButton.style = 'display: none;margin-top: 190px;'
    },
    // 初始化与绑定监听事件方法
    scrollInit1(val) {
      // // 获取要绑定事件的元素
      const scrollDiv = document.getElementById('box')
      // // document.addEventListener('DOMMouseScroll', handler, false)
      // // 添加滚轮滚动监听事件，一般是用下面的方法，上面的是火狐的写法
      // scrollDiv.addEventListener('mousewheel', handler, false)

      // 滚动事件的出来函数
      // function handler(event) {
        // 获取滚动方向
        // const detail = event.wheelDelta || event.detail
        // console.log(detail)
        // 定义滚动方向，其实也可以在赋值的时候写
        const moveForwardStep = 1
        const moveBackStep = -1
        // 定义滚动距离
        let step = 0
        // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
        if (val < 0) {
          step = moveForwardStep * 100
        } else {
          step = moveBackStep * 100
        }
        // 对需要滚动的元素进行滚动操作
        scrollDiv.scrollLeft += step
      // }
    },
    // 初始化与绑定监听事件方法
    scrollInit() {
      // 获取要绑定事件的元素
      const scrollDiv = document.getElementById('box')
      // document.addEventListener('DOMMouseScroll', handler, false)
      // 添加滚轮滚动监听事件，一般是用下面的方法，上面的是火狐的写法
      // scrollDiv.addEventListener('mousewheel', handler, false)

      // 滚动事件的出来函数
      function handler(event) {
        // 获取滚动方向
        const detail = event.wheelDelta || event.detail
        console.log(detail)
        // 定义滚动方向，其实也可以在赋值的时候写
        const moveForwardStep = 1
        const moveBackStep = -1
        // 定义滚动距离
        let step = 0
        // 判断滚动方向,这里的100可以改，代表滚动幅度，也就是说滚动幅度是自定义的
        if (detail < 0) {
          step = moveForwardStep * 100
        } else {
          step = moveBackStep * 100
        }
        // 对需要滚动的元素进行滚动操作
        scrollDiv.scrollLeft += step
      }
    },

    // 性别字典翻译
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex)
    },
    // 消杀对象字典翻译
    killObjFormat(row, column) {
      return this.selectDictLabel(this.killObjOptions, row.killObj)
    },
    // 清洗方式字典翻译
    cleanWayFormat(row, column) {
      return this.selectDictLabel(this.cleanWayOptions, row.cleanWay)
    },
    // 检查人格式化
    checkerFormat(row, column) {
      // this.$nextTick(()=>{
      //     var dictLabel;
      //     this.kitchenPersonOptions.forEach(item=>{
      //         if (item.dictValue === row.checker) {
      //             dictLabel = item.dictLabel
      //         }
      //     })
      //   return dictLabel;
      // })
      return this.selectDictLabel(this.kitchenPersonOptions, row.checker)
    },
    // 消毒方式字典翻译
    disinfectWayFormat(row, column) {
      return this.selectDictLabel(this.disinfectWayOptions, row.disinfectWay)
    },
    // 岗位字典翻译
    positionFormat(row, column) {
      return this.selectDictLabel(this.positionOptions, row.position)
    },
    getHealthCertificate(val) {
      if (val) {
        if (val.issueTime) {
          var myDate = new Date().setFullYear(new Date().getFullYear() +1)
          var now = myDate.valueOf()
          var time = new Date(val.issueTime).valueOf()
          if (now < time) {
            return '异常'
          } else {
            return '正常'
          }
        } else {
          return '异常'
        }

      }
      return '异常'
    },
    getUrl(val) {
      return process.env.VUE_APP_PICTURE_PATH + val
    },
    getDefaultUrl(val) {
      if (val) {
        return process.env.VUE_APP_PICTURE_PATH + val
      } else {
        return Nophoto
      }
    },
    /** 查询设备关联管理列表 */
    getList() {
      this.operationVideoList = []
      listOperationVideo(this.queryParams).then(response => {
        this.operationVideoList = response.rows

        if (this.operationVideoList.length > 0) {
          this.initVideo()
        } else {
          var default1 = {
            deviceCode: '',
            deviceName: '无设备',
            previewPic: Exclamation
          }
          this.operationVideoList.push(default1)
          this.operationVideoList.push(default1)
          this.operationVideoList.push(default1)
        }
      })
    },
    getMorningCheck() {
      let that = this
      listMorningCheck(this.queryParams).then(response => {
        response.rows.forEach(index => {
          let item = []
          item.push(index.checkTime)
          item.push(index.checkAllNum)
          item.push(index.checkedSum)
          item.push(index.checkNopassNum)
          //item.push(index.score1)
          that.data.push(item)
        })
        that.config = {
          header: ['晨检日期', '应检总数', '已检人数', '未过人数'],
          headerBGC: '',
          oddRowBGC: '#0c2445',
          evenRowBGC: '',
          data: that.data,
          indexHeader: '序号',
          index: true,
          columnWidth: [60, 130, 100, 100, 100],
          align: ['center', 'left', 'center', 'center', 'center'],
          rowNum: 3,
          waitTime: 3000
        }
      })
    },
    /**AI抓拍 */
    getAurora() {
      this.queryParams1.params.alertStartTime = this.queryParams1.alertTimeRange && this.queryParams1.alertTimeRange.length > 0 ? this.queryParams1.alertTimeRange[0] : undefined;
      this.queryParams1.params.alertEndTime = this.queryParams1.alertTimeRange && this.queryParams1.alertTimeRange.length > 0 ? this.queryParams1.alertTimeRange[1] : undefined;
      listAurora(this.queryParams1).then(response => {
        this.auroraList = response.rows
        this.queryParams1.num = response.total
      })
    },
    /**人工抓拍 */
    getArtificial() {
      this.queryParams2.params.alertStartTime = this.queryParams2.alertTimeRange && this.queryParams2.alertTimeRange.length > 0 ? this.queryParams2.alertTimeRange[0] : undefined;
      this.queryParams2.params.alertEndTime = this.queryParams2.alertTimeRange && this.queryParams2.alertTimeRange.length > 0 ? this.queryParams2.alertTimeRange[1] : undefined;
      listAurora(this.queryParams2).then(response => {
        this.artificialList = response.rows
        this.queryParams2.num = response.total
      })
    },
    /**
     * 获取从业人员
     */
    getKitchenPersonOptions() {
      queryKitchenPersonOptions({}).then(res => {
        res.data.forEach(item => {
          this.kitchenPersonOptions.push({ dictLabel: item.name, dictValue: item.id })
        })
        this.getKillProcessSupervise()

      })
    },
    getKillProcessSupervise() {
      let that = this
      listKillProcessSupervise(this.queryParams).then(response => {
        this.$nextTick(() => {
          response.rows.forEach(index => {
            if (index.checker) {
              let item = []
              item.push(that.killObjFormat(index))
              item.push(index.killStartTime)
              item.push(that.cleanWayFormat(index) + '/' + that.disinfectWayFormat(index))
              item.push(that.checkerFormat(index))
              //item.push(index.score1)
              that.data1.push(item)
            }

          })
          that.config1 =
            {
              header: ['对象', '时间', '清洗/消毒', '检查人'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: that.data1,
              indexHeader: '序号',
              index: true,
              columnWidth: [70, 100, 120, 150, 90],
              align: ['center', 'left', 'center', 'center', 'center'],
              rowNum: 3,
              waitTime: 3000
            }
        })
      })
    },
    getKitchenPerson() {
      listKitchenPerson(this.queryParams).then(response => {
        this.kitchenPersonList = response.rows
      })
    },
    //切换视频播放
    playVideo(index) {
      this.curKitchen = index

      //   var main = document.getElementsByName('typeName')
      //   if (main) {
      //     main.forEach(item => {
      //       item.style = "font-weight: ''"
      //     })
      //   }
      //   var main1 = document.getElementById(index)
      //   console.log(main1)
      //   main1.style = "font-weight: bold"
      this.initVideo()
    },
    initVideo() {
      // if (this.$envConfig.env.startsWith('development')) {
      //   this.$toast("开发环境，暂不加载视频")
      //   return
      // }
      if (this.operationVideoList.length > 0) {
        let deviceId = this.operationVideoList[this.curKitchen].deviceCode
        this.videoName = this.operationVideoList[this.curKitchen].deviceName
        this.playVideo1(deviceId)

      }
    },
    playVideo1(id) {
      console.log(id)
      //   if (this.player) {
      //     this.player.destroy(this.video_addr)
      //     this.player = null;
      //   }
      let tag = this.getTag()
      let that = this

      axios.get(process.env.VUE_APP_VIDEO_START_PLAY+'/gb28181/startPlay', {
        params: {
          deviceId: id,
          tag: tag
        }
      }).then(res => {
        //获取你需要用到的数据
        console.log(res)
        if (res.data.code == 0) {
          console.log(res.data)
          //   that.video_addr = res.data.http_flv
          that.showLive = true
          that.videoUrl = res.data.http_flv_wan
          console.log(that.videoUrl)
        } else {
          this.showLive = false
          //   this.videoErrorInfo = res.data.message;
          that.videoUrl = null
        }
      })
    },
    getTag() {
      let num = ''
      for (let i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10)
      }
      return num
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/main.scss';

.inspectPanelContent {
  overflow: hidden; /*清除浮动*/
  background-size: 100% 100%;
  color: #ffffff;
  width: 1250px;
}

.nameDiv {
  width: 100%;
  margin-bottom: 7px;
  margin-top: 7px;
  height:16px;
  .nameDivBg{
    float:left;
    width:10px;
    height:10px;
    background:#ffffff;
    margin-top:3px;
    margin-right:6px;
  }
  .nameDivTitle{

    display:-webkit-box;
    -webkit-line-clamp:1;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }
}
.content_module_title /deep/ .el-range-editor--small .el-range-separator {
    line-height: 18px;
    font-size: 13px;
    color: #ffffff;
}
.content_module_title /deep/ .el-range-input {
  background-color:#185695;
  color: #ffffff;
}
.box1 {
  width: 30%;
  float: left;
}

.box1 .a1 {
  height: 170px;
  border: 2px solid #005286;


}

.box1 .a2 {
  height: 171px;
  border: 2px solid #005286;
  margin-top: 8px;

}

.box1 .a3 {
  height: 171px;
  border: 2px solid #005286;
  margin-top: 8px;
}

.box2 {
  width: 39%;
  margin: 0 auto;
  position: relative;
}

.box2 .a1 {
  height: 528px;
  border: 2px solid #005286;

}

.box3 {
  width: 30%;
  float: right;

}

.box3 .a1 {
  height: 260px;
  border: 2px solid #005286;
}

.box3 .a2 {
  height: 260px;
  border: 2px solid #005286;
  margin-top: 8px;
}
#div1::-webkit-scrollbar{
	display: none;
}
#box::-webkit-scrollbar{
	display: none;
}
.demo-image__lazy .el-image {
    display: block;
    min-height: 50px;
    margin-bottom: 1px;
}
.banner-container {
  padding: 0.5rem 0;
  // text-align: center;
  margin-top: 85px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;
  overflow-y: hidden;


  .box {
    padding: 0 0.32rem;

    .img {
      width: 10.25rem;
      height: 8.06rem;
    }

    .label {
      font-size: 0.9rem;
      // text-align: center;
      margin-top: 5px;
      margin-bottom: 12px;
      color: #ffffff;
    }
  }
}
</style>
