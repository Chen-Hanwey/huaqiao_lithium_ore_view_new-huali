const file = {
  state: {
    isFolder: sessionStorage.getItem("isFolder"), //  左侧栏是否折叠，0不折叠，1折叠
    selectedColumnList: sessionStorage.getItem("selectedColumnList"), //  列显隐
    imageModel: sessionStorage.getItem("imageModel"), //  图片类型页面是否展示为网格模式，0不是，1是
    operaColumnExpand: sessionStorage.getItem("operaColumnExpand"), //  操作列是否展开，0不展开，1展开
  },
  getters: {
    isFolder: (state) => Number(state.isFolder), //  左侧栏是否折叠，0不折叠，1折叠
    selectedColumnList: (state) =>
      state.selectedColumnList
        ? state.selectedColumnList.split(",")
        : ["extendName", "fileSize", "uploadTime"], //  列显隐
    imageModel: (state) => Number(state.imageModel), //  图片类型页面是否展示为网格模式，0不是，1是
    operaColumnExpand: (state) =>
      state.operaColumnExpand !== null
        ? Number(state.operaColumnExpand)
        : document.body.clientWidth > 1280
        ? 1
        : 0, //  操作列是否展开，0不展开，1展开
  },
  mutations: {
    changeIsFolder(state, data) {
      sessionStorage.setItem("isFolder", data);
      state.isFolder = data;
    },
    changeSelectedColumnList(state, data) {
      sessionStorage.setItem("selectedColumnList", data.toString());
      state.selectedColumnList = data.toString();
    },
    changeImageModel(state, data) {
      sessionStorage.setItem("imageModel", data);
      state.imageModel = data;
    },
    changeOperaColumnExpand(state, data) {
      sessionStorage.setItem("operaColumnExpand", data);
      state.operaColumnExpand = data;
    },
  }
}
export default file

