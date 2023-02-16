<template>
  <el-dialog
    :visible.sync="dialogVisible"
    fullscreen :close-on-click-modal="false" class="customPreviewForm" @opened="openDialog"
    :before-close="handleClose">
    <div slot="title">
      <!-- <span><i :class="dialogIcon"></i></span>-->
      <span> 流程设计器</span>
    </div>
    <div class="processDesign-body"></div>
    <Modeler ref="modeler" :params="params" :height="height"></Modeler>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>


<script>
import Modeler from './components/Modeler'
import $ from 'jquery'

export default {
  props: ['dialogVisible', 'params'],
  components: {
    Modeler
  },
  data() {
    return {
      height: 525
    }
  },
  watch: {
    '$store.state.app.screenHeight': function() { //监听屏幕高度变化
      this.openDialog()
    }
  },
  mounted() {

  },
  methods: {
    openDialog() {
      this.height = $(window).innerHeight() - 100;
      $('.processDesign-body').parent().css('height', $(window).innerHeight() - 100).css('top', 0).css('overflow-y', 'auto')
    },
    handleOk() {
      this.$refs.modeler.saveXML()
      this.$emit('handleVisiable', { visiable: false })
    },
    handleClose(done) {
      this.$emit('handleVisiable', { visiable: false })
    }
  }
}
</script>
