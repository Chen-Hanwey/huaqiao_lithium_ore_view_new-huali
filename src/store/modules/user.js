import { login, logout, getInfo, getPublicKey,login_aes } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defaultSettings from "@/settings";

import { encryptData } from '@/utils/ecdh';

const user = {
  state: {
    userId: '',
    certificateId:'',
    token: getToken(),
    name: '',
    nickName: '',
    avatar: '',
    roles: [],
    permissions: [],
    enterpriseName:'',
    enterpriseId:'',
    videoTenant: {},
	// 用户类型
    userType: '',
	// 显示左侧树
    showTree: false,
    operationId: '',
    supervisionType: undefined
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_CERTIFICATEID:(state,certificateId) => {
            state.certificateId=certificateId
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_NICKNAME: (state, nickName) => {
      state.nickName = nickName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ENTERPRISENAME: (state, enterpriseName) => {
      state.enterpriseName = enterpriseName
    },
    SET_ENTERPRISEID: (state, enterpriseId) => {
      state.enterpriseId = enterpriseId
    },
    SET_VIDEO_TENANT: (state, videoTenant) => {
      state.videoTenant = videoTenant
    },
    SET_USER_TYPE: (state, userType) => {
      state.userType = userType
    },
    SET_SHOW_TREE: (state, showTree) => {
      state.showTree = showTree
    },
    SET_OPERATION_ID: (state, operationId) => {
      state.operationId = operationId
    },
    SET_SUPERVISION_TYPE: (state, supervisionType) => {
      state.supervisionType = supervisionType
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        getPublicKey(username).then(res => {
          if(res.code === 200){
            let result = encryptData(res.data, password);
            let aes_password = result.encryptedData;
            login_aes(username, aes_password, code, uuid, result.clientKey).then(res => {
              setToken(res.token)
              commit('SET_TOKEN', res.token)
              resolve()
            }).catch(error => {
              reject(error)
            })
          }
        });

      })
    },

    /*Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },*/

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
         // console.log('getInfo',res)
          const user = res.user
          const avatar = user.avatar ? process.env.VUE_APP_PICTURE_PATH + user.avatar : "";
          // const avatar = user.avatar == "" ? "" : process.env.VUE_APP_BASE_API + user.avatar;
          // const avatar = user.avatar == "" ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_PERMISSIONS', res.permissions)
          commit('SET_CERTIFICATEID',user.idCard)
          commit('SET_USERID', user.userId)
          commit('SET_NAME', user.userName)
          commit('SET_NICKNAME', user.nickName)
          commit('SET_AVATAR', avatar)
          commit('SET_ENTERPRISEID', user.enterpriseId)
          commit('SET_ENTERPRISENAME', user.enterpriseName)

          commit('SET_VIDEO_TENANT', res.videoTenant)
          commit('SET_USER_TYPE', user.userType)
          if (user.supervisionType){
            commit('SET_SUPERVISION_TYPE',user.supervisionType)
          }
          let showTree = false;
/*          if (user.userType === '00' || user.userType === '01') {
            showTree = true;
          }*/
          commit('SET_SHOW_TREE', showTree )
          commit('SET_OPERATION_ID', user.operationId )

          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_ENTERPRISEID', [])
          commit('SET_ENTERPRISENAME', [])
          commit('SET_VIDEO_TENANT', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
