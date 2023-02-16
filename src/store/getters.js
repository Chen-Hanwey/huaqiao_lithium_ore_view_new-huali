const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  screenHeight: state => state.app.screenHeight,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  nickName: state => state.user.nickName,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  enterpriseName: state=>state.user.enterpriseName,
  enterpriseId: state=>state.user.enterpriseId,
  videoTenant: state=>state.user.videoTenant,
  userType: state=>state.user.userType,
  supervisionType: state=>state.user.supervisionType,
  showTree: state=>state.user.showTree,
  operationId: state=>state.user.operationId
}
export default getters