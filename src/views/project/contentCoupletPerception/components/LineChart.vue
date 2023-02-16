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
      default: '425px'
    },
    height: {
      type: String,
      default: '250px'
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
    initChart (datas) {
      let data = {
        times: this.getLastYearForDay(7),
        num: [0, 0, 0, 0, 0, 0, 0]
      }

      if (datas && datas.length > 0) {
        data.times.forEach((item, index) => {
          datas.forEach(jtem => {
            debugger
            if (item == jtem.alertDay) {
              data.num[index] = jtem.alertCount
            }
          })
        })

      }
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        // legend: {
        //   align: "left",
        //   right: '8%',
        //   top: '10px',
        //   textStyle: {
        //     color: '#fff',
        //     fontSize: 14
        //   },
        //   data: xdata
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: { //去掉移动的指示线
            type: 'none'
          },
        },
        grid: {
          top: '35px',
          left: '30px',
          // right: '10px',
          bottom: '20px',
          // containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          axisLine: { //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: '#48a9ee'
            },
          },
          axisLabel: { //坐标轴刻度标签的相关设置
            textStyle: {
              color: '#48a9ee',
              margin: 15,
            },
            interval: 0,
            // rotate: 30,
            formatter: function (data) {
              return data
            }
          },
          axisTick: {
            show: false,
          },
          data: data.times
        }],
        yAxis: [{
          name: this.name,
          nameTextStyle: {
            color: '#000',
            fontSize: 14,
            padding: [0, 0, 0, 50]
          },
          minInterval: 1,
          splitNumber: 3,
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              // color: 'rgba(255,255,255,0.2)'
            },
          },
          splitArea: { show: false },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            // formatter: "{value} " + this.company,
            textStyle: {
              color: '#48a9ee',

            }
          },
          axisTick: {
            show: false,
          },
        }],
        series: [{
          smooth: 0.5,
          name: this.name,
          type: 'line',
          // symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          symbolSize: 6,
          areaStyle: {
            color: '#48a9ee',
            opacity: 0.2
          },
          lineStyle: {
            normal: {
              color: "#48a9ee", // 线条颜色
            },
            // borderColor: 'rgba(0,0,0,.4)',
          },
          itemStyle: {
            color: '#48a9ee',
            // borderColor: "rgb(238,56,10)",
            borderWidth: 1
          },
          data: data.num
        }]
      });

    }
  }
}
</script>
