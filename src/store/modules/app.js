import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  screenHeight: document.documentElement.clientHeight, //屏幕高度
  showVideo: false,
  warmingNum: 0,
  todoNum:0
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  TOGGLE_VIDEO: (state, show = false) => {
    state.showVideo = show;
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  },
  SET_SCREENH_EIGHT: (state, screenHeight) => {
    state.screenHeight = screenHeight
    Cookies.set('screenHeight', screenHeight)
  },
  SET_WARMING_NUM:(state, warmingNum) => {
    state.warmingNum = warmingNum
  },
  SET_TODO_NUM:(state, todoNum) => {
    state.todoNum = todoNum
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  toggleVideo({ commit }, { show, ...rest }) {
    commit('TOGGLE_VIDEO', show)
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  },
  setScreenHeight({ commit }, screenHeight) {
    commit('SET_SCREENH_EIGHT', screenHeight)
  },
  setWarmingNum({ commit }, warmingNum) {
    commit('SET_WARMING_NUM', warmingNum)
  },
  setTodoNum({ commit }, todoNum) {
    commit('SET_TODO_NUM', todoNum)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
