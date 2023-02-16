<template>
  <div>
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <div>
          <keep-alive :include="cachedViews">
            <router-view :key="key" />
          </keep-alive>
          <!-- <div id='videoMonitoring1'>
            <VideoMonitoringIndex v-if="hasUserInfo" v-show="showVideo" :showIframe="true"/>
          </div> -->
        </div>
      </transition>
    </section>
  </div>
</template>

<script>
// import VideoMonitoringIndex from "@/views/openKitchen/components/index1.vue"
import { mapState } from 'vuex'

export default {
  name: 'AppMain',
  //components: {VideoMonitoringIndex},
  created () {
    setTimeout(() => {
      window.windowPostMsg('mainPage')
    }, 100);
  },
  computed: {
    cachedViews () {
      return this.$store.state.tagsView.cachedViews
    },
    ...mapState({
      showVideo: state => state.app.showVideo
    }),
    hasUserInfo () {
      console.log('-->' + this.$store.state.user.roles.length > 0);
      return this.$store.state.user.roles.length > 0;
    },
    key () {
      return this.$route.path
    }
  },
  mounted () {
    let that = this;
    window.onresize = function () { // 定义窗口大小变更通知事件
      //that.$store.state.app.screenHeight = document.documentElement.clientHeight; //窗口高度
      that.$store.dispatch('app/setScreenHeight', document.documentElement.clientHeight);
    };
  },
  watch: {
    '$route.path': {
      handler: function (newValue, oldValue) {
        if (newValue.indexOf('/AiAlarm/') === -1 || newValue.indexOf('/aiAlarm/') === -1 || newValue.indexOf('/Video/') === -1 || newValue.indexOf('/video/') === -1) {
          this.$store.dispatch('app/toggleVideo', { show: false })
        }
        if (newValue.indexOf('/AiAlarm/') > -1 || newValue.indexOf('/aiAlarm/') > -1 || newValue.indexOf('/Video/') > -1 || newValue.indexOf('/video/') > -1) {
          //去除部分非视频平台路由
          if (newValue.indexOf('/Video/aiAlarm/appear') > -1 || newValue.indexOf('/Video/devMange/operationVideo') > -1 || newValue.indexOf('/Video/device') > -1 || newValue.indexOf('/video/device') > -1) {
            this.$store.dispatch('app/toggleVideo', { show: false })
          } else {
            this.$store.dispatch('app/toggleVideo', { show: true })
          }

        }
      },
      immediate: true
    },
  }

}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
    height: calc(100vh - 84px);
    background-color: #f0f0f0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
