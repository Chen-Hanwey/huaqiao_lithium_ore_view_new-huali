<template>
  <el-dialog
    :visible.sync="dialogViewModelVisible"
    fullscreen :close-on-click-modal="false" class="customPreviewForm" @opened="openDialog"
    :before-close="handleClose">
    <div slot="title">
      <!-- <span><i :class="dialogIcon"></i></span>-->
      <span> 流程追踪</span>
    </div>
    <div class="processView-body"></div>
    <Viewer ref="viewer" :params="params" :height="height"></Viewer>
    <!--<span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>-->
  </el-dialog>
</template>


<script>
import Viewer from './components/Viewer'
import $ from 'jquery'

export default {
  props: ['dialogViewModelVisible', 'params'],
  components: {
    Viewer
  },
  data() {
    return {
      height: 525,
    }
  },
  watch: {
    '$store.state.app.screenHeight': function() { //监听屏幕高度变化
      this.openDialog()
    },
  },
  mounted() {

  },
  methods: {
    openDialog() {
      this.height = $(window).innerHeight() - 50
      $('.processView-body').parent().css('height', $(window).innerHeight() - 50).css('top', 0).css('overflow-y', 'auto')
    },
    handleOk() {
      this.$emit('handleViewModelVisiable', { visiable: false })
      this.$refs.modeler.saveXML()
    },
    handleClose(done) {
      this.$emit('handleViewModelVisiable', { visiable: false })
    }
  }
}
</script>
