<template>
  <div class="app-container">
    <el-row :gutter="10">
      <!--辖区数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input placeholder="请输入" maxlength="50" size="mini" v-model="tree.square.search" clearable style="margin-bottom:8px;">
            <el-button slot="append" icon="el-icon-search" @click="initTreeSquare"></el-button>
          </el-input>
        </div>
        <div class="head-container treeShow" :style="{'height':treeHeight+'px', 'overflow': 'auto','background':' #ffffff'}">
          <el-tree :default-expand-all="defaultExpandAll" :data="tree.square.data" :props="tree.defaultTreeProps" ref="treeSquare" :highlight-current="true">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div @click="treeClick(data)" :class="[data.isActivity==='1'?'isActivity':'','custom-tree-node-left']">
                <span :title="node.label"> {{ node.label }}</span>
                <span style="margin-left: 15px;">
                  <span v-if="data.status==='1'" class="isEnabled">未激活</span>
                  <span v-else-if="data.status==='2'" class="isDisabled">在线</span>
                  <span v-else-if="data.status==='3'" class="isDisabled">离线</span>
                </span>
              </div>
            </div>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <!-- <div :style="{'height':'652px', 'overflow': 'auto','background':' #ffffff'}"> -->
        <el-tabs v-model="dataType" ref="tabs" v-loading="loadingBorder" type="card" class="tab-pane-class" style="background-color: #fff">
          <el-tab-pane label="数据看板" name="detail" style="margin-left:10px;margin-right:10px">
            <div :style="{'height':treeHeight-20+'px', 'overflow-y': 'auto','overflow-x': 'hidden','background':' #ffffff'}">
              <el-row :gutter="5">
                <el-col :span="14">
                  <el-card shadow="always" style="height:320px">
                    <div class="sub-title">
                      <div class="sub-title-name">设备详情</div>
                    </div>
                    <el-row>
                      <el-col>
                        <el-form ref="formDetail" :model="formDetail">
                          <div>
                            <el-row style="height:40px">
                              <el-col :span="8">
                                <el-form-item label="设备名称:" prop="devName">
                                  <span>{{formDetail.devName}}</span>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item label="设备状态:" prop="status">
                                  <span>{{ formDetail.status | statusFomatter }}</span>
                                </el-form-item>
                              </el-col>
                              <!--<el-col :span="8">
                                <el-form-item label="归属辖区:" prop="deptId">
                                  <span v-if="acodeMap">{{ acodeMap[formDetail.deptId] }}</span>
                                </el-form-item>
                              </el-col>-->
                            </el-row>
                            <el-row>
                              <el-col :span="24">
                                <div id="container" style="width: 100%;height: 210px;top:-20px;"></div>
                              </el-col>
                            </el-row>
                          </div>
                        </el-form>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
                <el-col :span="10">
                  <el-card shadow="always" style="height:320px">
                    <div class="sub-title">
                      <div class="sub-title-name">告警次数</div>
                    </div>
                    <div>
                      <line-chart :chart-data="alertData" :name="'告警次数'"></line-chart>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row style="margin-top:5px;">
                <el-col :span="24">
                  <el-card shadow="always">
                    <div class="sub-title">
                      <div class="sub-title-name">主要指标（平均值）</div>
                    </div>
                    <el-date-picker clearable size="small" style="width: 240px;" v-model="averageTimeRange" type="daterange" value-format="yyyy-MM-dd" 
                         placeholder="选择上传时间"
                         @change="getListAvgHistoryTime">
                    </el-date-picker>
                    <!--平局值-->
                    <div>
                      <div class="average-border" v-for="(item,idx) in avgPropertyHistory">
                        <div class="average-border-left">
                          <img src="@/assets/environment/zhibiao.svg">
                        </div>
                        <div class="average-border-right">
                          <div class="average-border-right-top">{{ item.label }}</div>
                          <div class="average-border-right-bottom">{{ item.value }}</div>
                        </div>
                      </div>
                    </div>

                  </el-card>
                </el-col>
              </el-row>
              <el-row style="margin-top:5px;margin-bottom:10px">
                <el-col :span="24">
                  <el-card shadow="always" style="height:325px" v-if="devType === 1">
                    <div class="sub-title">
                      <div class="sub-title-name">近7日趋势</div>
                    </div>
                    <el-row :gutter="13">
                      <el-col :span="8">
                        <line-chart :chart-data="temperaturetData" :width="'80%'" :name="'噪音(dB)'"></line-chart>
                      </el-col>
                    </el-row>
                  </el-card>
                  <el-card shadow="always" style="height:325px" v-if="devType === 2">
                    <div class="sub-title">
                      <div class="sub-title-name">近7日趋势</div>
                    </div>
                    <el-row :gutter="13">
                      <el-col :span="8">
                        <line-chart :chart-data="AQIData" :width="'80%'" :name="'粉尘浓度(mg/m³)'"></line-chart>
                      </el-col>
                      <el-col :span="8">
                        <line-chart :chart-data="PM25Data" :width="'80%'" :name="'游离二氧化硅(%)'"></line-chart>
                      </el-col>
                      <el-col :span="8">
                        <line-chart :chart-data="PM10Data" :width="'80%'" :name="'粉尘分散度(%)'"></line-chart>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="报表" name="report" style="margin-left:10px;padding-margin:10px">
            <el-row :gutter="20">
              <el-col :span="5" :xs="24">
                <div class="head-container treeShow" style="font-size:14px;margin-left:10px" :style="{'height':treeHeight-70+'px', 'overflow': 'auto'}">
                  <span v-for="(item,idx) in devicePropertyList">
                    <div @click="envDataTreeClick(item)" :class="[item.isActivity==='1'?'isActivity':'']" style="margin-top: 10px;cursor: pointer">
                      <span>{{ item.name }}</span>
                    </div>
                  </span>
                </div>
              </el-col>
              <el-col :span="19" :xs="24" style="border-left: 1px solid #e2e2e2">
                <el-table ref="table" :height="treeHeight-70" v-loading="loadingProperty" :data="recordList" stripe>
                  <el-table-column type="selection" width="55" align="center" />
                  <el-table-column label="设备名称" prop="deviceName" align="center" sortable :render-header="renderHeader" />
                  <el-table-column label="指标名称" prop="label" align="center" sortable :render-header="renderHeader" />
                  <el-table-column label="上报值" prop="value" align="center" sortable :render-header="renderHeader" />
                  <el-table-column label="上报时间" prop="datetime" align="center" sortable :render-header="renderHeader" />
                </el-table>
                <pagination :total="propertyTotal" :page.sync="queryParm.pageNum" :limit.sync="queryParm.pageSize" @pagination="getListHistory" />
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
        <!-- </div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getDetails,
    getEnvDevicTree,
    getProductList,
    // historyAvgList,
    listDeviceProperty
  } from '@/api/contentCoupletPerception/soil'
  import { getAlertData } from '@/api/contentCoupletPerception/alert'
  import { getAttributeData,historyAvgList,listHistory } from '@/api/contentCoupletPerception/data'
  import lineChart from './components/LineChart'
  import { checkConfigure } from '@/api/contentCoupletPerception/air'
  import { getMap } from '@/api/system/dept'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
  name: "Details",
  components: {
    Treeselect, lineChart
  },
  data () {
    return {
      AQIData: [],
      PM25Data: [],
      PM10Data: [],
      SO2Data: [],
      NO2Data: [],
      COData: [],
      O3Data: [],
      airHumidityData: [],
      airTemperaturetData: [],
      windSpeedData: [],
      windDirectionData: [],
      temperaturetData: [],
      humidityData: [],
      ECData: [],
      PHData: [],
      alertData: [],
      //水质监测数据
      ammoniaNitrogenData: [],
      dissolvedOxygenData: [],
      phData: [],
      waterTemperatureData: [],
      rainfallData: [],
      waterLevelData: [],
      formDetail: {},
      dataType: "detail",
      defaultExpandAll: true,
      treeHeight: 450,
      tabsHeight: 900,
      recordTreeHeight: 450,
      dialogIcon: undefined,
      productOptions: [],
      operationType: undefined,
      loading: true,
      loadingBorder: false,
      // 选中数组
      ids: [],
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      propertyTotal: 0,
      // 物联感知设备表格数据
      detailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        devName: null,
        productId: null,
        deptId: null,
        identifier: null
      },
      // 表单参数
      form: {},
      // 表单校验
      tableHeight: 400,
      recordTableHeight: 580,
      tableOffset: 250,
      isFirstEnter: false,
      acodeMap: undefined,
      deptName: undefined,
      treeStyle: {
        height: ''
      },
      tree: {
        defaultTreeProps: {
          children: 'children',
          label: 'label'
        },
        square: {
          data: null,
          search: ''
        },
        squareTemp: {
          data: null,
          search: ''
        },
        label: {
          data: null
        },
        favorite: {
          data: null,
          search: ''
        }
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 辖区树选项
      deptOptions: undefined,
      expandArr: [],
      monitorOpen: false,
      loadingProperty: false,
      devicePropertyList: [],
      recordList: [],
      queryDevName: '',
      queryProductId: '',
      openThreshold: false,
      contentDevLevelOptions: [],
      levelType: null,
      // 地图对象
      map: null,
      infoWindow: '',
      content: '',
      marker: '',
      averageTimeRange: [],
      //平均值
      avgPropertyHistory: [],
      devType: null,
      queryParm: {
        pageNum: 1,
        pageSize: 10,
      },
      avgDevName: null,
    };
  },
  filters: {
    statusFomatter (str) {
      if (str) {
        if (str === "OFFLINE") {
          return "离线"
        } else if (str === "ONLINE") {
          return "在线"
        } else if (str === "INACTIVE") {
          return "未激活"
        } else {
          return "离线"
        }
      }
    },
  },
  created () {
    //this.getMap()
    //this.checkConfigure();
    this.getDicts('content_dev_level').then(response => {
      this.contentDevLevelOptions = response.data
    });
    let d = new Date();
    let youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.averageTimeRange = [youWant, youWant];
    this.initTreeSquare();
  },
  methods: {
    //返回当前时间
    returnTime(time2) {
      var date = new Date(time2);
      // return time.toLocaleDateString();
      // return moment(time).format("YYYY-MM-DD")
      var year = date.getFullYear()
      // 注意取得的月份为0-11，所以要加1
      var month = date.getMonth() + 1
      // 注意天的取得，是getDate()，而不是getDay()
      var day = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      // 格式拼接：yyyy-MM-dd HH:mm:ss
      var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      return time ;
    },
    
    initMap () {
      this.map = new AMap.Map('container', {
        center: [112.164543, 24.113912],
        //mapStyle: 'amap://styles/b125cc30f48d58a2a34912540fb4291a',
        pitch: 0,
        disableSocket: true,
        showLabel: true,
        rotateEnable: false,
        zoom: 15,
      });
    },
    addMarker (lat, lon) {
      let marker = new AMap.Marker({
        position: [lat, lon],
      });
      this.map.add(marker)
    },
    // 获取树
    initTreeSquare () {
      let that = this
      let query = {
        name: that.tree.square.search,
        type: 1
      }
      if (this.$route.path.indexOf("airData")>-1) {//噪声
        query.type = 1;
        this.devType = 1;
      }else if (this.$route.path.indexOf("soilData")>-1) {//粉尘
        query.type = 2;
        this.devType = 2;
      }
      getEnvDevicTree(query).then(response => {
        that.tree.square.data = response.data
      })
    },
    checkConfigure () {
      checkConfigure().then(response => {

      }).catch(error => {
        this.$confirm(error.message + '，请在系统管理 -- 基础配置 -- 对接配置中配置对应信息', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {

        })
      })
    },
    //点击查询具体监测数据
    treeClick (data) {
      let that = this
      if(data.id==0){
        return;
      }
      data.isActivity = '1';
      for (let i = 0; i < this.tree.square.data.length; i++) {
        let children1 = this.tree.square.data[i].children;
        if (children1) {
          for (let g = 0; g < children1.length; g++) {
            if (!children1[g].children && children1[g].cameraId !== data.cameraId) {
              children1[g].isActivity = '';
            }
            if (children1[g].children) {
              let children2 = children1[g].children;
              for (let f = 0; f < children2.length; f++) {
                if (children2[f].cameraId !== data.cameraId) {
                  children2[f].isActivity = '';
                }
                let children3 = children2[f].children;
                if (children3) {
                  for (let d = 0; d < children3.length; d++) {
                    if (children3[d].cameraId !== data.cameraId) {
                      children3[d].isActivity = '';
                    }
                  }
                }
              }
            }
          }
        }
      }
      that.$forceUpdate();
      this.loadingBorder = true;
      this.$nextTick(() => {
        this.handleMonitorData(data);
        this.getAlertData(data);
        this.getAttributeData(data);
        this.getDevicDetail(data);
        this.getListAvgHistory(data);
        this.loadingBorder = false;
      })
    },
    getDevicDetail (data) {
      const id = data.cameraId
      getDetails(id).then(response => {
        this.formDetail = response.data
        if (this.formDetail.lat && this.formDetail.lon) {
          this.map.setCenter([parseFloat(this.formDetail.lat), parseFloat(this.formDetail.lon)])
          this.addMarker(parseFloat(this.formDetail.lat), parseFloat(this.formDetail.lon))
        }
      })
    },
    getAttributeData (data) {
      let query = {
        deviceName: data.label,
        // devType: this.devType
      }
      getAttributeData(query).then(response => {
        // if (this.devType === 1) {
        //   this.temperaturetData = response.data.soilTemperature
        // } else if (this.devType === 2) {
        //   this.AQIData = response.data.concentration
        //   this.PM25Data = response.data.sio2
        //   this.PM10Data = response.data.dispersion
        // }
        this.temperaturetData = response.data.soilTemperature
        this.AQIData = response.data.concentration
        this.PM25Data = response.data.sio2
        this.PM10Data = response.data.dispersion
      })
    },
    getAlertData (data) {
      let query = {
        devName: data.label,
        devType: this.devType
      }
      getAlertData(query).then(response => {
        console.log('data==',response.data);
        if(response.data){
          this.alertData = response.data;
        }
      });
    },
    envDataTreeClick (data) {
      let that = this
      data.isActivity = '1';
      for (let i = 0; i < this.devicePropertyList.length; i++) {
        if (this.devicePropertyList[i].identifier != data.identifier) {
          this.devicePropertyList[i].isActivity = '';
        }
      }
      this.$forceUpdate();
      this.loadingProperty = true;
      that.queryParm.deviceName = this.queryDevName
      // that.queryParm.prodectId = this.queryProductId
      that.queryParm.identifier = data.identifier
      // that.queryParm.label = data.name
      // that.queryParm.devType = that.devType
      this.getListHistory();
    },
    getListHistory () {
      listHistory(this.queryParm).then(response => {
        response.rows.map(item=>{
          item.datetime=this.returnTime(item.datetime); 
        })
        this.recordList = response.rows;
        this.propertyTotal = response.total;
        this.loadingProperty = false;
      });
    },
    handleMonitorData (data) {
      let productId;
      let row = {
        devName: data.label,
        devType: this.devType,
        productId: productId
      }
      if (this.devType == 1){//噪声
        this.queryProductId = row.productId;
        this.queryDevName = row.devName;
        this.devicePropertyList = [
            {
              identifier:"noise",
              value:"分贝",
              name:"分贝",
            }
          ]
      }else if(this.devType == 2) {//粉尘
        this.queryProductId = row.productId;
        this.queryDevName = row.devName;
        this.devicePropertyList = [
          {
            identifier:"concentration",
            value:"粉尘浓度",
            name:"粉尘浓度",
          },
          {
            identifier:"sio2",
            value:"游离二氧化硅含量",
            name:"游离二氧化硅含量",
          },
          {
            identifier:"dispersion",
            value:"粉尘分散度",
            name:"粉尘分散度",
          },
        ]
      }
      console.log(this.devicePropertyList)
      /*listDeviceProperty(row).then(response => {
        this.queryProductId = row.productId;
        this.queryDevName = row.devName;
        this.devicePropertyList = response.data;
      });*/
    },
    //切换时间 平均值
    getListAvgHistoryTime () {
      let beginCreateTime = this.averageTimeRange && this.averageTimeRange.length > 0 ? this.averageTimeRange[0] : undefined;
      let endCreateTime = this.averageTimeRange && this.averageTimeRange.length > 0 ? this.averageTimeRange[1] : undefined;
      let queryAvgPara = {
        beginCreateTime: beginCreateTime,
        endCreateTime: endCreateTime,
        deviceName: this.avgDevName,
        // devType: this.devType
      }
      historyAvgList(queryAvgPara).then(response => {
        this.avgPropertyHistory = response.data;
      });
    },
    /**查询平均值*/
    getListAvgHistory (data) {
      this.avgDevName = data.label
      let beginCreateTime = this.averageTimeRange && this.averageTimeRange.length > 0 ? this.averageTimeRange[0] : undefined;
      let endCreateTime = this.averageTimeRange && this.averageTimeRange.length > 0 ? this.averageTimeRange[1] : undefined;
      let queryAvgPara = {
        beginCreateTime: beginCreateTime,
        endCreateTime: endCreateTime,
        deviceName: data.label,
        // devType: this.devType
      }
      historyAvgList(queryAvgPara).then(response => {
        this.avgPropertyHistory = response.data;
        // this.loadingBorder = false;
      });
    },
    /** 按钮操作 */
    handleView (row) {
      this.reset()
      const id = row.id
      getDetails(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '查看土壤监测设备'
        this.dialogIcon = 'el-icon-view';
        this.operationType = 3;
      })
    },
    renderHeader (h, { column, $index }, width) {
      let color = '#515a6e';
      let that = this;
      if (that.columnLabel != '' && that.columnLabel == column.label) {
        color = "#ff6600";
      }
      let style = {};
      if (width) {
        // width: 'calc(' + width + '% - 48px)'
        style = {
          textAlign: 'center',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color,
          width: width + "%"
        }
      } else {
        style = {
          textAlign: 'left',
          wordBreak: 'break-all',
          whiteSpace: 'pre-line',
          display: 'inline-block',
          lineHeight: 'normal',
          color: color
        }
      }
      return h(
        'span',
        {
          style: style,
        },
        column.label)
    },
    getMap () {
      getMap().then(response => {
        this.acodeMap = response.data
      })
    },
    /** 查询辖区下拉树结构 */
    setTreeHeight () {
      this.treeHeight = window.innerHeight - 138;
    },
    setTabsHeight () {
      this.tabsHeight = window.innerHeight - 138;
    },
    getProductList () {
      getProductList().then(response => {
        this.productOptions = response.data;
      })

    },
    //表格排序
    changeTableSort (column) {
      let order = '';
      if (column.order === 'ascending') {
        order = 'asc';
      } else if (column.order === 'descending') {
        order = 'desc';
      }
      if (order !== '') {
        this.queryParams.sort = column.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
        this.queryParams.order = order;
        this.queryParams.pageNum = 1;
        this.columnLabel = column.column.label;
      } else {
        this.queryParams.sort = '';
        this.queryParams.order = '';
        this.queryParams.pageNum = 1;
        this.columnLabel = '';
      }
      this.getList();
    },
  },
  watch: {
    // 根据名称筛选辖区树
    deptName (val) {
      this.$refs.tree.filter(val)
    },
    'form.productId': function (val) {
      if (val) {
        this.$refs['form'].clearValidate('productId');
      }
    },
    showSearch (val) {
      this.$nextTick(function () {
        // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      });
    },
    '$store.state.app.screenHeight': function () { //监听屏幕高度变化
      // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      this.setTreeHeight();
      this.setTabsHeight();
    }
  },
  mounted () {
    this.initMap();
    this.$nextTick(function () {
      // this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - this.tableOffset;
      this.setTreeHeight();
      this.setTabsHeight();
      this.getAttributeData(data);
    });
  }
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  font-size: 12px;
  width: 100%;
}
.custom-tree-node-left {
  float: left;
  font-size: 12px;
  white-space: nowrap;
  color: #000000;
}
.isActivity {
  color: #25b104;
}
.isOutline {
  color: #c3bfbf;
}

::v-deep .el-tree-node > .el-tree-node__children {
  overflow: unset;
  background-color: transparent;
}
.average-border {
  width: 230px;
  height: 80px;
  margin-top: 10px;
  margin-right: 20px;
  float: left;
  border: 1px solid #e6ebf5;
  margin-bottom: 10px;
}
.average-border-left {
  width: 40%;
  height: 100%;
  float: left;
}
.average-border-left img {
  width: 60px;
  margin-top: 8px;
  margin-left: 8px;
}
.average-border-right {
  width: 60%;
  height: 100%;
  float: left;
}
.average-border-right-top {
  text-align: left;
  height: 50%;
  margin-left: 10px;
  line-height: 40px;
  color: #999999;
}
.average-border-right-bottom {
  text-align: left;
  height: 50%;
  margin-left: 10px;
  line-height: 30px;
  font-size: 20px;
}
</style>
