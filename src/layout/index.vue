<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar :isShowMenu="isShowMenu" ref='myMenu' />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <privateTop-menu />

        <tags-view v-if="needTagsView" />
      </div>
      <app-main ref="rightMain" />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
    <div v-if="open" class="allmenu-dialog">
      <privateMenu-dialog />

    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import privateMenuDialog from '@/layout/components/Sidebar/private-menu-dialog'
import privateTopMenu from '@/layout/components/Sidebar/private-top-menu'

import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    privateMenuDialog,
    privateTopMenu,

    TagsView
  },
  mixins: [ResizeMixin],
  data () {
    return {
      menuStatus:0,
      isShowMenu:false,
      open:false
    };
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    handleClickMenu(){
      //this.open=true;
      //console.log('我被点击')
    },
    showMenuEvent(item,type){
      this.menuStatus=1;
      this.isShowMenu=true;
      this.$refs.myMenu.showSecondMenu(item);


    },
    onShowMenu(){
      this.menuStatus=1;
    },
    hideMenuEvent(){
      let that=this;
      that.menuStatus=0;
      window.setTimeout(function(){
        if(that.menuStatus == 0){
          // that.shrink = true;
          that.isShowMenu=false;
          that.$refs.myMenu.hideFirstMenu();
        }
      },1000);

    },
    hideMenuByChild(){
      this.menuStatus=0;
      // this.shrink = true;
      this.isShowMenu=false;
    },
    closeAllMenu(){
      this.open=false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
/* .allmenu-dialog{
   position: absolute;
   left: 0;
   right: 0;
   bottom: 0;
   top: 40px;
   z-index: 9999;
   background: white;
 }*/
</style>
