<template>
  <div style="width: 100%; height: 100%;" id="my-amap">
    <!--    amap://styles/4d4e57b95880606eef3d2445721a2403-->
    <!--    amap://styles/b125cc30f48d58a2a34912540fb4291a-->
    <amap
      cache-key="map"
      ref="map"
      map-style="amap://styles/b125cc30f48d58a2a34912540fb4291a"
      view-mode="3D"
      async
      :zoom.sync="zoom"
      :center.sync="center"
      :pitch.sync="pitch"
      :rotation.sync="rotation"
      :show-indoor-map="false"
      :features="['bg','road','building']"
      is-hotspot
      @hotspotclick="onHotspotClick"
      @moveend="moveend"
    >
      <template v-if="mapLayerType!='街道'">
        <amap-satellite-layer/>
        <amap-road-net-layer/>
        <amap-traffic-layer/>
      </template>

      <!--      枣庄市边界-->
      <!--      <amap-polygon-->
      <!--        :zIndex="5"-->
      <!--        :strokeOpacity=".2"-->
      <!--        :fillOpacity=".1"-->
      <!--        :fillColor="'rgb(255,255,255)'"-->
      <!--        :path="zaozhuang_polyline"/>-->

      <!--      薛城区下每一个 街道-->
      <template v-for="(item,index) in cityPolyline">
        <amap-polygon
          :zIndex="5"
          :strokeColor="'#fff'"
          :strokeOpacity=".2"
          :fillOpacity=".1"
          :fillColor="'rgb(255,255,255)'"
          :key="index"
          :path="item"/>
      </template>

      <template v-for="(item,index) in markDatas">
        <template v-if="item.type=='district'">
          <amap-marker
            :key="item.code"
            @click="districtClick(item)"
            :position="item.position"
            :offset="[-22, -40]"
            :label="{
                      content: item.name+(operationNumByDistrict['c'+item.code]?operationNumByDistrict['c'+item.code]:0)+'家',
                      direction: 'bottom',
                      fontSize:20
                    }"
            :icon="markerIcon0"
          />
        </template>
        <template v-else>
          <!--          <amap-marker-->
          <!--            v-if="isDistrict"-->
          <!--            :key="item.code"-->
          <!--            @click="sumDataClick(item)"-->
          <!--            :position="item.position"-->
          <!--            :offset="[-22, -40]"-->
          <!--            :label="{-->
          <!--                      content: item.name+'：'+item.num+'人',-->
          <!--                      direction: 'bottom',-->
          <!--                      fontsize:16-->
          <!--                    }"-->
          <!--            :icon="markerIcon0"-->
          <!--          />-->

          <amap-marker
            @click="laoRenCLick(item)"
            :key="item.id"
            :position="item.position"
            :offset="[-22, -40]"
            :label="{
                      content: item.name,
                      direction: 'bottom',
                      fontSize:20
                    }"
            :icon="getLaorenIcon(item)"
          />
        </template>
      </template>


    </amap>
    <div class="map-layer-change">
      <el-radio-group v-model="mapLayerType" size="mini">
        <el-radio-button label="卫星"></el-radio-button>
        <el-radio-button label="街道"></el-radio-button>
      </el-radio-group>
    </div>
    <!--    图例-->
    <div v-if="backShow"
         style="position: absolute;right: 20px;bottom: 80px;transition: all linear .3s;background: rgba(255,255,255,.2);padding: 5px">
      <!--      <div class="legend-box">-->
      <!--        <div class="legend">-->
      <!--          <img :src="require('@/assets/image/mapManagement/icons/3.png')"/>-->
      <!--          <img :src="require('@/assets/image/mapManagement/icons/4.png')"/>-->
      <!--          <span>全护理</span>-->
      <!--        </div>-->
      <!--        <div class="legend">-->
      <!--          <img :src="require('@/assets/image/mapManagement/icons/2.png')"/>-->
      <!--          <img :src="require('@/assets/image/mapManagement/icons/5.png')"/>-->
      <!--          <span>半护理</span>-->
      <!--        </div>-->
      <!--        <div class="legend">-->
      <!--          <img :src="require('@/assets/image/mapManagement/icons/1.png')"/>-->
      <!--          <img :src="require('@/assets/image/mapManagement/icons/6.png')"/>-->
      <!--          <span>全自理</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div v-if="backShow" @click="reset"
         style="position: relative;height:4vh;width:4vh;font-size: 3vh;text-align:center;line-height:4vh;color: #0ed6f6;position: absolute;left: 90%;top:10%;cursor: pointer;;z-index: 999;transition: all linear .3s">
      <img src="@/assets/image/back_1.svg" style="width: 100%">
    </div>
  </div>
</template>

<script>
import {listOperationManage} from "../../../api/operationManage/operationManage";
import {getOperationNumByDistrict} from "../../../api/bigScreen/bigScreen";
import barChartTwo from '@/views/bigscreen/components/barChartTwo'
import pieChartOne from '@/views/bigscreen/components/pieChartOne'
import pieChartTwo from '@/views/bigscreen/components/pieChartTwo'
const cityData = require('../components/city/370403.json')
const zaozhuang_cityData = require('../components/city/370403_all.json')
//各类老人icon
const type_1 = require('@/assets/images/bigscreen/icon/学校.png')
const type_2 = require('@/assets/images/bigscreen/icon/企业门户.png')
const type_3 = require('@/assets/images/bigscreen/icon/养老.png')
const type_4 = require('@/assets/images/bigscreen/icon/睡觉.png')
const type_5 = require('@/assets/images/bigscreen/icon/餐馆.png')
const type_6 = require('@/assets/images/bigscreen/icon/厨房.png')

const subGeoCoordMap = {
  '370403005': {
    name: '常庄街道',
    zoom: 12.31,
    center: [117.26037, 34.768117]
  },
  '370403001': {
    name: '临城街道',
    zoom: 12.31,
    center: [117.262745, 34.803716]
  },
  '370403101': {
    name: '沙沟镇',
    zoom: 12.31,
    center: [117.331535, 34.743679]
  },
  '370403104': {
    name: '陶庄镇',
    zoom: 12.31,
    center: [117.353142, 34.870683]
  },
  '370403003': {
    name: '兴城街道',
    zoom: 12.31,
    center: [117.360871, 34.826067]
  },
  '370403002': {
    name: '兴仁街道',
    zoom: 12.31,
    center: [117.313633, 34.810037]
  },
  '370403004': {
    name: '张范街道',
    zoom: 12.31,
    center: [117.448796, 34.819981]
  },
  '370403102': {
    name: '周营镇',
    zoom: 12.31,
    center: [117.399779, 34.67375]
  },
  '370403103': {
    name: '邹坞镇',
    zoom: 12.31,
    center: [117.432035, 34.877028]
  },
}

//街道中心点
const geoCoordMap = {
  '370403005': [117.26037, 34.768117],
  '370403001': [117.262745, 34.803716],
  '370403101': [117.32569854035813, 34.75495705422184],
  '370403104': [117.30639361059498, 34.87106802669236],
  '370403003': [117.36534090460252, 34.827072418964285],
  '370403002': [117.29449072169767, 34.82264428253273],
  '370403004': [117.46486854249267, 34.82833760080187],
  '370403102': [117.41257435987242, 34.6923305532613],
  '370403103': [117.47077272440141, 34.89602482911276],
}

export default {
  data() {
    return {
      oldSum: 0,//薛城区老人总数
      mapLayerType: '街道',
      backShow: false,
      markerIcon0: require('@/assets/image/school_28.png'),
      markerIcon1: require('@/assets/image/b_man_26.png'),
      markerIcon2: require('@/assets/image/o_man_26.png'),
      // center: [117.353654, 34.770539],
      center: [117.430864, 34.856667],
      isDistrict: true,
      currentCode: null,//当前要显示的街道
      // zoom: 11.38,
      zoom: 9.8,
      pitch: 25,
      rotation: 15,
      district: null,//行政区划插件
      zaozhuang_polyline: [],//枣庄市区域边界
      xuecheng_polyline: [],//枣庄市区域边界
      polyline: [],//区域边界
      sumData: [],//县镇数据汇总
      laoRenData: [],//要展示的老人详细点数据,
      allLaoRenData: [],//所有的老人数据
      markDatas: [],//绘制的点数据
      cityPolyline: [],//边界数据
      districtList: [],//所有区县的点数据
      currentCity: {},//当前点击的行政区 暂存
      operationNumByDistrict: {},
    };
  },
  beforeMount() {
    //获取区域数量统计
    getOperationNumByDistrict().then(res => {
      console.log('=====获取区域数量统计======')
      res.data.forEach(v => {
        this.operationNumByDistrict['c' + v.code] = v.num
      })
    })
    //地图边界
    let coordinates = cityData.features.map(v => {
      return v.geometry.coordinates[0]
    })
    let zaozhuang_coordinates = zaozhuang_cityData.features.map(v => {
      // console.log(v)
      return v.geometry.coordinates[0]
    })
    this.xuecheng_polyline = coordinates
    this.zaozhuang_polyline = zaozhuang_coordinates
    this.cityPolyline = this.zaozhuang_polyline
  },
  mounted() {
    this.getSumData()
    this.getAllOldManData()
    this.$nextTick(() => {
      this.drawBounds()
    })
  },
  methods: {
    //不同类型经营店展示不同icon
    getLaorenIcon(item) {
      if (eval('type_' + item.bigType)) {
        return eval('type_' + item.bigType)
      }
      return type_1
    },
    onHotspotClick(e) {
      // debugger
      if (e && e.lnglat) {
        this.center = [e.lnglat.lng, e.lnglat.lat];
      }
    },
    zoomend() {
      console.log(this.$refs.map.zoom)
      // debugger
      if (this.$refs.map.zoom > 12) {
        // 显示老人打点
        this.markDatas = this.allLaoRenData
        this.isDistrict = false
        this.backShow = true
      } else if (this.$refs.map.zoom <= 12 && this.$refs.map.zoom >= 10) {
        // 显示区域汇总打点
        this.cityPolyline = this.xuecheng_polyline
        this.markDatas = this.sumData
        this.isDistrict = true
        this.backShow = false
        this.$emit('areaChange', this.currentCity.code || 370400, this.currentCity.name || '枣庄市')
      } else {
        // 枣庄市层级
        this.cityPolyline = this.zaozhuang_polyline
        this.markDatas = this.districtList
        this.isDistrict = true
        this.backShow = false
        this.$emit('areaChange', 370400, '枣庄市')
      }
    },
    moveend(e) {
      console.log(this.$refs.map.center)
    },
    //返回到区这一级
    reset() {
      this.center = [117.348165, 34.782478]
      this.zoom = 10
      this.isDistrict = true
      this.backShow = false
      this.markDatas = this.districtList
      this.$emit('areaChange', this.currentCity.code || 370400, this.currentCity.name || '枣庄市')
    },
    districtClick(current) {
      // debugger
      this.center = current.position
      this.zoom = 14.5
      this.currentCity = current
      this.backShow = true;

      // 点击 根据区县 获取 打点
      // this.markDatas = this.sumData
      this.getOldManData(current.code)
      this.$emit('areaChange', current.code, current.name)
    },
    laoRenCLick(e) {
      this.$emit('showOperationDetail', e.id,e.enterpriseId)
    },
    sumDataClick(e) {
      //乡镇汇总数据被点击  位移到该乡镇  展示乡镇数据
      if (subGeoCoordMap[e.code]) {
        let current = subGeoCoordMap[e.code]
        this.center = current.center
        this.zoom = current.zoom
        this.$emit('areaChange', e.code)
      } else {
        this.zoom = 13
        this.$emit('areaChange', 370400, '枣庄市')
      }
      this.backShow = true
      this.isDistrict = false
      this.getOldManData(e.code)
    },
    //获取汇总数据
    async getSumData() {
      let oldSum = 0
      //老人 数量
      // let res = (await getCityOldCount()).data.map(v => {
      //   oldSum += Number(v.num)
      //   return {
      //     ...v,
      //     position: geoCoordMap[v.code]
      //   }
      // })
      // this.sumData = res
      this.oldSum = oldSum
      // this.markDatas = this.sumData
    },
    //获取老人详细数据
    async getOldManData(code) {
      let datas = await listOperationManage({townCode: code, pageNum: 1, pageSize: 2000})

      let laoren = datas.rows.filter(v => v.latitude && v.longitude).map(v => {
        return {
          id: v.id,
          enterpriseId: v.enterpriseId,
          code: v.id,
          name: v.name,
          position: [v.longitude, v.latitude],
          address: v.address,
          bigTypeName: v.bigTypeName,
          bigType: v.bigType
        }
      })
      this.laoRenData = laoren
      this.sumData = laoren
      this.markDatas = laoren
    },
    //获取所有的老人数据
    async getAllOldManData() {
      // let datas = await listWithInOrder({townCode: undefined, pageNum: 1, pageSize: 2000})
      //
      // let laoren = datas.rows.filter(v => v.latitude && v.longitude).map(v => {
      //   // console.log(v)
      //   return {
      //     name: v.name,
      //     position: [v.longitude, v.latitude],
      //     address: v.address,
      //     age: v.age,
      //     id: v.id,
      //     villageName: v.villageName,
      //     villageCode: v.villageCode,
      //     townName: v.townName,
      //     townCode: v.townCode,
      //     avatarPath: v.avatarPath,
      //     inServiceCount: v.inServiceCount,
      //     selfCareAbility: v.selfCareAbility,
      //   }
      // })
      // this.allLaoRenData = laoren
    },
    //获取行政区边界
    drawBounds() {
      if (!this.district) {
        let opts = {
          subdistrict: 1, //获取边界不需要返回下级行政区
          extensions: 'all', //返回行政区边界坐标组等具体信息
          level: 'district',//查询行政级别为市
          showbiz: true,
        }
        this.district = new AMap.DistrictSearch(opts);
        this.district.search('枣庄市', (status, result) => {
          console.log(result)
          let bounds = result.districtList[0].boundaries
          //区中心点信息
          let districtList = result.districtList[0].districtList.map(v => {
            return {
              name: v.name,
              position: [v.center.lng, v.center.lat],
              code: v.adcode,
              type: 'district'
            }
          })
          //临时增加高新区
          districtList.push({
            name:'高新区',
            position: [117.42,34.80],
            code: 370491,
            type: 'district'
          })
          this.districtList = districtList
          this.markDatas = this.districtList
          console.log(this.districtList)
          return
          // this.center = [result.districtList[0].center.lng,result.districtList[0].center.lat]
          //枣庄市轮廓 采用手动的
          let polygons = []
          if (bounds) {
            for (let i = 0, l = bounds[0].length; i < l; i++) {
              polygons.push([bounds[0][i].lng, bounds[0][i].lat])
            }
          }
          this.zaozhuang_polyline = polygons
        })
      }
    }
  },
};
</script>
<style lang="scss">
.map-layer-change {
  height: 2rem;
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.legend-box {
  .legend {
    display: flex;
    align-items: center;
    margin: 5px 0;

    img {
      width: 26px;
      margin-right: 5px;
    }

    span {
      padding-left: 5px;
      padding-right: 10px;
      font-size: 12px;
      border: none;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0);
      color: #333;
      /*字体包白边*/
      text-shadow: #fff 1px 0 0, #fff 0 1px 0, #fff -1px 0 0, #fff 0 -1px 0;
    }
  }
}
</style>
<style>
#my-amap .amap-marker-label {
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0);
  color: #d2e3f3;
  /*字体包白边*/
/*text-shadow: #cae9f3 1px 0 0, #cae9f3 0 1px 0, #cae9f3 -1px 0 0, #cae9f3 0 -1px 0;*/
font-size: 14px;
}
</style>
