<template>
  <div>
    <div class="class1">
      <el-button type="primary" @click="click" plain>使用须知</el-button>
    </div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      如使用回放功能，点击此处下载<el-link type="primary" style="font-size:14px" :href="'/template/VideoWebPlugin.exe'">播放器下载</el-link>,安装后刷新页面
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="iframe_box">
      <iframe width="100%" height="560px" src="/static/palyback.html" ref="iframeDom"></iframe>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import $ from 'jquery'
import VueFullscreen from 'vue-fullscreen'
import Vue from 'vue'
import { listCamera, getCamera, delCamera, addCamera, updateCamera, exportCamera, syncDev, getPlayStream } from "@/api/project/ga/camera"
//import { getTreeSquareHjq } from '@/api/project/peacecountry/liveVideo'
import { mapGetters } from 'vuex'
import timePlayBack from '../components/timePlayBack'
import { getPlayback, queryRecords } from '@/api/video/hejq'
import { getDeviceStream } from '@/api/video/device'
Vue.use(VueFullscreen)
export default {
  name: 'play',
  components: {


  },
  computed: {

  },
  data () {
    return {
      dialogVisible: false,
      code: [],
      apiUrl: null,
      deviceList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 40,
        branchId: null,
        branchName: null,
        macId: null,
        deviceName: null,
        latitude: null,
        longitude: null,
        mac: null,
        location: null,
        status: null,
        tenantId: null,
        ancestors: null,
      },
    }
  },
  created () {

  },
  mounted () {
    this.getList()
    this.iframeWin = this.$refs.iframeDom.contentWindow
    setTimeout(
      () => {
        this.iframeWin.postMessage({
          cmd: this.deviceList,
          params: {}
        }, '*')
      }, 1000);
  },
  beforeDestroy () {

  },
  methods: {
    getList () {
      listCamera(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
      });

    },
    click () {
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.class1 {
  padding-left: 30px;
}
</style>
