<template>
  <div :class="className" style="height: 100%" />
</template>

<script>
import * as echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme
const animationDuration = 6000

export default {
  props: {
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
      type: Object,
      default: () => {
      }
    },
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
    })
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
    fontSize (res) {
      let docEl = document.documentElement,
        clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (!clientWidth) return;
      let fontSize = 100 * (clientWidth / 1920);
      return res * fontSize;
    },
    initChart (datasv) {
      window.console.log(datasv)
      this.chart = echarts.init(this.$el, 'macarons')
      var xData = []
      let datas = []
      let pdata = []
      if (datasv) {
        datas = datasv.ydata
        xData = datasv.xdata
        pdata = datasv.pdata
      } else {
        xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

        datas = [
          384,
          1584,
          1039,
          628,
          47,
          628,
          128,
          828,
          928,
          728,
          568,
          328]
      }

      var option = {
        legend: {
          show: true,
          textStyle: {
            color: '#fff',
            fontSize: this.fontSize(0.15)
          },
          data: [
            {
              name: '产量'

            },
            {
              name: '计划量'
            },
          ]


        },
        "tooltip": {
          "trigger": "axis",
          backgroundColor: 'rgb(88,180,241)',
          "axisPointer": {
            "type": "shadow",
            textStyle: {
              color: "#fff"
            }

          },
        },

        "grid": {
          "borderWidth": 0,
          "top": 40,
          left: 55,
          "bottom": 85,
          textStyle: {
            color: "#fff"
          }
        },
        "calculable": true,
        "xAxis": [{
          "type": "category",
          "axisLine": {
            lineStyle: {
              // X轴线颜色
              color: '#213E61'
            }
          },
          "splitLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "splitArea": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,
            rotate: 60,
            // X轴字颜色
            color: '#789EB7',
            fontSize: this.fontSize(0.14)
          },
          "data": xData,
        }],
        "yAxis": [{
          "type": "value",
          name: '(吨)',
          nameTextStyle: {
            fontSize: this.fontSize(0.14),
            color: '#789EB7',
            nameGap: 5
          },
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: '#213E61 ',
              type: 'solid'
            }
          },
          "axisLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "axisLabel": {
            "interval": 0,
            // Y轴字颜色
            color: '#789EB7',
            fontSize: this.fontSize(0.12),

          },
          "splitArea": {
            "show": false
          },

        }],
        "series": [{
          "name": "产量",
          "type": "bar",
          "barMaxWidth": 10,
          "barGap": "10%",
          "itemStyle": {
            "normal": {
              "color":
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(73,118,253,0.6)' // 100% 处的颜色
                }, {
                  offset: 1,

                  color: '#48a7e7' // 0% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          "data": datas,
        },
        {
          type: 'bar',
          "name": "计划量",
          "barMaxWidth": 10,
          "itemStyle": {
            "normal": {
              "color":
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#39F4A9' // 100% 处的颜色
                }, {
                  offset: 1,

                  color: '#48a7e7' // 0% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          data: pdata
        }

        ]
      }
      this.chart.setOption(option);
      window.addEventListener("resize", function () {
        this.chart.resize();
      });
    }
  }
}
</script>
