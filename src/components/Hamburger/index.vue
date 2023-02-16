<template>
  <!--<div style="padding-left:10px;padding-right: 5px" @click="toggleClick" @mouseover="showMenuEvent" @mouseleave="hideMenuEvent">-->
  <div style="padding-left:10px;padding-right: 5px;padding-top:7px;" @click="toggleClick">
    <svg t="1582033098271" :class="{'is-active':isActive}" class="hamburger icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2470" width="36" height="36">
      <path d="M124.56604 259.591293l0 84.975347 764.78119 0 0-84.975347L124.56604 259.591293zM124.56604 557.00603l764.78119 0 0-84.97637L124.56604 472.02966 124.56604 557.00603zM124.56604 769.44542l764.78119 0 0-84.97637L124.56604 684.46905 124.56604 769.44542z" p-id="2471" fill="#ffffff"></path>
    </svg>
    <!--    <span style='font-size:15px;'>菜单</span>
        <span style="font-size: 16px;">&nbsp;|&nbsp;</span>-->

  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick () {
      //this.$parent.handleClickMenu();
      window.console.log(this.$route)
      if ("/Camera/live" == this.$route.path) {
      } else {
        this.$emit('toggleClick')
      }

    },
    showMenuEvent () {
      this.$parent.showMenuEvent();

    },
    hideMenuEvent () {
      this.$parent.hideMenuEvent();

    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
