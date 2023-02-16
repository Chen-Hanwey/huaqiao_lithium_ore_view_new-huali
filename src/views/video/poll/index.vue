<template>
  <div class="app-container" style="overflow:hidden;">
    <el-row :gutter="20">
      <!--左侧-->
      <el-col :span="5" :xs="24" style="padding-right: 0px!important;">
        <div class="head-container treeShow" :style="{'height':treeHeight+'px', 'overflow': 'auto','background':' #ffffff',}">
          <div style="padding: 5px 5px">
            轮巡预案<span style="float: right;cursor:pointer;" @click="addPoll"><i class="el-icon-plus"></i></span>
          </div>

          <div style="width: 100%;height: 5px;background-color: #f7f7f7;margin-bottom: 10px"></div>
          <el-tree :data="videoTreeData" :props="defaultProps">
            <div style="width: 100%;" slot-scope="{ node, data }">
              <div>
                <span :title="node.label" style="width: 75%;white-space: nowrap;overflow: hidden;
                text-overflow: ellipsis;display: block;float: left;">{{ node.label }}</span>
                <span v-if="data.pollName===undefined" style="width: 25%;">
                  <span style="width: 100%;text-overflow: ellipsis;display: block;padding-left: 80%" v-if="data.status===0" class="isDisabled">离线</span>
                  <span style="width: 100%;text-overflow: ellipsis;display: block;padding-left: 80%" v-else-if="data.status===1" class="isEnabled">在线</span>
                  <span style="width: 100%;text-overflow: ellipsis;display: block;padding-left: 80%" v-else class="isEnable">离线</span>
                </span>
                <span style="float: right;margin-right: 5px" v-if="node.isLeaf==false">
                <el-popover
                  placement="right"
                  width="60"
                  trigger="hover">
                  <span slot="reference" class="el-icon-setting"></span>
                  <div>
                    <el-row>
                      <el-button type="primary" style="width: 100%;margin: 2px;" size="mini" plain @click="zuPolly(data)">组内轮巡</el-button>
                    </el-row>
                    <el-row>
                      <el-button type="primary" style="width: 100%;margin: 2px;" size="mini" plain @click="editPolly(data)">修改轮巡</el-button>
                    </el-row>
                    <el-row>
                      <el-button type="danger" style="width: 100%;margin: 2px;" size="mini" plain @click="delPolly(data)">删除</el-button>
                    </el-row>
                  </div>
                </el-popover>
              </span>
              </div>
            </div>
          </el-tree>
        </div>
      </el-col>
      <!--右侧视频-->
      <el-col :span="19" :xs="24">
        <el-card :style="{height:contentHeight, overflow: 'auto',width:'100%'}">
          <div class="right-container">
            <div class="right-container-top" style="margin-bottom:3px;">
              <el-radio-group v-model="video.screenNum" size="medium" @change="changeShowType">
                <el-radio-button label="1">单屏</el-radio-button>
                <el-radio-button label="4">四分屏</el-radio-button>
                <el-radio-button label="9">九分屏</el-radio-button>
                <el-radio-button label="16">十六分屏</el-radio-button>
              </el-radio-group>
              <el-button type="primary" plain style="float:right;margin-right:4px;" @click="toggleFullscreen">全屏</el-button>
            </div>
            <fullscreen :fullscreen.sync="video.fullscreen">
              <div class="right-container-video" style="background:#ffffff;">
                <el-row :gutter="0">
                  <el-col :span="video.playerSpan" v-for="(item,index) in video.videoList" :key="item.id"
                          style="padding-left:1px;padding-right: 1px;">
                    <div style="margin-top:2px;">
                      <!--<div  v-if="item.pollyData.length>0">
                        <el-carousel :height="videoHeight" :width="videoWidth" :interval="5000"   arrow="always">
                          <el-carousel-item v-for="(itemy,indexy) in item.pollyData" :key="indexy">
                            <div style="{width: 100%}" :id="'video_' + index + indexy" ></div>
                          </el-carousel-item>
                        </el-carousel>
                      </div>-->
                      <!--<div v-else>
                        <el-carousel :height="videoHeight" :width="videoWidth" :interval="5000"   arrow="false">
                          <el-carousel-item style="background-color: black;" >
                            <div style="{width: 100%}" :id="'video_' + index" ></div>
                          </el-carousel-item>
                        </el-carousel>
                      </div>-->
                      <div style="margin-top:2px;border: 2px solid #ffffff" :id="'video_border' + index" @mouseover="mouseOverViedo(item)"
                           @mouseleave="mouseLeaveViedo(item)">
                      <div style="{width: 100%}" :id="'video_' + index" ></div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </fullscreen>
            <div class="right-container-bottom" style="margin-top:6px;margin-bottom: -10px;">
              <el-switch v-model="delivery" v-if="pageList.length<=0" disabled @change="changeSwitch" style="margin-left: 10px;" title="开启/暂停"></el-switch>
              <el-switch v-model="delivery" v-if="pageList.length>0" @change="changeSwitch" style="margin-left: 10px;" title="开启/暂停"></el-switch>
              <el-button type="primary" style="margin-left: 10px" size="mini" @click="closeAll">关闭</el-button>
              <el-select v-model="pollTime"  placeholder="轮巡时间" size="mini"
                         style="margin-left: 10px;width: 80px;">
                <!--<el-option label="5s" value="5"></el-option>-->
                <el-option label="15s" value="15"></el-option>
                <el-option label="30s" value="30"></el-option>
                <el-option label="60s" value="60"></el-option>
              </el-select>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="添加轮巡" :visible.sync="open" class="_baseForm_big">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="轮巡主题" prop="pollName">
              <el-input v-model="form.pollName" placeholder="请输入轮巡主题" maxlength = "15"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择设备">
              <el-row :span="24">
                <tree-transfer :title="title" :from_data='formData'  :pid="parentId" class="titleClass"
                               :to_data='toData'
                               :defaultProps="{label:'label',children: 'children' }"
                               @add-btn='add'
                               @remove-btn='remove'
                               :height="tableHeight-280+'px'"
                               filter openAll>
                </tree-transfer>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div>
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'
  //import { ArgesWebControlPlug } from '@/utils/arges/arges.min.js'
  import treeTransfer from 'el-tree-transfer'
  //import { getTreeSquareHjq } from '@/api/project/peacecountry/liveVideo'
  import { addPoll, delPoll, listPoll, updatePoll } from '@/api/video/poll'
  import { getDeviceStream } from '@/api/video/device'
  import VueFullscreen from 'vue-fullscreen'
  import { mapGetters } from 'vuex'
  import Vue from 'vue'

  Vue.use(VueFullscreen)
  export default {
    name: 'VideoPoll',
    components: {
      treeTransfer
    },
    computed: {
      ...mapGetters([
        'videoType',
        'tenantId'
      ]),
    },
    data() {
      return {
        delivery:true,
        pollTime:"60",
        parentId:'parentId',
        open: false,
        oWebControl: null,
        treeHeight: 450,
        contentHeight: $(window).height() - 90 + 'px',
        form: {
          pollName: undefined
        },
        rules: {
          pollName: [
            { required: true, message: "轮巡主题不能为空", trigger: "blur" }
          ],
        },
        videoTreeData:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        toData:[],
        title:['未选设备','已选设备'],
        addTreeData: [],
        tableHeight: 400,
        tableOffset: 138,
        video: {
          screenNum: 4,
          fullscreen: false,
          pollNum: 0,
          playerHeight: null,
          playerSpan: 24,
          poster: require('@/assets/images/video/black.png'),
          videoList: [],
          haveVideo: false,
          timer: '',
          refreshTime: 10000
        },
        playVideoList: [],
        videoWidth:($(window).width() - 550)/2 ,
        videoHeight:($(window).height() - 106 -77-20)/2 ,
        videoPlay:($(window).height())/2 ,
        videoErrorCount: 0,//视频播放加载失败次数
        videoPlugId: null,//视频播放插件id
        videoWindow: {
          x: 0,
          idzt: [],
          rect: {}, //弹窗左上坐标和宽高
          mask: [] //需要传给插件的弹窗的数组
        },
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
        formData:[],
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
        timer: '',
        //播放数据
        pageList:[],
        pageList0:[],
        pageList1:[],
        pageList2:[],
        pageList3:[],
        pageList4:[],
        pageList5:[],
        pageList6:[],
        pageList7:[],
        pageList8:[],
        pageList9:[],
        pageList10:[],
        pageList11:[],
        pageList12:[],
        pageList13:[],
        pageList14:[],
        pageList15:[],
        timer0:'',
        timer1:'',
        timer2:'',
        timer3:'',
        timer4:'',
        timer5:'',
        timer6:'',
        timer7:'',
        timer8:'',
        timer9:'',
        timer10:'',
        timer11:'',
        timer12:'',
        timer13:'',
        timer14:'',
        timer15:'',
      }
    },
    mounted() {
      let that = this
      that.changeShowType()
      //that.queryList();
      this.treeHeight = window.innerHeight - 100;
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.tableOffset - 100;
      });
    },
    beforeDestroy () {
      let that = this
      that.closeAll()
      /*clearInterval(that.timer)
      clearInterval(that.timer)
      that.clearVideoList()*/
    },
    methods: {
      callbackfun(e) {
        console.log('callbackfun', e);
      },
      queryList() {
        listPoll(this.queryParams).then(response => {
          this.videoTreeData = response.rows;
        });

      },
      // 获取广场视频树
      initTreeSquare () {
        let that = this
        let query = {
          name: that.tree.square.search
        }
        /*getTreeSquareHjq(query).then(response => {
          that.formData = response.data;
        })*/
      },
      //点击组内轮巡
      zuPolly(data){
        let that = this;
        let index = 0;
        let onLineDev = []
        data.children.forEach(function(itemc) {
          if(itemc.status === 1){
            onLineDev.push(itemc)
          }
        })
        if(onLineDev.length>0){
          //that.initVideoSpan(that.video.screenNum);
          //console.log(that.video.videoList)
          that.pageList = onLineDev;
          //that.msgInfo("选择成功，请点击播放器，开始轮巡");
          for (let i = 0; i < that.video.videoList.length; i++) {
            let item = that.video.videoList[i]
            //初始化，先关闭所有播放中的
            that.closeViedoAll(i);
            item["pollyData"] = onLineDev;
          }
          that.$nextTick(() => {
            that.pollPlay()
          })
        }else {
          that.msgError("组内没有在线设备")
        }
      },
      //点击播放器
      pollPlay(number){
        let that = this;
        clearTimeout(that.timer1)
        let pollyData = that.pageList;
        if(pollyData.length<=0){
          that.msgError("请先选择组内轮巡")
          return;
        }
        let chunk = 4;
        if(that.video.videoList.length==1){//一屏
          chunk = 1;
        }else if(that.video.videoList.length==4){//4屛
          chunk = 4;
        }else if(that.video.videoList.length==9){//9屛
          chunk = 9;
        }else if(that.video.videoList.length==16){//16屛
          chunk = 16;
        }
        if(chunk==1){//只有一屏
          if(that.delivery) {//轮巡开关打开
            for(let j=0;j<pollyData.length;j++) {//遍历需播放的列表
              if(j==0){//只有一条数据，直接播放
                that.playVideo(0,pollyData[j].id,pollyData)
              }else {//有多条数据，根据时间轮巡
                (function (k) {
                  that.timer0 = setTimeout(function timer() {
                    that.playVideo(0, pollyData[j].id, pollyData)
                  }, parseFloat(that.pollTime) * 1000 * k);
                })(j);
              }
            }
          }else{
            that.playVideo(0,pollyData[0].id,pollyData)
          }
        }else{
          let pollyDatas = []
          for(let i = 0, j = pollyData.length; i < j ;i+=chunk) {
            pollyDatas.push(pollyData.slice(i,i + chunk))
          }
          if(pollyDatas.length>0){
            if(that.delivery) {//轮巡开关打开
              let newDatas = [];
              for (let i=0;i<pollyDatas.length;i++){
                let pollys = pollyDatas[i];
                if(pollys.length>0){
                  if(i==0) {//第一组数据，直接播放
                    console.log("【第一组数据】")
                    console.log(pollys)
                    for (let k=0;k<pollys.length;k++){
                      that.playVideo(k,pollys[k].id,pollyData)
                    }
                  }else{
                    (function (k) {
                      that.timer0 = setTimeout(function timer() {
                        if(pollys.length<chunk){
                          let lenNum = chunk-pollys.length;
                          for(let s=0;s<lenNum;s++){//截取第一组的前几个数据
                            pollys.push(pollyDatas[0][s])
                          }
                          newDatas = pollys;
                        }
                        that.$nextTick(() => {
                          for (let g=0;g<pollys.length;g++){
                            that.playVideo(g,pollys[g].id,pollyData)
                          }
                        })
                        /*for(let x=pollys.length;x<chunk;x++){
                          that.closeViedoAll(x);
                        }*/
                        if(pollyDatas.length==(i+1)){
                          let pollyDataNew = JSON.parse(JSON.stringify(pollyData))//that.pageList;
                          console.log(pollyDataNew)
                          for(let jj=0;jj<newDatas.length;jj++){
                            for(let ss=0;ss<pollyDataNew.length;ss++) {//遍历需播放的列表
                              if(pollyDataNew[ss].id==newDatas[jj].id){
                                pollyDataNew.splice(ss,1)
                              }
                            }
                          }
                          that.$nextTick(() => {
                            for(let tt = 0;tt<pollyDataNew.length;tt++){
                              newDatas.push(pollyDataNew[tt])
                            }
                            that.pageList = newDatas;
                            console.log("组装最新的pagelist")
                            console.log(newDatas)
                            //组装最新的pagelist
                            that.timer1 = setTimeout(() => {
                              console.log("===============重新开始")
                              that.pollPlay()
                            }, parseFloat(that.pollTime)*1000);
                          })
                        }
                      }, parseFloat(that.pollTime) * 1000 * k);
                    })(i);
                  }
                }
              }
            }else{//只播放第一屏
              for (let i=0;i<pollyDatas.length;i++) {
                let pollys = pollyDatas[i];
                if (pollys.length > 0) {
                  if (i == 0) {//第一组数据，直接播放
                    console.log("【第一组数据】")
                    console.log(pollys)
                    for (let k = 0; k < pollys.length; k++) {
                      that.playVideo(k, pollys[k].id, pollyData)
                    }
                  }
                }
              }
            }
          }
        }
        /*if(that.delivery){//轮巡开关打开
          for(let j=0;j<pollyData.length;j++) {//遍历需播放的列表
            if(j==0){//只有一条数据，直接播放
              that.playVideo(number,pollyData[j].id,pollyData)
            }else{//有多条数据，根据时间轮巡
              if(number==0){
                (function(k) {
                  that.timer0 = setTimeout( function timer() {
                    that.playVideo(number,pollyData[j].id,pollyData)
                  }, parseFloat(that.pollTime)*1000*k);
                })(j);
              }else if(number==1){
                that.timer1 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==2){
                that.timer2 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==3){
                that.timer3 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==4){
                that.timer4 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==5){
                that.timer5 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==6){
                that.timer6 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==7){
                that.timer7 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==8){
                that.timer8 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==9){
                that.timer9 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==10){
                that.timer10 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==11){
                that.timer11 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==12){
                that.timer12 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==13){
                that.timer13 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==14){
                that.timer14 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }else if(number==15){
                that.timer15 = setTimeout(() => {
                  that.playVideo(number,pollyData[j].id,pollyData)
                }, parseFloat(that.pollTime)*1000);
              }
            }
          }
        }else{//未打开轮巡，播放第一个
          that.playVideo(number,pollyData[0].id)
        }*/
        /*that.$nextTick(() => {
          that.pageList=[]
        })*/
      },
      //播放
      playVideo(number,macId,pollyData){
        let that = this;
        if(number==0){
          if(that.pageList0[0]){
            that.player0.destroy(that.pageList0[0].videoUrl);
            that.player0 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList0=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==1){
          if(that.pageList1[0]){
            that.player1.destroy(that.pageList1[0].videoUrl);
            that.player1 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList1=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==2){
          if(that.pageList2[0]){
            that.player2.destroy(that.pageList2[0].videoUrl);
            that.player2 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList2=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==3){
          if(that.pageList3[0]){
            that.player3.destroy(that.pageList3[0].videoUrl);
            that.player3 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList3=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==4){
          if(that.pageList4[0]){
            that.player4.destroy(that.pageList4[0].videoUrl);
            that.player4 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList4=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==5){
          if(that.pageList5[0]){
            that.player5.destroy(that.pageList5[0].videoUrl);
            that.player5 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList5=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==6){
          if(that.pageList6[0]){
            that.player6.destroy(that.pageList6[0].videoUrl);
            that.player6 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList6=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==7){
          if(that.pageList7[0]){
            that.player7.destroy(that.pageList7[0].videoUrl);
            that.player7 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList7=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==8){
          if(that.pageList8[0]){
            that.player8.destroy(that.pageList8[0].videoUrl);
            that.player8 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList8=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==9){
          if(that.pageList9[0]){
            that.player9.destroy(that.pageList9[0].videoUrl);
            that.player9 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList9=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==10){
          if(that.pageList10[0]){
            that.player10.destroy(that.pageList10[0].videoUrl);
            that.player10 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList10=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==11){
          if(that.pageList11[0]){
            that.player11.destroy(that.pageList11[0].videoUrl);
            that.player11 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList11=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==12){
          if(that.pageList12[0]){
            that.player12.destroy(that.pageList12[0].videoUrl);
            that.player12 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList12=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==13){
          if(that.pageList13[0]){
            that.player13.destroy(that.pageList13[0].videoUrl);
            that.player13 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList13=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==14){
          if(that.pageList14[0]){
            that.player14.destroy(that.pageList14[0].videoUrl);
            that.player14 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList14=[{number:number,macId:macId,pollyData:pollyData}]
        }else if(number==15){
          if(that.pageList15[0]){
            that.player15.destroy(that.pageList15[0].videoUrl);
            that.player15 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
          that.pageList15=[{number:number,macId:macId,pollyData:pollyData}]
        }
        that.$nextTick(() => {
          let query = {
            macId: macId
          }
          getDeviceStream(query).then(response => {
            let videoUrl = response.data
            if(videoUrl){
              if(number==0){
                that.pageList0[number].videoUrl = videoUrl;
                that.player0.play(videoUrl, 1)
              }else if(number==1){
                that.pageList1[0].videoUrl = videoUrl;
                that.player1.play(videoUrl, 1)
              }else if(number==2){
                that.pageList2[0].videoUrl = videoUrl;
                that.player2.play(videoUrl, 1)
              }else if(number==3){
                that.pageList3[0].videoUrl = videoUrl;
                that.player3.play(videoUrl, 1)
              }else if(number==4){
                that.pageList4[0].videoUrl = videoUrl;
                that.player4.play(videoUrl, 1)
              }else if(number==5){
                that.pageList5[0].videoUrl = videoUrl;
                that.player5.play(videoUrl, 1)
              }else if(number==6){
                that.pageList6[0].videoUrl = videoUrl;
                that.player6.play(videoUrl, 1)
              }else if(number==7){
                that.pageList7[0].videoUrl = videoUrl;
                that.player7.play(videoUrl, 1)
              }else if(number==8){
                that.pageList8[0].videoUrl = videoUrl;
                that.player8.play(videoUrl, 1)
              }else if(number==9){
                that.pageList9[0].videoUrl = videoUrl;
                that.player9.play(videoUrl, 1)
              }else if(number==10){
                that.pageList10[0].videoUrl = videoUrl;
                that.player10.play(videoUrl, 1)
              }else if(number==11){
                that.pageList11[0].videoUrl = videoUrl;
                that.player11.play(videoUrl, 1)
              }else if(number==12){
                that.pageList12[0].videoUrl = videoUrl;
                that.player12.play(videoUrl, 1)
              }else if(number==13){
                that.pageList13[0].videoUrl = videoUrl;
                that.player13.play(videoUrl, 1)
              }else if(number==14){
                that.pageList15[0].videoUrl = videoUrl;
                that.player14.play(videoUrl, 1)
              }else if(number==15){
                that.pageList15[0].videoUrl = videoUrl;
                that.player15.play(videoUrl, 1)
              }
              that.$forceUpdate()
            }
          })
          console.log("【播放器】"+number+"【设备mac】"+macId)
        })
      },
      changeSwitch(){
        let that = this;
        if(this.delivery){
          that.pollPlay()
          /*for (let i = 0; i < that.video.videoList.length; i++) {
            let item = that.video.videoList[i]
            if(i==0 && that.pageList0.length>0){
              that.pageList = that.pageList0[0].pollyData
              that.pollPlay(0);
            }else if(i==1 && that.pageList1.length>0){
              that.pageList = that.pageList1[0].pollyData
              that.pollPlay(1);
            }else if(i==2 && that.pageList2.length>0){
              that.pageList = that.pageList2[0].pollyData
              that.pollPlay(2);
            }else if(i==3 && that.pageList3.length>0){
              that.pageList = that.pageList3[0].pollyData
              that.pollPlay(3);
            }else if(i==4 && that.pageList4.length>0){
              that.pageList = that.pageList4[0].pollyData
              that.pollPlay(4);
            }else if(i==5 && that.pageList5.length>0){
              that.pageList = that.pageList5[0].pollyData
              that.pollPlay(5);
            }else if(i==6 && that.pageList6.length>0){
              that.pageList = that.pageList6[0].pollyData
              that.pollPlay(6);
            }else if(i==7 && that.pageList7.length>0){
              that.pageList = that.pageList7[0].pollyData
              that.pollPlay(7);
            }else if(i==8 && that.pageList8.length>0){
              that.pageList = that.pageList8[0].pollyData
              that.pollPlay(8);
            }else if(i==9 && that.pageList9.length>0){
              that.pageList = that.pageList9[0].pollyData
              that.pollPlay(9);
            }else if(i==10 && that.pageList10.length>0){
              that.pageList = that.pageList10[0].pollyData
              that.pollPlay(10);
            }else if(i==11 && that.pageList11.length>0){
              that.pageList = that.pageList11[0].pollyData
              that.pollPlay(11);
            }else if(i==12 && that.pageList12.length>0){
              that.pageList = that.pageList12[0].pollyData
              that.pollPlay(12);
            }else if(i==13 && that.pageList13.length>0){
              that.pageList = that.pageList13[0].pollyData
              that.pollPlay(13);
            }else if(i==14 && that.pageList14.length>0){
              that.pageList = that.pageList14[0].pollyData
              that.pollPlay(14);
            }else if(i==15 && that.pageList15.length>0){
              that.pageList = that.pageList15[0].pollyData
              that.pollPlay(15);
            }
          }*/
        }else{//关闭轮巡
          clearTimeout(that.timer0)
          clearTimeout(that.timer1)
          /*for (let i = 0; i < that.video.videoList.length; i++) {
            if(i==0 && that.pageList0.length>0){
              clearTimeout(that.timer0)
            }else if(i==1 && that.pageList1.length>0){
              clearTimeout(that.timer1)
            }else if(i==2 && that.pageList2.length>0){
              clearTimeout(that.timer2)
            }else if(i==3 && that.pageList3.length>0){
              clearTimeout(that.timer3)
            }else if(i==4 && that.pageList4.length>0){
              clearTimeout(that.timer4)
            }else if(i==5 && that.pageList5.length>0){
              clearTimeout(that.timer5)
            }else if(i==6 && that.pageList6.length>0){
              clearTimeout(that.timer6)
            }else if(i==7 && that.pageList7.length>0){
              clearTimeout(that.timer7)
            }else if(i==8 && that.pageList8.length>0){
              clearTimeout(that.timer8)
            }else if(i==9 && that.pageList9.length>0){
              clearTimeout(that.timer9)
            }else if(i==10 && that.pageList10.length>0){
              clearTimeout(that.timer10)
            }else if(i==11 && that.pageList11.length>0){
              clearTimeout(that.timer11)
            }else if(i==12 && that.pageList12.length>0){
              clearTimeout(that.timer12)
            }else if(i==13 && that.pageList13.length>0){
              clearTimeout(that.timer13)
            }else if(i==14 && that.pageList14.length>0){
              clearTimeout(that.timer14)
            }else if(i==15 && that.pageList15.length>0){
              clearTimeout(that.timer15)
            }
          }*/
        }
      },
      //删除轮巡预案
      delPolly(row) {
        const ids = row.id;
        this.$confirm('是否确认删除此轮巡预案数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delPoll(ids);
        }).then(() => {
          this.queryList();
          this.msgSuccess("删除成功");
        })
      },
      editPolly(data){
        this.initTreeSquare()
        this.open = true;
        this.toData = data.children
        this.form.pollName = data.pollName
        this.form.id = data.id
      },
      submitForm() {
        if(this.toData.length === 0){
          this.msgError("请选择设备");
        } else {
          this.$refs["form"].validate(valid => {
            if (valid) {
              let devIds = [];
              this.toData.forEach(function(item) {
                devIds.push(item.cameraId===undefined?item.id:item.cameraId)
              })
              this.form["devId"] = devIds.join(",");
              if (this.form.id != null) {
                updatePoll(this.form).then(response => {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.queryList();
                });
              } else {
                addPoll(this.form).then(response => {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.queryList();
                });
              }
            }
          });
        }
      },
      add(fromData,toData,obj){
        let that =this;
        let thisData = []
        toData.forEach(function (item) {
          let dd = item.cameraId===undefined?item.id:item.cameraId;
          if (dd!=null && dd.length>10) {
            thisData.push(item)
          }
        })
        that.toData = thisData;
      },
      remove(fromData,toData,obj){
      },
      addPoll() {
        this.initTreeSquare()
        this.form.pollName = '';
        this.form.id = null;
        this.toData = [];
        this.open = true
      },
      clearVideoList() {
        let that = this
        that.closeAll()
        /*that.playVideoList.forEach(function(item) {
          //item.stop();
          item= null;
        })*/
        that.video.videoList = []
        that.haveVideo = false
      },
      // 设置分屏高度
      initVideoSpan(videoNum) {
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
        this.delivery=true
        this.pollTime="60"
      },
      // 修改大屏、四屏、九屏、十六屏
      changeShowType() {
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
            pollyData:[],
            index: i,
            activity: false,
            player:null,
            url:''
          })
        }
        //初始化播放器
        setTimeout(function () {
          console.log(that.videoList)
          for (let i = 0; i < that.video.screenNum; i++) {
            if(i==0){
              that.player0 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==1){
              that.player1 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==2){
              that.player2 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==3){
              that.player3 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==4){
              that.player4 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==5){
              that.player5 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==6){
              that.player6 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==7){
              that.player7 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==8){
              that.player8 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==9){
              that.player9 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==10){
              that.player10 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==11){
              that.player11 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==12){
              that.player12 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==13){
              that.player13 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==14){
              that.player14 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }else if(i==15){
              that.player15 = new WasmPlayer(null, 'video_'+i, this.callbackfun)
            }
          }
        },200)
      },
      // 全屏切换
      toggleFullscreen() {
        this.video.fullscreen = !this.video.fullscreen
      },
      mouseOverDiv(item) {
        this.video.videoList[item.index].closeShow = true
        this.$forceUpdate()
      },
      mouseLeaveDiv(item) {
        this.video.videoList[item.index].closeShow = false
        this.$forceUpdate()
      },
      mouseOverViedo(item) {
        $("#video_border"+item.index).css({"border":"2px solid #00a0e9"});
        this.$forceUpdate()
      },
      mouseLeaveViedo(item) {
        $("#video_border"+item.index).css({"border":"2px solid #ffffff"});
        this.$forceUpdate()
      },
      closeAll(){
        if(this.pageList.length<=0){
          //this.msgInfo("暂无播放中的组内轮巡");
          return
        }
        let that = this;
        for (let i = 0; i < that.video.videoList.length; i++) {
          let item = that.video.videoList[i]
          //初始化，先关闭所有播放中的
          that.closeViedoAll(i);
          item = [];
        }
        that.pageList = []
        clearTimeout(that.timer0)
        clearTimeout(that.timer1)
      },
      closeViedoAll(number){
        let that = this;
        clearTimeout(that.timer0)
        clearTimeout(that.timer1)
        if(number==0){
          if(that.pageList0[0]){
            that.player0.destroy(that.pageList0[0].videoUrl);
            that.player0 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==1){
          if(that.pageList1[0]){
            that.player1.destroy(that.pageList1[0].videoUrl);
            that.player1 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==2){
          if(that.pageList2[0]){
            that.player2.destroy(that.pageList2[0].videoUrl);
            that.player2 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==3){
          if(that.pageList3[0]){
            that.player3.destroy(that.pageList3[0].videoUrl);
            that.player3 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==4){
          if(that.pageList4[0]){
            that.player4.destroy(that.pageList4[0].videoUrl);
            that.player4 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==5){
          if(that.pageList5[0]){
            that.player5.destroy(that.pageList5[0].videoUrl);
            that.player5 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==6){
          if(that.pageList6[0]){
            that.player6.destroy(that.pageList6[0].videoUrl);
            that.player6 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==7){
          if(that.pageList7[0]){
            that.player7.destroy(that.pageList7[0].videoUrl);
            that.player7 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==8){
          if(that.pageList8[0]){
            that.player8.destroy(that.pageList8[0].videoUrl);
            that.player8 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==9){
          if(that.pageList9[0]){
            that.player9.destroy(that.pageList9[0].videoUrl);
            that.player9 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==10){
          if(that.pageList10[0]){
            that.player10.destroy(that.pageList10[0].videoUrl);
            that.player10 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==11){
          if(that.pageList11[0]){
            that.player11.destroy(that.pageList11[0].videoUrl);
            that.player11 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==12){
          if(that.pageList12[0]){
            that.player12.destroy(that.pageList12[0].videoUrl);
            that.player12 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==13){
          if(that.pageList13[0]){
            that.player13.destroy(that.pageList13[0].videoUrl);
            that.player13 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==14){
          if(that.pageList14[0]){
            that.player14.destroy(that.pageList14[0].videoUrl);
            that.player14 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }else if(number==15){
          if(that.pageList15[0]){
            that.player15.destroy(that.pageList15[0].videoUrl);
            that.player15 = new WasmPlayer(null, 'video_'+number, that.callbackfun)
          }
        }
      },
      closeViedo(item) {
        let query = {
          channelId: item.channelId,
          streamType: '',
          url: item.videoUrl
        }
        let obj = {
          index: item.index,
          activity: false
        }
        this.video.videoList[item.index] = obj
        this.$forceUpdate()
      },
    }
  }
</script>

<style scoped>
  .titleClass >>>.custom-tree-node span{
    color: #999;
  }
  .titleClass>>>h3{
    margin-top: 0;
  }
  .right-container {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  ::v-deep .el-tabs__item {
    padding: 0 10px;
  }

  ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  }

  .right-container-video {
  }
  .right-container-bottom{

  }
  .custom-tree-node {
    font-size: 14px;
    width: 100%;
  }

  .custom-tree-node-left {
    float: left;
    font-size: 12px;
    white-space: nowrap;
  }

  .custom-tree-node-right {
    float: right;
    font-size: 12px;
    padding-right: 4px;
    width: 25%;
  }

  .isOnline_1 {
    font-size: 12px;
  }

  .isOnline_1 .isEnable {
    color: #279c32;
  }

  .isOnline_1 .el-icon-star-on {
    color: #f90;
    font-size: 15px;
  }

  .isOnline_0 .el-icon-star-on {
    font-size: 14px;
    color: #f90;
  }

  .isOnline_0 {
    font-size: 12px;
    color: #b9b9b9;
  }
  ::v-deep  .el-tabs--border-card > .el-tabs__content {
    overflow: unset;
  }
  ::v-deep .el-tree-node > .el-tree-node__children {
    overflow: unset;
    background-color: transparent;
  }

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
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  /deep/ .el-carousel__indicators--outside {
    bottom: 0px!important;
    position: unset!important;
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
