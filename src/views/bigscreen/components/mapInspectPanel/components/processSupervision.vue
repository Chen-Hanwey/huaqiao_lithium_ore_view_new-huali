<template>
  <div>
    <div class="content">
      <div class="box1">
        <div class="a1 content_module" style="margin-top: 0px">
          <div class="content_module_title">陪餐管理</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="pcglConfig" style="height:218px;"/>
        </div>
        <div class="a1 content_module">
          <div class="content_module_title">餐品留样</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard2" :config="cplyConfig" style="height:218px;"/>
        </div>
        <div class="a1 content_module">
          <div class="content_module_title">消杀记录</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard3" :config="xsjlConfig" style="height:218px;"/>
        </div>
        <div class="a1 content_module">
          <div class="content_module_title">晨检记录</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard4" :config="cjjlConfig" style="height:218px;"/>
        </div>
      </div>
      <div class="box3">
        <div class="a1 content_module"  style="margin-top: 0px">
          <div class="content_module_title">消防安检</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard5" :config="xfajConfig" style="height:218px;"/>
        </div>
        <div class="a1 content_module">
          <div class="content_module_title">食安自查</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard6" :config="sazcConfig" style="height:218px;"/>
        </div>
        <div class="a1 content_module">
          <div class="content_module_title">卫生防疫</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard7" :config="wsfyConfig" style="height:218px;"/>
        </div>
        <div class="a1 content_module">
          <div class="content_module_title">演练记录</div>
          <div class="scrollBoard_bg" style="height:218px;"></div>
          <dv-scroll-board ref="scrollBoard1" :config="yljlConfig" style="height:218px;"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import $ from 'jquery'
import {listAccompanyManage} from "@/api/accompanyManage/accompanyManage";
import {listFoodSample} from "@/api/foodSample/foodSample";
import {listKillProcessSupervise} from "@/api/killProcessSupervise/killProcessSupervise";
import {listMorningCheck} from "@/api/morningCheck/morningCheck";
import {listKitchenFireSafetySupervise} from "@/api/kitchenFireSafetySupervise/kitchenFireSafetySupervise";
import {listHistory} from "@/api/check/history";
import {listEpidemicPrevention} from "@/api/epidemicPrevention/epidemicPrevention";
import {listExerciseRecord} from "@/api/exerciseRecord/exerciseRecord";

export default {
  name: 'processSupervision',
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
      mealStatusOptions:[],
      mealTypeOptions:[],
      killObjOptions:[],
      cleanWayOptions:[],
      disinfectWayOptions:[],
      rectificationStatusDicList:[],

      //陪餐管理配置
      pcglConfig: {},
      //餐品留样配置
      cplyConfig: {},
      //消杀记录配置
      xsjlConfig: {},
      //晨检记录配置
      cjjlConfig: {},
      //消防安检配置
      xfajConfig: {},
      //食安自查配置
      sazcConfig: {},
      //卫生防疫配置
      wsfyConfig: {},
      //演练记录配置
      yljlConfig: {},
      //配餐管理相关
      pcglQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {
          operationId:this.operationId
        }
      },
      //餐品留样相关
      cplyQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {
          operationId:this.operationId
        }
      },

      //消杀记录相关
      xsjlQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {
          operationId:this.operationId
        }
      },

      //晨检记录相关
      cjjlQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {
          operationId:this.operationId
        }
      },

      //消防安检相关
      xfajQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {
          operationId:this.operationId
        }
      },

      //食安自查相关
      sazcQueryParams: {
        pageNum: 1,
        pageSize: 20,
        examId: 3,
        params: {
          operationId:this.operationId
        }
      },

      //卫生防疫相关
      wsfyQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {
          operationId:this.operationId
        }
      },

      //演练记录相关
      yljlQueryParams: {
        pageNum: 1,
        pageSize: 20,
        params: {
          operationId:this.operationId
        }
      },

    }
  },
  watch: {
    operationId: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          // this.getSzjdList();
        }
      }
    },
    enterpriseId: {
      handler: function(newValue, oldValue) {
        if (newValue) {

        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.getPcglList()
      this.getCplyList()
      this.getXsjlList()
      this.getCjjlList()
      this.getXfajList()
      this.getSazcList()
      this.getWsfyList()
      this.getYljlList()
      $('body').addClass("el-popup-parent--hidden");
    })
  },
  created() {
    this.getDicts("meal_type").then(response => {
      this.mealTypeOptions = response.data;
    });
    this.getDicts("accompany_manage_status").then(response => {
      this.mealStatusOptions = response.data;
    });
    this.getDicts("kill_obj").then(response => {
      this.killObjOptions = response.data;
    });
    this.getDicts("clean_way").then(response => {
      this.cleanWayOptions = response.data;
    });
    this.getDicts("disinfect_way").then(response => {
      this.disinfectWayOptions = response.data;
    });
    this.getDicts("rectification_status").then(response => {
      this.rectificationStatusDicList = response.data;
    });
  },
  methods: {
    getPcglList() {
      let that = this
      if (this.operationId) {
        this.pcglQueryParams.params.operationId = this.operationId
        listAccompanyManage(this.pcglQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.accDate)
            data.push(that.accMealTypeFormat(item))
            data.push(that.accMealStatusFormat(item))
            data.push(item.accMenuName)
            dataList.push(data)
          })
          that.pcglConfig =
            {
              header: ['陪餐日期', '陪餐餐次', '陪餐状态', '陪餐菜单'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180, 180],
              align: ['center', 'center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },
    getCplyList() {
      let that = this
      if (this.operationId) {
        this.cplyQueryParams.params.operationId = this.operationId
        listFoodSample(this.cplyQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.reserveTime)
            data.push(that.mealTypeFormat(item))
            data.push(item.mealEater)
            data.push(item.reserveDeptName)
            data.push(item.orderUnit)
            dataList.push(data)
          })
          that.cplyConfig =
            {
              header: ['留样时间', '留样餐次', '用餐对象', '留样部门','订餐单位'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180, 180,180],
              align: ['center', 'center', 'center', 'center','center'],
              waitTime: 3000
            }
        })
      }
    },

    getXsjlList() {
      let that = this
      if (this.operationId) {
        this.xsjlQueryParams.params.operationId = this.operationId
        listKillProcessSupervise(this.xsjlQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(that.killObjFormat(item))
            data.push(item.killStartTime)
            data.push(that.cleanWayFormat(item))
            data.push(that.disinfectWayFormat(item))
            dataList.push(data)
          })
          that.xsjlConfig =
            {
              header: ['消杀对象', '消杀日期', '清洗方式', '消毒方式'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180, 180],
              align: ['center', 'center', 'center', 'center','center'],
              waitTime: 3000
            }
        })
      }
    },



    getCjjlList() {
      let that = this
      if (this.operationId) {
        this.cjjlQueryParams.params.operationId = this.operationId
        listMorningCheck(this.cjjlQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.checkTime)
            data.push(item.checkAllNum)
            data.push(item.checkedSum)
            data.push(item.checkNopassNum)
            dataList.push(data)
          })
          that.cjjlConfig =
            {
              header: ['晨检日期', '应检总数', '已检人数', '未过人数'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180, 180],
              align: ['center', 'center', 'center', 'center','center'],
              waitTime: 3000
            }
        })
      }
    },

    getXfajList() {
      let that = this
      if (this.operationId) {
        this.xfajQueryParams.params.operationId = this.operationId
        listKitchenFireSafetySupervise(this.xfajQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.fireDate)
            data.push(item.firePlace)
            data.push(item.firePerson)
            dataList.push(data)
          })
          that.xfajConfig =
            {
              header: ['安检日期', '安检地点', '安检人员'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180],
              align: ['center', 'center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },

    getSazcList() {
      let that = this
      if (this.operationId) {
        this.sazcQueryParams.params.operationId = this.operationId
        listHistory(this.sazcQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.submitTime)
            data.push(item.myPoint)
            data.push(that.rectificationStatusFormat(item))
            dataList.push(data)
          })
          that.sazcConfig =
            {
              header: ['检查时间', '检查得分', '检查状态'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180],
              align: ['center', 'center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },

    getWsfyList() {
      let that = this
      if (this.operationId) {
        this.wsfyQueryParams.params.operationId = this.operationId
        listEpidemicPrevention(this.wsfyQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.preventionDate)
            data.push(item.preventionPlace)
            data.push(item.preventionPerson)
            dataList.push(data)
          })
          that.wsfyConfig =
            {
              header: ['防疫日期', '防疫地点', '防疫人员'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180],
              align: ['center', 'center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },

    getYljlList() {
      let that = this
      if (this.operationId) {
        this.yljlQueryParams.params.operationId = this.operationId
        listExerciseRecord(this.yljlQueryParams).then(response => {
          let  dataList = []
          response.rows.forEach(item => {
            let data = []
            data.push(item.exerciseTheme)
            data.push(item.exercisePerson)
            data.push(item.exerciseDate)
            dataList.push(data)
          })
          that.yljlConfig =
            {
              header: ['演练主题', '演练人员', '演练日期'],
              headerBGC: '',
              oddRowBGC: '#0c2445',
              evenRowBGC: '',
              data: dataList,
              indexHeader: '序号',
              index: true,
              columnWidth: [60, 150, 180, 180],
              align: ['center', 'center', 'center', 'center'],
              waitTime: 3000
            }
        })
      }
    },



    accMealTypeFormat(row, column) {
      return this.selectDictLabel(this.mealTypeOptions, row.accMealType);
    },
    mealTypeFormat(row, column) {
      return this.selectDictLabel(this.mealTypeOptions, row.mealType);
    },
    accMealStatusFormat(row, column) {
      return this.selectDictLabel(this.mealStatusOptions, row.accMealStatus);
    },
    // 消杀对象字典翻译
    killObjFormat(row, column) {
      return this.selectDictLabel(this.killObjOptions, row.killObj);
    },
    // 清洗方式字典翻译
    cleanWayFormat(row, column) {
      return this.selectDictLabel(this.cleanWayOptions, row.cleanWay);
    },
    // 消毒方式字典翻译
    disinfectWayFormat(row, column) {
      return this.selectDictLabel(this.disinfectWayOptions, row.disinfectWay);
    },

    // 整改状态字典翻译
    rectificationStatusFormat(row, column) {
      return this.selectDictLabel(this.rectificationStatusDicList, row.rectificationStatus);
    },
  }
}
</script>

<style scoped lang="scss">
@import '../styles/main.scss';

.content {
  overflow: hidden; /*清除浮动*/
  background-size: 100% 100%;
  color: #67E0F1;
  width: 1250px;
}



.box1 {
  width: calc(50% - 4px);
  float: left;
}

.box1 .a1 {
  height: 260px;
  border: 2px solid #005286;
  margin-top:8px;

}

.box3 {
  width: calc(50% - 4px);
  float: right;
}

.box3 .a1 {
  height: 260px;
  border: 2px solid #005286;
  margin-top:8px;
}
.banner-container {
  padding: 0.5rem 0;
  text-align: center;
  margin-top: 165px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;
  overflow-y: hidden;

  .box {
    padding: 0 0.32rem;

    .img {
      width: 10.25rem;
      height: 8.06rem;
    }

    .label {
      font-size: 0.9rem;
      text-align: center;
      margin-top: 5px;
      color: #ffffff;
    }
  }
}


</style>
