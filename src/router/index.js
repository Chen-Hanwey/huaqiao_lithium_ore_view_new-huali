import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/brightCookingHob',
    component: () => import('@/views/bigscreen/components/mapInspectPanel/components/brightCookingHob'),
    hidden: true
  },
  {
    path: '/ditu',
    component: () => import('@/views/dataV/child/maptd'),
    hidden: true
  },

  {
    path: '/approval',
    component: () => import('@/views/approval'),
    hidden: true
  },
  {
    path: '/forgetPwd',
    component: () => import('@/views/forgetPwd'),
    hidden: true
  },
  {
    path: '/forgetPwdz',
    component: () => import('@/views/forgetPwdz'),
    hidden: true
  },
  {
    path: '/privacy',
    component: () => import('@/views/privacy'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '/401/mobile',
    component: () => import('@/views/error/401mobile'),
    hidden: true
  },
  {
    path: '/dataV',
    component: () => import('@/views/dataV/index'),
    hidden: true
  },
  {
    path: '/bigScreen',
    component: () => import('@/views/bigscreen/index'),
    hidden: true
  },
  {
    path: '/bigScreen2',
    component: () => import('@/views/bigscreen/index2'),
    hidden: true
  },
  {
    path: '/bigScreen3',
    component: () => import('@/views/bigscreen/index3'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        //component: () => import('@/views/index_v1'),
        component: () => import('@/views/dataV/index'),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'resetPwd',
        component: () => import('@/views/system/user/profile/resetPwd'),
        name: 'ResetPwd',
        meta: { title: '修改密码', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'definition/model/',
        component: (resolve) => require(['@/views/flowable/definition/model'], resolve),
        name: 'Model',
        meta: { title: '流程设计', icon: '' }
      }
    ]
  },
  {
    path: '/flowable',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'task/record/index',
        component: (resolve) => require(['@/views/flowable/task/record/index'], resolve),
        name: 'Record',
        meta: { title: '流程处理', icon: '' }
      }
    ]
  },
]

export default new Router({
  mode: 'history', // 去掉url中的#
  base: '',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})