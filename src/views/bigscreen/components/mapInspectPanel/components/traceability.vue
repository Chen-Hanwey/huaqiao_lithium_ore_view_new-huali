<template>
  <div>
    <div class="inspectPanelContent">
      <div class="box1">
        <div class="a1 content_module">
          <div class="content_module_title">每日菜品</div>
          <div id="div1" ref="personDom">
            <div v-if="dailyDishInfoList && dailyDishInfoList.length > 0">
              <div v-for="(item, index) in dailyDishInfoList" :key="index" style="float: left;margin-top:13px;margin-bottom:13px;" >
                  <div style="margin:0 13px;position:relative;width:180px;height:190px;cursor:pointer;" @click="clickDailyDish(item)">
                      <el-image
                          style=" height: 190px;width:180px;"
                          :src="getUrl(item.dishesImg)"
                          lazy
                          :scroll-container="scrollContainer"
                      ></el-image>
                    <div class="personDomBg" ></div>
                    <div class="personDomTitle">
                      <div style="float:left;width:120px;text-align:left;padding-left:10px;">{{item.name}}</div>
                      <div style="float:right;width:60px;text-align:right;padding-right:10px;">￥{{item.price}}</div>
                    </div>
                    <!-- <div>菜名：{{item.name}}</div>
                      <div>价格： / 元</div>
                      <div>类型：{{sampleTypeFormat(item)}}</div>
                      <div>餐次：{{mealTypeFormat(item)}}</div>
                      <div>菜品时间：{{item.mealTime}}</div>-->
                  </div>
              </div>
            </div>
            <div v-else>
              <div style="height: 100px; width:100%;text-align: center;margin-top: 50px;color:#9E93B3">
                暂无数据
              </div>
            </div>
            <div style="clear:both;"></div>
          </div>
        </div>

      </div>
    </div>
    <el-dialog :visible.sync="open" :lock-scroll="true"  :close-on-click-modal="false" width="960px" append-to-body id="dialog"  :before-close="handleClose">
      <div slot="title">
        <span><i class="fa fa-medkit"></i></span>
        <span>&nbsp;追本溯源</span>
      </div>
        <div :style="{height:'620px'}" class="mapInspectdialog" id="dialog">
          <dishesQrCode ref="dishesQrCode" :Id="Id"/>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import { listDailyDishInfo } from "@/api/dishes/dailyDishInfo";
import {handleFileList, handlePicturePath} from "@/utils/ruoyi";
import dishesQrCode from "@/views/dishes/components/qrCodeView/dishesQrCodeBlue"
export default {
  name: 'traceability',
  components: {dishesQrCode},
  props: {
    operationId: {
      default: '1'
    },
    enterpriseId: {
      default: '1'
    }
  },
  data() {
    return {
      dailyDishInfoList: [],
      sampleTypeOptions: [],
      mealTypeOptions: [],
      scrollContainer: '',
      Id: '',
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 1000,
        params: {
          operationId: undefined
        }
      },

    }
  },
  watch: {
    operationId: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.queryParams.params.operationId = newValue
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.scrollContainer = this.$refs.personDom.warp
    $('body').addClass("el-popup-parent--hidden");
  },
  created() {
    this.getList()
    this.getDicts("sample_type").then(response => {
        this.sampleTypeOptions = response.data;
    });
    this.getDicts("meal_type").then(response => {
        this.mealTypeOptions = response.data;
    });
  },
  methods: {
    clickDailyDish(val) {
        this.open = true
        this.Id = val.id
    },
    getUrl(val) {
      if (val) {
        val = handlePicturePath(val)[0]
      }
      return val
    },
    sampleTypeFormat(row,column){
      return this.selectDictLabel(this.sampleTypeOptions, row.type);
    },
    mealTypeFormat(row,column){
      return this.selectDictLabel(this.mealTypeOptions, row.mealType);
    },
    /** 查询设备关联管理列表 */
    getList() {
      listDailyDishInfo(this.queryParams).then(response => {
        this.dailyDishInfoList = response.rows;

      });
    },
    handleClose() {
        this.$refs.dishesQrCode.init()
        this.open = false
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/main.scss';

.inspectPanelContent {
  color: #ffffff;
  width: 1250px;
}
.box1 {
  width: 100%;
  float: left;
}
.mapInspectdialog{
  overflow-y: auto;
  overflow-x: hidden;
}
.content_module{
  .content_module_title{
    background: url("~@/assets/image/bigScreen/content_module_title_bg2.png") no-repeat ;
  }
}
.box1 .a1 {
  border: 2px solid #005286;
  margin-bottom:8px;
}
/deep/ .el-dialog__title {
}
/deep/ .el-dialog {
  top:50%;
  margin-top:-330px !important;
}

/deep/ .el-dialog__header {
  background-color: #023568;
  color: #deedf8;
  padding-left: 10px;
}

/deep/ .el-dialog__headerbtn  {
  z-index: 9999;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #ffffff;
}
#dialog::-webkit-scrollbar-thumb {
  border-radius: 0px !important;
  background-color: #204566 !important;
}
#dialog::-webkit-scrollbar-track {
  border-radius: 0px;
  background-color: #355b7f !important;
}
/deep/ .el-dialog__body {
  padding: 0px;
  margin-top: -1px;
  background-image: url('~@/assets/image/bigScreen/mapInsperctPanelBg.png');
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
  right: 8px;
}

#div1::-webkit-scrollbar{
	display: none;
}
.personDomBg{
  background:#000000;
  height:30px;
  filter: alpha(Opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
  width:180px;
  position: absolute;
  bottom:0px;
}
.personDomTitle{
  height:30px;
  line-height:32px;
  width:180px;
  position: absolute;
  bottom:0px;
}
</style>
