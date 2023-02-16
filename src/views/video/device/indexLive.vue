<template>
  <div class="app-container" style="overflow:hidden;" :style="{height:contentHeight}">
    <el-row :gutter="20">
      <el-col :span="5" :xs="24">
        <!-- <div class="class1">
          <el-button class="class2" type="primary" @click="click" plain>使用须知</el-button>
        </div> -->
        <!-- <div>
          <span class="demonstration">开始时间</span>
          <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </div>

        <div>
          <span class="demonstration">结束时间</span>
          <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </div> -->

        <div class="class3">
          <el-table ref="table" v-loading="loading" stripe :height="treeStyle" :header-cell-style="{fontSize:'12px', fontWeight:'500'}" :data="deviceList">

            <el-table-column label="监控名称" align="left" prop="cameraName" />
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="80">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-video-play" @click="rowClick(scope.row)" v-hasPermi="['camera:camera:query']">播放</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-col>
      <div id="play" ref="play">
        <el-col :span="19" :xs="24">
          <haikang type="live" index="realTime" :code="code" />
        </el-col>
      </div>
    </el-row>

  </div>
</template>

<script>
import EasyPlayer from '@easydarwin/easyplayer';
import haikang from '../components/haiKang.vue'
import { listCamera } from "@/api/project/ga/camera";
export default {
  components: { EasyPlayer, haikang },
  data () {
    return {
      value1: '',
      contentHeight: $(window).height() - 100 + 'px',
      treeStyle: null,
      tableHeight: 400,
      tableOffset: 138,
      dialogVisible: false,
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
      sourceUrl: 'http://223.83.197.122:83/openUrl/JwIO3Di/live.m3u8',
      id: '',
      baseOptions: {
        aspect: '16:9',
        fluent: true, // 流畅模式
        autoplay: true,
        showCustomButton: false,
        stretch: false // 强制铺满
      },
      playVideo: null,
      player: '',
      deviceList: [],
      code: '',
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.$nextTick(function () {
      this.tableHeight = window.innerHeight - this.tableOffset + 2;
      this.setTreeHeight()
    })
  },
  methods: {
    setTreeHeight () {
      this.treeStyle = (window.innerHeight) - 100
    },
    click () {
      this.dialogVisible = true
    },
    rowClick (data) {
      window.console.log(data.cameraIndexCode)
      this.code = data.cameraIndexCode
    },
    getList () {
      this.loading = false;
      /*listDevice(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });*/
      listCamera(this.queryParams).then(response => {
        this.deviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

  }
}
</script>

<style  >
.el-date-picker {
  width: 260px;
}
.el-date-picker .el-picker-panel__content {
  width: 250px;
}
</style>

