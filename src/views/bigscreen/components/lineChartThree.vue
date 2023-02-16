<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import { getQualityScoreTrend } from '@/api/bigScreen/bigScreen'

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
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
  },
  watch: {
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(datas) {
      this.chart = echarts.init(this.$el, 'macarons')
      const color = ['#17e85d', 'rgb(21, 250, 255)']
      const legend = ['2021', '2022']
      const xAxis = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      // const value1 = [12, 25, 39, 33,12, 25, 39, 33,12, 25, 39, 33]
      // const value2 = [23, 35, 37, 26, 23, 35, 37, 26,23, 35, 37, 26]
      let data1 = datas.trendBefore;
      let data2 = datas.trendAfter;
      let trendBefore = [];
      let trendAfter = [];
      if (data1 != null) {
        for (let i = 1; i <= 12; i++) {
          let m = '';
          if(i<10){
            m = legend[0] + '-' + '0' + i;
          } else {
            m = legend[0] + '-' + i;
          }
          let flag = false;
          for (let k = 0; k < data1.length; k++) {
            if(m == data1[k].score_date){
              trendBefore.push(Number(data1[k].score).toFixed(2));
              flag = true ;
              break;
            }
          }
          if(!flag){
            trendBefore.push(0);
          }
        }
      }
      if (data2 != null) {
        for (let i = 1; i <= 12; i++) {
          let m = '';
          if(i<10){
            m = legend[1] + '-' + '0' + i;
          } else {
            m = legend[1] + '-' + i;
          }
          let flag = false;
          for (let k = 0; k < data2.length; k++) {
            if(m == data2[k].score_date){
              trendAfter.push(Number(data2[k].score).toFixed(2));
              flag = true ;
              break;
            }
          }
          if(!flag){
            trendAfter.push(0);
          }
        }
      }
      let option = {
        color: color,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(20,50,125,.8)',
          axisPointer: {
            type: 'shadow' // 可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: 25,
          right: 0,
          bottom: 30,
          top: 40
        },
        legend: {
          left: 'right',
          top: 0,
          icon: 'rect',
          textStyle: {
            color: '#81b0d6'
          },
          itemWidth: 15,
          itemHeight: 5,
          itemGap: 10 //左右间隔
        },
        xAxis: {
          type: 'category',
          data: xAxis,
          axisLine: {
            show: true,
            lineStyle: {
              color: '#071a4f',
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: '#fff',
              fontSize: 12
            }
          }
        },
        yAxis: [{
          name: '评分/月',
          nameTextStyle: {
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12
          },
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#81b0d6'
            }
          },
          axisPointer: {
            snap: true
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.05)',
              type: 'dash'
            }
          }
        }],
        series: [
          {
            name: legend[0],
            type: 'line',
            barWidth: '12%',
            lineStyle: {
              type: 'dashed'
            },

            data: trendBefore
          },
          {
            name: legend[1],
            type: 'line',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(21, 250, 255,.9)'
                }, {
                  offset: 0.8,
                  color: 'rgba(21, 250, 255,.1)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            data: trendAfter
          }

        ]
      }

      this.chart.setOption(option)

    },
    /**
     * 评分趋势
     */
    getQualityScoreTrend() {
      let that = this;
      getQualityScoreTrend().then(res => {
        that.initChart(res.data)
      })
    }
  }
}
</script>
