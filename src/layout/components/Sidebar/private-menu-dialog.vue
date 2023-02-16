<template>
  <div class="private-menu-main">
    <div class="allmenu-title">全部<i class="el-icon-close allmenu-close"></i></div>
    <div class="main-content">
      <template v-for="(item,index) in menuList" v-if="item.meta">
        <div class="first-menu">
          <router-link :to="item.path" class="link-type" v-if="!item.children">
            <span> <svg-icon slot="prefix"  class="menu-icon" :icon-class="item.meta && item.meta.icon" />{{ item.meta.title }}</span>
          </router-link>
          <span v-if="item.children">
          <svg-icon slot="prefix"  class="menu-icon" :icon-class="item.meta && item.meta.icon" /> {{item.meta.title}}
        </span>
        </div>
        <template v-for="(jtem,idx) in item.children">
          <div class="second-menu">
            <router-link :to="item.path+'/'+jtem.path" class="link-type" v-if="!jtem.children">
              <span><svg-icon slot="prefix"  class="menu-icon" :icon-class="jtem.meta && (jtem.meta.icon=='#'?'edit':jtem.meta.icon) " />{{ jtem.meta.title }}</span>
            </router-link>
            <span v-if="jtem.children">
               <svg-icon slot="prefix"  class="menu-icon" :icon-class="jtem.meta && (jtem.meta.icon=='#'?'edit':jtem.meta.icon) " />{{jtem.meta.title}}
          </span>
          </div>
          <div style="clear:both;">
            <div class="three-menu">
              <div v-for="ktem in jtem.children" class="three-menu-item">
                <div class="three-menu-name">
                  <router-link :to="item.path+'/'+jtem.path+'/'+ktem.path" class="link-type">
                    <span><svg-icon slot="prefix"  class="menu-icon" :icon-class="ktem.meta && (ktem.meta.icon=='#'?'edit':ktem.meta.icon) " />{{ ktem.meta.title }}</span>
                  </router-link>
                </div>
                <!--
                              <div class="three-menu-remark">这是一个计算器</div>
                -->
              </div>
            </div>
          </div>

        </template>
      </template>
    </div>

  </div>
</template>

<script>
  import $ from 'jquery';
  import SvgIcon from '@/components/SvgIcon';
  export default {
    name: 'privateMenu-dialog',
    components:{
      SvgIcon
    },
    data() {
      return {
        menuList:this.$store.state.permission.routes
      }
    },
    created() {

    },
    mounted () {
      let that=this;
      $(".link-type").click(function(){
        that.$parent.closeAllMenu();
      });
      $(".allmenu-close").click(function(){
        that.$parent.closeAllMenu();
      });

    },
    methods: {

    }
  };
</script>
<style scoped>
  .private-menu-main{
    height: 100%;
  }
  .allmenu-title{
    line-height: 25px;
    background-color: #c4cbd2;
    padding-left: 15px;
    font-size: 16px;
  }
  .allmenu-close{
    float: right;
    margin-top: 5px;
    margin-right: 10px;
    cursor:pointer;
  }
 .first-menu{
   font-size: 18px;
   font-weight: 500;
   margin-left: 20px;
   color: #000;
   margin-bottom: 20px;
   border-bottom: 2px dotted #c9c9c9;
   padding-bottom: 10px;
 }
  .second-menu{
    font-size: 16px;
    font-weight: 500;
    padding-left: 5px;
    margin-left: 35px;
    color: #000;
    /*border-left: 5px solid #0097F4;*/
  }
  .three-menu{
    margin:20px 20px 30px 70px;
    overflow:hidden;
  }
  .three-menu-item{
    width: 25%;
    float: left;
  }
  .three-menu-name{
    color: #000;
    font-size: 14px;
    line-height: 22px;
  }
  .main a{
    color:#000 !important;
  }
  .main a:hover{
    color:#0097F4 !important;
  }
  .main-content{
    height: calc(100% - 40px);
    overflow: auto;
    padding-top: 20px;

  }
  .link-type, .link-type:focus {
    color: #000;
  }
  a:hover {
    /*color: #0097F4 !important;*/
    color: #f70000 !important;
  }
</style>
