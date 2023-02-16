<template>
  <el-dialog :visible.sync="visible" v-if="visible" append-to-body
             :before-close="close" :close-on-click-modal="false"
             :width="contentWidth">
    <div :style="{height:contentHeight}" class="mapInspectdialog">
      <div class="InspectPanelHead">
        <div class="head_name">{{ name }}</div>
        <div class="tab">
          <div class="tab_left"></div>
          <div class="tab_center">
            <ul>
              <li class="current"><a @click="changTab(0)">综合看板</a></li>
              <li><a @click="changTab(1)">明厨亮灶</a></li>
              <li><a @click="changTab(2)">追本溯源</a></li>
              <li><a @click="changTab(3)">过程监督</a></li>
              <li><a @click="changTab(4)">监管考评</a></li>
              <li><a @click="changTab(5)">社会监督</a></li>
            </ul>
          </div>
          <div class="tab_right"></div>
        </div>
      </div>
      <div style="clear:both;"></div>
      <div class="InspectPanelBody">
        <div class="top">
          <div class="top_1">
            <el-image :src="noPic"></el-image>
            <!--<el-image>
              <div slot="error" class="image-slot" style="text-align: center">
                <img :src="noPic" width="162" height="90">
              </div>
            </el-image>-->
          </div>
          <div class="top_2">
            <el-row :gutter="0">
              <el-col :span="24">
                <el-form label-width="108px">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="负责人：">
                        {{ form.concat }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="负责人联系方式：">
                        {{ form.concatPhone }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="行业类别：">
                        {{ form.bigType }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="场所地址：">
                        <span class="text-oneLine"> {{ form.address }} </span>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="经营范围： ">
                        <div class="jyfw" :title="form.businessScope">
                          {{ form.businessScope }}
                        </div>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
            </el-row>
          </div>
          <div class="top2_s"></div>
          <div class="top_3">
            <div class="cylh">
              <div style="float:left;margin-right:15px;">
                <div style="width:98px;text-align:center;padding-top:10px;">
                  <img style="width:50px;height:50px;" :src="rankImg(form.checkPoint)" alt="">
                </div>
                <div style="color: white;font-size: 10px;padding-top: 5px;">本次检查量化等级</div>
              </div>
              <div>
                <div style="color: white;font-size: 10px;">
                  <div style="float:left;line-height:90px">食安指数评分：</div>
                  <div style="float:left;line-height:90px;font-size:36px;text-shadow: 1px 1px 1px 1px #0b559a;"> {{ form.score }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="clear:both;"></div>
        <div class="InspectPanelContent">
          <div class="content_0 content_c" style="display:block" v-if="tabShow==0">
            <comprehensive :operation-id="operationId"></comprehensive>
          </div>
          <div class="content_1 content_c">
            <bright-cooking-hob :enterprise-id="enterpriseId" :operation-id="operationId" v-if="tabShow==1" ></bright-cooking-hob>
          </div>
          <div class="content_2 content_c">
            <traceability :enterprise-id="enterpriseId" :operation-id="operationId" v-if="tabShow==2"></traceability>
           </div>
          <div class="content_3 content_c">
            <process-supervision :enterprise-id="enterpriseId" :operation-id="operationId" v-if="tabShow==3"></process-supervision>
          </div>
          <div class="content_4 content_c">
            <regulatory-assessment :enterprise-id="enterpriseId" :operation-id="operationId" v-if="tabShow==4"></regulatory-assessment>
          </div>
          <div class="content_5 content_c">
            <social-supervision v-if="tabShow==5"></social-supervision>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import $ from 'jquery'
import { getOperationInfo } from '@/api/bigScreen/inspectPanel'
import BrightCookingHob from '@/views/bigscreen/components/mapInspectPanel/components/brightCookingHob'
import RegulatoryAssessment from "@/views/bigscreen/components/mapInspectPanel/components/regulatoryAssessment";
import Traceability from "@/views/bigscreen/components/mapInspectPanel/components/traceability";
import ProcessSupervision from "@/views/bigscreen/components/mapInspectPanel/components/processSupervision";
import comprehensive from "@/views/bigscreen/components/mapInspectPanel/components/comprehensive";
import SocialSupervision from "@/views/bigscreen/components/mapInspectPanel/components/socialSupervision"

export default {
  name: 'mapInspectPanel',
  components: {ProcessSupervision,RegulatoryAssessment, BrightCookingHob,Traceability, comprehensive ,SocialSupervision },
  data() {
    return {
      operationId: undefined, // 经营场所id
      enterpriseId: undefined, // 企业id
      noPic: require('@/assets/images/bigscreen/dining1.png'),
      showHead: false,
      visible: false,
      contentHeight: '714px',
      marginTop: ($(window).height())-714/2,
      contentWidth: '1280px',
      name: '',
      form: {},
      tabShow:0
    }
  },
  mounted() {
    console.log(this.contentHeight);
  },
  computed: {
    rankImg() {
      return function(value) {
        return (value < 7) ?
          require('@/views/check/template/image/cylh_1.png') :
          value < 16 ? require('@/views/check/template/image/cylh_2.png') : require('@/views/check/template/image/cylh_3.png')
      }
    }
  },
  methods: {
    getInfo() {
      let that = this
      getOperationInfo(this.operationId).then(res => {
        if (res.code == 200) {
          this.form = res.data
          this.name = this.form.name
        }
      })
    },
    open(operationId,enterpriseId) {
      this.operationId = operationId
      this.enterpriseId = enterpriseId
      this.visible = true
      this.tabShow = 0
      this.getInfo()
    },
    close() {
      this.visible = false
    },
    rankImg() {
      return function(value) {
        return value < 7 ?
          require('@/views/check/template/image/cylh_3.png') :
          value < 16 ? require('@/views/check/template/image/cylh_2.png') : require('@/views/check/template/image/cylh_1.png')
      }
    },
    changTab(index) {
      $(".tab_center").find("ul li").each(function(i){
        $(this).removeClass("current");
      });
      $(".tab_center").find("ul li").eq(index).addClass("current");
      $('.InspectPanelContent').find('.content_c').each(function(i) {
        $(this).hide()
      })
      $('.InspectPanelContent').find('.content_' + index).show()
      this.tabShow=index;
      $('body').addClass("el-popup-parent--hidden");
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  top:50%;
  margin-top:-357px !important;
}

.InspectPanelBody {
  height: calc(100% - 56px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 15px 8px 15px;
}

.InspectPanelHead {
  height: 56px;
  padding:0 15px;
  .head_name{
    width:400px;
    overflow: hidden;
    color:#ffffff;
    line-height: 56px;
    font-size:24px;
    float:left;
    padding-left:10px;
    background:  url('../../../../assets/image/bigScreen/mapInsperct_name.svg') left center no-repeat;
  }
  .tab{
    float:right;
    margin-top:14px;
    width:840px;
  }
  .tab_center {
    float: left;
  }

  .tab_center ul li {
    float: left;
    margin-right: 8px;
  }

  .tab_center ul li a {
    width: 100px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #ffffff;
    display: block;
    background-image: url('../../../../assets/image/bigScreen/mapInsperct_menu1.svg');
    background-size: 100% 100%;
    font-size: 14px;
  }
  .tab_center ul li.current a{
    background-image: url('../../../../assets/image/bigScreen/mapInsperct_menu2.svg');
    background-size: 100% 100%;
  }
  .tab_left {
    float: left;
    width: 80px;
    height: 32px;
    background: url('../../../../assets/image/bigScreen/mapInsperct_headL.svg') no-repeat;
  }

  .tab_right {
    float: left;
    width: 80px;
    height: 32px;
    background: url('../../../../assets/image/bigScreen/mapInsperct_headR.svg') no-repeat;
  }
}
.InspectPanelContent{
  padding-top:8px;
}
.InspectPanelContent .content_c {
  display: none;
}

/deep/ .el-dialog__header {
  padding: 0px;
}

/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}

/deep/ .el-dialog__body {
  padding: 0px;
  background-image: url('../../../../assets/image/bigScreen/mapInsperctPanelBg.png');
  background-size: 100% 100%;
  //box-shadow: 0 0px 12px 0px #1c4580;
}

/deep/ .el-form-item--small.el-form-item {
  margin-bottom: 6px;
}

/deep/ .el-form-item--small .el-form-item__label {
  line-height: 20px;
  color: #ffffff;
  font-size: 10px;
}

/deep/ .el-form-item--small .el-form-item__content {
  line-height: 20px;
  color: #ffffff;
  font-size: 10px;
}

/deep/ .el-dialog__headerbtn {
  top: 3px;
  right: 16px;
}

.mapInspectdialog .top {
  background-image: url('../../../../assets/image/bigScreen/mapInsperctPanelCBg.png');
  background-size: 100% 100%;
  color: #ffffff;
  font-size: 10px;
  width: 1250px;
  height: 112px;
  padding: 10px 0 10px 10px;

  .top_1 {
    float: left;
    width: 162px;
    height: 92px;
    border: 1px solid #abacd9;
  }

  .top_2 {
    float: left;
    width: 800px;

    .jyfw {
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 这里是超出几行省略 */
      overflow: hidden;
      margin-right: 10px;
    }
  }

  .top2_s {
    float: left;
    width: 1px;
    height: 80px;
    background: #02547b;
    margin-top: 6px;
  }

  .top_3 {
    float: left;
    margin-left: 12px;

    .cylh {
      width: 260px;
      height: 100px;
      color: #ffffff;
    }
  }
}
::-webkit-scrollbar-thumb {
  border-radius: 0px !important;
  background-color: #204566 !important;
}
::-webkit-scrollbar-track {
  border-radius: 0px;
  background-color: #355b7f !important;
}
</style>
