<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import { listFoodInspectionByEnterpriseId } from '@/api/bigScreen/bigScreen'

require('echarts/theme/macarons') // echarts theme

const animationDuration = 2000

export default {
  // mixins: [resize],
  props: {
    company: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    chartData: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart1()
    })
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.initChart1(val);
      }
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart1() {
      let echartData=[];
      this.enterpriseId = '1' //企业1
      listFoodInspectionByEnterpriseId(this.enterpriseId).then(res=>{
        echartData=res.data;
        this.initChart2(echartData);
      })
    },
    initChart2 (echartData) {
      this.chart = echarts.init(this.$el, 'macarons')
      const color = ['#1fd0ad', '#a65cef']
      let total1=0;
      let qualified = 0;
      let unqualified = 0;
      echartData.forEach(item => {
        if (item.name == '合格') {
          qualified = Number(item.value);
        }
        if (item.name == '不合格') {
          unqualified = Number(item.value);
        }
        total1 += Number(item.value);
      })
      let formatNumber = function (total1) {
        let reg = /(?=(\B)(\d{3})+$)/g;
        return total1.toString().replace(reg, ',');
      };
      let option = {
        color: color,
        legend: {
          left: 'center',
          bottom: 0,
          icon: 'rect',
          textStyle: {
            color: '#81b0d6',
            fontSize: 10
          },
          itemWidth: 15,
          itemHeight: 5,
          itemGap: 10 //左右间隔
        },
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
          {type: 'pie',
            radius: ['55%', '67%'],
            center: ['50%', '50%'],
            data: echartData,
            hoverAnimation: false,
            labelLine:{
              length:10,
              length2:10
            },
            itemStyle: {
              normal: {
                borderColor: '#364684',
                borderWidth: 2,
              },
            },
            label: {
              normal: {
                formatter: '{b}{c}',
                textStyle: {
                  fontSize: 10,
                  color: '#77b0e2',
                },
              },
            },
          },
          {
            name: '',
            type: 'pie',
            startAngle: 90,
            radius: '50%',
            hoverAnimation: false,
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: () => '{name|检测总数}\n{count|'+total1+'}',
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
              },
            },
            data: [
              {
                value: total1,
              },
            ],
          },
        ],
      };


      this.chart.setOption(option);

    },
  }
}
</script>
