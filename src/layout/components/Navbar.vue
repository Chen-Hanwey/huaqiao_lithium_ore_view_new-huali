<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!--    <div class="object-title">{{title}}</div>-->
    <!--
        <breadcrumb id="breadcrumb-container" class="breadcrumb-container"/>
    -->
    <div class="right-menu">
      <template v-if="device!=='mobile'">

<!--        <el-tooltip :content="supervisionType == 3 ? '商务驾驶舱' : supervisionType == 2 ? '教育驾驶舱': '监管驾驶舱'" effect="dark" placement="bottom" v-if="userType == '00' || userType == '01'">-->
<!--          <a style="font-size: 17px;color: white;vertical-align: text-bottom;margin-right: 10px" target="_blank" :href="supervisionType == 3 ? '/bigScreen3' : supervisionType == 2 ? '/bigScreen2' : '/bigScreen'">-->
<!--            <i class="fa fa-globe" aria-hidden="true"></i>-->
<!--          </a>-->
<!--        </el-tooltip>-->
        <el-tooltip content="可视化大屏" effect="dark" placement="bottom">
          <a style="font-size: 15px;color: white;vertical-align: text-bottom;" target="_blank" href="/dataV"
          >     <svg-icon icon-class="international" />
           &nbsp;&nbsp;</a>
        </el-tooltip>
        <el-tooltip content="我的工作" effect="dark" placement="bottom">
          <router-link style="font-size: 17px;color: white;vertical-align: text-bottom;margin-right: 6px" to="/Alarm/order">
            <el-badge :hidden="todoNum == 0" :value="todoNum" class="item"><i class="fa fa-envelope-o" aria-hidden="true"></i></el-badge>
          </router-link>
        </el-tooltip>
        <!-- <el-tooltip content="预警中心" effect="dark" placement="bottom">
          <router-link style="font-size: 17px;color: white;vertical-align: text-bottom;margin-right: 10px" to="/Home/missingRecord">
            <el-badge :hidden="warmingNum == 0" :value="warmingNum" class="item"><i class="fa fa-bell-o" aria-hidden="true"></i></el-badge></router-link>
        </el-tooltip> -->
        <screenfull id="screenfull" class="right-menu-item hover-effect" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!--          <img :src="avatar" class="user-avatar">-->
          <span>{{nickName}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--          <router-link to="/Handle/todoList">-->
          <!--            <el-dropdown-item>我的工作</el-dropdown-item>-->
          <!--          </router-link>-->
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <!-- <el-dropdown-item>
             <span @click="setting = true">布局设置</span>
           </el-dropdown-item>-->
          <router-link to="/user/resetPwd">
            <el-dropdown-item divided>修改密码</el-dropdown-item>
          </router-link>

          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYi from '@/components/RuoYi'
import defaultSettings from '@/settings';
import { countMyWfOrder } from "@/api/myWork/wfOrder";
import { countMissingRecord } from "@/api/missingRecord/missingRecord";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYi
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name',
      'nickName',
      'userType',
      'supervisionType'
    ]),
    setting: {
      get () {
        return this.$store.state.settings.showSettings
      },
      set (val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  watch: {
    "$store.state.app.warmingNum": {
      deep: true,
      handler: function (newVal) {
        this.warmingNum = newVal
      }
    },
    "$store.state.app.todoNum": {
      deep: true,
      handler: function (newVal) {
        this.todoNum = newVal
      }
    }
  },
  mounted () {
    countMyWfOrder().then(res => {
      if (res.code == 200) {
        this.todoNum = 10;
        this.$store.dispatch('app/setTodoNum', res.data);
      }
    });
    // countMissingRecord({}).then(res => {
    //   if (res.code == 200) {
    //     this.warmingNum = res.data
    //     this.$store.dispatch('app/setWarmingNum', res.data);
    //   }
    // })

  },
  created () {
    /*this.getDicts("help_doc_url").then(response => {
      this.helpDocUrl = response.data[0].dictLabel;
    });*/
  },
  data () {
    return {
      title: defaultSettings.title,
      helpDocUrl: '',
      todoNum: 0,
      warmingNum: 0
    }
  },
  methods: {
    showHelp () {
      window.open(this.helpDocUrl);
    },
    toggleSideBar () {

      this.$store.dispatch('app/toggleSideBar')
    },
    handleClickMenu () {
      this.$parent.handleClickMenu();
    },
    showMenuEvent () {
      this.$parent.showMenuEvent();

    },
    hideMenuEvent () {
      this.$parent.hideMenuEvent();

    },
    logout () {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'btn-confirm',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #2d303b;
  /*background: #f70000;*/
  color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .object-title {
    float: left;
    line-height: 50px;
    font-size: 18px;
    font-weight: 500;
    margin-right: 15px;
  }

  .hamburger-container {
    line-height: 50px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .el-breadcrumb__separator {
    color: #ffffff;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: white;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 50px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
///deep/.navbar-top-header {
//  width: 1000px
//}
/deep/.el-badge__content.is-fixed {
  transform: translateY(+20%) translateX(100%);
}
</style>
<style>
.el-dropdown-menu--small .el-dropdown-menu__item {
  line-height: 27px;
  padding: 0 15px;
  font-size: 15px;
}
</style>
