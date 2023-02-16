/**
 * @author deep1nBlur
 * @email mailbrcee@gmail.com 
 * @create date 2020-11-05 09:10:05 
 * @modify date 2020-11-05 09:10:05
 * @desc [海康监控视频组件]
 *  */
<template>
  <div class="root-haikang-video" id="video-frame" :style="{
      width: sizes.width,
      height: sizes.height
    }">
    <div id="playWnd" class="playWnd">

    </div>

  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  /**
   * index :当前组件所属页面 设备管理 为空 ||实时监控 realTime
   * type : 回放 || 直播
   * code : 监控点编号 监控设备页面String || 实时监控 Array
   * time 回放时间 暂时废弃
   */
  props: ["index", "type", "code", "time", "startTime", "endTime"],
  data () {
    return {
      sizes: {
        width: "782px",
        height: "490px"
        // width: $(window).width() - 85 + 'px',
        // height: $(window).height() - 85 + 'px'
      },
      layoutFmt: {
        1: "1x1",
        2: "1x2",
        3: "1+2",
        4: "2x2",
        5: "1+5",
        6: "3+4",
        7: "3+4",
        8: "1+7",
        9: "3x3"
      },
      page: 0,
      pageNum: 1,
      show: false,
      timeRange: "",
      swfHeight: "",
      swfWidth: "",
      //初始化参数
      initparam: {},
      //监控点编号
      pointCode: "",
      pubKey: "",
      oWebControl: null,
      WebControl: null,
      playText: "插件正在启动，请稍候..."
    };
  },
  watch: {
    code (value) {
      this.startPlay(value);
    }
  },
  methods: {
    getInitParams () {
      this.initPlugin();
    },

    // 创建插件实例
    initPlugin () {
      this.$emit("update:pluginIsInit", true);
      this.oWebControl = new WebControl({
        szPluginContainer: "playWnd", // 指定容器id
        iServicePortStart: 15900, // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11", // 用于IE10使用ActiveX的clsid
        // 创建WebControl实例成功
        cbConnectSuccess: () => {
          this.oWebControl
            .JS_StartService("window", {
              // WebControl实例创建成功后 启动插件服务接口 参数固定
              dllPath: "./VideoPluginConnect.dll" // 值"./VideoPluginConnect.dll"写死
            })
            .then(
              () => {
                // 启动插件服务成功
                this.oWebControl.JS_SetWindowControlCallback({
                  // 设置消息回调
                  cbIntegrationCallBack: this.cbIntegrationCallBack
                });

                this.oWebControl
                  .JS_CreateWnd("playWnd", this.swfWidth, this.swfHeight)
                  .then(() => {
                    //JS_CreateWnd创建视频播放窗口，宽高可设定
                    this.init(); // 创建播放实例成功后初始化
                  });
              },
              () => {
                // 启动插件服务失败
              }
            );
        },
        // 创建WebControl实例失败
        cbConnectError: () => {
          this.oWebControl = null;
          this.playText = "插件未启动，正在尝试启动，请稍候...";
          this.WebControl.JS_WakeUp("VideoWebPlugin://"); // 程序未启动时执行error函数，采用wakeup来启动程序
          this.initCount++;
          if (this.initCount < 3) {
            setTimeout(() => {
              this.initPlugin();
            }, 3000);
          } else {
            this.playText =
              '插件启动失败，请检查插件是否安装！<a target="_blank" style="color: #30a8ff;text-decoration: underline;" href=" ' +
              this.initparam.hkVideoPlugin +
              '">windows下载地址(软件大小：67MB)</a>';
          }
        },
        // 异常断开：bNormalClose = false
        cbConnectClose: bNormalClose => {
          // JS_Disconnect正常断开：bNormalClose = true
          console.log(
            "%c海康插件=>插件正常断开",
            "color:#00e676",
            bNormalClose
          );
          this.oWebControl = null;
        }
      });
    },
    // 设置窗口控制回调
    setCallbacks () {
      this.oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack: this.cbIntegrationCallBack
      });
    },
    // 推送消息
    cbIntegrationCallBack (oData) {
      console.info(
        "%c海康web插件信息推送=>",
        "color:#00e676;",
        oData.responseMsg
      );
      /* showCBInfo(JSON.stringify(oData.responseMsg)); */
    },
    //初始化视频播放
    init () {
      this.getPubKey(() => {
        let appkey = '25983530'; //综合安防管理平台提供的appkey，必填
        let secret = this.setEncrypt('JUU4JBmNL9RRoDPNYHXD'); //综合安防管理平台提供的secret，必填
        let ip = '223.83.197.122'; //综合安防管理平台IP地址，必填
        let port = '17443'; //综合安防管理平台端口，若启用HTTPS协议，默认443
        port = parseInt(port);
        let layout = "1x1";
        let playMode = 1; //初始播放模式：0-预览，1-回放
        let snapDir = "D:\\SnapDir"; //抓图存储路径
        let videoDir = "D:\\VideoDir"; //紧急录像或录像剪辑存储路径
        let enableHTTPS = 1; //是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
        let encryptedFields = "secret"; //加密字段，默认加密领域为secret
        let showToolbar = 2; //是否显示工具栏，0-不显示，非0-显示
        let showSmart = 0; //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        let buttonIDs = "0,16,256,258,259,260,512,515,516,517,768,769"; //自定义工具条按钮
        this.oWebControl
          .JS_RequestInterface({
            funcName: "init",
            argument: JSON.stringify({
              appkey: appkey, //API网关提供的appkey
              secret: secret, //API网关提供的secret
              ip: ip, //API网关IP地址
              playMode: playMode, //播放模式（决定显示预览还是回放界面）
              port: port, //端口
              snapDir: snapDir, //抓图存储路径
              videoDir: videoDir, //紧急录像或录像剪辑存储路径
              layout: layout, //布局
              enableHTTPS: enableHTTPS, //是否启用HTTPS协议
              encryptedFields: encryptedFields, //加密字段
              showToolbar: showToolbar, //是否显示工具栏
              showSmart: showSmart, //是否显示智能信息
              buttonIDs: buttonIDs //自定义工具条按钮
            })
          })
          .then(oData => {
            this.oWebControl.JS_Resize(this.swfWidth, this.swfHeight);
            // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            this.$emit("update:pluginIsInit", false);
            this.playText = "";
            if (this.index == "realTime") {
              // 实时监控 批量播放 设置布局
              if (this.code.length) {
                let basicLayout = "1x1"; //基础布局
                let totalCode = this.code.length; //实时监控总条数
                let layoutPage = Math.ceil(totalCode / 9); //超过十条每页显示十条   向上取整
                // console.log("=====总页数", layoutPage);
                if (totalCode <= 9) {
                  basicLayout = this.layoutFmt[totalCode];
                } else {
                  // 大于10 时 按照"2x2" 布局
                  // 显示下一页 总页数
                  this.show = true;
                  this.pageNum = layoutPage;
                  basicLayout = "3x3";
                }
                this.oWebControl.JS_RequestInterface({
                  // 设置窗口布局
                  funcName: "setLayout",
                  argument: JSON.stringify({
                    layout: "2x2" // 窗口布局默认9
                  })
                });
              }
            }

            this.startPlay(); //初始化之后开启预览
          });
      });
    },
    // 申请 RSA 公钥，用于对敏感信息(如 appkey、secret)加密。
    getPubKey (callback) {
      this.oWebControl
        .JS_RequestInterface({
          funcName: "getRSAPubKey",
          argument: JSON.stringify({
            keyLength: 1024
          })
        })
        .then(oData => {
          // console.log(oData);
          if (oData.responseMsg.data) {
            this.pubKey = oData.responseMsg.data;
            callback();
          }
        });
    },
    //RSA加密
    setEncrypt (value) {
      let encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.pubKey);
      return encrypt.encrypt(value);
    },
    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover () {
      // let iWidth = $(window).width();
      // let iHeight = $(window).height();
      // let oDivRect = $("#playWnd")
      //   .get(0)
      //   .getBoundingClientRect();
      // let iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0;
      // let iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0;
      // let iCoverRight =
      //   oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0;
      // let iCoverBottom =
      //   oDivRect.bottom - iHeight > 0
      //     ? Math.round(oDivRect.bottom - iHeight)
      //     : 0;

      // iCoverLeft = iCoverLeft > this.swfWidth ? this.swfWidth : iCoverLeft;
      // iCoverTop = iCoverTop > this.swfHeight ? this.swfHeight : iCoverTop;
      // iCoverRight = iCoverRight > this.swfWidth ? this.swfWidth : iCoverRight;
      // iCoverBottom =
      //   iCoverBottom > this.swfHeight ? this.swfHeight : iCoverBottom;
      // this.oWebControl.JS_RepairPartWindow(
      //   0,
      //   0,
      //   this.swfWidth + 1,
      //   this.swfHeight
      // ); // 多1个像素点防止还原后边界缺失一个像素条
      // if (iCoverLeft != 0) {
      //   this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, this.swfHeight);
      // }
      // if (iCoverTop != 0) {
      //   this.oWebControl.JS_CuttingPartWindow(
      //     0,
      //     0,
      //     this.swfWidth + 1,
      //     iCoverTop
      //   ); // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      // }
      // if (iCoverRight != 0) {
      //   this.oWebControl.JS_CuttingPartWindow(
      //     this.swfWidth - iCoverRight,
      //     0,
      //     iCoverRight,
      //     this.swfHeight
      //   );
      // }
      // if (iCoverBottom != 0) {
      //   this.oWebControl.JS_CuttingPartWindow(
      //     0,
      //     this.swfHeight - iCoverBottom,
      //     this.swfWidth,
      //     iCoverBottom
      //   );
      // }
    },
    //播放监控视频 预览 || 回放 || 批量
    startPlay (val) {
      let streamMode = 1; //主子码流标识：0-主码流，1-子码流
      let transMode = 1; //传输协议：0-UDP，1-TCP
      let gpuMode = 0; //是否启用GPU硬解，0-不启用，1-启用
      var wndId = -1;
      let code1 = val
      window.console.log("视频预览")
      //视频回放
      this.oWebControl.JS_RequestInterface({
        funcName: "startPlayback",
        argument: JSON.stringify({
          cameraIndexCode: code1, //监控点编号
          startTimeStamp: this.startTime, // 录像查询开始时间戳，单位:秒
          endTimeStamp: this.endTime, // 录像查询结束时间戳，单位:秒
          recordLocation: 1, // 录像存储类型 0-中心存储 1-设备存储
          transMode: transMode,
          gpuMode: gpuMode,
          wndId: wndId
        })
      });



    },

    //停止全部预览功能
    stopAllPreview () {
      this.oWebControl.JS_RequestInterface({
        funcName: "stopAllPreview"
      });
    },
    //关闭视频窗口
    closeWindow () {
      console.log("%c海康插件=>", "color:#00e676;", "关闭页面，销毁插件实例！");
      if (this.oWebControl != null) {
        this.oWebControl.JS_HideWnd(); // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
        this.oWebControl.JS_Disconnect().then(
          () => {
            // 断开与插件服务连接成功
          },
          () => {
            // 断开与插件服务连接失败
          }
        );
      }
    }
  },
  created () {
    this.timeRange = this.time;
    this.WebControl = WebControl; //调用电脑中的插件
    if (this.index == "realTime") {
      //重新计算布局
      this.sizes = {
        width: $(window).width() - 20 + 'px',
        height: $(window).height() - 85 + 'px'
      };
    }
  },
  mounted () {
    this.closeWindow();
    // 初始化摄像头时，根据具体div获取播放宽高
    this.swfHeight = document.getElementById("video-frame").offsetHeight;
    this.swfWidth = document.getElementById("playWnd").offsetWidth;
    this.swfWidth = this.$parent.$el.offsetWidth - 20

    // 获取海康威视安防配置参数
    this.getInitParams();
    // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
    $(window).resize(() => {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(this.swfWidth, this.swfHeight);
        this.setWndCover();
      }
    });
    // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
    $(window).scroll(() => {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(this.swfWidth, this.swfHeight);
        this.setWndCover();
      }
    });
    // 监听vxe-modal 拖拽完成事件 仅在监控设备管理页面

    $(window).mouseup($evt => {
      if ($evt.target.className.indexOf("vxe-modal--header") != -1) {
        // vxe modal 表头拖拽 动态调整插件位置
        console.log(
          "%c海康插件=>",
          "color:#00e676;",
          "Modal被拖拽,动态调整插件位置"
        );
        if (this.oWebControl != null) {
          this.oWebControl.JS_Resize(this.swfWidth, this.swfHeight);
          this.setWndCover();
        }
      }
    });

  },
  beforeDestroy () {
    $(window).off(); //关闭插件之前 移除jquery所有绑定事件
    this.closeWindow(); //关闭插件
  },
};
</script>

<style lang="scss" scoped>
.root-haikang-video {
  .playWnd {
    width: 100%;
    height: 100%;
    //background-color: red;
  }
}
</style>

