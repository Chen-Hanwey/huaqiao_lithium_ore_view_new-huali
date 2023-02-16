<template>
  <div style="width: 100%;height: 100%;">
    <div id="chart1" :class="className" style="width: 45%;height: 130px;float: left"/>
    <div id="chart2" :class="className" style="width: 55%;height: 130px;float: right"/>
  </div>

</template>

<script>
import echarts from 'echarts'
import {statisticsDeviceStatusByOperationId, statisticsDeviceTypeByOperationId} from "@/api/bigScreen/inspectPanel";
import { parseInt } from 'lodash'

require('echarts/theme/macarons') // echarts theme

const animationDuration = 2000

export default {
  // mixins: [resize],
  props: {
    name: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'chart'
    },
    operationId: {
      type: String,
      default: '1'
    },
  },
  data() {
    return {
      chart1: null,
      chart2: null,
      chartTotal1: 0,
      onlineNum: 0
    }
  },
  mounted() {
    this.initChart();
  },
  watch: {},
  beforeDestroy() {
    if (this.chart1) {
      this.chart1.dispose()
      this.chart1 = null
    }
    if (this.chart2) {
      this.chart2.dispose()
      this.chart2 = null
    }
  },

  methods: {
    initChart() {
      let echartData1=[];
      let echartData2=[];
      if(process.env.VUE_APP_DEMO_FLAG=='Y'){
        echartData1 = [
          {
            name: '在线',
            value: '60',
          },
          {
            name: '离线',
            value: '20',
          }
        ];

        echartData2 = [
          {
            name: '球机',
            value: '20',
          },
          {
            name: '半球',
            value: '30',
          },
          {
            name: '固定枪机',
            value: '30',
          },
          {
            name: '遥控枪机',
            value: '30',
          },
        ];
        this.initChart1(echartData1);
        this.initChart2(echartData2);
      }
      else{
        statisticsDeviceStatusByOperationId(this.operationId).then(res=>{
          echartData1=res.data;
          this.initChart1(echartData1);
        })
        statisticsDeviceTypeByOperationId(this.operationId).then(res=>{
          echartData2=res.data;
          this.initChart2(echartData2);
        })
      }
    },
    initChart1(echartData1){
      this.chart1 = echarts.init(document.getElementById("chart1"))
      let color = ['#0bbbbb', '#a10f0f'];
      // let color = ['#b8f1cc', '#ef5767'];
      let total1=0;
      let onlineNum = 0;
      let offlineNum = 0;
      echartData1.forEach(item => {
        if (item.name == '在线') {
          onlineNum = Number(item.value);
        }
        if (item.name == '离线') {
          offlineNum = Number(item.value);
        }
        total1 += Number(item.value);
      })
      let angle = 0;//角度，用来做简单的动画效果的
      let value = 0;
      if (total1 != 0) {
        value = Math.round(onlineNum / total1 * 100)
      }
      let option = {
        tooltip: {
          show: true,
          confine: true,
          backgroundColor: 'rgba(20,50,125,.8)',
          axisPointer: {
            type: 'shadow' // 可选为：'line' | 'shadow'
          },
          textStyle:{
            fontSize:'10'
          }
        },
        /*title:[
          {
            text: '在线率',
            x:'center',
            top: '35%',
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: '100',
            },
          },
          {
            text: value+'%',
            x:'center',
            top: '50%',
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: '100',
            },
          },
        ],*/
        series: [
          //内环
/*          {
            name: "",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
              return {
                type: 'arc',
                shape: {
                  cx: api.getWidth() / 2,
                  cy: api.getHeight() / 2,
                  r: Math.min(api.getWidth(), api.getHeight()) / 2.3 * 0.65,
                  startAngle: (0 + -angle) * Math.PI / 180,
                  endAngle: (360 + -angle) * Math.PI / 180
                },
                style: {
                  stroke: "#0CD3DB",
                  fill: "transparent",
                  lineWidth: 0.5
                },
                silent: true
              };
            },
            data: [0]
          },*/

          {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: '65%',
            hoverAnimation: false,
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: () => '{name|在线率}\n{count|'+value+'%}',
              rich: {
                name: {
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: '100',
                },
                count: {
                  fontSize: 17,
                  color: '#00f0ff',
                  fontWeight: '600',
                  padding: [0, 0, 10, 0],
                  textVerticalAlign: 'middle'
                },
              }
            },
            emphasis: {
              label: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                labelLine: {
                  show: false,
                },
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  {
                    offset: 1,
                    color: 'rgba(50,171,241, 1)',
                  },
                  {
                    offset: 0,
                    color: 'rgba(55,70,130, 0)',
                  },
                ]),
                // borderWidth: 1,
                // shadowColor: 'rgba(55,70,130, 1)'
              },
            },
            data: [
              {
                value: value,
              },
            ],
          },
          //外环
          {
            name: '设备状态',
            type: 'pie',
            radius: ['85%', '70%'],
            silent: false,
            clockwise: true,
            startAngle: 90,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            },
            data: [
              {
                value: onlineNum,
                name: "在线",
                itemStyle: {
                  normal: {
                    //外环发光
                    borderWidth: 0.5,
                    color: '#35ccd2', // 100% 处的颜色
                  }
                }
              },
              {
                value: offlineNum,
                name: "离线",
                label: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: "#f8ae3e"
                  }
                }
              }
            ]
          },
        ]
      };
      this.chart1.setOption(option)
    },
    initChart2(echartData2){
      this.chart2=echarts.init(document.getElementById("chart2"));
      let color1 = ['#27D099', '#B458F5', '#FCD54B', '#5684F4'];
      let nameArray = []
      let total2=0
      echartData2.forEach(item=>{
        nameArray.push(item.name)
        total2+=Number(item.value)
      })
      let formatNumber = function (num) {
        let reg = /(?=(\B)(\d{3})+$)/g;
        return num.toString().replace(reg, ',');
      };
      let option2 = {
        tooltip: {
          show: true,
          confine: true,
          backgroundColor: 'rgba(20,50,125,.8)',
          axisPointer: {
            type: 'shadow' // 可选为：'line' | 'shadow'
          },
          textStyle:{
            fontSize:'10'
          }
        },
        color: color1,
        /*title: [
          {
            text: '设备数',
            left: '22.5%',
            top: '35%',
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: '100',
            },
          },
          {
            text: total2,
            left: '25%',
            top: '50%',
            textStyle: {
              color: '#fff',
              fontSize: 14,
              fontWeight: '100',
            },
          },
        ],*/
        legend: [{
          orient: 'vertical',
          data: nameArray,
          left:'right',
          top: 'center',
          align: 'auto',
          itemGap: 8,
          textStyle: {
            color: '#81b0d6',
            fontSize: 10,
          },
          //图例标记的图形高度
          itemHeight: 10,
          //图例标记的图形宽度
          itemWidth: 10,
        },],
        polar: {
          radius: ['44%', '50%'],
          center: ['50%', '50%'],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: '设备类型',
            type: 'pie',
            radius: ['85%', '70%'],
            center: ['35%', '50%'],
            data: echartData2,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              }
            },
          },
          {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: '65%',
            hoverAnimation: false,
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: () => '{name|设备数}\n{count|'+total2+'}',
              rich: {
                name: {
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: '100',
                },
                count: {
                  fontSize: 17,
                  color: '#00f0ff',
                  fontWeight: '600',
                  padding: [0, 0, 10, 0],
                  textVerticalAlign: 'middle'
                },
              }
            },
            emphasis: {
              label: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                labelLine: {
                  show: false,
                },
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  {
                    offset: 1,
                    color: 'rgba(50,171,241, 1)',
                  },
                  {
                    offset: 0,
                    color: 'rgba(55,70,130, 0)',
                  },
                ]),
                // borderWidth: 1,
                // shadowColor: 'rgba(55,70,130, 1)'
              },
            },
            data: [
              {
                value: total2,
              },
            ],
          },
        ],
      };

      this.chart2.setOption(option2)
    },
  }
}
</script>
