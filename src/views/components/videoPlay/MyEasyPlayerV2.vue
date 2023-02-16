<template>
    <div :id="id" ref="id" style="object-fit: fill;height: 282px;"></div>
</template>
<script>
import $ from 'jquery'
import { setH265PlayerCover } from './setH265PlayerCover'
export default {
    name: 'MyEasyPlayer',
    props: ['options', 'sourceUrl', 'sourceMap', 'message'],
    data() {
        return {
            id: '',
            baseOptions: {},
            playVideo: null,
            player: '',
            defaultOpts: {
                cbUserPtr: this,
                decodeType: "auto",
                // decodeType: "soft",
                openAudio: 1,
                BigPlay: false,
                Height: true
            },
            messageMapper: {
                'device is offline': '设备不在线',
                'request stream timeout': '请求视频流超时',
                'network error': '网络错误'
            }
        }
    },
    watch: {
        // 'sourceUrl': {
        //     handler (newVal) {
        //         console.log('--------------进来了')
        //         if (this.sourceUrl && this.sourceUrl != null && this.sourceUrl != "") {
        //             this.loadVideo(this.sourceUrl);
        //         } else {
        //             this.destroyVideo();
        //             this.initWasmPlayer(); // 重新初始化一遍，防止黑屏，因为多创建一遍，性能有损失。
        //         }
        //     },
        //     deep: true,
        //     immediate: true
        // },
        sourceUrl: {
            handler: function(newValue, oldValue) {
                console.log('--------------进来了')
                console.log(this.sourceUrl)
                if (this.sourceUrl && this.sourceUrl != null && this.sourceUrl != "") {
                    this.loadVideo(this.sourceUrl);
                } else {
                    this.destroyVideo();
                    this.initWasmPlayer(); // 重新初始化一遍，防止黑屏，因为多创建一遍，性能有损失。
                }
            },
            immediate: true
        },
        'message': {
            handler (newVal) {
                this.showVideoMessage(this.message);
            },
            deep: true,
            immediate: true
        }
    },
    beforeCreate() {
    },
    created() {
        let time = new Date().getTime();
        let tag = Math.floor((Math.random() * 10000) + 1);
        this.id = "videoDiv_" + time + tag;
    },
    beforeMount() {
    },
    mounted: function() {
        this.initWasmPlayer();
        this.showVideoMessage(this.message);
    },
    methods: {
        initWasmPlayer() {
            this.playVideo = document.getElementById(this.id);
            this.player = new WasmPlayer(null, this.id, this.callbackfun, this.defaultOpts);
        },
        // 回调函数
        callbackfun(e) {
            if (e == "play") {
                /* setTimeout(() => {
                    // 强制全屏
                    document.getElementsByTagName("video")[0].style.objectFit = "fill";
                }, 10); */
            }
            // console.log("MyEasyPlayer-->callbackfun: " + e);
        },
        loadVideo(newUrl) {
            const _this = this;
            this.destroyVideo();
            if (this.sourceMap && Object.keys(this.sourceMap).length > 0) {
                console.log("sourceMap: " + JSON.stringify(this.sourceMap))
            }
            this.player = new WasmPlayer(null, this.id, this.callbackfun, this.defaultOpts);
            // 为20秒断流量身打造的，用于重新生成视频地址
            this.player.onRecreateUrl = function() {
                // 定义事件，需要重新生成视频地址
                // if (_this.$parent.recreateUrl) {
                //     _this.$parent.recreateUrl(true);
                // }
                _this.$emit('playRecreateUrl');
            }
            this.player.onCompleted = function() {
                // 播放完成事件，播放完成有两种情况。1、回放时实际无流，2、服务器断流。实际上不准。
                _this.$emit('playCompleted');
            }
            this.$nextTick(() => {
                this.player.play(newUrl, 1, 0);
            })
        },
        destroyVideo() {
            if (this.player) {
                this.player.destroy();
                // window.console.log("销毁MyEasyPlayer播放组件，[url][" + this.sourceUrl + "]");
            }
        },
        showVideoMessage(message) {
            if (this.player && this.player.setMessage) {
                let msg = this.messageMapper[message];
                if (!msg) {
                    msg = message;
                }
                this.player.setMessage(msg);
            }
        },
        hideVideoMessage() {
            if (this.player && this.player.setMessageCanShow) {
                this.player.setMessageCanShow(false);
            }
        },
        // easyPlayer H265视频截图方法
        setH265PlayerCover() {
            return setH265PlayerCover(this.player, new Date().getTime());
        },
        getPlayerObject() {
            let playerUI = this.player?.playerUI;
            return playerUI;
        }
    },
    beforeDestroy() {
        this.destroyVideo();
    }
}
</script>
<style lang="less" scoped>
</style>
