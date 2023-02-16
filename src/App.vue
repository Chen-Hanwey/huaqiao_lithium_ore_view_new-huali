<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default  {
  name:  'App'
}
</script>

<style  lang="scss" src="./assets/common.scss">
  @import "assets/styles/font.css";

  .el-form-item--mini.el-form-item {
    margin-bottom: 8px;
  }
  label {
    font-weight: 500;
  }
  .el-table--small th, .el-table--small td {
    padding: 4px 0;
  }
  .el-dialog__header{
    background: #F3F3F3;
    padding-top: 10px;
  }
  .el-dialog__headerbtn{
    top: 8px;
    font-size: 24px;
  }

  .el-button--primary{
    background-color: #409EFF;
    border: #409EFF;
  }
  .el-button--primary:hover{
    background-color: #409EFF;
    border: #409EFF;
    opacity: 0.8
  }
  .el-button--primary:focus{
    background-color: #409EFF;
    border: #409EFF;
  }

  .btn-confirm {
    color: #FFFFFF !important;
    background-color: #409EFF !important;
    border-color: #409EFF !important;
  }
  .btn-confirm:hover {
    opacity: 0.5;
  }


  .el-tabs__item.is-active {
    color: #409EFF;
  }
  .el-tabs__item.is-active:hover {
    color: #409EFF;
  }
  .el-tabs__item:hover{
    color: #409EFF;
  }
  @font-face {
    font-family: 'PangMenZhengDao';
    src:url( './assets/font/PangMenZhengDaoBiaoTiTi.ttf');
  }
  @font-face {
    font-family: 'Farrington';
    src:url( './assets/font/Farrington7B_Qiqi.ttf');
  }
</style>
