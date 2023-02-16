<template>
  <div>
    <vue-neditor-wrap v-model="content" ref="neditorComp" :config="myConfig" :destroy="false"></vue-neditor-wrap>
  </div>
</template>

<script>

import VueNeditorWrap from 'vue-neditor-wrap'

import { getToken } from '@/utils/auth'
import defaultSetting from "@/settings";

export default {
  props: {
    /* 编辑器的内容 */
    value: {
      type: String
    },
    /* 图片大小 */
    maxSize: {
      type: Number,
      default: 102400 //kb
    }
  },
  components: { VueNeditorWrap },
  data() {
    let that = this;
    return {
      fileList: [],
      videoUploadTag: false,
      activeName: "first",
      content: this.value,
      picturePath: "",
      videoPath: "",
      myConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: process.env.VUE_APP_NEDITOR_UPLOAD_PATH,
        serverUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadNEditorWithManager',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: '/NEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 250,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: false,
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      },
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadImageAndCrtThumbImageWithManage', // 上传的图片服务器地址
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/fdfs/uploadWithManage', // 上传的文件服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      }
    };
  },
  watch: {
    value: function() {
      this.content = this.value;
    }
  },
  methods: {

  }
};
</script>

