<template>
  <div class="sidebar-container" :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="(route,index) in curMenuList" :key="index" :item="route" :base-path='`${curBasePath}/${route.path}`'/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data(){
    return {
      curMenuList:[],
      curBasePath:''
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    /* this.permission_routes.forEach(item=>{
       if(item.name == "NineBusinesses"){
         this.curMenuList=item.children;

       }
     })*/
  },

  methods: {
    showSecondMenu(jtem){
      this.curBasePath=jtem.name;
      this.permission_routes.forEach(item=>{
        if (item.name == jtem.name) {
          if (item.children && item.children.length > 0) {
            let child = [];
            item.children.forEach(item1 => {
              if (!item.hidden) {
                if (!(item1.meta && item1.meta.icon && item1.meta.icon != '#')) {
                  item1.meta.icon = "fa fa-pencil-square-o"
                }
                child.push(item1);
              }
              if (item1.children && item1.children.length > 0) {
                let child1 = [];
                item1.children.forEach(item2 => {
                  if (!item1.hidden) {
                    if (!(item2.meta && item2.meta.icon && item2.meta.icon != '#')) {
                      item2.meta.icon = "fa fa-pencil-square-o"
                    }
                    child1.push(item2);
                  }
                })
                item1.children = child1;
              }
            })
            item.children = child;
          }
          this.curMenuList = item.children;
        }
      })
    },
  }
}
</script>
