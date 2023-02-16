<template>
  <div class="navbar-top-header">
    <ul class="layui-nav layui-bg-none">
<!--      <li v-for="(item,index) in menuList"  v-if="item.meta && index < dataSize" :class="index===0?'current menu-top-icon':'menu-top-icon'"-->
      <li v-for="(item,index) in menuList" class="menu-top-icon" v-if="item.meta && index < dataSize"
          :menuName="item.meta.title">
        <router-link :to="item.path" class="link-type" v-if="!item.children && item.visible === '0'">
          <span> <svg-icon slot="prefix" class="menu-icon" :icon-class="item.meta && item.meta.icon"/>{{
              item.meta.title
            }}</span>
        </router-link>
<!--        <span v-if="item.children && item.visible === '0'" @click="showLeftMenu(item,$event)" class="first-menu">-->
        <span v-if="item.children && item.visible === '0'" @click="showLeftMenu(item,$event)" class="first-menu" :style="{color:(index==0?'#409EFF':'#fff'),fontWeight:(index==0?'bold':'normal')}">
          <i slot="prefix" :class="item.meta && item.meta.icon" /> {{ item.meta.title }}
        </span>
      </li>
      <li class="more-menu-li">
        <span @click="showMore" v-if="isShowMore">
              <i slot="prefix" class="fa fa-angle-double-right" /> 更多
        </span>
        <div class="more-menu-box">
          <div class="more-menu-item" v-for="(item,index) in menuList" v-if="item.meta && index >= dataSize"
               :menuName="item.meta.title">
            <router-link :to="item.path" class="link-type" v-if="!item.children && item.visible === '0'">
              <span><svg-icon slot="prefix" class="menu-icon" :icon-class="item.meta && item.meta.icon"/>{{item.meta.title}}</span>
            </router-link>
            <span v-if="item.children && !item.hidden" @click="showLeftMenu(item,$event)">
              <i slot="prefix" :class="item.meta && item.meta.icon" /> {{ item.meta.title }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import $ from 'jquery'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'private-top-menu',
  components: {
    SvgIcon
  },
  data() {
    return {
      dataSize: 0,
      isShowThree: false,
      ishoverThree: false,
      isShowMore: false,
      selectedMenuName: '',
      moreIcon: 'setting',
      rootMenuList: this.$store.state.permission.routes,
      menuList: []
    }
  },
  created() {
    let limit = 0;
    this.dataSize = 7;
    this.rootMenuList.forEach((menu) => {
      /*if (limit < 7) {*/
      if (menu.meta && menu.visible === '0') {
        // this.dataSize++
        limit++
        this.menuList.push(menu)
      }
      /* } else {
         if (menu.meta) {
           this.isShowMore = true
         }

       }*/
    });
    if (this.menuList.length > this.dataSize) {
      this.isShowMore = true;
    } else {
      this.isShowMore = false;
    }
    this.menuList.forEach(menu => {
      let child = [];
      if(menu.children && menu.children.length > 0){
        menu.children.forEach(item => {
          if(item.visible === '0'){
            child.push(item);
          }
        })
        menu.children = child;
      }
    });
  },
  mounted() {
    if(this.menuList.length>0){
      this.$parent.showMenuEvent(this.menuList[0],'first');
    }
  },
  methods: {
    showMore() {
      // this.$parent.showMenuEvent()

    },
    handleChange(name, path) {
      let that = this
      that.isShowThree = false
      that.ishoverThree = false
      $('.menu-pannel-child-to').css({ 'display': 'none' })


      $('.menu-pannel-child').css('display', 'none')
    },
/*    showLeftMenu(item,evt){
      $(".first-menu").css('color','#fff')
   /!*   $(".more-menu-item span").css('color','#000')*!/
      $(".layui-nav").find("li").each(function(i,n){
        $(this).removeClass("current")
      })
      $(".layui-nav .more-menu-li .more-menu-box ").find(".more-menu-item").each(function(i,n){
        $(this).removeClass("current")
      })
      $(evt.currentTarget).parent().addClass("current");
      this.$parent.showMenuEvent(item);
    }*/
    showLeftMenu(item,evt){
      $(".first-menu").css('color','#fff')
      $(".more-menu-item span").css('color','#000')
      $(".layui-nav").find("li").each(function(i,n){
        $(this).find("span").css("fontWeight","normal");
      })
      evt.currentTarget.style.color='#409EFF';
      evt.currentTarget.style.fontWeight='bold';
      this.$parent.showMenuEvent(item);
    }
  }
}
</script>
<!--<style scoped>
.navbar-top-header {
  width: calc(100% - 290px);
  margin-left: 75px;
  height: 50px;
  /* float: left; */
  position: absolute;
  z-index: 2000;
  left: 20px;
  top: 0px;
}

.layui-bg-none {
  background-color: transparent;
  /*height: 40px;*/
  /*overflow: hidden;*/
}

.layui-nav {
  position: relative;
  color: #fff;
  border-radius: 2px;
  margin: 0;
  display: flex;
  height: 100%;
  align-items: center;
}
.layui-nav li {
  padding: 0 6px;
}
.layui-nav .current {
  background: linear-gradient(#2a3966, #2a4caa);;
}
.layui-nav .current span{
  color:#ffffff !important;
}
.layui-bg-none li {
  display: flex;
  margin-right: 12px;
  height: 100%;
  font-size: 16px;
  cursor: pointer;
  align-items: center;
  position: relative;
  padding-top:2px;
}

.menu-icon {
  margin-right: 0px;
}
.more-menu-li:hover .more-menu-box{
  display: block;
}
.more-menu-box{
  display: none;
  position: absolute;
  top: 46px;
  left: 0;
  width: 180px;
  z-index: 99999999;
  color: #ffffff;
  background-color: #3c3c3d;
  box-shadow: 0px 0px 10px 1px #424040;
  border-radius: 5px;
  padding: 12px 6px;
}
.more-menu-box:before{
  content: '';
  border: 8px solid transparent;
  border-bottom: 8px solid #727171;
  position: absolute;
  top: -16px;
  left: 24px;
}
.more-menu-item{
  padding: 8px 4px;
}
.more-menu-item:first-child{
}
.more-menu-item:last-child{
/*  padding-bottom: 0;*/
}
</style>-->


<style scoped>
.navbar-top-header {
  width: calc(100% - 420px);
  margin-left: 75px;
  height: 50px;
  /* float: left; */
  position: absolute;
  z-index: 2000;
  left: 20px;
  top: 0px;
}

.layui-bg-none {
  background-color: transparent;
  /*height: 40px;*/
  /*overflow: hidden;*/
  padding-top: 2px;
}

.layui-nav {
  position: relative;
  color: #fff;
  border-radius: 2px;
  margin: 0;
  display: flex;
  height: 100%;
  align-items: center;
}

.layui-bg-none li {
  display: flex;
  margin-right: 25px;
  height: 100%;
  font-size: 17px;
  cursor: pointer;
  align-items: center;
  position: relative;
}

.menu-icon {
  margin-right: 0px;
}
.more-menu-li:hover .more-menu-box{
  display: block;
}
.more-menu-box{
  display: none;
  position: absolute;
  top: 38px;
  left: 0;
  width: 180px;
  z-index: 99999999;
  color: #000;
  background-color: #FFF;
  box-shadow: 0px 0px 10px 1px #aeaeae;
  border-radius: 5px;
  padding: 15px;
}
.more-menu-box:before{
  content: '';
  border: 8px solid transparent;
  border-bottom: 8px solid #FFF;
  position: absolute;
  top: -16px;
  left: 24px;
}
.more-menu-item{
  padding: 8px 0;
}
.more-menu-item:first-child{
  padding-top: 0;
}
.more-menu-item:last-child{
  padding-bottom: 0;
}
</style>
