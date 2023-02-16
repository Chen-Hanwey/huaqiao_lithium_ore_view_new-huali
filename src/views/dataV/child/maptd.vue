<template>
  <div id="bdmap" class="map">

    <!--      <el-dialog center :title="dialogName" :visible.sync="dialogVisible" width="700px" height="500px" :before-close="handleClose" class="playerDialog" style="z-index: 999">

            <video :source-url="souceUrl"></video>
          </el-dialog>-->
  </div>

</template>
<script>
import MapInit from "./map.js";
import mapConfig from "./mapData"
import {
  listCamera
} from "@/api/project/ga/camera";
import { getPlayStream } from "@/api/project/ga/camera";

export default {
  data () {
    return {
      souceUrl: "",
      dialogName: "设备",
      dialogVisible: false,
      map: null,
      cemreaList: [],
      zoom: 14
    }
  },
  created () {
    this.init();
    this.point();
  },

  mounted () {

  },




  methods: {
    init () {

      MapInit.init().then(
        T => {
          this.T = window.T;
          const imageURL = "http://t0.tianditu.gov.cn/img_c/wmts?tk=437d6f7ac9ec84269167a76aae6516a4";
          const lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });
          const config = { layers: [lay], name: 'TMAP_HYBRID_MAP' };
          this.map = new T.Map('bdmap', config);
          this.map.centerAndZoom(new T.LngLat(115.00, 28.60), this.zoom);
          // //创建地图图层对象
          // let mapTypeSelect = [
          // {
          //   'title': '卫星',
          //   'icon': ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png',
          //   'layer': window.TMAP_SATELLITE_MAP
          // },
          // {
          //   'title': '地图', //地图控件上所要显示的图层名称
          //   'icon': 'http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png', //地图控件上所要显示的图层图标（默认图标大小80x80）
          //   'layer': window.TMAP_NORMAL_MAP //地图类型对象，即MapType。
          // },
          // {
          //   'title': '卫星混合',
          //   'http': 'api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png',
          //   'layer': 'TMAP_HYBRID_MAP'
          // }, {
          //   'title': '地形',
          //   'icon': ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png',
          //   'layer': window.TMAP_TERRAIN_MAP
          // },
          // {
          //   'title': '地形混合',
          //   'icon': ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png',
          //   'layer': window.TMAP_TERRAIN_HYBRID_MAP
          // }];
          var ctrl = new T.Control.MapType([
            {
              'title': '卫星混合',
              'http': 'http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png',
              'layer': window.TMAP_HYBRID_MAP
            },
            {
              'title': '卫星',
              'icon': ' http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png',
              'layer': window.TMAP_SATELLITE_MAP
            },
            {
              'title': '地图', //地图控件上所要显示的图层名称
              'icon': 'http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png', //地图控件上所要显示的图层图标（默认图标大小80x80）
              'layer': window.TMAP_NORMAL_MAP //地图类型对象，即MapType。
            }
          ]); // 初始化地图类型选择控件
          this.map.addControl(ctrl);
          this.map.addEventListener("zoomend", (val) => {
            window.console.log(this.map.getZoom())
            if (this.map.getZoom() < 10) {
              this.setZoom()
            }
          });
          this.drawLine();
          this.point();

        }).catch()
      // 监听缩放级别(缩放后的级别)

    },
    setZoom () {

    },


    drawLine () {
      let style = {
        color: '#0ee3c4',
        weight: 4,
        opacity: 0.8,
        lineStyle: 'dashed', // 虚线
        fillColor: '#1791fc',
        fillOpacity: 0.2 // 透明度
      }
      let points = []
      mapConfig.mapBoundary.forEach(line => { // lines是边界经纬度组成的数组
        var point = new T.LngLat(line[0], line[1])
        points.push(point)
      })
      var poly = new T.Polygon(points, style)
      this.map.addOverLay(poly)
    },


    //创建点位
    point () {
      var T = window.T;
      // 点位数据
      listCamera({ pageNum: 1, pageSize: 300 }).then(res => {
        this.cemreaList = res.rows
        this.cemreaList.forEach((item) => {
          if (item.longitude !== null) {
            let itemy = { longitude: parseFloat(item.longitude), latitude: parseFloat(item.latitude), name: item.cameraName, id: item.cameraIndexCode }
            /*    let itemy = {longitude: 114.94619760, latitude: 28.60870060, cameraName: '摄像头1', id: 12312}*/
            // 创建标注对象
            const marker = new T.Marker(new T.LngLat(itemy.longitude, itemy.latitude), {
              icon: new T.Icon({
                iconUrl: require('../assets/images/map-jiankong.png'), // 引入自定义图标位置
                iconSize: new T.Point(50, 50), // 图标大小
              }),
            });
            // 向地图上添加标注
            this.map.addOverLay(marker);
            // 点位的点击事件，展示弹窗
            this.addClickHandler(itemy, marker);
          }
        });
      })

    },
    // 清除图标
    clearIcon (e) {
      console.log('显示地标', e.currentTarget.innerText); // 当前点击的图标名称
      this.map.clearOverLays();
    },
    // 点位弹窗
    addClickHandler (content, marker) {
      var T = window.T;
      const that = this;
      marker.addEventListener('click', function (e) {
        var markerInfoWin = new T.InfoWindow(); // 创建信息窗口对象
        // 弹窗模版
        const sContent = `<div class="my-map-marker">
              <div class="my-map-marker-item">名称：</div>
              <div class="my-map-marker-item-desc">${content.name}</div>
              <div class="my-map-marker-item">状态：</div>
              <div class="my-map-marker-item-desc">在线</div>
               </div>     `;
        // 相对于点偏移的位置
        markerInfoWin.setContent(sContent, { offset: new T.Point(0, -30) });
        that.map.openInfoWindow(markerInfoWin, e.lnglat); // 开启信息窗口
        that.getPlayUrl(content.id, content.name)
      });
    },
    getPlayUrl (id, name) {
      getPlayStream(id).then(res => {
        this.$emit("getPlayUrl", { url: res.msg, name: name, code: id });
      });
    }
  }
}
</script>
<style>
.map {
  width: 100%;
  height: 100%;
  position: absolute;
}

.my-map-marker {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.my-map-marker-item {
  font-size: 14px;
}

.my-map-marker-item-desc {
  font-size: 14px;
  font-weight: 600;
  color: #bfa539;
}
</style>
<style scoped>
/deep/ .tdt-infowindow-content-wrapper {
  height: 100px !important;
  width: 150px !important;
}
/deep/ .tdt-infowindow-content {
  width: 150px !important;
}
</style>
