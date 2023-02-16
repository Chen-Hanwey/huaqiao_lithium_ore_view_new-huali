<template>
  <div class="header">
    <div class="menu-pannel" style="left:-218px">
      <div class="menu-wraper c1">
        <dl>
          <dd v-for="(item,index) in menuList" :data-index="item.children?index:''" v-if="item.meta">

            <router-link :to="item.path" class="link-type" v-if="!item.children && item.isFrame == 1 && item.visible === '0'">
              <span> <svg-icon slot="prefix" class="menu-icon" :icon-class="(item.meta && item.meta.icon) || 'edit' "/>{{ item.meta.title }}</span>
            </router-link>
            <a :href="resolvePath(item.path)" target="_blank" class="link-type"
               v-if="!item.children && item.isFrame == 0 && item.visible === '0'">
              <span> <svg-icon slot="prefix" class="menu-icon" :icon-class="(item.meta && item.meta.icon) || 'edit' "/>{{ item.meta.title }}</span>
            </a>
            <span v-if="item.children && item.visible === '0'">
                 <svg-icon slot="prefix" class="menu-icon" :icon-class="(item.meta && item.meta.icon) || 'edit' "/> {{item.meta.title}}
                <span class="gt"><i class="el-icon-arrow-right"></i></span>
              </span>
          </dd>
        </dl>
      </div>
      <div class="menu-wraper c2" style="width: 0px; display: none;">
        <dl v-for="(item,index) in menuList" v-if="item.meta" :data-father="index" style="display:none;">
          <dd v-for="(jtem,idx) in item.children" :data-index="jtem.children?idx:''" class="">
            <router-link :to="item.path+'/'+jtem.path" class="link-type" v-if="!jtem.children && jtem.isFrame == 1 && jtem.visible === '0' && item.visible === '0'">
              <span><svg-icon slot="prefix" class="menu-icon"
                              :icon-class="jtem.meta && (jtem.meta.icon=='#'?'edit':jtem.meta.icon) "/> {{ jtem.meta.title }}</span>
            </router-link>
            <a :href="resolvePath(jtem.path)" target="_blank" class="link-type"
               v-if="!jtem.children && jtem.isFrame == 0 && jtem.visible === '0' && item.visible === '0'">
              <span> <svg-icon slot="prefix" class="menu-icon" :icon-class="(jtem.meta && jtem.meta.icon) || 'edit' "/>{{ jtem.meta.title }}</span>
            </a>
            <span v-if="jtem.children && jtem.visible === '0' && item.visible === '0'">
                 <svg-icon slot="prefix" class="menu-icon"
                           :icon-class="jtem.meta && (jtem.meta.icon=='#'?'edit':jtem.meta.icon)"/>{{jtem.meta.title}}
                <span class="gt"><i class="el-icon-arrow-right"></i></span>
              </span>

          </dd>
        </dl>
      </div>
      <div class="menu-wraper c3" style="width: 0px; display: none;">
        <template v-for="(item,index) in menuList" v-if="item.meta">
          <dl v-for="(jtem,idx) in item.children" :data-father="[index+'-'+idx]"
              v-if="jtem.children && jtem.children.length>0" style="display:none;">
            <dd v-for="ktem in jtem.children">
             <!-- <a v-if="ktem.path == 'duesrecord'"  class="link-type" href="#" @click="submitFormHebao">
                 <span> <img :src="hebaoIcon" class="private-icon">{{ ktem.meta.title }}</span>
              </a>-->
              <router-link :to="item.path+'/'+jtem.path+'/'+ktem.path" class="link-type" v-if="ktem.isFrame == 1 && ktem.visible === '0' && jtem.visible === '0' && item.visible === '0'">
                <span><svg-icon slot="prefix" class="menu-icon"
                                :icon-class="ktem.meta && (ktem.meta.icon=='#'?'edit':ktem.meta.icon) "/>{{ ktem.meta.title }}</span>
              </router-link>
              <a :href="resolvePath(ktem.path)" target="_blank" class="link-type" v-if="ktem.isFrame == 0 && ktem.visible === '0' && jtem.visible === '0' && item.visible === '0'">
                <span> <svg-icon slot="prefix" class="menu-icon"
                                 :icon-class="(ktem.meta && ktem.meta.icon) || 'edit' "/>{{ ktem.meta.title }}</span>
              </a>

            </dd>
          </dl>
        </template>
      </div>

    </div>
  </div>
</template>

<script>
    import $ from 'jquery';
    import SvgIcon from '@/components/SvgIcon';
    import path from 'path'
    import {isExternal} from '@/utils/validate'
    import {loginHebao} from "@/api/system/payhebao";
    import hebaoIcon from '@/assets/logo/hebao.png';
    import yunshixunIcon from '@/assets/logo/yunshixun.png';

    export default {
        name: 'privateMenu',
        components: {
            SvgIcon
        },
        data() {
            return {
                onlyOneChild: null,
                menuIndex: -1,
                basePath: null,
                menuList: this.$store.state.permission.routes,
                hebaoIcon:hebaoIcon,
                yunshixunIcon:yunshixunIcon,
            }
        },
        created() {

        },
        mounted() {
            this.initMenu();
        },
        methods: {
            initMenu() {
                let that = this;
                $('.menu-pannel .c1 dd').hover(function () {
                    that.menuIndex = 1;
                    that.$parent.onShowMenu();
                    var data_index = $(this).attr('data-index');
                    $(".c1 dd").css("background-color", "rgba(0,0,0,0)");
                    $(".c2 dd").css("background-color", "rgba(0,0,0,0)");
                    $(".c1 dd").css("color", "#000");
                    $(".c2 dd").css("color", "#000");
                    $(this).css("background-color","#409EFF");
                    //$(this).css("background-color", "#f70000");
                    $(this).css("color", "#fff");
                    //console.log(data_index);
                    if (data_index != null && data_index != '') {
                        $('.menu-pannel .c2 dl').hide();
                        $('.menu-pannel .c2 dl[data-father="' + data_index + '"]').show();
                        $('.menu-pannel .c2').show();
                        $('.menu-pannel .c2').animate({width: "215px"}, 200);
                    } else {
                        $('.menu-pannel .c2').animate({width: "0px"}, 200);
                        $('.menu-pannel .c2').hide();

                    }
                }, function () {
                    that.menuIndex = -1;
                    that.hideChild();
                });
                $('.menu-pannel .c2 dd').hover(function () {
                    that.menuIndex = 2;
                    let data_index = $(this).attr('data-index');
                    $(".c2 dd").css("background-color", "rgba(0,0,0,0)");
                    $(".c3 dd").css("background-color", "rgba(0,0,0,0)");
                    $(".c2 dd").css("color", "#000");
                    $(".c3 dd").css("color", "#000");
                    $(this).css("background-color","#409EFF");
                    //$(this).css("background-color", "#f70000");
                    $(this).css("color", "#fff");
                    if (data_index != null && data_index != '') {
                        let data_father = $(this).parent().attr('data-father');
                        data_index = data_father + '-' + data_index;
                        $('.menu-pannel .c3 dl').hide();
                        $('.menu-pannel .c3 dl[data-father="' + data_index + '"]').show();
                        $('.menu-pannel .c3').show();
                        $('.menu-pannel .c3').animate({width: "215px"}, 200);
                    } else {
                        $('.menu-pannel .c3').animate({width: "0px"}, 200);
                        $('.menu-pannel .c3').hide();

                    }

                }, function () {
                    that.menuIndex = -1;
                    that.hideChild();
                });
                $('.menu-pannel .c3 dd').hover(function () {
                    that.menuIndex = 3;
                    $(".c3 dd").css("background-color", "rgba(0,0,0,0)");
                    $(".c3 dd").css("color", "#000");
                    $(this).css("background-color", "#409EFF");
                    //$(this).css("background-color", "#f70000");
                    $(this).css("color", "#fff");
                }, function () {
                    that.menuIndex = -1;
                    that.hideChild();
                });
                $("dd a").click(function () {
                    that.handleChange($(this).attr('name'), $(this).attr('path'));

                });
                $(".c1").hover(function () {
                    that.menuIndex = 1;
                }, function () {
                    that.menuIndex = -1;
                    that.hideChild();
                });
                $(".c2").hover(function () {
                    that.menuIndex = 2;
                }, function () {
                    that.menuIndex = -1;
                    that.hideChild();
                });
                $(".c3").hover(function () {
                    that.menuIndex = 3;
                }, function () {
                    that.menuIndex = -1;
                    that.hideChild();
                });
            },
            hideChild() {
                let that = this;
                window.setTimeout(function () {
                    if (that.menuIndex < 2) {
                        $('.menu-pannel .c3').animate({width: "0px"}, 100);
                        $('.menu-pannel .c3').hide();
                    }
                    if (that.menuIndex < 1) {
                        $('.menu-pannel .c2').animate({width: "0px"}, 100);
                        $('.menu-pannel .c2').hide();
                    }
                    if (that.menuIndex == -1) {
                        $(".menu-pannel").animate({left: "-218px"}, 100);
                        $('.menu img').css('transform', 'rotate(0deg)');
                        that.$parent.hideMenuByChild();
                    }
                }, 200);
            },
            handleChange(name, path) {
                let that = this;
                that.menuIndex = -1;
                that.hideChild();
            },
            showFirstMenu() {
                $(".menu-pannel").animate({left: "0px"}, 200);
            },
            hideFirstMenu() {
                $(".menu-pannel").animate({left: "-218px"}, 100);
            },
            hasOneShowingChild(children = [], parent) {
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false
                    } else {
                        // Temp set(will be used if only has one showing child)
                        this.onlyOneChild = item
                        return true
                    }
                })

                // When there is only one child router, the child router is displayed by default
                if (showingChildren.length === 1) {
                    return true
                }

                // Show parent if there are no child router to display
                if (showingChildren.length === 0) {
                    this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
                    return true
                }

                return false
            },
            resolvePath(routePath) {
                //console.log(routePath+this.basePath)
                if (isExternal(routePath)) {
                    return routePath
                }
                if (isExternal(this.basePath)) {
                    return this.basePath
                }
                return path.resolve(this.basePath, routePath)
            },

          submitFormHebao(value){
            loginHebao({}).then(response => {
              if(response.code==200){
                let temp_form = document.createElement("form");
                temp_form.action = 'https://uat.cmpay.com/jiaofei/service/party_login.xhtml';
                //如需打开新窗口，form的target属性要设置为'_blank'
                temp_form.target = "_blank";
                temp_form.method = "post";
                temp_form.style.display = "none";
                //添加参数
                var opt = document.createElement("input");
                opt.name = "LOGIN_INF";
                opt.value = response.msg;
                temp_form.appendChild(opt);
                document.body.appendChild(temp_form);
                //提交数据
                temp_form.submit();
              }
            });

          }
        }
    };
</script>
<style scope>
  .header {

  }

  .header a {
    color: #000 !important;
  }

  .header a:hover {
    color: #fff !important;
  }

  .header .menu-pannel {
    position: absolute;
    z-index: 1000;
    top: 40px;
    bottom: 0px;
    background: #f8f8f8;
    color: #000;
    overflow-y: auto;
  }

  .header .menu-pannel .menu-wraper {
    height: 100%;
    float: left;
    width: 0;
    overflow-y: hidden;
    display: none;
  }

  .header .menu-pannel .c1 {
    width: 200px;
    display: block;
  }

  .header .menu-pannel dl {
    padding: 20px 0 40px;
    color: #222;
    font-size: 15px;
    height: 100%;
    background-color: #f8f8f8;
    float: right;
    overflow: auto;
  }

  .header .menu-pannel .c1 dl dd {
    padding-left: 15px;
  }

  .header .menu-pannel dl dd {
    width: 200px;
    line-height: 40px;
    padding: 0 25px;
    font-weight: 500;
    color: #222;
    cursor: pointer;
  }

  .header .menu-pannel dl dd a {
    display: block;
  }

  .header .menu-pannel .menu-wraper:not(:first-child) {
    border-left: 1px solid rgba(0, 0, 0, .1);
  }

  dd {
    box-sizing: border-box;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .header .menu-pannel dl dd .gt {
    float: right;
    display: block;
    height: 14px;
    line-height: 1;
    margin-top: 13px;
  }

  .menu-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }

  .ivu-icon {
    display: inline-block;
    font-family: Ionicons;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    text-rendering: auto;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .private-icon{
    width: 15px;
    height: 15px;
    margin-right: 5px;
    margin-top: 2px;
  }

  .ivu-icon-ios-arrow-right:before {
    content: "\F3D3";
  }
</style>
