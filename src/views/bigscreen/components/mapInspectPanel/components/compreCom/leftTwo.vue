<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

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
    // this.$nextTick(() => {
    //   this.initChart()
    // })
  },
  watch: {
    chartData: {
      deep: true,
      handler (val) {
        this.initChart(val);
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
    initChart (datas) {

      this.chart = echarts.init(this.$el, 'macarons')

      const color = ['#6FC6DCE5', '#a65cef']
      const legend = ['2021']
      let xAxis;
      let value1;
      // const value2 = [23, 35, 37, 26, 23, 35, 37, 26,23, 35, 37, 26]

      if (datas && process.env.VUE_APP_DEMO_FLAG !== 'Y'){
        xAxis = datas.dates
        value1 = datas.moneys
      }else {
        xAxis = ['1', '2', '3', '4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
        value1 = [12, 25, 39, 33,12, 25, 39, 33,12, 25, 39, 33,12, 25, 39, 33,12, 25, 39, 33]
      }

      let option = {
        color: color,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(20,50,125,.8)',
          axisPointer: {
            type: 'shadow', // 可选为：'line' | 'shadow'
          },
        },
        grid: {
          left:25,
          right: 0,
          bottom:23,
          top: 55,
        },
        legend: {
          left: 'right',
          top: 0,
          icon: 'rect',
          textStyle: {
            color: '#81b0d6',
          },
          itemWidth: 15,
          itemHeight:5,
          itemGap: 10, //左右间隔
          show: false
        },
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#071a4f',
              width: 1,
              type: 'solid',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            interval:0,
            // formatter:function (value){
            //   let staff=value.substring(0,value.length-1);
            //   return staff+'\n月'
            // },
            textStyle: {
              color: '#fff',
              fontSize:12
            },
          },
        },
        yAxis: [{
          name:'单位: 万元',
          nameTextStyle:{
            color: 'rgba(255,255,255,0.5)',
            fontSize:10,
            padding: [0,0,-5,0]
          },
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#81b0d6',
            },
          },
          axisPointer: {
            snap: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.05)',
              type: 'dash',
            },
          },
        }],
        series: [
          {
            name: legend[0],
            type: 'line',
            barWidth: '12%',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(111,198,220,0.9)'
                }, {
                  offset: 0.8,
                  color: 'rgba(100, 170,200,.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            data: value1,
          },
          // {
          //   name: legend[1],
          //   type: 'line',
          //   areaStyle: {
          //     normal: {
          //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //         offset: 0,
          //         color: 'rgba(21, 250, 255,.9)'
          //       }, {
          //         offset: 0.8,
          //         color: 'rgba(21, 250, 255,.1)'
          //       }], false),
          //       shadowColor: 'rgba(0, 0, 0, 0.1)',
          //       shadowBlur: 10
          //     }
          //   },
          //   data: value2,
          // },

        ],
      };

      this.chart.setOption(option);

    }
  }
}
</script>
